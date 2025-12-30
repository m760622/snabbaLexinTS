/**
 * Mistakes Review System
 * Track and review words the user got wrong
 */

export interface MistakeEntry {
    word: string;
    translation: string;
    game: string;
    timestamp: number;
    attempts: number;
    correctAnswer?: string;
}

const MISTAKES_KEY = 'snabbalexin_mistakes';
const MAX_MISTAKES = 50;

class MistakesManager {
    private mistakes: MistakeEntry[] = [];

    constructor() {
        this.load();
    }

    private load(): void {
        try {
            const saved = localStorage.getItem(MISTAKES_KEY);
            this.mistakes = saved ? JSON.parse(saved) : [];
        } catch {
            this.mistakes = [];
        }
    }

    private save(): void {
        // Keep only most recent mistakes
        if (this.mistakes.length > MAX_MISTAKES) {
            this.mistakes = this.mistakes.slice(-MAX_MISTAKES);
        }
        localStorage.setItem(MISTAKES_KEY, JSON.stringify(this.mistakes));
    }

    public addMistake(entry: Omit<MistakeEntry, 'timestamp' | 'attempts'>): void {
        const existing = this.mistakes.find(m => m.word === entry.word);

        if (existing) {
            existing.attempts++;
            existing.timestamp = Date.now();
        } else {
            this.mistakes.push({
                ...entry,
                timestamp: Date.now(),
                attempts: 1
            });
        }

        this.save();
    }

    public markAsLearned(word: string): void {
        this.mistakes = this.mistakes.filter(m => m.word !== word);
        this.save();
    }

    public getMistakes(): MistakeEntry[] {
        return [...this.mistakes].sort((a, b) => b.attempts - a.attempts);
    }

    public getTopMistakes(count = 10): MistakeEntry[] {
        return this.getMistakes().slice(0, count);
    }

    public getMistakeCount(): number {
        return this.mistakes.length;
    }

    public getFrequentMistakes(): MistakeEntry[] {
        return this.mistakes.filter(m => m.attempts >= 2);
    }

    public clearAll(): void {
        this.mistakes = [];
        this.save();
    }
}

export const mistakesManager = new MistakesManager();

// Global access
(window as any).mistakesManager = mistakesManager;

/**
 * Render Mistakes Review UI
 */
export function renderMistakesReview(containerId: string): void {
    const container = document.getElementById(containerId);
    if (!container) return;

    const mistakes = mistakesManager.getMistakes();

    if (mistakes.length === 0) {
        container.innerHTML = `
            <div class="mistakes-empty">
                <div class="mistakes-empty-icon">🎉</div>
                <h3>No Mistakes Yet!</h3>
                <p>لا توجد أخطاء بعد! / Inga fel ännu!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="mistakes-header">
            <h2>مراجعة أخطائي / Mina Fel</h2>
            <span class="mistakes-count">${mistakes.length} كلمة / ord</span>
        </div>
        <div class="mistakes-list">
            ${mistakes.map(m => `
                <div class="mistake-card" data-word="${m.word}">
                    <div class="mistake-word">${m.word}</div>
                    <div class="mistake-translation">${m.translation}</div>
                    <div class="mistake-meta">
                        <span class="mistake-attempts">❌ ${m.attempts} مرة</span>
                        <span class="mistake-game">${m.game}</span>
                    </div>
                    <div class="mistake-actions">
                        <button class="mistake-practice" onclick="practiceMistake('${m.word}')">
                            🎯 تمرن / Öva
                        </button>
                        <button class="mistake-learned" onclick="markLearned('${m.word}')">
                            ✓ تعلمتها
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Global functions
(window as any).renderMistakesReview = renderMistakesReview;
(window as any).practiceMistake = (word: string) => {
    // TODO: Navigate to flashcard with this word
    console.log('Practice:', word);
};
(window as any).markLearned = (word: string) => {
    mistakesManager.markAsLearned(word);
    renderMistakesReview('mistakesContainer');
};
