/**
 * SnabbaLexin Utilities
 * Shared library for UI, favorites, notifications, etc.
 */

// import { TTSManager } from './tts';
// import { ProgressManager } from './progress';
export { measurePerformance } from './performance.util';
export { memoize } from './memoization.util';

// --- Voice Search Manager ---

export const VoiceSearchManager = {
    recognition: null as any,
    isListening: false,
    onResult: null as ((transcript: string, isFinal: boolean) => void) | null,

    isSupported() {
        return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
    },

    init(onResultCallback: (transcript: string, isFinal: boolean) => void) {
        if (!this.isSupported()) {
            console.warn('Voice search not supported in this browser');
            return false;
        }

        const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        this.recognition = new SpeechRecognitionClass();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;

        // Default to Swedish
        this.recognition.lang = 'sv-SE';
        this.onResult = onResultCallback;

        this.recognition.onresult = (event: any) => {
            const last = event.results.length - 1;
            const transcript = event.results[last][0].transcript;
            const isFinal = event.results[last].isFinal;
            if (this.onResult) this.onResult(transcript, isFinal);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI(false);
        };

        this.recognition.onerror = (event: any) => {
            console.error('Voice search error:', event.error);
            this.isListening = false;
            this.updateUI(false);
            if (event.error === 'not-allowed') showToast('Mikrofon nekad / الميكروفون مرفوض 🎤❌');
            else if (event.error === 'no-speech') showToast('Inget tal detekterat / لم يتم اكتشاف صوت 🔇');
        };

        return true;
    },

    start(lang = 'sv-SE') {
        if (!this.recognition) {
            if (!this.init(this.onResult!)) return;
        }
        this.recognition.lang = lang;
        try {
            this.recognition.start();
            this.isListening = true;
            this.updateUI(true);
        } catch (e) {
            console.error('Voice start error:', e);
        }
    },

    stop() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
            this.updateUI(false);
        }
    },

    toggle(lang = 'sv-SE') {
        if (this.isListening) this.stop();
        else this.start(lang);
    },

    updateUI(isActive: boolean) {
        const micBtn = document.getElementById('voiceSearchBtn');
        if (micBtn) {
            micBtn.classList.toggle('listening', isActive);
            micBtn.setAttribute('aria-pressed', isActive.toString());
        }
    }
};

// --- Sentence Generator ---

export function generateEducationalSentence(word: string, translation: string, exampleSwe?: string, exampleArb?: string, definitionSwe?: string, type?: string) {
    const cleanWord = (word || '').trim();
    const cleanType = (type || '').toLowerCase().replace('.', '');
    const cleanDef = definitionSwe ? definitionSwe.replace(/[\.,]$/g, '').trim() : '';

    if (exampleSwe && exampleSwe.length > 10) {
        return { s: exampleSwe, a: exampleArb || translation };
    }

    if (cleanDef && cleanDef.length > 3) {
        if (!cleanDef.toLowerCase().startsWith('se ')) {
            const capDef = cleanDef.charAt(0).toUpperCase() + cleanDef.slice(1);
            return { s: `${capDef} (${cleanWord}).`, a: translation };
        }
    }

    let sweTemplate = '';
    if (cleanType.includes('verb')) sweTemplate = `Att ${cleanWord.toLowerCase()} betyder att man gör något.`;
    else if (cleanType.includes('subst')) sweTemplate = `En ${cleanWord} är en sak, person eller plats.`;
    else if (cleanType.includes('adj')) sweTemplate = `${cleanWord} beskriver hur något är eller ser ut.`;
    else sweTemplate = `Ordet används i svenskan.`;

    return { s: sweTemplate, a: translation };
}

// --- Text Helper ---

export function normalizeArabic(text: string): string {
    if (!text) return '';
    
    // 1. Remove Tashkeel (diacritics)
    let normalized = text.replace(/[\u064B-\u065F\u0670]/g, '');

    // 2. Normalize Alef forms (أ, إ, آ -> ا)
    normalized = normalized.replace(/[أإآ]/g, 'ا');

    // 3. Normalize Taa Marbuta (ة -> ه) - Optional but helps in search
    // normalized = normalized.replace(/ة/g, 'ه'); 
    // keeping ة distinct from ه is often better for exactness, 
    // but for "fuzzy" search often users type ه instead of ة.
    // Let's normalize ة to ه for search purposes to be safe.
    normalized = normalized.replace(/ة/g, 'ه');

    // 4. Normalize Yaa (ى -> ي)
    normalized = normalized.replace(/ى/g, 'ي');

    return normalized;
}

