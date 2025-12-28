/**
 * ============================================================
 * ADVANCED FEATURES MODULE - وحدة الميزات المتقدمة
 * Version: 1.0
 * ============================================================
 */

// ============================================================
// 3D TILT EFFECT - تأثير الميل ثلاثي الأبعاد
// ============================================================

export const TiltEffect = {
    init(): void {
        document.querySelectorAll('.game-card-item').forEach(card => {
            this.addTiltEffect(card as HTMLElement);
        });
    },

    addTiltEffect(element: HTMLElement): void {
        // Add tilt class and shine element
        element.classList.add('tilt-card');
        const shine = document.createElement('div');
        shine.className = 'tilt-shine';
        element.appendChild(shine);

        element.addEventListener('mousemove', (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = (y - centerY) / 10;
            const tiltY = (centerX - x) / 10;

            element.style.setProperty('--tilt-x', `${tiltX}deg`);
            element.style.setProperty('--tilt-y', `${tiltY}deg`);

            // Update shine position
            shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2) 0%, transparent 50%)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.setProperty('--tilt-x', '0deg');
            element.style.setProperty('--tilt-y', '0deg');
        });
    }
};

// ============================================================
// DIFFICULTY INDICATOR - مؤشر الصعوبة
// ============================================================

export const DifficultyIndicator = {
    difficulties: {
        'flashcards': 'easy',
        'vokaler': 'medium',
        'unblock-me': 'hard',
        'block-puzzle': 'medium',
        'word-search': 'easy',
        'hangman': 'medium',
        'memory': 'easy',
        'word-wheel': 'medium',
        'word-connect': 'hard',
        'fill-blank': 'medium',
        'listening': 'medium',
        'grammar': 'hard',
        'missing-word': 'medium',
        'spelling': 'hard',
        'sentence-builder': 'hard',
        'word-rain': 'medium',
        'wordle': 'hard',
        'pronunciation': 'hard'
    } as Record<string, string>,

    labels: {
        'easy': { sv: 'Lätt', ar: 'سهل' },
        'medium': { sv: 'Medel', ar: 'متوسط' },
        'hard': { sv: 'Svårt', ar: 'صعب' }
    } as Record<string, { sv: string; ar: string }>,

    init(): void {
        document.querySelectorAll('.game-card-item').forEach(card => {
            const gameId = card.getAttribute('data-game-id');
            if (gameId && this.difficulties[gameId]) {
                this.addBadge(card as HTMLElement, this.difficulties[gameId]);
            }
        });
    },

    addBadge(card: HTMLElement, difficulty: string): void {
        const existing = card.querySelector('.difficulty-badge');
        if (existing) return;

        const badge = document.createElement('span');
        badge.className = `difficulty-badge difficulty-${difficulty}`;
        badge.textContent = this.labels[difficulty]?.sv || difficulty;
        card.appendChild(badge);
    }
};

// ============================================================
// LAST PLAYED BADGE - شارة آخر لعبة
// ============================================================

export const LastPlayedBadge = {
    init(): void {
        const lastPlayed = localStorage.getItem('lastPlayedGame');
        if (!lastPlayed) return;

        const data = JSON.parse(lastPlayed);
        const card = document.querySelector(`[data-game-id="${data.gameId}"]`);

        if (card) {
            this.addBadge(card as HTMLElement);
        }
    },

    addBadge(card: HTMLElement): void {
        const existing = card.querySelector('.last-played-badge');
        if (existing) return;

        const badge = document.createElement('div');
        badge.className = 'last-played-badge';
        badge.innerHTML = `
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            Senast
        `;
        card.appendChild(badge);
    },

    recordPlay(gameId: string): void {
        localStorage.setItem('lastPlayedGame', JSON.stringify({
            gameId,
            timestamp: Date.now()
        }));
    }
};

// ============================================================
// RECOMMENDATION STARS - نجوم التوصية
// ============================================================

