// Additional Daily Content Data

export interface JokeEntry { id: number; swedish: string; translation: string; punchline: string; }
export interface FactEntry { id: number; swedish: string; translation: string; details: string; }
export interface GrammarEntry { id: number; title: string; rule: string; example: string; }
export interface SlangEntry { id: number; word: string; translation: string; definition: string; example: string; }

export const JOKES: JokeEntry[] = [
    { id: 1, swedish: "Alla barnen tittade in i mikrovågsugnen...", translation: "كل الأطفال نظروا داخل الميكروويف...", punchline: "utom Rut, hon tittade ut. (ماعدا روت، كانت تنظر للخارج)" },
    { id: 2, swedish: "Varför har du tomatpuré i öronen?", translation: "لماذا تضع معجون الطماطم في أذنيك؟", punchline: "För att jag ska lyssna på Ketchup-låten. (لكي أستمع لأغنية الكاتشب)" },
    { id: 3, swedish: "Det var en gång två bagare...", translation: "كان ياما كان هناك خبازان...", punchline: "och en smet. (وهرب أحدهما / وعجينة - تورية لفظية)" },
    { id: 4, swedish: "Vilket djur är bäst på att gå på toaletten?", translation: "أي حيوان هو الأفضل في الذهاب للحمام؟", punchline: "Kisse-katten. (القطة / كيسي تعني تبول)" },
    { id: 5, swedish: "Vad sa den ena väggen till den andra?", translation: "ماذا قال الحائط للآخر؟", punchline: "Vi möts i hörnet. (نلتقي في الزاوية)" }
];

export const FACTS: FactEntry[] = [
    { id: 1, swedish: "Sverige har flest öar i världen.", translation: "السويد لديها أكبر عدد من الجزر في العالم.", details: "Över 267 000 öar totalt. (أكثر من 267 ألف جزيرة)" },
    { id: 2, swedish: "Fika är en social institution.", translation: "الـ Fika هي مؤسسة اجتماعية.", details: "Att dricka kaffe och äta bulle är heligt. (شرب القهوة وأكل الكعك أمر مقدس)" },
    { id: 3, swedish: "Svenska språket har inga könsord.", translation: "اللغة السويدية ليس بها كلمات للجنس (بالمعنى الصرفي المعقد).", details: "Bara 'en' och 'ett'. (فقط En و Ett)" },
    { id: 4, swedish: "Allemansrätten ger dig frihet.", translation: "حق العام (Allemansrätten) يمنحك الحرية.", details: "Du får gå nästan överallt i naturen. (يحق لك المشي في كل مكان تقريباً في الطبيعة)" },
    { id: 5, swedish: "Sverige importerar sopor.", translation: "السويد تستورد القمامة.", details: "För att driva sina återvinningsverk. (لتشغيل محطات إعادة التدوير)" }
];

export const GRAMMAR_TIPS: GrammarEntry[] = [
    { id: 1, title: "En vs Ett", rule: "75% av alla ord är En-ord.", example: "Gissa på 'En' om du är osäker! (خمن En إذا كنت غير متأكد)" },
    { id: 2, title: "Bestämd form", rule: "Lägg till -en eller -et på slutet.", example: "Bilen (السيارة), Huset (المنزل)" },
    { id: 3, title: "Verb i nutid", rule: "Slutar oftast på -r.", example: "Talar, Läser, Bor (يتحدث، يقرأ، يسكن)" },
    { id: 4, title: "Adjektiv + Ett", rule: "Lägg till -t på adjektivet.", example: "Ett storf hus -> Ett stort hus." },
    { id: 5, title: "Bisats (Inte)", rule: "'Inte' kommer före verbet i bisats.", example: "Jag vet att han inte kommer. (أعرف أنه لن يأتي)" }
];

export const SLANG: SlangEntry[] = [
    { id: 1, word: "Fika", translation: "استراحة قهوة", definition: "Kaffepaus med dopp", example: "Ska vi ta en fika? (هل نأخذ استراحة قهوة؟)" },
    { id: 2, word: "Taggad", translation: "متحمس", definition: "Entusiastisk", example: "Jag är så taggad på festen! (أنا متحمس جداً للحفلة)" },
    { id: 3, word: "Aina", translation: "الشرطة", definition: "Polisen", example: "Akta, Aina kommer! (احذر، الشرطة قادمة)" },
    { id: 4, word: "Gäri", translation: "فتاة / حبيبة", definition: "Tjej", example: "Hon är min gäri. (هي حبيبتي)" },
    { id: 5, word: "Lack", translation: "غاضب", definition: "Arg", example: "Bli inte lack nu. (لا تغضب الآن)" }
];