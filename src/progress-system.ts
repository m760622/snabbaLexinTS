/**
 * Progress System
 * XP, Levels, and Achievements
 */

interface UserProgress {
    xp: number;
    level: number;
    totalWords: number;
    gamesCompleted: number;
    achievements: string[];
    lastActive: string;
}

const PROGRESS_KEY = 'snabbalexin_progress';

// XP required per level (exponential growth)
const XP_PER_LEVEL = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    1000,   // Level 5
    2000,   // Level 6
    4000,   // Level 7
    7000,   // Level 8
    10000,  // Level 9
    15000   // Level 10
];

const LEVEL_NAMES = [
    { sv: 'Nybörjare', ar: 'مبتدئ' },
    { sv: 'Lärling', ar: 'متدرب' },
    { sv: 'Student', ar: 'طالب' },
    { sv: 'Utforskare', ar: 'مستكشف' },
    { sv: 'Kunnig', ar: 'ماهر' },
    { sv: 'Expert', ar: 'خبير' },
    { sv: 'Mästare', ar: 'أستاذ' },
    { sv: 'Veteran', ar: 'محترف' },
    { sv: 'Legend', ar: 'أسطورة' },
    { sv: 'Champion', ar: 'بطل' }
];

class ProgressManager {
    private progress: UserProgress;

    constructor() {
        this.progress = this.load();
    }

    private load(): UserProgress {
        try {
            const saved = localStorage.getItem(PROGRESS_KEY);
            if (saved) return JSON.parse(saved);
        } catch { }

        return {
            xp: 0,
            level: 1,
            totalWords: 0,
            gamesCompleted: 0,
            achievements: [],
            lastActive: new Date().toISOString()
        };
    }

    private save(): void {
        this.progress.lastActive = new Date().toISOString();
        localStorage.setItem(PROGRESS_KEY, JSON.stringify(this.progress));
    }

    private calculateLevel(xp: number): number {
        for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
            if (xp >= XP_PER_LEVEL[i]) return i + 1;
        }
        return 1;
    }

    public addXP(amount: number, reason?: string): void {
        const oldLevel = this.progress.level;
        this.progress.xp += amount;
        this.progress.level = this.calculateLevel(this.progress.xp);

        if (this.progress.level > oldLevel) {
            this.onLevelUp(this.progress.level);
        }

        this.save();

        // Show XP gain toast
        if (typeof (window as any).showToast === 'function' && reason) {
            (window as any).showToast(`+${amount} XP: ${reason}`, 'success');
        }
    }

    public addWord(): void {
        this.progress.totalWords++;
        this.addXP(10, 'كلمة جديدة / Nytt ord');
    }

    public completeGame(gameId: string): void {
        this.progress.gamesCompleted++;
        this.addXP(25, 'لعبة مكتملة / Spel klart');
    }

    private onLevelUp(newLevel: number): void {
        const levelName = LEVEL_NAMES[newLevel - 1] || LEVEL_NAMES[LEVEL_NAMES.length - 1];

        // Trigger confetti
        if (typeof (window as any).triggerConfetti === 'function') {
            (window as any).triggerConfetti();
        }

        // Show level up modal
        if (typeof (window as any).showToast === 'function') {
            (window as any).showToast(
                `🎉 Level ${newLevel}! ${levelName.ar} / ${levelName.sv}`,
                'success'
            );
        }
    }

    public getProgress(): UserProgress {
        return { ...this.progress };
    }

    public getLevelProgress(): { current: number; next: number; percentage: number } {
        const currentLevelXP = XP_PER_LEVEL[this.progress.level - 1] || 0;
        const nextLevelXP = XP_PER_LEVEL[this.progress.level] || XP_PER_LEVEL[XP_PER_LEVEL.length - 1];
        const xpInLevel = this.progress.xp - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;

        return {
            current: xpInLevel,
            next: xpNeeded,
            percentage: Math.round((xpInLevel / xpNeeded) * 100)
        };
    }

    public getLevelName(): { sv: string; ar: string } {
        return LEVEL_NAMES[this.progress.level - 1] || LEVEL_NAMES[0];
    }
}

export const progressManager = new ProgressManager();

// Global access
(window as any).progressManager = progressManager;

/**
 * Render Progress Widget
 */
export function renderProgressWidget(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const progress = progressManager.getProgress();
    const levelProgress = progressManager.getLevelProgress();
    const levelName = progressManager.getLevelName();

    container.innerHTML = `
        <div class="progress-widget">
            <div class="progress-level">
                <span class="level-badge">Lv.${progress.level}</span>
                <span class="level-name">${levelName.ar} / ${levelName.sv}</span>
            </div>
            <div class="progress-xp">
                <div class="xp-bar">
                    <div class="xp-fill" style="width: ${levelProgress.percentage}%"></div>
                </div>
                <span class="xp-text">${levelProgress.current} / ${levelProgress.next} XP</span>
            </div>
            <div class="progress-stats">
                <div class="stat">
                    <span class="stat-value">${progress.totalWords}</span>
                    <span class="stat-label">كلمة / Ord</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${progress.gamesCompleted}</span>
                    <span class="stat-label">لعبة / Spel</span>
                </div>
            </div>
        </div>
    `;
}

(window as any).renderProgressWidget = renderProgressWidget;
