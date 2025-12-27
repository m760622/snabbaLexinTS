/**
 * Grammar Game - Cyber Matrix Theme
 * TypeScript Version
 */

// Types
interface GrammarRule {
    category: string;
    hint: string;
    words: string[];
    correct: string[];
    explanation: string;
    explanationAr?: string;
}

import { showToast, saveScore } from './games-utils';
import { TTSManager } from '../tts';
import { grammarDatabase } from '../data/grammarData';

declare const soundManager: { playClick?: () => void; playSuccess?: () => void; playError?: () => void } | undefined;

console.log("grammarGame.ts LOADED");

// Grammar Game State
let grammarTarget: string[] = [];
let grammarCurrent: string[] = [];
let grammarScore = 0;
let currentGrammarRule: GrammarRule | null = null;
let grammarRules: GrammarRule[] = [];
let grammarInitialized = false;

// Category to Lesson ID Mapping
const categoryToLessonId: Record<string, string> = {
    'word-order': 'wordOrder',
    'v2-rule': 'v2Rule',
    'questions': 'questions',
    'adverbs': 'wordOrder',
    'time-manner-place': 'wordOrder',
    'bisatser': 'wordOrder',
    'possessiva': 'pronouns',
    'prepositioner': 'prepositions',
    'passiv': 'verbs',
    'imperativ': 'verbs',
    'komparativ': 'adjectives'
};

/**
 * Generate rules for all categories
 */
function initializeGrammarRules(): void {
    if (typeof grammarDatabase !== 'undefined' && grammarDatabase) {
        console.log('📚 Loading grammar rules from Static Database...');
        grammarRules = [];

        for (const [category, sentences] of Object.entries(grammarDatabase)) {
            (sentences as any[]).forEach((sent: any) => {
                grammarRules.push({
                    category: category,
                    ...sent
                });
            });
        }

        grammarInitialized = true;
        console.log(`✅ Loaded ${grammarRules.length} grammar rules from Static Database`);
    } else {
        console.error('❌ grammarDatabase not found! Grammar game will not work.');
    }
}

/**
 * Start Grammar Game
 */
