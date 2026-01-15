/**
 * Games Utility Module - Main entry point for games
 * TypeScript Version
 */



import { AppConfig } from '../config';
import '../i18n'; // Initialize LanguageManager

// ========================================
// Theme Initialization for Game Pages
// ========================================
function initGameTheme(): void {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColorTheme = localStorage.getItem('colorTheme') || 'default';

    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.body.setAttribute('data-theme', savedTheme);

    // Apply color theme
    if (savedColorTheme && savedColorTheme !== 'default') {
        document.documentElement.setAttribute('data-color-theme', savedColorTheme);
        document.body.setAttribute('data-color-theme', savedColorTheme);
    }

    // Also add/remove dark-mode class for compatibility
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        document.documentElement.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
        document.documentElement.classList.remove('dark-mode');
    }


}

// Initialize theme immediately
initGameTheme();

// ========================================
// Constants (from AppConfig)
// ========================================
export const COL_ID = AppConfig.COLUMNS.ID;
export const COL_TYPE = AppConfig.COLUMNS.TYPE;
export const COL_SWE = AppConfig.COLUMNS.SWEDISH;
export const COL_ARB = AppConfig.COLUMNS.ARABIC;
export const COL_ARB_DEF = AppConfig.COLUMNS.ARABIC_EXT;
export const COL_DEF = AppConfig.COLUMNS.DEFINITION;
export const COL_FORMS = AppConfig.COLUMNS.FORMS;
export const COL_EX = AppConfig.COLUMNS.EXAMPLE_SWE;
export const COL_EX_ARB = AppConfig.COLUMNS.EXAMPLE_ARB;
export const COL_IDIOM = AppConfig.COLUMNS.IDIOM_SWE;
export const COL_IDIOM_ARB = AppConfig.COLUMNS.IDIOM_ARB;

/* Expose to window for legacy scripts */
(window as any).COL_ID = COL_ID;
(window as any).COL_TYPE = COL_TYPE;
(window as any).COL_SWE = COL_SWE;
(window as any).COL_ARB = COL_ARB;
(window as any).COL_ARB_DEF = COL_ARB_DEF;
(window as any).COL_DEF = COL_DEF;
(window as any).COL_FORMS = COL_FORMS;
(window as any).COL_EX = COL_EX;
(window as any).COL_EX_ARB = COL_EX_ARB;
(window as any).COL_IDIOM = COL_IDIOM;
(window as any).COL_IDIOM_ARB = COL_IDIOM_ARB;

import { ToastManager } from '../utils/toast.util';

// State
let gameScore = 0;

// ========================================
// Toast Notification - Unified with language support
// ========================================
export function showToast(message: string, type: 'default' | 'error' | 'success' | 'info' = 'default'): void {
    // Use unified ToastManager which handles bilingual message parsing
    ToastManager.show(message, { type: type === 'default' ? 'success' : type });
}

// ========================================
// Start Game Function
// ========================================
export function startGame(gameType: string): void {
    try {

        const gameMenu = document.getElementById('gameMenu');

        // Hide all active game containers
        document.querySelectorAll('.active-game-container').forEach(el => (el as HTMLElement).style.display = 'none');

        // Hide Menu
        if (gameMenu) gameMenu.style.display = 'none';

        // Hide Global UI Elements
        document.querySelectorAll('.stats-hero, .daily-banner, .category-filter-container')
            .forEach(el => (el as HTMLElement).style.display = 'none');

        // Scroll to top
        window.scrollTo(0, 0);

        // Reset Score
        resetGameScore();

        // Redirect to standalone pages
        const gamePages: Record<string, string> = {
            'missing-word': 'missing_word.html',
            'flashcards': 'flashcards.html',
            'pronunciation': 'pronunciation.html',
            'spelling': 'spelling.html',
            'word-wheel': 'word_wheel.html',
            'sentence-builder': 'sentence_builder.html',
            'word-rain': 'word_rain.html',
            'wordle': 'wordle.html',
            'grammar': 'grammar.html',
            'word-connect': 'word_connect.html'
        };

        if (gamePages[gameType]) {
            window.location.href = gamePages[gameType];
            return;
        }
    } catch (error) {
        console.error("❌ Game Error:", error);
        showToast("Spelet kunde inte laddas. Försök igen! / اللعبة لم تحمل، حاول مجددًا", 'error');
        setTimeout(() => {
            try {
                showGameMenu();
            } catch {
                window.location.reload();
            }
        }, 2000);
    }
}

