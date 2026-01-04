import { CognateEntry } from '../types';
import { cognatesData } from '../data/cognatesData';
import { TTSManager } from '../tts';
import { TextSizeManager } from '../utils';
import { LanguageManager } from '../i18n';
import { LearnViewManager, LearnView, createLearnViewManager } from './LearnViewManager';

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

// Lazy Loading Configuration
const ITEMS_PER_BATCH = 20;
let allGroupedData: Record<string, CognateEntry[]> = {};
let currentBatchIndex = 0;
let loadMoreObserver: IntersectionObserver | null = null;

// ========== INIT ==========
export function init() {
    LanguageManager.init();
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (localStorage.getItem('mobileView') === 'true') {
        document.documentElement.classList.add('iphone-mode');
        document.body.classList.add('iphone-view');
    }

    updateStats();
    initViewManager();
    switchMode('browse'); // Initialize mode indicator
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

    (window as any).startQuiz = startQuiz;
    (window as any).closeQuiz = closeQuiz;
    (window as any).flipCard = flipCard;
    (window as any).flashcardAnswer = flashcardAnswer;
    (window as any).setQuizType = setQuizType;
    (window as any).checkAnswer = checkAnswer;
    (window as any).checkWrittenAnswer = checkWrittenAnswer;
    (window as any).playTTS = playTTS;
    (window as any).toggleMobileView = toggleMobileView;
    (window as any).toggleFilters = toggleFilters;
}

// ========== MOBILE VIEW ==========
function toggleMobileView(): void {
    const isMobile = document.body.classList.toggle('iphone-view');
    document.documentElement.classList.toggle('iphone-mode', isMobile);
    localStorage.setItem('mobileView', isMobile.toString());
}

// ========== FILTER TOGGLE ==========
function toggleFilters(): void {
    const filterChips = document.getElementById('filterChips');
    const toggleBtn = document.getElementById('filterToggle');

    if (filterChips && toggleBtn) {
        const isCollapsed = filterChips.classList.toggle('collapsed');
        toggleBtn.classList.toggle('active', !isCollapsed);
        toggleBtn.textContent = isCollapsed ? '🔽' : '🔼';
    }
}

// ========== LEARN VIEW SWITCHING ==========
// Note: This is different from Game Mode Switching in games/
// Learn Views: browse, flashcard, quiz, saved (for learning content)

const viewManager = createLearnViewManager();

// Initialize view manager
function initViewManager() {
    viewManager.registerViews({
        'browse': { viewId: 'browseView' },
        'flashcard': { viewId: 'flashcardView', onActivate: initFlashcards },
        'saved': { viewId: 'savedView', onActivate: renderSavedWords },
        'quiz': { viewId: 'quizView', onActivate: startQuizInternal }
    });
}

