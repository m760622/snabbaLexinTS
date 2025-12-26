import { showToast, TextSizeManager } from './utils';
import { lessonsData } from './learn/lessonsData';
import { Lesson } from './types';
import { TTSManager } from './tts';
import { t, LanguageManager } from './i18n';

/**
 * UI Logic for the Learning section
 */
export function initLearnUI() {
    console.log('[LearnUI] Initializing...');

    // State
    const state = {
        completedLessons: JSON.parse(localStorage.getItem('completedLessons') || '[]'),
        lessonProgress: JSON.parse(localStorage.getItem('lessonProgress') || '{}'),
        learningStats: JSON.parse(localStorage.getItem('learningStats') || '{"streak": 0, "lastDate": "", "totalXP": 0}'),
        reviewWords: JSON.parse(localStorage.getItem('reviewWords') || '[]'),
        currentQuiz: null as any
    };

    // UI elements
    const elements = {
        streakCount: document.getElementById('streakCount'),
        totalXP: document.getElementById('totalXP'),
        completedCount: document.getElementById('completedCount'),
        overallProgress: document.getElementById('overallProgress'),
        progressText: document.getElementById('progressText'),
        reviewBanner: document.getElementById('reviewBanner'),
        reviewCount: document.getElementById('reviewCount'),
        lessonSearchInput: document.getElementById('lessonSearchInput') as HTMLInputElement,
        lessonsGrid: document.getElementById('lessonsGrid'),
        lessonModal: document.getElementById('lessonModal'),
        modalTitle: document.getElementById('modalTitle'),
        lessonContent: document.getElementById('lessonContent'),
        mobileToggle: document.getElementById('mobileToggle')
    };

    // Export to window for HTML onclicks
    (window as any).toggleMobileView = () => (window as any).MobileViewManager?.toggle();

    (window as any).openLesson = (id: string) => openLesson(id, state, elements);
    (window as any).closeLessonModal = () => elements.lessonModal?.classList.remove('active');
    (window as any).startLessonQuiz = (id: string) => startLessonQuiz(id, state, elements);
    (window as any).openRandomQuiz = () => openRandomQuiz(state, elements);
    (window as any).openReviewSession = () => showToast(t('learn.reviewTime'));
    (window as any).checkQuizAnswer = (btn: HTMLButtonElement, isCorrect: boolean) => checkQuizAnswer(btn, isCorrect, state, elements);
    (window as any).speakText = (text: string, lang: string) => speakText(text, lang);

    // Initial checks
    applyTheme();
    updateDailyStats(state);
    updateProgressUI(state, elements);
    renderLessons(state, elements);
    checkReviewWords(state, elements);

    // Listeners
    elements.lessonSearchInput?.addEventListener('input', () => filterLessons(state, elements));
    document.querySelectorAll('.filter-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            filterLessons(state, elements);
        });
    });
}

function applyTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    if (localStorage.getItem('mobileView') === 'true') {
        document.documentElement.classList.add('iphone-mode');
        document.body.classList.add('iphone-view');
        document.getElementById('mobileToggle')?.classList.add('active');
    }
}

function updateDailyStats(state: any) {
    const today = new Date().toISOString().split('T')[0];
    const stats = state.learningStats;

    if (stats.lastDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (stats.lastDate === yesterday) {
            stats.streak++;
        } else if (stats.lastDate && stats.lastDate !== today) {
            stats.streak = 1;
        } else if (!stats.lastDate) {
            stats.streak = 1;
        }
        stats.lastDate = today;
        stats.totalXP += 10;
        localStorage.setItem('learningStats', JSON.stringify(stats));
    }
}

function updateProgressUI(state: any, elements: any) {
    if (elements.streakCount) elements.streakCount.textContent = state.learningStats.streak;
    if (elements.totalXP) elements.totalXP.textContent = state.learningStats.totalXP;
    if (elements.completedCount) elements.completedCount.textContent = state.completedLessons.length;

    const totalLessonsCount = lessonsData.length;
    const progress = totalLessonsCount > 0 ? Math.round((state.completedLessons.length / totalLessonsCount) * 100) : 0;
    if (elements.overallProgress) elements.overallProgress.style.width = progress + '%';
    if (elements.progressText) {
        const lang = LanguageManager.getLanguage();
        const completeText = lang === 'sv' ? 'klar' : lang === 'ar' ? 'مكتمل' : 'klar / مكتمل';
        elements.progressText.innerHTML = `${progress}% ${completeText}`;
    }
}

