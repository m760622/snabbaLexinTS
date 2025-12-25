import './utils';
import { initChangelogUI } from './changelog-ui';

// Initialize Changelog UI
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        initChangelogUI();
    });
}