// --- Toast System ---
// Using unified ToastManager for consistent notifications across all pages

import { ToastManager } from './toast.util';

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

export interface ToastOptions {
    duration?: number;
    type?: ToastType;
}

export function showToast(message: string, durationOrOptions: number | ToastOptions | ToastType = 1500) {
    let duration = 1500;
    let type: ToastType = 'success';

    if (typeof durationOrOptions === 'number') {
        duration = durationOrOptions;
    } else if (typeof durationOrOptions === 'string') {
        type = durationOrOptions as ToastType;
    } else if (typeof durationOrOptions === 'object') {
        duration = durationOrOptions.duration || 1500;
        type = durationOrOptions.type || 'success';
    }

    // Use unified ToastManager
    ToastManager.show(message, { type: type === 'default' ? 'success' : type, duration });
}

// --- Text Size Manager ---

export const TextSizeManager = {
    apply(element: HTMLElement, text: string, maxLines: number = 1, baseSize: number = 1.6) {
        if (!element || !text) return;

        // Reset to default starting point
        element.style.fontSize = '';
        element.style.display = 'inline-block';
        element.style.width = 'auto';

        const parent = element.parentElement;
        if (!parent) return;

        const maxWidth = parent.offsetWidth || parent.clientWidth;
        if (maxWidth === 0) return;

        let currentSize = baseSize;
        const minSize = 0.70;
        const step = 0.05;

        if (maxLines === 1) {
            element.style.whiteSpace = 'nowrap';
            element.style.fontSize = `${currentSize}rem`;
            while (element.offsetWidth > maxWidth && currentSize > minSize) {
                currentSize -= step;
                element.style.fontSize = `${currentSize}rem`;
            }
        } else {
            element.style.whiteSpace = 'normal';
            element.style.width = '100%';
            element.style.display = 'block';
            element.style.fontSize = `${currentSize}rem`;

            element.style.lineHeight = '1.4';

            while (currentSize > minSize) {
                const fontSizePx = currentSize * 16;
                const singleLineHeight = fontSizePx * 1.4;
                const allowedHeight = singleLineHeight * maxLines + 5;

                if (element.offsetHeight <= allowedHeight) break;

                currentSize -= step;
                element.style.fontSize = `${currentSize}rem`;
            }
        }

        if (maxLines === 1) {
            element.style.whiteSpace = '';
            element.style.display = '';
            element.style.width = '';
        }
        element.style.lineHeight = currentSize < 1.1 ? '1.2' : '1.4';
    },

    autoApply() {
        document.querySelectorAll('[data-auto-size]').forEach(el => {
            const maxLines = parseInt((el as HTMLElement).dataset.maxLines || '1');
            this.apply(el as HTMLElement, el.textContent || '', maxLines);
        });
    },

    // Optimized version: Apply only to elements within a specific container
    applyToContainer(container: HTMLElement | DocumentFragment) {
        if (!container) return;

        // For DocumentFragment, we need to handle differently
        const elements = container instanceof DocumentFragment
            ? Array.from(container.querySelectorAll('[data-auto-size]'))
            : container.querySelectorAll('[data-auto-size]');

        elements.forEach(el => {
            const maxLines = parseInt((el as HTMLElement).dataset.maxLines || '1');
            this.apply(el as HTMLElement, el.textContent || '', maxLines);
        });
    }
};

// Auto-update on resize
if (typeof window !== 'undefined') {
    let resizeTimer: any;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => TextSizeManager.autoApply(), 200);
    });
}

// --- Haptic Feedback Manager ---

export const HapticManager = {
    vibrate(pattern: number | number[] = 10) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Silently fail if not supported or blocked
            }
        }
    },
    
    light() { this.vibrate(10); },
    selection() { this.vibrate(5); },
    medium() { this.vibrate(20); },
    heavy() { this.vibrate([10, 30, 10]); },
    success() { this.vibrate([10, 50, 10]); },
    error() { this.vibrate([50, 100, 50]); }
};

// --- Theme Manager ---

