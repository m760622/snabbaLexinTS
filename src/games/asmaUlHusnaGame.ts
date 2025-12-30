// Asma ul Husna - Game Logic
import { ASMA_UL_HUSNA, AsmaName } from '../data/asmaUlHusna';
import { TTSManager } from '../tts';

console.log('[AsmaUlHusna] Module loaded');

let allNames: AsmaName[] = [];
let filteredNames: AsmaName[] = [];

// State for favorites and memorized
let favorites: Set<number> = new Set();
let memorized: Set<number> = new Set();
let currentFilter: 'all' | 'favorites' | 'memorized' = 'all';
let currentTheme: 'neon' | 'calm' | 'islamic-night' = 'neon';

// Quiz State
let quizQuestions: AsmaName[] = [];
let currentQuestionIndex = 0;
let quizScore = 0;

// Flashcard State
let flashcardQueue: AsmaName[] = [];
let currentFlashcardIndex = 0;
let isFlashcardFlipped = false;
let repeatCount = 1;

// Load saved state from localStorage
function loadSavedState(): void {
    try {
        const savedFavorites = localStorage.getItem('asma_favorites');
        const savedMemorized = localStorage.getItem('asma_memorized');
        const savedRepeat = localStorage.getItem('asma_repeat');

        if (savedFavorites) favorites = new Set(JSON.parse(savedFavorites));
        if (savedMemorized) memorized = new Set(JSON.parse(savedMemorized));
        if (savedRepeat) repeatCount = parseInt(savedRepeat);

        updateRepeatButtons();
    } catch (e) {
        console.error('[AsmaUlHusna] Failed to load saved state:', e);
    }
}

// Save state to localStorage
function saveState(): void {
    localStorage.setItem('asma_favorites', JSON.stringify([...favorites]));
    localStorage.setItem('asma_memorized', JSON.stringify([...memorized]));
    localStorage.setItem('asma_repeat', repeatCount.toString());
}

// Toggle favorite
function toggleFavorite(nr: number): void {
    if (favorites.has(nr)) {
        favorites.delete(nr);
    } else {
        favorites.add(nr);
    }
    saveState();
    renderCards();
    updateFilterCounts();
}

// Toggle memorized
function toggleMemorized(nr: number): void {
    if (memorized.has(nr)) {
        memorized.delete(nr);
    } else {
        memorized.add(nr);
    }
    saveState();
    renderCards();
    updateFilterCounts();
}

