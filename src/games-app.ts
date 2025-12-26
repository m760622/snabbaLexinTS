// Games menu page - no dictionary data needed for listing games
import './utils';
import { initGamesUI } from './games-ui';
import { LanguageManager } from './i18n';

// Initialize Games UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize language first
        LanguageManager.init();
        initGamesUI();
    });
}

