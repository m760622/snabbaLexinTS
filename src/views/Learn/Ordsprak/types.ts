export interface Proverb {
    id: number;
    swedishProverb: string;
    literalMeaning: string;
    arabicEquivalent: string;
    verb: string;
    verbTranslation: string;
    verbInfinitive: string;
    verbPresent: string;
    verbPast: string;
    verbSupine: string;
}

export type OrdsprakMode = 'browse' | 'flashcard' | 'quiz' | 'saved';