function addXP(amount: number, state: any, elements: any) {
    state.learningStats.totalXP += amount;
    localStorage.setItem('learningStats', JSON.stringify(state.learningStats));
    updateProgressUI(state, elements);
}

function renderLessons(state: any, elements: any) {
    if (!elements.lessonsGrid) return;

    elements.lessonsGrid.innerHTML = lessonsData.map((lesson: Lesson) => {
        const isCompleted = state.completedLessons.includes(lesson.id);
        const progress = state.lessonProgress[lesson.id] || 0;
        const levelClass = lesson.level || 'beginner';

        return `
            <div class="lesson-card ${isCompleted ? 'completed' : ''}" onclick="openLesson('${lesson.id}')">
                ${isCompleted ? '<div class="lesson-badge">✓</div>' : ''}
                <div class="lesson-icon">${getIconForLesson(lesson.id)}</div>
                <div class="lesson-info">
                    <div class="lesson-title" data-auto-size>${getTitleForLesson(lesson.id)}</div>
                    <div class="lesson-desc" data-auto-size>${getDescForLesson(lesson.id)}</div>
                </div>
                <span class="level-badge ${levelClass}">${getLevelLabel(levelClass)}</span>
                <div class="lesson-progress"><div class="fill" style="width: ${progress}%"></div></div>
            </div>`;
    }).join('');

    // Apply sizing to cards
    TextSizeManager.autoApply();
}

function filterLessons(_state: any, elements: any) {
    const searchTerm = elements.lessonSearchInput?.value.toLowerCase() || '';
    const activeChip = document.querySelector('.filter-chip.active') as HTMLElement;
    const activeFilter = activeChip?.dataset.filter || 'all';

    document.querySelectorAll('.lesson-card').forEach((card, index) => {
        const lesson = lessonsData[index];
        if (!lesson) return;

        const matchesSearch = lesson.title.toLowerCase().includes(searchTerm) ||
            getSubtitleForLesson(lesson.id).toLowerCase().includes(searchTerm);
        const matchesFilter = activeFilter === 'all' || lesson.level === activeFilter;
        (card as HTMLElement).style.display = matchesSearch && matchesFilter ? 'flex' : 'none';
    });
}

function getIconForLesson(id: string) {
    const icons: Record<string, string> = {
        wordOrder: '📝', pronouns: '👤', verbs: '🏃', adjectives: '🎨',
        prepositions: '📍', gender: '⚖️', questions: '❓', numbers: '🔢',
        phrases: '💬', falseFriends: '🎭', hospital: '🏥', work: '💼',
        bank: '🏦', mistakes: '⚠️', airport: '✈️', onlineShopping: '🛒'
    };
    return icons[id] || '📚';
}

function getTitleForLesson(id: string) {
    const titles: Record<string, { sv: string; ar: string }> = {
        wordOrder: { sv: 'Ordföljd - V2-regeln', ar: 'ترتيب الجملة - قاعدة V2' },
        pronouns: { sv: 'Pronomen', ar: 'الضمائر' },
        verbs: { sv: 'Verb och tempus', ar: 'الأفعال والأزمنة' },
        adjectives: { sv: 'Adjektiv', ar: 'الصفات' },
        prepositions: { sv: 'Prepositioner', ar: 'حروف الجر' },
        gender: { sv: 'Genus (en/ett)', ar: 'المذكر والمؤنث' },
        questions: { sv: 'Frågor och nekande', ar: 'الأسئلة والنفي' },
        numbers: { sv: 'Siffror och tid', ar: 'الأرقام والوقت' },
        phrases: { sv: 'Vanliga fraser', ar: 'عبارات شائعة' },
        falseFriends: { sv: 'Falska vänner', ar: 'أصدقاء مخادعون' },
        hospital: { sv: 'På sjukhuset', ar: 'في المستشفى' },
        work: { sv: 'På jobbet', ar: 'في العمل' },
        bank: { sv: 'På banken', ar: 'في البنك' },
        mistakes: { sv: 'Vanliga misstag', ar: 'أخطاء شائعة' },
        airport: { sv: 'På flygplatsen', ar: 'في المطار' },
        onlineShopping: { sv: 'Näthandel', ar: 'التسوق عبر الإنترنت' }
    };
    const title = titles[id];
    if (!title) return id;
    return `<span class="sv-text">${title.sv}</span><span class="ar-text">${title.ar}</span>`;
}

