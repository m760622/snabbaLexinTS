import React, { useState, useEffect } from 'react';
import { showToast } from '../../utils/utils';

/**
 * FullSettings Component
 * Refined for Mobile & Advanced Customization
 */

interface FullSettingsProps {
  onClose: () => void;
  accentColor: string;
  onAccentChange: (color: string) => void;
  onOpenChangelog: () => void;
  onOpenDeviceInfo: () => void;
}

const FullSettings: React.FC<FullSettingsProps> = ({ onClose, accentColor, onAccentChange, onOpenChangelog, onOpenDeviceInfo }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('general');
  const [language, setLanguage] = useState('both');
  const [darkMode, setDarkMode] = useState(false);
  const [mobileView, setMobileView] = useState(true);
  const [ttsSpeed, setTtsSpeed] = useState<number>(85);
  const [fontSize, setFontSize] = useState<number>(100); // Percentage
  const [dailyGoal, setDailyGoal] = useState<number>(10);
  
  // New Settings States
  const [autoPlay, setAutoPlay] = useState(false);
  const [showExamples, setShowExamples] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [eyeCare, setEyeCare] = useState(false);
  const [animations, setAnimations] = useState(true);
  const [voiceType, setVoiceType] = useState('natural');

  useEffect(() => {
    const savedSettingsStr = localStorage.getItem('userSettings');
    const savedSettings = savedSettingsStr ? JSON.parse(savedSettingsStr) : {};

    setLanguage(localStorage.getItem('appLanguage') || 'both');
    setDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');
    
    setMobileView(localStorage.getItem('mobileView') !== 'false');
    setTtsSpeed(parseInt(localStorage.getItem('ttsSpeed') || '85'));
    setFontSize(parseInt(localStorage.getItem('fontSizePercent') || '100'));
    setDailyGoal(savedSettings.dailyGoal || 10);

    // Load new settings
    setAutoPlay(savedSettings.autoPlay || false);
    setShowExamples(savedSettings.showExamples !== false); // Default true
    setFocusMode(localStorage.getItem('focusMode') === 'true');
    setEyeCare(savedSettings.eyeCare || false);
    setAnimations(savedSettings.animations !== false); // Default true
    setVoiceType(localStorage.getItem('ttsVoicePreference') || 'natural');
  }, []);

  const saveSetting = (key: string, value: any) => {
    const saved = JSON.parse(localStorage.getItem('userSettings') || '{}');
    saved[key] = value;
    localStorage.setItem('userSettings', JSON.stringify(saved));
  };

  const handleToggle = (key: string, value: boolean, setter: (v: boolean) => void, storageKey?: string) => {
      setter(value);
      saveSetting(key, value);
      if (storageKey) localStorage.setItem(storageKey, String(value));
      
      if (key === 'focusMode') document.body.classList.toggle('focus-mode', value);
      if (key === 'eyeCare') document.body.classList.toggle('eye-care-mode', value);
      if (key === 'animations') document.body.classList.toggle('reduce-motion', !value);
      if (key === 'mobileView') {
           document.body.classList.toggle('iphone-view', value);
           if ((window as any).MobileViewManager) (window as any).MobileViewManager.apply(value);
      }
  };
  
  const handleVoiceChange = (voice: string) => {
      setVoiceType(voice);
      localStorage.setItem('ttsVoicePreference', voice);
      saveSetting('ttsVoicePreference', voice);
  };

  const handleGoalChange = (goal: number) => {
      setDailyGoal(goal);
      saveSetting('dailyGoal', goal);
      localStorage.setItem('dailyGoal', String(goal));
  };

  const handleDataAction = (action: 'export' | 'clearFav' | 'reset') => {
      if (action === 'export') {
          if ((window as any).ExportManager) (window as any).ExportManager.exportToJSON();
          else showToast('Export module not loaded', { type: 'error' });
      } else if (action === 'clearFav') {
          if (confirm('Rensa alla favoriter? / مسح كل المفضلة؟')) {
              localStorage.removeItem('snabbaLexin_favorites');
              window.location.reload();
          }
      } else if (action === 'reset') {
          if (confirm('Återställ allt? / إعادة ضبط المصنع؟')) {
              localStorage.clear();
              window.location.reload();
          }
      }
  };

  const handleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    const theme = checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    saveSetting('darkMode', checked);
  };

  const handleFontSize = (value: number) => {
    setFontSize(value);
    localStorage.setItem('fontSizePercent', String(value));
    // Apply scale to root
    const scale = value / 100;
    document.documentElement.style.setProperty('--app-font-scale', String(scale));
    // Also try standard font-size approach
    document.documentElement.style.fontSize = `${16 * scale}px`;
  };

  const Section: React.FC<{id: string, icon: string, titleSv: string, titleAr: string, children: React.ReactNode}> = ({ id, icon, titleSv, titleAr, children }) => {
    const isExpanded = expandedSection === id;
    return (
      <section style={{...styles.section, borderColor: isExpanded ? `${accentColor}66` : 'rgba(255,255,255,0.1)'}}>
        <div onClick={() => setExpandedSection(isExpanded ? null : id)} style={styles.sectionHeader}>
          <div style={{...styles.sectionIconContainer, background: isExpanded ? `${accentColor}33` : '#2c2c2e', color: isExpanded ? accentColor : '#fff'}}>{icon}</div>
          <div style={{ flex: 1 }}>
            <h3 style={styles.sectionTitle}>
              <span className="sv-text">{titleSv}</span> 
              <span className="ar-text" style={styles.arTitle}>{titleAr}</span>
            </h3>
          </div>
          <div style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.3s', opacity: 0.5 }}>▼</div>
        </div>
        {isExpanded && <div style={styles.sectionContent}>{children}</div>}
      </section>
    );
  };

  const ToggleItem: React.FC<{icon: string, nameSv: string, nameAr: string, checked: boolean, onChange: (c: boolean) => void}> = ({ icon, nameSv, nameAr, checked, onChange }) => (
    <div style={styles.item}>
      <div style={styles.itemLeft}>
        <span style={styles.itemIcon}>{icon}</span>
        <div>
          <div style={{ color: '#eee', fontSize: '0.95rem' }}>{nameSv}</div>
          <div className="ar-text" style={{ color: '#888', fontSize: '0.8rem' }}>{nameAr}</div>
        </div>
      </div>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={styles.checkbox} />
    </div>
  );

  return (
    <div className="full-settings-modal" style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div style={styles.headerRow}>
            <h2 style={styles.header}>Inställningar</h2>
            <button onClick={onClose} style={styles.closeCircle}>×</button>
        </div>

        <div style={styles.scrollArea}>
            <Section id="general" icon="🌍" titleSv="Allmänt" titleAr="عام">
                <div style={styles.grid}>
                {['sv', 'ar', 'both'].map(l => (
                    <button key={l} onClick={() => { localStorage.setItem('appLanguage', l); window.location.reload(); }} 
                        style={{...styles.button, borderColor: language === l ? accentColor : '#333', color: language === l ? accentColor : '#fff', background: language === l ? `${accentColor}22` : 'transparent'}}>
                        {l === 'sv' ? '🇸🇪' : l === 'ar' ? '🇸🇦' : '🌍'}
                    </button>
                ))}
                </div>
            </Section>

            <Section id="appearance" icon="🎨" titleSv="Utseende" titleAr="المظهر">
                <ToggleItem icon="🌙" nameSv="Mörkt läge" nameAr="الوضع الداكن" checked={darkMode} onChange={handleDarkMode} />
                <ToggleItem icon="📱" nameSv="Mobilvy" nameAr="عرض الجوال" checked={mobileView} onChange={(c) => handleToggle('mobileView', c, setMobileView, 'mobileView')} />
                <ToggleItem icon="✨" nameSv="Animationer" nameAr="تأثيرات حركية" checked={animations} onChange={(c) => handleToggle('animations', c, setAnimations)} />
                
                <div style={{ margin: '15px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.9rem' }}>Textstorlek / حجم الخط</span>
                        <span style={{ color: accentColor, fontWeight: 'bold' }}>{fontSize}%</span>
                    </div>
                    <input type="range" min="80" max="130" value={fontSize} onChange={(e: any) => handleFontSize(parseInt(e.target.value))} style={{ width: '100%', accentColor: accentColor } as any} />
                </div>
                <div style={{ marginTop: '15px' }}>
                    <div style={{ color: '#888', marginBottom: '10px', fontSize: '0.75rem' }}>Accentfärg</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e'].map(c => (
                            <button key={c} onClick={() => onAccentChange(c)} style={{ width: '35px', height: '35px', borderRadius: '10px', background: c, border: accentColor === c ? '3px solid #fff' : 'none', cursor: 'pointer' }} />
                        ))}
                    </div>
                </div>
            </Section>

            <Section id="sound" icon="🔔" titleSv="Ljud" titleAr="الصوت">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.9rem' }}>Hastighet / سرعة النطق</span>
                    <span style={{ color: accentColor, fontWeight: 'bold' }}>{ttsSpeed}%</span>
                </div>
                <input type="range" min="50" max="150" value={ttsSpeed} onChange={(e: any) => { setTtsSpeed(e.target.value); localStorage.setItem('ttsSpeed', e.target.value); }} style={{ width: '100%', accentColor: accentColor } as any} />
                
                <div style={{marginTop: '15px', marginBottom: '15px'}}>
                     <div style={{ color: '#888', marginBottom: '8px', fontSize: '0.8rem' }}>Rösttyp / نوع الصوت</div>
                     <div style={{display: 'flex', gap: '8px'}}>
                        {['natural', 'female', 'male'].map(v => (
                            <button key={v} onClick={() => handleVoiceChange(v)} 
                                style={{
                                    flex: 1, padding: '8px', borderRadius: '8px', 
                                    background: voiceType === v ? `${accentColor}33` : '#333',
                                    border: `1px solid ${voiceType === v ? accentColor : 'transparent'}`,
                                    color: voiceType === v ? accentColor : '#bbb'
                                }}>
                                {v === 'natural' ? '✨ Natural' : v === 'female' ? '👩 Female' : '👨 Male'}
                            </button>
                        ))}
                     </div>
                </div>

                <div style={{marginTop: '10px'}}>
                     <ToggleItem icon="🔊" nameSv="Auto-uppspelning" nameAr="تشغيل تلقائي للصوت" checked={autoPlay} onChange={(c) => handleToggle('autoPlay', c, setAutoPlay)} />
                </div>
            </Section>

            <Section id="learning" icon="📚" titleSv="Inlärning" titleAr="التعلم">
                <ToggleItem icon="📝" nameSv="Visa exempel" nameAr="إظهار الأمثلة" checked={showExamples} onChange={(c) => handleToggle('showExamples', c, setShowExamples)} />
                <ToggleItem icon="🎯" nameSv="Fokusläge" nameAr="وضع التركيز" checked={focusMode} onChange={(c) => handleToggle('focusMode', c, setFocusMode, 'focusMode')} />
                <ToggleItem icon="👁️" nameSv="Ögonvård" nameAr="حماية العين" checked={eyeCare} onChange={(c) => handleToggle('eyeCare', c, setEyeCare)} />
                
                <div style={{marginTop: '15px'}}>
                     <div style={{ color: '#888', marginBottom: '8px', fontSize: '0.8rem' }}>Dagligt mål / الهدف اليومي</div>
                     <div style={{display: 'flex', gap: '8px'}}>
                        {[10, 20, 50].map(g => (
                            <button key={g} onClick={() => handleGoalChange(g)}
                                style={{
                                    flex: 1, padding: '8px', borderRadius: '8px', 
                                    background: dailyGoal === g ? `${accentColor}33` : '#333',
                                    border: `1px solid ${dailyGoal === g ? accentColor : 'transparent'}`,
                                    color: dailyGoal === g ? accentColor : '#bbb'
                                }}>
                                {g}
                            </button>
                        ))}
                     </div>
                </div>
            </Section>

            <Section id="data" icon="💾" titleSv="Data" titleAr="البيانات">
                <button onClick={() => handleDataAction('export')} style={{...styles.button, width: '100%', marginBottom: '8px', textAlign: 'left'}}>📤 Exportera Data / تصدير</button>
                <button onClick={() => handleDataAction('clearFav')} style={{...styles.button, width: '100%', marginBottom: '8px', textAlign: 'left', borderColor: '#eab308', color: '#eab308'}}>🗑️ Rensa Favoriter / مسح المفضلة</button>
                <button onClick={() => handleDataAction('reset')} style={{...styles.button, width: '100%', textAlign: 'left', borderColor: '#ef4444', color: '#ef4444'}}>⚠️ Återställ Appen / إعادة ضبط</button>
            </Section>

            <Section id="info" icon="ℹ️" titleSv="Information" titleAr="معلومات">
                <button onClick={onOpenChangelog} style={{...styles.button, width: '100%', marginBottom: '8px', textAlign: 'left'}}>📋 Changelog / سجل التحديثات</button>
                <button onClick={onOpenDeviceInfo} style={{...styles.button, width: '100%', textAlign: 'left'}}>🖥️ Enhetsinfo / معلومات الجهاز</button>
            </Section>

            <Section id="gamify" icon="🏆" titleSv="Framsteg" titleAr="الإنجازات">
                <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    <div style={styles.badge} title="5 Words Today">🏅</div>
                    <div style={styles.badge} title="7 Day Streak">🔥</div>
                    <div style={{...styles.badge, opacity: 0.3}} title="Locked">🔒</div>
                </div>
            </Section>
        </div>

        <button onClick={onClose} style={{ ...styles.finalBtn, background: accentColor }}>Klar / تم</button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  modalOverlay: { position: 'fixed', inset: 0, zIndex: 5000, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modalContent: { background: '#1c1c1e', width: '95%', maxWidth: '420px', maxHeight: '85vh', borderRadius: '28px', padding: '25px', border: '1px solid #333', display: 'flex', flexDirection: 'column' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  header: { fontSize: '1.2rem', fontWeight: 'bold', color: '#fff', margin: 0 },
  closeCircle: { width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: '#333', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' },
  scrollArea: { flex: 1, overflowY: 'auto', marginBottom: '20px' },
  section: { marginBottom: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid', transition: '0.3s' },
  sectionHeader: { padding: '12px 15px', display: 'flex', alignItems: 'center', cursor: 'pointer' },
  sectionIconContainer: { width: '36px', height: '36px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px', fontSize: '1.1rem' },
  sectionTitle: { margin: 0, fontSize: '1rem', color: '#fff' },
  arTitle: { opacity: 0.5, fontSize: '0.8rem', marginLeft: '8px' },
  sectionContent: { padding: '0 15px 15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '15px' },
  item: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0' },
  itemLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  itemIcon: { fontSize: '1.2rem' },
  checkbox: { width: '20px', height: '20px', cursor: 'pointer' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' },
  button: { padding: '10px', border: '1px solid', borderRadius: '10px', fontWeight: 'bold' },
  badge: { width: '45px', height: '45px', borderRadius: '50%', background: '#2c2c2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: '1px solid #444' },
  finalBtn: { width: '100%', padding: '16px', border: 'none', borderRadius: '15px', color: '#fff', fontSize: '1rem', fontWeight: 'bold' }
};

export default FullSettings;