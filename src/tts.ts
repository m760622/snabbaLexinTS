/**
 * TTSManager - Text-to-Speech management with multi-provider fallback
 */

export interface TTSOptions {
    volume?: number;
    speed?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (error: Error) => void;
}

export const TTSManager = {
    // State Management
    audio: null as HTMLAudioElement | null,
    lastSpokenText: '',
    cachedSwedishVoice: null as SpeechSynthesisVoice | null,
    cachedVoices: {} as Record<string, SpeechSynthesisVoice[]>,
    audioUnlocked: false,
    timeoutId: null as any | null,
    isPlaying: false,
    audioCache: new Map<string, string>(),

    // Device Detection
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1),
    isSafari: /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    isAndroid: /Android/i.test(navigator.userAgent),

    // Configuration
    config: {
        defaultLang: 'sv-SE',
        fallbackLang: 'en-US',
        maxCacheSize: 50,
        timeoutMs: 3500,
        retryAttempts: 2
    },

    init() {
        console.log('🔊 TTSManager initializing...', {
            isIOS: this.isIOS,
            isSafari: this.isSafari,
            isAndroid: this.isAndroid
        });

        this._loadVoices();

        if (window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = () => {
                this._loadVoices();
            };
        }

        const unlockOnInteraction = () => {
            this.unlockAudio();
            document.removeEventListener('touchstart', unlockOnInteraction);
            document.removeEventListener('click', unlockOnInteraction);
        };
        document.addEventListener('touchstart', unlockOnInteraction, { passive: true });
        document.addEventListener('click', unlockOnInteraction, { passive: true });

        console.log('🔊 TTSManager initialized successfully');
    },

    _loadVoices() {
        if (!window.speechSynthesis) return;

        const voices = window.speechSynthesis.getVoices();
        if (!voices.length) return;

        this.cachedVoices = {};
        voices.forEach(voice => {
            const lang = voice.lang.substring(0, 2);
            if (!this.cachedVoices[lang]) {
                this.cachedVoices[lang] = [];
            }
            this.cachedVoices[lang].push(voice);
        });

        this.cachedSwedishVoice = this._findBestVoice('sv');
    },

    getSpeed(): number {
        const saved = localStorage.getItem('ttsSpeed');
        return saved ? parseFloat(saved) : 0.85;
    },

    setSpeed(speed: number): number {
        const clamped = Math.min(1.5, Math.max(0.5, speed));
        localStorage.setItem('ttsSpeed', clamped.toString());
        const showToast = (window as any).showToast;
        if (typeof showToast === 'function') {
            showToast(`Uttalshastighet: ${Math.round(clamped * 100)}% / سرعة النطق`);
        }
        return clamped;
    },

    unlockAudio() {
        if (this.audioUnlocked) return;

        // Method 1: HTML5 Audio
        try {
            const silentAudio = new Audio();
            silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
            silentAudio.volume = 0.01;
            silentAudio.play().then(() => silentAudio.pause()).catch(() => { });
        } catch (e) { }

        // Method 2: Web Audio API
        try {
            const AudioContextClass = (window as any).AudioContext || (window as any).webkitAudioContext;
            const audioContext = new AudioContextClass();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            gainNode.gain.value = 0;
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            oscillator.start(0);
            oscillator.stop(0.001);
            setTimeout(() => audioContext.close(), 100);
        } catch (e) { }

        // Method 3: SpeechSynthesis
        if (window.speechSynthesis) {
            try {
                const silentUtterance = new SpeechSynthesisUtterance('');
                silentUtterance.volume = 0;
                window.speechSynthesis.speak(silentUtterance);
                window.speechSynthesis.cancel();
            } catch (e) { }
        }

        this.audioUnlocked = true;
    },

    async speak(text: string, lang = 'sv', options: TTSOptions & { slow?: boolean } = {}) {
        if (!text || text.trim() === '') return;

        const cleanText = text.replace(/['']/g, "'").trim();

        if (cleanText === this.lastSpokenText && this.isPlaying) {
            return;
        }

        this.lastSpokenText = cleanText;
        const normalizedLang = this._normalizeLang(lang);

        const ProgressManager = (window as any).ProgressManager;
        if (typeof ProgressManager !== 'undefined') {
            ProgressManager.trackTTS(cleanText);
        }

        this.stop();
        this.isPlaying = true;

        if (options.onStart) options.onStart();

        // Custom Slow Mode Override
        if (options.slow) {
            options.speed = 0.45;
        }

        return this._speakWithProviders(cleanText, normalizedLang, options);
    },

    speakSwedish(text: string, options: TTSOptions = {}) {
        return this.speak(text, 'sv-SE', options);
    },

    speakArabic(text: string, options: TTSOptions = {}) {
        return this.speak(text, 'ar', options);
    },

    speakSlowly(text: string, lang = 'sv') {
        return this.speak(text, lang, { slow: true });
    },

    async _speakWithProviders(text: string, lang: string, options: TTSOptions) {
        const isOnline = navigator.onLine;

        // Priority changes when slow mode is requested (Local TTS handle rate better)
        const providers = (options as any).slow
            ? [
                { name: 'Local TTS', fn: () => this._playLocalTTS(text, lang, options) },
                { name: 'Google TTS', fn: () => this._playGoogleTTS(text, lang, options), requiresOnline: true }
            ]
            : [
                { name: 'Google TTS', fn: () => this._playGoogleTTS(text, lang, options), requiresOnline: true },
                { name: 'Local TTS', fn: () => this._playLocalTTS(text, lang, options) },
                { name: 'VoiceRSS', fn: () => this._playVoiceRSS(text, lang, options), requiresOnline: true }
            ];

        for (let i = 0; i < providers.length; i++) {
            const provider = providers[i];
            if (provider.requiresOnline && !isOnline) continue;

            try {
                await provider.fn();
                return;
            } catch (e: any) {
                console.warn(`🔊 ${provider.name} failed:`, e.message);
                if (i === providers.length - 1) {
                    this.isPlaying = false;
                    if (options.onError) options.onError(e);
                }
            }
        }
    },

    _playVoiceRSS(text: string, lang: string, options: TTSOptions = {}) {
        return new Promise<void>((resolve, reject) => {
            const API_KEY = 'a28d3d026971413cba0c492136085fae';
            const langMap: Record<string, string> = {
                'sv-SE': 'sv-se', 'sv': 'sv-se',
                'ar-SA': 'ar-sa', 'ar': 'ar-sa',
                'en-US': 'en-us', 'en': 'en-us'
            };

            const voiceLang = langMap[lang] || 'sv-se';
            this.audio = new Audio();
            const url = `https://api.voicerss.org/?key=${API_KEY}&hl=${voiceLang}&src=${encodeURIComponent(text)}&c=MP3&f=44khz_16bit_stereo`;

            this.audio.src = url;
            this.audio.volume = options.volume || 1.0;
            const speed = options.speed || this.getSpeed();

            this.audio.oncanplay = () => {
                try { this.audio!.playbackRate = speed; } catch (e) { }
            };

            this.audio.onended = () => {
                this.isPlaying = false;
                if (options.onEnd) options.onEnd();
                resolve();
            };

            this.audio.onerror = () => {
                this.isPlaying = false;
                reject(new Error('VoiceRSS audio error'));
            };

            const timeoutId = setTimeout(() => {
                if (this.audio && (this.audio.readyState < 2 || this.audio.paused)) {
                    this.audio.pause();
                    reject(new Error('VoiceRSS timeout'));
                }
            }, this.config.timeoutMs);

            this.audio.play().then(() => clearTimeout(timeoutId)).catch(reject);
        });
    },

    _playGoogleTTS(text: string, lang: string, options: TTSOptions = {}) {
        return new Promise<void>((resolve, reject) => {
            if (this.timeoutId) {
                clearTimeout(this.timeoutId);
                this.timeoutId = null;
            }

            this.audio = new Audio();
            const langCode = lang.substring(0, 2);
            const url1 = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=tw-ob&q=${encodeURIComponent(text)}`;
            const url2 = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${langCode}&client=gtx&q=${encodeURIComponent(text)}`;

            const handleFallback = () => {
                if (!this.audio) return;
                this.audio.src = url2;
                this.audio.onerror = () => {
                    this.isPlaying = false;
                    reject(new Error('Google TTS failed'));
                };
                this.audio.play().catch(reject);
            };

            this.audio.src = this.audioCache.get(url1) || url1;
            this.audio.volume = options.volume || 1.0;
            const speed = options.speed || this.getSpeed();

            this.audio.oncanplay = () => {
                try { this.audio!.playbackRate = speed; } catch (e) { }
            };

            this.audio.onended = () => {
                this.isPlaying = false;
                if (options.onEnd) options.onEnd();
                resolve();
            };

            this.audio.onerror = handleFallback;

            this.timeoutId = setTimeout(() => {
                if (this.audio && (this.audio.readyState < 2 || this.audio.paused)) {
                    this.audio.pause();
                    reject(new Error('Google TTS timeout'));
                }
            }, this.config.timeoutMs);

            this.audio.play().then(() => {
                if (!this.audioCache.has(url1)) {
                    if (this.audioCache.size >= this.config.maxCacheSize) {
                        const firstKey = this.audioCache.keys().next().value;
                        if (firstKey) this.audioCache.delete(firstKey);
                    }
                    this.audioCache.set(url1, url1);
                }
            }).catch(handleFallback);
        });
    },

    _playLocalTTS(text: string, lang: string, options: TTSOptions = {}) {
        return new Promise<void>((resolve, reject) => {
            if (!window.speechSynthesis) {
                reject(new Error('Local TTS not supported'));
                return;
            }

            window.speechSynthesis.cancel();
            const delay = this.isIOS ? 250 : 50;

            setTimeout(() => {
                let speakText = this._prepareTextForSpeech(text, lang);
                const utterance = new SpeechSynthesisUtterance(speakText);
                utterance.lang = lang;
                const speed = options.speed || this.getSpeed();

                if (this.isIOS) {
                    utterance.rate = Math.max(0.6, speed * 0.75);
                } else {
                    utterance.rate = speed * 0.9;
                }

                const setVoiceAndSpeak = () => {
                    const voices = window.speechSynthesis.getVoices();
                    const langCode = lang.substring(0, 2);
                    let voice: SpeechSynthesisVoice | null = null;

                    // Voice Preference Logic
                    const pref = localStorage.getItem('ttsVoicePreference') || 'natural';

                    if (langCode === 'sv') {
                        const swedishPriority = pref === 'male'
                            ? ['Oskar', 'Svenska']
                            : pref === 'female'
                                ? ['Alva', 'Klara', 'Maja']
                                : ['Alva', 'Klara', 'Oskar', 'Svenska'];

                        for (const name of swedishPriority) {
                            voice = voices.find(v => v.name.includes(name) && v.lang.includes('sv')) || null;
                            if (voice) break;
                        }
                        if (!voice) voice = voices.find(v => v.lang.includes('sv')) || null;
                    } else {
                        voice = this._findBestVoice(langCode);
                    }

                    if (voice) utterance.voice = voice;

                    // Karaoke Hook
                    utterance.onboundary = (event) => {
                        if (event.name === 'word') {
                            const word = speakText.substring(event.charIndex, event.charIndex + event.charLength);
                            const eventDetail = {
                                word,
                                charIndex: event.charIndex,
                                charLength: event.charLength,
                                text: speakText
                            };
                            window.dispatchEvent(new CustomEvent('tts-boundary', { detail: eventDetail }));
                        }
                    };

                    window.speechSynthesis.speak(utterance);
                };

                utterance.onstart = () => {
                    window.dispatchEvent(new CustomEvent('tts-start', { detail: { text: speakText } }));
                };

                utterance.onend = () => {
                    this.isPlaying = false;
                    window.dispatchEvent(new CustomEvent('tts-end'));
                    if (options.onEnd) options.onEnd();
                    resolve();
                };

                utterance.onerror = (e) => {
                    this.isPlaying = false;
                    window.dispatchEvent(new CustomEvent('tts-error', { detail: e }));
                    if (e.error !== 'interrupted') {
                        this.isIOS ? resolve() : reject(e);
                    } else {
                        resolve();
                    }
                };

                if (window.speechSynthesis.getVoices().length === 0) {
                    window.speechSynthesis.onvoiceschanged = () => {
                        setVoiceAndSpeak();
                        window.speechSynthesis.onvoiceschanged = null;
                    };
                    setTimeout(setVoiceAndSpeak, 500);
                } else {
                    setVoiceAndSpeak();
                }

            }, delay);
        });
    },

    _prepareTextForSpeech(text: string, lang: string): string {
        let prepared = text;
        if (lang.startsWith('sv')) {
            prepared = prepared.replace(/,/g, ', ').replace(/\./g, '. ');
            prepared = prepared.replace(/(\d+)/g, ' $1 ');
            if (this.isIOS && !prepared.match(/[.!?]$/)) prepared = prepared + '.';
        }
        if (lang.startsWith('ar')) {
            prepared = prepared.replace(/،/g, ', ');
        }
        return prepared.trim();
    },

    _findBestVoice(langCode: string): SpeechSynthesisVoice | null {
        if (langCode === 'sv' && this.cachedSwedishVoice) return this.cachedSwedishVoice;
        const voices = this.cachedVoices[langCode] || [];
        if (!voices.length) return null;
        const premiumKeywords = ['Premium', 'Enhanced', 'Neural', 'Natural', 'Alva', 'Maja', 'Astrid', 'Samantha', 'Karen', 'Daniel', 'Maged', 'Majed', 'Tarik'];
        const lowQualityKeywords = ['Compact', 'eSpeak', 'Android'];

        const pref = localStorage.getItem('ttsVoicePreference') || 'natural';

        for (const keyword of premiumKeywords) {
            const match = voices.find(v => {
                const nameMatch = v.name.includes(keyword);
                const genderMatch = pref === 'male' ? (v.name.includes('Daniel') || v.name.includes('Maged')) : true;
                return nameMatch && genderMatch && !lowQualityKeywords.some(lq => v.name.includes(lq));
            });
            if (match) return match;
        }
        return voices.find(v => !lowQualityKeywords.some(lq => v.name.includes(lq))) || voices[0];
    },

    _normalizeLang(lang: string): string {
        const langMap: Record<string, string> = { 'sv': 'sv-SE', 'ar': 'ar-SA', 'en': 'en-US', 'de': 'de-DE', 'fr': 'fr-FR' };
        return langMap[lang] || lang;
    },

    stop() {
        if (this.audio) { try { this.audio.pause(); this.audio.currentTime = 0; } catch (e) { } }
        if (window.speechSynthesis) { try { window.speechSynthesis.cancel(); } catch (e) { } }
        if (this.timeoutId) { clearTimeout(this.timeoutId); this.timeoutId = null; }
        this.isPlaying = false;
        window.dispatchEvent(new CustomEvent('tts-stop'));
    }

};

export function speakText(text: string, lang = 'sv') { return TTSManager.speak(text, lang); }
export function speakSwedish(text: string) { return TTSManager.speak(text, 'sv-SE'); }
export function speakArabic(text: string) { return TTSManager.speak(text, 'ar'); }

// Global exports for legacy support
if (typeof window !== 'undefined') {
    (window as any).TTSManager = TTSManager;
    (window as any).speakText = speakText;
    (window as any).speakSwedish = speakSwedish;
    (window as any).speakArabic = speakArabic;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => TTSManager.init());
    } else {
        TTSManager.init();
    }
}
