/**
 * SmartWordSelector - Intelligent Word Selection System
 * 
 * Prioritizes words based on:
 * 1. Mistakes (High Priority)
 * 2. New/Unseen Words (Medium Priority)
 * 3. Already learned words (Low Priority)
 */

import { mistakesManager, MistakeEntry } from './mistakes.service';

const SEEN_WORDS_KEY = 'snabbalexin_seen_words';
const MISTAKES_KEY = 'snabbalexin_mistakes';

export class SmartWordSelector {
    /**
     * Selects words from a pool using weighted random selection
     * 
     * @param pool The array of words to choose from (assumes row format where index 2 is Swedish)
     * @param count Number of words to select
     * @returns Array of selected words
     */
    public static select(pool: any[], count: number = 1): any[] {
        if (!pool || pool.length === 0) return [];
        if (pool.length <= count) return [...pool];

        const mistakes = this.getMistakes();
        const seenWords = this.getSeenWords();

        // 1. Calculate weights for all words in pool
        const weightedPool = pool.map(word => {
            const wordText = word[2]?.toString() || '';
            let weight = 1; // Default weight

            // Priority 1: Words with mistakes (Highest Priority: +20)
            const mistake = mistakes.find(m => m.word === wordText);
            if (mistake) {
                weight += 20;
            }

            // Priority 2: New words not seen before (Medium Priority: +5)
            if (!seenWords.has(wordText)) {
                weight += 5;
            }

            return { word, weight };
        });

        // 2. Perform Weighted Random Selection
        const selected: any[] = [];
        const poolCopy = [...weightedPool];

        for (let i = 0; i < count; i++) {
            if (poolCopy.length === 0) break;

            const totalWeight = poolCopy.reduce((sum, item) => sum + item.weight, 0);
            let random = Math.random() * totalWeight;
            
            for (let j = 0; j < poolCopy.length; j++) {
                random -= poolCopy[j].weight;
                if (random <= 0) {
                    const picked = poolCopy.splice(j, 1)[0];
                    console.log(`🤖 Smart Select: ${picked.word[2]} (Weight: ${picked.weight})`);
                    selected.push(picked.word);
                    break;
                }
            }
        }

        return selected;
    }

    /**
     * Mark a word as seen by the user
     */
    public static markAsSeen(word: string): void {
        if (!word) return;
        const seen = this.getSeenWords();
        if (!seen.has(word)) {
            seen.add(word);
            localStorage.setItem(SEEN_WORDS_KEY, JSON.stringify(Array.from(seen)));
        }
    }

    /**
     * Helper to get mistakes from localStorage
     */
    private static getMistakes(): MistakeEntry[] {
        try {
            const saved = localStorage.getItem(MISTAKES_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    }

    /**
     * Helper to get seen words from localStorage
     */
    private static getSeenWords(): Set<string> {
        try {
            const saved = localStorage.getItem(SEEN_WORDS_KEY);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch {
            return new Set();
        }
    }
}

// Global exposure for non-module scripts
if (typeof window !== 'undefined') {
    (window as any).SmartWordSelector = SmartWordSelector;
}
