import './config';
// import './loader'; // Optimized: Load only specific word
import { DictionaryDB } from './db';
import { ThemeManager, showToast, TextSizeManager } from './utils';
import { TTSManager } from './tts';
import { FavoritesManager } from './favorites';
import { QuizStats } from './quiz-stats';
import { t, tLang, LanguageManager } from './i18n';
import { AudioVisualizer, PronunciationRecorder, HapticFeedback, Celebrations, MasteryBadges } from './ui-enhancements';
import { PronunciationHelper } from './pronunciation-data';
import { TypeColorSystem } from './type-color-system';

// ... (Previous imports)

/**
 * Heart Explosion Effect Manager
 */
class HeartExplosion {
    static spawn(x: number, y: number) {
        const count = 15;
        for (let i = 0; i < count; i++) {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.className = 'heart-particle';

            // Random spread for explosion effect
            const tx = (Math.random() - 0.5) * 100; // Spread -50px to 50px
            const ty = (Math.random() - 1) * 100;   // Upward mostly

            heart.style.left = x + 'px';
            heart.style.top = y + 'px';
            heart.style.setProperty('--tx', `${tx}px`);

            // Random size variation
            const scale = 0.5 + Math.random() * 1;
            heart.style.transform = `scale(${scale})`;

            document.body.appendChild(heart);

            // Cleanup
            setTimeout(() => heart.remove(), 1000);
        }
    }
}

/**
 * Smart Expandable Card Logic
 */
class SmartCardManager {
    static init(container: HTMLElement) {
        // Find Sections: Definition and Examples
        const sections = container.querySelectorAll('.details-section');

        sections.forEach((section: Element) => {
            const sec = section as HTMLElement;
            // Only sections with specific content are candidates
            if (!sec.querySelector('.definition-card') && !sec.querySelector('.example-card')) return;

            // Wait for render/layout
            setTimeout(() => {
                if (sec.scrollHeight > 250) {
                    sec.classList.add('expandable');

                    const mask = document.createElement('div');
                    mask.className = 'expand-mask';

                    const btn = document.createElement('button');
                    btn.className = 'expand-btn';
                    btn.innerHTML = 'Visa mer <span class="ar-text">عرض المزيد</span>';

                    btn.addEventListener('click', () => {
                        sec.classList.add('expanded');
                        // Optional: remove mask/btn completely or animate them out
                    });

                    mask.appendChild(btn);
                    sec.appendChild(mask);
                }
            }, 100);
        });
    }
}

/**
 * Pronunciation Lab Manager
 * مختبر النطق - يدير التفاعل الصوتي والمرئي
 */
class PronunciationLab {
    private static visualizer: AudioVisualizer | null = null;
    private static recorder: PronunciationRecorder | null = null;
    private static currentWord: string = '';
    private static recognition: any = null;
    private static currentLevel: 'listen' | 'repeat' | 'challenge' = 'listen';

    static init(word: string) {
        this.currentWord = word;

        try {
            if (!this.visualizer) {
                // Turquoise color #2dd4bf (Teal-400) or #14b8a6 (Teal-500)
                this.visualizer = new AudioVisualizer('audioVisualizerContainer', '#2dd4bf');
                this.visualizer.setMode('liquid'); // Use wave mode as requested
            }
            if (!this.recorder) {
                this.recorder = new PronunciationRecorder();
            }

            this.setupEvents();
            this.setupPracticeLevels();
            this.renderStaticInfo();
            this.initSpeechRecognition();
        } catch (e) {
            console.warn('PronunciationLab init failed:', e);
        }
    }