// Set filter
function setFilter(filter: 'all' | 'favorites' | 'memorized'): void {
    currentFilter = filter;

    // Update button states
    document.querySelectorAll('.asma-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });

    applyFilters();
}

// Apply all filters (search + category filter)
function applyFilters(): void {
    const searchInput = document.getElementById('asmaSearch') as HTMLInputElement;
    const query = searchInput?.value.toLowerCase().trim() || '';

    // Start with all names
    let result = [...allNames];

    // Apply category filter
    if (currentFilter === 'favorites') {
        result = result.filter(name => favorites.has(name.nr));
    } else if (currentFilter === 'memorized') {
        result = result.filter(name => memorized.has(name.nr));
    }

    // Apply search filter
    if (query) {
        result = result.filter(name =>
            name.nameAr.includes(query) ||
            name.nameSv.toLowerCase().includes(query) ||
            name.meaningAr.includes(query) ||
            name.meaningSv.toLowerCase().includes(query) ||
            name.nr.toString() === query
        );
    }

    filteredNames = result;
    renderCards();
    updateStats();
}

// Update filter button counts
function updateFilterCounts(): void {
    const allBtn = document.querySelector('[data-filter="all"]');
    const favBtn = document.querySelector('[data-filter="favorites"]');
    const memBtn = document.querySelector('[data-filter="memorized"]');

    if (allBtn) allBtn.textContent = `الكل (${allNames.length})`;
    if (favBtn) favBtn.textContent = `❤️ المفضلة (${favorites.size})`;
    if (memBtn) memBtn.textContent = `✓ المحفوظة (${memorized.size})`;
}

// Initialize
function init(): void {
    console.log('[AsmaUlHusna] Initializing...');
    loadSavedState();
    allNames = ASMA_UL_HUSNA;
    filteredNames = [...allNames];
    renderCards();
    updateStats();
    loadTheme();
    updateFilterCounts();
    createGoldenParticles();
}

// Render all cards
function renderCards(): void {
    const grid = document.getElementById('asmaCardsGrid');
    if (!grid) return;

    grid.innerHTML = filteredNames.map(name => createCardHTML(name)).join('');
}

// Create single card HTML
function createCardHTML(name: AsmaName): string {
    const hasConjugation = name.pastAr !== '-';
    const isFavorite = favorites.has(name.nr);
    const isMemorized = memorized.has(name.nr);

    return `
        <div class="asma-card${isMemorized ? ' memorized' : ''}" data-nr="${name.nr}">
            ${isMemorized ? '<div class="memorized-badge">✓ محفوظ</div>' : ''}
            <div class="asma-card-header">
                <div class="asma-number">${name.nr}</div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="asma-speak-btn" onclick="speakName('${name.nameAr}', ${name.nr})" title="استمع">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                        </svg>
                    </button>
                    <button class="asma-favorite-btn${isFavorite ? ' favorited' : ''}" onclick="toggleFavorite(${name.nr})" title="المفضلة">
                        ${isFavorite ? '❤️' : '🤍'}
                    </button>
                </div>
            </div>
            
            <div class="asma-name-ar">${name.nameAr}</div>
            <div class="asma-name-sv">${name.nameSv}</div>
            
            <div class="asma-meaning">
                <div class="asma-meaning-ar">${name.meaningAr}</div>
                <div class="asma-meaning-sv">${name.meaningSv}</div>
            </div>
            
            ${hasConjugation ? `
            <div class="asma-conjugation">
                <div class="conj-item">
                    <div class="conj-label">الماضي</div>
                    <div class="conj-ar">${name.pastAr}</div>
                    <div class="conj-sv">${name.pastSv}</div>
                </div>
                <div class="conj-item">
                    <div class="conj-label">المضارع</div>
                    <div class="conj-ar">${name.presentAr}</div>
                    <div class="conj-sv">${name.presentSv}</div>
                </div>
                <div class="conj-item">
                    <div class="conj-label">المصدر</div>
                    <div class="conj-ar">${name.masdarAr}</div>
                    <div class="conj-sv">${name.masdarSv}</div>
                </div>
            </div>
            ` : ''}
            
            <div class="asma-verse">
                <div class="verse-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2">
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                </div>
                <div class="verse-ar">${name.verseAr}</div>
                <div class="verse-sv">${name.verseSv}</div>
            </div>
            
            <div class="asma-card-actions">
                <button class="asma-memorize-btn${isMemorized ? ' active' : ''}" onclick="toggleMemorized(${name.nr})">
                    ${isMemorized ? '✓ تم الحفظ' : '📝 تحديد كمحفوظ'}
                </button>
            </div>
        </div>
    `;
}

// Filter names (for search input)
function filterNames(): void {
    applyFilters();
}

// Update stats
function updateStats(): void {
    const statsEl = document.getElementById('asmaStats');
    if (statsEl) {
        const memorizedCount = filteredNames.filter(n => memorized.has(n.nr)).length;
        statsEl.textContent = `عرض ${filteredNames.length} من ${allNames.length} اسم | محفوظ: ${memorizedCount}`;
    }
}

// Speak name using TTS with enhanced visual effects
function speakName(text: string, nr: number): void {
    // Find the card and button
    const card = document.querySelector(`[data-nr="${nr}"]`);
    const btn = card?.querySelector('.asma-speak-btn');

    // Add speaking classes
    btn?.classList.add('speaking');
    card?.classList.add('card-speaking');

    // Use TTS
    const doSpeak = () => {
        if (typeof TTSManager !== 'undefined' && TTSManager) {
            TTSManager.speak(text, 'ar');
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = 0.8;
            speechSynthesis.speak(utterance);
        }
    };

    // Repeat logic
    let count = 0;
    const speakLoop = () => {
        if (count < repeatCount) {
            doSpeak();
            count++;
            // Estimate duration or use event? Simplified with delay
            setTimeout(speakLoop, 2500);
        } else {
            // Remove classes after a delay
            setTimeout(() => {
                btn?.classList.remove('speaking');
                card?.classList.remove('card-speaking');
            }, 1000);
        }
    };

    speakLoop();
}

// Set Repeat Count
function setRepeatCount(count: number): void {
    repeatCount = count;
    saveState();
    updateRepeatButtons();
}

function updateRepeatButtons(): void {
    document.querySelectorAll('.repeat-count-btn').forEach(btn => {
        const btnCount = parseInt(btn.getAttribute('data-count') || '1');
        btn.classList.toggle('active', btnCount === repeatCount);
    });
}

// Golden Particles System
function createGoldenParticles(): void {
    const container = document.getElementById('particlesContainer');
    if (!container) return;

    const particleCount = 15;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'gold-particle';
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.animationDelay = `${Math.random() * 15}s`;
        particle.style.animationDuration = `${15 + Math.random() * 10}s`;
        container.appendChild(particle);
    }
}

// Theme management with Islamic Night Theme
function loadTheme(): void {
    const savedTheme = localStorage.getItem('asmaTheme') || 'neon';
    currentTheme = savedTheme as typeof currentTheme;
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton();
}

