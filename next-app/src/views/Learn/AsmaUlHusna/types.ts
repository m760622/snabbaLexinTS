export interface AsmaName {
    nr: number;
    nameAr: string;
    nameSv: string;
    meaningAr: string;
    meaningSv: string;
    pastAr: string;
    pastSv: string;
    presentAr: string;
    presentSv: string;
    masdarAr: string;
    masdarSv: string;
    verseAr: string;
    verseSv: string;
}

export type AsmaMode = 'browse' | 'flashcard' | 'quiz' | 'quiz-fill';
export type AsmaFilter = 'all' | 'favorites' | 'memorized' | 'jalal' | 'jamal' | 'kamal';
