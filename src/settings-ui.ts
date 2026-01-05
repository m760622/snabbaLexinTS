/**
 * Shared Settings UI Generator
 * Generates identical HTML for both the full Settings Page and the Quick Settings Popup.
 */

export class SettingsUI {
    static generateSections(): string {
        const sections = [
            this.getGeneralSection(),
            this.getAppearanceSection(),
            this.getSoundSection(),
            this.getLearningSection(),
            this.getNavigationSection(),
            this.getDataSection(),
            this.getAboutSection()
        ];

        return sections.join('');
    }

    private static getGeneralSection(): string {
        return `
            <section class="settings-section glass-card expanded" data-section="general">
                <div class="section-header" onclick="toggleSection('general')">
                    <div class="section-icon gradient-amber">🌍</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Allmänt</span><span class="ar-text">عام</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="general-content">
                    <div class="language-selection-container">
                        <h4 class="settings-subtitle"><span class="sv-text">Välj Språk</span><span class="ar-text">اختر اللغة</span></h4>
                        <div class="language-grid-premium" id="languageSelector">
                            <button class="lang-card-premium" data-lang="sv">
                                <span class="lang-flag-large">🇸🇪</span>
                                <span class="lang-name-large">Svenska</span>
                                <span class="lang-check">✓</span>
                            </button>
                            <button class="lang-card-premium" data-lang="ar">
                                <span class="lang-flag-large">🇸🇦</span>
                                <span class="lang-name-large">العربية</span>
                                <span class="lang-check">✓</span>
                            </button>
                            <button class="lang-card-premium" data-lang="both">
                                <span class="lang-flag-large">🌍</span>
                                <span class="lang-name-large"><span class="sv-text">Båda</span><span class="ar-text">كلتا</span></span>
                                <span class="lang-check">✓</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>`;
    }

    private static getAppearanceSection(): string {
        return `
            <section class="settings-section glass-card" data-section="appearance">
                <div class="section-header" onclick="toggleSection('appearance')">
                    <div class="section-icon gradient-blue">🎨</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Utseende</span><span class="ar-text">المظهر</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="appearance-content">
                    <!-- Dark Mode Toggle -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🌙</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Mörkt läge</span><span class="ar-text">الوضع الداكن</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="darkModeToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Mobile View Toggle -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">📱</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Mobilvy</span><span class="ar-text">عرض الجوال</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="mobileViewToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Color Theme -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🎨</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Färgtema</span><span class="ar-text">لون الثيم</span></span>
                            </div>
                        </div>
                        <div class="color-themes" id="colorThemes">
                            <button class="color-btn active" data-theme="default" style="background: linear-gradient(135deg, #3b82f6, #60a5fa)" title="Standard"></button>
                            <button class="color-btn" data-theme="ocean" style="background: linear-gradient(135deg, #0ea5e9, #0284c7)" title="Ocean"></button>
                            <button class="color-btn" data-theme="sunset" style="background: linear-gradient(135deg, #f97316, #ea580c)" title="Sunset"></button>
                            <button class="color-btn" data-theme="forest" style="background: linear-gradient(135deg, #22c55e, #16a34a)" title="Forest"></button>
                            <button class="color-btn" data-theme="rose" style="background: linear-gradient(135deg, #ef4444, #b91c1c)" title="Ruby"></button>
                            <button class="color-btn" data-theme="neon" style="background: linear-gradient(135deg, #0ea5e9, #22d3ee)" title="Neon"></button>
                        </div>
                    </div>

                    <!-- Font Size -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🔤</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Textstorlek</span><span class="ar-text">حجم الخط</span></span>
                            </div>
                        </div>
                        <div class="font-size-control">
                            <button class="font-btn" data-size="small">A</button>
                            <button class="font-btn active" data-size="medium">A</button>
                            <button class="font-btn" data-size="large">A</button>
                        </div>
                    </div>

                    <!-- Reduce Motion -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">✨</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Animationer</span><span class="ar-text">الحركات</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="animationsToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </section>`;
    }

