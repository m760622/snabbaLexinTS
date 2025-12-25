/**
 * Confetti Celebration Effects for SnabbaLexin
 * Beautiful particle animations for achievements and milestones
 */

interface ConfettiParticle {
    x: number;
    y: number;
    size: number;
    color: string;
    velocityX: number;
    velocityY: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
}

class ConfettiManager {
    private canvas: HTMLCanvasElement | null = null;
    private ctx: CanvasRenderingContext2D | null = null;
    private particles: ConfettiParticle[] = [];
    private animationId: number | null = null;
    private isActive = false;

    private readonly colors = [
        '#FFD700', // Gold
        '#FF6B6B', // Coral
        '#4ECDC4', // Teal
        '#45B7D1', // Sky Blue
        '#96CEB4', // Mint
        '#FFEAA7', // Light Yellow
        '#DDA0DD', // Plum
        '#98D8C8', // Seafoam
        '#F7DC6F', // Sunflower
        '#BB8FCE', // Light Purple
    ];

    init(): void {
        if (this.canvas) return;

        this.canvas = document.createElement('canvas');
        this.canvas.id = 'confetti-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 99999;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resize();

        window.addEventListener('resize', () => this.resize());
    }

    private resize(): void {
        if (!this.canvas) return;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    private createParticle(x: number, y: number): ConfettiParticle {
        return {
            x,
            y,
            size: Math.random() * 10 + 5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            velocityX: (Math.random() - 0.5) * 15,
            velocityY: Math.random() * -15 - 10,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            opacity: 1,
        };
    }

    /**
     * Launch confetti burst from a point
     */
    burst(x?: number, y?: number, count = 50): void {
        this.init();

        const startX = x ?? window.innerWidth / 2;
        const startY = y ?? window.innerHeight / 3;

        for (let i = 0; i < count; i++) {
            this.particles.push(this.createParticle(startX, startY));
        }

        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }

    /**
     * Rain confetti from the top
     */
    rain(duration = 3000): void {
        this.init();

        const interval = setInterval(() => {
            for (let i = 0; i < 5; i++) {
                const particle = this.createParticle(
                    Math.random() * window.innerWidth,
                    -20
                );
                particle.velocityY = Math.random() * 3 + 2;
                particle.velocityX = (Math.random() - 0.5) * 2;
                this.particles.push(particle);
            }
        }, 50);

        setTimeout(() => clearInterval(interval), duration);

        if (!this.isActive) {
            this.isActive = true;
            this.animate();
        }
    }

    /**
     * Celebration for completing a goal
     */
    celebrate(): void {
        this.burst(window.innerWidth / 2, window.innerHeight / 2, 100);

        setTimeout(() => {
            this.burst(window.innerWidth * 0.25, window.innerHeight / 2, 50);
            this.burst(window.innerWidth * 0.75, window.innerHeight / 2, 50);
        }, 200);
    }

    private animate = (): void => {
        if (!this.ctx || !this.canvas) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(particle => {
            // Update particle
            particle.x += particle.velocityX;
            particle.y += particle.velocityY;
            particle.velocityY += 0.5; // Gravity
            particle.rotation += particle.rotationSpeed;
            particle.opacity -= 0.005;
            particle.velocityX *= 0.99; // Air resistance

            // Draw particle
            if (particle.opacity > 0) {
                this.ctx!.save();
                this.ctx!.translate(particle.x, particle.y);
                this.ctx!.rotate((particle.rotation * Math.PI) / 180);
                this.ctx!.globalAlpha = particle.opacity;
                this.ctx!.fillStyle = particle.color;

                // Draw rectangle confetti
                this.ctx!.fillRect(
                    -particle.size / 2,
                    -particle.size / 4,
                    particle.size,
                    particle.size / 2
                );

                this.ctx!.restore();
                return true;
            }
            return false;
        });

        if (this.particles.length > 0) {
            this.animationId = requestAnimationFrame(this.animate);
        } else {
            this.isActive = false;
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
        }
    };

    /**
     * Stop all confetti
     */
    stop(): void {
        this.particles = [];
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.ctx && this.canvas) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
}

export const Confetti = new ConfettiManager();

// Global export for legacy scripts
if (typeof window !== 'undefined') {
    (window as any).Confetti = Confetti;
}
