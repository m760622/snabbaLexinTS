/**
 * ============================================================
 * PREMIUM SETTINGS PAGE - صفحة الإعدادات المتميزة
 * Version: 1.0
 * ============================================================
 */

import { ToastManager } from './toast-manager';
import { LanguageManager, t, Language } from './i18n';

// ============================================================
// TYPES
// ============================================================

interface UserSettings {
    darkMode: boolean;
    colorTheme: string;
    fontSize: string;
    animations: boolean;
    soundEffects: boolean;
    ttsSpeed: number;
    reminderEnabled: boolean;
    reminderTime: string;
    dailyGoal: number;
    autoPlay: boolean;
    showExamples: boolean;
    focusMode: boolean;
    eyeCare: boolean;
    avatar: string;
    ttsVoicePreference: 'natural' | 'male' | 'female';
}

interface UserProgress {
    xp: number;
    level: number;
    streak: number;
    gamesPlayed: number;
    totalScore: number;
    wordsLearned: number;
}

// ============================================================
// SETTINGS MANAGER
// ============================================================

const SettingsManager: {
    defaults: UserSettings;
    updateCompletionProgress: () => void;
    get(): UserSettings;
    save(settings: UserSettings): void;
    update(key: keyof UserSettings, value: any): void;
} = {
    defaults: {
        darkMode: true,
        colorTheme: 'default',
        fontSize: 'medium',
        animations: true,
        soundEffects: true,
        ttsSpeed: 85,
        reminderEnabled: false,
        reminderTime: '18:00',
        dailyGoal: 10,
        autoPlay: false,
        showExamples: true,
        focusMode: false,
        eyeCare: false,
        avatar: '👤',
        ttsVoicePreference: 'natural'
    } as UserSettings,

    updateCompletionProgress: () => { },

    get(): UserSettings {
        const saved = localStorage.getItem('userSettings');
        return saved ? { ...this.defaults, ...JSON.parse(saved) } : { ...this.defaults };
    },

    save(settings: UserSettings): void {
        localStorage.setItem('userSettings', JSON.stringify(settings));
    },

    update(key: keyof UserSettings, value: any): void {
        const settings = this.get();
        (settings as any)[key] = value;
        this.save(settings);
        this.updateCompletionProgress();
    }
};

// ============================================================
// PROGRESS MANAGER
// ============================================================

const SettingsProgressManager = {
    get(): UserProgress {
        const saved = localStorage.getItem('userProgress');
        return saved ? JSON.parse(saved) : {
            xp: 0,
            level: 1,
            streak: 0,
            gamesPlayed: 0,
            totalScore: 0,
            wordsLearned: 0
        };
    },

    getXPForLevel(level: number): number {
        return Math.floor(100 * Math.pow(1.5, level - 1));
    }
};

// ============================================================
// UI CONTROLLER
// ============================================================

