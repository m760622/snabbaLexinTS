/**
 * Fill in the Blank Game / لعبة أكمل الفراغ
 */

declare const TTSManager: { speak: (text: string, lang: string) => void };

declare const dictionaryData: any[];
declare const ProgressManager: { trackGame: () => void } | undefined;
declare const ThemeManager: { init: () => void } | undefined;

interface Question {
  word: string;
  arabic: string;
  sentence: string;
  example: string;
  options: string[];
}

// Constants
const TOTAL_QUESTIONS = 10;
const COL_SWE = 2;
const COL_ARB = 3;
const COL_EXAMPLE_SWE = 7;

// State
let questions: Question[] = [];
let currentIndex = 0;
let score = 0;
let errors = 0;
let isProcessing = false;

// DOM Elements
const elements = {
  sentence: () => document.getElementById('sentence'),
  translation: () => document.getElementById('translation'),
  options: () => document.getElementById('options'),
  current: () => document.getElementById('current'),
  progressFill: () => document.getElementById('progressFill'),
  scoreEl: () => document.getElementById('score'),
  errorsEl: () => document.getElementById('errors'),
  blank: () => document.getElementById('blank'),
  feedback: () => document.getElementById('feedback'),
  resultOverlay: () => document.getElementById('resultOverlay'),
  resultEmoji: () => document.getElementById('resultEmoji'),
  resultText: () => document.getElementById('resultText'),
  resultStats: () => document.getElementById('resultStats'),
};

// Get words with examples
function getWordsWithExamples(): any[] {
  return dictionaryData.filter(entry => {
    const example = entry[COL_EXAMPLE_SWE];
    const word = entry[COL_SWE];
    return example && word && example.toLowerCase().includes(word.toLowerCase());
  });
}

// Create questions
function createQuestions(): void {
  const suitable = getWordsWithExamples();
  const shuffled = suitable.sort(() => Math.random() - 0.5);

  questions = shuffled.slice(0, TOTAL_QUESTIONS).map(entry => {
    const word = entry[COL_SWE];
    const arabic = entry[COL_ARB];
    const example = entry[COL_EXAMPLE_SWE];

    // Create sentence with blank
    const regex = new RegExp(word, 'i');
    const sentence = example.replace(regex, '____');

    // Get 3 wrong options
    const wrongOptions = suitable
      .filter(e => e[COL_SWE] !== word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(e => e[COL_SWE]);

    const options = [word, ...wrongOptions].sort(() => Math.random() - 0.5);

    return { word, arabic, sentence, example, options };
  });
}

// Render question
function renderQuestion(): void {
  if (currentIndex >= questions.length) {
    showResult();
    return;
  }

  const q = questions[currentIndex];
  const sentenceEl = elements.sentence();
  const translationEl = elements.translation();
  const optionsEl = elements.options();
  const currentEl = elements.current();
  const progressFill = elements.progressFill();

  if (sentenceEl) {
    sentenceEl.innerHTML = q.sentence.replace('____', '<span class="blank" id="blank">?</span>');
  }
  if (translationEl) translationEl.textContent = q.arabic;

  if (optionsEl) {
    optionsEl.innerHTML = '';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => checkAnswer(opt, btn);
      optionsEl.appendChild(btn);
    });
  }

  if (currentEl) currentEl.textContent = String(currentIndex + 1);
  if (progressFill) progressFill.style.width = `${(currentIndex / TOTAL_QUESTIONS) * 100}%`;
}

// Check answer
function checkAnswer(answer: string, btnEl: HTMLElement): void {
  if (isProcessing) return;
  isProcessing = true;

  const q = questions[currentIndex];
  const blank = elements.blank();
  const allBtns = document.querySelectorAll('.option-btn');

  if (blank) blank.textContent = answer;

  if (answer === q.word) {
    // Correct
    score++;
    const scoreEl = elements.scoreEl();
    if (scoreEl) scoreEl.textContent = String(score);
    btnEl.classList.add('correct');
    blank?.classList.add('correct');
    showFeedback('✅');

    TTSManager.speak(q.word, 'sv');
  } else {
    // Wrong
    errors++;
    const errorsEl = elements.errorsEl();
    if (errorsEl) errorsEl.textContent = String(errors);
    btnEl.classList.add('wrong');
    blank?.classList.add('wrong');
    showFeedback('❌');

    // Show correct answer
    allBtns.forEach(b => {
      if (b.textContent === q.word) b.classList.add('correct');
    });

    if (navigator.vibrate) navigator.vibrate(100);
  }

  allBtns.forEach(b => b.classList.add('disabled'));

  setTimeout(() => {
    currentIndex++;
    isProcessing = false;
    renderQuestion();
  }, 1500);
}

// Show feedback
function showFeedback(emoji: string): void {
  const el = elements.feedback();
  if (el) {
    el.textContent = emoji;
    el.classList.add('visible');
    setTimeout(() => el.classList.remove('visible'), 500);
  }
}

// Show result
function showResult(): void {
  const percent = Math.round((score / TOTAL_QUESTIONS) * 100);
  const overlay = elements.resultOverlay();
  const resultEmoji = elements.resultEmoji();
  const resultText = elements.resultText();
  const resultStats = elements.resultStats();

  if (resultEmoji) resultEmoji.textContent = percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '📚';
  if (resultText) resultText.textContent = `${percent}% rätt! / صحيح!`;
  if (resultStats) resultStats.innerHTML = `✅ ${score} | ❌ ${errors}`;

  overlay?.classList.add('visible');

  if (typeof ProgressManager !== 'undefined') {
    ProgressManager.trackGame();
  }
}

// Start new game
function startNewGame(): void {
  elements.resultOverlay()?.classList.remove('visible');
  currentIndex = 0;
  score = 0;
  errors = 0;
  isProcessing = false;

  const scoreEl = elements.scoreEl();
  const errorsEl = elements.errorsEl();
  const progressFill = elements.progressFill();

  if (scoreEl) scoreEl.textContent = '0';
  if (errorsEl) errorsEl.textContent = '0';
  if (progressFill) progressFill.style.width = '0%';

  createQuestions();
  renderQuestion();
}

// Initialize
function init(): void {
  if (typeof ThemeManager !== 'undefined') ThemeManager.init();
  startNewGame();
}

// Export for HTML
(window as any).startNewGame = startNewGame;

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', init);