    private static setupPracticeLevels() {
        const container = document.getElementById('practiceLevelsContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="practice-levels">
                <button class="practice-level-btn active" data-level="listen">
                    <span class="practice-level-icon">👂</span>
                    <span class="sv-text">Lyssna</span><span class="ar-text">استمع</span>
                </button>
                <button class="practice-level-btn" data-level="repeat">
                    <span class="practice-level-icon">🔁</span>
                    <span class="sv-text">Upprepa</span><span class="ar-text">كرر</span>
                </button>
                <button class="practice-level-btn" data-level="challenge">
                    <span class="practice-level-icon">🎯</span>
                    <span class="sv-text">Utmaning</span><span class="ar-text">تحدي</span>
                </button>
            </div>
        `;

        container.querySelectorAll('.practice-level-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                container.querySelectorAll('.practice-level-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentLevel = (btn as HTMLElement).dataset.level as any;
                this.updateUIForLevel();
            });
        });
    }

    private static updateUIForLevel() {
        const normalBtn = document.getElementById('pronounceNormalBtn');
        const recordSection = document.getElementById('recordingSection');
        const instruction = document.getElementById('modeInstruction');

        if (this.currentLevel === 'listen') {
            normalBtn?.classList.remove('hidden');
            recordSection?.classList.add('hidden');
            if (instruction) instruction.innerHTML = '<span class="sv-text">Lyssna noga på uttalet.</span><span class="ar-text">استمع جيداً للنطق الصحيح.</span>';
        } else if (this.currentLevel === 'repeat') {
            normalBtn?.classList.remove('hidden');
            recordSection?.classList.remove('hidden');
            if (instruction) instruction.innerHTML = '<span class="sv-text">Lyssna först, spela sedan in.</span><span class="ar-text">استمع أولاً، ثم سجل صوتك.</span>';
        } else { // challenge
            normalBtn?.classList.add('hidden');
            recordSection?.classList.remove('hidden');
            if (instruction) instruction.innerHTML = '<span class="sv-text">Kan du ordet? Spela in direkt!</span><span class="ar-text">هل تعرف الكلمة؟ سجلها مباشرة!</span>';
        }
    }

    private static setupEvents() {
        const normalBtn = document.getElementById('pronounceNormalBtn');
        const recordBtn = document.getElementById('recordBtn');
        const playRecordedBtn = document.getElementById('playRecordedBtn');
        const speedSlider = document.getElementById('ttsSpeedSlider') as HTMLInputElement;
        const speedVal = document.getElementById('speedValue');
        const speedValAr = document.getElementById('speedValueAr');

        // Init Slider
        if (speedSlider) {
            const currentSpeed = TTSManager.getSpeed();
            speedSlider.value = currentSpeed.toString();
            if (speedVal) speedVal.textContent = `${currentSpeed}x`;
            if (speedValAr) speedValAr.textContent = `${currentSpeed}x`;

            speedSlider.addEventListener('input', (e) => {
                const val = parseFloat((e.target as HTMLInputElement).value);
                TTSManager.setSpeed(val);
                if (speedVal) speedVal.textContent = `${val}x`;
                if (speedValAr) speedValAr.textContent = `${val}x`;
            });
        }

        normalBtn?.addEventListener('click', () => {
            HapticFeedback.light();
            TTSManager.speakSwedish(this.currentWord);
        });

        // Repeat Button Logic
        const repeatBtn = document.getElementById('repeatBtn');
        const repeatSelect = document.getElementById('repeatCount') as HTMLSelectElement;
        let isRepeating = false;
        let stopRepeat = false;

        repeatBtn?.addEventListener('click', async () => {
            // Toggle stop if already repeating
            if (isRepeating) {
                stopRepeat = true;
                return;
            }

            HapticFeedback.medium();
            const value = repeatSelect?.value || '3';
            const isInfinite = value === 'infinite';
            const count = isInfinite ? Infinity : parseInt(value);

            isRepeating = true;
            stopRepeat = false;
            repeatBtn.classList.add('active');

            // Change button text to "Stop" during repeat
            const originalHTML = repeatBtn.innerHTML;
            repeatBtn.innerHTML = '⏹️ <span class="sv-text">Stopp</span><span class="ar-text">إيقاف</span>';

            let i = 0;
            while (i < count && !stopRepeat) {
                await new Promise<void>(resolve => {
                    TTSManager.speakSwedish(this.currentWord);
                    const onEnd = () => {
                        window.removeEventListener('tts-end', onEnd);
                        setTimeout(resolve, 800);
                    };
                    window.addEventListener('tts-end', onEnd);
                });
                i++;
            }

            // Reset button state
            isRepeating = false;
            stopRepeat = false;
            repeatBtn.classList.remove('active');
            repeatBtn.innerHTML = originalHTML;
        });

        recordBtn?.addEventListener('click', () => this.toggleRecording());

        playRecordedBtn?.addEventListener('click', async () => {
            HapticFeedback.light();
            const blob = (this as any).lastRecordedBlob;
            if (blob) PronunciationRecorder.playBlob(blob);
        });

        // TTS Events for Visualizer & Karaoke
        window.addEventListener('tts-start', () => {
            this.visualizer?.start();
            this.updateKaraokeActive(true);
            document.getElementById('audioVisualizerContainer')?.classList.add('active');
            this.startSyllableHighlight(); // Start syllable animation
        });

        window.addEventListener('tts-end', () => {
            this.visualizer?.stop();
            this.updateKaraokeActive(false);
            document.getElementById('audioVisualizerContainer')?.classList.remove('active');
            this.stopSyllableHighlight(); // Stop syllable animation
        });

        window.addEventListener('tts-boundary', (e: any) => {
            this.highlightWord(e.detail.word);
        });
    }

    private static syllableInterval: any = null;

    private static startSyllableHighlight() {
        const syllables = document.querySelectorAll('.syllable-chip');
        if (syllables.length === 0) return;

        // Clear any existing highlight
        syllables.forEach(s => s.classList.remove('active'));

        // 1. Estimate total duration based on word length and speed
        // Average speaking rate ~ 12-15 chars per second for normal speech
        // We add some buffer for startup delay
        const totalChars = this.currentWord.length;
        const speed = parseFloat(localStorage.getItem('ttsSpeed') || '0.85');

        // Base duration calculation: (Chars * ms_per_char) / speed
        // + extra time for "slower" Swedish pronunciation usually found in TTS
        const estimatedDuration = (totalChars * 80) / speed;

        // 2. Calculate duration for each syllable based on its length weight
        const syllableDurations: number[] = [];
        let totalWeight = 0;

        syllables.forEach(el => {
            const textHTML = el.textContent || '';
            const weight = Math.max(1, textHTML.length); // Min weight 1
            totalWeight += weight;
            // Store temporarily
            (el as any)._weight = weight;
        });

        // Distribute estimated duration
        syllables.forEach((el, index) => {
            const weight = (el as any)._weight;
            const duration = (weight / totalWeight) * estimatedDuration;
            syllableDurations[index] = Math.max(200, duration); // Min duration 200ms
        });

        let currentIndex = 0;

        const highlightNext = () => {
            if (currentIndex >= syllables.length) return; // Stop if done

            // Clear previous
            if (currentIndex > 0) syllables[currentIndex - 1].classList.remove('active');

            // Highlight current
            const currentEl = syllables[currentIndex];
            currentEl.classList.add('active');

            const duration = syllableDurations[currentIndex];
            currentIndex++;

            // Schedule next
            this.syllableInterval = setTimeout(highlightNext, duration);
        };

        // Start correctly
        highlightNext();
    }

    private static stopSyllableHighlight() {
        if (this.syllableInterval) {
            clearTimeout(this.syllableInterval); // Changed to clearTimeout
            this.syllableInterval = null;
        }
        // Remove all highlights
        document.querySelectorAll('.syllable-chip').forEach(s => s.classList.remove('active'));
    }

    private static renderStaticInfo() {
        // Karaoke Display
        const karaoke = document.getElementById('karaokeDisplay');
        if (karaoke) {
            karaoke.innerHTML = this.currentWord.split(' ').map((word, i) =>
                `<span class="karaoke-word" data-word-index="${i}">${word}</span>`
            ).join(' ');

            // Apply text auto-sizing for long words
            karaoke.setAttribute('data-auto-size', '');
            karaoke.setAttribute('data-max-lines', '1');
            setTimeout(() => TextSizeManager.apply(karaoke, this.currentWord, 1, 2.5), 50); // Base size 2.5rem
        }

        // Syllables
        const syllableDisplay = document.getElementById('syllableDisplay');
        if (syllableDisplay) {
            const syllables = PronunciationHelper.splitIntoSyllables(this.currentWord);
            syllableDisplay.innerHTML = syllables.map(s => `<span class="syllable-chip" data-auto-size data-max-lines="1">${s}</span>`).join('');
            // Apply text size after rendering
            setTimeout(() => TextSizeManager.applyToContainer(syllableDisplay), 50);
        }

        // Tips
        const tipsArea = document.getElementById('phoneticTipsArea');
        if (tipsArea) {
            const tips = PronunciationHelper.getTipsForWord(this.currentWord);
            tipsArea.innerHTML = tips.map(tip => `
                <div class="tip-card">
                    <div class="tip-title">💡 <span class="sv-text">Tips</span><span class="ar-text">نصيحة</span></div>
                    <div class="tip-text">${LanguageManager.getLanguage() === 'sv' ? tip.tip.sv : tip.tip.ar}</div>
                    <div class="tip-ex">Ex: ${tip.example}</div>
                </div>
            `).join('');
        }
    }

    private static highlightWord(word: string) {
        const karaoke = document.getElementById('karaokeDisplay');
        if (!karaoke) return;

        const spans = karaoke.querySelectorAll('.karaoke-word');
        spans.forEach(span => {
            const spanWord = span.textContent?.toLowerCase().replace(/[.,!?;:]/g, '');
            const targetWord = word.toLowerCase().replace(/[.,!?;:]/g, '');

            if (spanWord === targetWord) {
                span.classList.add('active');
                setTimeout(() => span.classList.remove('active'), 800);
            }
        });
    }

    private static updateKaraokeActive(active: boolean) {
        const karaoke = document.getElementById('karaokeDisplay');
        if (karaoke) {
            if (active) karaoke.classList.add('playing');
            else karaoke.classList.remove('playing');
        }
    }

    private static isRecording = false;
    private static async toggleRecording() {
        const recordBtn = document.getElementById('recordBtn');
        const feedback = document.getElementById('recordingFeedback');
        const playback = document.getElementById('playbackArea');
        const labSection = document.querySelector('.pronunciation-lab-section');

        if (!this.isRecording) {
            // Start
            this.isRecording = true;
            recordBtn?.classList.add('active');
            recordBtn!.innerHTML = `⏹️ <span class="sv-text">Stoppa</span><span class="ar-text">إيقاف</span>`;
            feedback?.classList.remove('hidden');
            playback?.classList.add('hidden');
            labSection?.classList.add('recording');

            this.visualizer?.start();
            document.querySelector('.audio-visualizer-canvas')?.classList.add('recording');
            await this.recorder?.start();
            this.startSpeechRecognition();
        } else {
            // Stop
            this.isRecording = false;
            recordBtn?.classList.remove('active');
            recordBtn!.innerHTML = `🎙️ <span class="sv-text">Spela in</span><span class="ar-text">تسجيل</span>`;
            feedback?.classList.add('hidden');
            labSection?.classList.remove('recording');
            document.querySelector('.audio-visualizer-canvas')?.classList.remove('recording');

            this.visualizer?.stop();
            const blob = await this.recorder?.stop();
            (this as any).lastRecordedBlob = blob;
            playback?.classList.remove('hidden');

            this.stopSpeechRecognition();
        }
    }

    private static initSpeechRecognition() {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'sv-SE';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event: any) => {
            const spokenText = event.results[0][0].transcript.toLowerCase();
            const confidence = event.results[0][0].confidence;
            this.calculateScore(spokenText, confidence);
        };
    }

    private static startSpeechRecognition() {
        if (this.recognition) {
            try { this.recognition.start(); } catch (e) { }
        }
    }

    private static stopSpeechRecognition() {
        if (this.recognition) {
            try { this.recognition.stop(); } catch (e) { }
        }
    }

    private static calculateScore(spoken: string, confidence: number) {
        const target = this.currentWord.toLowerCase();
        let score = 0;

        if (spoken === target) {
            score = Math.round(confidence * 100);
        } else {
            if (spoken.includes(target) || target.includes(spoken)) {
                score = Math.round(confidence * 80);
            } else {
                score = Math.round(confidence * 40);
            }
        }

        const scoreEl = document.getElementById('pronunciationScore');
        const badgeContainer = document.getElementById('masteryBadgeContainer');
        const labSection = document.querySelector('.pronunciation-lab-section');

        if (scoreEl) {
            scoreEl.innerHTML = `⭐ <span class="sv-text">Resultat: ${score}%</span><span class="ar-text">النتيجة: ${score}%</span>`;

            // Show success state
            if (score > 50) {
                labSection?.classList.add('success');
                setTimeout(() => labSection?.classList.remove('success'), 2000);
            }

            // High score celebration with gold particles
            if (score > 80) {
                // Confetti removed per user request
                HapticFeedback.success();
                this.showGoldParticles();
            }

            // Render mastery badge
            if (badgeContainer) {
                badgeContainer.innerHTML = ''; // Clear previous
                MasteryBadges.renderBadge(score, badgeContainer);
            }
        }
    }

    private static showGoldParticles() {
        const container = document.getElementById('audioVisualizerContainer');
        if (!container) return;

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'gold-particle';
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDelay = `${Math.random() * 0.5}s`;
            container.appendChild(particle);

            setTimeout(() => particle.remove(), 1500);
        }
    }
}


/**
 * Smart Link Processor - Linkifies definitions
 */
class SmartLinkProcessor {
    static process(text: string): string {
        if (!text) return '';

        // Match words that are likely to be in the dictionary (Swedish words)
        // We look for sequences of Swedish characters, avoiding common short words or numeric refs
        return text.replace(/([a-zåäöA-ZÅÄÖ]{4,})/g, (match) => {
            return `<span class="smart-link" data-word="${match.toLowerCase()}">${match}</span>`;
        });
    }

    static setupListeners(container: HTMLElement) {
        container.querySelectorAll('.smart-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                const word = (e.currentTarget as HTMLElement).dataset.word;
                if (word) {
                    // 1. Search for the word in dictionary (fast global lookup)
                    const data = (window as any).dictionaryData as any[][];
                    let found = data?.find(row => row[2].toLowerCase() === word);

                    // 2. Try DB if global data not ready
                    if (!found) {
                        try {
                            const allWords = await DictionaryDB.getAllWords();
                            found = allWords?.find(row => row[2].toLowerCase() === word);
                        } catch (err) {
                            console.warn('[SmartLink] DB fallback fail:', err);
                        }
                    }

                    if (found) {
                        window.location.href = `details.html?id=${found[0]}`;
                    } else {
                        // Fallback to home search
                        window.location.href = `index.html?s=${word}`;
                    }
                }
            });
        });
    }
}

/**
 * Personal Notes Manager
 */
class NotesManager {
    static async init(wordId: string) {
        const textarea = document.getElementById('wordNotes') as HTMLTextAreaElement;
        const saveBtn = document.getElementById('saveNotesBtn');
        const status = document.getElementById('notesStatus');

        if (!textarea || !saveBtn) return;

        // Load existing note
        const note = await DictionaryDB.getNote(wordId);
        if (note) textarea.value = note;

        saveBtn.onclick = async () => {
            const text = textarea.value.trim();
            (saveBtn as HTMLButtonElement).disabled = true;
            if (status) status.innerHTML = `<span class="sv-text">${t('details.saving')}</span><span class="ar-text">${t('details.saving')}</span>`;

            const success = await DictionaryDB.saveNote(wordId, text);

            (saveBtn as HTMLButtonElement).disabled = false;
            if (status) {
                status.innerHTML = success
                    ? `<span class="sv-text">${t('details.saved')}</span><span class="ar-text">${t('details.saved')}</span>`
                    : `<span class="sv-text">${t('common.error')}</span><span class="ar-text">${t('common.error')}</span>`;
                setTimeout(() => { status.innerHTML = ''; }, 3000);
            }
        };
    }
}

/**
 * Quiz Sound Manager - Web Audio API for feedback sounds
 */
class QuizSoundManager {
    private static audioContext: AudioContext | null = null;

    private static getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    static playCorrect() {
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Happy ascending notes
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.4);
    }

    static playWrong() {
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        // Descending buzz
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.3);
    }

    static playTick() {
        const ctx = this.getContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    }
}

/**
 * Emoji Quiz Helper - Maps words to emojis for "Picture" Quiz
 */
class EmojiQuizHelper {
    private static emojiMap: Record<string, string> = {
        // Animals
        'hund': '🐶', 'katt': '🐱', 'fågel': '🐦', 'häst': '🐴', 'ko': '🐮',
        'gris': '🐷', 'får': '🐑', 'kanin': '🐰', 'björn': '🐻', 'lejon': '🦁',
        'tiger': '🐯', 'elefant': '🐘', 'apa': '🐵', 'fisk': '🐟', 'val': '🐋',
        'orm': '🐍', 'spindel': '🕷️', 'bi': '🐝', 'fjäril': '🦋', 'räv': '🦊',
        'älg': '🫎', 'varg': '🐺', 'mus': '🐭', 'groda': '🐸', 'sköldpadda': '🐢',

        // Nature
        'sol': '☀️', 'måne': '🌙', 'stjärna': '⭐', 'moln': '☁️', 'regn': '🌧️',
        'snö': '❄️', 'eld': '🔥', 'vatten': '💧', 'träd': '🌳', 'blomma': '🌸',
        'skog': '🌲', 'berg': '🏔️', 'hav': '🌊', 'strand': '6🏖️', 'ö': '🏝️',
        'blad': '🍃', 'gräs': '🌱', 'sten': '🪨', 'regnbåge': '🌈', 'blixt': '⚡',

        // Food
        'äpple': '🍎', 'banan': '🍌', 'päron': '🍐', 'apelsin': '🍊', 'citron': '🍋',
        'druvor': '🍇', 'jordgubbe': '🍓', 'tomat': '🍅', 'potatis': '🥔', 'morot': '🥕',
        'bröd': '🍞', 'kött': '🥩', 'ägg': '🥚', 'ost': '🧀', 'pizza': '🍕',
        'burgare': '🍔', 'glass': '🍦', 'kaka': '🍰', 'kaffe': '☕', 'mjölk': '🥛',
        'ris': '🍚', 'sås': '🥣', 'kyckling': '🍗',

        // Objects/Home
        'hus': '🏠', 'bil': '🚗', 'cykel': '🚲', 'båt': '⛵', 'flygplan': '✈️',
        'tåg': '🚆', 'buss': '🚌', 'dator': '💻', 'telefon': '📱', 'klocka': '⌚',
        'bok': '📖', 'penna': '✏️', 'stol': '🪑', 'säng': '🛌', 'nyckel': '🔑',
        'väska': '👜', 'glasögon': '👓', 'hatt': '🎩', 'skor': '👞', 'kläder': '👕',
        'dörr': '🚪', 'fönster': '🪟', 'bord': '5️⃣', 'lampa': '💡', 'sax': '✂️',

        // Body
        'öga': '👁️', 'öra': '👂', 'näsa': '👃', 'mun': '👄', 'hand': '✋',
        'fot': '🦶', 'hjärta': '❤️', 'hjärna': '🧠', 'tand': '🦷', 'hår': '💇',

        // People/Professions
        'läkare': '👨‍⚕️', 'lärare': '🧑‍🏫', 'polis': '👮', 'bebis': '👶', 'kvinna': '👩',
        'man': '👨', 'flicka': '👧', 'pojke': '👦', 'familj': '👨‍👩‍👧‍👦', 'kung': '👑',
    };

    static getEmoji(word: string): string | null {
        const lower = word.toLowerCase();
        // Exact match
        if (this.emojiMap[lower]) return this.emojiMap[lower];

        // Prefix match (for compounds e.g. "fotboll" -> "fot" maybe?) - careful
        // Let's stick to safe matches or simple normalization

        // Return random if in dev/test mode? No, better strict.
        return null;
    }

    static hasEmoji(word: string): boolean {
        return !!this.getEmoji(word);
    }
}

/**
 * Mini Quiz Manager - EXTREME DIFFICULTY Distractor Generation
 * Uses linguistic analysis to create maximum confusion
 */
type QuizDifficulty = 'easy' | 'medium' | 'hard';

class MiniQuizManager {
    private static difficulty: QuizDifficulty = 'medium';
    private static consecutiveCorrect = 0;

    static setDifficulty(level: QuizDifficulty) {
        this.difficulty = level;
        console.log(`[Quiz] Difficulty set to: ${level}`);
    }

    static adjustDifficulty(isCorrect: boolean) {
        if (isCorrect) {
            this.consecutiveCorrect++;
            if (this.consecutiveCorrect >= 3 && this.difficulty !== 'hard') {
                this.setDifficulty(this.difficulty === 'easy' ? 'medium' : 'hard');
                this.consecutiveCorrect = 0;
                // Show toast for level up?
            }
        } else {
            this.consecutiveCorrect = 0;
            if (this.difficulty !== 'easy') {
                this.setDifficulty(this.difficulty === 'hard' ? 'medium' : 'easy');
            }
        }
    }

    static getTimeLimit(): number {
        switch (this.difficulty) {
            case 'easy': return 15;
            case 'medium': return 10;
            case 'hard': return 5;
            default: return 10;
        }
    }

    /**
     * Extract Arabic morphological features for matching
     */
    private static getArabicFeatures(text: string) {
        const hasAl = text.startsWith('ال');  // Definite article
        const hasTaa = text.endsWith('ة');    // Ta marbuta (feminine)
        const hasWaw = text.includes('و');    // Waw conjunction
        const hasYaa = text.endsWith('ي') || text.endsWith('ى');  // Ya ending
        const hasPlural = text.endsWith('ون') || text.endsWith('ين') || text.endsWith('ات');
        const wordCount = text.split(' ').length;
        return { hasAl, hasTaa, hasWaw, hasYaa, hasPlural, wordCount, length: text.length };
    }

    /**
     * Score how similar two Arabic texts are (higher = more confusing)
     */
    private static similarityScore(text1: string, text2: string): number {
        const f1 = this.getArabicFeatures(text1);
        const f2 = this.getArabicFeatures(text2);

        let score = 0;
        if (f1.hasAl === f2.hasAl) score += 3;           // Same definite article
        if (f1.hasTaa === f2.hasTaa) score += 2;         // Same feminine ending
        if (f1.hasPlural === f2.hasPlural) score += 2;   // Same plural pattern
        if (f1.hasYaa === f2.hasYaa) score += 1;         // Same ya ending
        if (f1.wordCount === f2.wordCount) score += 3;   // Same word count (critical!)
        if (Math.abs(f1.length - f2.length) <= 1) score += 4;  // Almost same length
        if (Math.abs(f1.length - f2.length) === 0) score += 3; // Exact length bonus

        // First letter match
        if (text1.charAt(0) === text2.charAt(0)) score += 2;
        // Last letter match  
        if (text1.charAt(text1.length - 1) === text2.charAt(text2.length - 1)) score += 2;

        return score;
    }

    /**
     * Generate EXTREMELY DECEPTIVE distractors using linguistic analysis
     */
    static getSmartDistractors(wordData: any[], allData: any[][], count: number = 3): string[] {
        const type = wordData[1];
        const arb = wordData[3];
        const swe = wordData[2];

        const distractors: string[] = [];
        const used = new Set<string>([arb]);

        // Score ALL candidates and sort by similarity
        const candidates = allData
            .filter(row => row[3] !== arb && row[1] === type)
            .map(row => ({
                text: row[3],
                score: this.similarityScore(arb, row[3])
            }))
            .sort((a, b) => b.score - a.score);  // Highest score first (most confusing)

        // Pick top scoring candidates
        for (const candidate of candidates) {
            if (distractors.length >= count) break;
            if (!used.has(candidate.text)) {
                distractors.push(candidate.text);
                used.add(candidate.text);
            }
        }

        // Fallback: any same type
        if (distractors.length < count) {
            for (const row of allData.sort(() => Math.random() - 0.5)) {
                if (distractors.length >= count) break;
                if (!used.has(row[3])) {
                    distractors.push(row[3]);
                    used.add(row[3]);
                }
            }
        }

        console.log('[Quiz] EXTREME distractors:', {
            correct: arb,
            features: this.getArabicFeatures(arb),
            distractors: distractors.map(d => ({
                text: d,
                score: this.similarityScore(arb, d),
                features: this.getArabicFeatures(d)
            }))
        });
        return distractors;
    }

    private static pickRandom(source: any[][], distractors: string[], used: Set<string>, max: number) {
        const shuffled = source.sort(() => Math.random() - 0.5);
        for (const row of shuffled) {
            if (distractors.length >= distractors.length + max) break;
            if (max <= 0) break;
            if (!used.has(row[3])) {
                distractors.push(row[3]);
                used.add(row[3]);
                max--;
            }
        }
    }

    /**
     * Score Swedish word similarity (higher = more confusing)
     */
    private static swedishSimilarityScore(swe1: string, swe2: string): number {
        let score = 0;

        // EXACT length match (most important)
        if (swe1.length === swe2.length) score += 10;
        else if (Math.abs(swe1.length - swe2.length) === 1) score += 5;

        // Same first letter
        if (swe1.charAt(0).toLowerCase() === swe2.charAt(0).toLowerCase()) score += 4;

        // Same last letter
        if (swe1.charAt(swe1.length - 1) === swe2.charAt(swe2.length - 1)) score += 3;

        // Same ending pattern (-ar, -er, -or, -ning, -tion, -het)
        const endings = ['ar', 'er', 'or', 'ning', 'tion', 'het', 'lig', 'isk'];
        for (const end of endings) {
            if (swe1.endsWith(end) && swe2.endsWith(end)) {
                score += 4;
                break;
            }
        }

        // Same prefix (2 chars)
        if (swe1.substring(0, 2).toLowerCase() === swe2.substring(0, 2).toLowerCase()) {
            score += 3;
        }

        return score;
    }

    /**
     * Generate EXTREME Swedish distractors for REVERSE mode
     */
    static getSwedishDistractors(wordData: any[], allData: any[][], count: number = 3): string[] {
        const type = wordData[1];
        const swe = wordData[2];

        const distractors: string[] = [];
        const used = new Set<string>([swe]);

        // Score ALL candidates and sort by similarity
        const candidates = allData
            .filter(row => row[2] !== swe && row[1] === type)
            .map(row => ({
                text: row[2],
                score: this.swedishSimilarityScore(swe, row[2])
            }))
            .sort((a, b) => b.score - a.score);  // Highest score first

        // Pick top scoring candidates
        for (const candidate of candidates) {
            if (distractors.length >= count) break;
            if (!used.has(candidate.text)) {
                distractors.push(candidate.text);
                used.add(candidate.text);
            }
        }

        // Fallback
        if (distractors.length < count) {
            for (const row of allData.sort(() => Math.random() - 0.5)) {
                if (distractors.length >= count) break;
                if (!used.has(row[2])) {
                    distractors.push(row[2]);
                    used.add(row[2]);
                }
            }
        }

        console.log('[Quiz] EXTREME Swedish distractors:', {
            correct: swe,
            correctLen: swe.length,
            distractors: distractors.map(d => ({
                text: d,
                len: d.length,
                score: this.swedishSimilarityScore(swe, d)
            }))
        });

        return distractors;
    }

    /**
     * EASY: Random words from dictionary
     */
    static getEasyDistractors(allData: any[][], count: number = 3): string[] {
        const distractors: string[] = [];
        const randomPool = allData.sort(() => Math.random() - 0.5).slice(0, 20);

        for (const row of randomPool) {
            if (distractors.length >= count) break;
            const word = row[3] || row[2]; // Arab or Swe depending... wait, this needs context. 
            // Actually let's assume Arabic distractors for now or make it generic?
            // Existing methods separate Swedish/Arabic.
            // Let's make generic helpers or stick to specific.
            // getSwedishDistractors returns Swedish. getSmartDistractors returns Arabic.
            // So we need getEasyArabic and getEasySwedish?
            // Or just return rows and let caller pick.
            // Safer to return strings.
        }
        return []; // Placeholder, implemented better below
    }

    static getEasyDistractorsAr(correct: string, allData: any[][], count: number = 3): string[] {
        return allData
            .filter(r => r[3] !== correct)
            .sort(() => Math.random() - 0.5)
            .slice(0, count)
            .map(r => r[3]);
    }

    static getEasyDistractorsSv(correct: string, allData: any[][], count: number = 3): string[] {
        return allData
            .filter(r => r[2] !== correct)
            .sort(() => Math.random() - 0.5)
            .slice(0, count)
            .map(r => r[2]);
    }

    static getMediumDistractorsAr(wordData: any[], allData: any[][], count: number = 3): string[] {
        const type = wordData[1];
        const correct = wordData[3];
        // Same POS, random sort
        return allData
            .filter(r => r[1] === type && r[3] !== correct)
            .sort(() => Math.random() - 0.5)
            .slice(0, count)
            .map(r => r[3]);
    }

    static getMediumDistractorsSv(wordData: any[], allData: any[][], count: number = 3): string[] {
        const type = wordData[1];
        const correct = wordData[2];
        // Same POS, random sort
        return allData
            .filter(r => r[1] === type && r[2] !== correct)
            .sort(() => Math.random() - 0.5)
            .slice(0, count)
            .map(r => r[2]);
    }

    static init(wordData: any[]) {
        const container = document.getElementById('miniQuizContainer');
        const questionEl = document.getElementById('miniQuizQuestion');
        const optionsEl = document.getElementById('miniQuizOptions');
        const feedbackEl = document.getElementById('miniQuizFeedback');

        if (!container || !questionEl || !optionsEl || !feedbackEl) return;

        const swe = wordData[2];
        const arb = wordData[3];
        const type = wordData[1];
        const exSwe = wordData[7] || '';  // Example sentence

        const allData = (window as any).dictionaryData as any[][];

        // Fallback distractors if dictionary not loaded
        const fallbackSwedish = ['Hus', 'Bil', 'Katt', 'Hund', 'Sol', 'Vatten', 'Bröd', 'Bok'];
        const fallbackArabic = ['بيت', 'سيارة', 'قطة', 'كلب', 'شمس', 'ماء', 'خبز', 'كتاب'];

        const getFallbackDistractors = (correct: string, isSwe: boolean): string[] => {
            const pool = isSwe ? fallbackSwedish : fallbackArabic;
            return pool.filter(w => w !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
        };

        // Choose quiz type randomly
        // 1 = Fill Blank (if sentence exists), 2 = Listening, 3 = Translation (normal/reverse)
        // Check if sentence contains the word stem (at least first 3 chars)
        const sweRoot = swe.substring(0, Math.min(4, swe.length)).toLowerCase();
        const hasSentence = exSwe && exSwe.length > 10 && exSwe.toLowerCase().includes(sweRoot);
        const hasEmoji = EmojiQuizHelper.hasEmoji(swe);

        const quizTypes = [2, 3]; // Default: Listening, Translation
        if (hasSentence) quizTypes.push(1);
        if (hasEmoji) quizTypes.push(4); // Emoji Quiz

        const quizType = quizTypes[Math.floor(Math.random() * quizTypes.length)];

        let options: string[];
        let correctAnswer: string;
        let questionHTML: string;
        let modeLabel: string;
        let modeIcon: string;

        if (quizType === 4 && hasEmoji) {
            // EMOJI QUIZ: Picture -> Word
            const emoji = EmojiQuizHelper.getEmoji(swe)!;

            // Distractors: Random Swedish words (maybe try to pick from emoji map keys if poss?)
            // For now, random Swedish words is fine.
            let distractors: string[];
            if (this.difficulty === 'easy') {
                distractors = this.getEasyDistractorsSv(swe, allData, 3);
            } else {
                distractors = allData ? this.getSwedishDistractors(wordData, allData, 3) : getFallbackDistractors(swe, true);
            }

            options = [...distractors, swe].sort(() => Math.random() - 0.5);
            correctAnswer = swe;
            questionHTML = `
                <div class="quiz-emoji-display">${emoji}</div>
                <div class="quiz-instruction"><span class="sv-text">Vilket ord passar bilden?</span><span class="ar-text">ما هي الكلمة المناسبة للصورة؟</span></div>
            `;
            modeLabel = `<span class="sv-text">Bildquiz</span><span class="ar-text">اختبار الصور</span>`;
            modeIcon = '🖼️';
            console.log('[Quiz] EMOJI mode:', { emoji, correctAnswer: swe });

        } else if (quizType === 1 && hasSentence) {
            // FILL-IN-THE-BLANK: Show sentence with blank
            // Find any word in sentence that starts with sweRoot
            const sentenceWithBlank = exSwe.replace(new RegExp(`\\b(${sweRoot}\\w*)\\b`, 'gi'), '______');
            const distractors = allData ? this.getSwedishDistractors(wordData, allData, 3) : getFallbackDistractors(swe, true);
            options = [...distractors, swe].sort(() => Math.random() - 0.5);
            correctAnswer = swe;
            questionHTML = `
                <div class="quiz-sentence" dir="ltr">"${sentenceWithBlank}"</div>
                <div class="quiz-instruction"><span class="sv-text">Välj rätt ord</span><span class="ar-text">اختر الكلمة الصحيحة</span></div>
            `;
            modeLabel = `<span class="sv-text">Fyll i</span><span class="ar-text">إكمال</span>`;
            modeIcon = '📝';
            console.log('[Quiz] FILL BLANK mode:', { sentence: exSwe, correctAnswer: swe });

        } else if (quizType === 2) {
            // LISTENING: Play audio, pick the word
            const distractors = allData ? this.getSwedishDistractors(wordData, allData, 3) : getFallbackDistractors(swe, true);
            options = [...distractors, swe].sort(() => Math.random() - 0.5);
            correctAnswer = swe;
            questionHTML = `
                <div class="quiz-listen-container">
                    <button class="quiz-listen-btn" onclick="window.TTSManager?.speak('${swe}', 'sv')">
                        🔊 <span><span class="sv-text">${tLang('btn.test', 'sv')}</span><span class="ar-text">${tLang('btn.test', 'ar')}</span></span>
                    </button>
                </div>
                <div class="quiz-instruction"><span class="sv-text">Vilket ord hörde du?</span><span class="ar-text">ما هي الكلمة التي سمعتها؟</span></div>
            `;
            modeLabel = `<span class="sv-text">Lyssna</span><span class="ar-text">استماع</span>`;
            modeIcon = '🎧';
            // Auto-play audio
            setTimeout(() => TTSManager.speak(swe, 'sv'), 500);
            console.log('[Quiz] LISTENING mode:', { correctAnswer: swe });

        } else {
            // TRANSLATION: Normal or Reverse
            const isReverse = Math.random() < 0.5;

            if (isReverse) {
                const distractors = allData ? this.getSwedishDistractors(wordData, allData, 3) : getFallbackDistractors(swe, true);
                options = [...distractors, swe].sort(() => Math.random() - 0.5);
                correctAnswer = swe;
                questionHTML = `
                    <span class="sv-text">Vad är det svenska ordet för</span><span class="ar-text">ما هي الكلمة السويدية لـ</span> 
                    <strong>"${arb}"</strong>?`;
                modeLabel = `<span class="sv-text">Omvänd</span><span class="ar-text">عكسي</span>`;
                modeIcon = '🔄';
            } else {
                const distractors = allData ? this.getSmartDistractors(wordData, allData, 3) : getFallbackDistractors(arb, false);
                options = [...distractors, arb].sort(() => Math.random() - 0.5);
                correctAnswer = arb;
                questionHTML = `
                    <span class="sv-text">Vad betyder</span><span class="ar-text">ما معنى</span> 
                    <strong>"${swe}"</strong>?`;
                modeLabel = `<span class="sv-text">${type}</span><span class="ar-text">${type}</span>`;
                modeIcon = '📖';
            }
        }

        // Get streak and XP from localStorage
        const streak = parseInt(localStorage.getItem('quizStreak') || '0');
        const xp = parseInt(localStorage.getItem('quizXP') || '0');

        questionEl.innerHTML = `
            <div class="quiz-header-row">
                <span class="quiz-word-type">${modeIcon} ${modeLabel}</span>
                <div class="quiz-stats">
                    <span class="quiz-xp">⭐ ${xp} XP</span>
                    ${streak > 0 ? `<span class="quiz-streak">🔥 ${streak}</span>` : ''}
                </div>
            </div>
            <div class="quiz-timer-bar"><div class="quiz-timer-progress"></div></div>
            ${questionHTML}
        `;

        optionsEl.innerHTML = options.map(opt => `
            <button class="quiz-option" data-value="${opt}">${opt}</button>
        `).join('') + `
            <button class="quiz-hint-btn" id="quizHintBtn" ${xp < 5 ? 'disabled' : ''}>
                💡 <span class="sv-text">Ledtråd</span><span class="ar-text">تلميح</span>
                <span class="hint-cost">(-5 XP)</span>
            </button>
        `;

        // Start timer
        const maxTime = this.getTimeLimit();
        let timeLeft = maxTime;
        const timerProgress = questionEl.querySelector('.quiz-timer-progress') as HTMLElement;
        const timerInterval = setInterval(() => {
            timeLeft--;
            if (timerProgress) {
                const pct = (timeLeft / maxTime) * 100;
                timerProgress.style.width = `${pct}%`;
                if (pct < 30) timerProgress.style.background = '#ef4444';
                else if (pct < 60) timerProgress.style.background = '#f59e0b';
            }
            // Play tick sound in the last 5 seconds
            if (timeLeft <= 5 && timeLeft > 0) {
                QuizSoundManager.playTick();
            }
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                // Time's up - auto fail
                this.handleAnswer(optionsEl, feedbackEl, '', correctAnswer, wordData, false);
            }
        }, 1000);

        optionsEl.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                clearInterval(timerInterval);
                const selected = (e.currentTarget as HTMLElement).dataset.value;
                this.handleAnswer(optionsEl, feedbackEl, selected!, correctAnswer, wordData, true);
            });
        });

        // Hint button handler
        const hintBtn = optionsEl.querySelector('#quizHintBtn') as HTMLButtonElement;
        if (hintBtn) {
            hintBtn.addEventListener('click', () => {
                let currentXP = parseInt(localStorage.getItem('quizXP') || '0');
                if (currentXP < 5) return;

                // Deduct XP
                currentXP -= 5;
                localStorage.setItem('quizXP', currentXP.toString());

                // Update XP display
                const xpDisplay = questionEl.querySelector('.quiz-xp');
                if (xpDisplay) xpDisplay.textContent = `⭐ ${currentXP} XP`;

                // Eliminate one wrong answer
                const wrongOptions = Array.from(optionsEl.querySelectorAll('.quiz-option:not(.disabled)'))
                    .filter(el => (el as HTMLElement).dataset.value !== correctAnswer);

                if (wrongOptions.length > 0) {
                    const toRemove = wrongOptions[Math.floor(Math.random() * wrongOptions.length)] as HTMLElement;
                    toRemove.classList.add('eliminated');
                    toRemove.style.opacity = '0.3';
                    toRemove.style.pointerEvents = 'none';
                    toRemove.style.textDecoration = 'line-through';
                }

                // Disable hint button
                hintBtn.disabled = true;
                hintBtn.style.opacity = '0.5';
            });
        }
    }

    private static handleAnswer(
        optionsEl: HTMLElement,
        feedbackEl: HTMLElement,
        selected: string,
        correctAnswer: string,
        wordData: any[],
        userClicked: boolean
    ) {
        const isCorrect = selected === correctAnswer;
        const wordId = wordData[0].toString();

        // Update streak and XP
        let streak = parseInt(localStorage.getItem('quizStreak') || '0');
        let xp = parseInt(localStorage.getItem('quizXP') || '0');

        if (isCorrect) {
            streak++;
            xp += 10 + (streak * 2); // Bonus XP for streak
            this.showConfetti();
            QuizSoundManager.playCorrect();
        } else {
            streak = 0;
            QuizSoundManager.playWrong();
        }

        localStorage.setItem('quizStreak', streak.toString());
        localStorage.setItem('quizXP', xp.toString());

        // Update mastery level and weak words
        const mastery = MasteryManager.updateMastery(wordId, isCorrect);
        if (isCorrect) {
            WeakWordsManager.recordCorrect(wordId);
        } else {
            WeakWordsManager.recordWrong(wordId);
        }

        // Mark options
        optionsEl.querySelectorAll('.quiz-option').forEach(b => {
            b.classList.add('disabled');
            if ((b as HTMLElement).dataset.value === correctAnswer) b.classList.add('correct');
            else if ((b as HTMLElement).dataset.value === selected && !isCorrect) b.classList.add('wrong');
        });

        // Show feedback with retry button
        const streakMsg = isCorrect && streak > 1 ? `<span class="streak-bonus">🔥 ${streak}x streak! +${streak * 2} XP</span>` : '';
        const timeUpMsg = !userClicked ? `⏰ <span class="sv-text">${tLang('details.timeUp', 'sv')}</span><span class="ar-text">${tLang('details.timeUp', 'ar')}</span>` : '';

        feedbackEl.classList.remove('hidden');

        // Get example sentence for explanation
        const exampleSwe = wordData[7] || '';
        const exampleArb = wordData[8] || '';
        const explanationHTML = exampleSwe ? `
            <div class="quiz-explanation">
                <div class="explanation-label">📚 <span class="sv-text">Exempel</span><span class="ar-text">مثال</span>:</div>
                <div class="explanation-swe">"${exampleSwe}"</div>
                ${exampleArb ? `<div class="explanation-arb" dir="rtl">"${exampleArb}"</div>` : ''}
            </div>
        ` : '';

        feedbackEl.innerHTML = `
            ${timeUpMsg}
            ${isCorrect
                ? `🎉 <span class="sv-text">${tLang('details.correct', 'sv')}</span><span class="ar-text">${tLang('details.correct', 'ar')}</span> ${streakMsg}`
                : `❌ <span class="sv-text">${tLang('details.wrong', 'sv')} "${correctAnswer}".</span><span class="ar-text">${tLang('details.wrong', 'ar')} "${correctAnswer}".</span>`
            }
            ${explanationHTML}
            <button class="quiz-retry-btn" onclick="MiniQuizManager.init(window.currentWordData)">
                🔄 <span class="sv-text">${tLang('details.retry', 'sv')}</span><span class="ar-text">${tLang('details.retry', 'ar')}</span>
            </button>
        `;
        feedbackEl.className = `mini-quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;

        // Store word data globally for retry
        (window as any).currentWordData = wordData;
    }

    private static showConfetti() {
        const container = document.getElementById('miniQuizContainer');
        if (!container) return;

        const confettiCount = 30;
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'quiz-confetti';
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            confetti.style.background = ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'][Math.floor(Math.random() * 5)];
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 2000);
        }
    }
}

