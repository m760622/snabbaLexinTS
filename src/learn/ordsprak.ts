// Ordspråk - Swedish Proverbs Learning Module
import ordsprakData from '../data/ordsprak.json';
import { TTSManager } from '../tts';

console.log('[Ordspråk] Module loaded');

// ========== TYPES ==========
interface Proverb {
    id: number;
    swedishProverb: string;
    literalMeaning: string;
    arabicEquivalent: string;
    verb: string;
    verbTranslation: string;
    verbInfinitive: string;
    verbPresent: string;
    verbPast: string;
    verbSupine: string;
}

interface QuizState {
    questions: Proverb[];
    index: number;
    score: number;
}

// ========== STATE ==========
const PROVERBS: Proverb[] = ordsprakData as Proverb[];
let savedProverbs: number[] = JSON.parse(localStorage.getItem('ordsprak_saved') || '[]');
let learnedProverbs: number[] = JSON.parse(localStorage.getItem('ordsprak_learned') || '[]');
let streakCount = parseInt(localStorage.getItem('ordsprak_streak') || '0');
let lastVisitDate = localStorage.getItem('ordsprak_last_visit') || '';

// Flashcard state
let flashcardDeck: Proverb[] = [];
let flashcardIndex = 0;
let isFlashcardFlipped = false;

// Quiz state
let quizState: QuizState = { questions: [], index: 0, score: 0 };

// Lazy loading
const ITEMS_PER_BATCH = 15;
let currentBatchIndex = 0;
let filteredProverbs: Proverb[] = [];
let loadMoreObserver: IntersectionObserver | null = null;

// ========== INIT ==========
function init() {
    console.log('[Ordspråk] Initializing...');
    calculateStreak();
    filteredProverbs = [...PROVERBS];
    updateStats();
    renderContent();
    setupEventListeners();
    loadMobileView();
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }
}

function calculateStreak() {
    const today = new Date().toISOString().split('T')[0];
    if (lastVisitDate !== today) {
        if (lastVisitDate) {
            const lastDate = new Date(lastVisitDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays === 1) {
                streakCount++;
            } else if (diffDays > 1) {
                streakCount = 1;
            }
        } else {
            streakCount = 1;
        }
        lastVisitDate = today;
        saveState();
    }
}

function saveState() {
    localStorage.setItem('ordsprak_saved', JSON.stringify(savedProverbs));
    localStorage.setItem('ordsprak_learned', JSON.stringify(learnedProverbs));
    localStorage.setItem('ordsprak_streak', streakCount.toString());
    localStorage.setItem('ordsprak_last_visit', lastVisitDate);
}

function updateStats() {
    const totalEl = document.getElementById('totalProverbs');
    const learnedEl = document.getElementById('learnedCount');
    const streakEl = document.getElementById('streakCount');
    const savedCountEl = document.getElementById('savedCount');

    if (totalEl) totalEl.textContent = PROVERBS.length.toString();
    if (learnedEl) learnedEl.textContent = learnedProverbs.length.toString();
    if (streakEl) streakEl.textContent = streakCount.toString();
    if (savedCountEl) savedCountEl.textContent = savedProverbs.length.toString();
}

// ========== MOBILE VIEW ==========
function toggleMobileView() {
    const isMobile = document.body.classList.toggle('iphone-view');
    localStorage.setItem('mobileView', isMobile.toString());
    const btn = document.getElementById('mobileToggle');
    if (btn) btn.classList.toggle('mobile-active', isMobile);
}

function loadMobileView() {
    const savedMobile = localStorage.getItem('mobileView') === 'true';
    if (savedMobile) document.body.classList.add('iphone-view');
    const btn = document.getElementById('mobileToggle');
    if (btn) btn.classList.toggle('mobile-active', savedMobile);
}

// ========== MODE SWITCHING ==========
function switchMode(mode: string) {
    // Hide all views
    document.getElementById('browseView')?.classList.remove('active');
    document.getElementById('flashcardView')?.classList.remove('active');
    document.getElementById('quizView')?.classList.remove('active');
    document.getElementById('savedView')?.classList.remove('active');

    // Update tab states
    document.querySelectorAll('.mode-tab').forEach((tab, i) => {
        const modes = ['browse', 'flashcard', 'saved', 'quiz'];
        tab.classList.toggle('active', modes[i] === mode);
    });

    // Show selected view
    if (mode === 'browse') {
        document.getElementById('browseView')?.classList.add('active');
    } else if (mode === 'flashcard') {
        document.getElementById('flashcardView')?.classList.add('active');
        initFlashcards();
    } else if (mode === 'saved') {
        document.getElementById('savedView')?.classList.add('active');
        renderSavedProverbs();
    } else if (mode === 'quiz') {
        document.getElementById('quizView')?.classList.add('active');
        startQuiz();
    }
}

