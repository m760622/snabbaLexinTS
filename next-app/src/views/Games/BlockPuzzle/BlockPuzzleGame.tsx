import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HapticManager } from '../../../utils/utils';
import '@/styles/block_puzzle.css';

interface BlockPuzzleGameProps {
    onBack: () => void;
}

// Config
const GRID_SIZE = 9;
const COLORS = {
    bg: '#1a1a24',
    gridLine: '#2a2a35',
    block: '#00f3ff',
    palette: ['#00f3ff', '#3b82f6', '#ef4444', '#ffe600'],
    bomb: '#ff0000',
    bombText: '#ffffff',
    ice: '#aaddff',
    rock: '#555566',
    ghost: 'rgba(255, 255, 255, 0.2)',
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
    id: number;
}

const BlockPuzzleGame: React.FC<BlockPuzzleGameProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<'classic' | 'bomb' | 'time' | 'color' | 'menu'>('menu');
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(parseInt(localStorage.getItem('neonBlocks_highScore') || '0'));
    const [timeLeft, setTimeLeft] = useState(120);
    const [grid, setGrid] = useState<(GridCell | null)[][]>(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
    const [hand, setHand] = useState<(HandItem | null)[]>([null, null, null]);
    const [gameOver, setGameOver] = useState(false);
    const [dragItem, setDragItem] = useState<{ index: number, startX: number, startY: number } | null>(null);
    const [dragPos, setDragPos] = useState({ x: 0, y: 0 });

    const requestRef = useRef<number | null>(null);
    const stateRef = useRef({ grid, hand, mode, score, timeLeft }); // Ref to access latest state in loop

    // Sync state ref
    useEffect(() => {
        stateRef.current = { grid, hand, mode, score, timeLeft };
    }, [grid, hand, mode, score, timeLeft]);

    // Timer Logic
    useEffect(() => {
        if (mode === 'time' && !gameOver) {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameOver(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [mode, gameOver]);

    // Spawn Shapes
    const spawnShapes = useCallback(() => {
        const newHand = [...hand];
        let needed = 0;
        for (let i = 0; i < 3; i++) {
            if (!newHand[i]) {
                const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
                let color = COLORS.block;
                if (mode === 'color') color = COLORS.palette[Math.floor(Math.random() * COLORS.palette.length)];
                newHand[i] = { shape, color, id: Math.random() };
                needed++;
            }
        }
        if (needed > 0) setHand(newHand);
    }, [hand, mode]);

    // Initial Spawn
    useEffect(() => {
        if (mode !== 'menu' && !hand[0] && !hand[1] && !hand[2]) {
            spawnShapes();
        }
    }, [mode, spawnShapes, hand]);

    // Canvas Rendering Loop
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { width, height } = canvas;
        ctx.clearRect(0, 0, width, height);

        // Calculate Metrics
        const padding = 20;
        const availW = width - padding * 2;
        const cellSize = Math.floor(availW / GRID_SIZE);
        const gridSizePx = cellSize * GRID_SIZE;
        const gridX = (width - gridSizePx) / 2;
        const gridY = padding + (mode === 'time' ? 40 : 0);
        const handY = gridY + gridSizePx + 40;

        // Draw Grid Lines
        ctx.strokeStyle = COLORS.gridLine;
        ctx.lineWidth = 1;
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(gridX + i * cellSize, gridY);
            ctx.lineTo(gridX + i * cellSize, gridY + gridSizePx);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(gridX, gridY + i * cellSize);
            ctx.lineTo(gridX + gridSizePx, gridY + i * cellSize);
            ctx.stroke();
        }

        // Draw Bold 3x3 Grid Lines
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#3a3a4a';
        for (let i = 0; i <= 3; i++) {
            ctx.beginPath();
            ctx.moveTo(gridX + i * cellSize * 3, gridY);
            ctx.lineTo(gridX + i * cellSize * 3, gridY + gridSizePx);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(gridX, gridY + i * cellSize * 3);
            ctx.lineTo(gridX + gridSizePx, gridY + i * cellSize * 3);
            ctx.stroke();
        }

        // Draw Blocks on Grid
        stateRef.current.grid.forEach((row, r) => {
            row.forEach((cell, c) => {
                if (cell) {
                    drawBlock(ctx, gridX + c * cellSize, gridY + r * cellSize, cellSize, cell.color, cell.ice, cell.rock, cell.bomb);
                }
            });
        });

        // Draw Hand
        const slotW = width / 3;
        stateRef.current.hand.forEach((item, i) => {
            if (item && (dragItem?.index !== i)) {
                const { shape, color } = item;
                const sw = shape[0].length * (cellSize * 0.6);
                drawShape(ctx, shape, i * slotW + (slotW - sw) / 2, handY, cellSize * 0.6, color);
            }
        });

        // Draw Dragging Item
        if (dragItem) {
            const item = stateRef.current.hand[dragItem.index];
            if (item) {
                const { shape, color } = item;
                const dx = dragPos.x;
                const dy = dragPos.y - 50; // Offset for visibility

                // Draw Ghost
                const gp = getGridPos(dx, dy, shape, gridX, gridY, cellSize);
                if (gp && canPlace(shape, gp.r, gp.c, stateRef.current.grid)) {
                    drawShape(ctx, shape, gridX + gp.c * cellSize, gridY + gp.r * cellSize, cellSize, COLORS.ghost);
                }

                // Draw Actual Shape
                const sw = shape[0].length * cellSize;
                const sh = shape.length * cellSize;
                drawShape(ctx, shape, dx - sw / 2 + cellSize / 2, dy - sh / 2 + cellSize / 2, cellSize, color, true);
            }
        }

    }, [dragItem, dragPos, mode]); // Dependencies for draw function creation

    // Animation Loop
    useEffect(() => {
        const animate = () => {
            draw();
            requestRef.current = requestAnimationFrame(animate);
        };
        requestRef.current = requestAnimationFrame(animate);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [draw]);

    // Helpers
    const drawBlock = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, ice: boolean, rock: boolean, bomb: number | null) => {
        const g = 2;
        ctx.fillStyle = color;
        ctx.fillRect(x + g, y + g, size - g * 2, size - g * 2);

        if (ice) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
            ctx.fillRect(x + g, y + g, size - g * 2, size - g * 2);
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + g + 2, y + g + 2, size - g * 2 - 4, size - g * 2 - 4);
        }

        if (rock) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.fillRect(x + g, y + g, size - g * 2, size - g * 2);
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(x + size / 2, y + size / 2, size / 4, 0, Math.PI * 2);
            ctx.fill();
        }

        if (bomb !== null) {
            ctx.fillStyle = COLORS.bombText;
            ctx.font = 'bold 20px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(bomb.toString(), x + size / 2, y + size / 2);
            ctx.strokeStyle = COLORS.bomb;
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 2, y + 2, size - 4, size - 4);
        }
    };

    const drawShape = (ctx: CanvasRenderingContext2D, shape: number[][], x: number, y: number, size: number, color: string, shadow = false) => {
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[0].length; c++) {
                if (shape[r][c]) {
                    if (shadow) {
                        ctx.shadowColor = color;
                        ctx.shadowBlur = 15;
                    }
                    drawBlock(ctx, x + c * size, y + r * size, size, color, false, false, null);
                    ctx.shadowBlur = 0;
                }
            }
        }
    };

    const getGridPos = (x: number, y: number, shape: number[][], gridX: number, gridY: number, cellSize: number) => {
        const sw = shape[0].length * cellSize;
        const sh = shape.length * cellSize;
        const rx = x - gridX - sw / 2 + cellSize / 2;
        const ry = y - gridY - sh / 2 + cellSize / 2;
        return { r: Math.round(ry / cellSize), c: Math.round(rx / cellSize) };
    };

    const canPlace = (shape: number[][], r: number, c: number, grid: (GridCell | null)[][]) => {
        for (let i = 0; i < shape.length; i++) {
            for (let j = 0; j < shape[0].length; j++) {
                if (shape[i][j]) {
                    if (r + i < 0 || r + i >= GRID_SIZE || c + j < 0 || c + j >= GRID_SIZE || grid[r + i][c + j]) return false;
                }
            }
        }
        return true;
    };

    // Interaction Handlers
    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (gameOver || mode === 'menu') return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        // Check if hand item clicked
        const slotW = canvas.width / 3;
        const padding = 20;
        const availW = canvas.width - padding * 2;
        const cellSize = Math.floor(availW / GRID_SIZE);
        const gridSizePx = cellSize * GRID_SIZE;
        const gridY = padding + (mode === 'time' ? 40 : 0);
        const handY = gridY + gridSizePx + 40;

        if (y > handY) {
            const idx = Math.floor(x / slotW);
            if (idx >= 0 && idx < 3 && hand[idx]) {
                setDragItem({ index: idx, startX: x, startY: y });
                setDragPos({ x, y });
                HapticManager.light();
            }
        }
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!dragItem) return;
        if ('preventDefault' in e) e.preventDefault(); // Prevent scrolling on touch

        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        setDragPos({ x, y });
    };

    const handleTouchEnd = () => {
        if (!dragItem) return;

        const item = hand[dragItem.index];
        if (item) {
            const canvas = canvasRef.current;
            if (canvas) {
                const { width } = canvas;
                const padding = 20;
                const availW = width - padding * 2;
                const cellSize = Math.floor(availW / GRID_SIZE);
                const gridSizePx = cellSize * GRID_SIZE;
                const gridX = (width - gridSizePx) / 2;
                const gridY = padding + (mode === 'time' ? 40 : 0);

                const gp = getGridPos(dragPos.x, dragPos.y - 50, item.shape, gridX, gridY, cellSize);

                if (gp && canPlace(item.shape, gp.r, gp.c, grid)) {
                    placeShape(item, gp.r, gp.c);
                    const newHand = [...hand];
                    newHand[dragItem.index] = null;
                    setHand(newHand);
                    HapticManager.success();
                    
                    // Check if hand empty
                    if (newHand.every(h => h === null)) {
                        setTimeout(spawnShapes, 200); // Delay for effect
                    }
                } else {
                    HapticManager.error();
                }
            }
        }

        setDragItem(null);
    };

    const placeShape = (item: HandItem, r: number, c: number) => {
        const newGrid = grid.map(row => [...row]);
        let placedCount = 0;

        for (let i = 0; i < item.shape.length; i++) {
            for (let j = 0; j < item.shape[0].length; j++) {
                if (item.shape[i][j]) {
                    newGrid[r + i][c + j] = { color: item.color, bomb: null, ice: false, rock: false };
                    placedCount++;
                }
            }
        }

        setGrid(newGrid);
        setScore(s => s + placedCount * 10);
        
        // Check clear immediately after state update would require useEffect or ref logic
        // Simulating immediate check here using the local newGrid
        checkClear(newGrid);
    };

    const checkClear = (currentGrid: (GridCell | null)[][]) => {
        let rowsToClear: number[] = [];
        let colsToClear: number[] = [];
        let sqsToClear: { r: number, c: number }[] = [];

        // Rows
        for (let r = 0; r < GRID_SIZE; r++) {
            if (currentGrid[r].every(c => c !== null)) rowsToClear.push(r);
        }
        // Cols
        for (let c = 0; c < GRID_SIZE; c++) {
            let full = true;
            for (let r = 0; r < GRID_SIZE; r++) if (!currentGrid[r][c]) full = false;
            if (full) colsToClear.push(c);
        }
        // Squares
        for (let sr = 0; sr < 3; sr++) for (let sc = 0; sc < 3; sc++) {
            let full = true;
            for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) if (!currentGrid[sr * 3 + r][sc * 3 + c]) full = false;
            if (full) sqsToClear.push({ r: sr, c: sc });
        }

        const totalCleared = rowsToClear.length + colsToClear.length + sqsToClear.length;

        if (totalCleared > 0) {
            HapticManager.success();
            const nextGrid = currentGrid.map(row => [...row]);
            const cellsToClear = new Set<string>();

            const add = (r: number, c: number) => cellsToClear.add(`${r},${c}`);

            rowsToClear.forEach(r => { for (let c = 0; c < 9; c++) add(r, c); });
            colsToClear.forEach(c => { for (let r = 0; r < 9; r++) add(r, c); });
            sqsToClear.forEach(sq => { for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) add(sq.r * 3 + r, sq.c * 3 + c); });

            cellsToClear.forEach(key => {
                const [r, c] = key.split(',').map(Number);
                nextGrid[r][c] = null;
            });

            setGrid(nextGrid);
            const points = totalCleared * 100 * (totalCleared > 1 ? totalCleared : 1);
            setScore(s => {
                const newScore = s + points;
                if (newScore > highScore) {
                    setHighScore(newScore);
                    localStorage.setItem('neonBlocks_highScore', newScore.toString());
                }
                return newScore;
            });
            if (mode === 'time') setTimeLeft(t => t + totalCleared * 5);
        } else {
            // Check Game Over
            if (checkGameOver(currentGrid, hand.filter((h, i) => h && i !== dragItem?.index) as HandItem[])) {
                setGameOver(true);
            }
        }
    };

    const checkGameOver = (grid: (GridCell | null)[][], currentHand: HandItem[]) => {
        if (currentHand.length === 0) return false; // Waiting for spawn
        for (const item of currentHand) {
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (canPlace(item.shape, r, c, grid)) return false;
                }
            }
        }
        return true;
    };

    const restartGame = () => {
        setGrid(Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null)));
        setHand([null, null, null]);
        setScore(0);
        setTimeLeft(120);
        setGameOver(false);
        spawnShapes(); // Will trigger effect
    };

    const handleRotate = () => {
        HapticManager.light();
        const newHand = hand.map(item => {
            if (!item) return null;
            const N = item.shape.length;
            const M = item.shape[0].length;
            const newShape = Array(M).fill(null).map(() => Array(N).fill(0));
            for (let r = 0; r < N; r++) {
                for (let c = 0; c < M; c++) {
                    newShape[c][N - 1 - r] = item.shape[r][c];
                }
            }
            return { ...item, shape: newShape };
        });
        setHand(newHand);
    };

    // Resize Handling
    useEffect(() => {
        const resize = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const parent = canvas.parentElement;
                if (parent) {
                    canvas.width = parent.clientWidth;
                    canvas.height = parent.clientHeight;
                }
            }
        };
        window.addEventListener('resize', resize);
        resize();
        return () => window.removeEventListener('resize', resize);
    }, []);

    if (mode === 'menu') {
        return (
            <div className="game-page-body" style={{ padding: '2rem', textAlign: 'center', color: 'white', background: '#1a1a24' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: '#00f3ff', textShadow: '0 0 20px rgba(0, 243, 255, 0.5)' }}>Neon Blocks</h1>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                    <button className="mode-card" onClick={() => setMode('classic')} style={styles.modeCard}>
                        <div style={{ fontSize: '2rem' }}>🧩</div>
                        <div>Klassisk</div>
                    </button>
                    <button className="mode-card" onClick={() => setMode('bomb')} style={styles.modeCard}>
                        <div style={{ fontSize: '2rem' }}>💣</div>
                        <div>Bomb</div>
                    </button>
                    <button className="mode-card" onClick={() => setMode('time')} style={styles.modeCard}>
                        <div style={{ fontSize: '2rem' }}>⏱️</div>
                        <div>Tidsjakt</div>
                    </button>
                    <button className="mode-card" onClick={() => setMode('color')} style={styles.modeCard}>
                        <div style={{ fontSize: '2rem' }}>🎨</div>
                        <div>Färgmatch</div>
                    </button>
                </div>
                <button onClick={onBack} style={{ marginTop: '2rem', background: 'transparent', border: '1px solid #666', color: '#888', padding: '10px 30px', borderRadius: '20px', cursor: 'pointer' }}>Tillbaka</button>
            </div>
        );
    }

    return (
        <div className="game-page-body" style={{ background: '#1a1a24', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#2a2a35' }}>
                <button onClick={() => setMode('menu')} style={styles.iconBtn}>⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#888' }}>BEST: {highScore}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00f3ff' }}>{score}</div>
                </div>
                <button onClick={handleRotate} style={styles.iconBtn}>↻</button>
            </header>

            {mode === 'time' && (
                <div style={{ textAlign: 'center', padding: '0.5rem', background: '#2a2a35', color: timeLeft < 10 ? '#ef4444' : '#fff' }}>
                    ⏱️ {timeLeft}s
                </div>
            )}

            <div id="game-container" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                <canvas 
                    ref={canvasRef} 
                    style={{ width: '100%', height: '100%', touchAction: 'none' }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleTouchStart}
                    onMouseMove={handleTouchMove}
                    onMouseUp={handleTouchEnd}
                />
            </div>

            {gameOver && (
                <div className="modal-overlay active" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10 }}>
                    <div className="modal-content" style={{ background: '#2a2a35', padding: '2rem', borderRadius: '20px', textAlign: 'center', border: '1px solid #444' }}>
                        <h2 style={{ color: '#ef4444', fontSize: '2rem' }}>Game Over</h2>
                        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>Score: {score}</p>
                        {score >= highScore && <p style={{ color: '#ffe600' }}>New High Score! 🏆</p>}
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                            <button onClick={() => setMode('menu')} style={styles.actionBtn}>Menu</button>
                            <button onClick={restartGame} style={{ ...styles.actionBtn, background: '#00f3ff', color: '#000' }}>Replay</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    modeCard: {
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        padding: '1.5rem',
        cursor: 'pointer',
        color: 'white',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center',
        gap: '0.5rem',
        transition: 'transform 0.2s',
    },
    iconBtn: {
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    actionBtn: {
        padding: '0.8rem 2rem',
        borderRadius: '12px',
        background: 'rgba(255,255,255,0.1)',
        border: 'none',
        color: 'white',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};

export default BlockPuzzleGame;
