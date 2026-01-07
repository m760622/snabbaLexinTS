import React, { useState, useEffect } from 'react';

// Interfaces for State
interface UserSettings {
  [key: string]: any;
}

// Helper to update settings (mirrors original logic)
const updateUserSettings = (key: string, value: any) => {
  try {
    const saved = localStorage.getItem('userSettings');
    const settings: UserSettings = saved ? JSON.parse(saved) : {};
    settings[key] = value;
    localStorage.setItem('userSettings', JSON.stringify(settings));

    // Attempt global sync if manager exists
    if ((window as any).SettingsManager) {
      (window as any).SettingsManager.update(key, value);
    }
  } catch (e) {
    console.error('Failed to sync settings:', e);
  }
};

const SettingsView: React.FC = () => {
  // --- State Management ---
  const [expandedSection, setExpandedSection] = useState<string | null>('general');
  
  // General
  const [language, setLanguage] = useState<string>('both');

  // Appearance
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<boolean>(false);
  const [colorTheme, setColorTheme] = useState<string>('default');
  const [fontSize, setFontSize] = useState<string>('medium');
  const [animations, setAnimations] = useState<boolean>(true);

  // Sound
  const [soundEffects, setSoundEffects] = useState<boolean>(true);
  const [ttsSpeed, setTtsSpeed] = useState<number>(85);
  const [ttsVoice, setTtsVoice] = useState<string>('natural');
  const [dailyReminder, setDailyReminder] = useState<boolean>(false);
  const [reminderTime, setReminderTime] = useState<string>('18:00');

  // Learning
  const [dailyGoal, setDailyGoal] = useState<number>(10);
  const [autoPlay, setAutoPlay] = useState<boolean>(false);
  const [showExamples, setShowExamples] = useState<boolean>(true);
  const [focusMode, setFocusMode] = useState<boolean>(false);
  const [eyeCare, setEyeCare] = useState<boolean>(false);

  // Data (Storage)
  const [storageUsed, setStorageUsed] = useState<string>('0 KB');

  // --- Initialization (Effects) ---

  useEffect(() => {
    // Load Initial States from DOM/LocalStorage
    const savedSettingsStr = localStorage.getItem('userSettings');
    const savedSettings = savedSettingsStr ? JSON.parse(savedSettingsStr) : {};

    // Language
    setLanguage(localStorage.getItem('appLanguage') || 'both');

    // Appearance
    setDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    setMobileView(document.body.classList.contains('iphone-view'));
    setColorTheme(localStorage.getItem('colorTheme') || 'default');
    setFontSize(localStorage.getItem('fontSize') || 'medium');
    setAnimations(!document.body.classList.contains('reduce-motion'));

    // Sound
    setSoundEffects(localStorage.getItem('soundEnabled') !== 'false');
    setTtsSpeed(parseInt(localStorage.getItem('ttsSpeed') || '85'));
    setTtsVoice(localStorage.getItem('ttsVoice') || 'natural');
    setDailyReminder(!!savedSettings.dailyReminder); // Assuming stored in userSettings
    setReminderTime(savedSettings.reminderTime || '18:00');

    // Learning
    setDailyGoal(savedSettings.dailyGoal || 10);
    setAutoPlay(!!savedSettings.autoPlay);
    setShowExamples(savedSettings.showExamples !== false); // Default true
    setFocusMode(document.body.classList.contains('focus-mode'));
    setEyeCare(!!savedSettings.eyeCare);

    // Storage Calculation (Mock for now, or simple estimation)
    const calculateStorage = () => {
        let total = 0;
        for (let x in localStorage) {
            if (Object.prototype.hasOwnProperty.call(localStorage, x)) {
                total += (localStorage[x].length + x.length) * 2;
            }
        }
        setStorageUsed((total / 1024).toFixed(2) + ' KB');
    };
    calculateStorage();

  }, []);

  // --- Handlers ---

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Appearance Handlers
  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    const theme = checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateUserSettings('darkMode', checked);
  };

  const handleMobileViewChange = (checked: boolean) => {
    setMobileView(checked);
    document.body.classList.toggle('iphone-view', checked);
    localStorage.setItem('mobileView', String(checked));
    updateUserSettings('mobileView', checked);
    if ((window as any).MobileViewManager) {
        (window as any).MobileViewManager.apply(checked);
    }
  };

  const handleColorThemeChange = (theme: string) => {
    setColorTheme(theme);
    if (theme !== 'default') document.documentElement.setAttribute('data-color-theme', theme);
    else document.documentElement.removeAttribute('data-color-theme');
    localStorage.setItem('colorTheme', theme);
    updateUserSettings('colorTheme', theme);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    const sizeMap: Record<string, string> = { 'small': '14px', 'medium': '16px', 'large': '18px' };
    document.documentElement.style.fontSize = sizeMap[size];
    localStorage.setItem('fontSize', size);
    updateUserSettings('fontSize', size);
  };

  const handleAnimationsChange = (checked: boolean) => {
    setAnimations(checked);
    document.body.classList.toggle('reduce-motion', !checked);
    updateUserSettings('animations', checked);
  };

  // Sound Handlers
  const handleSoundEffectsChange = (checked: boolean) => {
    setSoundEffects(checked);
    localStorage.setItem('soundEnabled', String(checked));
    updateUserSettings('soundEffects', checked);
  };

  const handleTtsSpeedChange = (value: number) => {
    setTtsSpeed(value);
    localStorage.setItem('ttsSpeed', String(value));
    updateUserSettings('ttsSpeed', value);
  };

  const handleTtsVoiceChange = (voice: string) => {
    setTtsVoice(voice);
    localStorage.setItem('ttsVoice', voice);
    updateUserSettings('ttsVoicePreference', voice);
  };

  const testTTS = () => {
     const text = "Detta är ett test";
     if ('speechSynthesis' in window) {
         const utterance = new SpeechSynthesisUtterance(text);
         utterance.lang = 'sv-SE';
         utterance.rate = ttsSpeed / 100;
         window.speechSynthesis.speak(utterance);
     }
  };

  // Learning Handlers
  const handleDailyGoalChange = (goal: number) => {
      setDailyGoal(goal);
      updateUserSettings('dailyGoal', goal);
  };
  
  const handleAutoPlayChange = (checked: boolean) => {
      setAutoPlay(checked);
      updateUserSettings('autoPlay', checked);
  };

  const handleShowExamplesChange = (checked: boolean) => {
      setShowExamples(checked);
      updateUserSettings('showExamples', checked);
  };

  const handleFocusModeChange = (checked: boolean) => {
      setFocusMode(checked);
      document.body.classList.toggle('focus-mode', checked);
      localStorage.setItem('focusMode', String(checked));
      updateUserSettings('focusMode', checked);
  };

  const handleEyeCareChange = (checked: boolean) => {
      setEyeCare(checked);
      updateUserSettings('eyeCare', checked);
  };

  // Language Handler
  const handleLanguageChange = (lang: string) => {
      setLanguage(lang);
      localStorage.setItem('appLanguage', lang);
      if ((window as any).LanguageManager) {
        (window as any).LanguageManager.setLanguage(lang);
      } else {
        location.reload();
      }
  };

  // Data Handlers
  const exportData = () => {
    const data = JSON.stringify(localStorage);
    const blob = new Blob([data], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snabbalexin-backup-${new Date().toISOString().slice(0,10)}.json`;
    a.click();
  };

  const clearFavorites = () => {
      if(confirm('Are you sure you want to clear favorites?')) {
          localStorage.removeItem('favorites');
          alert('Favorites cleared');
      }
  };

  const clearAllData = () => {
      if(confirm('WARNING: This will delete ALL data. Continue?')) {
          localStorage.clear();
          location.reload();
      }
  };


  // --- Render Helpers ---

  const renderSectionHeader = (id: string, icon: string, titleSv: string, titleAr: string, iconClass: string) => (
    <div className="section-header" onClick={() => toggleSection(id)} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: expandedSection === id ? '10px' : '0'}}>
        <div className={`section-icon ${iconClass}`} style={{fontSize: '1.2rem', marginRight: '15px', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(255,255,255,0.1)'}}>{icon}</div>
        <div className="section-title-wrapper" style={{flex: 1}}>
            <h3 className="section-title" style={{margin: 0, fontSize: '1.1rem', color: '#fff'}}>
                <span className="sv-text">{titleSv}</span> <span className="ar-text" style={{opacity: 0.7, fontSize: '0.9em', marginLeft: '8px'}}>{titleAr}</span>
            </h3>
        </div>
        <svg className="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '20px', height: '20px', color: '#fff', transform: expandedSection === id ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s'}}>
            <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
    </div>
  );

  const renderToggle = (checked: boolean, onChange: (c: boolean) => void) => (
      <label className="toggle-switch" style={{position: 'relative', display: 'inline-block', width: '50px', height: '26px'}}>
          <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{opacity: 0, width: 0, height: 0}} />
          <span className="toggle-slider" style={{
              position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
              backgroundColor: checked ? '#22c55e' : '#ccc', transition: '.4s', borderRadius: '34px'
          }}>
              <span style={{
                  position: 'absolute', content: '""', height: '18px', width: '18px', left: '4px', bottom: '4px', 
                  backgroundColor: 'white', transition: '.4s', borderRadius: '50%',
                  transform: checked ? 'translateX(24px)' : 'translateX(0)'
              }}></span>
          </span>
      </label>
  );

  const Item = ({icon, nameSv, nameAr, children}: {icon: string, nameSv: string, nameAr: string, children: React.ReactNode}) => (
      <div className="settings-item" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
          <div className="item-left" style={{display: 'flex', alignItems: 'center'}}>
              <span className="item-icon" style={{marginRight: '12px', fontSize: '1.2rem'}}>{icon}</span>
              <div className="item-info">
                  <span className="item-name" style={{color: '#eee'}}>
                      <span className="sv-text">{nameSv}</span> <br/>
                      <span className="ar-text" style={{color: '#aaa', fontSize: '0.85em'}}>{nameAr}</span>
                  </span>
              </div>
          </div>
          {children}
      </div>
  );

  return (
    <div className="react-settings-container" style={{
        padding: '10px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '100%',
        boxSizing: 'border-box'
    }}>
        <h2 style={{ marginBottom: '20px', fontSize: '1.3rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', color: '#fff' }}>
            <span className="sv-text">Inställningar</span> / <span className="ar-text">الإعدادات</span>
        </h2>

        {/* --- General Section --- */}
        <section className={`settings-section glass-card ${expandedSection === 'general' ? 'expanded' : ''}`} style={{marginBottom: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)'}}>
            {renderSectionHeader('general', '🌍', 'Allmänt', 'عام', 'gradient-amber')}
            {expandedSection === 'general' && (
                <div className="section-content" style={{padding: '15px'}}>
                    <h4 className="settings-subtitle" style={{marginBottom: '10px', color: '#ccc'}}>
                        <span className="sv-text">Välj Språk</span> / <span className="ar-text">اختر اللغة</span>
                    </h4>
                    <div className="language-grid-premium" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px'}}>
                        {['sv', 'ar', 'both'].map((l) => (
                            <button key={l} 
                                onClick={() => handleLanguageChange(l)}
                                style={{
                                    padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', 
                                    background: language === l ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255,255,255,0.05)',
                                    borderColor: language === l ? '#22c55e' : 'transparent',
                                    color: '#fff', cursor: 'pointer'
                                }}>
                                {l === 'sv' ? '🇸🇪 Svenska' : l === 'ar' ? '🇸🇦 العربية' : '🌍 Båda'}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </section>

        {/* --- Appearance Section --- */}
        <section className={`settings-section glass-card ${expandedSection === 'appearance' ? 'expanded' : ''}`} style={{marginBottom: '15px', background: '#1e1e1e', borderRadius: '16px', overflow: 'hidden'}}>
             {renderSectionHeader('appearance', '🎨', 'Utseende', 'المظهر', 'gradient-blue')}
             {expandedSection === 'appearance' && (
                 <div className="section-content" style={{padding: '0 15px 15px'}}>
                     <Item icon="🌙" nameSv="Mörkt läge" nameAr="الوضع الداكن">
                         {renderToggle(darkMode, handleDarkModeChange)}
                     </Item>
                     <Item icon="📱" nameSv="Mobilvy" nameAr="عرض الجوال">
                         {renderToggle(mobileView, handleMobileViewChange)}
                     </Item>
                     
                     {/* Color Theme */}
                     <div className="settings-item" style={{padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                         <div style={{marginBottom: '10px', color: '#eee'}}>Färgtema / لون الثيم</div>
                         <div style={{display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                             {[
                                 {id: 'default', color: 'linear-gradient(135deg, #3b82f6, #60a5fa)'},
                                 {id: 'ocean', color: 'linear-gradient(135deg, #0ea5e9, #0284c7)'},
                                 {id: 'sunset', color: 'linear-gradient(135deg, #f97316, #ea580c)'},
                                 {id: 'forest', color: 'linear-gradient(135deg, #22c55e, #16a34a)'},
                                 {id: 'rose', color: 'linear-gradient(135deg, #ef4444, #b91c1c)'},
                                 {id: 'neon', color: 'linear-gradient(135deg, #0ea5e9, #22d3ee)'},
                             ].map(t => (
                                 <button key={t.id} 
                                    onClick={() => handleColorThemeChange(t.id)}
                                    style={{
                                        width: '32px', height: '32px', borderRadius: '50%', background: t.color, 
                                        border: colorTheme === t.id ? '2px solid white' : 'none', cursor: 'pointer',
                                        boxShadow: colorTheme === t.id ? '0 0 0 2px #333' : 'none'
                                    }} 
                                 />
                             ))}
                         </div>
                     </div>

                     {/* Font Size */}
                     <div className="settings-item" style={{padding: '12px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <div style={{color: '#eee'}}>Textstorlek / حجم الخط</div>
                        <div style={{display: 'flex', gap: '5px', background: '#333', borderRadius: '8px', padding: '2px'}}>
                            {['small', 'medium', 'large'].map(s => (
                                <button key={s} 
                                    onClick={() => handleFontSizeChange(s)}
                                    style={{
                                        background: fontSize === s ? '#555' : 'transparent',
                                        color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '6px', cursor: 'pointer',
                                        fontSize: s === 'small' ? '12px' : s === 'medium' ? '14px' : '16px'
                                    }}>
                                    A
                                </button>
                            ))}
                        </div>
                     </div>

                     <Item icon="✨" nameSv="Animationer" nameAr="الحركات">
                         {renderToggle(animations, handleAnimationsChange)}
                     </Item>
                 </div>
             )}
        </section>

        {/* --- Sound Section --- */}
        <section className={`settings-section glass-card ${expandedSection === 'sound' ? 'expanded' : ''}`} style={{marginBottom: '15px', background: '#1e1e1e', borderRadius: '16px', overflow: 'hidden'}}>
             {renderSectionHeader('sound', '🔔', 'Ljud & Notiser', 'الصوت والإشعارات', 'gradient-blue')}
             {expandedSection === 'sound' && (
                 <div className="section-content" style={{padding: '0 15px 15px'}}>
                     <Item icon="🔊" nameSv="Ljudeffekter" nameAr="المؤثرات الصوتية">
                         {renderToggle(soundEffects, handleSoundEffectsChange)}
                     </Item>

                     {/* TTS Speed */}
                     <div className="settings-item" style={{padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                         <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', color: '#eee'}}>
                            <span>Uttalshastighet / سرعة النطق</span>
                            <span>{ttsSpeed}%</span>
                         </div>
                         <input type="range" min="50" max="150" value={ttsSpeed} 
                            onChange={(e) => handleTtsSpeedChange(parseInt(e.target.value))}
                            style={{width: '100%'}} 
                         />
                     </div>

                     {/* Voice Selection */}
                     <div className="settings-item" style={{padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <div style={{marginBottom: '10px', color: '#eee'}}>Rösttyp / نوع الصوت</div>
                        <div style={{display: 'flex', gap: '10px'}}>
                            {[
                                {id: 'natural', icon: '🌍', label: 'Natural'},
                                {id: 'female', icon: '👩', label: 'Female'},
                                {id: 'male', icon: '👨', label: 'Male'}
                            ].map(v => (
                                <button key={v.id} 
                                    onClick={() => handleTtsVoiceChange(v.id)}
                                    style={{
                                        flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #333',
                                        background: ttsVoice === v.id ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.05)',
                                        borderColor: ttsVoice === v.id ? '#3b82f6' : '#333',
                                        color: '#fff', cursor: 'pointer', fontSize: '1.2rem'
                                    }}>
                                    {v.icon}
                                </button>
                            ))}
                        </div>
                     </div>

                     <div style={{textAlign: 'center', padding: '15px 0'}}>
                         <button onClick={testTTS} style={{
                             background: '#333', color: '#fff', border: 'none', padding: '10px 20px', 
                             borderRadius: '20px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px'
                         }}>
                             <span>🔊</span> Testa uttal
                         </button>
                     </div>
                 </div>
             )}
        </section>

        {/* --- Learning Section --- */}
        <section className={`settings-section glass-card ${expandedSection === 'learning' ? 'expanded' : ''}`} style={{marginBottom: '15px', background: '#1e1e1e', borderRadius: '16px', overflow: 'hidden'}}>
             {renderSectionHeader('learning', '📚', 'Lärverktyg', 'أدوات التعلم', 'gradient-green')}
             {expandedSection === 'learning' && (
                 <div className="section-content" style={{padding: '0 15px 15px'}}>
                     
                     {/* Daily Goal */}
                     <div className="settings-item" style={{padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px'}}>
                             <div style={{color: '#eee'}}>Dagligt mål / الهدف اليومي</div>
                        </div>
                        <div style={{display: 'flex', gap: '10px'}}>
                            {[5, 10, 20, 50].map(g => (
                                <button key={g} 
                                    onClick={() => handleDailyGoalChange(g)}
                                    style={{
                                        flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #333',
                                        background: dailyGoal === g ? '#22c55e' : 'rgba(255,255,255,0.05)',
                                        color: dailyGoal === g ? '#000' : '#fff', cursor: 'pointer', fontWeight: 'bold'
                                    }}>
                                    {g}
                                </button>
                            ))}
                        </div>
                     </div>

                     <Item icon="▶️" nameSv="Auto-spela ljud" nameAr="تشغيل الصوت تلقائياً">
                         {renderToggle(autoPlay, handleAutoPlayChange)}
                     </Item>
                     <Item icon="💬" nameSv="Visa exempel" nameAr="عرض الأمثلة">
                         {renderToggle(showExamples, handleShowExamplesChange)}
                     </Item>
                     <Item icon="🧘" nameSv="Fokusläge" nameAr="وضع التركيز">
                         {renderToggle(focusMode, handleFocusModeChange)}
                     </Item>
                     <Item icon="👁️" nameSv="Ögonvård" nameAr="حماية العين">
                         {renderToggle(eyeCare, handleEyeCareChange)}
                     </Item>
                 </div>
             )}
        </section>

        {/* --- Data Section --- */}
        <section className={`settings-section glass-card ${expandedSection === 'data' ? 'expanded' : ''}`} style={{marginBottom: '15px', background: '#1e1e1e', borderRadius: '16px', overflow: 'hidden'}}>
             {renderSectionHeader('data', '💾', 'Data & Sekretess', 'البيانات والخصوصية', 'gradient-cyan')}
             {expandedSection === 'data' && (
                 <div className="section-content" style={{padding: '0 15px 15px'}}>
                     <div onClick={exportData} style={{display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #333', cursor: 'pointer'}}>
                         <span>📤 Exportera data / تصدير البيانات</span>
                         <span>›</span>
                     </div>
                     <div onClick={() => document.getElementById('react-import-file')?.click()} style={{display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #333', cursor: 'pointer'}}>
                         <span>📥 Importera data / استيراد البيانات</span>
                         <span>›</span>
                     </div>
                     <input type="file" id="react-import-file" accept=".json" style={{display: 'none'}} />
                     
                     <div onClick={clearFavorites} style={{display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #333', cursor: 'pointer', color: '#ef4444'}}>
                         <span>🗑️ Rensa favoriter / مسح المفضلة</span>
                         <span>›</span>
                     </div>
                     <div onClick={clearAllData} style={{display: 'flex', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #333', cursor: 'pointer', color: '#ef4444'}}>
                         <span>⚠️ Rensa all data / مسح جميع البيانات</span>
                         <span>›</span>
                     </div>

                     <div style={{marginTop: '20px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px'}}>
                         <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', marginBottom: '5px'}}>
                             <span>Använt lagringsutrymme</span>
                             <span>{storageUsed}</span>
                         </div>
                         <div style={{width: '100%', height: '6px', background: '#333', borderRadius: '3px'}}>
                             <div style={{width: '10%', height: '100%', background: '#22c55e', borderRadius: '3px'}}></div>
                         </div>
                     </div>
                 </div>
             )}
        </section>

        {/* --- About Section --- */}
        <section className={`settings-section glass-card ${expandedSection === 'about' ? 'expanded' : ''}`} style={{marginBottom: '15px', background: '#1e1e1e', borderRadius: '16px', overflow: 'hidden'}}>
             {renderSectionHeader('about', 'ℹ️', 'Om SnabbaLexin', 'حول التطبيق', 'gradient-rose')}
             {expandedSection === 'about' && (
                 <div className="section-content" style={{padding: '0 15px 15px'}}>
                     <Item icon="📱" nameSv="Version" nameAr="الإصدار">
                         <span className="version-badge" style={{background: '#333', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8em'}}>v3.0.0</span>
                     </Item>
                     <div style={{textAlign: 'center', marginTop: '20px', opacity: 0.7, fontSize: '0.9em'}}>
                        <p>SnabbaLexin © 2025</p>
                        <p>Made with ❤️ for language learners</p>
                     </div>
                 </div>
             )}
        </section>

    </div>
  );
};

export default SettingsView;