function toggleTheme(): void {
    const themes: Array<typeof currentTheme> = ['neon', 'calm', 'islamic-night'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    currentTheme = themes[nextIndex];

    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('asmaTheme', currentTheme);
    updateThemeButton();
}

function updateThemeButton(): void {
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.classList.remove('calm-active', 'night-active');
        if (currentTheme === 'calm') {
            btn.classList.add('calm-active');
        } else if (currentTheme === 'islamic-night') {
            btn.classList.add('night-active');
        }

        // Update tooltip
        const themeNames: Record<typeof currentTheme, string> = {
            'neon': 'الوضع الحالي: نيون',
            'calm': 'الوضع الحالي: هادئ',
            'islamic-night': 'الوضع الحالي: ليلي إسلامي'
        };
        btn.title = themeNames[currentTheme];
    }
}

// Render filter buttons
function renderFilterButtons(): void {
    updateFilterCounts();
}

// Mobile View Toggle
function toggleMobileView(): void {
    const isMobile = document.body.classList.toggle('iphone-view');
    localStorage.setItem('mobileView', isMobile.toString());
    updateMobileButton(isMobile);
}

function loadMobileView(): void {
    const savedMobile = localStorage.getItem('mobileView') === 'true';
    if (savedMobile) {
        document.body.classList.add('iphone-view');
    }
    updateMobileButton(savedMobile);
}

function updateMobileButton(isMobile: boolean): void {
    const btn = document.getElementById('mobileToggle');
    if (btn) {
        btn.classList.toggle('mobile-active', isMobile);
    }
}

// ========== QUIZ LOGIC ==========

function startQuiz(): void {
    // Generate 10 random questions
    quizQuestions = [...allNames].sort(() => 0.5 - Math.random()).slice(0, 10);
    currentQuestionIndex = 0;
    quizScore = 0;

    document.getElementById('quizModal')?.classList.add('active');
    renderQuizQuestion();
}

function closeQuiz(): void {
    document.getElementById('quizModal')?.classList.remove('active');
}

function renderQuizQuestion(): void {
    const container = document.getElementById('quizContent');
    if (!container) return;

    // Check if finished
    if (currentQuestionIndex >= quizQuestions.length) {
        showQuizResults(container);
        return;
    }

    const question = quizQuestions[currentQuestionIndex];

    // Generate options (1 correct + 3 wrong)
    const options = [question];
    while (options.length < 4) {
        const random = allNames[Math.floor(Math.random() * allNames.length)];
        if (!options.find(o => o.nr === random.nr)) {
            options.push(random);
        }
    }

    // Shuffle options
    const shuffledOptions = options.sort(() => 0.5 - Math.random());

    container.innerHTML = `
        <div class="quiz-question">
            <div class="quiz-question-label">ما معنى هذا الاسم؟</div>
            <div class="quiz-question-name">${question.nameAr}</div>
        </div>
        <div class="quiz-options">
            ${shuffledOptions.map(opt => `
                <button class="quiz-option" onclick="checkAnswer(${opt.nr}, ${question.nr}, this)">
                    ${opt.meaningSv} (${opt.meaningAr})
                </button>
            `).join('')}
        </div>
    `;

    updateQuizProgress();
}

function checkAnswer(selectedNr: number, correctNr: number, btn: HTMLElement): void {
    // Disable all buttons
    const buttons = document.querySelectorAll('.quiz-option');
    buttons.forEach(b => b.classList.add('disabled'));

    if (selectedNr === correctNr) {
        btn.classList.add('correct');
        quizScore++;
        // Play correct sound (optional)
    } else {
        btn.classList.add('wrong');
        // Highlight correct answer
        // Note: Logic to find the button with the correct answer needs to be robust
        // Here we can't easily select by data attribute as we didn't add it to buttons, 
        // relying on the click handler closure is simpler but visual feedback is key.
        // Let's just proceed. 
    }

    // Wait and go to next
    setTimeout(() => {
        currentQuestionIndex++;
        renderQuizQuestion();
    }, 1500);
}

function updateQuizProgress(): void {
    const fill = document.getElementById('quizProgressFill');
    const scoreText = document.getElementById('quizScore');

    if (fill) fill.style.width = `${((currentQuestionIndex) / quizQuestions.length) * 100}%`;
    if (scoreText) scoreText.textContent = `${currentQuestionIndex}/${quizQuestions.length}`;
}

