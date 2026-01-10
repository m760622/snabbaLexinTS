import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast } from '../../../utils/utils';
import '../../../../assets/css/games.css';

interface ListeningGameProps {
    onBack: () => void;
}

const TOTAL_QUESTIONS = 10;

const ListeningGame: React.FC<ListeningGameProps> = ({ onBack }) => {
    const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
    const [words, setWords] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userInput, setUserInput] = useState("");
    const [score, setScore] = useState(0);
    const [attempts, setAttempts] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showHint, setShowHint] = useState(false);

    const startGame = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        let minLen = 2, maxLen = 20;
        if (difficulty === 'easy') { minLen = 2; maxLen = 5; }
        else if (difficulty === 'medium') { minLen = 4; maxLen = 8; }
        else { minLen = 6; maxLen = 15; }

        const suitable = allWords.filter(w => 
            w.swedish && 
            w.swedish.length >= minLen && 
            w.swedish.length <= maxLen && 
            /^[a-zA-ZåäöÅÄÖ ]+$/.test(w.swedish)
        );

        const selected = suitable.sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS);
        setWords(selected);
        setCurrentIndex(0);
        setUserInput("");
        setScore(0);
        setAttempts(0);
        setIsFinished(false);
        setLoading(false);
        setIsProcessing(false);
        setShowHint(false);

        // Auto-play first word
        if (selected.length > 0) {
            setTimeout(() => TTSManager.speak(selected[0].swedish, 'sv'), 1000);
        }
    }, [difficulty]);

    useEffect(() => {
        startGame();
    }, [startGame]);

    const handlePlay = () => {
        if (words[currentIndex]) {
            TTSManager.speak(words[currentIndex].swedish, 'sv');
            HapticManager.light();
        }
    };

    const handleCheck = () => {
        if (isProcessing || isFinished || !words[currentIndex]) return;

        const correct = words[currentIndex].swedish.toLowerCase().trim();
        const input = userInput.toLowerCase().trim();

        if (input === correct) {
            handleCorrect();
        } else {
            handleWrong(correct);
        }
    };

    const handleCorrect = () => {
        setScore(s => s + 1);
        setIsProcessing(true);
        HapticManager.success();
        
        setTimeout(() => {
            if (currentIndex < words.length - 1) {
                const nextIdx = currentIndex + 1;
                setCurrentIndex(nextIdx);
                setUserInput("");
                setAttempts(0);
                setShowHint(false);
                setIsProcessing(false);
                setTimeout(() => TTSManager.speak(words[nextIdx].swedish, 'sv'), 500);
            } else {
                setIsFinished(true);
            }
        }, 1000);
    };

    const handleWrong = (correct: string) => {
        const nextAttempts = attempts + 1;
        setAttempts(nextAttempts);
        HapticManager.error();

        if (nextAttempts >= 2) {
            setShowHint(true);
        }

        if (nextAttempts >= 3) {
            setUserInput(correct);
            setIsProcessing(true);
            setTimeout(() => {
                if (currentIndex < words.length - 1) {
                    const nextIdx = currentIndex + 1;
                    setCurrentIndex(nextIdx);
                    setUserInput("");
                    setAttempts(0);
                    setShowHint(false);
                    setIsProcessing(false);
                    setTimeout(() => TTSManager.speak(words[nextIdx].swedish, 'sv'), 500);
                } else {
                    setIsFinished(true);
                }
            }, 2000);
        }
    };

    if (loading) return <div className="game-container">Laddar...</div>;

    const progress = Math.round((currentIndex / TOTAL_QUESTIONS) * 100);

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Lyssna</h2>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Fråga {currentIndex + 1} / {TOTAL_QUESTIONS}</div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>✅ {score}</div>
            </header>

            <div className="progress-container" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ height: '100%', background: '#3b82f6', width: `${progress}%`, transition: 'width 0.3s' }} />
            </div>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div className="difficulty-btns" style={{ display: 'flex', gap: '10px' }}>
                    {(['easy', 'medium', 'hard'] as const).map(d => (
                        <button 
                            key={d} 
                            onClick={() => setDifficulty(d)} 
                            className={`diff-btn ${difficulty === d ? 'active' : ''}`}
                            style={{ padding: '8px 20px', borderRadius: '20px', border: difficulty === d ? '2px solid #3b82f6' : '1px solid #333', background: difficulty === d ? 'rgba(59, 130, 246, 0.2)' : 'transparent', color: 'white', cursor: 'pointer' }}
                        >
                            {d === 'easy' ? 'Lätt' : (d === 'medium' ? 'Medel' : 'Svår')}
                        </button>
                    ))}
                </div>

                <button 
                    onClick={handlePlay} 
                    className="speaker-btn" 
                    style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#3b82f6', border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer', boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)' }}
                >
                    🔊
                </button>
                <div style={{ color: '#64748b' }}>Tryck för att lyssna</div>

                {showHint && words[currentIndex] && (
                    <div style={{ padding: '10px 20px', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid #fbbf24', borderRadius: '10px', color: '#fbbf24', fontSize: '1.2rem', fontFamily: 'Tajawal' }}>
                        💡 {words[currentIndex].arabic}
                    </div>
                )}

                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <input 
                        type="text" 
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                        placeholder="Skriv vad du hör..."
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', color: 'white', fontSize: '1.2rem', textAlign: 'center' }}
                        autoFocus
                        disabled={isProcessing}
                    />
                    <button 
                        onClick={handleCheck}
                        disabled={!userInput || isProcessing}
                        style={{ width: '100%', marginTop: '1rem', padding: '1rem', borderRadius: '12px', background: '#3b82f6', border: 'none', color: 'white', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer', opacity: (!userInput || isProcessing) ? 0.5 : 1 }}
                    >
                        Kontrollera
                    </button>
                </div>
            </main>

            {isFinished && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '3rem' }}>{score >= 8 ? '🏆' : '📚'}</h2>
                        <h3>Test slutfört!</h3>
                        <div style={{ fontSize: '2rem', color: '#fbbf24', margin: '1rem 0' }}>{score} / {TOTAL_QUESTIONS}</div>
                        <button className="modal-btn" onClick={startGame}>Spela igen</button>
                        <button className="modal-btn" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem' }} onClick={onBack}>Stäng</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListeningGame;
