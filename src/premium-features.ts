/**
 * ============================================================
 * PREMIUM FEATURES SYSTEM - نظام الميزات المتميزة
 * Version: 2.0
 * ============================================================
 * 
 * Features:
 * - Focus Mode Toggle
 * - Achievement System
 * - XP & Level System
 * - Daily Goals
 * - Mystery Box Rewards
 * - Pomodoro Timer
 * - Sound Effects
 * - Music Player
 */

// ============================================================
// TYPES & INTERFACES - الأنواع والواجهات
// ============================================================

interface Achievement {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    icon: string;
    requirement: number;
    type: 'games' | 'streak' | 'score' | 'words' | 'time';
    unlocked: boolean;
    unlockedAt?: string;
}

interface DailyGoal {
    id: string;
    name: string;
    nameAr: string;
    description: string;
    icon: string;
    target: number;
    current: number;
    xpReward: number;
    completed: boolean;
}

interface UserProgress {
    xp: number;
    level: number;
    streak: number;
    gamesPlayed: number;
    totalScore: number;
    wordsLearned: number;
    timeSpent: number; // in minutes
    achievements: string[];
    lastPlayDate: string;
    dailyGoalsCompleted: number;
    mysteryBoxLastOpened?: string;
}

// ============================================================
// FOCUS MODE MANAGER - مدير وضع التركيز
// ============================================================

