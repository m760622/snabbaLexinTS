/**
 * Pronunciation Game - مدرب النطق
 * TypeScript Version
 */

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

declare class SpeechRecognition extends EventTarget {
    lang: string;
    continuous: boolean;
    interimResults: boolean;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start(): void;
    stop(): void;
}

declare var webkitSpeechRecognition: typeof SpeechRecognition;

import { AppConfig } from '../config';
import { showToast, saveScore, COL_SWE, COL_ARB } from './games-utils';
import { TTSManager } from '../tts';

// Global declarations
declare const dictionaryData: any[];

console.log("pronunciationGame.ts LOADED");

// State
let pronunciationTarget: string | null = null;
let pronunciationScore = 0;
let isListening = false;
let recognition: SpeechRecognition | null = null;

/**
 * Initialize Speech Recognition
 */
function initSpeechRecognition(): void {
    if ('webkitSpeechRecognition' in window) {
        recognition = new webkitSpeechRecognition();
    } else if ('SpeechRecognition' in window) {
        recognition = new SpeechRecognition();
    } else {
        return;
    }

    recognition.lang = 'sv-SE';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = handleSpeechResult;
    recognition.onerror = handleSpeechError;
    recognition.onend = () => {
        isListening = false;
        updateMicStatus();
    };
}

/**
 * Start Pronunciation Game
 */
export function startPronunciationGame(retryCount = 0): void {
    // Check if dictionary data is loaded
    if (typeof dictionaryData === 'undefined' || dictionaryData.length === 0) {
        if (retryCount < 20) {
            console.log(`[Pronunciation] Data not ready. Retrying (${retryCount + 1}/20)...`);
            setTimeout(() => startPronunciationGame(retryCount + 1), 500);
        } else {
            console.error('[Pronunciation] Data failed to load.');
            showToast('Kunde inte ladda data.', 'error');
        }
        return;
    }

    const wordEl = document.getElementById('pronunciationWord');
    const translationEl = document.getElementById('pronunciationTranslation');
    const feedbackEl = document.getElementById('pronunciationFeedback');
    const nextBtn = document.getElementById('nextPronunciationBtn') as HTMLButtonElement | null;

    if (!wordEl || !translationEl || !feedbackEl) return;

    // Reset
    feedbackEl.innerHTML = '';
    feedbackEl.className = 'pronunciation-feedback';
    if (nextBtn) nextBtn.style.display = 'none';

    // Find a suitable word
    let candidate: any[] | null = null;
    let attempts = 0;

    while (!candidate && attempts < 200) {
        const item = dictionaryData[Math.floor(Math.random() * dictionaryData.length)];
        if (item && item[COL_SWE] && item[COL_ARB] &&
            item[COL_SWE].length >= 3 && item[COL_SWE].length <= 12 &&
            !item[COL_SWE].includes(' ')) {
            candidate = item;
        }
        attempts++;
    }

    if (!candidate) {
        wordEl.textContent = "Fel";
        translationEl.textContent = "Kunde inte hitta ett ord";
        return;
    }

    pronunciationTarget = (candidate[COL_SWE] as string).toLowerCase();
    wordEl.textContent = candidate[COL_SWE];
    translationEl.textContent = candidate[COL_ARB];

    // Initialize recognition if not done
    if (!recognition) {
        initSpeechRecognition();
    }

    // Speak the word for reference
    if (typeof TTSManager !== 'undefined' && TTSManager) {
        setTimeout(() => TTSManager.speak(candidate![COL_SWE], 'sv'), 500);
    }
}

/**
 * Toggle Microphone
 */
export function toggleMic(): void {
    if (!recognition) {
        initSpeechRecognition();
        if (!recognition) {
            showPronunciationFeedback('Tyvärr stöds inte tal i denna webbläsare', 'error');
            return;
        }
    }

    if (isListening) {
        recognition.stop();
        isListening = false;
    } else {
        try {
            recognition.start();
            isListening = true;
        } catch (e) {
            console.error('Speech recognition error:', e);
        }
    }
    updateMicStatus();
}

/**
 * Update Mic Status
 */
function updateMicStatus(): void {
    const micBtn = document.getElementById('micBtn');
    const statusEl = document.getElementById('micStatus');

    if (!micBtn || !statusEl) return;

    if (isListening) {
        micBtn.classList.add('listening');
        statusEl.textContent = 'Lyssnar... / أستمع...';
    } else {
        micBtn.classList.remove('listening');
        statusEl.textContent = 'Tryck för att tala / اضغط للتحدث';
    }
}

