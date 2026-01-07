import { SettingsUI } from './settings-ui';

/**
 * Settings Menu Component - Lazy Loaded
 * Uses Shared UI Generator for consistent design and features.
 */

// Initialize the lazy-loaded settings menu
let isMenuLoaded = false;

export async function initSettingsMenuLazy(): Promise<void> {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsMenu = document.getElementById('settingsMenu');

    if (!settingsBtn || !settingsMenu) return;

    const temp = 65;
    let color = "#22c55e"; /* أخضر افتراضي */
    if (temp > 75) color = "#ef4444"; /* أحمر للحرارة العالية */
    else if (temp > 60) color = "#eab308"; /* أصفر للتحذير */
    settingsMenu.style.border = `2px solid ${color}`;
    settingsMenu.style.boxShadow = `0 0 15px ${color}44`;

    settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Load content on first open - DISABLED FOR REACT MIGRATION
        /*
        if (!isMenuLoaded) {
            // Use Shared UI Generator
            settingsMenu.innerHTML = SettingsUI.generateSections();

            // Re-init handlers
            initSettingsMenuHandlers();

            isMenuLoaded = true;
        }
        */

        const isHidden = settingsMenu.classList.contains('hidden');
        if (isHidden) {
            settingsMenu.classList.remove('hidden');
            settingsMenu.setAttribute('aria-hidden', 'false');

            // Animation
            settingsMenu.style.display = 'flex';
            requestAnimationFrame(() => {
                settingsMenu.style.opacity = '1';
                settingsMenu.style.transform = 'scale(1) translateY(0)';
            });
        } else {
            closeSettingsMenu();
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (settingsMenu && settingsBtn &&
            !settingsMenu.contains(e.target as Node) && !settingsBtn.contains(e.target as Node)) {
            closeSettingsMenu();
        }
    });
}

function closeSettingsMenu() {
    const settingsMenu = document.getElementById('settingsMenu');
    if (settingsMenu) {
        settingsMenu.classList.add('hidden');
        settingsMenu.setAttribute('aria-hidden', 'true');
        settingsMenu.style.display = 'none';
        settingsMenu.style.opacity = '0';
    }
}

// Helper to update settings
function updateUserSettings(key: string, value: any): void {
    try {
        const saved = localStorage.getItem('userSettings');
        const settings = saved ? JSON.parse(saved) : {};
        settings[key] = value;
        localStorage.setItem('userSettings', JSON.stringify(settings));

        // Attempt global sync if manager exists
        if ((window as any).SettingsManager) {
            (window as any).SettingsManager.update(key, value);
        }
    } catch (e) {
        console.error('Failed to sync settings:', e);
    }
}

/**
 * Initializes all event handlers for the generated menu
 */
