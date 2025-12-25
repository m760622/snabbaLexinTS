/**
 * Memory Game
 * Converted from inline JS
 */


        // Apply theme from localStorage (Default: Dark)
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }
    