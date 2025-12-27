import { TTSManager } from './tts';
import { showToast, TextSizeManager } from './utils';
import { FavoritesManager } from './favorites';
import { QuizStats } from './quiz-stats';
import { Achievements } from './achievements';
import { WordEmojiMap } from './data/emoji-map';

/**
 * Quiz Modes
 */
export type QuizMode = 'normal' | 'reverse' | 'listening' | 'timed' | 'favorites' | 'weak' | 'picture' | 'sentence';

/**
 * QuizManager - Professional quiz experience with multiple modes
 */
export class QuizManager {
    private data: any[][] = [];
    private questions: any[][] = [];
    private currentIndex = 0;
    private score = 0;
    private isAnswered = false;
    private container: HTMLElement | null = null;
    private currentWord: any[] | null = null;

    // Quiz configuration
    private mode: QuizMode = 'normal';
    private questionCount = 10;
    private timerSeconds = 10;
    private timerInterval: number | null = null;
    private timeLeft = 0;

    constructor() {
        this.container = document.getElementById('quizInlineContainer');
        this.init();
    }

    private init() {
        // Button listeners
        const quizBtn = document.getElementById('quickQuizBtn');
        const sideQuizBtn = document.getElementById('quizBtn');
        const closeBtn = document.getElementById('closeQuiz');
        const nextBtn = document.getElementById('nextQuestion');
        const restartBtn = document.getElementById('restartQuiz');
        const modeSelect = document.getElementById('quizModeSelect') as HTMLSelectElement | null;

        if (quizBtn) quizBtn.onclick = () => this.start();
        if (sideQuizBtn) sideQuizBtn.onclick = () => this.start();
        if (closeBtn) closeBtn.onclick = () => this.hide();
        if (nextBtn) nextBtn.onclick = () => this.next();
        if (restartBtn) restartBtn.onclick = () => this.start();

        if (modeSelect) {
            modeSelect.onchange = () => {
                this.mode = modeSelect.value as QuizMode;
                console.log('[Quiz] Mode changed to:', this.mode);
                // Auto-restart quiz with new mode if quiz is visible
                if (this.container && !this.container.classList.contains('hidden')) {
                    this.start();
                }
            };
            // Set initial mode from select
            this.mode = modeSelect.value as QuizMode;
        }

        // Favorite button
        const quizFavBtn = document.getElementById('quizFavBtn');
        if (quizFavBtn) {
            quizFavBtn.onclick = () => this.toggleCurrentFavorite(quizFavBtn);
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Data loading
        window.addEventListener('dictionaryLoaded', () => {
            this.data = (window as any).dictionaryData || [];
        });
        if ((window as any).dictionaryData) {
            this.data = (window as any).dictionaryData;
        }
    }

    private handleKeyboard(e: KeyboardEvent) {
        if (!this.container || this.container.classList.contains('hidden')) return;

        if (e.key >= '1' && e.key <= '4') {
            const idx = parseInt(e.key) - 1;
            const options = document.querySelectorAll('.quiz-option');
            if (options[idx]) (options[idx] as HTMLButtonElement).click();
        }

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (this.isAnswered) {
                this.next();
            }
        }
    }

    public start(overrideMode?: QuizMode) {
        if (overrideMode) this.mode = overrideMode;

        if (!this.data || this.data.length < 5) {
            showToast('Laddar ordbok... / جاري تحميل القاموس ⏳');
            return;
        }

        // Get questions based on mode
        this.questions = this.getQuestions();
        if (this.questions.length === 0) {
            showToast('Inga ord tillgängliga för detta läge / لا توجد كلمات متاحة');
            return;
        }

        this.currentIndex = 0;
        this.score = 0;
        this.isAnswered = false;
        QuizStats.resetSession();

        // Show container
        if (this.container) {
            this.container.classList.remove('hidden');
            this.container.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // Hide end screen, show quiz body
        const endScreen = document.getElementById('quizEndScreen');
        if (endScreen) endScreen.classList.add('hidden');

        const body = document.querySelector('.quiz-body');
        if (body) {
            Array.from(body.children).forEach(child => {
                if ((child as HTMLElement).id !== 'quizEndScreen') {
                    (child as HTMLElement).style.display = 'block';
                }
            });
        }

        this.updateProgressBar();
        this.showQuestion();
        this.updateScore();
    }

    private hide() {
        this.stopTimer();
        QuizStats.endSession();
        if (this.container) this.container.classList.add('hidden');
    }

    private getQuestions(): any[][] {
        let pool: any[][] = [];

        switch (this.mode) {
            case 'favorites':
                const favIds = FavoritesManager.getAll();
                pool = this.data.filter(row => favIds.includes(row[0].toString()));
                break;
            case 'weak':
                const weakIds = QuizStats.getWeakWords(20);
                pool = this.data.filter(row => weakIds.includes(row[0].toString()));
                if (pool.length < 5) pool = this.data; // Fallback
                break;
            case 'picture':
                // Filter words that have an emoji mapping
                pool = this.data.filter(row => {
                    const swe = (row[2] || '').toLowerCase().trim();
                    return WordEmojiMap.hasOwnProperty(swe);
                });
                break;
            case 'sentence':
                // Filter words that have examples containing the word itself
                pool = this.data.filter(row => {
                    const swe = (row[2] || '').toLowerCase().trim();
                    const example = (row[7] || '').toLowerCase();
                    return example.length > 5 && example.includes(swe);
                });
                break;
            default:
                pool = this.data;
        }

        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(this.questionCount, shuffled.length));
    }

