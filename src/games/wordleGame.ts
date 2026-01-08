/**
 * Wordle Game - ووردل السويدية
 * TypeScript Version
 */

// Global declarations
declare const dictionaryData: any[];
declare const COL_SWE: number;
declare const COL_TYPE: number;

declare function showToast(message: string, type?: string): void;
declare function saveScore(game: string, score: number): void;
declare function playSuccessSound(): void;
declare function triggerConfetti(): void;

console.log("wordleGame.ts LOADED");

// State
let wordleTarget = '';
let wordleGuesses: string[] = [];
let wordleCurrentGuess = '';
let wordleGameOver = false;
let wordleStreak = parseInt(localStorage.getItem('wordleStreak') || '0');

// Save streak on progress
function saveWordleStreak(): void {
    localStorage.setItem('wordleStreak', wordleStreak.toString());
}

// Export for global access
(window as any).wordleStreak = wordleStreak;

import { SmartWordSelector } from '../smart-selector';

/**
 * Start Wordle Game
 */
export function startWordleGame(retryCount = 0): void {
    if (typeof dictionaryData === 'undefined' || dictionaryData.length === 0) {
        if (retryCount < 10) {
            console.warn(`Data not ready for Wordle. Retrying (${retryCount + 1}/10)...`);
            if (typeof showToast === 'function') showToast("Laddar speldata... / جاري تحميل البيانات...", 'info');
            setTimeout(() => startWordleGame(retryCount + 1), 500);
        } else {
            console.error("Critical: Data failed to load for Wordle.");
            if (typeof showToast === 'function') showToast("Kunde inte ladda data. Uppdatera sidan. / تعذر تحميل البيانات.", 'error');
        }
        return;
    }

    const grid = document.getElementById('wordleGrid');
    const keyboard = document.getElementById('wordleKeyboard');
    const messageEl = document.getElementById('wordleMessage');
    const nextBtn = document.getElementById('nextWordleBtn') as HTMLButtonElement | null;
    const typeFilterEl = document.getElementById('wordleTypeFilter') as HTMLSelectElement | null;
    const difficultyEl = document.getElementById('wordleDifficulty') as HTMLSelectElement | null;
    
    const typeFilter = typeFilterEl?.value || 'all';
    const difficulty = difficultyEl?.value || 'medium';

    // Difficulty settings: word length range
    let minLen = 5, maxLen = 5;
    if (difficulty === 'easy') {
        minLen = 4; maxLen = 4;
    } else if (difficulty === 'medium') {
        minLen = 5; maxLen = 5;
    } else if (difficulty === 'hard') {
        minLen = 6; maxLen = 6;
    }

    // Reset State
    wordleGuesses = [];
    wordleCurrentGuess = '';
    wordleGameOver = false;
    if (messageEl) messageEl.textContent = '';
    if (nextBtn) nextBtn.style.display = 'none';
    if (grid) grid.innerHTML = '';
    if (keyboard) keyboard.innerHTML = '';

    // Select Target Word using Smart Selection
    const pool = dictionaryData.filter(item => 
        item && item[COL_SWE] && 
        item[COL_SWE].length >= minLen && 
        item[COL_SWE].length <= maxLen &&
        !item[COL_SWE].includes(' ') && 
        !item[COL_SWE].includes('-') && 
        /^[a-zA-ZåäöÅÄÖ]+$/.test(item[COL_SWE]) &&
        (typeFilter === 'all' || (item[COL_TYPE] && item[COL_TYPE].toLowerCase().includes(typeFilter)))
    );

    const candidate = SmartWordSelector.select(pool, 1)[0];

    if (!candidate) {
        if (messageEl) messageEl.textContent = "Kunde inte hitta ett ord. Försök igen.";
        return;
    }

    wordleTarget = (candidate[COL_SWE] as string).toUpperCase();
    SmartWordSelector.markAsSeen(candidate[COL_SWE]);
    console.log("Wordle Target:", wordleTarget, "Difficulty:", difficulty);

    // Create Grid (6 rows, 5 cols)
    if (grid) {
        for (let i = 0; i < 30; i++) {
            const cell = document.createElement('div');
            cell.className = 'wordle-tile';
            grid.appendChild(cell);
        }
    }

    // Create Keyboard
    const keys = [
        'QWERTYUIOPÅ',
        'ASDFGHJKLÖÄ',
        'ZXCVBNM'
    ];

    if (keyboard) {
        keys.forEach(row => {
            const rowEl = document.createElement('div');
            rowEl.className = 'keyboard-row';

            row.split('').forEach(key => {
                const keyBtn = document.createElement('button');
                keyBtn.className = 'key-btn';
                keyBtn.textContent = key;
                keyBtn.onclick = () => handleWordleInput(key);
                keyBtn.dataset.key = key;
                rowEl.appendChild(keyBtn);
            });

            if (row === 'ZXCVBNM') {
                const enterBtn = document.createElement('button');
                enterBtn.className = 'key-btn wide';
                enterBtn.textContent = 'ENTER';
                enterBtn.onclick = submitWordleGuess;
                rowEl.appendChild(enterBtn);

                const backBtn = document.createElement('button');
                backBtn.className = 'key-btn wide';
                backBtn.textContent = '⌫';
                backBtn.onclick = () => handleWordleInput('BACKSPACE');
                rowEl.prepend(backBtn);
            }

            keyboard.appendChild(rowEl);
        });
    }

    // Keyboard Listeners (Physical)
    document.onkeydown = (e) => {
        const wordleGame = document.getElementById('wordleGame');
        if (!wordleGame || (wordleGame as HTMLElement).style.display === 'none') return;

        const key = e.key.toUpperCase();
        if (key === 'ENTER') submitWordleGuess();
        else if (key === 'BACKSPACE') handleWordleInput('BACKSPACE');
        else if (/^[A-ZÅÄÖ]$/.test(key)) handleWordleInput(key);
    };
}

