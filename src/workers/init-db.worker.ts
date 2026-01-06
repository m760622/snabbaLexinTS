import { DictionaryDB } from '../db';
import { AppConfig } from '../config';

self.onmessage = async (e: MessageEvent) => {
    const { type, url } = e.data;

    if (type === 'init') {
        try {
            // 1. Fetch CSV
            const csvUrl = url;
            postProgress(5, 'Laddar data (CSV)... / جاري التحميل...');
            const response = await fetch(csvUrl);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            postProgress(20, 'Läser data... / قراءة البيانات...');
            const text = await response.text();

            postProgress(30, 'Bearbetar CSV... / معالجة البيانات...');
            const data = parseCSV(text);

            // 2. Save
            postProgress(40, 'Sparar data... / جاري الحفظ...');
            
            // We need to initialize it inside the worker context
            await DictionaryDB.init();
            
            await DictionaryDB.saveWords(data, (progress: number) => {
                // Map 0-100 save progress to 40-95 total progress
                const totalPercent = 40 + (progress * 0.55); 
                postProgress(totalPercent, 'Sparar data... / جاري الحفظ...');
            });

            await DictionaryDB.setDataVersion(AppConfig.DATA_VERSION);

            postMessage({ type: 'complete' });

        } catch (error: any) {
            postMessage({ type: 'error', error: error.message || 'Unknown error' });
        }
    }
};

function postProgress(percent: number, status: string) {
    postMessage({ type: 'progress', value: percent, status });
}

/**
 * Fast CSV Parser
 * Handles quoted fields and escaped quotes ("")
 */
function parseCSV(text: string): string[][] {
    const result: string[][] = [];
    let row: string[] = [];
    let current = '';
    let inQuote = false;
    
    // Normalize newlines
    text = text.replace(/\r\n/g, '\n');

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (inQuote) {
            if (char === '"') {
                if (nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++;
                } else {
                    // End of quoted field
                    inQuote = false;
                }
            } else {
                current += char;
            }
        } else {
            if (char === '"') {
                inQuote = true;
            } else if (char === ',') {
                // End of field
                row.push(current);
                current = '';
            } else if (char === '\n') {
                // End of row
                row.push(current);
                if (row.length > 1 || row[0] !== '') { // Skip empty rows
                    result.push(row);
                }
                row = [];
                current = '';
            } else {
                current += char;
            }
        }
    }

    // Handle last row if exists
    if (current || row.length > 0) {
        row.push(current);
        result.push(row);
    }

    return result;
}
