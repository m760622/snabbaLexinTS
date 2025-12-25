export {};

/**
 * Listening Game / لعبة الاستماع
 * اختبار السمع - استمع للكلمة واكتبها
 */

declare const TTSManager: { speak: (text: string, lang: string) => void };

declare const dictionaryData: any[];
declare const ProgressManager: { trackGame: () => void } | undefined;
declare const ThemeManager: { init: () => void } | undefined;

interface WordItem {
  swedish: string;
  arabic: string;
}

// Constants
const TOTAL_QUESTIONS = 10;
const COL_SWE = 2;
const COL_ARB = 3;

// State
let words: WordItem[] = [];
let currentIndex = 0;
let score = 0;
let difficulty = 'easy';
let isProcessing = false;
let attempts = 0;

// DOM Elements
const elements = {
  speakerBtn: () => document.getElementById('speakerBtn'),
  wordInput: () => document.getElementById('wordInput') as HTMLInputElement | null,
  scoreEl: () => document.getElementById('score'),
  currentEl: () => document.getElementById('current'),
  progressFill: () => document.getElementById('progressFill'),
  translationHint: () => document.getElementById('translationHint'),
  resultOverlay: () => document.getElementById('resultOverlay'),
  resultEmoji: () => document.getElementById('resultEmoji'),
  resultText: () => document.getElementById('resultText'),
  resultStats: () => document.getElementById('resultStats'),
};

// Get random words based on difficulty
function getRandomWords(): WordItem[] {
  let minLen = 2, maxLen = 20;

  if (difficulty === 'easy') { minLen = 2; maxLen = 5; }
  else if (difficulty === 'medium') { minLen = 4; maxLen = 8; }
  else { minLen = 6; maxLen = 15; }

  const suitable = dictionaryData.filter(entry => {
    const word = entry[COL_SWE];
    return word && word.length >= minLen && word.length <= maxLen && /^[a-zA-ZåäöÅÄÖ ]+$/.test(word);
  });

  return suitable.sort(() => Math.random() - 0.5).slice(0, TOTAL_QUESTIONS).map(e => ({
    swedish: e[COL_SWE].toLowerCase(),
    arabic: e[COL_ARB]
  }));
}

// Play word using TTS
function playWord(): void {
  if (currentIndex >= words.length) return;

  const btn = elements.speakerBtn();
  btn?.classList.add('playing');

  TTSManager.speak(words[currentIndex].swedish, 'sv');

  setTimeout(() => btn?.classList.remove('playing'), 1500);
}

// Check answer
function checkAnswer(): void {
  if (isProcessing || currentIndex >= words.length) return;

  const input = elements.wordInput();
  if (!input) return;
  const answer = input.value.trim().toLowerCase();
  const correct = words[currentIndex].swedish.toLowerCase();
  const hint = elements.translationHint();

  if (answer === correct) {
    // Correct
    score++;
    const scoreEl = elements.scoreEl();
    if (scoreEl) scoreEl.textContent = String(score);
    input.classList.add('correct');
    isProcessing = true;

    setTimeout(() => {
      input.classList.remove('correct');
      input.value = '';
      hint?.classList.remove('visible');
      attempts = 0;
      currentIndex++;
      isProcessing = false;

      if (currentIndex >= TOTAL_QUESTIONS) {
        showResult();
      } else {
        updateUI();
        playWord();
      }
    }, 1000);
  } else {
    // Wrong
    input.classList.add('wrong');
    attempts++;

    if (navigator.vibrate) navigator.vibrate(100);

    // Show hint after 2 wrong attempts
    if (attempts >= 2 && hint) {
      hint.textContent = `💡 ${words[currentIndex].arabic}`;
      hint.classList.add('visible');
    }

    // Show correct after 3 wrong attempts
    if (attempts >= 3 && input) {
      input.value = correct;
      isProcessing = true;

      setTimeout(() => {
        input.classList.remove('wrong');
        input.value = '';
        hint?.classList.remove('visible');
        attempts = 0;
        currentIndex++;
        isProcessing = false;

        if (currentIndex >= TOTAL_QUESTIONS) {
          showResult();
        } else {
          updateUI();
          playWord();
        }
      }, 2000);
    } else {
      setTimeout(() => input.classList.remove('wrong'), 500);
    }
  }
}

// Update UI
function updateUI(): void {
  const currentEl = elements.currentEl();
  const progressFill = elements.progressFill();
  
  if (currentEl) currentEl.textContent = String(currentIndex + 1);
  if (progressFill) progressFill.style.width = `${(currentIndex / TOTAL_QUESTIONS) * 100}%`;
}

// Set difficulty
function setDifficulty(diff: string, btn: HTMLElement): void {
  difficulty = diff;
  document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  startNewGame();
}

// Show result
function showResult(): void {
  const percent = Math.round((score / TOTAL_QUESTIONS) * 100);
  const overlay = elements.resultOverlay();
  const resultEmoji = elements.resultEmoji();
  const resultText = elements.resultText();
  const resultStats = elements.resultStats();

  if (resultEmoji) resultEmoji.textContent = percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '📚';
  if (resultText) resultText.textContent = `${percent}% rätt!`;
  if (resultStats) resultStats.innerHTML = `✅ ${score} / ${TOTAL_QUESTIONS}`;

  overlay?.classList.add('visible');

  if (typeof ProgressManager !== 'undefined') {
    ProgressManager.trackGame();
  }
}

// Start new game
function startNewGame(): void {
  elements.resultOverlay()?.classList.remove('visible');
  elements.translationHint()?.classList.remove('visible');
  currentIndex = 0;
  score = 0;
  attempts = 0;
  isProcessing = false;

  const scoreEl = elements.scoreEl();
  const wordInput = elements.wordInput();
  const progressFill = elements.progressFill();
  
  if (scoreEl) scoreEl.textContent = '0';
  if (wordInput) wordInput.value = '';
  if (progressFill) progressFill.style.width = '0%';

  words = getRandomWords();
  updateUI();

  // Auto-play first word
  setTimeout(playWord, 500);
}

// Initialize
function init(): void {
  if (typeof ThemeManager !== 'undefined') (ThemeManager as any).init();
  
  // Enter key submit
  const wordInput = elements.wordInput();
  wordInput?.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') checkAnswer();
  });
  
  startNewGame();
}

// Export for HTML
(window as any).playWord = playWord;
(window as any).checkAnswer = checkAnswer;
(window as any).setDifficulty = setDifficulty;
(window as any).startNewGame = startNewGame;

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', init);