function switchMode(mode: string) {
    viewManager.switchTo(mode as LearnView);

    // Update Mode UI
    document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = document.getElementById(`btn-${mode}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        updateModeIndicator(activeBtn);
    }
}

function updateModeIndicator(activeBtn: HTMLElement) {
    const indicator = document.getElementById('modeIndicator');
    const bar = document.getElementById('modeSelectionBar');
    if (!indicator || !bar) return;

    const barRect = bar.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    // Calculate offset
    const offsetLeft = btnRect.left - barRect.left;

    indicator.style.width = `${btnRect.width}px`;
    indicator.style.transform = `translateX(${offsetLeft - 6}px)`; // Adjust for padding/gap
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
            ${cat === 'all' ? '🌐 <span class="sv-text">Alla</span><span class="ar-text">الكل</span>' : (categoryIcons[cat] || '📌') + ' ' + cat}
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

    // Reset lazy loading state
    currentBatchIndex = 0;
    container.innerHTML = '';

    if (data.length === 0) {
        container.innerHTML = '<div class="empty-state"><span class="sv-text">Inga ord hittades</span><span class="ar-text">لا توجد نتائج</span></div>';
        return;
    }

    // Group data once
    allGroupedData = {};
    data.forEach(item => {
        const cat = item.category || 'Övrigt';
        if (!allGroupedData[cat]) allGroupedData[cat] = [];
        allGroupedData[cat].push(item);
    });

    // Render first batch immediately
    renderNextBatch(container);

    // Setup intersection observer for lazy loading
    setupLazyLoading(container);
}

// Render next batch of items
function renderNextBatch(container: HTMLElement): void {
    const categories = Object.keys(allGroupedData);
    const startIndex = currentBatchIndex * ITEMS_PER_BATCH;

    let itemsRendered = 0;
    let html = '';
    let currentItemIndex = 0;

    // Flatten items with category info for batch processing
    const allItems: { item: CognateEntry; category: string }[] = [];
    for (const cat of categories) {
        for (const item of allGroupedData[cat]) {
            allItems.push({ item, category: cat });
        }
    }

    const endIndex = Math.min(startIndex + ITEMS_PER_BATCH, allItems.length);

    if (startIndex >= allItems.length) return;

    // Group items to render by category
    const batchGrouped: Record<string, CognateEntry[]> = {};
    for (let i = startIndex; i < endIndex; i++) {
        const { item, category } = allItems[i];
        if (!batchGrouped[category]) batchGrouped[category] = [];
        batchGrouped[category].push(item);
    }

    // Remove old sentinel
    const oldSentinel = container.querySelector('.load-more-sentinel');
    if (oldSentinel) oldSentinel.remove();

    // Render batch
    for (const [category, items] of Object.entries(batchGrouped)) {
        // Check if category section already exists
        let categorySection = container.querySelector(`[data-category="${category}"]`) as HTMLElement;

        if (!categorySection) {
            categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            categorySection.setAttribute('data-category', category);
            categorySection.innerHTML = `
                <div class="category-title">
                    <span>${categoryIcons[category] || '📌'}</span>
                    <span>${category} (${allGroupedData[category].length})</span>
                </div>
                <div class="cognates-grid"></div>
            `;
            container.appendChild(categorySection);
        }

        const grid = categorySection.querySelector('.cognates-grid');
        if (grid) {
            items.forEach(item => {
                const isSaved = savedWords.includes(item.swe);
                const isLearned = learnedWords.includes(item.swe);
                const safeSwe = item.swe.replace(/'/g, "\\'");
                const cardHTML = `
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
                grid.insertAdjacentHTML('beforeend', cardHTML);
            });
        }
    }

    currentBatchIndex++;

    // Add sentinel for next batch if more items exist
    const totalItems = allItems.length;
    const loadedItems = currentBatchIndex * ITEMS_PER_BATCH;

    if (loadedItems < totalItems) {
        const sentinel = document.createElement('div');
        sentinel.className = 'load-more-sentinel';
        sentinel.style.cssText = 'height: 50px; display: flex; align-items: center; justify-content: center; color: #60a5fa; opacity: 0.7;';
        const remaining = totalItems - loadedItems;
        sentinel.innerHTML = `<span>⏳ جاري تحميل ${Math.min(ITEMS_PER_BATCH, remaining)} كلمة أخرى...</span>`;
        container.appendChild(sentinel);
    } else {
        const endMessage = document.createElement('div');
        endMessage.className = 'end-of-list';
        endMessage.style.cssText = 'text-align: center; padding: 1rem; color: #60a5fa; opacity: 0.6;';
        endMessage.innerHTML = `✨ تم عرض ${totalItems} كلمة`;
        container.appendChild(endMessage);
    }

    // Apply dynamic sizing
    TextSizeManager.autoApply();

    // Re-observe new sentinel
    const newSentinel = container.querySelector('.load-more-sentinel');
    if (newSentinel && loadMoreObserver) {
        loadMoreObserver.observe(newSentinel);
    }
}

// Setup IntersectionObserver for lazy loading
function setupLazyLoading(container: HTMLElement): void {
    if (loadMoreObserver) loadMoreObserver.disconnect();

    loadMoreObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                renderNextBatch(container);
            }
        });
    }, { rootMargin: '100px' });

    const sentinel = container.querySelector('.load-more-sentinel');
    if (sentinel) loadMoreObserver.observe(sentinel);
}

function playTTS(text: string) {
    if (TTSManager) {
        TTSManager.speak(text, 'sv');
    } else {
        console.error('TTSManager not loaded');
    }
}



