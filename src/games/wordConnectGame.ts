/**
 * Swedish Word Connect Game Module
 * TypeScript Version
 */

import { WCTheme, WCLevel, WCDictionaryEntry } from '../types';
import { WC_THEMES, WC_PREDEFINED_LEVELS, WC_DICTIONARY, getThemeForChapter } from '../data/wordConnectData';
import { showToast, saveScore, toggleMobileView, toggleFocusMode } from './games-utils';
// Import games-utils module to trigger theme initialization
import './games-utils';

// Expose toggle functions globally
(window as any).toggleMobileView = toggleMobileView;
(window as any).toggleFocusMode = toggleFocusMode;

// Theme Toggle Function
function toggleTheme(): void {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);

    if (newTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
    }

    localStorage.setItem('theme', newTheme);

    // Update button icon
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    }

    showToast(newTheme === 'dark' ? '🌙 الوضع الليلي / Mörkt läge' : '☀️ الوضع النهاري / Ljust läge', 'success');
}

(window as any).toggleTheme = toggleTheme;

// ========================================
// Types & Interfaces
// ========================================

interface WCConfig {
    totalChapters: number;
    stagesPerChapter: number;
    hintCost: number;
    version: string;
}

interface WCState {
    chapter: number;
    stage: number;
    maxChapter: number;
    maxStage: number;
    bombActive: boolean;
    bombIndex: number;
    bombTimer: number;
    bombInterval: ReturnType<typeof setInterval> | null;
    glowTimer: ReturnType<typeof setTimeout> | null;
    currentProverbId: number;
    proverbProgress: number;
    coins: number;
    currentLevelData: LevelData | null;
    foundWords: string[];
    currentInput: string;
    isDragging: boolean;
    visitedNodes: number[];
    svgLine: SVGSVGElement | null;
    streak: number;
    lastLogin: string | null;
    bonusWords: string[];
    timerInterval: ReturnType<typeof setInterval> | null;
    comboCount: number;
    lastWordTime: number;
    generatedLevels: Record<string, LevelData>;
    usedRootWords: string[];
    learnedWords: Record<string, string[]>;
    levelCountdownInterval?: ReturnType<typeof setInterval>;
    centerX?: number;
    centerY?: number;
}

interface LevelData {
    id?: string;
    tier?: number;
    main_chars: string;
    targets: string[];
    words: string[];
    letters: string[];
    dictionary?: Record<string, { ar: string; sv: string; st: string }>;
    validWords?: string[];
}

interface DictionaryEntry {
    w: string;
    t: string;
    s?: string;
    st?: string;
    ar?: string;
    sv?: string;
}

interface ThemeData {
    id: string;
    name: string;
    icon: string;
    accent: string;
    background: string;
    words?: (string | { word: string })[];
}

interface ProverbData {
    id: number;
    text: string;
    translation: string;
}

interface Achievement {
    id: string;
    name: string;
    icon: string;
    unlocked: boolean;
}

interface EnhancedStats {
    totalWords: number;
    totalPlayTime: number;
    accuracy: number;
    wrongAttempts: number;
    correctAttempts: number;
    weeklyProgress: number[];
    hardestWords: string[];
}

interface PlayerLevel {
    level: string;
    xp: number;
    wordsToNextLevel: number;
}

interface EnhancedState {
    dailyStreak: number;
    lastPlayDate: string | null;
    achievements: Record<string, Achievement>;
    stats: EnhancedStats;
    playerLevel: PlayerLevel;
    speechSpeed: number;
    nightModeAuto: boolean;
    sessionStartTime: number;
}

interface DragTrailSystem {
    canvas: HTMLCanvasElement | null;
    ctx: CanvasRenderingContext2D | null;
    points: { x: number; y: number; alpha: number; size: number }[];
    isActive: boolean;
    animationFrame: number | null;
    init(): void;
    resize(): void;
    addPoint(x: number, y: number): void;
    animate(): void;
    clear(): void;
}

// Declare global functions and variables from other modules (attached to window in HTML or other scripts)
declare function showStatsModal(): void;
declare function showAchievementsModal(): void;
declare function showDailyWheel(): void;
declare function spinDailyWheel(): void;
declare function closeDailyWheel(): void;

declare const soundManager: {
    toggle?: () => boolean;
    playLetterSelect?: () => void;
    playShuffle?: () => void;
    playSuccess?: () => void;
    playError?: () => void;
    playClick?: () => void;
    playWordFound?: () => void;
    playStreak?: (streak: number) => void;
} | undefined;

// ========================================
// Configuration & State
// ========================================

const WC_CONFIG: WCConfig = {
    totalChapters: 10,
    stagesPerChapter: 10,
    hintCost: 5,
    version: "2.0"
};

const BONUS_REWARD = 5;

let wcState: WCState = {
    chapter: 1,
    stage: 1,
    maxChapter: 1,
    maxStage: 1,
    bombActive: false,
    bombIndex: -1,
    bombTimer: 0,
    bombInterval: null,
    glowTimer: null,
    currentProverbId: 1,
    proverbProgress: 0,
    coins: 300,
    currentLevelData: null,
    foundWords: [],
    currentInput: "",
    isDragging: false,
    visitedNodes: [],
    svgLine: null,
    streak: 0,
    lastLogin: null,
    bonusWords: [],
    timerInterval: null,
    comboCount: 0,
    lastWordTime: 0,
    generatedLevels: {},
    usedRootWords: [],
    learnedWords: {}
};

let WC_OPTIMIZED_DICT: {
    byLength: Record<number, string[]>;
    allWords: string[];
} = {
    byLength: {},
    allWords: []
};

let wcInitRetries = 0;
let coinAnimationFrame: number | null = null;

// ========================================
// Initialization
// ========================================

