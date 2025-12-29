export { };

/**
 * Unblock Me Game - لعبة فك القفل
 * Converted from inline JS
 */

interface LevelData {
    par: number;
    blocks: { x: number; y: number; len: number; dir: 'h' | 'v'; type: 'target' | 'normal' | 'fixed' }[];
}

interface HistoryItem {
    id: number;
    x: number;
    y: number;
}

// --- Sound Manager ---

class SoundManager {
    ctx: AudioContext;
    enabled: boolean;

    constructor() {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.enabled = true;
    }

    playTone(freq: number, type: OscillatorType, duration: number, vol: number = 0.1, slide: number = 0) {
        if (!this.enabled) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        if (slide !== 0) {
            osc.frequency.exponentialRampToValueAtTime(freq + slide, this.ctx.currentTime + duration);
        }

        gain.gain.setValueAtTime(vol, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + duration);
    }

    playSlide() {
        // "Pop" sound for movement
        this.playTone(400, 'sine', 0.1, 0.1, 200);
    }

    playHit() {
        // "Bop" sound for collision/fixed block
        this.playTone(150, 'square', 0.1, 0.05, -50);
    }

    playWin() {
        // Arcade Arpeggio
        [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50].forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, 'square', 0.1, 0.1), i * 80);
        });
        setTimeout(() => this.playTone(1318.51, 'square', 0.4, 0.1), 480);
    }

    playUndo() {
        // "Rewind" sound
        this.playTone(600, 'sawtooth', 0.15, 0.1, -400);
    }
}

// --- Game Logic ---
class Block {
    id: number;
    x: number;
    y: number;
    length: number;
    orientation: 'h' | 'v';
    type: 'target' | 'normal' | 'fixed';
    el: HTMLElement | null;
    tempX?: number;
    tempY?: number;

    constructor(id: number, x: number, y: number, length: number, orientation: 'h' | 'v', type: 'target' | 'normal' | 'fixed') {
        this.id = id;
        this.x = x;
        this.y = y;
        this.length = length;
        this.orientation = orientation; // 'h' or 'v'
        this.type = type; // 'target', 'normal', 'fixed'
        this.el = null;
    }
}

class UnblockGame {
    board: HTMLElement;
    cellSize: number;
    gap: number;
    gridSize: number;
    blocks: Block[];
    currentLevel: number;
    moves: number;
    history: HistoryItem[];
    sound: SoundManager;
    gameMode: 'classic' | 'ice';
    progress: Record<string, { moves: number }>;
    levels: LevelData[];

    isDragging: boolean = false;
    draggedBlock: Block | null = null;
    startPos: { x: number; y: number } = { x: 0, y: 0 };
    blockStartPos: { x: number; y: number } = { x: 0, y: 0 };
    hasMoved: boolean = false;

    constructor() {
        this.board = document.getElementById('board')!;
        this.cellSize = 55;
        this.gap = 4;
        this.gridSize = 6;
        this.blocks = [];
        this.currentLevel = 0;
        this.moves = 0;
        this.history = []; // For undo
        this.sound = new SoundManager();
        this.gameMode = 'classic'; // 'classic' or 'ice'

        // Persistence
        this.progress = JSON.parse(localStorage.getItem('unblockMe_progress')!) || {};

        // Level Data (Same levels for both modes for now)
        // Par: Optimal moves for 3 stars (approximate)
        this.levels = [
            {
                par: 10,
                blocks: [
                    { x: 1, y: 2, len: 2, dir: 'h', type: 'target' },
                    { x: 0, y: 0, len: 3, dir: 'v', type: 'normal' },
                    { x: 1, y: 0, len: 2, dir: 'h', type: 'normal' },
                    { x: 3, y: 0, len: 3, dir: 'v', type: 'normal' },
                    { x: 4, y: 2, len: 2, dir: 'v', type: 'normal' },
                    { x: 0, y: 4, len: 2, dir: 'h', type: 'normal' },
                    { x: 2, y: 4, len: 2, dir: 'v', type: 'normal' },
                    { x: 4, y: 4, len: 2, dir: 'h', type: 'normal' }
                ]
            },
            {
                par: 15,
                blocks: [
                    { x: 0, y: 2, len: 2, dir: 'h', type: 'target' },
                    { x: 2, y: 0, len: 3, dir: 'v', type: 'normal' },
                    { x: 3, y: 1, len: 2, dir: 'v', type: 'normal' },
                    { x: 0, y: 4, len: 3, dir: 'h', type: 'normal' },
                    { x: 4, y: 3, len: 2, dir: 'v', type: 'normal' },
                    { x: 2, y: 3, len: 2, dir: 'h', type: 'normal' },
                    { x: 0, y: 0, len: 1, dir: 'h', type: 'fixed' },
                    { x: 5, y: 5, len: 1, dir: 'h', type: 'fixed' }
                ]
            },
            {
                par: 20,
                blocks: [
                    { x: 1, y: 2, len: 2, dir: 'h', type: 'target' },
                    { x: 0, y: 0, len: 2, dir: 'h', type: 'normal' },
                    { x: 2, y: 0, len: 2, dir: 'h', type: 'normal' },
                    { x: 4, y: 0, len: 2, dir: 'v', type: 'normal' },
                    { x: 0, y: 1, len: 2, dir: 'v', type: 'normal' },
                    { x: 3, y: 1, len: 3, dir: 'v', type: 'normal' },
                    { x: 1, y: 3, len: 2, dir: 'v', type: 'normal' },
                    { x: 0, y: 4, len: 2, dir: 'h', type: 'normal' },
                    { x: 4, y: 4, len: 2, dir: 'v', type: 'normal' },
                    { x: 2, y: 2, len: 1, dir: 'h', type: 'fixed' }
                ]
            }
        ];

        // Don't init level yet, wait for mode selection
        this.addEventListeners();

        // Init audio context on first interaction
        window.addEventListener('click', () => {
            if (this.sound.ctx.state === 'suspended') this.sound.ctx.resume();
        }, { once: true });

        // Load Night Mode Preference
        if (localStorage.getItem('unblockMe_nightMode') === 'true') {
            this.toggleNightMode(true);
        }
    }

