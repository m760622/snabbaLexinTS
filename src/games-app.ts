// Games menu page - no dictionary data needed for listing games
import './utils';
import { initGamesUI } from './games-ui';

// Initialize Games UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initGamesUI();
    });
}