export function initWordConnect(): void {
    console.log("Initializing Word Connect Module...");

    if (typeof WC_PREDEFINED_LEVELS === 'undefined' || typeof WC_DICTIONARY === 'undefined') {
        if (wcInitRetries < 5) {
            wcInitRetries++;
            console.warn(`Word Connect: Data not ready. Retrying (${wcInitRetries}/5)...`);
            setTimeout(initWordConnect, 500);
            return;
        }
        console.error("Word Connect: WC_PREDEFINED_LEVELS or WC_DICTIONARY is missing!");
        showToast("Ett fel uppstod: Speldata laddades inte. / حدث خطأ: بيانات اللعبة لم يتم تحميلها.", "error");
        return;
    }

    wcInitRetries = 0;
    buildOptimizedDictionary();
    initParticles();
    loadProgress();
    initThemeToggleIcon();
    startLevel(wcState.chapter, wcState.stage);
}

function initThemeToggleIcon(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) {
        themeBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
    }
}

function initParticles(): void {
    const container = document.getElementById('wcParticles');
    if (!container) return;

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.opacity = `${0.3 + Math.random() * 0.4}`;
        container.appendChild(particle);
    }
}

function buildOptimizedDictionary(): void {
    console.log("Building Optimized Dictionary...");
    WC_OPTIMIZED_DICT.byLength = {};
    WC_OPTIMIZED_DICT.allWords = [];

    WC_DICTIONARY.forEach(entry => {
        const word = entry.w.toUpperCase();
        const len = word.length;

        if (!WC_OPTIMIZED_DICT.byLength[len]) WC_OPTIMIZED_DICT.byLength[len] = [];
        WC_OPTIMIZED_DICT.byLength[len].push(word);
        WC_OPTIMIZED_DICT.allWords.push(word);
    });
    console.log("Dictionary Indexed.", WC_OPTIMIZED_DICT);
}

// ========================================
// Progress Management
// ========================================

function loadProgress(): void {
    const saved = localStorage.getItem('wcProgress');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.version !== WC_CONFIG.version) {
            console.log("New version detected. Resetting progress.");
            localStorage.removeItem('wcProgress');
            wcState.chapter = 1;
            wcState.stage = 1;
            wcState.maxChapter = 1;
            wcState.maxStage = 1;
            wcState.coins = 300;
        } else {
            wcState.chapter = parsed.chapter || 1;
            wcState.stage = parsed.stage || 1;
            wcState.maxChapter = parsed.maxChapter || 1;
            wcState.maxStage = parsed.maxStage || 1;
            wcState.coins = parsed.coins || 300;
            wcState.usedRootWords = parsed.usedRootWords || [];
            wcState.currentProverbId = parsed.currentProverbId || 1;
            wcState.proverbProgress = parsed.proverbProgress || 0;
            wcState.learnedWords = parsed.learnedWords || {};
        }
    }
    updateCoinDisplay();
}

function saveProgress(): void {
    if (wcState.chapter > wcState.maxChapter) {
        wcState.maxChapter = wcState.chapter;
        wcState.maxStage = wcState.stage;
    } else if (wcState.chapter === wcState.maxChapter && wcState.stage > wcState.maxStage) {
        wcState.maxStage = wcState.stage;
    }

    const data = {
        chapter: wcState.chapter,
        stage: wcState.stage,
        maxChapter: wcState.maxChapter,
        maxStage: wcState.maxStage,
        coins: wcState.coins,
        streak: wcState.streak,
        lastLogin: wcState.lastLogin,
        version: WC_CONFIG.version,
        usedRootWords: wcState.usedRootWords,
        learnedWords: wcState.learnedWords
    };

    localStorage.setItem('wcProgress', JSON.stringify(data));
    updateCoinDisplay();
}

// ========================================
// UI Updates
// ========================================

function updateCoinDisplay(animate = true): void {
    const el = document.getElementById('wcCoinCount');
    if (el) {
        const currentValue = parseInt(el.textContent || '0') || 0;
        const targetValue = wcState.coins;

        if (animate && currentValue !== targetValue) {
            animateCounter(el, currentValue, targetValue);
        } else {
            el.textContent = String(wcState.coins);
        }
    }

    const streakEl = document.getElementById('wcStreakCount');
    if (streakEl) streakEl.textContent = String(wcState.streak || 0);

    const bonusEl = document.getElementById('wcBonusCount');
    if (bonusEl) bonusEl.textContent = String(wcState.bonusWords ? wcState.bonusWords.length : 0);
}

function animateCounter(element: HTMLElement, from: number, to: number): void {
    if (coinAnimationFrame) cancelAnimationFrame(coinAnimationFrame);

    const duration = 500;
    const startTime = performance.now();
    const diff = to - from;

    function step(currentTime: number): void {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - (1 - progress) * (1 - progress);
        const currentValue = Math.round(from + diff * easeProgress);
        element.textContent = String(currentValue);

        if (diff > 0) {
            element.style.transform = `scale(${1 + (0.2 * (1 - progress))})`;
            element.style.color = '#22c55e';
        } else if (diff < 0) {
            element.style.color = '#ef4444';
        }

        if (progress < 1) {
            coinAnimationFrame = requestAnimationFrame(step);
        } else {
            element.textContent = String(to);
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }
    }

    coinAnimationFrame = requestAnimationFrame(step);
}

function updateStreakDisplay(): void {
    const streakEl = document.getElementById('wcStreakCount');
    const streakPill = document.querySelector('.wc-streak-pill');

    if (streakEl) {
        const streak = wcState.streak || 0;
        streakEl.textContent = String(streak);

        if (streakPill) {
            if (streak >= 3) {
                streakPill.classList.add('streak-on-fire');
            } else {
                streakPill.classList.remove('streak-on-fire');
            }
            streakPill.classList.add('streak-pop');
            setTimeout(() => streakPill.classList.remove('streak-pop'), 300);
        }
    }
}

// ========================================
// Sound Toggle
// ========================================

(window as any).toggleSound = function (): void {
    if (typeof soundManager !== 'undefined' && soundManager.toggle) {
        const enabled = soundManager.toggle();
        const iconEl = document.getElementById('wcSoundIcon');
        if (iconEl) {
            iconEl.textContent = enabled ? '🔊' : '🔇';
        }
        if (typeof showToast === 'function') {
            showToast(enabled ? 'الصوت مفعّل / Ljud på' : 'الصوت مغلق / Ljud av', 'info');
        }
    }
};

// ========================================
// Difficulty Logic
// ========================================