export const RecommendationStars = {
    recommendations: {
        'memory': 5,
        'flashcards': 5,
        'grammar': 4,
        'vokaler': 5,
        'word-connect': 4,
        'hangman': 4,
        'fill-blank': 3,
        'listening': 4,
        'word-wheel': 3,
        'wordle': 3,
        'pronunciation': 4,
        'spelling': 3,
        'sentence-builder': 3,
        'word-rain': 4,
        'missing-word': 3,
        'unblock-me': 2,
        'block-puzzle': 2,
        'word-search': 3
    } as Record<string, number>,

    init(): void {
        document.querySelectorAll('.game-card-item').forEach(card => {
            const gameId = card.getAttribute('data-game-id');
            if (gameId && this.recommendations[gameId]) {
                this.addStars(card as HTMLElement, this.recommendations[gameId]);
            }
        });
    },

    addStars(card: HTMLElement, rating: number): void {
        const existing = card.querySelector('.recommendation-stars');
        if (existing) return;

        const container = document.createElement('div');
        container.className = 'recommendation-stars';

        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('svg');
            star.className = `recommendation-star ${i > rating ? 'empty' : ''}`;
            star.setAttribute('viewBox', '0 0 24 24');
            star.innerHTML = '<path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>';
            container.appendChild(star);
        }

        // Find the high-score element and insert after it
        const highScore = card.querySelector('.high-score, .game-stars');
        if (highScore) {
            highScore.parentNode?.insertBefore(container, highScore.nextSibling);
        } else {
            card.appendChild(container);
        }
    }
};

// ============================================================
// PARTICLE BACKGROUND - خلفية الجزيئات
// ============================================================

export const ParticleBackground = {
    init(): void {
        const existing = document.querySelector('.particles-container');
        if (existing) return;

        const container = document.createElement('div');
        container.className = 'particles-container';

        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.left = `${Math.random() * 100}%`;
            container.appendChild(particle);
        }

        document.body.insertBefore(container, document.body.firstChild);
    }
};

// ============================================================
// LIVE PLAYERS COUNTER - عداد اللاعبين المباشر
// ============================================================

export const LivePlayersCounter = {
    baseCount: 12,

    init(): void {
        const container = document.querySelector('.games-container');
        if (!container) return;

        const existing = document.querySelector('.live-players-widget');
        if (existing) return;

        const widget = this.createWidget();
        const xpWidget = document.getElementById('xpWidget');
        if (xpWidget && xpWidget.nextSibling) {
            container.insertBefore(widget, xpWidget.nextSibling);
        } else {
            const header = document.querySelector('.games-header');
            if (header && header.nextSibling) {
                container.insertBefore(widget, header.nextSibling);
            }
        }

        this.startUpdating();
    },

    createWidget(): HTMLElement {
        const count = this.getRandomCount();

        const widget = document.createElement('div');
        widget.className = 'live-players-widget';
        widget.innerHTML = `
            <div class="live-indicator">
                <div class="live-dot"></div>
                <span class="live-count" id="livePlayerCount">${count}</span>
            </div>
            <span class="live-text">spelare online just nu / لاعب متصل الآن</span>
            <div class="live-avatars">
                ${this.createAvatars(Math.min(count, 5))}
            </div>
        `;

        return widget;
    },

    createAvatars(count: number): string {
        const emojis = ['👤', '🧑', '👩', '🧑‍🦱', '👨', '👧', '🧒'];
        let html = '';
        for (let i = 0; i < count; i++) {
            html += `<div class="live-avatar">${emojis[i % emojis.length]}</div>`;
        }
        return html;
    },

    getRandomCount(): number {
        return this.baseCount + Math.floor(Math.random() * 20);
    },

    startUpdating(): void {
        setInterval(() => {
            const countEl = document.getElementById('livePlayerCount');
            if (countEl) {
                const newCount = this.getRandomCount();
                countEl.textContent = String(newCount);
            }
        }, 15000);
    }
};

// ============================================================
// MOTIVATIONAL QUOTES - اقتباسات تحفيزية
// ============================================================

