/**
 * Shared interfaces for the SnabbaLexin data structures.
 */

/**
 * Dictionary Entry - Main word data structure
 * Each entry is a tuple with 11 elements:
 * [id, wordType, swedish, arabic, arabicMeaning, definition, forms, exampleSwe, exampleAr, extra1, extra2]
 */
export type DictionaryEntry = [
    string,  // [0] id - Lexin ID (e.g., "Lexin003479")
    string,  // [1] wordType - Word type (e.g., "Adjektiv.", "Verb.", "Substantiv.")
    string,  // [2] swedish - Swedish word
    string,  // [3] arabic - Arabic translation
    string,  // [4] arabicMeaning - Extended Arabic meaning
    string,  // [5] definition - Swedish definition
    string,  // [6] forms - Word forms/conjugations
    string,  // [7] exampleSwe - Swedish example sentence
    string,  // [8] exampleAr - Arabic example sentence
    string,  // [9] extra1 - Additional info 1
    string   // [10] extra2 - Additional info 2
];

/**
 * The complete dictionary data type
 */
export type DictionaryData = DictionaryEntry[];

/**
 * Named accessor indices for DictionaryEntry (for better code readability)
 */
export const DictionaryIndex = {
    ID: 0,
    TYPE: 1,
    SWEDISH: 2,
    ARABIC: 3,
    ARABIC_MEANING: 4,
    DEFINITION: 5,
    FORMS: 6,
    EXAMPLE_SWE: 7,
    EXAMPLE_AR: 8,
    EXTRA1: 9,
    EXTRA2: 10,
} as const;

export interface CognateEntry {
    swe: string;
    arb: string;
    type: string;
    category: string;
}

export interface GrammarQuestion {
    words: string[];
    correct: string[];
    hint: string;
    explanation: string;
    explanationAr: string;
}

export interface GrammarDatabase {
    [category: string]: GrammarQuestion[];
}

export interface QuranEntry {
    id: string;
    word: string;
    root?: string;
    surah: string;
    meaning_ar: string;
    word_sv: string;
    ayah_full: string;
    ayah_sv: string;
    type: string;
}

export interface LessonContent {
    type: string;
    html: string;
}

export interface LessonExample {
    swe: string;
    arb: string;
}

export interface LessonSection {
    title: string;
    content: LessonContent[];
    examples: LessonExample[];
}

export interface Lesson {
    id: string;
    title: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    sections: LessonSection[];
}

export interface WCTheme {
    id: string;
    name: string;
    icon: string;
    background: string;
    accent: string;
}

export interface WCLevel {
    letters: string[];
    words: string[];
    validWords: string[];
}

export interface WCDictionaryEntry {
    w: string;
    t: string;
    s: string;
    st: string;
}