export function startGrammarGame(retryCount = 0): void {
    if (!grammarInitialized || grammarRules.length === 0) {
        initializeGrammarRules();

        if (retryCount < 10) {
            console.warn(`Rules not ready for Grammar Game. Retrying (${retryCount + 1}/10)...`);
            if (typeof showToast === 'function') showToast("Laddar grammatik... / جاري تحميل القواعد...", 'info');
            setTimeout(() => startGrammarGame(retryCount + 1), 500);
        } else {
            console.error("Critical: Failed to load grammar rules.");
            if (typeof showToast === 'function') showToast("Kunde inte ladda speldata. / تعذر تحميل البيانات.", 'error');
        }
        return;
    }

    const hintEl = document.getElementById('grammarHint');
    const dropZone = document.getElementById('grammarDropZone');
    const wordBank = document.getElementById('grammarWordBank');
    const feedbackEl = document.getElementById('grammarFeedback');
    const explanationEl = document.getElementById('grammarExplanation');
    const nextBtn = document.getElementById('nextGrammarBtn');
    const checkBtn = document.getElementById('checkGrammarBtn') as HTMLButtonElement | null;
    const showAnswerBtn = document.getElementById('grammarShowAnswerBtn') as HTMLButtonElement | null;

    if (!hintEl || !dropZone || !wordBank || !feedbackEl || !explanationEl || !nextBtn || !checkBtn) return;

    // Reset UI
    dropZone.innerHTML = '<div class="gr-drop-placeholder"><span class="gr-drop-icon">⬇️</span><span>Dra ord hit / اسحب الكلمات هنا</span></div>';
    wordBank.innerHTML = '';
    feedbackEl.textContent = '';
    feedbackEl.className = 'gr-feedback';
    explanationEl.classList.add('hidden');
    const explanationContent = explanationEl.querySelector('.gr-explanation-content');
    if (explanationContent) explanationContent.innerHTML = '';
    nextBtn.classList.add('hidden');
    checkBtn.classList.remove('hidden');
    checkBtn.disabled = false;
    if (showAnswerBtn) {
        showAnswerBtn.classList.remove('hidden');
        showAnswerBtn.disabled = false;
    }
    dropZone.classList.remove('correct', 'wrong');
    grammarCurrent = [];

    // Get selected category
    const categoryFilter = document.getElementById('grammarCategoryFilter') as HTMLSelectElement | null;
    const selectedCategory = categoryFilter?.value || 'all';

    // Filter rules by category
    let filteredRules = grammarRules;
    if (selectedCategory !== 'all') {
        filteredRules = grammarRules.filter(rule => rule.category === selectedCategory);
    }

    if (filteredRules.length === 0) {
        const hintText = hintEl.querySelector('.gr-hint-text');
        if (hintText) hintText.textContent = 'Inga regler hittades / لم يتم العثور على قواعد';
        return;
    }

    // Pick random rule
    currentGrammarRule = filteredRules[Math.floor(Math.random() * filteredRules.length)];
    grammarTarget = currentGrammarRule.correct;

    // Set hint text
    const hintText = hintEl.querySelector('.gr-hint-text');
    if (hintText) {
        hintText.textContent = currentGrammarRule.hint;
    } else {
        hintEl.textContent = currentGrammarRule.hint;
    }

    // Shuffle words for bank
    const shuffled = [...currentGrammarRule.words].sort(() => Math.random() - 0.5);

    shuffled.forEach((word, index) => {
        const btn = document.createElement('button');
        // Use standard quiz-option class for consistent styling (80% width, stacked)
        btn.className = 'quiz-option animate-in';
        btn.style.animationDelay = `${index * 0.1}s`;
        btn.textContent = word;
        btn.dataset.word = word;
        btn.dataset.id = String(index);

        btn.onclick = () => {
            // Play click sound
            if (typeof soundManager !== 'undefined' && soundManager?.playClick) {
                soundManager.playClick();
            }

            if (btn.parentElement === wordBank) {
                // Moving to DropZone (Sentence Construction)
                // Switch from Button style to Chip style
                const placeholder = dropZone.querySelector('.gr-drop-placeholder');
                if (placeholder) placeholder.remove();

                dropZone.appendChild(btn);
                btn.classList.remove('quiz-option'); // Remove big button style
                btn.classList.add('gr-word-chip');   // Add chip style for sentence
                btn.classList.add('in-zone');
                grammarCurrent.push(word);
            } else {
                // Moving back to WordBank (Options)
                // Switch from Chip style to Button style
                wordBank.appendChild(btn);
                btn.classList.remove('gr-word-chip'); // Remove chip style
                btn.classList.add('quiz-option');     // Restore big button style
                btn.classList.remove('in-zone');
                const idx = grammarCurrent.indexOf(word);
                if (idx > -1) grammarCurrent.splice(idx, 1);

                // Re-add placeholder if empty
                if (dropZone.children.length === 0) {
                    dropZone.innerHTML = '<div class="gr-drop-placeholder"><span class="gr-drop-icon">⬇️</span><span>Dra ord hit / اسحب الكلمات هنا</span></div>';
                }
            }
        };
        wordBank.appendChild(btn);
    });

    // Bind check button
    checkBtn.onclick = () => {
        const currentStr = Array.from(dropZone.querySelectorAll('.gr-word-chip')).map(c => c.textContent).join(' ');
        const targetStr = grammarTarget.join(' ');

        if (currentStr === targetStr && currentGrammarRule) {
            // Success!
            feedbackEl.textContent = "Helt rätt! 🌟 / صحيح تماماً!";
            feedbackEl.className = 'gr-feedback success';
            dropZone.classList.add('correct');
            grammarScore += 20;
            const scoreEl = document.getElementById('grammarScore');
            if (scoreEl) scoreEl.textContent = String(grammarScore);
            if (typeof saveScore === 'function') saveScore('grammar', grammarScore);

            // Play success sound
            if (typeof soundManager !== 'undefined' && soundManager?.playSuccess) {
                soundManager.playSuccess();
            }

            // Show explanation
            const sentenceText = grammarTarget.join(' ');
            const explanationContent = explanationEl.querySelector('.gr-explanation-content');
            if (explanationContent) {
                explanationContent.innerHTML = `
                    <strong>✓ Korrekt!</strong>
                    <button class="grammar-listen-btn" onclick="speakSentence('${sentenceText.replace(/'/g, "\\'")}')" style="background:none; border:none; cursor:pointer; font-size:1.5rem; float:right; filter: drop-shadow(0 0 5px rgba(34,211,238,0.5));">🔊</button>
                    <br>${currentGrammarRule.explanation}<br>
                    <span style="direction: rtl; display: block; margin-top: 0.5rem; color: #a7f3d0;">${currentGrammarRule.explanationAr || ''}</span>
                `;
            }
            explanationEl.classList.remove('hidden');

            nextBtn.classList.remove('hidden');
            checkBtn.classList.add('hidden');
        } else {
            // Wrong
            feedbackEl.textContent = "Inte riktigt... Försök igen! / ليس تماماً...";
            feedbackEl.className = 'gr-feedback error';
            dropZone.classList.add('wrong');

            // Play error sound
            if (typeof soundManager !== 'undefined' && soundManager?.playError) {
                soundManager.playError();
            }

            // Remove wrong class after animation
            setTimeout(() => dropZone.classList.remove('wrong'), 500);
        }
    };

    nextBtn.onclick = () => startGrammarGame();
}

