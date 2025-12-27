import './loader';
import './utils';
import './quiz';
import './confetti';
import { ThemeManager, GrammarHelper, CategoryHelper, showToast, TextSizeManager, VoiceSearchManager } from './utils';
import { FavoritesManager } from './favorites';
import { QuizStats } from './quiz-stats';
import { initMainUI } from './main-ui';
import { LanguageManager, t } from './i18n';
import './i18n-apply';

/**
 * Main SnabbaLexin Application
 */

export class App {
    private isLoading = true;
    private searchIndex: string[] = [];
    private currentResults: any[][] = [];
    private readonly BATCH_SIZE = 20;
    private renderedCount = 0;
    // Filter states
    private activeFilterMode = 'all';
    private activeTypeFilter = 'all';
    private activeSortMethod = 'relevance';

    constructor() {
        this.init();
    }

    private async init() {
        // Initialize language first to apply correct classes
        LanguageManager.init();

        initMainUI();
        this.initStreaks();
        this.setupSearchListeners();
        this.setupThemeListener();
        this.initQuickActions();
        this.setupInfiniteScroll();
        this.setupGlobalHandlers();
        this.setupFilters();
        this.setupVoiceSearch();
        this.setupVoiceSelection();
        this.updateDailyChallenge(); // Initial update
        this.updateDailyProgressBar(); // Update daily progress bar

        // Initial search from URL parameter 's'
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get('s');
        if (searchQuery) {
            const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
            if (searchInput) searchInput.value = searchQuery;
        }

        window.addEventListener('dictionaryLoaded', () => {
            console.log('[App] Data loaded event received');
            this.handleDataLoaded();
        });

        // Fallback for immediate data availability
        if ((window as any).dictionaryData && (window as any).dictionaryData.length > 0) {
            this.handleDataLoaded();
        }
    }

    private initStreaks() {
        const lastVisitKey = 'lastVisitDate';
        const streakKey = 'dailyStreak';
        const today = new Date().toISOString().split('T')[0];
        const lastVisit = localStorage.getItem(lastVisitKey);
        let streak = parseInt(localStorage.getItem(streakKey) || '0');

        if (lastVisit !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayStr = yesterday.toISOString().split('T')[0];
            if (lastVisit === yesterdayStr) streak++;
            else streak = 1;

            localStorage.setItem(lastVisitKey, today);
            localStorage.setItem(streakKey, streak.toString());
        }

        const streakEl = document.getElementById('currentStreak');
        if (streakEl) {
            streakEl.innerHTML = streak.toString();
            // The 🔥 icon is handled in the template or should be added if needed, 
            // but currentStreak in index.html is just the number span.
        }
    }