    private static getSoundSection(): string {
        return `
            <section class="settings-section glass-card" data-section="sound">
                <div class="section-header" onclick="toggleSection('sound')">
                    <div class="section-icon gradient-blue">🔔</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Ljud & Notiser</span><span class="ar-text">الصوت والإشعارات</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="sound-content">
                    <!-- Sound Effects -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🔊</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Ljudeffekter</span><span class="ar-text">المؤثرات الصوتية</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="soundEffectsToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- TTS Speed -->
                    <div class="settings-item slider-item">
                        <div class="item-left">
                            <span class="item-icon">🗣️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Uttalshastighet</span><span class="ar-text">سرعة النطق</span></span>
                            </div>
                        </div>
                        <div class="slider-control">
                            <input type="range" id="ttsSpeedSlider" min="50" max="150" value="85">
                            <span class="slider-value" id="ttsSpeedValue">85%</span>
                        </div>
                    </div>
                    
                     <!-- TTS Voice Selection -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🎭</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Rösttyp</span><span class="ar-text">نوع الصوت</span></span>
                            </div>
                        </div>
                        <div class="voice-selector">
                            <button class="voice-btn active" data-voice="natural" title="Naturlig / طبيعي">🌍</button>
                            <button class="voice-btn" data-voice="female" title="Kvinna / أنثى">👩</button>
                            <button class="voice-btn" data-voice="male" title="Man / ذكر">👨</button>
                        </div>
                    </div>


                    <!-- Test TTS -->
                    <div class="settings-item center-item">
                        <button class="test-btn" id="testTTSBtn">
                            <span>🔊</span> <span class="sv-text">Testa uttal</span><span class="ar-text">اختبر النطق</span>
                        </button>
                    </div>

                    <!-- Daily Reminder -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">⏰</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Daglig påminnelse</span><span class="ar-text">تذكير يومي</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="reminderToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Reminder Time -->
                    <div class="settings-item" id="reminderTimeItem" style="display: none;">
                        <div class="item-left">
                            <span class="item-icon">🕐</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Påminnelsetid</span><span class="ar-text">وقت التذكير</span></span>
                            </div>
                        </div>
                        <input type="time" id="reminderTime" value="18:00" class="time-input">
                    </div>
                </div>
            </section>`;
    }

    private static getLearningSection(): string {
        return `
            <section class="settings-section glass-card" data-section="learning">
                <div class="section-header" onclick="toggleSection('learning')">
                    <div class="section-icon gradient-green">📚</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Lärverktyg</span><span class="ar-text">أدوات التعلم</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="learning-content">
                    <!-- Daily Goal -->
                    <div class="settings-item slider-item">
                        <div class="item-left">
                            <span class="item-icon">🎯</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Dagligt mål</span><span class="ar-text">الهدف اليومي</span></span>
                            </div>
                        </div>
                        <div class="goal-selector">
                            <button class="goal-btn" data-goal="5">5</button>
                            <button class="goal-btn active" data-goal="10">10</button>
                            <button class="goal-btn" data-goal="20">20</button>
                            <button class="goal-btn" data-goal="50">50</button>
                        </div>
                    </div>

                    <!-- Auto-Play Audio -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">▶️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Auto-spela ljud</span><span class="ar-text">تشغيل الصوت تلقائياً</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="autoPlayToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Show Examples -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">💬</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Visa exempel</span><span class="ar-text">عرض الأمثلة</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="showExamplesToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Focus Mode -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🧘</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Fokusläge</span><span class="ar-text">وضع التركيز</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="focusModeToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Eye Care -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">👁️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Ögonvård</span><span class="ar-text">حماية العين</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="eyeCareToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </section>`;
    }

    private static getNavigationSection(): string {
        // Quick Navigation - usually only needed in the full settings page
        return `
            <section class="settings-section glass-card" data-section="navigation">
                <div class="section-header" onclick="toggleSection('navigation')">
                    <div class="section-icon gradient-amber">🧭</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Snabbnavigering</span><span class="ar-text">التنقل السريع</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="navigation-content">
                    <div class="quick-links-grid">
                        <a href="games/games.html" class="quick-link-card">
                            <span class="quick-link-icon">🎮</span>
                            <span class="quick-link-label"><span class="sv-text">Spel</span><span class="ar-text">ألعاب</span></span>
                        </a>
                        <a href="learn/learn.html" class="quick-link-card">
                            <span class="quick-link-icon">📖</span>
                            <span class="quick-link-label"><span class="sv-text">Grammatik</span><span class="ar-text">القواعد</span></span>
                        </a>
                        <a href="profile.html" class="quick-link-card">
                            <span class="quick-link-icon">👤</span>
                            <span class="quick-link-label"><span class="sv-text">Min Profil</span><span class="ar-text">ملفي</span></span>
                        </a>
                        <a href="add.html" class="quick-link-card">
                            <span class="quick-link-icon">➕</span>
                            <span class="quick-link-label"><span class="sv-text">Lägg till</span><span class="ar-text">إضافة</span></span>
                        </a>
                    </div>
                </div>
            </section>`;
    }

