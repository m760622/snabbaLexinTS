
import { showToast, TextSizeManager } from '../utils';
import { SmartWordSelector } from '../smart-selector';
import { mistakesManager } from '../mistakes-review';
// Note: We'll assume these are available globally or imported if needed.
// For now, casting (window as any) to access them.

interface LeitnerInfo {
    box: number;
    lastReview: number;
    nextReview: number;
}

const FC_COL_ID = 0;
const FC_COL_TYPE = 1;
const FC_COL_SWE = 2;
const FC_COL_ARB = 3;
const FC_COL_EX_SWE = 7;
const FC_COL_EX_ARB = 8;

export const LeitnerSystem = {
    STORAGE_KEY: 'flashcard_leitner_data',
    BOX_INTERVALS: [1, 3, 7, 14, 30],

    getData(): Record<string, LeitnerInfo> {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        } catch (e) { return {}; }
    },

    saveData(data: Record<string, LeitnerInfo>) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    },

    getWordBox(wordId: string): number {
        const data = this.getData();
        return data[wordId]?.box || 1;
    },

    promoteWord(wordId: string): number {
        const data = this.getData();
        const currentBox = data[wordId]?.box || 1;
        const newBox = Math.min(currentBox + 1, 5) as 1 | 2 | 3 | 4 | 5;
        data[wordId] = {
            box: newBox,
            lastReview: Date.now(),
            nextReview: Date.now() + (this.BOX_INTERVALS[newBox - 1] * 24 * 60 * 60 * 1000)
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
            .filter(([_, info]) => info.nextReview <= now)
            .map(([id]) => id);
    }
};

let flashcardCards: any[] = [];
let flashcardIndex = 0;
let flashcardScore = 0;
let flashcardTotal = 0;
let cardStartTime = 0;
let sessionStats = { correct: 0, wrong: 0, totalTime: 0 };
let touchStartX = 0;
let touchEndX = 0;
let isAutoPlayEnabled = localStorage.getItem('fc_autoplay') !== 'false';

export function initFlashcards(retryCount = 0) {
    const params = new URLSearchParams(window.location.search);
    const isReviewMode = params.get('mode') === 'review';
    const typeFilter = (document.getElementById('flashcardTypeFilter') as HTMLSelectElement)?.value || 'all';
    const dictionaryData = (window as any).dictionaryData;

    if (!dictionaryData || !Array.isArray(dictionaryData) || dictionaryData.length === 0) {
        if (retryCount < 5) {
            setTimeout(() => initFlashcards(retryCount + 1), 500);
        } else {
            showToast("Kunde inte ladda data. / تعذر تحميل البيانات.", { type: 'error' });
        }
        return;
    }

    try {
        let pool = [...dictionaryData];

        if (isReviewMode) {
            const mistakes = mistakesManager.getMistakes();
            if (mistakes.length > 0) {
                const mistakeWords = new Set(mistakes.map(m => m.word));
                flashcardCards = pool.filter(entry => entry && entry[FC_COL_SWE] && mistakeWords.has(entry[FC_COL_SWE]));
                
                const mistakeMap = new Map(mistakes.map(m => [m.word, m.attempts]));
                flashcardCards.sort((a, b) => (mistakeMap.get(b[FC_COL_SWE]) || 0) - (mistakeMap.get(a[FC_COL_SWE]) || 0));
                
                if (flashcardCards.length === 0) {
                    showToast("Kunde inte hitta dina fel i databasen.", { type: 'error' });
                    return;
                }
            } else {
                showToast("Inga fel att repetera! / لا توجد أخطاء للمراجعة!", { type: 'info' });
                return;
            }
        } else {
            if (typeFilter !== 'all') {
                pool = pool.filter(entry => {
                    const type = (entry[FC_COL_TYPE] || '').toLowerCase();
                    return type.includes(typeFilter);
                });
            }

            pool = pool.filter(entry => entry && entry[FC_COL_SWE] && entry[FC_COL_SWE].length > 0);

            if (pool.length === 0) {
                showToast("Inga ord hittades.", { type: 'error' });
                return;
            }

            pool.sort((a, b) => {
                const boxA = LeitnerSystem.getWordBox(String(a[FC_COL_ID]));
                const boxB = LeitnerSystem.getWordBox(String(b[FC_COL_ID]));
                return boxA - boxB;
            });

            // Use Smart Selection to pick 50 words
            flashcardCards = SmartWordSelector.select(pool, 50);
        }
        
        // Mark all picked words as seen
        flashcardCards.forEach(card => {
            SmartWordSelector.markAsSeen(card[FC_COL_SWE]);
        });

        flashcardIndex = 0;
        flashcardScore = 0;
        flashcardTotal = flashcardCards.length;
        sessionStats = { correct: 0, wrong: 0, totalTime: 0 };

        const gameContainer = document.getElementById('flashcardsGame');
        if (gameContainer) gameContainer.style.display = 'block';

        initSegmentedProgress();
        document.getElementById('flashcardProgress')!.textContent = `1/${flashcardTotal}`;

        setupSwipeGestures();
        showNextFlashcard();
        enterFullScreenMode();

    } catch (e) {
        console.error("Flashcards Error:", e);
    }
}

