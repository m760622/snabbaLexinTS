import { initProfileUI } from './profile-ui';

// Initialize Profile UI
document.addEventListener('DOMContentLoaded', () => {
    console.log('[ProfileApp] DOMContentLoaded');
    initProfileUI();
});

// Also listen for load event as fallback
window.addEventListener('load', () => {
    console.log('[ProfileApp] Window loaded');
});
