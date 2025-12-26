// Learn page - no dictionary data needed for grammar lessons
import './utils';
import { initLearnUI } from './learn-ui';
import { LanguageManager } from './i18n';

// Initialize Learn UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize language first
        LanguageManager.init();
        initLearnUI();
    });
}

