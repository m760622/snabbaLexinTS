import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast, generateEducationalSentence } from '../../../utils/utils';
import { SmartWordSelector } from '../../../services/smart-selector.service';
import '@/styles/games.css';

interface WordWheelGameProps {
    onBack: () => void;
}

const WHEEL_SIZE = 280;
const RADIUS = 100;

const WordWheelGame: React.FC<WordWheelGameProps> = ({ onBack }) => {
    const [difficulty, setDifficulty] = useState(5);
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [shuffledLetters, setShuffledLetters] = useState<string[]>([]);
    const [userInput, setUserInput] = useState("");
    const [usedIndices, setUsedIndices] = useState<number[]>([]);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const loadQuestion = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        const pool = allWords.filter(w => 
            w.swedish && w.arabic && 
            w.swedish.length === difficulty &&
            /^[a-zA-ZåäöÅÄÖ]+$/.test(w.swedish) &&
            !w.swedish.includes(' ') &&
            !w.swedish.includes('-')
        );

        const selected = SmartWordSelector.select(pool.map(w => w.raw), 1)[0];
        const wordObj: Word = {
            id: selected[0],
            type: selected[1],
            swedish: selected[2].toUpperCase(),
            arabic: selected[3],
            example_swe: selected[7],
            example_arb: selected[8],
            definition: selected[5],
            raw: selected
        };

        setCurrentWord(wordObj);
        setShuffledLetters(wordObj.swedish.split('').sort(() => Math.random() - 0.5));
        setUserInput("");
        setUsedIndices([]);
        setIsAnswered(false);
        setFeedback(null);
        setLoading(false);
        
        SmartWordSelector.markAsSeen(wordObj.swedish.toLowerCase());
    }, [difficulty]);

    useEffect(() => {
        loadQuestion();
    }, [loadQuestion]);

    const handleLetterClick = (index: number, char: string) => {
        if (isAnswered || usedIndices.includes(index)) return;
        HapticManager.light();
        setUserInput(prev => prev + char);
        setUsedIndices(prev => [...prev, index]);
    };

    const handleUndo = () => {
        if (isAnswered || usedIndices.length === 0) return;
        HapticManager.light();
        setUserInput(prev => prev.slice(0, -1));
        setUsedIndices(prev => prev.slice(0, -1));
    };

    const handleCheck = () => {
        if (!currentWord || isAnswered) return;

        if (userInput === currentWord.swedish) {
            setFeedback({ type: 'success', text: '✅ Helt rätt! / صحيح تماماً!' });
            setScore(s => s + 10);
            setIsAnswered(true);
            HapticManager.success();
            TTSManager.speak(currentWord.swedish, 'sv');
        } else {
            setFeedback({ type: 'error', text: '❌ Inte riktigt... Försök igen!' });
            HapticManager.error();
            // Optional: reset input
            setUserInput("");
            setUsedIndices([]);
        }
    };

    const handleShowAnswer = () => {
        if (!currentWord) return;
        setUserInput(currentWord.swedish);
        setUsedIndices(Array.from({ length: difficulty }, (_, i) => i));
        setFeedback({ type: 'info', text: 'Här är rätt svar!' });
        setIsAnswered(true);
        TTSManager.speak(currentWord.swedish, 'sv');
    };

    const nodes = useMemo(() => {
        const angleStep = (2 * Math.PI) / shuffledLetters.length;
        return shuffledLetters.map((char, i) => {
            const angle = i * angleStep - (Math.PI / 2);
            return {
                char,
                x: WHEEL_SIZE / 2 + RADIUS * Math.cos(angle),
                y: WHEEL_SIZE / 2 + RADIUS * Math.sin(angle),
                index: i
            };
        });
    }, [shuffledLetters]);

    if (loading || !currentWord) return <div className="game-container">Laddar...</div>;

    const sentenceData = generateEducationalSentence(
        currentWord.swedish, 
        currentWord.arabic, 
        currentWord.example_swe, 
        currentWord.example_arb, 
        currentWord.definition, 
        currentWord.type
    );

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Ord Hjulet</h2>
                    <select 
                        value={difficulty} 
                        onChange={(e) => setDifficulty(parseInt(e.target.value))}
                        style={{ background: 'transparent', border: 'none', color: '#94a3b8', fontSize: '0.8rem' }}
                    >
                        {[3, 4, 5, 6, 7, 8].map(n => (
                            <option key={n} value={n}>{n} Bokstäver</option>
                        ))}
                    </select>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>⭐ {score}</div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '1.5rem', alignItems: 'center', justifyContent: 'center' }}>
                <div className="wheel-answer-box" style={{ 
                    height: '60px', minWidth: '200px', background: 'rgba(255,255,255,0.05)', 
                    borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
                    fontSize: '2rem', fontWeight: 'bold', letterSpacing: '2px'
                }}>
                    {userInput || <span style={{ opacity: 0.2 }}>? ? ?</span>}
                </div>

                <div className="wheel-hint" style={{ fontSize: '1.5rem', color: '#fbbf24', fontFamily: 'Tajawal', textAlign: 'center' }}>
                    {currentWord.arabic}
                </div>

                <div className="wheel-container" style={{ position: 'relative', width: WHEEL_SIZE, height: WHEEL_SIZE }}>
                    <div style={{ 
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        width: '80px', height: '80px', background: 'rgba(56, 189, 248, 0.2)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #38bdf8',
                        zIndex: 10
                    }}>
                        <button 
                            onClick={handleCheck}
                            disabled={userInput.length !== difficulty || isAnswered}
                            style={{ background: 'none', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer', opacity: userInput.length === difficulty ? 1 : 0.3 }}
                        >
                            ✓
                        </button>
                    </div>

                    {nodes.map(node => (
                        <button
                            key={node.index}
                            onClick={() => handleLetterClick(node.index, node.char)}
                            disabled={usedIndices.includes(node.index) || isAnswered}
                            style={{
                                position: 'absolute', left: node.x - 25, top: node.y - 25,
                                width: '50px', height: '50px', borderRadius: '50%',
                                background: usedIndices.includes(node.index) ? '#38bdf8' : 'white',
                                color: usedIndices.includes(node.index) ? 'white' : '#0f172a',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer',
                                transition: 'all 0.2s', zIndex: 20, border: 'none',
                                opacity: usedIndices.includes(node.index) ? 0.5 : 1
                            }}
                        >
                            {node.char}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div style={{ textAlign: 'center', color: feedback.type === 'success' ? '#22c55e' : (feedback.type === 'error' ? '#ef4444' : '#38bdf8'), fontWeight: 'bold' }}>
                        {feedback.text}
                    </div>
                )}

                {isAnswered && (
                    <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '500px' }}>
                        <div style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{sentenceData.s}</div>
                        <div dir="rtl" style={{ color: '#aaa', fontSize: '1rem', fontFamily: 'Tajawal' }}>{sentenceData.a}</div>
                    </div>
                )}

                <div className="game-controls-row" style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px', marginTop: 'auto' }}>
                    {!isAnswered ? (
                        <>
                            <button onClick={handleUndo} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 'bold' }}>Ångra</button>
                            <button onClick={handleShowAnswer} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 'bold' }}>Visa svar</button>
                        </>
                    ) : (
                        <button onClick={loadQuestion} style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: '#22c55e', border: 'none', color: 'white', fontWeight: 'bold' }}>Nästa ➜</button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default WordWheelGame;
