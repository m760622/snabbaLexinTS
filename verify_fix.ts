
import { TypeColorSystem } from './src/type-color-system';

const testCases = [
    { word: 'Avspeglar sig', type: 'Medicin.', forms: 'Medicinsk term: Avspeglar sig', arabic: 'يتحلى - يظهر', expected: 'verb' },
    { word: 'Utmärker sig', type: 'SamhälleTB.', forms: 'Samhällsterm: Utmärker sig', arabic: 'يتميز', expected: 'verb' },
    { word: 'Beredd', type: 'Adjektiv.', forms: 'berett, beredda', arabic: 'مستعد', expected: 'adjective' },
    { word: 'Disk', type: 'Medicin.', forms: 'Medicinsk term: Disk', arabic: 'قرص', expected: 'en' }, // Should NOT be verb (no Ya) or Adj (isk ignored)
    { word: 'Risk', type: 'Medicin.', forms: 'Medicinsk term: Risk', arabic: 'خطر', expected: 'en' },
    { word: 'Fullmäktig', type: 'Juridik.', forms: 'Juridisk term: Fullmäktig', arabic: 'مفوض', expected: 'en' },
    { word: 'Faktiskt', type: 'Adverb.', forms: 'faktiskt', arabic: 'بالفعل', expected: 'adverb' },
    { word: 'Av', type: 'Adverb.', forms: 'Av...', arabic: 'من', expected: 'adverb' }, // Explicit Dict Priority
    { word: 'Trevlig', type: 'Adjektiv.', forms: 'trevligt, trevliga', arabic: 'لطيف', expected: 'adjective' }
];

console.log('---------------------------------------------------');
console.log('RUNNING COMPREHENSIVE VERIFICATION');
console.log('---------------------------------------------------');

let passed = 0;
let failed = 0;

testCases.forEach(test => {
    const result = TypeColorSystem.detect(test.type, test.word, test.forms, '', test.arabic);
    const success = result.type === test.expected;

    if (success) passed++;
    else failed++;

    const icon = success ? '✅' : '❌';
    console.log(`${icon} Word: "${test.word}" | DictType: "${test.type}" | Arabic: "${test.arabic}"`);
    console.log(`   Expected: ${test.expected.toUpperCase()} | Got: ${result.type.toUpperCase()}`);
    if (!success) console.log(`   (Color: ${result.color.primary})`);
    console.log('---------------------------------------------------');
});

console.log(`\nTOTAL: ${passed} Passed, ${failed} Failed.`);
if (failed === 0) console.log('🎉 ALL SYSTEMS GO!');
else console.log('⚠️ SOME ISSUES REMAIN.');