interface Difficulty {
    minWords: number;
    maxWords: number;
    maxLength: number;
    dist: Record<number, number> | null;
}

function getDifficulty(chapter: number, stage: number): Difficulty {
    const levelIndex = (chapter - 1) * 10 + stage;

    if (chapter === 1) {
        if (stage <= 5) {
            return { minWords: 2, maxWords: 3, maxLength: 3, dist: { 2: 1, 3: 2 } };
        } else {
            return { minWords: 3, maxWords: 4, maxLength: 3, dist: { 2: 2, 3: 2 } };
        }
    }

    if (chapter === 2) {
        if (stage <= 5) {
            return { minWords: 3, maxWords: 3, maxLength: 3, dist: { 2: 1, 3: 2 } };
        } else {
            return { minWords: 3, maxWords: 3, maxLength: 3, dist: { 3: 3 } };
        }
    }

    if (levelIndex <= 30) {
        return { minWords: 5, maxWords: 6, maxLength: 5, dist: { 3: 3, 4: 3 } };
    } else {
        return { minWords: 6, maxWords: 8, maxLength: 6, dist: null };
    }
}

// ========================================
// Level Management
// ========================================

function startLevel(chapter: number, stage: number): void {
    try {
        const modal = document.getElementById('wcLevelSelectModal');
        if (modal) modal.classList.add('hidden');

        const gameContainer = document.querySelector('.wc-game-container') as HTMLElement;
        if (gameContainer) {
            gameContainer.classList.add('level-transitioning');
        }

        setTimeout(() => {
            performLevelStart(chapter, stage, gameContainer);
        }, 150);

    } catch (err) {
        console.error("Error in startLevel:", err);
    }
}

function performLevelStart(chapter: number, stage: number, gameContainer: HTMLElement | null): void {
    try {
        wcState.chapter = chapter;
        wcState.stage = stage;
        wcState.foundWords = [];
        wcState.currentInput = "";
        wcState.isDragging = false;
        wcState.visitedNodes = [];
        wcState.bonusWords = [];
        wcState.comboCount = 0;
        wcState.lastWordTime = 0;
        if (wcState.timerInterval) clearInterval(wcState.timerInterval);

        const timerEl = document.getElementById('wcTimer');
        if (timerEl) {
            timerEl.style.display = 'none';
            timerEl.style.animation = 'none';
        }

        const titleEl = document.getElementById('wcLevelTitle');
        if (titleEl) titleEl.textContent = `Nivå ${chapter}-${stage}`;

        const completeModal = document.getElementById('wcLevelCompleteModal');
        if (completeModal) completeModal.style.display = 'none';

        if (typeof getThemeForChapter === 'function') {
            const theme = getThemeForChapter(chapter);
            if (theme && titleEl) {
                titleEl.textContent = `${theme.icon} ${chapter}-${stage}`;
                document.documentElement.style.setProperty('--wc-accent', theme.accent);
            }
        }

        const hintBtn = document.querySelector('.wc-hint-btn') as HTMLElement;
        if (hintBtn) hintBtn.style.display = 'flex';

        const nextBtn = document.getElementById('wcNextLevelBtn');
        if (nextBtn) nextBtn.style.display = 'none';

        updateCoinDisplay();

        const transEl = document.getElementById('wcTranslationDisplay');
        if (transEl) {
            transEl.innerHTML = '';
            transEl.style.opacity = '0';
            transEl.onclick = null;
            transEl.style.cursor = 'default';
        }

        const levelIndex = (chapter - 1) * 10 + (stage - 1);
        wcState.currentLevelData = getNextLevel(levelIndex + 1);

        if (!wcState.currentLevelData || !wcState.currentLevelData.targets || wcState.currentLevelData.targets.length === 0) {
            console.error("Failed to load level data", wcState.currentLevelData);
            throw new Error("Kunde inte ladda nivådata / فشل تحميل بيانات المستوى");
        }

        if (typeof wcState.currentLevelData.main_chars === 'string') {
            wcState.currentLevelData.letters = wcState.currentLevelData.main_chars.split('');
        } else if (!wcState.currentLevelData.letters) {
            wcState.currentLevelData.letters = String(wcState.currentLevelData.main_chars).split('');
        }

        if (!wcState.currentLevelData.words) {
            wcState.currentLevelData.words = wcState.currentLevelData.targets;
        }

        renderGrid();

        wcState.bombActive = false;
        if (wcState.bombInterval) clearInterval(wcState.bombInterval);

        renderWheel();

        if (gameContainer) {
            setTimeout(() => {
                gameContainer.classList.remove('level-transitioning');
            }, 50);
        }
    } catch (error) {
        console.error("Error starting level:", error);
        showToast(`Fel: ${(error as Error).message} / خطأ: ${(error as Error).message}`, "error");
        if (gameContainer) gameContainer.classList.remove('level-transitioning');
    }
}

// ========================================
// Level Generation
// ========================================

function getNextLevel(currentLevel: number): LevelData | null {
    const chapter = Math.ceil(currentLevel / 10);
    const stage = (currentLevel - 1) % 10 + 1;
    const levelKey = `${chapter}-${stage}`;

    if (WC_PREDEFINED_LEVELS[levelKey]) {
        console.log(`Loading predefined level: ${levelKey}`);
        const level = WC_PREDEFINED_LEVELS[levelKey];
        const limitedWords = level.words;

        let letters = level.letters;
        const mainWord = level.words[0];
        if (mainWord && letters.join('') === mainWord) {
            letters = shuffleLetters(mainWord);
        } else {
            for (let i = letters.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [letters[i], letters[j]] = [letters[j], letters[i]];
            }
        }

        const levelDictionary: Record<string, { ar: string; sv: string; st: string }> = {};
        level.validWords.forEach((w: string) => {
            const entry = WC_DICTIONARY.find(item => item.w === w);
            if (entry) {
                levelDictionary[w] = { ar: entry.t, sv: entry.s || "", st: entry.st || "" };
            } else {
                levelDictionary[w] = { ar: "", sv: "", st: "" };
            }
        });

        return {
            id: levelKey,
            tier: chapter,
            main_chars: letters.join(''),
            targets: limitedWords,
            words: limitedWords,
            letters: letters,
            dictionary: levelDictionary,
            validWords: level.validWords
        };
    }

    console.error(`Level ${levelKey} not found in static data!`);
    return null;
}

