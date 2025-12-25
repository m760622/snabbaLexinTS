/**
 * SWEDISH WORD CONNECT GAME MODULE
 * TypeScript Migration
 */

import { showToast, TextSizeManager } from '../utils';

// --- TYPES & INTERFACES ---
interface WcConfig {
    totalChapters: number;
    stagesPerChapter: number;
    hintCost: number;
    version: string;
}

interface WcLevelData {
    id: string;
    chapter: number;
    stage: number;
    letters: string[];
    targets: string[];
    dictionary: Record<string, { ar: string; sv: string; st: string }>;
    validWords?: string[];
    main_chars?: string; // Compatibility with dynamic generation
}

interface WcState {
    chapter: number;
    stage: number;
    maxChapter: number;
    maxStage: number;
    coins: number;
    currentLevelData: WcLevelData | null;
    foundWords: string[];
    currentInput: string;
    isDragging: boolean;
    visitedNodes: number[];
    streak: number;
    lastLogin: string | null;
    bonusWords: string[];
    comboCount: number;
    lastWordTime: number;
    usedRootWords: string[];
}

// --- CONFIG ---
const WC_CONFIG: WcConfig = {
    totalChapters: 10,
    stagesPerChapter: 10,
    hintCost: 5,
    version: "2.0"
};

// --- STATE ---
let wcState: WcState = {
    chapter: 1,
    stage: 1,
    maxChapter: 1,
    maxStage: 1,
    coins: 300,
    currentLevelData: null,
    foundWords: [],
    currentInput: "",
    isDragging: false,
    visitedNodes: [],
    streak: 0,
    lastLogin: null,
    bonusWords: [],
    comboCount: 0,
    lastWordTime: 0,
    usedRootWords: []
};

// --- INITIALIZATION ---
export function initWordConnect() {
    console.log("Initializing Word Connect Module...");

    // Access globals from wordConnectData.js for now
    // In a full migration, these should also be imported or typed
    const WC_DICTIONARY = (window as any).WC_DICTIONARY;
    const WC_PREDEFINED_LEVELS = (window as any).WC_PREDEFINED_LEVELS;

    if (typeof WC_PREDEFINED_LEVELS === 'undefined' || typeof WC_DICTIONARY === 'undefined') {
        setTimeout(initWordConnect, 500);
        return;
    }

    initParticles();
    loadProgress();
    startLevel(wcState.chapter, wcState.stage);
}

