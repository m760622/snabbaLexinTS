import { CognateEntry } from '../types';
import { cognatesData } from '../data/cognatesData';
import { TTSManager } from '../tts';
import { TextSizeManager } from '../utils';

// ========== TYPES ==========

interface QuizState {
    questions: CognateEntry[];
    index: number;
    score: number;
    pool: CognateEntry[];
}

type QuizType = 'normal' | 'reverse' | 'audio' | 'write';

// ========== STATE ==========
// let currentMode = 'browse'; // Removed unused variable
let currentFilter = 'all';
let savedWords: string[] = JSON.parse(localStorage.getItem('cognates_saved') || '[]');
let learnedWords: string[] = JSON.parse(localStorage.getItem('cognates_learned') || '[]');
let cognatesStreak = parseInt(localStorage.getItem('cognates_streak') || '0');

// Flashcard state
let fcCards: CognateEntry[] = [];
let fcIndex = 0;
let fcKnown = 0;

// Quiz state
let quizState: QuizState | null = null;
let quizType: QuizType = 'normal';

const categoryIcons: Record<string, string> = {
    'Substantiv': '📦', 'Adjektiv': '🎨', 'Verb': '🏃', 'Geografi': '🌍',
    'Medicin & Vetenskap': '🔬', 'Musik & Konst': '🎵', 'Mat & Dryck': '🍽️',
    'Teknik': '💻', 'Övrigt': '📌'
};

// ========== INIT ==========
export function init() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (localStorage.getItem('mobileView') === 'true') {
        document.documentElement.classList.add('iphone-mode');
        document.body.classList.add('iphone-view');
    }

    updateStats();
    renderFilterChips();
    renderContent(cognatesData);

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e as InputEvent));
    }

    // Attach to window for HTML accessibility
    (window as any).switchMode = switchMode;
    (window as any).filterByCategory = filterByCategory;
    (window as any).toggleSave = toggleSave;
    (window as any).openSavedModal = openSavedModal;
    (window as any).closeSavedModal = closeSavedModal;
    (window as any).startQuiz = startQuiz;
    (window as any).closeQuiz = closeQuiz;
    (window as any).flipCard = flipCard;
    (window as any).flashcardAnswer = flashcardAnswer;
    (window as any).setQuizType = setQuizType;
    (window as any).checkAnswer = checkAnswer;
    (window as any).checkWrittenAnswer = checkWrittenAnswer;
    (window as any).playTTS = playTTS;
}

// ========== MODE SWITCHING ==========
function switchMode(mode: string) {
    // currentMode = mode; // Removed unused assignment
    document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
    
    // Use currentTarget if event exists, or find by mode
    const target = (window.event?.target as HTMLElement) || document.querySelector(`.mode-tab[onclick*="${mode}"]`);
    if (target) target.classList.add('active');

    const browseView = document.getElementById('browseView');
    const flashcardView = document.getElementById('flashcardView');
    
    if (browseView) browseView.classList.toggle('hidden', mode !== 'browse');
    if (flashcardView) flashcardView.classList.toggle('active', mode === 'flashcard');

    if (mode === 'flashcard') initFlashcards();
}

// ========== STATS ==========
function updateStats() {
    const totalWordsEl = document.getElementById('totalWords');
    const learnedCountEl = document.getElementById('learnedCount');
    const savedCountEl = document.getElementById('savedCount');
    const streakCountEl = document.getElementById('streakCount');

    if (totalWordsEl) totalWordsEl.textContent = cognatesData.length.toString();
    if (learnedCountEl) learnedCountEl.textContent = learnedWords.length.toString();
    if (savedCountEl) savedCountEl.textContent = savedWords.length.toString();
    if (streakCountEl) streakCountEl.textContent = cognatesStreak.toString();
}

