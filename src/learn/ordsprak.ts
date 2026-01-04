// Ordspråk - Swedish Proverbs Learning Module
import ordsprakData from '../data/ordsprak.json';
import { TTSManager } from '../tts';
import LanguageManager from '../i18n';

console.log('[Ordspråk] Module loaded');

// Initialize Language Manager
if (LanguageManager) {
    LanguageManager.init();
}

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

// Make functions available globally for HTML onclick events
declare global {
    interface Window {
        switchMode: (mode: string) => void;
        initFlashcards: () => void;
        flashcardAnswer: (known: boolean) => void;
        openSavedModal: () => void;
        toggleSave: (id: number) => void;
        toggleLearned: (id: number) => void;
        speakProverb: (id: number) => void;
        toggleFilters: () => void;
        setFilter: (filter: any) => void;
        setTopicFilter: (topic: string) => void;
        checkFillBlankAnswer: (selected: string, correct: string, btn: HTMLElement) => void;
        toggleMobileView: () => void;
        flipCard: () => void;
        startAllFlashcards: () => void;
        startSavedFlashcards: () => void;
        togglePlay: () => void;
        playNext: () => void;
        playPrev: () => void;
        closeAudioPlayer: () => void;
        toggleSpeed: () => void;
        togglePlayerRepeat: () => void;
    }
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
let flashcardMode: 'all' | 'saved' = 'all';

// Audio Player State
let isPlaying = false;
let currentAudioIndex = 0;
let playbackSpeed = 1.0;
let audioQueue: Proverb[] = []; // Queue to play
let currentAudioTimeout: any = null;

// ... (existing code) ...

// ========== FLASHCARDS ==========
function startAllFlashcards() {
    flashcardMode = 'all';
    switchMode('flashcard');
}

function startSavedFlashcards() {
    flashcardMode = 'saved';
    switchMode('flashcard');
}

function initFlashcards() {
    // Restore DOM structure if it was replaced by completion screen
    const container = document.getElementById('flashcardView');
    if (container && !document.getElementById('flashcard')) {
        container.innerHTML = `
            <div class="flashcard-progress">
                <div class="progress-text"><span id="fcCurrent">0</span> / <span id="fcTotal">0</span></div>
                <div class="progress-bar">
                    <div class="fill" id="fcProgress"></div>
                </div>
            </div>

            <div class="flashcard" id="flashcard" onclick="flipCard()">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <div class="flashcard-word" id="fcWord"></div>
                        <div class="flashcard-hint"><span class="sv-text">Klicka för att vända</span><span
                                class="ar-text">اضغط للقلب</span></div>
                    </div>
                    <div class="flashcard-back">
                        <div class="flashcard-translation" id="fcTranslation"></div>
                        <div class="flashcard-literal" id="fcLiteral"></div>
                    </div>
                </div>
            </div>

            <div class="flashcard-controls">
                <button class="fc-btn wrong" onclick="flashcardAnswer(false)">❌ <span class="sv-text">Inte
                        än</span><span class="ar-text">ليس بعد</span></button>
                <button class="fc-btn correct" onclick="flashcardAnswer(true)">✅ <span class="sv-text">Kan
                        det!</span><span class="ar-text">أعرفها!</span></button>
            </div>
        `;
    }

    let pool = [...PROVERBS];

    // Filter if in 'saved' mode
    if (flashcardMode === 'saved') {
        pool = pool.filter(p => savedProverbs.includes(p.id));
        if (pool.length === 0) {
            alert('Du har inga sparade ordspråk än! / ليس لديك أمثال محفوظة بعد!');
            switchMode('browse');
            return;
        }
    }

    // Shuffle
    flashcardDeck = pool.sort(() => 0.5 - Math.random());

    // Limit to 20 only if in 'all' mode (study all saved items if in saved mode)
    if (flashcardMode === 'all') {
        flashcardDeck = flashcardDeck.slice(0, 20);
    }

    flashcardIndex = 0;
    isFlashcardFlipped = false;
    showFlashcard();
}



// ... 

// function showFlashcard() { removed
let quizState: QuizState = { questions: [], index: 0, score: 0 };

// Lazy loading
const ITEMS_PER_BATCH = 15;
let currentBatchIndex = 0;
let filteredProverbs: Proverb[] = [];
let loadMoreObserver: IntersectionObserver | null = null;
let currentFilter: 'all' | 'saved' | 'learned' | 'notLearned' = 'all';
let currentTopicFilter: string = 'all';
let filtersVisible = false;

// Topic detection keywords
const TOPIC_KEYWORDS: Record<string, string[]> = {
    patience: ['vänta', 'tålamod', 'tid', 'rom', 'sent', 'långsam', 'صبر', 'انتظ', 'تأخ'],
    wisdom: ['visdom', 'tala', 'tiga', 'guld', 'silver', 'klok', 'حكم', 'ذهب', 'فضة', 'سكوت'],
    consequences: ['bädda', 'ligga', 'bränt', 'skyr', 'dropp', 'bägar', 'جزاء', 'عاقب', 'قصم'],
    family: ['barn', 'äpple', 'träd', 'fader', 'moder', 'أب', 'أم', 'ابن', 'شجرة'],
    experience: ['fågel', 'hand', 'skogen', 'björn', 'skinn', 'تجرب', 'يد', 'عصفور'],
    time: ['morgon', 'dag', 'tid', 'aldrig', 'läka', 'sår', 'وقت', 'زمن', 'يوم', 'صباح'],
    speech: ['tala', 'höra', 'öron', 'säga', 'ropa', 'كلام', 'سمع', 'آذان', 'قول'],
    nature: ['fågel', 'träd', 'sommar', 'vinter', 'gräs', 'vatten', 'طبيع', 'شجر', 'عشب', 'ماء'],
    love: ['kärlek', 'hjärta', 'älska', 'حب', 'قلب', 'عشق']
};

// Detect topic of a proverb
function detectTopic(proverb: Proverb): string {
    const text = `${proverb.swedishProverb} ${proverb.literalMeaning} ${proverb.arabicEquivalent}`.toLowerCase();

    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
        for (const keyword of keywords) {
            if (text.includes(keyword.toLowerCase())) {
                return topic;
            }
        }
    }
    return 'wisdom'; // Default topic
}

