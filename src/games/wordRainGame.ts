/**
 * Word Rain Game - مطر الكلمات
 * TypeScript Version - Premium Upgrade
 */

// Types
interface RainWord {
    swedish: string;
    arabic: string;
    x: number;
    y: number;
    speed: number;
    color: string;
}

interface RainParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
    color: string;
}

// Global declarations
declare const dictionaryData: any[];
declare const COL_SWE: number;
declare const COL_ARB: number;

declare function showToast(message: string, type?: string): void;
declare function saveScore(game: string, score: number): void;
declare const TTSManager: { speak: (text: string, lang?: string) => void } | undefined;
declare const soundManager: { playError?: () => void } | undefined;

console.log("wordRainGame.ts LOADED (Premium Upgrade)");

// State
let rainCanvas: HTMLCanvasElement;
let rainCtx: CanvasRenderingContext2D;
let rainWords: RainWord[] = [];
let rainParticles: RainParticle[] = [];
let rainScore = 0;
let rainLives = 3;
let rainGameActive = false;
let rainAnimationId: number | null = null;
let rainLastSpawnTime = 0;
let rainSpawnInterval = 2000;

// Colors for particles
const PARTICLE_COLORS = ['#fbbf24', '#f59e0b', '#ffffff', '#60a5fa'];

/**
 * Initialize Rain Game
 */
export function initRainGame(retryCount = 0): void {
    if (typeof dictionaryData === 'undefined' || dictionaryData.length === 0) {
        if (retryCount < 10) {
            console.warn(`Data not ready for Rain Game. Retrying (${retryCount + 1}/10)...`);
            if (typeof showToast === 'function') showToast("Laddar speldata... / جاري تحميل البيانات...", 'info');
            setTimeout(() => initRainGame(retryCount + 1), 500);
        } else {
            console.error("Critical: Data failed to load for Rain Game.");
            if (typeof showToast === 'function') showToast("Kunde inte ladda data. Uppdatera sidan. / تعذر تحميل البيانات.", 'error');
        }
        return;
    }

    const canvasEl = document.getElementById('rainCanvas') as HTMLCanvasElement | null;
    if (!canvasEl) return;

    rainCanvas = canvasEl;
    rainCtx = rainCanvas.getContext('2d')!;

    // Set canvas size
    rainCanvas.width = rainCanvas.offsetWidth || 600;
    rainCanvas.height = rainCanvas.offsetHeight || 400;

    // Reset state
    rainWords = [];
    rainParticles = [];
    rainScore = 0;
    rainLives = 3;
    rainGameActive = false;

    const scoreEl = document.getElementById('rainScore');
    const livesEl = document.getElementById('rainLives');
    const gameOverEl = document.getElementById('rainGameOver');
    const inputEl = document.getElementById('rainInput') as HTMLInputElement | null;
    const startBtn = document.getElementById('startRainBtn');

    if (scoreEl) scoreEl.textContent = '0';
    if (livesEl) livesEl.textContent = '3';
    if (gameOverEl) gameOverEl.classList.add('hidden');
    if (inputEl) {
        inputEl.disabled = true;
        inputEl.value = '';
    }
    if (startBtn) startBtn.style.display = 'block';

    // Draw initial state
    rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);
    rainCtx.font = '24px Inter, sans-serif';
    rainCtx.fillStyle = 'rgba(255,255,255,0.8)';
    rainCtx.textAlign = 'center';
    rainCtx.fillText('Redo att spela? / مستعد للعب؟', rainCanvas.width / 2, rainCanvas.height / 2);

    // Bind buttons
    if (startBtn) startBtn.onclick = startRainGame;
    const restartBtn = document.getElementById('restartRainBtn');
    if (restartBtn) restartBtn.onclick = () => initRainGame();
    if (inputEl) {
        inputEl.onkeydown = (e) => {
            if (e.key === 'Enter') {
                checkRainInput();
            }
        };
    }
}

/**
 * Start Game
 */
