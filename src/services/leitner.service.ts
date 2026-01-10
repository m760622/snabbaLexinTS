interface LeitnerData {
    [wordId: string]: {
        box: number;
        lastReview: number;
        nextReview: number;
    };
}

const STORAGE_KEY = 'flashcard_leitner_data';
const BOX_INTERVALS = [1, 3, 7, 14, 30]; // Days

export const LeitnerService = {
    getData(): LeitnerData {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
        } catch { return {}; }
    },

    saveData(data: LeitnerData): void {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    getWordBox(wordId: string): number {
        const data = this.getData();
        return data[wordId]?.box || 1;
    },

    promoteWord(wordId: string): number {
        const data = this.getData();
        const currentBox = data[wordId]?.box || 1;
        const newBox = Math.min(currentBox + 1, 5);
        data[wordId] = {
            box: newBox,
            lastReview: Date.now(),
            nextReview: Date.now() + (BOX_INTERVALS[newBox - 1] * 24 * 60 * 60 * 1000)
        };
        this.saveData(data);
        return newBox;
    },

    demoteWord(wordId: string): number {
        const data = this.getData();
        data[wordId] = {
            box: 1,
            lastReview: Date.now(),
            nextReview: Date.now() + (24 * 60 * 60 * 1000)
        };
        this.saveData(data);
        return 1;
    },

    getBoxIcon(box: number): string {
        const icons = ['❄️', '🌱', '🌿', '🌳', '🔥'];
        return icons[box - 1] || icons[0];
    },

    getDueWords(): string[] {
        const data = this.getData();
        const now = Date.now();
        return Object.entries(data)
            .filter(([, info]) => info.nextReview <= now)
            .map(([id]) => id);
    }
};