function saveState() {
    localStorage.setItem('cognates_saved', JSON.stringify(savedWords));
    localStorage.setItem('cognates_learned', JSON.stringify(learnedWords));
    localStorage.setItem('cognates_streak', cognatesStreak.toString());
    updateStats();
}

// ========== BROWSE VIEW ==========
function handleSearch(e: InputEvent | { target: HTMLInputElement }) {
    const searchInput = (e.target as HTMLInputElement);
    const term = searchInput.value.toLowerCase().trim();
    let filtered = cognatesData.filter((item: CognateEntry) =>
        item.swe.toLowerCase().includes(term) || item.arb.includes(term)
    );
    if (currentFilter !== 'all') {
        filtered = filtered.filter((item: CognateEntry) => item.category === currentFilter);
    }
    renderContent(filtered);
}

function renderFilterChips() {
    const container = document.getElementById('filterChips');
    if (!container) return;
    
    const categories = ['all', ...new Set(cognatesData.map((c: CognateEntry) => c.category || 'Övrigt'))];
    container.innerHTML = categories.map((cat: string) => `
        <button class="chip ${cat === 'all' ? 'active' : ''}" onclick="filterByCategory('${cat}')">
            ${cat === 'all' ? '🌐 Alla' : (categoryIcons[cat] || '📌') + ' ' + cat}
        </button>
    `).join('');
}

function filterByCategory(cat: string) {
    currentFilter = cat;
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    
    const target = (window.event?.target as HTMLElement);
    if (target) target.classList.add('active');
    
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    handleSearch({ target: searchInput });
}

function renderContent(data: CognateEntry[]) {
    const container = document.getElementById('content');
    if (!container) return;

    if (data.length === 0) {
        container.innerHTML = '<div class="empty-state">Inga ord hittades / لا توجد نتائج</div>';
        return;
    }

    const grouped: Record<string, CognateEntry[]> = {};
    data.forEach(item => {
        const cat = item.category || 'Övrigt';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
    });

    let html = '';
    for (const [category, items] of Object.entries(grouped)) {
        html += `
            <div class="category-section">
                <div class="category-title">
                    <span>${categoryIcons[category] || '📌'}</span>
                    <span>${category} (${items.length})</span>
                </div>
                <div class="cognates-grid">
                    ${items.map(item => {
            const isSaved = savedWords.includes(item.swe);
            const isLearned = learnedWords.includes(item.swe);
            const safeSwe = item.swe.replace(/'/g, "\\'");
            return `
                        <div class="cognate-card ${isLearned ? 'learned' : ''} ${isSaved ? 'saved' : ''}" onclick="playTTS('${safeSwe}')">
                            <div>
                                <span class="word-swe" data-auto-size>${item.swe}</span>
                                <span class="speaker-icon">🔊</span>
                                ${item.type ? `<span class="word-type">${item.type}</span>` : ''}
                            </div>
                            <div class="flex-center-gap">
                                <span class="word-arb" data-auto-size>${item.arb}</span>
                                <button class="mini-btn ${isSaved ? 'saved' : ''}" onclick="event.stopPropagation(); toggleSave('${safeSwe}')">${isSaved ? '⭐' : '☆'}</button>
                            </div>
                        </div>`;
        }).join('')}
                </div>
            </div>`;
    }
    container.innerHTML = html;
    
    // Apply dynamic sizing to rendered cards
    TextSizeManager.autoApply();
}

function playTTS(text: string) {
    if (TTSManager) {
        TTSManager.speak(text, 'sv');
    } else {
        console.error('TTSManager not loaded');
    }
}

function toggleSave(word: string) {
    const idx = savedWords.indexOf(word);
    if (idx > -1) {
        savedWords.splice(idx, 1);
    } else {
        savedWords.push(word);
    }
    saveState();
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    handleSearch({ target: searchInput });
}