/**
 * Handle Wordle Input
 */
export function handleWordleInput(key: string): void {
    if (wordleGameOver) return;

    if (key === 'BACKSPACE') {
        wordleCurrentGuess = wordleCurrentGuess.slice(0, -1);
    } else if (wordleCurrentGuess.length < 5) {
        wordleCurrentGuess += key;
    }
    updateWordleGrid();
}

/**
 * Update Wordle Grid
 */
function updateWordleGrid(): void {
    const grid = document.getElementById('wordleGrid');
    if (!grid) return;

    const currentRow = wordleGuesses.length;
    const startIdx = currentRow * 5;

    // Clear current row
    for (let i = 0; i < 5; i++) {
        const cell = grid.children[startIdx + i] as HTMLElement;
        if (cell) {
            cell.textContent = '';
            cell.classList.remove('typing');
        }
    }

    // Fill current guess
    for (let i = 0; i < wordleCurrentGuess.length; i++) {
        const cell = grid.children[startIdx + i] as HTMLElement;
        if (cell) {
            cell.textContent = wordleCurrentGuess[i];
            cell.classList.add('typing');
        }
    }
}

/**
 * Submit Wordle Guess
 */
export function submitWordleGuess(): void {
    if (wordleGameOver) return;
    if (wordleCurrentGuess.length !== 5) {
        if (typeof showToast === 'function') showToast("Ordet måste ha 5 bokstäver");
        return;
    }

    const guess = wordleCurrentGuess;
    wordleGuesses.push(guess);

    // Color the grid
    const rowStart = (wordleGuesses.length - 1) * 5;
    const grid = document.getElementById('wordleGrid');
    if (!grid) return;

    const targetChars: (string | null)[] = wordleTarget.split('');
    const guessChars: (string | null)[] = guess.split('');
    const states: string[] = Array(5).fill('absent');

    // First pass: Correct (Green)
    guessChars.forEach((char, i) => {
        if (char === targetChars[i]) {
            states[i] = 'correct';
            targetChars[i] = null;
            guessChars[i] = null;
        }
    });

    // Second pass: Present (Yellow)
    guessChars.forEach((char, i) => {
        if (char && targetChars.includes(char)) {
            states[i] = 'present';
            const targetIdx = targetChars.indexOf(char);
            targetChars[targetIdx] = null;
        }
    });

    // Apply styles with animation delay
    states.forEach((state, i) => {
        const cell = grid.children[rowStart + i] as HTMLElement;
        if (!cell) return;

        setTimeout(() => {
            cell.classList.add(state);
            const keyBtn = document.querySelector(`.key-btn[data-key="${guess[i]}"]`) as HTMLElement;
            if (keyBtn) {
                const currentClass = keyBtn.classList.contains('correct') ? 'correct' :
                    keyBtn.classList.contains('present') ? 'present' : 'absent';

                if (state === 'correct') keyBtn.className = `key-btn correct`;
                else if (state === 'present' && currentClass !== 'correct') keyBtn.className = `key-btn present`;
                else if (state === 'absent' && currentClass === 'absent') keyBtn.className = `key-btn absent`;
                else if (state === 'absent' && !keyBtn.classList.contains('correct') && !keyBtn.classList.contains('present')) keyBtn.classList.add('absent');
            }
        }, i * 100);
    });

    // Check Win/Loss
    if (guess === wordleTarget) {
        wordleGameOver = true;
        setTimeout(() => {
            if (typeof showToast === 'function') showToast(`Grattis! Du gissade ordet! 🎉 / تهانينا!`, 'success');
            if (typeof playSuccessSound === 'function') playSuccessSound();
            if (typeof triggerConfetti === 'function') triggerConfetti();

            const messageEl = document.getElementById('wordleMessage');
            if (messageEl) messageEl.textContent = "Du vann! / فزت!";

            const nextBtn = document.getElementById('nextWordleBtn') as HTMLButtonElement | null;
            if (nextBtn) nextBtn.style.display = 'block';

            wordleStreak++;
            saveWordleStreak();

            if (typeof saveScore === 'function') {
                const score = (6 - wordleGuesses.length + 1) * 10;
                saveScore('wordle', score);
            }
        }, 1500);
    } else if (wordleGuesses.length >= 6) {
        wordleGameOver = true;
        setTimeout(() => {
            if (typeof showToast === 'function') showToast(`Tyvärr! Ordet var ${wordleTarget}`, 'error');

            const messageEl = document.getElementById('wordleMessage');
            if (messageEl) messageEl.textContent = `Rätt svar: ${wordleTarget}`;

            const nextBtn = document.getElementById('nextWordleBtn') as HTMLButtonElement | null;
            if (nextBtn) nextBtn.style.display = 'block';

            wordleStreak = 0;
            saveWordleStreak();
        }, 1500);
    } else {
        wordleCurrentGuess = '';
    }
}

// Expose to window
(window as any).startWordleGame = startWordleGame;
(window as any).handleWordleInput = handleWordleInput;
(window as any).updateWordleGrid = updateWordleGrid;
(window as any).submitWordleGuess = submitWordleGuess;
