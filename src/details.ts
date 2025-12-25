import './config';
// import './loader'; // Optimized: Load only specific word
import { DictionaryDB } from './db';
import { ThemeManager, CategoryHelper, GrammarHelper, showToast, TextSizeManager } from './utils';
import { TTSManager } from './tts';
import { FavoritesManager } from './favorites';
import { QuizStats } from './quiz-stats';

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
            link.addEventListener('click', (e) => {
                const word = (e.currentTarget as HTMLElement).dataset.word;
                if (word) {
                    // Search for the word in dictionary
                    const data = (window as any).dictionaryData as any[][];
                    const found = data?.find(row => row[2].toLowerCase() === word);
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
            if (status) status.textContent = 'Sparar...';

            const success = await DictionaryDB.saveNote(wordId, text);
            
            (saveBtn as HTMLButtonElement).disabled = false;
            if (status) {
                status.textContent = success ? 'Sparat!' : 'Fel';
                setTimeout(() => { status.textContent = ''; }, 3000);
            }
        };
    }
}

/**
 * Mini Quiz Manager - EXTREME DIFFICULTY Distractor Generation
 * Uses linguistic analysis to create maximum confusion
 */
class MiniQuizManager {
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
        
        // Choose quiz type randomly
        // 1 = Fill Blank (if sentence exists), 2 = Listening, 3 = Translation (normal/reverse)
        // Check if sentence contains the word stem (at least first 3 chars)
        const sweRoot = swe.substring(0, Math.min(4, swe.length)).toLowerCase();
        const hasSentence = exSwe && exSwe.length > 10 && exSwe.toLowerCase().includes(sweRoot);
        const quizTypes = hasSentence ? [1, 2, 3] : [2, 3];
        const quizType = quizTypes[Math.floor(Math.random() * quizTypes.length)];
        
        let options: string[];
        let correctAnswer: string;
        let questionHTML: string;
        let modeLabel: string;
        let modeIcon: string;
        
