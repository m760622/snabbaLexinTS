/**
 * Memory Game - Neural Memory Ultra
 * TypeScript Version
 */

import { AppConfig } from '../config';

// Column indices
const COL_SWE = AppConfig.COLUMNS.SWEDISH;
const COL_ARB = AppConfig.COLUMNS.ARABIC;
const COL_TYPE = AppConfig.COLUMNS.TYPE;
const COL_EX = AppConfig.COLUMNS.EXAMPLE_SWE;
const COL_EX_ARB = AppConfig.COLUMNS.EXAMPLE_ARB;

// Game state
let cards: HTMLElement[] = [];
let flippedCards: HTMLElement[] = [];
let matchedPairs = 0;
let moves = 0;
let score = 0;
let timer: ReturnType<typeof setInterval> | null = null;
let seconds = 0;
let isProcessing = false;
let currentCategory = 'all';
let comboChain = 0;
let lastMatchTime = 0;
let difficulty: 'easy' | 'hard' = 'easy';
let gameData: any[] = [];

// Apply theme from localStorage (Default: Dark)
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
}

// Wait for dictionary data
declare const dictionaryData: any[];

function waitForData(): Promise<any[]> {
    return new Promise((resolve) => {
        const check = () => {
            if (typeof dictionaryData !== 'undefined' && Array.isArray(dictionaryData) && dictionaryData.length > 0) {
                resolve(dictionaryData);
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

// Initialize game
async function initGame() {
    try {
        // soundManager.init() moved to user interaction
        const data = await waitForData();
        gameData = data;

        // Initialize Audio on first interaction
        const enableAudio = () => {
            soundManager.init();
            soundManager.resume();
            document.removeEventListener('click', enableAudio);
            document.removeEventListener('touchstart', enableAudio);
        };
        document.addEventListener('click', enableAudio);
        document.addEventListener('touchstart', enableAudio);

        startGame();
    } catch (error) {
        console.error('Error initializing memory game:', error);
    }
}

function startGame() {
    resetGame();
    createCards();
    startTimer();
}

function resetGame() {
    cards = [];
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    score = 0;
    score = 0;
    isProcessing = false;
    seconds = 0;
    comboChain = 0;
    lastMatchTime = 0;

    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    updateUI();
}

function getFilteredWords(): any[] {
    let filtered = gameData.filter(row => row[COL_SWE] && row[COL_ARB]);

    if (currentCategory !== 'all') {
        filtered = filtered.filter(row => {
            const type = (row[COL_TYPE] || '').toLowerCase();
            return type.includes(currentCategory);
        });
    }

    // Shuffle and take pairs based on difficulty
    const count = difficulty === 'hard' ? 12 : 6;
    return shuffleArray(filtered).slice(0, count);
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function createCards() {
    const grid = document.getElementById('memoryGrid');
    if (!grid) return;

    grid.innerHTML = '';
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';

    const words = getFilteredWords();

    // Create pairs: one Swedish, one Arabic for each word
    const cardPairs: { text: string; pairId: number; isArabic: boolean; wordData: any }[] = [];

    words.forEach((word, index) => {
        cardPairs.push({
            text: word[COL_SWE],
            pairId: index,
            isArabic: false,
            wordData: word
        });
        cardPairs.push({
            text: word[COL_ARB],
            pairId: index,
            isArabic: true,
            wordData: word
        });
    });

    // Shuffle the cards
    const shuffledCards = shuffleArray(cardPairs);

    // Create card elements
    shuffledCards.forEach((cardData, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.pairId = String(cardData.pairId);
        card.dataset.index = String(index);
        card.style.animationDelay = `${index * 0.05}s`;
        card.style.animation = 'cardEntrance 0.5s ease-out forwards';

        card.addEventListener('animationend', () => {
            card.style.animation = '';
        });

        // Check if Arabic text is short
        const isShort = cardData.isArabic && cardData.text.length < 7;

        card.innerHTML = `
            <div class="face front"></div>
            <div class="face back ${cardData.isArabic ? 'arabic' : ''} ${isShort ? 'is-short' : ''}">
                <div class="card-content">${cardData.text}</div>
            </div>
        `;

        card.addEventListener('click', () => handleCardClick(card, cardData));

        // 3D Tilt Effect
        card.addEventListener('mousemove', (e) => {
            if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('flipped') && !card.classList.contains('matched')) {
                card.style.transform = '';
            }
        });

        grid.appendChild(card);
        cards.push(card);
    });
}

function triggerLocalConfetti(x: number, y: number) {
    if (typeof (window as any).confetti === 'function') {
        const xNorm = x / window.innerWidth;
        const yNorm = y / window.innerHeight;

        (window as any).confetti({
            particleCount: 30,
            spread: 40,
            startVelocity: 20,
            origin: { x: xNorm, y: yNorm },
            colors: ['#34d399', '#22d3ee', '#fbbf24']
        });
    }
}

function handleCardClick(card: HTMLElement, cardData: { pairId: number; wordData: any }) {
    // Ignore if processing, already flipped, or matched
    if (isProcessing || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    // Flip the card
    card.style.transform = ''; // Clear 3D tilt
    card.classList.add('flipped');
    flippedCards.push(card);

    // Play flip sound
    soundManager.playFlip();

    // Check if we have 2 flipped cards
    if (flippedCards.length === 2) {
        isProcessing = true;
        moves++;
        updateUI();

        const [card1, card2] = flippedCards;
        const pairId1 = card1.dataset.pairId;
        const pairId2 = card2.dataset.pairId;

        if (pairId1 === pairId2) {
            // Match!
            handleMatch(cardData.wordData);
        } else {
            // No match
            handleMismatch();
        }
    }
}

function handleMatch(wordData: any) {
    // Check for combo
    const now = Date.now();
    if (now - lastMatchTime < 5000) {
        comboChain++;
    } else {
        comboChain = 1;
    }
    lastMatchTime = now;

    setTimeout(() => {
        flippedCards.forEach(card => {
            card.classList.add('matched');

            // Trigger local particles on each card
            const rect = card.getBoundingClientRect();
            triggerLocalConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });

        matchedPairs++;

        // Score calculation with Combo
        const baseScore = 100 + Math.max(0, 50 - moves * 2);
        const comboBonus = (comboChain - 1) * 50;
        score += baseScore + comboBonus;

        // Show feedback toast
        showFeedbackToast(wordData, comboChain);

        // Play match sound & Speak
        soundManager.playMatch();
        soundManager.speak(wordData[COL_SWE]);

        flippedCards = [];
        isProcessing = false;
        updateUI();

        // Check for game over
        const totalPairs = difficulty === 'hard' ? 12 : 6;
        if (matchedPairs === totalPairs) {
            handleGameOver();
        }
    }, 500);
}

function handleMismatch() {
    setTimeout(() => {
        flippedCards.forEach(card => {
            card.classList.add('shake');
            setTimeout(() => {
                card.classList.remove('shake', 'flipped');
            }, 500);
        });

        // Play wrong sound
        soundManager.playWrong();

        flippedCards = [];
        isProcessing = false;
    }, 1000);
}

function showFeedbackToast(wordData: any, combo: number = 0) {
    const toast = document.getElementById('feedbackToast');
    const wordEl = document.getElementById('ftWord');
    const sweEl = document.getElementById('ftSentenceSwe');
    const arbEl = document.getElementById('ftSentenceArb');

    if (toast && wordEl && sweEl && arbEl) {
        let text = wordData[COL_SWE];
        if (combo > 1) text += ` (COMBO x${combo}!)`;

        wordEl.textContent = text;
        sweEl.textContent = wordData[COL_EX] || '';
        arbEl.textContent = wordData[COL_EX_ARB] || '';

        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
        }, 2500);
    }
}

function handleGameOver() {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }

    // Show game over modal
    const modal = document.getElementById('gameOverModal');
    const finalScoreEl = document.getElementById('finalScore');
    const finalMovesEl = document.getElementById('finalMoves');
    const finalTimeEl = document.getElementById('finalTime');

    if (modal && finalScoreEl && finalMovesEl && finalTimeEl) {
        finalScoreEl.textContent = String(score);
        finalMovesEl.textContent = String(moves);
        finalTimeEl.textContent = formatTime(seconds);

        modal.classList.add('visible');

        // Trigger confetti
        triggerConfetti();
        soundManager.playWin();
    }

    // Save score
    saveGameStats();
}

function startTimer() {
    timer = setInterval(() => {
        seconds++;
        updateUI();
    }, 1000);
}

function formatTime(secs: number): string {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
}

function updateUI() {
    const scoreEl = document.getElementById('scoreValue');
    const movesEl = document.getElementById('movesValue');
    const timerEl = document.getElementById('timerValue');

    if (scoreEl) scoreEl.textContent = String(score);
    if (movesEl) movesEl.textContent = String(moves);
    if (timerEl) timerEl.textContent = formatTime(seconds);
}

// --- Sound Manager ---
class SoundManager {
    private ctx: AudioContext | null = null;
    private enabled: boolean = true;
    private synthesis: SpeechSynthesis;

    constructor() {
        this.synthesis = window.speechSynthesis;
        // Load mute state
        this.enabled = localStorage.getItem('memory_sound_enabled') !== 'false';
    }

    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
        this.updateMuteIcon();
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        localStorage.setItem('memory_sound_enabled', String(this.enabled));
        this.updateMuteIcon();
    }

    private updateMuteIcon() {
        const btn = document.getElementById('soundToggleBtn');
        if (btn) {
            btn.innerHTML = this.enabled ? '🔊' : '🔇';
            btn.classList.toggle('muted', !this.enabled);
        }
    }

    playFlip() {
        if (!this.enabled || !this.ctx) return;
        this.playTone(400, 'sine', 0.1, 0, 0.05);
        this.playTone(600, 'triangle', 0.05, 0.05, 0.02);
    }

    playMatch() {
        if (!this.enabled || !this.ctx) return;
        // Major Chord (C E G) - Bright and Happy
        this.playTone(523.25, 'sine', 0.4, 0, 0.1);   // C5
        this.playTone(659.25, 'sine', 0.4, 0.1, 0.1); // E5
        this.playTone(783.99, 'sine', 0.6, 0.2, 0.1); // G5
        this.playTone(1046.50, 'sine', 0.8, 0.3, 0.05); // C6 (Sparkle)
    }

    playWrong() {
        if (!this.enabled || !this.ctx) return;
        // Dissonant - Gentle warning
        this.playTone(300, 'sawtooth', 0.3, 0, 0.05);
        this.playTone(280, 'sawtooth', 0.3, 0.1, 0.05);
    }

    playWin() {
        if (!this.enabled || !this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
        notes.forEach((freq, i) => {
            this.playTone(freq, 'sine', 0.6, i * 0.15, 0.1);
        });
    }

    private playTone(freq: number, type: OscillatorType, duration: number, delay: number, vol: number) {
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + delay);

        // Envelope: Soft Attack -> Decay
        gain.gain.setValueAtTime(0, this.ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(vol, this.ctx.currentTime + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + delay + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + delay);
        osc.stop(this.ctx.currentTime + delay + duration + 0.1);
    }

    speak(text: string, lang: string = 'sv-SE') {
        if (!this.enabled) return;

        // Cancel current speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.0;

        // Try to find a good voice
        const voices = this.synthesis.getVoices();
        const voice = voices.find(v => v.lang.includes(lang));
        if (voice) utterance.voice = voice;

        this.synthesis.speak(utterance);
    }
}

const soundManager = new SoundManager();

// Expose toggle globally
(window as any).toggleSound = () => soundManager.toggle();

function triggerConfetti() {
    if (typeof (window as any).confetti === 'function') {
        (window as any).confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });
    }
}

function saveGameStats() {
    try {
        const stats = JSON.parse(localStorage.getItem('memoryGameStats') || '{}');
        stats.gamesPlayed = (stats.gamesPlayed || 0) + 1;
        stats.bestScore = Math.max(stats.bestScore || 0, score);
        stats.bestTime = stats.bestTime ? Math.min(stats.bestTime, seconds) : seconds;
        localStorage.setItem('memoryGameStats', JSON.stringify(stats));
    } catch (e) {
        console.error('Error saving stats:', e);
    }
}

// Category & Difficulty
function selectCategory(category: string, element: HTMLElement) {
    currentCategory = category;
    document.querySelectorAll('#categorySelector .pill').forEach(pill => pill.classList.remove('active'));
    element.classList.add('active');
    startGame();
}

function setDifficulty(diff: 'easy' | 'hard', element: HTMLElement) {
    difficulty = diff;
    document.querySelectorAll('#difficultySelector .pill').forEach(pill => pill.classList.remove('active'));
    element.classList.add('active');
    startGame();
}

// Restart game
function restartGame() {
    const modal = document.getElementById('gameOverModal');
    if (modal) {
        modal.classList.remove('visible');
    }
    startGame();
}

// Expose to window
(window as any).selectCategory = selectCategory;
(window as any).setDifficulty = setDifficulty;
(window as any).restartGame = restartGame;

// Initialize on load
document.addEventListener('DOMContentLoaded', initGame);
window.addEventListener('dictionaryLoaded', initGame);