export const MotivationalQuotes = {
    quotes: [
        { text: "Varje ord du lär dig är ett steg närmare fluency.", author: "SnabbaLexin", textAr: "كل كلمة تتعلمها هي خطوة نحو الطلاقة." },
        { text: "Övning ger färdighet. Fortsätt träna!", author: "Svenskt ordspråk", textAr: "الممارسة تصنع الكمال. استمر في التدريب!" },
        { text: "Att lära sig ett nytt språk är att öppna en ny dörr.", author: "Frank Smith", textAr: "تعلم لغة جديدة هو فتح باب جديد." },
        { text: "Din streak visar ditt engagemang. Imponerande!", author: "SnabbaLexin", textAr: "سلسلتك تظهر التزامك. مثير للإعجاب!" },
        { text: "Små framsteg varje dag leder till stora resultat.", author: "Kinesiskt ordspråk", textAr: "التقدم الصغير كل يوم يؤدي إلى نتائج كبيرة." },
        { text: "Du är en stjärna! Fortsätt lysa.", author: "SnabbaLexin", textAr: "أنت نجم! استمر في التألق." },
        { text: "Misstag är bevis på att du försöker.", author: "Okänd", textAr: "الأخطاء دليل على أنك تحاول." },
        { text: "Språket är nyckeln till en annan kultur.", author: "Rita Mae Brown", textAr: "اللغة هي مفتاح ثقافة أخرى." }
    ],

    currentIndex: 0,

    init(): void {
        const container = document.querySelector('.games-container');
        if (!container) return;

        const existing = document.querySelector('.quote-widget');
        if (existing) return;

        this.currentIndex = Math.floor(Math.random() * this.quotes.length);
        const widget = this.createWidget();

        const liveWidget = document.querySelector('.live-players-widget');
        if (liveWidget && liveWidget.nextSibling) {
            container.insertBefore(widget, liveWidget.nextSibling);
        } else {
            const statsHero = document.querySelector('.stats-hero');
            if (statsHero) {
                container.insertBefore(widget, statsHero);
            }
        }
    },

    createWidget(): HTMLElement {
        const quote = this.quotes[this.currentIndex];

        const widget = document.createElement('div');
        widget.className = 'quote-widget';
        widget.innerHTML = `
            <span class="quote-icon">"</span>
            <p class="quote-text" id="quoteText">${quote.text}</p>
            <p class="quote-author" id="quoteAuthor">— ${quote.author}</p>
            <button class="quote-refresh" id="quoteRefresh" title="Nytt citat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
            </button>
        `;

        widget.querySelector('#quoteRefresh')?.addEventListener('click', () => this.showNext());

        return widget;
    },

    showNext(): void {
        this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
        const quote = this.quotes[this.currentIndex];

        const textEl = document.getElementById('quoteText');
        const authorEl = document.getElementById('quoteAuthor');

        if (textEl && authorEl) {
            textEl.style.opacity = '0';
            authorEl.style.opacity = '0';

            setTimeout(() => {
                textEl.textContent = quote.text;
                authorEl.textContent = `— ${quote.author}`;
                textEl.style.opacity = '1';
                authorEl.style.opacity = '1';
            }, 200);
        }
    }
};

// ============================================================
// PROGRESS CHARTS DASHBOARD - لوحة الرسوم البيانية
// ============================================================