function startRainGame(): void {
    rainGameActive = true;
    rainWords = [];
    rainParticles = [];
    rainScore = 0;
    rainLives = 3;
    rainLastSpawnTime = Date.now();

    const scoreEl = document.getElementById('rainScore');
    const livesEl = document.getElementById('rainLives');
    const startBtn = document.getElementById('startRainBtn');
    const inputEl = document.getElementById('rainInput') as HTMLInputElement | null;

    if (scoreEl) scoreEl.textContent = '0';
    if (livesEl) livesEl.textContent = '3';
    if (startBtn) startBtn.style.display = 'none';
    if (inputEl) {
        inputEl.disabled = false;
        inputEl.focus();
    }

    gameLoop();
}

/**
 * Game Loop
 */
function gameLoop(): void {
    if (!rainGameActive) return;

    const now = Date.now();

    // Spawn new word
    if (now - rainLastSpawnTime > rainSpawnInterval) {
        spawnRainWord();
        rainLastSpawnTime = now;
        rainSpawnInterval = Math.max(800, rainSpawnInterval - 20);
    }

    // Update word positions
    rainWords.forEach(word => {
        word.y += word.speed;
        word.x += Math.sin(word.y * 0.05) * 0.5;
    });

    // Update Particles
    for (let i = rainParticles.length - 1; i >= 0; i--) {
        const p = rainParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        p.vy += 0.05;
        if (p.life <= 0) {
            rainParticles.splice(i, 1);
        }
    }

    // Check bounds
    const livesEl = document.getElementById('rainLives');
    rainWords = rainWords.filter(word => {
        if (word.y > rainCanvas.height + 20) {
            rainLives--;
            if (livesEl) livesEl.textContent = String(rainLives);

            rainCanvas.style.transform = `translateX(${Math.random() * 10 - 5}px)`;
            setTimeout(() => rainCanvas.style.transform = 'none', 100);

            if (rainLives <= 0) {
                endRainGame();
            }
            return false;
        }
        return true;
    });

    drawRainCanvas();

    if (rainGameActive) {
        rainAnimationId = requestAnimationFrame(gameLoop);
    }
}

/**
 * Spawn Word
 */
function spawnRainWord(): void {
    let candidate: RainWord | null = null;
    let attempts = 0;

    while (!candidate && attempts < 100) {
        const item = dictionaryData[Math.floor(Math.random() * dictionaryData.length)];
        if (item && item[COL_SWE] && item[COL_ARB] && item[COL_SWE].length <= 10) {
            candidate = {
                swedish: item[COL_SWE],
                arabic: item[COL_ARB],
                x: Math.random() * (rainCanvas.width - 100) + 50,
                y: -40,
                speed: 1 + Math.random() * 1.5,
                color: `hsl(${Math.random() * 60 + 200}, 80%, 70%)`
            };
        }
        attempts++;
    }

    if (candidate) {
        rainWords.push(candidate);
    }
}

/**
 * Draw Canvas
 */
function drawRainCanvas(): void {
    rainCtx.clearRect(0, 0, rainCanvas.width, rainCanvas.height);

    // Draw Particles
    rainParticles.forEach(p => {
        rainCtx.globalAlpha = p.life;
        rainCtx.fillStyle = p.color;
        rainCtx.beginPath();
        rainCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        rainCtx.fill();
    });
    rainCtx.globalAlpha = 1;

    // Draw words
    rainWords.forEach(word => {
        const textWidth = rainCtx.measureText(word.arabic).width + 30;

        rainCtx.shadowColor = word.color;
        rainCtx.shadowBlur = 15;

        rainCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        rainCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        rainCtx.lineWidth = 1;

        rainCtx.beginPath();
        rainCtx.roundRect(word.x - textWidth / 2, word.y - 18, textWidth, 40, 20);
        rainCtx.fill();
        rainCtx.stroke();

        rainCtx.shadowBlur = 0;

        rainCtx.font = 'bold 20px "Tajawal", sans-serif';
        rainCtx.fillStyle = '#fbbf24';
        rainCtx.textAlign = 'center';
        rainCtx.fillText(word.arabic, word.x, word.y + 10);

        rainCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
        rainCtx.beginPath();
        rainCtx.ellipse(word.x, word.y - 12, textWidth / 4, 3, 0, 0, Math.PI * 2);
        rainCtx.fill();
    });
}

