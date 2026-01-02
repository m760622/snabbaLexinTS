// Asma ul Husna - Game Logic
import { ASMA_UL_HUSNA, AsmaName } from '../data/asmaUlHusna';
import { TTSManager } from '../tts';

console.log('[AsmaUlHusna] Module loaded');

let allNames: AsmaName[] = [];
let filteredNames: AsmaName[] = [];

// State for favorites and memorized
let favorites: Set<number> = new Set();
let memorized: Set<number> = new Set();
type FilterType = 'all' | 'favorites' | 'memorized' | 'jalal' | 'jamal' | 'kamal';
let currentFilter: FilterType = 'all';
let currentTheme: 'neon' | 'calm' | 'islamic-night' = 'neon';
let currentLang: 'ar' | 'sv' = 'ar';  // Language to learn: Arabic or Swedish

// Categories Mapping
// Jalal (Majesty/Power), Jamal (Beauty/Mercy), Kamal (Perfection/Essence)
const NAME_CATEGORIES: Record<number, 'jalal' | 'jamal' | 'kamal'> = {
    1: 'jamal', 2: 'jamal', 3: 'jamal', 4: 'jalal', 5: 'jalal', // Allah, Rahman, Rahim, Malik, Quddus
    6: 'jalal', 7: 'jamal', 8: 'jalal', 9: 'jalal', 10: 'jalal', // Salam, Mumin, Muhaymin, Aziz, Jabbar
    11: 'jalal', 12: 'kamal', 13: 'kamal', 14: 'jamal', 15: 'jalal', // Mutakabbir, Khaliq, Bari, Musawwir, Ghaffar
    16: 'jalal', 17: 'jamal', 18: 'jamal', 19: 'kamal', 20: 'jalal', // Qahhar, Wahhab, Razzaq, Fattah, Alim
    21: 'jalal', 22: 'jalal', 23: 'jalal', 24: 'jalal', 25: 'jalal', // Qabid, Basit, Khafid, Rafi, Muizz, Mudhill
    26: 'jalal', 27: 'kamal', 28: 'kamal', 29: 'jalal', 30: 'jamal', // Sami, Basir, Hakam, Adl, Latif
    31: 'kamal', 32: 'jamal', 33: 'jalal', 34: 'jamal', 35: 'jamal', // Khabir, Halim, Azim, Ghafur, Shakur
    40: 'jalal', 41: 'jalal', 47: 'kamal', 48: 'jamal', // Hasib, Jalil, Haqq, Wadud
    // Defaulting others to Kamal for now if not specified (will be refined)
};

function getCategory(nr: number): 'jalal' | 'jamal' | 'kamal' {
    return NAME_CATEGORIES[nr] || 'kamal';
}

// Quiz State
let quizQuestions: AsmaName[] = [];
let currentQuestionIndex = 0;
let quizScore = 0;

// Flashcard State
let flashcardQueue: AsmaName[] = [];
let currentFlashcardIndex = 0;
let isFlashcardFlipped = false;
let repeatCount = 1;

// Audio Player State
let isPlaying = false;
let isLoopEnabled = false;
let playbackSpeed = 1.0;
let currentPlayIndex = 0;
let audioCycleTimer: any = null;


// Stats & Badges State
let streakDays = 0;
let lastVisitDate = '';

interface Badge {
    id: string;
    icon: string;
    name: string;
    desc: string;
    condition: () => boolean;
}

const BADGES: Badge[] = [
    { id: 'b_start', icon: '🌱', name: 'البداية', desc: 'حفظ أول اسم', condition: () => memorized.size >= 1 },
    { id: 'b_10', icon: '🥉', name: 'المبتدئ', desc: 'حفظ 10 أسماء', condition: () => memorized.size >= 10 },
    { id: 'b_33', icon: '🥈', name: 'المثابر', desc: 'حفظ 33 اسم', condition: () => memorized.size >= 33 },
    { id: 'b_50', icon: '🥇', name: 'المجتهد', desc: 'حفظ 50 اسم', condition: () => memorized.size >= 50 },
    { id: 'b_99', icon: '👑', name: 'الخاتم', desc: 'حفظ جميع الأسماء', condition: () => memorized.size >= 99 },
    { id: 'b_streak3', icon: '🔥', name: 'حماس', desc: 'استمرار 3 أيام', condition: () => streakDays >= 3 },
    { id: 'b_streak7', icon: '⚡', name: 'التزام', desc: 'استمرار 7 أيام', condition: () => streakDays >= 7 }
];