    toggleNightMode(force: boolean | null = null) {
        const body = document.body;
        const isNight = force !== null ? force : !body.classList.contains('night-mode');

        if (isNight) {
            body.classList.add('night-mode');
            document.getElementById('theme-icon')!.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'; // Sun icon
        } else {
            body.classList.remove('night-mode');
            document.getElementById('theme-icon')!.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'; // Moon icon
        }

        localStorage.setItem('unblockMe_nightMode', isNight.toString());
    }

    startMode(mode: 'classic' | 'ice') {
        this.gameMode = mode;
        document.getElementById('start-screen')!.classList.add('hidden');
        this.initLevel(this.currentLevel);
    }

    initLevel(levelIndex: number) {
        this.currentLevel = levelIndex;
        this.moves = 0;
        this.history = [];
        this.updateUI();

        this.board.innerHTML = '<div class="exit-gate"></div><div class="exit-arrow">➜</div>';
        this.blocks = [];

        const levelData = this.levels[levelIndex % this.levels.length];

        levelData.blocks.forEach((b, i) => {
            const block = new Block(i, b.x, b.y, b.len, b.dir, b.type);
            this.createBlockElement(block);
            this.blocks.push(block);
        });
    }

    updateUI() {
        document.getElementById('level-display')!.textContent = (this.currentLevel + 1).toString();
        document.getElementById('moves-display')!.textContent = this.moves.toString();

        const key = `${this.gameMode}_${this.currentLevel}`;
        const best = this.progress[key] ? this.progress[key].moves.toString() : '-';
        document.getElementById('best-display')!.textContent = best;
    }

    createBlockElement(block: Block) {
        const el = document.createElement('div');

        let className = `block ${block.type} ${block.orientation === 'h' ? 'horizontal' : 'vertical'}`;
        if (this.gameMode === 'ice') className += ' ice-theme';
        el.className = className;

        if (block.orientation === 'h') {
            el.style.width = `calc(${block.length} * var(--cell-size) + ${block.length - 1} * var(--gap))`;
            el.style.height = `var(--cell-size)`;
        } else {
            el.style.width = `var(--cell-size)`;
            el.style.height = `calc(${block.length} * var(--cell-size) + ${block.length - 1} * var(--gap))`;
        }

        this.updateBlockPosition(el, block.x, block.y);

        el.dataset.id = block.id.toString();
        this.board.appendChild(el);
        block.el = el;
    }

    updateBlockPosition(el: HTMLElement, x: number, y: number) {
        const left = x * (this.cellSize + this.gap);
        const top = y * (this.cellSize + this.gap);
        el.style.transform = `translate(${left}px, ${top}px)`;
    }