export const ThemeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'auto') {
            this.applyAutoTheme(false);
        } else {
            document.documentElement.setAttribute('data-theme', savedTheme);
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        }
        const colorTheme = localStorage.getItem('colorTheme') || 'default';
        this.setColorTheme(colorTheme, false);
    },

    isNightTime() {
        const hour = new Date().getHours();
        return hour >= 18 || hour < 7;
    },

    applyAutoTheme(showMessage = true) {
        const isDark = this.isNightTime();
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        if (isDark) document.body.classList.add('dark-mode');
        else document.body.classList.remove('dark-mode');
        if (showMessage) showToast(isDark ? 'Automatiskt mörkt läge 🌙' : 'Automatiskt ljust läge ☀️');
        return theme;
    },

    toggle() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        if (newTheme === 'dark') {
            document.body.classList.add('dark-mode');
            showToast('Mörkt läge aktiverat / الوضع الليلي 🌙');
        } else {
            document.body.classList.remove('dark-mode');
            showToast('Ljust läge aktiverat / الوضع النهاري ☀️');
        }
        return newTheme;
    },

    setColorTheme(theme: string, showMessage = true) {
        if (theme === 'default') document.documentElement.removeAttribute('data-color-theme');
        else document.documentElement.setAttribute('data-color-theme', theme);
        localStorage.setItem('colorTheme', theme);
        if (showMessage) showToast(theme);
    }
};

// --- Mobile View Manager ---

export const MobileViewManager = {
    init() {
        // Default to mobile view if not set (mobile-first approach)
        const savedValue = localStorage.getItem('mobileView');
        // Force default TRUE if null
        const isMobileView = savedValue === null ? true : savedValue === 'true';
        this.apply(isMobileView);
    },

    apply(isActive: boolean) {
        if (isActive) {
            document.documentElement.classList.add('iphone-mode');
            document.body.classList.add('iphone-view');
        } else {
            document.documentElement.classList.remove('iphone-mode');
            document.body.classList.remove('iphone-view');
        }

        const btn = document.getElementById('mobileToggle') || document.getElementById('mobileViewToggle');
        if (btn) btn.classList.toggle('active', isActive);

        localStorage.setItem('mobileView', isActive ? 'true' : 'false');
    },

    toggle() {
        const isActive = !document.body.classList.contains('iphone-view');
        this.apply(isActive);
        showToast(isActive ? 'Mobilvy aktiverad / وضع الموبايل 📱' : 'Standardvy aktiverad / الوضع العادي 💻');
        return isActive;
    }
};

// --- Word Classification Helpers ---

export const learnedSuffixes = {
    ett: ['rum', 'kar', 'hus', 'tak', 'golv', 'bord', 'berg', 'land', 'ljus', 'block', 'kort', 'slag', 'spel', 'verk', 'djur', 'krig', 'krön', 'prov', 'test', 'tryck', 'vatten', 'fönster', 'papper', 'system', 'arbete', 'centrum', 'museum', 'program', 'dokument', 'dråp', 'brott', 'mord', 'skap', 'äktenskap', 'partnerskap'],
    en: ['gård', 'väg', 'gata', 'plats', 'dörr', 'bil', 'maskin', 'station', 'ventil', 'motor', 'pump', 'kabel', 'tid', 'dag', 'natt', 'stad', 'ning', 'tion', 'sion', 'het', 'else', 'ande', 'ende', 'ment', 'itet', 'dom', 'ism', 'ist', 'are', 'ler', 'rer', 'nar', 'mark', 'feber', 'handel', 'misshandel', 'konvention', 'habilitering', 'akut', 'queen', 'plikt', 'hiss', 'nad', 'sjukdom']
};

