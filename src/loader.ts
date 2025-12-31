import { AppConfig } from './config';
import { DictionaryDB } from './db';

/**
 * SnabbaLexin Loader (Cleaned)
 * Checks for data cache on index/games pages.
 * If missing, redirects to welcome.html for unified loading experience.
 */
class LoaderClass {
    async checkCacheAndLoad(): Promise<void> {
        try {
            console.log('[Loader] Initializing DB...');
            await DictionaryDB.init();

            // Use localStorage as single source of truth for version (matches welcome.ts)
            const storedVersion = localStorage.getItem('snabbaLexin_version');
            const hasFlag = localStorage.getItem('snabbaLexin_dataReady') === 'true';
            const hasCached = await DictionaryDB.hasCachedData();

            // Check validity - all three conditions must be true
            const isReturningUser = hasCached && storedVersion === AppConfig.DATA_VERSION && hasFlag;

            if (isReturningUser) {
                console.log('[Loader] Data ready - loading from cache...');
                const data = await DictionaryDB.getAllWords();
                (window as any).dictionaryData = data;
                window.dispatchEvent(new Event('dictionaryLoaded'));
                return;
            } else {
                console.log('[Loader] Data missing or outdated - Redirecting to Welcome...');
                console.log('[Loader] Debug: hasCached=', hasCached, 'storedVersion=', storedVersion, 'hasFlag=', hasFlag);
                const redirectUrl = encodeURIComponent(window.location.pathname + window.location.search);
                window.location.replace(`welcome.html?redirect=${redirectUrl}`);
            }
        } catch (e) {
            console.warn('[Loader] Error checking cache:', e);
            window.location.replace('welcome.html');
        }
    }
}

export const Loader = new LoaderClass();

// Auto-run if not imported (but usually it is imported by app.ts)
// In games, it might be imported via script module.
if (document.querySelector('script[src*="loader.ts"]')) {
    // It's being used as a standalone script
    Loader.checkCacheAndLoad();
}
