/**
 * ProgressManager - Track user activity, streaks, and achievements
 */

export interface DailyData {
    date: string;
    searches: number;
    wordsViewed: string[];
    ttsUsed: number;
    gamesPlayed: number;
}

export interface WeeklyData {
    weekStart: string;
    searches: number;
    wordsViewed: number;
    gamesPlayed: number;
}

export interface AllTimeData {
    totalSearches: number;
    totalWordsViewed: number;
    totalTtsUsed: number;
    totalGamesPlayed: number;
    uniqueWordsViewed: string[];
    firstUse: string;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;
}

export interface AchievementStatus {
    id: string;
    unlockedAt: string;
}

export interface LearningProgress {
    daily: DailyData;
    weekly: WeeklyData;
    allTime: AllTimeData;
    achievements: AchievementStatus[];
}

export const ProgressManager = {
    STORAGE_KEY: 'learningProgress',

    getDefaultData(): LearningProgress {
        return {
            daily: {
                date: this.getTodayString(),
                searches: 0,
                wordsViewed: [],
                ttsUsed: 0,
                gamesPlayed: 0
            },
            weekly: {
                weekStart: this.getWeekStartString(),
                searches: 0,
                wordsViewed: 0,
                gamesPlayed: 0
            },
            allTime: {
                totalSearches: 0,
                totalWordsViewed: 0,
                totalTtsUsed: 0,
                totalGamesPlayed: 0,
                uniqueWordsViewed: [],
                firstUse: new Date().toISOString(),
                currentStreak: 0,
                longestStreak: 0,
                lastActiveDate: null
            },
            achievements: []
        };
    },

    getTodayString(): string {
        return new Date().toISOString().split('T')[0];
    },

    getWeekStartString(): string {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const monday = new Date(now.setDate(diff));
        return monday.toISOString().split('T')[0];
    },

    getData(): LearningProgress {
        try {
            const saved = localStorage.getItem(this.STORAGE_KEY);
            if (saved) {
                const data = JSON.parse(saved) as LearningProgress;
                if (data.daily.date !== this.getTodayString()) {
                    data.daily = {
                        date: this.getTodayString(),
                        searches: 0,
                        wordsViewed: [],
                        ttsUsed: 0,
                        gamesPlayed: 0
                    };
                }
                if (data.weekly.weekStart !== this.getWeekStartString()) {
                    data.weekly = {
                        weekStart: this.getWeekStartString(),
                        searches: 0,
                        wordsViewed: 0,
                        gamesPlayed: 0
                    };
                }
                return data;
            }
        } catch (e) {
            console.error('Error loading progress:', e);
        }
        return this.getDefaultData();
    },

    saveData(data: LearningProgress): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    },

    trackSearch(query: string): void {
        if (!query || query.length < 2) return;
        const data = this.getData();
        data.daily.searches++;
        data.weekly.searches++;
        data.allTime.totalSearches++;
        this.updateStreak(data);
        this.saveData(data);
        this.checkAchievements(data);
        this.dispatchProgressEvent('search', { query, dailyCount: data.daily.searches });
    },

    trackWordView(wordId: string, word: any): void {
        if (!wordId) return;
        const data = this.getData();
        if (!data.daily.wordsViewed.includes(wordId)) {
            data.daily.wordsViewed.push(wordId);
        }
        data.allTime.totalWordsViewed++;
        if (!data.allTime.uniqueWordsViewed.includes(wordId)) {
            data.allTime.uniqueWordsViewed.push(wordId);
        }
        this.updateStreak(data);
        this.saveData(data);
        this.checkAchievements(data);
        this.dispatchProgressEvent('wordView', {
            wordId,
            word,
            dailyCount: data.daily.wordsViewed.length,
            totalUnique: data.allTime.uniqueWordsViewed.length
        });
    },

    trackTTS(word: string): void {
        const data = this.getData();
        data.daily.ttsUsed++;
        data.allTime.totalTtsUsed++;
        this.saveData(data);
        this.dispatchProgressEvent('tts', { word, dailyCount: data.daily.ttsUsed });
    },

    trackGame(gameName: string, score: number): void {
        const data = this.getData();
        data.daily.gamesPlayed++;
        data.weekly.gamesPlayed++;
        data.allTime.totalGamesPlayed++;
        this.updateStreak(data);
        this.saveData(data);
        this.checkAchievements(data);
        this.dispatchProgressEvent('game', { gameName, score, dailyCount: data.daily.gamesPlayed });
    },

    updateStreak(data: LearningProgress): void {
        const today = this.getTodayString();
        const lastActive = data.allTime.lastActiveDate;
        if (lastActive === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];

        if (lastActive === yesterdayString) {
            data.allTime.currentStreak++;
        } else {
            data.allTime.currentStreak = 1;
        }

        if (data.allTime.currentStreak > data.allTime.longestStreak) {
            data.allTime.longestStreak = data.allTime.currentStreak;
        }
        data.allTime.lastActiveDate = today;
    },

    ACHIEVEMENTS: [
        { id: 'first_search', name: 'Första sökning', icon: '🔍', condition: (d: any) => d.allTime.totalSearches >= 1 },
        { id: 'first_step', name: 'Första steget', icon: '🌟', condition: (d: any) => d.allTime.uniqueWordsViewed.length >= 1 },
        { id: 'word_explorer', name: '10 ord', icon: '📚', condition: (d: any) => d.allTime.uniqueWordsViewed.length >= 10 },
        { id: 'streak_3', name: '3 dagars streak', icon: '🔥', condition: (d: any) => d.allTime.currentStreak >= 3 },
        { id: 'master', name: 'Mästare', icon: '👑', condition: (d: any) => d.allTime.uniqueWordsViewed.length >= 200 }
    ],

    checkAchievements(data: LearningProgress): void {
        const newAchievements: any[] = [];
        this.ACHIEVEMENTS.forEach(a => {
            const alreadyUnlocked = data.achievements.find(ua => ua.id === a.id);
            if (!alreadyUnlocked && a.condition(data)) {
                data.achievements.push({ id: a.id, unlockedAt: new Date().toISOString() });
                newAchievements.push(a);
            }
        });

        if (newAchievements.length > 0) {
            this.saveData(data);
            newAchievements.forEach(a => {
                this.dispatchProgressEvent('achievement', a);
                const showToast = (window as any).showToast;
                if (typeof showToast === 'function') showToast(`🏆 Achievement: ${a.name} ${a.icon}`);
            });
        }
    },

    dispatchProgressEvent(type: string, detail: any): void {
        const event = new CustomEvent('progressUpdate', { detail: { type, ...detail } });
        document.dispatchEvent(event);
    }
};

if (typeof window !== 'undefined') {
    (window as any).ProgressManager = ProgressManager;
}
