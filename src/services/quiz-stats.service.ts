/**
 * QuizStats - Tracks quiz performance and statistics
 */

export interface QuizSession {
    date: string;
    mode: string;
    correct: number;
    wrong: number;
    streak: number;
    avgTime: number;
    totalTime: number;
}

export interface QuizStatsData {
    totalCorrect: number;
    totalWrong: number;
    bestStreak: number;
    currentStreak: number;
    totalQuizzes: number;
    todayCorrect: number;
    todayWrong: number;
    todayStudied: number;
    todayDate: string;
    weeklyCorrect: number;
    weeklyWrong: number;
    weekStart: string;
    avgResponseTime: number;
    fastestResponse: number;
    wordAttempts: Record<string, { correct: number; wrong: number; lastSeen: number }>;
}

class QuizStatsManager {
    private readonly STORAGE_KEY = 'quizStats';
    private stats: QuizStatsData;
    private sessionCorrect = 0;
    private sessionWrong = 0;
    private sessionStreak = 0;
    private sessionBestStreak = 0;
    private sessionTimes: number[] = [];
    private questionStartTime = 0;

    constructor() {
        this.stats = this.load();
        this.checkDateReset();
    }

    private load(): QuizStatsData {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        if (saved) {
            return JSON.parse(saved);
        }
        return this.getDefaultStats();
    }

    private getDefaultStats(): QuizStatsData {
        return {
            totalCorrect: 0,
            totalWrong: 0,
            bestStreak: 0,
            currentStreak: 0,
            totalQuizzes: 0,
            todayCorrect: 0,
            todayWrong: 0,
            todayStudied: 0,
            todayDate: new Date().toISOString().split('T')[0],
            weeklyCorrect: 0,
            weeklyWrong: 0,
            weekStart: this.getWeekStart(),
            avgResponseTime: 0,
            fastestResponse: Infinity,
            wordAttempts: {}
        };
    }

    private getWeekStart(): string {
        const now = new Date();
        const day = now.getDay();
        const diff = now.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(now.setDate(diff)).toISOString().split('T')[0];
    }

    private checkDateReset(): void {
        const today = new Date().toISOString().split('T')[0];
        if (this.stats.todayDate !== today) {
            this.stats.todayCorrect = 0;
            this.stats.todayWrong = 0;
            this.stats.todayStudied = 0;
            this.stats.todayDate = today;
        }

        const weekStart = this.getWeekStart();
        if (this.stats.weekStart !== weekStart) {
            this.stats.weeklyCorrect = 0;
            this.stats.weeklyWrong = 0;
            this.stats.weekStart = weekStart;
        }

        this.save();
    }

    private save(): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.stats));
    }

    public startQuestion(): void {
        this.questionStartTime = Date.now();
    }

    public recordAnswer(wordId: string, isCorrect: boolean): number {
        const responseTime = Date.now() - this.questionStartTime;
        this.sessionTimes.push(responseTime);

        if (isCorrect) {
            this.stats.totalCorrect++;
            this.stats.todayCorrect++;
            this.stats.weeklyCorrect++;
            this.stats.currentStreak++;
            this.sessionCorrect++;
            this.sessionStreak++;

            if (this.stats.currentStreak > this.stats.bestStreak) {
                this.stats.bestStreak = this.stats.currentStreak;
            }
            if (this.sessionStreak > this.sessionBestStreak) {
                this.sessionBestStreak = this.sessionStreak;
            }
            if (responseTime < this.stats.fastestResponse) {
                this.stats.fastestResponse = responseTime;
            }
        } else {
            this.stats.totalWrong++;
            this.stats.todayWrong++;
            this.stats.weeklyWrong++;
            this.stats.currentStreak = 0;
            this.sessionWrong++;
            this.sessionStreak = 0;
        }

        // Track word attempts
        if (!this.stats.wordAttempts[wordId]) {
            this.stats.wordAttempts[wordId] = { correct: 0, wrong: 0, lastSeen: Date.now() };
        }
        if (isCorrect) {
            this.stats.wordAttempts[wordId].correct++;
        } else {
            this.stats.wordAttempts[wordId].wrong++;
        }
        this.stats.wordAttempts[wordId].lastSeen = Date.now();

        // Update average response time
        const allTimes = this.sessionTimes;
        this.stats.avgResponseTime = allTimes.reduce((a, b) => a + b, 0) / allTimes.length;

        this.save();
        return responseTime;
    }

    public recordStudy(wordId: string): void {
        const today = new Date().toISOString().split('T')[0];
        if (this.stats.todayDate !== today) {
            this.checkDateReset();
        }

        this.stats.todayStudied++;
        
        // Also track as a "seen" attempt if not already there
        if (!this.stats.wordAttempts[wordId]) {
            this.stats.wordAttempts[wordId] = { correct: 0, wrong: 0, lastSeen: Date.now() };
        } else {
            this.stats.wordAttempts[wordId].lastSeen = Date.now();
        }
        
        this.save();
    }

    public endSession(): void {
        this.stats.totalQuizzes++;
        this.save();
        this.resetSession();
    }

    public resetSession(): void {
        this.sessionCorrect = 0;
        this.sessionWrong = 0;
        this.sessionStreak = 0;
        this.sessionBestStreak = 0;
        this.sessionTimes = [];
    }

    // Getters
    public getStats(): QuizStatsData {
        return { ...this.stats };
    }

    public getSessionStats() {
        return {
            correct: this.sessionCorrect,
            wrong: this.sessionWrong,
            streak: this.sessionStreak,
            bestStreak: this.sessionBestStreak,
            avgTime: this.sessionTimes.length > 0 
                ? this.sessionTimes.reduce((a, b) => a + b, 0) / this.sessionTimes.length 
                : 0
        };
    }

    public getTodayStats() {
        return {
            correct: this.stats.todayCorrect,
            wrong: this.stats.todayWrong,
            studied: this.stats.todayStudied || 0,
            total: this.stats.todayCorrect + this.stats.todayWrong + (this.stats.todayStudied || 0)
        };
    }

    public getWeakWords(limit = 10): string[] {
        const entries = Object.entries(this.stats.wordAttempts);
        return entries
            .filter(([_, data]) => data.wrong > data.correct)
            .sort((a, b) => (b[1].wrong - b[1].correct) - (a[1].wrong - a[1].correct))
            .slice(0, limit)
            .map(([id]) => id);
    }

    public getAccuracy(): number {
        const total = this.stats.totalCorrect + this.stats.totalWrong;
        return total > 0 ? Math.round((this.stats.totalCorrect / total) * 100) : 0;
    }

    public formatTime(ms: number): string {
        if (ms === Infinity || ms === 0) return '-';
        return (ms / 1000).toFixed(1) + 's';
    }
}

export const QuizStats = new QuizStatsManager();

// Global export
if (typeof window !== 'undefined') {
    (window as any).QuizStats = QuizStats;
}
