// Learn page - no dictionary data needed for grammar lessons
import './utils';
import { initLearnUI } from './learn-ui';

// Initialize Learn UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initLearnUI();
    });
}