function initParticles() {
    const container = document.getElementById('wcParticles');
    if (!container) return;
    container.innerHTML = '';
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 20}s`;
        particle.style.opacity = `${0.3 + Math.random() * 0.4}`;
        container.appendChild(particle);
    }
}

function loadProgress() {
    const saved = localStorage.getItem('wcProgress');
    if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.version !== WC_CONFIG.version) {
            localStorage.removeItem('wcProgress');
        } else {
            wcState = { ...wcState, ...parsed };
        }
    }
    updateCoinDisplay(false);
}

function saveProgress() {
    if (wcState.chapter > wcState.maxChapter) {
        wcState.maxChapter = wcState.chapter;
        wcState.maxStage = wcState.stage;
    } else if (wcState.chapter === wcState.maxChapter && wcState.stage > wcState.maxStage) {
        wcState.maxStage = wcState.stage;
    }

    const data = {
        ...wcState,
        version: WC_CONFIG.version
    };

    localStorage.setItem('wcProgress', JSON.stringify(data));
    updateCoinDisplay();
}

function updateCoinDisplay(_animate = true) {
    const el = document.getElementById('wcCoinCount');
    if (el) el.textContent = String(wcState.coins);
    
    const streakEl = document.getElementById('wcStreakCount');
    if (streakEl) streakEl.textContent = String(wcState.streak);

    const bonusEl = document.getElementById('wcBonusCount');
    if (bonusEl) bonusEl.textContent = String(wcState.bonusWords.length);
}

export function startLevel(chapter: number, stage: number) {
    try {
        const gameContainer = document.querySelector('.wc-game-container');
        if (gameContainer) gameContainer.classList.add('level-transitioning');

        setTimeout(() => {
            performLevelStart(chapter, stage, gameContainer as HTMLElement);
        }, 150);
    } catch (err) {
        console.error("Error in startLevel:", err);
    }
}

function performLevelStart(chapter: number, stage: number, gameContainer: HTMLElement) {
    wcState.chapter = chapter;
    wcState.stage = stage;
    wcState.foundWords = [];
    wcState.currentInput = "";
    wcState.isDragging = false;
    wcState.visitedNodes = [];
    wcState.bonusWords = [];

    const levelTitle = document.getElementById('wcLevelTitle');
    if (levelTitle) {
        levelTitle.textContent = `Nivå ${chapter}-${stage}`;
        TextSizeManager.apply(levelTitle, levelTitle.textContent);
    }
    
    // Get level data from window globals for now
    const levelKey = `${chapter}-${stage}`;
    const predefined = (window as any).WC_PREDEFINED_LEVELS[levelKey];
    
    if (!predefined) {
        showToast("Nivå saknas / المستوى مفقود", { type: "error" });
        return;
    }

    wcState.currentLevelData = {
        id: levelKey,
        chapter,
        stage,
        letters: predefined.letters,
        targets: predefined.words,
        dictionary: {}, // In full migration, we index the dictionary
        validWords: predefined.validWords
    };

    renderGrid();
    renderWheel();

    if (gameContainer) gameContainer.classList.remove('level-transitioning');
}

function renderGrid() {
    const grid = document.getElementById('wcGrid');
    if (!grid || !wcState.currentLevelData) return;
    grid.innerHTML = '';

    wcState.currentLevelData.targets.forEach(word => {
        const row = document.createElement('div');
        row.className = 'wc-grid-row';
        word.split('').forEach((char, idx) => {
            const cell = document.createElement('div');
            cell.className = 'wc-grid-cell';
            cell.dataset.word = word;
            cell.dataset.char = char;
            cell.dataset.index = String(idx);
            row.appendChild(cell);
        });
        grid.appendChild(row);
    });
}

function renderWheel() {
    const wheelContainer = document.getElementById('wcWheel');
    if (!wheelContainer || !wcState.currentLevelData) return;
    wheelContainer.innerHTML = '';

    const letters = wcState.currentLevelData.letters;
    const containerSize = 286;
    const centerX = containerSize / 2;
    const centerY = containerSize / 2;
    const radius = 109;
    const letterSize = 48;
    const letterHalf = letterSize / 2;
    const angleStep = (2 * Math.PI) / letters.length;

    // Create SVG for connector lines
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "wc-connector-lines");
    svg.setAttribute("width", String(containerSize));
    svg.setAttribute("height", String(containerSize));
    svg.style.position = "absolute";
    svg.style.top = "0";
    svg.style.left = "0";
    svg.style.pointerEvents = "none";
    
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.13 0 0 0 0 0.83 0 0 0 0 0.93 0 0 0 1 0" result="colorBlur"/>
            <feMerge><feMergeNode in="colorBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#22d3ee" /><stop offset="50%" stop-color="#60a5fa" /><stop offset="100%" stop-color="#fbbf24" />
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
    (wcState as any).svgLine = svg;

    letters.forEach((char, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const centerPosX = centerX + radius * Math.cos(angle);
        const centerPosY = centerY + radius * Math.sin(angle);
        const leftPos = centerPosX - letterHalf;
        const topPos = centerPosY - letterHalf;

        const node = document.createElement('div');
        node.className = 'wc-letter-node';
        node.textContent = char;
        node.style.left = `${leftPos}px`;
        node.style.top = `${topPos}px`;
        node.dataset.index = String(i);
        node.dataset.char = char;
        node.dataset.x = String(centerPosX);
        node.dataset.y = String(centerPosY);
        
        wheelContainer.appendChild(node);
    });

    wheelContainer.addEventListener('mousedown', handleInputStart);
    wheelContainer.addEventListener('touchstart', handleInputStart, { passive: false });
    wheelContainer.addEventListener('mousemove', handleInputMove);
    wheelContainer.addEventListener('touchmove', handleInputMove, { passive: false });
    document.addEventListener('mouseup', handleInputEnd);
    document.addEventListener('touchend', handleInputEnd);
}

function handleInputStart(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    const touch = 'touches' in e ? e.touches[0] : e;
    const container = document.getElementById('wcWheel')!;
    const rect = container.getBoundingClientRect();

    const scaleX = 286 / rect.width;
    const scaleY = 286 / rect.height;
    const mouseX = (touch.clientX - rect.left) * scaleX;
    const mouseY = (touch.clientY - rect.top) * scaleY;

    const hitRadius = 50;
    const nodes = container.querySelectorAll('.wc-letter-node');
    let hitNode: HTMLElement | null = null;

    nodes.forEach(node => {
        const n = node as HTMLElement;
        const nx = parseFloat(n.dataset.x!);
        const ny = parseFloat(n.dataset.y!);
        const distSq = (mouseX - nx) ** 2 + (mouseY - ny) ** 2;
        if (distSq < hitRadius ** 2) hitNode = n;
    });

    if (hitNode) {
        wcState.isDragging = true;
        wcState.currentInput = "";
        wcState.visitedNodes = [];
        document.querySelectorAll('.wc-letter-node').forEach(el => el.classList.remove('selected'));
        const staticGroup = (wcState as any).svgLine?.querySelector('#wc-static-lines');
        if (staticGroup) staticGroup.innerHTML = '';
        selectNode(hitNode);
    }
}

function handleInputMove(e: MouseEvent | TouchEvent) {
    if (!wcState.isDragging) return;
    e.preventDefault();
    const touch = 'touches' in e ? e.touches[0] : e;

    const container = document.getElementById('wcWheel')!;
    const rect = container.getBoundingClientRect();
    const scaleX = 286 / rect.width;
    const scaleY = 286 / rect.height;
    const mouseX = (touch.clientX - rect.left) * scaleX;
    const mouseY = (touch.clientY - rect.top) * scaleY;

    // Update Rubber Band
    if (wcState.visitedNodes.length > 0) {
        const lastIdx = wcState.visitedNodes[wcState.visitedNodes.length - 1];
        const lastEl = container.querySelector(`.wc-letter-node[data-index="${lastIdx}"]`) as HTMLElement;
        const dynLine = document.getElementById('wc-dynamic-line');
        if (lastEl && dynLine) {
            dynLine.setAttribute("x1", lastEl.dataset.x!);
            dynLine.setAttribute("y1", lastEl.dataset.y!);
            dynLine.setAttribute("x2", String(mouseX));
            dynLine.setAttribute("y2", String(mouseY));
            dynLine.setAttribute("opacity", "1");
        }
    }

    const hitRadius = 50;
    const nodes = container.querySelectorAll('.wc-letter-node');
    nodes.forEach(node => {
        const n = node as HTMLElement;
        const index = parseInt(n.dataset.index!);
        if (wcState.visitedNodes.includes(index)) return;

        const nx = parseFloat(n.dataset.x!);
        const ny = parseFloat(n.dataset.y!);
        const distSq = (mouseX - nx) ** 2 + (mouseY - ny) ** 2;
        if (distSq < hitRadius ** 2) selectNode(n);
    });
}

function handleInputEnd() {
    if (!wcState.isDragging) return;
    wcState.isDragging = false;
    const dynLine = document.getElementById('wc-dynamic-line');
    if (dynLine) dynLine.setAttribute("opacity", "0");

    if (wcState.visitedNodes.length >= 2) {
        validateWord();
        setTimeout(() => {
            document.querySelectorAll('.wc-letter-node').forEach(el => el.classList.remove('selected'));
            const staticGroup = (wcState as any).svgLine?.querySelector('#wc-static-lines');
            if (staticGroup) staticGroup.innerHTML = '';
            const preview = document.getElementById('wcPreviewText');
            if (preview) preview.textContent = "";
            wcState.visitedNodes = [];
            wcState.currentInput = "";
        }, 300);
    }
}

function selectNode(el: HTMLElement) {
    const index = parseInt(el.dataset.index!);
    const char = el.dataset.char!;
    wcState.visitedNodes.push(index);
    wcState.currentInput += char;
    el.classList.add('selected');
    const preview = document.getElementById('wcPreviewText');
    if (preview) {
        preview.textContent = wcState.currentInput;
        TextSizeManager.apply(preview, wcState.currentInput);
    }

    (window as any).SoundManager?.playLetterSelect?.();
    updateConnectionLine();
}

function updateConnectionLine() {
    const svg = (wcState as any).svgLine;
    if (!svg || wcState.visitedNodes.length < 2) return;

    const staticGroup = svg.querySelector('#wc-static-lines');
    if (!staticGroup) return;
    staticGroup.innerHTML = '';

    const container = document.getElementById('wcWheel')!;
    let d = "";
    wcState.visitedNodes.forEach((idx, i) => {
        const el = container.querySelector(`.wc-letter-node[data-index="${idx}"]`) as HTMLElement;
        if (el) {
            const x = el.dataset.x!;
            const y = el.dataset.y!;
            d += (i === 0 ? "M " : " L ") + x + " " + y;
        }
    });

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("stroke", "url(#lineGradient)");
    path.setAttribute("stroke-width", "12");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("filter", "url(#neonGlow)");
    staticGroup.appendChild(path);
}

function validateWord() {
    const word = wcState.currentInput;
    const targets = wcState.currentLevelData?.targets || [];
    
    if (targets.includes(word)) {
        if (!wcState.foundWords.includes(word)) {
            wcState.foundWords.push(word);
            revealWord(word);
            wcState.coins += 5;
            saveProgress();
            showToast(`+5 🪙`, { type: "success" });
            (window as any).speakWord?.(word);
            checkWin();
        } else {
            showToast("Redan hittat!", { type: "info" });
        }
    } else {
        shakeWheel();
        (window as any).SoundManager?.playError?.();
    }
}

function revealWord(word: string) {
    const slots = document.querySelectorAll(`.wc-slot[data-letter]`);
    slots.forEach(slot => {
        const s = slot as HTMLElement;
        const row = s.closest('.wc-word-row') as HTMLElement;
        if (row && row.dataset.word === word) {
            s.textContent = s.dataset.letter!;
            s.classList.add('revealed');
        }
    });
}

function shakeWheel() {
    const wheel = document.getElementById('wcWheel');
    if (wheel) {
        wheel.classList.add('shake');
        setTimeout(() => wheel.classList.remove('shake'), 500);
    }
}

function checkWin() {
    if (wcState.foundWords.length === (wcState.currentLevelData?.targets.length || 0)) {
        setTimeout(() => {
            showToast("Nivå Klar! 🎉", { type: "success" });
            wcState.stage++;
            if (wcState.stage > 10) {
                wcState.chapter++;
                wcState.stage = 1;
            }
            saveProgress();
            startLevel(wcState.chapter, wcState.stage);
        }, 1000);
    }
}
