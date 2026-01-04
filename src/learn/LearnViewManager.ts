/**
 * LearnViewManager - Unified View Switching for Learn Modules
 * 
 * This manager handles view switching in learn screens (ordsprak, cognates, etc.)
 * It is separate from game mode switching which uses different patterns.
 * 
 * Learn Views: browse, flashcard, quiz, saved (+ quiz variants)
 * Game Modes: classic, learning, timerush, flashlight, etc.
 */

// ========== TYPES ==========
export type LearnView = 'browse' | 'flashcard' | 'quiz' | 'quiz-fill' | 'quiz-match' | 'saved';

export interface ViewConfig {
    viewId: string;
    onActivate?: () => void;
}

// ========== LEARN VIEW MANAGER ==========
export class LearnViewManager {
    private currentView: LearnView = 'browse';
    private views: Map<LearnView, ViewConfig> = new Map();
    private tabSelector: string = '.mode-tab';

    constructor() {
        console.log('[LearnViewManager] Initialized');
    }

    /**
     * Register a view with its configuration
     */
    registerView(view: LearnView, config: ViewConfig): void {
        this.views.set(view, config);
    }

    /**
     * Register multiple views at once
     */
    registerViews(configs: Partial<Record<LearnView, ViewConfig>>): void {
        for (const [view, config] of Object.entries(configs)) {
            if (config) {
                this.views.set(view as LearnView, config);
            }
        }
    }

    /**
     * Set custom tab selector
     */
    setTabSelector(selector: string): void {
        this.tabSelector = selector;
    }

    /**
     * Switch to a specific view
     */
    switchTo(view: LearnView): void {
        console.log(`[LearnViewManager] Switching to: ${view}`);

        // Hide all registered views
        this.views.forEach((config, _v) => {
            const element = document.getElementById(config.viewId);
            if (element) {
                element.classList.remove('active');
                element.classList.add('hidden');
            }
        });

        // Update tab states
        document.querySelectorAll(this.tabSelector).forEach((tab) => {
            const onclick = tab.getAttribute('onclick');
            if (onclick && onclick.includes(`'${view}'`)) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Show selected view
        const targetConfig = this.views.get(view);
        if (targetConfig) {
            const element = document.getElementById(targetConfig.viewId);
            if (element) {
                element.classList.add('active');
                element.classList.remove('hidden');
            }

            // Call activation callback if defined
            if (targetConfig.onActivate) {
                targetConfig.onActivate();
            }
        }

        // Handle quiz variants that share the same view
        if (view === 'quiz-fill' || view === 'quiz-match') {
            const quizConfig = this.views.get('quiz');
            if (quizConfig) {
                const element = document.getElementById(quizConfig.viewId);
                if (element) {
                    element.classList.add('active');
                }
            }
        }

        this.currentView = view;
    }

    /**
     * Get the current active view
     */
    getCurrentView(): LearnView {
        return this.currentView;
    }

    /**
     * Check if a specific view is active
     */
    isActive(view: LearnView): boolean {
        return this.currentView === view;
    }
}

// ========== SINGLETON INSTANCE ==========
// Create and export a factory function for creating managers
export function createLearnViewManager(): LearnViewManager {
    return new LearnViewManager();
}