    private setupThemeListener() {
        const themeBtn = document.getElementById('themeToggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                ThemeManager.toggle();
            });
        }
    }

    private setupSearchListeners() {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => this.handleSearch(e));

        const clearSearch = document.getElementById('clearSearch');
        searchInput.addEventListener('input', () => {
            if (clearSearch) clearSearch.style.display = searchInput.value.length > 0 ? 'flex' : 'none';
        });

        if (clearSearch) {
            clearSearch.addEventListener('click', () => {
                searchInput.value = '';
                clearSearch.style.display = 'none';
                this.performSearch('');
            });
        }
    }

    private setupFilters() {
        const modeSelect = document.getElementById('filterModeSelect') as HTMLSelectElement | null;
        const typeSelect = document.getElementById('typeSelect') as HTMLSelectElement | null;
        const sortSelect = document.getElementById('sortSelect') as HTMLSelectElement | null;
        const categorySelect = document.getElementById('categorySelect') as HTMLSelectElement | null;
        const quickFavBtn = document.getElementById('quickFavBtn');

        const updateFilters = () => {
            if (modeSelect) this.activeFilterMode = modeSelect.value;
            if (typeSelect) this.activeTypeFilter = typeSelect.value;
            if (sortSelect) this.activeSortMethod = sortSelect.value;

            const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
            this.performSearch(searchInput?.value || '');
        };

        if (modeSelect) modeSelect.addEventListener('change', updateFilters);
        if (typeSelect) typeSelect.addEventListener('change', updateFilters);
        if (sortSelect) sortSelect.addEventListener('change', updateFilters);
        if (categorySelect) categorySelect.addEventListener('change', updateFilters);

        if (quickFavBtn) {
            quickFavBtn.addEventListener('click', () => {
                if (modeSelect) {
                    modeSelect.value = modeSelect.value === 'favorites' ? 'all' : 'favorites';
                    updateFilters();
                }
            });
        }

        const filterToggleBtn = document.getElementById('filterToggleBtn');
        const filterContainer = document.getElementById('filterChipsContainer');
        if (filterToggleBtn && filterContainer) {
            filterToggleBtn.addEventListener('click', () => {
                filterContainer.classList.toggle('hidden');
                filterToggleBtn.classList.toggle('active');
            });
        }
    }

    private handleDataLoaded() {
        if (!this.isLoading) return;
        this.isLoading = false;
        console.log('[App] Initializing dictionary visual data...');
        this.loadDictionaryData();
    }

    private loadDictionaryData() {
        const data = (window as any).dictionaryData as any[][];
        if (!data) return;
        // Optimization: search index
        this.searchIndex = data.map(row => `${row[2]} ${row[3]}`.toLowerCase());

        // Initialize Word of the Day
        this.initWordOfTheDay();

        // Initial state: hide results, show landing page, OR perform initial search
        const params = new URLSearchParams(window.location.search);
        const searchQuery = params.get('s');
        this.performSearch(searchQuery || '');
    }

    private initWordOfTheDay() {
        const data = (window as any).dictionaryData as any[][];
        if (!data || data.length === 0) return;

        // Try to find a word with long example or idiom
        let word = null;
        let attempts = 0;
        while (attempts < 500) {
            const idx = Math.floor(Math.random() * data.length);
            const w = data[idx];
            const hasIdiom = (w[9] && w[9].length > 0) || (w[10] && w[10].length > 0);
            const hasExample = w[7] && w[7].split(' ').length > 5;

            if (hasIdiom || hasExample) {
                word = w;
                break;
            }
            attempts++;
        }
        if (!word) word = data[Math.floor(Math.random() * data.length)];

        // Record as studied
        QuizStats.recordStudy(word[0].toString());

        this.renderWod(word);
    }

    private renderWod(word: any[]) {
        const wodCard = document.getElementById('wordOfTheDay');
        if (!wodCard) return;

        wodCard.classList.remove('hidden');

        const swe = wodCard.querySelector('.wod-swe');
        const arb = wodCard.querySelector('.wod-arb');
        const typeBadge = wodCard.querySelector('.wod-type-badge');

        if (swe) {
            swe.textContent = word[2];
            TextSizeManager.apply(swe as HTMLElement, word[2]);
        }
        if (arb) {
            arb.textContent = word[3];
            TextSizeManager.apply(arb as HTMLElement, word[3]);
        }
        if (typeBadge) typeBadge.textContent = word[1];

        // Toggle sections based on data
        // User Request: Show only Swedish, Arabic, and Type. Hide all other details.
        const sectionsToHide = [
            '.wod-forms-preview',
            '.wod-def-preview',
            '.wod-example-preview',
            '.wod-example-arb-preview',
            '.wod-idiom-preview'
        ];

        sectionsToHide.forEach(selector => {
            const el = wodCard.querySelector(selector) as HTMLElement;
            if (el) el.classList.add('hidden');
        });

        // Setup individual WOD buttons
        const ttsBtn = document.getElementById('wodTTSBtn');
        if (ttsBtn) {
            ttsBtn.onclick = () => (window as any).TTSManager?.speak(word[2], 'sv');
        }

        const detailsBtn = document.getElementById('wodDetailsBtn');
        if (detailsBtn) {
            detailsBtn.onclick = () => window.location.href = `details.html?id=${word[0]}`;
        }

        const loopBtn = document.getElementById('wodLoopBtn');
        if (loopBtn) {
            loopBtn.onclick = () => this.initWordOfTheDay();
        }

        // Favorite button for Word of the Day
        const favBtn = document.getElementById('wodFavBtn');
        if (favBtn) {
            const wordId = word[0].toString();
            const isFav = FavoritesManager.has(wordId);
            FavoritesManager.updateButtonIcon(favBtn, isFav);
            favBtn.onclick = () => {
                const nowFav = FavoritesManager.toggle(wordId);
                FavoritesManager.updateButtonIcon(favBtn, nowFav);
            };
        }
    }

    private initQuickActions() {
        const quickWodBtn = document.getElementById('quickWodBtn');
        if (quickWodBtn) {
            quickWodBtn.addEventListener('click', () => {
                const wodCard = document.getElementById('wordOfTheDay');
                if (wodCard) {
                    wodCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    wodCard.classList.add('pulse-animation');
                    setTimeout(() => wodCard.classList.remove('pulse-animation'), 500);
                }
            });
        }
    }

    private handleSearch(e: Event) {
        const query = (e.target as HTMLInputElement).value;
        this.performSearch(query);
    }

    private performSearch(query: string) {
        const data = (window as any).dictionaryData as any[][];
        if (!data) return;

        const normalizedQuery = query.toLowerCase().trim();
        const landingPage = document.getElementById('landingPageContent');
        const searchResults = document.getElementById('searchResults');
        const emptyState = document.getElementById('emptyState');

        this.renderedCount = 0; // Reset pagination

        // Apply filters
        let filtered = data;

        // 1. Mode Filter (Favorites, etc)
        if (this.activeFilterMode === 'favorites') {
            filtered = filtered.filter(row => FavoritesManager.has(row[0].toString()));
        }

        // 2. Search Query Filter
        if (normalizedQuery) {
            filtered = filtered.filter((_, i) => this.searchIndex[i].includes(normalizedQuery));
        }

        // 3. Type Filter
        if (this.activeTypeFilter !== 'all') {
            filtered = filtered.filter(row => {
                const cat = CategoryHelper.getCategory(row[1], row[2], row[6]);
                return cat === this.activeTypeFilter;
            });
        }

        // 3.5 Category Filter (Topic)
        const categorySelect = document.getElementById('categorySelect') as HTMLSelectElement | null;
        if (categorySelect && categorySelect.value !== 'all') {
            const topic = categorySelect.value;
            filtered = filtered.filter(row => {
                // Topic matches usually involve checking if the word belongs to a certain set
                // For now we use the word category field if available (row[11] is usually tags/categories in Lexin)
                const tags = (row[11] || '').toLowerCase();
                return tags.includes(topic);
            });
        }

        // 4. Sorting
        if (this.activeSortMethod === 'az' || this.activeSortMethod === 'alpha_asc') {
            filtered = [...filtered].sort((a, b) => a[2].localeCompare(b[2], 'sv'));
        } else if (this.activeSortMethod === 'za' || this.activeSortMethod === 'alpha_desc') {
            filtered = [...filtered].sort((a, b) => b[2].localeCompare(a[2], 'sv'));
        } else if (this.activeSortMethod === 'richness') {
            filtered = [...filtered].sort((a, b) => {
                const aLen = (a[5] || '').length + (a[7] || '').length;
                const bLen = (b[5] || '').length + (b[7] || '').length;
                return bLen - aLen;
            });
        }

        this.currentResults = filtered;

        const showLanding = !normalizedQuery && this.activeFilterMode === 'all';

        if (showLanding) {
            if (landingPage) landingPage.style.display = 'block';
            if (searchResults) {
                searchResults.style.display = 'none';
                searchResults.innerHTML = '';
            }
            if (emptyState) emptyState.style.display = 'block';
        } else {
            if (landingPage) landingPage.style.display = 'none';
            if (searchResults) {
                searchResults.style.display = 'grid';
                searchResults.innerHTML = '';
            }
            if (emptyState) emptyState.style.display = filtered.length === 0 ? 'block' : 'none';
            this.renderNextBatch();
        }

        this.updateResultCount();
    }

    private renderNextBatch() {
        if (this.renderedCount >= this.currentResults.length) return;

        const searchResults = document.getElementById('searchResults');
        if (!searchResults) return;

        const nextBatch = this.currentResults.slice(this.renderedCount, this.renderedCount + this.BATCH_SIZE);
        const html = nextBatch.map(row => this.createCard(row)).join('');

        searchResults.insertAdjacentHTML('beforeend', html);
        this.renderedCount += nextBatch.length;

        // Apply dynamic text sizing to newly rendered cards
        TextSizeManager.autoApply();
    }

    private createCard(row: any[]): string {
        const id = row[0];
        const swe = row[2];
        const arb = row[3];
        const type = row[1];
        const forms = row[6] || '';

        const grammarBadge = GrammarHelper.getBadge(type, forms, swe);
        const category = CategoryHelper.getCategory(type, swe, forms);
        const isFav = FavoritesManager.has(id.toString());

        const starIcon = isFav
            ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

        const copyIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;

        // Optimized: Condense by removing examples/idioms from list view as requested
        return `
            <div class="card card-link compact-card" data-type="${category}" onclick="if(!event.target.closest('button')) window.location.href='details.html?id=${id}'">
                <div class="card-header">
                    <div class="word-header-group">
                        <h2 class="word-swe" dir="ltr" data-auto-size data-max-lines="2">${swe}</h2>
                    </div>
                    <div class="card-actions">
                        ${grammarBadge}
                        <button class="copy-btn action-button" onclick="copyWord('${swe.replace(/'/g, "\\'")}', event)" title="Kopiera">
                            ${copyIcon}
                        </button>
                        <button class="fav-btn action-button ${isFav ? 'active' : ''}" onclick="toggleFavorite('${id}', this, event)" title="Spara">
                            ${starIcon}
                        </button>
                    </div>
                </div>
                <p class="word-arb" dir="rtl" data-auto-size data-max-lines="2">${arb}</p>
            </div>
        `;
    }

    private setupInfiniteScroll() {
        window.addEventListener('scroll', () => {
            if (this.currentResults.length === 0) return;
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            if (scrollTop + clientHeight >= scrollHeight - 300) {
                this.renderNextBatch();
            }
        });
    }

    private setupGlobalHandlers() {
        (window as any).copyWord = (word: string, e: Event) => {
            e.stopPropagation();
            navigator.clipboard.writeText(word).then(() => showToast(t('toast.copied') + ' 📋'));
        };

        (window as any).toggleFavorite = (id: string, btn: HTMLElement, e: Event) => {
            e.stopPropagation();
            const sid = id.toString();
            const isFav = FavoritesManager.toggle(sid);
            btn.classList.toggle('active', isFav);
            btn.innerHTML = isFav
                ? `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`
                : `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
        };
    }

    private updateResultCount() {
        const countEl = document.getElementById('resultCount');
        if (countEl) countEl.textContent = this.currentResults.length.toLocaleString();
    }

    public updateDailyChallenge() {
        const DAILY_GOAL = parseInt(localStorage.getItem('dailyGoal') || '10');
        const todayStats = QuizStats.getTodayStats();
        const totalActivity = todayStats.correct + (todayStats.studied || 0);
        const percent = Math.min(100, (totalActivity / DAILY_GOAL) * 100);

        // Update progress bar
        const progressBar = document.getElementById('challengeProgressBar');
        if (progressBar) {
            progressBar.style.width = `${percent}%`;
            if (totalActivity >= DAILY_GOAL) {
                progressBar.classList.add('completed');
            }
        }

        // Update progress text
        const progressText = document.getElementById('challengeProgressText');
        if (progressText) {
            progressText.textContent = `${totalActivity}/${DAILY_GOAL}`;
            if (totalActivity >= DAILY_GOAL) {
                progressText.classList.add('completed');
            }
        }

        // Update challenge card for completed state
        const card = document.getElementById('dailyChallengeCard');
        if (card && totalActivity >= DAILY_GOAL) {
            card.classList.add('completed');
        }

        console.log(`[App] Daily challenge: ${totalActivity}/${DAILY_GOAL} (${percent.toFixed(0)}%)`);

        // Ensure the general progress bar is also in sync
        this.updateDailyProgressBar();
    }

    public updateDailyProgressBar() {
        const DAILY_GOAL = parseInt(localStorage.getItem('dailyGoal') || '10');
        const todayStats = QuizStats.getTodayStats();
        const totalActivity = todayStats.correct + (todayStats.studied || 0);
        const percent = Math.min(100, (totalActivity / DAILY_GOAL) * 100);

        // Update the daily progress count
        const progressCount = document.getElementById('dailyProgressCount');
        if (progressCount) {
            progressCount.textContent = totalActivity.toString();
        }

        // Update header badge (📖 count)
        const dailyWordsCount = document.getElementById('dailyWordsCount');
        if (dailyWordsCount) {
            dailyWordsCount.textContent = totalActivity.toString();
        }

        // Update the progress bar fill
        const progressFill = document.getElementById('dailyProgressFill');
        if (progressFill) {
            progressFill.style.width = `${percent}%`;
            if (totalActivity >= DAILY_GOAL) {
                progressFill.classList.add('completed');
            }
        }

        // Update progress ring in modal (if open)
        const ringValue = document.getElementById('progressRingValue');
        if (ringValue) {
            ringValue.textContent = totalActivity.toString();
        }

        const ringGoal = document.getElementById('progressRingGoal');
        if (ringGoal) {
            ringGoal.textContent = DAILY_GOAL.toString();
        }

        // Update progress ring circle (SVG)
        const ringCircle = document.querySelector('.progress-ring-circle') as SVGCircleElement;
        if (ringCircle) {
            const circumference = 314.159; // 2 * PI * r (r=50)
            const offset = circumference - (percent / 100) * circumference;
            ringCircle.style.strokeDashoffset = offset.toString();
        }

        console.log(`[App] Daily progress: ${totalActivity}/${DAILY_GOAL} (${percent.toFixed(0)}%)`);
    }

    private setupVoiceSearch() {
        const voiceSearchBtn = document.getElementById('voiceSearchBtn');
        const searchInput = document.getElementById('searchInput') as HTMLInputElement | null;
        if (!voiceSearchBtn || !searchInput) return;

        voiceSearchBtn.addEventListener('click', () => {
            VoiceSearchManager.toggle();
        });

        VoiceSearchManager.onResult = (transcript: string, isFinal: boolean) => {
            searchInput.value = transcript;
            if (isFinal) {
                this.performSearch(transcript);
                showToast(`🎤 "${transcript}"`);
            }
        };
    }

    private setupVoiceSelection() {
        const voiceBtns = document.querySelectorAll('.voice-selector-inline .voice-btn');
        const currentVoice = localStorage.getItem('ttsVoicePreference') || 'natural';

        voiceBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-voice') === currentVoice);

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const voice = btn.getAttribute('data-voice') as 'natural' | 'female' | 'male';

                voiceBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                localStorage.setItem('ttsVoicePreference', voice);
                showToast(`🗣️ ${t('settings.voiceChanged') || 'Rösttyp ändrad'}`);
            });
        });
    }
}

// Instantiate app if in browser
if (typeof window !== 'undefined') {
    (window as any).app = new App();
}