        if (quizType === 1 && hasSentence) {
            // FILL-IN-THE-BLANK: Show sentence with blank
            // Find any word in sentence that starts with sweRoot
            const sentenceWithBlank = exSwe.replace(new RegExp(`\\b(${sweRoot}\\w*)\\b`, 'gi'), '______');
            const distractors = allData ? this.getSwedishDistractors(wordData, allData, 3) : [];
            options = [...distractors, swe].sort(() => Math.random() - 0.5);
            correctAnswer = swe;
            questionHTML = `
                <div class="quiz-sentence" dir="ltr">"${sentenceWithBlank}"</div>
                <div class="quiz-instruction">Välj rätt ord</div>
            `;
            modeLabel = 'Fyll i';
            modeIcon = '📝';
            console.log('[Quiz] FILL BLANK mode:', { sentence: exSwe, correctAnswer: swe });
            
        } else if (quizType === 2) {
            // LISTENING: Play audio, pick the word
            const distractors = allData ? this.getSwedishDistractors(wordData, allData, 3) : [];
            options = [...distractors, swe].sort(() => Math.random() - 0.5);
            correctAnswer = swe;
            questionHTML = `
                <div class="quiz-listen-container">
                    <button class="quiz-listen-btn" onclick="window.TTSManager?.speak('${swe}', 'sv')">
                        🔊 <span>Lyssna</span>
                    </button>
                </div>
                <div class="quiz-instruction">Vilket ord hörde du?</div>
            `;
            modeLabel = 'Lyssna';
            modeIcon = '🎧';
            // Auto-play audio
            setTimeout(() => TTSManager.speak(swe, 'sv'), 500);
            console.log('[Quiz] LISTENING mode:', { correctAnswer: swe });
            
        } else {
            // TRANSLATION: Normal or Reverse
            const isReverse = Math.random() < 0.5;
            
            if (isReverse) {
                const distractors = allData ? this.getSwedishDistractors(wordData, allData, 3) : [];
                options = [...distractors, swe].sort(() => Math.random() - 0.5);
                correctAnswer = swe;
                questionHTML = `Vad är det svenska ordet för <strong>"${arb}"</strong>?`;
                modeLabel = 'Omvänd';
                modeIcon = '🔄';
            } else {
                const distractors = allData ? this.getSmartDistractors(wordData, allData, 3) : [];
                options = [...distractors, arb].sort(() => Math.random() - 0.5);
                correctAnswer = arb;
                questionHTML = `Vad betyder <strong>"${swe}"</strong>?`;
                modeLabel = type;
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
            <div class="mini-quiz-option" data-value="${opt}">${opt}</div>
        `).join('');

        // Start timer
        let timeLeft = 15;
        const timerProgress = questionEl.querySelector('.quiz-timer-progress') as HTMLElement;
        const timerInterval = setInterval(() => {
            timeLeft--;
            if (timerProgress) {
                const pct = (timeLeft / 15) * 100;
                timerProgress.style.width = `${pct}%`;
                if (pct < 30) timerProgress.style.background = '#ef4444';
                else if (pct < 60) timerProgress.style.background = '#f59e0b';
            }
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                // Time's up - auto fail
                this.handleAnswer(optionsEl, feedbackEl, '', correctAnswer, wordData, false);
            }
        }, 1000);

        optionsEl.querySelectorAll('.mini-quiz-option').forEach(btn => {
            btn.addEventListener('click', (e) => {
                clearInterval(timerInterval);
                const selected = (e.currentTarget as HTMLElement).dataset.value;
                this.handleAnswer(optionsEl, feedbackEl, selected!, correctAnswer, wordData, true);
            });
        });
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
        } else {
            streak = 0;
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
        optionsEl.querySelectorAll('.mini-quiz-option').forEach(b => {
            b.classList.add('disabled');
            if ((b as HTMLElement).dataset.value === correctAnswer) b.classList.add('correct');
            else if ((b as HTMLElement).dataset.value === selected && !isCorrect) b.classList.add('wrong');
        });

        // Show feedback with retry button
        const streakMsg = isCorrect && streak > 1 ? `<span class="streak-bonus">🔥 ${streak}x streak! +${streak * 2} XP</span>` : '';
        const timeUpMsg = !userClicked ? '⏰ Tiden är slut!' : '';
        
        feedbackEl.classList.remove('hidden');
        feedbackEl.innerHTML = `
            ${timeUpMsg}
            ${isCorrect 
                ? `🎉 Rätt! Bra jobbat! ${streakMsg}` 
                : `❌ Fel. Rätt svar är "${correctAnswer}".`
            }
            <button class="quiz-retry-btn" onclick="MiniQuizManager.init(window.currentWordData)">
                🔄 Testa igen
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
 * Related Words Manager
 */
class RelatedWordsManager {
    static init(wordData: any[]) {
        const container = document.getElementById('relatedWordsContainer');
        if (!container) return;

        const type = wordData[1];
        const swe = wordData[2];
        const allData = (window as any).dictionaryData as any[][];

        if (!allData) return;

        // Find words of same type or starting with same letter
        const related = allData
            .filter(row => row[2] !== swe && (row[1] === type || row[2].startsWith(swe.substring(0, 2))))
            .sort(() => Math.random() - 0.5)
            .slice(0, 6);

        container.innerHTML = related.map(row => `
            <div class="related-word-chip" onclick="window.location.href='details.html?id=${row[0]}'">
                <span class="swe">${row[2]}</span>
                <span class="arb">${row[3]}</span>
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
            <span class="swipe-hint left" onclick="SwipeNavigator.navigate(-1)">‹ Föregående</span>
            <span class="swipe-hint right" onclick="SwipeNavigator.navigate(1)">Nästa ›</span>
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
        
        if (days > 0) return `Studerad ${days} dagar sedan`;
        if (hours > 0) return `Studerad ${hours} timmar sedan`;
        if (mins > 0) return `Studerad ${mins} minuter sedan`;
        return 'Nyligen';
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
                    📈 Behärskningsnivå
                    ${isWeak ? '<span class="weak-badge">⚠️ Svagt ord</span>' : ''}
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
            <span>${streak} أيام متتالية!</span>
        `;
        container.prepend(badge);
    }
}

/**
 * Motivation Manager - Display motivational quotes
 */
class MotivationManager {
    private static quotes = [
        { text: "Varje nytt ord är ett fönster mot en ny värld", author: "Okänd" },
        { text: "Lärande är ingen tävling, det är en resa", author: "Visdom" },
        { text: "Den som lär sig ett språk, förstår en kultur", author: "Ordspråk" },
        { text: "Språket är nationens själ", author: "Fichte" },
        { text: "Varje dag lär du dig något nytt", author: "Svenskt ordspråk" },
        { text: "Språket är nyckeln till kulturen", author: "Visdom" },
        { text: "Ett språk är en värld", author: "Okänd" },
        { text: "Övning ger färdighet", author: "Svenskt ordspråk" }
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
            }).catch(() => {});
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(text);
            showToast('Kopierad!');
        }
    }
    
    static renderShareButton(container: HTMLElement, wordData: any[]) {
        const btn = document.createElement('button');
        btn.className = 'share-btn';
        btn.innerHTML = '📤 Dela';
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
    
    // Map word types to glow classes
    private static getTypeGlowClass(type: string): string {
        const t = type.toLowerCase();
        if (t.includes('verb')) return 'glow-verb';
        if (t.includes('subst') || t.includes('noun')) return 'glow-noun';
        if (t.includes('adj')) return 'glow-adjective';
        if (t.includes('adv')) return 'glow-adverb';
        if (t.includes('prep')) return 'glow-preposition';
        return 'glow-default';
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
            showToast('🧘 Fokusläge aktiverat', { type: 'info' });
        } else {
            cardArea?.classList.remove('focus-mode');
            statsBar?.classList.remove('hidden');
            header?.classList.remove('hidden');
            showToast('Fokusläge avslutat');
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
        
        const glowClass = this.getTypeGlowClass(type);
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
                    <button class="fc-pill ${this.currentMode === 'normal' ? 'active' : ''}" onclick="FlashcardManager.setMode('normal')" title="Normal">🇸🇪</button>
                    <button class="fc-pill ${this.currentMode === 'reverse' ? 'active' : ''}" onclick="FlashcardManager.setMode('reverse')" title="Omvänd">🔄</button>
                    <button class="fc-pill ${this.currentMode === 'listening' ? 'active' : ''}" onclick="FlashcardManager.setMode('listening')" title="Lyssna">🎧</button>
                </div>
                <button class="fc-focus-toggle" onclick="FlashcardManager.toggleFocus()" title="Fokusläge">
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
                        <div class="fc-listen-grid">
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
                    <button class="fc-action-btn wrong" onclick="FlashcardManager.markWrong('${wordData[0]}')" title="Vet inte">
                        ❌
                    </button>
                    <button class="fc-action-btn correct" onclick="FlashcardManager.markCorrect('${wordData[0]}')" title="Vet">
                        ✅
                    </button>
                </div>
                
                <!-- Minimal Navigation (hidden in focus mode) -->
                <div class="fc-nav-simple">
                    <button class="fc-nav-icon" onclick="SwipeNavigator.navigate(-1)" title="Föregående">←</button>
                    <button class="fc-nav-icon random" onclick="FlashcardManager.randomWord()" title="Slumpmässigt">🎲</button>
                    <button class="fc-nav-icon" onclick="SwipeNavigator.navigate(1)" title="Nästa">→</button>
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
            <button class="fc-listen-option" onclick="FlashcardManager.checkListeningAnswer('${opt}', '${correctWord}')">
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
             if(noteSection) MotivationManager.renderQuote(noteSection as HTMLElement);
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
            RelatedWordsManager.init(this.wordData);
        } else {
            const area = document.getElementById('detailsArea');
            if (area) area.innerHTML = '<div class="placeholder-message">Ordet hittades inte</div>';
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

        const category = CategoryHelper.getCategory(type, swe, forms);
        const isFav = FavoritesManager.has(id);
        const glowClass = this.getTypeGlowClass(type);

        this.setupHeaderActions(row, isFav);

        const detailsArea = document.getElementById('detailsArea');
        if (!detailsArea) return;

        const grammarBadge = GrammarHelper.getBadge(type, forms, swe);

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
            <div class="details-hero ${glowClass}">
                <div class="hero-inner">
                    <h1 class="word-swe-hero">${swe}</h1>
                    <div class="hero-divider"></div>
                    <p class="word-arb-hero" dir="rtl">${arb}</p>
                    ${arbExt ? `<p class="word-arb-ext" dir="rtl">${arbExt}</p>` : ''}
                </div>
                
                <div class="word-meta-row">
                    <span class="word-type-pill">${type}</span>
                    ${grammarBadge}
                </div>
            </div>

            <div class="details-content-grid">
                ${forms ? `
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">🔗</span> Böjningar</h3>
                    <div class="forms-container">
                        ${forms.split(',').map((f: string) => `<span class="form-chip">${f.trim()}</span>`).join('')}
                    </div>
                </div>
                ` : ''}

                ${(def || arbExt) ? `
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">📝</span> Betydelse</h3>
                    <div class="definition-card">
                        ${def ? `<p class="def-text">${processedDef}</p>` : ''}
                        ${arbExt ? `<p class="def-text" dir="rtl" style="margin-top: 10px; border-top: 1px solid var(--border); padding-top: 10px;">${arbExt}</p>` : ''}
                    </div>
                </div>
                ` : ''}

                ${(exSwe || exArb) ? `
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">💡</span> Exempel</h3>
                    <div class="example-card">
                        ${exSwe ? `<div class="ex-swe-detail" dir="ltr">${processedExSwe}</div>` : ''}
                        ${exArb ? `<div class="ex-arb-detail" dir="rtl">${exArb}</div>` : ''}
                    </div>
                </div>
                ` : ''}

                ${(idiomSwe || idiomArb) ? `
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">💬</span> Uttryck</h3>
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
                if (confirm('Är du säker على حذف الكلمة؟')) {
                    await DictionaryDB.deleteWord(id);
                    showToast('Ordet borttaget');
                    setTimeout(() => window.location.href = 'index.html', 1000);
                }
            };
        }

        const copyBtn = document.getElementById('smartCopyBtn');
        if (copyBtn) {
            copyBtn.onclick = () => {
                navigator.clipboard.writeText(swe).then(() => showToast('Kopierat 📋'));
            };
        }

        const shareBtn = document.getElementById('headerShareBtn');
        if (shareBtn) {
            shareBtn.onclick = () => {
                if (navigator.share) {
                    navigator.share({
                        title: `Lexin: ${swe}`,
                        text: `Hur man säger "${swe}" på arabiska: ${row[3]}`,
                        url: window.location.href
                    }).catch(console.error);
                } else {
                    navigator.clipboard.writeText(window.location.href).then(() => showToast('Länk kopierad 🔗'));
                }
            };
        }
    }

    private toggleFavorite(id: string, btn: HTMLElement) {
        const isFavNow = FavoritesManager.toggle(id);
        FavoritesManager.updateButtonIcon(btn, isFavNow);
    }

    private getTypeGlowClass(type: string): string {
        const t = type.toLowerCase();
        if (t.includes('verb')) return 'glow-verb';
        if (t.includes('subst') || t.includes('noun')) return 'glow-noun';
        if (t.includes('adj')) return 'glow-adjective';
        if (t.includes('adv')) return 'glow-adverb';
        if (t.includes('prep')) return 'glow-preposition';
        return 'glow-default';
    }
}

// Instantiate
if (typeof window !== 'undefined') {
    (window as any).detailsManager = new DetailsManager();
}