// Load saved state from localStorage
function loadSavedState(): void {
    try {
        const savedFavorites = localStorage.getItem('asma_favorites');
        const savedMemorized = localStorage.getItem('asma_memorized');
        const savedRepeat = localStorage.getItem('asma_repeat');

        if (savedFavorites) favorites = new Set(JSON.parse(savedFavorites));
        if (savedMemorized) memorized = new Set(JSON.parse(savedMemorized));
        if (savedRepeat) repeatCount = parseInt(savedRepeat);

        // Load Streak
        streakDays = parseInt(localStorage.getItem('asma_streak') || '0');
        lastVisitDate = localStorage.getItem('asma_last_visit') || '';

        calculateStreak();
        updateRepeatButtons();
    } catch (e) {
        console.error('[AsmaUlHusna] Failed to load saved state:', e);
    }
}

function calculateStreak(): void {
    const today = new Date().toISOString().split('T')[0];

    if (lastVisitDate !== today) {
        if (lastVisitDate) {
            const lastDate = new Date(lastVisitDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                // Consecutive day
                streakDays++;
            } else if (diffDays > 1) {
                // Streak broken
                streakDays = 1;
            }
            // If diffDays == 0 (same day), do nothing
        } else {
            // First visit ever
            streakDays = 1;
        }

        lastVisitDate = today;
        saveState();
    }
}

// Save state to localStorage
function saveState(): void {
    localStorage.setItem('asma_favorites', JSON.stringify([...favorites]));
    localStorage.setItem('asma_memorized', JSON.stringify([...memorized]));
    localStorage.setItem('asma_repeat', repeatCount.toString());
    localStorage.setItem('asma_streak', streakDays.toString());
    localStorage.setItem('asma_last_visit', lastVisitDate);
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
function setFilter(filter: FilterType): void {
    currentFilter = filter;

    // Update button states
    document.querySelectorAll('.asma-filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
    });

    applyFilters();
}

// Remove Arabic diacritics (harakat) for search
function normalizeArabic(text: string): string {
    // Arabic diacritics: fatha, damma, kasra, sukun, shadda, tanwin, etc.
    return text.replace(/[\u064B-\u065F\u0670]/g, '');
}

