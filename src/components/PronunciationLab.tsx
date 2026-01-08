import React, { useEffect, useRef, useState } from 'react';
import { AudioVisualizer, PronunciationRecorder, HapticFeedback, MasteryBadges } from '../ui-enhancements';
import { TTSManager } from '../tts';
import { PronunciationHelper } from '../pronunciation-data';
import { TextSizeManager } from '../utils';

interface PronunciationLabProps {
    word: string;
}

type PracticeLevel = 'listen' | 'repeat' | 'challenge';

export const PronunciationLab: React.FC<PronunciationLabProps> = ({ word }) => {
    const [level, setLevel] = useState<PracticeLevel>('listen');
    const [isRecording, setIsRecording] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [speed, setSpeed] = useState(1.0);
    const [lastBlob, setLastBlob] = useState<Blob | null>(null);
    const [karaokeActive, setKaraokeActive] = useState(false);
    const [activeSyllableIndex, setActiveSyllableIndex] = useState<number | null>(null);
    
    const visualizerContainerRef = useRef<HTMLDivElement>(null);
    const visualizerRef = useRef<AudioVisualizer | null>(null);
    const recorderRef = useRef<PronunciationRecorder | null>(null);
    const recognitionRef = useRef<any>(null);
    const syllableTimeoutRef = useRef<any>(null);

    // Initialize Visualizer & Recorder
    useEffect(() => {
        if (visualizerContainerRef.current && !visualizerRef.current) {
            try {
                visualizerRef.current = new AudioVisualizer(visualizerContainerRef.current, '#2dd4bf');
                visualizerRef.current.setMode('liquid');
            } catch (e) { console.error('Visualizer init failed', e); }
        }
        
        if (!recorderRef.current) {
            recorderRef.current = new PronunciationRecorder();
        }

        return () => {
            visualizerRef.current?.stop();
        };
    }, []);

    // Speech Recognition Setup
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'sv-SE';
            recognition.interimResults = false;
            recognition.maxAlternatives = 1;
            recognition.onresult = (event: any) => {
                const spokenText = event.results[0][0].transcript.toLowerCase();
                const confidence = event.results[0][0].confidence;
                calculateScore(spokenText, confidence);
            };
            recognitionRef.current = recognition;
        }
    }, [word]);

    // TTS Events
    useEffect(() => {
        const onStart = () => {
            visualizerRef.current?.start();
            setKaraokeActive(true);
            startSyllableAnim();
        };
        const onEnd = () => {
            visualizerRef.current?.stop();
            setKaraokeActive(false);
            stopSyllableAnim();
        };
        const onBoundary = () => {
            // Optional: highlight specific word if needed
        };

        window.addEventListener('tts-start', onStart);
        window.addEventListener('tts-end', onEnd);
        window.addEventListener('tts-boundary', onBoundary);

        return () => {
            window.removeEventListener('tts-start', onStart);
            window.removeEventListener('tts-end', onEnd);
            window.removeEventListener('tts-boundary', onBoundary);
        };
    }, [word, speed]); // Re-bind if word/speed changes

    const startSyllableAnim = () => {
        const syllables = PronunciationHelper.splitIntoSyllables(word);
        if (!syllables.length) return;
        
        stopSyllableAnim();
        
        // Approx calculation
        const totalChars = word.length;
        const estimatedDuration = (totalChars * 80) / speed;
        const syllableDurations = syllables.map(s => Math.max(200, (s.length / totalChars) * estimatedDuration));

        let index = 0;
        const playNext = () => {
            if (index >= syllables.length) {
                setActiveSyllableIndex(null);
                return;
            }
            setActiveSyllableIndex(index);
            const duration = syllableDurations[index];
            index++;
            syllableTimeoutRef.current = setTimeout(playNext, duration);
        };
        playNext();
    };

    const stopSyllableAnim = () => {
        if (syllableTimeoutRef.current) clearTimeout(syllableTimeoutRef.current);
        setActiveSyllableIndex(null);
    };

    const calculateScore = (spoken: string, confidence: number) => {
        const target = word.toLowerCase();
        let s = 0;
        if (spoken === target) s = Math.round(confidence * 100);
        else if (spoken.includes(target) || target.includes(spoken)) s = Math.round(confidence * 80);
        else s = Math.round(confidence * 40);
        
        setScore(s);
        if (s > 80) HapticFeedback.success();
    };

    const toggleRecording = async () => {
        if (!isRecording) {
            setIsRecording(true);
            setScore(null);
            visualizerRef.current?.start();
            await recorderRef.current?.start();
            try { recognitionRef.current?.start(); } catch {}
        } else {
            setIsRecording(false);
            visualizerRef.current?.stop();
            const blob = await recorderRef.current?.stop();
            setLastBlob(blob || null);
            try { recognitionRef.current?.stop(); } catch {}
        }
    };

    const playRecording = () => {
        if (lastBlob) PronunciationRecorder.playBlob(lastBlob);
    };

    const syllables = PronunciationHelper.splitIntoSyllables(word);
    const tips = PronunciationHelper.getTipsForWord(word);

    return (
        <div className="pronunciation-lab-section premium-glow-section" style={{ padding: '16px', background: '#1c1c1e', borderRadius: '16px', border: '1px solid #333' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', marginBottom: '16px' }}>
                🎙️ <span className="sv-text">Uttalslabb / مختبر النطق</span>
            </h3>

            {/* Levels */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {[
                    { id: 'listen', icon: '👂', label: 'Lyssna', labelAr: 'استمع' },
                    { id: 'repeat', icon: '🔁', label: 'Upprepa', labelAr: 'كرر' },
                    { id: 'challenge', icon: '🎯', label: 'Utmaning', labelAr: 'تحدي' }
                ].map((lvl) => (
                    <button 
                        key={lvl.id}
                        onClick={() => setLevel(lvl.id as any)}
                        style={{
                            flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #444',
                            background: level === lvl.id ? '#2dd4bf22' : 'transparent',
                            borderColor: level === lvl.id ? '#2dd4bf' : '#444',
                            color: level === lvl.id ? '#2dd4bf' : '#888',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '0.8rem', gap: '4px'
                        }}
                    >
                        <span style={{ fontSize: '1.2rem' }}>{lvl.icon}</span>
                        <span>{lvl.label}</span>
                        <span style={{ fontSize: '0.7rem' }}>{lvl.labelAr}</span>
                    </button>
                ))}
            </div>

            {/* Main Stage */}
            <div style={{ position: 'relative', marginBottom: '20px', minHeight: '120px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div ref={visualizerContainerRef} style={{ width: '100%', height: '80px', position: 'absolute', top: 0, opacity: 0.3 }} />
                
                {/* Karaoke Word */}
                <div style={{ 
                    fontSize: word.length > 10 ? '2rem' : '3rem', fontWeight: '900', zIndex: 2, 
                    color: karaokeActive ? '#2dd4bf' : '#fff', transition: 'color 0.2s', textAlign: 'center',
                    textShadow: karaokeActive ? '0 0 20px #2dd4bf' : 'none'
                }}>
                    {word}
                </div>

                {/* Syllables */}
                <div style={{ display: 'flex', gap: '4px', marginTop: '10px', zIndex: 2 }}>
                    {syllables.map((s, i) => (
                        <span key={i} style={{ 
                            padding: '4px 8px', borderRadius: '4px', background: activeSyllableIndex === i ? '#2dd4bf' : '#333', 
                            color: activeSyllableIndex === i ? '#000' : '#888', fontSize: '0.9rem', fontWeight: 'bold',
                            transition: 'all 0.2s'
                        }}>
                            {s}
                        </span>
                    ))}
                </div>
            </div>

            {/* Controls */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {level !== 'challenge' && (
                    <button 
                        onClick={() => TTSManager.speakSwedish(word)}
                        style={{ padding: '16px', borderRadius: '12px', background: '#3b82f6', color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        🔊 Lyssna
                    </button>
                )}
                
                {level !== 'listen' && (
                    <button 
                        onClick={toggleRecording}
                        style={{ 
                            padding: '16px', borderRadius: '12px', 
                            background: isRecording ? '#ef4444' : '#2c2c2e', 
                            color: '#fff', border: 'none', fontSize: '1rem', fontWeight: 'bold',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            animation: isRecording ? 'pulse 1.5s infinite' : 'none'
                        }}
                    >
                        {isRecording ? '⏹️ Stopp' : '🎙️ Spela in'}
                    </button>
                )}
            </div>

            {/* Score & Playback */}
            {score !== null && (
                <div style={{ marginTop: '20px', padding: '15px', background: '#2c2c2e', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', color: score > 70 ? '#4ade80' : '#facc15' }}>
                        {score}% Match
                    </div>
                    {lastBlob && (
                        <button onClick={playRecording} style={{ background: 'none', border: '1px solid #555', color: '#fff', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer' }}>
                            ▶️ Hör din inspelning
                        </button>
                    )}
                </div>
            )}

            {/* Speed Control */}
            <div style={{ marginTop: '20px', padding: '0 10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#888', fontSize: '0.8rem', marginBottom: '5px' }}>
                    <span>0.5x</span>
                    <span>Hastighet: {speed}x</span>
                    <span>1.5x</span>
                </div>
                <input 
                    type="range" min="0.5" max="1.5" step="0.1" value={speed} 
                    onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        setSpeed(v);
                        TTSManager.setSpeed(v);
                    }}
                    style={{ width: '100%', accentColor: '#3b82f6' }} 
                />
            </div>

            {/* Tips */}
            {tips.length > 0 && (
                <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {tips.map((tip, i) => (
                        <div key={i} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid #facc15' }}>
                            <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '4px' }}>💡 Tips</div>
                            <div style={{ fontSize: '0.85rem', color: '#ccc' }}>{tip.tip.sv}</div>
                            <div style={{ fontSize: '0.85rem', color: '#888', fontStyle: 'italic', marginTop: '4px' }}>Ex: {tip.example}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
