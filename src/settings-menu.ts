/**
 * Settings Menu Component - Lazy Loaded
 * Dynamically generates the settings menu HTML to reduce initial page load
 */

// Icon SVG definitions - using simple emoji for most, SVG only where essential
const ICONS = {
    sun: `<svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    volume: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`,
    bell: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    star: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    bolt: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    grid: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    book: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    plus: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    download: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
    upload: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
    monitor: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
    list: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
    card: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M12 8v8"/><path d="M8 12h8"/></svg>`
};

const COLOR_THEMES = [
    { value: 'default', label: '⚪ Standard' },
    { value: 'ocean', label: '🌊 Ocean Blue' },
    { value: 'sunset', label: '🌅 Sunset Orange' },
    { value: 'forest', label: '🌲 Forest Green' },
    { value: 'darkblue', label: '💙 Dark Blue' },
    { value: 'rose', label: '🌸 Rose Pink' },
    { value: 'midnight', label: '🌙 Midnight Blue' },
    { value: 'mint', label: '🍃 Mint Green' },
    { value: 'coral', label: '🪸 Coral Red' },
    { value: 'neon', label: '⚡ Neon Cyber' },
    { value: 'stealth', label: '🖤 Stealth Black' },
    { value: 'aurora', label: '🌌 Aurora Night' },
    { value: 'ember', label: '🔥 Ember Glow' }
];

