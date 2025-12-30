/**
 * Simple Onboarding System
 * Lightweight tour for first-time users
 */

interface OnboardingStep {
    title: string;
    titleAr: string;
    description: string;
    descriptionAr: string;
    target?: string; // CSS selector for element to highlight
    position?: 'top' | 'bottom' | 'left' | 'right';
}

const ONBOARDING_STEPS: OnboardingStep[] = [
    {
        title: "Welcome to SnabbaLexin!",
        titleAr: "مرحباً بك في سنابّا لكسين!",
        description: "Learn Swedish vocabulary through fun games",
        descriptionAr: "تعلم المفردات السويدية من خلال ألعاب ممتعة"
    },
    {
        title: "Choose a Game",
        titleAr: "اختر لعبة",
        description: "Pick any game to start learning",
        descriptionAr: "اختر أي لعبة لبدء التعلم",
        target: ".game-card-item",
        position: "bottom"
    },
    {
        title: "Track Your Progress",
        titleAr: "تتبع تقدمك",
        description: "Your scores and streaks are saved automatically",
        descriptionAr: "يتم حفظ نتائجك وسلاسلك تلقائياً",
        target: ".stat-pill",
        position: "bottom"
    }
];

class Onboarding {
    private currentStep = 0;
    private overlay: HTMLElement | null = null;
    private tooltip: HTMLElement | null = null;

    constructor() {
        // Check if onboarding completed
        if (localStorage.getItem('onboardingComplete') === 'true') {
            return;
        }
    }

    public start(): void {
        if (localStorage.getItem('onboardingComplete') === 'true') {
            return;
        }

        this.createOverlay();
        this.showStep(0);
    }

    private createOverlay(): void {
        this.overlay = document.createElement('div');
        this.overlay.className = 'onboarding-overlay';
        this.overlay.innerHTML = `
            <div class="onboarding-backdrop"></div>
            <div class="onboarding-tooltip" id="onboardingTooltip">
                <div class="onboarding-content">
                    <h3 class="onboarding-title"></h3>
                    <p class="onboarding-desc"></p>
                </div>
                <div class="onboarding-footer">
                    <span class="onboarding-progress"></span>
                    <div class="onboarding-actions">
                        <button class="onboarding-skip">تخطي / Skip</button>
                        <button class="onboarding-next">التالي / Next →</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(this.overlay);

        this.tooltip = this.overlay.querySelector('#onboardingTooltip');

        // Event listeners
        this.overlay.querySelector('.onboarding-skip')?.addEventListener('click', () => this.complete());
        this.overlay.querySelector('.onboarding-next')?.addEventListener('click', () => this.next());
    }

    private showStep(index: number): void {
        if (index >= ONBOARDING_STEPS.length) {
            this.complete();
            return;
        }

        const step = ONBOARDING_STEPS[index];
        this.currentStep = index;

        // Update content
        const titleEl = this.tooltip?.querySelector('.onboarding-title');
        const descEl = this.tooltip?.querySelector('.onboarding-desc');
        const progressEl = this.tooltip?.querySelector('.onboarding-progress');

        if (titleEl) titleEl.innerHTML = `${step.title}<br><span class="ar">${step.titleAr}</span>`;
        if (descEl) descEl.innerHTML = `${step.description}<br><span class="ar">${step.descriptionAr}</span>`;
        if (progressEl) progressEl.textContent = `${index + 1} / ${ONBOARDING_STEPS.length}`;

        // Position tooltip
        if (step.target) {
            const targetEl = document.querySelector(step.target);
            if (targetEl) {
                this.positionTooltip(targetEl as HTMLElement, step.position || 'bottom');
                this.highlightElement(targetEl as HTMLElement);
            }
        } else {
            // Center tooltip
            if (this.tooltip) {
                this.tooltip.style.top = '50%';
                this.tooltip.style.left = '50%';
                this.tooltip.style.transform = 'translate(-50%, -50%)';
            }
        }

        // Update button text for last step
        const nextBtn = this.overlay?.querySelector('.onboarding-next');
        if (nextBtn) {
            nextBtn.textContent = index === ONBOARDING_STEPS.length - 1
                ? 'ابدأ! / Start!'
                : 'التالي / Next →';
        }
    }

    private positionTooltip(target: HTMLElement, position: string): void {
        const rect = target.getBoundingClientRect();
        if (!this.tooltip) return;

        const tooltipRect = this.tooltip.getBoundingClientRect();
        let top = 0, left = 0;

        switch (position) {
            case 'bottom':
                top = rect.bottom + 16;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
            case 'top':
                top = rect.top - tooltipRect.height - 16;
                left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                break;
        }

        this.tooltip.style.top = `${Math.max(16, top)}px`;
        this.tooltip.style.left = `${Math.max(16, Math.min(left, window.innerWidth - tooltipRect.width - 16))}px`;
        this.tooltip.style.transform = 'none';
    }

    private highlightElement(el: HTMLElement): void {
        // Remove previous highlights
        document.querySelectorAll('.onboarding-highlight').forEach(e => e.classList.remove('onboarding-highlight'));
        el.classList.add('onboarding-highlight');
    }

    private next(): void {
        this.showStep(this.currentStep + 1);
    }

    private complete(): void {
        localStorage.setItem('onboardingComplete', 'true');
        this.overlay?.remove();
        document.querySelectorAll('.onboarding-highlight').forEach(e => e.classList.remove('onboarding-highlight'));
    }

    public reset(): void {
        localStorage.removeItem('onboardingComplete');
    }
}

// Export
export const onboarding = new Onboarding();

// Auto-start on games page
if (window.location.pathname.includes('games.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => onboarding.start(), 1000);
    });
}

// Global access
(window as any).startOnboarding = () => {
    localStorage.removeItem('onboardingComplete');
    new Onboarding().start();
};
