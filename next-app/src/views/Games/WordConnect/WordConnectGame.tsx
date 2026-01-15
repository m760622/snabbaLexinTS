import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { WC_PREDEFINED_LEVELS, WC_DICTIONARY, getThemeForChapter } from '../../../data/wordConnectData';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast } from '../../../utils/utils';
import '@/styles/games.css';

interface WordConnectGameProps {
    onBack: () => void;
}

const WHEEL_SIZE = 280;
const RADIUS = 100;

const WordConnectGame: React.FC<WordConnectGameProps> = ({ onBack }) => {
    const [chapter, setChapter] = useState(1);
    const [stage, setStage] = useState(1);
    const [coins, setCoins] = useState(() => {
        const saved = localStorage.getItem('wcProgress');
        return saved ? JSON.parse(saved).coins : 300;
    });
    const [foundWords, setFoundWords] = useState<string[]>([]);
    const [currentInput, setCurrentInput] = useState("");
    const [visitedNodes, setVisitedNodes] = useState<number[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [isWon, setIsWon] = useState(false);
    const [view, setView] = useState<'menu' | 'play'>('play');

    const levelKey = `${chapter}-${stage}`;
    const levelData = useMemo(() => WC_PREDEFINED_LEVELS[levelKey], [levelKey]);

    useEffect(() => {
        if (!levelData) {
            // Handle end of levels
            onBack();
            return;
        }
        setFoundWords([]);
        setCurrentInput("");
        setVisitedNodes([]);
        setIsWon(false);
    }, [levelKey, levelData, onBack]);

    const saveProgress = useCallback((newCoins: number) => {
        const data = {
            chapter,
            stage,
            coins: newCoins,
            version: "2.0"
        };
        localStorage.setItem('wcProgress', JSON.stringify(data));
    }, [chapter, stage]);

    const handleNodeSelect = (index: number, char: string) => {
        if (visitedNodes.includes(index)) {
            // Check if we are going back to the previous node
            if (visitedNodes.length >= 2 && index === visitedNodes[visitedNodes.length - 2]) {
                setVisitedNodes(prev => prev.slice(0, -1));
                setCurrentInput(prev => prev.slice(0, -1));
                HapticManager.light();
            }
            return;
        }

        setVisitedNodes(prev => [...prev, index]);
        setCurrentInput(prev => prev + char);
        HapticManager.light();
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        if (currentInput.length >= 2) {
            if (levelData.words.includes(currentInput)) {
                if (!foundWords.includes(currentInput)) {
                    const newFound = [...foundWords, currentInput];
                    setFoundWords(newFound);
                    HapticManager.success();
                    TTSManager.speak(currentInput, 'sv');
                    
                    const reward = 5 + (currentInput.length * 2);
                    const nextCoins = coins + reward;
                    setCoins(nextCoins);
                    saveProgress(nextCoins);

                    if (newFound.length === levelData.words.length) {
                        setIsWon(true);
                    }
                } else {
                    showToast('Redan hittat!');
                }
            } else {
                HapticManager.error();
            }
        }

        setCurrentInput("");
        setVisitedNodes([]);
    };

    const nextLevel = () => {
        let nextStage = stage + 1;
        let nextChapter = chapter;
        if (nextStage > 10) {
            nextStage = 1;
            nextChapter++;
        }
        setStage(nextStage);
        setChapter(nextChapter);
        setIsWon(false);
    };

    const useHint = () => {
        if (coins < 10) return;
        
        const unfound = levelData.words.find(w => !foundWords.includes(w));
        if (unfound) {
            setFoundWords(prev => [...prev, unfound]);
            setCoins((c: number) => c - 10);
            HapticManager.light();
            if (foundWords.length + 1 === levelData.words.length) {
                setIsWon(true);
            }
        }
    };

    const letters = useMemo(() => {
        if (!levelData) return [];
        return levelData.letters;
    }, [levelData]);

    const nodes = useMemo(() => {
        const angleStep = (2 * Math.PI) / letters.length;
        return letters.map((char, i) => {
            const angle = i * angleStep - (Math.PI / 2);
            return {
                char,
                x: WHEEL_SIZE / 2 + RADIUS * Math.cos(angle),
                y: WHEEL_SIZE / 2 + RADIUS * Math.sin(angle),
                index: i
            };
        });
    }, [letters]);

    if (!levelData) return null;

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white', touchAction: 'none' }} onMouseUp={handleEnd} onTouchEnd={handleEnd}>
            <header style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(30, 41, 59, 0.9)' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Bokstavlänk</h2>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Nivå {chapter}-{stage}</div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#fbbf24' }}>💎 {coins}</div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div className="wc-slots-area" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
                    {levelData.words.map(word => (
                        <div key={word} style={{ display: 'flex', gap: '5px' }}>
                            {word.split('').map((char, i) => {
                                const isRevealed = foundWords.includes(word);
                                return (
                                    <div key={i} style={{
                                        width: '35px', height: '35px', background: isRevealed ? '#fbbf24' : 'rgba(255,255,255,0.1)',
                                        border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isRevealed ? '#1e293b' : 'transparent', fontWeight: 'bold', fontSize: '1.2rem'
                                    }}>
                                        {char}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <div style={{ height: '30px', fontSize: '1.5rem', fontWeight: 'bold', color: '#60a5fa' }}>
                    {currentInput}
                </div>

                <div className="wc-wheel-container" style={{ position: 'relative', width: WHEEL_SIZE, height: WHEEL_SIZE }}>
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <g>
                            {visitedNodes.map((nodeIdx, i) => {
                                if (i === 0) return null;
                                const prev = nodes[visitedNodes[i-1]];
                                const curr = nodes[nodeIdx];
                                return (
                                    <line key={i} x1={prev.x} y1={prev.y} x2={curr.x} y2={curr.y} stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                                );
                            })}
                        </g>
                    </svg>

                    <div onClick={useHint} style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '60px', height: '60px', background: 'rgba(251, 191, 36, 0.2)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        border: '2px solid #fbbf24', zIndex: 10
                    }}>
                        💡
                    </div>

                    {nodes.map(node => (
                        <div
                            key={node.index}
                            onMouseDown={() => { setIsDragging(true); handleNodeSelect(node.index, node.char); }}
                            onTouchStart={() => { setIsDragging(true); handleNodeSelect(node.index, node.char); }}
                            onMouseEnter={() => isDragging && handleNodeSelect(node.index, node.char)}
                            onTouchMove={(e) => {
                                if (!isDragging) return;
                                const touch = e.touches[0];
                                const el = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
                                if (el && el.dataset.index) {
                                    handleNodeSelect(parseInt(el.dataset.index), el.dataset.char!);
                                }
                            }}
                            data-index={node.index}
                            data-char={node.char}
                            style={{
                                position: 'absolute', left: node.x - 25, top: node.y - 25,
                                width: '50px', height: '50px', borderRadius: '50%',
                                background: visitedNodes.includes(node.index) ? '#60a5fa' : 'white',
                                color: visitedNodes.includes(node.index) ? 'white' : '#1e293b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer',
                                transition: 'all 0.2s', zIndex: 20
                            }}
                        >
                            {node.char}
                        </div>
                    ))}
                </div>
            </main>

            {isWon && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '3rem' }}>🎉</h2>
                        <h3>Bra jobbat!</h3>
                        <p>Du hittade alla orden.</p>
                        <button className="modal-btn" onClick={nextLevel}>Nästa Nivå</button>
                        <button className="modal-btn" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem' }} onClick={onBack}>Stäng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WordConnectGame;
