import React, { useState, useEffect } from 'react';
import { TTSManager } from '../tts';
import { QuizStats } from '../quiz-stats';
import { showToast } from '../utils';

interface Question {
    id: string;
    swedish: string;
    arabic: string;
    options: string[];
    correct: string;
}

export const QuizComponent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showEndScreen, setShowEndScreen] = useState(false);

    useEffect(() => {
        startGame();
    }, []);

    const startGame = () => {
        const data = (window as any).dictionaryData as any[][];
        if (!data || data.length < 5) {
            showToast('Laddar data...');
            return;
        }

        const shuffled = [...data].sort(() => 0.5 - Math.random()).slice(0, 10);
        const generatedQuestions = shuffled.map(row => {
            const correct = row[3];
            const type = row[1];
            const distractors = data
                .filter(r => r[1] === type && r[0] !== row[0])
                .sort(() => 0.5 - Math.random())
                .slice(0, 3)
                .map(r => r[3]);
            
            // If not enough same-type distractors, take random ones
            while (distractors.length < 3) {
                const randomWord = data[Math.floor(Math.random() * data.length)][3];
                if (randomWord !== correct && !distractors.includes(randomWord)) {
                    distractors.push(randomWord);
                }
            }

            return {
                id: row[0].toString(),
                swedish: row[2],
                arabic: correct,
                correct: correct,
                options: [correct, ...distractors].sort(() => 0.5 - Math.random())
            };
        });

        setQuestions(generatedQuestions);
        setCurrentIndex(0);
        setScore(0);
        setIsAnswered(false);
        setShowEndScreen(false);
        QuizStats.resetSession();
    };

    const handleAnswer = (option: string) => {
        if (isAnswered) return;
        setIsAnswered(true);
        setSelectedOption(option);

        const current = questions[currentIndex];
        const isCorrect = option === current.correct;

        if (isCorrect) {
            setScore(s => s + 1);
            showToast('Rätt! 🎉');
        } else {
            showToast('Fel ❌');
        }

        QuizStats.recordAnswer(current.id, isCorrect);
        TTSManager.speak(current.arabic, 'ar');
    };

    const nextQuestion = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(i => i + 1);
            setIsAnswered(false);
            setSelectedOption(null);
        } else {
            setShowEndScreen(true);
            QuizStats.endSession();
        }
    };

    if (showEndScreen) {
        return (
            <div style={quizStyles.inlineContainer}>
                <div style={quizStyles.modal}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '10px', color: '#fff' }}>🎉 Klart!</h2>
                    <p style={{ fontSize: '1.2rem', marginBottom: '20px', color: '#fff' }}>Ditt resultat: {score} / {questions.length}</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button onClick={startGame} style={quizStyles.primaryBtn}>Spela igen</button>
                        <button onClick={onClose} style={quizStyles.secondaryBtn}>Stäng</button>
                    </div>
                </div>
            </div>
        );
    }

    const current = questions[currentIndex];
    if (!current) return null;

    return (
        <div style={quizStyles.inlineContainer}>
            <div style={quizStyles.modal}>
                <div style={quizStyles.header}>
                    <span>Fråga {currentIndex + 1} / {questions.length}</span>
                    <button onClick={onClose} style={quizStyles.closeBtn}>×</button>
                </div>

                <div style={quizStyles.progressBar}>
                    <div style={{ ...quizStyles.progressFill, width: `${((currentIndex) / questions.length) * 100}%` }}></div>
                </div>

                <div style={quizStyles.questionCard}>
                    <h3 style={quizStyles.questionText}>{current.swedish}</h3>
                    <button onClick={() => TTSManager.speak(current.swedish, 'sv')} style={quizStyles.speakBtn}>🔊</button>
                </div>

                <div style={quizStyles.optionsGrid}>
                    {current.options.map((opt, idx) => {
                        let btnStyle = { ...quizStyles.optionBtn };
                        if (isAnswered) {
                            if (opt === current.correct) {
                                btnStyle = { ...btnStyle, background: '#22c55e', borderColor: '#22c55e' };
                            } else if (opt === selectedOption) {
                                btnStyle = { ...btnStyle, background: '#ef4444', borderColor: '#ef4444' };
                            }
                        }
                        return (
                            <button 
                                key={idx} 
                                onClick={() => handleAnswer(opt)} 
                                style={btnStyle}
                                disabled={isAnswered}
                            >
                                {opt}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <button onClick={nextQuestion} style={quizStyles.nextBtn}>
                        {currentIndex === questions.length - 1 ? 'Visa resultat' : 'Nästa'} ⟶
                    </button>
                )}
            </div>
        </div>
    );
};

const quizStyles: { [key: string]: React.CSSProperties } = {
    inlineContainer: { width: '100%', padding: '20px', display: 'flex', justifyContent: 'center' },
    modal: { background: '#1c1c1e', width: '100%', maxWidth: '450px', borderRadius: '24px', padding: '24px', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', position: 'relative', textAlign: 'center' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', color: '#888', fontSize: '0.9rem' },
    closeBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '1.5rem', cursor: 'pointer' },
    progressBar: { width: '100%', height: '6px', background: '#333', borderRadius: '3px', marginBottom: '25px', overflow: 'hidden' },
    progressFill: { height: '100%', background: '#3b82f6', transition: 'width 0.3s ease' },
    questionCard: { marginBottom: '30px' },
    questionText: { fontSize: '2rem', fontWeight: '900', color: '#fff', margin: '0 0 10px 0' },
    speakBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '44px', height: '44px', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' },
    optionsGrid: { display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '20px' },
    optionBtn: { padding: '16px', borderRadius: '16px', border: '1px solid #444', background: '#2c2c2e', color: '#fff', fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' },
    nextBtn: { width: '100%', padding: '16px', borderRadius: '16px', background: '#3b82f6', color: '#fff', border: 'none', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer' },
    primaryBtn: { padding: '12px 24px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' },
    secondaryBtn: { padding: '12px 24px', borderRadius: '12px', background: 'transparent', color: '#888', border: '1px solid #444', fontSize: '1rem', cursor: 'pointer' }
};
