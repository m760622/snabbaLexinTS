import { AppConfig } from '../config';
import { showToast, saveScore } from './games-utils';
import { TTSManager } from '../tts';

// Constants and globals
declare const dictionaryData: any[];

console.log("sentenceBuilderGame.ts LOADED");

// State
let sentenceTarget: string[] = [];
let sentenceCurrent: string[] = [];
let sentenceScore = 0;
let _currentSentenceItem: any[] | null = null;

/**
 * Start Sentence Builder Game
 */
export function startSentenceGame(retryCount = 0): void {
    if (typeof dictionaryData === 'undefined' || dictionaryData.length === 0) {
        if (retryCount < 10) {
            console.warn(`Data not ready for Sentence Builder. Retrying (${retryCount + 1}/10)...`);
            if (typeof showToast === 'function') showToast("Laddar speldata... / جاري تحميل البيانات...", 'info');
            setTimeout(() => startSentenceGame(retryCount + 1), 500);
        } else {
            console.error("Critical: Data failed to load for Sentence Builder.");
            if (typeof showToast === 'function') showToast("Kunde inte ladda data. Uppdatera sidan. / تعذر تحميل البيانات.", 'error');
        }
        return;
    }

    const hintEl = document.getElementById('sentenceHint');
    const dropZone = document.getElementById('sentenceDropZone');
    const wordBank = document.getElementById('sentenceWordBank');
    const feedbackEl = document.getElementById('sentenceFeedback');
    const nextBtn = document.getElementById('nextSentenceBtn') as HTMLButtonElement | null;
    const checkBtn = document.getElementById('checkSentenceBtn') as HTMLButtonElement | null;

    if (!hintEl || !dropZone || !wordBank || !feedbackEl) return;

    // Reset
    feedbackEl.innerHTML = '';
    feedbackEl.className = 'game-feedback';
    if (nextBtn) nextBtn.style.display = 'none';
    if (checkBtn) checkBtn.style.display = 'block';
    dropZone.innerHTML = '<div class="drop-placeholder">Dra ord hit / اسحب الكلمات هنا</div>';
    wordBank.innerHTML = '';
    sentenceCurrent = [];

    // Find a word with an example sentence
    let candidate: any[] | null = null;
    let attempts = 0;

    while (!candidate && attempts < 200) {
        const item = dictionaryData[Math.floor(Math.random() * dictionaryData.length)];
        if (item && item[AppConfig.COLUMNS.EXAMPLE_SWE] && item[AppConfig.COLUMNS.EXAMPLE_SWE].split(' ').length >= 3 && item[AppConfig.COLUMNS.EXAMPLE_SWE].split(' ').length <= 8) {
            candidate = item;
        }
        attempts++;
    }

    if (!candidate) {
        hintEl.textContent = "Kunde inte hitta en mening. Försök igen.";
        return;
    }

    _currentSentenceItem = candidate;
    const sentence = candidate[AppConfig.COLUMNS.EXAMPLE_SWE] as string;
    const arabicHint = (candidate[AppConfig.COLUMNS.EXAMPLE_ARB] || candidate[AppConfig.COLUMNS.ARABIC] || '') as string;

    // Show Arabic translation as hint
    hintEl.innerHTML = `<span style="direction: rtl; display: block;">${arabicHint}</span>`;

    // Split and shuffle
    sentenceTarget = sentence.split(' ').filter((w: string) => w.length > 0);
    const shuffled = [...sentenceTarget].sort(() => Math.random() - 0.5);

    // Create word buttons
    shuffled.forEach(word => {
        const btn = document.createElement('button');
        btn.className = 'sentence-word';
        btn.textContent = word;
        btn.onclick = () => moveWord(btn, word);
        wordBank.appendChild(btn);
    });

    // Bind check button
    if (checkBtn) {
        checkBtn.onclick = checkSentence;
    }
}

/**
 * Move word between zones
 */