// Make MiniQuizManager globally available for retry button
(window as any).MiniQuizManager = MiniQuizManager;

/**
 * Related Words Manager - Enhanced with Categories & Guaranteed Results
 */
class RelatedWordsManager {
    static async init(wordData: any[]) {
        console.log('[RelatedWords] init called with:', wordData?.[2]);
        const container = document.getElementById('relatedWordsContainer');
        if (!container) return;

        const type = wordData[1];
        const swe = wordData[2];
        const arb = wordData[3];

        // Show loading state
        container.innerHTML = `<div class="related-loading">⏳ <span class="sv-text">Laddar...</span><span class="ar-text">جاري التحميل...</span></div>`;

        // Load data directly from IndexedDB
        let allData: any[][] = (window as any).dictionaryData;
        if (!allData) {
            try {
                allData = await DictionaryDB.getAllWords();
                (window as any).dictionaryData = allData; // Cache for future use
            } catch (e) {
                console.error('[RelatedWords] Failed to load data:', e);
                container.innerHTML = `<div class="related-empty">
                    <span class="sv-text">Kunde inte ladda relaterade ord</span>
                    <span class="ar-text">تعذر تحميل الكلمات ذات الصلة</span>
                </div>`;
                return;
            }
        }

        if (!allData || allData.length === 0) {
            container.innerHTML = `<div class="related-empty">
                <span class="sv-text">Inga relaterade ord hittades</span>
                <span class="ar-text">لم يتم العثور على كلمات ذات صلة</span>
            </div>`;
            return;
        }

        // Category-based Related Words
        const categories: { label: string; labelAr: string; icon: string; words: any[] }[] = [];

        // 1. Compounds (words containing this word)
        const compounds = allData.filter(row =>
            row[2] !== swe && (row[2].toLowerCase().includes(swe.toLowerCase()) || swe.toLowerCase().includes(row[2].toLowerCase()))
        ).slice(0, 4);
        if (compounds.length > 0) {
            categories.push({ label: 'Sammansatta ord', labelAr: 'كلمات مركبة', icon: '🔗', words: compounds });
        }

        // 2. Same Root (starts with same 3+ letters)
        const prefix = swe.substring(0, Math.min(3, swe.length)).toLowerCase();
        const sameRoot = allData.filter(row =>
            row[2] !== swe && row[2].toLowerCase().startsWith(prefix) && !compounds.includes(row)
        ).slice(0, 4);
        if (sameRoot.length > 0) {
            categories.push({ label: 'Liknande ord', labelAr: 'كلمات مشابهة', icon: '🌱', words: sameRoot });
        }

        // 3. Same Category (grammatical type)
        const sameType = allData.filter(row =>
            row[2] !== swe && row[1] === type && !compounds.includes(row) && !sameRoot.includes(row)
        ).sort(() => Math.random() - 0.5).slice(0, 4);
        if (sameType.length > 0) {
            const typeLabels: Record<string, { sv: string; ar: string }> = {
                'verb': { sv: 'Andra verb', ar: 'أفعال أخرى' },
                'subst.': { sv: 'Andra substantiv', ar: 'أسماء أخرى' },
                'adj.': { sv: 'Andra adjektiv', ar: 'صفات أخرى' },
                'adv.': { sv: 'Andra adverb', ar: 'ظروف أخرى' },
            };
            const typeLabel = typeLabels[type] || { sv: `Samma typ (${type})`, ar: `نفس النوع (${type})` };
            categories.push({ label: typeLabel.sv, labelAr: typeLabel.ar, icon: '📚', words: sameType });
        }

        // 4. Random Discovery (if no other categories)
        if (categories.length === 0 || categories.reduce((sum, c) => sum + c.words.length, 0) < 3) {
            const random = allData.filter(row => row[2] !== swe).sort(() => Math.random() - 0.5).slice(0, 6);
            categories.push({ label: 'Upptäck ord', labelAr: 'اكتشف كلمات', icon: '✨', words: random });
        }

        // Render with category headers
        container.innerHTML = categories.map(cat => `
            <div class="related-category">
                <div class="related-category-header">
                    <span class="category-icon">${cat.icon}</span>
                    <span class="sv-text">${cat.label}</span>
                    <span class="ar-text">${cat.labelAr}</span>
                </div>
                <div class="related-words-row">
                    ${cat.words.map(row => `
                        <div class="related-word-chip" onclick="window.location.href='details.html?id=${row[0]}'">
                            <span class="related-swe">${row[2]}</span>
                            <span class="related-arb">${row[3]}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }
}

/**
 * Swipe Navigator - Touch gesture navigation
 */
class SwipeNavigator {
    private static startX = 0;
    private static startY = 0;
    private static currentWordIndex = -1;

