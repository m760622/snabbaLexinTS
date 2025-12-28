import { TTSManager } from '../tts';
import { generateEducationalSentence, TextSizeManager } from '../utils';
import { DictionaryDB } from '../db';

// ========== TYPES ==========

interface DifficultySettings {
    minLen: number;
    maxLen: number;
    lives: number;
    scoreMultiplier: number;
}

interface GameStats {
    gamesPlayed: number;
    wins: number;
    bestStreak: number;
    totalScore: number;
}

interface WordData {
    word: string;
    hint: string;
    type: string;
    example: string;
    id: string;
}

// ========== CONFIGURATION ==========
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ'.split('');
const HANGMAN_PARTS = ['head', 'body', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

const DIFFICULTY: Record<string, DifficultySettings> = {
    easy: { minLen: 3, maxLen: 5, lives: 8, scoreMultiplier: 1 },
    medium: { minLen: 4, maxLen: 8, lives: 6, scoreMultiplier: 1.5 },
    hard: { minLen: 6, maxLen: 12, lives: 4, scoreMultiplier: 2 }
};

const CATEGORIES: Record<string, string | null> = {
    all: null,
    substantiv: 'Substantiv',
    verb: 'Verb',
    adjektiv: 'Adjektiv'
};

const HINT_COSTS: Record<string, number> = { first: 10, type: 5, example: 20 };

// ========== GAME STATE ==========
let currentWord = '';
let currentHint = '';
let currentEntry: any = null;
let guessedLetters: string[] = [];
let wrongGuesses = 0;
let maxLives = 6;
let gameOver = false;
let currentDifficulty = 'medium';
let currentCategory = 'all';
let isDailyMode = false;
let dailyWordsCompleted = 0;
let soundEnabled = true;

// Persistent state
let coins = parseInt(localStorage.getItem('hangman_coins') || '100');
let currentStreak = parseInt(localStorage.getItem('hangman_streak') || '0');
let stats: GameStats = JSON.parse(localStorage.getItem('hangman_stats') || '{"gamesPlayed": 0, "wins": 0, "bestStreak": 0, "totalScore": 0}');

// Column indices (assuming dictionaryData is an array of arrays)
const COL_ID = 0, COL_TYPE = 1, COL_SWE = 2, COL_ARB = 3, COL_SWE_EX = 7;

// ========== INITIALIZATION ==========
export async function init() {
    // Theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    // Mobile view
    if (localStorage.getItem('mobileView') === 'true') {
        document.documentElement.classList.add('iphone-mode');
        document.body.classList.add('iphone-view');
    }

    updateUI();
    checkDailyStatus();

    // Attach to window for HTML access
    (window as any).useHint = useHint;
    (window as any).startNewGame = startNewGame;
    (window as any).learnMore = learnMore;
    (window as any).openStatsModal = openStatsModal;
    (window as any).closeStatsModal = closeStatsModal;
    (window as any).changeDifficulty = changeDifficulty;
    (window as any).changeCategory = changeCategory;
    (window as any).toggleSound = toggleSound;
    (window as any).startDailyChallenge = startDailyChallenge;
    (window as any).guessLetter = guessLetter;
    (window as any).createConfetti = createConfetti;

    // Optimization: Init DB
    try {
        await DictionaryDB.init();
    } catch (e) {
        console.error('DB Init failed', e);
    }

    // Wait for dictionary data if it's not loaded yet
    if ((window as any).dictionaryData) {
        startNewGame();
    } else {
        // Optimistic: Try to start without full data if we have DB? 
        // Hangman needs random words matching criteria. 
        // For now, lazy load the full dictionary to ensure gameplay works, but don't block UI paints.
        import('../loader').then(() => {
            if ((window as any).dictionaryData) {
                startNewGame();
            } else {
                window.addEventListener('dictionaryLoaded', () => startNewGame());
            }
        });
    }
}

// ========== GAME FUNCTIONS ==========
function getRandomWord(): WordData {
    const dictionaryData = (window as any).dictionaryData;
    if (!dictionaryData) {
        console.error('Dictionary data not loaded');
        // Fallback or Loading state could go here
        return { word: 'LADDAR', hint: 'Väntar på data...', type: 'Loading', example: '', id: '0' };
    }

    const diff = DIFFICULTY[currentDifficulty];
    const catFilter = CATEGORIES[currentCategory];

    // Try to pick from a smaller subset if possible for performance? 
    // For now, standard filter is fast enough in JS once data is loaded.
    const pool = dictionaryData.filter((entry: any) => {
        const word = entry[COL_SWE];
        const type = entry[COL_TYPE];
        if (!word || !/^[a-zA-ZåäöÅÄÖ]+$/.test(word)) return false;
        if (word.length < diff.minLen || word.length > diff.maxLen) return false;
        if (catFilter && !type.toLowerCase().includes(catFilter.toLowerCase())) return false;
        return true;
    });

    if (pool.length === 0) return { word: 'TOMT', hint: 'No words found', type: 'Error', example: '', id: '0' };

    const entry = pool[Math.floor(Math.random() * pool.length)];
    currentEntry = entry;
    return {
        word: entry[COL_SWE].toUpperCase(),
        hint: entry[COL_ARB],
        type: entry[COL_TYPE],
        example: entry[COL_SWE_EX] || '',
        id: entry[COL_ID]
    };
}

function startNewGame() {
    const wordData = getRandomWord();
    currentWord = wordData.word;
    currentHint = wordData.hint;
    guessedLetters = [];
    wrongGuesses = 0;
    gameOver = false;
    maxLives = DIFFICULTY[currentDifficulty].lives;

    const mainHint = document.getElementById('mainHint');
    const categoryBadge = document.getElementById('categoryBadge');
    const resultOverlay = document.getElementById('resultOverlay');

    if (mainHint) mainHint.textContent = `🔍 ${currentHint}`;
    if (categoryBadge) categoryBadge.textContent = wordData.type.replace('.', '');
    if (resultOverlay) resultOverlay.classList.remove('visible');

    resetHangman();
    resetHints();
    initLives();
    initKeyboard();
    initWordDisplay();
    updateFace('happy');
}

function initLives() {
    const bar = document.getElementById('livesBar');
    if (!bar) return;
    bar.innerHTML = '';
    for (let i = 0; i < maxLives; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.id = `heart-${i}`;
        heart.textContent = '❤️';
        bar.appendChild(heart);
    }
}

function initKeyboard() {
    const keyboard = document.getElementById('keyboard');
    if (!keyboard) return;
    keyboard.innerHTML = '';
    ALPHABET.forEach(letter => {
        const key = document.createElement('button');
        key.className = 'key';
        key.textContent = letter;
        key.onclick = () => guessLetter(letter, key);
        keyboard.appendChild(key);
    });
}

function initWordDisplay() {
    const display = document.getElementById('wordDisplay');
    if (!display) return;
    display.innerHTML = '';
    currentWord.split('').forEach((_, i) => {
        const slot = document.createElement('div');
        slot.className = 'letter-slot';
        slot.id = `slot-${i}`;
        display.appendChild(slot);
    });
}

function guessLetter(letter: string, keyEl: HTMLElement) {
    if (gameOver || guessedLetters.includes(letter)) return;

    guessedLetters.push(letter);
    keyEl.classList.add('used');

    if (currentWord.includes(letter)) {
        keyEl.classList.add('correct');
        revealLetter(letter);
        playSound('correct');

        if (checkWin()) {
            gameOver = true;
            handleWin();
        }
    } else {
        keyEl.classList.add('wrong');
        wrongGuesses++;
        showHangmanPart(wrongGuesses - 1);
        loseHeart();
        playSound('wrong');
        updateFace(wrongGuesses >= maxLives - 2 ? 'worried' : 'normal');

        if (wrongGuesses >= maxLives) {
            gameOver = true;
            handleLose();
        }
    }
}

function revealLetter(letter: string, isHint = false) {
    currentWord.split('').forEach((char, i) => {
        if (char === letter) {
            const slot = document.getElementById(`slot-${i}`);
            if (slot) {
                slot.textContent = letter;
                slot.classList.add(isHint ? 'hint-revealed' : 'revealed');
            }
        }
    });

    if (TTSManager && soundEnabled) {
        setTimeout(() => TTSManager.speak(letter.toLowerCase(), 'sv'), 50);
    }
}

function checkWin() {
    return currentWord.split('').every(l => guessedLetters.includes(l));
}

function handleWin() {
    const baseScore = 100;
    const livesBonus = (maxLives - wrongGuesses) * 20;
    const diffBonus = DIFFICULTY[currentDifficulty].scoreMultiplier;
    const totalScore = Math.round((baseScore + livesBonus) * diffBonus);

    currentStreak++;
    coins += totalScore;
    stats.wins++;
    stats.gamesPlayed++;
    stats.totalScore += totalScore;
    if (currentStreak > stats.bestStreak) stats.bestStreak = currentStreak;

    saveState();
    updateUI();
    createConfetti();

    if (isDailyMode) {
        dailyWordsCompleted++;
        if (dailyWordsCompleted >= 5) {
            completeDailyChallenge();
        }
    }

    showResult(true, totalScore);
}

function handleLose() {
    currentStreak = 0;
    stats.gamesPlayed++;
    saveState();
    updateUI();
    updateFace('sad');

    // Reveal all letters
    currentWord.split('').forEach((letter, i) => {
        const slot = document.getElementById(`slot-${i}`);
        if (slot && !slot.textContent) {
            slot.textContent = letter;
            slot.classList.add('revealed-wrong');
        }
    });

    showResult(false, 0);
}

// ========== HINTS ==========
function useHint(type: string) {
    const cost = HINT_COSTS[type];
    if (coins < cost) {
        alert('Inte tillräckligt med mynt! / ليس من العملات');
        return;
    }

    if (type === 'first') {
        const firstLetter = currentWord[0];
        if (!guessedLetters.includes(firstLetter)) {
            coins -= cost;
            saveState();
            updateUI();
            guessedLetters.push(firstLetter);
            revealLetter(firstLetter, true);
            const keyEl = Array.from(document.querySelectorAll('.key')).find(k => k.textContent === firstLetter);
            if (keyEl) keyEl.classList.add('used', 'hint-used');
        }
    } else if (type === 'type') {
        const mainHint = document.getElementById('mainHint');
        if (mainHint) {
            coins -= cost;
            saveState();
            updateUI();
            mainHint.textContent += ` (${currentEntry[COL_TYPE]})`;
        }
    } else if (type === 'example') {
        const mainHint = document.getElementById('mainHint');
        const example = currentEntry[COL_SWE_EX];
        if (mainHint && example) {
            coins -= cost;
            saveState();
            updateUI();
            mainHint.textContent = `📝 ${example}`;
        }
    }
}

function resetHangman() {
    document.querySelectorAll('.hangman-part').forEach(part => {
        (part as HTMLElement).style.opacity = '0';
    });
}

function showHangmanPart(index: number) {
    const partName = HANGMAN_PARTS[index];
    if (partName) {
        const part = document.getElementById(partName);
        if (part) part.style.opacity = '1';
    }
}

function loseHeart() {
    const heart = document.getElementById(`heart-${maxLives - wrongGuesses}`);
    if (heart) {
        heart.classList.add('lost');
        setTimeout(() => heart.textContent = '🖤', 300);
    }
}

function updateFace(type: string) {
    const leftEye = document.getElementById('leftEye');
    const rightEye = document.getElementById('rightEye');
    const mouth = document.getElementById('mouth');

    if (!leftEye || !rightEye || !mouth) return;

    // Reset visibility
    leftEye.style.opacity = '1';
    rightEye.style.opacity = '1';
    mouth.style.opacity = '1';

    if (type === 'happy') {
        mouth.setAttribute('d', 'M124,60 Q130,65 136,60');
    } else if (type === 'worried') {
        mouth.setAttribute('d', 'M124,62 Q130,62 136,62');
    } else if (type === 'sad') {
        mouth.setAttribute('d', 'M124,65 Q130,60 136,65');
    }
}

function resetHints() {
    document.querySelectorAll('.hint-chip').forEach(chip => chip.classList.remove('used'));
}

// ========== DAILY CHALLENGE ==========
function getTodayKey() {
    const d = new Date();
    return `hangman_daily_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
}

function checkDailyStatus() {
    const completed = localStorage.getItem(getTodayKey()) === 'completed';
    const btn = document.getElementById('dailyBtn');
    if (btn) {
        if (completed) {
            btn.classList.add('completed');
            btn.textContent = '✅ Klar!';
        }
    }
}

function startDailyChallenge() {
    if (localStorage.getItem(getTodayKey()) === 'completed') return;
    isDailyMode = true;
    dailyWordsCompleted = 0;
    currentDifficulty = 'medium';
    const difficultySelect = document.getElementById('difficultySelect') as HTMLSelectElement;
    if (difficultySelect) difficultySelect.value = 'medium';
    startNewGame();
}

function completeDailyChallenge() {
    localStorage.setItem(getTodayKey(), 'completed');
    coins += 50; // Bonus
    saveState();
    updateUI();
    checkDailyStatus();
    isDailyMode = false;
}

// ========== UI & STATE ==========
function updateUI() {
    const coinsValue = document.getElementById('coinsValue');
    const streakValue = document.getElementById('streakValue');
    if (coinsValue) coinsValue.textContent = coins.toString();
    if (streakValue) streakValue.textContent = currentStreak.toString();
}

function saveState() {
    localStorage.setItem('hangman_coins', coins.toString());
    localStorage.setItem('hangman_streak', currentStreak.toString());
    localStorage.setItem('hangman_stats', JSON.stringify(stats));
}

function showResult(won: boolean, score: number) {
    const overlay = document.getElementById('resultOverlay');
    const resultEmoji = document.getElementById('resultEmoji');
    const resultText = document.getElementById('resultText');
    const resultWord = document.getElementById('resultWord');
    const resultScore = document.getElementById('resultScore');
    const resultStreak = document.getElementById('resultStreak');

    if (overlay) overlay.classList.add('visible');
    if (resultEmoji) resultEmoji.textContent = won ? '🎉' : '😢';
    if (resultText) resultText.textContent = won ? 'Bra jobbat! / أحسنت!' : 'Tyvärr! / للأسف!';

    // Generate educational sentence
    const sent = generateEducationalSentence(
        currentWord,
        currentHint,
        currentEntry[COL_SWE_EX],
        currentEntry[COL_ARB],
        undefined, // No definition available in currentEntry directly, but could be added if needed
        currentEntry[COL_TYPE]
    );

    if (resultWord) {
        resultWord.innerHTML = `
            <div style="margin-bottom: 0.5rem; font-size: 1.4rem; color: #4ade80;">${currentWord}</div>
            <div style="font-size: 1.1rem; color: #cbd5e1;">${sent.s}</div>
            <div style="font-size: 1rem; color: #fbbf24; margin-top: 0.3rem; font-family: 'IBM Plex Sans Arabic', sans-serif;">${sent.a}</div>
        `;
    }

    if (resultScore) resultScore.textContent = won ? `+${score}` : '0';
    if (resultStreak) resultStreak.textContent = currentStreak.toString();

    if (TTSManager && soundEnabled) {
        setTimeout(() => TTSManager.speak(currentWord.toLowerCase(), 'sv'), 500);
    }

    // Apply dynamic text sizing
    if (resultWord) {
        resultWord.querySelectorAll('div').forEach((el, index) => {
            const lines = index === 0 ? 1 : 2; // Word is 1 line, sentence/meaning is 2 lines
            TextSizeManager.apply(el as HTMLElement, el.textContent || '', lines);
        });
    }
}

function learnMore() {
    if (currentEntry) {
        window.location.href = `../details.html?id=${currentEntry[COL_ID]}`;
    }
}

// ========== STATS MODAL ==========
function openStatsModal() {
    const statGamesPlayed = document.getElementById('statGamesPlayed');
    const statWinRate = document.getElementById('statWinRate');
    const statBestStreak = document.getElementById('statBestStreak');
    const statTotalScore = document.getElementById('statTotalScore');
    const statsModal = document.getElementById('statsModal');

    if (statGamesPlayed) statGamesPlayed.textContent = stats.gamesPlayed.toString();
    if (statWinRate) statWinRate.textContent = stats.gamesPlayed > 0 ? Math.round((stats.wins / stats.gamesPlayed) * 100) + '%' : '0%';
    if (statBestStreak) statBestStreak.textContent = stats.bestStreak.toString();
    if (statTotalScore) statTotalScore.textContent = stats.totalScore.toString();
    if (statsModal) statsModal.classList.add('visible');
}

function closeStatsModal() {
    const statsModal = document.getElementById('statsModal');
    if (statsModal) statsModal.classList.remove('visible');
}

// ========== SETTINGS ==========
function changeDifficulty() {
    const difficultySelect = document.getElementById('difficultySelect') as HTMLSelectElement;
    if (difficultySelect) {
        currentDifficulty = difficultySelect.value;
        if (!gameOver) startNewGame();
    }
}

function changeCategory() {
    const categorySelect = document.getElementById('categorySelect') as HTMLSelectElement;
    if (categorySelect) {
        currentCategory = categorySelect.value;
        if (!gameOver) startNewGame();
    }
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.querySelector('.sound-btn');
    if (soundBtn) soundBtn.textContent = soundEnabled ? '🔊' : '🔇';
}

function playSound(type: string) {
    if (!soundEnabled) return;
    // Could add actual sound effects here
    console.log('Play sound:', type);
}

// ========== CONFETTI ==========
function createConfetti() {
    const container = document.getElementById('confettiContainer');
    if (!container) return;
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = (Math.random() * 10 + 5) + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animation = `confettiFall ${Math.random() * 2 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(confetti);
    }

    setTimeout(() => {
        if (container) container.innerHTML = '';
    }, 2000);
}

// ========== KEYBOARD SUPPORT ==========
document.addEventListener('keydown', (e) => {
    const letter = e.key.toUpperCase();
    if (ALPHABET.includes(letter) && !gameOver) {
        const keyEl = Array.from(document.querySelectorAll('.key')).find(k => k.textContent === letter) as HTMLElement;
        if (keyEl && !keyEl.classList.contains('used')) {
            guessLetter(letter, keyEl);
        }
    }
});

// Initial Call
document.addEventListener('DOMContentLoaded', init);