export function generateSettingsMenuHTML(): string {
    return `
        <!-- Section: Profile -->
        <a href="profile.html" class="menu-item profile-link" aria-label="Min Profil / ملفي الشخصي">
            <span class="icon-box">👤</span>
            <span>Min Profil / ملفي</span>
        </a>

        <!-- Section: General (Language) -->
        <div class="settings-section-header">🌍 <span class="sv-text">Språk</span><span class="ar-text">اللغة</span></div>

        <div class="menu-item language-selector-menu">
            <div class="voice-selector-inline">
                <button class="menu-lang-btn" data-lang="sv" title="Svenska">🇸🇪</button>
                <button class="menu-lang-btn" data-lang="ar" title="العربية">🇸🇦</button>
                <button class="menu-lang-btn" data-lang="both" title="Båda / كلتا">🌍</button>
            </div>
        </div>

        <!-- Section: Appearance -->
        <div class="settings-section-header">🎨 <span class="sv-text">Utseende</span><span class="ar-text">المظهر</span></div>

        <button id="themeToggle" class="menu-item" aria-label="Växla tema / تبديل المظهر">
            <span class="icon-box">${ICONS.sun}${ICONS.moon}</span>
            <span><span class="sv-text">Ljus/Mörk</span><span class="ar-text">فاتح/داكن</span></span>
        </button>

        <div class="menu-item color-theme-selector">
            <span class="icon-box">🎨</span>
            <select id="colorThemeSelect" aria-label="Färgtema / لون الثيم">
                ${COLOR_THEMES.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
            </select>
        </div>

        <div class="menu-item toggle-item">
            <span class="icon-box">📱</span>
            <span><span class="sv-text">Mobilvy</span><span class="ar-text">عرض الجوال</span></span>
            <label class="toggle-switch">
                <input type="checkbox" id="mobileViewToggle" title="Mobilvy / عرض الجوال">
                <span class="toggle-slider"></span>
            </label>
        </div>

        <div class="menu-item toggle-item">
            <span class="icon-box">🧘</span>
            <span><span class="sv-text">Fokusläge</span><span class="ar-text">وضع التركيز</span></span>
            <label class="toggle-switch">
                <input type="checkbox" id="focusModeToggle" title="Fokusläge / وضع التركيز">
                <span class="toggle-slider"></span>
            </label>
        </div>

        <!-- Section: Sound & Notifications -->
        <div class="settings-section-header">🔔 <span class="sv-text">Ljud & Notiser</span><span class="ar-text">الصوت والإشعارات</span></div>

        <div class="menu-item toggle-item">
            <span class="icon-box">🔊</span>
            <span><span class="sv-text">Ljudeffekter</span><span class="ar-text">المؤثرات الصوتية</span></span>
            <label class="toggle-switch">
                <input type="checkbox" id="soundEffectsToggle" checked title="Ljudeffekter / المؤثرات الصوتية">
                <span class="toggle-slider"></span>
            </label>
        <div class="menu-item font-size-control-menu">
            <span class="icon-box">🔤</span>
            <div class="font-size-wrapper">
                <span><span class="sv-text">Textstorlek</span><span class="ar-text">حجم A</span></span>
                <div class="font-btn-group">
                    <button class="font-btn" data-size="small">S</button>
                    <button class="font-btn active" data-size="medium">M</button>
                    <button class="font-btn" data-size="large">L</button>
                </div>
            </div>
        </div>

        <div class="menu-item toggle-item">
            <span class="icon-box">✨</span>
            <span><span class="sv-text">Animationer</span><span class="ar-text">الحركات</span></span>
            <label class="toggle-switch">
                <input type="checkbox" id="animationsToggle" checked title="Animationer / الحركات">
                <span class="toggle-slider"></span>
            </label>
        </div>

        <!-- Section: Sound & Notifications -->
        <div class="settings-section-header">🔔 <span class="sv-text">Ljud & Notiser</span><span class="ar-text">الصوت والإشعارات</span></div>

        <div class="menu-item toggle-item">
            <span class="icon-box">🔊</span>
            <span><span class="sv-text">Ljudeffekter</span><span class="ar-text">المؤثرات الصوتية</span></span>
            <label class="toggle-switch">
                <input type="checkbox" id="soundEffectsToggle" checked title="Ljudeffekter / المؤثرات الصوتية">
                <span class="toggle-slider"></span>
            </label>
        </div>

        <div class="menu-item tts-speed-control">
            <span class="icon-box icon-color-blue">${ICONS.volume}</span>
            <div class="tts-speed-wrapper">
                <div class="tts-speed-header">
                    <span><span class="sv-text">Uttalshastighet</span><span class="ar-text">سرعة النطق</span></span>
                    <span id="ttsSpeedValue" class="tts-speed-badge">85%</span>
                </div>
                <input type="range" id="ttsSpeedSlider" min="50" max="150" value="85" class="tts-slider" title="Uttalshastighet / سرعة النطق">
                <button id="testTTSBtn" class="tts-test-btn">🔊 <span class="sv-text">Testa</span><span class="ar-text">اختبر</span></button>
            </div>
        </div>

        <div class="menu-item tts-voice-selection">
            <span class="icon-box icon-color-blue">🎭</span>
            <div class="voice-selector-inline">
                <button class="voice-btn active" data-voice="natural" title="Naturlig / طبيعي">🌍</button>
                <button class="voice-btn" data-voice="female" title="Kvinna / أنثى">👩</button>
                <button class="voice-btn" data-voice="male" title="Man / ذكر">👨</button>
            </div>
        </div>

        <div class="menu-item reminder-control">
            <span class="icon-box icon-color-amber">${ICONS.bell}</span>
            <div class="reminder-wrapper">
                <div class="reminder-header">
                    <span><span class="sv-text">Påminnelse</span><span class="ar-text">تذكير</span></span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="reminderToggle" title="Påminnelse på/av / التذكير تشغيل/إيقاف">
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div id="reminderTimeContainer" class="reminder-time-container hidden">
                    <input type="time" id="reminderTime" value="18:00" class="reminder-time-input" title="Påminnelsetid / وقت التذكير">
                </div>
            </div>
        </div>

        <!-- Section: Learning Tools -->
        <div class="settings-section-header">📚 <span class="sv-text">Lärverktyg</span><span class="ar-text">أدوات التعلم</span></div>

        <div class="menu-item toggle-item">
            <span class="icon-box">🎯</span>
            <div class="goal-wrapper-menu">
                <span><span class="sv-text">Dagligt mål</span><span class="ar-text">الهدف اليومي</span></span>
                <div class="goal-selector-inline">
                    <button class="goal-btn" data-goal="5">5</button>
                    <button class="goal-btn active" data-goal="10">10</button>
                    <button class="goal-btn" data-goal="20">20</button>
                </div>
            </div>
        </div>

        <div class="menu-item toggle-item">
            <span class="icon-box">▶️</span>
            <span><span class="sv-text">Auto-spela</span><span class="ar-text">تشغيل تلقائي</span></span>
            <label class="toggle-switch">
                <input type="checkbox" id="autoPlayToggle" title="Auto-spela / تشغيل تلقائي">
                <span class="toggle-slider"></span>
            </label>
        </div>

        <div class="menu-item toggle-item">
            <span class="icon-box">💬</span>
            <span><span class="sv-text">Visa exempel</span><span class="ar-text">عرض الأمثلة</span></span>
            <label class="toggle-switch">
                <input type="checkbox" id="showExamplesToggle" checked title="Visa exempel / عرض الأمثلة">
                <span class="toggle-slider"></span>
            </label>
        </div>

        <div class="menu-item toggle-item">
            <span class="icon-box">👁️</span>
            <span><span class="sv-text">Ögonvård</span><span class="ar-text">حماية العين</span></span>
            <label class="toggle-switch">
                <input type="checkbox" id="eyeCareToggle" title="Ögonvård / حماية العين">
                <span class="toggle-slider"></span>
            </label>
        </div>

        <button id="showFavoritesBtn" class="menu-item" aria-label="Visa favoriter / عرض المفضلة">
            <span class="icon-box icon-color-star">${ICONS.star}</span>
            <span>⭐ <span class="sv-text">Mina ord</span><span class="ar-text">كلماتي</span></span>
        </button>

        <button id="quizBtn" class="menu-item" aria-label="Snabbtest / تحدي السرعة">
            <span class="icon-box icon-color-blue">${ICONS.bolt}</span>
            <span>⚡ <span class="sv-text">Snabbtest</span><span class="ar-text">اختبار سريع</span></span>
        </button>

        <button id="favQuizBtn" class="menu-item" aria-label="اختبار المفضلات">
            <span class="icon-box icon-color-star">${ICONS.star}</span>
            <span>⭐ <span class="sv-text">Quiz Favoriter</span><span class="ar-text">اختبار المفضلة</span></span>
        </button>

        <button id="flashcardsBtn" class="menu-item" aria-label="Flashcards / بطاقات">
            <span class="icon-box icon-color-blue">${ICONS.card}</span>
            <span>🃏 <span class="sv-text">Flashcards</span><span class="ar-text">بطاقات</span></span>
        </button>

        <!-- Section: Navigation -->
        <div class="settings-section-header">🧭 <span class="sv-text">Navigation</span><span class="ar-text">التنقل</span></div>

        <a href="games/games.html" id="gameBtn" class="menu-item" aria-label="Spel / ألعاب">
            <span class="icon-box icon-color-blue">${ICONS.grid}</span>
            <span>🎮 <span class="sv-text">Spel</span><span class="ar-text">ألعاب</span></span>
        </a>

        <a href="learn/learn.html" class="menu-item" aria-label="Lär dig / تعلم">
            <span class="icon-box icon-color-green">${ICONS.book}</span>
            <span>📚 <span class="sv-text">Grammatik</span><span class="ar-text">قواعد</span></span>
        </a>

        <a href="add.html" class="menu-item" aria-label="Lägg till ord / إضافة كلمة">
            <span class="icon-box icon-color-emerald">${ICONS.plus}</span>
            <span>➕ <span class="sv-text">Lägg till</span><span class="ar-text">إضافة</span></span>
        </a>

        <!-- Section: Data -->
        <div class="settings-section-header">💾 <span class="sv-text">Data</span><span class="ar-text">البيانات</span></div>

        <button id="exportCustom" class="menu-item" aria-label="Exportera">
            <span class="icon-box icon-color-cyan">${ICONS.download}</span>
            <span>📤 <span class="sv-text">Exportera</span><span class="ar-text">تصدير</span></span>
        </button>

        <button id="importCustom" class="menu-item" aria-label="Importera">
            <span class="icon-box icon-color-cyan">${ICONS.upload}</span>
            <span>📥 <span class="sv-text">Importera</span><span class="ar-text">استيراد</span></span>
        </button>

        <!-- Section: Info -->
        <div class="settings-section-header">ℹ️ <span class="sv-text">Info</span><span class="ar-text">المعلومات</span></div>

        <a href="settings.html" class="menu-item" aria-label="Alla inställningar / جميع الإعدادات">
            <span class="icon-box icon-color-blue">⚙️</span>
            <span>⚙️ <span class="sv-text">Alla inställningar</span><span class="ar-text">جميع الإعدادات</span></span>
        </a>

        <a href="device.html" class="menu-item" aria-label="Device Info / معلومات الجهاز">
            <span class="icon-box icon-color-slate">${ICONS.monitor}</span>
            <span>🖥️ Device Info</span>
        </a>

        <a href="changelog.html" class="menu-item" aria-label="Changelog / سجل التحديثات">
            <span class="icon-box icon-color-blue">${ICONS.list}</span>
            <span>📋 Changelog</span>
        </a>

        <div class="settings-version">
            <p>SnabbaLexin v3.0.0 &copy; 2025</p>
        </div>
    `;
}

