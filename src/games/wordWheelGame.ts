/**
 * Word Wheel Game - عجلة الكلمات
 * TypeScript Version
 */

// Types
interface WheelTarget {
    word: string;
    translation: string;
    example: string;
    exampleArb: string;
}

// Global declarations
declare const dictionaryData: any[];
declare const COL_SWE: number;
declare const COL_ARB: number;
declare const COL_EX: number;
declare const COL_EX_ARB: number;

declare function showToast(message: string, type?: string): void;
declare function saveScore(game: string, score: number): void;
declare const TTSManager: { speak: (text: string, lang?: string) => void } | undefined;
declare const soundManager: { playClick?: () => void; playSuccess?: () => void; playError?: () => void } | undefined;

console.log("wordWheelGame.ts LOADED");

// State
let wheelTarget: WheelTarget | null = null;
let wheelCurrentWord = '';
let wheelScore = 0;
let wheelLevel = 3;
let wheelWordsSolved = 0;

/**
 * Start Word Wheel Game
 */
export function startWordWheelGame(retryCount = 0): void {
    if (typeof dictionaryData === 'undefined' || dictionaryData.length === 0) {
        if (retryCount < 10) {
            console.warn(`Data not ready for Word Wheel. Retrying (${retryCount + 1}/10)...`);
            if (typeof showToast === 'function') showToast("Laddar speldata... / جاري تحميل البيانات...", 'info');
            setTimeout(() => startWordWheelGame(retryCount + 1), 500);
        } else {
            console.error("Critical: Data failed to load for Word Wheel.");
            if (typeof showToast === 'function') showToast("Kunde inte ladda data. Uppdatera sidan. / تعذر تحميل البيانات.", 'error');
        }
        return;
    }

    const answerBox = document.getElementById('wheelAnswerBox');
    const hintEl = document.getElementById('wheelHint');
    const lettersEl = document.getElementById('wheelLetters');
    const feedbackEl = document.getElementById('wheelFeedback');
    const exampleEl = document.getElementById('wheelExample');
    const nextBtn = document.getElementById('nextWheelBtn2');
    const lengthSelect = document.getElementById('wordWheelLength') as HTMLSelectElement | null;

    if (!answerBox || !hintEl || !lettersEl || !feedbackEl || !exampleEl || !nextBtn) return;

    wheelLevel = lengthSelect ? parseInt(lengthSelect.value) : 3;

    // Reset UI
    feedbackEl.innerHTML = '';
    feedbackEl.className = 'game-feedback';
    exampleEl.classList.add('hidden');
    nextBtn.classList.add('hidden');
    answerBox.innerHTML = '';
    wheelCurrentWord = '';

    // Find a word of the selected length
    let candidate: WheelTarget | null = null;
    let attempts = 0;

    while (!candidate && attempts < 500) {
        const item = dictionaryData[Math.floor(Math.random() * dictionaryData.length)];
        if (item && item[COL_SWE] && item[COL_ARB]) {
            const word = (item[COL_SWE] as string).toUpperCase();
            if (word.length === wheelLevel &&
                !word.includes(' ') &&
                !word.includes('-') &&
                /^[A-ZÅÄÖ]+$/.test(word)) {
                candidate = {
                    word: word,
                    translation: item[COL_ARB],
                    example: item[COL_EX] || '',
                    exampleArb: item[COL_EX_ARB] || ''
                };
            }
        }
        attempts++;
    }

    if (!candidate) {
        hintEl.textContent = "Kunde inte hitta ett ord. Försök igen.";
        lettersEl.innerHTML = '<button class="wheel-letter" onclick="startWordWheelGame()">🔄</button>';
        return;
    }

    wheelTarget = candidate;
    hintEl.textContent = candidate.translation;

    // Dynamic Font Sizing for Arabic Hint
    const arbLength = candidate.translation.length;
    if (arbLength > 15) {
        hintEl.style.fontSize = '1.5rem';
    } else if (arbLength > 10) {
        hintEl.style.fontSize = '1.8rem';
    } else {
        hintEl.style.fontSize = '2.2rem';
    }

    // Set Dynamic Answer Box Width
    const letterCount = candidate.word.length;
    let charWidth = 44;
    const gapSize = 6.4;

    if (letterCount > 6) {
        answerBox.classList.add('small-text');
        charWidth = 36;
    } else {
        answerBox.classList.remove('small-text');
    }

    const totalWidth = (letterCount * charWidth) + ((letterCount - 1) * gapSize) + 30;
    (answerBox as HTMLElement).style.width = `${totalWidth}px`;
    (answerBox as HTMLElement).style.minWidth = '0';

    // Shuffle letters
    const letters = candidate.word.split('').sort(() => Math.random() - 0.5);

    // Render wheel letters
    lettersEl.innerHTML = '';
    letters.forEach((letter, index) => {
        const btn = document.createElement('button');
        btn.className = 'wheel-letter';
        btn.textContent = letter;
        btn.dataset.index = String(index);
        btn.onclick = () => selectWheelLetter(btn, letter);

        const angle = (index / letters.length) * 2 * Math.PI - Math.PI / 2;
        const radius = 45;
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        btn.style.left = `${x}%`;
        btn.style.top = `${y}%`;
        btn.style.transform = 'translate(-50%, -50%)';

        lettersEl.appendChild(btn);
    });

    // Bind check button
    const checkBtn = document.getElementById('wheelCheckBtn');
    if (checkBtn) {
        checkBtn.onclick = checkWordWheel;
    }

    updateHintButtonState();
}

