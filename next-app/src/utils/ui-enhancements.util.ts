/**
 * Advanced UI Enhancements
 * تحسينات متقدمة للواجهة
 */

// ============================================================
// SPLASH SCREEN MANAGER - إدارة شاشة التحميل
// ============================================================

export const SplashManager = {
    progressInterval: null as number | null,

    hide(): void {
        const splash = document.getElementById('splashScreen');
        if (splash) {
            splash.classList.add('hidden');
            setTimeout(() => splash.remove(), 600);
        }
        if (this.progressInterval) clearInterval(this.progressInterval);
    },

    updateProgress(percent: number): void {
        const bar = document.getElementById('splashProgressBar');
        const text = document.getElementById('splashProgressText');

        if (bar) {
            bar.style.animation = 'none';
            bar.style.width = `${percent}%`;
            bar.style.transition = 'width 0.2s linear';
        }
        if (text) text.textContent = `${Math.round(percent)}%`;
    },

    // Show for minimum time then hide
    showUntilReady(minTime: number = 800): void {
        const startTime = Date.now();
        let currentProgress = 0;

        // Start simulation
        this.progressInterval = window.setInterval(() => {
            // Slow down as we get higher to simulate realism
            const increment = Math.random() * (currentProgress > 80 ? 1 : 4);
            currentProgress = Math.min(98, currentProgress + increment);
            this.updateProgress(currentProgress);
        }, 100);

        const finish = () => {
            const elapsed = Date.now() - startTime;
            const remainingTime = Math.max(0, minTime - elapsed);

            // Finish progress
            if (this.progressInterval) clearInterval(this.progressInterval);
            this.updateProgress(100);

            setTimeout(() => this.hide(), remainingTime);
        };

        if (document.readyState === 'complete') {
            finish();
        } else {
            window.addEventListener('load', finish);
        }
    }
};

// ============================================================
// HAPTIC FEEDBACK - اهتزاز اللمس
// ============================================================

export const HapticFeedback = {
    isSupported(): boolean {
        return 'vibrate' in navigator;
    },

    // Light tap feedback
    light(): void {
        if (this.isSupported()) {
            navigator.vibrate(10);
        }
    },

    // Medium impact feedback
    medium(): void {
        if (this.isSupported()) {
            navigator.vibrate(25);
        }
    },

    // Success feedback pattern
    success(): void {
        if (this.isSupported()) {
            navigator.vibrate([15, 50, 15]);
        }
    },

    // Error feedback pattern
    error(): void {
        if (this.isSupported()) {
            navigator.vibrate([50, 30, 50, 30, 50]);
        }
    },

    // Selection feedback
    selection(): void {
        if (this.isSupported()) {
            navigator.vibrate(5);
        }
    }
};

// ============================================================
// SKELETON LOADING - تحميل هيكلي
// ============================================================

export const SkeletonLoader = {
    createCardSkeleton(): HTMLElement {
        const skeleton = document.createElement('div');
        skeleton.className = 'skeleton-game-card';
        skeleton.innerHTML = `
            <div class="skeleton-icon"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-subtitle"></div>
        `;
        return skeleton;
    },

    showInContainer(container: HTMLElement, count: number = 6): void {
        container.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const skeleton = this.createCardSkeleton();
            skeleton.style.animationDelay = `${i * 0.1}s`;
            container.appendChild(skeleton);
        }
    },

    hide(container: HTMLElement): void {
        const skeletons = container.querySelectorAll('.skeleton-game-card');
        skeletons.forEach((skeleton, index) => {
            setTimeout(() => {
                skeleton.classList.add('skeleton-fade-out');
                setTimeout(() => skeleton.remove(), 300);
            }, index * 50);
        });
    }
};

// ============================================================
// CELEBRATION EFFECTS - تأثيرات الاحتفال
// ============================================================

