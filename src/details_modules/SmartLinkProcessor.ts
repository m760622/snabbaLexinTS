import { DictionaryDB } from '../db';

export class SmartLinkProcessor {
    static process(text: string): string {
        if (!text) return '';
        return text.replace(/([a-zåäöA-ZÅÄÖ]{4,})/g, (match) => {
            return `<span class="smart-link" data-word="${match.toLowerCase()}">${match}</span>`;
        });
    }

    static setupListeners(container: HTMLElement) {
        container.querySelectorAll('.smart-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                const word = (e.currentTarget as HTMLElement).dataset.word;
                if (word) {
                    const data = (window as any).dictionaryData as any[][];
                    let found = data?.find(row => row[2].toLowerCase() === word);

                    if (!found) {
                        try {
                            const allWords = await DictionaryDB.getAllWords();
                            found = allWords?.find(row => row[2].toLowerCase() === word);
                        } catch (err) {
                            console.warn('[SmartLink] DB fallback fail:', err);
                        }
                    }

                    if (found) {
                        window.location.href = `details.html?id=${found[0]}`;
                    } else {
                        window.location.href = `index.html?s=${word}`;
                    }
                }
            });
        });
    }
}
