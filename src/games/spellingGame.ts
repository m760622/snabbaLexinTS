import { AppConfig } from '../config';
import { showToast, saveScore } from './games-utils';
import { generateEducationalSentence, TextSizeManager } from '../utils';
import { TTSManager } from '../tts';
import { LanguageManager, t } from '../i18n';

// Global declarations
declare const dictionaryData: any[];
declare const soundManager: { playClick?: () => void; playSuccess?: () => void; playError?: () => void } | undefined;
declare const HapticManager: { trigger: (type: string) => void } | undefined;

console.log("spellingGame.ts LOADED");

// State
let spellingCurrentItem: any[] | null = null;
let spellingScore = 0;
let spellingStreak = 0;

/**
 * Start Spelling Game
 */
export function startSpellingGame(retryCount = 0): void {
    if (typeof dictionaryData === 'undefined' || dictionaryData.length === 0) {
        // If data is missing, wait for the event instead of just polling
        console.log("Data not ready for Spelling. Waiting for dictionaryLoaded event...");

        const onDataLoaded = () => {
            console.log("dictionaryLoaded event received in Spelling Game");
            window.removeEventListener('dictionaryLoaded', onDataLoaded);
            startSpellingGame(0);
        };

        window.addEventListener('dictionaryLoaded', onDataLoaded);

        // Keep the polling as a fallback in case the event already fired or fails
        if (retryCount < 20) {
            setTimeout(() => {
                if (typeof dictionaryData === 'undefined' || dictionaryData.length === 0) {
                    // Only retry if still empty
                    startSpellingGame(retryCount + 1);
                }
            }, 500);
        } else {
            console.error("Critical: Data failed to load for Spelling.");
            if (typeof showToast === 'function') showToast(t('common.error'), 'error');
        }
        return;
    }

    spellingScore = 0;
    spellingStreak = 0;
    updateSpellingDisplay();
    loadSpellingQuestion();
    spellingScore = 0;
    spellingStreak = 0;
    updateSpellingDisplay();
    loadSpellingQuestion();
    updateSpellingUI();
}

/**
 * Initialize Language Listener
 */
document.addEventListener('DOMContentLoaded', () => {
    if (LanguageManager) {
        LanguageManager.onLanguageChange(() => {
            updateSpellingUI();
        });
        updateSpellingUI();
    }
});

function updateSpellingUI() {
    const backBtn = document.querySelector('.hud-btn');
    if (backBtn) {
        backBtn.setAttribute('aria-label', t('nav.back'));
        backBtn.setAttribute('title', t('nav.back'));
    }

    // Also trigger global update if needed
    if (LanguageManager) LanguageManager.updateTranslations();
}

/**
 * Update Display
 */
function updateSpellingDisplay(): void {
    const scoreEl = document.getElementById('spellingScore');
    const streakEl = document.getElementById('spellingStreak');
    if (scoreEl) scoreEl.textContent = String(spellingScore);
    if (streakEl) streakEl.textContent = String(spellingStreak);
}

/**
 * Load Question
 */