// ========== SAVED MODAL ==========
// ========== SAVED WORDS ==========
function openSavedModal() {
    switchMode('saved');
}

function renderSavedWords() {
    const list = document.getElementById('savedList');
    if (!list) return;

    if (savedWords.length === 0) {
        list.innerHTML = `
            <div class="empty-state-card">
                <div class="empty-icon">⭐</div>
                <p><span class="sv-text">Du har inga sparade ord ännu.</span><span class="ar-text">ليس لديك كلمات محفوظة حتى الآن.</span></p>
                <p class="sub-text"><span class="sv-text">Klicka på stjärnan för att spara ord.</span><span class="ar-text">اضغط على النجمة لحفظ الكلمات.</span></p>
            </div>`;
    } else {
        list.innerHTML = savedWords.map(word => {
            const item = cognatesData.find((c: CognateEntry) => c.swe === word);
            return `
                <div class="cognate-card saved-card">
                    <div class="card-left">
                        <strong>${word}</strong>
                        <span class="card-type">${item?.type || ''}</span>
                    </div>
                    <div class="card-right">
                        <span class="word-arb">${item?.arb || ''}</span>
                        <button class="mini-btn saved active" onclick="toggleSave('${word.replace(/'/g, "\\'")}', true); event.stopPropagation();">⭐</button>
                    </div>
                </div>`;
        }).join('');
    }
}

// Removed closeSavedModal as it's handled by switchMode
// Updated toggleSave to re-render if in saved mode
function toggleSave(word: string) {
    const index = savedWords.indexOf(word);
    if (index === -1) {
        savedWords.push(word);
    } else {
        savedWords.splice(index, 1);
    }
    localStorage.setItem('snabbaLexin_cognates_saved', JSON.stringify(savedWords));

    // Update UI
    updateStats();

    // Update buttons in browse view
    const btn = document.querySelector(`.btn-star[onclick*="${word}"]`);
    if (btn) btn.classList.toggle('active', index === -1);

    // If we are in saved view, re-render the list immediately
    if (document.getElementById('savedView')?.classList.contains('active')) {
        renderSavedWords();
    }
}

// ========== FLASHCARDS ==========
function renderFlashcardFilterChips() {
    const container = document.getElementById('fcFilterChips');
    if (!container) return;

    const categories = ['all', ...new Set(cognatesData.map((c: CognateEntry) => c.category || 'Övrigt'))];
    container.innerHTML = categories.map((cat: string) => `
        <button class="fc-chip ${cat === currentFilter ? 'active' : ''}" onclick="filterFlashcards('${cat}')" title="${cat === 'all' ? 'Alla' : cat}">
            ${cat === 'all' ? '🌐' : (categoryIcons[cat] || '📌')}
        </button>
    `).join('');
}

function filterFlashcards(cat: string) {
    currentFilter = cat;
    renderFlashcardFilterChips();
    initFlashcards();
}

