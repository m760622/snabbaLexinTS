
import { AppConfig } from './config';
import { DictionaryDB } from './db';

/**
 * Welcome Screen Logic
 * Handles initial data fetching and caching
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

            // Fetch Data
            await this.fetchData();


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

    private async fetchData(): Promise<void> {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', AppConfig.DATA_PATH.root, true);

            xhr.onprogress = (event) => {
                if (event.lengthComputable) {
                    let percent = (event.loaded / event.total) * 100;
                    // Clamp to 90% until processing is done
                    percent = Math.min(90, percent);
                    this.updateProgress(percent, 'Laddar data... / جاري التحميل...');
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    this.updateProgress(90, 'Bearbetar... / جاري المعالجة...');
                    try {
                        const data = JSON.parse(xhr.responseText);
                        await this.processData(data);
                        resolve();
                    } catch (e) {
                        console.error('[Welcome] JSON Parse error', e);
                        this.updateProgress(100, 'Fel vid data / خطأ في البيانات');
                        reject(e);
                    }
                } else {
                    reject(new Error(`HTTP ${xhr.status}`));
                }
            };

            xhr.onerror = () => reject(new Error('Network Error'));
            xhr.send();
        });
    }

    private async processData(data: any[]): Promise<void> {
        try {
            await DictionaryDB.saveWords(data, (p) => {
                this.updateProgress(90 + (p * 0.1), 'Sparar data... / جاري الحفظ...');
            });
            await DictionaryDB.setDataVersion(AppConfig.DATA_VERSION);
            localStorage.setItem('snabbaLexin_dataReady', 'true');
            localStorage.setItem('snabbaLexin_version', AppConfig.DATA_VERSION);

            this.updateProgress(100, 'Klar! / تم!');
            setTimeout(() => this.redirectToApp(), 500);
        } catch (error) {
            console.error('[Welcome] Save failed:', error);
            this.updateProgress(100, 'Kunde inte spara / تعذر الحفظ');
            throw error;
        }
    }
}

// Start
new WelcomeScreen();
