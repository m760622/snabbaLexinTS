import { TypeColorSystem } from '../utils/type-color.util';

export class WeakWordsManager {
    private static getKey(wordId: string) {
        return `weak_${wordId}`;
    }

    static recordWrong(wordId: string) {
        const count = this.getWrongCount(wordId) + 1;
        localStorage.setItem(this.getKey(wordId), count.toString());
    }

    static recordCorrect(wordId: string) {
        // Reduce wrong count on correct answer
        const count = Math.max(0, this.getWrongCount(wordId) - 1);
        localStorage.setItem(this.getKey(wordId), count.toString());
    }

    static getWrongCount(wordId: string): number {
        return parseInt(localStorage.getItem(this.getKey(wordId)) || '0');
    }

    static isWeak(wordId: string): boolean {
        return this.getWrongCount(wordId) >= 3;
    }
}

export class MasteryManager {
    private static getKey(wordId: string) {
        return `mastery_${wordId}`;
    }

    static getMastery(wordId: string): number {
        return parseInt(localStorage.getItem(this.getKey(wordId)) || '0');
    }

    static updateMastery(wordId: string, correct: boolean) {
        let mastery = this.getMastery(wordId);
        mastery += correct ? 20 : -10;
        mastery = Math.max(0, Math.min(100, mastery));
        localStorage.setItem(this.getKey(wordId), mastery.toString());
        return mastery;
    }

    static recordStudy(wordId: string) {
        localStorage.setItem(`lastStudied_${wordId}`, new Date().toISOString());
    }

    static getMasteryInfo(wordId: string) {
        const mastery = this.getMastery(wordId);
        const last = localStorage.getItem(`lastStudied_${wordId}`);
        const daysSince = last ? (Date.now() - new Date(last).getTime()) / (1000 * 60 * 60 * 24) : 999;
        
        return {
            mastery,
            daysSince,
            isMastered: mastery >= 100,
            needsReview: mastery > 0 && daysSince > 7
        };
    }

    static getTimeAgo(wordId: string): string {
        const last = localStorage.getItem(`lastStudied_${wordId}`);
        if (!last) return '';
        const diff = Date.now() - new Date(last).getTime();
        const mins = Math.floor(diff / (1000 * 60));
        if (mins < 60) return `${mins} min sedan`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours} timmar sedan`;
        return `${Math.floor(hours / 24)} dagar sedan`;
    }

    static renderMasteryBar(wordId: string, container: HTMLElement) {
        const mastery = this.getMastery(wordId);
        const timeAgo = this.getTimeAgo(wordId);
        
        const bar = document.createElement('div');
        bar.className = 'mastery-section';
        bar.innerHTML = `
            <div class="mastery-header">
                <span>📈 Progress: ${mastery}%</span>
            </div>
            <div class="mastery-bar" style="background: #333; height: 8px; border-radius: 4px; overflow: hidden; margin: 8px 0;">
                <div style="width: ${mastery}%; background: #10b981; height: 100%;"></div>
            </div>
            <small style="color: #888;">${timeAgo ? 'Senast studerad: ' + timeAgo : 'Nytt ord'}</small>
        `;
        container.prepend(bar);
        this.recordStudy(wordId);
    }
}
