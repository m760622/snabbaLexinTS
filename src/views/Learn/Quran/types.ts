export interface QuranEntry {
    id: string;
    word: string;
    root: string;
    surah: string;
    meaning_ar: string;
    word_sv: string;
    ayah_full: string;
    ayah_sv: string;
    type: string;
}

export type QuranMode = 'browse' | 'flashcard' | 'quiz' | 'quiz-fill';
