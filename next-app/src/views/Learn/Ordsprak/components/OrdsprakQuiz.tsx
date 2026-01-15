import React, { useState, useMemo, useEffect } from 'react';
import { Proverb } from '../types';

interface OrdsprakQuizProps {
    proverbs: Proverb[];
    onBack: () => void;
}

type QuizType = 'fill' | 'match';

const OrdsprakQuiz: React.FC<OrdsprakQuizProps> = ({ proverbs, onBack }) => {
    const [quizType, setQuizType] = useState<QuizType | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    // Questions Generation
    const questions = useMemo(() => {
        const shuffled = [...proverbs].sort(() => 0.5 - Math.random()).slice(0, 10);
        return shuffled.map(p => {
            if (quizType === 'fill') {
                const words = p.swedishProverb.split(' ');
                const blankIndex = Math.floor(Math.random() * (words.length - 2)) + 1;
                const blankWord = words[blankIndex];
                
                // Get 3 wrong options
                const wrongOptions = proverbs
                    .filter(x => x.id !== p.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(x => x.swedishProverb.split(' ')[1] || 'ord');

                return {
                    proverb: p,
                    type: 'fill',
                    question: words.map((w, i) => i === blankIndex ? '______' : w).join(' '),
                    correct: blankWord,
                    options: [blankWord, ...wrongOptions].sort(() => 0.5 - Math.random())
                };
            } else {
                // Matching
                const wrongOptions = proverbs
                    .filter(x => x.id !== p.id)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3);

                return {
                    proverb: p,
                    type: 'match',
                    question: p.swedishProverb,
                    correct: p.id,
                    options: [p, ...wrongOptions].sort(() => 0.5 - Math.random())
                };
            }
        });
    }, [proverbs, quizType]);

    const handleAnswer = (answer: string | number) => {
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
        }, 2000);
    };

    if (!quizType) {
        return (
            <div className="quiz-selector" style={{ display: 'grid', gap: '1rem' }}>
                <h3 style={{ textAlign: 'center', color: '#fbbf24' }}>Välj quiztyp</h3>
                <button 
                    className="quiz-type-card" 
                    onClick={() => setQuizType('fill')}
                    style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✏️</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Fyll i luckan</div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Komplettera ordspråket med rätt ord</div>
                </button>
                <button 
                    className="quiz-type-card" 
                    onClick={() => setQuizType('match')}
                    style={{ padding: '2rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', textAlign: 'center' }}
                >
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔗</div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>Matcha ordspråk</div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Hitta rätt arabiskt ordspråk</div>
                </button>
                <button onClick={onBack} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Avbryt</button>
            </div>
        );
    }

    if (showResults) {
        const percent = Math.round((score / questions.length) * 100);
        return (
            <div className="quiz-results" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{percent >= 70 ? '🏆' : '📚'}</div>
                <h2 style={{ color: 'white' }}>{percent >= 70 ? 'Bra jobbat!' : 'Fortsätt öva!'}</h2>
                <div style={{ fontSize: '2rem', color: '#fbbf24', margin: '1rem 0' }}>{score} / {questions.length}</div>
                <button 
                    onClick={() => {
                        setQuizType(null);
                        setCurrentIndex(0);
                        setScore(0);
                        setShowResults(false);
                        setIsAnswered(false);
                        setSelectedAnswer(null);
                    }}
                    style={{ padding: '1rem 2rem', borderRadius: '12px', background: '#fbbf24', border: 'none', color: '#1e293b', fontWeight: 'bold', cursor: 'pointer', marginRight: '1rem' }}
                >
                    Spela igen
                </button>
                <button onClick={onBack} style={{ padding: '1rem 2rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer' }}>Tillbaka</button>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div className="quiz-container">
            <div className="quiz-progress" style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', marginBottom: '0.5rem' }}>
                    <span>Fråga {currentIndex + 1} / {questions.length}</span>
                    <span>Poäng: {score}</span>
                </div>
                <div className="progress-bar" style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#fbbf24', width: `${((currentIndex + 1) / questions.length) * 100}%`, transition: 'width 0.3s' }} />
                </div>
            </div>

            <div className="quiz-question-card" style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem', textAlign: 'center' }}>
                <div style={{ color: '#fbbf24', fontSize: '0.9rem', marginBottom: '1rem' }}>
                    {quizType === 'fill' ? 'Vilket ord saknas?' : 'Vilket ordspråk matchar?'}
                </div>
                <div style={{ fontSize: '1.5rem', color: 'white', fontWeight: 'bold' }}>
                    {q.question}
                </div>
            </div>

            <div className="quiz-options" style={{ display: 'grid', gap: '1rem' }}>
                {q.options.map((opt: any, idx: number) => {
                    const isCorrect = (quizType === 'fill' ? opt : opt.id) === q.correct;
                    const isSelected = (quizType === 'fill' ? opt : opt.id) === selectedAnswer;
                    
                    let bgColor = 'rgba(255,255,255,0.05)';
                    let borderColor = 'rgba(255,255,255,0.1)';
                    
                    if (isAnswered) {
                        if (isCorrect) {
                            bgColor = 'rgba(34, 197, 94, 0.2)';
                            borderColor = '#22c55e';
                        } else if (isSelected) {
                            bgColor = 'rgba(239, 68, 68, 0.2)';
                            borderColor = '#ef4444';
                        }
                    }

                    return (
                        <button 
                            key={idx}
                            onClick={() => handleAnswer(quizType === 'fill' ? opt : opt.id)}
                            disabled={isAnswered}
                            style={{ 
                                padding: '1.2rem', 
                                borderRadius: '12px', 
                                background: bgColor, 
                                border: `1px solid ${borderColor}`, 
                                color: 'white', 
                                cursor: isAnswered ? 'default' : 'pointer',
                                fontSize: '1.1rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            {quizType === 'fill' ? opt : opt.arabicEquivalent}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default OrdsprakQuiz;
