/**
 * ============================================================
 * UNIFIED TOAST MANAGER - نظام التنبيهات الموحد
 * For all pages in SnabbaLexin
 * ============================================================
 */

export interface ToastOptions {
    type?: 'success' | 'error' | 'info' | 'warning';
    duration?: number;
    position?: 'top' | 'bottom';
}

export const ToastManager = {
    container: null as HTMLElement | null,
    toasts: [] as HTMLElement[],
    maxToasts: 2,
    defaultDuration: 2000,
    stylesInjected: false,

    /**
     * Initialize Toast Manager
     */
    init(): void {
        if (this.container) return;

        // Inject styles if not already done
        if (!this.stylesInjected) {
            this.injectStyles();
        }

        // Create container
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        this.container = container;
    },

    /**
     * Inject Toast CSS styles
     */
    injectStyles(): void {
        if (document.getElementById('toast-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'toast-styles';
        styles.textContent = `
            /* Toast Container - Top of Screen */
            .toast-container {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 99999;
                display: flex;
                flex-direction: column;
                gap: 10px;
                pointer-events: none;
                max-width: 90vw;
                width: 400px;
            }

            /* Individual toast item */
            .toast-item {
                position: relative;
                padding: 10px 44px 10px 18px;
                background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 14px;
                color: #f8fafc;
                font-size: 0.9rem;
                font-weight: 500;
                box-shadow: 
                    0 8px 32px rgba(0, 0, 0, 0.25),
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1);
                opacity: 0;
                transform: translateY(-20px) scale(0.95);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                pointer-events: auto;
                overflow: hidden;
                font-family: 'Inter', 'Tajawal', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            .toast-item.visible {
                opacity: 1;
                transform: translateY(0) scale(1);
            }

            .toast-item.removing {
                opacity: 0;
                transform: translateY(-20px) scale(0.9);
            }

            /* Toast content */
            .toast-content {
                display: flex;
                align-items: center;
                gap: 8px;
                line-height: 16px;
            }

            /* Close button */
            .toast-close {
                position: absolute;
                top: 50%;
                right: 10px;
                transform: translateY(-50%);
                width: 28px;
                height: 28px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: 8px;
                color: rgba(255, 255, 255, 0.7);
                font-size: 1.2rem;
                cursor: pointer;
                transition: all 0.2s ease;
            }

            .toast-close:hover {
                background: rgba(255, 255, 255, 0.2);
                color: #fff;
            }

            .toast-close:active {
                transform: translateY(-50%) scale(0.9);
            }

            /* Progress bar */
            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                width: 100%;
                background: linear-gradient(90deg, #5558b8, #6b4fa0);
                border-radius: 0 0 14px 14px;
                transform-origin: left;
            }

            .toast-progress.animate {
                animation: toastProgress 4s linear forwards;
            }

            @keyframes toastProgress {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }

            /* Toast types */
            .toast-item.success {
                border-left: 3px solid #22c55e;
            }
            .toast-item.success .toast-progress {
                background: linear-gradient(90deg, #22c55e, #4ade80);
            }

            .toast-item.error {
                border-left: 3px solid #ef4444;
            }
            .toast-item.error .toast-progress {
                background: linear-gradient(90deg, #ef4444, #f87171);
            }

            .toast-item.info {
                border-left: 3px solid #6366f1;
            }
            .toast-item.info .toast-progress {
                background: linear-gradient(90deg, #6366f1, #818cf8);
            }

            .toast-item.warning {
                border-left: 3px solid #f59e0b;
            }
            .toast-item.warning .toast-progress {
                background: linear-gradient(90deg, #f59e0b, #fbbf24);
            }

            /* Stacking effect */
            .toast-container .toast-item:not(:first-child) {
                transform: scale(0.98);
                opacity: 0.95;
            }
            .toast-container .toast-item:not(:nth-child(-n+2)) {
                transform: scale(0.95);
                opacity: 0.9;
            }

            /* Light mode support */
            body:not(.dark-mode) .toast-item,
            .light-mode .toast-item {
                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
                color: #1e293b;
                border-color: rgba(0, 0, 0, 0.1);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }

            body:not(.dark-mode) .toast-close,
            .light-mode .toast-close {
                background: rgba(0, 0, 0, 0.05);
                color: rgba(0, 0, 0, 0.5);
            }

            body:not(.dark-mode) .toast-close:hover,
            .light-mode .toast-close:hover {
                background: rgba(0, 0, 0, 0.1);
                color: rgba(0, 0, 0, 0.8);
            }

            /* Mobile responsive */
            @media (max-width: 480px) {
                .toast-container {
                    top: 10px;
                    width: calc(100% - 20px);
                    left: 10px;
                    transform: none;
                }
                
                .toast-item {
                    padding: 8px 40px 8px 14px;
                    font-size: 0.85rem;
                }
                
                .toast-close {
                    width: 24px;
                    height: 24px;
                    right: 8px;
                }
            }

            /* Safe area for notched phones */
            @supports (padding: max(0px)) {
                .toast-container {
                    top: max(20px, env(safe-area-inset-top));
                }
            }
        `;
        document.head.appendChild(styles);
        this.stylesInjected = true;
    },

    /**
     * Parse bilingual message and return only selected language text
     */
    parseBilingualMessage(message: string): string {
        // Check if message has bilingual format: "Swedish / Arabic"
        if (!message.includes(' / ')) {
            return message;
        }

        // Get current language from LanguageManager
        const savedLang = localStorage.getItem('appLanguage') || 'both';

        // Split by " / " separator
        const parts = message.split(' / ');
        if (parts.length !== 2) {
            return message; // Not a simple bilingual format
        }

        const [svText, arText] = parts.map(p => p.trim());

        switch (savedLang) {
            case 'sv':
                return svText;
            case 'ar':
                return arText;
            case 'both':
            default:
                return message; // Show both
        }
    },

    /**
     * Show a toast notification
     */
    show(message: string, options: ToastOptions = {}): HTMLElement {
        if (!this.container) this.init();

        const { type = 'success', duration = this.defaultDuration } = options;

        // Parse bilingual message
        const displayMessage = this.parseBilingualMessage(message);

        // Remove oldest if max reached
        if (this.toasts.length >= this.maxToasts) {
            this.remove(this.toasts[0]);
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-item ${type}`;

        // Content
        const content = document.createElement('div');
        content.className = 'toast-content';
        content.textContent = displayMessage;

        // Close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.innerHTML = '×';
        closeBtn.setAttribute('aria-label', 'Close');
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            this.remove(toast);
        };

        // Progress bar
        const progress = document.createElement('div');
        progress.className = 'toast-progress';
        progress.style.animationDuration = `${duration}ms`;

        // Assemble
        toast.appendChild(content);
        toast.appendChild(closeBtn);
        toast.appendChild(progress);

        // Add to container (at the beginning for top position)
        this.container!.insertBefore(toast, this.container!.firstChild);
        this.toasts.push(toast);

        // Trigger animation
        requestAnimationFrame(() => {
            toast.classList.add('visible');
            progress.classList.add('animate');
        });

        // Auto-remove
        const timeout = setTimeout(() => {
            this.remove(toast);
        }, duration);

        (toast as any)._timeout = timeout;

        return toast;
    },

    /**
     * Show success toast
     */
    success(message: string, duration?: number): HTMLElement {
        return this.show(message, { type: 'success', duration });
    },

    /**
     * Show error toast
     */
    error(message: string, duration?: number): HTMLElement {
        return this.show(message, { type: 'error', duration });
    },

    /**
     * Show info toast
     */
    info(message: string, duration?: number): HTMLElement {
        return this.show(message, { type: 'info', duration });
    },

    /**
     * Show warning toast
     */
    warning(message: string, duration?: number): HTMLElement {
        return this.show(message, { type: 'warning', duration });
    },

    /**
     * Remove a toast
     */
    remove(toast: HTMLElement): void {
        if ((toast as any)._timeout) {
            clearTimeout((toast as any)._timeout);
        }

        toast.classList.remove('visible');
        toast.classList.add('removing');

        const index = this.toasts.indexOf(toast);
        if (index > -1) {
            this.toasts.splice(index, 1);
        }

        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    },

    /**
     * Clear all toasts
     */
    clear(): void {
        [...this.toasts].forEach(toast => this.remove(toast));
    }
};

// Global function for backward compatibility
(window as any).showToast = (message: string, type?: 'success' | 'error' | 'info' | 'warning') => {
    ToastManager.show(message, { type });
};

// Auto-init on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ToastManager.init());
} else {
    ToastManager.init();
}

// Export for module usage
export default ToastManager;
