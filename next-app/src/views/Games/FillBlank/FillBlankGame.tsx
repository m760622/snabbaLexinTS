import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast } from '../../../utils/utils';
import { SmartWordSelector } from '../../../services/smart-selector.service';
import '@/styles/games.css';

interface FillBlankGameProps {
    onBack: () => void;
}

const TOTAL_QUESTIONS = 10;

const FillBlankGame: React.FC<FillBlankGameProps> = ({ onBack }) => {
    const [questions, setQuestions] = useState<{ word: Word, sentence: string, options: string[] }[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [errors, setErrors] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedAnswer] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const initGame = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        const pool = allWords.filter(w => 
            w.example_swe && w.swedish && w.arabic && 
            w.example_swe.toLowerCase().includes(w.swedish.toLowerCase())
        );

        const shuffled = pool.sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, TOTAL_QUESTIONS);

        const newQuestions = selected.map(wordObj => {
            const regex = new RegExp(wordObj.swedish, 'i');
            const sentence = wordObj.example_swe!.replace(regex, '____');
            
            const opts = [wordObj.swedish];
            while (opts.length < 4) {
                const rand = pool[Math.floor(Math.random() * pool.length)].swedish;
                if (!opts.includes(rand)) opts.push(rand);
            }

            return {
                word: wordObj,
                sentence,
                options: opts.sort(() => Math.random() - 0.5)
            };
        });

        setQuestions(newQuestions);
        setCurrentIndex(0);
        setScore(0);
        setErrors(0);
        setIsAnswered(false);
        setSelectedAnswer(null);
        setLoading(false);
    }, []);

    useEffect(() => {
        initGame();
    }, [initGame]);

    const handleAnswer = (option: string) => {
        if (isAnswered) return;

        const correct = questions[currentIndex].word.swedish;
        setSelectedAnswer(option);
        setIsAnswered(true);

        if (option === correct) {
            setScore(s => s + 1);
            HapticManager.success();
            TTSManager.speak(correct, 'sv');
        } else {
            setErrors(e => e + 1);
            HapticManager.error();
        }

        setTimeout(() => {
            if (currentIndex < TOTAL_QUESTIONS - 1) {
                setCurrentIndex(prev => prev + 1);
                setIsAnswered(false);
                setSelectedAnswer(null);
            } else {
                // Game Over
            }
        }, 2000);
    };

    if (loading || questions.length === 0) return <div className="game-container">Laddar...</div>;

    const currentQ = questions[currentIndex];
    const isFinished = currentIndex >= TOTAL_QUESTIONS - 1 && isAnswered;

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Fyll i luckan</h2>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Fråga {currentIndex + 1} / {TOTAL_QUESTIONS}</div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>✅ {score} | ❌ {errors}</div>
            </header>

            <div className="progress-container" style={{ height: '4px', background: 'rgba(255,255,255,0.1)' }}>
                <div style={{ height: '100%', background: '#3b82f6', width: `${((currentIndex + (isAnswered ? 1 : 0)) / TOTAL_QUESTIONS) * 100}%`, transition: 'width 0.3s' }} />
            </div>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div className="question-card" style={{ width: '100%', maxWidth: '500px', background: 'rgba(30, 41, 59, 0.8)', padding: '2rem', borderRadius: '24px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p style={{ fontSize: '1.5rem', lineHeight: '1.4', marginBottom: '1rem' }}>
                        {currentQ.sentence.split('____').map((part, i, arr) => (
                            <React.Fragment key={i}>
                                {part}
                                {i < arr.length - 1 && (
                                    <span style={{ color: isAnswered ? (selectedOption === currentQ.word.swedish ? '#22c55e' : '#ef4444') : '#3b82f6', borderBottom: '2px solid', padding: '0 10px' }}>
                                        {isAnswered ? selectedOption : '?'}
                                    </span>
                                )}
                            </React.Fragment>
                        ))}
                    </p>
                    <div dir="rtl" style={{ color: '#aaa', fontSize: '1.2rem', fontFamily: 'Tajawal' }}>{currentQ.word.arabic}</div>
                </div>

                <div className="options-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%', maxWidth: '500px' }}>
                    {currentQ.options.map((opt, i) => {
                        const isCorrect = opt === currentQ.word.swedish;
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
            </main>

            {isFinished && (
                <div className="modal-overlay active">
                    <div className="modal-content" style={{ textAlign: 'center' }}>
                        <h2 style={{ fontSize: '3rem' }}>{score >= 8 ? '🏆' : '📚'}</h2>
                        <h3>Resultat</h3>
                        <div style={{ fontSize: '2rem', color: '#fbbf24', margin: '1rem 0' }}>{score} / {TOTAL_QUESTIONS}</div>
                        <button className="modal-btn" onClick={initGame}>Spela igen</button>
                        <button className="modal-btn" style={{ background: 'rgba(255,255,255,0.1)', marginTop: '0.5rem' }} onClick={onBack}>Meny</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FillBlankGame;