// ========== INIT ==========
function init() {
    console.log('[Ordspråk] Initializing...');
    calculateStreak();
    filteredProverbs = [...PROVERBS];
    updateStats();
    renderContent();
    setupEventListeners();
    loadMobileView();
    // Ensure browse view is active on init
    document.getElementById('browseView')?.classList.add('active');
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
    document.querySelectorAll('.mode-tab').forEach((tab) => {
        const onclick = tab.getAttribute('onclick');
        if (onclick && onclick.includes(`'${mode}'`)) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
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
    } else if (mode === 'quiz-fill') {
        document.getElementById('quizView')?.classList.add('active');
        startFillBlankQuiz();
    } else if (mode === 'quiz-match') {
        document.getElementById('quizView')?.classList.add('active');
        startMatchingQuiz();
    }
}

function openSavedModal() {
    switchMode('saved');
}

// ========== FILTER ==========
function toggleFilters() {
    filtersVisible = !filtersVisible;
    const dropdown = document.getElementById('filtersDropdown');
    const toggleBtn = document.getElementById('filterToggleBtn');

    if (dropdown) {
        dropdown.classList.toggle('collapsed', !filtersVisible);
    }
    if (toggleBtn) {
        toggleBtn.classList.toggle('active', filtersVisible);
    }

    // Update counters when filters are shown
    if (filtersVisible) {
        updateFilterCounters();
    }
}

function setFilter(filter: typeof currentFilter) {
    currentFilter = filter;

    // Update chip states
    document.querySelectorAll('.filter-chip[data-filter]').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-filter') === filter);
    });

    updateFilterBadge();
    applyFilters();
}

function setTopicFilter(topic: string) {
    currentTopicFilter = topic;

    // Update topic chip states
    document.querySelectorAll('.topic-chip').forEach(chip => {
        chip.classList.toggle('active', chip.getAttribute('data-topic') === topic);
    });

    updateFilterBadge();
    applyFilters();
}

function updateFilterBadge() {
    const badge = document.getElementById('filterBadge');
    if (!badge) return;

    let count = 0;
    if (currentFilter !== 'all') count++;
    if (currentTopicFilter !== 'all') count++;

    badge.textContent = count.toString();
    badge.style.display = count > 0 ? 'flex' : 'none';
}

