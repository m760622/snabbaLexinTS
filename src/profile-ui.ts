import { TextSizeManager } from './utils';
/**
 * UI Logic for the Profile section
 */
export function initProfileUI() {
    console.log('[ProfileUI] Initializing...');
    
    applyTheme();
    loadStats();
    renderWeeklyChart();
    renderLeaderboard();
    renderAchievements();

    // Export to window for potential legacy hooks (though not strictly needed here)
    (window as any).loadStats = loadStats;
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function loadStats() {
    const learningStats = JSON.parse(localStorage.getItem('learningStats') || '{"streak": 0, "totalXP": 0}');
    const gamesStats = JSON.parse(localStorage.getItem('gamesStats') || '{"totalScore": 0}');
    const progressData = JSON.parse(localStorage.getItem('progressData') || '{"uniqueWords": 0}');

    const streakEl = document.getElementById('streakValue');
    const wordsEl = document.getElementById('wordsValue');
    const xpEl = document.getElementById('xpValue');
    const levelEl = document.getElementById('userLevel');

    if (streakEl) streakEl.textContent = (learningStats.streak || 0).toString();
    if (wordsEl) wordsEl.textContent = (progressData.uniqueWords || 0).toString();
    
    const totalXP = (learningStats.totalXP || 0) + (gamesStats.totalScore || 0);
    if (xpEl) xpEl.textContent = totalXP.toString();

    // Level calculation
    const level = Math.floor(totalXP / 100) + 1;
    const levelNames = ['Nybörjare', 'Studerande', 'Kunnig', 'Expert', 'Mästare'];
    const levelName = levelNames[Math.min(level - 1, levelNames.length - 1)];
    const levelLabel = `🌟 Nivå ${level} - ${levelName}`;
    if (levelEl) {
        levelEl.textContent = levelLabel;
        TextSizeManager.apply(levelEl, levelLabel);
    }
}

function renderWeeklyChart() {
    const chart = document.getElementById('weeklyChart');
    if (!chart) return;
    
    const weekData = JSON.parse(localStorage.getItem('weeklyActivity') || '[]');
    const data = weekData.length === 7 ? weekData : [3, 7, 5, 8, 4, 2, 6];
    const maxVal = Math.max(...data, 1);

    chart.innerHTML = data.map((val: number) => {
        const height = (val / maxVal) * 100;
        return `<div class="chart-bar" style="height: ${Math.max(height, 5)}%;" data-value="${val}"></div>`;
    }).join('');
}

function renderLeaderboard() {
    const container = document.getElementById('leaderboard');
    if (!container) return;
    
    const xpValueEl = document.getElementById('xpValue');
    const myXP = xpValueEl ? parseInt(xpValueEl.textContent || '0') : 0;

    const leaders = [
        { name: 'Ahmad', score: 2450, isYou: false },
        { name: 'Sara', score: 1890, isYou: false },
        { name: 'Mohammed', score: 1650, isYou: false },
        { name: 'Du / أنت', score: myXP, isYou: true },
        { name: 'Emma', score: Math.max(myXP - 50, 0), isYou: false }
    ].sort((a, b) => b.score - a.score);

    container.innerHTML = leaders.slice(0, 5).map((user, i) => {
        const rankClasses = ['gold', 'silver', 'bronze', 'other', 'other'];
        return `
            <div class="leaderboard-item ${user.isYou ? 'you' : ''}">
                <div class="rank ${rankClasses[i]}">${i + 1}</div>
                <div class="leaderboard-name">${user.name}</div>
                <div class="leaderboard-score">${user.score} XP</div>
            </div>`;
    }).join('');

    // Apply sizing to leaderboard names
    container.querySelectorAll('.leaderboard-name').forEach(el => {
        TextSizeManager.apply(el as HTMLElement, el.textContent || '');
    });
}

function renderAchievements() {
    const container = document.getElementById('achievementsGrid');
    if (!container) return;
    
    const unlockedSet = new Set(JSON.parse(localStorage.getItem('unlockedAchievements') || '[]'));

    const achievements = [
        { id: 'first_word', icon: '📖', name: 'Första ordet' },
        { id: 'streak_3', icon: '🔥', name: '3 dagar' },
        { id: 'streak_7', icon: '🏆', name: '7 dagar' },
        { id: 'words_50', icon: '📚', name: '50 ord' },
        { id: 'words_100', icon: '💯', name: '100 ord' },
        { id: 'game_first', icon: '🎮', name: 'Första spelet' },
        { id: 'quiz_perfect', icon: '⭐', name: '100% quiz' },
        { id: 'lesson_5', icon: '📝', name: '5 lektioner' },
        { id: 'cognates_50', icon: '🔤', name: '50 liknande' },
        { id: 'daily_3', icon: '🏅', name: '3 utmaningar' },
        { id: 'flashcard_100', icon: '🃏', name: '100 kort' },
        { id: 'master', icon: '👑', name: 'Mästare' }
    ];

    let unlockedCount = 0;
    container.innerHTML = achievements.map(a => {
        const isUnlocked = unlockedSet.has(a.id);
        if (isUnlocked) unlockedCount++;
        return `
            <div class="achievement ${isUnlocked ? 'unlocked' : ''}">
                <span class="achievement-icon">${a.icon}</span>
                <span class="achievement-name">${a.name}</span>
            </div>`;
    }).join('');

    const countEl = document.getElementById('achievementCount');
    if (countEl) countEl.textContent = `(${unlockedCount}/${achievements.length})`;

    // Apply sizing to achievement names
    container.querySelectorAll('.achievement-name').forEach(el => {
        TextSizeManager.apply(el as HTMLElement, el.textContent || '');
    });
}
