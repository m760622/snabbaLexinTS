/**
 * Accessibility utilities and ARIA management
 */

import { A11Y_CONFIG } from './constants';

export class AccessibilityManager {
    private static instance: AccessibilityManager;
    private announcements: HTMLElement | null = null;
    private liveRegions: Map<string, HTMLElement> = new Map();

    private constructor() {
        this.init();
    }

    static getInstance(): AccessibilityManager {
        if (!AccessibilityManager.instance) {
            AccessibilityManager.instance = new AccessibilityManager();
        }
        return AccessibilityManager.instance;
    }

    private init(): void {
        this.createLiveRegions();
        this.setupSkipLinks();
        this.setupKeyboardNavigation();
        this.setupScreenReaderSupport();
    }

    /**
     * Create live regions for dynamic content announcements
     */
    private createLiveRegions(): void {
        Object.entries(A11Y_CONFIG.liveRegions).forEach(([key, id]) => {
            const region = document.createElement('div');
            region.id = id;
            region.setAttribute('aria-live', 'polite');
            region.setAttribute('aria-atomic', 'true');
            region.className = 'sr-only live-region';
            region.style.cssText = `
                position: absolute;
                left: -10000px;
                width: 1px;
                height: 1px;
                overflow: hidden;
            `;
            
            document.body.appendChild(region);
            this.liveRegions.set(key, region);
        });
    }

    /**
     * Setup skip navigation links
     */
    private setupSkipLinks(): void {
        const skipContainer = document.createElement('div');
        skipContainer.className = 'skip-links';
        skipContainer.style.cssText = `
            position: fixed;
            top: -40px;
            left: 0;
            right: 0;
            z-index: 10000;
            background: #000;
            color: #fff;
            text-align: center;
            padding: 8px;
            transition: top 0.3s ease;
        `;

        A11Y_CONFIG.skipLinks.forEach(link => {
            const skipLink = document.createElement('a');
            skipLink.href = link.href;
            skipLink.textContent = link.text;
            skipLink.className = 'skip-link';
            skipLink.style.cssText = `
                color: #fff;
                text-decoration: none;
                margin: 0 8px;
                padding: 4px 8px;
                border-radius: 4px;
                background: #2563eb;
            `;

            skipLink.addEventListener('focus', () => {
                skipContainer.style.top = '0';
            });

            skipLink.addEventListener('blur', () => {
                skipContainer.style.top = '-40px';
            });

            skipContainer.appendChild(skipLink);
        });

        document.body.insertBefore(skipContainer, document.body.firstChild);
    }

    /**
     * Setup keyboard navigation enhancements
     */
    private setupKeyboardNavigation(): void {
        // Focus management for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.handleEscapeKey(e);
            }
            