    private showQuestion() {
        const word = this.questions[this.currentIndex];
        this.currentWord = word;

        const swe = word[2];
        const arb = word[3];

        // Determine question and answer based on mode
        let questionText = '';
        let correctAnswer = '';
        let optionLang: 'swe' | 'arb' = 'arb';
        let isPictureMode = false;

        if (this.mode === 'reverse') {
            questionText = arb;
            correctAnswer = swe;
            optionLang = 'swe';
        } else if (this.mode === 'listening') {
            questionText = '🔊 Lyssna och välj rätt ord';
            correctAnswer = arb;
            TTSManager.speak(swe, 'sv');
        } else if (this.mode === 'picture') {
            // Picture Mode Logic
            const sweKey = (swe || '').toLowerCase().trim();
            const emoji = WordEmojiMap[sweKey] || '❓';

            questionText = emoji;
            correctAnswer = swe;
            optionLang = 'swe';
            isPictureMode = true;
        } else if (this.mode === 'sentence') {
            // Sentence Mode Logic
            const sweKey = (swe || '').toLowerCase().trim();
            const rawExample = word[7] || '';

            // Replace word in sentence with blanks
            // We use a regex to replace the word case-insensitively
            const regex = new RegExp(sweKey, 'gi');
            questionText = rawExample.replace(regex, '_______');

            correctAnswer = swe;
            optionLang = 'swe';
        } else {
            questionText = swe;
            correctAnswer = arb;
        }

        // Update question display
        const questionEl = document.getElementById('quizQuestion');
        if (questionEl) {
            questionEl.textContent = questionText;

            if (isPictureMode) {
                questionEl.style.fontSize = '4.5rem'; // Large emoji
                questionEl.dir = 'ltr';
            } else if (this.mode === 'sentence') {
                questionEl.style.fontSize = '1.4rem'; // Slightly smaller for long sentences
                questionEl.style.direction = 'ltr'; // Ensure sentences are LTR unless mainly Arabic? Swedish sentences -> LTR
            } else {
                questionEl.style.fontSize = ''; // Reset
                questionEl.dir = this.mode === 'reverse' ? 'rtl' : 'ltr';
                TextSizeManager.apply(questionEl, questionText);
            }
        }

        // Example
        const exampleEl = document.getElementById('quizExample');
        if (exampleEl) {
            if (this.mode === 'listening') {
                exampleEl.textContent = '';
            } else if (this.mode === 'picture') {
                exampleEl.textContent = 'Vilket ord är detta? / ما هذه الكلمة؟';
                TextSizeManager.apply(exampleEl, exampleEl.textContent);
            } else if (this.mode === 'sentence') {
                exampleEl.textContent = 'Vilket ord saknas? / أي كلمة مفقودة؟';
            } else {
                const text = word[7] || '';
                exampleEl.textContent = text;
                TextSizeManager.apply(exampleEl, text);
            }
        }

        // Show/Hide Help Text for Normal Mode
        const helpEl = document.getElementById('quizHelp');
        if (helpEl) {
            if (this.mode === 'normal') {
                helpEl.classList.remove('hidden');
            } else {
                helpEl.classList.add('hidden');
            }
        }

        // Generate options
        const optionsEl = document.getElementById('quizOptions');
        if (optionsEl) {
            console.log('[Quiz] Found optionsEl, clearing content');
            optionsEl.innerHTML = '';
            const options = this.generateOptions(word, optionLang);
            console.log('[Quiz] Generated options:', options);
            if (options.length === 0) console.error('[Quiz] Options array is EMPTY!');

            options.forEach((opt, idx) => {
                console.log('[Quiz] Creating button for:', opt);
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.textContent = opt;
                btn.dir = optionLang === 'arb' ? 'rtl' : 'ltr';
                TextSizeManager.apply(btn, opt);
                btn.setAttribute('data-key', (idx + 1).toString());
                btn.onclick = () => this.handleAnswer(opt, correctAnswer, btn);
                optionsEl.appendChild(btn);
            });
            console.log('[Quiz] Appended buttons. Children count:', optionsEl.children.length);
        } else {
            console.error('[Quiz] optionsEl NOT FOUND!');
        }

        // Reset feedback
        const feedbackEl = document.getElementById('quizFeedback');
        if (feedbackEl) {
            feedbackEl.textContent = '';
            feedbackEl.className = 'quiz-feedback';
        }

        // Disable next button
        const nextBtn = document.getElementById('nextQuestion');
        if (nextBtn) (nextBtn as HTMLButtonElement).disabled = true;

        this.isAnswered = false;

        // Start timer for timed mode
        if (this.mode === 'timed') {
            this.startTimer();
        }

        // Track for stats
        QuizStats.startQuestion();

        // Auto speak for normal mode
        if (this.mode === 'normal') {
            TTSManager.speak(swe, 'sv');
        }

        this.updateProgressBar();
    }