function updateHintButtonState(): void {
    const hintBtn = document.getElementById('wheelShowAnswerBtn') as HTMLButtonElement | null;
    if (!hintBtn) return;

    if (wheelScore >= 1) {
        hintBtn.disabled = false;
        hintBtn.title = "Visa svaret (Kostar 1 poäng) / أظهر الإجابة (تكلفة 1 نقطة)";
    } else {
        hintBtn.disabled = true;
        hintBtn.title = "Du behöver 1 poäng / تحتاج إلى نقطة واحدة";
    }
}

function selectWheelLetter(btn: HTMLButtonElement, letter: string): void {
    if (btn.classList.contains('used')) return;

    if (typeof soundManager !== 'undefined' && soundManager?.playClick) soundManager.playClick();

    btn.classList.add('used');
    wheelCurrentWord += letter;
    updateWheelAnswerBox();

    if (wheelTarget && wheelCurrentWord.length === wheelTarget.word.length) {
        checkWordWheel();
    }
}

function updateWheelAnswerBox(): void {
    const answerBox = document.getElementById('wheelAnswerBox');
    const feedbackEl = document.getElementById('wheelFeedback');
    if (!answerBox) return;

    answerBox.innerHTML = '';
    answerBox.classList.remove('shake-error');
    if (feedbackEl) feedbackEl.innerHTML = '';

    wheelCurrentWord.split('').forEach((letter, index) => {
        const span = document.createElement('span');
        span.className = 'wheel-answer-letter';
        span.textContent = letter;
        span.onclick = () => removeWheelLetter(index, letter);
        answerBox.appendChild(span);
    });
}

function removeWheelLetter(index: number, letter: string): void {
    if (typeof soundManager !== 'undefined' && soundManager?.playClick) soundManager.playClick();
    wheelCurrentWord = wheelCurrentWord.slice(0, index) + wheelCurrentWord.slice(index + 1);

    const lettersEl = document.getElementById('wheelLetters');
    if (lettersEl) {
        const usedBtns = lettersEl.querySelectorAll('.wheel-letter.used');
        let found = false;
        usedBtns.forEach(btn => {
            if (!found && btn.textContent === letter) {
                btn.classList.remove('used');
                found = true;
            }
        });
    }

    updateWheelAnswerBox();
}

