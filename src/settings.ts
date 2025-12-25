/**
 * ============================================================
 * PREMIUM SETTINGS PAGE - صفحة الإعدادات المتميزة
 * Version: 1.0
 * ============================================================
 */

import { ToastManager } from './toast-manager';


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
        avatar: '👤'
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

            showToast(checked ? '🌙 Mörkt läge aktiverat' : '☀️ Ljust läge aktiverat');
        });

        // Mobile View Toggle
        document.getElementById('mobileViewToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            document.body.classList.toggle('mobile-view', checked);
            localStorage.setItem('mobileView', String(checked));
            showToast(checked ? '📱 Mobilvy aktiverad' : '🖥️ Skrivbordsvy aktiverad');
        });

        // Color Theme
        document.querySelectorAll('.color-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const theme = btn.getAttribute('data-theme') || 'default';
                SettingsManager.update('colorTheme', theme);
                document.body.setAttribute('data-theme', theme);
                showToast(`🎨 Tema ändrat till ${theme}`);
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
                showToast('🔤 Textstorlek ändrad');
            });
        });

        // Animations
        document.getElementById('animationsToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('animations', checked);
            document.body.classList.toggle('reduce-motion', !checked);
            showToast(checked ? '✨ Animationer på' : '✨ Animationer av');
        });

        // Sound Effects
        document.getElementById('soundEffectsToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('soundEffects', checked);
            localStorage.setItem('soundEnabled', String(checked));
            showToast(checked ? '🔊 Ljud på' : '🔇 Ljud av');
        });

        // TTS Speed
        document.getElementById('ttsSpeedSlider')?.addEventListener('input', (e) => {
            const value = parseInt((e.target as HTMLInputElement).value);
            SettingsManager.update('ttsSpeed', value);
            const valueEl = document.getElementById('ttsSpeedValue');
            if (valueEl) valueEl.textContent = `${value}%`;
            localStorage.setItem('ttsSpeed', String(value));
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
            showToast(checked ? '⏰ Påminnelse aktiverad' : '⏰ Påminnelse avaktiverad');
        });

        // Reminder Time
        document.getElementById('reminderTime')?.addEventListener('change', (e) => {
            const value = (e.target as HTMLInputElement).value;
            SettingsManager.update('reminderTime', value);
            showToast(`⏰ Påminnelsetid: ${value}`);
        });

        // Daily Goal
        document.querySelectorAll('.goal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const goal = parseInt(btn.getAttribute('data-goal') || '10');
                SettingsManager.update('dailyGoal', goal);
                showToast(`🎯 Dagligt mål: ${goal} ord`);
            });
        });

        // Auto Play
        document.getElementById('autoPlayToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('autoPlay', checked);
            showToast(checked ? '▶️ Auto-spela på' : '▶️ Auto-spela av');
        });

        // Show Examples
        document.getElementById('showExamplesToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('showExamples', checked);
            showToast(checked ? '💬 Exempel visas' : '💬 Exempel döljs');
        });

        // Focus Mode
        document.getElementById('focusModeToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('focusMode', checked);
            document.body.classList.toggle('focus-mode', checked);
            localStorage.setItem('focusMode', String(checked));
            showToast(checked ? '🧘 Fokusläge aktiverat' : '🧘 Fokusläge avaktiverat');
        });

        // Eye Care
        document.getElementById('eyeCareToggle')?.addEventListener('change', (e) => {
            const checked = (e.target as HTMLInputElement).checked;
            SettingsManager.update('eyeCare', checked);
            document.body.classList.toggle('eye-care-mode', checked);
            localStorage.setItem('eyeCareMode', String(checked));
            showToast(checked ? '👁️ Ögonvård aktiverad' : '👁️ Ögonvård avaktiverad');
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
                'Återställ inställningar?',
                'Alla inställningar kommer återställas till standard.',
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
                        showToast('✅ Data importerad!');
                        setTimeout(() => location.reload(), 1000);
                    } catch (err) {
                        showToast('❌ Fel vid import', 'error');
                    }
                };
                reader.readAsText(file);
            }
        });
    },

    setupRecommendations(): void {
        const settings = SettingsManager.get();
        const recommendations: { icon: string; text: string; action: string }[] = [];

        if (!settings.soundEffects) {
            recommendations.push({
                icon: '🔊',
                text: 'Aktivera ljud för bättre inlärning',
                action: 'Aktivera'
            });
        }

        if (!settings.reminderEnabled) {
            recommendations.push({
                icon: '⏰',
                text: 'Sätt en daglig påminnelse',
                action: 'Aktivera'
            });
        }

        if (settings.dailyGoal < 10) {
            recommendations.push({
                icon: '🎯',
                text: 'Öka ditt dagliga mål för snabbare framsteg',
                action: 'Ändra'
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
                    <div class="rec-item-text">${rec.text}</div>
                    <span class="rec-item-action">${rec.action}</span>
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
                    showToast('✅ Avatar ändrad!');
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
    showToast('✅ Data exporterad!');
}

function clearFavorites(): void {
    showConfirmModal(
        '🗑️',
        'Rensa favoriter?',
        'Alla sparade favoriter kommer tas bort.',
        () => {
            localStorage.removeItem('favorites');
            showToast('✅ Favoriter rensade');
        }
    );
}

function clearAllData(): void {
    showConfirmModal(
        '⚠️',
        'Rensa ALL data?',
        'Detta går inte att ångra! Alla favoriter, framsteg och inställningar kommer raderas.',
        () => {
            localStorage.clear();
            showToast('✅ All data rensad');
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
});