function initSegmentedProgress() {
    const container = document.getElementById('fcSegmentedProgress');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < flashcardTotal; i++) {
        const segment = document.createElement('div');
        segment.className = 'fc-progress-segment';
        segment.id = `fc-seg-${i}`;
        container.appendChild(segment);
    }
}

function updateSegmentedProgress(index: number, status: 'correct' | 'wrong' | null) {
    const segment = document.getElementById(`fc-seg-${index}`);
    if (!segment) return;
    document.querySelectorAll('.fc-progress-segment').forEach(s => s.classList.remove('active'));
    if (status) {
        segment.classList.add('completed', status);
    } else {
        segment.classList.add('active');
    }
}

function setupSwipeGestures() {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;

    flashcard.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchEndX = touchStartX;
    }, { passive: true });

    flashcard.addEventListener('touchmove', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;
        if (Math.abs(diff) > 30) {
            flashcard.style.transform = `translateX(${diff * 0.3}px) rotate(${diff * 0.02}deg)`;
            flashcard.style.opacity = String(Math.max(0.5, 1 - Math.abs(diff) / 500));
        }
    }, { passive: true });

    flashcard.addEventListener('touchend', () => {
        const diff = touchEndX - touchStartX;
        flashcard.style.transform = '';
        flashcard.style.opacity = '';

        if (Math.abs(diff) > 100) {
            if (diff > 0) handleFlashcardRating(4);
            else handleFlashcardRating(0);
        } else if (Math.abs(diff) < 30) {
            flipFlashcard();
        }
    });

    flashcard.addEventListener('click', flipFlashcard);
}

function flipFlashcard() {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;
    flashcard.classList.toggle('flipped');
    (window as any).HapticManager?.trigger('selection');
    (window as any).SoundManager?.play('flip');
}

function showNextFlashcard() {
    if (flashcardIndex >= flashcardCards.length) {
        finishFlashcards();
        return;
    }

    const card = flashcardCards[flashcardIndex];
    const wordId = String(card[FC_COL_ID]);
    const box = LeitnerSystem.getWordBox(wordId);
    cardStartTime = Date.now();

    updateSegmentedProgress(flashcardIndex, null);

    const wordEl = document.getElementById('flashcardWord')!;
    wordEl.textContent = card[FC_COL_SWE];
    TextSizeManager.apply(wordEl, card[FC_COL_SWE]);

    document.getElementById('flashcardTranslation')!.textContent = card[FC_COL_ARB];
    TextSizeManager.apply(document.getElementById('flashcardTranslation')!, card[FC_COL_ARB]);
    
    document.getElementById('flashcardBackWord')!.textContent = card[FC_COL_SWE];
    TextSizeManager.apply(document.getElementById('flashcardBackWord')!, card[FC_COL_SWE]);
    
    const backSentence = document.getElementById('flashcardBackSentence')!;
    const exSwe = card[FC_COL_EX_SWE] || '';
    backSentence.textContent = exSwe;
    backSentence.style.display = exSwe ? 'block' : 'none';
    if (exSwe) TextSizeManager.apply(backSentence, exSwe);

    const arbSentence = document.getElementById('flashcardExampleArb')!;
    const exArb = card[FC_COL_EX_ARB] || '';
    arbSentence.textContent = exArb;
    arbSentence.style.display = exArb ? 'block' : 'none';
    if (exArb) TextSizeManager.apply(arbSentence, exArb);

    document.getElementById('flashcardMastery')!.innerHTML = `${LeitnerSystem.getBoxIcon(box)} Box ${box}`;
    document.getElementById('flashcardType')!.textContent = card[FC_COL_TYPE] || '';

    document.getElementById('flashcardProgress')!.textContent = `${flashcardIndex + 1}/${flashcardTotal}`;

    const flashcard = document.getElementById('flashcard')!;
    flashcard.classList.remove('flipped');
    if (box >= 5) flashcard.classList.add('shimmering');
    else flashcard.classList.remove('shimmering');

    if (isAutoPlayEnabled) {
        setTimeout(() => (window as any).TTSManager?.speak(card[FC_COL_SWE], 'sv'), 500);
    }
}

