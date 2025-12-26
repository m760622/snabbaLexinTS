/**
 * 15 Puzzle Game - لعبة الأرقام
 * Classic sliding puzzle with bilingual support
 */

import { LanguageManager } from '../i18n';

class FifteenPuzzle {
    private tiles: number[] = [];
    private size: number = 4;
    private moves: number = 0;
    private isPlaying: boolean = false;
    private timerInterval: number | null = null;
    private seconds: number = 0;
    private bestMoves: number | null = null;

    constructor() {
        this.loadBest();
        this.init();
        this.setupEventListeners();
    }

    private loadBest(): void {
        const saved = localStorage.getItem('fifteen_puzzle_best');
        if (saved) {
            this.bestMoves = parseInt(saved);
            this.updateBestDisplay();
        }
    }

    private saveBest(): void {
        if (this.bestMoves === null || this.moves < this.bestMoves) {
            this.bestMoves = this.moves;
            localStorage.setItem('fifteen_puzzle_best', this.moves.toString());
            this.updateBestDisplay();
        }
    }

    private updateBestDisplay(): void {
        const bestEl = document.getElementById('bestValue');
        if (bestEl && this.bestMoves !== null) {
            bestEl.textContent = this.bestMoves.toString();
        }
    }

    public init(): void {
        // Generate solvable puzzle
        do {
            // Generate array [1..15, 0]
            this.tiles = Array.from({ length: 15 }, (_, i) => i + 1).concat([0]);
            this.shuffle();
        } while (!this.isSolvable());

        this.moves = 0;
        this.seconds = 0;
        this.isPlaying = true;
        this.updateMovesDisplay();
        this.updateTimerDisplay();
        this.startTimer();
        this.render();
        this.hideModal();
    }

    private shuffle(): void {
        for (let i = this.tiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.tiles[i], this.tiles[j]] = [this.tiles[j], this.tiles[i]];
        }
    }

    // Check if the random shuffle is mathematically solvable
    private isSolvable(): boolean {
        let inversions = 0;
        for (let i = 0; i < this.tiles.length; i++) {
            for (let j = i + 1; j < this.tiles.length; j++) {
                // Ignore empty tile (0) in inversion count
                if (this.tiles[i] && this.tiles[j] && this.tiles[i] > this.tiles[j]) {
                    inversions++;
                }
            }
        }

        const emptyIndex = this.tiles.indexOf(0);
        const emptyRowFromBottom = 4 - Math.floor(emptyIndex / 4);

        // Even grid width (4) rule:
        if (emptyRowFromBottom % 2 === 0) {
            return inversions % 2 !== 0;
        } else {
            return inversions % 2 === 0;
        }
    }

    public move(index: number): void {
        if (!this.isPlaying) return;

        const emptyIndex = this.tiles.indexOf(0);

        const row = Math.floor(index / 4);
        const col = index % 4;
        const emptyRow = Math.floor(emptyIndex / 4);
        const emptyCol = emptyIndex % 4;

        // Check Adjacency
        const isAdjacent =
            (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow);

        if (isAdjacent) {
            // Animate the tile
            const tileEl = document.querySelector(`[data-index="${index}"]`) as HTMLElement;
            if (tileEl) {
                tileEl.classList.add('moving');
                setTimeout(() => tileEl.classList.remove('moving'), 200);
            }

            // Swap
            [this.tiles[index], this.tiles[emptyIndex]] =
                [this.tiles[emptyIndex], this.tiles[index]];

            this.moves++;
            this.updateMovesDisplay();
            this.render();

            if (this.checkWin()) {
                this.isPlaying = false;
                this.stopTimer();
                this.saveBest();
                this.showWinModal();
                this.celebrateWin();
            }
        }
    }

    private checkWin(): boolean {
        for (let i = 0; i < 15; i++) {
            if (this.tiles[i] !== i + 1) return false;
        }
        return true;
    }

    private render(): void {
        const grid = document.getElementById('puzzleGrid');
        if (!grid) return;

        grid.innerHTML = this.tiles.map((tile, index) => {
            if (tile === 0) {
                return `<div class="puzzle-tile empty" data-index="${index}"></div>`;
            }
            return `
                <div class="puzzle-tile" data-index="${index}" data-tile="${tile}">
                    ${tile}
                </div>
            `;
        }).join('');

        // Add click listeners
        grid.querySelectorAll('.puzzle-tile:not(.empty)').forEach(el => {
            el.addEventListener('click', () => {
                const index = parseInt((el as HTMLElement).dataset.index || '0');
                this.move(index);
            });
        });
    }

    private updateMovesDisplay(): void {
        const movesEl = document.getElementById('movesValue');
        if (movesEl) {
            movesEl.textContent = this.moves.toString();
        }
    }

    private startTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        this.timerInterval = window.setInterval(() => {
            this.seconds++;
            this.updateTimerDisplay();
        }, 1000);
    }

    private stopTimer(): void {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    private updateTimerDisplay(): void {
        const timerEl = document.getElementById('timerValue');
        if (timerEl) {
            const mins = Math.floor(this.seconds / 60);
            const secs = this.seconds % 60;
            timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }

    private formatTime(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    private showWinModal(): void {
        const modal = document.getElementById('gameOverModal');
        const finalMoves = document.getElementById('finalMoves');
        const finalTime = document.getElementById('finalTime');
        const finalMovesCount = document.getElementById('finalMovesCount');

        if (modal) modal.classList.add('active');
        if (finalMoves) finalMoves.textContent = this.moves.toString();
        if (finalTime) finalTime.textContent = this.formatTime(this.seconds);
        if (finalMovesCount) finalMovesCount.textContent = this.moves.toString();
    }

    private hideModal(): void {
        const modal = document.getElementById('gameOverModal');
        if (modal) modal.classList.remove('active');
    }

    private celebrateWin(): void {
        // Confetti celebration
        if ((window as any).confetti) {
            const confetti = (window as any).confetti;

            // First burst
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

            // Second burst
            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 }
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 }
                });
            }, 250);
        }
    }

    private setupEventListeners(): void {
        // Restart button
        const restartBtn = document.getElementById('restartBtn');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.init());
        }

        // Play again button
        const playAgainBtn = document.getElementById('playAgainBtn');
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.init());
        }

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.isPlaying) return;

            const emptyIndex = this.tiles.indexOf(0);
            const emptyRow = Math.floor(emptyIndex / 4);
            const emptyCol = emptyIndex % 4;

            let targetIndex = -1;

            switch (e.key) {
                case 'ArrowUp':
                    if (emptyRow < 3) targetIndex = emptyIndex + 4;
                    break;
                case 'ArrowDown':
                    if (emptyRow > 0) targetIndex = emptyIndex - 4;
                    break;
                case 'ArrowLeft':
                    if (emptyCol < 3) targetIndex = emptyIndex + 1;
                    break;
                case 'ArrowRight':
                    if (emptyCol > 0) targetIndex = emptyIndex - 1;
                    break;
            }

            if (targetIndex >= 0 && targetIndex < 16) {
                e.preventDefault();
                this.move(targetIndex);
            }
        });
    }
}

// Initialize game and language manager
document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.init();
    new FifteenPuzzle();
});

// Make game restart available globally
(window as any).restartFifteenPuzzle = () => {
    new FifteenPuzzle();
};
