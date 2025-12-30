/**
 * Learn UI - Handles all learn page UI interactions
 */

import { lessonsData, Lesson, LessonSection } from './learn/lessonsData';
import { TTSManager } from './tts';

// Dictionary data is loaded globally via script
declare const dictionaryData: any[];

console.log('[LearnUI] Module loaded with', lessonsData.length, 'lessons');

// State
let currentFilter = 'all';
let currentLesson: Lesson | null = null;
let searchQuery = '';

// Gamification State
let xp = 0;
let level = 1;
let streak = 0;
let completedLessons: Set<string> = new Set();
let lastVisitDate = '';

// XP Requirements per level
const XP_PER_LEVEL = 100;

// Load saved state
function loadState(): void {
    try {
        xp = parseInt(localStorage.getItem('learn_xp') || '0');
        level = parseInt(localStorage.getItem('learn_level') || '1');
        streak = parseInt(localStorage.getItem('learn_streak') || '0');
        lastVisitDate = localStorage.getItem('learn_last_visit') || '';

        const savedCompleted = localStorage.getItem('learn_completed');
        if (savedCompleted) {
            completedLessons = new Set(JSON.parse(savedCompleted));
        }

        calculateStreak();
    } catch (e) {
        console.error('[LearnUI] Failed to load state:', e);
    }
}

// Save state
function saveState(): void {
    localStorage.setItem('learn_xp', xp.toString());
    localStorage.setItem('learn_level', level.toString());
    localStorage.setItem('learn_streak', streak.toString());
    localStorage.setItem('learn_last_visit', lastVisitDate);
    localStorage.setItem('learn_completed', JSON.stringify([...completedLessons]));
}

// Calculate streak
function calculateStreak(): void {
    const today = new Date().toISOString().split('T')[0];

    if (lastVisitDate !== today) {
        if (lastVisitDate) {
            const lastDate = new Date(lastVisitDate);
            const currentDate = new Date(today);
            const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays === 1) {
                streak++;
            } else if (diffDays > 1) {
                streak = 1;
            }
        } else {
            streak = 1;
        }

        lastVisitDate = today;
        saveState();
    }
}

// Add XP
function addXP(amount: number): void {
    xp += amount;

    // Check for level up
    const newLevel = Math.floor(xp / XP_PER_LEVEL) + 1;
    if (newLevel > level) {
        level = newLevel;
        showLevelUpAnimation();
    }

    saveState();
    updateStatsUI();
}

// Show level up animation
function showLevelUpAnimation(): void {
    const levelBadge = document.querySelector('.level-badge');
    if (levelBadge) {
        levelBadge.classList.add('level-up');
        setTimeout(() => levelBadge.classList.remove('level-up'), 1000);
    }
}

// Update stats UI
// function updateStatsUI removed - moved to profile-ui.ts

// Render lessons grid
function renderLessons(): void {
    const grid = document.getElementById('lessonsGrid');
    if (!grid) {
        console.error('[LearnUI] Lessons grid not found');
        return;
    }

    let filteredLessons = lessonsData;

    // Apply filter
    if (currentFilter !== 'all') {
        filteredLessons = lessonsData.filter(l => l.level === currentFilter);
    }

    // Apply search
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredLessons = filteredLessons.filter(l =>
            l.title.toLowerCase().includes(query) ||
            l.id.toLowerCase().includes(query)
        );
    }

    console.log('[LearnUI] Rendering', filteredLessons.length, 'lessons');

    grid.innerHTML = filteredLessons.map(lesson => createLessonCardHTML(lesson)).join('');

    // Parse emojis with Twemoji for cross-platform support
    if (typeof (window as any).twemoji !== 'undefined') {
        (window as any).twemoji.parse(grid, { folder: 'svg', ext: '.svg' });
    }
}

