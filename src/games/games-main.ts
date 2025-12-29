/**
 * Game Logic for Snabba Lexin Games
 */

import { showToast } from '../utils';
import { triggerConfetti } from './games-utils';

// Constants
export const COL_ID = 0;
export const COL_TYPE = 1;
export const COL_SWE = 2;
export const COL_ARB = 3;
export const COL_DEF = 5;
export const COL_FORMS = 6;
export const COL_EX = 7;
export const COL_EX_ARB = 8;
export const COL_IDIOM = 9;
export const COL_IDIOM_ARB = 10;

// State

/**
 * Global Start Game Function with Error Boundary
 */
(window as any).startGame = function (gameType: string) {
    try {
        console.log("window.startGame called with:", gameType);

        // Hide all active game containers
        document.querySelectorAll('.active-game-container').forEach(el => (el as HTMLElement).style.display = 'none');

        // Hide Global UI Elements
        document.querySelectorAll('.stats-hero, .daily-banner, .category-filter-container')
            .forEach(el => (el as HTMLElement).style.display = 'none');

        // Scroll to top
        window.scrollTo(0, 0);

        // Reset Score
        resetGameScore();

        // Redirect to standalone pages
        const routes: Record<string, string> = {
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

        if (routes[gameType]) {
            window.location.href = routes[gameType];
            return;
        }

    } catch (error) {
        console.error("❌ Game Error:", error);
        showToast("Spelet kunde inte laddas. Försök igen! / اللعبة لم تحمل، حاول مجددًا", { type: 'error' });
        setTimeout(() => {
            window.location.href = 'games.html';
        }, 2000);
    }
};

(window as any).showGameMenu = function () {
    try {
        const gameMenu = document.getElementById('gameMenu');
        if (gameMenu) gameMenu.style.display = 'block';

        document.querySelectorAll('.stats-hero, .daily-banner, .category-filter-container')
            .forEach(el => (el as HTMLElement).style.display = '');

        window.scrollTo(0, 0);
        loadScores();
    } catch (error) {
        console.error("❌ Error showing game menu:", error);
        window.location.href = 'games.html';
    }
};

function resetGameScore() {
    const scoreIds = ['gameScore', 'pronunciationScore', 'spellingScore', 'wordWheelScore', 'sentenceScore', 'rainScore'];
    scoreIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
    });
}

function loadScores() {
    const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    const gameTypes = [
        'missing-word', 'flashcards', 'pronunciation', 'spelling',
        'word-wheel', 'sentence', 'rain', 'wordle', 'grammar', 'word-connect'
    ];

    gameTypes.forEach(type => {
        const el = document.getElementById(`score-${type}`);
        if (el) el.textContent = scores[type] || 0;
    });
}

export function saveGameScore(game: string, score: number) {
    const scores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    const currentHigh = scores[game] || 0;

    if (score > currentHigh) {
        scores[game] = score;
        localStorage.setItem('gameScores', JSON.stringify(scores));
        loadScores();
        showToast(`Nytt rekord! 🏆 / رقم قياسي جديد!`);
    }
}

function trackGameUsage(gameId: string) {
    try {
        const usageData = JSON.parse(localStorage.getItem('gameUsageCounts') || '{}');
        usageData[gameId] = (usageData[gameId] || 0) + 1;
        localStorage.setItem('gameUsageCounts', JSON.stringify(usageData));
    } catch (e) {
        console.error("Error tracking game usage:", e);
    }
}

function prioritizePopularGames() {
    try {
        const usageData = JSON.parse(localStorage.getItem('gameUsageCounts') || '{}');
        const threshold = 3;

        const popularGames = Object.entries(usageData)
            .filter(([_, count]) => (count as number) > threshold)
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

function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-in-view');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.game-card-item, .stats-hero, .daily-banner, .category-filter-container, .wc-header-compact')
        .forEach(target => observer.observe(target));
}

// Initializers
document.addEventListener('DOMContentLoaded', () => {
    prioritizePopularGames();
    document.querySelectorAll('.game-card-item').forEach(card => {
        card.addEventListener('click', () => {
            const gameId = card.getAttribute('data-game-id');
            if (gameId) trackGameUsage(gameId);
        });
    });

    loadScores();
    initScrollAnimations();
});
