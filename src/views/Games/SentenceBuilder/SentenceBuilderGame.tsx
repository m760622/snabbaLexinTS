import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast } from '../../../utils/utils';
import { SmartWordSelector } from '../../../services/smart-selector.service';
import '../../../../assets/css/games.css';

interface SentenceBuilderGameProps {
    onBack: () => void;
}

const SentenceBuilderGame: React.FC<SentenceBuilderGameProps> = ({ onBack }) => {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [targetSentence, setTargetSentence] = useState<string[]>([]);
    const [currentSentence, setCurrentSentence] = useState<string[]>([]);
    const [wordBank, setWordBank] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
    const [loading, setLoading] = useState(true);

    const loadQuestion = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        // Find words with example sentences between 3 and 8 words
        const pool = allWords.filter(w => 
            w.example_swe && 
            w.example_swe.split(' ').length >= 3 && 
            w.example_swe.split(' ').length <= 8
        );

        const selected = SmartWordSelector.select(pool.map(w => w.raw), 1)[0];
        const wordObj: Word = {
            id: selected[0],
            type: selected[1],
            swedish: selected[2],
            arabic: selected[3],
            example_swe: selected[7],
            example_arb: selected[8],
            raw: selected
        };

        setCurrentWord(wordObj);
        
        const target = wordObj.example_swe!.split(' ').filter(w => w.length > 0);
        setTargetSentence(target);
        setWordBank([...target].sort(() => Math.random() - 0.5));
        setCurrentSentence([]);
        setIsAnswered(false);
        setFeedback(null);
        setLoading(false);
        
        SmartWordSelector.markAsSeen(wordObj.swedish.toLowerCase());
    }, []);

    useEffect(() => {
        loadQuestion();
    }, [loadQuestion]);

    const handleWordClick = (word: string, fromBank: boolean) => {
        if (isAnswered) return;
        HapticManager.light();

        if (fromBank) {
            setCurrentSentence(prev => [...prev, word]);
            // Remove only one instance of the word from bank
            setWordBank(prev => {
                const idx = prev.indexOf(word);
                if (idx > -1) {
                    const next = [...prev];
                    next.splice(idx, 1);
                    return next;
                }
                return prev;
            });
        } else {
            setWordBank(prev => [...prev, word]);
            setCurrentSentence(prev => {
                const idx = prev.indexOf(word);
                if (idx > -1) {
                    const next = [...prev];
                    next.splice(idx, 1);
                    return next;
                }
                return prev;
            });
        }
    };

    const handleCheck = () => {
        const currentStr = currentSentence.join(' ');
        const targetStr = targetSentence.join(' ');

        if (currentStr === targetStr) {
            setFeedback({ type: 'success', text: 'Helt rätt! 🌟' });
            setScore(s => s + 20);
            setIsAnswered(true);
            HapticManager.success();
            TTSManager.speak(targetStr, 'sv');
        } else {
            setFeedback({ type: 'error', text: 'Inte riktigt... Försök igen!' });
            HapticManager.error();
        }
    };

    const handleShowAnswer = () => {
        setCurrentSentence(targetSentence);
        setWordBank([]);
        setFeedback({ type: 'info', text: 'Här är rätt svar!' });
        setIsAnswered(true);
        TTSManager.speak(targetSentence.join(' '), 'sv');
    };

    if (loading || !currentWord) return <div className="game-container">Laddar...</div>;

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Bygg Meningen</h2>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>⭐ {score}</div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div className="sentence-hint-card" style={{ width: '100%', maxWidth: '500px', background: 'rgba(56, 189, 248, 0.1)', padding: '1.5rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
                    <div style={{ color: '#38bdf8', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Översättning:</div>
                    <div style={{ fontSize: '1.5rem', color: '#fbbf24', fontFamily: 'Tajawal' }}>{currentWord.example_arb || currentWord.arabic}</div>
                </div>

                <div className="sentence-board-area" style={{ minHeight: '100px', width: '100%', maxWidth: '500px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', border: '2px dashed rgba(255,255,255,0.1)', padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', alignItems: 'center' }}>
                    {currentSentence.length === 0 && <div style={{ color: '#64748b' }}>Bygg meningen genom att trycka på orden nedan</div>}
                    {currentSentence.map((word, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleWordClick(word, false)}
                            style={{ padding: '10px 20px', background: '#3b82f6', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                        >
                            {word}
                        </button>
                    ))}
                </div>

                <div className="sentence-word-bank" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '500px' }}>
                    {wordBank.map((word, i) => (
                        <button 
                            key={i} 
                            onClick={() => handleWordClick(word, true)}
                            style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px', color: 'white', cursor: 'pointer' }}
                        >
                            {word}
                        </button>
                    ))}
                </div>

                {feedback && (
                    <div style={{ textAlign: 'center', color: feedback.type === 'success' ? '#22c55e' : (feedback.type === 'error' ? '#ef4444' : '#38bdf8'), fontWeight: 'bold' }}>
                        {feedback.text}
                    </div>
                )}

                <div style={{ width: '100%', maxWidth: '500px', display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                    {!isAnswered ? (
                        <>
                            <button onClick={handleShowAnswer} style={{ flex: 1, padding: '1rem', borderRadius: '15px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Visa svar</button>
                            <button onClick={handleCheck} disabled={currentSentence.length === 0} style={{ flex: 2, padding: '1rem', borderRadius: '15px', background: '#3b82f6', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer', opacity: currentSentence.length === 0 ? 0.5 : 1 }}>Kontrollera</button>
                        </>
                    ) : (
                        <button onClick={loadQuestion} style={{ width: '100%', padding: '1rem', borderRadius: '15px', background: '#22c55e', border: 'none', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Nästa ➜</button>
                    )}
                </div>
            </main>
        </div>
    );
};

export default SentenceBuilderGame;