    addEventListeners() {
        const handleStart = (e: any) => {
            if (!(e.target as HTMLElement).classList.contains('block')) return;
            const id = parseInt((e.target as HTMLElement).dataset.id!);
            const block = this.blocks[id];

            if (block.type === 'fixed') {
                this.sound.playHit(); // Feedback that it can't move
                return;
            }

            if (e.cancelable) e.preventDefault();

            this.isDragging = true;
            this.draggedBlock = block;

            const touch = e.touches ? e.touches[0] : e;
            this.startPos = { x: touch.clientX, y: touch.clientY };
            this.blockStartPos = { x: this.draggedBlock.x, y: this.draggedBlock.y };
            this.hasMoved = false;
        };

        const handleMove = (e: any) => {
            if (!this.isDragging || !this.draggedBlock) return;
            if (e.cancelable) e.preventDefault();

            const touch = e.touches ? e.touches[0] : e;
            const dx = touch.clientX - this.startPos.x;
            const dy = touch.clientY - this.startPos.y;

            // Threshold to start moving
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) this.hasMoved = true;

            const moveUnits = (this.draggedBlock.orientation === 'h' ? dx : dy) / (this.cellSize + this.gap);

            // Calculate potential new position
            let newX = this.blockStartPos.x;
            let newY = this.blockStartPos.y;

            if (this.draggedBlock.orientation === 'h') {
                newX += moveUnits;
            } else {
                newY += moveUnits;
            }

            const constrained = this.constrainPosition(this.draggedBlock, newX, newY);

            // Visual Update (smooth)
            const pixelX = constrained.x * (this.cellSize + this.gap);
            const pixelY = constrained.y * (this.cellSize + this.gap);

            if (this.draggedBlock.el) {
                this.draggedBlock.el.style.transform = `translate(${pixelX}px, ${pixelY}px)`;
            }

            // Store temporary visual pos for snap calculation
            this.draggedBlock.tempX = constrained.x;
            this.draggedBlock.tempY = constrained.y;
        };

        const handleEnd = () => {
            if (!this.isDragging || !this.draggedBlock) return;

            let finalX, finalY;

            if (this.gameMode === 'ice' && this.hasMoved) {
                // Calculate slide to limit
                const limits = this.getLimits(this.draggedBlock);
                const diffX = (this.draggedBlock.tempX || this.draggedBlock.x) - this.blockStartPos.x;
                const diffY = (this.draggedBlock.tempY || this.draggedBlock.y) - this.blockStartPos.y;

                finalX = this.blockStartPos.x;
                finalY = this.blockStartPos.y;

                if (this.draggedBlock.orientation === 'h') {
                    if (diffX > 0.2) finalX = limits.max;
                    else if (diffX < -0.2) finalX = limits.min;
                } else {
                    if (diffY > 0.2) finalY = limits.max;
                    else if (diffY < -0.2) finalY = limits.min;
                }
            } else {
                // Classic snap
                finalX = Math.round(this.draggedBlock.tempX || this.draggedBlock.x);
                finalY = Math.round(this.draggedBlock.tempY || this.draggedBlock.y);
            }

            // Check if actually moved
            if (finalX !== this.blockStartPos.x || finalY !== this.blockStartPos.y) {
                // Save history
                this.history.push({
                    id: this.draggedBlock.id,
                    x: this.blockStartPos.x,
                    y: this.blockStartPos.y
                });

                this.moves++;
                this.updateUI();
                this.sound.playSlide();
            }

            this.draggedBlock.x = finalX;
            this.draggedBlock.y = finalY;

            // Animate to final position
            const blockToAnimate = this.draggedBlock;
            if (blockToAnimate.el) {
                blockToAnimate.el.style.transition = 'transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.updateBlockPosition(blockToAnimate.el, finalX, finalY);

                // Reset transition after animation
                setTimeout(() => {
                    if (blockToAnimate.el) {
                        blockToAnimate.el.style.transition = 'transform 0.1s';
                    }
                }, 200);
            }

            this.isDragging = false;
            this.draggedBlock = null;

            this.checkWin();
        };