function updateFilterCounters() {
    // Status filter counts
    const allCount = PROVERBS.length;
    const savedCount = savedProverbs.length;
    const learnedCount = learnedProverbs.length;
    const notLearnedCount = PROVERBS.filter(p => !learnedProverbs.includes(p.id)).length;

    // Update status filter counters
    updateChipCounter('all', allCount);
    updateChipCounter('saved', savedCount);
    updateChipCounter('learned', learnedCount);
    updateChipCounter('notLearned', notLearnedCount);

    // Topic filter counts
    const topicCounts: Record<string, number> = {
        all: PROVERBS.length,
        patience: 0,
        wisdom: 0,
        consequences: 0,
        family: 0,
        experience: 0,
        time: 0,
        speech: 0,
        nature: 0,
        love: 0
    };

    // Count proverbs per topic
    PROVERBS.forEach(p => {
        const topic = detectTopic(p);
        if (topicCounts[topic] !== undefined) {
            topicCounts[topic]++;
        }
    });

    // Update topic filter counters
    Object.entries(topicCounts).forEach(([topic, count]) => {
        updateTopicCounter(topic, count);
    });
}

function updateChipCounter(filter: string, count: number) {
    const chip = document.querySelector(`.filter-chip[data-filter="${filter}"]`);
    if (!chip) return;

    let counter = chip.querySelector('.filter-counter');
    if (!counter) {
        counter = document.createElement('span');
        counter.className = 'filter-counter';
        chip.appendChild(counter);
    }
    counter.textContent = count.toString();
}

function updateTopicCounter(topic: string, count: number) {
    const chip = document.querySelector(`.topic-chip[data-topic="${topic}"]`);
    if (!chip) return;

    let counter = chip.querySelector('.filter-counter');
    if (!counter) {
        counter = document.createElement('span');
        counter.className = 'filter-counter';
        chip.appendChild(counter);
    }
    counter.textContent = count.toString();
}

function applyFilters() {
    const searchInput = document.getElementById('searchInput') as HTMLInputElement;
    const query = searchInput?.value.toLowerCase().trim() || '';

    // Start with all or filtered by status
    let result = [...PROVERBS];

    // Apply status filter
    if (currentFilter === 'saved') {
        result = result.filter(p => savedProverbs.includes(p.id));
    } else if (currentFilter === 'learned') {
        result = result.filter(p => learnedProverbs.includes(p.id));
    } else if (currentFilter === 'notLearned') {
        result = result.filter(p => !learnedProverbs.includes(p.id));
    }

    // Apply topic filter
    if (currentTopicFilter !== 'all') {
        result = result.filter(p => detectTopic(p) === currentTopicFilter);
    }

    // Apply search filter
    if (query) {
        result = result.filter(p =>
            p.swedishProverb.toLowerCase().includes(query) ||
            p.arabicEquivalent.includes(query) ||
            p.literalMeaning.includes(query) ||
            p.verb.toLowerCase().includes(query)
        );
    }

    filteredProverbs = result;
    currentBatchIndex = 0;
    renderContent();
}