export function handleFlashcardRating(rating: number) {
    const card = flashcardCards[flashcardIndex];
    if (!card) return;

    const wordId = String(card[FC_COL_ID]);
    sessionStats.totalTime += (Date.now() - cardStartTime);

    if (rating >= 3) {
        LeitnerSystem.promoteWord(wordId);
        mistakesManager.markAsLearned(card[FC_COL_SWE]);
        flashcardScore++;
        sessionStats.correct++;
        updateSegmentedProgress(flashcardIndex, 'correct');
    } else {
        LeitnerSystem.demoteWord(wordId);
        mistakesManager.addMistake({
            word: card[FC_COL_SWE],
            translation: card[FC_COL_ARB],
            game: 'flashcards'
        });
        sessionStats.wrong++;
        updateSegmentedProgress(flashcardIndex, 'wrong');
    }

    const flashcard = document.getElementById('flashcard')!;
    const isFlipped = flashcard.classList.contains('flipped');
    const anim = rating >= 3 ? (isFlipped ? 'slide-out-right' : 'slide-out-right-front') : (isFlipped ? 'slide-out-left' : 'slide-out-left-front');
    
    flashcard.classList.add(anim);
    setTimeout(() => {
        flashcard.classList.remove('slide-out-right', 'slide-out-left', 'slide-out-right-front', 'slide-out-left-front');
        flashcardIndex++;
        showNextFlashcard();
    }, 300);
}

function finishFlashcards() {
    const percentage = Math.round((flashcardScore / flashcardTotal) * 100);
    const avgTime = Math.round(sessionStats.totalTime / flashcardTotal / 1000);

    const flashcard = document.getElementById('flashcard')!;
    flashcard.classList.remove('flipped');

    document.getElementById('flashcardWord')!.innerHTML = `
        <span style="font-size: 3rem;">${percentage >= 80 ? '🏆' : '💪'}</span>
        <div style="font-size: 2.5rem; font-weight: 700;">${percentage}%</div>
    `;

    document.getElementById('flashcardTranslation')!.innerHTML = `
        <div>Kunde ${flashcardScore} av ${flashcardTotal}!</div>
        <div style="font-size: 0.9rem;">✅ ${sessionStats.correct} ❌ ${sessionStats.wrong} ⏱️ ${avgTime}s</div>
    `;

    const exampleEl = document.getElementById('flashcardExample')!;
    exampleEl.innerHTML = `
        <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
            <button onclick="initFlashcards()" class="fc-action-btn">🔄 Igen</button>
            <button onclick="showGameMenu()" class="fc-action-btn secondary">🏠 Meny</button>
        </div>
    `;
    exampleEl.style.display = 'block';

    document.getElementById('flashcardRatingBtns')!.style.display = 'none';
    (window as any).saveScore?.('flashcards', flashcardScore);
    exitFullScreenMode();
}

function enterFullScreenMode() {
    if (window.innerWidth < 768) document.getElementById('flashcardsGame')?.classList.add('fullscreen-mode');
}

function exitFullScreenMode() {
    document.getElementById('flashcardsGame')?.classList.remove('fullscreen-mode');
}

// Attach to window for HTML access
(window as any).initFlashcards = initFlashcards;
(window as any).handleFlashcardRating = handleFlashcardRating;
(window as any).handleFlashcardResult = handleFlashcardRating;
