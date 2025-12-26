import './utils';
import { initProfileUI } from './profile-ui';
import { LanguageManager } from './i18n';

// Initialize Profile UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        // Initialize language first
        LanguageManager.init();
        initProfileUI();
    });
}