            if (e.key === 'Tab') {
                this.handleTabKey(e);
            }
        });

        // Focus visible enhancement
        document.addEventListener('keydown', (_e) => {
            document.body.classList.add('keyboard-navigation');
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    /**
     * Setup screen reader support
     */
    private setupScreenReaderSupport(): void {
        // Announce page changes
        this.observePageChanges();
        
        // Enhance semantic structure
        this.enhanceSemanticStructure();
        
        // Add landmark roles
        this.addLandmarkRoles();
    }

    /**
     * Handle Escape key for modals and overlays
     */
    private handleEscapeKey(_e: KeyboardEvent): void {
        const modal = document.querySelector('.modal[style*="block"], .modal:not(.hidden)');
        if (modal) {
            const closeBtn = modal.querySelector('.close-btn, .modal-close');
            if (closeBtn && closeBtn instanceof HTMLElement) {
                closeBtn.click();
            }
        }
    }

    /**
     * Handle Tab key for focus trapping
     */
    private handleTabKey(e: KeyboardEvent): void {
        const modal = document.querySelector('.modal[style*="block"], .modal:not(.hidden)');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Observe page changes for announcements
     */
    private observePageChanges(): void {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.checkForImportantChanges(node as Element);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    /**
     * Check for important content changes
     */
    private checkForImportantChanges(element: Element): void {
        // Check for new search results
        if (element.classList.contains('search-results') || 
            element.querySelector('.search-results')) {
            const count = element.querySelectorAll('.card').length;
            this.announce(`Search complete, found ${count} results`);
        }

        // Check for error messages
        if (element.classList.contains('error') || 
            element.querySelector('.error')) {
            const errorText = element.textContent || 'Error occurred';
            this.announce(`Error: ${errorText}`, 'alerts');
        }

        // Check for success messages
        if (element.classList.contains('success') || 
            element.querySelector('.success')) {
            const successText = element.textContent || 'Operation successful';
            this.announce(successText, 'status');
        }
    }

    /**
     * Enhance semantic structure
     */
    private enhanceSemanticStructure(): void {
        // Add proper heading hierarchy
        this.ensureHeadingHierarchy();
        
        // Add list semantics where missing
        this.enhanceLists();
        
        // Add button semantics to clickable elements
        this.enhanceClickableElements();
    }

    /**
     * Ensure proper heading hierarchy
     */
    private ensureHeadingHierarchy(): void {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;

        headings.forEach(heading => {
            const currentLevel = parseInt(heading.tagName.substring(1));
            
            if (currentLevel > lastLevel + 1) {
                // Fix heading level jump
                const newLevel = lastLevel + 1;
                const newHeading = document.createElement(`h${Math.min(newLevel, 6)}`);
                newHeading.innerHTML = heading.innerHTML;
                newHeading.className = heading.className;
                newHeading.setAttribute('id', heading.id || '');
                
                heading.parentNode?.replaceChild(newHeading, heading);
            } else {
                lastLevel = currentLevel;
            }
        });
    }

    /**
     * Enhance lists with proper semantics
     */
    private enhanceLists(): void {
        document.querySelectorAll('[role="list"]:not(ul):not(ol)').forEach(list => {
            const isOrdered = list.className.includes('ordered') || 
                           list.className.includes('numbered');
            
            const newList = document.createElement(isOrdered ? 'ol' : 'ul');
            newList.innerHTML = list.innerHTML;
            newList.className = list.className;
            newList.setAttribute('role', 'list');
            
            list.parentNode?.replaceChild(newList, list);
        });
    }

    /**
     * Enhance clickable elements
     */
    private enhanceClickableElements(): void {
        document.querySelectorAll('[onclick]:not(button):not([role="button"])').forEach(element => {
            element.setAttribute('role', 'button');
            element.setAttribute('tabindex', '0');
            
            // Add keyboard support
            element.addEventListener('keydown', (e) => {
                if ((e as KeyboardEvent).key === 'Enter' || (e as KeyboardEvent).key === ' ') {
                    e.preventDefault();
                    (element as HTMLElement).click();
                }
            });
        });
    }

    /**
     * Add landmark roles
     */
    private addLandmarkRoles(): void {
        // Main content
        const main = document.querySelector('main') || document.getElementById('main-content');
        if (main && !main.getAttribute('role')) {
            main.setAttribute('role', 'main');
        }

        // Navigation
        document.querySelectorAll('nav, .navigation, .nav').forEach(nav => {
            if (!nav.getAttribute('role')) {
                nav.setAttribute('role', 'navigation');
            }
        });

        // Search
        const search = document.querySelector('.search, [role="search"]');
        if (search && !search.getAttribute('role')) {
            search.setAttribute('role', 'search');
        }

        // Content info
        document.querySelectorAll('footer, .footer').forEach(footer => {
            if (!footer.getAttribute('role')) {
                footer.setAttribute('role', 'contentinfo');
            }
        });

        // Banner/header
        document.querySelectorAll('header, .header, .banner').forEach(header => {
            if (!header.getAttribute('role')) {
                header.setAttribute('role', 'banner');
            }
        });
    }

    /**
     * Announce content to screen readers
     */
    announce(message: string, region: 'status' | 'alerts' | 'progress' = 'status'): void {
        const liveRegion = this.liveRegions.get(region);
        if (liveRegion) {
            liveRegion.textContent = '';
            setTimeout(() => {
                liveRegion.textContent = message;
            }, 100);
        }
    }

    /**
     * Focus management for modals
     */
    trapFocus(modal: HTMLElement): () => void {
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (firstElement) {
            firstElement.focus();
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }

    /**
     * Set focus to element with announcement
     */
    setFocus(element: HTMLElement, announce: boolean = true): void {
        element.focus();
        
        if (announce) {
            const label = element.getAttribute('aria-label') || 
                         element.textContent || 
                         element.tagName.toLowerCase();
            this.announce(`Focused on ${label}`);
        }
    }

    /**
     * Add ARIA attributes to elements
     */
    addAriaAttributes(element: HTMLElement, attributes: Record<string, string>): void {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(`aria-${key}`, value);
        });
    }

    /**
     * Remove ARIA attributes from elements
     */
    removeAriaAttributes(element: HTMLElement, attributes: string[]): void {
        attributes.forEach(attr => {
            element.removeAttribute(`aria-${attr}`);
        });
    }

    /**
     * Check if element is focusable
     */
    isFocusable(element: Element): boolean {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ];

        return focusableSelectors.some(selector => 
            element.matches(selector)
        );
    }

    /**
     * Get all focusable elements within a container
     */
    getFocusableElements(container: Element): HTMLElement[] {
        const selector = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])'
        ].join(', ');

        return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
    }
}

// Export singleton instance
export const a11y = AccessibilityManager.getInstance();

// Export utility functions for easy usage
export const announce = (message: string, region?: 'status' | 'alerts' | 'progress') => 
    a11y.announce(message, region);

export const trapFocus = (modal: HTMLElement) => a11y.trapFocus(modal);

export const setFocus = (element: HTMLElement, announce?: boolean) => 
    a11y.setFocus(element, announce);

export const addAriaAttributes = (element: HTMLElement, attributes: Record<string, string>) => 
    a11y.addAriaAttributes(element, attributes);

// Initialize accessibility improvements
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        AccessibilityManager.getInstance();
    });
}