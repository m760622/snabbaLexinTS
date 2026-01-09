
import { safeElement } from './security';
import { t } from './i18n';

/**
 * Filter Pills UI Component
 * Replaces the traditional select dropdowns with a modern scrollable list of pills.
 */
export class FilterPills {
    private static container: HTMLElement | null = null;
    
    // Configuration for the pills structure
    // We mix them in a single row but keep track of which select they belong to.
    private static filters = [
        // MODE Filters
        { id: 'mode-all', label: 'Alla', selectId: 'filterModeSelect', value: 'all', icon: '🌍' },
        { id: 'mode-fav', label: 'Favoriter', selectId: 'filterModeSelect', value: 'favorites', icon: '❤️' },
        { id: 'mode-learn', label: 'Lär mig', selectId: 'filterModeSelect', value: 'learning', icon: '📚' },
        
        // DIVIDER
        { divider: true },

        // TYPE Filters (Most common first)
        { id: 'type-subst', label: 'Substantiv', selectId: 'typeSelect', value: 'subst', icon: '📝' },
        { id: 'type-verb', label: 'Verb', selectId: 'typeSelect', value: 'verb', icon: '🏃' },
        { id: 'type-adj', label: 'Adjektiv', selectId: 'typeSelect', value: 'adj', icon: '✨' },
        
        // DIVIDER
        { divider: true },
        
        // SORT Filters
        { id: 'sort-rel', label: 'Relevans', selectId: 'sortSelect', value: 'relevance', icon: '🎯' },
        { id: 'sort-az', label: 'A-Ö', selectId: 'sortSelect', value: 'alpha_asc', icon: '🔤' },
    ];

    public static init() {
        this.container = document.getElementById('newFilterPills');
        if (!this.container) return;

        this.render();
        this.syncFromSelects(); // Initial sync
        
        // Listen for external changes (e.g. from Dock or Quick Actions) to update pills
        this.listenForExternalChanges();
    }

    private static render() {
        if (!this.container) return;
        this.container.innerHTML = '';

        this.filters.forEach(filter => {
            if (filter.divider) {
                const div = document.createElement('div');
                div.className = 'filter-divider';
                this.container?.appendChild(div);
                return;
            }

            const btn = document.createElement('button');
            btn.className = 'filter-pill';
            btn.dataset.selectId = filter.selectId;
            btn.dataset.value = filter.value;
            
            // Icon
            if (filter.icon) {
                const icon = document.createElement('span');
                icon.textContent = filter.icon;
                btn.appendChild(icon);
            }

            // Label
            const label = document.createElement('span');
            // Check for translation if needed, for now use static or simple mapping
            label.textContent = filter.label || ''; 
            btn.appendChild(label);

            btn.addEventListener('click', () => {
                this.handlePillClick(filter.selectId!, filter.value!);
            });

            this.container?.appendChild(btn);
        });

        // Add a "More..." button that toggles the old selects visibility (optional, or just to show full list)
        // For now, let's keep it simple.
    }

    private static handlePillClick(selectId: string, value: string) {
        const select = document.getElementById(selectId) as HTMLSelectElement;
        if (!select) return;

        // Special behavior for toggles (like Favorites):
        // If clicking "Favorites" and it's already active, maybe go back to "All"?
        // Current app logic toggles it. Let's replicate behavior:
        
        const currentValue = select.value;
        let newValue = value;

        // If clicking the currently active pill
        if (currentValue === value) {
            // For Mode, if specific mode active, toggle back to 'all'
            if (selectId === 'filterModeSelect' && value !== 'all') {
                newValue = 'all';
            }
            // For Type, if specific type active, toggle back to 'all'
            if (selectId === 'typeSelect' && value !== 'all') {
                newValue = 'all';
            }
        }

        // Apply new value
        select.value = newValue;
        
        // Dispatch change event so App.ts handles the logic
        select.dispatchEvent(new Event('change'));

        // Update UI immediately (though listener will also do it)
        this.updatePillStates();
    }

    private static listenForExternalChanges() {
        const selects = ['filterModeSelect', 'typeSelect', 'sortSelect'];
        selects.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', () => this.updatePillStates());
            }
        });
    }

    private static syncFromSelects() {
        this.updatePillStates();
    }

    private static updatePillStates() {
        if (!this.container) return;
        
        const pills = this.container.querySelectorAll('.filter-pill');
        pills.forEach(p => {
            const pill = p as HTMLElement;
            const selectId = pill.dataset.selectId;
            const val = pill.dataset.value;
            
            if (selectId && val) {
                const select = document.getElementById(selectId) as HTMLSelectElement;
                if (select) {
                    if (select.value === val) {
                        pill.classList.add('active');
                    } else {
                        pill.classList.remove('active');
                    }
                }
            }
        });
    }
}