export const FocusMode = {
    isActive: false,

    init(): void {
        this.isActive = localStorage.getItem('focusMode') === 'true';
        if (this.isActive) {
            document.body.classList.add('focus-mode');
        }
        // Button creation now handled by unified FAB menu
        // this.createToggleButton();
    },

    createToggleButton(): void {
        const existing = document.querySelector('.focus-mode-toggle');
        if (existing) return;

        const button = document.createElement('button');
        button.className = 'focus-mode-toggle';
        button.setAttribute('aria-label', 'Toggle Focus Mode');
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
        `;

        button.addEventListener('click', () => this.toggle());
        document.body.appendChild(button);
    },

    toggle(): void {
        this.isActive = !this.isActive;
        document.body.classList.toggle('focus-mode', this.isActive);
        localStorage.setItem('focusMode', String(this.isActive));

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(this.isActive ? [20, 50, 20] : 10);
        }

        // Show toast
        showToast(
            this.isActive ? 'Fokusläge aktiverat ✨' : 'Fokusläge avaktiverat',
            this.isActive ? 'success' : 'info'
        );
    }
};

// ============================================================
// XP & LEVEL SYSTEM - نظام الخبرة والمستويات
// ============================================================

export const XPSystem = {
    xpPerLevel: 100,
    levelMultiplier: 1.5,

    getProgress(): UserProgress {
        const saved = localStorage.getItem('userProgress');
        return saved ? JSON.parse(saved) : {
            xp: 0,
            level: 1,
            streak: 0,
            gamesPlayed: 0,
            totalScore: 0,
            wordsLearned: 0,
            timeSpent: 0,
            achievements: [],
            lastPlayDate: '',
            dailyGoalsCompleted: 0
        };
    },

    saveProgress(progress: UserProgress): void {
        localStorage.setItem('userProgress', JSON.stringify(progress));
    },

    getXPForLevel(level: number): number {
        return Math.floor(this.xpPerLevel * Math.pow(this.levelMultiplier, level - 1));
    },

    addXP(amount: number): { newLevel: boolean; level: number; totalXP: number } {
        const progress = this.getProgress();
        progress.xp += amount;

        const xpNeeded = this.getXPForLevel(progress.level);
        let newLevel = false;

        while (progress.xp >= xpNeeded) {
            progress.xp -= xpNeeded;
            progress.level++;
            newLevel = true;
        }

        this.saveProgress(progress);

        if (newLevel) {
            this.showLevelUp(progress.level);
        }

        return { newLevel, level: progress.level, totalXP: progress.xp };
    },

    showLevelUp(level: number): void {
        const overlay = document.createElement('div');
        overlay.className = 'level-up-overlay';
        overlay.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <h2 class="level-up-title">Nivå ${level}!</h2>
                <p class="level-up-subtitle">Du har gått upp en nivå!</p>
                <div class="level-stars">
                    ${'<span class="level-star">⭐</span>'.repeat(Math.min(level, 5))}
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        // Confetti
        Celebrations.confetti({ particleCount: 150, spread: 100 });

        // Sound
        SoundEffects.play('levelUp');

        // Haptic
        if ('vibrate' in navigator) {
            navigator.vibrate([50, 100, 50, 100, 50]);
        }

        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 500);
        }, 3000);
    },

    createXPBar(container: HTMLElement): void {
        const progress = this.getProgress();
        const xpNeeded = this.getXPForLevel(progress.level);
        const percentage = (progress.xp / xpNeeded) * 100;

        const xpBar = document.createElement('div');
        xpBar.className = 'xp-widget';
        xpBar.innerHTML = `
            <div class="xp-header">
                <span class="xp-level">Nivå ${progress.level}</span>
                <span class="xp-text">${progress.xp}/${xpNeeded} XP</span>
            </div>
            <div class="xp-progress-container">
                <div class="xp-progress-bar" style="width: ${percentage}%">
                    <div class="xp-progress-glow"></div>
                </div>
            </div>
        `;

        container.insertBefore(xpBar, container.firstChild);
    }
};

// ============================================================
// ACHIEVEMENT SYSTEM - نظام الإنجازات
// ============================================================

export const Achievements = {
    list: [
        { id: 'first-game', name: 'Första Steget', nameAr: 'الخطوة الأولى', description: 'Spela ditt första spel', icon: '🎮', requirement: 1, type: 'games' as const, unlocked: false },
        { id: 'ten-games', name: 'Spelentusiast', nameAr: 'عاشق الألعاب', description: 'Spela 10 spel', icon: '🎯', requirement: 10, type: 'games' as const, unlocked: false },
        { id: 'fifty-games', name: 'Mästare', nameAr: 'محترف', description: 'Spela 50 spel', icon: '👑', requirement: 50, type: 'games' as const, unlocked: false },
        { id: 'streak-3', name: 'På Rulle', nameAr: 'متواصل', description: '3 dagars streak', icon: '🔥', requirement: 3, type: 'streak' as const, unlocked: false },
        { id: 'streak-7', name: 'Vecko-Hjälte', nameAr: 'بطل الأسبوع', description: '7 dagars streak', icon: '💪', requirement: 7, type: 'streak' as const, unlocked: false },
        { id: 'streak-30', name: 'Månads-Legend', nameAr: 'أسطورة الشهر', description: '30 dagars streak', icon: '🏆', requirement: 30, type: 'streak' as const, unlocked: false },
        { id: 'score-100', name: 'Poängjägare', nameAr: 'صياد النقاط', description: 'Få 100 poäng totalt', icon: '⭐', requirement: 100, type: 'score' as const, unlocked: false },
        { id: 'score-1000', name: 'Poäng-Kung', nameAr: 'ملك النقاط', description: 'Få 1000 poäng totalt', icon: '👸', requirement: 1000, type: 'score' as const, unlocked: false },
        { id: 'words-50', name: 'Ordsamlare', nameAr: 'جامع الكلمات', description: 'Lär dig 50 ord', icon: '📚', requirement: 50, type: 'words' as const, unlocked: false },
        { id: 'words-200', name: 'Ordväktare', nameAr: 'حارس الكلمات', description: 'Lär dig 200 ord', icon: '📖', requirement: 200, type: 'words' as const, unlocked: false },
        { id: 'time-60', name: 'Dedikerad', nameAr: 'مكرّس', description: 'Spela i 60 minuter', icon: '⏰', requirement: 60, type: 'time' as const, unlocked: false },
        { id: 'time-300', name: 'Tidsmästare', nameAr: 'سيد الوقت', description: 'Spela i 5 timmar', icon: '⌛', requirement: 300, type: 'time' as const, unlocked: false },
    ] as Achievement[],

    loadUnlocked(): void {
        const progress = XPSystem.getProgress();
        this.list.forEach(achievement => {
            achievement.unlocked = progress.achievements.includes(achievement.id);
        });
    },

    check(): Achievement[] {
        const progress = XPSystem.getProgress();
        const newlyUnlocked: Achievement[] = [];

        this.list.forEach(achievement => {
            if (achievement.unlocked) return;

            let value = 0;
            switch (achievement.type) {
                case 'games': value = progress.gamesPlayed; break;
                case 'streak': value = progress.streak; break;
                case 'score': value = progress.totalScore; break;
                case 'words': value = progress.wordsLearned; break;
                case 'time': value = progress.timeSpent; break;
            }

            if (value >= achievement.requirement) {
                achievement.unlocked = true;
                achievement.unlockedAt = new Date().toISOString();
                progress.achievements.push(achievement.id);
                newlyUnlocked.push(achievement);
            }
        });

        if (newlyUnlocked.length > 0) {
            XPSystem.saveProgress(progress);
            newlyUnlocked.forEach(a => this.showUnlock(a));
        }

        return newlyUnlocked;
    },

    showUnlock(achievement: Achievement): void {
        const popup = document.createElement('div');
        popup.className = 'achievement-popup';
        popup.innerHTML = `
            <div class="achievement-popup-badge">
                <div class="achievement-badge unlocked">
                    <div class="achievement-badge-inner">${achievement.icon}</div>
                    <div class="achievement-badge-shine"></div>
                </div>
            </div>
            <h3 class="achievement-popup-title">${achievement.name}</h3>
            <p class="achievement-popup-desc">${achievement.description}</p>
        `;
        document.body.appendChild(popup);

        SoundEffects.play('achievement');
        Celebrations.confetti({ particleCount: 80, spread: 60 });

        if ('vibrate' in navigator) {
            navigator.vibrate([30, 50, 30, 50, 30]);
        }

        setTimeout(() => {
            popup.style.animation = 'fadeOut 0.5s ease forwards';
            setTimeout(() => popup.remove(), 500);
        }, 3500);
    },

    showBadges(container: HTMLElement): void {
        this.loadUnlocked();

        const grid = document.createElement('div');
        grid.className = 'achievements-grid';
        grid.style.cssText = 'display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 16px;';

        this.list.forEach(achievement => {
            const badge = document.createElement('div');
            badge.className = `achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}`;
            badge.innerHTML = `
                <div class="achievement-badge-inner">${achievement.icon}</div>
                ${achievement.unlocked ? '<div class="achievement-badge-shine"></div>' : ''}
            `;
            badge.title = `${achievement.name}: ${achievement.description}`;
            grid.appendChild(badge);
        });

        container.appendChild(grid);
    }
};

// ============================================================
// DAILY GOALS SYSTEM - نظام الأهداف اليومية
// ============================================================

export const DailyGoals = {
    goals: [
        { id: 'play-3', name: 'Spela 3 spel', nameAr: 'العب 3 ألعاب', description: 'Spela 3 spel idag', icon: '🎮', target: 3, current: 0, xpReward: 20, completed: false },
        { id: 'score-50', name: 'Få 50 poäng', nameAr: 'احصل على 50 نقطة', description: 'Samla 50 poäng', icon: '⭐', target: 50, current: 0, xpReward: 30, completed: false },
        { id: 'streak', name: 'Behåll streak', nameAr: 'حافظ على السلسلة', description: 'Logga in och spela', icon: '🔥', target: 1, current: 0, xpReward: 15, completed: false },
    ] as DailyGoal[],

    load(): void {
        const today = new Date().toDateString();
        const saved = localStorage.getItem('dailyGoals');
        const data = saved ? JSON.parse(saved) : null;

        if (data && data.date === today) {
            this.goals = data.goals;
        } else {
            // Reset goals for new day
            this.goals.forEach(g => { g.current = 0; g.completed = false; });
            this.save();
        }
    },

    save(): void {
        localStorage.setItem('dailyGoals', JSON.stringify({
            date: new Date().toDateString(),
            goals: this.goals
        }));
    },

    updateProgress(type: 'games' | 'score' | 'streak', amount: number): void {
        this.load();
        let updated = false;

        this.goals.forEach(goal => {
            if (goal.completed) return;

            if (
                (type === 'games' && goal.id === 'play-3') ||
                (type === 'score' && goal.id === 'score-50') ||
                (type === 'streak' && goal.id === 'streak')
            ) {
                goal.current = Math.min(goal.current + amount, goal.target);

                if (goal.current >= goal.target && !goal.completed) {
                    goal.completed = true;
                    this.showGoalComplete(goal);
                    XPSystem.addXP(goal.xpReward);
                }
                updated = true;
            }
        });

        if (updated) this.save();
    },

    showGoalComplete(goal: DailyGoal): void {
        showToast(`🎯 ${goal.name} - +${goal.xpReward} XP!`, 'success');
        SoundEffects.play('success');
    },

    render(container: HTMLElement): void {
        this.load();

        const widget = document.createElement('div');
        widget.className = 'daily-goals-widget glass-card';

        const completed = this.goals.filter(g => g.completed).length;

        widget.innerHTML = `
            <div class="daily-goals-header">
                <h3 class="daily-goals-title">🎯 Dagens Mål</h3>
                <span class="daily-goals-progress">${completed}/${this.goals.length}</span>
            </div>
            ${this.goals.map(goal => `
                <div class="daily-goal-item ${goal.completed ? 'completed' : ''}">
                    <div class="daily-goal-icon" style="background: ${goal.completed ? '#4ade80' : '#6366f1'}20;">
                        ${goal.icon}
                    </div>
                    <div class="daily-goal-info">
                        <div class="daily-goal-name">${goal.name}</div>
                        <div class="daily-goal-desc">${goal.current}/${goal.target}</div>
                    </div>
                    <div class="daily-goal-reward">+${goal.xpReward} XP</div>
                </div>
            `).join('')}
        `;

        container.appendChild(widget);
    }
};

// ============================================================
// MYSTERY BOX - صندوق الغموض
// ============================================================

export const MysteryBox = {
    rewards: [
        { type: 'xp', value: 10, icon: '✨', name: '10 XP' },
        { type: 'xp', value: 25, icon: '⭐', name: '25 XP' },
        { type: 'xp', value: 50, icon: '💫', name: '50 XP' },
        { type: 'xp', value: 100, icon: '🌟', name: '100 XP' },
        { type: 'streak-freeze', value: 1, icon: '❄️', name: 'Streak Freeze' },
        { type: 'double-xp', value: 1, icon: '🔥', name: 'Dubbel XP (1 spel)' },
    ],

    canOpen(): boolean {
        const progress = XPSystem.getProgress();
        if (!progress.mysteryBoxLastOpened) return true;

        const lastOpened = new Date(progress.mysteryBoxLastOpened);
        const now = new Date();
        const hoursDiff = (now.getTime() - lastOpened.getTime()) / (1000 * 60 * 60);

        return hoursDiff >= 24;
    },

    open(): { type: string; value: number; icon: string; name: string } | null {
        if (!this.canOpen()) {
            showToast('Vänta till imorgon för nästa låda! 📦', 'info');
            return null;
        }

        const reward = this.rewards[Math.floor(Math.random() * this.rewards.length)];

        const progress = XPSystem.getProgress();
        progress.mysteryBoxLastOpened = new Date().toISOString();
        XPSystem.saveProgress(progress);

        if (reward.type === 'xp') {
            XPSystem.addXP(reward.value);
        }

        this.showReward(reward);
        return reward;
    },

    showReward(reward: { icon: string; name: string }): void {
        const overlay = document.createElement('div');
        overlay.className = 'level-up-overlay';
        overlay.innerHTML = `
            <div class="level-up-content">
                <div class="mystery-box opening">
                    <span class="mystery-box-icon">🎁</span>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);

        SoundEffects.play('mysteryBox');

        setTimeout(() => {
            overlay.innerHTML = `
                <div class="level-up-content">
                    <div class="level-up-icon">${reward.icon}</div>
                    <h2 class="level-up-title">${reward.name}!</h2>
                    <p class="level-up-subtitle">Du fick en belöning!</p>
                </div>
            `;

            Celebrations.confetti({ particleCount: 100, spread: 80 });

            if ('vibrate' in navigator) {
                navigator.vibrate([50, 100, 50]);
            }
        }, 1000);

        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 500);
        }, 2000);
    },

    render(container: HTMLElement): void {
        const canOpen = this.canOpen();

        const boxContainer = document.createElement('div');
        boxContainer.style.cssText = 'display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px;';

        boxContainer.innerHTML = `
            <div class="mystery-box ${canOpen ? '' : 'locked'}" id="mysteryBox">
                <span class="mystery-box-icon">🎁</span>
                <div class="mystery-box-sparkles">
                    <div class="mystery-box-sparkle"></div>
                    <div class="mystery-box-sparkle"></div>
                    <div class="mystery-box-sparkle"></div>
                    <div class="mystery-box-sparkle"></div>
                </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                ${canOpen ? 'Klicka för att öppna!' : 'Kommer tillbaka imorgon'}
            </p>
        `;

        container.appendChild(boxContainer);

        const box = boxContainer.querySelector('#mysteryBox');
        if (box && canOpen) {
            box.addEventListener('click', () => this.open());
        }
    }
};

