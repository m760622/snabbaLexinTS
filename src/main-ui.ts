/**
 * Main UI Logic for SnabbaLexin
 * Extracted from index.html
 */
import { TextSizeManager } from './utils';

export function initMainUI() {
    console.log("Initializing Main UI...");

    iniThemeSelection();
    initSettingsMenu();
    initMobileView();
    initProgressBadge();
    initQuickActions();
    initOnboarding();
    initGoalAdjusters();
    initTextSizeAuto();
}

function iniThemeSelection() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'auto') {
        const hour = new Date().getHours();
        const isDark = hour >= 18 || hour < 7;
        document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } else {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
}

function initSettingsMenu() {
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsMenu = document.getElementById('settingsMenu');

    if (settingsBtn && settingsMenu) {
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            settingsMenu.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            const target = e.target as Node;
            if (!settingsMenu.contains(target) && !settingsBtn.contains(target)) {
                settingsMenu.classList.add('hidden');
            }
        });
    }
}

function initMobileView() {
    const mobileViewToggle = document.getElementById('mobileViewToggle');
    if (mobileViewToggle) {
        mobileViewToggle.addEventListener('click', () => {
            (window as any).MobileViewManager?.toggle();
        });
    }

    // Legacy support for toggleMobileView global
    (window as any).toggleMobileView = () => (window as any).MobileViewManager?.toggle();
}

function initProgressBadge() {
    const progressBadge = document.getElementById('progressBadge');
    const progressModal = document.getElementById('progressModal');
    const closeProgressBtn = document.getElementById('closeProgress');

    if (progressBadge && progressModal) {
        progressBadge.addEventListener('click', () => {
            progressModal.style.display = 'flex';
            progressModal.classList.remove('hidden');
        });
    }

    if (closeProgressBtn && progressModal) {
        closeProgressBtn.addEventListener('click', () => {
            progressModal.style.display = 'none';
        });

        progressModal.addEventListener('click', (e) => {
            if (e.target === progressModal) {
                progressModal.style.display = 'none';
            }
        });
    }
}

function initQuickActions() {
    // Quick actions like WOD, Fav, Quiz
    const quickWodBtn = document.getElementById('quickWodBtn');
    if (quickWodBtn) {
        quickWodBtn.addEventListener('click', () => {
            const wodCard = document.getElementById('wordOfTheDay');
            if (wodCard) {
                wodCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                wodCard.classList.add('pulse-animation');
                setTimeout(() => wodCard.classList.remove('pulse-animation'), 500);
            }
        });
    }

    const quickFavBtn = document.getElementById('quickFavBtn');
    if (quickFavBtn) {
        quickFavBtn.addEventListener('click', () => {
            (window as any).app?.performSearch('favorites');
        });
    }

    const quickQuizBtn = document.getElementById('quickQuizBtn');
    if (quickQuizBtn) {
        quickQuizBtn.addEventListener('click', () => {
            (window as any).QuizManager?.start?.();
        });
    }
}

function initOnboarding() {
    const modal = document.getElementById('onboardingModal');
    if (!modal) return;

    const slides = document.querySelectorAll('.onboarding-slide');
    const dots = document.querySelectorAll('.dot');
    const nextBtn = document.getElementById('nextSlide') as HTMLButtonElement;
    const prevBtn = document.getElementById('prevSlide') as HTMLButtonElement;
    const skipBtn = document.getElementById('skipOnboarding');

    let currentSlide = 0;
    const totalSlides = slides.length;

    if (!localStorage.getItem('onboardingComplete')) {
        modal.style.display = 'flex';
        modal.classList.remove('hidden');
    }

    function showSlide(index: number) {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        if (prevBtn) prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
        if (nextBtn) nextBtn.textContent = index === totalSlides - 1 ? 'Börja! 🚀' : 'Nästa ⟶';

        // Apply sizing to active slide
        const activeSlide = slides[index] as HTMLElement;
        if (activeSlide) {
            activeSlide.querySelectorAll('h2, p').forEach(el => {
                TextSizeManager.apply(el as HTMLElement, el.textContent || '');
            });
        }
    }

    function closeOnboarding() {
        localStorage.setItem('onboardingComplete', 'true');
        modal!.style.opacity = '0';
        setTimeout(() => {
            modal!.style.display = 'none';
        }, 300);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            showSlide(currentSlide);
        } else {
            closeOnboarding();
        }
    });

    if (prevBtn) prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            showSlide(currentSlide);
        }
    });

    if (skipBtn) skipBtn.addEventListener('click', closeOnboarding);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentSlide = i;
            showSlide(currentSlide);
        });
    });
}

function initGoalAdjusters() {
    const saveGoalBtn = document.getElementById('saveGoalBtn');
    const dailyGoalInput = document.getElementById('dailyGoalInput') as HTMLInputElement;
    if (saveGoalBtn && dailyGoalInput) {
        saveGoalBtn.addEventListener('click', () => {
            localStorage.setItem('dailyGoal', dailyGoalInput.value);
            (window as any).app?.updateDailyProgressBar();
            (window as any).showToast?.('Mål sparat! / تم حفظ الهدف 🎯');
        });
    }
}

function initTextSizeAuto() {
    document.querySelectorAll('.game-card h3, .section-title, .stat-label').forEach(el => {
        TextSizeManager.apply(el as HTMLElement, el.textContent || '');
    });
}

// Main UI initialization is controlled by app.ts
