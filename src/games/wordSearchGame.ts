export {};

/**
 * Word Search Game - لعبة البحث عن الكلمات
 * Converted from inline JS to TypeScript module
 */

import { TOPICS } from '../data/wordSearchData';
import { Topic, Level } from '../types';

import { speakSwedish } from '../tts';
import { toggleMobileView } from './games-utils';

interface WordSearchProgress {
    unlockedTopics: number[];
    unlockedLevels: Record<string, boolean>;
    lastTopic: number;
    lastLevel: number;
    score: number;
    settings: {
        mysteryEnabled: boolean;
        fogEnabled: boolean;
        bombEnabled: boolean;
        frozenEnabled: boolean;
    };
}

interface Bomb {
    el: HTMLElement;
    interval: any;
}


        /**
         * Sound Manager using Web Audio API
         */
        class SoundManager {
            audioCtx: AudioContext | null = null;
            enabled: boolean = true;

            constructor() {
                this.audioCtx = null;
                this.enabled = true;
            }

            init() {
                if (!this.audioCtx) {
                    const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
                    this.audioCtx = new AudioContextClass();
                }
                this.unlock();
            }

            unlock() {
                if (!this.audioCtx) return;
                if (this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume().then(() => {
                        // Create and play a silent buffer to fully unlock iOS audio
                        const buffer = this.audioCtx!.createBuffer(1, 1, 22050);
                        const source = this.audioCtx!.createBufferSource();
                        source.buffer = buffer;
                        source.connect(this.audioCtx!.destination);
                        source.start(0);
                    }).catch(e => console.log("Audio resume failed:", e));
                }
            }

            playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
                if (!this.enabled || !this.audioCtx) return;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = type;
                osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + startTime);

                gain.gain.setValueAtTime(0.1, this.audioCtx.currentTime + startTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + startTime + duration);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc.start(this.audioCtx.currentTime + startTime);
                osc.stop(this.audioCtx.currentTime + startTime + duration);
            }

            playLetterSound() {
                if (!this.enabled || !this.audioCtx) return;
                const t = this.audioCtx.currentTime;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, t);
                osc.frequency.exponentialRampToValueAtTime(600, t + 0.1); // The "soft" slide effect (Lås Upp style)

                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

                osc.connect(gain);
                gain.connect(this.audioCtx!.destination);
                osc.start(t);
                osc.stop(t + 0.1);
            }

            playUISound() {
                // Tweaked: 500->700Hz, slightly faster (0.08s)
                if (!this.enabled || !this.audioCtx) return;
                const t = this.audioCtx.currentTime;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = 'sine';
                osc.frequency.setValueAtTime(500, t);
                osc.frequency.exponentialRampToValueAtTime(700, t + 0.08);

                gain.gain.setValueAtTime(0.1, t);
                gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

                osc.connect(gain);
                gain.connect(this.audioCtx!.destination);
                osc.start(t);
                osc.stop(t + 0.08);
            }

            playConnect() { this.playTone(800, 'sine', 0.1); }

            playSuccess() {
                this.playTone(523.25, 'sine', 0.2, 0);
                this.playTone(659.25, 'sine', 0.2, 0.1);
            }

            playWaterDrop() {
                if (!this.enabled || !this.audioCtx) return;

                const t = this.audioCtx.currentTime;

                // Oscillator 1: High pitch "drip"
                const osc1 = this.audioCtx.createOscillator();
                const gain1 = this.audioCtx.createGain();
                osc1.type = 'sine';
                osc1.frequency.setValueAtTime(2000, t);
                osc1.frequency.exponentialRampToValueAtTime(600, t + 0.2);

                gain1.gain.setValueAtTime(0, t);
                gain1.gain.linearRampToValueAtTime(0.6, t + 0.02); // Fast attack
                gain1.gain.exponentialRampToValueAtTime(0.01, t + 0.2);

                osc1.connect(gain1);
                gain1.connect(this.audioCtx.destination);
                osc1.start(t);
                osc1.stop(t + 0.2);

                // Oscillator 2: "Sparkle" / "Dazzle" - higher frequency, delayed slightly
                const osc2 = this.audioCtx.createOscillator();
                const gain2 = this.audioCtx.createGain();
                osc2.type = 'triangle'; // Triangle wave for more harmonics (sparkle)
                osc2.frequency.setValueAtTime(3000, t + 0.05);
                osc2.frequency.linearRampToValueAtTime(1000, t + 0.25);

                gain2.gain.setValueAtTime(0, t);
                gain2.gain.setValueAtTime(0, t + 0.05); // Delay start
                gain2.gain.linearRampToValueAtTime(0.3, t + 0.07);
                gain2.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

                osc2.connect(gain2);
                gain2.connect(this.audioCtx!.destination);
                osc2.start(t);
                osc2.stop(t + 0.3);
            }
            playLevelComplete() {
                if (!this.audioCtx) return;
                this.playTone(523.25, 'square', 0.2, 0);
                this.playTone(523.25, 'square', 0.2, 0.2);
                this.playTone(523.25, 'square', 0.2, 0.4);
                this.playTone(659.25, 'square', 0.6, 0.6);
                this.playTone(783.99, 'square', 0.8, 1.0);
            }
            playWinSound() {
                if (!this.enabled) return;
                this.init();
                // Victory fanfare
                const now = this.audioCtx!.currentTime;
                this.playTone(523.25, 'sine', 0.1, 0);       // C5
                this.playTone(659.25, 'sine', 0.1, 0.1);     // E5
                this.playTone(783.99, 'sine', 0.1, 0.2);     // G5
                this.playTone(1046.50, 'sine', 0.4, 0.3);    // C6
            }

            playClickSound() {
                if (!this.enabled) return;
                this.init();
                // Modern UI Click (High tech blip)
                const osc = this.audioCtx!.createOscillator();
                const gain = this.audioCtx!.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, this.audioCtx!.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, this.audioCtx!.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, this.audioCtx!.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx!.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(this.audioCtx!.destination);
                osc.start();
                osc.stop(this.audioCtx!.currentTime + 0.1);
            }

            playHoverSound() {
                if (!this.enabled) return;
                this.init();
                // Subtle UI Hover (Soft tick)
                const osc = this.audioCtx!.createOscillator();
                const gain = this.audioCtx!.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, this.audioCtx!.currentTime);
                gain.gain.setValueAtTime(0.05, this.audioCtx!.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, this.audioCtx!.currentTime + 0.05);
                osc.connect(gain);
                gain.connect(this.audioCtx!.destination);
                osc.start();
                osc.stop(this.audioCtx!.currentTime + 0.05);
            }
            playShift() { this.playTone(300, 'sawtooth', 0.3); }
        }

        // Data is now imported from ../data/wordSearchData
        class WordSearchGame {
            currentTopicIndex: number;
            currentLevelIndex: number;
            gridSize: { rows: number; cols: number };
            grid: (string | null)[][];
            foundWords: Set<string>;
            words: string[];
            soundManager: SoundManager;
            mode: string;
            mysteryEnabled: boolean;
            fogEnabled: boolean;
            bombEnabled: boolean;
            frozenEnabled: boolean;
            isDailyChallenge: boolean;
            activeBombs: Bomb[];
            mysteryWord: string | null;
            timer: number;
            timerInterval: any;
            shiftInterval: any;
            progress: WordSearchProgress;
            score: number;
            
            gridEl: HTMLElement;
            wordBankEl: HTMLElement;
            floatingLabel: HTMLElement;
            levelDisplay: HTMLElement;
            scoreDisplay: HTMLElement;
            hintBtn: HTMLButtonElement;
            bottomInfoPanel: HTMLElement;
            flashlightEl: HTMLElement;
            timerEl: HTMLElement;
            mysteryHintEl: HTMLElement;
            mysteryTextEl: HTMLElement;
            levelBadgeContainer: HTMLElement;
            headerTitle: HTMLElement;
            fogOverlay: HTMLElement;
            
            levelModal: HTMLElement;
            gameCompleteModal: HTMLElement;
            mainMenu: HTMLElement;
            gameOverModal: HTMLElement;
            navModal: HTMLElement;
            
            isDragging: boolean;
            startCell: { row: number, col: number, el: HTMLElement } | null;
            currentSelection: HTMLElement[];
            
            handleInteraction: (() => void) | null;
            comboMultiplier: number = 1;
            lastWordTime: number = 0;
            comboTimer: any = null;
            bombSpawnerInterval: any = null;

            constructor() {
                this.currentTopicIndex = 0;
                this.currentLevelIndex = 0;
                this.gridSize = { rows: 10, cols: 8 };
                this.grid = [];
                this.foundWords = new Set();
                this.words = [];
                this.soundManager = new SoundManager();
                this.mode = 'classic';
                this.mysteryEnabled = true;
                this.fogEnabled = false;
                this.bombEnabled = false;
                this.frozenEnabled = false;
                this.isDailyChallenge = false;
                this.activeBombs = [];
                this.mysteryWord = null;
                this.timer = 0;
                this.timerInterval = null;
                this.shiftInterval = null;

                // Persistence
                this.progress = this.loadProgress();
                this.currentTopicIndex = this.progress.lastTopic || 0;
                this.currentLevelIndex = this.progress.lastLevel || 0;
                this.score = this.progress.score || 0;

                // DOM Elements
                this.gridEl = document.getElementById('grid')!;
                this.wordBankEl = document.getElementById('word-bank')!;
                this.floatingLabel = document.getElementById('floating-label')!;
                this.levelDisplay = document.getElementById('level-display')!;
                this.scoreDisplay = document.getElementById('score-display')!;
                this.hintBtn = document.getElementById('hint-btn') as HTMLButtonElement;
                this.bottomInfoPanel = document.getElementById('bottom-info-panel')!;
                this.flashlightEl = document.getElementById('flashlight-overlay')!;
                this.timerEl = document.getElementById('timer-display')!;
                this.mysteryHintEl = document.getElementById('mystery-hint')!;
                this.mysteryTextEl = document.getElementById('mystery-text')!;
                this.levelBadgeContainer = document.getElementById('level-badge-container')!;
                this.headerTitle = document.getElementById('header-title')!;
                this.fogOverlay = document.getElementById('fog-overlay')!;

                // Modals
                this.levelModal = document.getElementById('level-modal')!;
                this.gameCompleteModal = document.getElementById('game-complete-modal')!;
                this.mainMenu = document.getElementById('main-menu')!;
                this.gameOverModal = document.getElementById('game-over-modal')!;
                this.navModal = document.getElementById('nav-modal')!;

                // State
                this.isDragging = false;
                this.startCell = null;
                this.currentSelection = [];

                // Initialize Audio Context on first user interaction
                this.handleInteraction = () => {
                    this.soundManager.init();
                    if (this.soundManager.audioCtx && this.soundManager.audioCtx.state === 'running') {
                        if (this.handleInteraction) {
                            window.removeEventListener('touchstart', this.handleInteraction as any);
                            window.removeEventListener('mousedown', this.handleInteraction as any);
                            window.removeEventListener('keydown', this.handleInteraction as any);
                        }
                    }
                };
                window.addEventListener('touchstart', this.handleInteraction);
                window.addEventListener('mousedown', this.handleInteraction);
                window.addEventListener('keydown', this.handleInteraction);

                // Initial State: Show Menu
                this.showMenu();

                // Start Dynamic Lighting
                this.startDynamicLighting();

                // Attach UI Sounds
                // Setup Global Input Listeners (Sounds & Effects)
                this.setupGlobalInputListeners();
            }

            startDynamicLighting() {
                const animations = [
                    'cyan-calm-heartbeat 4s infinite ease-in-out', // Slow Heartbeat
                    'cyan-calm-breathe 6s infinite ease-in-out',   // Deep Breathing
                    'cyan-calm-ocean 8s infinite ease-in-out',     // Ocean Waves
                    'cyan-calm-moonlight 5s infinite linear',      // Steady Moonlight
                    'cyan-calm-drift 10s infinite linear',         // Slow Drift
                    'cyan-calm-dream 7s infinite ease-in-out'      // Misty Dream
                ];

                // Change animation every 15 seconds
                setInterval(() => {
                    const randomAnim = animations[Math.floor(Math.random() * animations.length)];
                    this.gridEl.style.animation = 'none'; // Reset to trigger change
                    void this.gridEl.offsetWidth; // Trigger reflow
                    this.gridEl.style.animation = randomAnim;
                }, 15000);
            }

            setupGlobalInputListeners() {
                document.addEventListener('click', (e: MouseEvent) => {
                    // Check if the clicked element or its parent is interactive
                    const target = (e.target as HTMLElement).closest('button, .settings-btn, .mode-card, .level-btn, .topic-card, .level-badge, .nav-arrow-btn, .back-btn, .panel-close-btn, .btn-exit-modern, .nav-back');

                    if (target) {
                        this.soundManager.playUISound();
                    }
                });
            }

            // --- Persistence ---
            loadProgress() {
                const saved = localStorage.getItem('neonSearch_progress');
                let progress = saved ? JSON.parse(saved) : {
                    unlockedTopics: [],
                    unlockedLevels: {},
                    lastTopic: 0,
                    lastLevel: 0,
                    score: 0,
                    settings: { // New settings object
                        mysteryEnabled: true,
                        fogEnabled: false,
                        bombEnabled: false,
                        frozenEnabled: false
                    }
                };

                // Load settings if they exist
                if (progress.settings) {
                    this.mysteryEnabled = progress.settings.mysteryEnabled;
                    this.fogEnabled = progress.settings.fogEnabled;
                    this.bombEnabled = progress.settings.bombEnabled;
                    this.frozenEnabled = progress.settings.frozenEnabled;
                }

                this.comboMultiplier = 1;
                this.lastWordTime = 0;
                this.comboTimer = null;

                // Ensure all topics are unlocked and level 0 of each is unlocked
                // This fulfills the user request to have the first level of every chapter open
                for (let i = 0; i < TOPICS.length; i++) {
                    if (!progress.unlockedTopics.includes(i)) {
                        progress.unlockedTopics.push(i);
                    }
                    if (!progress.unlockedLevels[`${i}-0`]) {
                        progress.unlockedLevels[`${i}-0`] = true;
                    }
                }

                return progress;
            }

            saveProgress() {
                this.progress.lastTopic = this.currentTopicIndex;
                this.progress.lastLevel = this.currentLevelIndex;
                this.progress.score = this.score;
                // Save settings
                this.progress.settings = {
                    mysteryEnabled: this.mysteryEnabled,
                    fogEnabled: this.fogEnabled,
                    bombEnabled: this.bombEnabled,
                    frozenEnabled: this.frozenEnabled
                };
                localStorage.setItem('neonSearch_progress', JSON.stringify(this.progress));
                this.updateScoreUI();
            }

            updateScoreUI() {
                if (this.scoreDisplay) {
                    this.scoreDisplay.textContent = String(this.score);
                    // Disable hint if not enough points
                    if (this.hintBtn) {
                        this.hintBtn.disabled = this.score < 5;
                    }
                }
            }

            unlockNextLevel() {
                const nextLevelIdx = this.currentLevelIndex + 1;
                if (nextLevelIdx < 10) {
                    this.progress.unlockedLevels[`${this.currentTopicIndex}-${nextLevelIdx}`] = true;
                } else {
                    // Unlock next topic
                    const nextTopicIdx = this.currentTopicIndex + 1;
                    if (nextTopicIdx < TOPICS.length) {
                        if (!this.progress.unlockedTopics.includes(nextTopicIdx)) {
                            this.progress.unlockedTopics.push(nextTopicIdx);
                        }
                        this.progress.unlockedLevels[`${nextTopicIdx}-0`] = true;
                    }
                }
                this.saveProgress();
            }

            // --- Navigation ---
            showNavigation() {
                this.stopTimer();
                this.stopShifting();
                this.levelModal.classList.remove('active');
                this.gameOverModal.classList.remove('active');
                this.gameCompleteModal.classList.remove('active');

                this.navModal.classList.add('active');
                this.showTopicsInNav();
            }

            closeNavigation() {
                this.navModal.classList.remove('active');
                // Resume logic if needed, or just stay on current level
            }

            showTopicsInNav() {
                document.getElementById('nav-topics-container')!.style.display = 'block';
                document.getElementById('nav-levels-container')!.style.display = 'none';
                document.getElementById('nav-back-btn')!.style.display = 'none';
                document.getElementById('nav-title')!.textContent = "Topics";
                this.renderTopics();
            }

            showLevelsInNav(topicIndex: number) {
                document.getElementById('nav-topics-container')!.style.display = 'none';
                document.getElementById('nav-levels-container')!.style.display = 'block';
                document.getElementById('nav-back-btn')!.style.display = 'block';
                document.getElementById('nav-title')!.textContent = TOPICS[topicIndex].title;
                this.renderLevels(topicIndex);
            }

            // --- Rendering Menus ---
            renderTopics() {
                const container = document.getElementById('topics-list')!;
                container.innerHTML = '';

                TOPICS.forEach((topic, index) => {
                    const isUnlocked = this.progress.unlockedTopics.includes(index);
                    const el = document.createElement('div');
                    el.className = 'topic-card';
                    el.style.opacity = isUnlocked ? '1' : '0.5';
                    el.style.pointerEvents = isUnlocked ? 'auto' : 'none';

                    el.innerHTML = `
                        <div class="topic-info">
                            <h3>${topic.title}</h3>
                            <p>${topic.titleAr}</p>
                        </div>
                        <div class="topic-progress">
                            ${isUnlocked ? '▶' : '🔒'}
                        </div>
                    `;
                    el.onclick = () => {
                        this.showLevelsInNav(index);
                    };
                    container.appendChild(el);
                });
            }

            renderLevels(topicIndex: number) {
                const container = document.getElementById('levels-list')!;
                container.innerHTML = '';

                for (let i = 0; i < 10; i++) {
                    const isUnlocked = this.progress.unlockedLevels[`${topicIndex}-${i}`];
                    const btn = document.createElement('div');
                    let className = 'level-btn';
                    if (!isUnlocked) className += ' locked';
                    if (topicIndex === this.currentTopicIndex && i === this.currentLevelIndex) className += ' current';

                    btn.className = className;
                    btn.textContent = String(i + 1);

                    if (isUnlocked) {
                        btn.onclick = () => {
                            this.currentTopicIndex = topicIndex;
                            this.currentLevelIndex = i;
                            this.closeNavigation();
                            this.initLevel();
                        };
                    }

                    container.appendChild(btn);
                }
            }

            // --- Game Logic ---
            showMenu() {
                this.stopTimer();
                this.stopShifting();
                this.updateSettingsUI();
                this.mainMenu.classList.add('active');
            }

            updateSettingsUI() {
                const updateBtn = (id: string, enabled: boolean) => {
                    const btn = document.getElementById(id);
                    if (btn) {
                        if (enabled) {
                            btn.classList.add('active');
                            const icon = btn.querySelector('.toggle-icon');
                            if (icon) icon.textContent = '🟢';
                        } else {
                            btn.classList.remove('active');
                            const icon = btn.querySelector('.toggle-icon');
                            if (icon) icon.textContent = '⚪';
                        }
                    }
                };

                updateBtn('btn-mystery', this.mysteryEnabled);
                updateBtn('btn-fog', this.fogEnabled);
                updateBtn('btn-bomb', this.bombEnabled);
                updateBtn('btn-frozen', this.frozenEnabled);
            }

            closeMenu() {
                this.mainMenu.classList.remove('active');
                // Start/Resume Game
                this.initLevel();
            }

            setMode(mode: string) {
                this.mode = mode;
                this.closeMenu();
            }

            toggleMystery(enabled: boolean) {
                this.mysteryEnabled = enabled;
                this.saveProgress();
                this.updateSettingsUI();
                // No need to restart level for mystery word, it applies next level or if we want immediate:
                // If we want immediate, we'd need to re-init. But user said "save position when changing it".
                // Let's just save state.
            }

            toggleFog(enabled: boolean) {
                this.fogEnabled = enabled;
                this.saveProgress();
                this.updateSettingsUI();
                // Fog needs level restart or just overlay toggle
                if (this.fogEnabled) {
                    this.fogOverlay.style.display = 'block';
                } else {
                    this.fogOverlay.style.display = 'none';
                }
            }

            toggleBomb(enabled: boolean) {
                this.bombEnabled = enabled;
                this.saveProgress();
                this.updateSettingsUI();
            }

            toggleFrozen(enabled: boolean) {
                this.frozenEnabled = enabled;
                this.saveProgress();
                this.updateSettingsUI();
            }

            initLevel() {
                this.updateNavButtons();
                const topic = TOPICS[this.currentTopicIndex];
                const levelData = topic.levels[this.currentLevelIndex];

                if (!levelData) return;

                // Update Header
                this.headerTitle.textContent = topic.title;
                this.levelDisplay.textContent = String(this.currentLevelIndex + 1);
                this.headerTitle.textContent = topic.title;
                this.levelDisplay.textContent = String(this.currentLevelIndex + 1);
                this.updateScoreUI();
                this.saveProgress(); // Save that we are playing this level

                this.words = levelData.words
                    .map(item => item.w.toUpperCase())
                    .filter(word => {
                        const fits = word.length <= Math.max(this.gridSize.rows, this.gridSize.cols);
                        if (!fits) console.warn(`Skipping word "${word}" (Length: ${word.length}) as it exceeds grid dimensions.`);
                        return fits;
                    });

                // Progressive Word Count Logic
                // Level 1-2: 5 words (default)
                // Level 3-4: 6 words
                // Level 5-6: 7 words
                // ...
                const targetWordCount = 5 + Math.floor(this.currentLevelIndex / 2);

                // If we need more words than the level provides (which is usually 5)
                if (this.words.length < targetWordCount) {
                    // Collect all words from the current topic to use as a pool
                    const allTopicWords: string[] = [];
                    topic.levels.forEach(l => {
                        l.words.forEach(w => {
                            const upperW = w.w.toUpperCase();
                            if (!this.words.includes(upperW) && upperW.length <= Math.max(this.gridSize.rows, this.gridSize.cols)) {
                                allTopicWords.push(upperW);
                            }
                        });
                    });

                    // Shuffle and add needed words
                    const needed = targetWordCount - this.words.length;
                    for (let i = 0; i < needed; i++) {
                        if (allTopicWords.length > 0) {
                            const randomIndex = Math.floor(Math.random() * allTopicWords.length);
                            this.words.push(allTopicWords[randomIndex]);
                            allTopicWords.splice(randomIndex, 1); // Remove to avoid duplicates
                        }
                    }
                }
                this.foundWords.clear();
                this.bottomInfoPanel.classList.remove('active');
                this.mysteryWord = null;
                this.mysteryHintEl.style.display = 'none';

                // Fog Init
                if (this.fogEnabled) {
                    this.fogOverlay.style.display = 'block';
                } else {
                    this.fogOverlay.style.display = 'none';
                }

                // Bomb Init
                this.clearBombs();
                if (this.bombEnabled) {
                    this.startBombSpawner();
                }

                // Frozen Init
                if (this.frozenEnabled) {
                    this.spawnFrozenLetters();
                }

                // Reset UI
                this.flashlightEl.style.display = this.mode === 'flashlight' ? 'block' : 'none';
                this.timerEl.style.display = this.mode === 'timerush' ? 'block' : 'none';
                if (this.mode === 'flashlight') this.initFlashlight();

                // Mystery Word Logic
                if (this.mysteryEnabled) {
                    // Pick a RANDOM level index that is NOT the current one
                    let randomLevelIndex = Math.floor(Math.random() * 10);
                    if (randomLevelIndex === this.currentLevelIndex) {
                        randomLevelIndex = (randomLevelIndex + 1) % 10;
                    }

                    const otherLevel = topic.levels[randomLevelIndex];
                    // Filter potential mystery words to ensure they fit
                    const validMysteryWords = otherLevel.words.filter(w => w.w.length <= Math.max(this.gridSize.rows, this.gridSize.cols));

                    if (validMysteryWords.length > 0) {
                        // Ensure we pick a NEW mystery word if possible, or just random
                        // The issue "Why doesn't it change" might be due to random chance or caching?
                        // We are re-selecting here every initLevel(), so it should change.
                        // Let's force a re-roll if it matches the previous one (if we tracked it, but we don't easily).
                        // Just picking random is usually fine.
                        const mw = validMysteryWords[Math.floor(Math.random() * validMysteryWords.length)];
                        this.mysteryWord = mw.w.toUpperCase();

                        // Reset HTML structure because handleWordFound overwrites it
                        this.mysteryHintEl.innerHTML = `🕵️ Mystery: <span id="mystery-text">${mw.t}</span>`;
                        this.mysteryHintEl.style.background = ''; // Reset background color
                        this.mysteryHintEl.style.display = 'block';

                        this.words.push(this.mysteryWord);
                    }
                }

                this.setupGrid();
                this.placeWords();
                this.fillEmptyCells();
                this.renderGrid();
                this.renderWordBank();
                this.attachEvents();

                // Mode Specific Init
                this.stopTimer();
                this.stopShifting();

                if (this.mode === 'timerush') {
                    this.timer = 60;
                    this.updateTimerDisplay();
                    this.timerInterval = setInterval(() => {
                        this.timer--;
                        this.updateTimerDisplay();
                        if (this.timer <= 0) this.gameOver();
                    }, 1000);
                }

                if (this.mode === 'shifting') {
                    this.shiftInterval = setInterval(() => this.shiftGrid(), 10000);
                }
            }

            updateTimerDisplay() {
                this.timerEl.textContent = `${this.timer}s`;
                this.timerEl.style.color = this.timer < 10 ? '#ff0055' : '#ff00ff';
            }

            gameOver() {
                this.stopTimer();
                this.gameOverModal.classList.add('active');
            }

            restartLevel() {
                this.gameOverModal.classList.remove('active');
                this.initLevel();
            }

            stopTimer() { if (this.timerInterval) clearInterval(this.timerInterval); }
            stopShifting() { if (this.shiftInterval) clearInterval(this.shiftInterval); }

            initFlashlight() {
                const move = (e: any) => {
                    const t = e.touches ? e.touches[0] : e;
                    const r = this.gridEl.getBoundingClientRect();
                    const x = t.clientX - r.left;
                    const y = t.clientY - r.top;
                    this.flashlightEl.style.setProperty('--x', x + 'px');
                    this.flashlightEl.style.setProperty('--y', y + 'px');
                };
                window.addEventListener('mousemove', move);
                window.addEventListener('touchmove', move);
            }

            shiftGrid() {
                this.soundManager.playShift();
                // Shift rows down
                const lastRow = this.grid[this.gridSize.rows - 1];
                for (let r = this.gridSize.rows - 1; r > 0; r--) {
                    this.grid[r] = this.grid[r - 1];
                }
                this.grid[0] = lastRow;

                // Re-render
                this.renderGrid();

                // Visual feedback
                this.gridEl.style.transform = 'translateY(5px)';
                setTimeout(() => this.gridEl.style.transform = 'none', 200);
            }

            setupGrid() {
                for (let r = 0; r < this.gridSize.rows; r++) {
                    this.grid[r] = [];
                    for (let c = 0; c < this.gridSize.cols; c++) {
                        this.grid[r][c] = null;
                    }
                }
                this.gridEl.style.gridTemplateColumns = `repeat(${this.gridSize.cols}, 1fr)`;
            }

            placeWords() {
                const sortedWords = [...this.words].sort((a, b) => b.length - a.length);
                for (const word of sortedWords) {
                    let placed = false;
                    let attempts = 0;
                    while (!placed && attempts < 100) {
                        placed = this.tryPlaceWord(word);
                        attempts++;
                    }
                    if (!placed) console.warn(`Could not place word: ${word}`);
                }
            }

            tryPlaceWord(word: string) {
                const directions = [
                    { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }, { r: -1, c: 1 },
                    { r: 0, c: -1 }, { r: -1, c: 0 }, { r: -1, c: -1 }, { r: 1, c: -1 }
                ];
                const dir = directions[Math.floor(Math.random() * directions.length)];
                const startR = Math.floor(Math.random() * this.gridSize.rows);
                const startC = Math.floor(Math.random() * this.gridSize.cols);

                for (let i = 0; i < word.length; i++) {
                    const r = startR + (i * dir.r);
                    const c = startC + (i * dir.c);
                    if (r < 0 || r >= this.gridSize.rows || c < 0 || c >= this.gridSize.cols) return false;
                    const existingChar = this.grid[r][c];
                    if (existingChar !== null && existingChar !== word[i]) return false;
                }

                for (let i = 0; i < word.length; i++) {
                    const r = startR + (i * dir.r);
                    const c = startC + (i * dir.c);
                    this.grid[r][c] = word[i];
                }
                return true;
            }

            fillEmptyCells() {
                const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
                for (let r = 0; r < this.gridSize.rows; r++) {
                    for (let c = 0; c < this.gridSize.cols; c++) {
                        if (this.grid[r][c] === null) {
                            this.grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
                        }
                    }
                }
            }

            renderGrid() {
                // Clear existing cells, but keep the fog overlay
                const existingCells = this.gridEl.querySelectorAll('.cell');
                existingCells.forEach(cell => cell.remove());

                for (let r = 0; r < this.gridSize.rows; r++) {
                    for (let c = 0; c < this.gridSize.cols; c++) {
                        const cell = document.createElement('div');
                        cell.className = 'cell';
                        cell.textContent = this.grid[r][c];
                        cell.dataset.row = String(r);
                        cell.dataset.col = String(c);
                        this.gridEl.appendChild(cell);
                    }
                }
            }

            renderWordBank() {
                this.wordBankEl.innerHTML = '';
                this.words.forEach(word => {
                    if (word === this.mysteryWord) return;
                    const el = document.createElement('div');
                    el.className = 'word-item';
                    el.textContent = word;
                    el.dataset.word = word;
                    this.wordBankEl.appendChild(el);
                });
            }

            showWordInfo(word: string) {
                const topic = TOPICS[this.currentTopicIndex];
                const levelData = topic.levels[this.currentLevelIndex];

                const wordData = levelData.words.find(w => w.w.toUpperCase() === word) ||
                    (this.mysteryWord === word ? { w: word, t: this.mysteryTextEl.textContent, s: "Mystery Word!", st: "!" } : null);

                if (wordData) {
                    document.getElementById('panel-word')!.textContent = wordData.w;
                    document.getElementById('panel-translation')!.textContent = wordData.t;
                    document.getElementById('panel-sentence-sv')!.textContent = wordData.s;
                    document.getElementById('panel-sentence-ar')!.textContent = wordData.st;
                    this.bottomInfoPanel.classList.add('active');
                }
            }

            attachEvents() {
                const newGrid = this.gridEl.cloneNode(true) as HTMLElement;
                this.gridEl.parentNode!.replaceChild(newGrid, this.gridEl);
                this.gridEl = newGrid;

                this.gridEl.addEventListener('touchstart', (e: TouchEvent) => {
                    this.handleStart(e.touches[0]);
                    this.handleFogMove(e.touches[0]);
                }, { passive: false });
                this.gridEl.addEventListener('touchmove', (e: TouchEvent) => {
                    this.handleMove(e.touches[0], e);
                    this.handleFogMove(e.touches[0]);
                }, { passive: false });
                this.gridEl.addEventListener('touchend', () => this.handleEnd());

                // Mouse Events
                this.gridEl.addEventListener('mousedown', (e) => this.handleStart(e));
                this.gridEl.addEventListener('mousemove', (e) => {
                    if (this.isDragging) this.handleMove(e, e);
                    this.handleFogMove(e);
                });
                window.addEventListener('mouseup', () => { if (this.isDragging) this.handleEnd(); });
            }

            getCellFromPoint(x: number, y: number): { row: number, col: number, el: HTMLElement } | null {
                const el = document.elementFromPoint(x, y) as HTMLElement;
                if (el && el.classList.contains('cell')) {
                    return { row: parseInt(el.dataset.row!), col: parseInt(el.dataset.col!), el: el };
                }
                return null;
            }

            handleFogMove(point: { clientX: number, clientY: number }) {
                if (!this.fogEnabled) return;
                const fogOverlay = document.getElementById('fog-overlay')!;
                const rect = this.gridEl.getBoundingClientRect();
                const x = point.clientX - rect.left;
                const y = point.clientY - rect.top;

                // Update gradient position
                fogOverlay.style.background = `radial-gradient(circle 120px at ${x}px ${y}px, transparent 0%, rgba(0, 0, 0, 0.98) 100%)`;
            }

            handleStart(point: any) {
                const cell = this.getCellFromPoint(point.clientX, point.clientY);
                if (!cell) return;
                this.isDragging = true;
                this.startCell = cell;
                this.soundManager.playLetterSound();
                this.updateSelection(cell);
            }

            handleMove(point: any, event: Event) {
                if (event) event.preventDefault();
                const cell = this.getCellFromPoint(point.clientX, point.clientY);
                if (!cell) return;
                const lastCell = this.currentSelection[this.currentSelection.length - 1];
                if (lastCell && lastCell.dataset.row === String(cell.row) && lastCell.dataset.col === String(cell.col)) return;
                this.updateSelection(cell);
            }

            handleEnd() {
                this.isDragging = false;
                this.checkSelection();
                this.clearSelection();
            }

            updateSelection(currentCell: { row: number, col: number, el: HTMLElement }) {
                if (!this.startCell) return;

                const dr = currentCell.row - this.startCell.row;
                const dc = currentCell.col - this.startCell.col;

                if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
                    this.clearSelectionVisuals();
                    this.currentSelection = [];

                    const steps = Math.max(Math.abs(dr), Math.abs(dc));
                    const rStep = dr === 0 ? 0 : dr / steps;
                    const cStep = dc === 0 ? 0 : dc / steps;

                    let wordStr = "";

                    for (let i = 0; i <= steps; i++) {
                        const r = this.startCell.row + (i * rStep);
                        const c = this.startCell.col + (i * cStep);
                        const cellEl = this.gridEl.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`) as HTMLElement;
                        if (cellEl) {
                            cellEl.classList.add('selected-pending');
                            this.currentSelection.push(cellEl);
                            wordStr += cellEl.textContent || "";
                        }
                    }

                    const rect = currentCell.el.getBoundingClientRect();
                    this.floatingLabel.style.display = 'block';
                    this.floatingLabel.style.left = `${rect.left}px`;
                    this.floatingLabel.style.top = `${rect.top - 40}px`;
                    this.floatingLabel.textContent = wordStr;
                }
            }

            clearSelectionVisuals() {
                this.gridEl.querySelectorAll('.selected-pending').forEach(el => el.classList.remove('selected-pending'));
            }

            clearSelection() {
                this.clearSelectionVisuals();
                this.currentSelection = [];
                this.startCell = null;
                this.floatingLabel.style.display = 'none';
            }

            checkSelection() {
                const word = this.currentSelection.map(el => el.textContent || "").join('');
                const reversedWord = word.split('').reverse().join('');

                if (this.words.includes(word) && !this.foundWords.has(word)) {
                    this.handleWordFound(word);
                } else if (this.words.includes(reversedWord) && !this.foundWords.has(reversedWord)) {
                    this.handleWordFound(reversedWord);
                }
            }

            handleWordFound(word: string) {
                // Check for frozen letters
                const frozenCells = this.currentSelection.filter(el => el.classList.contains('frozen'));
                if (frozenCells.length > 0) {
                    // Crack the ice
                    frozenCells.forEach(el => el.classList.remove('frozen'));
                    this.soundManager.playWaterDrop(); // Water drop sound
                    this.showComboEffect('ICE CRACKED! ❄️');
                    return; // Do NOT find the word yet
                }

                this.foundWords.add(word);
                this.soundManager.playSuccess();

                // Combo Logic
                const now = Date.now();
                if (now - this.lastWordTime < 5000) { // 5 seconds window
                    this.comboMultiplier++;
                    this.showComboEffect(this.comboMultiplier);
                } else {
                    this.comboMultiplier = 1;
                }
                this.lastWordTime = now;

                // Reset combo timer
                if (this.comboTimer) clearTimeout(this.comboTimer);
                this.comboTimer = setTimeout(() => {
                    this.comboMultiplier = 1;
                    this.updateComboUI();
                }, 5000);

                this.updateComboUI();

                // Add points with multiplier
                const basePoints = 10;
                const points = basePoints * this.comboMultiplier;
                this.score += points;
                this.saveProgress(); // Updates UI and saves

                this.currentSelection.forEach(el => el.classList.add('found'));

                // Defuse Bombs
                this.currentSelection.forEach(el => {
                    if (el.classList.contains('bomb')) {
                        this.defuseBomb(el);
                    }
                });

                if (word === this.mysteryWord) {
                    this.mysteryHintEl.innerHTML = `🎉 Mystery Found: <b>${word}</b>`;
                    this.mysteryHintEl.style.background = 'rgba(0, 255, 0, 0.2)';
                    this.soundManager.playLevelComplete();
                } else {
                    const bankItem = this.wordBankEl.querySelector(`.word-item[data-word="${word}"]`) as HTMLElement | null;
                    if (bankItem) {
                        bankItem.classList.add('found');
                        bankItem.onclick = () => this.showWordInfo(word);
                    }
                }

                this.showWordInfo(word);

                if (this.mode === 'timerush') {
                    this.timer += 10;
                    this.updateTimerDisplay();
                }

                const visibleWords = this.words.filter(w => w !== this.mysteryWord);
                const foundVisible = visibleWords.every(w => this.foundWords.has(w));

                if (foundVisible) {
                    this.unlockNextLevel();
                    setTimeout(() => {
                        this.soundManager.playLevelComplete();
                        this.levelModal.classList.add('active');
                    }, 500);
                }
            }

            nextLevel() {
                const currentTopic = TOPICS[this.currentTopicIndex];
                const maxLevel = currentTopic.levels.length - 1;
                const nextLevelIdx = this.currentLevelIndex + 1;

                // Check if next level is unlocked
                const isNextUnlocked = this.progress.unlockedLevels[`${this.currentTopicIndex}-${nextLevelIdx}`];

                if (this.currentLevelIndex >= maxLevel) return;

                // Allow if next level is unlocked
                if (isNextUnlocked) {
                    this.currentLevelIndex++;
                    this.levelModal.classList.remove('active');
                    this.initLevel();
                }
            }

            prevLevel() {
                if (this.currentLevelIndex > 0) {
                    this.currentLevelIndex--;
                    this.initLevel();
                }
            }

            updateNavButtons() {
                const prevBtn = document.getElementById('prev-level-btn');
                const nextBtn = document.getElementById('next-level-btn');

                if (prevBtn) {
                    (prevBtn as HTMLButtonElement).disabled = this.currentLevelIndex === 0;
                    prevBtn.style.opacity = this.currentLevelIndex === 0 ? '0.3' : '1';
                }

                if (nextBtn) {
                    const currentTopic = TOPICS[this.currentTopicIndex];
                    const maxLevel = currentTopic.levels.length - 1;
                    const nextLevelIdx = this.currentLevelIndex + 1;

                    const isNextUnlocked = this.progress.unlockedLevels[`${this.currentTopicIndex}-${nextLevelIdx}`];

                    // Enable if not at max level AND next level is unlocked
                    const canGoNext = (this.currentLevelIndex < maxLevel) && isNextUnlocked;

                    if (nextBtn) {
                        (nextBtn as HTMLButtonElement).disabled = !canGoNext;
                        nextBtn.style.opacity = canGoNext ? '1' : '0.3';
                    }
                }
            }

            updateComboUI() {
                const comboEl = document.getElementById('combo-display');
                if (comboEl && this.comboMultiplier > 1) {
                    comboEl.style.display = 'inline';
                    comboEl.textContent = `x${this.comboMultiplier} 🔥`;
                    comboEl.style.fontSize = `${1 + (this.comboMultiplier * 0.1)}rem`;
                } else if (comboEl) {
                    comboEl.style.display = 'none';
                }
            }

            showComboEffect(multiplier: number | string) {
                const el = document.createElement('div');
                el.textContent = `COMBO x${multiplier}!`;
                el.style.position = 'fixed';
                el.style.left = '50%';
                el.style.top = '40%';
                el.style.transform = 'translate(-50%, -50%) scale(0)';
                el.style.color = '#ff0055';
                el.style.fontSize = '3rem';
                el.style.fontWeight = 'bold';
                el.style.textShadow = '0 0 20px #ff0055';
                el.style.zIndex = '2000';
                el.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                el.style.pointerEvents = 'none';

                document.body.appendChild(el);

                requestAnimationFrame(() => {
                    el.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    el.style.opacity = '1';
                });

                setTimeout(() => {
                    el.style.opacity = '0';
                    el.style.transform = 'translate(-50%, -100%) scale(1.5)';
                    setTimeout(() => el.remove(), 500);
                }, 800);

                const numericMultiplier = typeof multiplier === 'number' ? multiplier : 1;
                this.soundManager.playTone(400 + (numericMultiplier * 100), 'sawtooth', 0.2);
            }

            // Bomb Logic
            startBombSpawner() {
                // Spawn a bomb every 15 seconds
                this.bombSpawnerInterval = setInterval(() => {
                    if (this.foundWords.size === this.words.length) return;
                    this.spawnBomb();
                }, 15000);
            }

            spawnBomb() {
                const cells = Array.from(document.querySelectorAll('.cell:not(.found):not(.bomb)'));
                if (cells.length === 0) return;

                const randomCell = cells[Math.floor(Math.random() * cells.length)] as HTMLElement;
                randomCell.classList.add('bomb');
                randomCell.dataset.bombTime = "20"; // 20 seconds to defuse
                randomCell.innerHTML = `<span class="bomb-timer">20</span>${randomCell.textContent}`;

                this.soundManager.playTone(150, 'square', 0.5); // Warning sound

                const bombInterval = setInterval(() => {
                    let time = parseInt(randomCell.dataset.bombTime!);
                    time--;
                    randomCell.dataset.bombTime = String(time);
                    const timerDisplay = randomCell.querySelector('.bomb-timer') as HTMLElement;
                    if (timerDisplay) timerDisplay.textContent = String(time);

                    if (time <= 5) {
                        this.soundManager.playTone(800, 'sawtooth', 0.1); // Ticking sound
                    }

                    if (time <= 0) {
                        clearInterval(bombInterval);
                        this.gameOverBomb();
                    }
                }, 1000);

                this.activeBombs.push({ el: randomCell, interval: bombInterval });
            }

            defuseBomb(cellEl: HTMLElement) {
                const bombData = this.activeBombs.find(b => b.el === cellEl);
                if (bombData) {
                    clearInterval(bombData.interval);
                    cellEl.classList.remove('bomb');
                    const timerDisplay = cellEl.querySelector('.bomb-timer');
                    if (timerDisplay) timerDisplay.remove();
                    this.activeBombs = this.activeBombs.filter(b => b !== bombData);
                    this.soundManager.playSuccess(); // Defuse sound

                    // Bonus points for defusing
                    this.score += 50;
                    this.saveProgress();
                    this.showComboEffect('DEFUSED! +50');
                }
            }

            clearBombs() {
                if (this.bombSpawnerInterval) clearInterval(this.bombSpawnerInterval);
                this.activeBombs.forEach(b => clearInterval(b.interval));
                this.activeBombs = [];
            }

            gameOverBomb() {
                this.clearBombs();
                alert('💥 BOOM! Game Over! A bomb exploded.');
                this.initLevel(); // Restart level
            }

            spawnFrozenLetters() {
                const cells = Array.from(document.querySelectorAll('.cell'));
                // Freeze 10% of cells
                const count = Math.floor(cells.length * 0.1);
                for (let i = 0; i < count; i++) {
                    const randomCell = cells[Math.floor(Math.random() * cells.length)];
                    randomCell.classList.add('frozen');
                }
            }

            // Daily Challenge Logic
            startDailyChallenge() {
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                const seed = this.cyrb128(today);
                const rand = this.sfc32(seed[0], seed[1], seed[2], seed[3]);

                // Select Topic and Level based on date
                this.currentTopicIndex = Math.floor(rand() * TOPICS.length);
                this.currentLevelIndex = Math.floor(rand() * TOPICS[this.currentTopicIndex].levels.length);

                // Random Mutators
                this.fogEnabled = rand() > 0.7; // 30% chance
                this.bombEnabled = rand() > 0.6; // 40% chance
                this.frozenEnabled = rand() > 0.5; // 50% chance
                this.mode = rand() > 0.8 ? 'timerush' : 'classic';

                this.isDailyChallenge = true;
                this.closeMenu();
                this.initLevel();

                alert(`📅 Daily Challenge Loaded!\nMutators:\nFog: ${this.fogEnabled ? 'ON' : 'OFF'}\nBombs: ${this.bombEnabled ? 'ON' : 'OFF'}\nIce: ${this.frozenEnabled ? 'ON' : 'OFF'}`);
            }

            // Seeded RNG utilities (cyrb128 and sfc32)
            cyrb128(str: string) {
                let h1 = 1779033703, h2 = 3144134277,
                    h3 = 1013904242, h4 = 2773480762;
                for (let i = 0, k; i < str.length; i++) {
                    k = str.charCodeAt(i);
                    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
                    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
                    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
                    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
                }
                h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
                h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
                h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
                h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
                return [(h1 ^ h2 ^ h3 ^ h4) >>> 0, (h2 ^ h1) >>> 0, (h3 ^ h1) >>> 0, (h4 ^ h1) >>> 0];
            }

            sfc32(a: number, b: number, c: number, d: number) {
                return function () {
                    a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0;
                    var t = (a + b) | 0;
                    a = b ^ (b >>> 9);
                    b = c + (c << 3);
                    c = (c << 21) | (c >>> 11);
                    d = (d + 1) | 0;
                    t = (t + d) | 0;
                    c = (c + t) | 0;
                    return (t >>> 0) / 4294967296;
                }
            }

            useHint() {
                if (this.score < 5) {
                    this.soundManager.playTone(300, 'sine', 0.2); // Error sound
                    return;
                }

                // Find a word that hasn't been found yet
                const missingWords = this.words.filter(w => !this.foundWords.has(w));
                if (missingWords.length === 0) return;

                const targetWord = missingWords[Math.floor(Math.random() * missingWords.length)];

                // Find the first letter of this word in the grid
                // We need to know where we placed it. 
                // Since we don't store placement explicitly in a map, we scan the grid.
                // But wait, the grid only has characters. We don't know which 'A' belongs to 'APPLE'.
                // Ideally, we should have stored the placement.
                // Workaround: Scan the grid for the start of the word in all directions.

                let hintCellFound: { row: number, col: number } | null = null;

                // Brute force search for the word in the grid to find its start
                for (let row = 0; row < this.gridSize.rows; row++) {
                    for (let col = 0; col < this.gridSize.cols; col++) {
                        if (this.grid[row][col] === targetWord[0]) {
                            // Check all directions
                            const directions = [
                                { row: 0, col: 1 }, { row: 1, col: 0 }, { row: 1, col: 1 }, { row: -1, col: 1 },
                                { row: 0, col: -1 }, { row: -1, col: 0 }, { row: -1, col: -1 }, { row: 1, col: -1 }
                            ];

                            for (let d of directions) {
                                let match = true;
                                for (let i = 1; i < targetWord.length; i++) {
                                    const nr = row + (i * d.row);
                                    const nc = col + (i * d.col);
                                    if (nr < 0 || nr >= this.gridSize.rows || nc < 0 || nc >= this.gridSize.cols || this.grid[nr][nc] !== targetWord[i]) {
                                        match = false;
                                        break;
                                    }
                                }
                                if (match) {
                                    hintCellFound = { row, col };
                                    break;
                                }
                            }
                        }
                        if (hintCellFound) break;
                    }
                    if (hintCellFound) break;
                }

                if (hintCellFound) {
                    this.score -= 5;
                    this.saveProgress();

                    // Visual Hint
                    const cellEl = this.gridEl.querySelector(`.cell[data-row="${hintCellFound.row}"][data-col="${hintCellFound.col}"]`) as HTMLElement;
                    if (cellEl) {
                        cellEl.style.backgroundColor = '#ffff00';
                        cellEl.style.color = '#000';
                        cellEl.style.boxShadow = '0 0 15px #ffff00';

                        setTimeout(() => {
                            cellEl.style.backgroundColor = '';
                            cellEl.style.color = '';
                            cellEl.style.boxShadow = '';
                        }, 2000);
                    }
                    this.soundManager.playClickSound();
                }
            }
        }

        // Start Game
        window.onload = () => {
            (window as any).game = new WordSearchGame();
        };

        // Apply mobile view from localStorage
        const mobileView = localStorage.getItem('mobileView');
        if (mobileView === 'true') {
            document.body.classList.add('iphone-view');
            document.addEventListener('DOMContentLoaded', () => {
                const btn = document.getElementById('mobileToggle');
                if (btn) btn.classList.add('active');
            });
        }

        (window as any).toggleMobileView = toggleMobileView;
    