// Create lesson card HTML
function createLessonCardHTML(lesson: Lesson): string {
    const isCompleted = completedLessons.has(lesson.id);
    const levelColors: Record<string, string> = {
        'beginner': '#22c55e',
        'intermediate': '#eab308',
        'advanced': '#ef4444'
    };
    const levelEmoji: Record<string, string> = {
        'beginner': '🟢',
        'intermediate': '🟡',
        'advanced': '🔴'
    };

    return `
        <div class="lesson-card ${isCompleted ? 'completed' : ''}" onclick="openLesson('${lesson.id}')" data-level="${lesson.level}">
            <div class="lesson-card-header">
                <span class="lesson-level" style="background: ${levelColors[lesson.level] || '#6366f1'}40; color: ${levelColors[lesson.level] || '#6366f1'}">
                    ${levelEmoji[lesson.level] || '📚'} ${lesson.level}
                </span>
                ${isCompleted ? '<span class="lesson-complete-badge">✓</span>' : ''}
            </div>
            <h3 class="lesson-title">${lesson.title}</h3>
            <div class="lesson-meta">
                <span>${lesson.sections.length} avsnitt</span>
                <span>~${Math.max(5, lesson.sections.length * 3)} min</span>
            </div>
            <div class="lesson-progress-bar">
                <div class="lesson-progress-fill" style="width: ${isCompleted ? '100' : '0'}%"></div>
            </div>
        </div>
    `;
}

// Open lesson
function openLesson(lessonId: string): void {
    const lesson = lessonsData.find(l => l.id === lessonId);
    if (!lesson) return;

    currentLesson = lesson;

    const modal = document.getElementById('lessonModal');
    const title = document.getElementById('modalTitle');
    const content = document.getElementById('lessonContent');

    if (modal) modal.classList.add('active');
    if (title) title.textContent = lesson.title;

    if (content) {
        content.innerHTML = renderLessonContent(lesson);
    }

    // Add XP for opening lesson
    addXP(5);
}

