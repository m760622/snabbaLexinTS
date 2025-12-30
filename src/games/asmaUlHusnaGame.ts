// Asma ul Husna - Game Logic
import { ASMA_UL_HUSNA, AsmaName } from '../data/asmaUlHusna';
import { TTSManager } from '../tts';

console.log('[AsmaUlHusna] Module loaded');

let allNames: AsmaName[] = [];
let filteredNames: AsmaName[] = [];

// Initialize
function init(): void {
    console.log('[AsmaUlHusna] Initializing...');
    allNames = ASMA_UL_HUSNA;
    filteredNames = [...allNames];
    renderCards();
    updateStats();
    loadTheme();
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

    return `
        <div class="asma-card" data-nr="${name.nr}">
            <div class="asma-card-header">
                <div class="asma-number">${name.nr}</div>
                <button class="asma-speak-btn" onclick="speakName('${name.nameAr}')" title="استمع">🔊</button>
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
                    <div class="conj-label">Dåtid / الماضي</div>
                    <div class="conj-ar">${name.pastAr}</div>
                    <div class="conj-sv">${name.pastSv}</div>
                </div>
                <div class="conj-item">
                    <div class="conj-label">Nutid / المضارع</div>
                    <div class="conj-ar">${name.presentAr}</div>
                    <div class="conj-sv">${name.presentSv}</div>
                </div>
                <div class="conj-item">
                    <div class="conj-label">Masdar / المصدر</div>
                    <div class="conj-ar">${name.masdarAr}</div>
                    <div class="conj-sv">${name.masdarSv}</div>
                </div>
            </div>
            ` : ''}
            
            <div class="asma-verse">
                <div class="verse-icon">📖</div>
                <div class="verse-ar">${name.verseAr}</div>
                <div class="verse-sv">${name.verseSv}</div>
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

