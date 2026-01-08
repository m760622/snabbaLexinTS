/**
 * Test Script for Mistakes View
 * Run this in your browser console to populate test data.
 */

const MISTAKES_KEY = 'snabbalexin_mistakes';

const testMistakes = [
    {
        word: 'Bok',
        translation: 'Book / كتاب',
        game: 'hangman',
        timestamp: Date.now(),
        attempts: 5
    },
    {
        word: 'Katt',
        translation: 'Cat / قطة',
        game: 'spelling',
        timestamp: Date.now(),
        attempts: 2
    },
    {
        word: 'Hus',
        translation: 'House / منزل',
        game: 'wordle',
        timestamp: Date.now(),
        attempts: 1
    }
];

function injectTestData() {
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(testMistakes));
    console.log('✅ Test mistakes injected successfully!');
    console.log('Refresh the page or wait for the React component to update.');
}

injectTestData();
