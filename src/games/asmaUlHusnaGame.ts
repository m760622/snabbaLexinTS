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

// Load saved state from localStorage
function loadSavedState(): void {
    try {
        const savedFavorites = localStorage.getItem('asma_favorites');
        const savedMemorized = localStorage.getItem('asma_memorized');
        if (savedFavorites) favorites = new Set(JSON.parse(savedFavorites));
        if (savedMemorized) memorized = new Set(JSON.parse(savedMemorized));
    } catch (e) {
        console.error('[AsmaUlHusna] Failed to load saved state:', e);
    }
}

// Save state to localStorage
function saveState(): void {
    localStorage.setItem('asma_favorites', JSON.stringify([...favorites]));
    localStorage.setItem('asma_memorized', JSON.stringify([...memorized]));
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
    renderFilterButtons();
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
                    <button class="asma-speak-btn" onclick="speakName('${name.nameAr}', this)" title="استمع">
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

// Filter names
function filterNames(): void {
    const searchInput = document.getElementById('asmaSearch') as HTMLInputElement;
    const query = searchInput?.value.toLowerCase().trim() || '';

    if (!query) {
        filteredNames = [...allNames];
    } else {
        filteredNames = allNames.filter(name =>
            name.nameAr.includes(query) ||
            name.nameSv.toLowerCase().includes(query) ||
            name.meaningAr.includes(query) ||
            name.meaningSv.toLowerCase().includes(query) ||
            name.nr.toString() === query
        );
    }

    renderCards();
    updateStats();
}

// Update stats
function updateStats(): void {
    const statsEl = document.getElementById('asmaStats');
    if (statsEl) {
        statsEl.textContent = `Visar ${filteredNames.length} av ${allNames.length} namn`;
    }
}

// Speak name using TTS
function speakName(text: string): void {
    if (typeof TTSManager !== 'undefined' && TTSManager) {
        TTSManager.speak(text, 'ar');
    } else {
        // Fallback to Web Speech API
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        utterance.rate = 0.8;
        speechSynthesis.speak(utterance);
    }
}

// Theme management
function loadTheme(): void {
    const savedTheme = localStorage.getItem('gameTheme') || 'neon';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);
}

function toggleTheme(): void {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'calm' ? 'neon' : 'calm';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('gameTheme', newTheme);
    updateThemeButton(newTheme);
}

function updateThemeButton(theme: string): void {
    // SVG icons don't need updating - button already has SVG
    const btn = document.getElementById('themeToggle');
    if (btn) {
        btn.classList.toggle('calm-active', theme === 'calm');
    }
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
    // SVG icons don't need updating - button already has SVG
    const btn = document.getElementById('mobileToggle');
    if (btn) {
        btn.classList.toggle('mobile-active', isMobile);
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