        this.board.addEventListener('mousedown', handleStart);
        this.board.addEventListener('touchstart', handleStart, { passive: false });
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('mouseup', handleEnd);
        window.addEventListener('touchend', handleEnd);
    }

    getLimits(block: Block) {
        let min = 0;
        let max = this.gridSize - block.length;

        if (block.orientation === 'h') {
            for (let b of this.blocks) {
                if (b === block) continue;
                if (b.y <= block.y && b.y + (b.orientation === 'v' ? b.length : 1) > block.y) {
                    if (b.x + (b.orientation === 'h' ? b.length : 1) <= this.blockStartPos.x) {
                        min = Math.max(min, b.x + (b.orientation === 'h' ? b.length : 1));
                    }
                    if (b.x >= this.blockStartPos.x + block.length) {
                        max = Math.min(max, b.x - block.length);
                    }
                }
            }
        } else {
            for (let b of this.blocks) {
                if (b === block) continue;
                if (b.x <= block.x && b.x + (b.orientation === 'h' ? b.length : 1) > block.x) {
                    if (b.y + (b.orientation === 'v' ? b.length : 1) <= this.blockStartPos.y) {
                        min = Math.max(min, b.y + (b.orientation === 'v' ? b.length : 1));
                    }
                    if (b.y >= this.blockStartPos.y + block.length) {
                        max = Math.min(max, b.y - block.length);
                    }
                }
            }
        }
        return { min, max };
    }

    constrainPosition(block: Block, targetX: number, targetY: number) {
        const limits = this.getLimits(block);
        if (block.orientation === 'h') {
            targetX = Math.max(limits.min, Math.min(limits.max, targetX));
            return { x: targetX, y: block.y };
        } else {
            targetY = Math.max(limits.min, Math.min(limits.max, targetY));
            return { x: block.x, y: targetY };
        }
    }

    undo() {
        if (this.history.length === 0) return;
        const lastMove = this.history.pop()!;
        const block = this.blocks[lastMove.id];
        block.x = lastMove.x;
        block.y = lastMove.y;
        if (block.el) this.updateBlockPosition(block.el, block.x, block.y);
        this.moves--;
        this.updateUI();
        this.sound.playUndo();
    }

    checkWin() {
        const target = this.blocks.find(b => b.type === 'target');
        if (!target) return;

        if (target.x >= 4) {
            this.sound.playWin();
            this.saveScore();

            // Calculate stars
            const par = this.levels[this.currentLevel % this.levels.length].par;
            let stars = 1;
            if (this.moves <= par) stars = 3;
            else if (this.moves <= par * 1.5) stars = 2;

            document.getElementById('modal-stars')!.textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
            document.getElementById('modal-moves')!.textContent = this.moves.toString();
            document.getElementById('modal-moves-ar')!.textContent = this.moves.toString();

            setTimeout(() => {
                document.getElementById('win-modal')!.classList.add('active');
                this.createConfetti();
            }, 200);
        }
    }

    saveScore() {
        const key = `${this.gameMode}_${this.currentLevel}`;
        const currentBest = this.progress[key] ? this.progress[key].moves : Infinity;

        if (this.moves < currentBest) {
            this.progress[key] = {
                moves: this.moves
            };
            localStorage.setItem('unblockMe_progress', JSON.stringify(this.progress));
        }
    }

    nextLevel() {
        document.getElementById('win-modal')!.classList.remove('active');
        this.initLevel(this.currentLevel + 1);
    }

    resetLevel() {
        this.initLevel(this.currentLevel);
        this.sound.playUndo();
    }

    createConfetti() {
        for (let i = 0; i < 50; i++) {
            const el = document.createElement('div');
            el.style.position = 'fixed';
            el.style.left = Math.random() * 100 + 'vw';
            el.style.top = '-10px';
            el.style.width = '10px';
            el.style.height = '10px';

            el.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
            el.style.zIndex = '2000';
            el.style.pointerEvents = 'none';
            document.body.appendChild(el);

            const anim = el.animate([
                { transform: `translate(0, 0) rotate(0deg)`, opacity: 1 },
                { transform: `translate(${Math.random() * 100 - 50}px, 100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
            ], {
                duration: 1000 + Math.random() * 2000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });

            anim.onfinish = () => el.remove();
        }
    }
}

let game: UnblockGame;

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    game = new UnblockGame();

    // Expose game globally for onclick handlers
    (window as any).game = game;

    // Auto-start in classic mode (no mode selection screen)
    game.startMode('classic');
});

// Toggle Mobile View Function
function toggleMobileView() {
    document.body.classList.toggle('iphone-view');
    const isActive = document.body.classList.contains('iphone-view');
    localStorage.setItem('mobileView', isActive ? 'true' : 'false');
    const btn = document.getElementById('mobileToggle');
    if (btn) btn.classList.toggle('active', isActive);
}

// Expose toggleMobileView globally
(window as any).toggleMobileView = toggleMobileView;

// Apply mobile view from localStorage
if (localStorage.getItem('mobileView') === 'true') {
    document.body.classList.add('iphone-view');

    document.addEventListener('DOMContentLoaded', () => {
        const btn = document.getElementById('mobileToggle');
        if (btn) btn.classList.add('active');
    });
}