function shuffleLetters(word: string): string[] {
    let arr = word.split('');
    if (arr.length <= 3) {
        return arr.sort(() => Math.random() - 0.5);
    }

    let shuffled: string[];
    let attempts = 0;
    do {
        shuffled = [...arr].sort(() => Math.random() - 0.5);
        attempts++;
    } while (shuffled.join('') === word && attempts < 10);

    return shuffled;
}

(window as any).shuffleWheelLetters = function (): void {
    if (!wcState.currentLevelData || !wcState.currentLevelData.letters) return;

    let arr = [...wcState.currentLevelData.letters];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    wcState.currentLevelData.letters = arr;
    renderWheel();

    if (typeof soundManager !== 'undefined' && soundManager.playShuffle) {
        soundManager.playShuffle();
    }
};

// ========================================
// Helper Functions
// ========================================

function getCharMap(str: string): Record<string, number> {
    const map: Record<string, number> = {};
    for (const char of str) {
        const upper = char.toLocaleUpperCase('sv-SE');
        map[upper] = (map[upper] || 0) + 1;
    }
    return map;
}

function isSubset(word: string, letterMap: Record<string, number>): boolean {
    const wordMap = getCharMap(word);
    for (const char in wordMap) {
        if (!letterMap[char] || wordMap[char] > letterMap[char]) {
            return false;
        }
    }
    return true;
}

// ========================================
// Rendering
// ========================================

function renderGrid(): void {
    const gridContainer = document.getElementById('wcGridContainer');
    if (!gridContainer || !wcState.currentLevelData) return;

    gridContainer.innerHTML = '';

    wcState.currentLevelData.words.forEach(word => {
        const wordRow = document.createElement('div');
        wordRow.className = 'wc-word-row';
        wordRow.dataset.word = word;

        for (let i = 0; i < word.length; i++) {
            const letterBox = document.createElement('div');
            letterBox.className = 'wc-slot';
            letterBox.dataset.letter = word[i];
            wordRow.appendChild(letterBox);
        }
        gridContainer.appendChild(wordRow);
    });
}