// Lazy load the settings menu when first opened
let isMenuLoaded = false;

export function initSettingsMenuLazy(): void {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsMenu = document.getElementById('settingsMenu');

    if (!settingsBtn || !settingsMenu) return;

    settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Load menu content on first open
        if (!isMenuLoaded) {
            settingsMenu.innerHTML = generateSettingsMenuHTML();
            isMenuLoaded = true;

            // Re-init any event handlers for menu items
            initSettingsMenuHandlers();
        }

        settingsMenu.classList.toggle('hidden');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        const target = e.target as Node;
        if (settingsMenu && settingsBtn &&
            !settingsMenu.contains(target) && !settingsBtn.contains(target)) {
            settingsMenu.classList.add('hidden');
        }
    });
}

// Helper to update the main settings JSON blob
function updateUserSettings(key: string, value: any): void {
    try {
        const saved = localStorage.getItem('userSettings');
        const settings = saved ? JSON.parse(saved) : {};
        settings[key] = value;
        localStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to sync settings:', e);
    }
}

function initSettingsMenuHandlers(): void {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
            // Sync with main settings
            updateUserSettings('darkMode', next === 'dark');
        });
    }

    // Color theme select
    const colorSelect = document.getElementById('colorThemeSelect') as HTMLSelectElement;
    if (colorSelect) {
        const savedGlobal = localStorage.getItem('colorTheme') || 'default';
        colorSelect.value = savedGlobal;
        colorSelect.addEventListener('change', () => {
            // Remove old class approach
            document.body.className = document.body.className.replace(/theme-\w+/, '');

            // Set attribute on documentElement (HTML tag) for global variables
            if (colorSelect.value !== 'default') {
                document.documentElement.setAttribute('data-color-theme', colorSelect.value);
            } else {
                document.documentElement.removeAttribute('data-color-theme');
            }

            localStorage.setItem('colorTheme', colorSelect.value);
            // Sync with main settings
            updateUserSettings('colorTheme', colorSelect.value);
        });
    }

    // TTS Speed slider
    const ttsSlider = document.getElementById('ttsSpeedSlider') as HTMLInputElement;
    const ttsValue = document.getElementById('ttsSpeedValue');
    if (ttsSlider && ttsValue) {
        // Try getting from JSON first for consistency
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            const speed = savedJSON.ttsSpeed || localStorage.getItem('ttsSpeed') || '85';
            ttsSlider.value = String(speed);
            ttsValue.textContent = `${speed}%`;
        } catch (e) { /* fallback */ }

        ttsSlider.addEventListener('input', () => {
            ttsValue.textContent = `${ttsSlider.value}%`;
            localStorage.setItem('ttsSpeed', ttsSlider.value);
            // Sync with main settings
            updateUserSettings('ttsSpeed', parseInt(ttsSlider.value));
        });
    }

    // Reminder toggle
    const reminderToggle = document.getElementById('reminderToggle') as HTMLInputElement;
    const reminderTime = document.getElementById('reminderTimeContainer');
    if (reminderToggle && reminderTime) {
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            reminderToggle.checked = savedJSON.reminderEnabled === true || localStorage.getItem('reminderEnabled') === 'true';
            reminderTime.classList.toggle('hidden', !reminderToggle.checked);
        } catch (e) { /* fallback */ }

        reminderToggle.addEventListener('change', () => {
            reminderTime.classList.toggle('hidden', !reminderToggle.checked);
            localStorage.setItem('reminderEnabled', String(reminderToggle.checked));
            // Sync with main settings
            updateUserSettings('reminderEnabled', reminderToggle.checked);
        });
    }

    // Voice buttons
    const voiceBtns = document.querySelectorAll('.voice-btn');
    if (voiceBtns.length > 0) {
        // Initialize state
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            const voice = savedJSON.ttsVoicePreference || localStorage.getItem('ttsVoice') || 'natural';
            voiceBtns.forEach(btn => {
                if (btn.getAttribute('data-voice') === voice) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        } catch (e) { /* fallback */ }
    }

    voiceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const voice = (btn as HTMLElement).dataset.voice || 'natural';
            localStorage.setItem('ttsVoice', voice);
            // Sync with main settings
            updateUserSettings('ttsVoicePreference', voice);
        });
    });

    // Language buttons
    document.querySelectorAll('.menu-lang-btn').forEach(btn => {
        // Init active state logic...
        // (Note: full language sync is complex, basic handling for now)
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang') || 'both';
            document.querySelectorAll('.menu-lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            localStorage.setItem('appLanguage', lang);

            if ((window as any).LanguageManager) {
                (window as any).LanguageManager.setLanguage(lang);
            } else {
                location.reload();
            }
        });
    });

    // Mobile View toggle
    const mobileViewToggle = document.getElementById('mobileViewToggle') as HTMLInputElement;
    if (mobileViewToggle) {
        try {
            // Get from JSON source of truth if available
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            // Check if property exists in JSON first, if not fall back to old key or default
            const isMobile = 'mobileView' in savedJSON ? savedJSON.mobileView : (localStorage.getItem('mobileView') === 'true');

            mobileViewToggle.checked = isMobile;
            document.body.classList.toggle('mobile-view', isMobile);
        } catch (e) { /* fallback */ }

        mobileViewToggle.addEventListener('change', () => {
            const checked = mobileViewToggle.checked;
            // Use 'iphone-view' to match style.css rules
            document.body.classList.toggle('iphone-view', checked);
            localStorage.setItem('mobileView', String(checked));
            // Sync with main settings
            updateUserSettings('mobileView', checked);

            // Also notify MobileViewManager if available globally
            if ((window as any).MobileViewManager) {
                (window as any).MobileViewManager.apply(checked);
            }
        });
    }

    // Sound Effects toggle
    const soundEffectsToggle = document.getElementById('soundEffectsToggle') as HTMLInputElement;
    if (soundEffectsToggle) {
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            // Priority: JSON > Individual Key > Default True
            let isEnabled = true;
            if ('soundEffects' in savedJSON) isEnabled = savedJSON.soundEffects;
            else if (localStorage.getItem('soundEnabled') !== null) isEnabled = localStorage.getItem('soundEnabled') !== 'false';

            soundEffectsToggle.checked = isEnabled;
        } catch (e) { /* fallback */ }

        soundEffectsToggle.addEventListener('change', () => {
            const checked = soundEffectsToggle.checked;
            localStorage.setItem('soundEnabled', String(checked));
            // Sync with main settings
            updateUserSettings('soundEffects', checked);
        });
    }

    // Focus Mode toggle
    const focusModeToggle = document.getElementById('focusModeToggle') as HTMLInputElement;
    if (focusModeToggle) {
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            let isFocus = false;
            if ('focusMode' in savedJSON) isFocus = savedJSON.focusMode;
            else isFocus = localStorage.getItem('focusMode') === 'true';

            focusModeToggle.checked = isFocus;
            document.body.classList.toggle('focus-mode', isFocus);
        } catch (e) { /* fallback */ }

        focusModeToggle.addEventListener('change', () => {
            const checked = focusModeToggle.checked;
            document.body.classList.toggle('focus-mode', checked);
            localStorage.setItem('focusMode', String(checked));
            // Sync with main settings
            updateUserSettings('focusMode', checked);
        });
    }

    // ===================================
    // NEW HANDLERS FOR FULL SYNC
    // ===================================

    // Font Size Handlers
    const fontBtns = document.querySelectorAll('.font-btn');
    if (fontBtns.length > 0) {
        // Init State
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            const savedSize = savedJSON.fontSize || 'medium';
            fontBtns.forEach(btn => {
                if (btn.getAttribute('data-size') === savedSize) btn.classList.add('active');
                else btn.classList.remove('active');
            });
            // Apply immediately if not applied by app.ts
            const sizeMap: Record<string, string> = { 'small': '14px', 'medium': '16px', 'large': '18px' };
            if (sizeMap[savedSize]) document.documentElement.style.fontSize = sizeMap[savedSize];
        } catch (e) { }

        fontBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const size = btn.getAttribute('data-size') || 'medium';
                // UI Update
                fontBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                // Functional Update
                const sizeMap: Record<string, string> = { 'small': '14px', 'medium': '16px', 'large': '18px' };
                document.documentElement.style.fontSize = sizeMap[size];

                // Data Sync
                updateUserSettings('fontSize', size);
            });
        });
    }

    // Animations Toggle
    const animToggle = document.getElementById('animationsToggle') as HTMLInputElement;
    if (animToggle) {
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            // Default true
            const isAnim = savedJSON.animations !== false;
            animToggle.checked = isAnim;
            document.body.classList.toggle('reduce-motion', !isAnim);
        } catch (e) { }

        animToggle.addEventListener('change', () => {
            const checked = animToggle.checked;
            document.body.classList.toggle('reduce-motion', !checked);
            updateUserSettings('animations', checked);
        });
    }

    // Daily Goal
    const goalBtns = document.querySelectorAll('.goal-btn');
    if (goalBtns.length > 0) {
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            const savedGoal = String(savedJSON.dailyGoal || '10');
            goalBtns.forEach(btn => {
                if (btn.getAttribute('data-goal') === savedGoal) btn.classList.add('active');
                else btn.classList.remove('active');
            });
        } catch (e) { }

        goalBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                goalBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const goal = parseInt(btn.getAttribute('data-goal') || '10');
                updateUserSettings('dailyGoal', goal);
            });
        });
    }

    // Auto Play
    const autoPlayToggle = document.getElementById('autoPlayToggle') as HTMLInputElement;
    if (autoPlayToggle) {
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            autoPlayToggle.checked = savedJSON.autoPlay === true;
        } catch (e) { }

        autoPlayToggle.addEventListener('change', () => {
            updateUserSettings('autoPlay', autoPlayToggle.checked);
        });
    }

    // Show Examples
    const showExToggle = document.getElementById('showExamplesToggle') as HTMLInputElement;
    if (showExToggle) {
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            // Default true
            showExToggle.checked = savedJSON.showExamples !== false;
        } catch (e) { }

        showExToggle.addEventListener('change', () => {
            updateUserSettings('showExamples', showExToggle.checked);
        });
    }

    // Eye Care
    const eyeCareToggle = document.getElementById('eyeCareToggle') as HTMLInputElement;
    if (eyeCareToggle) {
        try {
            const savedJSON = JSON.parse(localStorage.getItem('userSettings') || '{}');
            const isEye = savedJSON.eyeCare === true;
            eyeCareToggle.checked = isEye;
            document.body.classList.toggle('eye-care-mode', isEye);
        } catch (e) { }

        eyeCareToggle.addEventListener('change', () => {
            const checked = eyeCareToggle.checked;
            document.body.classList.toggle('eye-care-mode', checked);
            localStorage.setItem('eyeCareMode', String(checked));
            updateUserSettings('eyeCare', checked);
        });
    }
}