    private generateOptions(currentWord: any[], lang: 'swe' | 'arb'): string[] {
        const correct = lang === 'arb' ? currentWord[3] : currentWord[2];
        const currentType = currentWord[1]; // Word type for smart distractors

        const distractors: string[] = [];
        const sameTypeWords = this.data.filter(row =>
            row[1] === currentType && row[0] !== currentWord[0]
        );

        // Prefer same type distractors
        const pool = sameTypeWords.length >= 3 ? sameTypeWords : this.data;
        const shuffledPool = [...pool].sort(() => 0.5 - Math.random());

        for (const row of shuffledPool) {
            if (distractors.length >= 3) break;
            const option = lang === 'arb' ? row[3] : row[2];
            if (option !== correct && !distractors.includes(option)) {
                distractors.push(option);
            }
        }

        return [correct, ...distractors].sort(() => 0.5 - Math.random());
    }

    private handleAnswer(selected: string, correct: string, btn: HTMLButtonElement) {
        if (this.isAnswered) return;
        this.isAnswered = true;
        this.stopTimer();

        const isCorrect = selected === correct;
        const wordId = this.currentWord![0].toString();
        const responseTime = QuizStats.recordAnswer(wordId, isCorrect);

        // Update daily challenge UI
        const app = (window as any).app;
        if (app) {
            if (typeof app.updateDailyChallenge === 'function') {
                app.updateDailyChallenge();
            }
            if (typeof app.updateDailyProgressBar === 'function') {
                app.updateDailyProgressBar();
            }
        }

        if (isCorrect) {
            this.score++;
            btn.classList.add('correct');
            const timeStr = QuizStats.formatTime(responseTime);
            this.showFeedback(`Rätt! ${timeStr} / صحيح ✅`, true);
        } else {
            btn.classList.add('wrong');
            this.showFeedback(`Fel! Rätt: ${correct} / خطأ ❌`, false);

            document.querySelectorAll('.quiz-option').forEach(opt => {
                if (opt.textContent === correct) opt.classList.add('correct');
            });
        }

        this.updateScore();
        const nextBtn = document.getElementById('nextQuestion');
        if (nextBtn) (nextBtn as HTMLButtonElement).disabled = false;

        // Speak correct answer
        if (this.mode === 'reverse' || this.mode === 'picture' || this.mode === 'sentence') {
            TTSManager.speak(correct, 'sv');
        } else {
            TTSManager.speak(correct, 'ar');
        }
    }