function renderWheel(): void {
    const wheelContainer = document.getElementById('wcWheel');
    if (!wheelContainer || !wcState.currentLevelData) return;

    wheelContainer.innerHTML = '';

    const letters = wcState.currentLevelData.letters;
    const containerSize = 286;
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const letterSize = 48;
    const letterHalf = letterSize / 2;
    const radius = 109;
    const angleStep = (2 * Math.PI) / letters.length;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "wc-connector-lines");
    svg.setAttribute("width", String(containerSize));
    svg.setAttribute("height", String(containerSize));
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    svg.style.zIndex = "20"; // Above hint button (z-index: 10)

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" type="matrix" 
                values="0 0 0 0 0.13
                        0 0 0 0 0.83
                        0 0 0 0 0.93
                        0 0 0 1 0" result="colorBlur"/>
            <feMerge>
                <feMergeNode in="colorBlur" />
                <feMergeNode in="SourceGraphic" />
            </feMerge>
        </filter>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#22d3ee" />
            <stop offset="50%" stop-color="#60a5fa" />
            <stop offset="100%" stop-color="#fbbf24" />
        </linearGradient>
    `;
    svg.appendChild(defs);

    const staticGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    staticGroup.setAttribute("id", "wc-static-lines");
    svg.appendChild(staticGroup);

    const dynamicLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    dynamicLine.setAttribute("id", "wc-dynamic-line");
    dynamicLine.setAttribute("stroke", "url(#lineGradient)");
    dynamicLine.setAttribute("stroke-width", "12");
    dynamicLine.setAttribute("stroke-linecap", "round");
    dynamicLine.setAttribute("filter", "url(#neonGlow)");
    dynamicLine.setAttribute("opacity", "0");
    svg.appendChild(dynamicLine);

    wheelContainer.appendChild(svg);
    wcState.svgLine = svg;

    letters.forEach((char, index) => {
        const angle = index * angleStep - (Math.PI / 2);
        const centerPosX = centerX + radius * Math.cos(angle);
        const centerPosY = centerY + radius * Math.sin(angle);
        const leftPos = centerPosX - letterHalf;
        const topPos = centerPosY - letterHalf;

        const btn = document.createElement('div');
        btn.className = 'wc-letter-node';
        btn.textContent = char;
        btn.style.left = `${leftPos}px`;
        btn.style.top = `${topPos}px`;
        btn.dataset.index = String(index);
        btn.dataset.char = char;
        btn.dataset.x = String(centerPosX);
        btn.dataset.y = String(centerPosY);

        wheelContainer.appendChild(btn);
    });

    wheelContainer.addEventListener('pointerdown', handleInputStart);
    wheelContainer.addEventListener('pointermove', handleInputMove);
    wheelContainer.addEventListener('pointerup', handleInputEnd);
    wheelContainer.addEventListener('pointercancel', handleInputEnd);
    wheelContainer.addEventListener('pointerleave', handleInputEnd);
}

// ========================================
// Input Handling
// ========================================

function handleInputStart(e: Event): void {
    const event = e as PointerEvent;
    event.preventDefault();
    const container = document.getElementById('wcWheel');
    if (!container) return;

    try {
        container.setPointerCapture(event.pointerId);
    } catch (e) {
        console.warn("Pointer capture failed:", e);
    }

    const rect = container.getBoundingClientRect();
    const scaleX = 286 / rect.width;
    const scaleY = 286 / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const hitRadius = 50;
    const letters = container.querySelectorAll('.wc-letter-node');
    let hitLetter: HTMLElement | null = null;

    letters.forEach(btn => {
        const btnX = parseFloat((btn as HTMLElement).dataset.x || '0');
        const btnY = parseFloat((btn as HTMLElement).dataset.y || '0');
        const distSq = (mouseX - btnX) ** 2 + (mouseY - btnY) ** 2;

        if (distSq < hitRadius ** 2) {
            hitLetter = btn as HTMLElement;
        }
    });

    if (hitLetter) {
        if (!wcState.isDragging && wcState.visitedNodes.length === 0) {
            wcState.isDragging = true;
            wcState.currentInput = "";
            wcState.visitedNodes = [];

            const staticGroup = wcState.svgLine?.querySelector('#wc-static-lines');
            if (staticGroup) staticGroup.innerHTML = '';

            document.querySelectorAll('.wc-letter-node').forEach(el => el.classList.remove('selected'));
        }

        wcState.isDragging = true;

        const index = parseInt((hitLetter as HTMLElement).dataset.index || '0');
        if (!wcState.visitedNodes.includes(index)) {
            selectNode(hitLetter as HTMLElement);
        }
    }
}

function handleInputMove(e: Event): void {
    if (!wcState.isDragging) return;
    const event = e as PointerEvent;
    event.preventDefault();

    const container = document.getElementById('wcWheel');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const scaleX = 286 / rect.width;
    const scaleY = 286 / rect.height;
    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    if (wcState.visitedNodes.length > 0) {
        const lastIndex = wcState.visitedNodes[wcState.visitedNodes.length - 1];
        const lastEl = container.querySelector(`.wc-letter-node[data-index="${lastIndex}"]`) as HTMLElement;

        if (lastEl) {
            const startX = parseFloat(lastEl.dataset.x || '0');
            const startY = parseFloat(lastEl.dataset.y || '0');

            const dynLine = document.getElementById('wc-dynamic-line');
            if (dynLine) {
                dynLine.setAttribute("x1", String(startX));
                dynLine.setAttribute("y1", String(startY));
                dynLine.setAttribute("x2", String(mouseX));
                dynLine.setAttribute("y2", String(mouseY));
                dynLine.setAttribute("opacity", "1");
            }
        }
    }

    const hitRadius = 50;
    const letters = container.querySelectorAll('.wc-letter-node');

    letters.forEach(btn => {
        const btnX = parseFloat((btn as HTMLElement).dataset.x || '0');
        const btnY = parseFloat((btn as HTMLElement).dataset.y || '0');
        const distSq = (mouseX - btnX) ** 2 + (mouseY - btnY) ** 2;

        if (distSq < hitRadius ** 2) {
            const index = parseInt((btn as HTMLElement).dataset.index || '0');

            if (wcState.visitedNodes.length >= 2 &&
                index === wcState.visitedNodes[wcState.visitedNodes.length - 2]) {
                const lastIndex = wcState.visitedNodes.pop()!;
                wcState.currentInput = wcState.currentInput.slice(0, -1);
                const previewEl = document.getElementById('wcPreviewText');
                if (previewEl) previewEl.textContent = wcState.currentInput;

                const lastBtn = container.querySelector(`.wc-letter-node[data-index="${lastIndex}"]`);
                if (lastBtn) lastBtn.classList.remove('selected');

                updateConnectionLine();
                return;
            }

            if (!wcState.visitedNodes.includes(index)) {
                selectNode(btn as HTMLElement);
            }
        }
    });
}

function handleInputEnd(e: Event): void {
    if (!wcState.isDragging) return;
    const event = e as PointerEvent;

    const container = document.getElementById('wcWheel');
    if (container) {
        try {
            if (container.hasPointerCapture(event.pointerId)) {
                container.releasePointerCapture(event.pointerId);
            }
        } catch (e) {
            // Ignore release errors
        }
    }

    if (wcState.visitedNodes.length >= 2) {
        wcState.isDragging = false;

        const dynLine = document.getElementById('wc-dynamic-line');
        if (dynLine) dynLine.setAttribute("opacity", "0");

        validateWord();
        setTimeout(() => {
            document.querySelectorAll('.wc-letter-node').forEach(el => el.classList.remove('selected'));

            const staticGroup = wcState.svgLine?.querySelector('#wc-static-lines');
            if (staticGroup) staticGroup.innerHTML = '';

            const previewEl = document.getElementById('wcPreviewText');
            if (previewEl) previewEl.textContent = "";
            wcState.visitedNodes = [];
            wcState.currentInput = "";
        }, 300);
    } else {
        wcState.isDragging = false;

        const dynLine = document.getElementById('wc-dynamic-line');
        if (dynLine) dynLine.setAttribute("opacity", "0");

        if (wcState.visitedNodes.length < 2) {
            setWheelState('default');
        }
    }
}

function selectNode(el: HTMLElement): void {
    const index = parseInt(el.dataset.index || '0');
    const char = el.dataset.char || '';
    wcState.visitedNodes.push(index);
    wcState.currentInput += char;
    el.classList.add('selected');

    const previewEl = document.getElementById('wcPreviewText');
    if (previewEl) previewEl.textContent = wcState.currentInput;

    if (typeof soundManager !== 'undefined' && soundManager.playLetterSelect) {
        soundManager.playLetterSelect();
    }

    if (wcState.visitedNodes.length > 1) {
        const prevIndex = wcState.visitedNodes[wcState.visitedNodes.length - 2];
        const container = document.getElementById('wcWheel');
        const prevEl = container?.querySelector(`.wc-letter-node[data-index="${prevIndex}"]`) as HTMLElement;
        if (prevEl) drawLine(prevEl, el);
    }
}

function drawLine(startEl: HTMLElement, endEl: HTMLElement): void {
    const x1 = parseFloat(startEl.dataset.x || '0');
    const y1 = parseFloat(startEl.dataset.y || '0');
    const x2 = parseFloat(endEl.dataset.x || '0');
    const y2 = parseFloat(endEl.dataset.y || '0');

    const staticGroup = wcState.svgLine?.querySelector('#wc-static-lines');
    if (staticGroup) {
        const glowLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        glowLine.setAttribute("x1", String(x1));
        glowLine.setAttribute("y1", String(y1));
        glowLine.setAttribute("x2", String(x2));
        glowLine.setAttribute("y2", String(y2));
        glowLine.setAttribute("stroke", "rgba(251, 191, 36, 0.4)");
        glowLine.setAttribute("stroke-width", "12");
        glowLine.setAttribute("stroke-linecap", "round");
        glowLine.setAttribute("filter", "url(#neonGlow)");
        staticGroup.appendChild(glowLine);

        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", String(x1));
        line.setAttribute("y1", String(y1));
        line.setAttribute("x2", String(x2));
        line.setAttribute("y2", String(y2));
        line.setAttribute("stroke", "url(#lineGradient)");
        line.setAttribute("stroke-width", "12");
        line.setAttribute("stroke-linecap", "round");
        staticGroup.appendChild(line);
    }
}

function updateConnectionLine(): void {
    if (!wcState.svgLine) return;

    let d = "";
    if (wcState.visitedNodes.length > 1) {
        const container = document.getElementById('wcWheel');
        if (!container) return;

        wcState.visitedNodes.forEach((index, i) => {
            const el = container.querySelector(`.wc-letter-node[data-index="${index}"]`) as HTMLElement;
            if (el) {
                const x = parseFloat(el.dataset.x || '0');
                const y = parseFloat(el.dataset.y || '0');
                if (i === 0) {
                    d += `M ${x} ${y}`;
                } else {
                    d += ` L ${x} ${y}`;
                }
            }
        });
    }

    let staticGroup = wcState.svgLine.querySelector('#wc-static-lines');
    if (!staticGroup) {
        staticGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        staticGroup.setAttribute("id", "wc-static-lines");
        const dynLine = wcState.svgLine.querySelector('#wc-dynamic-line');
        if (dynLine) wcState.svgLine.insertBefore(staticGroup, dynLine);
        else wcState.svgLine.appendChild(staticGroup);
    }

    staticGroup.innerHTML = '';

    const glowPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    glowPath.setAttribute("d", d);
    glowPath.setAttribute("stroke", "rgba(251, 191, 36, 0.4)");
    glowPath.setAttribute("stroke-width", "12");
    glowPath.setAttribute("fill", "none");
    glowPath.setAttribute("stroke-linejoin", "round");
    glowPath.setAttribute("stroke-linecap", "round");
    glowPath.setAttribute("filter", "url(#neonGlow)");
    staticGroup.appendChild(glowPath);

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", "url(#lineGradient)");
    path.setAttribute("stroke-width", "12");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-linecap", "round");
    staticGroup.appendChild(path);
}

// ========================================
// Game Logic
// ========================================

function setWheelState(state: 'default' | 'success' | 'error' | 'bonus'): void {
    const container = document.getElementById('wcWheel');
    if (!container) return;

    if (wcState.glowTimer) {
        clearTimeout(wcState.glowTimer);
        wcState.glowTimer = null;
    }

    container.classList.remove('wc-state-success', 'wc-state-error', 'wc-state-bonus');

    if (state === 'success') {
        container.classList.add('wc-state-success');
        wcState.glowTimer = setTimeout(() => setWheelState('default'), 1000);
    } else if (state === 'error') {
        container.classList.add('wc-state-error');
        wcState.glowTimer = setTimeout(() => setWheelState('default'), 500);
    } else if (state === 'bonus') {
        container.classList.add('wc-state-bonus');
        wcState.glowTimer = setTimeout(() => setWheelState('default'), 1000);
    }
}

function showRewardMessage(text: string, type = 'default'): void {
    console.log(`Reward Message: ${text} (${type})`);
}

function validateWord(): void {
    if (!wcState.currentLevelData) return;

    const word = wcState.currentInput;
    if (wcState.currentLevelData.words.includes(word)) {
        if (!wcState.foundWords.includes(word)) {
            wcState.foundWords.push(word);
            revealWord(word);

            let reward = 5;
            const now = Date.now();
            if (now - wcState.lastWordTime < 2500) {
                wcState.comboCount++;
                wcState.streak = (wcState.streak || 0) + 1;
                reward += (wcState.comboCount * 2);
                showRewardMessage(`COMBO x${wcState.comboCount + 1}! +${reward} 🪙`, "combo");
                if (typeof soundManager !== 'undefined' && soundManager.playStreak) {
                    soundManager.playStreak(wcState.streak);
                }
            } else {
                wcState.comboCount = 0;
                wcState.streak = (wcState.streak || 0) + 1;
                showRewardMessage(`+${reward} 🪙`, "default");
                if (typeof soundManager !== 'undefined' && soundManager.playWordFound) {
                    soundManager.playWordFound();
                }
            }
            wcState.lastWordTime = now;
            updateStreakDisplay();

            wcState.coins += reward;
            saveProgress();

            const wordUpper = word.toUpperCase();
            let entry = wcState.currentLevelData.dictionary ? wcState.currentLevelData.dictionary[wordUpper] : null;

            if (!entry && typeof WC_DICTIONARY !== 'undefined') {
                const globalEntry = WC_DICTIONARY.find(item => item.w.toUpperCase() === wordUpper);
                if (globalEntry) {
                    entry = { ar: globalEntry.t, sv: globalEntry.s || "", st: globalEntry.st || "" };
                }
            }

            const transEl = document.getElementById('wcTranslationDisplay');
            if (transEl && entry) {
                transEl.innerHTML = `
                    <div class="wc-arabic-meaning">${entry.ar}</div>
                    <div class="wc-example-text" onclick="event.stopPropagation(); speakWord('${entry.sv.replace(/'/g, "\\'")}')">${entry.sv} 🔊</div>
                    ${entry.st ? `<div class="wc-example-translation">${entry.st}</div>` : ''}
                `;
                transEl.style.opacity = '1';
                transEl.classList.add('pop-in');
                transEl.onclick = () => speakWord(word);
                transEl.style.cursor = 'pointer';
                setTimeout(() => transEl.classList.remove('pop-in'), 300);
            }

            setWheelState('success');

            if (typeof soundManager !== 'undefined' && soundManager.playSuccess) {
                soundManager.playSuccess();
            }

            if (navigator.vibrate) navigator.vibrate(50);

            checkWin();
        } else {
            showRewardMessage("Redan hittat! / وجدتها مسبقاً", "default");
            setWheelState('bonus');
        }
    } else {
        const wordUpper = word.toUpperCase();
        let isValidWord = false;
        let globalEntry: DictionaryEntry | undefined = undefined;

        if (wcState.currentLevelData.validWords && wcState.currentLevelData.validWords.includes(wordUpper)) {
            isValidWord = true;
        }

        if (!isValidWord && typeof WC_DICTIONARY !== 'undefined') {
            globalEntry = WC_DICTIONARY.find(item => item.w.toUpperCase() === wordUpper);
            if (globalEntry) isValidWord = true;
        } else if (isValidWord && typeof WC_DICTIONARY !== 'undefined') {
            globalEntry = WC_DICTIONARY.find(item => item.w.toUpperCase() === wordUpper);
        }

        if (isValidWord) {
            if (wordUpper.length < 3) {
                setWheelState('error');
                showRewardMessage("För kort! / قصيرة جداً", "error");
                return;
            }

            if (!wcState.bonusWords.includes(wordUpper)) {
                wcState.bonusWords.push(wordUpper);
                wcState.coins += 3;
                saveProgress();
                setWheelState('bonus');

                if (typeof soundManager !== 'undefined' && soundManager.playSuccess) {
                    soundManager.playSuccess();
                }
            } else {
                showRewardMessage("Redan hittat bonusord! / كلمة إضافية مكررة", "default");
                setWheelState('bonus');
            }
        } else {
            setWheelState('error');
            shakeWheel();

            if (typeof soundManager !== 'undefined' && soundManager.playError) {
                soundManager.playError();
            }

            if (navigator.vibrate) navigator.vibrate(200);

            if (wcState.coins > 0) {
                wcState.coins--;
                saveProgress();
                const coinEl = document.getElementById('wcCoinCount');
                if (coinEl) coinEl.textContent = String(wcState.coins);
            }
        }
    }
}

function shakeWheel(): void {
    const wheel = document.getElementById('wcWheel');
    if (wheel) {
        wheel.classList.add('shake');
        setTimeout(() => wheel.classList.remove('shake'), 500);
    }
}

function revealWord(word: string): void {
    const rows = document.querySelectorAll('.wc-word-row');
    rows.forEach(row => {
        if ((row as HTMLElement).dataset.word === word) {
            row.classList.add('solved');
            const letters = row.querySelectorAll('.wc-slot');
            letters.forEach((box, i) => {
                box.textContent = word[i];
                box.classList.add('revealed');
            });
        }
    });
}

function checkWin(): void {
    if (!wcState.currentLevelData) return;

    if (wcState.foundWords.length === wcState.currentLevelData.words.length) {
        const statusEl = document.getElementById('wcLevelStatus');
        if (statusEl) {
            statusEl.classList.add('visible');
            triggerStageCelebration();
        }

        if (typeof soundManager !== 'undefined' && soundManager.playSuccess) {
            soundManager.playSuccess();
        }

        if (navigator.vibrate) navigator.vibrate([50, 50, 100]);

        wcState.coins += 20;
        saveProgress();

        startLevelCountdown();
    }
}

// ========================================
// Level Countdown
// ========================================

function startLevelCountdown(): void {
    let timeLeft = 5;

    function formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    let countdownEl = document.getElementById('wcAutoNextCountdown');
    if (!countdownEl) {
        countdownEl = document.createElement('div');
        countdownEl.id = 'wcAutoNextCountdown';
        countdownEl.style.cssText = `
            position: fixed;
            bottom: 60px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(15, 23, 42, 0.9);
            border: 2px solid rgba(251, 191, 36, 0.5);
            border-radius: 20px;
            padding: 0.8rem 1.5rem;
            color: #fbbf24;
            font-size: 1rem;
            font-weight: 600;
            z-index: 100;
            display: flex;
            align-items: center;
            gap: 0.8rem;
            box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(countdownEl);
    }

    countdownEl.innerHTML = `
        <span>⏱️ المرحلة التالية:</span>
        <span id="wcCountdownTime">${formatTime(timeLeft)}</span>
        <button onclick="skipToNextLevel()" style="
            background: linear-gradient(145deg, #22c55e, #16a34a);
            border: none;
            padding: 0.4rem 0.8rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            cursor: pointer;
        ">تخطي ➜</button>
    `;

    if (wcState.levelCountdownInterval) {
        clearInterval(wcState.levelCountdownInterval);
    }

    wcState.levelCountdownInterval = setInterval(() => {
        timeLeft--;
        const timeEl = document.getElementById('wcCountdownTime');
        if (timeEl) timeEl.textContent = formatTime(timeLeft);

        if (timeLeft <= 0) {
            if (wcState.levelCountdownInterval) clearInterval(wcState.levelCountdownInterval);
            if (countdownEl) countdownEl.remove();
            nextLevel();
        }
    }, 1000);
}

