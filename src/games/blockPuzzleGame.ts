export { };

/**
 * Block Puzzle Game
 * Converted from inline JS
 */


const CONFIG = {
    gridSize: 9,
    colors: {
        bg: '#1a1a24',
        gridLine: '#2a2a35',
        block: '#00f3ff', // Default Cyan
        palette: ['#00f3ff', '#bc13fe', '#ff0055', '#ffe600'], // Cyan, Purple, Pink, Yellow
        bomb: '#ff0000',
        bombText: '#ffffff',
        ice: '#aaddff',
        iceBorder: '#ffffff',
        rock: '#555566',
        ghost: 'rgba(255, 255, 255, 0.2)',
        particles: ['#00f3ff', '#bc13fe', '#ffffff']
    },
    storageKeys: {
        highScore: 'neonBlocks_highScore',
        gameState: 'neonBlocks_state'
    }
};

const SHAPES = [
    [[1]], [[1, 1]], [[1], [1]], [[1, 1, 1]], [[1], [1], [1]], [[1, 1], [1, 1]],
    [[1, 1, 1], [0, 1, 0]], [[0, 1, 0], [1, 1, 1]], [[1, 1, 1], [1, 0, 0]], [[1, 1, 1], [0, 0, 1]],
    [[1, 1], [1, 0]], [[1, 1, 1, 1]], [[1], [1], [1], [1]], [[1, 1, 1], [1, 1, 1]],
    [[0, 1, 0], [1, 1, 1], [0, 1, 0]], // Plus
    [[1, 0, 1], [1, 1, 1]], // U-Shape
    [[1, 1, 1], [1, 0, 1]], // U-Shape Inverted
    [[1, 0, 0], [1, 0, 0], [1, 1, 1]], // Big L
    [[0, 0, 1], [0, 0, 1], [1, 1, 1]], // Big J
    [[1, 1, 1], [0, 1, 0], [0, 1, 0]], // Big T
    [[1, 0], [0, 1]], // Diagonal 2
    [[0, 1], [1, 0]], // Diagonal 2 Inv
    [[1, 1, 0], [0, 1, 1]], // Z-Shape
    [[0, 1, 1], [1, 1, 0]] // S-Shape
];

interface GridCell {
    color: string;
    bomb: number | null;
    ice: boolean;
    rock: boolean;
}

interface HandItem {
    shape: number[][];
    color: string;
}

interface Metrics {
    scale: number;
    gridSize: number;
    cellSize: number;
    gridX: number;
    gridY: number;
    handY: number;
}

class SoundManager {
    ctx: AudioContext | null;
    enabled: boolean;

    constructor() {
        this.ctx = null;
        this.enabled = true;
    }
    init() {
        if (!this.ctx) {
            this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        if (this.ctx.state === 'suspended') this.ctx.resume();
    }
    playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0, vol: number = 0.1) {
        if (!this.enabled || !this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
        gain.gain.setValueAtTime(vol, this.ctx.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + startTime + duration);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + startTime);
        osc.stop(this.ctx.currentTime + startTime + duration);
    }
    playPickup() { this.playTone(400, 'sine', 0.1, 0, 0.05); }
    playPlace() { this.playTone(200, 'triangle', 0.1, 0, 0.1); }
    playClear(combo: number = 1) {
        const baseFreq = 440;
        [1, 1.25, 1.5, 2].forEach((r, i) => this.playTone(baseFreq * r * (1 + combo * 0.1), 'sine', 0.4, i * 0.05, 0.1));
        if (combo > 1) this.playTone(880, 'square', 0.2, 0.2, 0.05);
    }
    playGameOver() {
        this.playTone(300, 'sawtooth', 0.5, 0, 0.1);
        this.playTone(250, 'sawtooth', 0.5, 0.4, 0.1);
        this.playTone(200, 'sawtooth', 1.0, 0.8, 0.1);
    }
    playTick() { this.playTone(800, 'square', 0.05, 0, 0.05); }
    playIceCrack() { this.playTone(1200, 'sawtooth', 0.1, 0, 0.1); }
    playRotate() { this.playTone(600, 'sine', 0.1, 0, 0.05); }
}

class VisualFX {
    particles: any[];
    texts: any[];
    shake: number;