export const GrammarHelper = {
    getBadge(type: string, forms: string, word: string): string {
        const formsLower = (forms || '').toLowerCase();
        const wordLower = (word || '').toLowerCase();
        const normalizedType = (type || '').toLowerCase().replace('.', '').replace(' ', '');

        // === VERB DETECTION ===
        if (formsLower.match(/\w+ar[,\s]/) && formsLower.match(/\w+ade[,\s]/)) return '<span class="grammar-badge grammar-verb">Gr. 1</span>';
        if (formsLower.match(/\w+er[,\s]/) && (formsLower.match(/\w+de[,\s]/) || formsLower.match(/\w+te[,\s]/))) return '<span class="grammar-badge grammar-verb">Gr. 2</span>';
        if (formsLower.match(/\w+dde[,\s]/)) return '<span class="grammar-badge grammar-verb">Gr. 3</span>';
        if (formsLower.match(/\w+(it|its|ats|ett)[,\s]/) || formsLower.match(/\w+(it|its|ats|ett)$/)) return '<span class="grammar-badge grammar-verb">Gr. 4</span>';

        if (wordLower.endsWith('as') && formsLower.match(/\w+ades[,\s]|\w+des[,\s]/)) return '<span class="grammar-badge grammar-verb">Gr. 4</span>';

        if (normalizedType.includes('adj')) return '<span class="grammar-badge grammar-adj">Adj</span>';
        if (normalizedType.includes('adverb') || normalizedType === 'adv') return '<span class="grammar-badge grammar-adv">Adv</span>';

        // Noun detection
        const formParts = formsLower.split(',').map(f => f.trim());
        if (formParts.length >= 2) {
            const definiteSingular = formParts[1];
            // Fix: Use endsWith or unicode friendly regex instead of \w
            if ((definiteSingular.endsWith('en') || definiteSingular.endsWith('an')) && !definiteSingular.endsWith('et')) return '<span class="grammar-badge grammar-en">En</span>';
            if (definiteSingular.endsWith('et')) return '<span class="grammar-badge grammar-ett">Ett</span>';
        }

        if (formsLower.startsWith('en ') || formsLower.match(/\ben\s+/)) return '<span class="grammar-badge grammar-en">En</span>';
        if (formsLower.startsWith('ett ') || formsLower.match(/\bett\s+/)) return '<span class="grammar-badge grammar-ett">Ett</span>';

        // Fallbacks
        if (normalizedType.includes('verb')) return '<span class="grammar-badge grammar-verb">Verb</span>';
        if (normalizedType.includes('subst')) return '<span class="grammar-badge grammar-en">Subst</span>';
        if (normalizedType.includes('prep')) return '<span class="grammar-badge">Prep</span>';
        if (normalizedType.includes('konj')) return '<span class="grammar-badge">Konj</span>';
        if (normalizedType.includes('pron')) return '<span class="grammar-badge">Pron</span>';

        // Generic fallback for any other type
        if (type && type.length > 0 && type.length < 10) {
            return `<span class="grammar-badge">${type}</span>`;
        }

        return '';
    }
};

export const CategoryHelper = {
    getCategory(type: string, word: string = '', forms: string = ''): string {
        const normalizedType = (type || '').toLowerCase().replace('.', '');
        const wordLower = (word || '').toLowerCase();
        const formsLower = (forms || '').toLowerCase();

        // === VERB DETECTION BY FORMS (same as GrammarHelper) ===
        // Group 1: -ar, -ade
        if (formsLower.match(/\w+ar[,\s]/) && formsLower.match(/\w+ade[,\s]/)) return 'verb';
        // Group 2: -er, -de/-te
        if (formsLower.match(/\w+er[,\s]/) && (formsLower.match(/\w+de[,\s]/) || formsLower.match(/\w+te[,\s]/))) return 'verb';
        // Group 3: -dde
        if (formsLower.match(/\w+dde[,\s]/)) return 'verb';
        // Group 4: -it/-its/-ats/-ett
        if (formsLower.match(/\w+(it|its|ats|ett)[,\s]/) || formsLower.match(/\w+(it|its|ats|ett)$/)) return 'verb';
        // Passive verbs ending in -as
        if (wordLower.endsWith('as') && formsLower.match(/\w+ades[,\s]|\w+des[,\s]/)) return 'verb';

        if (normalizedType.includes('verbmn') || (normalizedType.includes('verb') && word.includes(' '))) return 'phrasal';
        if (normalizedType === 'verb' || normalizedType.includes('verb')) return 'verb';
        if (normalizedType.includes('subst')) return 'noun';
        if (normalizedType === 'adj' || normalizedType.includes('adjektiv')) return 'adj';
        if (normalizedType === 'adv' || normalizedType.includes('adverb')) return 'adv';
        if (normalizedType.includes('prep')) return 'prep';
        if (normalizedType.includes('konj')) return 'conj';
        if (normalizedType.includes('pron')) return 'pronoun';

        // Suffix detection for nouns
        if (learnedSuffixes.ett.some(s => wordLower.endsWith(s))) return 'noun';
        if (learnedSuffixes.en.some(s => wordLower.endsWith(s))) return 'noun';

        return 'other';
    }
};

// Global exports for legacy scripts
if (typeof window !== 'undefined') {
    (window as any).VoiceSearchManager = VoiceSearchManager;
    (window as any).showToast = showToast;
    (window as any).TextSizeManager = TextSizeManager;
    (window as any).ThemeManager = ThemeManager;
    (window as any).MobileViewManager = MobileViewManager;
    (window as any).generateEducationalSentence = generateEducationalSentence;

    // Auto-init theme and mobile view
    ThemeManager.init();
    MobileViewManager.init();
}