// ============================================================
// POMODORO TIMER - مؤقت بومودورو
// ============================================================

export const PomodoroTimer = {
    isRunning: false,
    isPaused: false,
    timeLeft: 25 * 60, // 25 minutes in seconds
    sessionLength: 25 * 60,
    breakLength: 5 * 60,
    isBreak: false,
    sessionsCompleted: 0,
    interval: null as ReturnType<typeof setInterval> | null,
    widget: null as HTMLElement | null,

    init(): void {
        this.createWidget();
        // Button creation now handled by unified FAB menu
        // this.createToggleButton();
    },

    createToggleButton(): void {
        const button = document.createElement('button');
        button.className = 'pomodoro-toggle';
        button.style.cssText = `
            position: fixed;
            bottom: 90px;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 998;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            transition: transform 0.3s ease;
        `;
        button.innerHTML = '⏱️';
        button.addEventListener('click', () => this.toggleWidget());
        document.body.appendChild(button);
    },

    createWidget(): void {
        const widget = document.createElement('div');
        widget.className = 'pomodoro-widget';
        widget.innerHTML = `
            <div class="pomodoro-header">
                <span class="pomodoro-title">⏱️ Pomodoro</span>
                <button class="pomodoro-close">✕</button>
            </div>
            <div class="pomodoro-timer" id="pomodoroTime">25:00</div>
            <div class="pomodoro-controls">
                <button class="pomodoro-btn pomodoro-btn-primary" id="pomodoroStart">Start</button>
                <button class="pomodoro-btn pomodoro-btn-secondary" id="pomodoroReset">Reset</button>
            </div>
            <div class="pomodoro-sessions" id="pomodoroSessions">
                <span class="pomodoro-session-dot"></span>
                <span class="pomodoro-session-dot"></span>
                <span class="pomodoro-session-dot"></span>
                <span class="pomodoro-session-dot"></span>
            </div>
        `;

        document.body.appendChild(widget);
        this.widget = widget;

        widget.querySelector('.pomodoro-close')?.addEventListener('click', () => this.toggleWidget());
        widget.querySelector('#pomodoroStart')?.addEventListener('click', () => this.toggleTimer());
        widget.querySelector('#pomodoroReset')?.addEventListener('click', () => this.reset());
    },

    toggleWidget(): void {
        if (this.widget) {
            this.widget.classList.toggle('visible');
        }
    },

    toggleTimer(): void {
        if (this.isRunning) {
            this.pause();
        } else {
            this.start();
        }
    },

    start(): void {
        this.isRunning = true;
        this.isPaused = false;

        const startBtn = document.querySelector('#pomodoroStart');
        if (startBtn) startBtn.textContent = 'Paus';

        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();

            if (this.timeLeft <= 0) {
                this.completeSession();
            }
        }, 1000);

        SoundEffects.play('click');
    },

    pause(): void {
        this.isRunning = false;
        this.isPaused = true;

        if (this.interval) clearInterval(this.interval);

        const startBtn = document.querySelector('#pomodoroStart');
        if (startBtn) startBtn.textContent = 'Fortsätt';
    },

    reset(): void {
        this.isRunning = false;
        this.isPaused = false;

        if (this.interval) clearInterval(this.interval);

        this.timeLeft = this.isBreak ? this.breakLength : this.sessionLength;
        this.updateDisplay();

        const startBtn = document.querySelector('#pomodoroStart');
        if (startBtn) startBtn.textContent = 'Start';
    },

    completeSession(): void {
        if (this.interval) clearInterval(this.interval);
        this.isRunning = false;

        if (!this.isBreak) {
            this.sessionsCompleted++;
            this.updateSessionDots();
            XPSystem.addXP(10);
            showToast('🍅 Pomodoro klar! +10 XP', 'success');

            this.isBreak = true;
            this.timeLeft = this.breakLength;
        } else {
            showToast('☕ Paus klar! Tillbaka till jobbet!', 'info');
            this.isBreak = false;
            this.timeLeft = this.sessionLength;
        }

        this.updateDisplay();
        SoundEffects.play('notification');

        if ('vibrate' in navigator) {
            navigator.vibrate([100, 50, 100]);
        }

        const startBtn = document.querySelector('#pomodoroStart');
        if (startBtn) startBtn.textContent = 'Start';
    },

    updateDisplay(): void {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        const timeEl = document.querySelector('#pomodoroTime');
        if (timeEl) timeEl.textContent = display;
    },

    updateSessionDots(): void {
        const dots = document.querySelectorAll('.pomodoro-session-dot');
        dots.forEach((dot, index) => {
            if (index < this.sessionsCompleted) {
                dot.classList.add('completed');
            }
        });
    }
};

