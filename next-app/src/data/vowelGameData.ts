export interface MinimalPair {
    pair: [string, string];
    w1: string;
    w2: string;
    d1: string;
    d2: string;
    e1: string;
    e2: string;
    s1: string;
    s2: string;
    frame: string; // e.g. "B_l"
}

export const minimalPairsData: MinimalPair[] = [
    {
        pair: ['O', 'Ö'],
        w1: 'Boll',
        w2: 'Böl',
        d1: 'كرة',
        d2: 'جذع (شجرة)',
        e1: '⚽',
        e2: '🪵',
        s1: 'Kasta en boll.',
        s2: 'Trädets böl är hårt.',
        frame: 'B_l'
    },
    {
        pair: ['O', 'Ö'],
        w1: 'Son',
        w2: 'Sön',
        d1: 'ابن',
        d2: 'كنيسة (قديم)',
        e1: '👦',
        e2: '⛪',
        s1: 'Min son är glad.',
        s2: 'Vi går till sön.',
        frame: 'S_n'
    }
];