    static init(wordId: string) {
        const allData = (window as any).dictionaryData as any[][];
        if (!allData) return;

        // Find current word index
        this.currentWordIndex = allData.findIndex(row => row[0].toString() === wordId);
        if (this.currentWordIndex === -1) return;

        const container = document.getElementById('detailsArea');
        if (!container) return;

        // Add swipe hint arrows
        this.addSwipeHints(container);

        // Touch events
        container.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        container.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
    }

    private static addSwipeHints(container: HTMLElement) {
        const hints = document.createElement('div');
        hints.className = 'swipe-hints';
        hints.innerHTML = `
            <span class="swipe-hint left" onclick="SwipeNavigator.navigate(-1)"><span class="sv-text">‹ Föregående</span><span class="ar-text">‹ السابق</span></span>
            <span class="swipe-hint right" onclick="SwipeNavigator.navigate(1)"><span class="sv-text">Nästa ›</span><span class="ar-text">التالي ›</span></span>
        `;
        container.prepend(hints);
    }

    private static handleTouchStart(e: TouchEvent) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }

    private static handleTouchEnd(e: TouchEvent) {
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        const diffX = endX - this.startX;
        const diffY = Math.abs(endY - this.startY);

        // Minimum swipe distance and must be horizontal
        if (Math.abs(diffX) > 80 && diffY < 50) {
            if (diffX > 0) {
                this.navigate(-1); // Swipe right = previous
            } else {
                this.navigate(1); // Swipe left = next
            }
        }
    }

