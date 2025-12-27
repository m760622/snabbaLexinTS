import { AppConfig } from './config';
import { DictionaryDB } from './db';
import { TextSizeManager, showToast } from './utils';

/**
 * SnabbaLexin Premium Data Loader
 */
class LoaderClass {

    private startTime: number = Date.now();
    private tipInterval: any = null;

    async checkCacheAndLoad(): Promise<void> {
        // Optimized: Synchronous check for returning users (Instant Skip)
        const hasDataReady = localStorage.getItem('snabbaLexin_dataReady') === 'true';
        const storedVersion = localStorage.getItem('snabbaLexin_version');

        if (hasDataReady && storedVersion === AppConfig.DATA_VERSION) {
            console.log('[Loader] Fast boot - hiding splash immediately');
            const splash = document.getElementById('splashScreen');
            if (splash) splash.style.display = 'none';
        }

        try {
            console.log('[Loader] Initializing DB...');
            await DictionaryDB.init();
            const cachedVersion = await DictionaryDB.getDataVersion();
            const hasCached = await DictionaryDB.hasCachedData();

            // Check if this is a returning user with valid cache
            const isReturningUser = hasCached && cachedVersion === AppConfig.DATA_VERSION;

            if (isReturningUser) {
                console.log('[Loader] Returning user - skipping splash, loading from cache...');
                // Ensure splash is hidden (if not already by fast boot)
                const splash = document.getElementById('splashScreen');
                if (splash) splash.style.display = 'none';

                const data = await DictionaryDB.getAllWords();
                (window as any).dictionaryData = data;

                // Dispatch event immediately
                window.dispatchEvent(new Event('dictionaryLoaded'));
                return;
            }
        } catch (e) {
            console.warn('[Loader] IndexedDB cache check failed:', e);
        }

        // First-time user or cache miss - show splash and fetch
        // Only show if we haven't already verified data availability
        const splash = document.getElementById('splashScreen');
        // Only re-show if we definitely don't have data
        if (splash && !hasDataReady) {
            splash.style.display = 'flex';
        } else if (hasDataReady && storedVersion === AppConfig.DATA_VERSION) {
            // If we thought we had data but fell through to here, something is wrong with DB
            // But for UX, let's try to proceed if we can, or just silent fail
            // However, to be safe, if we are here it means `isReturningUser` was false/failed
            // So we SHOULD show splash to fetch data. 
            // BUT, back button navigation might trigger this if DB is busy.
            splash!.style.display = 'flex'; // Force show if we really need to fetch
        }

        this.startSplashUI();
        await this.fetchData();
    }

    private startSplashUI(): void {
        this.startTime = Date.now();
        console.log('[Loader] Splash UI started');
        this.updateProgress(10, 'Ansluter... / جاري الاتصال...');

        const tips = AppConfig.LOADING_TIPS;
        const tipEl = document.getElementById('splashTip') as HTMLElement | null;
        if (tipEl) {
            tipEl.textContent = tips[0];
            if (this.tipInterval) clearInterval(this.tipInterval);
            this.tipInterval = setInterval(() => this.rotateTip(), AppConfig.SPLASH.TIP_ROTATION_INTERVAL);
        }
    }

    private updateProgress(percent: number, status?: string): void {
        const progressBar = document.getElementById('splashProgressBar') as HTMLElement | null;
        const percentText = document.getElementById('splashPercent') as HTMLElement | null;
        const statusText = document.getElementById('splashStatus') as HTMLElement | null;

        if (progressBar) progressBar.style.width = `${percent}%`;
        if (percentText) percentText.textContent = `${Math.round(percent)}%`;
        if (statusText && status) statusText.textContent = status;
    }

    private rotateTip(): void {
        const tips = AppConfig.LOADING_TIPS;
        const tipEl = document.getElementById('splashTip') as HTMLElement | null;
        if (tipEl) {
            tipEl.style.opacity = '0';
            setTimeout(() => {
                const currentIndex = Math.floor(Math.random() * tips.length);
                tipEl.textContent = tips[currentIndex];
                TextSizeManager.apply(tipEl, tips[currentIndex]);
                tipEl.style.opacity = '1';
            }, 300);
        }
    }

    async fetchData(): Promise<void> {
        const isGamesDir = window.location.pathname.includes('/games/');
        const DATA_URL = isGamesDir ? AppConfig.DATA_PATH.games : AppConfig.DATA_PATH.root;

        try {
            this.updateProgress(20, 'Laddar ordbok... / تحميل القاموس...');

            console.log(`[Loader] Fetching data from: ${DATA_URL}`);
            const response = await fetch(DATA_URL);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const reader = response.body!.getReader();
            const chunks = [];
            let loaded = 0;
            const total = parseInt(response.headers.get('content-length') || '10140024', 10);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                chunks.push(value);
                loaded += value.length;
                const percent = 20 + (loaded / total) * 60;
                this.updateProgress(percent, 'Laddar data... / تحميل البيانات...');
            }

            this.updateProgress(85, 'Bearbetar... / معالجة البيانات...');
            const allChunks = new Uint8Array(loaded);
            let position = 0;
            for (const chunk of chunks) {
                allChunks.set(chunk, position);
                position += chunk.length;
            }

            const data = JSON.parse(new TextDecoder().decode(allChunks));
            (window as any).dictionaryData = data;

            this.updateProgress(95, 'Sparar i cache... / جاري الحفظ...');
            try {
                await DictionaryDB.saveWords(data);
                await DictionaryDB.setDataVersion(AppConfig.DATA_VERSION);
            } catch (e) {
                console.warn('[Loader] Cache failed', e);
            }

            this.finishLoading();
        } catch (e) {
            this.handleError(e);
        }
    }

    private finishLoading(): void {
        this.updateProgress(100, 'Klart! / جاهز!');
        if (this.tipInterval) clearInterval(this.tipInterval);

        const data = (window as any).dictionaryData;
        const wordCountEl = document.getElementById('splashWordCount');
        if (wordCountEl && data) {
            wordCountEl.textContent = data.length.toLocaleString();
        }

        // Set flag for fast boot next time
        localStorage.setItem('snabbaLexin_dataReady', 'true');
        localStorage.setItem('snabbaLexin_version', AppConfig.DATA_VERSION);

        const elapsed = Date.now() - this.startTime;
        const splash = document.getElementById('splashScreen');
        const delay = splash ? Math.max(500, AppConfig.SPLASH.MIN_DISPLAY_TIME - elapsed) : 0;

        setTimeout(() => {
            if (splash) {
                splash.classList.add('hidden');
                setTimeout(() => splash.remove(), 600);
            }
            window.dispatchEvent(new Event('dictionaryLoaded'));
        }, delay);
    }

    private handleError(e: any): void {
        console.error('[Loader] Fatal Error:', e);
        if (this.tipInterval) clearInterval(this.tipInterval);
        this.updateProgress(0, 'Fel! / خطأ!');

        const errorMessage = e instanceof Error ? e.message : String(e);
        // Show specific error reason as requested
        showToast(`Fel vid laddning: ${errorMessage} / خطأ في التحميل: ${errorMessage} `, { type: 'error', duration: 0 }); // Duration 0 for sticky until clicked likely, or long duration
    }
}

export const Loader = new LoaderClass();

// Start logic if in browser
if (typeof window !== 'undefined') {
    Loader.checkCacheAndLoad();
}
