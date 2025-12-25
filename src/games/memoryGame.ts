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
        const data = await waitForData();
        gameData = data;
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
    isProcessing = false;
    seconds = 0;

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

    // Shuffle and take 6 pairs (12 cards)
    return shuffleArray(filtered).slice(0, 6);
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

        // Check if Arabic text is short
        const isShort = cardData.isArabic && cardData.text.length < 7;

        card.innerHTML = `
            <div class="face front"></div>
            <div class="face back ${cardData.isArabic ? 'arabic' : ''} ${isShort ? 'is-short' : ''}">
                <div class="card-content">${cardData.text}</div>
            </div>
        `;

        card.addEventListener('click', () => handleCardClick(card, cardData));

        grid.appendChild(card);
        cards.push(card);
    });
}

function handleCardClick(card: HTMLElement, cardData: { pairId: number; wordData: any }) {
    // Ignore if processing, already flipped, or matched
    if (isProcessing || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }

    // Flip the card
    card.classList.add('flipped');
    flippedCards.push(card);

    // Play flip sound
    playSound('flip');

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
    setTimeout(() => {
        flippedCards.forEach(card => {
            card.classList.add('matched');
        });

        matchedPairs++;
        score += 100 + Math.max(0, 50 - moves * 2); // Bonus for fewer moves

        // Show feedback toast
        showFeedbackToast(wordData);

        // Play match sound
        playSound('match');

        flippedCards = [];
        isProcessing = false;
        updateUI();

        // Check for game over
        if (matchedPairs === 6) {
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
        playSound('wrong');

        flippedCards = [];
        isProcessing = false;
    }, 1000);
}

function showFeedbackToast(wordData: any) {
    const toast = document.getElementById('feedbackToast');
    const wordEl = document.getElementById('ftWord');
    const sweEl = document.getElementById('ftSentenceSwe');
    const arbEl = document.getElementById('ftSentenceArb');

    if (toast && wordEl && sweEl && arbEl) {
        wordEl.textContent = wordData[COL_SWE];
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

function playSound(type: 'flip' | 'match' | 'wrong'): void {
    // Optional: Add sound effects
    try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch (type) {
            case 'flip':
                oscillator.frequency.value = 300;
                gainNode.gain.value = 0.1;
                break;
            case 'match':
                oscillator.frequency.value = 600;
                gainNode.gain.value = 0.15;
                break;
            case 'wrong':
                oscillator.frequency.value = 150;
                gainNode.gain.value = 0.12;
                break;
        }

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Ignore audio errors
    }
}

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

// Category selection
function selectCategory(category: string, element: HTMLElement) {
    currentCategory = category;

    // Update active state
    document.querySelectorAll('.pill').forEach(pill => pill.classList.remove('active'));
    element.classList.add('active');

    // Restart game with new category
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
(window as any).restartGame = restartGame;

// Initialize on load
document.addEventListener('DOMContentLoaded', initGame);
window.addEventListener('dictionaryLoaded', initGame);