function openSavedModal() {
    switchMode('saved');
}

// ========== SEARCH ==========
function handleSearch(e: Event) {
    const query = (e.target as HTMLInputElement).value.toLowerCase().trim();

    if (!query) {
        filteredProverbs = [...PROVERBS];
    } else {
        filteredProverbs = PROVERBS.filter(p =>
            p.swedishProverb.toLowerCase().includes(query) ||
            p.arabicEquivalent.includes(query) ||
            p.literalMeaning.includes(query) ||
            p.verb.toLowerCase().includes(query)
        );
    }

    currentBatchIndex = 0;
    renderContent();
}

// ========== BROWSE VIEW ==========
function renderContent() {
    const container = document.getElementById('content');
    if (!container) return;

    currentBatchIndex = 0;
    container.innerHTML = '';

    if (filteredProverbs.length === 0) {
        container.innerHTML = '<div class="no-results"><span class="sv-text">Inga resultat</span><span class="ar-text">لا توجد نتائج</span></div>';
        return;
    }

    renderNextBatch(container);
    setupLazyLoading(container);
}

function renderNextBatch(container: HTMLElement) {
    const startIndex = currentBatchIndex * ITEMS_PER_BATCH;
    const endIndex = Math.min(startIndex + ITEMS_PER_BATCH, filteredProverbs.length);

    if (startIndex >= filteredProverbs.length) return;

    const oldSentinel = container.querySelector('.load-more-sentinel');
    if (oldSentinel) oldSentinel.remove();

    for (let i = startIndex; i < endIndex; i++) {
        const proverb = filteredProverbs[i];
        const card = createProverbCard(proverb);
        container.appendChild(card);
    }

    currentBatchIndex++;

    if (endIndex < filteredProverbs.length) {
        const sentinel = document.createElement('div');
        sentinel.className = 'load-more-sentinel';
        sentinel.innerHTML = `<span class="loading-text">⏳ Laddar...</span>`;
        container.appendChild(sentinel);
    }

    const newSentinel = container.querySelector('.load-more-sentinel');
    if (newSentinel && loadMoreObserver) {
        loadMoreObserver.observe(newSentinel);
    }
}

function setupLazyLoading(container: HTMLElement) {
    if (loadMoreObserver) loadMoreObserver.disconnect();

    loadMoreObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.classList.contains('load-more-sentinel')) {
                renderNextBatch(container);
            }
        });
    }, { rootMargin: '200px', threshold: 0.1 });

    const sentinel = container.querySelector('.load-more-sentinel');
    if (sentinel) loadMoreObserver.observe(sentinel);
}

function createProverbCard(proverb: Proverb): HTMLElement {
    const card = document.createElement('div');
    card.className = 'proverb-card';
    const isSaved = savedProverbs.includes(proverb.id);
    const isLearned = learnedProverbs.includes(proverb.id);

    card.innerHTML = `
        <div class="proverb-header">
            <span class="proverb-number">${proverb.id}</span>
            <div class="proverb-actions">
                <button class="speak-btn" onclick="speakProverb(${proverb.id})" title="Lyssna / استمع">🔊</button>
                <button class="save-btn ${isSaved ? 'saved' : ''}" onclick="toggleSave(${proverb.id})" title="Spara / حفظ">${isSaved ? '⭐' : '☆'}</button>
                <button class="learn-btn ${isLearned ? 'learned' : ''}" onclick="toggleLearned(${proverb.id})" title="Lärt / تعلمت">${isLearned ? '✅' : '⬜'}</button>
            </div>
        </div>
        <div class="proverb-swedish">${proverb.swedishProverb}</div>
        <div class="proverb-literal">📝 ${proverb.literalMeaning}</div>
        <div class="proverb-arabic">🌙 ${proverb.arabicEquivalent}</div>
        <div class="verb-conjugation">
            <div class="verb-header">
                <span class="verb-main">${proverb.verb}</span>
                <span class="verb-translation">${proverb.verbTranslation}</span>
            </div>
            <div class="verb-forms">
                <div class="verb-form"><span class="label">Infinitiv</span><span class="value">${proverb.verbInfinitive}</span></div>
                <div class="verb-form"><span class="label">Presens</span><span class="value">${proverb.verbPresent}</span></div>
                <div class="verb-form"><span class="label">Preteritum</span><span class="value">${proverb.verbPast}</span></div>
                <div class="verb-form"><span class="label">Supinum</span><span class="value">${proverb.verbSupine}</span></div>
            </div>
        </div>
    `;

    return card;
}