// ============================================================
// SOUND EFFECTS - المؤثرات الصوتية
// ============================================================

export const SoundEffects = {
    enabled: true,
    volume: 0.5,

    sounds: {
        success: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU',
        error: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU',
        click: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU',
        achievement: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU',
        levelUp: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU',
        notification: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU',
        mysteryBox: 'data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'
    } as Record<string, string>,

    init(): void {
        this.enabled = localStorage.getItem('soundEnabled') !== 'false';
        // Button creation now handled by unified FAB menu
        // this.createToggle();
    },

    createToggle(): void {
        const existing = document.querySelector('.sound-toggle');
        if (existing) return;

        const toggle = document.createElement('button');
        toggle.className = `sound-toggle ${this.enabled ? '' : 'muted'}`;
        toggle.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `;

        toggle.addEventListener('click', () => this.toggle());
        document.body.appendChild(toggle);
    },

    toggle(): void {
        this.enabled = !this.enabled;
        localStorage.setItem('soundEnabled', String(this.enabled));

        const toggle = document.querySelector('.sound-toggle');
        if (toggle) {
            toggle.classList.toggle('muted', !this.enabled);
        }

        if (this.enabled) {
            this.play('click');
        }

        showToast(this.enabled ? '🔊 Ljud på' : '🔇 Ljud av', 'info');
    },

    play(soundName: string): void {
        if (!this.enabled) return;

        // Using Web Audio API for better performance
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            gainNode.gain.value = this.volume * 0.1;

            switch (soundName) {
                case 'success':
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
                    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
                    break;
                case 'error':
                    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                    break;
                case 'click':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                    break;
                case 'achievement':
                case 'levelUp':
                    oscillator.frequency.setValueAtTime(392, audioContext.currentTime); // G4
                    oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime + 0.1); // C5
                    oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.2); // E5
                    oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.3); // G5
                    break;
                case 'notification':
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.1);
                    break;
                default:
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            }

            oscillator.type = 'sine';
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            console.log('Audio not supported');
        }
    }
};

// ============================================================
// CELEBRATIONS - الاحتفالات
// ============================================================

export const Celebrations = {
    confetti(options: { particleCount?: number; spread?: number; origin?: { x: number; y: number } } = {}): void {
        const config = {
            particleCount: options.particleCount || 100,
            spread: options.spread || 70,
            origin: options.origin || { x: 0.5, y: 0.6 }
        };

        // Use canvas-confetti if available
        if (typeof (window as any).confetti === 'function') {
            (window as any).confetti(config);
            return;
        }

        // CSS Fallback
        this.cssConfetti(config.particleCount);
    },

    cssConfetti(count: number = 50): void {
        const container = document.createElement('div');
        container.className = 'confetti-container';

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#fd79a8', '#a29bfe', '#6c5ce7'];

        for (let i = 0; i < count; i++) {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = `${Math.random() * 100}%`;
            piece.style.background = colors[Math.floor(Math.random() * colors.length)];
            piece.style.animationDelay = `${Math.random() * 0.5}s`;
            piece.style.animationDuration = `${2 + Math.random()}s`;
            container.appendChild(piece);
        }

        document.body.appendChild(container);
        setTimeout(() => container.remove(), 3000);
    }
};

// ============================================================
// TOAST NOTIFICATIONS - إشعارات Toast
// ============================================================

import { ToastManager } from './toast-manager';

function showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    // Use unified ToastManager which handles bilingual message parsing
    ToastManager.show(message, { type });
}

// ============================================================
// PROGRESS RING COMPONENT - عنصر حلقة التقدم
// ============================================================

export function createProgressRing(container: HTMLElement, progress: number, size: number = 100, strokeWidth: number = 8): void {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    container.innerHTML = `
        <svg class="progress-ring" width="${size}" height="${size}">
            <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6366f1"/>
                    <stop offset="50%" style="stop-color:#ec4899"/>
                    <stop offset="100%" style="stop-color:#f59e0b"/>
                </linearGradient>
            </defs>
            <circle class="progress-ring-circle-bg"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="${strokeWidth}"
                fill="transparent"
                r="${radius}"
                cx="${size / 2}"
                cy="${size / 2}"/>
            <circle class="progress-ring-circle-progress"
                stroke="url(#progress-gradient)"
                stroke-width="${strokeWidth}"
                fill="transparent"
                r="${radius}"
                cx="${size / 2}"
                cy="${size / 2}"
                style="stroke-dasharray: ${circumference}; stroke-dashoffset: ${offset}"/>
        </svg>
        <span class="progress-ring-text">${Math.round(progress)}%</span>
    `;
    container.className = 'progress-ring-container';
}

// ============================================================
// AUTO INITIALIZATION - التهيئة التلقائية
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all premium features
    setTimeout(() => {
        FocusMode.init();
        SoundEffects.init();
        PomodoroTimer.init();
        Achievements.loadUnlocked();
        DailyGoals.load();

        // Update streak
        DailyGoals.updateProgress('streak', 1);
    }, 500);
});

// Global exports
if (typeof window !== 'undefined') {
    (window as any).FocusMode = FocusMode;
    (window as any).XPSystem = XPSystem;
    (window as any).Achievements = Achievements;
    (window as any).DailyGoals = DailyGoals;
    (window as any).MysteryBox = MysteryBox;
    (window as any).PomodoroTimer = PomodoroTimer;
    (window as any).SoundEffects = SoundEffects;
    (window as any).Celebrations = Celebrations;
    (window as any).createProgressRing = createProgressRing;
    (window as any).showToast = showToast;
}
