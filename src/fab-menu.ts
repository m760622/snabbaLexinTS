/**
 * ============================================================
 * UNIFIED FAB MENU - قائمة الأزرار العائمة الموحدة
 * Version: 1.0
 * ============================================================
 * 
 * Consolidates all floating action buttons into one organized menu
 */

// ============================================================
// FAB MENU MANAGER - مدير قائمة FAB
// ============================================================

export const FABMenu = {
    isOpen: false,
    menuElement: null as HTMLElement | null,

    // Menu items configuration
    menuItems: [
        {
            id: 'focus-mode',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>`,
            label: 'Fokusläge',
            labelAr: 'وضع التركيز',
            color: '#22c55e',
            action: 'toggleFocusMode'
        },
        {
            id: 'eye-care',
            icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>`,
            label: 'Ögonvård',
            labelAr: 'حماية العين',
            color: '#fbbf24',
            action: 'toggleEyeCare'
        },
        {
            id: 'pomodoro',
            icon: '⏱️',
            label: 'Pomodoro',
            labelAr: 'مؤقت بومودورو',
            color: '#8b5cf6',
            action: 'togglePomodoro'
        },
        {
            id: 'sound',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>`,
            label: 'Ljud',
            labelAr: 'الصوت',
            color: '#3b82f6',
            action: 'toggleSound'
        },
        {
            id: 'mascot',
            icon: '🦉',
            label: 'Hjälpare',
            labelAr: 'المساعد',
            color: '#f97316',
            action: 'showMascotMessage'
        }
    ],

    init(): void {
        // Remove any existing scattered buttons
        this.removeScatteredButtons();

        // Create the unified FAB menu
        this.createMenu();

        // Add keyboard shortcut (Escape to close)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    },

    removeScatteredButtons(): void {
        // Remove old scattered buttons
        const selectorsToRemove = [
            '.focus-mode-toggle',
            '.eye-care-toggle',
            '.sound-toggle',
            '.pomodoro-toggle',
            '.game-mascot'
        ];

        selectorsToRemove.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
        });
    },

    createMenu(): void {
        // Check if menu already exists
        const existing = document.querySelector('.fab-menu-container');
        if (existing) return;

        const container = document.createElement('div');
        container.className = 'fab-menu-container';
        container.innerHTML = `
            <!-- Backdrop -->
            <div class="fab-menu-backdrop" id="fabBackdrop"></div>
            
            <!-- Menu Items -->
            <div class="fab-menu-items" id="fabMenuItems">
                ${this.menuItems.map((item, index) => `
                    <div class="fab-menu-item" data-action="${item.action}" style="--item-index: ${index}; --item-color: ${item.color}">
                        <span class="fab-menu-item-label">${item.label}</span>
                        <div class="fab-menu-item-btn" style="background: linear-gradient(135deg, ${item.color}, ${this.darkenColor(item.color)})">
                            ${item.icon}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Main FAB Button -->
            <button class="fab-main-btn" id="fabMainBtn" aria-label="Settings Menu">
                <span class="fab-main-icon fab-main-icon-menu">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                    </svg>
                </span>
                <span class="fab-main-icon fab-main-icon-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </span>
            </button>
        `;

        document.body.appendChild(container);
        this.menuElement = container;
        this.bindEvents();
    },

    bindEvents(): void {
        const mainBtn = document.getElementById('fabMainBtn');
        const backdrop = document.getElementById('fabBackdrop');
        const menuItems = document.querySelectorAll('.fab-menu-item');

        mainBtn?.addEventListener('click', () => this.toggle());
        backdrop?.addEventListener('click', () => this.close());

        menuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const action = (e.currentTarget as HTMLElement).getAttribute('data-action');
                if (action) {
                    this.executeAction(action);
                    this.close();
                }
            });
        });
    },

    toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    },

    open(): void {
        this.isOpen = true;
        this.menuElement?.classList.add('open');

        // Haptic feedback
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    },

    close(): void {
        this.isOpen = false;
        this.menuElement?.classList.remove('open');
    },

    executeAction(action: string): void {
        switch (action) {
            case 'toggleFocusMode':
                this.toggleFocusMode();
                break;
            case 'toggleEyeCare':
                this.toggleEyeCare();
                break;
            case 'togglePomodoro':
                this.togglePomodoro();
                break;
            case 'toggleSound':
                this.toggleSound();
                break;
            case 'showMascotMessage':
                this.showMascotMessage();
                break;
        }
    },

    // Action implementations
    toggleFocusMode(): void {
        const isActive = document.body.classList.toggle('focus-mode');
        localStorage.setItem('focusMode', String(isActive));

        if ('vibrate' in navigator) {
            navigator.vibrate(isActive ? [20, 50, 20] : 10);
        }

        this.showToast(
            isActive ? 'Fokusläge aktiverat ✨ / وضع التركيز مفعّل' : 'Fokusläge avaktiverat / وضع التركيز معطّل',
            isActive ? 'success' : 'info'
        );
    },

    toggleEyeCare(): void {
        const isActive = document.body.classList.toggle('eye-care-mode');
        localStorage.setItem('eyeCareMode', String(isActive));

        this.showToast(
            isActive ? '👁️ Ögonvård aktiverat / حماية العين مفعّلة' : '👁️ Ögonvård avaktiverat / حماية العين معطّلة',
            'info'
        );
    },

    togglePomodoro(): void {
        // Show the pomodoro widget
        const widget = document.querySelector('.pomodoro-widget');
        if (widget) {
            widget.classList.toggle('visible');
        } else if (typeof (window as any).PomodoroTimer !== 'undefined') {
            (window as any).PomodoroTimer.toggleWidget();
        }
    },

    toggleSound(): void {
        const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
        const newState = !soundEnabled;
        localStorage.setItem('soundEnabled', String(newState));

        this.showToast(
            newState ? '🔊 Ljud på / الصوت مفعّل' : '🔇 Ljud av / الصوت مكتوم',
            'info'
        );

        // Play a test sound if enabled
        if (newState && typeof (window as any).SoundEffects !== 'undefined') {
            (window as any).SoundEffects.play('click');
        }
    },

    showMascotMessage(): void {
        const messages = [
            'Lycka till! 🍀 / حظاً سعيداً!',
            'Du klarar det! 💪 / ستنجح!',
            'Fortsätt så! 🌟 / استمر!',
            'Imponerande! 👏 / رائع!',
            'Bra jobbat! 🎉 / أحسنت!',
            'Du är grym! 🔥 / أنت رائع!'
        ];

        const message = messages[Math.floor(Math.random() * messages.length)];
        this.showToast(message, 'success');

        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    },

    showToast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
        if (typeof (window as any).showToast === 'function') {
            (window as any).showToast(message, type);
        } else {
            // Fallback toast implementation
            const existing = document.querySelector('.toast-notification.visible');
            if (existing) existing.remove();

            let toast = document.getElementById('toast') as HTMLElement;
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'toast';
                toast.className = 'toast-notification';
                document.body.appendChild(toast);
            }

            toast.textContent = message;
            toast.className = `toast-notification visible ${type}`;

            setTimeout(() => {
                toast.classList.remove('visible');
            }, 3000);
        }
    },

    // Helper to darken a hex color
    darkenColor(hex: string, percent: number = 20): string {
        const num = parseInt(hex.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        ).toString(16).slice(1);
    }
};

