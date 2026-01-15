import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { TOPICS } from '../../../data/wordSearchData';
import { WordEntry, Topic, Level } from '../../../types';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager } from '../../../utils/utils';
import '@/styles/word_search.css';

interface WordSearchGameProps {
    onBack: () => void;
}

const GRID_SIZE = { rows: 10, cols: 8 };

const WordSearchGame: React.FC<WordSearchGameProps> = ({ onBack }) => {
    // Game Navigation State
    const [view, setView] = useState<'menu' | 'topics' | 'levels' | 'play'>('menu');
    const [currentTopicIdx, setCurrentTopicIdx] = useState(0);
    const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
    
    // Game Play State
    const [grid, setGrid] = useState<string[][]>([]);
    const [words, setWords] = useState<WordEntry[]>([]);
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [selection, setSelection] = useState<{ r: number, c: number }[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startCell, setStartCell] = useState<{ r: number, c: number } | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Board Generation
    const generateBoard = useCallback((level: Level) => {
        const rows = GRID_SIZE.rows;
        const cols = GRID_SIZE.cols;
        const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(''));
        const levelWords = level.words.map(w => w.w.toUpperCase());

        const canPlace = (word: string, r: number, c: number, dr: number, dc: number) => {
            for (let i = 0; i < word.length; i++) {
                const nr = r + i * dr;
                const nc = c + i * dc;
                if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) return false;
                if (newGrid[nr][nc] !== '' && newGrid[nr][nc] !== word[i]) return false;
            }
            return true;
        };

        const place = (word: string, r: number, c: number, dr: number, dc: number) => {
            for (let i = 0; i < word.length; i++) {
                newGrid[r + i * dr][c + i * dc] = word[i];
            }
        };

        const directions = [
            [0, 1], [1, 0], [1, 1], [-1, 1],
            [0, -1], [-1, 0], [-1, -1], [1, -1]
        ];

        levelWords.forEach(word => {
            let placed = false;
            let attempts = 0;
            while (!placed && attempts < 100) {
                const r = Math.floor(Math.random() * rows);
                const c = Math.floor(Math.random() * cols);
                const [dr, dc] = directions[Math.floor(Math.random() * directions.length)];
                if (canPlace(word, r, c, dr, dc)) {
                    place(word, r, c, dr, dc);
                    placed = true;
                }
                attempts++;
            }
        });

        // Fill empty
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                if (newGrid[r][c] === '') {
                    newGrid[r][c] = letters.charAt(Math.floor(Math.random() * letters.length));
                }
            }
        }

        setGrid(newGrid);
        setWords(level.words);
        setFoundWords(new Set());
        setIsFinished(false);
    }, []);

    const startLevel = (tIdx: number, lIdx: number) => {
        setCurrentTopicIdx(tIdx);
        setCurrentLevelIdx(lIdx);
        const level = TOPICS[tIdx].levels[lIdx];
        if (level) {
            generateBoard(level);
            setView('play');
        }
    };

    // Interaction Handlers
    const handleStart = (r: number, c: number) => {
        setIsDragging(true);
        setStartCell({ r, c });
        setSelection([{ r, c }]);
        HapticManager.light();
    };

    const handleMove = (r: number, c: number) => {
        if (!isDragging || !startCell) return;

        const dr = r - startCell.r;
        const dc = c - startCell.c;

        // Only allow horizontal, vertical, or diagonal
        if (dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc)) {
            const steps = Math.max(Math.abs(dr), Math.abs(dc));
            const rStep = dr === 0 ? 0 : dr / steps;
            const cStep = dc === 0 ? 0 : dc / steps;

            const newSelection = [];
            for (let i = 0; i <= steps; i++) {
                newSelection.push({ 
                    r: Math.round(startCell.r + i * rStep), 
                    c: Math.round(startCell.c + i * cStep) 
                });
            }
            setSelection(newSelection);
        }
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        const selectedWord = selection.map(cell => grid[cell.r][cell.c]).join('');
        const reversed = selectedWord.split('').reverse().join('');

        const found = words.find(w => w.w.toUpperCase() === selectedWord || w.w.toUpperCase() === reversed);
        
        if (found && !foundWords.has(found.w)) {
            const newFound = new Set(foundWords);
            newFound.add(found.w);
            setFoundWords(newFound);
            setScore(s => s + 10);
            HapticManager.success();
            TTSManager.speak(found.w, 'sv');

            if (newFound.size === words.length) {
                setIsFinished(true);
            }
        } else {
            HapticManager.light();
        }

        setSelection([]);
        setStartCell(null);
    };

    // UI Helpers
    const isCellSelected = (r: number, c: number) => selection.some(cell => cell.r === r && cell.c === c);

    if (view === 'menu') {
        return (
            <div className="game-page-body" style={{ padding: '2rem', textAlign: 'center', color: 'white' }}>
                <h1 className="title-neon-search">Neon Search</h1>
                <button className="modal-btn" onClick={() => setView('topics')} style={{ marginTop: '2rem' }}>Starta Spel</button>
                <button className="modal-btn" onClick={onBack} style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.1)' }}>Tillbaka</button>
            </div>
        );
    }

    if (view === 'topics') {
        return (
            <div className="game-page-body" style={{ padding: '1rem', color: 'white' }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => setView('menu')} className="back-btn">⬅️</button>
                    <h2 style={{ fontSize: '1.2rem' }}>Välj Ämne</h2>
                </header>
                <div className="topics-grid" style={{ display: 'grid', gap: '1rem' }}>
                    {TOPICS.map((topic, idx) => (
                        <div key={topic.id} className="topic-card" onClick={() => { setCurrentTopicIdx(idx); setView('levels'); }}>
                            <div className="topic-info">
                                <h3>{topic.title}</h3>
                                <p style={{ opacity: 0.7 }}>{topic.titleAr}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (view === 'levels') {
        const topic = TOPICS[currentTopicIdx];
        return (
            <div className="game-page-body" style={{ padding: '1rem', color: 'white' }}>
                <header style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <button onClick={() => setView('topics')} className="back-btn">⬅️</button>
                    <h2 style={{ fontSize: '1.2rem' }}>{topic.title} - Nivåer</h2>
                </header>
                <div className="levels-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem' }}>
                    {topic.levels.map((_, idx) => (
                        <button key={idx} className="level-btn" onClick={() => startLevel(currentTopicIdx, idx)}>
                            {idx + 1}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="game-page-body" onMouseUp={handleEnd} onTouchEnd={handleEnd} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <header className="header-row-3" style={{ padding: '1rem' }}>
                <button onClick={() => setView('levels')} className="back-btn">⬅️</button>
                <div className="level-badge">Nivå {currentLevelIdx + 1}</div>
                <div id="score-container">💎 {score}</div>
            </header>

            <div id="game-container" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div 
                    id="grid" 
                    style={{ 
                        display: 'grid', 
                        gridTemplateColumns: `repeat(${GRID_SIZE.cols}, 1fr)`,
                        gap: '2px',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '5px',
                        borderRadius: '12px',
                        userSelect: 'none',
                        touchAction: 'none'
                    }}
                >
                    {grid.map((row, r) => row.map((char, c) => (
                        <div 
                            key={`${r}-${c}`}
                            className={`cell ${isCellSelected(r, c) ? 'selected-pending' : ''}`}
                            onMouseDown={() => handleStart(r, c)}
                            onMouseEnter={() => handleMove(r, c)}
                            onTouchStart={(e) => {
                                const touch = e.touches[0];
                                handleStart(r, c);
                            }}
                            onTouchMove={(e) => {
                                const touch = e.touches[0];
                                const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
                                if (el && el.dataset.row) {
                                    handleMove(parseInt(el.dataset.row), parseInt(el.dataset.col!));
                                }
                            }}
                            data-row={r}
                            data-col={c}
                            style={{
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: 'white',
                                borderRadius: '4px'
                            }}
                        >
                            {char}
                        </div>
                    )))}
                </div>

                <div id="word-bank" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {words.map(w => (
                        <div 
                            key={w.w} 
                            className={`word-item ${foundWords.has(w.w) ? 'found' : ''}`}
                            onClick={() => foundWords.has(w.w) && TTSManager.speak(w.w, 'sv')}
                        >
                            {w.w}
                        </div>
                    ))}
                </div>
            </div>

            {isFinished && (
                <div className="modal-overlay active">
                    <div className="modal-content">
                        <h2 className="level-complete-title">Nivå Klar! 🎉</h2>
                        <button className="modal-btn" onClick={() => {
                            if (currentLevelIdx < TOPICS[currentTopicIdx].levels.length - 1) {
                                startLevel(currentTopicIdx, currentLevelIdx + 1);
                            } else {
                                setView('topics');
                            }
                        }}>
                            Nästa Nivå
                        </button>
                        <button className="modal-btn" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem' }} onClick={() => setView('levels')}>
                            Stäng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WordSearchGame;
