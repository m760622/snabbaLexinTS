/**
 * Daily Challenge System
 * A unified daily learning goal
 */

interface DailyChallenge {
    date: string;
    wordsTarget: number;
    wordsCompleted: number;
    gamesPlayed: string[];
    completed: boolean;
    streakDays: number;
}

const DAILY_KEY = 'snabbalexin_daily';
const STREAK_KEY = 'snabbalexin_streak';

class DailyChallengeManager {
    private challenge: DailyChallenge | null = null;

    constructor() {
        this.load();
    }

    private getToday(): string {
        return new Date().toISOString().split('T')[0];
    }

    private load(): void {
        try {
            const saved = localStorage.getItem(DAILY_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed.date === this.getToday()) {
                    this.challenge = parsed;
                    return;
                }
            }
            // Create new challenge for today
            this.createNewChallenge();
        } catch {
            this.createNewChallenge();
        }
    }

    private createNewChallenge(): void {
        const streak = this.getStreak();
        this.challenge = {
            date: this.getToday(),
            wordsTarget: 5,
            wordsCompleted: 0,
            gamesPlayed: [],
            completed: false,
            streakDays: streak
        };
        this.save();
    }

    private save(): void {
        if (this.challenge) {
            localStorage.setItem(DAILY_KEY, JSON.stringify(this.challenge));
        }
    }

    private getStreak(): number {
        try {
            const saved = localStorage.getItem(STREAK_KEY);
            if (!saved) return 0;

            const { date, count } = JSON.parse(saved);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];

            if (date === yesterdayStr || date === this.getToday()) {
                return count;
            }
            return 0;
        } catch {
            return 0;
        }
    }

    private updateStreak(): void {
        const streak = this.getStreak() + 1;
        localStorage.setItem(STREAK_KEY, JSON.stringify({
            date: this.getToday(),
            count: streak
        }));
        if (this.challenge) {
            this.challenge.streakDays = streak;
        }
    }

    public addWord(): void {
        if (!this.challenge) return;

        this.challenge.wordsCompleted++;

        if (this.challenge.wordsCompleted >= this.challenge.wordsTarget && !this.challenge.completed) {
            this.challenge.completed = true;
            this.updateStreak();
            this.showCompletionCelebration();
        }

        this.save();
    }

    public addGamePlayed(gameId: string): void {
        if (!this.challenge) return;
        if (!this.challenge.gamesPlayed.includes(gameId)) {
            this.challenge.gamesPlayed.push(gameId);
            this.save();
        }
    }

    public getProgress(): { completed: number; target: number; percentage: number; isComplete: boolean } {
        if (!this.challenge) {
            return { completed: 0, target: 5, percentage: 0, isComplete: false };
        }
        return {
            completed: this.challenge.wordsCompleted,
            target: this.challenge.wordsTarget,
            percentage: Math.min(100, Math.round((this.challenge.wordsCompleted / this.challenge.wordsTarget) * 100)),
            isComplete: this.challenge.completed
        };
    }

    public getStreakDays(): number {
        return this.challenge?.streakDays || 0;
    }

    private showCompletionCelebration(): void {
        // Trigger confetti if available
        if (typeof (window as any).triggerConfetti === 'function') {
            (window as any).triggerConfetti();
        }

        // Show toast
        if (typeof (window as any).showToast === 'function') {
            (window as any).showToast('🎉 أكملت تحدي اليوم! / Dagens utmaning klar!', 'success');
        }
    }
}

export const dailyChallenge = new DailyChallengeManager();

// Global access
(window as any).dailyChallenge = dailyChallenge;

/**
 * Render Daily Challenge Widget
 */
export function renderDailyChallengeWidget(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const progress = dailyChallenge.getProgress();
    const streak = dailyChallenge.getStreakDays();

    container.innerHTML = `
        <div class="daily-widget ${progress.isComplete ? 'completed' : ''}">
            <div class="daily-widget-header">
                <span class="daily-widget-title">📅 تحدي اليوم / Dagens Utmaning</span>
                ${streak > 0 ? `<span class="daily-streak">🔥 ${streak}</span>` : ''}
            </div>
            <div class="daily-widget-progress">
                <div class="daily-progress-bar">
                    <div class="daily-progress-fill" style="width: ${progress.percentage}%"></div>
                </div>
                <span class="daily-progress-text">${progress.completed}/${progress.target}</span>
            </div>
            ${progress.isComplete
            ? '<div class="daily-complete-badge">✅ مكتمل / Klart!</div>'
            : '<div class="daily-hint">تعلم 5 كلمات جديدة / Lär dig 5 nya ord</div>'}
        </div>
    `;
}

(window as any).renderDailyChallengeWidget = renderDailyChallengeWidget;
