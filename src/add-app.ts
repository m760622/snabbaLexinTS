import './utils';
import { initAddUI } from './add-ui';

// Initialize Add UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initAddUI();
    });
}
