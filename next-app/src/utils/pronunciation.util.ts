/**
 * Pronunciation Data & Helpers
 */

export interface PhoneticTip {
    patter: RegExp;
    tip: { sv: string, ar: string };
    example: string;
}

export const PHONETIC_TIPS: PhoneticTip[] = [
    {
        patter: /sj|stj|skj/i,
        tip: {
            sv: "Sj-ljudet: Forma läpparna som om du ska vissla och blås ut.",
            ar: "صوت الـ Sj: شكل شفاهك كأنك ستصفر واخرج الهواء (صوت يشبه العطس الخفيف)."
        },
        example: "sju, stjärna, skjorta"
    },
    {
        patter: /ö/i,
        tip: {
            sv: "Ö: Som 'i' men med runda läppar. Tänk på 'hurt' på engelska.",
            ar: "حرف Ö: يشبه صوت حرف 'i' ولكن مع تدوير الشفاه (مثل صوت كلمة hurt بالإنجليزية)."
        },
        example: "öga, dörr"
    },
    {
        patter: /y/i,
        tip: {
            sv: "Y: Som 'i' men med läpparna långt framåt.",
            ar: "حرف Y: انطق حرف 'i' ولكن مع دفع الشفتين للأمام بحدة."
        },
        example: "ny, lyssna"
    },
    {
        patter: /r/i,
        tip: {
            sv: "R: Rullande r i början av ord, men mjukare efter vokal.",
            ar: "حرف R: يكون 'مرفرفاً' في بداية الكلمات، ويصبح ناعماً جداً إذا جاء بعد حرف علة."
        },
        example: "röd, barn"
    }
];

export const PronunciationHelper = {
    /**
     * Basic Swedish syllable splitter (Simplified heuristic)
     */
    splitIntoSyllables(word: string): string[] {
        const vowels = 'aeiouyåäö';
        const syllables: string[] = [];
        let current = '';

        for (let i = 0; i < word.length; i++) {
            current += word[i];

            // Heuristic: Split after vowel if followed by consonant + vowel
            if (vowels.includes(word[i].toLowerCase())) {
                if (i + 2 < word.length && !vowels.includes(word[i + 1].toLowerCase()) && vowels.includes(word[i + 2].toLowerCase())) {
                    syllables.push(current);
                    current = '';
                }
            }
            // Split after double consonant
            if (i > 0 && word[i] === word[i - 1] && !vowels.includes(word[i].toLowerCase())) {
                syllables.push(current);
                current = '';
            }
        }

        if (current) syllables.push(current);
        return syllables;
    },

    /**
     * Get tips for a word based on its spelling
     */
    getTipsForWord(word: string): PhoneticTip[] {
        return PHONETIC_TIPS.filter(tip => tip.patter.test(word));
    }
};

if (typeof window !== 'undefined') {
    (window as any).PronunciationHelper = PronunciationHelper;
}
