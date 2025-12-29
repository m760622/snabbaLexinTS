/**
 * Missing Word Game - TypeScript Version
 * Extracted from games.js
 */

import {
    COL_ID, COL_TYPE, COL_SWE, COL_ARB, COL_ARB_DEF, COL_EX, COL_EX_ARB,
    showToast, saveScore, triggerConfetti
} from './games-utils';

declare const dictionaryData: any[];

// Optional: if playSuccessSound/playErrorSound are not in games-utils, keep declaring them or remove if not used
declare function playSuccessSound(): void;
declare function playErrorSound(): void;

console.log("missingWordGame.ts LOADED");

let _missingWordCurrentItem: any[] | null = null;
let missingWordScore = 0;

/**
 * Start the Missing Word game
 */
export function startMissingWordGame(retryCount = 0): void {
    if (typeof dictionaryData === 'undefined' || dictionaryData.length === 0) {
        if (retryCount < 10) {
            console.warn(`Data not ready for Missing Word. Retrying (${retryCount + 1}/10)...`);
            if (typeof showToast === 'function') showToast("Laddar speldata... / جاري تحميل البيانات...", 'info');
            setTimeout(() => startMissingWordGame(retryCount + 1), 500);
        } else {
            console.error("Critical: Data failed to load for Missing Word.");
            if (typeof showToast === 'function') showToast("Kunde inte ladda data. Uppdatera sidan. / تعذر تحميل البيانات.", 'error');
        }
        return;
    }

    missingWordScore = 0;
    const scoreEl = document.getElementById('gameScore');
    if (scoreEl) scoreEl.textContent = '0';
    loadMissingWordQuestion();
}

/**
 * Load a new question
 */
export function loadMissingWordQuestion(): void {
    const sentenceEl = document.getElementById('gameSentence');
    const hintEl = document.getElementById('gameHint');
    const optionsEl = document.getElementById('gameOptions');
    const feedbackEl = document.getElementById('gameFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn') as HTMLButtonElement | null;

    if (feedbackEl) feedbackEl.innerHTML = '';
    if (nextBtn) {
        nextBtn.style.display = 'none';
        nextBtn.classList.add('hidden');
    }
    if (optionsEl) optionsEl.innerHTML = '<div class="skeleton-loader">Laddar...</div>';

    // Find a word with an example sentence
    let candidate: any[] | null = null;
    let attempts = 0;

    if (typeof dictionaryData === 'undefined') {
        console.error("dictionaryData is undefined");
        return;
    }

    while (!candidate && attempts < 200) {
        const item = dictionaryData[Math.floor(Math.random() * dictionaryData.length)];
        if (item && item[COL_EX] && item[COL_SWE] && item[COL_ARB]) {
            const example = item[COL_EX] as string;
            const word = item[COL_SWE] as string;
            // Check if the word appears in the example
            if (example.toLowerCase().includes(word.toLowerCase()) && word.length > 2) {
                candidate = item;
            }
        }
        attempts++;
    }

    if (!candidate) {
        if (sentenceEl) sentenceEl.textContent = "Kunde inte hitta en fråga. Försök igen.";
        if (hintEl) hintEl.textContent = "";
        if (optionsEl) optionsEl.innerHTML = '<button class="game-option" onclick="loadMissingWordQuestion()">Försök igen</button>';
        return;
    }

    _missingWordCurrentItem = candidate;
    const word = candidate[COL_SWE] as string;
    const example = candidate[COL_EX] as string;
    const translation = candidate[COL_ARB] as string;

    // Create sentence with blank
    const regex = new RegExp(word, 'i');
    const sentenceWithBlank = example.replace(regex, '______');

    if (sentenceEl) sentenceEl.innerHTML = sentenceWithBlank;
    if (hintEl) hintEl.textContent = translation;

    // Generate options (1 correct + 3 wrong)
    const options: string[] = [word];
    let optionAttempts = 0;

    while (options.length < 4 && optionAttempts < 100) {
        const randomItem = dictionaryData[Math.floor(Math.random() * dictionaryData.length)];
        if (randomItem && randomItem[COL_SWE] &&
            randomItem[COL_SWE] !== word &&
            !options.includes(randomItem[COL_SWE]) &&
            randomItem[COL_SWE].length > 2) {
            options.push(randomItem[COL_SWE]);
        }
        optionAttempts++;
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    // Render options
    if (optionsEl) {
        optionsEl.innerHTML = '';
        options.forEach(option => {
            const btn = document.createElement('button');
            btn.className = 'game-option';
            btn.textContent = option;
            btn.onclick = () => checkMissingWordAnswer(option, word, btn);
            optionsEl.appendChild(btn);
        });
    }
}

/**
 * Check the answer
 */
export function checkMissingWordAnswer(selected: string, correct: string, btnEl: HTMLButtonElement): void {
    const feedbackEl = document.getElementById('gameFeedback');
    const nextBtn = document.getElementById('nextQuestionBtn') as HTMLButtonElement | null;
    const allBtns = document.querySelectorAll('.game-option') as NodeListOf<HTMLButtonElement>;

    // Disable all buttons
    allBtns.forEach(btn => btn.disabled = true);

    if (selected === correct) {
        btnEl.classList.add('correct');
        if (feedbackEl) {
            feedbackEl.innerHTML = '✅ Rätt! / صحيح!';
            feedbackEl.className = 'game-feedback success';
        }
        missingWordScore++;
        const scoreEl = document.getElementById('gameScore');
        if (scoreEl) scoreEl.textContent = String(missingWordScore);

        if (typeof saveScore === 'function') {
            saveScore('missing-word', missingWordScore);
        }

        // Trigger generic success if available
        if (typeof playSuccessSound === 'function') playSuccessSound();
        if (typeof triggerConfetti === 'function') triggerConfetti();

    } else {
        btnEl.classList.add('wrong');
        if (feedbackEl) {
            feedbackEl.innerHTML = `❌ Fel! Rätt svar: <strong>${correct}</strong>`;
            feedbackEl.className = 'game-feedback error';
        }

        // Highlight correct answer
        allBtns.forEach(btn => {
            if (btn.textContent === correct) {
                btn.classList.add('correct');
            }
        });

        // Trigger generic error if available
        if (typeof playErrorSound === 'function') playErrorSound();
    }

    if (nextBtn) {
        nextBtn.classList.remove('hidden');
        nextBtn.style.display = 'block';
        nextBtn.onclick = loadMissingWordQuestion;
    }
}

// Expose to window for HTML onclick handlers
(window as any).startMissingWordGame = startMissingWordGame;
(window as any).loadMissingWordQuestion = loadMissingWordQuestion;
(window as any).checkMissingWordAnswer = checkMissingWordAnswer;