    static navigate(direction: number) {
        const allData = (window as any).dictionaryData as any[][];
        if (!allData || this.currentWordIndex === -1) return;

        const newIndex = this.currentWordIndex + direction;
        if (newIndex >= 0 && newIndex < allData.length) {
            const newWordId = allData[newIndex][0];
            // Add slide animation
            document.getElementById('detailsArea')?.classList.add(direction > 0 ? 'slide-left' : 'slide-right');
            setTimeout(() => {
                window.location.href = `details.html?id=${newWordId}`;
            }, 150);
        }
    }
}

// Make SwipeNavigator globally available
(window as any).SwipeNavigator = SwipeNavigator;

/**
 * Mastery Manager - Track word learning progress
 */
class MasteryManager {
    private static getKey(wordId: string) {
        return `mastery_${wordId}`;
    }

    static getMastery(wordId: string): number {
        return parseInt(localStorage.getItem(this.getKey(wordId)) || '0');
    }

    static updateMastery(wordId: string, correct: boolean) {
        let mastery = this.getMastery(wordId);
        mastery += correct ? 20 : -10;
        mastery = Math.max(0, Math.min(100, mastery)); // Clamp 0-100
        localStorage.setItem(this.getKey(wordId), mastery.toString());
        return mastery;
    }

    static getLastStudied(wordId: string): string | null {
        return localStorage.getItem(`lastStudied_${wordId}`);
    }

    static recordStudy(wordId: string) {
        localStorage.setItem(`lastStudied_${wordId}`, new Date().toISOString());
    }

