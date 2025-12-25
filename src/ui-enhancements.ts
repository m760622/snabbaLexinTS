/**
 * Advanced UI Enhancements
 * تحسينات متقدمة للواجهة
 */

// ============================================================
// SPLASH SCREEN MANAGER - إدارة شاشة التحميل
// ============================================================

export const SplashManager = {
    hide(): void {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 600);
        }
    },

    // Show for minimum time then hide
    showUntilReady(minTime: number = 800): void {
        const startTime = Date.now();

        window.addEventListener('load', () => {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, minTime - elapsed);

            setTimeout(() => this.hide(), remainingTime);
        });
    }
};

// Auto-init splash manager
if (typeof window !== 'undefined') {
    SplashManager.showUntilReady(1000);
}

// ============================================================
// HAPTIC FEEDBACK - اهتزاز اللمس
// ============================================================

export const HapticFeedback = {
    isSupported(): boolean {
        return 'vibrate' in navigator;
    },

    // Light tap feedback
    light(): void {
        if (this.isSupported()) {
            navigator.vibrate(10);
        }
    },

    // Medium impact feedback
    medium(): void {
        if (this.isSupported()) {
            navigator.vibrate(25);
        }
    },

    // Success feedback pattern
    success(): void {
        if (this.isSupported()) {
            navigator.vibrate([15, 50, 15]);
        }
    },

    // Error feedback pattern
    error(): void {
        if (this.isSupported()) {
            navigator.vibrate([50, 30, 50, 30, 50]);
        }
    },

    // Selection feedback
    selection(): void {
        if (this.isSupported()) {
            navigator.vibrate(5);
        }
    }
};

// ============================================================
// SKELETON LOADING - تحميل هيكلي
// ============================================================

export const SkeletonLoader = {
    createCardSkeleton(): HTMLElement {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-game-card';
        skeleton.innerHTML = `
            <div class="skeleton-icon"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-subtitle"></div>
        `;
        return skeleton;
    },

    showInContainer(container: HTMLElement, count: number = 6): void {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeleton = this.createCardSkeleton();
            skeleton.style.animationDelay = `${i * 0.1}s`;
            container.appendChild(skeleton);
        }
    },

    hide(container: HTMLElement): void {
        const skeletons = container.querySelectorAll('.skeleton-game-card');
        skeletons.forEach((skeleton, index) => {
            setTimeout(() => {
                skeleton.classList.add('skeleton-fade-out');
                setTimeout(() => skeleton.remove(), 300);
            }, index * 50);
        });
    }
};

// ============================================================
// CELEBRATION EFFECTS - تأثيرات الاحتفال
// ============================================================