function getSubtitleForLesson(id: string) {
    const lang = LanguageManager.getLanguage();
    const subs: Record<string, { sv: string; ar: string }> = {
        wordOrder: { sv: 'Meningsbyggnad - V2-regeln', ar: 'ترتيب الجملة - قاعدة V2' },
        pronouns: { sv: 'Personliga pronomen', ar: 'الضمائر الشخصية' },
        verbs: { sv: 'Verb och tempus', ar: 'الأفعال والأزمنة' },
        adjectives: { sv: 'Adjektiv', ar: 'الصفات' },
        prepositions: { sv: 'Prepositioner', ar: 'حروف الجر' },
        gender: { sv: 'Genus (en/ett)', ar: 'المذكر والمؤنث' },
        questions: { sv: 'Frågor och nekande', ar: 'الأسئلة والنفي' },
        numbers: { sv: 'Siffror och tid', ar: 'الأرقام والوقت' },
        phrases: { sv: 'Vanliga fraser', ar: 'عبارات شائعة' },
        falseFriends: { sv: 'Falska vänner', ar: 'أصدقاء مخادعون' },
        hospital: { sv: 'På sjukhuset', ar: 'في المستشفى' },
        work: { sv: 'På jobbet', ar: 'في العمل' },
        bank: { sv: 'På banken', ar: 'في البنك' },
        mistakes: { sv: 'Vanliga misstag', ar: 'أخطاء شائعة' },
        airport: { sv: 'På flygplatsen', ar: 'في المطار' },
        onlineShopping: { sv: 'Näthandel', ar: 'التسوق عبر الإنترنت' }
    };
    const sub = subs[id];
    if (!sub) return '';
    if (lang === 'sv') return sub.sv;
    if (lang === 'ar') return sub.ar;
    return `${sub.sv} | ${sub.ar}`;
}

function getDescForLesson(id: string) {
    const lang = LanguageManager.getLanguage();
    const descs: Record<string, { sv: string; ar: string }> = {
        wordOrder: { sv: 'Lär dig hur svenska meningar är uppbyggda och den viktiga V2-regeln.', ar: 'تعلم كيف تُبنى الجمل السويدية وقاعدة V2 المهمة.' },
        pronouns: { sv: 'Personliga pronomen: jag, du, han, hon, vi, ni, de', ar: 'الضمائر الشخصية: أنا، أنت، هو، هي، نحن، أنتم، هم' },
        verbs: { sv: 'Presens, preteritum, perfekt och futurum', ar: 'المضارع، الماضي، التام والمستقبل' },
        adjectives: { sv: 'Hur adjektiv böjs: en stor bil, ett stort hus', ar: 'كيف تُصرّف الصفات: سيارة كبيرة، بيت كبير' },
        prepositions: { sv: 'i, på, till, från, med, utan, för, av...', ar: 'في، على، إلى، من، مع، بدون، لـ، من...' },
        gender: { sv: 'Genus i svenska: en bok, ett bord', ar: 'الجنس في السويدية: كتاب (en)، طاولة (ett)' },
        questions: { sv: 'Hur man ställer frågor och säger nej på svenska', ar: 'كيف تطرح أسئلة وتقول لا بالسويدية' },
        numbers: { sv: '1-100, klockan, dagar och månader', ar: '1-100، الساعة، الأيام والشهور' },
        phrases: { sv: 'Hälsningar, artighetsfraser och vardagsuttryck', ar: 'التحيات، عبارات المجاملة والتعابير اليومية' },
        falseFriends: { sv: 'Ord som liknar arabiska men har annan betydelse', ar: 'كلمات تشبه العربية لكن لها معنى مختلف' },
        hospital: { sv: 'Fraser och ord du behöver på vårdcentralen', ar: 'عبارات وكلمات تحتاجها في المركز الصحي' },
        work: { sv: 'Vanliga uttryck på arbetsplatsen', ar: 'تعبيرات شائعة في مكان العمل' },
        bank: { sv: 'Ord och fraser för bankärenden', ar: 'كلمات وعبارات للمعاملات البنكية' },
        mistakes: { sv: 'Typiska fel som arabisktalande gör', ar: 'أخطاء شائعة يرتكبها الناطقون بالعربية' },
        airport: { sv: 'Incheckning, säkerhetskontroll, ombord', ar: 'تسجيل الوصول، التفتيش الأمني، على متن الطائرة' },
        onlineShopping: { sv: 'Beställa, betala, leverans och retur', ar: 'الطلب، الدفع، التوصيل والإرجاع' }
    };
    const desc = descs[id];
    if (!desc) return '';
    if (lang === 'sv') return desc.sv;
    if (lang === 'ar') return desc.ar;
    return `${desc.sv} | ${desc.ar}`;
}