// ========== SEARCH ==========
function handleSearch() {
    applyFilters();
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
// ========== FLASHCARDS ==========
// Duplicate initFlashcards removed


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

// ========== FILL IN THE BLANK QUIZ ==========
interface FillBlankQuestion {
    proverb: Proverb;
    blankWord: string;
    blankIndex: number;
    options: string[];
}

let fillBlankState: {
    questions: FillBlankQuestion[];
    index: number;
    score: number;
} = { questions: [], index: 0, score: 0 };

function startFillBlankQuiz() {
    // Select 10 random proverbs (non-repeating)
    const shuffled = [...PROVERBS].sort(() => 0.5 - Math.random());
    const selectedProverbs = shuffled.slice(0, 10);

    // Create fill-in-the-blank questions
    fillBlankState = {
        questions: selectedProverbs.map(p => createFillBlankQuestion(p)),
        index: 0,
        score: 0
    };

    renderFillBlankQuestion();
}

function createFillBlankQuestion(proverb: Proverb): FillBlankQuestion {
    // Split the proverb into words
    const words = proverb.swedishProverb.split(/\s+/);

    // Skip very short words and first/last words for better challenge
    const validIndices = words
        .map((w, i) => ({ word: w, index: i }))
        .filter(item =>
            item.word.length >= 3 &&
            item.index > 0 &&
            item.index < words.length - 1 &&
            !/^[0-9]+$/.test(item.word) // Skip numbers
        );

    // If no valid indices, just pick a word from middle
    let chosenItem;
    if (validIndices.length > 0) {
        chosenItem = validIndices[Math.floor(Math.random() * validIndices.length)];
    } else {
        const midIndex = Math.floor(words.length / 2);
        chosenItem = { word: words[midIndex], index: midIndex };
    }

    const blankWord = chosenItem.word;
    const blankIndex = chosenItem.index;

    // Generate wrong options (3 similar words from other proverbs)
    const wrongOptions: string[] = [];
    const usedWords = new Set([blankWord.toLowerCase()]);

    for (const p of PROVERBS) {
        if (wrongOptions.length >= 3) break;

        const otherWords = p.swedishProverb.split(/\s+/);
        for (const w of otherWords) {
            if (wrongOptions.length >= 3) break;
            if (w.length >= 3 &&
                !usedWords.has(w.toLowerCase()) &&
                !/^[0-9]+$/.test(w)) {
                wrongOptions.push(w);
                usedWords.add(w.toLowerCase());
            }
        }
    }

    // Shuffle all options together
    const allOptions = [blankWord, ...wrongOptions].sort(() => 0.5 - Math.random());

    return {
        proverb,
        blankWord,
        blankIndex,
        options: allOptions
    };
}

function renderFillBlankQuestion() {
    const container = document.getElementById('quizContent');
    if (!container) return;

    if (fillBlankState.index >= fillBlankState.questions.length) {
        showQuizResults();
        return;
    }

    const q = fillBlankState.questions[fillBlankState.index];
    const words = q.proverb.swedishProverb.split(/\s+/);

    // Create the proverb with blank
    const proverbWithBlank = words.map((word, i) => {
        if (i === q.blankIndex) {
            return `<span class="blank-word">______</span>`;
        }
        return word;
    }).join(' ');

    container.innerHTML = `
        <div class="quiz-progress">
            <div class="quiz-progress-text">${fillBlankState.index + 1} / ${fillBlankState.questions.length}</div>
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width: ${((fillBlankState.index + 1) / fillBlankState.questions.length) * 100}%"></div>
            </div>
        </div>
        <div class="quiz-question">
            <div class="quiz-label"><span class="sv-text">Välj rätt ord för att komplettera ordspråket:</span><span class="ar-text">اختر الكلمة الصحيحة لإكمال المثل:</span></div>
            <div class="quiz-swedish fill-blank">${proverbWithBlank}</div>
        </div>
        <div class="quiz-options fill-blank-options">
            ${q.options.map(opt => `
                <button class="quiz-option fill-blank-option" onclick="checkFillBlankAnswer('${opt.replace(/'/g, "\\'")}', '${q.blankWord.replace(/'/g, "\\'")}', this)">
                    ${opt}
                </button>
            `).join('')}
        </div>
        <div class="quiz-feedback" id="quizFeedback" style="display: none;"></div>
    `;
}

function checkFillBlankAnswer(selected: string, correct: string, btn: HTMLElement) {
    const buttons = document.querySelectorAll('.fill-blank-option');
    buttons.forEach(b => (b as HTMLButtonElement).disabled = true);

    const q = fillBlankState.questions[fillBlankState.index];
    const feedbackEl = document.getElementById('quizFeedback');
    const isCorrect = selected.toLowerCase() === correct.toLowerCase();

    if (isCorrect) {
        btn.classList.add('correct');
        fillBlankState.score++;
    } else {
        btn.classList.add('wrong');
        // Highlight correct answer
        buttons.forEach(b => {
            if (b.textContent?.trim().toLowerCase() === correct.toLowerCase()) {
                b.classList.add('correct');
            }
        });
    }

    // Show the complete proverb and Arabic translation
    if (feedbackEl) {
        feedbackEl.style.display = 'block';
        feedbackEl.innerHTML = `
            <div class="feedback-content ${isCorrect ? 'correct' : 'wrong'}">
                <div class="feedback-icon">${isCorrect ? '✅' : '❌'}</div>
                <div class="feedback-message">
                    <span class="sv-text">${isCorrect ? 'Rätt!' : 'Fel!'}</span>
                    <span class="ar-text">${isCorrect ? 'صحيح!' : 'خطأ!'}</span>
                </div>
                <div class="complete-proverb">
                    <div class="proverb-text-sv">"${q.proverb.swedishProverb}"</div>
                </div>
                <div class="arabic-translation">
                    <div class="translation-label"><span class="sv-text">Arabiskt motsvarighet:</span><span class="ar-text">المثل العربي المقابل:</span></div>
                    <div class="proverb-text-ar">"${q.proverb.arabicEquivalent}"</div>
                </div>
                <div class="literal-meaning">
                    <div class="literal-label"><span class="sv-text">Ordagrann översättning:</span><span class="ar-text">الترجمة الحرفية:</span></div>
                    <div class="literal-text">"${q.proverb.literalMeaning}"</div>
                </div>
            </div>
        `;
    }

    setTimeout(() => {
        fillBlankState.index++;
        renderFillBlankQuestion();
    }, 3500);
}