    constructor() {
        this.particles = [];
        this.texts = [];
        this.shake = 0;
    }
    spawnExplosion(x: number, y: number, count: number, color: string) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x, y, color: color || CONFIG.colors.particles[0],
                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                life: 1.0, decay: 0.02 + Math.random() * 0.03, size: 2 + Math.random() * 4
            });
        }
    }
    spawnText(x: number, y: number, text: string, color: string) {
        this.texts.push({ x, y, text, color, life: 1.0, vy: -1 });
    }
    triggerShake(amount: number) { this.shake = amount; }
    update() {
        this.particles.forEach(p => { p.x += p.vx; p.y += p.vy; p.life -= p.decay; p.size *= 0.95; });
        this.particles = this.particles.filter(p => p.life > 0);
        this.texts.forEach(t => { t.y += t.vy; t.life -= 0.02; });
        this.texts = this.texts.filter(t => t.life > 0);
        if (this.shake > 0) { this.shake *= 0.9; if (this.shake < 0.5) this.shake = 0; }
    }
    draw(ctx: CanvasRenderingContext2D) {
        this.particles.forEach(p => {
            ctx.globalAlpha = p.life; ctx.fillStyle = p.color; ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill();
        });
        this.texts.forEach(t => {
            ctx.globalAlpha = t.life; ctx.fillStyle = t.color; ctx.font = 'bold 20px Inter, system-ui, sans-serif';
            ctx.textAlign = 'center'; ctx.fillText(t.text, t.x, t.y);
        });
        ctx.globalAlpha = 1.0;
    }
    getShake() { return this.shake > 0 ? { x: (Math.random() - 0.5) * this.shake, y: (Math.random() - 0.5) * this.shake } : { x: 0, y: 0 }; }
}

class Game {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    scoreEl: HTMLElement;
    highScoreEl: HTMLElement;
    finalScoreEl: HTMLElement;
    timerContainer: HTMLElement;
    timerValue: HTMLElement;

    mode: string;
    grid: (GridCell | null)[][];
    hand: (HandItem | null)[];
    score: number;
    highScore: number;
    moves: number;
    timeLeft: number;
    timerInterval: any;

    fx: VisualFX;
    sound: SoundManager;

    metrics: Metrics;

    isDragging: boolean = false;
    dragIdx: number = -1;
    dragPos: { x: number, y: number } = { x: 0, y: 0 };
    dragOffset: { x: number, y: number } = { x: 0, y: 0 };