    private startTimer() {
        this.timeLeft = this.timerSeconds;
        this.updateTimerDisplay();

        this.timerInterval = window.setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();

            if (this.timeLeft <= 0) {
                this.stopTimer();
                this.timeOut();
            }
        }, 1000);
    }

    private stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    private updateTimerDisplay() {
        const timerEl = document.getElementById('quizTimer');
        if (timerEl) {
            timerEl.textContent = this.timeLeft.toString();
            timerEl.classList.toggle('warning', this.timeLeft <= 3);
        }
    }

    private timeOut() {
        if (this.isAnswered) return;
        this.isAnswered = true;

        const wordId = this.currentWord![0].toString();
        QuizStats.recordAnswer(wordId, false);

        this.showFeedback('Tiden är slut! / انتهى الوقت ⏱️', false);

        const correct = (this.mode === 'reverse' || this.mode === 'picture' || this.mode === 'sentence') ? this.currentWord![2] : this.currentWord![3];
        document.querySelectorAll('.quiz-option').forEach(opt => {
            if (opt.textContent === correct) opt.classList.add('correct');
        });

        this.updateScore();
        const nextBtn = document.getElementById('nextQuestion');
        if (nextBtn) (nextBtn as HTMLButtonElement).disabled = false;
    }

    private showFeedback(msg: string, isCorrect: boolean) {
        const feedbackEl = document.getElementById('quizFeedback');
        if (feedbackEl) {
            feedbackEl.textContent = msg;
            feedbackEl.className = `quiz-feedback ${isCorrect ? 'correct' : 'wrong'}`;
        }
    }

    private updateScore() {
        const scoreEl = document.getElementById('quizScore');
        if (scoreEl) scoreEl.textContent = this.score.toString();
    }

    private updateProgressBar() {
        const progressEl = document.getElementById('quizProgress');
        if (progressEl) {
            const percent = ((this.currentIndex) / this.questions.length) * 100;
            progressEl.style.width = `${percent}%`;
        }

        const progressText = document.getElementById('quizProgressText');
        if (progressText) {
            progressText.textContent = `${this.currentIndex + 1}/${this.questions.length}`;
        }
    }

    private toggleCurrentFavorite(btn: HTMLElement) {
        if (!this.currentWord) return;
        const id = this.currentWord[0].toString();
        const isFav = FavoritesManager.toggle(id);
        btn.classList.toggle('active', isFav);

        // Update SVG fill and stroke directly
        const svg = btn.querySelector('svg');
        if (svg) {
            if (isFav) {
                svg.setAttribute('fill', '#ef4444');
                svg.setAttribute('stroke', '#ef4444');
            } else {
                svg.setAttribute('fill', 'none');
                svg.setAttribute('stroke', 'currentColor');
            }
        }
    }

    private next() {
        this.currentIndex++;
        if (this.currentIndex < this.questions.length) {
            this.showQuestion();
        } else {
            this.end();
        }
    }

    private end() {
        this.stopTimer();
        QuizStats.endSession();

        const sessionStats = QuizStats.getSessionStats();
        const todayStats = QuizStats.getTodayStats();

        const endScreen = document.getElementById('quizEndScreen');
        if (endScreen) {
            endScreen.classList.remove('hidden');

            const finalScoreEl = document.getElementById('endScoreValue');
            if (finalScoreEl) finalScoreEl.textContent = this.score.toString();

            const messageEl = document.getElementById('endMessage');
            if (messageEl) {
                if (this.score === this.questions.length) {
                    messageEl.innerHTML = `🎉 Perfekt! Bästa serien: ${sessionStats.bestStreak}`;
                    this.showConfetti();
                    Achievements.unlockById('perfect_10');
                } else if (this.score >= this.questions.length * 0.8) {
                    messageEl.innerHTML = `Fantastiskt! Tid: ${QuizStats.formatTime(sessionStats.avgTime)}`;
                } else if (this.score >= this.questions.length * 0.5) {
                    messageEl.textContent = 'Bra jobbat! / جيد جداً 👍';
                } else {
                    messageEl.textContent = 'Fortsätt öva! / استمر في التدريب 💪';
                }
                TextSizeManager.apply(messageEl, messageEl.textContent || '', 2);
            }

            // Show session stats
            const statsEl = document.getElementById('endStats');
            if (statsEl) {
                statsEl.innerHTML = `
                    <div class="end-stat"><span>📅 Idag:</span> ${todayStats.correct}/${todayStats.total}</div>
                    <div class="end-stat"><span>🔥 Bästa serien:</span> ${sessionStats.bestStreak}</div>
                    <div class="end-stat"><span>⏱️ Snitttid:</span> ${QuizStats.formatTime(sessionStats.avgTime)}</div>
                `;
            }
        }

        // Hide quiz body
        const body = document.querySelector('.quiz-body');
        if (body) {
            Array.from(body.children).forEach(child => {
                if ((child as HTMLElement).id !== 'quizEndScreen') {
                    (child as HTMLElement).style.display = 'none';
                }
            });
        }
    }

    private showConfetti() {
        const container = this.container;
        if (!container) return;

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDelay = Math.random() * 2 + 's';
            confetti.style.backgroundColor = ['#10B981', '#1e3a8a', '#F59E0B', '#EF4444', '#3b82f6'][Math.floor(Math.random() * 5)];
            container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 3000);
        }
    }
}

// Global instantiation
if (typeof window !== 'undefined') {
    (window as any).QuizManager = new QuizManager();
}