function showQuizResults() {
    const container = document.getElementById('quizContent');
    if (!container) return;

    const percentage = Math.round((fillBlankState.score / fillBlankState.questions.length) * 100);
    let message = '';
    let messageAr = '';
    let icon = '';

    if (percentage === 100) {
        message = 'Perfekt!';
        messageAr = 'ممتاز!';
        icon = '🏆';
    } else if (percentage >= 80) {
        message = 'Mycket bra!';
        messageAr = 'رائع جداً!';
        icon = '🌟';
    } else if (percentage >= 50) {
        message = 'Bra jobbat!';
        messageAr = 'أحسنت!';
        icon = '👍';
    } else {
        message = 'Fortsätt öva!';
        messageAr = 'واصل التدريب!';
        icon = '📚';
    }

    container.innerHTML = `
        <div class="quiz-results">
            <div class="result-icon">${icon}</div>
            <div class="result-message"><span class="sv-text">${message}</span><span class="ar-text">${messageAr}</span></div>
            <div class="result-score">${fillBlankState.score} / ${fillBlankState.questions.length}</div>
            <div class="result-percentage">${percentage}%</div>
            <div class="result-stats">
                <div class="stat-item">
                    <span class="stat-icon">✅</span>
                    <span class="stat-value">${fillBlankState.score}</span>
                    <span class="stat-label"><span class="sv-text">Rätt</span><span class="ar-text">صحيح</span></span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">❌</span>
                    <span class="stat-value">${fillBlankState.questions.length - fillBlankState.score}</span>
                    <span class="stat-label"><span class="sv-text">Fel</span><span class="ar-text">خطأ</span></span>
                </div>
            </div>
            <div class="result-actions">
                <button class="result-btn" onclick="startFillBlankQuiz()"><span class="sv-text">Försök igen</span><span class="ar-text">حاول مرة أخرى</span></button>
                <button class="result-btn secondary" onclick="switchMode('quiz-match')"><span class="sv-text">Byt till Matcha</span><span class="ar-text">انتقل للمطابقة</span></button>
                <button class="result-btn secondary" onclick="switchMode('browse')"><span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
            </div>
        </div>
    `;
}

// ========== QUIZ SELECTOR ==========
function showQuizSelector() {
    const container = document.getElementById('quizContent');
    if (!container) return;

    container.innerHTML = `
        <div class="quiz-selector">
            <div class="quiz-selector-title">
                <span class="sv-text">Välj quiztyp</span>
                <span class="ar-text">اختر نوع الاختبار</span>
            </div>
            <div class="quiz-type-cards">
                <button class="quiz-type-card" onclick="startFillBlankQuiz()">
                    <div class="quiz-type-icon">✏️</div>
                    <div class="quiz-type-name"><span class="sv-text">Fyll i luckan</span><span class="ar-text">أكمل الفراغ</span></div>
                    <div class="quiz-type-desc"><span class="sv-text">Välj rätt ord för att komplettera ordspråket</span><span class="ar-text">اختر الكلمة الصحيحة لإكمال المثل</span></div>
                </button>
                <button class="quiz-type-card" onclick="startMatchingQuiz()">
                    <div class="quiz-type-icon">🔗</div>
                    <div class="quiz-type-name"><span class="sv-text">Matcha ordspråk</span><span class="ar-text">طابق الأمثال</span></div>
                    <div class="quiz-type-desc"><span class="sv-text">Hitta rätt arabiskt ordspråk</span><span class="ar-text">اعثر على المثل العربي الصحيح</span></div>
                </button>
            </div>
        </div>
    `;
}