    constructor() {
        this.canvas = document.getElementById('gameCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.scoreEl = document.getElementById('score')!;
        this.highScoreEl = document.getElementById('highScore')!;
        this.finalScoreEl = document.getElementById('finalScore')!;
        this.timerContainer = document.getElementById('timerContainer')!;
        this.timerValue = document.getElementById('timerValue')!;

        this.mode = 'classic';
        this.grid = Array(9).fill(null).map(() => Array(9).fill(null)); // Stores { color, bomb, ice, rock }
        this.hand = [null, null, null];
        this.score = 0;
        this.highScore = 0;
        this.moves = 0;
        this.timeLeft = 120;
        this.timerInterval = null;

        this.fx = new VisualFX();
        this.sound = new SoundManager();

        this.metrics = { scale: 1, gridSize: 0, cellSize: 0, gridX: 0, gridY: 0, handY: 0 };

        this.loadHighScore();
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.initInput();

        if (localStorage.getItem(CONFIG.storageKeys.gameState)) {
            (document.getElementById('resumeBtn') as HTMLElement).style.display = 'block';
        }

        this.loop();
    }

    startMode(mode: string) {
        this.mode = mode;
        this.restart();
        document.getElementById('mainMenu')!.classList.remove('active');
        if (this.mode === 'time') {
            this.timeLeft = 120;
            this.timerContainer.style.display = 'block';
            this.startTimer();
        } else {
            this.timerContainer.style.display = 'none';
        }
    }

    showMenu() {
        document.getElementById('gameOverModal')!.classList.remove('active');
        document.getElementById('mainMenu')!.classList.add('active');
        this.stopTimer();
    }

    resume() {
        if (this.loadState()) {
            document.getElementById('mainMenu')!.classList.remove('active');
            if (this.mode === 'time') {
                this.timerContainer.style.display = 'block';
                this.startTimer();
            }
        }
    }

    rotateHand() {
        this.sound.playRotate();
        for (let i = 0; i < 3; i++) {
            const item = this.hand[i];
            if (item) {
                const shape = item.shape;
                // Rotate Matrix 90 deg clockwise
                const N = shape.length;
                const M = shape[0].length;
                const newShape = Array(M).fill(null).map(() => Array(N).fill(0));
                for (let r = 0; r < N; r++) {
                    for (let c = 0; c < M; c++) {
                        newShape[c][N - 1 - r] = shape[r][c];
                    }
                }
                item.shape = newShape;
            }
        }
    }

    startTimer() {
        this.stopTimer();
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            this.timerValue.textContent = this.timeLeft.toString();
            if (this.timeLeft <= 10) this.sound.playTick();
            if (this.timeLeft <= 0) this.endGame();
        }, 1000);
    }

    stopTimer() { if (this.timerInterval) clearInterval(this.timerInterval); }

    resize() {
        const container = document.getElementById('game-container')!;
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = container.clientWidth * dpr;
        this.canvas.height = container.clientHeight * dpr;
        this.canvas.style.width = `${container.clientWidth}px`;
        this.canvas.style.height = `${container.clientHeight}px`;
        this.ctx.scale(dpr, dpr);

        const padding = 20;
        const availW = container.clientWidth - padding * 2;
        this.metrics.cellSize = Math.floor(availW / 9);
        this.metrics.gridSize = this.metrics.cellSize * 9;
        this.metrics.gridX = (container.clientWidth - this.metrics.gridSize) / 2;
        this.metrics.gridY = padding + (this.mode === 'time' ? 40 : 0);
        this.metrics.handY = this.metrics.gridY + this.metrics.gridSize + 40;
    }

    spawnShapes() {
        for (let i = 0; i < 3; i++) {
            const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
            let color = CONFIG.colors.block;
            if (this.mode === 'color') color = CONFIG.colors.palette[Math.floor(Math.random() * CONFIG.colors.palette.length)];
            this.hand[i] = { shape, color };
        }
    }

    placeShape(handItem: HandItem, r: number, c: number) {
        const { shape, color } = handItem;
        let blocksPlaced = 0;
        this.moves++;

        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[0].length; j++) {
                if (shape[i][j] === 1) {
                    this.grid[r + i][c + j] = { color: color, bomb: null, ice: false, rock: false };
                    blocksPlaced++;
                    const px = this.metrics.gridX + (c + j) * this.metrics.cellSize + this.metrics.cellSize / 2;
                    const py = this.metrics.gridY + (r + i) * this.metrics.cellSize + this.metrics.cellSize / 2;
                    this.fx.spawnExplosion(px, py, 3, color);
                }
            }
        }

        this.addScore(blocksPlaced * 10);
        this.sound.playPlace();
        this.fx.triggerShake(2);

        // Events
        if (this.mode === 'bomb' && this.moves % 5 === 0) this.spawnBomb();
        if (this.moves % 15 === 0) this.spawnIce(); // Ice every 15 moves
        if (this.moves % 30 === 0) this.spawnRock(); // Rock every 30 moves

        if (this.mode === 'bomb') this.updateBombs();
    }

    spawnBomb() {
        let candidates = this.getFilledCells().filter(c => !c.cell.bomb && !c.cell.rock && !c.cell.ice);
        if (candidates.length > 0) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            pick.cell.bomb = 9;
            this.sound.playTick();
        }
    }

    spawnIce() {
        let candidates = this.getFilledCells().filter(c => !c.cell.bomb && !c.cell.rock && !c.cell.ice);
        if (candidates.length > 0) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            pick.cell.ice = true; // Needs 2 hits (1 to crack, 1 to break)
        }
    }

    spawnRock() {
        let candidates = this.getEmptyCells();
        if (candidates.length > 0) {
            const pick = candidates[Math.floor(Math.random() * candidates.length)];
            this.grid[pick.r][pick.c] = { color: CONFIG.colors.rock, rock: true, bomb: null, ice: false };
            this.fx.spawnExplosion(
                this.metrics.gridX + pick.c * this.metrics.cellSize + this.metrics.cellSize / 2,
                this.metrics.gridY + pick.r * this.metrics.cellSize + this.metrics.cellSize / 2,
                5, CONFIG.colors.rock
            );
        }
    }

    getFilledCells() {
        let res: { r: number, c: number, cell: GridCell }[] = [];
        for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (this.grid[r][c]) res.push({ r, c, cell: this.grid[r][c]! });
        return res;
    }

    getEmptyCells() {
        let res: { r: number, c: number }[] = [];
        for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (!this.grid[r][c]) res.push({ r, c });
        return res;
    }

    updateBombs() {
        for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
            const cell = this.grid[r][c];
            if (cell && cell.bomb !== null) {
                cell.bomb--;
                if (cell.bomb <= 0) { this.endGame(); return; }
            }
        }
    }

    checkClear() {
        let rows: number[] = [], cols: number[] = [], sqs: { r: number, c: number }[] = [];

        // Find clears (Rocks count as filled but don't clear)
        for (let r = 0; r < 9; r++) if (this.grid[r].every(c => c !== null)) rows.push(r);
        for (let c = 0; c < 9; c++) {
            let full = true; for (let r = 0; r < 9; r++) if (!this.grid[r][c]) full = false;
            if (full) cols.push(c);
        }
        for (let sr = 0; sr < 3; sr++) for (let sc = 0; sc < 3; sc++) {
            let full = true;
            for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (!this.grid[sr * 3 + r][sc * 3 + c]) full = false;
            if (full) sqs.push({ r: sr, c: sc });
        }

        const total = rows.length + cols.length + sqs.length;
        if (total > 0) {
            this.sound.playClear(total);
            this.fx.triggerShake(total * 4);
            if (this.mode === 'time') {
                this.timeLeft += total * 5;
                this.timerValue.textContent = this.timeLeft.toString();
                this.fx.spawnText(this.metrics.gridX + this.metrics.gridSize / 2, this.metrics.gridY, `+${total * 5}s`, '#0f0');
            }

            let scoreMult = 1;
            let cellsToClear = new Set(); // Use set to avoid double clearing same cell

            const mark = (r: number, c: number) => cellsToClear.add(`${r},${c}`);

            rows.forEach(r => {
                if (this.mode === 'color' && this.grid[r].every(c => c && c.color === this.grid[r][0]!.color)) scoreMult += 2;
                for (let c = 0; c < 9; c++) mark(r, c);
            });
            cols.forEach(c => {
                let colCells = []; for (let r = 0; r < 9; r++) colCells.push(this.grid[r][c]);
                if (this.mode === 'color' && colCells.every(c => c && c.color === colCells[0]!.color)) scoreMult += 2;
                for (let r = 0; r < 9; r++) mark(r, c);
            });
            sqs.forEach(sq => {
                let sqCells = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) sqCells.push(this.grid[sq.r * 3 + r][sq.c * 3 + c]);
                if (this.mode === 'color' && sqCells.every(c => c && c.color === sqCells[0]!.color)) scoreMult += 2;
                for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) mark(sq.r * 3 + r, sq.c * 3 + c);
            });

            cellsToClear.forEach(key => {
                const [r, c] = (key as string).split(',').map(Number);
                const cell = this.grid[r][c];
                if (cell && !cell.rock) {
                    if (cell.ice) {
                        // Crack ice
                        cell.ice = false; // Remove ice property (now normal block)
                        this.sound.playIceCrack();
                        this.fx.spawnExplosion(
                            this.metrics.gridX + c * this.metrics.cellSize + this.metrics.cellSize / 2,
                            this.metrics.gridY + r * this.metrics.cellSize + this.metrics.cellSize / 2,
                            5, CONFIG.colors.ice
                        );
                    } else {
                        // Destroy
                        this.spawnClearFX(r, c, cell.color);
                        this.grid[r][c] = null;
                    }
                }
            });

            const bonus = total * 100 * scoreMult;
            this.addScore(bonus);
            const cx = this.metrics.gridX + this.metrics.gridSize / 2;
            const cy = this.metrics.gridY + this.metrics.gridSize / 2;
            this.fx.spawnText(cx, cy, `+${bonus}`, '#fff');
            if (scoreMult > 1) this.fx.spawnText(cx, cy - 30, 'Färgmatch! / تطابق!', CONFIG.colors.palette[3]);
        }
    }

    spawnClearFX(r: number, c: number, color: string) {
        const x = this.metrics.gridX + c * this.metrics.cellSize + this.metrics.cellSize / 2;
        const y = this.metrics.gridY + r * this.metrics.cellSize + this.metrics.cellSize / 2;
        this.fx.spawnExplosion(x, y, 5, color);
    }

    initInput() {
        const initAudio = () => { this.sound.init(); window.removeEventListener('touchstart', initAudio); window.removeEventListener('mousedown', initAudio); };
        window.addEventListener('touchstart', initAudio); window.addEventListener('mousedown', initAudio);

        this.isDragging = false;

        const getPos = (e: any) => {
            const r = this.canvas.getBoundingClientRect();
            const t = e.touches ? e.touches[0] : e;
            return { x: t.clientX - r.left, y: t.clientY - r.top };
        };

        const start = (e: any) => {
            if (document.querySelector('.modal-overlay.active') && !document.getElementById('mainMenu')!.classList.contains('active')) return;
            if (document.getElementById('mainMenu')!.classList.contains('active')) return;

            const p = getPos(e);
            if (p.y > this.metrics.handY) {
                const slotW = this.canvas.width / 3 / (window.devicePixelRatio || 1);
                const idx = Math.floor(p.x / slotW);
                if (idx >= 0 && idx < 3 && this.hand[idx]) {
                    this.isDragging = true;
                    this.dragIdx = idx;
                    this.dragPos = p;
                    this.dragOffset = { x: 0, y: -50 };
                    this.sound.playPickup();
                }
            }
        };

        const move = (e: any) => { if (this.isDragging) this.dragPos = getPos(e); };

        const end = () => {
            if (!this.isDragging) return;
            const item = this.hand[this.dragIdx];
            if (!item) return;

            const gp = this.getGridPos(this.dragPos.x + this.dragOffset.x, this.dragPos.y + this.dragOffset.y, item.shape);

            if (gp && this.canPlace(item.shape, gp.r, gp.c)) {
                this.placeShape(item, gp.r, gp.c);
                this.hand[this.dragIdx] = null;
                this.checkClear();
                this.saveState();
                if (this.hand.every(s => s === null)) { this.spawnShapes(); this.saveState(); }
                if (this.checkGameOver()) this.endGame();
            }
            this.isDragging = false;
            this.dragIdx = -1;
        };

        this.canvas.addEventListener('mousedown', start);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', end);
        this.canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); }, { passive: false });
        this.canvas.addEventListener('touchmove', (e) => { e.preventDefault(); move(e); }, { passive: false });
        this.canvas.addEventListener('touchend', end);
    }

    getGridPos(x: number, y: number, shape: number[][]) {
        const sw = shape[0].length * this.metrics.cellSize;
        const sh = shape.length * this.metrics.cellSize;
        const rx = x - this.metrics.gridX - sw / 2 + this.metrics.cellSize / 2;
        const ry = y - this.metrics.gridY - sh / 2 + this.metrics.cellSize / 2;
        return { r: Math.round(ry / this.metrics.cellSize), c: Math.round(rx / this.metrics.cellSize) };
    }

    canPlace(shape: number[][], r: number, c: number) {
        for (let i = 0; i < shape.length; i++) for (let j = 0; j < shape[0].length; j++) {
            if (shape[i][j]) {
                if (r + i < 0 || r + i >= 9 || c + j < 0 || c + j >= 9 || this.grid[r + i][c + j]) return false;
            }
        }
        return true;
    }

    // Predict if placing shape at (r,c) will clear any rows/columns/squares
    predictWillClear(shape: number[][], r: number, c: number): { willClear: boolean, clearCount: number, cleared: { rows: number[], cols: number[], sqs: { r: number, c: number }[] } } {
        // Create temporary grid copy
        const tempGrid: (GridCell | null)[][] = this.grid.map(row => row.map(cell => cell ? { ...cell } : null));

        // Place shape on temp grid
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[0].length; j++) {
                if (shape[i][j]) {
                    tempGrid[r + i][c + j] = { color: '#fff', bomb: null, ice: false, rock: false };
                }
            }
        }

        const cleared = { rows: [] as number[], cols: [] as number[], sqs: [] as { r: number, c: number }[] };

        // Check rows
        for (let row = 0; row < 9; row++) {
            if (tempGrid[row].every(cell => cell !== null)) cleared.rows.push(row);
        }

        // Check columns  
        for (let col = 0; col < 9; col++) {
            let full = true;
            for (let row = 0; row < 9; row++) if (!tempGrid[row][col]) full = false;
            if (full) cleared.cols.push(col);
        }

        // Check 3x3 squares
        for (let sr = 0; sr < 3; sr++) {
            for (let sc = 0; sc < 3; sc++) {
                let full = true;
                for (let row = 0; row < 3; row++) {
                    for (let col = 0; col < 3; col++) {
                        if (!tempGrid[sr * 3 + row][sc * 3 + col]) full = false;
                    }
                }
                if (full) cleared.sqs.push({ r: sr, c: sc });
            }
        }

        const clearCount = cleared.rows.length + cleared.cols.length + cleared.sqs.length;
        return { willClear: clearCount > 0, clearCount, cleared };
    }

    checkGameOver() {
        // If hand is empty, it's not game over (waiting for spawn or start)
        if (this.hand.every(item => item === null)) return false;

        for (let i = 0; i < 3; i++) {
            const item = this.hand[i];
            if (item && item.shape) {
                for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (this.canPlace(item.shape, r, c)) return false;
            }
        }
        return true;
    }

    endGame() {
        this.stopTimer();
        this.finalScoreEl.textContent = this.score.toString();
        if (this.score >= this.highScore && this.score > 0) (document.getElementById('newHighScoreLabel') as HTMLElement).style.display = 'block';
        else (document.getElementById('newHighScoreLabel') as HTMLElement).style.display = 'none';

        // Hide Main Menu if active (just in case)
        document.getElementById('mainMenu')!.classList.remove('active');

        document.getElementById('gameOverModal')!.classList.add('active');
        this.sound.playGameOver();
        localStorage.removeItem(CONFIG.storageKeys.gameState);
    }

    restart() {
        this.grid = Array(9).fill(null).map(() => Array(9).fill(null));
        this.score = 0;
        this.moves = 0;
        this.timeLeft = 120; // Reset time
        this.scoreEl.textContent = '0';
        document.getElementById('gameOverModal')!.classList.remove('active');
        // Main Menu handling is done in startMode/resume
        this.spawnShapes();
        this.saveState();
    }

    addScore(pts: number) {
        this.score += pts;
        this.scoreEl.textContent = this.score.toString();
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this.highScoreEl.textContent = this.highScore.toString();
            localStorage.setItem(CONFIG.storageKeys.highScore, this.highScore.toString());
        }
    }

    saveState() {
        if (this.timeLeft <= 0) return;
        const state = {
            grid: this.grid,
            hand: this.hand,
            score: this.score,
            mode: this.mode,
            timeLeft: this.timeLeft
        };
        localStorage.setItem(CONFIG.storageKeys.gameState, JSON.stringify(state));
    }

    loadState() {
        const s = localStorage.getItem(CONFIG.storageKeys.gameState);
        if (s) {
            try {
                const state = JSON.parse(s);
                this.grid = state.grid;
                this.hand = state.hand;
                this.score = state.score;
                this.mode = state.mode || 'classic';
                this.timeLeft = state.timeLeft || 120;
                this.scoreEl.textContent = this.score.toString();
                return true;
            } catch (e) { console.error(e); return false; }
        }
        return false;
    }

    loadHighScore() {
        const s = localStorage.getItem(CONFIG.storageKeys.highScore);
        if (s) { this.highScore = parseInt(s); this.highScoreEl.textContent = this.highScore.toString(); }
    }

    loop() {
        this.fx.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const shake = this.fx.getShake();
        this.ctx.save();
        this.ctx.translate(shake.x, shake.y);

        // Grid
        const { gridX, gridY, gridSize, cellSize } = this.metrics;
        this.ctx.strokeStyle = CONFIG.colors.gridLine;
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= 9; i++) {
            this.ctx.beginPath(); this.ctx.moveTo(gridX + i * cellSize, gridY); this.ctx.lineTo(gridX + i * cellSize, gridY + gridSize); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(gridX, gridY + i * cellSize); this.ctx.lineTo(gridX + gridSize, gridY + i * cellSize); this.ctx.stroke();
        }
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = '#3a3a4a';
        for (let i = 0; i <= 3; i++) {
            this.ctx.beginPath(); this.ctx.moveTo(gridX + i * cellSize * 3, gridY); this.ctx.lineTo(gridX + i * cellSize * 3, gridY + gridSize); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(gridX, gridY + i * cellSize * 3); this.ctx.lineTo(gridX + gridSize, gridY + i * cellSize * 3); this.ctx.stroke();
        }

        // Blocks
        for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
            const cell = this.grid[r][c];
            if (cell) {
                this.drawBlock(gridX + c * cellSize, gridY + r * cellSize, cellSize, cell.color, false, cell.ice, cell.rock);

                if (cell.bomb !== null) {
                    this.ctx.fillStyle = CONFIG.colors.bombText;
                    this.ctx.font = 'bold 20px Inter, system-ui, sans-serif';
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.fillText(cell.bomb.toString(), gridX + c * cellSize + cellSize / 2, gridY + r * cellSize + cellSize / 2);
                    this.ctx.strokeStyle = CONFIG.colors.bomb;
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(gridX + c * cellSize + 2, gridY + r * cellSize + 2, cellSize - 4, cellSize - 4);
                }
            }
        }

        // Hand
        const slotW = this.canvas.width / 3 / (window.devicePixelRatio || 1);
        for (let i = 0; i < 3; i++) {
            const item = this.hand[i];
            if (item && i !== this.dragIdx) {
                const { shape, color } = item;
                const sw = shape[0].length * (cellSize * 0.6);
                const sh = shape.length * (cellSize * 0.6);
                this.drawShape(shape, i * slotW + (slotW - sw) / 2, this.metrics.handY, cellSize * 0.6, color);
            }
        }

        // Drag
        if (this.isDragging && this.dragIdx !== -1) {
            const item = this.hand[this.dragIdx];
            if (item) {
                const { shape, color } = item;
                const dx = this.dragPos.x + this.dragOffset.x;
                const dy = this.dragPos.y + this.dragOffset.y;

                // Ghost
                const gp = this.getGridPos(dx, dy, shape);
                if (gp && this.canPlace(shape, gp.r, gp.c)) {
                    this.drawShape(shape, gridX + gp.c * cellSize, gridY + gp.r * cellSize, cellSize, CONFIG.colors.ghost);

                    // Prediction Highlight
                    const prediction = this.predictWillClear(shape, gp.r, gp.c);
                    if (prediction.willClear) {
                        this.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';

                        // Highlight Rows
                        prediction.cleared.rows.forEach(r => {
                            this.ctx.fillRect(gridX, gridY + r * cellSize, gridSize, cellSize);
                        });

                        // Highlight Cols
                        prediction.cleared.cols.forEach(c => {
                            this.ctx.fillRect(gridX + c * cellSize, gridY, cellSize, gridSize);
                        });

                        // Highlight Squares
                        prediction.cleared.sqs.forEach(sq => {
                            this.ctx.fillRect(gridX + sq.c * 3 * cellSize, gridY + sq.r * 3 * cellSize, cellSize * 3, cellSize * 3);
                        });
                    }
                }

                const sw = shape[0].length * cellSize;
                const sh = shape.length * cellSize;
                this.drawShape(shape, dx - sw / 2 + cellSize / 2, dy - sh / 2 + cellSize / 2, cellSize, color, true);
            }
        }

        this.fx.draw(this.ctx);
        this.ctx.restore();
    }

    drawShape(shape: number[][], x: number, y: number, size: number, color: string, shadow: boolean = false) {
        for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[0].length; c++) {
            if (shape[r][c]) this.drawBlock(x + c * size, y + r * size, size, color, shadow);
        }
    }

    drawBlock(x: number, y: number, size: number, color: string, shadow: boolean, ice: boolean = false, rock: boolean = false) {
        const g = 2;
        this.ctx.fillStyle = color;
        if (shadow) { this.ctx.shadowColor = color; this.ctx.shadowBlur = 15; }
        this.ctx.fillRect(x + g, y + g, size - g * 2, size - g * 2);

        if (ice) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            this.ctx.fillRect(x + g, y + g, size - g * 2, size - g * 2);
            this.ctx.strokeStyle = '#fff';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(x + g + 2, y + g + 2, size - g * 2 - 4, size - g * 2 - 4);
        }

        if (rock) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.fillRect(x + g, y + g, size - g * 2, size - g * 2);
            // Rock texture
            this.ctx.fillStyle = '#333';
            this.ctx.beginPath();
            this.ctx.arc(x + size / 2, y + size / 2, size / 4, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.ctx.shadowBlur = 0;
    }
}

let game: Game;
window.addEventListener('load', () => {
    game = new Game();
    // Expose game globally for onclick handlers
    (window as any).game = game;
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