function checkWordWheel(): void {
    const feedbackEl = document.getElementById('wheelFeedback');
    const exampleEl = document.getElementById('wheelExample');
    const nextBtn = document.getElementById('nextWheelBtn2');
    const answerBox = document.getElementById('wheelAnswerBox');
    const scoreEl = document.getElementById('wordWheelScore');

    if (!feedbackEl || !exampleEl || !nextBtn || !answerBox || !wheelTarget) return;

    if (wheelCurrentWord.toUpperCase() === wheelTarget.word) {
        if (typeof soundManager !== 'undefined' && soundManager?.playSuccess) soundManager.playSuccess();

        feedbackEl.innerHTML = '✅ Rätt! / صحيح!';
        feedbackEl.className = 'game-feedback success';
        wheelScore++;
        wheelWordsSolved++;
        if (scoreEl) scoreEl.textContent = String(wheelScore);
        updateHintButtonState();

        if (wheelTarget.example) {
            let exampleHtml = `💡 ${wheelTarget.example}`;
            if (wheelTarget.exampleArb) {
                exampleHtml += `<br><span class="arb-example" style="color: #fbbf24; font-weight: bold; display: block; margin-top: 0.5rem;">${wheelTarget.exampleArb}</span>`;
            }
            exampleEl.innerHTML = exampleHtml;
            exampleEl.classList.remove('hidden');
        }

        if (typeof saveScore === 'function') {
            saveScore('word-wheel', wheelScore);
        }

        if (typeof TTSManager !== 'undefined' && TTSManager) {
            TTSManager.speak(wheelTarget.word.toLowerCase(), 'sv');
        }

        nextBtn.classList.remove('hidden');
    } else {
        if (typeof soundManager !== 'undefined' && soundManager?.playError) soundManager.playError();

        answerBox.classList.add('shake-error');
        setTimeout(() => answerBox.classList.remove('shake-error'), 500);

        feedbackEl.innerHTML = '❌ Fel svar, försök igen! / إجابة خاطئة، حاول مرة أخرى';
        feedbackEl.className = 'game-feedback error';

        if (navigator.vibrate) navigator.vibrate(200);
    }
}

export function undoWordWheel(): void {
    if (wheelCurrentWord.length > 0) {
        const lastLetter = wheelCurrentWord[wheelCurrentWord.length - 1];
        wheelCurrentWord = wheelCurrentWord.slice(0, -1);

        const lettersEl = document.getElementById('wheelLetters');
        if (lettersEl) {
            const usedBtns = Array.from(lettersEl.querySelectorAll('.wheel-letter.used'));
            for (let i = usedBtns.length - 1; i >= 0; i--) {
                if (usedBtns[i].textContent === lastLetter) {
                    usedBtns[i].classList.remove('used');
                    break;
                }
            }
        }

        updateWheelAnswerBox();
    }
}

export function skipWordWheel(): void {
    startWordWheelGame();
}

export function showWordWheelAnswer(): void {
    if (!wheelTarget) return;
    
    if (wheelScore < 1) {
        if (typeof showToast === 'function') showToast("Du behöver minst 1 poäng! / تحتاج نقطة واحدة على الأقل!", 'error');
        return;
    }

    wheelScore--;
    const scoreEl = document.getElementById('wordWheelScore');
    if (scoreEl) scoreEl.textContent = String(wheelScore);
    updateHintButtonState();

    wheelCurrentWord = wheelTarget.word;

    const lettersEl = document.getElementById('wheelLetters');
    if (lettersEl) {
        const letters = lettersEl.querySelectorAll('.wheel-letter');
        letters.forEach(btn => btn.classList.add('used'));
    }

    updateWheelAnswerBox();

    const feedbackEl = document.getElementById('wheelFeedback');
    const exampleEl = document.getElementById('wheelExample');
    const nextBtn = document.getElementById('nextWheelBtn2');

    if (!feedbackEl || !exampleEl || !nextBtn) return;

    if (typeof soundManager !== 'undefined' && soundManager?.playSuccess) soundManager.playSuccess();

    feedbackEl.innerHTML = '✅ Löst! / تم الحل!';
    feedbackEl.className = 'game-feedback success';

    if (wheelTarget.example) {
        let exampleHtml = `💡 ${wheelTarget.example}`;
        if (wheelTarget.exampleArb) {
            exampleHtml += `<br><span class="arb-example" style="color: #fbbf24; font-weight: bold; display: block; margin-top: 0.5rem;">${wheelTarget.exampleArb}</span>`;
        }
        exampleEl.innerHTML = exampleHtml;
        exampleEl.classList.remove('hidden');
    }

    if (typeof TTSManager !== 'undefined' && TTSManager) {
        TTSManager.speak(wheelTarget.word.toLowerCase(), 'sv');
    }

    nextBtn.classList.remove('hidden');
}

// Expose to window
(window as any).startWordWheelGame = startWordWheelGame;
(window as any).undoWordWheel = undoWordWheel;
(window as any).skipWordWheel = skipWordWheel;
(window as any).showWordWheelAnswer = showWordWheelAnswer;