// ========== SAVED MODAL ==========
function openSavedModal() {
    const list = document.getElementById('savedList');
    if (!list) return;

    if (savedWords.length === 0) {
        list.innerHTML = '<p class="empty-state saved-empty">Inga sparade ord ännu / لا توجد كلمات محفوظة</p>';
    } else {
        list.innerHTML = savedWords.map(word => {
            const item = cognatesData.find((c: CognateEntry) => c.swe === word);
            return `
                <div class="saved-item">
                    <div>
                        <strong>${word}</strong>
                        <span class="saved-arb">${item?.arb || ''}</span>
                    </div>
                    <button class="mini-btn" onclick="toggleSave('${word.replace(/'/g, "\\'")}'); openSavedModal();">❌</button>
                </div>`;
        }).join('');
    }
    const savedModal = document.getElementById('savedModal');
    if (savedModal) savedModal.classList.add('active');
}

function closeSavedModal(e?: MouseEvent) {
    const savedModal = document.getElementById('savedModal');
    if (!savedModal) return;

    if (!e || e.target === savedModal) {
        savedModal.classList.remove('active');
    }
}

// ========== FLASHCARDS ==========
function initFlashcards() {
    let pool = currentFilter === 'all' ? cognatesData : cognatesData.filter((c: CognateEntry) => c.category === currentFilter);
    fcCards = [...pool].sort(() => 0.5 - Math.random());
    fcIndex = 0;
    fcKnown = 0;
    showFlashcard();
}

function showFlashcard() {
    if (fcIndex >= fcCards.length) {
        finishFlashcards();
        return;
    }

    const card = fcCards[fcIndex];
    const fcWord = document.getElementById('fcWord');
    const fcTranslation = document.getElementById('fcTranslation');
    const fcType = document.getElementById('fcType');
    const fcCurrent = document.getElementById('fcCurrent');
    const fcTotal = document.getElementById('fcTotal');
    const fcProgress = document.getElementById('fcProgress');
    const flashcard = document.getElementById('flashcard');

    if (fcWord) {
        fcWord.textContent = card.swe;
        TextSizeManager.apply(fcWord as HTMLElement, card.swe);
    }
    if (fcTranslation) {
        fcTranslation.textContent = card.arb;
        TextSizeManager.apply(fcTranslation as HTMLElement, card.arb);
    }
    if (fcType) fcType.textContent = card.type || card.category;
    if (fcCurrent) fcCurrent.textContent = (fcIndex + 1).toString();
    if (fcTotal) fcTotal.textContent = fcCards.length.toString();
    if (fcProgress) fcProgress.style.width = ((fcIndex / fcCards.length) * 100) + '%';
    if (flashcard) flashcard.classList.remove('flipped');
}

function flipCard() {
    const flashcard = document.getElementById('flashcard');
    if (flashcard) {
        flashcard.classList.toggle('flipped');
        playTTS(fcCards[fcIndex].swe);
    }
}

function flashcardAnswer(known: boolean) {
    if (known) {
        fcKnown++;
        if (!learnedWords.includes(fcCards[fcIndex].swe)) {
            learnedWords.push(fcCards[fcIndex].swe);
            saveState();
        }
    }
    fcIndex++;
    showFlashcard();
}

function finishFlashcards() {
    cognatesStreak++;
    saveState();
    const percent = Math.round((fcKnown / fcCards.length) * 100);
    const flashcardView = document.getElementById('flashcardView');
    if (flashcardView) {
        flashcardView.innerHTML = `
            <div class="result-container">
                <div class="result-icon">${percent >= 70 ? '🎉' : '📚'}</div>
                <div class="result-title">${percent >= 70 ? 'Bra jobbat!' : 'Fortsätt öva!'}</div>
                <div class="result-score">${fcKnown} / ${fcCards.length} ord (${percent}%)</div>
                <div class="result-actions">
                    <button class="result-btn primary" onclick="location.reload()">🔄 Igen</button>
                    <button class="result-btn secondary" onclick="switchMode('browse')">← Tillbaka</button>
                </div>
            </div>`;
    }
}