export const Celebrations = {
    // Confetti explosion
    confetti(options: { particleCount?: number; spread?: number; origin?: { x: number; y: number } } = {}): void {
        const defaults = {
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.6 }
        };
        const config = { ...defaults, ...options };

        if (typeof (window as any).confetti === 'function') {
            (window as any).confetti(config);
        } else {
            // Fallback: Simple CSS confetti
            this.cssConfetti();
        }
    },

    // CSS-based confetti fallback
    cssConfetti(): void {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        container.innerHTML = '';

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                left: ${Math.random() * 100}%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-delay: ${Math.random() * 0.5}s;
                animation-duration: ${2 + Math.random()}s;
            `;
            container.appendChild(confetti);
        }

        document.body.appendChild(container);
        setTimeout(() => container.remove(), 3000);
    },

    // Stars burst effect
    starBurst(element: HTMLElement): void {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';
            star.textContent = '⭐';
            star.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                --angle: ${(i * 45)}deg;
            `;
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 800);
        }
    },

    // Success checkmark animation
    showSuccess(message: string = 'Bra jobbat!'): void {
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-content">
                <div class="success-checkmark">
                    <svg viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" stroke="#4ade80" stroke-width="2"/>
                        <path fill="none" stroke="#4ade80" stroke-width="3" d="M14 27l7 7 16-16"/>
                    </svg>
                </div>
                <p class="success-message">${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);

        HapticFeedback.success();

        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 300);
        }, 1500);
    },

    // Level up animation
    levelUp(level: number): void {
        const overlay = document.createElement('div');
        overlay.className = 'level-up-overlay';
        overlay.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <h2 class="level-up-title">Nivå ${level}!</h2>
                <p class="level-up-subtitle">Du har gått upp en nivå!</p>
            </div>
        `;
        document.body.appendChild(overlay);

        this.confetti({ particleCount: 150, spread: 100 });
        HapticFeedback.success();

        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 500);
        }, 2500);
    },

    // Streak celebration
    streakCelebration(days: number): void {
        const overlay = document.createElement('div');
        overlay.className = 'streak-overlay';
        overlay.innerHTML = `
            <div class="streak-content">
                <div class="streak-fire">🔥</div>
                <h2 class="streak-days">${days} dagar!</h2>
                <p class="streak-text">Din streak fortsätter!</p>
            </div>
        `;
        document.body.appendChild(overlay);

        HapticFeedback.medium();

        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 300);
        }, 2000);
    }
};

// ============================================================
// ONBOARDING TOUR - جولة تعريفية
// ============================================================

export const OnboardingTour = {
    steps: [
        {
            element: '.games-header h1',
            title: 'Välkommen! مرحباً!',
            text: 'Här hittar du roliga spel för att lära dig svenska.',
            position: 'bottom'
        },
        {
            element: '.stats-hero',
            title: 'Din statistik',
            text: 'Följ dina framsteg: spelade spel, streak och poäng.',
            position: 'bottom'
        },
        {
            element: '.category-chips',
            title: 'Kategorier',
            text: 'Filtrera spel efter typ: ordförråd, grammatik, uttal...',
            position: 'bottom'
        },
        {
            element: '.game-card-item',
            title: 'Välj ett spel',
            text: 'Tryck på ett spel för att börja lära dig!',
            position: 'top'
        }
    ],

    currentStep: 0,
    overlay: null as HTMLElement | null,

    shouldShow(): boolean {
        return localStorage.getItem('onboardingCompleted') !== 'true';
    },

    start(): void {
        if (!this.shouldShow()) return;

        this.currentStep = 0;
        this.showStep();
    },

    showStep(): void {
        const step = this.steps[this.currentStep];
        if (!step) {
            this.complete();
            return;
        }

        const targetEl = document.querySelector(step.element) as HTMLElement;
        if (!targetEl) {
            this.nextStep();
            return;
        }

        // Remove existing overlay
        if (this.overlay) this.overlay.remove();

        // Create spotlight overlay
        this.overlay = document.createElement('div');
        this.overlay.className = 'tour-overlay';

        const rect = targetEl.getBoundingClientRect();
        const spotlight = document.createElement('div');
        spotlight.className = 'tour-spotlight';
        spotlight.style.cssText = `
            top: ${rect.top - 8}px;
            left: ${rect.left - 8}px;
            width: ${rect.width + 16}px;
            height: ${rect.height + 16}px;
        `;

        const tooltip = document.createElement('div');
        tooltip.className = `tour-tooltip tour-${step.position}`;
        tooltip.innerHTML = `
            <h3>${step.title}</h3>
            <p>${step.text}</p>
            <div class="tour-actions">
                <button class="tour-skip">Hoppa över</button>
                <button class="tour-next">${this.currentStep < this.steps.length - 1 ? 'Nästa' : 'Klar!'}</button>
            </div>
            <div class="tour-progress">
                ${this.steps.map((_, i) => `<span class="tour-dot ${i === this.currentStep ? 'active' : ''}"></span>`).join('')}
            </div>
        `;

        // Position tooltip
        const tooltipTop = step.position === 'bottom' ? rect.bottom + 20 : rect.top - 160;
        tooltip.style.cssText = `
            top: ${tooltipTop}px;
            left: ${Math.max(20, rect.left + rect.width / 2 - 150)}px;
        `;

        this.overlay.appendChild(spotlight);
        this.overlay.appendChild(tooltip);
        document.body.appendChild(this.overlay);

        // Event listeners
        tooltip.querySelector('.tour-next')?.addEventListener('click', () => {
            HapticFeedback.light();
            this.nextStep();
        });

        tooltip.querySelector('.tour-skip')?.addEventListener('click', () => {
            this.complete();
        });

        HapticFeedback.selection();
    },

    nextStep(): void {
        this.currentStep++;
        this.showStep();
    },

    complete(): void {
        if (this.overlay) {
            this.overlay.classList.add('fade-out');
            setTimeout(() => this.overlay?.remove(), 300);
        }
        localStorage.setItem('onboardingCompleted', 'true');
    },

    reset(): void {
        localStorage.removeItem('onboardingCompleted');
    }
};

// ============================================================
// MICRO-INTERACTIONS - تفاعلات دقيقة
// ============================================================

export const MicroInteractions = {
    // Ripple effect on touch
    addRipple(element: HTMLElement): void {
        element.addEventListener('click', (e: MouseEvent) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `left: ${x}px; top: ${y}px;`;

            element.appendChild(ripple);
            HapticFeedback.light();

            setTimeout(() => ripple.remove(), 600);
        });
    },

    // Button press scale
    addPressEffect(element: HTMLElement): void {
        element.addEventListener('touchstart', () => {
            element.style.transform = 'scale(0.95)';
            HapticFeedback.selection();
        }, { passive: true });

        element.addEventListener('touchend', () => {
            element.style.transform = '';
        }, { passive: true });
    },

    // Initialize all micro-interactions
    init(): void {
        // Add ripple to all game cards
        document.querySelectorAll('.game-card-item').forEach((card) => {
            this.addRipple(card as HTMLElement);
            this.addPressEffect(card as HTMLElement);
        });

        // Add press effect to buttons
        document.querySelectorAll('button, .btn, .back-btn').forEach((btn) => {
            this.addPressEffect(btn as HTMLElement);
        });
    }
};

// ============================================================
// PULL TO REFRESH - سحب للتحديث
// ============================================================

export const PullToRefresh = {
    isEnabled: false,
    startY: 0,
    isPulling: false,

    init(container: HTMLElement, onRefresh: () => Promise<void>): void {
        if (this.isEnabled) return;
        this.isEnabled = true;

        let indicator: HTMLElement | null = null;

        container.addEventListener('touchstart', (e) => {
            if (container.scrollTop === 0) {
                this.startY = e.touches[0].clientY;
                this.isPulling = true;
            }
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!this.isPulling) return;

            const currentY = e.touches[0].clientY;
            const pullDistance = currentY - this.startY;

            if (pullDistance > 0 && pullDistance < 150) {
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.className = 'pull-refresh-indicator';
                    indicator.innerHTML = '<div class="pull-spinner"></div>';
                    container.prepend(indicator);
                }
                indicator.style.height = `${pullDistance}px`;
                indicator.style.opacity = String(Math.min(pullDistance / 80, 1));
            }
        }, { passive: true });

        container.addEventListener('touchend', async () => {
            if (indicator && indicator.offsetHeight >= 80) {
                indicator.classList.add('refreshing');
                HapticFeedback.medium();
                await onRefresh();
            }

            if (indicator) {
                indicator.style.height = '0';
                setTimeout(() => {
                    indicator?.remove();
                    indicator = null;
                }, 300);
            }

            this.isPulling = false;
        }, { passive: true });
    }
};

// ============================================================
// AUTO-INIT - تهيئة تلقائية
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize micro-interactions
    setTimeout(() => {
        MicroInteractions.init();
    }, 500);

    // Start onboarding tour for new users
    setTimeout(() => {
        OnboardingTour.start();
    }, 1000);
});

// Global exports
if (typeof window !== 'undefined') {
    (window as any).HapticFeedback = HapticFeedback;
    (window as any).SkeletonLoader = SkeletonLoader;
    (window as any).Celebrations = Celebrations;
    (window as any).OnboardingTour = OnboardingTour;
    (window as any).MicroInteractions = MicroInteractions;
    (window as any).PullToRefresh = PullToRefresh;
}