const UIController = {
    init(): void {
        this.loadSettings();
        this.loadProgress();
        this.setupEventListeners();
        this.setupRecommendations();
        this.calculateStorageUsage();
        this.populateAvatarGrid();
        SettingsManager.updateCompletionProgress = () => this.updateCompletionProgress();
    },

    loadSettings(): void {
        const settings = SettingsManager.get();

        // Dark Mode
        const darkModeToggle = document.getElementById('darkModeToggle') as HTMLInputElement;
        if (darkModeToggle) {
            darkModeToggle.checked = settings.darkMode;
            document.body.classList.toggle('dark-mode', settings.darkMode);
        }

        // Color Theme
        const colorBtns = document.querySelectorAll('.color-btn');
        colorBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-theme') === settings.colorTheme);
        });

        // Font Size
        const fontBtns = document.querySelectorAll('.font-btn');
        fontBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-size') === settings.fontSize);
        });

        // Animations
        const animationsToggle = document.getElementById('animationsToggle') as HTMLInputElement;
        if (animationsToggle) animationsToggle.checked = settings.animations;

        // Sound Effects
        const soundEffectsToggle = document.getElementById('soundEffectsToggle') as HTMLInputElement;
        if (soundEffectsToggle) soundEffectsToggle.checked = settings.soundEffects;

        // TTS Speed
        const ttsSlider = document.getElementById('ttsSpeedSlider') as HTMLInputElement;
        const ttsValue = document.getElementById('ttsSpeedValue');
        if (ttsSlider) {
            ttsSlider.value = String(settings.ttsSpeed);
            if (ttsValue) ttsValue.textContent = `${settings.ttsSpeed}%`;
        }

        // Reminder
        const reminderToggle = document.getElementById('reminderToggle') as HTMLInputElement;
        const reminderTimeItem = document.getElementById('reminderTimeItem');
        const reminderTime = document.getElementById('reminderTime') as HTMLInputElement;
        if (reminderToggle) {
            reminderToggle.checked = settings.reminderEnabled;
            if (reminderTimeItem) {
                reminderTimeItem.style.display = settings.reminderEnabled ? 'flex' : 'none';
            }
        }
        if (reminderTime) reminderTime.value = settings.reminderTime;

        // Daily Goal
        const goalBtns = document.querySelectorAll('.goal-btn');
        goalBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-goal') === String(settings.dailyGoal));
        });

        // Auto Play
        const autoPlayToggle = document.getElementById('autoPlayToggle') as HTMLInputElement;
        if (autoPlayToggle) autoPlayToggle.checked = settings.autoPlay;

        // Show Examples
        const showExamplesToggle = document.getElementById('showExamplesToggle') as HTMLInputElement;
        if (showExamplesToggle) showExamplesToggle.checked = settings.showExamples;

        // Focus Mode
        const focusModeToggle = document.getElementById('focusModeToggle') as HTMLInputElement;
        if (focusModeToggle) focusModeToggle.checked = settings.focusMode;
        document.body.classList.toggle('focus-mode', settings.focusMode);

        // Eye Care
        const eyeCareToggle = document.getElementById('eyeCareToggle') as HTMLInputElement;
        if (eyeCareToggle) eyeCareToggle.checked = settings.eyeCare;
        document.body.classList.toggle('eye-care-mode', settings.eyeCare);

        // Avatar
        const avatarEmoji = document.querySelector('.avatar-emoji');
        if (avatarEmoji) avatarEmoji.textContent = settings.avatar;

        // TTS Voice Preference
        const voiceBtns = document.querySelectorAll('.voice-btn');
        voiceBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-voice') === settings.ttsVoicePreference);
        });

        // Update completion progress
        this.updateCompletionProgress();
    },

    loadProgress(): void {
        const progress = SettingsProgressManager.get();
        const xpNeeded = SettingsProgressManager.getXPForLevel(progress.level);
        const percentage = Math.min(100, (progress.xp / xpNeeded) * 100);

        // Update display elements
        const userLevel = document.getElementById('userLevel');
        const userXP = document.getElementById('userXP');
        const nextLevel = document.getElementById('nextLevel');
        const progressPercent = document.getElementById('progressPercent');
        const levelProgress = document.getElementById('levelProgress');
        const totalWords = document.getElementById('totalWords');
        const currentStreak = document.getElementById('currentStreak');
        const gamesPlayed = document.getElementById('gamesPlayed');

        if (userLevel) userLevel.textContent = String(progress.level);
        if (userXP) userXP.textContent = String(progress.xp);
        if (nextLevel) nextLevel.textContent = String(progress.level + 1);
        if (progressPercent) progressPercent.textContent = `${Math.round(percentage)}%`;
        if (levelProgress) levelProgress.style.width = `${percentage}%`;
        if (totalWords) totalWords.textContent = String(progress.wordsLearned);
        if (currentStreak) currentStreak.textContent = String(progress.streak);
        if (gamesPlayed) gamesPlayed.textContent = String(progress.gamesPlayed);
    },

    setupEventListeners(): void {
        // Toggle sections
        (window as any).toggleSection = (sectionId: string) => {
            const section = document.querySelector(`[data-section="${sectionId}"]`);
            if (section) {
                section.classList.toggle('expanded');
            }
        };

        // Dark Mode - Toggle between light and dark modes
        document.getElementById('darkModeToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('darkMode', checked);

            // Apply dark mode class to both body and documentElement (html)
            document.body.classList.toggle('dark-mode', checked);
            document.documentElement.classList.toggle('dark-mode', checked);

            // Also update localStorage for other pages
            localStorage.setItem('darkMode', String(checked));

            // Update CSS variables for light/dark themes
            if (checked) {
                document.documentElement.style.setProperty('--settings-bg', '#0d1117');
                document.documentElement.style.setProperty('--settings-text', '#e6edf3');
            } else {
                document.documentElement.style.setProperty('--settings-bg', '#f8fafc');
                document.documentElement.style.setProperty('--settings-text', '#1e293b');
            }

            showToast(checked ? '🌙 ' + t('toast.darkModeOn') : '☀️ ' + t('toast.darkModeOff'));
        });

        // Mobile View Toggle
        document.getElementById('mobileViewToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            document.body.classList.toggle('mobile-view', checked);
            localStorage.setItem('mobileView', String(checked));
            showToast(checked ? '📱 ' + t('toast.mobileOn') : '🖥️ ' + t('toast.mobileOff'));
        });

        // Color Theme
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const theme = btn.getAttribute('data-theme') || 'default';
                SettingsManager.update('colorTheme', theme);
                document.body.setAttribute('data-theme', theme);
                showToast(`🎨 ${t('settings.themeChanged')} ${theme}`);
            });
        });

        // Font Size
        document.querySelectorAll('.font-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const size = btn.getAttribute('data-size') || 'medium';
                SettingsManager.update('fontSize', size);
                document.documentElement.style.fontSize = size === 'small' ? '14px' : size === 'large' ? '18px' : '16px';
                showToast('🔤 ' + t('toast.fontChanged'));
            });
        });

        // Animations
        document.getElementById('animationsToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('animations', checked);
            document.body.classList.toggle('reduce-motion', !checked);
            showToast(checked ? '✨ ' + t('toast.animationsOn') : '✨ ' + t('toast.animationsOff'));
        });

        // Language Selector
        const langCards = document.querySelectorAll('.lang-card-premium');
        langCards.forEach(card => {
            card.addEventListener('click', () => {
                // Update UI
                langCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');

                // Get selected language
                const lang = card.getAttribute('data-lang') as Language;

                // Apply language change
                LanguageManager.setLanguage(lang);

                const toastMessages: Record<Language, string> = {
                    'sv': '🇸🇪 ' + t('toast.langSv'),
                    'ar': '🇸🇦 ' + t('toast.langAr'),
                    'both': '🌍 ' + t('toast.langBoth')
                };
                showToast(toastMessages[lang]);
            });
        });

        // Load saved language on init
        const savedLang = LanguageManager.getLanguage();
        langCards.forEach(card => {
            if (card.getAttribute('data-lang') === savedLang) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });

        // Sound Effects
        document.getElementById('soundEffectsToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('soundEffects', checked);
            localStorage.setItem('soundEnabled', String(checked));
            showToast(checked ? '🔊 ' + t('toast.soundOn') : '🔇 ' + t('toast.soundOff'));
        });

        // TTS Speed
        document.getElementById('ttsSpeedSlider')?.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            SettingsManager.update('ttsSpeed', value);
            const valueEl = document.getElementById('ttsSpeedValue');
            if (valueEl) valueEl.textContent = `${value}%`;
            localStorage.setItem('ttsSpeed', String(value));
        });

        // TTS Voice Preference
        document.querySelectorAll('.voice-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const voice = btn.getAttribute('data-voice') as 'natural' | 'male' | 'female';
                SettingsManager.update('ttsVoicePreference', voice);
                localStorage.setItem('ttsVoicePreference', voice);
                showToast(`🗣️ ${t('settings.voiceChanged') || 'Rösttyp ändrad'}`);
            });
        });

        // Test TTS
        document.getElementById('testTTSBtn')?.addEventListener('click', () => {
            const settings = SettingsManager.get();
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance('Hej, välkommen till SnabbaLexin!');
                utterance.lang = 'sv-SE';
                utterance.rate = settings.ttsSpeed / 100;
                speechSynthesis.speak(utterance);
            }
        });

        // Reminder Toggle
        document.getElementById('reminderToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('reminderEnabled', checked);
            const reminderTimeItem = document.getElementById('reminderTimeItem');
            if (reminderTimeItem) {
                reminderTimeItem.style.display = checked ? 'flex' : 'none';
            }
            showToast(checked ? '⏰ ' + t('settings.reminderOn') : '⏰ ' + t('settings.reminderOff'));
        });

        // Reminder Time
        document.getElementById('reminderTime')?.addEventListener('change', (e) => {
            const value = (e.target as HTMLInputElement).value;
            SettingsManager.update('reminderTime', value);
            showToast(`⏰ ${t('settings.reminderTimeSet')} ${value}`);
        });

        // Daily Goal
        document.querySelectorAll('.goal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const goal = parseInt(btn.getAttribute('data-goal') || '10');
                SettingsManager.update('dailyGoal', goal);
                showToast(`🎯 ${t('settings.dailyGoalSet')} ${goal} ${t('settings.words')}`);
            });
        });

        // Auto Play
        document.getElementById('autoPlayToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('autoPlay', checked);
            showToast(checked ? '▶️ ' + t('settings.autoPlayOn') : '▶️ ' + t('settings.autoPlayOff'));
        });

        // Show Examples
        document.getElementById('showExamplesToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('showExamples', checked);
            showToast(checked ? '💬 ' + t('settings.examplesOn') : '💬 ' + t('settings.examplesOff'));
        });

        // Focus Mode
        document.getElementById('focusModeToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('focusMode', checked);
            document.body.classList.toggle('focus-mode', checked);
            localStorage.setItem('focusMode', String(checked));
            showToast(checked ? '🧘 ' + t('settings.focusOn') : '🧘 ' + t('settings.focusOff'));
        });

        // Eye Care
        document.getElementById('eyeCareToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('eyeCare', checked);
            document.body.classList.toggle('eye-care-mode', checked);
            localStorage.setItem('eyeCareMode', String(checked));
            showToast(checked ? '👁️ ' + t('settings.eyeCareOn') : '👁️ ' + t('settings.eyeCareOff'));
        });

        // Change Avatar
        document.getElementById('changeAvatarBtn')?.addEventListener('click', () => {
            const modal = document.getElementById('avatarModal');
            if (modal) modal.classList.remove('hidden');
        });

        // Reset All
        document.getElementById('resetAllBtn')?.addEventListener('click', () => {
            showConfirmModal(
                '⚠️',
                t('settings.resetTitle'),
                t('settings.resetMsg'),
                () => {
                    SettingsManager.save(SettingsManager.defaults);
                    location.reload();
                }
            );
        });

        // Import File
        document.getElementById('importFile')?.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const data = JSON.parse(event.target?.result as string);
                        // Import favorites
                        if (data.favorites) {
                            localStorage.setItem('favorites', JSON.stringify(data.favorites));
                        }
                        // Import progress
                        if (data.progress) {
                            localStorage.setItem('userProgress', JSON.stringify(data.progress));
                        }
                        showToast('✅ ' + t('settings.dataImported'));
                        setTimeout(() => location.reload(), 1000);
                    } catch (err) {
                        showToast('❌ ' + t('settings.importError'), 'error');
                    }
                };
                reader.readAsText(file);
            }
        });
    },

    setupRecommendations(): void {
        const settings = SettingsManager.get();
        const recommendations: { icon: string; textSv: string; textAr: string; actionSv: string; actionAr: string }[] = [];

        if (!settings.soundEffects) {
            recommendations.push({
                icon: '🔊',
                textSv: 'Aktivera ljud för bättre inlärning',
                textAr: 'فعّل الصوت لتعلم أفضل',
                actionSv: 'Aktivera',
                actionAr: 'تفعيل'
            });
        }

        if (!settings.reminderEnabled) {
            recommendations.push({
                icon: '⏰',
                textSv: 'Sätt en daglig påminnelse',
                textAr: 'ضبط تذكير يومي',
                actionSv: 'Aktivera',
                actionAr: 'تفعيل'
            });
        }

        if (settings.dailyGoal < 10) {
            recommendations.push({
                icon: '🎯',
                textSv: 'Öka ditt dagliga mål för snabbare framsteg',
                textAr: 'زيادة هدفك اليومي لتقدم أسرع',
                actionSv: 'Ändra',
                actionAr: 'تغيير'
            });
        }

        const container = document.getElementById('recommendationsList');
        const section = document.getElementById('recommendationsSection');

        if (recommendations.length === 0 && section) {
            section.style.display = 'none';
            return;
        }

        if (container) {
            container.innerHTML = recommendations.map(rec => `
                <div class="recommendation-item">
                    <div class="rec-item-icon">${rec.icon}</div>
                    <div class="rec-item-text"><span class="sv-text">${rec.textSv}</span><span class="ar-text">${rec.textAr}</span></div>
                    <span class="rec-item-action"><span class="sv-text">${rec.actionSv}</span><span class="ar-text">${rec.actionAr}</span></span>
                </div>
            `).join('');
        }
    },

    calculateStorageUsage(): void {
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length * 2; // UTF-16
            }
        }

        const sizeKB = (totalSize / 1024).toFixed(1);
        const maxKB = 5000; // ~5MB limit
        const percentage = Math.min(100, (totalSize / 1024 / maxKB) * 100);

        const storageUsed = document.getElementById('storageUsed');
        const storageBar = document.getElementById('storageBar');

        if (storageUsed) storageUsed.textContent = `${sizeKB} KB`;
        if (storageBar) storageBar.style.width = `${percentage}%`;
    },

    populateAvatarGrid(): void {
        const avatars = ['👤', '🧑', '👩', '👨', '🧑‍🦱', '👩‍🦰', '🧔', '👧', '👦', '🧒',
            '😊', '😎', '🤓', '🦊', '🐱', '🐶', '🦁', '🐻', '🐼', '🦉',
            '🌟', '⭐', '🔥', '💎', '🎯'];

        const grid = document.getElementById('avatarGrid');
        const settings = SettingsManager.get();

        if (grid) {
            grid.innerHTML = avatars.map(avatar => `
                <button class="avatar-option ${avatar === settings.avatar ? 'selected' : ''}" data-avatar="${avatar}">
                    ${avatar}
                </button>
            `).join('');

            grid.querySelectorAll('.avatar-option').forEach(btn => {
                btn.addEventListener('click', () => {
                    const avatar = btn.getAttribute('data-avatar') || '👤';
                    SettingsManager.update('avatar', avatar);

                    // Update display
                    const avatarEmoji = document.querySelector('.avatar-emoji');
                    if (avatarEmoji) avatarEmoji.textContent = avatar;

                    // Update selection
                    grid.querySelectorAll('.avatar-option').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');

                    closeAvatarModal();
                    showToast('✅ ' + t('settings.avatarChanged'));
                });
            });
        }
    },

    updateCompletionProgress(): void {
        const settings = SettingsManager.get();
        let completed = 0;
        const total = 10;

        // Check what's configured
        if (settings.darkMode !== undefined) completed++;
        if (settings.colorTheme !== 'default') completed++;
        if (settings.soundEffects) completed++;
        if (settings.reminderEnabled) completed++;
        if (settings.dailyGoal > 5) completed++;
        if (settings.ttsSpeed !== 85) completed++;
        if (settings.avatar !== '👤') completed++;
        if (settings.showExamples) completed++;
        if (settings.animations) completed++;
        completed++; // Base completion

        const percentage = Math.round((completed / total) * 100);
        const completionPercent = document.getElementById('completionPercent');
        const completionProgress = document.getElementById('completionProgress');

        if (completionPercent) completionPercent.textContent = `${percentage}%`;
        if (completionProgress) completionProgress.style.width = `${percentage}%`;
    }
};

