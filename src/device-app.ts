import './utils';
import { initDeviceUI } from './device-ui';

// Initialize Device UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initDeviceUI();
    });
}