/**
 * Spawn Particles
 */
function spawnExplosion(x: number, y: number): void {
    for (let i = 0; i < 20; i++) {
        rainParticles.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8,
            life: 1.0,
            size: Math.random() * 3 + 2,
            color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)]
        });
    }
}

/**
 * Check Input
 */
function checkRainInput(): void {
    const inputEl = document.getElementById('rainInput') as HTMLInputElement | null;
    if (!inputEl) return;

    const guess = inputEl.value.trim().toLowerCase();
    inputEl.value = '';

    if (!guess) return;

    const matchIndex = rainWords.findIndex(word =>
        word.swedish.toLowerCase() === guess
    );

    if (matchIndex !== -1) {
        const word = rainWords[matchIndex];
        spawnExplosion(word.x, word.y);

        rainWords.splice(matchIndex, 1);
        rainScore += 10;

        const scoreEl = document.getElementById('rainScore');
        if (scoreEl) scoreEl.textContent = String(rainScore);

        inputEl.classList.add('correct-flash');
        setTimeout(() => inputEl.classList.remove('correct-flash'), 300);

        if (typeof TTSManager !== 'undefined' && TTSManager) {
            TTSManager.speak(guess, 'sv');
        }
    } else {
        inputEl.classList.add('wrong-flash');
        setTimeout(() => inputEl.classList.remove('wrong-flash'), 300);
        if (typeof soundManager !== 'undefined' && soundManager?.playError) {
            soundManager.playError();
        }
    }
}

/**
 * End Game
 */
function endRainGame(): void {
    rainGameActive = false;
    if (rainAnimationId) {
        cancelAnimationFrame(rainAnimationId);
    }

    const finalScoreEl = document.getElementById('rainFinalScore');
    const gameOverEl = document.getElementById('rainGameOver');
    const inputEl = document.getElementById('rainInput') as HTMLInputElement | null;

    if (finalScoreEl) finalScoreEl.textContent = String(rainScore);
    if (gameOverEl) gameOverEl.classList.remove('hidden');
    if (inputEl) inputEl.disabled = true;

    if (typeof saveScore === 'function') {
        saveScore('rain', rainScore);
    }
}

// Flag to prevent multiple init calls
let gameInitialized = false;

// Wait for dictionary data to be loaded before starting the game
function waitForDataAndInit(): void {
    if (gameInitialized) return;

    // Check if data is already available
    if (typeof dictionaryData !== 'undefined' && dictionaryData.length > 0) {
        console.log('[WordRain] Data already available, initializing game...');
        gameInitialized = true;
        initRainGame();
        return;
    }

    // Poll for data availability
    let attempts = 0;
    const maxAttempts = 50;
    const pollInterval = setInterval(() => {
        if (gameInitialized) {
            clearInterval(pollInterval);
            return;
        }
        attempts++;
        if (typeof dictionaryData !== 'undefined' && dictionaryData.length > 0) {
            console.log('[WordRain] Data found via polling, initializing game...');
            clearInterval(pollInterval);
            gameInitialized = true;
            initRainGame();
        } else if (attempts >= maxAttempts) {
            console.error('[WordRain] Timeout waiting for dictionary data');
            clearInterval(pollInterval);
            showToast('Kunde inte ladda data. Uppdatera sidan. / تعذر تحميل البيانات.', 'error');
        }
    }, 100);

    // Also listen for the dictionaryLoaded event
    console.log('[WordRain] Waiting for dictionaryLoaded event...');
    window.addEventListener('dictionaryLoaded', () => {
        if (gameInitialized) return;
        console.log('[WordRain] dictionaryLoaded event received, initializing game...');
        clearInterval(pollInterval);
        gameInitialized = true;
        initRainGame();
    }, { once: true });
}

// Auto-init when DOM is ready
document.addEventListener('DOMContentLoaded', waitForDataAndInit);

// Expose to window
(window as any).initRainGame = initRainGame;
