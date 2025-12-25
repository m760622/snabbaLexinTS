import './loader';
import './utils';
import { initGamesUI } from './games-ui';

// Initialize Games UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initGamesUI();
    });
}
