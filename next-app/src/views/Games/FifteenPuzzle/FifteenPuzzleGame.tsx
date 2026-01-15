import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { HapticManager } from '../../../utils/utils';
import '@/styles/fifteen-puzzle.css';

interface FifteenPuzzleGameProps {
    onBack: () => void;
}

const FifteenPuzzleGame: React.FC<FifteenPuzzleGameProps> = ({ onBack }) => {
    const [tiles, setTiles] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [bestMoves, setBestMoves] = useState(() => {
        const saved = localStorage.getItem('fifteen_puzzle_best');
        return saved ? parseInt(saved) : null;
    });

    const isSolvable = (shuffledTiles: number[]): boolean => {
        let inversions = 0;
        for (let i = 0; i < shuffledTiles.length; i++) {
            for (let j = i + 1; j < shuffledTiles.length; j++) {
                if (shuffledTiles[i] && shuffledTiles[j] && shuffledTiles[i] > shuffledTiles[j]) {
                    inversions++;
                }
            }
        }
        const emptyIndex = shuffledTiles.indexOf(0);
        const emptyRowFromBottom = 4 - Math.floor(emptyIndex / 4);
        if (emptyRowFromBottom % 2 === 0) {
            return inversions % 2 !== 0;
        } else {
            return inversions % 2 === 0;
        }
    };

    const shuffleTiles = useCallback(() => {
        let newTiles: number[];
        do {
            newTiles = Array.from({ length: 15 }, (_, i) => i + 1).concat([0]);
            for (let i = newTiles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
            }
        } while (!isSolvable(newTiles));
        return newTiles;
    }, []);

    const initGame = useCallback(() => {
        setTiles(shuffleTiles());
        setMoves(0);
        setSeconds(0);
        setIsPlaying(true);
        setIsWon(false);
    }, [shuffleTiles]);

    useEffect(() => {
        initGame();
    }, [initGame]);

    useEffect(() => {
        let interval: number | undefined;
        if (isPlaying && !isWon) {
            interval = window.setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, isWon]);

    const handleTileClick = (index: number) => {
        if (!isPlaying || isWon) return;

        const emptyIndex = tiles.indexOf(0);
        const row = Math.floor(index / 4);
        const col = index % 4;
        const emptyRow = Math.floor(emptyIndex / 4);
        const emptyCol = emptyIndex % 4;

        const isAdjacent =
            (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow);

        if (isAdjacent) {
            const newTiles = [...tiles];
            [newTiles[index], newTiles[emptyIndex]] = [newTiles[emptyIndex], newTiles[index]];
            setTiles(newTiles);
            setMoves(m => m + 1);
            HapticManager.light();

            if (checkWin(newTiles)) {
                handleWin();
            }
        }
    };

    const checkWin = (currentTiles: number[]): boolean => {
        for (let i = 0; i < 15; i++) {
            if (currentTiles[i] !== i + 1) return false;
        }
        return true;
    };

    const handleWin = () => {
        setIsWon(true);
        setIsPlaying(false);
        HapticManager.success();
        
        if (bestMoves === null || moves + 1 < bestMoves) {
            setBestMoves(moves + 1);
            localStorage.setItem('fifteen_puzzle_best', (moves + 1).toString());
        }

        if ((window as any).confetti) {
            (window as any).confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    };

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <button onClick={onBack} style={styles.iconBtn}>⬅️</button>
                    <h1 style={{ fontSize: '1.2rem', margin: 0 }}>15 Puzzle</h1>
                    <button onClick={initGame} style={styles.iconBtn}>🔄</button>
                </div>
                <div className="header-stats" style={{ display: 'flex', justifyContent: 'space-around', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '15px' }}>
                    <div className="stat-item">
                        <div style={styles.statLabel}>Drag</div>
                        <div style={styles.statVal}>{moves}</div>
                    </div>
                    <div className="stat-item">
                        <div style={styles.statLabel}>Tid</div>
                        <div style={styles.statVal}>{formatTime(seconds)}</div>
                    </div>
                    <div className="stat-item">
                        <div style={styles.statLabel}>Bäst</div>
                        <div style={styles.statVal}>{bestMoves || '--'}</div>
                    </div>
                </div>
            </header>

            <div className="game-board-container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '1rem' }}>
                <div className="puzzle-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '10px',
                    width: '100%',
                    maxWidth: '400px',
                    background: 'rgba(255,255,255,0.05)',
                    padding: '10px',
                    borderRadius: '15px',
                    aspectRatio: '1/1'
                }}>
                    {tiles.map((tile, index) => (
                        <div
                            key={index}
                            onClick={() => handleTileClick(index)}
                            className={`puzzle-tile ${tile === 0 ? 'empty' : ''}`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: 'bold',
                                borderRadius: '8px',
                                cursor: tile === 0 ? 'default' : 'pointer',
                                background: tile === 0 ? 'transparent' : 'linear-gradient(145deg, #1e293b, #0f172a)',
                                border: tile === 0 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                                color: 'white',
                                transition: 'all 0.2s',
                                boxShadow: tile === 0 ? 'none' : '0 4px 6px rgba(0,0,0,0.3)'
                            }}
                        >
                            {tile !== 0 && tile}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                Ordna brickorna i ordning 1 till 15
            </div>

            {isWon && (
                <div className="modal-overlay active" style={{ zIndex: 100 }}>
                    <div className="modal-content" style={{ background: '#1e293b', color: 'white', border: '1px solid #334155' }}>
                        <h2 style={{ fontSize: '3rem' }}>🎉</h2>
                        <h3>Bra jobbat!</h3>
                        <p>Du klarade pusslet på {moves} drag och {formatTime(seconds)}.</p>
                        <button className="modal-btn" onClick={initGame} style={{ background: '#3b82f6', color: 'white' }}>Spela igen</button>
                        <button className="modal-btn" onClick={onBack} style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem' }}>Meny</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
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
    statLabel: { fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase' as 'uppercase' },
    statVal: { fontSize: '1.2rem', fontWeight: 'bold' }
};

export default FifteenPuzzleGame;