    static getTimeAgo(wordId: string): string {
        const last = this.getLastStudied(wordId);
        if (!last) return '';

        const diff = Date.now() - new Date(last).getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor(diff / (1000 * 60));

        if (days > 0) return `<span class="sv-text">Studerad ${days} dagar sedan</span><span class="ar-text">درست منذ ${days} أيام</span>`;
        if (hours > 0) return `<span class="sv-text">Studerad ${hours} timmar sedan</span><span class="ar-text">درست منذ ${hours} ساعات</span>`;
        if (mins > 0) return `<span class="sv-text">Studerad ${mins} minuter sedan</span><span class="ar-text">درست منذ ${mins} دقائق</span>`;
        return '<span class="sv-text">Nyligen</span><span class="ar-text">مؤخراً</span>';
    }

    static renderMasteryBar(wordId: string, container: HTMLElement) {
        const mastery = this.getMastery(wordId);
        const timeAgo = this.getTimeAgo(wordId);
        const isWeak = WeakWordsManager.isWeak(wordId);

        const bar = document.createElement('div');
        bar.className = 'mastery-section';
        bar.innerHTML = `
            <div class="mastery-header">
                <span class="mastery-label">
                    📈 <span class="sv-text">Behärskningsnivå</span><span class="ar-text">مستوى الإتقان</span>
                    ${isWeak ? '<span class="weak-badge">⚠️ <span class="sv-text">Svagt ord</span><span class="ar-text">كلمة ضعيفة</span></span>' : ''}
                </span>
                <span class="mastery-percent">${mastery}%</span>
            </div>
            <div class="mastery-bar">
                <div class="mastery-progress" style="width: ${mastery}%"></div>
            </div>
            ${timeAgo ? `<div class="last-studied">${timeAgo}</div>` : ''}
        `;
        container.prepend(bar);

        // Record this study
        this.recordStudy(wordId);
    }
}

/**
 * Weak Words Manager - Track difficult words
 */
class WeakWordsManager {
    private static getKey(wordId: string) {
        return `weak_${wordId}`;
    }

    static recordWrong(wordId: string) {
        const count = this.getWrongCount(wordId) + 1;
        localStorage.setItem(this.getKey(wordId), count.toString());
    }

    static recordCorrect(wordId: string) {
        // Reduce wrong count on correct answer
        const count = Math.max(0, this.getWrongCount(wordId) - 1);
        localStorage.setItem(this.getKey(wordId), count.toString());
    }

    static getWrongCount(wordId: string): number {
        return parseInt(localStorage.getItem(this.getKey(wordId)) || '0');
    }

    static isWeak(wordId: string): boolean {
        return this.getWrongCount(wordId) >= 3;
    }
}

/**
 * Daily Streak Manager - Track consecutive study days
 */
class DailyStreakManager {
    private static STREAK_KEY = 'dailyStreak';
    private static LAST_DATE_KEY = 'lastStudyDate';

    static checkAndUpdateStreak(): number {
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem(this.LAST_DATE_KEY);
        let streak = parseInt(localStorage.getItem(this.STREAK_KEY) || '0');

        if (lastDate === today) {
            // Already studied today
            return streak;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastDate === yesterday.toDateString()) {
            // Studied yesterday - continue streak
            streak++;
        } else if (lastDate !== today) {
            // Streak broken - reset
            streak = 1;
        }

        localStorage.setItem(this.STREAK_KEY, streak.toString());
        localStorage.setItem(this.LAST_DATE_KEY, today);

        return streak;
    }

    static getStreak(): number {
        return parseInt(localStorage.getItem(this.STREAK_KEY) || '0');
    }

    static renderStreakBadge(container: HTMLElement) {
        const streak = this.checkAndUpdateStreak();
        if (streak < 2) return;

        const badge = document.createElement('div');
        badge.className = 'daily-streak-badge';
        badge.innerHTML = `
            <span class="streak-fire">🔥</span>
            <span class="sv-text">${streak} dagar i rad!</span><span class="ar-text">${streak} أيام متتالية!</span>
        `;
        container.prepend(badge);
    }
}

/**
 * Motivation Manager - Display motivational quotes
 */
class MotivationManager {
    private static quotes = [
        {
            text: `<span class="sv-text">Varje nytt ord är ett fönster mot en ny värld</span><span class="ar-text">كل كلمة جديدة هي نافذة على عالم جديد</span>`,
            author: `<span class="sv-text">Okänd</span><span class="ar-text">مجهول</span>`
        },
        {
            text: `<span class="sv-text">Lärande är ingen tävling, det är en resa</span><span class="ar-text">التعلم ليس سباقاً، بل رحلة</span>`,
            author: `<span class="sv-text">Visdom</span><span class="ar-text">حكمة</span>`
        },
        {
            text: `<span class="sv-text">Den som lär sig ett språk, förstår en kultur</span><span class="ar-text">من يتعلم لغة، يفهم ثقافة</span>`,
            author: `<span class="sv-text">Ordspråk</span><span class="ar-text">مثل</span>`
        },
        {
            text: `<span class="sv-text">Sprائكة هو روح الأمة</span><span class="ar-text">اللغة هي روح الأمة</span>`,
            author: `<span class="sv-text">Fichte</span><span class="ar-text">فيخته</span>`
        }
    ];

    static getRandomQuote() {
        return this.quotes[Math.floor(Math.random() * this.quotes.length)];
    }

    static renderQuote(container: HTMLElement) {
        const quote = this.getRandomQuote();
        const el = document.createElement('div');
        el.className = 'motivation-quote';
        el.innerHTML = `
            <p>"${quote.text}"</p>
            <div class="author">— ${quote.author}</div>
        `;
        container.appendChild(el);
    }
}


/**
 * Share Manager - Share words on social media
 */