// ========== QUIZ ==========
function startQuiz() {
    let pool = currentFilter === 'all' ? cognatesData : cognatesData.filter((c: CognateEntry) => c.category === currentFilter);
    if (pool.length < 4) {
        alert('Inte tillräckligt med ord!');
        return;
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    quizState = {
        questions: shuffled.slice(0, 10),
        index: 0,
        score: 0,
        pool: pool
    };

    const quizModal = document.getElementById('quizModal');
    if (quizModal) quizModal.classList.add('active');
    renderQuizTypeSelector();
}

function closeQuiz() {
    const quizModal = document.getElementById('quizModal');
    if (quizModal) quizModal.classList.remove('active');
    quizState = null;
}

function renderQuizTypeSelector() {
    const quizContent = document.getElementById('quizContent');
    if (!quizContent) return;

    quizContent.innerHTML = `
        <div class="quiz-header">
            <h2>Välj Quiz-typ / اختر نوع الاختبار</h2>
        </div>
        <div class="quiz-type-selector quiz-type-selector-col">
            <button class="quiz-type-btn quiz-type-btn-large" onclick="setQuizType('normal')">
                🇸🇪→🇸🇦 Svenska → Arabiska
            </button>
            <button class="quiz-type-btn quiz-type-btn-large" onclick="setQuizType('reverse')">
                🇸🇦→🇸🇪 Arabiska → Svenska
            </button>
            <button class="quiz-type-btn quiz-type-btn-large" onclick="setQuizType('audio')">
                🔊 Lyssna → Välj
            </button>
            <button class="quiz-type-btn quiz-type-btn-large" onclick="setQuizType('write')">
                ✍️ Skriv svaret
            </button>
        </div>`;
}

function setQuizType(type: QuizType) {
    quizType = type;
    renderQuizQuestion();
}

function renderQuizQuestion() {
    if (!quizState) return;
    const q = quizState.questions[quizState.index];
    const total = quizState.questions.length;

    const wrongPool = quizState.pool.filter(c => c.swe !== q.swe);
    const wrongOptions = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3);

    let html = `
        <div class="quiz-header">
            <h2>Fråga ${quizState.index + 1} / ${total}</h2>
            <div class="progress-bar">
                <div class="fill" style="width: ${(quizState.index / total) * 100}%"></div>
            </div>
        </div>
        <div class="question-card">`;

    if (quizType === 'normal') {
        const options = [q.arb, ...wrongOptions.map(c => c.arb)].sort(() => 0.5 - Math.random());
        html += `
            <div class="question-text">${q.swe}</div>
            <div class="question-hint">Välj rätt arabisk översättning / اختر الترجمة</div>
            <div class="options-grid" id="optionsGrid">
                ${options.map(opt => `<button class="option-btn arb" data-correct="${opt === q.arb}"
                    onclick="checkAnswer(this, ${opt === q.arb})">${opt}</button>`).join('')}
            </div>`;
    } else if (quizType === 'reverse') {
        const options = [q.swe, ...wrongOptions.map(c => c.swe)].sort(() => 0.5 - Math.random());
        html += `
            <div class="question-text arabic-font">${q.arb}</div>
            <div class="question-hint">Välj rätt svenskt ord / اختر الكلمة السويدية</div>
            <div class="options-grid" id="optionsGrid">
                ${options.map(opt => `<button class="option-btn" data-correct="${opt === q.swe}"
                    onclick="checkAnswer(this, ${opt === q.swe})">${opt}</button>`).join('')}
            </div>`;
    } else if (quizType === 'audio') {
        const options = [q.arb, ...wrongOptions.map(c => c.arb)].sort(() => 0.5 - Math.random());
        html += `
            <div class="question-text"><button class="action-btn" onclick="playTTS('${q.swe.replace(/'/g, "\\'")}')">🔊 Lyssna</button></div>
            <div class="question-hint">Vad hörde du? / ماذا سمعت؟</div>
            <div class="options-grid" id="optionsGrid">
                ${options.map(opt => `<button class="option-btn arb" data-correct="${opt === q.arb}"
                    onclick="checkAnswer(this, ${opt === q.arb})">${opt}</button>`).join('')}
            </div>`;
        setTimeout(() => playTTS(q.swe), 500);
    } else if (quizType === 'write') {
        html += `
            <div class="question-text">${q.swe}</div>
            <div class="question-hint">Skriv den arabiska översättningen / اكتب الترجمة</div>
            <input type="text" class="writing-input" id="writeAnswer" placeholder="اكتب هنا..." dir="rtl">
            <button class="submit-btn" onclick="checkWrittenAnswer('${q.arb.replace(/'/g, "\\'")}')">Kontrollera / تحقق</button>`;
    }

    html += `<div class="feedback" id="feedback"></div>
        </div>`;
    
    const quizContent = document.getElementById('quizContent');
    if (quizContent) {
        quizContent.innerHTML = html;
        // Apply dynamic text sizing
        quizContent.querySelectorAll('.question-text, .option-btn, .writing-input').forEach(el => {
            TextSizeManager.apply(el as HTMLElement, el.textContent || (el as HTMLInputElement).value || '');
        });
    }
}

