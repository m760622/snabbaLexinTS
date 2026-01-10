import React, { useState, useMemo } from 'react';
import { CognateEntry } from '../types';
import { TTSManager } from '../../../../tts';

interface CognatesQuizProps {
    cognates: CognateEntry[];
    onBack: () => void;
}

type QuizType = 'swe-ar' | 'ar-swe' | 'audio';

const CognatesQuiz: React.FC<CognatesQuizProps> = ({ cognates, onBack }) => {
    const [quizType, setQuizType] = useState<QuizType | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const questions = useMemo(() => {
        const pool = cognates.length >= 10 ? cognates : [...cognates, ...cognates]; // Ensure enough data
        const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, 10);
        
        return shuffled.map(item => {
            const wrongOptions = cognates
                .filter(x => x.swe !== item.swe)
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);

            let question = '';
            let correct = '';
            let options: string[] = [];

            if (quizType === 'swe-ar' || quizType === 'audio') {
                question = item.swe;
                correct = item.arb;
                options = [item.arb, ...wrongOptions.map(x => x.arb)].sort(() => 0.5 - Math.random());
            } else {
                question = item.arb;
                correct = item.swe;
                options = [item.swe, ...wrongOptions.map(x => x.swe)].sort(() => 0.5 - Math.random());
            }

            return { item, question, correct, options };
        });
    }, [cognates, quizType]);

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

    const playQuestionAudio = () => {
        if (quizType === 'audio' || quizType === 'swe-ar') {
            if (TTSManager) TTSManager.speak(questions[currentIndex].item.swe, 'sv');
        }
    };

    if (!quizType) {
        return (
            <div style={{ display: 'grid', gap: '1rem', maxWidth: '400px', margin: '0 auto' }}>
                <h3 style={{ textAlign: 'center', color: '#3b82f6' }}>Välj testtyp</h3>
                {[
                    { id: 'swe-ar', icon: '🇸🇪', label: 'Svenska → Arabiska' },
                    { id: 'ar-swe', icon: '🇸🇦', label: 'Arabiska → Svenska' },
                    { id: 'audio', icon: '🔊', label: 'Hörförståelse' }
                ].map(type => (
                    <button 
                        key={type.id}
                        onClick={() => setQuizType(type.id as QuizType)}
                        style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem' }}
                    >
                        <span style={{ fontSize: '1.5rem' }}>{type.icon}</span>
                        <span style={{ fontWeight: 'bold' }}>{type.label}</span>
                    </button>
                ))}
                <button onClick={onBack} style={{ marginTop: '1rem', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Tillbaka</button>
            </div>
        );
    }

    if (showResults) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '4rem' }}>{score >= 7 ? '🎉' : '📚'}</div>
                <h2 style={{ color: 'white' }}>Test Slutfört!</h2>
                <div style={{ fontSize: '2.5rem', color: '#3b82f6', margin: '1rem 0' }}>{score} / 10</div>
                <button 
                    onClick={() => { setQuizType(null); setCurrentIndex(0); setScore(0); setShowResults(false); }}
                    style={{ padding: '1rem 2rem', borderRadius: '12px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginRight: '1rem' }}
                >
                    Försök igen
                </button>
                <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}>Tillbaka</button>
            </div>
        );
    }

    const q = questions[currentIndex];

    return (
        <div className="quiz-container" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <div className="quiz-progress" style={{ marginBottom: '2rem' }}>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: '#3b82f6', width: `${((currentIndex + 1) / 10) * 100}%`, transition: 'width 0.3s' }} />
                </div>
            </div>

            <div style={{ background: 'rgba(30, 41, 59, 0.8)', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(59, 130, 246, 0.2)', marginBottom: '2rem', textAlign: 'center' }}>
                {quizType === 'audio' ? (
                    <button 
                        onClick={playQuestionAudio}
                        style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#3b82f6', border: 'none', color: 'white', fontSize: '2rem', cursor: 'pointer' }}
                    >
                        🔊
                    </button>
                ) : (
                    <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold', fontFamily: quizType === 'ar-swe' ? 'Tajawal' : 'inherit' }}>
                        {q.question}
                    </div>
                )}
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
                            style={{ padding: '1.2rem', borderRadius: '16px', border, background: bg, color: 'white', fontSize: '1.1rem', cursor: isAnswered ? 'default' : 'pointer', fontFamily: quizType === 'swe-ar' || quizType === 'audio' ? 'Tajawal' : 'inherit' }}
                        >
                            {opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CognatesQuiz;