function getLevelLabel(level: string) {
    const labels: Record<string, string> = {
        beginner: '<span class="sv-text">Nybörjare</span><span class="ar-text">مبتدئ</span>',
        intermediate: '<span class="sv-text">Medel</span><span class="ar-text">متوسط</span>',
        advanced: '<span class="sv-text">Avancerad</span><span class="ar-text">متقدم</span>'
    };
    return labels[level] || '';
}

function openLesson(id: string, state: any, elements: any) {
    const lesson = lessonsData.find((l: Lesson) => l.id === id);
    if (!lesson) return;

    if (elements.modalTitle) elements.modalTitle.textContent = lesson.title;
    let html = '';

    lesson.sections.forEach((section: any) => {
        html += `<div class="lesson-section"><h3>${section.title}</h3>`;
        section.content.forEach((item: any) => {
            if (item.type === 'p') html += `<p>${item.html}</p>`;
            else if (item.type === 'rule') html += `<div class="rule-highlight">${item.html}</div>`;
        });

        if (section.examples && section.examples.length > 0) {
            section.examples.forEach((ex: any) => {
                html += `
                    <div class="example-box">
                        <div class="swe">
                            ${ex.swe}
                            <button class="speak-btn" onclick="speakText('${ex.swe.replace(/'/g, "\\'")}', 'sv')">🔊</button>
                        </div>
                        <div class="arb">${ex.arb}</div>
                    </div>`;
            });
        }
        html += '</div>';
    });

    html += `
        <div class="lesson-completion">
            <button class="quiz-start-btn" onclick="startLessonQuiz('${id}')">
                📝 <span class="sv-text">Testa dig</span><span class="ar-text">اختبر نفسك</span>
            </button>
        </div>`;

    if (elements.lessonContent) {
        elements.lessonContent.innerHTML = html;
        // Apply sizing to examples
        elements.lessonContent.querySelectorAll('.example-box .swe, .example-box .arb, .lesson-section h3, .rule-highlight').forEach((el: HTMLElement) => {
            TextSizeManager.apply(el, el.textContent || '');
        });
    }
    elements.lessonModal?.classList.add('active');

    if (!state.lessonProgress[id]) state.lessonProgress[id] = 50;
    localStorage.setItem('lessonProgress', JSON.stringify(state.lessonProgress));
}

function speakText(text: string, lang: string) {
    if (TTSManager) {
        TTSManager.speak(text, lang === 'sv' ? 'sv' : 'ar');
    } else {
        // Fallback if TTSManager not available
        const u = new SpeechSynthesisUtterance(text);
        u.lang = lang === 'sv' ? 'sv-SE' : 'ar-SA';
        window.speechSynthesis.speak(u);
    }
}

function startLessonQuiz(lessonId: string, state: any, elements: any) {
    const lesson = lessonsData.find((l: Lesson) => l.id === lessonId);
    if (!lesson) return;

    const allExamples: any[] = [];
    lesson.sections.forEach((section: any) => {
        if (section.examples) {
            section.examples.forEach((ex: any) => {
                allExamples.push({ swe: ex.swe, arb: ex.arb });
            });
        }
    });

    if (allExamples.length < 4) {
        showToast(t('learn.noExamples'));
        return;
    }

    const shuffled = [...allExamples].sort(() => 0.5 - Math.random());
    state.currentQuiz = {
        lessonId: lessonId,
        questions: shuffled.slice(0, Math.min(10, shuffled.length)),
        pool: allExamples,
        index: 0,
        score: 0
    };

    renderQuizQuestion(state, elements);
}

function renderQuizQuestion(state: any, elements: any) {
    const q = state.currentQuiz.questions[state.currentQuiz.index];
    const total = state.currentQuiz.questions.length;

    const wrongPool = state.currentQuiz.pool.filter((ex: any) => ex.swe !== q.swe);
    const wrongOptions = wrongPool.sort(() => 0.5 - Math.random()).slice(0, 3).map((ex: any) => ex.arb);
    const options = [q.arb, ...wrongOptions].sort(() => 0.5 - Math.random());

    const html = `
        <div class="quiz-container">
            <div class="quiz-header">
                <h2>${t('learn.question')} ${state.currentQuiz.index + 1} / ${total}</h2>
                <div class="progress-bar"><div style="width: ${(state.currentQuiz.index / total) * 100}%"></div></div>
            </div>
            <div class="question-card">
                <div class="question-text">${q.swe}</div>
                <div class="options-grid" id="quizOptions">
                    ${options.map(opt => `
                        <button class="option-btn" data-correct="${opt === q.arb}" onclick="checkQuizAnswer(this, ${opt === q.arb})">
                            ${opt}
                        </button>
                    `).join('')}
                </div>
                <div id="quizFeedback"></div>
            </div>
        </div>`;

    if (elements.lessonContent) {
        elements.lessonContent.innerHTML = html;
        // Apply sizing to quiz elements
        const qText = elements.lessonContent.querySelector('.question-text') as HTMLElement;
        if (qText) TextSizeManager.apply(qText, qText.textContent || '');
        elements.lessonContent.querySelectorAll('.option-btn').forEach((btn: HTMLElement) => {
            TextSizeManager.apply(btn, btn.textContent || '');
        });
    }
}