// ============================================================
// GLOBAL FUNCTIONS
// ============================================================

// Use unified ToastManager from toast-manager.ts
function showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    ToastManager.show(message, { type });
}

function closeAvatarModal(): void {
    const modal = document.getElementById('avatarModal');
    if (modal) modal.classList.add('hidden');
}

function closeConfirmModal(): void {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.classList.add('hidden');
}

function showConfirmModal(icon: string, title: string, message: string, onConfirm: () => void): void {
    const modal = document.getElementById('confirmModal');
    const confirmIcon = document.getElementById('confirmIcon');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmMessage = document.getElementById('confirmMessage');
    const confirmBtn = document.getElementById('confirmBtn');

    if (modal && confirmIcon && confirmTitle && confirmMessage && confirmBtn) {
        confirmIcon.textContent = icon;
        confirmTitle.textContent = title;
        confirmMessage.textContent = message;

        confirmBtn.onclick = () => {
            closeConfirmModal();
            onConfirm();
        };

        modal.classList.remove('hidden');
    }
}

function exportData(): void {
    const data = {
        favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
        progress: JSON.parse(localStorage.getItem('userProgress') || '{}'),
        settings: JSON.parse(localStorage.getItem('userSettings') || '{}'),
        exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snabbalexin-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✅ ' + t('settings.dataExported'));
}

function clearFavorites(): void {
    showConfirmModal(
        '🗑️',
        t('settings.clearFavTitle'),
        t('settings.clearFavMsg'),
        () => {
            localStorage.removeItem('favorites');
            showToast('✅ ' + t('settings.favoritesCleared'));
        }
    );
}

function clearAllData(): void {
    showConfirmModal(
        '⚠️',
        t('settings.clearAllTitle'),
        t('settings.clearAllMsg'),
        () => {
            localStorage.clear();
            showToast('✅ ' + t('settings.allDataCleared'));
            setTimeout(() => location.reload(), 1000);
        }
    );
}

// Expose functions globally
(window as any).toggleSection = (id: string) => {
    const section = document.querySelector(`[data-section="${id}"]`);
    if (section) section.classList.toggle('expanded');
};
(window as any).closeAvatarModal = closeAvatarModal;
(window as any).closeConfirmModal = closeConfirmModal;
(window as any).exportData = exportData;
(window as any).clearFavorites = clearFavorites;
(window as any).clearAllData = clearAllData;

// ============================================================
// INITIALIZATION
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    UIController.init();

    // Expand first section by default
    const firstSection = document.querySelector('.settings-section');
    if (firstSection) firstSection.classList.add('expanded');

    // Setup Install App Button
    setupInstallAppButton();
});

