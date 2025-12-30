
export function initProfileUI(): void {
    console.log('[ProfileUI] Initializing...');
    loadProfileStats();
    renderAchievements();
    createParticles();
}

function loadProfileStats(): void {
    // Load state from localStorage
    const currentXP = parseInt(localStorage.getItem('learn_xp') || '0');
    const level = parseInt(localStorage.getItem('learn_level') || '1');
    const streak = parseInt(localStorage.getItem('learn_streak') || '0');
    // Assuming 'words' stat isn't tracked yet, defaulting to 0 or XP/10
    const words = Math.floor(currentXP / 10);

    // Update Stats Grid
    updateElement('xpValue', currentXP.toString());
    updateElement('streakValue', streak.toString());
    updateElement('wordsValue', words.toString());

    // Update Header Info
    const levelName = getLevelName(level);
    const userLevelEl = document.getElementById('userLevel');
    if (userLevelEl) {
        userLevelEl.innerHTML = `🌟 <span class="sv-text">Nivå ${level} - ${levelName.sv}</span><span class="ar-text">المستوى ${level} - ${levelName.ar}</span>`;
    }
}

function getLevelName(level: number): { sv: string, ar: string } {
    if (level < 5) return { sv: 'Nybörjare', ar: 'مبتدئ' };
    if (level < 10) return { sv: 'Lärling', ar: 'متعلم' };
    if (level < 20) return { sv: 'Expert', ar: 'خبير' };
    return { sv: 'Mästare', ar: 'محترف' };
}

function renderAchievements(): void {
    const grid = document.getElementById('achievementsGrid');
    const countEl = document.getElementById('achievementCount');
    if (!grid) return;

    // Determine unlocked badges
    const currentXP = parseInt(localStorage.getItem('learn_xp') || '0');
    const streak = parseInt(localStorage.getItem('learn_streak') || '0');
    const level = parseInt(localStorage.getItem('learn_level') || '1');

    const badges = [
        { icon: '🚀', name: { sv: 'Nykomling', ar: 'بداية موفقة' }, condition: currentXP > 0 },
        { icon: '⚡', name: { sv: 'Snabb', ar: 'سريع' }, condition: streak >= 3 },
        { icon: '🧠', name: { sv: 'Genius', ar: 'عبقري' }, condition: level >= 5 },
        { icon: '🔥', name: { sv: 'On Fire', ar: 'حماس' }, condition: streak >= 7 },
        { icon: '🏆', name: { sv: 'Champion', ar: 'بطل' }, condition: level >= 10 },
        { icon: '📚', name: { sv: 'Bokmask', ar: 'دودة كتب' }, condition: currentXP >= 500 }
    ];

    const unlockedCount = badges.filter(b => b.condition).length;
    if (countEl) countEl.textContent = `(${unlockedCount}/${badges.length})`;

    grid.innerHTML = badges.map(badge => `
        <div class="achievement-card ${badge.condition ? 'unlocked' : ''}">
            <div class="achievement-icon">${badge.icon}</div>
            <div class="achievement-name">
                <span class="sv-text">${badge.name.sv}</span>
                <span class="ar-text">${badge.name.ar}</span>
            </div>
        </div>
    `).join('');
}

function updateElement(id: string, text: string): void {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

// Background particles specific for profile
function createParticles() {
    // If we want particles on this page, ensure container exists
    let container = document.getElementById('particlesContainer');
    if (!container) {
        // Create if missing (root profile might not have it)
        container = document.createElement('div');
        container.id = 'particlesContainer';
        container.className = 'particles-container';
        document.body.insertBefore(container, document.body.firstChild);
    }

    const colors = ['#60a5fa', '#34d399', '#fbfb8c'];

    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'learn-particle'; // Reusing learn css class if available
        particle.style.background = colors[i % 3];
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 10 + 5}px`;
        particle.style.height = particle.style.width;
        particle.style.opacity = '0.1';
        particle.style.position = 'absolute';
        particle.style.borderRadius = '50%';
        particle.style.animation = `float ${10 + Math.random() * 10}s infinite linear`;

        container.appendChild(particle);
    }
}
