/**
 * Professional Flashcards Game Logic
 * TypeScript Version
 */

console.log("flashcardsGame.ts LOADED - Professional Edition");

// ========================================
// Types
// ========================================
interface FlashcardData {
    [index: number]: any;
}

interface SessionStats {
    correct: number;
    wrong: number;
    totalTime: number;
}

interface LeitnerData {
    [wordId: string]: {
        box: number;
        lastReview: number;
        nextReview: number;
    };
}

import { showToast, saveScore, showGameMenu } from './games-utils';
import { TTSManager } from '../tts';
import { TextSizeManager } from '../utils';

// Global declarations
declare const dictionaryData: any[];
declare function updateGamesStats(success: boolean, score: number): void;
declare const HapticManager: { trigger: (type: string) => void } | undefined;
declare const SoundManager: { play: (type: string) => void } | undefined;
declare const FavoritesManager: { isFavorite: (id: string) => boolean; toggle: (id: string) => void } | undefined;

// ========================================
// State Management
// ========================================
let flashcardCards: any[] = [];
let flashcardIndex = 0;
let flashcardScore = 0;
let flashcardTotal = 0;
let cardStartTime = 0;
let sessionStats: SessionStats = { correct: 0, wrong: 0, totalTime: 0 };
let touchStartX = 0;
let touchEndX = 0;
let touchStartTime = 0;
let lastFlipTime = 0;
let isAutoPlayEnabled = localStorage.getItem('fc_autoplay') !== 'false';

// Column indices
const FC_COL_ID = 0;
const FC_COL_TYPE = 1;
const FC_COL_SWE = 2;
const FC_COL_ARB = 3;
const FC_COL_ARB_DEF = 4;
const FC_COL_SWE_DEF = 5;
const FC_COL_FORMS = 6;
const FC_COL_EX_SWE = 7;
const FC_COL_EX_ARB = 8;

// ========================================
// Leitner Box System
// ========================================
const LeitnerSystem = {
    STORAGE_KEY: 'flashcard_leitner_data',
    BOX_INTERVALS: [1, 3, 7, 14, 30],

    getData(): LeitnerData {
        try {
            return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
        } catch { return {}; }
    },

    saveData(data: LeitnerData): void {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
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
            .filter(([, info]) => info.nextReview <= now)
            .map(([id]) => id);
    }
};