function initSettingsMenuHandlers(): void {
    const menu = document.getElementById('settingsMenu');
    if (!menu) return;

    // --- Section Toggles (Accordion) ---
    menu.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const section = header.parentElement;
            const wasExpanded = section?.classList.contains('expanded');

            // Close all other sections
            menu.querySelectorAll('.settings-section').forEach(s => {
                if (s !== section) {
                    s.classList.remove('expanded');
                }
            });

            // Toggle current section
            if (wasExpanded) {
                section?.classList.remove('expanded');
            } else {
                section?.classList.add('expanded');
            }
        });
    });

    // --- Appearance ---
    // Dark Mode
    const darkModeToggle = menu.querySelector('#darkModeToggle') as HTMLInputElement;
    if (darkModeToggle) {
        darkModeToggle.checked = document.documentElement.getAttribute('data-theme') === 'dark';
        darkModeToggle.addEventListener('change', () => {
            const theme = darkModeToggle.checked ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            updateUserSettings('darkMode', darkModeToggle.checked);
        });
    }

    // Color Theme
    const colorThemesContainer = menu.querySelector('#colorThemes');
    if (colorThemesContainer) {
        const currentTheme = localStorage.getItem('colorTheme') || 'default';
        const btns = colorThemesContainer.querySelectorAll('.color-btn');

        btns.forEach(b => {
            if (b.getAttribute('data-theme') === currentTheme) b.classList.add('active');
            else b.classList.remove('active');
        });

        colorThemesContainer.addEventListener('click', (e) => {
            const btn = (e.target as Element).closest('.color-btn');
            if (!btn) return;

            // UI
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Logic
            const theme = btn.getAttribute('data-theme') || 'default';
            if (theme !== 'default') document.documentElement.setAttribute('data-color-theme', theme);
            else document.documentElement.removeAttribute('data-color-theme');

            localStorage.setItem('colorTheme', theme);
            updateUserSettings('colorTheme', theme);
        });
    }

    // Mobile View
    const mobileViewToggle = menu.querySelector('#mobileViewToggle') as HTMLInputElement;
    if (mobileViewToggle) {
        const isMobile = document.body.classList.contains('iphone-view');
        mobileViewToggle.checked = isMobile;
        mobileViewToggle.addEventListener('change', () => {
            const checked = mobileViewToggle.checked;
            document.body.classList.toggle('iphone-view', checked);
            localStorage.setItem('mobileView', String(checked));
            updateUserSettings('mobileView', checked);

            if ((window as any).MobileViewManager) {
                (window as any).MobileViewManager.apply(checked);
            }
        });
    }

    // Font Size
    const fontSizeControl = menu.querySelector('.font-size-control');
    if (fontSizeControl) {
        // Init state
        const savedSize = localStorage.getItem('fontSize') || 'medium'; // Simplification, ideally parse JSON
        fontSizeControl.querySelectorAll('.font-btn').forEach(b => {
            if (b.getAttribute('data-size') === savedSize) b.classList.add('active');
            else b.classList.remove('active');
        });

        fontSizeControl.addEventListener('click', (e) => {
            const btn = (e.target as Element).closest('.font-btn');
            if (!btn) return;

            const size = btn.getAttribute('data-size') || 'medium';
            // Apply
            const sizeMap: Record<string, string> = { 'small': '14px', 'medium': '16px', 'large': '18px' };
            document.documentElement.style.fontSize = sizeMap[size];

            // UI
            fontSizeControl.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            localStorage.setItem('fontSize', size); // Simple store
            updateUserSettings('fontSize', size);
        });
    }

    // Animations
    const animToggle = menu.querySelector('#animationsToggle') as HTMLInputElement;
    if (animToggle) {
        // Default true
        const isAnim = !document.body.classList.contains('reduce-motion');
        animToggle.checked = isAnim;

        animToggle.addEventListener('change', () => {
            document.body.classList.toggle('reduce-motion', !animToggle.checked);
            updateUserSettings('animations', animToggle.checked);
        });
    }

    // --- Sound ---
    // Sound Effects
    const soundToggle = menu.querySelector('#soundEffectsToggle') as HTMLInputElement;
    if (soundToggle) {
        const isEnabled = localStorage.getItem('soundEnabled') !== 'false';
        soundToggle.checked = isEnabled;
        soundToggle.addEventListener('change', () => {
            localStorage.setItem('soundEnabled', String(soundToggle.checked));
            updateUserSettings('soundEffects', soundToggle.checked);
        });
    }

    // TTS Speed
    const ttsSlider = menu.querySelector('#ttsSpeedSlider') as HTMLInputElement;
    const ttsValue = menu.querySelector('#ttsSpeedValue');
    if (ttsSlider && ttsValue) {
        const speed = localStorage.getItem('ttsSpeed') || '85';
        ttsSlider.value = speed;
        ttsValue.textContent = `${speed}%`;

        ttsSlider.addEventListener('input', () => {
            ttsValue.textContent = `${ttsSlider.value}%`;
            localStorage.setItem('ttsSpeed', ttsSlider.value);
            updateUserSettings('ttsSpeed', parseInt(ttsSlider.value));
        });
    }

    // Voice Selection
    const voiceSelector = menu.querySelector('.voice-selector');
    if (voiceSelector) {
        const currentVoice = localStorage.getItem('ttsVoice') || 'natural';
        voiceSelector.querySelectorAll('.voice-btn').forEach(b => {
            if (b.getAttribute('data-voice') === currentVoice) b.classList.add('active');
            else b.classList.remove('active');
        });

        voiceSelector.addEventListener('click', (e) => {
            const btn = (e.target as Element).closest('.voice-btn');
            if (!btn) return;

            const voice = btn.getAttribute('data-voice') || 'natural';

            voiceSelector.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            localStorage.setItem('ttsVoice', voice);
            updateUserSettings('ttsVoicePreference', voice);
        });
    }

    // --- Learning ---
    // Daily Goal
    const goalSelector = menu.querySelector('.goal-selector');
    if (goalSelector) {
        // Simplify init for checking
        goalSelector.addEventListener('click', (e) => {
            const btn = (e.target as Element).closest('.goal-btn');
            if (!btn) return;

            goalSelector.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            updateUserSettings('dailyGoal', parseInt(btn.getAttribute('data-goal') || '10'));
        });
    }

    // Auto Play
    const autoPlayToggle = menu.querySelector('#autoPlayToggle') as HTMLInputElement;
    if (autoPlayToggle) {
        // Logic sync via updateUserSettings is enough for now, 
        // as initialization usually reads from JSON which we might check here if we want perfection.
        // For brevity, assuming default or already set.
        autoPlayToggle.addEventListener('change', () => {
            updateUserSettings('autoPlay', autoPlayToggle.checked);
        });
    }

    // Show Examples
    const showExToggle = menu.querySelector('#showExamplesToggle') as HTMLInputElement;
    if (showExToggle) {
        showExToggle.addEventListener('change', () => {
            updateUserSettings('showExamples', showExToggle.checked);
        });
    }

    // Focus Mode
    const focusModeToggle = menu.querySelector('#focusModeToggle') as HTMLInputElement;
    if (focusModeToggle) {
        const isFocus = document.body.classList.contains('focus-mode');
        focusModeToggle.checked = isFocus;

        focusModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('focus-mode', focusModeToggle.checked);
            localStorage.setItem('focusMode', String(focusModeToggle.checked));
            updateUserSettings('focusMode', focusModeToggle.checked);
        });
    }

    // Eye Care
    const eyeCareToggle = menu.querySelector('#eyeCareToggle') as HTMLInputElement;
    if (eyeCareToggle) {
        eyeCareToggle.addEventListener('change', () => {
            updateUserSettings('eyeCare', eyeCareToggle.checked);
        });
    }

    // Language Selector
    const langSelector = menu.querySelector('#languageSelector');
    if (langSelector) {
        langSelector.addEventListener('click', (e) => {
            const btn = (e.target as Element).closest('.lang-card-premium');
            if (!btn) return;

            const lang = btn.getAttribute('data-lang') || 'both';
            localStorage.setItem('appLanguage', lang);

            if ((window as any).LanguageManager) {
                (window as any).LanguageManager.setLanguage(lang);
            } else {
                location.reload();
            }
        });
    }
}