function speakProverb(id: number) {
    const proverb = PROVERBS.find(p => p.id === id);
    if (!proverb) return;

    if (typeof TTSManager !== 'undefined' && TTSManager) {
        TTSManager.speak(proverb.swedishProverb, 'sv');
    } else {
        const utterance = new SpeechSynthesisUtterance(proverb.swedishProverb);
        utterance.lang = 'sv-SE';
        utterance.rate = 0.9;
        speechSynthesis.speak(utterance);
    }
}

function toggleSave(id: number) {
    const index = savedProverbs.indexOf(id);
    if (index > -1) {
        savedProverbs.splice(index, 1);
    } else {
        savedProverbs.push(id);
    }
    saveState();
    updateStats();

    // Update button in card
    const btn = document.querySelector(`.proverb-card .save-btn[onclick="toggleSave(${id})"]`);
    if (btn) {
        btn.classList.toggle('saved');
        btn.textContent = savedProverbs.includes(id) ? '⭐' : '☆';
    }
}

function toggleLearned(id: number) {
    const index = learnedProverbs.indexOf(id);
    if (index > -1) {
        learnedProverbs.splice(index, 1);
    } else {
        learnedProverbs.push(id);
    }
    saveState();
    updateStats();

    // Update button in card
    const btn = document.querySelector(`.proverb-card .learn-btn[onclick="toggleLearned(${id})"]`);
    if (btn) {
        btn.classList.toggle('learned');
        btn.textContent = learnedProverbs.includes(id) ? '✅' : '⬜';
    }
}

// ========== SAVED VIEW ==========
function renderSavedProverbs() {
    const container = document.getElementById('savedList');
    if (!container) return;

    if (savedProverbs.length === 0) {
        container.innerHTML = '<div class="no-saved"><span class="sv-text">Inga sparade ordspråk</span><span class="ar-text">لا توجد أمثال محفوظة</span></div>';
        return;
    }

    container.innerHTML = '';
    savedProverbs.forEach(id => {
        const proverb = PROVERBS.find(p => p.id === id);
        if (proverb) {
            const card = createProverbCard(proverb);
            container.appendChild(card);
        }
    });
}

// ========== FLASHCARDS ==========
function initFlashcards() {
    flashcardDeck = [...PROVERBS].sort(() => 0.5 - Math.random()).slice(0, 20);
    flashcardIndex = 0;
    isFlashcardFlipped = false;
    showFlashcard();
}

function showFlashcard() {
    if (flashcardIndex >= flashcardDeck.length) {
        finishFlashcards();
        return;
    }

    const proverb = flashcardDeck[flashcardIndex];
    const card = document.getElementById('flashcard');
    const wordEl = document.getElementById('fcWord');
    const transEl = document.getElementById('fcTranslation');
    const literalEl = document.getElementById('fcLiteral');
    const currentEl = document.getElementById('fcCurrent');
    const totalEl = document.getElementById('fcTotal');
    const progressEl = document.getElementById('fcProgress');

    if (card) card.classList.remove('flipped');
    if (wordEl) wordEl.textContent = proverb.swedishProverb;
    if (transEl) transEl.textContent = proverb.arabicEquivalent;
    if (literalEl) literalEl.textContent = proverb.literalMeaning;
    if (currentEl) currentEl.textContent = (flashcardIndex + 1).toString();
    if (totalEl) totalEl.textContent = flashcardDeck.length.toString();
    if (progressEl) progressEl.style.width = `${((flashcardIndex + 1) / flashcardDeck.length) * 100}%`;

    isFlashcardFlipped = false;
}

function flipCard() {
    const card = document.getElementById('flashcard');
    if (card) {
        card.classList.toggle('flipped');
        isFlashcardFlipped = !isFlashcardFlipped;
    }
}

function flashcardAnswer(known: boolean) {
    if (known) {
        const proverb = flashcardDeck[flashcardIndex];
        if (!learnedProverbs.includes(proverb.id)) {
            learnedProverbs.push(proverb.id);
            saveState();
            updateStats();
        }
    }
    flashcardIndex++;
    showFlashcard();
}