// Apply all filters (search + category filter)
function applyFilters(): void {
    const searchInput = document.getElementById('asmaSearch') as HTMLInputElement;
    const modeSearchInput = document.getElementById('asmaModeSearch') as HTMLInputElement;
    const rawQuery = (searchInput?.value || modeSearchInput?.value || '').trim();
    const query = normalizeArabic(rawQuery).toLowerCase();

    // Start with all names
    let result = [...allNames];

    // Apply category filter
    if (currentFilter === 'favorites') {
        result = result.filter(name => favorites.has(name.nr));
    } else if (currentFilter === 'memorized') {
        result = result.filter(name => memorized.has(name.nr));
    } else if (currentFilter === 'jalal' || currentFilter === 'jamal' || currentFilter === 'kamal') {
        result = result.filter(name => getCategory(name.nr) === currentFilter);
    }

    // Apply search filter (with diacritics normalization)
    if (query) {
        result = result.filter(name =>
            normalizeArabic(name.nameAr).includes(query) ||
            name.nameSv.toLowerCase().includes(query) ||
            normalizeArabic(name.meaningAr).includes(query) ||
            name.meaningSv.toLowerCase().includes(query) ||
            name.nr.toString() === rawQuery
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
    const jalalBtn = document.querySelector('[data-filter="jalal"]');
    const jamalBtn = document.querySelector('[data-filter="jamal"]');
    const kamalBtn = document.querySelector('[data-filter="kamal"]');

    const jalalCount = allNames.filter(n => getCategory(n.nr) === 'jalal').length;
    const jamalCount = allNames.filter(n => getCategory(n.nr) === 'jamal').length;
    const kamalCount = allNames.filter(n => getCategory(n.nr) === 'kamal').length;

    if (allBtn) allBtn.textContent = `الكل (${allNames.length})`;
    if (favBtn) favBtn.textContent = `❤️ (${favorites.size})`;
    if (memBtn) memBtn.textContent = `✓ (${memorized.size})`;
    if (jalalBtn) jalalBtn.textContent = `الجلال (${jalalCount})`;
    if (jamalBtn) jamalBtn.textContent = `الجمال (${jamalCount})`;
    if (kamalBtn) kamalBtn.textContent = `الكمال (${kamalCount})`;
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
    loadLang();  // Load saved language preference
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
            
            <div class="category-badge ${getCategory(name.nr)}">${getCategory(name.nr) === 'jalal' ? 'الجلال' : getCategory(name.nr) === 'jamal' ? 'الجمال' : 'الكمال'}</div>

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
            
            <div class="asma-name-ar ${currentLang === 'ar' ? 'lang-primary' : 'lang-secondary'}">${name.nameAr}</div>
            <div class="asma-name-sv ${currentLang === 'sv' ? 'lang-primary' : 'lang-secondary'}">${name.nameSv}</div>
            
            <div class="asma-meaning">
                <div class="asma-meaning-ar ${currentLang === 'ar' ? 'lang-primary' : 'lang-secondary'}">${name.meaningAr}</div>
                <div class="asma-meaning-sv ${currentLang === 'sv' ? 'lang-primary' : 'lang-secondary'}">${name.meaningSv}</div>
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
// Speak name using TTS with enhanced visual effects
function speakName(text: string, nr: number, isAutoPlay: boolean = false): void {
    // If manually clicked and player is running, stop player unless it's the current one?
    // User expectation: Click stops auto-play and plays clicked item.
    if (!isAutoPlay && isPlaying) {
        stopAudio();
    }

    // Find the card and button
    const card = document.querySelector(`[data-nr="${nr}"]`);
    const btn = card?.querySelector('.asma-speak-btn');

    // Add speaking classes
    btn?.classList.add('speaking');
    card?.classList.add('card-speaking');

    // Use TTS
    const doSpeak = () => {
        const rate = playbackSpeed;
        if (typeof TTSManager !== 'undefined' && TTSManager) {
            TTSManager.speak(text, 'ar', { speed: rate });
        } else {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'ar-SA';
            utterance.rate = rate * 0.8;
            speechSynthesis.speak(utterance);
        }
    };

    // Repeat logic - Only use repeat settings if NOT in Auto Play
    // In Auto Play, we play once (or maybe user wants repeat in auto play too? 
    // Usually "Play All" implies continuous flow. Sticking to 1x for auto play for now).
    const effectiveRepeat = isAutoPlay ? 1 : repeatCount;

    let count = 0;
    const speakLoop = () => {
        if (count < effectiveRepeat) {
            doSpeak();
            count++;
            // Delay for next repeat
            if (count < effectiveRepeat) {
                setTimeout(speakLoop, 2500 / playbackSpeed);
            } else {
                // Done
                setTimeout(() => {
                    btn?.classList.remove('speaking');
                    card?.classList.remove('card-speaking');
                }, 1000 / playbackSpeed);
            }
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
    document.querySelectorAll('.repeat-count-btn, .repeat-pill').forEach(btn => {
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

// ========== LANGUAGE TOGGLE ==========

function toggleLang(): void {
    currentLang = currentLang === 'ar' ? 'sv' : 'ar';
    localStorage.setItem('asma_lang', currentLang);
    updateLangButton();
    renderCards(); // Re-render to show the selected language prominently
}

function loadLang(): void {
    currentLang = (localStorage.getItem('asma_lang') as 'ar' | 'sv') || 'ar';
    updateLangButton();
}

function updateLangButton(): void {
    const label = document.getElementById('langLabel');
    const btn = document.getElementById('langToggle');
    if (label) {
        label.textContent = currentLang === 'ar' ? 'ع' : 'Sv';
    }
    if (btn) {
        btn.title = currentLang === 'ar' ? 'اللغة: عربي' : 'Språk: Svenska';
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

// ========== STATS LOGIC ==========

function openStats(): void {
    const modal = document.getElementById('statsModal');
    if (modal) {
        modal.classList.add('active');
        updateStatsUI();
    }
}

function closeStats(): void {
    const modal = document.getElementById('statsModal');
    if (modal) modal.classList.remove('active');
}

function updateStatsUI(): void {
    // 1. Update Streak
    const streakEl = document.getElementById('streakCounter');
    if (streakEl) streakEl.textContent = `🔥 ${streakDays} يوم متواصل`;

    // 2. Update Progress Rings
    updateProgressRing('ringMemorized', 'textMemorized', memorized.size, 99, true);
    updateProgressRing('ringFavorites', 'textFavorites', favorites.size, 99, false);

    // 3. Render Badges
    renderBadges();
}

function updateProgressRing(ringId: string, textId: string, value: number, max: number, isPercent: boolean): void {
    const ring = document.getElementById(ringId);
    const text = document.getElementById(textId);

    if (ring && text) {
        const radius = 40;
        const circumference = 2 * Math.PI * radius;
        const percent = Math.min(100, (value / max) * 100);
        const offset = circumference - (percent / 100) * circumference;

        ring.style.strokeDasharray = `${circumference} ${circumference}`;
        ring.style.strokeDashoffset = offset.toString();

        text.textContent = isPercent ? `${Math.round(percent)}%` : value.toString();
    }
}

function renderBadges(): void {
    const grid = document.getElementById('badgesGrid');
    if (!grid) return;

    grid.innerHTML = BADGES.map(badge => {
        const isUnlocked = badge.condition();
        return `
            <div class="badge-item ${isUnlocked ? 'unlocked' : ''}">
                <span class="badge-icon">${badge.icon}</span>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-desc">${badge.desc}</div>
            </div>
        `;
    }).join('');
}

// ========== AUDIO PLAYER LOGIC ==========

function togglePlay(): void {
    if (isPlaying) {
        stopAudio();
    } else {
        startAudio();
    }
}

function startAudio(): void {
    if (filteredNames.length === 0) return;

    isPlaying = true;
    updatePlayerUI();
    playCurrentAudio();

    // Show player bar if hidden
    const player = document.getElementById('audioPlayer');
    if (player) player.classList.remove('hidden');
}

function stopAudio(): void {
    isPlaying = false;
    clearTimeout(audioCycleTimer);
    updatePlayerUI();
    TTSManager.stop();
}

function playCurrentAudio(): void {
    if (!isPlaying) return;

    // Ensure index is valid
    if (currentPlayIndex >= filteredNames.length) {
        currentPlayIndex = 0;
        if (!isLoopEnabled) {
            stopAudio();
            return;
        }
    }

    const name = filteredNames[currentPlayIndex];
    updatePlayerUI();

    // Speak name
    // Using speakName internally but managing the sequence
    speakName(name.nameAr, name.nr, true); // true = called from player

    // Calculate delay based on speed (approx 2-3 seconds per name normal speed)
    const baseDelay = 3000;
    const delay = baseDelay / playbackSpeed;

    // Schedule next
    clearTimeout(audioCycleTimer);
    audioCycleTimer = setTimeout(() => {
        if (!isLoopEnabled) {
            currentPlayIndex++;
        }
        // If loop is enabled, we stay on same index? 
        // No, "Loop" usually means "Loop List". "Repeat One" is different.
        // Let's implement: Loop = Loop List.
        // So we always increment, but wrap around.

        if (isLoopEnabled && currentPlayIndex >= filteredNames.length) {
            currentPlayIndex = 0;
        }

        playCurrentAudio();
    }, delay);
}

function playNext(): void {
    currentPlayIndex++;
    if (currentPlayIndex >= filteredNames.length) currentPlayIndex = 0;
    playCurrentAudio();
    updatePlayerUI(); // Update UI immediately
}

function playPrev(): void {
    currentPlayIndex--;
    if (currentPlayIndex < 0) currentPlayIndex = filteredNames.length - 1;
    playCurrentAudio();
    updatePlayerUI();
}

function toggleLoop(): void {
    isLoopEnabled = !isLoopEnabled;
    const btn = document.getElementById('loopBtn');
    if (btn) btn.classList.toggle('active', isLoopEnabled);
}

function toggleSpeed(): void {
    // Cycle: 1 -> 0.75 -> 0.5 -> 1.5 -> 1
    if (playbackSpeed === 1.0) playbackSpeed = 0.75;
    else if (playbackSpeed === 0.75) playbackSpeed = 0.5;
    else if (playbackSpeed === 0.5) playbackSpeed = 1.5;
    else playbackSpeed = 1.0;

    const btn = document.getElementById('speedBtn');
    if (btn) btn.textContent = `${playbackSpeed}x`;

    // Update TTS rate?
    // TTSManager needs to support rate. 
    // For now we just control delay between names.
    // Ideally we should set TTS rate too.
}

function updatePlayerUI(): void {
    const playBtn = document.getElementById('playPauseBtn');
    const title = document.getElementById('playerTitle');
    const status = document.getElementById('playerStatus');

    if (playBtn) playBtn.textContent = isPlaying ? '⏸️' : '▶️';

    if (filteredNames[currentPlayIndex]) {
        if (title) title.textContent = filteredNames[currentPlayIndex].nameAr;
    }

    if (status) status.textContent = isPlaying ? `جاري التشغيل (${playbackSpeed}x)` : 'متوقف';
}

// Social Features
async function shareStats(): Promise<void> {
    const text = `🌟 إنجازي في أسماء الله الحسنى 🌟\n\n✅ حفظت: ${memorized.size} / 99 اسم\n❤️ المفضلة: ${favorites.size} اسم\n🔥 أيام متواصلة: ${streakDays} يوم\n\nتعلم أسماء الله الحسنى مع snabbaLexin!`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'إنجازي في أسماء الله الحسنى',
                text: text,
            });
            return;
        } catch (e) {
            console.log('Share failed', e);
        }
    }

    // Fallback
    try {
        await navigator.clipboard.writeText(text);
        alert('تم نسخ النص إلى الحافظة! يمكنك مشاركته الآن.');
    } catch (e) {
        alert('عذراً، لم نتمكن من النسخ.');
    }
}

async function exportMemorizedList(): Promise<void> {
    if (memorized.size === 0) {
        alert('لم تقم بحفظ أي أسماء بعد.');
        return;
    }

    const list = allNames
        .filter(n => memorized.has(n.nr))
        .map(n => `${n.nr}. ${n.nameAr} (${n.meaningAr})`)
        .join('\n');

    const text = `📋 قائمة حفظي لأسماء الله الحسنى:\n\n${list}`;

    try {
        await navigator.clipboard.writeText(text);
        alert('تم نسخ قائمة الأسماء المحفوظة إلى الحافظة! 📋');
    } catch (e) {
        alert('عذراً، حدث خطأ في النسخ.');
    }
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

// Stats exports
(window as any).openStats = openStats;
(window as any).closeStats = closeStats;

// Audio Player exports
(window as any).togglePlay = togglePlay;
(window as any).playNext = playNext;
(window as any).playPrev = playPrev;
(window as any).toggleLoop = toggleLoop;
(window as any).toggleSpeed = toggleSpeed;
(window as any).startAudio = startAudio;
// Social exports
(window as any).shareStats = shareStats;
(window as any).exportMemorizedList = exportMemorizedList;

// Language exports
(window as any).toggleLang = toggleLang;
