import React, { useState, useEffect, useRef } from 'react';
import { HapticManager } from '../../../utils/utils';
import '../../../../assets/css/unblock_me.css';

interface UnblockMeGameProps {
    onBack: () => void;
}

interface Block {
    id: number;
    x: number;
    y: number;
    length: number;
    orientation: 'h' | 'v';
    type: 'target' | 'normal' | 'fixed';
}

const CELL_SIZE = 55;
const GAP = 4;
const GRID_SIZE = 6;

const LEVELS = [
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
    }
];

const UnblockMeGame: React.FC<UnblockMeGameProps> = ({ onBack }) => {
    const [level, setLevel] = useState(0);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [moves, setMoves] = useState(0);
    const [isWon, setIsWon] = useState(false);
    const [dragBlock, setDragBlock] = useState<Block | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const [blockStart, setBlockStart] = useState({ x: 0, y: 0 });
    const [mode, setMode] = useState<'classic' | 'ice'>('classic');
    const [view, setView] = useState<'menu' | 'game'>('menu');

    useEffect(() => {
        if (view === 'game') initLevel(level);
    }, [level, view]);

    const initLevel = (lvl: number) => {
        const data = LEVELS[lvl % LEVELS.length];
        const newBlocks = data.blocks.map((b, i) => ({
            id: i,
            x: b.x,
            y: b.y,
            length: b.len,
            orientation: b.dir as 'h' | 'v',
            type: b.type as 'target' | 'normal' | 'fixed'
        }));
        setBlocks(newBlocks);
        setMoves(0);
        setIsWon(false);
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent, block: Block) => {
        if (block.type === 'fixed' || isWon) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        setDragBlock(block);
        setDragStart({ x: clientX, y: clientY });
        setBlockStart({ x: block.x, y: block.y });
        HapticManager.light();
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!dragBlock) return;
        
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        const dx = clientX - dragStart.x;
        const dy = clientY - dragStart.y;
        
        const moveUnits = (dragBlock.orientation === 'h' ? dx : dy) / (CELL_SIZE + GAP);
        let newX = blockStart.x;
        let newY = blockStart.y;

        if (dragBlock.orientation === 'h') newX += moveUnits;
        else newY += moveUnits;

        // Collision Check
        const limits = getLimits(dragBlock);
        if (dragBlock.orientation === 'h') {
            newX = Math.max(limits.min, Math.min(limits.max, newX));
        } else {
            newY = Math.max(limits.min, Math.min(limits.max, newY));
        }

        // Update visual state directly for smooth drag
        setBlocks(prev => prev.map(b => b.id === dragBlock.id ? { ...b, x: newX, y: newY } : b));
    };

    const handleEnd = () => {
        if (!dragBlock) return;

        let finalX = Math.round(dragBlock.x);
        let finalY = Math.round(dragBlock.y);

        if (mode === 'ice') {
            const limits = getLimits(dragBlock);
            if (dragBlock.orientation === 'h') {
                const diff = dragBlock.x - blockStart.x;
                if (diff > 0.2) finalX = limits.max;
                else if (diff < -0.2) finalX = limits.min;
                else finalX = blockStart.x;
            } else {
                const diff = dragBlock.y - blockStart.y;
                if (diff > 0.2) finalY = limits.max;
                else if (diff < -0.2) finalY = limits.min;
                else finalY = blockStart.y;
            }
        }

        if (finalX !== blockStart.x || finalY !== blockStart.y) {
            setMoves(m => m + 1);
            HapticManager.selection();
        }

        const newBlocks = blocks.map(b => b.id === dragBlock.id ? { ...b, x: finalX, y: finalY } : b);
        setBlocks(newBlocks);
        setDragBlock(null);

        // Check Win
        const target = newBlocks.find(b => b.type === 'target');
        if (target && target.x >= 4) {
            HapticManager.success();
            setIsWon(true);
        }
    };

    const getLimits = (block: Block) => {
        let min = 0;
        let max = GRID_SIZE - block.length;

        if (block.orientation === 'h') {
            for (let b of blocks) {
                if (b.id === block.id) continue;
                if (b.y <= block.y && b.y + (b.orientation === 'v' ? b.length : 1) > block.y) {
                    // Overlap in Y
                    if (b.x + (b.orientation === 'h' ? b.length : 1) <= blockStart.x) {
                        min = Math.max(min, b.x + (b.orientation === 'h' ? b.length : 1));
                    }
                    if (b.x >= blockStart.x + block.length) {
                        max = Math.min(max, b.x - block.length);
                    }
                }
            }
        } else {
            for (let b of blocks) {
                if (b.id === block.id) continue;
                if (b.x <= block.x && b.x + (b.orientation === 'h' ? b.length : 1) > block.x) {
                    if (b.y + (b.orientation === 'v' ? b.length : 1) <= blockStart.y) {
                        min = Math.max(min, b.y + (b.orientation === 'v' ? b.length : 1));
                    }
                    if (b.y >= blockStart.y + block.length) {
                        max = Math.min(max, b.y - block.length);
                    }
                }
            }
        }
        return { min, max };
    };

    if (view === 'menu') {
        return (
            <div className="game-page-body" style={{ padding: '2rem', textAlign: 'center', color: 'white', background: '#5d4037', display: 'flex', flexDirection: 'column', height: '100vh', justifyContent: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textShadow: '0 4px 10px rgba(0,0,0,0.5)' }}>Lås Upp</h1>
                <div style={{ display: 'grid', gap: '1rem', maxWidth: '300px', margin: '0 auto' }}>
                    <button 
                        onClick={() => { setMode('classic'); setView('game'); }}
                        style={{ padding: '1.5rem', borderRadius: '15px', background: '#8d6e63', border: '2px solid #a1887f', color: 'white', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}
                    >
                        🧩 Klassisk
                    </button>
                    <button 
                        onClick={() => { setMode('ice'); setView('game'); }}
                        style={{ padding: '1.5rem', borderRadius: '15px', background: '#b3e5fc', border: '2px solid #81d4fa', color: '#0277bd', fontSize: '1.2rem', cursor: 'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' }}
                    >
                        ❄️ Isblock
                    </button>
                </div>
                <button onClick={onBack} style={{ marginTop: '2rem', background: 'transparent', border: 'none', color: '#bcaaa4', cursor: 'pointer' }}>Tillbaka</button>
            </div>
        );
    }

    return (
        <div 
            className="game-page-body" 
            style={{ background: '#5d4037', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem' }}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        >
            <header style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={() => setView('menu')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '40px', height: '40px', color: 'white' }}>⬅️</button>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Nivå {level + 1}</div>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '5px 15px', borderRadius: '20px' }}>Drag: {moves}</div>
            </header>

            <div id="board" style={{ 
                width: `${GRID_SIZE * (CELL_SIZE + GAP)}px`, 
                height: `${GRID_SIZE * (CELL_SIZE + GAP)}px`, 
                background: '#8d6e63', 
                position: 'relative',
                borderRadius: '4px',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                marginBottom: '2rem'
            }}>
                <div className="exit-gate"></div>
                <div className="exit-arrow">➜</div>
                {blocks.map(block => (
                    <div
                        key={block.id}
                        className={`block ${block.type} ${block.orientation === 'h' ? 'horizontal' : 'vertical'} ${mode === 'ice' ? 'ice-theme' : ''}`}
                        style={{
                            width: block.orientation === 'h' ? `${block.length * CELL_SIZE + (block.length - 1) * GAP}px` : `${CELL_SIZE}px`,
                            height: block.orientation === 'v' ? `${block.length * CELL_SIZE + (block.length - 1) * GAP}px` : `${CELL_SIZE}px`,
                            transform: `translate(${block.x * (CELL_SIZE + GAP)}px, ${block.y * (CELL_SIZE + GAP)}px)`,
                            transition: dragBlock?.id === block.id ? 'none' : 'transform 0.2s',
                            cursor: block.type === 'fixed' ? 'default' : 'grab'
                        }}
                        onMouseDown={(e) => handleStart(e, block)}
                        onTouchStart={(e) => handleStart(e, block)}
                    />
                ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                    onClick={() => initLevel(level)} 
                    style={{ background: '#ff9800', border: 'none', padding: '10px 20px', borderRadius: '20px', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 0 #e65100' }}
                >
                    🔄 Återställ
                </button>
            </div>

            {isWon && (
                <div className="modal-overlay active">
                    <div className="modal-content">
                        <h2>Bra jobbat! 🎉</h2>
                        <p>Klarade på {moves} drag.</p>
                        <button 
                            className="modal-btn" 
                            onClick={() => setLevel(l => l + 1)}
                            style={{ background: '#2e7d32', color: 'white', border: 'none', padding: '10px 30px', borderRadius: '20px', fontSize: '1.2rem', marginTop: '1rem', cursor: 'pointer' }}
                        >
                            Nästa Nivå
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UnblockMeGame;
