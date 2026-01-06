import { AppConfig } from './config';
import { DictionaryDB } from './db';
import DBWorker from './workers/init-db.worker?worker';

/**
 * Welcome Screen Logic
 * Handles initial data fetching and caching using Web Worker
 */
class WelcomeScreen {
    private tipInterval: any = null;

    constructor() {
        this.init();
    }

    async init() {
        // Start UI animations
        this.startSplashUI();

        // Safety Timeout: 15 seconds to force-hide/redirect
        setTimeout(() => {
            console.warn('[Welcome] Timeout reached (15s). Forcing redirect...');
            // We force flags to true to attempt to avoid a redirect loop, 
            // though without data the app might be empty.
            localStorage.setItem('snabbaLexin_dataReady', 'true');
            localStorage.setItem('snabbaLexin_version', AppConfig.DATA_VERSION);
            this.redirectToApp();
        }, 15000);

        try {
            console.log('[Welcome] Initializing DB...');

            await DictionaryDB.init();

            // Check if we already have data (should rare here if redirected, but good safety)
            const hasDataReady = localStorage.getItem('snabbaLexin_dataReady') === 'true';
            const storedVersion = localStorage.getItem('snabbaLexin_version');

            if (hasDataReady && storedVersion === AppConfig.DATA_VERSION) {
                const hasCached = await DictionaryDB.hasCachedData();
                if (hasCached) {
                    console.log('[Welcome] Data valid, redirecting to app...');
                    this.redirectToApp();
                    return;
                }
            }

            // Fetch Data via Worker
            await this.startWorker();


        } catch (e) {
            console.error('[Welcome] Init failed:', e);
            this.updateProgress(0, 'Fel vid start / خطأ في البدء');
        }
    }

    private redirectToApp() {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');

        if (redirect && (redirect.startsWith('/') || redirect.startsWith('http'))) {
            // Decode potential double encoding safety
            window.location.replace(decodeURIComponent(redirect));
        } else {
            window.location.replace('index.html');
        }
    }

    private startSplashUI(): void {
        console.log('[Welcome] UI started');
        this.updateProgress(10, 'Ansluter... / جاري الاتصال...');

        const tips = AppConfig.LOADING_TIPS;
        const tipEl = document.getElementById('splashTip');
        if (tipEl) {
            tipEl.textContent = tips[0];
            if (this.tipInterval) clearInterval(this.tipInterval);
            this.tipInterval = setInterval(() => {
                tipEl.style.opacity = '0';
                setTimeout(() => {
                    const currentIndex = Math.floor(Math.random() * tips.length);
                    tipEl.textContent = tips[currentIndex];
                    tipEl.style.opacity = '1';
                }, 500);
            }, AppConfig.SPLASH.TIP_ROTATION_INTERVAL);
        }
    }

    private updateProgress(percent: number, status?: string): void {
        const progressBar = document.getElementById('splashProgressBar');
        const percentText = document.getElementById('splashPercent');
        const statusText = document.getElementById('splashStatus');

        if (progressBar) progressBar.style.width = `${percent}%`;
        if (percentText) percentText.textContent = `${Math.round(percent)}%`;
        if (statusText && status) statusText.textContent = status;
    }

    private async startWorker(): Promise<void> {
        return new Promise((resolve, reject) => {
            const worker = new DBWorker();
            
            worker.onmessage = (e) => {
                const { type, value, status, error } = e.data;
                
                if (type === 'progress') {
                    this.updateProgress(value, status);
                } else if (type === 'complete') {
                    // Success logic
                    localStorage.setItem('snabbaLexin_dataReady', 'true');
                    localStorage.setItem('snabbaLexin_version', AppConfig.DATA_VERSION);
                    this.updateProgress(100, 'Klar! / تم!');
                    setTimeout(() => this.redirectToApp(), 500);
                    worker.terminate();
                    resolve();
                } else if (type === 'error') {
                     console.error('[Welcome] Worker error:', error);
                     this.updateProgress(100, 'Fel vid data / خطأ في البيانات');
                     worker.terminate();
                     reject(new Error(error));
                }
            };
            
            worker.postMessage({ type: 'init', url: AppConfig.DATA_PATH.root });
        });
    }
}

// Start
new WelcomeScreen();