// ========================================
// Show Game Menu
// ========================================
export function showGameMenu(): void {
    try {
        const gameMenu = document.getElementById('gameMenu');
        const gameElements = [
            'missingWordGame', 'flashcardsGame', 'pronunciationGame',
            'spellingGame', 'wordWheelGame', 'sentenceGame',
            'rainGame', 'wordleGame', 'grammarGame', 'word-game-module'
        ];

        if (gameMenu) gameMenu.style.display = 'block';

        document.querySelectorAll('.stats-hero, .daily-banner, .category-filter-container')
            .forEach(el => (el as HTMLElement).style.display = '');

        window.scrollTo(0, 0);

        gameElements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });

        loadScores();
    } catch (error) {
        console.error("❌ Error showing game menu:", error);
        window.location.href = 'games.html';
    }
}

// ========================================
// Reset Game Score
// ========================================
function resetGameScore(): void {
    gameScore = 0;
    const scoreIds = [
        'gameScore', 'pronunciationScore', 'spellingScore',
        'wordWheelScore', 'sentenceScore', 'rainScore'
    ];
    scoreIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
}

// ========================================
// Confetti Effect
// ========================================
export function triggerConfetti(): void {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '9999';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d')!;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
        x: number;
        y: number;
        color: string;
        size: number;
        speed: number;
        angle: number;
    }

    const particles: Particle[] = [];
    const colors = ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#0EA5E9'];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 10 + 5,
            speed: Math.random() * 5 + 2,
            angle: Math.random() * 6.2
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let active = false;

        particles.forEach(p => {
            p.y += p.speed;
            p.x += Math.sin(p.angle) * 2;
            p.angle += 0.1;

            if (p.y < canvas.height) {
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x, p.y, p.size, p.size);
                active = true;
            }
        });

        if (active) requestAnimationFrame(animate);
        else canvas.remove();
    }

    animate();
}

// ========================================
// Score Management
// ========================================
export function loadScores(): void {
    const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    const scoreMap: Record<string, string> = {
        'missing-word': 'score-missing-word',
        'flashcards': 'score-flashcards',
        'pronunciation': 'score-pronunciation',
        'spelling': 'score-spelling',
        'word-wheel': 'score-word-wheel',
        'sentence': 'score-sentence',
        'rain': 'score-rain',
        'wordle': 'score-wordle',
        'grammar': 'score-grammar',
        'word-connect': 'score-word-connect'
    };

    Object.entries(scoreMap).forEach(([key, elId]) => {
        const el = document.getElementById(elId);
        if (el) el.textContent = String(scores[key] || 0);
    });
}

export function saveScore(game: string, score: number): void {
    const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    const currentHigh = scores[game] || 0;

    if (score > currentHigh) {
        scores[game] = score;
        localStorage.setItem('gameScores', JSON.stringify(scores));
        loadScores();
        showToast(`Nytt rekord! 🏆 / رقم قياسي جديد!`);
    }
}

// ========================================
// Dark Mode
// ========================================
function initDarkMode(): void {
    const toggleBtn = document.getElementById('darkModeToggle');
    if (!toggleBtn) return;

    const moonIcon = toggleBtn.querySelector('.moon-icon') as HTMLElement | null;
    const sunIcon = toggleBtn.querySelector('.sun-icon') as HTMLElement | null;

    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark-mode');
        if (moonIcon) moonIcon.style.display = 'none';
        if (sunIcon) sunIcon.style.display = 'block';
    }

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isNowDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', String(isNowDark));

        if (isNowDark) {
            if (moonIcon) moonIcon.style.display = 'none';
            if (sunIcon) sunIcon.style.display = 'block';
        } else {
            if (moonIcon) moonIcon.style.display = 'block';
            if (sunIcon) sunIcon.style.display = 'none';
        }
    });
}