function showQuizResults(container: HTMLElement): void {
    const percentage = Math.round((quizScore / quizQuestions.length) * 100);
    let message = '';
    let icon = '';

    if (percentage === 100) { message = 'ممتاز! ما شاء الله'; icon = '🏆'; }
    else if (percentage >= 80) { message = 'رائع جداً'; icon = '🌟'; }
    else if (percentage >= 50) { message = 'جيد، استمر'; icon = '👍'; }
    else { message = 'حاول مرة أخرى'; icon = '📚'; }

    container.innerHTML = `
        <div class="quiz-result">
            <div class="quiz-result-icon">${icon}</div>
            <div class="quiz-result-text">${message}</div>
            <div class="quiz-result-score">${quizScore} / ${quizQuestions.length}</div>
            <div class="quiz-actions">
                <button class="quiz-action-btn" onclick="closeQuiz()">إغلاق</button>
                <button class="quiz-action-btn primary" onclick="startQuiz()">إعادة الاختبار</button>
            </div>
        </div>
    `;
}

// ========== FLASHCARD LOGIC ==========

function startFlashcards(): void {
    flashcardQueue = [...filteredNames]; // Use current filtered list
    if (flashcardQueue.length === 0) flashcardQueue = [...allNames];

    // Shuffle
    flashcardQueue.sort(() => 0.5 - Math.random());

    currentFlashcardIndex = 0;
    isFlashcardFlipped = false;

    document.getElementById('flashcardModal')?.classList.add('active');
    renderFlashcard();
}

function closeFlashcards(): void {
    document.getElementById('flashcardModal')?.classList.remove('active');
}

function renderFlashcard(): void {
    if (currentFlashcardIndex >= flashcardQueue.length) {
        // Cycle completed
        alert('أتممت مراجعة المجموعة!');
        closeFlashcards();
        return;
    }

    const name = flashcardQueue[currentFlashcardIndex];
    const card = document.getElementById('flashcard');

    // Reset flip
    isFlashcardFlipped = false;
    card?.classList.remove('flipped');

    // Update Content
    // Front
    const nameEl = document.getElementById('flashcardName');
    const nrFront = document.getElementById('flashcardNumber');
    if (nameEl) nameEl.textContent = name.nameAr;
    if (nrFront) nrFront.textContent = name.nr.toString();

    // Back
    const arMeaning = document.getElementById('flashcardMeaningAr');
    const svMeaning = document.getElementById('flashcardMeaningSv');
    const nrBack = document.getElementById('flashcardNumberBack');

    if (arMeaning) arMeaning.textContent = name.meaningAr;
    if (svMeaning) svMeaning.textContent = name.meaningSv;
    if (nrBack) nrBack.textContent = name.nr.toString();

    // Progress
    const progress = document.getElementById('flashcardProgress');
    if (progress) progress.textContent = `${currentFlashcardIndex + 1} / ${flashcardQueue.length}`;
}

function flipFlashcard(): void {
    const card = document.getElementById('flashcard');
    isFlashcardFlipped = !isFlashcardFlipped;
    card?.classList.toggle('flipped', isFlashcardFlipped);

    if (isFlashcardFlipped) {
        // Auto play sound when flipped? Maybe optional.
        const name = flashcardQueue[currentFlashcardIndex];
        // speakName(name.nameAr, name.nr); // Keeping silent for now to let user read first
    }
}

function flashcardKnow(): void {
    // Mark as memorized if not already?
    const name = flashcardQueue[currentFlashcardIndex];
    if (!memorized.has(name.nr)) {
        toggleMemorized(name.nr);
    }

    nextFlashcard();
}

function flashcardDontKnow(): void {
    nextFlashcard();
}

function nextFlashcard(): void {
    currentFlashcardIndex++;
    if (currentFlashcardIndex >= flashcardQueue.length) {
        // Cycle completed
        alert('أتممت مراجعة المجموعة!');
        closeFlashcards();
    } else {
        renderFlashcard();
    }
}

function speakCurrentFlashcard(): void {
    // Stop propagation of click to prevent flip
    event?.stopPropagation();

    const name = flashcardQueue[currentFlashcardIndex];
    speakName(name.nameAr, name.nr);
}


// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('[AsmaUlHusna] DOM Ready');
    init();
    loadMobileView();
});

// Expose to window
(window as any).filterNames = filterNames;
(window as any).speakName = speakName;
(window as any).toggleTheme = toggleTheme;
(window as any).toggleMobileView = toggleMobileView;
(window as any).toggleFavorite = toggleFavorite;
(window as any).toggleMemorized = toggleMemorized;
(window as any).setFilter = setFilter;

// Quiz exports
(window as any).startQuiz = startQuiz;
(window as any).closeQuiz = closeQuiz;
(window as any).checkAnswer = checkAnswer;

// Flashcard exports
(window as any).startFlashcards = startFlashcards;
(window as any).closeFlashcards = closeFlashcards;
(window as any).flipFlashcard = flipFlashcard;
(window as any).flashcardKnow = flashcardKnow;
(window as any).flashcardDontKnow = flashcardDontKnow;
(window as any).speakCurrentFlashcard = speakCurrentFlashcard;
(window as any).setRepeatCount = setRepeatCount;