export const ProgressDashboard = {
    init(): void {
        const leaderboardSection = document.querySelector('.leaderboard-section');
        if (!leaderboardSection) return;

        const existing = document.querySelector('.progress-dashboard');
        if (existing) return;

        const dashboard = this.createDashboard();
        leaderboardSection.insertBefore(dashboard, leaderboardSection.firstChild);
    },

    createDashboard(): HTMLElement {
        const stats = this.getWeeklyStats();

        const dashboard = document.createElement('div');
        dashboard.className = 'progress-dashboard';
        dashboard.innerHTML = `
            <div class="dashboard-header">
                <h3 class="dashboard-title">📊 Din Vecka / أسبوعك</h3>
                <span class="dashboard-period">Senaste 7 dagar</span>
            </div>
            
            <div class="bar-chart" id="weeklyChart">
                ${this.createBarChart(stats.daily)}
            </div>
            
            <div class="skill-grid">
                ${this.createSkillItems(stats.skills)}
            </div>
        `;

        return dashboard;
    },

    getWeeklyStats(): { daily: number[]; skills: Record<string, number> } {
        // Simulated data - in real app would come from localStorage
        const saved = localStorage.getItem('weeklyStats');
        if (saved) {
            return JSON.parse(saved);
        }

        return {
            daily: [3, 5, 2, 7, 4, 6, 8],
            skills: {
                vocab: 75,
                grammar: 45,
                listening: 60,
                puzzle: 30
            }
        };
    },

    createBarChart(data: number[]): string {
        const days = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];
        const maxValue = Math.max(...data, 1);

        return data.map((value, i) => `
            <div class="bar-item">
                <div class="bar" style="height: ${(value / maxValue) * 100}px;" data-value="${value}"></div>
                <span class="bar-label">${days[i]}</span>
            </div>
        `).join('');
    },

    createSkillItems(skills: Record<string, number>): string {
        const skillInfo: Record<string, { name: string; icon: string }> = {
            vocab: { name: 'Ordförråd', icon: '📚' },
            grammar: { name: 'Grammatik', icon: '📖' },
            listening: { name: 'Lyssna', icon: '👂' },
            puzzle: { name: 'Pussel', icon: '🧩' }
        };

        return Object.entries(skills).map(([key, value]) => `
            <div class="skill-item">
                <div class="skill-icon" style="background: rgba(99, 102, 241, 0.2);">
                    ${skillInfo[key]?.icon || '📊'}
                </div>
                <div class="skill-info">
                    <div class="skill-name">${skillInfo[key]?.name || key}</div>
                    <div class="skill-bar-bg">
                        <div class="skill-bar-fill ${key}" style="width: ${value}%;"></div>
                    </div>
                </div>
            </div>
        `).join('');
    }
};

// ============================================================
// BREAK REMINDER - تذكير بالراحة
// ============================================================

export const BreakReminder = {
    intervalMinutes: 30,
    timer: null as ReturnType<typeof setTimeout> | null,
    startTime: 0,

    init(): void {
        this.startTime = Date.now();
        this.scheduleReminder();
    },

    scheduleReminder(): void {
        if (this.timer) clearTimeout(this.timer);

        this.timer = setTimeout(() => {
            this.showReminder();
        }, this.intervalMinutes * 60 * 1000);
    },

    showReminder(): void {
        const overlay = document.createElement('div');
        overlay.className = 'break-reminder-overlay';
        overlay.id = 'breakReminder';
        overlay.innerHTML = `
            <div class="break-reminder-content">
                <div class="break-icon">☕</div>
                <h2 class="break-title">Dags för en paus! / وقت الراحة!</h2>
                <p class="break-message">
                    Du har spelat i ${this.intervalMinutes} minuter. 
                    Ta en kort paus för att vila ögonen.
                </p>
                <div class="break-timer" id="breakTimer">05:00</div>
                <div class="break-actions">
                    <button class="break-btn break-btn-primary" id="startBreak">Starta paus</button>
                    <button class="break-btn break-btn-secondary" id="skipBreak">Hoppa över</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        document.getElementById('startBreak')?.addEventListener('click', () => {
            this.startBreakTimer();
        });

        document.getElementById('skipBreak')?.addEventListener('click', () => {
            this.dismiss();
        });
    },

    startBreakTimer(): void {
        let seconds = 300; // 5 minutes
        const timerEl = document.getElementById('breakTimer');

        const interval = setInterval(() => {
            seconds--;
            if (timerEl) {
                const mins = Math.floor(seconds / 60);
                const secs = seconds % 60;
                timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }

            if (seconds <= 0) {
                clearInterval(interval);
                this.dismiss();

                // Show completion message
                if (typeof (window as any).showToast === 'function') {
                    (window as any).showToast('☕ Paus klar! Bra jobbat!', 'success');
                }
            }
        }, 1000);
    },

    dismiss(): void {
        const overlay = document.getElementById('breakReminder');
        if (overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => overlay.remove(), 300);
        }
        this.scheduleReminder();
    }
};

// ============================================================
// EYE CARE MODE - وضع حماية العين
// ============================================================

export const EyeCareMode = {
    isActive: false,

    init(): void {
        this.isActive = localStorage.getItem('eyeCareMode') === 'true';
        if (this.isActive) {
            document.body.classList.add('eye-care-mode');
        }
        // Button creation now handled by unified FAB menu
        // this.createToggle();
    },

    createToggle(): void {
        const existing = document.querySelector('.eye-care-toggle');
        if (existing) return;

        const toggle = document.createElement('button');
        toggle.className = 'eye-care-toggle';
        toggle.title = 'Eye Care Mode';
        toggle.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `;

        toggle.addEventListener('click', () => this.toggle());
        document.body.appendChild(toggle);
    },

    toggle(): void {
        this.isActive = !this.isActive;
        document.body.classList.toggle('eye-care-mode', this.isActive);
        localStorage.setItem('eyeCareMode', String(this.isActive));

        if (typeof (window as any).showToast === 'function') {
            (window as any).showToast(
                this.isActive ? '👁️ Eye Care aktiverat' : '👁️ Eye Care avaktiverat',
                'info'
            );
        }
    }
};