function checkAnswer(btn: HTMLElement, isCorrect: boolean) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => {
        (b as HTMLButtonElement).disabled = true;
        if (b.getAttribute('data-correct') === 'true') b.classList.add('correct');
        else if (b === btn && !isCorrect) b.classList.add('wrong');
    });

    showFeedback(isCorrect);
}

function checkWrittenAnswer(correctAnswer: string) {
    const inputEl = document.getElementById('writeAnswer') as HTMLInputElement;
    const input = inputEl.value.trim();
    const isCorrect = input === correctAnswer || input.includes(correctAnswer) || correctAnswer.includes(input);
    inputEl.disabled = true;
    const submitBtn = document.querySelector('.submit-btn') as HTMLButtonElement;
    if (submitBtn) submitBtn.disabled = true;
    showFeedback(isCorrect, correctAnswer);
}

function showFeedback(isCorrect: boolean, correctAnswer: string | null = null) {
    if (!quizState) return;
    const feedback = document.getElementById('feedback');
    if (!feedback) return;

    feedback.classList.add('show');
    if (isCorrect) {
        quizState.score++;
        feedback.className = 'feedback show correct';
        feedback.innerHTML = '✅ Rätt! / صحيح!';
    } else {
        feedback.className = 'feedback show wrong';
        feedback.innerHTML = `❌ Fel! ${correctAnswer ? 'Rätt: ' + correctAnswer : ''}`;
    }

    setTimeout(() => {
        if (!quizState) return;
        quizState.index++;
        if (quizState.index < quizState.questions.length) {
            renderQuizQuestion();
        } else {
            showQuizResults();
        }
    }, 1500);
}

function showQuizResults() {
    if (!quizState) return;
    const score = quizState.score;
    const total = quizState.questions.length;
    const percent = Math.round((score / total) * 100);
    const passed = percent >= 60;

    if (passed) cognatesStreak++;
    saveState();

    const quizContent = document.getElementById('quizContent');
    if (quizContent) {
        quizContent.innerHTML = `
            <div class="result-container">
                <div class="result-icon">${passed ? '🎉' : '😕'}</div>
                <div class="result-title">${passed ? 'Grattis! / مبروك!' : 'Försök igen'}</div>
                <div class="result-score">${score} / ${total} rätt (${percent}%)</div>
                <div class="result-actions">
                    <button class="result-btn primary" onclick="startQuiz()">🔄 Gör om</button>
                    <button class="result-btn secondary" onclick="closeQuiz()">← Tillbaka</button>
                </div>
            </div>`;
    }
}

// Initial Call
document.addEventListener('DOMContentLoaded', init);
