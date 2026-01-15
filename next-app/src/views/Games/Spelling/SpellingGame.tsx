import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast, generateEducationalSentence } from '../../../utils/utils';
import { SmartWordSelector } from '../../../services/smart-selector.service';
import '@/styles/games.css';

interface SpellingGameProps {
    onBack: () => void;
}

const SpellingGame: React.FC<SpellingGameProps> = ({ onBack }) => {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedAnswer] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState<number | null>(null);

    const loadQuestion = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        const pool = allWords.filter(w => 
            w.swedish && w.arabic && 
            w.swedish.length > 2 && w.swedish.length < 15
        );

        const selected = SmartWordSelector.select(pool.map(w => w.raw), 1)[0];
        const wordObj: Word = {
            id: selected[0],
            type: selected[1],
            swedish: selected[2],
            arabic: selected[3],
            example_swe: selected[7],
            example_arb: selected[8],
            definition: selected[5],
            raw: selected
        };

        setCurrentWord(wordObj);
        
        // Generate options
        const opts = [wordObj.swedish];
        while (opts.length < 4) {
            const rand = pool[Math.floor(Math.random() * pool.length)].swedish;
            if (!opts.includes(rand)) opts.push(rand);
        }
        setOptions(opts.sort(() => Math.random() - 0.5));
        
        setIsAnswered(false);
        setSelectedAnswer(null);
        setCountdown(null);
        setLoading(false);
        
        SmartWordSelector.markAsSeen(wordObj.swedish.toLowerCase());
    }, []);

    useEffect(() => {
        loadQuestion();
    }, [loadQuestion]);

    const handleAnswer = (option: string) => {
        if (isAnswered || !currentWord) return;

        setSelectedAnswer(option);
        setIsAnswered(true);

        if (option === currentWord.swedish) {
            setScore(s => s + 10);
            setStreak(s => s + 1);
            HapticManager.success();
            TTSManager.speak(currentWord.swedish, 'sv');
        } else {
            setStreak(0);
            HapticManager.error();
        }

        setCountdown(5);
    };

    useEffect(() => {
        if (countdown !== null) {
            if (countdown > 0) {
                const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
                return () => clearTimeout(timer);
            } else {
                loadQuestion();
            }
        }
    }, [countdown, loadQuestion]);

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
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Skriv Ordet</h2>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Streak: 🔥 {streak}</div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>⭐ {score}</div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div className="sp-question-card" style={{ width: '100%', maxWidth: '500px', background: 'rgba(30, 41, 59, 0.8)', padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                    <div style={{ fontSize: '2.5rem', color: '#fbbf24', fontWeight: 'bold', fontFamily: 'Tajawal', marginBottom: '1rem' }}>{currentWord.arabic}</div>
                    <button onClick={() => TTSManager.speak(currentWord.swedish, 'sv')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', color: 'white', cursor: 'pointer' }}>🔊</button>
                </div>

                <div className="sp-options-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '500px' }}>
                    {options.map((opt, i) => {
                        const isCorrect = opt === currentWord.swedish;
                        const isSelected = opt === selectedOption;
                        
                        let bgColor = 'rgba(255,255,255,0.05)';
                        let borderColor = 'rgba(255,255,255,0.1)';
                        
                        if (isAnswered) {
                            if (isCorrect) { bgColor = '#22c55e'; borderColor = 'transparent'; }
                            else if (isSelected) { bgColor = '#ef4444'; borderColor = 'transparent'; }
                        }

                        return (
                            <button 
                                key={i} 
                                onClick={() => handleAnswer(opt)}
                                disabled={isAnswered}
                                style={{ padding: '1rem', borderRadius: '12px', background: bgColor, border: `1px solid ${borderColor}`, color: 'white', fontWeight: 'bold', cursor: isAnswered ? 'default' : 'pointer', transition: 'all 0.2s' }}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <div className="sp-feedback" style={{ width: '100%', maxWidth: '500px', textAlign: 'center' }}>
                        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{sentenceData.s}</div>
                            <div dir="rtl" style={{ color: '#aaa', fontSize: '1rem', fontFamily: 'Tajawal' }}>{sentenceData.a}</div>
                        </div>
                        
                        <button 
                            onClick={loadQuestion} 
                            style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', borderRadius: '12px', background: '#3b82f6', border: 'none', color: 'white', fontWeight: 'bold' }}
                        >
                            Nästa {countdown !== null && `(${countdown}s)`} ➜
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default SpellingGame;