(window as any).skipToNextLevel = function (): void {
    if (wcState.levelCountdownInterval) {
        clearInterval(wcState.levelCountdownInterval);
    }
    const countdownEl = document.getElementById('wcAutoNextCountdown');
    if (countdownEl) countdownEl.remove();
    nextLevel();
};

// ========================================
// Navigation
// ========================================

function nextLevel(): void {
    if (wcState.timerInterval) clearInterval(wcState.timerInterval);
    wcState.stage++;
    if (wcState.stage > WC_CONFIG.stagesPerChapter) {
        wcState.stage = 1;
        wcState.chapter++;
    }
    saveProgress();
    startLevel(wcState.chapter, wcState.stage);
}

function goBackToMenu(): void {
    const module = document.getElementById('word-game-module');
    if (module) module.style.display = 'none';
    (window as any).showGameMenu?.();
}

// ========================================
// Visual Effects
// ========================================

function triggerStageCelebration(): void {
    const flash = document.createElement('div');
    flash.className = 'celebration-flash';
    document.body.appendChild(flash);
    setTimeout(() => flash.remove(), 600);

    createStarBurst();
}

function createStarBurst(): void {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const stars = ['⭐', '🌟', '✨', '💫'];

    for (let i = 0; i < 12; i++) {
        const star = document.createElement('div');
        star.className = 'celebration-star';
        star.textContent = stars[Math.floor(Math.random() * stars.length)];

        const angle = (i / 12) * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const endX = centerX + Math.cos(angle) * distance;
        const endY = centerY + Math.sin(angle) * distance;

        star.style.left = centerX + 'px';
        star.style.top = centerY + 'px';
        star.style.setProperty('--endX', (endX - centerX) + 'px');
        star.style.setProperty('--endY', (endY - centerY) + 'px');
        star.style.animationDelay = (i * 50) + 'ms';

        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1200);
    }
}