function loadSpellingQuestion(): void {
    const hintEl = document.getElementById('spellingHint');
    const exampleEl = document.getElementById('spellingExample');
    const optionsEl = document.getElementById('spellingOptions');
    const feedbackEl = document.getElementById('spellingFeedback');
    const nextBtn = document.getElementById('nextSpellingBtn');
    const hintBtn = document.getElementById('spHintBtn');

    if (!hintEl || !optionsEl || !feedbackEl) return;

    // Reset UI
    feedbackEl.innerHTML = '';
    feedbackEl.className = 'sp-feedback';
    if (nextBtn) nextBtn.classList.add('hidden');
    if (hintBtn) hintBtn.classList.remove('hidden');
    optionsEl.innerHTML = `<div class="sp-loading"><div class="sp-loading-spinner"></div><span>${t('common.loading')}</span></div>`;

    // Find a suitable word with translation
    let candidate: any[] | null = null;
    let attempts = 0;

    while (!candidate && attempts < 200) {
        const item = dictionaryData[Math.floor(Math.random() * dictionaryData.length)];
        if (item && item[AppConfig.COLUMNS.SWEDISH] && item[AppConfig.COLUMNS.ARABIC] && item[AppConfig.COLUMNS.SWEDISH].length > 2 && item[AppConfig.COLUMNS.SWEDISH].length < 15) {
            candidate = item;
        }
        attempts++;
    }

    if (!candidate) {
        hintEl.textContent = t('details.noWordFound');
        if (exampleEl) exampleEl.textContent = "";
        optionsEl.innerHTML = `<button class="spelling-option-btn" onclick="loadSpellingQuestion()">${t('learn.tryAgain')}</button>`;
        return;
    }

    spellingCurrentItem = candidate;
    const word = candidate[AppConfig.COLUMNS.SWEDISH] as string;
    const translation = candidate[AppConfig.COLUMNS.ARABIC] as string;

    // Show Arabic translation as hint (hide example until after correct answer)
    hintEl.textContent = translation;
    if (exampleEl) exampleEl.textContent = '';

    // Generate options (1 correct + 3 wrong)
    const options: string[] = [word];
    let optionAttempts = 0;

    while (options.length < 4 && optionAttempts < 100) {
        const randomItem = dictionaryData[Math.floor(Math.random() * dictionaryData.length)];
        if (randomItem && randomItem[AppConfig.COLUMNS.SWEDISH] &&
            randomItem[AppConfig.COLUMNS.SWEDISH] !== word &&
            !options.includes(randomItem[AppConfig.COLUMNS.SWEDISH]) &&
            randomItem[AppConfig.COLUMNS.SWEDISH].length > 2) {
            options.push(randomItem[AppConfig.COLUMNS.SWEDISH]);
        }
        optionAttempts++;
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    // Render options with delay for animation
    setTimeout(() => {
        optionsEl.innerHTML = '';
        options.forEach((option, index) => {
            const btn = document.createElement('button');
            btn.className = 'spelling-option-btn';
            btn.textContent = option;
            btn.style.animationDelay = `${index * 0.1}s`;
            btn.onclick = () => {
                // Play click sound
                if (typeof soundManager !== 'undefined' && soundManager?.playClick) {
                    soundManager.playClick();
                }
                checkSpellingAnswer(option, word, btn);
            };
            optionsEl.appendChild(btn);
        });
    }, 300);

    // Setup speak button
    const speakBtn = document.getElementById('spSpeakHint');
    if (speakBtn) {
        speakBtn.onclick = () => {
            if (typeof TTSManager !== 'undefined' && TTSManager) {
                TTSManager.speak(word, 'sv');
            }
        };
    }
}

/**
 * Check Answer
 */
function checkSpellingAnswer(selected: string, correct: string, btnEl: HTMLButtonElement): void {
    const feedbackEl = document.getElementById('spellingFeedback');
    const nextBtn = document.getElementById('nextSpellingBtn');
    const hintBtn = document.getElementById('spHintBtn');
    const allBtns = document.querySelectorAll('.spelling-option-btn') as NodeListOf<HTMLButtonElement>;

    if (!feedbackEl || !spellingCurrentItem) return;

    // Disable all buttons
    allBtns.forEach(btn => btn.disabled = true);

    // Hide hint button
    if (hintBtn) hintBtn.classList.add('hidden');

    // Common Feedback Generation (Learning-focused)
    const translation = (spellingCurrentItem[AppConfig.COLUMNS.ARABIC] || '') as string;
    const exampleSwe = (spellingCurrentItem[AppConfig.COLUMNS.EXAMPLE_SWE] || '') as string;
    const exampleArb = (spellingCurrentItem[AppConfig.COLUMNS.EXAMPLE_ARB] || '') as string;
    const definitionSwe = (spellingCurrentItem[AppConfig.COLUMNS.DEFINITION] || '') as string;
    const type = (spellingCurrentItem[AppConfig.COLUMNS.TYPE] || 'ord') as string;

    let feedbackHTML = '';

    // Generate educational sentence using shared utility
    if (typeof generateEducationalSentence === 'function') {
        const sentenceData = generateEducationalSentence(correct, translation, exampleSwe, exampleArb, definitionSwe, type);
        feedbackHTML += `<div class="sp-example-sentence">
            <div class="sp-sentence-swe">📖 ${sentenceData.s}</div>
            <div class="sp-sentence-arb calc-text-size">${sentenceData.a}</div>
        </div>`;
    }

    if (selected === correct) {
        btnEl.classList.add('correct');
        spellingScore++;
        spellingStreak++;
        updateSpellingDisplay();

        // Haptic vibration
        if (typeof HapticManager !== 'undefined' && HapticManager) {
            HapticManager.trigger('success');
        } else if (navigator.vibrate) {
            navigator.vibrate([50, 30, 50]);
        }

        // Play success sound
        if (typeof soundManager !== 'undefined' && soundManager?.playSuccess) {
            soundManager.playSuccess();
        }

        feedbackEl.innerHTML = feedbackHTML;
        feedbackEl.className = 'sp-feedback success';

        // Trigger text sizing calc
        if (window.TextSizeManager) {
            window.TextSizeManager.applyRules();
        }

        // Save score
        if (typeof saveScore === 'function') {
            saveScore('spelling', spellingScore);
        }

        // Trigger celebration for streaks
        if (spellingStreak >= 3 && spellingStreak % 3 === 0) {
            if (typeof showToast === 'function') {
                showToast(`🔥 ${t('games.streak').replace('{0}', String(spellingStreak))}`, 'success');
            }
        }
    } else {
        btnEl.classList.add('wrong');

        // Find and highlight correct button
        allBtns.forEach(btn => {
            if (btn.textContent === correct) {
                setTimeout(() => btn.classList.add('correct'), 300);
            }
        });

        feedbackEl.innerHTML = feedbackHTML;
        feedbackEl.className = 'sp-feedback';

        spellingStreak = 0;
        updateSpellingDisplay();

        // Play error sound
        if (typeof soundManager !== 'undefined' && soundManager?.playError) {
            soundManager.playError();
        }
    }

    // Always speak the word for learning
    if (typeof TTSManager !== 'undefined' && TTSManager) {
        TTSManager.speak(correct, 'sv');
    }

    if (nextBtn) nextBtn.classList.remove('hidden');
}

/**
 * Show Hint (reveal first letter)
 */
export function showSpellingHint(): void {
    if (!spellingCurrentItem) return;

    const word = spellingCurrentItem[AppConfig.COLUMNS.SWEDISH] as string;
    const firstLetter = word.charAt(0).toUpperCase();

    if (typeof showToast === 'function') {
        showToast(`💡 ${t('games.firstLetter').replace('{0}', firstLetter)}`, 'info');
    }

    // Disable hint button after use
    const hintBtn = document.getElementById('spHintBtn') as HTMLButtonElement | null;
    if (hintBtn) {
        hintBtn.disabled = true;
        hintBtn.style.opacity = '0.5';
    }
}

// Expose to window
(window as any).startSpellingGame = startSpellingGame;
(window as any).showSpellingHint = showSpellingHint;
(window as any).loadSpellingQuestion = loadSpellingQuestion;