class ShareManager {
    static share(wordData: any[]) {
        const swe = wordData[2];
        const arb = wordData[3];
        const type = wordData[1];

        const text = `📚 تعلمت كلمة جديدة!\n\n🇸🇪 ${swe} (${type})\n🇸🇦 ${arb}\n\n#SnabbaLexin #LearnSwedish`;

        if (navigator.share) {
            navigator.share({
                title: `${swe} - SnabbaLexin`,
                text: text,
                url: window.location.href
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(text);
            showToast('<span class="sv-text">Kopierad!</span><span class="ar-text">تم النسخ!</span>');
        }
    }

    static renderShareButton(container: HTMLElement, wordData: any[]) {
        const btn = document.createElement('button');
        btn.className = 'share-btn';
        btn.innerHTML = '📤 <span class="sv-text">Dela</span><span class="ar-text">مشاركة</span>';
        btn.onclick = () => this.share(wordData);
        container.appendChild(btn);
    }
}

/**
 * Flashcard Manager - Clean Minimal Learning Experience
 */
class FlashcardManager {
    private static isFlipped = false;
    private static currentMode: 'normal' | 'reverse' | 'listening' | 'challenge' = 'normal';
    private static focusMode = false;
    private static streak = 0;
    private static xp = 0;
    private static sessionStats = { correct: 0, wrong: 0, total: 0 };
    private static startTime = Date.now();
    private static currentWordData: any[] | null = null;

    // Map word types to glow classes using TypeColorSystem
    private static getTypeGlowClass(type: string, word: string = '', forms: string = '', gender: string = ''): string {
        return TypeColorSystem.getGlowClass(type, word, forms, gender);
    }

    // Dynamic text sizing based on text length
    private static getTextSizeClass(text: string): string {
        const len = text.length;
        if (len <= 8) return 'text-xl';
        if (len <= 15) return 'text-lg';
        if (len <= 25) return 'text-md';
        if (len <= 40) return 'text-sm';
        return 'text-xs';
    }

    // Simple success glow effect (replaces confetti)
    private static showSuccessGlow() {
        const card = document.querySelector('.flashcard-clean');
        if (card) {
            card.classList.add('fc-success-glow');
            setTimeout(() => card.classList.remove('fc-success-glow'), 600);
        }
    }

    // Subtle error flash (replaces shake)
    private static showErrorFlash() {
        const card = document.querySelector('.flashcard-clean');
        if (card) {
            card.classList.add('fc-error-flash');
            setTimeout(() => card.classList.remove('fc-error-flash'), 400);
        }
    }

    // Toggle focus mode
    static toggleFocus() {
        this.focusMode = !this.focusMode;
        const cardArea = document.querySelector('.fc-card-area');
        const statsBar = document.getElementById('fcStatsBar');
        const header = document.querySelector('.fc-minimal-header');

        if (this.focusMode) {
            cardArea?.classList.add('focus-mode');
            statsBar?.classList.add('hidden');
            header?.classList.add('hidden');
            showToast('🧘 <span class="sv-text">Fokusläge aktiverat</span><span class="ar-text">وضع التركيز مُفعّل</span>', { type: 'info' });
        } else {
            cardArea?.classList.remove('focus-mode');
            statsBar?.classList.remove('hidden');
            header?.classList.remove('hidden');
            showToast('<span class="sv-text">Fokusläge avslutat</span><span class="ar-text">انتهى وضع التركيز</span>');
        }
    }

    // Play audio for the word
    private static playAudio(word: string) {
        if ((window as any).TTSManager) {
            (window as any).TTSManager.speak(word, 'sv');
        }
    }

    // Format time elapsed
    private static formatTime(ms: number): string {
        const secs = Math.floor(ms / 1000);
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins}:${s.toString().padStart(2, '0')}`;
    }

    // Get accuracy percentage  
    private static getAccuracy(): number {
        if (this.sessionStats.total === 0) return 0;
        return Math.round((this.sessionStats.correct / this.sessionStats.total) * 100);
    }

    static init(wordData: any[]) {
        const container = document.getElementById('flashcardContainer');
        if (!container) return;

        this.currentWordData = wordData;
        const swe = wordData[2];
        const arb = wordData[3];
        const type = wordData[1];
        const exSwe = wordData[7] || '';

        const forms = wordData[6] || '';

        const gender = wordData[13] || '';
        const glowClass = this.getTypeGlowClass(type, swe, forms, gender);
        const sweSizeClass = this.getTextSizeClass(swe);
        const arbSizeClass = this.getTextSizeClass(arb);

        // Get front/back content based on mode
        const frontWord = this.currentMode === 'reverse' ? arb : swe;
        const backWord = this.currentMode === 'reverse' ? swe : arb;
        const frontDir = this.currentMode === 'reverse' ? 'rtl' : 'ltr';
        const backDir = this.currentMode === 'reverse' ? 'ltr' : 'rtl';

        container.innerHTML = `
            <!-- Minimal Header: Mode + Focus Toggle -->
            <div class="fc-minimal-header">
                <div class="fc-mode-pills">
                    <button class="fc-pill ${this.currentMode === 'normal' ? 'active' : ''}" onclick="FlashcardManager.setMode('normal')" title="Normal / عادي">🇸🇪</button>
                    <button class="fc-pill ${this.currentMode === 'reverse' ? 'active' : ''}" onclick="FlashcardManager.setMode('reverse')" title="Omvänd / عكسي">🔄</button>
                    <button class="fc-pill ${this.currentMode === 'listening' ? 'active' : ''}" onclick="FlashcardManager.setMode('listening')" title="Lyssna / استماع">🎧</button>
                </div>
                <button class="fc-focus-toggle" onclick="FlashcardManager.toggleFocus()" title="Fokusläge / وضع التركيز">
                    ⛶
                </button>
            </div>
            
            <!-- Collapsible Stats (hidden by default, show on hover/click) -->
            <div class="fc-stats-minimal" id="fcStatsBar">
                <span class="fc-mini-stat">🔥<span id="fcStreak">${this.streak}</span></span>
                <span class="fc-mini-stat">⭐<span id="fcXP">${this.xp}</span></span>
                <span class="fc-mini-stat">🎯<span id="fcAccuracy">${this.getAccuracy()}%</span></span>
            </div>
            
            <div class="fc-card-area ${this.focusMode ? 'focus-mode' : ''}">
                ${this.currentMode === 'listening' ? `
                    <!-- Listening Mode: Simple Design -->
                    <div class="fc-listen-simple">
                        <button class="fc-listen-circle" onclick="FlashcardManager.playAudio('${swe}')">
                            🔊
                        </button>
                        <div class="fc-listen-grid quiz-options">
                            ${this.generateListeningOptions(swe)}
                        </div>
                    </div>
                ` : `
                    <!-- Ultra Clean Flashcard -->
                    <div class="flashcard-clean ${glowClass}" onclick="FlashcardManager.flip()">
                        <div class="flashcard-clean-inner">
                            <!-- Front: Word Only -->
                            <div class="flashcard-clean-front">
                                <div class="fc-front-word ${this.currentMode === 'reverse' ? arbSizeClass : sweSizeClass}" dir="${frontDir}">${frontWord}</div>
                            </div>
                            <!-- Back: Translation + Example -->
                            <div class="flashcard-clean-back">
                                <div class="fc-back-swe">${swe}</div>
                                <div class="fc-back-divider"></div>
                                <div class="fc-back-arb">${arb}</div>
                                ${exSwe ? `<div class="fc-back-example">"${exSwe}"</div>` : ''}
                            </div>
                        </div>
                        <!-- Audio: Appears on hover/tap -->
                        <button class="fc-audio-float" onclick="event.stopPropagation(); FlashcardManager.playAudio('${swe}')">🔊</button>
                    </div>
                `}
                
                <!-- Icon-Only Rating Buttons -->
                <div class="fc-actions-simple">
                    <button class="fc-action-btn wrong" onclick="FlashcardManager.markWrong('${wordData[0]}')" title="Vet inte / لا أعرف">
                        ❌
                    </button>
                    <button class="fc-action-btn correct" onclick="FlashcardManager.markCorrect('${wordData[0]}')" title="Vet / أعرف">
                        ✅
                    </button>
                </div>
                
                <!-- Minimal Navigation (hidden in focus mode) -->
                <div class="fc-nav-simple">
                    <button class="fc-nav-icon" onclick="SwipeNavigator.navigate(-1)" title="Föregående / السابق">←</button>
                    <button class="fc-nav-icon random" onclick="FlashcardManager.randomWord()" title="Slumpmässigt / عشوائي">🎲</button>
                    <button class="fc-nav-icon" onclick="SwipeNavigator.navigate(1)" title="Nästa / التالي">→</button>
                </div>
            </div>
        `;

        this.isFlipped = false;
        this.setupKeyboardShortcuts();
        this.startTimeUpdater();
    }

    // Generate listening mode options
    private static generateListeningOptions(correctWord: string): string {
        const allData = (window as any).dictionaryData as any[][] || [];
        const distractors = allData
            .filter(w => w[2] !== correctWord)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(w => w[2]);

        const options = [...distractors, correctWord].sort(() => Math.random() - 0.5);

        return options.map(opt => `
            <button class="quiz-option" onclick="FlashcardManager.checkListeningAnswer('${opt}', '${correctWord}')">
                ${opt}
            </button>
        `).join('');
    }

    // Check listening mode answer
    static checkListeningAnswer(selected: string, correct: string) {
        if (selected === correct) {
            this.markCorrect(this.currentWordData?.[0] || '');
        } else {
            this.markWrong(this.currentWordData?.[0] || '');
        }
    }

    // Set learning mode
    static setMode(mode: 'normal' | 'reverse' | 'listening' | 'challenge') {
        this.currentMode = mode;
        if (this.currentWordData) {
            this.init(this.currentWordData);
        }
    }

    // Keyboard shortcuts
    private static setupKeyboardShortcuts() {
        document.onkeydown = (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.flip();
            } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
                SwipeNavigator.navigate(1);
            } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
                SwipeNavigator.navigate(-1);
            } else if (e.code === 'ArrowUp' || e.code === 'KeyW') {
                this.markCorrect(this.currentWordData?.[0] || '');
            } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
                this.markWrong(this.currentWordData?.[0] || '');
            }
        };
    }

    // Time updater
    private static startTimeUpdater() {
        setInterval(() => {
            const el = document.getElementById('fcTime');
            if (el) el.textContent = this.formatTime(Date.now() - this.startTime);
        }, 1000);
    }

    static flip() {
        const card = document.querySelector('.flashcard-clean');
        if (card) {
            this.isFlipped = !this.isFlipped;
            card.classList.toggle('flipped', this.isFlipped);
            card.classList.add('shimmering');
            setTimeout(() => card.classList.remove('shimmering'), 1500);

            // Auto-play audio on flip to back
            if (this.isFlipped && this.currentWordData) {
                setTimeout(() => this.playAudio(this.currentWordData![2]), 300);
            }
        }
    }

    static randomWord() {
        const allData = (window as any).dictionaryData as any[][];
        if (!allData || allData.length === 0) return;

        const randomIndex = Math.floor(Math.random() * allData.length);
        const randomWord = allData[randomIndex];
        window.location.href = `details.html?id=${randomWord[0]}`;
    }

    static markCorrect(wordId: string) {
        // Update stats
        this.streak++;
        this.xp += 10 + (this.streak * 2); // Bonus XP for streak
        this.sessionStats.correct++;
        this.sessionStats.total++;

        // Update UI
        this.updateStatsUI();

        // Visual feedback
        this.showSuccessGlow();
        showToast(`✅ +${10 + (this.streak * 2)} XP`, { type: 'success' });

        // Save progress
        MasteryManager.updateMastery(wordId, true);
        WeakWordsManager.recordCorrect(wordId);

        // Go to next word after delay
        setTimeout(() => SwipeNavigator.navigate(1), 800);
    }

    static markWrong(wordId: string) {
        // Update stats
        this.streak = 0;
        this.sessionStats.wrong++;
        this.sessionStats.total++;

        // Update UI
        this.updateStatsUI();

        // Visual feedback
        this.showErrorFlash();
        showToast('❌', { type: 'error' });

        // Save progress
        MasteryManager.updateMastery(wordId, false);
        WeakWordsManager.recordWrong(wordId);
    }

    private static updateStatsUI() {
        const streakEl = document.getElementById('fcStreak');
        const xpEl = document.getElementById('fcXP');
        const accEl = document.getElementById('fcAccuracy');

        if (streakEl) streakEl.textContent = this.streak.toString();
        if (xpEl) xpEl.textContent = this.xp.toString();
        if (accEl) accEl.textContent = `${this.getAccuracy()}%`;
    }
}

// Make managers globally available
(window as any).FlashcardManager = FlashcardManager;
(window as any).ShareManager = ShareManager;


/**
 * Details Screen Manager
 */
export class DetailsManager {
    private wordId: string | null = null;
    private wordData: any[] | null = null;

    constructor() {
        this.init();
    }

    private async init() {
        const params = new URLSearchParams(window.location.search);
        this.wordId = params.get('id');

        if (!this.wordId) {
            window.location.href = 'index.html';
            return;
        }

        this.setupGeneralListeners();
        this.setupTabListeners();

        // Efficient Loading:
        // 1. Init DB connection
        // 2. Try direct lookup (Fastest)
        // 3. Only fallback to full load if absolutely necessary (or load in background)

        try {
            await DictionaryDB.init();
            const cachedWord = await DictionaryDB.getWordById(this.wordId);

            if (cachedWord) {
                console.log('[Details] ⚡ Instant load from cache');
                this.wordData = cachedWord;
                // Render immediately
                this.renderDetails();
                QuizStats.recordStudy(this.wordId!);
                NotesManager.init(this.wordId!);

                // Background load for advanced features (related words etc)
                this.loadBackgroundData();
                return;
            }
        } catch (e) {
            console.warn('[Details] Cache lookup failed:', e);
        }

        // Fallback: DISABLED as per user request (Cache First & Only)
        console.warn('[Details] Word not in cache. Fallback disabled.');
        /*
        if ((window as any).dictionaryData) {
            this.handleDataReady();
        } else {
            // Lazy load the loader only if absolutely needed
            import('./loader').then(({ Loader }) => {
                window.addEventListener('dictionaryLoaded', () => this.handleDataReady());
            });
        }
        */
    }

    private async loadBackgroundData() {
        // Load partial data or full dictionary in background for "Related Words" etc.
        // For now, we just check if we have data or need to fetch constraints

        if ((window as any).dictionaryData) {
            this.initDeferredFeatures();
        } else {
            // Optional: You could fetch just related words here instead of full dict
            // For now, let's just init what we can
            this.initDeferredFeatures();
        }
    }

    private initDeferredFeatures() {
        if (!this.wordData) return;

        const detailsArea = document.getElementById('detailsArea');
        if (detailsArea) {
            MasteryManager.renderMasteryBar(this.wordId!, detailsArea);
            DailyStreakManager.renderStreakBadge(detailsArea);
        }

        // These need full dictionary to be perfect, but we can try with what we have
        // or wait for a background thread.
        // For performance, we can skip complex distractors if data is missing
        if ((window as any).dictionaryData) {
            MiniQuizManager.init(this.wordData);
            RelatedWordsManager.init(this.wordData);
            SwipeNavigator.init(this.wordId!);
            FlashcardManager.init(this.wordData);
        } else {
            // Minimal init without full data
            // RelatedWordsManager requires full data... skip or mock?
            // Let's rely on cached mini-quiz if possible or disable
            const noteSection = document.querySelector('.notes-section');
            if (noteSection) MotivationManager.renderQuote(noteSection as HTMLElement);
        }
    }

    private setupGeneralListeners() {
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => ThemeManager.toggle());
        }
    }

    private setupTabListeners() {
        const tabBtns = document.querySelectorAll('.details-tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        // Initial state sync
        tabContents.forEach(c => {
            const isInfo = (c as HTMLElement).dataset.tab === 'info';
            (c as HTMLElement).style.display = isInfo ? 'block' : 'none';
        });

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = (btn as HTMLElement).dataset.tab;

                tabBtns.forEach(b => b.classList.toggle('active', b === btn));
                tabContents.forEach(c => {
                    const isTarget = (c as HTMLElement).dataset.tab === targetTab;
                    c.classList.toggle('active', isTarget);
                    // Fallback: Force visibility in JS to override CSS issues
                    (c as HTMLElement).style.display = isTarget ? 'block' : 'none';
                });

                // Re-init features if target is play tab (just in case)
                if (targetTab === 'play' && this.wordData) {
                    MiniQuizManager.init(this.wordData);
                    // Optimized: Only init if not already initialized for this word to avoid overhead?
                    // actually PronunciationLab.init is light enough and handles re-init.
                    PronunciationLab.init(this.wordData[2]);
                }
            });
        });
    }

    private async handleDataReady() {
        const data = (window as any).dictionaryData as any[][];
        if (!data) return;

        this.wordData = data.find(row => row[0].toString() === this.wordId) || null;

        if (!this.wordData) {
            this.wordData = await DictionaryDB.getWordById(this.wordId!);
        }

        if (this.wordData) {
            QuizStats.recordStudy(this.wordId!);
            this.renderDetails();

            // Init new professional features
            NotesManager.init(this.wordId!);
            MiniQuizManager.init(this.wordData);
            console.log('[handleDataReady] Calling RelatedWordsManager.init...');
            RelatedWordsManager.init(this.wordData);
        } else {
            const area = document.getElementById('detailsArea');
            if (area) area.innerHTML = '<div class="placeholder-message"><span class="sv-text">Ordet hittades inte</span><span class="ar-text">الكلمة غير موجودة</span></div>';
        }
    }

    private renderDetails() {
        const row = this.wordData!;
        const id = row[0].toString();
        const type = row[1];
        const swe = row[2];
        const arb = row[3];
        const arbExt = row[4] || '';
        const def = row[5] || '';
        const forms = row[6] || '';
        const exSwe = row[7] || '';
        const exArb = row[8] || '';
        const idiomSwe = row[9] || '';
        const idiomArb = row[10] || '';

        const gender = row[13] || ''; // en/ett from dictionary

        const category = TypeColorSystem.getCategory(type, swe, forms);
        const isFav = FavoritesManager.has(id);
        const glowClass = this.getTypeGlowClass(type, swe, forms, gender);

        this.setupHeaderActions(row, isFav);

        const detailsArea = document.getElementById('detailsArea');
        if (!detailsArea) return;

        const grammarBadge = TypeColorSystem.generateBadge(type, swe, forms, gender);

        // Process definition and examples for smart links
        const processedDef = SmartLinkProcessor.process(def);
        const processedExSwe = SmartLinkProcessor.process(exSwe);
        const processedIdiomSwe = SmartLinkProcessor.process(idiomSwe);

        // Apply dynamic color to Tabs Container for localized glow
        const tabsContainer = document.querySelector('.details-tabs');
        if (tabsContainer) {
            tabsContainer.className = 'details-tabs ' + glowClass;
        }

        // Apply dynamic color to Sticky Header for blurred background
        const stickyHeader = document.querySelector('.details-header-sticky');
        if (stickyHeader) {
            stickyHeader.className = 'details-header details-header-sticky ' + glowClass;
        }

        // Minimalist Hero HTML - Matching Flashcard-Clean style
        let html = `
            <!-- Hero Section with Type Glow -->
            <div class="details-hero ${glowClass} premium-border-animated">
                <div class="hero-inner">
                    <h1 class="word-swe-hero">${swe}</h1>
                    <div class="hero-divider"></div>
                    <p class="word-arb-hero" dir="rtl">${arb}</p>
                    ${arbExt ? `<p class="word-arb-ext" dir="rtl">${arbExt}</p>` : ''}
                </div>
                
                <div class="word-meta-row">
                    <span class="word-type-pill">
                        <span class="sv-text">${type}</span>
                        <span class="sv-text ar-text"> / </span>
                        <span class="ar-text">${tLang('quran.' + type.toLowerCase().replace('substantiv', 'noun'), 'ar') || type}</span>
                    </span>
                    ${grammarBadge}
                </div>
            </div>

            <div class="details-content-grid">
                ${forms ? `
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">🔗</span> <span class="sv-text">Böjningar</span><span class="ar-text">التصريفات</span></h3>
                    <div class="forms-card-container">
                        <div class="forms-container">
                            ${forms.split(',').map((f: string) => `<span class="form-chip">${f.trim()}</span>`).join('')}
                        </div>
                    </div>
                </div>
                ` : ''}

                ${(def || arbExt) ? `
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">📝</span> <span class="sv-text">Betydelse</span><span class="ar-text">المعنى</span></h3>
                    <div class="definition-card">
                        ${def ? `<p class="def-text">${processedDef}</p>` : ''}
                        ${arbExt ? `<p class="def-text" dir="rtl" style="margin-top: 10px; border-top: 1px solid var(--border); padding-top: 10px;">${arbExt}</p>` : ''}
                    </div>
                </div>
                ` : ''}

                ${(exSwe || exArb) ? `
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">💡</span> <span class="sv-text">Exempel</span><span class="ar-text">أمثلة</span></h3>
                    <div class="example-card">
                        ${exSwe ? `<div class="ex-swe-detail" dir="ltr">${processedExSwe}</div>` : ''}
                        ${exArb ? `<div class="ex-arb-detail" dir="rtl">${exArb}</div>` : ''}
                    </div>
                </div>
                ` : ''}

                ${(idiomSwe || idiomArb) ? `
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">💬</span> <span class="sv-text">Uttryck</span><span class="ar-text">تعابير</span></h3>
                    <div class="example-card idiom-card">
                        ${idiomSwe ? `<div class="ex-swe-detail" dir="ltr">${processedIdiomSwe}</div>` : ''}
                        ${idiomArb ? `<div class="ex-arb-detail" dir="rtl">${idiomArb}</div>` : ''}
                    </div>
                </div>
                ` : ''}
            </div>
        `;

        detailsArea.innerHTML = html;

        // Setup Smart Link listeners
        SmartLinkProcessor.setupListeners(detailsArea);

        // Dynamic text sizing
        const sweEl = detailsArea.querySelector('.word-swe-hero');
        if (sweEl) TextSizeManager.apply(sweEl as HTMLElement, swe);

        const arbEl = detailsArea.querySelector('.word-arb-hero');
        if (arbEl) TextSizeManager.apply(arbEl as HTMLElement, arb);

        detailsArea.querySelectorAll('.def-text, .ex-swe-detail, .ex-arb-detail').forEach(el => {
            TextSizeManager.apply(el as HTMLElement, el.textContent || '');
        });

        // Dynamic page title
        const lang = LanguageManager.getLanguage();
        if (lang === 'sv') document.title = `${swe} - SnabbaLexin`;
        else if (lang === 'ar') document.title = `${arb} - سنابا لكسين`;
        else document.title = `${swe} | ${arb} - SnabbaLexin`;

        // Initialize Pronunciation Lab
        setTimeout(() => {
            PronunciationLab.init(swe);
            // SmartCardManager.init(detailsArea); // Disabled: User requested full text always
        }, 100);

        // 3D Parallax Effect for Hero
        detailsArea.addEventListener('mousemove', (e) => {
            const hero = detailsArea.querySelector('.hero-inner') as HTMLElement;
            if (!hero) {
                // Try finding it again if updated
                const newHero = detailsArea.querySelector('.hero-inner') as HTMLElement;
                if (!newHero) return;
                // Re-assign if needed, but 'hero' var is local.
                // Simplified: just return for now.
                return;
            }

            const rect = hero.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            hero.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        detailsArea.addEventListener('mouseleave', () => {
            const hero = detailsArea.querySelector('.hero-inner') as HTMLElement;
            if (hero) {
                hero.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }
        });

        // Double Tap to Love (Heart Explosion)
        const heroSection = detailsArea.querySelector('.details-hero');
        if (heroSection) {
            heroSection.addEventListener('dblclick', (e: Event) => {
                const me = e as MouseEvent;
                HeartExplosion.spawn(me.clientX, me.clientY);

                // Trigger Favorite Toggle
                const favBtn = document.getElementById('headerFavoriteBtn');
                if (favBtn) favBtn.click();
            });
        }
    }

    private setupHeaderActions(row: any[], isFav: boolean) {
        const swe = row[2];
        const id = row[0].toString();
        const isLocal = id.startsWith('local_') || id.length > 20;

        const audioBtn = document.getElementById('headerAudioBtn');
        if (audioBtn) audioBtn.onclick = () => TTSManager.speak(swe, 'sv');

        const favBtn = document.getElementById('headerFavoriteBtn');
        if (favBtn) {
            FavoritesManager.updateButtonIcon(favBtn, isFav);
            favBtn.onclick = () => this.toggleFavorite(id, favBtn);
        }

        const flashBtn = document.getElementById('headerFlashcardBtn');
        if (flashBtn) {
            flashBtn.onclick = () => {
                window.location.href = `games/flashcards.html?id=${id}`;
            };
        }

        const customActions = document.getElementById('customActions');
        if (customActions) {
            customActions.style.display = isLocal ? 'flex' : 'none';
        }

        const editBtn = document.getElementById('editBtn');
        if (editBtn) {
            editBtn.onclick = () => {
                window.location.href = `add.html?edit=${id}`;
            };
        }

        const deleteBtn = document.getElementById('deleteBtn');
        if (deleteBtn) {
            deleteBtn.onclick = async () => {
                if (confirm(t('details.confirmDelete'))) {
                    await DictionaryDB.deleteWord(id);
                    showToast('<span class="sv-text">Ordet borttaget</span><span class="ar-text">تم حذف الكلمة</span>');
                    setTimeout(() => window.location.href = 'index.html', 1000);
                }
            };
        }

        const copyBtn = document.getElementById('smartCopyBtn');
        if (copyBtn) {
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(swe).then(() => showToast('<span class="sv-text">Kopierat</span><span class="ar-text">تم النسخ</span> 📋'));
            };
        }

        const shareBtn = document.getElementById('headerShareBtn');
        if (shareBtn) {
            shareBtn.onclick = () => {
                const currentLang = LanguageManager.getLanguage();
                const text = currentLang === 'ar'
                    ? `📚 تعلمت كلمة جديدة!\n\n🇸🇪 ${swe}\n🇸🇦 ${row[3]}\n\n#SnabbaLexin`
                    : `📚 Jag lärde mig ett nytt ord!\n\n🇸🇪 ${swe}\n🇸🇦 ${row[3]}\n\n#SnabbaLexin`;

                if (navigator.share) {
                    navigator.share({
                        title: `Lexin: ${swe}`,
                        text: text,
                        url: window.location.href
                    }).catch(console.error);
                } else {
                    navigator.clipboard.writeText(window.location.href).then(() => showToast(`<span class="sv-text">Länk kopierad</span><span class="ar-text">تم نسخ الرابط</span> 🔗`));
                }
            };
        }
    }

    private toggleFavorite(id: string, btn: HTMLElement) {
        const isFavNow = FavoritesManager.toggle(id);
        FavoritesManager.updateButtonIcon(btn, isFavNow);
    }

    private getTypeGlowClass(type: string, word: string = '', forms: string = '', gender: string = ''): string {
        return TypeColorSystem.getGlowClass(type, word, forms, gender);
    }
}

// Instantiate
if (typeof window !== 'undefined') {
    (window as any).detailsManager = new DetailsManager();
}
