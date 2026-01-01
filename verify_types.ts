
import { TypeColorSystem } from './src/type-color-system';
import * as fs from 'fs';

const data = JSON.parse(fs.readFileSync('public/data/data.json', 'utf8'));

console.log('SEARCHING FOR MISMATCHES...');
let errors = [];

const IGNORED = ['uttal saknas', 'se.', 'övrigatb.', 'övregatb.'];

data.forEach((row: any[]) => {
    const type = (row[1] || '').toLowerCase();
    const word = row[2] || '';
    const forms = row[6] || '';
    const gender = row[13] || '';

    if (!type || IGNORED.includes(type)) return;

    const result = TypeColorSystem.detect(type, word, forms, gender);
    const detected = result.type;

    let expected: string[] = [];

    // Substantiv types
    if (type.includes('subst') || type.includes('juridik') || type.includes('medicin') ||
        type.includes('samhälle') || type.includes('namn') || type.includes('bygg') ||
        type.includes('biologi') || type.includes('kemi') || type.includes('fysik')) {
        expected = ['en', 'ett', 'noun'];
    }
    // Verb types
    else if (type.includes('verb')) {
        expected = ['verb'];
    }
    // Adjective types
    else if (type.includes('adjektiv')) {
        expected = ['adjective'];
    }

    if (expected.length > 0 && !expected.includes(detected)) {
        // Ignore "default" if we couldn't detect gender for a noun (it happens)
        // But if detected as "verb" when noun, THAT is bad
        // Or "noun" when verb, etc.
        errors.push({ word, type, detected, forms });
    }
});

console.log('Checked:', data.length);
console.log('Mismatches found:', errors.length);

if (errors.length > 0) {
    console.log('\nTop 20 Error Patterns:');
    const counts: Record<string, number> = {};
    errors.forEach(e => {
        const k = e.type + ' -> ' + e.detected;
        counts[k] = (counts[k] || 0) + 1;
    });

    Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .forEach(([k, v]) => console.log(v.toString().padStart(5), k));

    console.log('\nSample Errors:');
    // Show examples for top errors
    const topErrors = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0]);

    topErrors.forEach(pattern => {
        console.log(`\nExamples for [${pattern}]:`);
        errors.filter(e => (e.type + ' -> ' + e.detected) === pattern)
            .slice(0, 3)
            .forEach(e => console.log(`  - ${e.word} (forms: ${e.forms.substring(0, 30)}...)`));
    });
}
