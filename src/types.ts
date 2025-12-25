/**
 * Shared Data Interfaces for SnabbaLexin
 */

export interface WordEntry {
    w: string;      // Word in Swedish
    t: string;      // Translation (Arabic)
    s: string;      // Example sentence in Swedish
    st: string;     // Example sentence in Arabic
}

export interface Level {
    words: WordEntry[];
}

export interface Topic {
    id: string;
    title: string;
    titleAr: string;
    levels: Level[];
}

export interface GrammarExercise {
    words: string[];
    correct: string[];
    hint: string;
    explanation: string;
    explanationAr: string;
}

export interface GrammarDatabase {
    [category: string]: GrammarExercise[];
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

export interface MinimalPair {
    pair: [string, string];
    w1: string;
    d1: string;
    w2: string;
    d2: string;
    frame: string;
    e1: string;
    e2: string;
    s1: string;
    s2: string;
}

export interface CognateEntry {
    swe: string;
    arb: string;
    type: string;
    category: string;
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

export interface LessonSection {
    title: string;
    content: { type: string; html: string }[];
    examples: { swe: string; arb: string }[];
}

export interface Lesson {
    id: string;
    title: string;
    level: string;
    sections: LessonSection[];
}