// ============================================================
// INSTALL APP BUTTON HANDLER
// ============================================================

let deferredInstallPrompt: any = null;

function setupInstallAppButton(): void {
    const installItem = document.getElementById('installAppItem');
    if (!installItem) return;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isInStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (navigator as any).standalone;

    // Don't show if already installed
    if (isInStandaloneMode) {
        installItem.style.display = 'none';
        return;
    }

    // Show on iOS
    if (isIOS) {
        installItem.style.display = 'flex';
        installItem.addEventListener('click', () => {
            showIOSInstallInstructions();
        });
        return;
    }

    // Listen for install prompt event (Android/Desktop)
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredInstallPrompt = e;
        installItem.style.display = 'flex';
    });

    // Handle click
    installItem.addEventListener('click', async () => {
        if (deferredInstallPrompt) {
            deferredInstallPrompt.prompt();
            const { outcome } = await deferredInstallPrompt.userChoice;
            if (outcome === 'accepted') {
                showToast('✅ Appen installeras! / يتم تثبيت التطبيق!');
                installItem.style.display = 'none';
            }
            deferredInstallPrompt = null;
        } else if (isIOS) {
            showIOSInstallInstructions();
        }
    });
}

function showIOSInstallInstructions(): void {
    showConfirmModal(
        '📲',
        'Installera SnabbaLexin / تثبيت سنابا لكسين',
        '1. Tryck på dela-knappen (□↑) / اضغط على زر المشاركة\n2. Välj "Lägg till på hemskärmen" / اختر "إضافة إلى الشاشة الرئيسية"\n3. Tryck "Lägg till" / اضغط "إضافة"',
        () => {
            closeConfirmModal();
        }
    );
}
