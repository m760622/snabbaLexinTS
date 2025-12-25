import { showToast } from './utils';
import { speakSwedish } from './tts';
import { AppConfig } from './config';

/**
 * UI Logic for the Games area
 */
export function initGamesUI() {
    console.log('[GamesUI] Initializing...');
    
    loadGamesStats();
    loadDailyChallenge();
    loadGameStars();
    loadLeaderboard();
    setupMobileToggle();
    loadLeaderboard();
    setupMobileToggle();
    setupSW();
    setupTiltEffect();

    // Word of the Day - Wait for dictionary
    if ((window as any).dictionaryData) {
        loadWordOfTheDay();
    } else {
        window.addEventListener('dictionaryLoaded', () => loadWordOfTheDay());
    }

    // Export functions to global scope for legacy HTML onclick handlers
    (window as any).filterGames = filterGames;
    (window as any).openDailyChallenge = openDailyChallenge;
    (window as any).updateGameScore = updateGameScore;
    (window as any).updateGamesStats = updateGamesStats;
    (window as any).trackGamePlayed = trackGamePlayed;
}

function setupMobileToggle() {
    const mobileToggle = document.getElementById('mobileToggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
             (window as any).MobileViewManager?.toggle();
        });
    }
}

function setupSW() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('../sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                    registration.update();
                })
                .catch(err => {
                    console.error('SW registration failed: ', err);
                });
        });
    }
}

// ========== GAMES STATS ==========
function loadGamesStats() {
    const stats = JSON.parse(localStorage.getItem('gamesStats') || '{"gamesPlayed": 0, "winStreak": 0, "totalScore": 0}');
    const playedEl = document.getElementById('gamesPlayedStat');
    const streakEl = document.getElementById('winStreakStat');
    const scoreEl = document.getElementById('totalScoreStat');
    
    if (playedEl) playedEl.textContent = stats.gamesPlayed || 0;
    if (streakEl) streakEl.textContent = stats.winStreak || 0;
    if (scoreEl) scoreEl.textContent = stats.totalScore || 0;
}

function updateGamesStats(won: boolean, score: number = 0) {
    const stats = JSON.parse(localStorage.getItem('gamesStats') || '{"gamesPlayed": 0, "winStreak": 0, "totalScore": 0}');
    stats.gamesPlayed++;
    stats.totalScore += score;
    if (won) {
        stats.winStreak++;
    } else {
        stats.winStreak = 0;
    }
    localStorage.setItem('gamesStats', JSON.stringify(stats));
    loadGamesStats();
    updateDailyChallenge();
}

// ========== DAILY CHALLENGE ==========
function loadDailyChallenge() {
    const today = new Date().toISOString().split('T')[0];
    let daily = JSON.parse(localStorage.getItem('dailyGameChallenge') || '{}');

    if (daily.date !== today) {
        daily = { date: today, gamesPlayed: 0, completed: false };
        localStorage.setItem('dailyGameChallenge', JSON.stringify(daily));
    }

    const progressEl = document.getElementById('dailyProgress');
    if (progressEl) progressEl.textContent = `${daily.gamesPlayed}/3`;

    if (daily.completed) {
        document.getElementById('dailyChallengeBanner')?.classList.add('completed');
    }
}

function updateDailyChallenge() {
    const today = new Date().toISOString().split('T')[0];
    let daily = JSON.parse(localStorage.getItem('dailyGameChallenge') || '{}');

    if (daily.date !== today) {
        daily = { date: today, gamesPlayed: 0, completed: false };
    }

    if (!daily.completed) {
        daily.gamesPlayed++;
        if (daily.gamesPlayed >= 3) {
            daily.completed = true;
            const stats = JSON.parse(localStorage.getItem('gamesStats') || '{}');
            stats.totalScore = (stats.totalScore || 0) + 100;
            localStorage.setItem('gamesStats', JSON.stringify(stats));
            showToast('🎉 Daglig utmaning klar! +100 poäng / تحدي اليوم مكتمل!');
        }
        localStorage.setItem('dailyGameChallenge', JSON.stringify(daily));
    }

    loadDailyChallenge();
}

function openDailyChallenge() {
    const gameCards = document.querySelector('.game-cards-grid');
    if (gameCards) gameCards.scrollIntoView({ behavior: 'smooth' });
}

// ========== CATEGORY FILTER ==========
const gameCategories: Record<string, string[]> = {
    'vocab': ['Vokaler', 'Neon Search', 'Hangman', 'Memory', 'Minneskor', 'Bokstav Länk', 'Ord Hjulet', 'Svenska Wordle', 'Gissa Ordet'],
    'grammar': ['Grammatik', 'Bygg Meningen', 'Fyll i'],
    'listening': ['Lyssna', 'Uttalscoach'],
    'puzzle': ['Lås Upp', 'Neon Blocks', 'Ord-Regn']
};

function filterGames(category: string) {
    document.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
    document.querySelector(`[data-cat="${category}"]`)?.classList.add('active');

    const cards = document.querySelectorAll('.game-card-item');
    cards.forEach(card => {
        const title = (card as HTMLElement).querySelector('h3')?.textContent || '';

        if (category === 'all') {
            (card as HTMLElement).style.display = '';
        } else {
            const categoryGames = gameCategories[category] || [];
            const matches = categoryGames.some(g => title.includes(g));
            (card as HTMLElement).style.display = matches ? '' : 'none';
        }
    });
}

