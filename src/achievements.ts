import { showToast } from './utils';
import { QuizStats } from './quiz-stats';

/**
 * Achievement Definitions
 */
export interface Achievement {
    id: string;
    title: string;
    titleAr: string;
    description: string;
    icon: string;
    condition: () => boolean;
}

const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_quiz',
        title: 'Första testet',
        titleAr: 'الاختبار الأول',
        description: 'Avsluta ditt första quiz',
        icon: '🎯',
        condition: () => QuizStats.getStats().totalQuizzes >= 1
    },
    {
        id: 'streak_5',
        title: '5 i rad',
        titleAr: '5 متتالية',
        description: 'Få 5 rätt svar i rad',
        icon: '🔥',
        condition: () => QuizStats.getStats().bestStreak >= 5
    },
    {
        id: 'streak_10',
        title: '10 i rad',
        titleAr: '10 متتالية',
        description: 'Få 10 rätt svar i rad',
        icon: '⚡',
        condition: () => QuizStats.getStats().bestStreak >= 10
    },
    {
        id: 'correct_50',
        title: '50 rätt',
        titleAr: '50 صحيح',
        description: 'Svara rätt på 50 frågor totalt',
        icon: '📚',
        condition: () => QuizStats.getStats().totalCorrect >= 50
    },
    {
        id: 'correct_100',
        title: '100 rätt',
        titleAr: '100 صحيح',
        description: 'Svara rätt på 100 frågor totalt',
        icon: '🏆',
        condition: () => QuizStats.getStats().totalCorrect >= 100
    },
    {
        id: 'correct_500',
        title: 'Ordmästare',
        titleAr: 'سيد الكلمات',
        description: 'Svara rätt på 500 frågor totalt',
        icon: '👑',
        condition: () => QuizStats.getStats().totalCorrect >= 500
    },
    {
        id: 'speed_demon',
        title: 'Snabbtänkt',
        titleAr: 'سريع البديهة',
        description: 'Svara på under 2 sekunder',
        icon: '⏱️',
        condition: () => QuizStats.getStats().fastestResponse < 2000
    },
    {
        id: 'perfect_10',
        title: 'Perfekt 10',
        titleAr: 'عشرة مثالية',
        description: 'Få 10/10 i ett quiz',
        icon: '💯',
        condition: () => false // Triggered manually
    },
    {
        id: 'accuracy_90',
        title: 'Träffsäker',
        titleAr: 'دقة عالية',
        description: 'Uppnå 90% noggrannhet (minst 50 svar)',
        icon: '🎯',
        condition: () => {
            const stats = QuizStats.getStats();
            const total = stats.totalCorrect + stats.totalWrong;
            return total >= 50 && QuizStats.getAccuracy() >= 90;
        }
    },
    {
        id: 'quiz_10',
        title: 'Flitig övare',
        titleAr: 'متدرب مجتهد',
        description: 'Avsluta 10 quiz',
        icon: '📝',
        condition: () => QuizStats.getStats().totalQuizzes >= 10
    }
];

class AchievementsManager {
    private readonly STORAGE_KEY = 'achievements';
    private unlocked: Set<string>;

    constructor() {
        this.unlocked = this.load();
    }

    private load(): Set<string> {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            return new Set(JSON.parse(saved));
        }
        return new Set();
    }

    private save(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(this.unlocked)));
    }

    public check(): Achievement[] {
        const newlyUnlocked: Achievement[] = [];

        for (const achievement of ACHIEVEMENTS) {
            if (!this.unlocked.has(achievement.id) && achievement.condition()) {
                this.unlock(achievement);
                newlyUnlocked.push(achievement);
            }
        }

        return newlyUnlocked;
    }

    public unlock(achievement: Achievement): void {
        if (this.unlocked.has(achievement.id)) return;

        this.unlocked.add(achievement.id);
        this.save();

        // Show achievement toast
        showToast(`${achievement.icon} ${achievement.title} - ${achievement.titleAr}`);

        // Play celebration sound if available
        this.playCelebration();
    }

    public unlockById(id: string): void {
        const achievement = ACHIEVEMENTS.find(a => a.id === id);
        if (achievement) {
            this.unlock(achievement);
        }
    }

    private playCelebration(): void {
        // Could add a celebratory sound here
    }

    public getUnlocked(): Achievement[] {
        return ACHIEVEMENTS.filter(a => this.unlocked.has(a.id));
    }

    public getLocked(): Achievement[] {
        return ACHIEVEMENTS.filter(a => !this.unlocked.has(a.id));
    }

    public getProgress(): { unlocked: number; total: number; percent: number } {
        return {
            unlocked: this.unlocked.size,
            total: ACHIEVEMENTS.length,
            percent: Math.round((this.unlocked.size / ACHIEVEMENTS.length) * 100)
        };
    }

    public getAll(): Achievement[] {
        return ACHIEVEMENTS;
    }
}

export const Achievements = new AchievementsManager();

// Global export
if (typeof window !== 'undefined') {
    (window as any).Achievements = Achievements;
}
