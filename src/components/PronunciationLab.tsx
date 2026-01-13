import React, { useEffect, useRef, useState } from 'react';
import { AudioVisualizer, PronunciationRecorder, HapticFeedback } from '../utils/ui-enhancements.util';
import { TTSManager } from '../services/tts.service';
import { PronunciationHelper } from '../utils/pronunciation.util';

interface PronunciationLabProps {
    word: string;
}

export const PronunciationLab: React.FC<PronunciationLabProps> = ({ word }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [state, setState] = useState<'idle' | 'listening' | 'recording' | 'processing' | 'result'>('idle');
    const [lastBlob, setLastBlob] = useState<Blob | null>(null);

    const visualizerContainerRef = useRef<HTMLDivElement>(null);
    const visualizerRef = useRef<AudioVisualizer | null>(null);
    const recorderRef = useRef<PronunciationRecorder | null>(null);
    const recognitionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

    // --- Dynamic Styles based on State ---
    const getWaveColor = () => {
        switch (state) {
            case 'recording': return '#f97316'; // Orange Fire
            case 'listening': return '#22d3ee'; // Cyan
            case 'processing': return '#a855f7'; // Purple
            case 'result': return score && score > 80 ? '#22c55e' : '#eab308'; // Green or Yellow
            default: return '#3b82f6'; // Default Blue
        }
    };

    const waveColor = getWaveColor();

    // --- Init ---
    useEffect(() => {
        if (visualizerContainerRef.current && !visualizerRef.current) {
            visualizerRef.current = new AudioVisualizer(visualizerContainerRef.current, waveColor);
            visualizerRef.current.setMode('liquid'); // Ensure liquid mode is active
        }
        if (!recorderRef.current) recorderRef.current = new PronunciationRecorder();

        // Setup Speech Recognition
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

        return () => { visualizerRef.current?.stop(); };
    }, []);

    // Update visualizer color when state changes
    useEffect(() => {
        if (visualizerRef.current) {
            visualizerRef.current.setColor(waveColor);
            if (state === 'recording' || state === 'listening') {
                visualizerRef.current.start();
            }
        }
    }, [state, waveColor]);

    // --- Logic ---
    const handleListen = () => {
        if (state === 'recording') return;
        setState('listening');
        visualizerRef.current?.start();
        TTSManager.speakSwedish(word);

        // Auto-stop visualizer after approx speech duration (simulated)
        setTimeout(() => {
            if (state === 'listening') {
                setState('idle');
                visualizerRef.current?.stop();
            }
        }, word.length * 100 + 1000);
    };

    const toggleRecording = async () => {
        if (state !== 'recording') {
            // Start
            HapticFeedback.light();
            setState('recording');
            setScore(null);

            // Start Recorder and get Stream
            const stream = await recorderRef.current?.start();
            if (stream) {
                // Setup Audio Analysis for Visualizer
                if (!audioContextRef.current) {
                    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                }
                const ctx = audioContextRef.current;

                // Resume context if suspended (browser policy)
                if (ctx.state === 'suspended') await ctx.resume();

                audioSourceRef.current = ctx.createMediaStreamSource(stream);
                const analyser = ctx.createAnalyser();
                analyser.fftSize = 256;
                audioSourceRef.current.connect(analyser); // Connect source to analyser
                // Do NOT connect to destination to avoid feedback loop (echo)

                if (visualizerRef.current) {
                    visualizerRef.current.connectAnalyser(analyser);
                    visualizerRef.current.start();
                }
            } else {
                // Failed to start (Permission denied or other error)
                console.error('Failed to get media stream');
                setState('idle');
                HapticFeedback.error();
                return;
            }

            try { recognitionRef.current?.start(); } catch { }
        } else {
            // Stop
            HapticFeedback.success();
            setState('processing');

            // Stop Visualizer & Cleanup Audio
            visualizerRef.current?.stop();
            if (audioSourceRef.current) {
                audioSourceRef.current.disconnect();
                audioSourceRef.current = null;
            }
            // Optional: Close context or keep it reusable. Keeping it reusable is better.

            const blob = await recorderRef.current?.stop();
            setLastBlob(blob || null);
            try { recognitionRef.current?.stop(); } catch { }

            // Fallback timeout to result or idle if no recognition
            setTimeout(() => {
                setState(prev => (prev === 'processing' && score === null ? 'idle' : prev));
            }, 1500);
        }
    };

    const calculateScore = (spoken: string, confidence: number) => {
        const target = word.toLowerCase();
        let s = 0;
        if (spoken === target) s = Math.round(confidence * 100) + 10;
        else if (spoken.includes(target) || target.includes(spoken)) s = Math.round(confidence * 80);
        else s = Math.round(confidence * 40);
        s = Math.min(100, Math.max(0, s));

        setScore(s);
        setState('result');
    };

    const playRecording = () => {
        if (lastBlob) {
            HapticFeedback.light();
            PronunciationRecorder.playBlob(lastBlob);
        }
    };

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '400px',
            background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)',
            borderRadius: '32px',
            overflow: 'hidden',
            border: `1px solid ${waveColor}33`,
            boxShadow: `0 20px 60px -10px ${waveColor}22`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.5s ease'
        }}>
            {/* Background Pulse */}
            <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(circle at center, ${waveColor}11 0%, transparent 60%)`,
                animation: state === 'recording' ? 'pulse 1.5s infinite' : 'none',
                pointerEvents: 'none'
            }} />

            {/* Main Word Display */}
            <div style={{
                position: 'relative', zIndex: 10,
                fontSize: '3rem', fontWeight: '900',
                color: '#fff',
                textShadow: `0 0 30px ${waveColor}66`,
                marginBottom: '20px',
                textAlign: 'center',
                transition: 'all 0.3s'
            }}>
                {word}
                {/* Score Badge */}
                {state === 'result' && score !== null && (
                    <div style={{
                        position: 'absolute', top: '-25px', right: '-20px',
                        background: score > 80 ? '#22c55e' : '#eab308',
                        color: '#000', fontSize: '0.8rem', fontWeight: 'bold',
                        padding: '4px 10px', borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        animation: 'bounce 0.5s'
                    }}>
                        {score}%
                    </div>
                )}
            </div>

            {/* THE SONIC WAVE CONTAINER */}
            <div
                onClick={toggleRecording}
                style={{
                    width: '180px', height: '180px',
                    borderRadius: '50%',
                    background: 'rgba(0,0,0,0.3)',
                    border: `2px solid ${waveColor}44`,
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'transform 0.2s',
                    transform: state === 'recording' ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: `0 0 30px ${waveColor}22, inset 0 0 20px ${waveColor}11`
                }}
            >
                {/* Visualizer Canvas injected here */}
                <div ref={visualizerContainerRef} style={{ position: 'absolute', inset: -20, opacity: 0.8 }} />

                {/* Center Icon */}
                <div style={{
                    position: 'relative', zIndex: 5,
                    fontSize: '2.5rem',
                    color: '#fff',
                    textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                    pointerEvents: 'none'
                }}>
                    {state === 'recording' ? '⏹️' : state === 'listening' ? '🔊' : '🎙️'}
                </div>

                {/* Processing Spinner */}
                {state === 'processing' && (
                    <div style={{
                        position: 'absolute', inset: 0,
                        border: '4px solid transparent',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                )}
            </div>

            <div style={{ marginTop: '25px', display: 'flex', gap: '20px', zIndex: 10 }}>
                <button
                    onClick={(e) => { e.stopPropagation(); handleListen(); }}
                    style={{
                        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#fff', padding: '12px 24px', borderRadius: '30px',
                        fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                >
                    <span>Lyssna</span>
                </button>

                {lastBlob && (
                    <button
                        onClick={(e) => { e.stopPropagation(); playRecording(); }}
                        style={{
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff', padding: '12px 24px', borderRadius: '30px',
                            fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px'
                        }}
                    >
                        <span>Din röst</span>
                    </button>
                )}
            </div>

            <div style={{ marginTop: '15px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
                {state === 'idle' ? 'Tryck på cirkeln för att spela in' :
                    state === 'recording' ? 'Klicka för att stoppa' :
                        state === 'listening' ? 'Lyssnar...' : 'Bearbetar...'}
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0% { opacity: 0.5; transform: scale(1); } 50% { opacity: 0.8; transform: scale(1.02); } 100% { opacity: 0.5; transform: scale(1); } }
            `}</style>
        </div>
    );
};