// Render lesson content
function renderLessonContent(lesson: Lesson): string {
    return `
        <div class="lesson-sections">
            ${lesson.sections.map((section, index) => `
                <div class="lesson-section" data-section="${index}">
                    <h3 class="section-title">${section.title}</h3>
                    
                    ${section.content.map(item => `
                        <div class="content-item ${item.type}">
                            ${item.html}
                        </div>
                    `).join('')}
                    
                    ${section.examples.length > 0 ? `
                        <div class="examples-list">
                            ${section.examples.slice(0, 10).map(ex => `
                                <div class="example-item">
                                    <div class="example-swe">
                                        <button class="speak-btn" onclick="speakText('${ex.swe.replace(/'/g, "\\'")}', 'sv')">🔊</button>
                                        ${ex.swe}
                                    </div>
                                    <div class="example-arb">${ex.arb}</div>
                                </div>
                            `).join('')}
                            ${section.examples.length > 10 ? `
                                <button class="show-more-btn" onclick="this.parentElement.classList.add('expanded'); this.remove();">
                                    Visa ${section.examples.length - 10} till...
                                </button>
                                <div class="more-examples">
                                    ${section.examples.slice(10).map(ex => `
                                        <div class="example-item">
                                            <div class="example-swe">
                                                <button class="speak-btn" onclick="speakText('${ex.swe.replace(/'/g, "\\'")}', 'sv')">🔊</button>
                                                ${ex.swe}
                                            </div>
                                            <div class="example-arb">${ex.arb}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
            `).join('')}
            
            <div class="lesson-actions">
                <button class="complete-lesson-btn" onclick="completeLesson('${lesson.id}')">
                    ✅ <span class="sv-text">Markera som klar</span><span class="ar-text">اكتمل</span>
                </button>
            </div>
        </div>
    `;
}

// Complete lesson
function completeLesson(lessonId: string): void {
    if (!completedLessons.has(lessonId)) {
        completedLessons.add(lessonId);
        addXP(20);
        saveState();
        renderLessons();
    }
    closeLessonModal();
}

// Close lesson modal
function closeLessonModal(): void {
    const modal = document.getElementById('lessonModal');
    if (modal) modal.classList.remove('active');
    currentLesson = null;
}

// Speak text
function speakText(text: string, lang: string): void {
    if (typeof TTSManager !== 'undefined' && TTSManager) {
        TTSManager.speak(text, lang);
    } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang === 'sv' ? 'sv-SE' : 'ar-SA';
        speechSynthesis.speak(utterance);
    }
}

// Setup filter chips
function setupFilters(): void {
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            currentFilter = chip.getAttribute('data-filter') || 'all';
            renderLessons();
        });
    });
}

// Setup search
function setupSearch(): void {
    const searchInput = document.getElementById('lessonSearchInput') as HTMLInputElement;
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            searchQuery = searchInput.value;
            renderLessons();
        });
    }
}

// Open random quiz
function openRandomQuiz(): void {
    console.log('[LearnUI] Opening random quiz...');
    // Select a random lesson and quiz from it
    const randomLesson = lessonsData[Math.floor(Math.random() * lessonsData.length)];
    openLesson(randomLesson.id);
}

// Open daily challenge
function openDailyChallenge(): void {
    console.log('[LearnUI] Opening daily challenge...');
    // Open random lesson for now
    openRandomQuiz();
    addXP(10);
}

// Speak Word of the Day
function speakWordOfDay(): void {
    const wodWord = document.getElementById('wodWord');
    const wodExample = document.getElementById('wodExampleSwe');

    if (wodWord) {
        speakText(wodWord.textContent || '', 'sv');
        // Speak example after a short delay
        if (wodExample) {
            setTimeout(() => {
                speakText(wodExample.textContent || '', 'sv');
            }, 1500);
        }
    }
}

// Set path filter
function setPathFilter(filterLevel: string): void {
    // Update UI chips
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
        if (chip.getAttribute('data-filter') === filterLevel) {
            chip.classList.add('active');
        } else {
            chip.classList.remove('active');
        }
    });

    currentFilter = filterLevel;
    renderLessons();

    // Scroll to lessons section
    const lessonsSection = document.getElementById('lessonsGrid');
    if (lessonsSection) {
        lessonsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Open review session
function openReviewSession(): void {
    console.log('[LearnUI] Opening review session...');
    // For now, open a random quiz
    openRandomQuiz();
}

// Export to window
function exportToWindow(): void {
    (window as any).openLesson = openLesson;
    (window as any).closeLessonModal = closeLessonModal;
    (window as any).completeLesson = completeLesson;
    (window as any).speakText = speakText;
    (window as any).openRandomQuiz = openRandomQuiz;
    (window as any).openDailyChallenge = openDailyChallenge;
    (window as any).speakWordOfDay = speakWordOfDay;
    (window as any).setPathFilter = setPathFilter;
    (window as any).openReviewSession = openReviewSession;
}

// Initialize Word of the Day (Random on each page load)
function initWordOfDay(): void {
    const wodWord = document.getElementById('wodWord');
    const wodTranslation = document.getElementById('wodTranslation');
    const wodExampleSwe = document.getElementById('wodExampleSwe');
    const wodExampleArb = document.getElementById('wodExampleArb');
    const wodCategory = document.querySelector('.wod-category');
    const wodDate = document.getElementById('wodDate');

    if (!wodWord) return;

    // Wait for dictionaryData to be loaded
    const tryLoadWord = () => {
        if (typeof dictionaryData !== 'undefined' && Array.isArray(dictionaryData) && dictionaryData.length > 0) {
            // Select a random word on each page load
            const index = Math.floor(Math.random() * dictionaryData.length);
            const word = dictionaryData[index];

            console.log('[LearnUI] Word of the Day:', word.swedish);

            if (wodWord) wodWord.textContent = word.swedish;
            if (wodTranslation) wodTranslation.textContent = word.arabic;

            // Find an example if available, or create a fallback
            const exampleSwe = word.example || `${word.swedish} är ett bra ord.`;
            const exampleArb = word.example_ar || `كلمة ${word.arabic} كلمة جيدة.`;

            if (wodExampleSwe) wodExampleSwe.textContent = exampleSwe;
            if (wodExampleArb) wodExampleArb.textContent = exampleArb;

            if (wodCategory) wodCategory.textContent = `🏷️ ${word.type || 'Ord'}`;
        } else {
            // Data not loaded yet, retry after 200ms
            setTimeout(tryLoadWord, 200);
        }
    };

    tryLoadWord();

    // Format date: "30 December"
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long' };
    if (wodDate) wodDate.textContent = today.toLocaleDateString('sv-SE', options);
}

// Initialize
export function initLearnUI(): void {
    console.log('[LearnUI] Initializing...');

    loadState();
    exportToWindow();
    setupFilters();
    setupSearch();
    renderLessons();
    // updateStatsUI(); // Removed
    initWordOfDay();

    console.log('[LearnUI] Initialized successfully');
}

// Add CSS for lesson cards
const style = document.createElement('style');
style.textContent = `
    .lesson-card {
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.95));
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 20px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        overflow: hidden;
    }
    
    .lesson-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
        border-color: rgba(96, 165, 250, 0.3);
    }
    
    .lesson-card.completed {
        border-color: rgba(34, 197, 94, 0.3);
    }
    
    .lesson-card.completed::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #22c55e, #34d399);
    }
    
    .lesson-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.8rem;
    }
    
    .lesson-level {
        padding: 0.3rem 0.8rem;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: capitalize;
    }
    
    .lesson-complete-badge {
        background: #22c55e;
        color: white;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
    }
    
    .lesson-title {
        color: #e2e8f0;
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        line-height: 1.4;
    }
    
    .lesson-meta {
        display: flex;
        gap: 1rem;
        font-size: 0.8rem;
        color: #64748b;
        margin-bottom: 0.8rem;
    }
    
    .lesson-progress-bar {
        height: 4px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }
    
    .lesson-progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #60a5fa, #34d399);
        border-radius: 4px;
        transition: width 0.5s ease;
    }
    
    /* Lesson content styles */
    .lesson-sections {
        padding-bottom: 2rem;
    }
    
    .lesson-section {
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 16px;
        padding: 1.5rem;
        margin-bottom: 1.5rem;
    }
    
    .section-title {
        color: #60a5fa;
        font-size: 1.2rem;
        margin-bottom: 1rem;
    }
    
    .content-item {
        color: #e2e8f0;
        line-height: 1.8;
        margin-bottom: 1rem;
    }
    
    .examples-list {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    
    .example-item {
        background: rgba(15, 23, 42, 0.6);
        border-radius: 12px;
        padding: 1rem;
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    
    .example-swe {
        color: #e2e8f0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.3rem;
    }
    
    .example-arb {
        color: #94a3b8;
        direction: rtl;
        text-align: right;
        font-size: 0.9rem;
    }
    
    .speak-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        opacity: 0.7;
        transition: opacity 0.2s;
    }
    
    .speak-btn:hover {
        opacity: 1;
    }
    
    .show-more-btn {
        background: rgba(96, 165, 250, 0.2);
        border: 1px solid rgba(96, 165, 250, 0.3);
        color: #60a5fa;
        padding: 0.8rem;
        border-radius: 12px;
        cursor: pointer;
        width: 100%;
        font-size: 0.9rem;
        transition: all 0.3s;
    }
    
    .show-more-btn:hover {
        background: rgba(96, 165, 250, 0.3);
    }
    
    .more-examples {
        display: none;
    }
    
    .examples-list.expanded .more-examples {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    
    .complete-lesson-btn {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        border: none;
        color: white;
        padding: 1rem 2rem;
        border-radius: 16px;
        font-size: 1rem;
        cursor: pointer;
        width: 100%;
        margin-top: 1rem;
        transition: all 0.3s;
    }
    
    .complete-lesson-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
    }
    
    .lesson-actions {
        margin-top: 2rem;
    }
    
    /* Level up animation */
    .level-badge.level-up {
        animation: levelUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    
    @keyframes levelUp {
        0% { transform: scale(1); }
        50% { transform: scale(1.3); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);