// ========== MATCHING QUIZ (Original) ==========
function startMatchingQuiz() {
    quizState = {
        questions: [...PROVERBS].sort(() => 0.5 - Math.random()).slice(0, 10),
        index: 0,
        score: 0
    };
    renderMatchingQuestion();
}

function renderMatchingQuestion() {
    const container = document.getElementById('quizContent');
    if (!container) return;

    if (quizState.index >= quizState.questions.length) {
        showMatchingResults();
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
        <div class="quiz-options matching-options">
            ${shuffled.map(opt => `
                <button class="quiz-option" onclick="checkMatchingAnswer(${opt.id}, ${question.id}, this)">
                    ${opt.arabicEquivalent}
                </button>
            `).join('')}
        </div>
    `;
}

function checkMatchingAnswer(selectedId: number, correctId: number, btn: HTMLElement) {
    const buttons = document.querySelectorAll('.matching-options .quiz-option');
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
        renderMatchingQuestion();
    }, 1500);
}

function showMatchingResults() {
    const container = document.getElementById('quizContent');
    if (!container) return;

    const percentage = Math.round((quizState.score / quizState.questions.length) * 100);
    let message = '';
    let messageAr = '';
    let icon = '';

    if (percentage === 100) {
        message = 'Perfekt!';
        messageAr = 'ممتاز!';
        icon = '🏆';
    } else if (percentage >= 80) {
        message = 'Mycket bra!';
        messageAr = 'رائع جداً!';
        icon = '🌟';
    } else if (percentage >= 50) {
        message = 'Bra jobbat!';
        messageAr = 'أحسنت!';
        icon = '👍';
    } else {
        message = 'Fortsätt öva!';
        messageAr = 'واصل التدريب!';
        icon = '📚';
    }

    container.innerHTML = `
        <div class="quiz-results">
            <div class="result-icon">${icon}</div>
            <div class="result-message"><span class="sv-text">${message}</span><span class="ar-text">${messageAr}</span></div>
            <div class="result-score">${quizState.score} / ${quizState.questions.length}</div>
            <div class="result-percentage">${percentage}%</div>
            <div class="result-actions">
                <button class="result-btn" onclick="startMatchingQuiz()"><span class="sv-text">Försök igen</span><span class="ar-text">حاول مرة أخرى</span></button>
                <button class="result-btn secondary" onclick="switchMode('quiz-fill')"><span class="sv-text">Byt till Fyll i luckan</span><span class="ar-text">انتقل لأكمل الفراغ</span></button>
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
(window as any).startSavedFlashcards = startSavedFlashcards;
(window as any).startAllFlashcards = startAllFlashcards;
(window as any).initFlashcards = initFlashcards;
(window as any).startFillBlankQuiz = startFillBlankQuiz;
(window as any).startMatchingQuiz = startMatchingQuiz;
(window as any).checkFillBlankAnswer = checkFillBlankAnswer;
(window as any).checkMatchingAnswer = checkMatchingAnswer;
(window as any).showQuizSelector = showQuizSelector;
(window as any).setFilter = setFilter;
(window as any).toggleFilters = toggleFilters;
(window as any).setTopicFilter = setTopicFilter;

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', init);

// ========== AUDIO PLAYER LOGIC ==========

let repeatCount = 1; // Number of times to repeat each proverb

function togglePlay() {
    if (isPlaying) {
        stopAudio();
    } else {
        startAudio();
    }
}

function startAudio() {
    isPlaying = true;

    // Prepare queue (use current filtered list or all)
    audioQueue = flashcardMode === 'saved' ? savedProverbs.map(id => PROVERBS.find(p => p.id === id)!).filter(Boolean) : [...PROVERBS];

    // If queue empty, abort
    if (audioQueue.length === 0) return;

    // Show player
    const player = document.getElementById('audioPlayer');
    if (player) player.classList.remove('hidden');

    updatePlayerUI();
    playCurrentAudio();
}

function stopAudio() {
    isPlaying = false;
    if (currentAudioTimeout) {
        clearTimeout(currentAudioTimeout);
        currentAudioTimeout = null;
    }
    speechSynthesis.cancel();
    updatePlayerUI();
}

function closeAudioPlayer() {
    stopAudio();
    document.getElementById('audioPlayer')?.classList.add('hidden');
}

function playCurrentAudio(repetitionIndex: number = 0) {
    if (!isPlaying || audioQueue.length === 0) return;

    const proverb = audioQueue[currentAudioIndex];
    if (!proverb) return;

    updatePlayerUI();

    // Speak Swedish first
    const uSv = new SpeechSynthesisUtterance(proverb.swedishProverb);
    uSv.lang = 'sv-SE';
    uSv.rate = playbackSpeed;

    uSv.onend = () => {
        if (!isPlaying) return;
        // Delay then speak Arabic
        currentAudioTimeout = setTimeout(() => {
            const uAr = new SpeechSynthesisUtterance(proverb.arabicEquivalent);
            uAr.lang = 'ar-SA';
            uAr.rate = playbackSpeed;

            uAr.onend = () => {
                if (!isPlaying) return;

                // Repetition Logic
                if (repetitionIndex + 1 < repeatCount) {
                    currentAudioTimeout = setTimeout(() => {
                        playCurrentAudio(repetitionIndex + 1);
                    }, 1000);
                } else {
                    // Delay then Next
                    currentAudioTimeout = setTimeout(() => {
                        playNext();
                    }, 1500);
                }
            };

            speechSynthesis.speak(uAr);
        }, 500);
    };

    speechSynthesis.speak(uSv);
}

function playNext() {
    if (currentAudioIndex < audioQueue.length - 1) {
        currentAudioIndex++;
    } else {
        currentAudioIndex = 0; // Loop back to start
    }
    updatePlayerUI();
    playCurrentAudio();
}

function playPrev() {
    if (currentAudioIndex > 0) {
        currentAudioIndex--;
    } else {
        currentAudioIndex = audioQueue.length - 1; // Loop to end
    }
    updatePlayerUI();
    playCurrentAudio();
}

function updatePlayerUI() {
    const playBtn = document.getElementById('playPauseBtn');
    const titleSv = document.getElementById('playerTitleSv');
    const titleAr = document.getElementById('playerTitleAr');

    if (playBtn) {
        playBtn.textContent = isPlaying ? '❚❚' : '▶';
    }

    const proverb = audioQueue[currentAudioIndex];
    if (proverb) {
        if (titleSv) titleSv.textContent = proverb.swedishProverb;
        if (titleAr) titleAr.textContent = proverb.arabicEquivalent;
    }
}

function toggleSpeed() {
    const speeds = [0.5, 0.75, 1.0, 1.25, 1.5];
    const currentIndex = speeds.indexOf(playbackSpeed);
    playbackSpeed = speeds[(currentIndex + 1) % speeds.length];

    const btn = document.getElementById('speedBtn');
    if (btn) {
        btn.textContent = `${playbackSpeed}x`;
    }
}

function togglePlayerRepeat() {
    const counts = [1, 2, 3];
    const currentIndex = counts.indexOf(repeatCount);
    repeatCount = counts[(currentIndex + 1) % counts.length];

    const btn = document.getElementById('playerRepeatBtn');
    if (btn) {
        btn.textContent = `↻ ${repeatCount}x`;
    }
}

function playProverb(id: number) {
    // Ensure player is visible and playing
    isPlaying = true;
    const player = document.getElementById('audioPlayer');
    if (player) player.classList.remove('hidden');

    // Find and set index
    let idx = audioQueue.findIndex(p => p.id === id);
    if (idx === -1) {
        const p = PROVERBS.find(x => x.id === id);
        if (p) {
            audioQueue = [...PROVERBS];
            currentAudioIndex = PROVERBS.findIndex(x => x.id === id);
        }
    } else {
        currentAudioIndex = idx;
    }

    playCurrentAudio();
    updatePlayerUI();
}

// Assign to window
window.togglePlay = togglePlay;
window.playNext = playNext;
window.playPrev = playPrev;
window.closeAudioPlayer = closeAudioPlayer;
window.toggleSpeed = toggleSpeed;
window.togglePlayerRepeat = togglePlayerRepeat;
(window as any).playProverb = playProverb;