// ========================================
// TTS
// ========================================

function speakWord(text: string, speed?: number): void {
    if (typeof TTSManager !== 'undefined' && TTSManager && typeof TTSManager.speak === 'function') {
        TTSManager.speak(text, 'sv');
    } else if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'sv-SE';
        utterance.rate = speed || 0.9;
        window.speechSynthesis.speak(utterance);
    }
}

// ========================================
// Hint System
// ========================================

function useHint(): void {
    const btn = document.querySelector('.wc-wheel-center-btn') as HTMLElement;
    if (btn) {
        btn.classList.remove('selected-hint');
        void btn.offsetWidth;
        btn.classList.add('selected-hint');
        setTimeout(() => btn.classList.remove('selected-hint'), 600);
    }

    if (wcState.coins < 10) {
        showRewardMessage("لا يوجد عملات كافية! / Inte tillräckligt med mynt!", "default");
        return;
    }

    let targetBox: HTMLElement | null = null;
    const rows = document.querySelectorAll('.wc-word-row');

    for (const row of Array.from(rows)) {
        if (!row.classList.contains('solved')) {
            const boxes = row.querySelectorAll('.wc-slot');
            for (const box of Array.from(boxes)) {
                if (!box.classList.contains('revealed')) {
                    targetBox = box as HTMLElement;
                    break;
                }
            }
        }
        if (targetBox) break;
    }

    if (targetBox) {
        wcState.coins -= 10;
        saveProgress();
        updateCoinDisplay();

        targetBox.textContent = targetBox.dataset.letter || '';
        targetBox.classList.add('revealed');
        targetBox.style.color = '#fbbf24';

        const row = targetBox.parentElement;
        if (row) {
            const allRevealed = Array.from(row.querySelectorAll('.wc-slot')).every(b => b.classList.contains('revealed'));
            if (allRevealed) {
                row.classList.add('solved');
                const word = (row as HTMLElement).dataset.word || '';
                if (!wcState.foundWords.includes(word)) {
                    wcState.foundWords.push(word);
                    revealWord(word);
                    checkWin();
                }
            }
        }

        if (typeof soundManager !== 'undefined' && soundManager.playClick) {
            soundManager.playClick();
        }
    } else {
        showRewardMessage("لا توجد حروف لكشفها!", "default");
    }
}

