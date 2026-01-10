/**
 * Shared Settings UI Generator
 * Generates identical HTML for both the full Settings Page and the Quick Settings Popup.
 */

export class SettingsUI {
    static generateSections(): string {
        const header = `
            <div class="settings-menu-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px;">
                <h2 class="settings-menu-title" style="font-size: 1.5rem; margin: 0;">Inställningar</h2>
                <button class="close-x-btn" onclick="document.getElementById('settingsBtn').click()" style="background: rgba(255,255,255,0.1); border: none; width: 32px; height: 32px; border-radius: 50%; color: #fff; cursor: pointer;">✕</button>
            </div>
        `;

        const sections = [
            this.getGeneralSection(),
            this.getAppearanceSection(),
            this.getSoundSection(),
            this.getProgressSection()
        ];

        return header + '<div class="settings-content-scroll">' + sections.join('') + '</div>' + this.getFooter();
    }

    private static getGeneralSection(): string {
        return `
            <section class="settings-section glass-card expanded" data-section="general">
                <div class="section-header" onclick="toggleSection('general')">
                    <div class="section-icon gradient-green">🌍</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title">Allmänt</h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="general-content">
                    <div class="section-inner">
                    <div class="language-selection-container">
                        <div class="language-grid-compact" id="languageSelector">
                            <button class="lang-icon-btn" data-lang="sv" title="Svenska">
                                <span class="lang-flag">🇸🇪</span>
                            </button>
                            <button class="lang-icon-btn" data-lang="ar" title="العربية">
                                <span class="lang-flag">🇸🇦</span>
                            </button>
                            <button class="lang-icon-btn" data-lang="both" title="Båda">
                                <span class="lang-flag">🌍</span>
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            </section>`;
    }

    private static getProgressSection(): string {
        return `
            <section class="settings-section glass-card" data-section="progress">
                <div class="section-header" onclick="toggleSection('progress')">
                    <div class="section-icon gradient-amber">🏆</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title">Framsteg</h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="progress-content">
                    <div class="section-inner">
                        <div class="settings-item clickable" onclick="if(window.app) window.app.updateDailyProgressBar(); document.getElementById('progressModal').style.display='flex';">
                            <div class="item-left">
                                <span class="item-icon">📊</span>
                                <div class="item-info">
                                    <span class="item-name">Visa statistik</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>`;
    }

    private static getFooter(): string {
        return `
            <div class="settings-menu-footer" style="padding: 20px;">
                <button class="settings-done-btn" onclick="document.getElementById('settingsBtn').click()">
                    Klar / تم
                </button>
            </div>
        `;
    }

    private static getAppearanceSection(): string {
        return `
            <section class="settings-section glass-card" data-section="appearance">
                <div class="section-header" onclick="toggleSection('appearance')">
                    <div class="section-icon gradient-blue">🎨</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title">Utseende</h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="appearance-content">
                    <div class="section-inner">
                    <!-- Dark Mode Toggle -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🌙</span>
                            <div class="item-info">
                                <span class="item-name">Mörkt läge</span>
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
                                <span class="item-name">Mobilvy</span>
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
                                <span class="item-name">Färgtema</span>
                            </div>
                        </div>
                        <div class="color-themes" id="colorThemes">
                            <button class="color-btn active" data-theme="default" style="background: linear-gradient(135deg, #3b82f6, #60a5fa)" title="Standard"></button>
                            <button class="color-btn" data-theme="ocean" style="background: linear-gradient(135deg, #0ea5e9, #0284c7)" title="Ocean"></button>
                            <button class="color-btn" data-theme="sunset" style="background: linear-gradient(135deg, #f97316, #ea580c)" title="Sunset"></button>
                            <button class="color-btn" data-theme="forest" style="background: linear-gradient(135deg, #22c55e, #16a34a)" title="Forest"></button>
                            <button class="color-btn" data-theme="rose" style="background: linear-gradient(135deg, #ef4444, #b91c1c)" title="Ruby"></button>
                        </div>
                    </div>
                </div>
            </section>`;
    }

    private static getSoundSection(): string {
        return `
            <section class="settings-section glass-card" data-section="sound">
                <div class="section-header" onclick="toggleSection('sound')">
                    <div class="section-icon gradient-amber">🔔</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title">Ljud</h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="sound-content">
                    <div class="section-inner">
                    <!-- Sound Effects -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🔊</span>
                            <div class="item-info">
                                <span class="item-name">Ljudeffekter</span>
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
                                <span class="item-name">Uttalshastighet</span>
                            </div>
                        </div>
                        <div class="slider-control">
                            <input type="range" id="ttsSpeedSlider" min="50" max="150" value="85">
                            <span class="slider-value" id="ttsSpeedValue">85%</span>
                        </div>
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
                        <h3 class="section-title">LÄRVERKTYG</h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="learning-content">
                    <div class="section-inner">
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
                        <h3 class="section-title">SNABBNAVIGERING</h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="navigation-content">
                    <div class="section-inner">
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
                        <h3 class="section-title">DATA & SEKRETESS</h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="data-content">
                    <div class="section-inner">
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
                        <h3 class="section-title">OM SNABBALEXIN</h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="about-content">
                    <div class="section-inner">
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
