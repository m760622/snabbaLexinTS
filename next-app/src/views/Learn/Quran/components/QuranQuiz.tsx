import React, { useState, useMemo } from 'react';
import { QuranEntry } from '../types';

interface QuranQuizProps {
    items: QuranEntry[];
    onBack: () => void;
}

const QuranQuiz: React.FC<QuranQuizProps> = ({ items, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const questions = useMemo(() => {
        const shuffled = [...items].sort(() => 0.5 - Math.random()).slice(0, 10);
        return shuffled.map(item => {
            const wrongOptions = items
                .filter(x => x.id !== item.id)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            return {
                item,
                correct: item.word_sv,
                options: [item.word_sv, ...wrongOptions.map(x => x.word_sv)].sort(() => 0.5 - Math.random())
            };
        });
    }, [items]);

    const handleAnswer = (answer: string) => {
        if (isAnswered) return;
        setSelectedAnswer(answer);
        setIsAnswered(true);
        
        if (answer === questions[currentIndex].correct) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setIsAnswered(false);
                setSelectedAnswer(null);
            } else {
                setShowResults(true);
            }
        }, 1500);
    };

    if (showResults) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '4rem' }}>{score >= 7 ? '🌟' : '📚'}</div>
                <h2 style={{ color: 'white' }}>{score >= 7 ? 'Masha Allah!' : 'Fortsätt öva!'}</h2>
                <div style={{ fontSize: '3rem', color: 'var(--quran-gold)', margin: '1rem 0' }}>{score} / 10</div>
                <button 
                    onClick={() => { setCurrentIndex(0); setScore(0); setShowResults(false); }}
                    style={{ padding: '1rem 2rem', borderRadius: '12px', background: 'var(--quran-gold)', border: 'none', color: '#064e3b', fontWeight: 'bold', cursor: 'pointer', marginRight: '1rem' }}
                >
                    Försök igen
                </button>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Tillbaka</button>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--quran-gold)', marginBottom: '0.5rem' }}>
                    <span>Fråga {currentIndex + 1} / 10</span>
                    <span>Poäng: {score}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: 'var(--quran-gold)', width: `${((currentIndex + 1) / 10) * 100}%`, transition: 'width 0.3s' }} />
                </div>
            </div>

            <div style={{ background: 'rgba(6, 78, 59, 0.8)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(251, 191, 36, 0.2)', marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--quran-gold)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>ما معنى هذه الكلمة؟</div>
                <div style={{ fontSize: '4rem', color: 'white', fontWeight: 'bold', fontFamily: 'Amiri' }}>
                    {q.item.word}
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {q.options.map((opt, idx) => {
                    const isCorrect = opt === q.correct;
                    const isSelected = opt === selectedAnswer;
                    let border = '1px solid rgba(255,255,255,0.1)';
                    let bg = 'rgba(255,255,255,0.05)';

                    if (isAnswered) {
                        if (isCorrect) { border = '1px solid #22c55e'; bg = 'rgba(34, 197, 94, 0.1)'; }
                        else if (isSelected) { border = '1px solid #ef4444'; bg = 'rgba(239, 68, 68, 0.1)'; }
                    }

                    return (
                        <button 
                            key={idx}
                            onClick={() => handleAnswer(opt)}
                            disabled={isAnswered}
                            style={{ padding: '1.2rem', borderRadius: '16px', border, background: bg, color: 'white', fontSize: '1.1rem', cursor: isAnswered ? 'default' : 'pointer', textAlign: 'center' }}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default QuranQuiz;