// ========== GAME STARS SYSTEM ==========
function loadGameStars() {
    const gameScores = JSON.parse(localStorage.getItem('gameScores') || '{}');

    document.querySelectorAll('.game-stars').forEach(starsEl => {
        const gameId = (starsEl as HTMLElement).dataset.game;
        if (!gameId) return;
        
        const score = gameScores[gameId] || 0;

        let stars = 0;
        if (score >= 100) stars = 3;
        else if (score >= 50) stars = 2;
        else if (score >= 10) stars = 1;

        if (stars > 0) {
            starsEl.setAttribute('data-stars', stars.toString());
        }
    });
}

function updateGameScore(gameId: string, score: number) {
    const gameScores = JSON.parse(localStorage.getItem('gameScores') || '{}');
    const currentScore = gameScores[gameId] || 0;

    if (score > currentScore) {
        gameScores[gameId] = score;
        localStorage.setItem('gameScores', JSON.stringify(gameScores));
    }

    loadGameStars();
}

// ========== LEADERBOARD ==========
function loadLeaderboard() {
    const stats = JSON.parse(localStorage.getItem('gamesStats') || '{}');
    const today = new Date().toISOString().split('T')[0];
    const weekStart = getWeekStart();

    const bestStreak = stats.bestStreak || stats.winStreak || 0;
    const bestStreakEl = document.getElementById('bestStreak');
    if (bestStreakEl) bestStreakEl.textContent = bestStreak;

    const dailyStats = JSON.parse(localStorage.getItem('dailyGamesLog') || '{}');
    const todayGames = dailyStats[today] || 0;
    const todayGamesEl = document.getElementById('todayGames');
    if (todayGamesEl) todayGamesEl.textContent = todayGames;

    let weeklyGames = 0;
    Object.keys(dailyStats).forEach(date => {
        if (date >= weekStart) {
            weeklyGames += dailyStats[date];
        }
    });
    const weeklyGamesEl = document.getElementById('weeklyGames');
    if (weeklyGamesEl) weeklyGamesEl.textContent = weeklyGames.toString();
}

function getWeekStart() {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    return monday.toISOString().split('T')[0];
}

function trackGamePlayed() {
    const today = new Date().toISOString().split('T')[0];
    const dailyStats = JSON.parse(localStorage.getItem('dailyGamesLog') || '{}');
    dailyStats[today] = (dailyStats[today] || 0) + 1;
    localStorage.setItem('dailyGamesLog', JSON.stringify(dailyStats));

    const stats = JSON.parse(localStorage.getItem('gamesStats') || '{}');
    if (!stats.bestStreak || stats.winStreak > stats.bestStreak) {
        stats.bestStreak = stats.winStreak;
        localStorage.setItem('gamesStats', JSON.stringify(stats));
    }

    loadLeaderboard();
}

// ========== WORD OF THE DAY ==========
function loadWordOfTheDay() {
    const data = (window as any).dictionaryData;
    if (!data || !data.length) return;

    const today = new Date().toISOString().split('T')[0];
    let storedWOTD = JSON.parse(localStorage.getItem('wotd_cache') || '{}');

    if (storedWOTD.date !== today) {
        // Simple random for now
        const randomIndex = Math.floor(Math.random() * data.length);
        // Ensure it has an example if possible
        let word = data[randomIndex];
        // Try 10 times to find one with example
        for(let i=0; i<10; i++) {
             if (word[AppConfig.COLUMNS.EXAMPLE_SWE]) break;
             word = data[Math.floor(Math.random() * data.length)];
        }

        storedWOTD = {
            date: today,
            word: word
        };
        localStorage.setItem('wotd_cache', JSON.stringify(storedWOTD));
    }
    
    const word = storedWOTD.word;
    if (!word) return;

    const container = document.getElementById('wordOfTheDay');
    if (container) container.style.display = 'block';

    const swedishEl = document.getElementById('wotd-swedish');
    const arabicEl = document.getElementById('wotd-arabic');
    const exampleEl = document.getElementById('wotd-example');

    if (swedishEl) swedishEl.textContent = word[AppConfig.COLUMNS.SWEDISH];
    if (arabicEl) arabicEl.textContent = word[AppConfig.COLUMNS.ARABIC];
    if (exampleEl) exampleEl.textContent = word[AppConfig.COLUMNS.EXAMPLE_SWE] || 'Ingen exempelmening / لا يوجد مثال';

    const btn = document.getElementById('wotd-speak-btn');
    if (btn) {
        btn.onclick = (e) => {
            e.stopPropagation();
            speakSwedish(word[AppConfig.COLUMNS.SWEDISH]);
            // Visual feedback
            const icon = btn.querySelector('svg');
            if (icon) icon.style.fill = '#fff';
            setTimeout(() => { if(icon) icon.style.fill = 'none'; }, 1000);
        };
    }
}

// ========== 3D TILT EFFECT ==========
function setupTiltEffect() {
    const cards = document.querySelectorAll('.game-card-item');
    if (!cards.length) return;

    cards.forEach(card => {
        const el = card as HTMLElement;
        
        el.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Limit rotation to small angles for elegance
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}