function initFlashcards() {
    renderFlashcardFilterChips();
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
        const len = card.swe.length;
        if (len > 20) fcWord.style.fontSize = '1rem';
        else if (len > 15) fcWord.style.fontSize = '1.3rem';
        else if (len > 10) fcWord.style.fontSize = '1.7rem';
        else fcWord.style.fontSize = '2.5rem';
    }
    if (fcTranslation) {
        fcTranslation.textContent = card.arb;
        const len = card.arb.length;
        if (len > 20) fcTranslation.style.fontSize = '1rem';
        else if (len > 15) fcTranslation.style.fontSize = '1.3rem';
        else if (len > 10) fcTranslation.style.fontSize = '1.7rem';
        else fcTranslation.style.fontSize = '2.2rem';
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
                <div class="result-title">${percent >= 70 ? '<span class="sv-text">Bra jobbat!</span><span class="ar-text">أحسنت!</span>' : '<span class="sv-text">Fortsätt öva!</span><span class="ar-text">واصل التمرين!</span>'}</div>
                <div class="result-score">${fcKnown} / ${fcCards.length} <span class="sv-text">ord</span><span class="ar-text">كلمة</span> (${percent}%)</div>
                <div class="result-actions">
                    <button class="result-btn primary" onclick="location.reload()">🔄 <span class="sv-text">Igen</span><span class="ar-text">مرة أخرى</span></button>
                    <button class="result-btn secondary" onclick="switchMode('browse')">← <span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
                </div>
            </div>`;
    }
}

// ========== QUIZ ==========
function startQuiz() {
    // Use switchMode to show quiz view inline
    switchMode('quiz');
}

function startQuizInternal() {
    let pool = currentFilter === 'all' ? cognatesData : cognatesData.filter((c: CognateEntry) => c.category === currentFilter);
    if (pool.length < 4) {
        const quizContent = document.getElementById('quizContent');
        if (quizContent) {
            quizContent.innerHTML = `
                <div class="quiz-message">
                    <p>⚠️ <span class="sv-text">Inte tillräckligt med ord!</span><span class="ar-text">توجد كلمات غير كافية!</span></p>
                </div>`;
        }
        return;
    }
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    quizState = {
        questions: shuffled.slice(0, 10),
        index: 0,
        score: 0,
        pool: pool
    };

    // Start directly with default quiz type
    quizType = 'normal';
    renderQuizQuestion();
}

function closeQuiz() {
    // Switch back to browse mode
    switchMode('browse');
    quizState = null;
}

function setQuizType(type: QuizType) {
    quizType = type;
    // Reset quiz to start with new type
    if (quizState) {
        quizState.index = 0;
        quizState.score = 0;
        // Reshuffle questions
        const shuffled = [...quizState.pool].sort(() => 0.5 - Math.random());
        quizState.questions = shuffled.slice(0, 10);
    }
    renderQuizQuestion();
}

function renderQuizQuestion() {
    if (!quizState) return;
    const q = quizState.questions[quizState.index];
    const total = quizState.questions.length;

    const wrongPool = quizState.pool.filter(c => c.swe !== q.swe);
    const wrongOptions = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3);

    // Type selector icons map
    const typeIcons: Record<QuizType, string> = {
        'normal': '🇸🇪→🇸🇦',
        'reverse': '🇸🇦→🇸🇪',
        'audio': '🔊',
        'write': '✍️'
    };

    // Build compact type selector
    const typeSelectorHtml = `
        <div class="quiz-type-selector">
            ${(['normal', 'reverse', 'audio', 'write'] as QuizType[]).map(t => `
                <button class="type-chip ${t === quizType ? 'active' : ''}" 
                        onclick="setQuizType('${t}')" title="${t === 'normal' ? 'Svenska → Arabiska' : t === 'reverse' ? 'Arabiska → Svenska' : t === 'audio' ? 'Lyssna' : 'Skriv'}">
                    ${typeIcons[t]}
                </button>
            `).join('')}
        </div>`;

    let html = `
        ${typeSelectorHtml}
        <div class="quiz-header">
            <div class="quiz-progress-text">
                <span>Fråga ${quizState.index + 1} / ${total}</span>
                <span>${Math.round((quizState.index / total) * 100)}%</span>
            </div>
            <div class="quiz-progress-bar">
                <div class="fill" style="width: ${(quizState.index / total) * 100}%"></div>
            </div>
        </div>
        `;

    if (quizType === 'normal') {
        const options = [q.arb, ...wrongOptions.map(c => c.arb)].sort(() => 0.5 - Math.random());
        html += `
            <div class="quiz-question">
                <div class="question-word">${q.swe}</div>
                <div class="question-hint"><span class="sv-text">Välj rätt arabisk översättning</span><span class="ar-text">اختر الترجمة الصحيحة</span></div>
            </div>
            <div class="options-grid" id="optionsGrid">
                ${options.map(opt => `<button class="option-btn arb" data-correct="${opt === q.arb}"
                    onclick="checkAnswer(this, ${opt === q.arb})">${opt}</button>`).join('')}
            </div>`;
    } else if (quizType === 'reverse') {
        const options = [q.swe, ...wrongOptions.map(c => c.swe)].sort(() => 0.5 - Math.random());
        html += `
            <div class="quiz-question">
                <div class="question-word arabic-font" style="font-family:'Tajawal'">${q.arb}</div>
                <div class="question-hint"><span class="sv-text">Välj rätt svenskt ord</span><span class="ar-text">اختر الكلمة السويدية</span></div>
            </div>
            <div class="options-grid" id="optionsGrid">
                ${options.map(opt => `<button class="option-btn" data-correct="${opt === q.swe}"
                    onclick="checkAnswer(this, ${opt === q.swe})">${opt}</button>`).join('')}
            </div>`;
    } else if (quizType === 'audio') {
        const options = [q.arb, ...wrongOptions.map(c => c.arb)].sort(() => 0.5 - Math.random());
        html += `
            <div class="quiz-question">
                <div class="question-word">
                    <button class="action-btn" style="width:auto; height:80px; width:80px; border-radius:50%; font-size:2rem;" onclick="playTTS('${q.swe.replace(/'/g, "\\'")}')">🔊</button>
                </div>
                <div class="question-hint"><span class="sv-text">Vad hörde du?</span><span class="ar-text">ماذا سمعت؟</span></div>
            </div>
            <div class="options-grid" id="optionsGrid">
                ${options.map(opt => `<button class="option-btn arb" data-correct="${opt === q.arb}"
                    onclick="checkAnswer(this, ${opt === q.arb})">${opt}</button>`).join('')}
            </div>`;
        setTimeout(() => playTTS(q.swe), 500);
    } else if (quizType === 'write') {
        html += `
            <div class="quiz-question">
                <div class="question-word">${q.swe}</div>
                <div class="question-hint"><span class="sv-text">Skriv den arabiska översättningen</span><span class="ar-text">اكتب الترجمة العربية</span></div>
            </div>
            <input type="text" class="writing-input" id="writeAnswer" placeholder="اكتب هنا..." dir="rtl">
            <button class="submit-btn" onclick="checkWrittenAnswer('${q.arb.replace(/'/g, "\\'")}')"><span class="sv-text">Kontrollera</span><span class="ar-text">تحقق</span></button>`;
    }

    html += `<div class="feedback" id="feedback"></div>`;

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
        feedback.innerHTML = '✅ <span class="sv-text">Rätt!</span><span class="ar-text">صحيح!</span>';
    } else {
        feedback.className = 'feedback show wrong';
        feedback.innerHTML = `❌ <span class="sv-text">Fel!</span><span class="ar-text">خطأ!</span> ${correctAnswer ? '<span class="sv-text">Rätt:</span><span class="ar-text">الصحيح:</span> ' + correctAnswer : ''}`;
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
                <div class="result-title">${passed ? '<span class="sv-text">Grattis!</span><span class="ar-text">مبروك!</span>' : '<span class="sv-text">Försök igen</span><span class="ar-text">حاول مرة أخرى</span>'}</div>
                <div class="result-score">${score} / ${total} <span class="sv-text">rätt</span><span class="ar-text">صحيح</span> (${percent}%)</div>
                <div class="result-actions">
                    <button class="result-btn primary" onclick="startQuiz()">🔄 <span class="sv-text">Gör om</span><span class="ar-text">أعد</span></button>
                    <button class="result-btn secondary" onclick="closeQuiz()">← <span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
                </div>
            </div>`;
    }
}


// Make functions available globally per old setup requirements
(window as any).switchMode = switchMode;
(window as any).toggleFilters = toggleFilters;
(window as any).toggleMobileView = toggleMobileView;
(window as any).playTTS = playTTS;
(window as any).toggleSave = toggleSave;
(window as any).startQuiz = startQuiz;
(window as any).closeQuiz = closeQuiz;

// Flashcard functions
(window as any).flipCard = flipCard;
(window as any).flashcardAnswer = flashcardAnswer;
(window as any).filterFlashcards = filterFlashcards;

// Quiz functions 
(window as any).checkAnswer = checkAnswer;
(window as any).setQuizType = setQuizType;
(window as any).renderSavedWords = renderSavedWords;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    init();

    // Check URL params for mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    // Defer initialization to ensure DOM is fully ready
    setTimeout(() => {
        if (mode === 'quiz') {
            switchMode('quiz');
        } else if (mode === 'flashcard') {
            switchMode('flashcard');
        } else if (mode === 'saved') {
            switchMode('saved');
        }
    }, 100);
});