/**
 * Speak helper
 */
function speakSentence(text: string): void {
    if (typeof TTSManager !== 'undefined' && TTSManager) {
        TTSManager.speak(text);
    } else {
        console.warn('TTSManager not found');
    }
}

/**
 * Show Grammar Answer
 */
export function showGrammarAnswer(): void {
    const dropZone = document.getElementById('grammarDropZone');
    const wordBank = document.getElementById('grammarWordBank');
    const feedbackEl = document.getElementById('grammarFeedback');
    const explanationEl = document.getElementById('grammarExplanation');
    const nextBtn = document.getElementById('nextGrammarBtn');
    const checkBtn = document.getElementById('checkGrammarBtn') as HTMLButtonElement | null;
    const showAnswerBtn = document.getElementById('grammarShowAnswerBtn') as HTMLButtonElement | null;

    if (!currentGrammarRule || !dropZone || !wordBank || !feedbackEl || !explanationEl || !nextBtn) return;

    // Fill drop zone with correct order
    dropZone.innerHTML = '';
    grammarTarget.forEach((word, index) => {
        const el = document.createElement('div');
        el.className = 'gr-word-chip in-zone animate-in';
        el.style.animationDelay = `${index * 0.1}s`;
        el.textContent = word;
        dropZone.appendChild(el);
    });

    // Disable word bank
    const bankWords = wordBank.querySelectorAll('.quiz-option') as NodeListOf<HTMLElement>;
    bankWords.forEach(w => {
        w.style.opacity = '0.4';
        w.style.pointerEvents = 'none';
    });

    feedbackEl.textContent = "Här är rätt svar! / إليك الإجابة الصحيحة!";
    feedbackEl.className = 'gr-feedback';

    // Construct Explanation HTML
    const sentenceText = grammarTarget.join(' ');
    const lessonId = categoryToLessonId[currentGrammarRule.category];
    let learnLinkHtml = '';

    if (lessonId) {
        learnLinkHtml = `<a href="learn.html?lesson=${lessonId}" class="learn-link-btn" style="display:inline-block; margin-top:10px; padding:8px 16px; background: linear-gradient(145deg, rgba(34, 211, 238, 0.3), rgba(6, 182, 212, 0.2)); color:#67e8f9; border-radius:12px; text-decoration:none; font-size:0.9rem; border: 1px solid rgba(34, 211, 238, 0.4);">📖 Läs regeln / اقرأ القاعدة</a>`;
    }

    const explanationContent = explanationEl.querySelector('.gr-explanation-content');
    if (explanationContent) {
        explanationContent.innerHTML = `
            <strong>ℹ️ Förklaring:</strong>
            <button class="grammar-listen-btn" onclick="speakSentence('${sentenceText.replace(/'/g, "\\'")}')" style="background:none; border:none; cursor:pointer; font-size:1.5rem; float:right; filter: drop-shadow(0 0 5px rgba(34,211,238,0.5));">🔊</button>
            <br>${currentGrammarRule.explanation}<br>
            <span style="direction: rtl; display: block; margin-top: 0.5rem; color: #a7f3d0;">${currentGrammarRule.explanationAr || ''}</span>
            ${learnLinkHtml}
        `;
    }

    explanationEl.classList.remove('hidden');

    nextBtn.classList.remove('hidden');
    if (checkBtn) checkBtn.disabled = true;
    if (showAnswerBtn) showAnswerBtn.disabled = true;
}

// Initialize on load
initializeGrammarRules();

// Expose to window
(window as any).startGrammarGame = startGrammarGame;
(window as any).showGrammarAnswer = showGrammarAnswer;
(window as any).speakSentence = speakSentence;