// ============================================================
// CSS STYLES - الأنماط
// ============================================================

const fabMenuStyles = `
/* FAB Menu Container */
.fab-menu-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
}

/* Backdrop */
.fab-menu-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: -1;
}

.fab-menu-container.open .fab-menu-backdrop {
    opacity: 1;
    visibility: visible;
}

/* Main FAB Button */
.fab-main-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
        0 4px 20px rgba(99, 102, 241, 0.5),
        0 0 0 4px rgba(99, 102, 241, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 10;
}

.fab-main-btn:hover {
    transform: scale(1.08);
    box-shadow: 
        0 6px 30px rgba(99, 102, 241, 0.6),
        0 0 0 6px rgba(99, 102, 241, 0.3);
}

.fab-main-btn:active {
    transform: scale(0.95);
}

.fab-main-icon {
    position: absolute;
    width: 28px;
    height: 28px;
    transition: all 0.3s ease;
}

.fab-main-icon svg {
    width: 100%;
    height: 100%;
    color: white;
}

.fab-main-icon-menu {
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

.fab-main-icon-close {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
}

.fab-menu-container.open .fab-main-icon-menu {
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
}

.fab-menu-container.open .fab-main-icon-close {
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

/* Menu Items Container */
.fab-menu-items {
    position: absolute;
    bottom: 70px;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;
    pointer-events: none;
}

.fab-menu-container.open .fab-menu-items {
    pointer-events: auto;
}

/* Individual Menu Item */
.fab-menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    transform: translateY(20px) scale(0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: calc(var(--item-index) * 50ms);
}

.fab-menu-container.open .fab-menu-item {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.fab-menu-item-label {
    background: rgba(30, 41, 59, 0.95);
    color: white;
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.2s ease;
}

.fab-menu-item:hover .fab-menu-item-label {
    opacity: 1;
    transform: translateX(0);
}

.fab-menu-item-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 
        0 4px 15px rgba(0, 0, 0, 0.3),
        0 0 0 3px rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.fab-menu-item-btn svg {
    width: 22px;
    height: 22px;
    color: white;
}

.fab-menu-item-btn:hover {
    transform: scale(1.15);
    box-shadow: 
        0 6px 20px rgba(0, 0, 0, 0.4),
        0 0 0 4px rgba(255, 255, 255, 0.2);
}

/* Pulse animation for main button */
@keyframes fabPulse {
    0%, 100% {
        box-shadow: 
            0 4px 20px rgba(99, 102, 241, 0.5),
            0 0 0 4px rgba(99, 102, 241, 0.2);
    }
    50% {
        box-shadow: 
            0 4px 30px rgba(99, 102, 241, 0.7),
            0 0 0 8px rgba(99, 102, 241, 0.15);
    }
}

.fab-main-btn {
    animation: fabPulse 3s ease-in-out infinite;
}

.fab-menu-container.open .fab-main-btn {
    animation: none;
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .fab-menu-container {
        bottom: 20px;
        right: 20px;
    }
    
    .fab-main-btn {
        width: 54px;
        height: 54px;
    }
    
    .fab-menu-item-btn {
        width: 44px;
        height: 44px;
    }
    
    .fab-menu-item-label {
        display: block;
        opacity: 1;
        transform: translateX(0);
    }
}
`;

// ============================================================
// AUTO INITIALIZATION - التهيئة التلقائية
// ============================================================

function injectStyles(): void {
    const styleId = 'fab-menu-styles';
    if (document.getElementById(styleId)) return;

    const styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = fabMenuStyles;
    document.head.appendChild(styleEl);
}

document.addEventListener('DOMContentLoaded', () => {
    // Inject styles
    injectStyles();

    // Initialize FAB menu after other scripts
    setTimeout(() => {
        FABMenu.init();
    }, 1000);
});

// Global export
if (typeof window !== 'undefined') {
    (window as any).FABMenu = FABMenu;
}
