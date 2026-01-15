import React, { useState, useEffect, useCallback, useRef } from 'react';
import { DataService } from '../../../services/api';
import { Word } from '../../../services/api/schemas';
import { TTSManager } from '../../../services/tts.service';
import { HapticManager, showToast } from '../../../utils/utils';
import { SmartWordSelector } from '../../../services/smart-selector.service';
import '@/styles/games.css';

interface PronunciationGameProps {
    onBack: () => void;
}

const PronunciationGame: React.FC<PronunciationGameProps> = ({ onBack }) => {
    const [currentWord, setCurrentWord] = useState<Word | null>(null);
    const [score, setScore] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'warning' | 'error', text: string, heard?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [recognition, setRecognition] = useState<any>(null);

    const loadQuestion = useCallback(async () => {
        setLoading(true);
        const dataService = DataService.getInstance();
        await dataService.initialize();
        const allWords = await dataService.getAllWords();
        
        const pool = allWords.filter(w => 
            w.swedish && w.arabic && 
            w.swedish.length >= 3 && w.swedish.length <= 12 &&
            !w.swedish.includes(' ')
        );

        const selected = SmartWordSelector.select(pool.map(w => w.raw), 1)[0];
        const wordObj: Word = {
            id: selected[0],
            type: selected[1],
            swedish: selected[2],
            arabic: selected[3],
            raw: selected
        };

        setCurrentWord(wordObj);
        setFeedback(null);
        setLoading(false);
        
        SmartWordSelector.markAsSeen(wordObj.swedish.toLowerCase());
        
        // Auto-play word
        setTimeout(() => TTSManager.speak(wordObj.swedish, 'sv'), 1000);
    }, []);

    useEffect(() => {
        loadQuestion();
    }, [loadQuestion]);

    // Initialize Web Speech API
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const rec = new SpeechRecognition();
            rec.lang = 'sv-SE';
            rec.continuous = false;
            rec.interimResults = false;

            rec.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript.toLowerCase().trim();
                const target = currentWord?.swedish.toLowerCase().trim() || "";
                
                // Fuzzy matching
                const isCorrect = transcript === target || transcript.includes(target) || target.includes(transcript);

                if (isCorrect) {
                    setFeedback({ type: 'success', text: '✅ Bra uttal!', heard: transcript });
                    setScore(s => s + 10);
                    HapticManager.success();
                } else {
                    setFeedback({ type: 'warning', text: '⚠️ Försök igen!', heard: transcript });
                    HapticManager.error();
                }
                setIsListening(false);
            };

            rec.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
                showToast(`Fel: ${event.error}`, 'error');
            };

            rec.onend = () => {
                setIsListening(false);
            };

            setRecognition(rec);
        } else {
            showToast('Taligenkänning stöds inte i din webbläsare', 'error');
        }
    }, [currentWord]);

    const toggleMic = () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
        } else {
            setFeedback(null);
            try {
                recognition.start();
                setIsListening(true);
                HapticManager.light();
            } catch (e) {
                console.error(e);
            }
        }
    };

    if (loading || !currentWord) return <div className="game-container">Laddar...</div>;

    return (
        <div className="game-page-body" style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: 'white' }}>
            <header style={{ padding: '1rem', background: 'rgba(30, 41, 59, 0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onBack} className="back-btn">⬅️</button>
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Uttalscoach</h2>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#fbbf24' }}>⭐ {score}</div>
            </header>

            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
                <div className="target-word-display" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem', color: '#fff' }}>{currentWord.swedish}</h1>
                    <div style={{ fontSize: '1.5rem', color: '#fbbf24', fontFamily: 'Tajawal' }}>{currentWord.arabic}</div>
                </div>

                <div className="mic-container" style={{ textAlign: 'center' }}>
                    <button 
                        onClick={toggleMic} 
                        className={`mic-btn ${isListening ? 'listening' : ''}`}
                        style={{ 
                            width: '120px', height: '120px', borderRadius: '50%', 
                            background: isListening ? '#ef4444' : '#38bdf8', 
                            border: 'none', color: 'white', fontSize: '3rem', cursor: 'pointer',
                            boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.5)' : '0 0 20px rgba(56, 189, 248, 0.3)',
                            transition: 'all 0.3s',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                            <line x1="12" y1="19" x2="12" y2="23"></line>
                            <line x1="8" y1="23" x2="16" y2="23"></line>
                        </svg>
                    </button>
                    <p style={{ marginTop: '1rem', color: isListening ? '#ef4444' : '#64748b', fontWeight: 'bold' }}>
                        {isListening ? 'Lyssnar...' : 'Tryck för att tala'}
                    </p>
                </div>

                {feedback && (
                    <div style={{ textAlign: 'center', padding: '1rem', borderRadius: '15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '400px' }}>
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: feedback.type === 'success' ? '#22c55e' : '#f59e0b' }}>{feedback.text}</div>
                        {feedback.heard && <div style={{ marginTop: '0.5rem', opacity: 0.7 }}>Du sa: "{feedback.heard}"</div>}
                    </div>
                )}

                <div style={{ marginTop: 'auto', width: '100%', maxWidth: '400px', display: 'flex', gap: '1rem' }}>
                    <button onClick={() => TTSManager.speak(currentWord.swedish, 'sv')} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', fontWeight: 'bold' }}>Lyssna 🔊</button>
                    <button onClick={loadQuestion} style={{ flex: 2, padding: '1rem', borderRadius: '12px', background: '#38bdf8', border: 'none', color: '#0f172a', fontWeight: 'bold' }}>Nästa ➜</button>
                </div>
            </main>
        </div>
    );
};

export default PronunciationGame;