// ========================================
// Confetti Effect
// ========================================
function triggerConfetti(): void {
    const container = document.getElementById('flashcardsGame');
    if (!container) return;

    const colors = ['#6366f1', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'];
    const confettiCount = 50;

    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
            animation: confettiFall ${2 + Math.random() * 2}s linear forwards;
            animation-delay: ${Math.random() * 0.5}s;
            z-index: 9999;
            pointer-events: none;
        `;
        container.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// ========================================
// Initialize Flashcards Game
// ========================================
export function initFlashcards(retryCount = 0): void {
    const typeFilterEl = document.getElementById('flashcardTypeFilter') as HTMLSelectElement | null;
    const typeFilter = typeFilterEl?.value || 'all';

    if (typeof dictionaryData === 'undefined' || !Array.isArray(dictionaryData) || dictionaryData.length === 0) {
        if (retryCount < 5) {
            console.log(`Data not ready, retrying... (${retryCount + 1}/5)`);
            if (typeof showToast === 'function' && retryCount === 0) {
                showToast("Laddar data... / جاري تحميل البيانات...", 'default');
            }
            setTimeout(() => initFlashcards(retryCount + 1), 500);
        } else {
            console.error("dictionaryData failed to load.");
            if (typeof showToast === 'function') {
                showToast("Kunde inte ladda data. Kontrollera din anslutning. / تعذر تحميل البيانات.", 'error');
            }
            const container = document.getElementById('flashcardWord');
            if (container) container.innerHTML = '<span style="color:red; font-size: 1rem;">Datafel / Error</span>';
        }
        return;
    }

    try {
        let pool = [...dictionaryData];

        if (typeFilter !== 'all') {
            pool = pool.filter(entry => {
                if (!entry) return false;
                const type = (entry[FC_COL_TYPE] || '').toLowerCase();
                return type.includes(typeFilter);
            });
        }

        pool = pool.filter(entry => entry && entry[FC_COL_SWE] && entry[FC_COL_SWE].length > 0);

        if (pool.length === 0) {
            console.warn("No words found for filter:", typeFilter);
            if (typeof showToast === 'function') showToast("Inga ord hittades för detta filter.", 'error');
            return;
        }

        pool.sort((a, b) => {
            const boxA = LeitnerSystem.getWordBox(String(a[FC_COL_ID]));
            const boxB = LeitnerSystem.getWordBox(String(b[FC_COL_ID]));
            return boxA - boxB;
        });

        flashcardCards = pool.sort(() => 0.5 - Math.random()).slice(0, 50);
        flashcardIndex = 0;
        flashcardScore = 0;
        flashcardTotal = flashcardCards.length;
        sessionStats = { correct: 0, wrong: 0, totalTime: 0 };

        const gameContainer = document.getElementById('flashcardsGame');
        if (gameContainer && gameContainer.style.display !== 'block') {
            gameContainer.style.display = 'block';
        }

        updateProgressRing(0);
        initSegmentedProgress();
        
        const progressEl = document.getElementById('flashcardProgress');
        if (progressEl) progressEl.textContent = `0/${flashcardTotal}`;

        const flashcard = document.getElementById('flashcard');
        if (flashcard) flashcard.classList.remove('flipped');

        setupSwipeGestures();
        showNextFlashcard();
        enterFullScreenMode();

        console.log("Flashcards initialized successfully with", flashcardTotal, "cards.");

    } catch (e) {
        console.error("Critical error starting Flashcards:", e);
        if (typeof showToast === 'function') showToast("Ett fel uppstod. / حدث خطأ.", 'error');
    }
}

// ========================================
// Segmented Progress Bar
// ========================================
function initSegmentedProgress(): void {
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

function updateSegmentedProgress(index: number, status: 'correct' | 'wrong' | null): void {
    const segment = document.getElementById(`fc-seg-${index}`);
    if (!segment) return;

    document.querySelectorAll('.fc-progress-segment').forEach(s => s.classList.remove('active'));

    if (status) {
        segment.classList.add('completed');
        segment.classList.add(status);
    } else {
        segment.classList.add('active');
    }
}

// ========================================
// Progress Ring Update
// ========================================
function updateProgressRing(progress: number): void {
    const ring = document.querySelector('.fc-progress-ring-circle') as SVGCircleElement | null;
    if (!ring) return;

    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (progress / 100) * circumference;
    ring.style.strokeDashoffset = String(offset);
}

// ========================================
// Swipe Gesture Setup
// ========================================
function setupSwipeGestures(): void {
    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;

    flashcard.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchEndX = touchStartX;
        touchStartTime = Date.now();
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
        const touchDuration = Date.now() - touchStartTime;
        flashcard.style.transform = '';
        flashcard.style.opacity = '';

        if (Math.abs(diff) > 100) {
            if (typeof HapticManager !== 'undefined') HapticManager.trigger('medium');
            if (diff > 0) {
                handleFlashcardRating(4);
            } else {
                handleFlashcardRating(0);
            }
        } else if (Math.abs(diff) < 30 && touchDuration < 500) {
            flipFlashcard();
        }
    });

    flashcard.addEventListener('click', () => {
        if (Date.now() - lastFlipTime < 300) return;
        if (touchStartTime > 0 && Date.now() - touchStartTime < 500) return;
        flipFlashcard();
    });
}

// ========================================
// Flip Flashcard
// ========================================
function flipFlashcard(): void {
    if (Date.now() - lastFlipTime < 300) return;
    lastFlipTime = Date.now();

    const flashcard = document.getElementById('flashcard');
    if (!flashcard) return;

    flashcard.classList.toggle('flipped');

    if (typeof HapticManager !== 'undefined') HapticManager.trigger('selection');
    if (typeof SoundManager !== 'undefined') SoundManager.play('flip');
}

// ========================================
// Show Next Flashcard
// ========================================
function showNextFlashcard(): void {
    if (flashcardIndex >= flashcardCards.length) {
        finishFlashcards();
        return;
    }

    const card = flashcardCards[flashcardIndex];
    const swedishWord = card[FC_COL_SWE] || '';
    const arabicWord = card[FC_COL_ARB] || '';
    const exampleSwe = card[FC_COL_EX_SWE] || '';
    const wordType = card[FC_COL_TYPE] || '';
    const wordId = String(card[FC_COL_ID]);
    const box = LeitnerSystem.getWordBox(wordId);

    cardStartTime = Date.now();
    updateSegmentedProgress(flashcardIndex, null);

    const wordEl = document.getElementById('flashcardWord');
    if (wordEl) {
        wordEl.textContent = swedishWord;
        if (typeof TextSizeManager !== 'undefined') {
            TextSizeManager.apply(wordEl, swedishWord, 1, 1.6);
        }
    }

    const translationEl = document.getElementById('flashcardTranslation');
    if (translationEl) translationEl.textContent = arabicWord;

    const masteryEl = document.getElementById('flashcardMastery');
    if (masteryEl) masteryEl.innerHTML = `${LeitnerSystem.getBoxIcon(box)} Box ${box}`;

    const typeEl = document.getElementById('flashcardType');
    if (typeEl) typeEl.textContent = wordType;

    const flashcardEl = document.getElementById('flashcard');
    if (flashcardEl) {
        if (box >= 5) {
            flashcardEl.classList.add('shimmering');
        } else {
            flashcardEl.classList.remove('shimmering');
        }
    }

    const backWordEl = document.getElementById('flashcardBackWord');
    if (backWordEl) backWordEl.textContent = swedishWord;

    const backSentenceEl = document.getElementById('flashcardBackSentence');
    if (backSentenceEl) {
        if (exampleSwe) {
            backSentenceEl.textContent = exampleSwe;
            backSentenceEl.style.display = 'block';
        } else {
            backSentenceEl.style.display = 'none';
        }
    }

    const exampleArb = card[FC_COL_EX_ARB] || '';
    const arbSentenceEl = document.getElementById('flashcardExampleArb');
    if (arbSentenceEl) {
        if (exampleArb) {
            arbSentenceEl.textContent = exampleArb;
            arbSentenceEl.style.display = 'block';
        } else {
            arbSentenceEl.style.display = 'none';
        }
    }

    const progress = (flashcardIndex / flashcardTotal) * 100;
    updateProgressRing(progress);
    
    const progressEl = document.getElementById('flashcardProgress');
    if (progressEl) progressEl.textContent = `${flashcardIndex + 1}/${flashcardTotal}`;

    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.classList.remove('flipped');
        flashcard.classList.remove('swiping-left', 'swiping-right', 'slide-out-right', 'slide-out-left');
        flashcard.style.transform = '';
        flashcard.style.opacity = '';
    }

    setTimeout(() => {
        if (typeof TTSManager !== 'undefined' && isAutoPlayEnabled) {
            TTSManager.speak(swedishWord, 'sv');
        }
    }, 500);

    setTimeout(adjustCardHeight, 50);
}

function adjustCardHeight(): void {
    const front = document.querySelector('.fc-front-pro') as HTMLElement | null;
    const back = document.querySelector('.fc-back-pro') as HTMLElement | null;
    const card = document.getElementById('flashcard');

    if (!front || !back || !card) return;

    const frontH = front.scrollHeight;
    const backH = back.scrollHeight;
    const maxH = Math.max(frontH, backH, 320);

    card.style.height = `${maxH}px`;
}

// ========================================
// Auto-Play Settings
// ========================================
function toggleAutoPlay(): void {
    isAutoPlayEnabled = !isAutoPlayEnabled;
    localStorage.setItem('fc_autoplay', String(isAutoPlayEnabled));
    updateAutoPlayButton();

    if (typeof showToast === 'function') {
        showToast(isAutoPlayEnabled ? 'Auto-play: PÅ 🔊' : 'Auto-play: AV 🔇');
    }
}

function updateAutoPlayButton(): void {
    const btn = document.getElementById('fcAutoPlayToggle');
    if (btn) {
        btn.textContent = isAutoPlayEnabled ? '🔊' : '🔇';
        btn.classList.toggle('muted', !isAutoPlayEnabled);
    }
}

// ========================================
// Next Review Toast
// ========================================
function showNextReviewToast(box: number, isCorrect: boolean): void {
    if (typeof showToast !== 'function') return;

    const intervals = [1, 3, 7, 14, 30];
    const days = intervals[box - 1] || 1;

    const msg = isCorrect
        ? `Bra! Nästa repetition om ${days} dagar (Box ${box})`
        : `Repetition imorgon (Box 1)`;

    showToast(msg);
}

// ========================================
// 4-Level Rating System
// ========================================
export function handleFlashcardRating(rating: number): void {
    try {
        console.log("HandleRating CALLED with:", rating);
        handleFlashcardRatingInternal(rating);
    } catch (e) {
        console.error("CRITICAL ERROR in handleFlashcardRating:", e);
    }
}

function handleFlashcardRatingInternal(rating: number): void {
    const card = flashcardCards[flashcardIndex];
    if (!card) {
        console.error("No card found at index", flashcardIndex);
        return;
    }

    const wordId = String(card[FC_COL_ID]);
    const timeSpent = Date.now() - cardStartTime;

    sessionStats.totalTime += timeSpent;

    if (rating >= 3) {
        LeitnerSystem.promoteWord(wordId);
        flashcardScore++;
        sessionStats.correct++;
        if (typeof HapticManager !== 'undefined') HapticManager.trigger('success');
        if (typeof SoundManager !== 'undefined') SoundManager.play('success');
        updateSegmentedProgress(flashcardIndex, 'correct');
        const newBox = LeitnerSystem.getWordBox(wordId);
        showNextReviewToast(newBox, true);
    } else {
        LeitnerSystem.demoteWord(wordId);
        sessionStats.wrong++;
        if (typeof HapticManager !== 'undefined') HapticManager.trigger('error');
        if (typeof SoundManager !== 'undefined') SoundManager.play('error');
        updateSegmentedProgress(flashcardIndex, 'wrong');
        showNextReviewToast(1, false);
    }

    if (rating === 0 && typeof FavoritesManager !== 'undefined') {
        const idStr = String(wordId);
        if (!FavoritesManager.isFavorite(idStr)) {
            FavoritesManager.toggle(idStr);
        }
    }

    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        const isFlipped = flashcard.classList.contains('flipped');

        let animationClass = '';
        if (isFlipped) {
            animationClass = rating >= 3 ? 'slide-out-right' : 'slide-out-left';
        } else {
            animationClass = rating >= 3 ? 'slide-out-right-front' : 'slide-out-left-front';
        }

        flashcard.classList.add(animationClass);

        setTimeout(() => {
            flashcard.classList.remove('slide-out-right', 'slide-out-left', 'slide-out-right-front', 'slide-out-left-front');
            flashcardIndex++;
            showNextFlashcard();
        }, 300);
    } else {
        flashcardIndex++;
        showNextFlashcard();
    }
}

// ========================================
// Finish Flashcards Session
// ========================================
function finishFlashcards(): void {
    const percentage = Math.round((flashcardScore / flashcardTotal) * 100);
    const avgTime = Math.round(sessionStats.totalTime / flashcardTotal / 1000);

    if (percentage >= 70) {
        triggerConfetti();
        if (typeof HapticManager !== 'undefined') HapticManager.trigger('success');
        if (typeof SoundManager !== 'undefined') SoundManager.play('success');
    }

    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.classList.remove('flipped');
        flashcard.onclick = null;
    }

    const wordEl = document.getElementById('flashcardWord');
    if (wordEl) {
        wordEl.innerHTML = `
            <span style="font-size: 3rem;">${percentage >= 80 ? '🏆' : percentage >= 60 ? '👍' : '💪'}</span>
            <div style="font-size: 2.5rem; font-weight: 700; margin-top: 0.5rem;">${percentage}%</div>
        `;
    }

    const translationEl = document.getElementById('flashcardTranslation');
    if (translationEl) {
        translationEl.innerHTML = `
            <div style="margin-bottom: 1rem;">Du kunde ${flashcardScore} av ${flashcardTotal} ord!</div>
            <div style="display: flex; gap: 1rem; justify-content: center; font-size: 0.9rem;">
                <span>✅ ${sessionStats.correct}</span>
                <span>❌ ${sessionStats.wrong}</span>
                <span>⏱️ ${avgTime}s/kort</span>
            </div>
        `;
    }

    const exampleEl = document.getElementById('flashcardExample');
    if (exampleEl) {
        exampleEl.innerHTML = `
            <div style="margin-top: 1rem; display: flex; gap: 0.5rem; justify-content: center;">
                <button onclick="initFlashcards()" class="fc-action-btn">🔄 Igen</button>
                <button onclick="showGameMenu()" class="fc-action-btn secondary">🏠 Meny</button>
            </div>
        `;
        exampleEl.style.display = 'block';
    }

    const ratingBtns = document.getElementById('flashcardRatingBtns');
    if (ratingBtns) ratingBtns.style.display = 'none';

    updateProgressRing(100);

    if (typeof saveScore === 'function') {
        saveScore('flashcards', flashcardScore);
    }

    if (typeof updateGamesStats === 'function') {
        updateGamesStats(percentage >= 70, flashcardScore);
    }

    exitFullScreenMode();
}

// ========================================
// Full Screen Mode
// ========================================
function enterFullScreenMode(): void {
    const game = document.getElementById('flashcardsGame');
    if (game && window.innerWidth < 768) {
        game.classList.add('fullscreen-mode');
    }
}

function exitFullScreenMode(): void {
    const game = document.getElementById('flashcardsGame');
    if (game) {
        game.classList.remove('fullscreen-mode');
    }
}

// ========================================
// DOMContentLoaded
// ========================================
document.addEventListener('DOMContentLoaded', updateAutoPlayButton);

// ========================================
// Global Exports
// ========================================
(window as any).initFlashcards = initFlashcards;
(window as any).handleFlashcardResult = handleFlashcardRating;
(window as any).handleFlashcardRating = handleFlashcardRating;
(window as any).LeitnerSystem = LeitnerSystem;
(window as any).toggleAutoPlay = toggleAutoPlay;