// ============================================================
// GAME MASCOT - شخصية اللعبة
// ============================================================

export const GameMascot = {
    messages: [
        'Lycka till! 🍀',
        'Du klarar det! 💪',
        'Fortsätt så! 🌟',
        'Imponerande! 👏',
        'Bra jobbat! 🎉',
        'Du är grym! 🔥'
    ],

    init(): void {
        // Mascot functionality now handled by unified FAB menu
        // const existing = document.querySelector('.game-mascot');
        // if (existing) return;
        // ... mascot creation code disabled
    },

    getRandomMessage(): string {
        return this.messages[Math.floor(Math.random() * this.messages.length)];
    },

    speak(): void {
        const speech = document.getElementById('mascotSpeech');
        if (speech) {
            speech.textContent = this.getRandomMessage();
            speech.style.opacity = '1';
            setTimeout(() => {
                speech.style.opacity = '0';
            }, 2000);
        }

        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    }
};

// ============================================================
// WEEKLY LEADERBOARD - لوحة المتصدرين
// ============================================================

export const WeeklyLeaderboard = {
    players: [
        { name: 'Erik S.', score: 2450, emoji: '🧑' },
        { name: 'Sara A.', score: 2180, emoji: '👩' },
        { name: 'Mohammed K.', score: 1950, emoji: '🧔' },
        { name: 'Lisa N.', score: 1820, emoji: '👧' },
        { name: 'Du', score: 0, emoji: '⭐', isCurrentUser: true }
    ],

    init(): void {
        const leaderboardSection = document.querySelector('.leaderboard-section');
        if (!leaderboardSection) return;

        const existing = document.querySelector('.leaderboard-widget');
        if (existing) return;

        // Get user's score from progress
        const userScore = this.getUserScore();
        this.players[4].score = userScore;

        // Sort by score
        this.players.sort((a, b) => b.score - a.score);

        const widget = this.createWidget();
        leaderboardSection.appendChild(widget);
    },

    getUserScore(): number {
        const progress = localStorage.getItem('userProgress');
        if (progress) {
            return JSON.parse(progress).totalScore || 0;
        }
        return 0;
    },

    createWidget(): HTMLElement {
        const widget = document.createElement('div');
        widget.className = 'leaderboard-widget';
        widget.innerHTML = `
            <div class="leaderboard-header">
                <h3 class="leaderboard-title">🏆 Veckans Topplista</h3>
            </div>
            ${this.players.slice(0, 5).map((player, index) => `
                <div class="leaderboard-entry ${player.isCurrentUser ? 'current-user' : ''}">
                    <div class="leaderboard-rank ${index < 3 ? 'rank-' + (index + 1) : 'rank-other'}">
                        ${index + 1}
                    </div>
                    <div class="leaderboard-avatar">${player.emoji}</div>
                    <span class="leaderboard-name">${player.name}</span>
                    <span class="leaderboard-score">${player.score}</span>
                </div>
            `).join('')}
        `;

        return widget;
    }
};