// ========================================
// Mobile View Toggle
// ========================================
export function toggleMobileView(): void {
    const body = document.body;
    const isMobile = body.classList.toggle('mobile-view-mode');

    localStorage.setItem('mobileViewMode', String(isMobile));

    const btn = document.getElementById('mobileToggle');
    if (btn) {
        btn.textContent = isMobile ? '🖥️' : '📱';
        btn.title = isMobile ? 'Desktop View' : 'Mobile View';
    }

    showToast(isMobile ? '📱 Mobile View' : '🖥️ Desktop View', 'success');
}

function initMobileView(): void {
    const savedMode = localStorage.getItem('mobileViewMode');
    // Default to mobile view if not set (mobile-first approach)
    const isMobile = savedMode === null ? true : savedMode === 'true';

    if (isMobile) {
        document.body.classList.add('mobile-view-mode');
        const btn = document.getElementById('mobileToggle');
        if (btn) {
            btn.textContent = '🖥️';
            btn.title = 'Desktop View';
        }
    }
}

// ========================================
// Focus Mode Toggle
// ========================================
export function toggleFocusMode(): void {
    const body = document.body;
    const isFocusMode = body.classList.toggle('focus-mode');

    localStorage.setItem('focusMode', String(isFocusMode));

    const btn = document.getElementById('focusModeToggle');
    if (btn) {
        btn.textContent = isFocusMode ? '🎯' : '👁️';
        btn.title = isFocusMode ? 'وضع التركيز مفعّل / Focus Mode On' : 'وضع التركيز / Focus Mode';
    }

    showToast(
        isFocusMode
            ? '🎯 وضع التركيز مفعّل / Focus Mode On'
            : '👁️ الوضع العادي / Normal Mode',
        'success'
    );
}

function initFocusMode(): void {
    const savedMode = localStorage.getItem('focusMode') === 'true';

    if (savedMode) {
        document.body.classList.add('focus-mode');
        const btn = document.getElementById('focusModeToggle');
        if (btn) {
            btn.textContent = '🎯';
            btn.title = 'وضع التركيز مفعّل / Focus Mode On';
        }
    }
}

// ========================================
// Game Prioritization
// ========================================
function trackGameUsage(gameId: string): void {
    if (!gameId) return;

    try {
        const usageData = JSON.parse(localStorage.getItem('gameUsageCounts') || '{}');
        usageData[gameId] = (usageData[gameId] || 0) + 1;
        localStorage.setItem('gameUsageCounts', JSON.stringify(usageData));

    } catch (e) {
        console.error("Error tracking game usage:", e);
    }
}

function prioritizePopularGames(): void {
    try {
        const usageData = JSON.parse(localStorage.getItem('gameUsageCounts') || '{}');
        const threshold = 3;

        const popularGames = Object.entries(usageData)
            .filter(([, count]) => (count as number) > threshold)
            .sort((a, b) => (b[1] as number) - (a[1] as number));

        if (popularGames.length === 0) return;

        const grid = document.querySelector('.game-cards-grid');
        if (!grid) return;

        [...popularGames].reverse().forEach(([gameId]) => {
            const card = document.querySelector(`.game-card-item[data-game-id="${gameId}"]`);
            if (card) {
                grid.prepend(card);
                card.classList.add('popular-game-highlight');
            }
        });

    } catch (e) {
        console.error("Error prioritizing games:", e);
    }
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations(): void {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-in-view');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const targets = document.querySelectorAll('.game-card-item, .stats-hero, .daily-banner, .category-filter-container, .wc-header-compact');
    targets.forEach(target => observer.observe(target));
}

// ========================================
// DOMContentLoaded
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    prioritizePopularGames();

    document.querySelectorAll('.game-card-item').forEach(card => {
        card.addEventListener('click', () => {
            const gameId = card.getAttribute('data-game-id');
            if (gameId) trackGameUsage(gameId);
        });
    });

    loadScores();
    initDarkMode();
    initMobileView();
    initFocusMode();
    initScrollAnimations();
});

// ========================================
// Global Exports
// ========================================
(window as any).startGame = startGame;
(window as any).showGameMenu = showGameMenu;
(window as any).toggleMobileView = toggleMobileView;
(window as any).toggleFocusMode = toggleFocusMode;
(window as any).showToast = showToast;
(window as any).saveScore = saveScore;
(window as any).triggerConfetti = triggerConfetti;

