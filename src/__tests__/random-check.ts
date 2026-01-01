/**
 * Random Word Check Script
 * Tests 10 random words against TypeColorSystem
 */

import { TypeColorSystem } from '../type-color-system';

const testWords = [
    { word: 'Solros', type: 'subst.', forms: 'solrosen, solrosor', gender: 'en', expected: 'En (Turquoise)' },
    { word: 'Bibliotek', type: 'subst.', forms: 'biblioteket, bibliotek', gender: 'ett', expected: 'Ett (Green)' },
    { word: 'Springa', type: 'verb', forms: 'springer, sprang, sprungit', gender: '', expected: 'Verb (Red)' },
    { word: 'Vacker', type: 'adj.', forms: 'vackert, vackra', gender: '', expected: 'Adjective (Blue)' },
    { word: 'Snabbt', type: 'adv.', forms: '', gender: '', expected: 'Adverb (Orange)' },
    { word: 'Datorprogram', type: 'IT.', forms: '', gender: '', expected: 'Ett (Green) - via -program suffix' },
    { word: 'Bokhandel', type: 'subst.', forms: '', gender: '', expected: 'En (Turquoise) - common noun pattern' },
    { word: 'Musikfestival', type: 'subst.', forms: '', gender: '', expected: 'En (Turquoise) - likely en' },
    { word: 'Mellan', type: 'prep.', forms: '', gender: '', expected: 'Preposition (Yellow)' },
    { word: 'Fantastisk', type: 'adj.', forms: '', gender: '', expected: 'Adjective (Blue) - via -isk suffix' }
];

console.log('='.repeat(80));
console.log('🔍 RANDOM WORD CHECK - TypeColorSystem Verification');
console.log('='.repeat(80));
console.log('');

testWords.forEach((test, index) => {
    const result = TypeColorSystem.detect(test.type, test.word, test.forms, test.gender);
    const glowClass = TypeColorSystem.getGlowClass(test.type, test.word, test.forms, test.gender);

    console.log(`${index + 1}. ${test.word}`);
    console.log(`   Type Input: "${test.type}" | Gender: "${test.gender || 'N/A'}"`);
    console.log(`   → Detected: ${result.type} | Color: ${result.color.primary} | Glow: ${glowClass}`);
    console.log(`   → Expected: ${test.expected}`);
    console.log('');
});

console.log('='.repeat(80));
console.log('✅ Check Complete!');
console.log('='.repeat(80));