// ========================================
// Level Select
// ========================================

function openLevelSelect(): void {
    const modal = document.getElementById('wcLevelSelectModal');
    const grid = document.getElementById('wcLevelGrid');
    if (!modal || !grid) return;

    grid.innerHTML = '';

    for (let c = 1; c <= WC_CONFIG.totalChapters; c++) {
        const section = document.createElement('div');
        section.className = 'wc-chapter-section';

        const theme = typeof getThemeForChapter === 'function' ? getThemeForChapter(c) : null;
        const title = document.createElement('div');
        title.className = 'wc-chapter-title';
        title.innerHTML = theme ? `<span class="chapter-num">${c}</span> ${theme.name}` : `الفصل ${c}`;
        section.appendChild(title);

        const stagesGrid = document.createElement('div');
        stagesGrid.className = 'wc-stages-grid';

        for (let s = 1; s <= WC_CONFIG.stagesPerChapter; s++) {
            const isUnlocked = (c < wcState.maxChapter) ||
                (c === wcState.maxChapter && s <= wcState.maxStage) ||
                (s === 1);
            const isCurrent = (c === wcState.chapter && s === wcState.stage);
            const isCompleted = (c < wcState.maxChapter) ||
                (c === wcState.maxChapter && s < wcState.maxStage);

            const btn = document.createElement('button');
            btn.className = 'wc-stage-btn';
            if (isUnlocked) btn.classList.add('unlocked');
            if (isCurrent) btn.classList.add('current');
            if (isCompleted) btn.classList.add('completed');
            if (!isUnlocked) btn.classList.add('locked');

            btn.innerHTML = isUnlocked ?
                `<span class="stage-num">${s}</span>` :
                `<span class="stage-lock">🔒</span>`;

            if (isUnlocked) {
                btn.onclick = () => {
                    wcState.chapter = c;
                    wcState.stage = s;
                    startLevel(c, s);
                    closeLevelSelect();
                };
            }

            stagesGrid.appendChild(btn);
        }

        section.appendChild(stagesGrid);
        grid.appendChild(section);
    }

    modal.classList.remove('hidden');
}

function closeLevelSelect(): void {
    const modal = document.getElementById('wcLevelSelectModal');
    if (modal) modal.classList.add('hidden');
}

// ========================================
// Reset Progress
// ========================================

function resetWordConnectProgress(): void {
    if (confirm("Är du säker på att du vill återställa dina framsteg? / هل أنت متأكد أنك تريد إعادة تعيين تقدمك؟")) {
        localStorage.removeItem('wcProgress');
        wcState.chapter = 1;
        wcState.stage = 1;
        wcState.maxChapter = 1;
        wcState.maxStage = 1;
        wcState.coins = 300;
        wcState.foundWords = [];
        wcState.bonusWords = [];
        saveProgress();
        startLevel(1, 1);
        closeLevelSelect();
        showToast("Framsteg återställda / تم إعادة تعيين التقدم", "success");
    }
}

// Export functions and state to window for HTML and external access
if (typeof window !== 'undefined') {
    (window as any).initWordConnect = initWordConnect;
    (window as any).startLevel = startLevel;
    (window as any).nextLevel = nextLevel;
    (window as any).goBackToMenu = goBackToMenu;
    (window as any).useHint = useHint;
    (window as any).openLevelSelect = openLevelSelect;
    (window as any).closeLevelSelect = closeLevelSelect;
    (window as any).resetWordConnectProgress = resetWordConnectProgress;
    (window as any).speakWord = speakWord;
    (window as any).wcState = wcState;
    (window as any).toggleSound = (window as any).toggleSound; // Already assigned online if needed
}