/**
 * Handle Speech Result
 */
function handleSpeechResult(event: SpeechRecognitionEvent): void {
    const feedbackEl = document.getElementById('pronunciationFeedback');
    const nextBtn = document.getElementById('nextPronunciationBtn') as HTMLButtonElement | null;
    const scoreEl = document.getElementById('pronunciationScore');

    if (!feedbackEl || !pronunciationTarget) return;

    let transcript = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
    }

    transcript = transcript.toLowerCase().trim();
    console.log('Heard:', transcript, 'Target:', pronunciationTarget);

    // Check if correct (allow some flexibility)
    const isCorrect = transcript.includes(pronunciationTarget) ||
        pronunciationTarget.includes(transcript) ||
        levenshteinDistance(transcript, pronunciationTarget) <= 2;

    if (isCorrect) {
        feedbackEl.innerHTML = `✅ Bra uttal! / نطق ممتاز!<br><span style="opacity:0.7">Du sa: "${transcript}"</span>`;
        feedbackEl.className = 'pronunciation-feedback success';
        pronunciationScore++;
        if (scoreEl) scoreEl.textContent = String(pronunciationScore);

        if (typeof saveScore === 'function') {
            saveScore('pronunciation', pronunciationScore);
        }
    } else {
        feedbackEl.innerHTML = `⚠️ Försök igen!<br><span style="opacity:0.7">Du sa: "${transcript}"</span>`;
        feedbackEl.className = 'pronunciation-feedback warning';
    }

    if (nextBtn) nextBtn.style.display = 'block';
}

/**
 * Handle Speech Error
 */
function handleSpeechError(event: SpeechRecognitionErrorEvent): void {
    console.error('Speech error:', event.error);
    showPronunciationFeedback(`Fel: ${event.error}`, 'error');
}

/**
 * Show Feedback
 */
function showPronunciationFeedback(message: string, type: string): void {
    const feedbackEl = document.getElementById('pronunciationFeedback');
    if (feedbackEl) {
        feedbackEl.textContent = message;
        feedbackEl.className = `pronunciation-feedback ${type}`;
    }
}

/**
 * Levenshtein Distance (for fuzzy matching)
 */
function levenshteinDistance(a: string, b: string): number {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Flag to prevent multiple init calls
let gameInitialized = false;

// Wait for dictionary data to be loaded before starting the game
function waitForDataAndStart(): void {
    if (gameInitialized) return;

    // Check if data is already available
    if (typeof dictionaryData !== 'undefined' && dictionaryData.length > 0) {
        console.log('[Pronunciation] Data already available, starting game...');
        gameInitialized = true;
        startPronunciationGame();
        return;
    }

    // Poll for data availability
    let attempts = 0;
    const maxAttempts = 50;
    const pollInterval = setInterval(() => {
        if (gameInitialized) {
            clearInterval(pollInterval);
            return;
        }
        attempts++;
        if (typeof dictionaryData !== 'undefined' && dictionaryData.length > 0) {
            console.log('[Pronunciation] Data found via polling, starting game...');
            clearInterval(pollInterval);
            gameInitialized = true;
            startPronunciationGame();
        } else if (attempts >= maxAttempts) {
            console.error('[Pronunciation] Timeout waiting for dictionary data');
            clearInterval(pollInterval);
            showToast('Kunde inte ladda data. Uppdatera sidan. / تعذر تحميل البيانات.', 'error');
        }
    }, 100);

    // Also listen for the dictionaryLoaded event
    console.log('[Pronunciation] Waiting for dictionaryLoaded event...');
    window.addEventListener('dictionaryLoaded', () => {
        if (gameInitialized) return;
        console.log('[Pronunciation] dictionaryLoaded event received, starting game...');
        clearInterval(pollInterval);
        gameInitialized = true;
        startPronunciationGame();
    }, { once: true });
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initSpeechRecognition();

    // Bind mic button
    const micBtn = document.getElementById('micBtn');
    if (micBtn) {
        micBtn.onclick = toggleMic;
    }

    // Start waiting for data
    waitForDataAndStart();
});

// Expose to window
(window as any).startPronunciationGame = startPronunciationGame;
(window as any).toggleMic = toggleMic;
