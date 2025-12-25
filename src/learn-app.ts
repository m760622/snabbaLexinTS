import './loader';
import './utils';
import { initLearnUI } from './learn-ui';

// Initialize Learn UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initLearnUI();
    });
}