// ============================================================
// AI RECOMMENDATIONS - توصيات ذكية
// ============================================================

export const AIRecommendations = {
    recommendations: [
        { game: 'memory', reason: 'Bra för att träna minnet', reasonAr: 'جيد لتدريب الذاكرة' },
        { game: 'grammar', reason: 'Förbättra din grammatik', reasonAr: 'حسّن قواعدك' },
        { game: 'listening', reason: 'Träna hörförståelse', reasonAr: 'درب مهارة الاستماع' },
        { game: 'vokaler', reason: 'Lär dig svenska ljud', reasonAr: 'تعلم الأصوات السويدية' }
    ],

    init(): void {
        const container = document.querySelector('.games-container');
        if (!container) return;

        const existing = document.querySelector('.ai-recommendation');
        if (existing) return;

        const recommendation = this.getRecommendation();
        const widget = this.createWidget(recommendation);

        const categoryFilter = document.querySelector('.category-filter-container');
        if (categoryFilter) {
            container.insertBefore(widget, categoryFilter.nextSibling);
        }
    },

    getRecommendation(): { game: string; reason: string; reasonAr: string } {
        return this.recommendations[Math.floor(Math.random() * this.recommendations.length)];
    },

    createWidget(rec: { game: string; reason: string }): HTMLElement {
        const widget = document.createElement('div');
        widget.className = 'ai-recommendation';
        widget.innerHTML = `
            <div class="ai-icon">🤖</div>
            <div class="ai-content">
                <div class="ai-label">AI Förslag / اقتراح ذكي</div>
                <div class="ai-message">${rec.reason}</div>
            </div>
            <svg class="ai-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        `;

        widget.addEventListener('click', () => {
            const card = document.querySelector(`[data-game-id="${rec.game}"]`);
            if (card) {
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                (card as HTMLElement).style.animation = 'pulse 0.5s ease';
            }
        });

        return widget;
    }
};

// ============================================================
// BOUNCE ON SCROLL - ارتداد عند التمرير
// ============================================================

export const BounceOnScroll = {
    init(): void {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('bounce-scroll');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.game-card-item').forEach(card => {
            observer.observe(card);
        });
    }
};

// ============================================================
// AUTO INITIALIZATION - التهيئة التلقائية
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        // Phase 1: Card Improvements
        TiltEffect.init();
        DifficultyIndicator.init();
        LastPlayedBadge.init();
        RecommendationStars.init();

        // Phase 2: Visual Enhancements
        ParticleBackground.init();
        GameMascot.init();

        // Phase 3: Engagement Features
        // LivePlayersCounter.init();
        // MotivationalQuotes.init();
        WeeklyLeaderboard.init();
        AIRecommendations.init();

        // Phase 4: Wellness Features
        BreakReminder.init();
        EyeCareMode.init();

        // Phase 5: Smart Features
        ProgressDashboard.init();

        // Phase 6: Micro-interactions
        BounceOnScroll.init();
    }, 800);
});

// Global exports
if (typeof window !== 'undefined') {
    (window as any).TiltEffect = TiltEffect;
    (window as any).DifficultyIndicator = DifficultyIndicator;
    (window as any).LastPlayedBadge = LastPlayedBadge;
    (window as any).RecommendationStars = RecommendationStars;
    (window as any).ParticleBackground = ParticleBackground;
    (window as any).LivePlayersCounter = LivePlayersCounter;
    (window as any).MotivationalQuotes = MotivationalQuotes;
    (window as any).ProgressDashboard = ProgressDashboard;
    (window as any).BreakReminder = BreakReminder;
    (window as any).EyeCareMode = EyeCareMode;
    (window as any).GameMascot = GameMascot;
    (window as any).WeeklyLeaderboard = WeeklyLeaderboard;
    (window as any).AIRecommendations = AIRecommendations;
}
