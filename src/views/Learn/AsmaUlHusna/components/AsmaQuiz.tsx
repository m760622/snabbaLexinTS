import React, { useState, useMemo } from 'react';
import { AsmaName } from '../types';

interface AsmaQuizProps {
    names: AsmaName[];
    onBack: () => void;
}

const AsmaQuiz: React.FC<AsmaQuizProps> = ({ names, onBack }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const questions = useMemo(() => {
        const shuffled = [...names].sort(() => 0.5 - Math.random()).slice(0, 10);
        return shuffled.map(item => {
            const wrongOptions = names
                .filter(x => x.nr !== item.nr)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            return {
                item,
                correct: item.nr,
                options: [item, ...wrongOptions].sort(() => 0.5 - Math.random())
            };
        });
    }, [names]);

    const handleAnswer = (nr: number) => {
        if (isAnswered) return;
        setSelectedAnswer(nr);
        setIsAnswered(true);
        
        if (nr === questions[currentIndex].correct) {
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
                <div style={{ fontSize: '4rem' }}>{score >= 7 ? '👑' : '🌱'}</div>
                <h2 style={{ color: 'white', fontFamily: 'Tajawal' }}>{score >= 7 ? 'ممتاز!' : 'حاول مرة أخرى'}</h2>
                <div style={{ fontSize: '3rem', color: '#fbbf24', margin: '1rem 0' }}>{score} / 10</div>
                <button 
                    onClick={() => { setCurrentIndex(0); setScore(0); setShowResults(false); }}
                    style={{ padding: '1rem 2rem', borderRadius: '12px', background: '#fbbf24', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginRight: '1rem' }}
                >
                    إعادة الاختبار
                </button>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>رجوع</button>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24', marginBottom: '0.5rem' }}>
                    <span>سؤال {currentIndex + 1} / 10</span>
                    <span>النقاط: {score}</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(251, 191, 36, 0.1)', borderRadius: '2px' }}>
                    <div style={{ height: '100%', background: '#fbbf24', width: `${((currentIndex + 1) / 10) * 100}%`, transition: 'width 0.3s' }} />
                </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '2rem', borderRadius: '24px', border: '1px solid rgba(251, 191, 36, 0.2)', marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '1rem' }}>ما معنى هذا الاسم؟</div>
                <div style={{ fontSize: '3.5rem', color: 'white', fontWeight: 'bold', fontFamily: 'Amiri' }}>
                    {q.item.nameAr}
                </div>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
                {q.options.map((opt, idx) => {
                    const isCorrect = opt.nr === q.correct;
                    const isSelected = opt.nr === selectedAnswer;
                    let border = '1px solid rgba(255,255,255,0.1)';
                    let bg = 'rgba(255,255,255,0.05)';

                    if (isAnswered) {
                        if (isCorrect) { border = '1px solid #22c55e'; bg = 'rgba(34, 197, 94, 0.1)'; }
                        else if (isSelected) { border = '1px solid #ef4444'; bg = 'rgba(239, 68, 68, 0.1)'; }
                    }

                    return (
                        <button 
                            key={idx}
                            onClick={() => handleAnswer(opt.nr)}
                            disabled={isAnswered}
                            style={{ padding: '1.2rem', borderRadius: '16px', border, background: bg, color: 'white', fontSize: '1.1rem', cursor: isAnswered ? 'default' : 'pointer', textAlign: 'center' }}
                        >
                            {opt.meaningSv} ({opt.meaningAr})
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default AsmaQuiz;
