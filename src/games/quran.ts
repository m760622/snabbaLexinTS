import { quranData } from '../data/quranData';
import { QuranEntry } from '../types';
import { 
    MobileViewManager, 
    ThemeManager, 
    showToast,
    TextSizeManager
} from '../utils';
import { TTSManager } from '../tts';
import { FavoritesManager } from '../favorites';
import { QuizStats } from '../quiz-stats';

/**
 * Quran Learning Module logic
 */

interface SRSData {
    level: number;
    nextReview: number;
    lastRating?: string;
}

interface UserProgress {
    xp: number;
    streak: number;
    srs: Record<string, SRSData>;
    favorites: string[]; // Keep for legacy, though we'll use FavoritesManager
    theme: string;
    daily?: {
        date: string;
        count: number;
    };
}

class QuranManager {
    private userData: UserProgress = {
        xp: 0,
        streak: 0,
        srs: {},
        favorites: [],
        theme: 'emerald'
    };

    private currentMode: 'list' | 'flashcards' | 'quiz' = 'list';
    private fcIndex = 0;
    private fcFlipped = false;
    private fcDirection: 'ar-sv' | 'sv-ar' = 'sv-ar';
    private filteredData: QuranEntry[] = [...quranData];

    private quizScore = 0;
    private quizStreak = 0;
    private currentQuizItem: QuranEntry | null = null;
    private quizDirection: 'ar-sv' | 'sv-ar' = 'sv-ar';

    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];

    // Mapping Arabic Surah Names to 3-digit IDs for EveryAyah API
    private readonly surahMap: Record<string, string> = {
        "الفاتحة": "001", "البقرة": "002", "آل عمران": "003", "النساء": "004", "المائدة": "005",
        "الأنعام": "006", "الأعراف": "007", "الأنفال": "008", "التوبة": "009", "يونس": "010",
        "هود": "011", "يوسف": "012", "الرعد": "013", "إبراهيم": "014", "الحجر": "015",
        "النحل": "016", "الإسراء": "017", "الكهف": "018", "مريم": "019", "طه": "020",
        "الأنبياء": "021", "الحج": "022", "المؤمنون": "023", "النور": "024", "الفرقان": "025",
        "الشعراء": "026", "النمل": "027", "القصص": "028", "العنكبوت": "029", "الروم": "030",
        "لقمان": "031", "السجدة": "032", "الأحزاب": "033", "سبأ": "034", "فاطر": "035",
        "يس": "036", "الصافات": "037", "ص": "038", "الزمر": "039", "غافر": "040",
        "فصلت": "041", "الشورى": "042", "الزخرف": "043", "الدخان": "044", "الجاثية": "045",
        "الأحقاف": "046", "محمد": "047", "الفتح": "048", "الحجرات": "049", "ق": "050",
        "الذاريات": "051", "الطور": "052", "النجم": "053", "القمر": "054", "الرحمن": "055",
        "الواقعة": "056", "الحديد": "057", "المجادلة": "058", "الحشر": "059", "الممتحنة": "060",
        "الصف": "061", "الجمعة": "062", "المنافقون": "063", "التغابن": "064", "الطلاق": "065",
        "التحريم": "066", "الملك": "067", "القلم": "068", "الحاقة": "069", "المعارج": "070",
        "نوح": "071", "الجن": "072", "المزمل": "073", "المدثر": "074", "القيامة": "075",
        "الإنسان": "076", "المرسلات": "077", "النبأ": "078", "النازعات": "079", "عبس": "080",
        "التكوير": "081", "الإنفطار": "082", "المطففين": "083", "الإنشقاق": "084", "البروج": "085",
        "الطارق": "086", "الأعلى": "087", "الغاشية": "088", "الفجر": "089", "البلد": "090",
        "الشمس": "091", "الليل": "092", "الضحى": "093", "الشرح": "094", "التين": "095",
        "العلق": "096", "القدر": "097", "البينة": "098", "الزلزلة": "099", "العاديات": "100",
        "القارعة": "101", "التكاثر": "102", "العصر": "103", "الهمزة": "104", "الفيل": "105",
        "قريش": "106", "الماعون": "107", "الكوثر": "108", "الكافرون": "109", "النصر": "110",
        "المسد": "111", "الإخلاص": "112", "الفلق": "113", "الناس": "114"
    };

    constructor() {
        this.loadProgress();
        this.init();
    }

    private loadProgress() {
        const saved = localStorage.getItem('quranUserProgress');
        if (saved) {
            try {
                this.userData = { ...this.userData, ...JSON.parse(saved) };
                if (!this.userData.favorites) this.userData.favorites = [];
            } catch (e) {
                console.error('Failed to parse quran progress', e);
            }
        }
    }

    private saveProgress() {
        localStorage.setItem('quranUserProgress', JSON.stringify(this.userData));
        this.updateXPDisplay();
    }

    private init() {
        this.setupDOM();
        this.initFilters();
        this.initTabs();
        this.initFlashcards();
        this.initQuiz();
        ThemeManager.setColorTheme(this.userData.theme, false);
        this.updateXPDisplay();
        this.renderCards(quranData);

        // Expose functions to window for HTML handlers
        (window as any).openInfoModal = this.openInfoModal.bind(this);
        (window as any).closeInfoModal = this.closeInfoModal.bind(this);
        (window as any).toggleFavorite = this.toggleFavorite.bind(this);
        (window as any).playTTS = this.playTTS.bind(this);
        (window as any).shareCard = this.shareCard.bind(this);
        (window as any).startRecording = this.startRecording.bind(this);
        (window as any).stopRecording = this.stopRecording.bind(this);
        (window as any).showRelatedList = this.showRelatedList.bind(this);
        (window as any).renderCards = () => this.renderCards(quranData);
    }

    private setupDOM() {
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeSettingsBtn = document.getElementById('closeSettingsBtn');
        const themeSelector = document.getElementById('themeSelector') as HTMLSelectElement;
        const mobileViewToggle = document.getElementById('mobileViewToggle') as HTMLInputElement;

        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                settingsModal?.classList.remove('hidden');
                // Sync theme to modal for CSS variables
                const currentTheme = document.body.getAttribute('data-quran-theme');
                const modalContent = settingsModal?.querySelector('.settings-content');
                if (modalContent) {
                    if (currentTheme) modalContent.setAttribute('data-quran-theme', currentTheme);
                    else modalContent.removeAttribute('data-quran-theme');
                }
            });
        }

        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                settingsModal?.classList.add('hidden');
            });
        }

        if (themeSelector) {
            themeSelector.value = this.userData.theme;
            themeSelector.addEventListener('change', (e) => {
                const newTheme = (e.target as HTMLSelectElement).value;
                ThemeManager.setColorTheme(newTheme);
                this.userData.theme = newTheme;
                this.saveProgress();
            });
        }

        if (mobileViewToggle) {
            mobileViewToggle.checked = document.body.classList.contains('iphone-view');
            mobileViewToggle.addEventListener('change', (e) => {
                MobileViewManager.apply((e.target as HTMLInputElement).checked);
            });
        }

        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterData());
        }

        // Close modal on click outside
        window.addEventListener('click', (e) => {
            if (e.target === settingsModal) {
                settingsModal?.classList.add('hidden');
            }
        });
    }


    private updateXPDisplay() {
        const userXPEl = document.getElementById('userXP');
        if (userXPEl) userXPEl.textContent = this.userData.xp.toString();

        const donut = document.getElementById('xpDonut');
        if (donut) {
            const percentage = (this.userData.xp % 100);
            (donut as HTMLElement).style.setProperty('--p', percentage.toString());
        }
    }

    private initFilters() {
        const surahFilter = document.getElementById('surahFilter') as HTMLSelectElement;
        const typeFilter = document.getElementById('typeFilter') as HTMLSelectElement;

        const cleanSurahName = (name: string) => name ? name.replace(/\s*\(\d+\)$/, '').trim() : '';

        const uniqueSurahs = [...new Set(quranData.map(item => cleanSurahName(item.surah)))]
            .filter(Boolean)
            .sort();

        uniqueSurahs.forEach(surah => {
            const opt = document.createElement('option');
            opt.value = surah;
            opt.textContent = surah;
            surahFilter.appendChild(opt);
        });

        surahFilter?.addEventListener('change', () => this.filterData());
        typeFilter?.addEventListener('change', () => this.filterData());
    }

    private filterData() {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        const surahFilter = document.getElementById('surahFilter') as HTMLSelectElement;
        const typeFilter = document.getElementById('typeFilter') as HTMLSelectElement;

        const query = searchInput?.value.toLowerCase() || '';
        const selectedSurah = surahFilter?.value || 'all';
        const selectedType = typeFilter?.value || 'all';

        const cleanSurahName = (name: string) => name ? name.replace(/\s*\(\d+\)$/, '').trim() : '';

        this.filteredData = quranData.filter(item => {
            const matchesSearch =
                (item.word && item.word.includes(query)) ||
                (item.word_sv && item.word_sv.toLowerCase().includes(query)) ||
                (item.meaning_ar && item.meaning_ar.includes(query)) ||
                (item.ayah_full && item.ayah_full.includes(query)) ||
                (item.ayah_sv && item.ayah_sv.toLowerCase().includes(query));

            let matchesSurah = true;
            if (selectedSurah !== 'all') {
                if (selectedSurah === 'favorites') {
                    matchesSurah = FavoritesManager.has(item.id);
                } else {
                    matchesSurah = cleanSurahName(item.surah) === selectedSurah;
                }
            }

            const matchesType = selectedType === 'all' || item.type === selectedType;

            return matchesSearch && matchesSurah && matchesType;
        });

        if (this.currentMode === 'list') this.renderCards(this.filteredData);
        else if (this.currentMode === 'flashcards') {
            this.fcIndex = 0;
            this.loadFlashcard(this.fcIndex);
        }
    }

    private initTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.switchMode((btn as HTMLElement).dataset.mode as any);
            });
        });
    }

    private switchMode(mode: 'list' | 'flashcards' | 'quiz') {
        this.currentMode = mode;
        const modes = ['quranList', 'flashcardMode', 'quizMode'];
        modes.forEach(m => document.getElementById(m)?.classList.add('hidden'));

        const targetId = mode === 'list' ? 'quranList' : mode === 'flashcards' ? 'flashcardMode' : 'quizMode';
        document.getElementById(targetId)?.classList.remove('hidden');

        const filterBar = document.getElementById('filterBar');
        if (mode === 'quiz') {
            filterBar?.classList.add('hidden');
            if (!this.currentQuizItem) this.nextQuizQuestion();
        } else {
            filterBar?.classList.remove('hidden');
            if (mode === 'flashcards') this.loadFlashcard(this.fcIndex);
        }
    }

    // Virtual Scrolling Configuration
    private readonly ITEMS_PER_BATCH = 20;
    private currentBatchIndex = 0;
    private loadMoreObserver: IntersectionObserver | null = null;
    private currentItems: QuranEntry[] = [];

    private renderCards(items: QuranEntry[]) {
        const listContainer = document.getElementById('quranList');
        if (!listContainer) return;

        // Reset state for new render
        this.currentItems = items;
        this.currentBatchIndex = 0;
        listContainer.innerHTML = '';

        if (items.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center; color:#ccc; padding:2rem;">Inga resultat hittades</div>';
            return;
        }

        // Render first batch
        this.renderBatch(listContainer);

        // Setup intersection observer for lazy loading
        this.setupLazyLoading(listContainer);
    }

    private renderBatch(container: HTMLElement) {
        const startIndex = this.currentBatchIndex * this.ITEMS_PER_BATCH;
        const endIndex = Math.min(startIndex + this.ITEMS_PER_BATCH, this.currentItems.length);
        
        if (startIndex >= this.currentItems.length) return;

        const fragment = document.createDocumentFragment();
        
        for (let i = startIndex; i < endIndex; i++) {
            const item = this.currentItems[i];
            const card = this.createCardElement(item);
            fragment.appendChild(card);
        }

        // Apply text sizing only to newly added cards (not entire page)
        // Store references to new cards before appending
        const newCards = Array.from(fragment.children) as HTMLElement[];
        
        // Remove old sentinel if exists
        const oldSentinel = container.querySelector('.load-more-sentinel');
        if (oldSentinel) oldSentinel.remove();

        container.appendChild(fragment);
        this.currentBatchIndex++;

        // Add sentinel for next batch if more items exist
        if (endIndex < this.currentItems.length) {
            const sentinel = document.createElement('div');
            sentinel.className = 'load-more-sentinel';
            sentinel.style.cssText = 'height: 50px; display: flex; align-items: center; justify-content: center; color: var(--quran-gold); opacity: 0.7;';
            sentinel.innerHTML = `<span>⏳ Laddar ${Math.min(this.ITEMS_PER_BATCH, this.currentItems.length - endIndex)} till...</span>`;
            container.appendChild(sentinel);
        } else {
            // Show end message
            const endMessage = document.createElement('div');
            endMessage.className = 'end-of-list';
            endMessage.style.cssText = 'text-align: center; padding: 1rem; color: var(--quran-gold); opacity: 0.6;';
            endMessage.innerHTML = `✨ ${this.currentItems.length} ord visas`;
            container.appendChild(endMessage);
        }

        // Apply text sizing ONLY to the new cards (much faster)
        requestAnimationFrame(() => {
            newCards.forEach(card => {
                TextSizeManager.applyToContainer(card);
            });
        });
        
        // Re-observe the new sentinel for the next batch
        const newSentinel = container.querySelector('.load-more-sentinel');
        if (newSentinel && this.loadMoreObserver) {
            this.loadMoreObserver.observe(newSentinel);
        }
    }

    private setupLazyLoading(container: HTMLElement) {
        // Disconnect previous observer
        if (this.loadMoreObserver) {
            this.loadMoreObserver.disconnect();
        }

        this.loadMoreObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.target.classList.contains('load-more-sentinel')) {
                    this.renderBatch(container);
                }
            });
        }, {
            root: null,
            rootMargin: '200px', // Load before user reaches sentinel
            threshold: 0.1
        });

        // Observe sentinel
        const sentinel = container.querySelector('.load-more-sentinel');
        if (sentinel) {
            this.loadMoreObserver.observe(sentinel);
        }
    }

    private createCardElement(item: QuranEntry): HTMLElement {
        const card = document.createElement('div');
        card.className = 'quran-card';

        let displayAyah = item.ayah_full;
        if (item.word && displayAyah.includes(item.word)) {
            displayAyah = displayAyah.replace(item.word, `<span class="highlight-word">${item.word}</span>`);
        }

        const isFav = FavoritesManager.has(item.id);
        const favClass = isFav ? 'fav-btn active' : 'fav-btn';
        const audioUrl = this.getAudioUrl(item.surah);

        card.innerHTML = `
            <div class="card-header">
                <div class="left-actions">
                    <span class="badger surah-badge">${item.surah}</span>
                </div>
                <div class="action-group">
                    <button class="share-btn" title="Dela" onclick='shareCard(${JSON.stringify(item).replace(/'/g, "&apos;")}, event)'>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="18" cy="5" r="3"></circle>
                            <circle cx="6" cy="12" r="3"></circle>
                            <circle cx="18" cy="19" r="3"></circle>
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                        </svg>
                    </button>
                    <button class="${favClass}" onclick="toggleFavorite('${item.id}')" data-id="${item.id}" title="Spara till favoriter">
                         <svg viewBox="0 0 24 24" fill="${isFav ? '#ef4444' : 'none'}" stroke="${isFav ? '#ef4444' : 'currentColor'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            
            <div class="main-word-section">
                <span class="target-word" data-auto-size>${item.word}</span>
                <span class="meaning-ar" data-auto-size>${item.meaning_ar}</span>
                <span class="word-sv" data-auto-size>${item.word_sv} 
                    <button class="audio-btn" onclick="playTTS('${item.word_sv.replace(/'/g, "\\'")}', 'sv-SE', this, null, '${item.id}')">🔊</button> 
                    <button class="audio-btn" onclick="openInfoModal('${item.id}')" title="Tafsir/Info">ℹ️</button>
                </span>
             </div>

            <div class="ayah-section">
                <div class="ayah-full" data-auto-size>${displayAyah} 
                    <button class="audio-btn" onclick="playTTS('${item.ayah_full.replace(/'/g, "\\'")}', 'ar-SA', this, '${audioUrl}', '${item.id}')">🕌</button> 
                    <button class="audio-btn mic-btn" onmousedown="startRecording(this)" onmouseup="stopRecording(this)" ontouchstart="startRecording(this)" ontouchend="stopRecording(this)" title="Håll in för att spela in">🎙️</button>
                    <button class="audio-btn" onclick="showRelatedList('${item.word}')" title="Visa relaterade ord">🌱</button>
                </div>
                <div class="ayah-sv" data-auto-size>${item.ayah_sv}</div>
            </div>
        `;
        return card;
    }

    private getAudioUrl(surahStr: string): string | null {
        try {
            const matches = surahStr.match(/(.+)\s\((\d+)\)/);
            if (matches && matches.length === 3) {
                const name = matches[1].trim();
                const ayah = matches[2].trim().padStart(3, '0');
                const surahID = this.surahMap[name];
                if (surahID) return `https://everyayah.com/data/Alafasy_128kbps/${surahID}${ayah}.mp3`;
            }
        } catch (err) { console.error("Error parsing audio URL:", err); }
        return null;
    }

    private openInfoModal(id: string) {
        const item = quranData.find(d => d.id === id);
        if (!item) return;

        const modal = document.getElementById('infoModal');
        const title = document.getElementById('modalTitle');
        const body = document.getElementById('modalBody');

        if (title) title.textContent = `Tafsir: ${item.word}`;
        if (body) {
            body.innerHTML = `
                <div class="tafsir-text">
                    <strong>📝 Rot/Ursprung (Estimat):</strong> ${item.word.replace(/[^\u0621-\u064A]/g, '').substring(0, 3)}<br><br>
                    <strong>📖 Kontext (Svenska):</strong><br> "${item.ayah_sv}"<br><br>
                    <strong>💡 Betyدelse (Utökad):</strong><br> ${item.meaning_ar}<br><br>
                    <em>(Tafsir Al-Jalalayn - Kommer snart)</em>
                </div>
                <button class="control-btn" style="background:var(--quran-green); width:100%" onclick="closeInfoModal()">Stäng</button>
            `;
        }
        modal?.classList.remove('hidden');
    }

    private closeInfoModal() {
        document.getElementById('infoModal')?.classList.add('hidden');
    }

    private toggleFavorite(id: string) {
        const isFav = FavoritesManager.toggle(id);
        const btns = document.querySelectorAll(`.fav-btn[data-id="${id}"]`);
        btns.forEach(btn => {
            FavoritesManager.updateButtonIcon(btn as HTMLElement, isFav);
        });
        // Record study activity when favoriting
        QuizStats.recordStudy(id);
    }

    private playTTS(text: string, lang: string, btn: HTMLElement, audioUrl: string | null = null, id?: string) {
        if (btn) btn.classList.add('playing');

        if (lang === 'ar-SA' && audioUrl) {
            const audio = new Audio(audioUrl);
            audio.onended = () => {
                btn.classList.remove('playing');
                const card = btn.closest('.quran-card, .fc-inner');
                card?.querySelector('.highlight-word')?.classList.remove('highlight-karaoke');
            };
            audio.onerror = () => {
                TTSManager.speak(text, lang);
                btn.classList.remove('playing');
            };
            audio.play().catch(() => {
                TTSManager.speak(text, lang);
                btn.classList.remove('playing');
            });

            // Karaoke effect
            const card = btn.closest('.quran-card, .fc-inner');
            card?.querySelector('.highlight-word')?.classList.add('highlight-karaoke');
            if (id) QuizStats.recordStudy(id);
            return;
        }

        TTSManager.speak(text, lang);
        setTimeout(() => btn.classList.remove('playing'), 2000);
        if (id) QuizStats.recordStudy(id);
    }

    private async shareCard(item: QuranEntry, e: MouseEvent) {
        if (e) { e.preventDefault(); e.stopPropagation(); }
        const text = `🔹 ${item.word} (${item.surah})\n\nMeaning: ${item.meaning_ar}\n\n📖 ${item.ayah_full}\n\n🇸🇪 "${item.ayah_sv}"\n\n- Snabbalexin Quran`;
        
        if (navigator.share) {
            try {
                await navigator.share({ title: 'Koranord - SnabbaLexin', text });
            } catch (err) { console.warn('Share failed', err); }
        } else {
            await navigator.clipboard.writeText(text);
            showToast('Text kopierad! / تم نسخ النص! 📋');
        }
    }

    private async startRecording(btn: HTMLElement) {
        btn.classList.add('recording');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];
            this.mediaRecorder.ondataavailable = e => this.audioChunks.push(e.data);
            this.mediaRecorder.start();
        } catch (err) {
            showToast('Mikrofon nekad / الميكروفون مرفوض 🎤❌');
            btn.classList.remove('recording');
        }
    }

    private stopRecording(btn: HTMLElement) {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') return;
        btn.classList.remove('recording');
        this.mediaRecorder.stop();
        this.mediaRecorder.onstop = () => {
            const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);
            new Audio(url).play();
        };
    }

    private showRelatedList(sourceWord: string) {
        this.switchMode('list');
        const cleanWord = sourceWord.replace(/[^\u0621-\u064A]/g, '');
        if (cleanWord.length < 3) return;
        const rootProxy = cleanWord.substring(0, 3);

        const related = quranData.filter(item => {
            if (item.word === sourceWord) return false;
            const itemClean = item.word.replace(/[^\u0621-\u064A]/g, '');
            return itemClean.includes(rootProxy);
        });

        const listContainer = document.getElementById('quranList');
        if (listContainer) {
            listContainer.innerHTML = `<div class="related-header" style="padding:1rem; text-align:center;">
                <h3 style="color:var(--quran-gold)">Orden från samma rot "${sourceWord}" (Ungefär)</h3>
                <button onclick="renderCards()" class="control-btn" style="margin-top:10px">Visa alla</button>
            </div>`;
            this.renderCards(related);
        }
    }

    // --- Flashcard Logic ---
    private initFlashcards() {
        const cardEl = document.getElementById('quranFlashcard');
        const prevBtn = document.getElementById('prevCardBtn');
        const nextBtn = document.getElementById('nextCardBtn');
        const globalFcLangToggle = document.getElementById('globalFcLangToggle') as HTMLInputElement;

        cardEl?.addEventListener('click', (e) => {
            if ((e.target as HTMLElement).closest('.audio-btn, .fav-btn, .share-btn')) return;
            this.fcFlipped = !this.fcFlipped;
            cardEl.classList.toggle('flipped', this.fcFlipped);
            document.getElementById('ratingControls')?.classList.toggle('visible', this.fcFlipped);
        });

        prevBtn?.addEventListener('click', () => { if (this.fcIndex > 0) { this.fcIndex--; this.loadFlashcard(this.fcIndex); } });
        nextBtn?.addEventListener('click', () => { if (this.fcIndex < this.filteredData.length - 1) { this.fcIndex++; this.loadFlashcard(this.fcIndex); } });

        globalFcLangToggle?.addEventListener('change', (e) => {
            this.fcDirection = (e.target as HTMLInputElement).checked ? 'sv-ar' : 'ar-sv';
            const label = document.getElementById('fcModeLabel');
            if (label) label.textContent = this.fcDirection === 'sv-ar' ? '🇸🇪 Svenska (Framsida)' : '🇸🇦 Arabiska (Framsida)';
            this.loadFlashcard(this.fcIndex);
        });

        document.querySelectorAll('.rate-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleSRS((btn as HTMLElement).dataset.rating as any);
            });
        });
    }

    private loadFlashcard(index: number) {
        if (!this.filteredData[index]) return;
        const item = this.filteredData[index];
        this.fcFlipped = false;
        document.getElementById('quranFlashcard')?.classList.remove('flipped');
        document.getElementById('ratingControls')?.classList.remove('visible');

        const isArFront = this.fcDirection === 'ar-sv';
        const isFav = FavoritesManager.has(item.id);

        document.querySelectorAll('.fav-btn').forEach(btn => {
            FavoritesManager.updateButtonIcon(btn as HTMLElement, isFav);
        });

        const fcWord = document.getElementById('fcWord');
        if (fcWord) fcWord.textContent = isArFront ? item.word : item.word_sv;
        
        const fcSurah = document.getElementById('fcSurah');
        if (fcSurah) fcSurah.textContent = item.surah;

        const fcMeaning = document.getElementById('fcMeaning');
        if (fcMeaning) fcMeaning.textContent = item.meaning_ar;

        const fcAyah = document.getElementById('fcAyah');
        const fcTrans = document.getElementById('fcTrans');
        const audioUrl = this.getAudioUrl(item.surah);

        if (fcAyah && fcTrans) {
            const arAudio = `<button class="audio-btn" onclick="playTTS('${item.ayah_full.replace(/'/g, "\\'")}', 'ar-SA', this, '${audioUrl}', '${item.id}')">🕌</button>`;
            const svAudio = `<button class="audio-btn" onclick="playTTS('${item.word_sv.replace(/'/g, "\\'")}', 'sv-SE', this, null, '${item.id}')">🔊</button>`;
            const infoBtn = `<button class="audio-btn" onclick="openInfoModal('${item.id}')" title="Tafsir/Info">ℹ️</button>`;

            const ayahHtml = item.ayah_full.replace(item.word, `<span class="highlight-word">${item.word}</span>`);
            
            if (isArFront) {
                fcAyah.innerHTML = ayahHtml + arAudio + infoBtn;
                fcTrans.innerHTML = `<div style="margin-bottom:5px; font-weight:bold; color:var(--quran-gold)">${item.word_sv} ${svAudio}</div><div>${item.ayah_sv}</div>`;
            } else {
                fcAyah.innerHTML = `<div style="font-size:1.4rem; margin-bottom:0.5rem; color:var(--quran-gold);">${item.word}</div>${ayahHtml} ${arAudio} ${infoBtn}`;
                fcTrans.innerHTML = `<div>${item.ayah_sv}</div>`;
            }

            // Apply sizing to dynamically created content
            if (fcWord) TextSizeManager.apply(fcWord as HTMLElement, fcWord.textContent || '');
            if (fcMeaning) TextSizeManager.apply(fcMeaning as HTMLElement, fcMeaning.textContent || '');
            fcAyah.querySelectorAll('*').forEach(el => {
                if (el.textContent && el.textContent.length > 20) TextSizeManager.apply(el as HTMLElement, el.textContent, 2);
            });
            fcTrans.querySelectorAll('*').forEach(el => {
                if (el.textContent && el.textContent.length > 20) TextSizeManager.apply(el as HTMLElement, el.textContent, 2);
            });
        }

        const prog = document.getElementById('fcProgress');
        if (prog) prog.textContent = `${index + 1} / ${this.filteredData.length}`;
        
        QuizStats.recordStudy(item.id);
    }

    private handleSRS(rating: 'again' | 'hard' | 'good' | 'easy') {
        const item = this.filteredData[this.fcIndex];
        let nextInterval = 1;
        if (rating === 'easy') nextInterval = 7;
        else if (rating === 'good') nextInterval = 3;
        else if (rating === 'again') nextInterval = 0;

        const nextDate = Date.now() + (nextInterval * 24 * 60 * 60 * 1000);
        this.userData.srs[item.id] = {
            level: (this.userData.srs[item.id]?.level || 0) + (rating === 'again' ? 0 : 1),
            nextReview: nextDate,
            lastRating: rating
        };
        this.saveProgress();
        if (rating !== 'again' && this.fcIndex < this.filteredData.length - 1) {
            this.fcIndex++;
            this.loadFlashcard(this.fcIndex);
        }
    }

    // --- Quiz Logic ---
    private initQuiz() {
        document.getElementById('nextQuestionBtn')?.addEventListener('click', () => this.nextQuizQuestion());
        const quizLangToggle = document.getElementById('quizLangToggle') as HTMLInputElement;
        quizLangToggle?.addEventListener('change', (e) => {
            this.quizDirection = (e.target as HTMLInputElement).checked ? 'sv-ar' : 'ar-sv';
            const label = document.getElementById('quizModeLabel');
            if (label) label.textContent = this.quizDirection === 'sv-ar' ? '🇸🇪 Svenska ➔ 🇸🇦 Arabiska' : '🇸🇦 Arabiska ➔ 🇸🇪 Svenska';
            this.nextQuizQuestion();
        });
    }

    private nextQuizQuestion() {
        const feedback = document.getElementById('quizFeedback');
        const nextBtn = document.getElementById('nextQuestionBtn');
        const optionsContainer = document.getElementById('quizOptions');
        
        feedback?.classList.add('hidden');
        feedback?.classList.remove('correct', 'wrong');
        nextBtn?.classList.add('hidden');
        if (optionsContainer) optionsContainer.innerHTML = '';

        const randIndex = Math.floor(Math.random() * quranData.length);
        this.currentQuizItem = quranData[randIndex];

        const title = document.querySelector('.quiz-question-type');
        const wordEl = document.getElementById('quizWord');

        if (this.quizDirection === 'ar-sv') {
            if (title) title.textContent = 'ما معنى هذه الكلمة؟';
            if (wordEl && this.currentQuizItem) wordEl.textContent = this.currentQuizItem.word;
        } else {
            if (title) title.textContent = 'Vad heter detta på Arabiska?';
            if (wordEl && this.currentQuizItem) wordEl.textContent = this.currentQuizItem.word_sv;
        }

        if (!this.currentQuizItem) return;
        const options: QuranEntry[] = [this.currentQuizItem];
        while (options.length < 4) {
            const rand = quranData[Math.floor(Math.random() * quranData.length)];
            if (rand && !options.some(o => o.id === rand.id)) options.push(rand);
        }
        options.sort(() => Math.random() - 0.5);

        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'quiz-btn';
            const text = this.quizDirection === 'ar-sv' ? opt.meaning_ar : opt.word;
            btn.textContent = text;
            btn.onclick = () => {
                if (this.currentQuizItem) this.handleQuizAnswer(opt, btn);
            };
            optionsContainer?.appendChild(btn);
            if (btn) TextSizeManager.apply(btn, text);
        });
        
        if (wordEl && wordEl.textContent) TextSizeManager.apply(wordEl, wordEl.textContent);
    }

    private handleQuizAnswer(selected: QuranEntry, btn: HTMLButtonElement) {
        if (!this.currentQuizItem) return;
        const allBtns = document.querySelectorAll('.quiz-btn');
        allBtns.forEach(b => (b as HTMLButtonElement).disabled = true);

        const feedback = document.getElementById('quizFeedback');
        const isCorrect = selected.id === this.currentQuizItem.id;

        if (isCorrect) {
            btn.classList.add('correct');
            if (feedback) {
                feedback.textContent = 'Rätt! الله يفتح عليك!';
                feedback.className = 'quiz-feedback correct';
            }
            this.quizScore += 10;
            this.userData.xp += 10;
            this.quizStreak++;
            this.userData.streak = Math.max(this.userData.streak, this.quizStreak);
            QuizStats.recordAnswer(this.currentQuizItem.id, true);
        } else {
            btn.classList.add('wrong');
            const correctText = this.quizDirection === 'ar-sv' ? this.currentQuizItem.meaning_ar : this.currentQuizItem.word;
            allBtns.forEach(b => {
                if (b.textContent === correctText) b.classList.add('correct');
            });
            if (feedback) {
                feedback.textContent = `Fel. Rätt svar: ${correctText}`;
                feedback.className = 'quiz-feedback wrong';
            }
            this.quizStreak = 0;
            QuizStats.recordAnswer(this.currentQuizItem.id, false);
        }

        this.saveProgress();
        this.updateQuizUI();
        document.getElementById('nextQuestionBtn')?.classList.remove('hidden');
    }

    private updateQuizUI() {
        const scoreEl = document.getElementById('quizScore');
        const streakEl = document.getElementById('quizStreak');
        if (scoreEl) scoreEl.textContent = this.quizScore.toString();
        if (streakEl) streakEl.textContent = this.quizStreak.toString();
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new QuranManager();
});