export const Celebrations = {
    // Confetti explosion
    confetti(options: { particleCount?: number; spread?: number; origin?: { x: number; y: number } } = {}): void {
        const defaults = {
            particleCount: 100,
            spread: 70,
            origin: { x: 0.5, y: 0.6 }
        };
        const config = { ...defaults, ...options };

        if (typeof (window as any).confetti === 'function') {
            (window as any).confetti(config);
        } else {
            // Fallback: Simple CSS confetti
            this.cssConfetti();
        }
    },

    // CSS-based confetti fallback
    cssConfetti(): void {
        const container = document.createElement('div');
        container.className = 'confetti-container';
        container.innerHTML = '';

        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dfe6e9', '#fd79a8', '#a29bfe'];

        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';
            confetti.style.cssText = `
                left: ${Math.random() * 100}%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation-delay: ${Math.random() * 0.5}s;
                animation-duration: ${2 + Math.random()}s;
            `;
            container.appendChild(confetti);
        }

        document.body.appendChild(container);
        setTimeout(() => container.remove(), 3000);
    },

    // Stars burst effect
    starBurst(element: HTMLElement): void {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 8; i++) {
            const star = document.createElement('div');
            star.className = 'star-particle';
            star.textContent = '⭐';
            star.style.cssText = `
                left: ${centerX}px;
                top: ${centerY}px;
                --angle: ${(i * 45)}deg;
            `;
            document.body.appendChild(star);
            setTimeout(() => star.remove(), 800);
        }
    },

    // Success checkmark animation
    showSuccess(message: string = 'Bra jobbat!'): void {
        const overlay = document.createElement('div');
        overlay.className = 'success-overlay';
        overlay.innerHTML = `
            <div class="success-content">
                <div class="success-checkmark">
                    <svg viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" stroke="#4ade80" stroke-width="2"/>
                        <path fill="none" stroke="#4ade80" stroke-width="3" d="M14 27l7 7 16-16"/>
                    </svg>
                </div>
                <p class="success-message">${message}</p>
            </div>
        `;
        document.body.appendChild(overlay);

        HapticFeedback.success();

        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 300);
        }, 1500);
    },

    // Level up animation
    levelUp(level: number): void {
        const overlay = document.createElement('div');
        overlay.className = 'level-up-overlay';
        overlay.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <h2 class="level-up-title">Nivå ${level}!</h2>
                <p class="level-up-subtitle">Du har gått upp en nivå!</p>
            </div>
        `;
        document.body.appendChild(overlay);

        this.confetti({ particleCount: 150, spread: 100 });
        HapticFeedback.success();

        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 500);
        }, 2500);
    },

    // Streak celebration
    streakCelebration(days: number): void {
        const overlay = document.createElement('div');
        overlay.className = 'streak-overlay';
        overlay.innerHTML = `
            <div class="streak-content">
                <div class="streak-fire">🔥</div>
                <h2 class="streak-days">${days} dagar!</h2>
                <p class="streak-text">Din streak fortsätter!</p>
            </div>
        `;
        document.body.appendChild(overlay);

        HapticFeedback.medium();

        setTimeout(() => {
            overlay.classList.add('fade-out');
            setTimeout(() => overlay.remove(), 300);
        }, 2000);
    }
};

// ============================================================
// AUDIO VISUALIZER - موجات صوتية تفاعلية
// ============================================================

export class AudioVisualizer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private animationId: number | null = null;
    private bars: number[] = [];
    private barCount = 48;
    private isActive = false;
    private color = '#7dd3fc';
    private secondaryColor = '#4ade80';
    private mode: 'bars' | 'liquid' | 'circle' = 'liquid'; // Default to liquid mode
    private analyser: AnalyserNode | null = null;
    private dataArray: Uint8Array | null = null;
    private phase = 0;

    constructor(containerOrId: string | HTMLElement, color = '#7dd3fc') {
        let container: HTMLElement | null;
        if (typeof containerOrId === 'string') {
            container = document.getElementById(containerOrId);
        } else {
            container = containerOrId;
        }

        if (!container) throw new Error('Visualizer container not found');

        this.canvas = document.createElement('canvas');
        this.canvas.className = 'audio-visualizer-canvas';
        container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d')!;
        this.color = color;

        this.initBars();
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    private initBars() {
        this.bars = Array(this.barCount).fill(0).map(() => Math.random() * 5 + 2);
    }

    private resize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = this.canvas.parentElement!.getBoundingClientRect();
        const width = rect.width > 0 ? rect.width : 300;
        const height = rect.height > 0 ? rect.height : 60; // Default 60px if 0
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
    }

    setMode(mode: 'bars' | 'liquid' | 'circle') {
        this.mode = mode;
    }

    setColor(color: string) {
        this.color = color;
    }

    connectAnalyser(analyser: AnalyserNode) {
        this.analyser = analyser;
        this.dataArray = new Uint8Array(analyser.frequencyBinCount);
    }

    start() {
        if (this.isActive) return;
        this.isActive = true;
        this.animate();
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        this.initBars();
        this.draw();
    }

    private animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.updateBars();
        this.draw();
        this.phase += 0.05;

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    private updateBars() {
        if (this.analyser && this.dataArray) {
            this.analyser.getByteFrequencyData(this.dataArray as any);
            const step = Math.floor(this.dataArray.length / this.barCount);
            for (let i = 0; i < this.barCount; i++) {
                const value = this.dataArray[i * step] / 255;
                this.bars[i] += (value * 40 - this.bars[i]) * 0.3;
            }
        } else {
            // Simulate for demo
            for (let i = 0; i < this.barCount; i++) {
                const target = Math.random() * 25 + 5;
                this.bars[i] += (target - this.bars[i]) * 0.2;
            }
        }
    }

    private draw() {
        const w = this.canvas.width / (window.devicePixelRatio || 1);
        const h = this.canvas.height / (window.devicePixelRatio || 1);

        if (this.mode === 'liquid') {
            this.drawLiquidWave(w, h);
        } else if (this.mode === 'circle') {
            this.drawCircleWave(w, h);
        } else {
            this.drawBars(w, h);
        }
    }

    private drawLiquidWave(w: number, h: number) {
        const midY = h / 2;

        // Create gradient
        const gradient = this.ctx.createLinearGradient(0, 0, w, 0);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.5, this.secondaryColor);
        gradient.addColorStop(1, this.color);
        this.ctx.fillStyle = gradient;

        // Top wave
        this.ctx.beginPath();
        this.ctx.moveTo(0, midY);
        for (let i = 0; i <= this.barCount; i++) {
            const x = (i / this.barCount) * w;
            const waveHeight = this.isActive ? this.bars[i % this.barCount] : 3;
            const y = midY - waveHeight - Math.sin(this.phase + i * 0.3) * 5;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.quadraticCurveTo(x - w / this.barCount / 2, y - 3, x, y);
        }
        this.ctx.lineTo(w, midY);
        this.ctx.lineTo(0, midY);
        this.ctx.closePath();
        this.ctx.fill();

        // Bottom wave (mirror)
        this.ctx.beginPath();
        this.ctx.moveTo(0, midY);
        for (let i = 0; i <= this.barCount; i++) {
            const x = (i / this.barCount) * w;
            const waveHeight = this.isActive ? this.bars[i % this.barCount] : 3;
            const y = midY + waveHeight + Math.sin(this.phase + i * 0.3) * 5;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.quadraticCurveTo(x - w / this.barCount / 2, y + 3, x, y);
        }
        this.ctx.lineTo(w, midY);
        this.ctx.lineTo(0, midY);
        this.ctx.closePath();
        this.ctx.fill();
    }

    private drawCircleWave(w: number, h: number) {
        const centerX = w / 2;
        const centerY = h / 2;
        const baseRadius = Math.min(w, h) / 4;

        const gradient = this.ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, baseRadius * 2);
        gradient.addColorStop(0, this.secondaryColor);
        gradient.addColorStop(1, this.color);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        for (let i = 0; i < this.barCount; i++) {
            const angle = (i / this.barCount) * Math.PI * 2;
            const waveHeight = this.isActive ? this.bars[i] : 5;
            const radius = baseRadius + waveHeight + Math.sin(this.phase + i * 0.2) * 3;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            if (i === 0) this.ctx.moveTo(x, y);
            else this.ctx.lineTo(x, y);
        }
        this.ctx.closePath();
        this.ctx.stroke();
    }

    private drawBars(w: number, h: number) {
        const barCount = this.barCount;
        const gap = 3;
        const barWidth = (w - gap * (barCount - 1)) / barCount;
        const maxBarHeight = h - 10; // Leave some padding

        for (let i = 0; i < barCount; i++) {
            const rawHeight = this.isActive ? this.bars[i] : 3;
            const barHeight = Math.min(rawHeight * 2.5, maxBarHeight); // Scale up for visibility
            const x = i * (barWidth + gap);
            const y = h - barHeight; // Align to bottom

            // Create vertical gradient for each bar (green -> yellow -> red)
            const gradient = this.ctx.createLinearGradient(x, h, x, y);
            gradient.addColorStop(0, '#22c55e');  // Green at bottom
            gradient.addColorStop(0.5, '#facc15'); // Yellow in middle
            gradient.addColorStop(1, '#ef4444');   // Red at top

            // Draw main bar with rounded top
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            const radius = barWidth / 2;
            this.ctx.moveTo(x, h);
            this.ctx.lineTo(x, y + radius);
            this.ctx.arcTo(x, y, x + radius, y, radius);
            this.ctx.arcTo(x + barWidth, y, x + barWidth, y + radius, radius);
            this.ctx.lineTo(x + barWidth, h);
            this.ctx.closePath();
            this.ctx.fill();

            // Add glow effect for taller bars
            if (barHeight > maxBarHeight * 0.5) {
                this.ctx.shadowColor = '#22c55e';
                this.ctx.shadowBlur = 10;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        }

        // Add reflection at bottom (subtle)
        this.ctx.globalAlpha = 0.15;
        for (let i = 0; i < barCount; i++) {
            const rawHeight = this.isActive ? this.bars[i] : 3;
            const barHeight = Math.min(rawHeight * 0.8, 20); // Shorter reflection
            const x = i * (barWidth + gap);
            const y = h;

            const gradient = this.ctx.createLinearGradient(x, h, x, h + barHeight);
            gradient.addColorStop(0, '#22c55e');
            gradient.addColorStop(1, 'transparent');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(x, y, barWidth, barHeight);
        }
        this.ctx.globalAlpha = 1;
    }
}

// ============================================================
// PRONUNCIATION RECORDER - نظام "استمع وقارن"
// ============================================================

export class PronunciationRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private isRecording = false;

    async start(): Promise<MediaStream | null> {
        if (this.isRecording) return null;

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.mediaRecorder = new MediaRecorder(stream);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (event) => {
                this.audioChunks.push(event.data);
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            window.dispatchEvent(new CustomEvent('recorder-start'));
            return stream;
        } catch (err) {
            console.error('Recording failed:', err);
            return null;
        }
    }

    stop(): Promise<Blob | null> {
        return new Promise((resolve) => {
            if (!this.mediaRecorder || !this.isRecording) {
                resolve(null);
                return;
            }

            this.mediaRecorder.onstop = () => {
                const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                this.isRecording = false;
                window.dispatchEvent(new CustomEvent('recorder-stop', { detail: { blob: audioBlob } }));
                resolve(audioBlob);
            };

            this.mediaRecorder.stop();
            // Stop all tracks to release microphone
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        });
    }

    static async playBlob(blob: Blob) {
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        await audio.play();
    }
}

// ============================================================
// MASTERY BADGE SYSTEM - نظام الأوسمة
// ============================================================

export const MasteryBadges = {
    levels: [
        { name: 'bronze', minScore: 50, label: '🥉 Bronze / برونزي', color: '#cd7f32' },
        { name: 'silver', minScore: 70, label: '🥈 Silver / فضي', color: '#c0c0c0' },
        { name: 'gold', minScore: 85, label: '🥇 Gold / ذهبي', color: '#ffd700' },
        { name: 'platinum', minScore: 95, label: '💎 Platinum / بلاتيني', color: '#e5e4e2' }
    ],

    getBadge(score: number): { name: string; label: string; color: string } | null {
        for (let i = this.levels.length - 1; i >= 0; i--) {
            if (score >= this.levels[i].minScore) return this.levels[i];
        }
        return null;
    },

    renderBadge(score: number, container: HTMLElement) {
        const badge = this.getBadge(score);
        if (!badge) return;

        const badgeEl = document.createElement('div');
        badgeEl.className = `mastery-badge mastery-${badge.name}`;
        badgeEl.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            background: linear-gradient(135deg, ${badge.color}22, ${badge.color}44);
            border: 2px solid ${badge.color};
            color: ${badge.color};
            font-weight: 700;
            animation: badge-pop 0.5s ease-out;
        `;
        badgeEl.innerHTML = badge.label;
        container.appendChild(badgeEl);
    }
};
