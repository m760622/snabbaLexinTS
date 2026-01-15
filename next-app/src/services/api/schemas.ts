export interface Word {
    id: number;
    type: string;
    swedish: string;
    arabic: string;
    arabic_ext?: string;
    definition?: string;
    forms?: string;
    example_swe?: string;
    example_arb?: string;
    idiom_swe?: string;
    idiom_arb?: string;
    raw?: any[];
}

export interface SearchRequest {
    query: string;
    mode?: 'contains' | 'start' | 'end' | 'exact' | 'favorites';
    type?: string;
    sort?: 'relevance' | 'alpha_asc' | 'alpha_desc' | 'last_char' | 'richness';
    limit?: number;
    offset?: number;
}

export interface SearchStats {
    total: number;
    types: Record<string, number>;
}

export interface SearchResponse {
    results: Word[];
    stats: SearchStats;
    executionTimeMs: number;
}

export interface IDataService {
    initialize(): Promise<void>;
    getAllWords(): Promise<Word[]>;
    getWordById(id: number): Promise<Word | null>;
    search(request: SearchRequest): Promise<SearchResponse>;
}