function checkQuizAnswer(btn: HTMLButtonElement, isCorrect: boolean, state: any, elements: any) {
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(b => {
        (b as HTMLButtonElement).disabled = true;
        if (b.getAttribute('data-correct') === 'true') b.classList.add('correct-answer');
        else if (b === btn && !isCorrect) b.classList.add('wrong-answer');
    });

    const feedback = document.getElementById('quizFeedback');
    if (feedback) {
        if (isCorrect) {
            state.currentQuiz.score++;
            feedback.innerHTML = '<div class="answer-feedback feedback-correct-box">✅ <span class="sv-text">Rätt!</span><span class="ar-text">صحيح!</span></div>';
        } else {
            feedback.innerHTML = '<div class="answer-feedback feedback-wrong-box">❌ <span class="sv-text">Fel!</span><span class="ar-text">خطأ!</span></div>';
        }
    }

    setTimeout(() => {
        state.currentQuiz.index++;
        if (state.currentQuiz.index < state.currentQuiz.questions.length) {
            renderQuizQuestion(state, elements);
        } else {
            showQuizResults(state, elements);
        }
    }, 1500);
}

function showQuizResults(state: any, elements: any) {
    const score = state.currentQuiz.score;
    const total = state.currentQuiz.questions.length;
    const percent = Math.round((score / total) * 100);
    const passed = percent >= 70;

    if (passed) {
        if (!state.completedLessons.includes(state.currentQuiz.lessonId)) {
            state.completedLessons.push(state.currentQuiz.lessonId);
            localStorage.setItem('completedLessons', JSON.stringify(state.completedLessons));
        }
        state.lessonProgress[state.currentQuiz.lessonId] = 100;
        localStorage.setItem('lessonProgress', JSON.stringify(state.lessonProgress));
        addXP(50, state, elements);
    } else {
        addXP(10, state, elements);
    }

    const html = `
        <div class="quiz-results">
            <div class="result-icon">${passed ? '🎉' : '📚'}</div>
            <h2>${passed ? '<span class="sv-text">Grattis!</span><span class="ar-text">مبروك!</span>' : '<span class="sv-text">Fortsätt öva!</span><span class="ar-text">واصل التمرين!</span>'}</h2>
            <p>${score} / ${total} <span class="sv-text">rätt</span><span class="ar-text">صحيح</span> (${percent}%)</p>
            <p style="color: var(--primary);">+${passed ? 50 : 10} XP</p>
            <div class="result-actions">
                <button class="result-btn success" onclick="closeLessonModal()"><span class="sv-text">Fortsätt</span><span class="ar-text">متابعة</span></button>
                <button class="result-btn retry" onclick="startLessonQuiz('${state.currentQuiz.lessonId}')"><span class="sv-text">Försök igen</span><span class="ar-text">حاول مرة أخرى</span></button>
            </div>
        </div>`;

    if (elements.lessonContent) elements.lessonContent.innerHTML = html;
}

function checkReviewWords(state: any, elements: any) {
    const today = new Date().toISOString().split('T')[0];
    const dueWords = state.reviewWords.filter((w: any) => w.nextReview <= today);

    if (dueWords.length > 0) {
        elements.reviewBanner?.classList.remove('hidden');
        if (elements.reviewCount) elements.reviewCount.textContent = dueWords.length;
    }
}

function openRandomQuiz(state: any, elements: any) {
    const validLessons = lessonsData.filter((lesson: Lesson) => {
        let exampleCount = 0;
        lesson.sections.forEach((section: any) => {
            if (section.examples) exampleCount += section.examples.length;
        });
        return exampleCount >= 4;
    });

    if (validLessons.length === 0) {
        showToast(t('learn.noLessons'));
        return;
    }

    const randomLesson = validLessons[Math.floor(Math.random() * validLessons.length)];
    if (elements.modalTitle) elements.modalTitle.textContent = '🎲 ' + randomLesson.title;
    elements.lessonModal?.classList.add('active');
    startLessonQuiz(randomLesson.id, state, elements);
}