function finishFlashcards() {
    const container = document.getElementById('flashcardView');
    if (container) {
        container.innerHTML = `
            <div class="flashcard-complete">
                <div class="complete-icon">🎉</div>
                <h2><span class="sv-text">Bra jobbat!</span><span class="ar-text">عمل رائع!</span></h2>
                <p><span class="sv-text">Du har gått igenom ${flashcardDeck.length} ordspråk</span><span class="ar-text">لقد راجعت ${flashcardDeck.length} مثل</span></p>
                <button class="restart-btn" onclick="initFlashcards()"><span class="sv-text">Börja om</span><span class="ar-text">ابدأ من جديد</span></button>
                <button class="back-btn-inline" onclick="switchMode('browse')"><span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
            </div>
        `;
    }
}

// ========== QUIZ ==========
function startQuiz() {
    quizState = {
        questions: [...PROVERBS].sort(() => 0.5 - Math.random()).slice(0, 10),
        index: 0,
        score: 0
    };
    renderQuizQuestion();
}

function renderQuizQuestion() {
    const container = document.getElementById('quizContent');
    if (!container) return;

    if (quizState.index >= quizState.questions.length) {
        showQuizResults();
        return;
    }

    const question = quizState.questions[quizState.index];

    // Generate options (1 correct + 3 wrong)
    const options = [question];
    while (options.length < 4) {
        const random = PROVERBS[Math.floor(Math.random() * PROVERBS.length)];
        if (!options.find(o => o.id === random.id)) {
            options.push(random);
        }
    }
    const shuffled = options.sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <div class="quiz-progress">
            <div class="quiz-progress-text">${quizState.index + 1} / ${quizState.questions.length}</div>
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width: ${((quizState.index + 1) / quizState.questions.length) * 100}%"></div>
            </div>
        </div>
        <div class="quiz-question">
            <div class="quiz-label"><span class="sv-text">Vilket arabiskt ordspråk motsvarar detta?</span><span class="ar-text">ما المثل العربي المقابل؟</span></div>
            <div class="quiz-swedish">${question.swedishProverb}</div>
        </div>
        <div class="quiz-options">
            ${shuffled.map(opt => `
                <button class="quiz-option" onclick="checkQuizAnswer(${opt.id}, ${question.id}, this)">
                    ${opt.arabicEquivalent}
                </button>
            `).join('')}
        </div>
    `;
}

function checkQuizAnswer(selectedId: number, correctId: number, btn: HTMLElement) {
    const buttons = document.querySelectorAll('.quiz-option');
    buttons.forEach(b => (b as HTMLButtonElement).disabled = true);

    if (selectedId === correctId) {
        btn.classList.add('correct');
        quizState.score++;
    } else {
        btn.classList.add('wrong');
        // Highlight correct answer
        buttons.forEach(b => {
            const bId = parseInt(b.getAttribute('onclick')?.match(/\d+/)?.[0] || '0');
            if (bId === correctId) b.classList.add('correct');
        });
    }

    setTimeout(() => {
        quizState.index++;
        renderQuizQuestion();
    }, 1500);
}

function showQuizResults() {
    const container = document.getElementById('quizContent');
    if (!container) return;

    const percentage = Math.round((quizState.score / quizState.questions.length) * 100);
    let message = '';
    let icon = '';

    if (percentage === 100) { message = 'Perfekt! / ممتاز!'; icon = '🏆'; }
    else if (percentage >= 80) { message = 'Mycket bra! / رائع جداً'; icon = '🌟'; }
    else if (percentage >= 50) { message = 'Bra jobbat! / أحسنت!'; icon = '👍'; }
    else { message = 'Fortsätt öva! / واصل التدريب!'; icon = '📚'; }

    container.innerHTML = `
        <div class="quiz-results">
            <div class="result-icon">${icon}</div>
            <div class="result-message">${message}</div>
            <div class="result-score">${quizState.score} / ${quizState.questions.length}</div>
            <div class="result-percentage">${percentage}%</div>
            <div class="result-actions">
                <button class="result-btn" onclick="startQuiz()"><span class="sv-text">Försök igen</span><span class="ar-text">حاول مرة أخرى</span></button>
                <button class="result-btn secondary" onclick="switchMode('browse')"><span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
            </div>
        </div>
    `;
}

// ========== GLOBAL EXPORTS ==========
(window as any).switchMode = switchMode;
(window as any).toggleMobileView = toggleMobileView;
(window as any).openSavedModal = openSavedModal;
(window as any).speakProverb = speakProverb;
(window as any).toggleSave = toggleSave;
(window as any).toggleLearned = toggleLearned;
(window as any).flipCard = flipCard;
(window as any).flashcardAnswer = flashcardAnswer;
(window as any).initFlashcards = initFlashcards;
(window as any).startQuiz = startQuiz;
(window as any).checkQuizAnswer = checkQuizAnswer;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);