function moveWord(btn: HTMLButtonElement, word: string): void {
    const dropZone = document.getElementById('sentenceDropZone');
    const wordBank = document.getElementById('sentenceWordBank');
    
    if (!dropZone || !wordBank) return;
    
    const placeholder = dropZone.querySelector('.drop-placeholder');

    if (btn.parentElement === wordBank) {
        // Move to drop zone
        if (placeholder) placeholder.remove();
        dropZone.appendChild(btn);
        sentenceCurrent.push(word);
    } else {
        // Move back to bank
        wordBank.appendChild(btn);
        const idx = sentenceCurrent.indexOf(word);
        if (idx > -1) sentenceCurrent.splice(idx, 1);

        // Show placeholder if empty
        if (dropZone.children.length === 0) {
            dropZone.innerHTML = '<div class="drop-placeholder">Dra ord hit / اسحب الكلمات هنا</div>';
        }
    }
}

/**
 * Check Sentence
 */
function checkSentence(): void {
    const feedbackEl = document.getElementById('sentenceFeedback');
    const nextBtn = document.getElementById('nextSentenceBtn') as HTMLButtonElement | null;
    const checkBtn = document.getElementById('checkSentenceBtn') as HTMLButtonElement | null;
    const dropZone = document.getElementById('sentenceDropZone');
    const scoreEl = document.getElementById('sentenceScore');

    if (!dropZone || !feedbackEl) return;

    const currentStr = Array.from(dropZone.querySelectorAll('.sentence-word')).map(el => el.textContent).join(' ');
    const targetStr = sentenceTarget.join(' ');

    if (currentStr === targetStr) {
        feedbackEl.textContent = "✅ Helt rätt! / صحيح تماماً!";
        feedbackEl.className = 'game-feedback success';
        sentenceScore++;
        if (scoreEl) scoreEl.textContent = String(sentenceScore);

        if (typeof saveScore === 'function') {
            saveScore('sentence', sentenceScore);
        }

        // Speak the sentence
        if (typeof TTSManager !== 'undefined' && TTSManager) {
            TTSManager.speak(targetStr, 'sv');
        }

        if (nextBtn) nextBtn.style.display = 'block';
        if (checkBtn) checkBtn.style.display = 'none';
    } else {
        feedbackEl.textContent = "❌ Inte riktigt... Försök igen! / ليس تماماً...";
        feedbackEl.className = 'game-feedback error';
    }
}

/**
 * Show Answer
 */
export function showSentenceAnswer(): void {
    const dropZone = document.getElementById('sentenceDropZone');
    const wordBank = document.getElementById('sentenceWordBank');
    const feedbackEl = document.getElementById('sentenceFeedback');
    const nextBtn = document.getElementById('nextSentenceBtn') as HTMLButtonElement | null;
    const checkBtn = document.getElementById('checkSentenceBtn') as HTMLButtonElement | null;

    if (!dropZone || !wordBank || !feedbackEl) return;

    // Clear and show correct order
    dropZone.innerHTML = '';
    wordBank.innerHTML = '';

    sentenceTarget.forEach(word => {
        const span = document.createElement('span');
        span.className = 'sentence-word correct';
        span.textContent = word;
        dropZone.appendChild(span);
    });

    feedbackEl.innerHTML = `📖 Rätt ordning visas ovan`;
    feedbackEl.className = 'game-feedback';

    // Speak the sentence
    if (typeof TTSManager !== 'undefined' && TTSManager) {
        TTSManager.speak(sentenceTarget.join(' '), 'sv');
    }

    if (nextBtn) nextBtn.style.display = 'block';
    if (checkBtn) checkBtn.style.display = 'none';
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('nextSentenceBtn');
    if (nextBtn) {
        nextBtn.onclick = () => startSentenceGame();
    }
});

// Expose to window
(window as any).startSentenceGame = startSentenceGame;
(window as any).showSentenceAnswer = showSentenceAnswer;
