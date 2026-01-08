import { DictionaryDB } from '../db';
import { TypeColorSystem } from '../type-color-system';

export class RelatedWordsManager {
    static async init(wordData: any[]) {
        const container = document.getElementById('relatedWordsContainer');
        if (!container) return;

        const type = wordData[1];
        const swe = wordData[2];

        let allData: any[][] = (window as any).dictionaryData;
        if (!allData) {
            allData = await DictionaryDB.getAllWords();
        }

        const compounds = allData.filter(row =>
            row[2] !== swe && (row[2].toLowerCase().includes(swe.toLowerCase()))
        ).slice(0, 4);

        const sameType = allData.filter(row =>
            row[2] !== swe && row[1] === type && !compounds.includes(row)
        ).sort(() => Math.random() - 0.5).slice(0, 4);

        container.innerHTML = `
            <div class="related-category">
                <h4>Relaterade ord / كلمات ذات صلة</h4>
                <div style="display: flex; gap: 10px; overflow-x: auto; padding: 10px 0;">
                    ${[...compounds, ...sameType].map(row => `
                        <div class="related-chip" onclick="window.location.href='details.html?id=${row[0]}'" 
                             style="background: #2c2c2e; padding: 10px; border-radius: 8px; min-width: 120px; border: 1px solid #444; cursor: pointer;">
                            <div style="font-weight: bold;">${row[2]}</div>
                            <div style="font-size: 0.8rem; color: #888;">${row[3]}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}
