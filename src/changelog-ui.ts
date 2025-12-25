/**
 * UI Logic for the Changelog section
 */
export function initChangelogUI() {
    console.log('[ChangelogUI] Initializing...');
    
    // Theme is auto-inited by ThemeManager in utils

    // Export toggleMobileView to window
    (window as any).toggleMobileView = () => (window as any).MobileViewManager?.toggle();
}