    private static getDataSection(): string {
        return `
            <section class="settings-section glass-card" data-section="data">
                <div class="section-header" onclick="toggleSection('data')">
                    <div class="section-icon gradient-cyan">💾</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Data & Sekretess</span><span class="ar-text">البيانات والخصوصية</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="data-content">
                    <!-- Export Data -->
                    <div class="settings-item clickable" onclick="exportData()">
                        <div class="item-left">
                            <span class="item-icon">📤</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Exportera data</span><span class="ar-text">تصدير البيانات</span></span>
                            </div>
                        </div>
                        <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- Import Data -->
                    <div class="settings-item clickable" onclick="document.getElementById('importFile').click()">
                        <div class="item-left">
                            <span class="item-icon">📥</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Importera data</span><span class="ar-text">استيراد البيانات</span></span>
                            </div>
                        </div>
                        <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                    <input type="file" id="importFile" accept=".json" style="display: none;">

                    <!-- Clear Favorites -->
                    <div class="settings-item clickable danger" onclick="clearFavorites()">
                        <div class="item-left">
                            <span class="item-icon">🗑️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Rensa favoriter</span><span class="ar-text">مسح المفضلة</span></span>
                            </div>
                        </div>
                        <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- Clear All Data -->
                    <div class="settings-item clickable danger" onclick="clearAllData()">
                        <div class="item-left">
                            <span class="item-icon">⚠️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Rensa all data</span><span class="ar-text">مسح جميع البيانات</span></span>
                            </div>
                        </div>
                        <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- Storage Info -->
                    <div class="storage-info">
                        <div class="storage-header">
                            <span><span class="sv-text">Använt lagringsutrymme</span><span class="ar-text">المساحة المستخدمة</span></span>
                            <span id="storageUsed">0 KB</span>
                        </div>
                        <div class="storage-bar-bg">
                            <div class="storage-bar-fill" id="storageBar"></div>
                        </div>
                    </div>
                </div>
            </section>`;
    }

    private static getAboutSection(): string {
        return `
            <section class="settings-section glass-card" data-section="about">
                <div class="section-header" onclick="toggleSection('about')">
                    <div class="section-icon gradient-rose">ℹ️</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Om SnabbaLexin</span><span class="ar-text">حول التطبيق</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="about-content">
                    <!-- Version -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">📱</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Version</span><span class="ar-text">الإصدار</span></span>
                            </div>
                        </div>
                        <span class="version-badge">v3.0.0</span>
                    </div>

                     <!-- Links -->
                     <!-- Links -->
                        <a href="changelog.html" class="settings-item clickable">
                            <div class="item-left">
                                <span class="item-icon">📋</span>
                                <div class="item-info">
                                    <span class="item-name"><span class="sv-text">Ändringslogg</span><span class="ar-text">سجل التغييرات</span></span>
                                </div>
                            </div>
                            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </a>
                        <a href="device.html" class="settings-item clickable">
                            <div class="item-left">
                                <span class="item-icon">🖥️</span>
                                <div class="item-info">
                                    <span class="item-name"><span class="sv-text">Enhetsinformation</span><span class="ar-text">معلومات الجهاز</span></span>
                                </div>
                            </div>
                            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </a>

                    <!-- Copyright -->
                    <div class="copyright-info">
                        <p>SnabbaLexin © 2025</p>
                        <p><span class="sv-text">Made with ❤️ for language learners</span><span class="ar-text">صنع بحب ❤️ لمتعلمي اللغات</span></p>
                    </div>
                </div>
            </section>`;
    }
}
