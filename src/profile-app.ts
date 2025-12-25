import './utils';
import { initProfileUI } from './profile-ui';

// Initialize Profile UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initProfileUI();
    });
}
