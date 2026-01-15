import { WCTheme, WCLevel, WCDictionaryEntry } from '../types';

// ========================================
//  SWEDISH WORD CONNECT DATA
// ========================================

// --- THEMED WORLDS METADATA ---
export const WC_THEMES: WCTheme[] = [
    {
        id: 'food',
        name: 'Mat & Dryck / الطعام والشراب',
        icon: '🍎',
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)',
        accent: '#e11d48'
    },
    {
        id: 'nature',
        name: 'Naturen / الطبيعة',
        icon: '🌲',
        background: 'linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)',
        accent: '#059669'
    },
    {
        id: 'travel',
        name: 'Resor / السفر',
        icon: '✈️',
        background: 'linear-gradient(to top, #4481eb 0%, #04befe 100%)',
        accent: '#2563eb'
    },
    {
        id: 'daily',
        name: 'Vardag / الحياة اليومية',
        icon: '🏠',
        background: 'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
        accent: '#d97706'
    },
    {
        id: 'health',
        name: 'Hälsa / الصحة',
        icon: '❤️',
        background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
        accent: '#ef4444'
    },
    {
        id: 'work',
        name: 'Arbete / العمل',
        icon: '💼',
        background: 'linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)',
        accent: '#2563eb'
    },
    {
        id: 'education',
        name: 'Utbildning / التعليم',
        icon: '🎓',
        background: 'linear-gradient(to top, #3b82f6 0%, #60a5fa 100%)',
        accent: '#2563eb'
    },
    {
        id: 'transport',
        name: 'Transport / المواصلات',
        icon: '🚌',
        background: 'linear-gradient(to right, #f6d365 0%, #fda085 100%)',
        accent: '#f59e0b'
    },
    {
        id: 'law',
        name: 'Lag & Rätt / القانون',
        icon: '⚖️',
        background: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)',
        accent: '#4b5563'
    },
    {
        id: 'islam',
        name: 'Islam / الإسلام',
        icon: '☪️',
        background: 'linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)',
        accent: '#10b981'
    }
];

// Helper to get theme for a chapter
export function getThemeForChapter(chapter: number): WCTheme {
    // Cycle through themes: 1->Food, 2->Nature, 3->Travel, 4->Daily, 5->Food...
    const index = (chapter - 1) % WC_THEMES.length;
    return WC_THEMES[index];
}

// ============================================
// WORD CONNECT - 100 STATIC LEVELS
// ============================================

export const WC_PREDEFINED_LEVELS: Record<string, WCLevel> = {
    // ===========================================
    // CHAPTER 1
    // ===========================================
    "1-1": { "letters": ["Å", "K", "S", "L"], "words": ["SKÅL", "KÅL"], "validWords": ["SKÅL", "KÅL"] },
    "1-2": { "letters": ["S", "T", "A", "F"], "words": ["SAFT", "FAT"], "validWords": ["SAFT", "FAT"] },
    "1-3": { "letters": ["V", "I", "N", "K"], "words": ["KNIV", "VIN"], "validWords": ["KNIV", "VIN"] },
    "1-4": { "letters": ["O", "A", "K", "R", "K"], "words": ["KAKOR", "KOKA", "KORA"], "validWords": ["KAKOR", "KOKA", "KORA"] },
    "1-5": { "letters": ["L", "S", "A", "K", "A"], "words": ["SKALA", "KALAS", "SALA"], "validWords": ["SKALA", "KALAS", "SALA"] },
    "1-6": { "letters": ["B", "A", "R", "K", "A"], "words": ["BAKAR", "BAKA", "BARA"], "validWords": ["BAKAR", "BAKA", "BARA"] },
    "1-7": { "letters": ["I", "F", "A", "S", "K", "R"], "words": ["FISKAR", "FISKA", "FRISK", "SIKAR"], "validWords": ["FISKAR", "FISKA", "FRISK", "SIKAR"] },
    "1-8": { "letters": ["R", "A", "T", "S", "R", "O"], "words": ["ROSTAR", "OSTAR", "ROSTA", "STORA"], "validWords": ["ROSTAR", "OSTAR", "ROSTA", "STORA"] },
    "1-9": { "letters": ["K", "S", "A", "R", "L", "Å"], "words": ["SKÅLAR", "KÅLAR", "SKÅLA", "SKÅRA"], "validWords": ["SKÅLAR", "KÅLAR", "SKÅLA", "SKÅRA"] },
    "1-10": { "letters": ["T", "S", "O", "K", "U", "R", "F"], "words": ["FRUKOST", "FRUKT", "KOST", "ROST", "KORT"], "validWords": ["FRUKOST", "FRUKT", "KOST", "ROST", "KORT"] },
    // ===========================================
    // CHAPTER 2
    // ===========================================
    "2-1": { "letters": ["D", "Ä", "R", "T"], "words": ["TRÄD", "TRÄ"], "validWords": ["TRÄD", "TRÄ"] },
    "2-2": { "letters": ["A", "V", "Ö", "L"], "words": ["LÖVA", "LÖV"], "validWords": ["LÖVA", "LÖV"] },
    "2-3": { "letters": ["M", "A", "Y", "R"], "words": ["MYRA", "MYR"], "validWords": ["MYRA", "MYR"] },
    "2-4": { "letters": ["S", "N", "D", "A", "A"], "words": ["ANDAS", "SAND", "ANDA"], "validWords": ["ANDAS", "SAND", "ANDA"] },
    "2-5": { "letters": ["E", "R", "N", "A", "G"], "words": ["REGNA", "REGN", "GRAN"], "validWords": ["REGNA", "REGN", "GRAN"] },
    "2-6": { "letters": ["V", "A", "L", "A", "R"], "words": ["ALVAR", "LAVA", "VARA"], "validWords": ["ALVAR", "LAVA", "VARA"] },
    "2-7": { "letters": ["A", "R", "E", "N", "R", "G"], "words": ["GRENAR", "RENAR", "GRANE", "ANGRE"], "validWords": ["GRENAR", "RENAR", "GRANE", "ANGRE"] },
    "2-8": { "letters": ["A", "S", "T", "E", "R", "N"], "words": ["STENAR", "RENSA", "ARTEN"], "validWords": ["STENAR", "RENSA", "ARTEN"] },
    "2-9": { "letters": ["D", "N", "A", "G", "R", "O"], "words": ["GRODAN", "GRODA", "DRAGON", "ORGAN"], "validWords": ["GRODAN", "GRODA", "DRAGON", "ORGAN"] },
    "2-10": { "letters": ["T", "N", "S", "R", "Ä", "A", "J"], "words": ["STJÄRNA", "TJÄRN", "TÄRNA", "SÄRTA", "TJÄRA"], "validWords": ["STJÄRNA", "TJÄRN", "TÄRNA", "SÄRTA", "TJÄRA"] },
    // ===========================================
    // CHAPTER 3
    // ===========================================
    "3-1": { "letters": ["A", "S", "E", "R"], "words": ["RESA", "RES"], "validWords": ["RESA", "RES"] },
    "3-2": { "letters": ["S", "A", "S", "P"], "words": ["PASS", "ASP"], "validWords": ["PASS", "ASP"] },
    "3-3": { "letters": ["E", "B", "R", "G"], "words": ["BERG", "BER"], "validWords": ["BERG", "BER"] },
    "3-4": { "letters": ["A", "K", "S", "B", "O"], "words": ["BOKAS", "BOKA", "KOSA"], "validWords": ["BOKAS", "BOKA", "KOSA"] },
    "3-5": { "letters": ["P", "Å", "R", "A", "S"], "words": ["SPÅRA", "PÅSAR", "RAPS"], "validWords": ["SPÅRA", "PÅSAR", "RAPS"] },
    "3-6": { "letters": ["T", "E", "S", "A", "R"], "words": ["ASTER", "RESA", "RAST"], "validWords": ["ASTER", "RESA", "RAST"] },
    "3-7": { "letters": ["N", "D", "E", "Ä", "F", "R"], "words": ["FÄRDEN", "FÄRDE", "NÄRDE", "RÄNDE"], "validWords": ["FÄRDEN", "FÄRDE", "NÄRDE", "RÄNDE"] },
    "3-8": { "letters": ["R", "T", "D", "Ä", "E", "V"], "words": ["VÄDRET", "VÄRDET", "VÄRDE", "TRÄDE"], "validWords": ["VÄDRET", "VÄRDET", "VÄRDE", "TRÄDE"] },
    "3-9": { "letters": ["R", "P", "E", "N", "A", "G"], "words": ["PENGAR", "ANGRE", "GRANE", "REPAN"], "validWords": ["PENGAR", "ANGRE", "GRANE", "REPAN"] },
    "3-10": { "letters": ["K", "T", "L", "T", "F", "U", "Y"], "words": ["UTFLYKT", "FLYKT", "FLYTT", "LYFT", "TUFT"], "validWords": ["UTFLYKT", "FLYKT", "FLYTT", "LYFT", "TUFT"] },
    // ===========================================
    // CHAPTER 4
    // ===========================================
    "4-1": { "letters": ["D", "B", "O", "R"], "words": ["BORD", "BOR"], "validWords": ["BORD", "BOR"] },
    "4-2": { "letters": ["S", "T", "O", "L"], "words": ["STOL", "SOL"], "validWords": ["STOL", "SOL"] },
    "4-3": { "letters": ["R", "R", "Ö", "D"], "words": ["DÖRR", "DÖR"], "validWords": ["DÖRR", "DÖR"] },
    "4-4": { "letters": ["S", "K", "O", "A", "L"], "words": ["SKOLA", "KOLA", "SKAL"], "validWords": ["SKOLA", "KOLA", "SKAL"] },
    "4-5": { "letters": ["L", "A", "M", "A", "P"], "words": ["LAMPA", "LAMA", "PALM"], "validWords": ["LAMPA", "LAMA", "PALM"] },
    "4-6": { "letters": ["A", "T", "R", "A", "K"], "words": ["KARTA", "AKTA", "RATA"], "validWords": ["KARTA", "AKTA", "RATA"] },
    "4-7": { "letters": ["S", "V", "K", "R", "I", "A"], "words": ["SKRIVA", "ARKIV", "SKIVA", "VIRKA"], "validWords": ["SKRIVA", "ARKIV", "SKIVA", "VIRKA"] },
    "4-8": { "letters": ["R", "K", "D", "Ä", "L", "E"], "words": ["KLÄDER", "LÄDER", "KLÄDE", "LÄRDE"], "validWords": ["KLÄDER", "LÄDER", "KLÄDE", "LÄRDE"] },
    "4-9": { "letters": ["T", "S", "R", "O", "B", "A"], "words": ["BORSTA", "BORST", "ROSTA", "STORA"], "validWords": ["BORSTA", "BORST", "ROSTA", "STORA"] },
    "4-10": { "letters": ["I", "T", "N", "O", "A", "T", "S"], "words": ["STATION", "NATT", "SATT", "STAT", "TANT"], "validWords": ["STATION", "NATT", "SATT", "STAT", "TANT"] },
    // ===========================================
    // CHAPTER 5
    // ===========================================
    "5-1": { "letters": ["D", "N", "T", "A"], "words": ["TAND", "AND"], "validWords": ["TAND", "AND"] },
    "5-2": { "letters": ["A", "K", "S", "M"], "words": ["SMAK", "ASK"], "validWords": ["SMAK", "ASK"] },
    "5-3": { "letters": ["O", "L", "B", "D"], "words": ["BLOD", "BOD"], "validWords": ["BLOD", "BOD"] },
    "5-4": { "letters": ["K", "T", "A", "S", "R"], "words": ["STARK", "KAST", "KRAS"], "validWords": ["STARK", "KAST", "KRAS"] },
    "5-5": { "letters": ["P", "R", "S", "O", "T"], "words": ["SPORT", "STOR", "SORT"], "validWords": ["SPORT", "STOR", "SORT"] },
    "5-6": { "letters": ["T", "R", "A", "Ä", "N"], "words": ["TRÄNA", "NÄRA", "ÄRTA"], "validWords": ["TRÄNA", "NÄRA", "ÄRTA"] },
    "5-7": { "letters": ["G", "R", "D", "I", "A", "V"], "words": ["GRAVID", "VIDGAR", "DRIVA", "VIDGA"], "validWords": ["GRAVID", "VIDGAR", "DRIVA", "VIDGA"] },
    "5-8": { "letters": ["T", "Ö", "R", "K", "S", "E"], "words": ["SKÖTER", "SÖKER", "KÖRET", "RÖKTE"], "validWords": ["SKÖTER", "SÖKER", "KÖRET", "RÖKTE"] },
    "5-9": { "letters": ["L", "Ä", "A", "N", "H", "S"], "words": ["HÄLSAN", "HÄLSA", "LÄNSA"], "validWords": ["HÄLSAN", "HÄLSA", "LÄNSA"] },
    "5-10": { "letters": ["R", "E", "T", "S", "Å", "L", "P"], "words": ["PLÅSTER", "LÅTER", "LÅSER", "PEST", "PÅSE"], "validWords": ["PLÅSTER", "LÅTER", "LÅSER", "PEST", "PÅSE"] },
    // ===========================================
    // CHAPTER 6
    // ===========================================
    "6-1": { "letters": ["R", "O", "V", "P"], "words": ["PROV", "ROP"], "validWords": ["PROV", "ROP"] },
    "6-2": { "letters": ["V", "L", "E", "E"], "words": ["ELEV", "LEV"], "validWords": ["ELEV", "LEV"] },
    "6-3": { "letters": ["A", "L", "Ä", "R"], "words": ["LÄRA", "LÄR"], "validWords": ["LÄRA", "LÄR"] },
    "6-4": { "letters": ["T", "L", "A", "V", "A"], "words": ["AVTAL", "TAVLA", "TALA"], "validWords": ["AVTAL", "TAVLA", "TALA"] },
    "6-5": { "letters": ["T", "A", "E", "T", "M"], "words": ["MATTE", "TEAM", "TEMA"], "validWords": ["MATTE", "TEAM", "TEMA"] },
    "6-6": { "letters": ["K", "Ä", "A", "R", "N"], "words": ["RÄKNA", "NÄRA", "RÄKA"], "validWords": ["RÄKNA", "NÄRA", "RÄKA"] },
    "6-7": { "letters": ["S", "J", "A", "G", "U", "N"], "words": ["SJUNGA", "SJUNG"], "validWords": ["SJUNGA", "SJUNG"] },
    "6-8": { "letters": ["T", "O", "T", "R", "D", "I"], "words": ["IDROTT", "TORD", "DITO"], "validWords": ["IDROTT", "TORD", "DITO"] },
    "6-9": { "letters": ["S", "T", "A", "L", "A", "M"], "words": ["MATSAL", "SAMLA", "SMALT", "ATLAS"], "validWords": ["MATSAL", "SAMLA", "SMALT", "ATLAS"] },
    "6-10": { "letters": ["K", "S", "V", "A", "S", "N", "E"], "words": ["SVENSKA", "SVENSK", "VAKEN", "SVEK"], "validWords": ["SVENSKA", "SVENSK", "VAKEN", "SVEK"] },
    // ===========================================
    // CHAPTER 7
    // ===========================================
    "7-1": { "letters": ["K", "A", "P", "Ö"], "words": ["KÖPA", "KÖP"], "validWords": ["KÖPA", "KÖP"] },
    "7-2": { "letters": ["S", "I", "R", "P"], "words": ["PRIS", "RIS"], "validWords": ["PRIS", "RIS"] },
    "7-3": { "letters": ["A", "R", "Y", "D"], "words": ["DYRA", "DYR"], "validWords": ["DYRA", "DYR"] },
    "7-4": { "letters": ["J", "L", "Ä", "S", "A"], "words": ["SÄLJA", "SÄLJ", "SJÄL"], "validWords": ["SÄLJA", "SÄLJ", "SJÄL"] },
    "7-5": { "letters": ["V", "K", "A", "Ä", "S"], "words": ["VÄSKA", "VÄSA"], "validWords": ["VÄSKA", "VÄSA"] },
    "7-6": { "letters": ["P", "L", "S", "A", "T"], "words": ["PLAST", "LAST", "SALT"], "validWords": ["PLAST", "LAST", "SALT"] },
    "7-7": { "letters": ["K", "D", "E", "L", "Ä", "R"], "words": ["KLÄDER", "LÄDER", "LÄRDE", "KLÄDE"], "validWords": ["KLÄDER", "LÄDER", "LÄRDE", "KLÄDE"] },
    "7-8": { "letters": ["S", "N", "R", "O", "A", "K"], "words": ["SKORNA", "KORNA", "NORSK", "ORKAN"], "validWords": ["SKORNA", "KORNA", "NORSK", "ORKAN"] },
    "7-9": { "letters": ["K", "O", "R", "S", "T", "A"], "words": ["KOSTAR", "ROSTA", "STORA", "KORTA"], "validWords": ["KOSTAR", "ROSTA", "STORA", "KORTA"] },
    "7-10": { "letters": ["S", "K", "J", "O", "R", "T", "A"], "words": ["SKJORTA", "SKROT", "ROSTA", "STORA"], "validWords": ["SKJORTA", "SKROT", "ROSTA", "STORA"] },
    // ===========================================
    // CHAPTER 8
    // ===========================================
    "8-1": { "letters": ["T", "A", "G", "A"], "words": ["GATA", "TAG"], "validWords": ["GATA", "TAG"] },
    "8-2": { "letters": ["M", "A", "N", "H"], "words": ["HAMN", "HAN"], "validWords": ["HAMN", "HAN"] },
    "8-3": { "letters": ["R", "A", "Ö", "K"], "words": ["KÖRA", "ÖKAR"], "validWords": ["KÖRA", "ÖKAR"] },
    "8-4": { "letters": ["O", "K", "N", "T", "A"], "words": ["KANOT", "NATO", "TANK"], "validWords": ["KANOT", "NATO", "TANK"] },
    "8-5": { "letters": ["Ä", "K", "A", "R", "R"], "words": ["KÄRRA", "ÄRRA", "KARR"], "validWords": ["KÄRRA", "ÄRRA", "KARR"] },
    "8-6": { "letters": ["S", "Ö", "T", "E", "R"], "words": ["ÖSTER", "REST", "RÖST"], "validWords": ["ÖSTER", "REST", "RÖST"] },
    "8-7": { "letters": ["R", "A", "T", "T", "E", "R"], "words": ["RATTER", "ARTER", "RETAR", "TREAR"], "validWords": ["RATTER", "ARTER", "RETAR", "TREAR"] },
    "8-8": { "letters": ["S", "A", "R", "L", "A", "T"], "words": ["LASTAR", "ALSTRA", "SALTA", "TALAR"], "validWords": ["LASTAR", "ALSTRA", "SALTA", "TALAR"] },
    "8-9": { "letters": ["R", "N", "P", "S", "Å", "E"], "words": ["SPÅREN", "PÅSEN"], "validWords": ["SPÅREN", "PÅSEN"] },
    "8-10": { "letters": ["L", "B", "I", "T", "S", "A", "L"], "words": ["LASTBIL", "LISTA", "TILLS", "BILA", "LISA"], "validWords": ["LASTBIL", "LISTA", "TILLS", "BILA", "LISA"] },
    // ===========================================
    // CHAPTER 9
    // ===========================================
    "9-1": { "letters": ["A", "L", "G"], "words": ["LAG", "GAL"], "validWords": ["LAG", "GAL"] },
    "9-2": { "letters": ["D", "M", "O"], "words": ["DOM", "MOD"], "validWords": ["DOM", "MOD"] },
    "9-3": { "letters": ["L", "Ö", "G", "N"], "words": ["LÖGN", "LÖN"], "validWords": ["LÖGN", "LÖN"] },
    "9-4": { "letters": ["D", "A", "R", "O", "M"], "words": ["DOMAR", "ORMA", "RODA"], "validWords": ["DOMAR", "ORMA", "RODA"] },
    "9-5": { "letters": ["A", "L", "A", "R", "G"], "words": ["LAGAR", "LAGA", "GALA"], "validWords": ["LAGAR", "LAGA", "GALA"] },
    "9-6": { "letters": ["L", "K", "S", "U", "D"], "words": ["SKULD", "DUKS"], "validWords": ["SKULD", "DUKS"] },
    "9-7": { "letters": ["D", "O", "E", "R", "A", "M"], "words": ["DOMARE", "DOMAR"], "validWords": ["DOMARE", "DOMAR"] },
    "9-8": { "letters": ["A", "K", "R", "E", "T", "V"], "words": ["VAKTER", "VAKET", "RAKET"], "validWords": ["VAKTER", "VAKET", "RAKET"] },
    "9-9": { "letters": ["R", "Å", "E", "N", "R", "A"], "words": ["RÅNARE", "RENAR", "RÅNAR"], "validWords": ["RÅNARE", "RENAR", "RÅNAR"] },
    "9-10": { "letters": ["A", "T", "V", "O", "D", "K", "A"], "words": ["ADVOKAT", "VAKTA", "DATA", "VAKA", "KOTA"], "validWords": ["ADVOKAT", "VAKTA", "DATA", "VAKA", "KOTA"] },
    // ===========================================
    // CHAPTER 10
    // ===========================================
    "10-1": { "letters": ["O", "R", "T"], "words": ["TRO", "ROT"], "validWords": ["TRO", "ROT"] },
    "10-2": { "letters": ["B", "Ö", "N", "A"], "words": ["BÖNA", "BÖN"], "validWords": ["BÖNA", "BÖN"] },
    "10-3": { "letters": ["L", "V", "I"], "words": ["LIV", "VIL"], "validWords": ["LIV", "VIL"] },
    "10-4": { "letters": ["A", "N", "E", "N", "D"], "words": ["ANDEN", "ANDE", "DENNA"], "validWords": ["ANDEN", "ANDE", "DENNA"] },
    "10-5": { "letters": ["I", "L", "G", "E", "H"], "words": ["HELIG", "HELG"], "validWords": ["HELIG", "HELG"] },
    "10-6": { "letters": ["I", "A", "M", "S", "L"], "words": ["ISLAM", "SILA", "LIMA"], "validWords": ["ISLAM", "SILA", "LIMA"] },
    "10-7": { "letters": ["P", "R", "A", "S", "O", "T"], "words": ["PASTOR", "ROSTA", "SPORT", "SOPAR"], "validWords": ["PASTOR", "ROSTA", "SPORT", "SOPAR"] },
    "10-8": { "letters": ["Y", "S", "R", "E", "D", "N"], "words": ["SYNDER", "SYNER"], "validWords": ["SYNDER", "SYNER"] },
    "10-9": { "letters": ["A", "G", "L", "I", "N", "D"], "words": ["ANDLIG", "DINGLA", "GLIDA"], "validWords": ["ANDLIG", "DINGLA", "GLIDA"] },
    "10-10": { "letters": ["L", "E", "P", "O", "A", "S", "T"], "words": ["APOSTEL", "STAPEL", "STOLPE", "POSTA"], "validWords": ["APOSTEL", "STAPEL", "STOLPE", "POSTA"] },
};

// --- CENTRALIZED DICTIONARY ---
export const WC_DICTIONARY: WCDictionaryEntry[] = [
    {
        "w": "ABER",
        "t": "عقبة",
        "s": "ett litet aber",
        "st": "عقبة بسيطة"
    },
    {
        "w": "ACK",
        "t": "آه (تعجب)",
        "s": "Ack, så vackert.",
        "st": "آه، كم هو جميل."
    },
    {
        "w": "ÅDER",
        "t": "عرق",
        "s": "Blodet rinner i ådrorna.",
        "st": "الدم في العروق."
    },
    {
        "w": "ÅDRA",
        "t": "نَزْعَة, مَيِّزَة, مَوهِبَة",
        "s": "hon har en poetisk ådra",
        "st": "لديها موهبة شعريّة"
    },
    {
        "w": "ADVOKAT",
        "t": "محامي",
        "s": "En bra advokat.",
        "st": "محام جيد."
    },
    {
        "w": "ÄGA",
        "t": "يملك",
        "s": "Att äga.",
        "st": "الامتلاك."
    },
    {
        "w": "AGAR",
        "t": "يضرب (عقاب)",
        "s": "Man får inte aga barn.",
        "st": "لا يجوز ضرب الأطفال."
    },
    {
        "w": "ÄGG",
        "t": "بيض",
        "s": "Hönan lägger ett ägg varje dag.",
        "st": "الدجاجة تبيض بيضة كل يوم."
    },
    {
        "w": "ÄGGA",
        "t": "يحرض",
        "s": "Han äggade upp stämningen.",
        "st": "يحرض على الشجار."
    },
    {
        "w": "ÅK",
        "t": "ذهاب / ركوب",
        "s": "Det var ett roligt åk.",
        "st": "كانت رحلة ممتعة."
    },
    {
        "w": "AKA",
        "t": "تُعرف بـ",
        "s": "Hon är känd, aka stjärnan.",
        "st": "هي مشهورة، وتُعرف بالنجمة."
    },
    {
        "w": "ÅKA",
        "t": "يذهب / يركب",
        "s": "Vi ska åka tåg.",
        "st": "سنركب القطار."
    },
    {
        "w": "AKT",
        "t": "فعل / ملف",
        "s": "Detta är en viktig akt.",
        "st": "هذا ملف مهم."
    },
    {
        "w": "AKTA",
        "t": "يحذر",
        "s": "Akta dig för hunden!",
        "st": "احذر من الكلب!"
    },
    {
        "w": "ÅKTA",
        "t": "حقيقي",
        "s": "Det är äkta guld.",
        "st": "ذهب حقيقي."
    },
    {
        "w": "ÄKTA",
        "t": "حقيقي",
        "s": "Är det äkta guld?",
        "st": "هل هذا ذهب حقيقي؟"
    },
    {
        "w": "AKUT",
        "t": "طارئ",
        "s": "akuta sjukdomar akuta problem akuta behov",
        "st": "أمراض طارئة مشكلات طارئة حاجة طارئة"
    },
    {
        "w": "AL",
        "t": "شجرة الحور",
        "s": "Alen växer vid vattnet.",
        "st": "شجرة الحور تنمو هنا."
    },
    {
        "w": "ÅLDRAS",
        "t": "يتقدم في العمر",
        "s": "Alla åldras.",
        "st": "الجميع يتقدم في العمر."
    },
    {
        "w": "ÄLDRE",
        "t": "أكبر سناً",
        "s": "Min äldre bror bor i Oslo.",
        "st": "أخي الأكبر يعيش في أوسلو."
    },
    {
        "w": "ALG",
        "t": "طحالب",
        "s": "Det växer alger i sjön.",
        "st": "تنمو الطحالب في البحيرة."
    },
    {
        "w": "ÄLG",
        "t": "موس",
        "s": "Skogens konung är älgen.",
        "st": "ملك الغابة هو الموس."
    },
    {
        "w": "ÄLGA",
        "t": "يمشي بخطوات واسعة",
        "s": "Han älgade fram i skogen.",
        "st": "يمشي بسرعة."
    },
    {
        "w": "ALGER",
        "t": "طحالب",
        "s": "Det finns gröna alger i vattnet.",
        "st": "توجد طحالب خضراء في الماء."
    },
    {
        "w": "ALKAN",
        "t": "طائر الأوك (المعرف)",
        "s": "Alkan är en sjöfågel.",
        "st": "الأوك طائر بحري."
    },
    {
        "w": "ALLA",
        "t": "الجميع",
        "s": "Alla är välkomna till vår fest.",
        "st": "الجميع مرحب بهم في حفلتنا."
    },
    {
        "w": "ALLAH",
        "t": "الله",
        "s": "Vi ber till Allah varje dag.",
        "st": "نصلي لله كل يوم."
    },
    {
        "w": "ALLAS",
        "t": "للجميع",
        "s": "Det är allas ansvar.",
        "st": "إنها مسؤولية الجميع."
    },
    {
        "w": "ALPER",
        "t": "جبال الألب",
        "s": "Vi åkte till Alperna.",
        "st": "ذهبنا إلى جبال الألب."
    },
    {
        "w": "ALSTRA",
        "t": "يولد / ينتج",
        "s": "Solen alstrar värme.",
        "st": "الشمس تولد الحرارة."
    },
    {
        "w": "ALTAN",
        "t": "شرفة",
        "s": "Vi dricker kaffe på altanen.",
        "st": "نشرب القهوة في الشرفة."
    },
    {
        "w": "ÄLV",
        "t": "نهر",
        "s": "En bred älv rinner genom staden.",
        "st": "نهر عريض يجري عبر المدينة."
    },
    {
        "w": "ÄLVA",
        "t": "جنية/نهر",
        "s": "Älvorna dansar i dimman.",
        "st": "الجنية ترقص."
    },
    {
        "w": "ALVAR",
        "t": "سهل ألڤار (سهل كلسي)",
        "s": "Ölands alvar är unikt.",
        "st": "سهل ألڤار في أولاند فريد من نوعه."
    },
    {
        "w": "AMEN",
        "t": "آمين",
        "s": "Vi säger amen när bönen är slut.",
        "st": "نقول آمين عندما تنتهي الصلاة."
    },
    {
        "w": "ÄMN",
        "t": "مادة",
        "s": "Ett farligt ämne.",
        "st": "مادة خطرة."
    },
    {
        "w": "ÄMNE",
        "t": "مادة / موضوع",
        "s": "Vilket är ditt favoritämne i skolan?",
        "st": "ما هي مادتك المفضلة في المدرسة؟"
    },
    {
        "w": "AMS",
        "t": "مجلس سوق العمل",
        "s": "AMS - bidrag",
        "st": "منحة مجلس سوق العمل"
    },
    {
        "w": "ANA",
        "t": "يشك / يظن",
        "s": "Jag anar att något är fel.",
        "st": "أظن أن هناك خطأ ما."
    },
    {
        "w": "ANANAS",
        "t": "أناناس",
        "s": "Ananas är en tropisk frukt.",
        "st": "الأناناس فاكهة استوائية."
    },
    {
        "w": "AND",
        "t": "بطة",
        "s": "En and simmar i dammen.",
        "st": "بطة تسبح في البركة."
    },
    {
        "w": "ANDA",
        "t": "روح",
        "s": "Vi arbetar i god anda tillsammans.",
        "st": "نحن نعمل بروح طيبة معاً."
    },
    {
        "w": "ÄNDA",
        "t": "نهاية/مؤخرة",
        "s": "Slutet på vägen.",
        "st": "نهاية الطريق."
    },
    {
        "w": "ANDAS",
        "t": "يتنفس",
        "s": "Kom ihåg att andas in djupt.",
        "st": "تذكر أن تتنفس بعمق."
    },
    {
        "w": "ANDE",
        "t": "روح",
        "s": "Den helige Ande.",
        "st": "الروح القدس."
    },
    {
        "w": "ANDEN",
        "t": "الروح",
        "s": "Anden i flaskan.",
        "st": "الجني في الزجاجة."
    },
    {
        "w": "ÄNDER",
        "t": "بط (جمع)",
        "s": "Vi matade änderna i dammen.",
        "st": "أطعمنا البط في البركة."
    },
    {
        "w": "ANDLIG",
        "t": "روحي",
        "s": "Hon har ett andligt intresse.",
        "st": "لديها اهتمام روحي."
    },
    {
        "w": "ANDRUM",
        "t": "فترة",
        "s": "ett ögonblicks andrum",
        "st": "لحظة"
    },
    {
        "w": "ÄNG",
        "t": "مرج",
        "s": "Vi hade picknick på en blommig äng.",
        "st": "قمنا بنزهة في مرج مليء بالزهور."
    },
    {
        "w": "ÅNGA",
        "t": "بخار",
        "s": "Vatten blir till ånga.",
        "st": "بخار الماء."
    },
    {
        "w": "ÅNGAR",
        "t": "يتبخر",
        "s": "Maten ångar av värme.",
        "st": "الطعام يتبخر من الحرارة."
    },
    {
        "w": "ÄNGEL",
        "t": "ملاك",
        "s": "Du är en ängel.",
        "st": "أنت ملاك."
    },
    {
        "w": "ÄNGLAR",
        "t": "ملائكة",
        "s": "Änglar vaktar oss.",
        "st": "الملائكة تحرسنا."
    },
    {
        "w": "ANGRE",
        "t": "يندم",
        "s": "Du kommer att angre dig.",
        "st": "ستندم على ذلك."
    },
    {
        "w": "ÄNKA",
        "t": "أرملة",
        "s": "Hon är änka.",
        "st": "هي أرملة."
    },
    {
        "w": "ANKAR",
        "t": "مرساة (شكل قديم)",
        "s": "Skeppet fällde ankar.",
        "st": "ألقت السفينة المرساة."
    },
    {
        "w": "ANKOMST",
        "t": "وصول",
        "s": "Vi väntar på tågets ankomst till stationen.",
        "st": "ننتظر وصول القطار إلى المحطة."
    },
    {
        "w": "ANKOR",
        "t": "بط",
        "s": "Ankor.",
        "st": "بط."
    },
    {
        "w": "ANNA",
        "t": "آنا (اسم)",
        "s": "Anna är min syster.",
        "st": "آنا هي أختي."
    },
    {
        "w": "ANSIKTE",
        "t": "وجه",
        "s": "Hon har ett vackert ansikte.",
        "st": "لديها وجه جميل."
    },
    {
        "w": "ANSLÅ",
        "t": "يخصص / يعلن",
        "s": "Regeringen ska anslå pengar.",
        "st": "الحكومة ستخصص أموالاً."
    },
    {
        "w": "ANSTÅ",
        "t": "يؤجل, يؤخر",
        "s": "det får anstå tills vidare",
        "st": "أجل حتى إشعار آخر"
    },
    {
        "w": "ANSTÅR",
        "t": "يُلائم, يُليق, يناسب",
        "s": "som det anstår en ledare",
        "st": "بشكل يليق بقائد"
    },
    {
        "w": "APOSTEL",
        "t": "رسول (حواري)",
        "s": "En av Jesus tolv apostlar.",
        "st": "واحد من حواريي يسوع الاثني عشر."
    },
    {
        "w": "APOTEK",
        "t": "صيدلية",
        "s": "Apoteket.",
        "st": "الصيدلية."
    },
    {
        "w": "ÄPPLE",
        "t": "تفاحة",
        "s": "Ett äpple om dagen.",
        "st": "تفاحة في اليوم."
    },
    {
        "w": "APRIKOS",
        "t": "مشمش",
        "s": "Torkad aprikos är godis.",
        "st": "المشمش المجفف مثل الحلوى."
    },
    {
        "w": "AR",
        "t": "آر (وحدة مساحة)",
        "s": "Tomten är på 10 ar.",
        "st": "مساحة الأرض."
    },
    {
        "w": "ÅR",
        "t": "سنة",
        "s": "Gott nytt år!",
        "st": "كل سنة وأنت بخير."
    },
    {
        "w": "ÄR",
        "t": "يكون",
        "s": "Jag är glad.",
        "st": "أنا سعيد."
    },
    {
        "w": "ARA",
        "t": "ببغاء المكاو",
        "s": "En färgglad ara satt i trädet.",
        "st": "ببغاء مكاو ملون جلس في الشجرة."
    },
    {
        "w": "ÅRA",
        "t": "مجاديف",
        "s": "Vi tappade en åra i sjön.",
        "st": "أسقطنا مجدافاً في البحيرة."
    },
    {
        "w": "ARAK",
        "t": "عرق",
        "s": "Arak är en stark dryck.",
        "st": "العرق مشروب قوي."
    },
    {
        "w": "ARENA",
        "t": "حلبة / ملعب",
        "s": "En stor arena.",
        "st": "ملعب كبير."
    },
    {
        "w": "ARG",
        "t": "غاضب",
        "s": "Han var mycket arg på sin bror.",
        "st": "كان غاضباً جداً من أخيه."
    },
    {
        "w": "ARK",
        "t": "فلك / ورقة",
        "s": "Noas ark räddade djuren.",
        "st": "فلك نوح أنقذ الحيوانات."
    },
    {
        "w": "ARKIV",
        "t": "أرشيف",
        "s": "Dokumenten finns i vårt arkiv.",
        "st": "الوثائق موجودة في أرشيفنا."
    },
    {
        "w": "ARM",
        "t": "ذراع",
        "s": "Han bröt sin arm.",
        "st": "كسر ذراعه."
    },
    {
        "w": "ÄRM",
        "t": "كم",
        "s": "Ärmen är för lång.",
        "st": "الكم طويل جداً."
    },
    {
        "w": "ÄRRA",
        "t": "ندبة",
        "s": "Han har ett ärra på kinden.",
        "st": "لديه ندبة."
    },
    {
        "w": "ARREST",
        "t": "توقيف / سجن",
        "s": "Han sattes i arrest.",
        "st": "وضع في التوقيف."
    },
    {
        "w": "ÄRRIG",
        "t": "مندوب",
        "s": "Ärrig.",
        "st": "مندوب."
    },
    {
        "w": "ART",
        "t": "نوع",
        "s": "Detta är en sällsynt art.",
        "st": "هذا نوع نادر."
    },
    {
        "w": "ÄRT",
        "t": "بازلاء",
        "s": "Prinsessan kunde känna en liten ärt.",
        "st": "استطاعت الأميرة أن تشعر بحبة بازلاء صغيرة."
    },
    {
        "w": "ARTA",
        "t": "تتطور",
        "s": "Det verkar arta sig väl.",
        "st": "يبدو أن الأمور تتطور بشكل جيد."
    },
    {
        "w": "ÄRTA",
        "t": "يغيظ",
        "s": "Sluta ärta honom.",
        "st": "توقف عن إغاظته."
    },
    {
        "w": "ARTEN",
        "t": "النوع (بيولوجي)",
        "s": "Arten är fridlyst.",
        "st": "النوع محمي."
    },
    {
        "w": "ARTER",
        "t": "أنواع",
        "s": "Många arter av fåglar.",
        "st": "أنواع كثيرة من الطيور."
    },
    {
        "w": "ÄRTER",
        "t": "بازلاء",
        "s": "Gröna ärter är gott.",
        "st": "البازلاء الخضراء لذيذة."
    },
    {
        "w": "ÄRTOR",
        "t": "بازلاء",
        "s": "Gröna ärtor.",
        "st": "بازلاء خضراء."
    },
    {
        "w": "ARV",
        "t": "إرث",
        "s": "Detta är ett viktigt kulturellt arv.",
        "st": "هذا إرث ثقافي مهم."
    },
    {
        "w": "ARVET",
        "t": "الإرث (المعرف)",
        "s": "Arvet efter farfar var mycket stort.",
        "st": "كان إرث الجد كبيراً جداً."
    },
    {
        "w": "AS",
        "t": "جيفة",
        "s": "Det luktar as.",
        "st": "رائحة كريهة."
    },
    {
        "w": "ASK",
        "t": "شجرة الدردار / علبة",
        "s": "En liten ask tändstickor låg på bordet.",
        "st": "كانت هناك علبة كبريت صغيرة على الطاولة."
    },
    {
        "w": "ÅSKA",
        "t": "رعد",
        "s": "Vi hörde åska och såg blixtar.",
        "st": "سمعنا الرعد ورأينا البرق."
    },
    {
        "w": "ÅSNA",
        "t": "حمار",
        "s": "Åsnan är envis.",
        "st": "الحمار عنيد."
    },
    {
        "w": "ASP",
        "t": "حور رجراج",
        "s": "Löven på en asp darrar.",
        "st": "أوراق الحور الرجراج ترتجف."
    },
    {
        "w": "ASS",
        "t": "رسالة مُسجلة",
        "s": "rek och ass",
        "st": "مُسجل ومضمون"
    },
    {
        "w": "ASTER",
        "t": "زهرة النجمة",
        "s": "En vacker lila aster.",
        "st": "زهرة نجمة أرجوانية جميلة."
    },
    {
        "w": "ÅT",
        "t": "أكل/تجاه",
        "s": "Han åt ett äpple.",
        "st": "أكل الطعام."
    },
    {
        "w": "ÄTA",
        "t": "يأكل",
        "s": "Vi ska äta middag nu.",
        "st": "نحن نأكل العشاء الآن."
    },
    {
        "w": "ÅTAL",
        "t": "اتهام / مقاضاة",
        "s": "Åklagaren väckte åtal mot mannen.",
        "st": "وجه المدعي العام اتهاماً للرجل."
    },
    {
        "w": "ÄTER",
        "t": "يأكل",
        "s": "Han äter en stor smörgås nu.",
        "st": "هو يأكل شطيرة كبيرة الآن."
    },
    {
        "w": "ATLAS",
        "t": "أطلس",
        "s": "Jag hittade landet in min atlas.",
        "st": "وجدت البلد في أطلسي."
    },
    {
        "w": "ATP",
        "t": "التقاعد الإضافي العام",
        "s": "ATP - poäng",
        "st": "اسم"
    },
    {
        "w": "ATT",
        "t": "أن",
        "s": "Det är viktigt att tala sanning.",
        "st": "من المهم قول الحقيقة."
    },
    {
        "w": "ÄTT",
        "t": "سلالة",
        "s": "Han tillhör en gammal kunglig ätt.",
        "st": "هو ينتمي إلى سلالة ملكية قديمة."
    },
    {
        "w": "ÄTTA",
        "t": "سلالة/رقم ثمانية",
        "s": "Han tillhör en kunglig ätta.",
        "st": "من سلالة ملكية."
    },
    {
        "w": "AV",
        "t": "من / عن",
        "s": "En bok av mig.",
        "st": "كتاب من تأليفي."
    },
    {
        "w": "ÄVENTYR",
        "t": "مغامرة",
        "s": "Livet är ett äventyr.",
        "st": "الحياة مغامرة."
    },
    {
        "w": "AVOG",
        "t": "عدواني",
        "s": "en avog inställning till allt nytt",
        "st": "موقف عدواني تجاه كل جديد"
    },
    {
        "w": "AVTAL",
        "t": "اتفاقية",
        "s": "Vi skrev på ett avtal.",
        "st": "وقعنا اتفاقية."
    },
    {
        "w": "ÄXA",
        "t": "يذم / ينتقد",
        "s": "Ulla äxar sin rival.",
        "st": "أولا تنتقد منافستها."
    },
    {
        "w": "BADA",
        "t": "يستحم",
        "s": "Jag vill bada bastu.",
        "st": "أريد الاستحمام في الساونا."
    },
    {
        "w": "BADAR",
        "t": "يستحم / يسبح",
        "s": "Barnen badar i sjön.",
        "st": "الأطفال يسبحون في البحيرة."
    },
    {
        "w": "BADRUM",
        "t": "حمام",
        "s": "Jag tvättar mig i badrummet.",
        "st": "أغسل وجهي في الحمام."
    },
    {
        "w": "BAK",
        "t": "في الخلف",
        "s": "de satt längst bak i salen",
        "st": "جلسوا في آخر القاعة"
    },
    {
        "w": "BAKA",
        "t": "يخبز",
        "s": "Vi ska baka en tårta.",
        "st": "سنخبز كعكة."
    },
    {
        "w": "BAKAR",
        "t": "يخبز (صيغة المضارع)",
        "s": "Hon bakar bröd varje dag.",
        "st": "هي تخبز الخبز كل يوم."
    },
    {
        "w": "BÅL",
        "t": "جذع",
        "s": "Han har en stark bål.",
        "st": "لديه جذع قوي."
    },
    {
        "w": "BALK",
        "t": "عارضة",
        "s": "Taket bars upp av en stor balk.",
        "st": "السقف كان محمولاً بعارضة كبيرة."
    },
    {
        "w": "BALKONG",
        "t": "شرفة",
        "s": "Vi har blommor på vår balkong.",
        "st": "لدينا زهور في شرفتنا."
    },
    {
        "w": "BANA",
        "t": "مسار",
        "s": "Följ din egen bana.",
        "st": "اتبع مسارك الخاص."
    },
    {
        "w": "BANAN",
        "t": "موزة",
        "s": "Apor gillar att äta bananer.",
        "st": "القرود تحب أكل الموز."
    },
    {
        "w": "BANN",
        "t": "حرمان",
        "s": "Han lyste i bann.",
        "st": "لقد حرم كنسياً."
    },
    {
        "w": "BAR",
        "t": "عارٍ",
        "s": "sova under bar himmel",
        "st": "نام تحت السماء المكشوفة"
    },
    {
        "w": "BÄR",
        "t": "توت",
        "s": "Skogen är full av blå bär.",
        "st": "الغابة مليئة بالتوت الأزرق."
    },
    {
        "w": "BARA",
        "t": "فقط",
        "s": "Jag vill bara ha vatten.",
        "st": "أريد ماء فقط."
    },
    {
        "w": "BÄREN",
        "t": "التوت",
        "s": "Alla bären är mogna och söta.",
        "st": "جميع التوت ناضج وحلو."
    },
    {
        "w": "BARN",
        "t": "طفل",
        "s": "bli med barn passa barn",
        "st": "حملت لاحظ طفلاً"
    },
    {
        "w": "BARS",
        "t": "حُمل",
        "s": "Han bars ut på bår efter olyckan.",
        "st": "حُمل على نقالة بعد الحادث."
    },
    {
        "w": "BASAR",
        "t": "قواعد / أسواق",
        "s": "Vi besökte en basar.",
        "st": "زرنا بازاراً."
    },
    {
        "w": "BÅT",
        "t": "قارب",
        "s": "Vi har en båt på havet.",
        "st": "لدينا قارب على البحر."
    },
    {
        "w": "BÅTAR",
        "t": "قوارب",
        "s": "Vi ser många båtar.",
        "st": "نرى العديد من القوارب."
    },
    {
        "w": "BED",
        "t": "صلاة",
        "s": "Bönen är en bed till Gud.",
        "st": "الصلاة دعاء إلى الله."
    },
    {
        "w": "BEDER",
        "t": "صلوات",
        "s": "Hon gör sina beder dagligen.",
        "st": "تؤدي صلواتها يومياً."
    },
    {
        "w": "BEN",
        "t": "عظم / ساق",
        "s": "Hunden gnager på ett stort ben.",
        "st": "الكلب يقضم عظماً كبيراً."
    },
    {
        "w": "BENIG",
        "t": "نحيل",
        "s": "mager och benig",
        "st": "نحيل وهزيل"
    },
    {
        "w": "BER",
        "t": "يصلي / يطلب",
        "s": "Hon ber om ursäkt för misstaget.",
        "st": "هي تعتذر عن الخطأ."
    },
    {
        "w": "BERG",
        "t": "جبل",
        "s": "Vi besteg ett högt berg.",
        "st": "تسلقنا جبلاً عالياً."
    },
    {
        "w": "BERGET",
        "t": "الجبل",
        "s": "Vi besteg det höga berget tillsammans.",
        "st": "تسلقنا الجبل العالي معاً."
    },
    {
        "w": "BERÖM",
        "t": "مدح",
        "s": "Han fick beröm för sitt goda arbete.",
        "st": "تلقى المديح على عمله الجيد."
    },
    {
        "w": "BESK",
        "t": "مُرّ",
        "s": "besk smak beska kommentarer",
        "st": "مذاق مر تعليقات مريرة"
    },
    {
        "w": "BEVIS",
        "t": "دليل / إثبات",
        "s": "Polisen har hittat nya bevis.",
        "st": "وجدت الشرطة أدلة جديدة."
    },
    {
        "w": "BIFF",
        "t": "شريحة لحم",
        "s": "En saftig biff.",
        "st": "شريحة لحم عصارية."
    },
    {
        "w": "BIL",
        "t": "سيارة",
        "s": "Min bil är på verkstaden.",
        "st": "سيارتي في الورشة."
    },
    {
        "w": "BILA",
        "t": "يسافر بالسيارة",
        "s": "Vi ska bila i Europa.",
        "st": "سنسافر بالسيارة في أوروبا."
    },
    {
        "w": "BILAR",
        "t": "سيارات",
        "s": "Det finns många bilar på vägen.",
        "st": "هناك العديد من السيارات على الطريق."
    },
    {
        "w": "BILD",
        "t": "صورة",
        "s": "En fin bild på väggen.",
        "st": "صورة جميلة على الحائط."
    },
    {
        "w": "BILIST",
        "t": "سائق",
        "s": "Varje bilist måste vara uppmärksam.",
        "st": "يجب على كل سائق أن يكون منتبهاً."
    },
    {
        "w": "BILJETT",
        "t": "تذكرة",
        "s": "Jag har köpt en biljett till tåget.",
        "st": "اشتريت تذكرة للقطار."
    },
    {
        "w": "BJÖRK",
        "t": "شجرة البتولا",
        "s": "Björken har en vit stam.",
        "st": "شجرة البتولا لها جذع أبيض."
    },
    {
        "w": "BJÖRN",
        "t": "دب",
        "s": "Björnen sover i idet.",
        "st": "الدب ينام في السبات."
    },
    {
        "w": "BJÖRNBÄR",
        "t": "توت العليق الأسود",
        "s": "Svarta björnbär.",
        "st": "توت عليق أسود."
    },
    {
        "w": "BLÅBÄR",
        "t": "توت أزرق",
        "s": "Vi plockar blåbär i skogen.",
        "st": "نقطف التوت الأزرق في الغابة."
    },
    {
        "w": "BLAD",
        "t": "ورقة شجر",
        "s": "Trädens blad faller på hösten.",
        "st": "ورقة الشجر خضراء."
    },
    {
        "w": "BLI",
        "t": "يصبح",
        "s": "Det kommer bli bra.",
        "st": "سأصبح طبيباً."
    },
    {
        "w": "BLOCK",
        "t": "دفتر / كتلة",
        "s": "Jag skriver anteckningar i mitt block.",
        "st": "أكتب ملاحظات في دفتري."
    },
    {
        "w": "BLOD",
        "t": "دم",
        "s": "Blod är rött.",
        "st": "الدم أحمر."
    },
    {
        "w": "BLODIG",
        "t": "دَمَوي",
        "s": "Biffen var blodig.",
        "st": "شريحة اللحم كانت نيئة."
    },
    {
        "w": "BOD",
        "t": "كوخ",
        "s": "Vi har en bod på gården.",
        "st": "لدينا كوخ في الفناء."
    },
    {
        "w": "BOK",
        "t": "كتاب",
        "s": "Jag läser en spännande bok just nu.",
        "st": "أقرأ كتاباً مشوقاً الآن."
    },
    {
        "w": "BOKA",
        "t": "يحجز",
        "s": "Jag ska boka ett hotellrum.",
        "st": "سأحجز غرفة في فندق."
    },
    {
        "w": "BOKAS",
        "t": "يُحجز",
        "s": "Biljetterna måste bokas i förväg.",
        "st": "يجب حجز التذاكر مسبقاً."
    },
    {
        "w": "BÖLA",
        "t": "خار / بكى بصوت عال",
        "s": "Kalven började böla efter sin mamma.",
        "st": "بدأ العجل يخور طلباً لأمه."
    },
    {
        "w": "BÖLJA",
        "t": "موجة / تموج",
        "s": "En bölja av värme kom emot oss.",
        "st": "موجة من الحرارة جاءت نحونا."
    },
    {
        "w": "BÖN",
        "t": "صلاة",
        "s": "Hon bad en bön.",
        "st": "صلت صلاة."
    },
    {
        "w": "BÖNER",
        "t": "صلوات",
        "s": "Han läser sina böner fem gånger om dagen.",
        "st": "يقرأ صلواته خمس مرات في اليوم."
    },
    {
        "w": "BOR",
        "t": "يسكن",
        "s": "Var bor du någonstans?",
        "st": "أين تسكن؟"
    },
    {
        "w": "BÖR",
        "t": "ينبغي",
        "s": "Du bör äta mer grönsaker.",
        "st": "ينبغي عليك أكل المزيد من الخضروات."
    },
    {
        "w": "BORD",
        "t": "طاولة",
        "s": "Maten står på bordet.",
        "st": "الطعام على الطاولة."
    },
    {
        "w": "BORST",
        "t": "شعيرات (فرشاة)",
        "s": "Borsten på penseln är hårda.",
        "st": "شعيرات الفرشاة قاسية."
    },
    {
        "w": "BORSTA",
        "t": "يفرش / ينظف بالفرشاة",
        "s": "Kom ihåg att borsta tänderna.",
        "st": "تذكر أن تفرش أسنانك."
    },
    {
        "w": "BORT",
        "t": "بعيداً",
        "s": "Gå bort härifrån!",
        "st": "اذهب بعيداً من هنا!"
    },
    {
        "w": "BOT",
        "t": "غرامة / علاج",
        "s": "Han fick betala en stor bot.",
        "st": "اضطر لدفع غرامة كبيرة."
    },
    {
        "w": "BÖT",
        "t": "غرم / كفر",
        "s": "Han böt för sina synder.",
        "st": "كفر عن ذنوبه."
    },
    {
        "w": "BÖTER",
        "t": "غرامات",
        "s": "Han fick betala dyra böter.",
        "st": "اضطر لدفع غرامات باهظة."
    },
    {
        "w": "BOTT",
        "t": "سكن",
        "s": "Jag har bott här i hela mitt liv.",
        "st": "لقد عشت هنا طوال حياتي."
    },
    {
        "w": "BRAS",
        "t": "نار",
        "s": "Vi tände en bras i öppna spisen.",
        "st": "أشعلنا ناراً في المدفأة."
    },
    {
        "w": "BRE",
        "t": "يدهن",
        "s": "Bre smör på brödet.",
        "st": "ادهن الزبدة على الخبز."
    },
    {
        "w": "BRO",
        "t": "جسر",
        "s": "Vi promenerade över den gamla bron.",
        "st": "مشينا فوق الجسر القديم."
    },
    {
        "w": "BRÖD",
        "t": "خبز",
        "s": "Färskt bröd doftar gott.",
        "st": "الخبز الطازج له رائحة طيبة."
    },
    {
        "w": "BRODER",
        "t": "أخ (رسمي)",
        "s": "Han är min broder.",
        "st": "هو أخي."
    },
    {
        "w": "BROR",
        "t": "أخ",
        "s": "Min bror leker med mig.",
        "st": "أخي يلعب معي."
    },
    {
        "w": "BRÖST",
        "t": "صدر",
        "s": "mamman gav babyn bröstet",
        "st": "أرضعت الأم طفلها"
    },
    {
        "w": "BROTT",
        "t": "جريمة",
        "s": "Stöld är ett brott.",
        "st": "السرقة جريمة."
    },
    {
        "w": "BRUKA",
        "t": "يفلح",
        "s": "Man måste bruka jorden för att skörda.",
        "st": "يجب فلاحة الأرض للحصول على الحصاد."
    },
    {
        "w": "BRUSA",
        "t": "يفور / يهدر",
        "s": "Vattnet började brusa.",
        "st": "بدأ الماء بالفوران."
    },
    {
        "w": "BULLAR",
        "t": "كعك",
        "s": "Nygräddade bullar.",
        "st": "كعك طازج."
    },
    {
        "w": "BUR",
        "t": "قفص",
        "s": "Fågeln i sin bur.",
        "st": "الطائر في قفصه."
    },
    {
        "w": "BURAR",
        "t": "أقفاص",
        "s": "Fåglar i burar.",
        "st": "طيور في أقفاص."
    },
    {
        "w": "BUS",
        "t": "شقاوة / مزاح",
        "s": "Det var bara på bus.",
        "st": "كان ذلك مجرد مزاح."
    },
    {
        "w": "BUSKAR",
        "t": "شجيرات",
        "s": "Katten gömde sig i buskarna.",
        "st": "اختبأت القطة بين الشجيرات."
    },
    {
        "w": "BUSS",
        "t": "حافلة",
        "s": "Bussen är sen idag.",
        "st": "الحافلة متأخرة اليوم."
    },
    {
        "w": "BUSSAR",
        "t": "حافلات",
        "s": "Många bussar går till centrum.",
        "st": "العديد من الحافلات تذهب إلى المركز."
    },
    {
        "w": "BYGG",
        "t": "بناء",
        "s": "Detta är ett stabilt bygg.",
        "st": "هذا بناء مستقر."
    },
    {
        "w": "BYGGA",
        "t": "يبني",
        "s": "Vi ska bygga ett nytt hus.",
        "st": "سنبني منزلاً جديداً."
    },
    {
        "w": "CHEF",
        "t": "رئيس العمل",
        "s": "Min chef är mycket snäll.",
        "st": "رئيسي في العمل لطيف جداً."
    },
    {
        "w": "CIRKUS",
        "t": "السيرك",
        "s": "Vi gick på cirkus.",
        "st": "ذهبنا إلى السيرك."
    },
    {
        "w": "CYKEL",
        "t": "دراجة",
        "s": "Det är nyttigt att cykla.",
        "st": "من المفيد ركوب الدراجة."
    },
    {
        "w": "DÅ",
        "t": "حينئذ",
        "s": "Jag var liten då.",
        "st": "كنت صغيراً حينها."
    },
    {
        "w": "DÄCK",
        "t": "إطار / سطح سفينة",
        "s": "Vi måste byta däck på bilen.",
        "st": "يجب أن نغير إطارات السيارة."
    },
    {
        "w": "DAG",
        "t": "يوم",
        "s": "Det är en vacker dag idag.",
        "st": "إنه يوم جميل اليوم."
    },
    {
        "w": "DAL",
        "t": "وادي",
        "s": "Huset ligger i en grön dal.",
        "st": "يقع المنزل في وادي أخضر."
    },
    {
        "w": "DALA",
        "t": "يهبط",
        "s": "Vi såg solen dala ner i havet.",
        "st": "رأينا الشمس تغرب في البحر."
    },
    {
        "w": "DALAR",
        "t": "وديان",
        "s": "Vi vandrade över berg och dal.",
        "st": "تجولنا عبر الجبال والوديان."
    },
    {
        "w": "DAMER",
        "t": "سيدات",
        "s": "Mina damer och herrar.",
        "st": "سيداتي وسادتي."
    },
    {
        "w": "DAN",
        "t": "اليوم (عامية)",
        "s": "Hela dan.",
        "st": "طوال اليوم."
    },
    {
        "w": "DANS",
        "t": "رقص",
        "s": "Får jag lov till en dans?",
        "st": "هل تسمحين لي برقصة؟"
    },
    {
        "w": "DÄRFÖR",
        "t": "لأن",
        "s": "Jag är sjuk, därför stannar jag.",
        "st": "أنا مريض، لذلك سأبقى."
    },
    {
        "w": "DARR",
        "t": "اهتزاز",
        "s": "med darr på rösten",
        "st": "بصوت مهتزّ"
    },
    {
        "w": "DASK",
        "t": "صفعة",
        "s": "dask i stjärten",
        "st": "صفعة على الكِفل"
    },
    {
        "w": "DASS",
        "t": "بيت خلاء",
        "s": "gå på dass",
        "st": "ذهب إلى بيت الخلاء"
    },
    {
        "w": "DATA",
        "t": "بيانات",
        "s": "Spara data.",
        "st": "احفظ البيانات."
    },
    {
        "w": "DATOR",
        "t": "حاسوب",
        "s": "Jag arbetar vid min dator.",
        "st": "أعمل على حاسوبي."
    },
    {
        "w": "DATORN",
        "t": "الحاسوب",
        "s": "Datorn är ny.",
        "st": "الحاسوب جديد."
    },
    {
        "w": "DEG",
        "t": "عجين",
        "s": "Baka en deg.",
        "st": "اخبز عجيناً."
    },
    {
        "w": "DEL",
        "t": "جزء",
        "s": "En del av kakan.",
        "st": "جزء من الكعكة."
    },
    {
        "w": "DELAR",
        "t": "أجزاء",
        "s": "Delar.",
        "st": "أجزاء."
    },
    {
        "w": "DELTID",
        "t": "جزء من الوقت",
        "s": "arbeta på deltid",
        "st": "عمل عملاً جزئياً"
    },
    {
        "w": "DELVIS",
        "t": "جزئياً",
        "s": "svaret är bara delvis rätt",
        "st": "الإجابة صحيحة جزئياً فقط"
    },
    {
        "w": "DEN",
        "t": "الـ / ذلك",
        "s": "Den boken är bra.",
        "st": "ذلك الكتاب جيد."
    },
    {
        "w": "DENAR",
        "t": "دينار",
        "s": "En denar.",
        "st": "دينار."
    },
    {
        "w": "DENNA",
        "t": "هذا, هذه",
        "s": "denna dag detta hus dessa böcker",
        "st": "هذا اليوم هذا البيت هذه الكتب"
    },
    {
        "w": "DERAS",
        "t": "لهم",
        "s": "Det är deras ansvar att lösa detta.",
        "st": "إنها مسؤوليتهم لحل هذا الأمر."
    },
    {
        "w": "DIG",
        "t": "أنت (مفعول)",
        "s": "Jag älskar dig.",
        "st": "أنا أحبك."
    },
    {
        "w": "DIGER",
        "t": "ضخم",
        "s": "en diger lunta",
        "st": "رزمة ضخمة من الأوراق"
    },
    {
        "w": "DIKE",
        "t": "خندق",
        "s": "köra i diket",
        "st": "ساق السيارة في الخندق"
    },
    {
        "w": "DIN",
        "t": "لك",
        "s": "Är det din bok?",
        "st": "هل هذا كتابك؟"
    },
    {
        "w": "DINGA",
        "t": "يتأرجح",
        "s": "Sitta och dinga med benen.",
        "st": "الجلوس وأرجحة الساقين."
    },
    {
        "w": "DINGLA",
        "t": "يتدلى",
        "s": "Benen dingla från stolen.",
        "st": "الساقان تتدليان من الكرسي."
    },
    {
        "w": "DIREKT",
        "t": "مباشر",
        "s": "direkt demokrati direkta ledningar",
        "st": "ديموقراطية مباشرة خطوط مباشرة"
    },
    {
        "w": "DIT",
        "t": "إلى هناك",
        "s": "Vi ska åka dit imorgon bitti.",
        "st": "سنذهب إلى هناك صباح الغد."
    },
    {
        "w": "DJUNGEL",
        "t": "أدغال",
        "s": "Tigern bor i djungeln.",
        "st": "يعيش النمر في الأدغال."
    },
    {
        "w": "DJUREN",
        "t": "الحيوانات",
        "s": "Djuren lever i skogen.",
        "st": "الحيوانات في الغابة."
    },
    {
        "w": "DNA",
        "t": "حمض نووي",
        "s": "DNA finns i alla celler.",
        "st": "الحمض النووي موجود في كل الخلايا."
    },
    {
        "w": "DÖ",
        "t": "يموت",
        "s": "Blommor dör utan vatten.",
        "st": "الأزهار تموت بلا ماء."
    },
    {
        "w": "DOM",
        "t": "حكم / قبة",
        "s": "Domstolen avkunnade sin dom.",
        "st": "أصدرت المحكمة حكمها."
    },
    {
        "w": "DOMAR",
        "t": "أحكام",
        "s": "Hårda domar.",
        "st": "أحكام قاسية."
    },
    {
        "w": "DOMARE",
        "t": "قاضي",
        "s": "En rättvis domare.",
        "st": "قاض عادل."
    },
    {
        "w": "DOMS",
        "t": "حكم",
        "s": "Doms.",
        "st": "حكم."
    },
    {
        "w": "DOMSTOL",
        "t": "محكمة",
        "s": "Målet togs upp i domstol.",
        "st": "نظرت القضية في المحكمة."
    },
    {
        "w": "DOPP",
        "t": "غَطْس",
        "s": "ta ( sig ) ett dopp",
        "st": "غَطَس , سبح"
    },
    {
        "w": "DÖR",
        "t": "يموت",
        "s": "Blomman dör utan vatten.",
        "st": "الزهرة تموت بدون ماء."
    },
    {
        "w": "DÖRR",
        "t": "باب",
        "s": "Stäng dörren, det drar kallt.",
        "st": "أغلق الباب، هناك تيار هواء بارد."
    },
    {
        "w": "DÖRRAR",
        "t": "أبواب",
        "s": "Vi håller alla dörrar öppna för dig.",
        "st": "نحن نبقي جميع الأبواب مفتوحة لك."
    },
    {
        "w": "DOTTER",
        "t": "ابنة",
        "s": "Hon är en smart dotter.",
        "st": "هي ابنة ذكية."
    },
    {
        "w": "DRAG",
        "t": "سحبة",
        "s": "Han gjorde ett smart drag i schack.",
        "st": "قام بحركة ذكية في الشطرنج."
    },
    {
        "w": "DRAGON",
        "t": "طرخون (عشب)",
        "s": "Dragon passar bra till kyckling.",
        "st": "الطرخون يناسب الدجاج جيداً."
    },
    {
        "w": "DRIVA",
        "t": "ينجرف / يدير",
        "s": "Vinden får båten att driva iväg.",
        "st": "الرياح تجعل القارب ينجرف بعيداً."
    },
    {
        "w": "DROPPAR",
        "t": "يُنَقّط",
        "s": "det droppar från taket",
        "st": "تساقطت القطرات من السقف"
    },
    {
        "w": "DU",
        "t": "أنت",
        "s": "Du är min bästa vän.",
        "st": "أنت صديقي المفضل."
    },
    {
        "w": "DUA",
        "t": "دعاء",
        "s": "Vi ber en dua för fred.",
        "st": "ندعو دعاءً من أجل السلام."
    },
    {
        "w": "DUG",
        "t": "كفاءة / رذاذ (شكل نادر)",
        "s": "Han har ingen dug till arbetet.",
        "st": "ليس لديه كفاءة للعمل."
    },
    {
        "w": "DUK",
        "t": "مفرش",
        "s": "En vit duk på bordet.",
        "st": "مفرش أبيض على الطاولة."
    },
    {
        "w": "DUNST",
        "t": "بخار",
        "s": "En dunst av parfym kändes.",
        "st": "شوهدت سحابة من العطر."
    },
    {
        "w": "DURK",
        "t": "أرضية القارب",
        "s": "Vattnet skvalpade på durken.",
        "st": "تناثر الماء على أرضية القارب."
    },
    {
        "w": "DUSCH",
        "t": "دش",
        "s": "Jag tar en varm dusch.",
        "st": "آخذ دشاً دافئاً."
    },
    {
        "w": "DYR",
        "t": "غالي",
        "s": "Bilen var för dyr.",
        "st": "السيارة كانت غالية جداً."
    },
    {
        "w": "DYRA",
        "t": "غالية (جمع)",
        "s": "Kläderna är mycket dyra.",
        "st": "الملابس غالية جداً."
    },
    {
        "w": "EDER",
        "t": "لكم (قديم) / قسم",
        "s": "Jag svär en helig ed.",
        "st": "أقسم قسماً مقدساً."
    },
    {
        "w": "EK",
        "t": "شجرة بلوط",
        "s": "Eken är ett starkt träd.",
        "st": "شجرة البلوط قوية."
    },
    {
        "w": "EKA",
        "t": "قارب",
        "s": "Vi rodde ut i en eka.",
        "st": "جدفنا بقارب صغير."
    },
    {
        "w": "EKAR",
        "t": "أصداء",
        "s": "Skogen ekar av rop.",
        "st": "الغابة تتردد فيها الأصداء."
    },
    {
        "w": "EL",
        "t": "كهرباء",
        "s": "Vi behöver el till lampan.",
        "st": "نحتاج الكهرباء للمصباح."
    },
    {
        "w": "ELEV",
        "t": "تلميذ",
        "s": "En new elev började in klassen.",
        "st": "بدأ تلميذ جديد في الصف."
    },
    {
        "w": "ELIT",
        "t": "نُخبة",
        "s": "han tillhör eliten i svensk idrott",
        "st": "إنه من النخبة في مجال الرياضة في السويد"
    },
    {
        "w": "EN",
        "t": "واحد / شجرة عرعر",
        "s": "En fågel.",
        "st": "طائر واحد."
    },
    {
        "w": "ENA",
        "t": "يوحد",
        "s": "Vi måste ena oss för att lyckas.",
        "st": "يجب أن نتحد لننجح."
    },
    {
        "w": "ENAR",
        "t": "أشجار العرعر",
        "s": "Det växer enar på backen.",
        "st": "تنمو أشجار العرعر على التل."
    },
    {
        "w": "ENERGI",
        "t": "طاقة",
        "s": "Solenergi är bra.",
        "st": "الطاقة الشمسية جيدة."
    },
    {
        "w": "ENIG",
        "t": "مُجمِع",
        "s": "man var rörande enig om beslutet",
        "st": "كان الجميع متفقين حول القرار بصورة مؤثّرة"
    },
    {
        "w": "ENLIGT",
        "t": "حَسَب",
        "s": "enligt alla beräkningar",
        "st": "حَسَب جميع الحسابات"
    },
    {
        "w": "ER",
        "t": "أنتم / لكم",
        "s": "Boken tillhör er.",
        "st": "الكتاب ملك لكم."
    },
    {
        "w": "ETT",
        "t": "واحد",
        "s": "Ett äpple om dagen är nyttigt.",
        "st": "تفاحة في اليوم مفيدة."
    },
    {
        "w": "FÅ",
        "t": "قليل/يحصل",
        "s": "Jag fick en present.",
        "st": "حصلت على هدية."
    },
    {
        "w": "FALSK",
        "t": "زائف",
        "s": "Det där skrattet låter väldigt falskt.",
        "st": "تلك الضحكة تبدو مصطنعة جداً."
    },
    {
        "w": "FALUKORV",
        "t": "سجق فالو",
        "s": "Falukorv i ugn.",
        "st": "سجق فالو في الفرن."
    },
    {
        "w": "FAMILJ",
        "t": "عائلة",
        "s": "Jag älskar min familj.",
        "st": "أحب عائلتي."
    },
    {
        "w": "FAMILJEN",
        "t": "العائلة",
        "s": "Hela familjen är samlad.",
        "st": "العائلة مجتمعة."
    },
    {
        "w": "FANA",
        "t": "راية / علم",
        "s": "De bar en fana in tåget.",
        "st": "حملوا راية في الموكب."
    },
    {
        "w": "FÅNGA",
        "t": "يمسك",
        "s": "Försök fånga bollen.",
        "st": "حاول الإمساك بالكرة."
    },
    {
        "w": "FÅNGAR",
        "t": "سجناء / يمسك",
        "s": "Fångarna rymde från fängelset.",
        "st": "هرب السجناء من السجن."
    },
    {
        "w": "FANS",
        "t": "معجبين",
        "s": "Bandet har många hängivna fans.",
        "st": "الفرقة لديها العديد من المعجبين المخلصين."
    },
    {
        "w": "FAR",
        "t": "أب",
        "s": "Min far arbetar hårt.",
        "st": "أبي يعمل بجد."
    },
    {
        "w": "FÅR",
        "t": "خروف",
        "s": "svart får ( misslyckad person )",
        "st": "شخص فاشل"
    },
    {
        "w": "FÄRD",
        "t": "رحلة",
        "s": "Vi tar en färd till Oslo.",
        "st": "نأخذ رحلة إلى أوسلو."
    },
    {
        "w": "FÄRDE",
        "t": "خطر",
        "s": "Nu är det fara å färde.",
        "st": "الآن هناك خطر محدق."
    },
    {
        "w": "FÄRDEN",
        "t": "الرحلة",
        "s": "Färden mot norr var mycket kall.",
        "st": "كانت الرحلة نحو الشمال باردة جداً."
    },
    {
        "w": "FÄRJA",
        "t": "عبّارة",
        "s": "Vi tog färjan över havet.",
        "st": "أخذنا العبارة عبر البحر."
    },
    {
        "w": "FARMOR",
        "t": "جدة (أم الأب)",
        "s": "Farmor bakar bullar.",
        "st": "جدتي تخبز كعكاً."
    },
    {
        "w": "FÄRS",
        "t": "مفروم",
        "s": "Stek färsen i pannan.",
        "st": "اقلِ المفروم في المقلاة."
    },
    {
        "w": "FÄRSK",
        "t": "طازج",
        "s": "Färsk fisk är bäst.",
        "st": "السمك الطازج هو الأفضل."
    },
    {
        "w": "FART",
        "t": "سرعة",
        "s": "Det var full fart hela dagen.",
        "st": "كانت السرعة قصوى طوال اليوم."
    },
    {
        "w": "FARTYG",
        "t": "سفينة",
        "s": "Fartyget seglar på havet.",
        "st": "السفينة تبحر في البحر."
    },
    {
        "w": "FAS",
        "t": "مرحلة",
        "s": "Detta är projektets första fas.",
        "st": "هذه هي المرحلة الأولى للمشروع."
    },
    {
        "w": "FASA",
        "t": "رُعب, هَلَع",
        "s": "med avsky och fasa",
        "st": "ببغض و رُعب"
    },
    {
        "w": "FASAR",
        "t": "يخشى",
        "s": "Fasar för.",
        "st": "يخشى من."
    },
    {
        "w": "FAST",
        "t": "ثابت / عالق",
        "s": "Bilen sitter fast in den djupa snön.",
        "st": "السيارة عالقة في الثلج العميق."
    },
    {
        "w": "FASTA",
        "t": "صيام",
        "s": "Vi fastar under Ramadan.",
        "st": "نحن نصوم في رمضان."
    },
    {
        "w": "FAT",
        "t": "طبق / برميل",
        "s": "Lägg kakan på ett fat.",
        "st": "ضع الكعكة على طبق."
    },
    {
        "w": "FE",
        "t": "جنية",
        "s": "Som en god fe i sagan.",
        "st": "مثل جنية طيبة في الحكاية."
    },
    {
        "w": "FEBER",
        "t": "حمى",
        "s": "Barnet har hög feber.",
        "st": "الطفل لديه حمى عالية."
    },
    {
        "w": "FEST",
        "t": "حفلة",
        "s": "Vi ska ha fest på lördag.",
        "st": "سنقيم حفلة يوم السبت."
    },
    {
        "w": "FIK",
        "t": "مقهى",
        "s": "Vi sitter på ett mysigt fik.",
        "st": "نجلس في مقهى مريح."
    },
    {
        "w": "FIKA",
        "t": "استراحة قهوة",
        "s": "Vi ska fika tillsammans kl. 3.",
        "st": "سنأخذ استراحة قهوة معاً في الساعة 3."
    },
    {
        "w": "FIKAR",
        "t": "يشرب قهوة",
        "s": "Vi fikar ofta på jobbet.",
        "st": "غالباً ما نشرب القهوة في العمل."
    },
    {
        "w": "FIL",
        "t": "لبن",
        "s": "Jag tar en skål fil.",
        "st": "سآخذ وعاء من اللبن."
    },
    {
        "w": "FILMJÖLK",
        "t": "لبن رائب",
        "s": "Filmjölk med flingor.",
        "st": "لبن رائب مع رقائق الذرة."
    },
    {
        "w": "FIN",
        "t": "جميل",
        "s": "en fin bil en fin kostym",
        "st": "سيارة جميلة بدلة أنيقة"
    },
    {
        "w": "FISK",
        "t": "سمك",
        "s": "Vi äter färsk fisk till middag.",
        "st": "نأكل سمكاً طازجاً للعشاء."
    },
    {
        "w": "FISKA",
        "t": "يصطاد سمك",
        "s": "Att fiska är avkopplande.",
        "st": "صيد السمك مريح للأعصاب."
    },
    {
        "w": "FISKAR",
        "t": "أسماك",
        "s": "Det finns många fiskar i sjön.",
        "st": "يوجد الكثير من الأسماك في البحيرة."
    },
    {
        "w": "FJÄRR",
        "t": "بعيد",
        "s": "Väster är fjärran.",
        "st": "الغرب بعيد."
    },
    {
        "w": "FLASKA",
        "t": "زجاجة",
        "s": "Kan jag få en flaska vatten?",
        "st": "هل يمكنني الحصول على زجاجة ماء؟"
    },
    {
        "w": "FLOD",
        "t": "فيضان",
        "s": "Tidvattnet växlar mellan ebb och flod.",
        "st": "المد والجزر يتبادلان الأدوار."
    },
    {
        "w": "FLODEN",
        "t": "النهر",
        "s": "Floden rinner stilla genom staden.",
        "st": "النهر يجري بهدوء عبر المدينة."
    },
    {
        "w": "FLUGA",
        "t": "ربطة عنق / ذبابة",
        "s": "Han hade en röd fluga på festen.",
        "st": "كان يرتدي ربطة عنق حمراء في الحفل."
    },
    {
        "w": "FLYG",
        "t": "طيران / رحلة جوية",
        "s": "Vi tar flyget till Paris.",
        "st": "نأخذ الرحلة الجوية إلى باريس."
    },
    {
        "w": "FLYGPLAN",
        "t": "طائرة",
        "s": "Flygplanet är stort.",
        "st": "الطائرة كبيرة."
    },
    {
        "w": "FLYKT",
        "t": "هروب",
        "s": "Fångens flykt var dramatisk.",
        "st": "كان هروب السجين درامياً."
    },
    {
        "w": "FLYTT",
        "t": "انتقال",
        "s": "Vår flytt till den nya lägenheten gick bra.",
        "st": "انتقالنا إلى الشقة الجديدة سار بشكل جيد."
    },
    {
        "w": "FÖNSTER",
        "t": "نافذة",
        "s": "Titta ut genom fönstret.",
        "st": "انظر من خلال النافذة."
    },
    {
        "w": "FÖR",
        "t": "لأجل / جداً",
        "s": "Det är alldeles för varmt här.",
        "st": "الجو حار جداً هنا."
    },
    {
        "w": "FÖRE",
        "t": "قبل",
        "s": "Kom gärna lite före klockan åtta.",
        "st": "تعال من فضلك قبل الساعة الثامنة بقليل."
    },
    {
        "w": "FÖRST",
        "t": "أوّل",
        "s": "komma först i en tävling",
        "st": "احتل المركز الأول في مسابقة"
    },
    {
        "w": "FORT",
        "t": "بسرعة / حصن",
        "s": "Bilen körde mycket fort på vägen.",
        "st": "سارت السيارة بسرعة كبيرة على الطريق."
    },
    {
        "w": "FRAKT",
        "t": "شحن",
        "s": "Vad kostar frakten?",
        "st": "كم تكلف مصاريف الشحن؟"
    },
    {
        "w": "FRÄN",
        "t": "حادّ",
        "s": "frän kritik en frän lukt",
        "st": "نقد لاذع رائحة حادة"
    },
    {
        "w": "FRED",
        "t": "سلام",
        "s": "Vi hoppas på fred i hela världen.",
        "st": "نأمل في السلام في جميع أنحاء العالم."
    },
    {
        "w": "FRI",
        "t": "حر",
        "s": "Jag är fri nu.",
        "st": "أنا حر الآن."
    },
    {
        "w": "FRID",
        "t": "سلام / سكينة",
        "s": "Vila i frid.",
        "st": "ارقد بسلام."
    },
    {
        "w": "FRISK",
        "t": "صحي / طازج",
        "s": "Luften är frisk efter regnet.",
        "st": "الهواء منعش بعد المطر."
    },
    {
        "w": "FROST",
        "t": "صقيع",
        "s": "Det var vit frost på gräset i morse.",
        "st": "كان هناك صقيع أبيض على العشب هذا الصباح."
    },
    {
        "w": "FRUKOST",
        "t": "إفطار",
        "s": "Frukost är dagens viktigaste mål.",
        "st": "الإفطار هو أهم وجبة في اليوم."
    },
    {
        "w": "FRUKT",
        "t": "فاكهة",
        "s": "Ät mer frukt och grönt.",
        "st": "تناول المزيد من الفاكهة والخضروات."
    },
    {
        "w": "FUL",
        "t": "قبيح",
        "s": "Det var en ful fisk.",
        "st": "كانت سمكة قبيحة (تعبير مجازي عن شخص مشبوه)."
    },
    {
        "w": "GÅ",
        "t": "يمشي",
        "s": "Att gå hem.",
        "st": "يمشي ببطء."
    },
    {
        "w": "GABY",
        "t": "غابي",
        "s": "Gaby är ett namn på en person.",
        "st": "غابي هو اسم شخص."
    },
    {
        "w": "GAL",
        "t": "صاح",
        "s": "Tuppen gal.",
        "st": "صاح الديك."
    },
    {
        "w": "GALA",
        "t": "حفل",
        "s": "En fin gala.",
        "st": "حفل جميل."
    },
    {
        "w": "GALLA",
        "t": "مرارة",
        "s": "Galla.",
        "st": "مرارة."
    },
    {
        "w": "GÅR",
        "t": "الأمس",
        "s": "Tiden går fort.",
        "st": "الوقت يمضي بسرعة."
    },
    {
        "w": "GARDEROB",
        "t": "خزانة ملابس",
        "s": "Mina kläder hänger i garderoben.",
        "st": "ملابسي في الخزانة."
    },
    {
        "w": "GARDIN",
        "t": "ستارة",
        "s": "Dra för gardinen för fönstret.",
        "st": "أغلق الستارة أمام النافذة."
    },
    {
        "w": "GARN",
        "t": "غزل",
        "s": "Katten lekte med ett nystan av garn.",
        "st": "لعبت القطة بكرة من الغزل."
    },
    {
        "w": "GAS",
        "t": "دعاسة البنزين",
        "s": "giftiga gaser elda med gas",
        "st": "غازات سامة أشعل بالغاز"
    },
    {
        "w": "GÅS",
        "t": "إوزة",
        "s": "En vit gås simmar i dammen.",
        "st": "إوزة بيضاء تسبح في البركة."
    },
    {
        "w": "GATA",
        "t": "شارع",
        "s": "Barnen leker på en lugn gata.",
        "st": "الأطفال يلعبون في شارع هادئ."
    },
    {
        "w": "GAV",
        "t": "أعطى",
        "s": "Han gav mig en present.",
        "st": "أعطاني هدية."
    },
    {
        "w": "GE",
        "t": "يعطي",
        "s": "Ge mig boken.",
        "st": "أعطني الكتاب."
    },
    {
        "w": "GEL",
        "t": "جل",
        "s": "Han har gel i håret.",
        "st": "لديه جل في شعره."
    },
    {
        "w": "GELET",
        "t": "الجيل",
        "s": "Gelet.",
        "st": "الجيل."
    },
    {
        "w": "GEM",
        "t": "مشبك ورق",
        "s": "Fäst pappret med ett gem.",
        "st": "ثبت الورقة بمشبك."
    },
    {
        "w": "GEN",
        "t": "جين",
        "s": "Gener bestämmer vår ögonfärg.",
        "st": "الجينات تحدد لون عيوننا."
    },
    {
        "w": "GENOM",
        "t": "عبر / خلال",
        "s": "Vi gick en promenad genom skogen.",
        "st": "مشينا في نزهة عبر الغابة."
    },
    {
        "w": "GENRE",
        "t": "نوع",
        "s": "en ny genre inom måleriet",
        "st": "نوع جديد ضمن مجال الدهان"
    },
    {
        "w": "GENTIL",
        "t": "سخّي",
        "s": "ett gentilt erbjudande",
        "st": "عرض سخي"
    },
    {
        "w": "GENUIN",
        "t": "أصيل",
        "s": "en genuin göteborgare",
        "st": "من سكان يوتيبوري الأصليين"
    },
    {
        "w": "GER",
        "t": "يعطي",
        "s": "Solen ger oss ljus och värme.",
        "st": "الشمس تعطينا الضوء والدفء."
    },
    {
        "w": "GET",
        "t": "ماعز",
        "s": "En liten get bräkte i hagen.",
        "st": "ثغت ماعز صغيرة في المرعى."
    },
    {
        "w": "GILLE",
        "t": "وليمة / نقابة",
        "s": "Ett stort gille.",
        "st": "وليمة كبيرة."
    },
    {
        "w": "GLÄNTA",
        "t": "فسحة",
        "s": "En solig glänta i skogen.",
        "st": "فسحة مشمسة في الغابة."
    },
    {
        "w": "GLASS",
        "t": "آيس كريم",
        "s": "Glass är gott på sommaren.",
        "st": "الآيس كريم لذيذ في الصيف."
    },
    {
        "w": "GLIDA",
        "t": "ينزلق",
        "s": "Bilen kan glida på isen.",
        "st": "السيارة قد تنزلق على الجليد."
    },
    {
        "w": "GLOR",
        "t": "يُبَحلق",
        "s": "vad glor du på?",
        "st": "بماذا تبحلق؟"
    },
    {
        "w": "GÖR",
        "t": "يفعل",
        "s": "Vad gör du?",
        "st": "ماذا تفعل؟"
    },
    {
        "w": "GRAD",
        "t": "درجة",
        "s": "Det är bara en grad varmt ute.",
        "st": "درجة الحرارة درجة واحدة فقط في الخارج."
    },
    {
        "w": "GRÄLA",
        "t": "يتشاجر",
        "s": "Sluta gräla.",
        "st": "توقفوا عن الشجار."
    },
    {
        "w": "GRAN",
        "t": "شجرة التنوب",
        "s": "Vi klär granen till jul.",
        "st": "نزين شجرة التنوب لعيد الميلاد."
    },
    {
        "w": "GRANE",
        "t": "شجرة تنوب",
        "s": "En hög grane stod vid skogsbrynet.",
        "st": "وقفت شجرة تنوب عالية عند حافة الغابة."
    },
    {
        "w": "GRAV",
        "t": "قبر",
        "s": "Lägg blommor på graven.",
        "st": "ضع الزهور على القبر."
    },
    {
        "w": "GRAVID",
        "t": "حامل",
        "s": "Hon är gravid in femte månaden.",
        "st": "هي حامل في الشهر الخامس."
    },
    {
        "w": "GREN",
        "t": "غصن",
        "s": "Ett löv föll från grenen.",
        "st": "سقطت ورقة من الغصن."
    },
    {
        "w": "GRENA",
        "t": "تفرع",
        "s": "Vägen grenar sig längre fram.",
        "st": "الطريق يتفرع في الأمام."
    },
    {
        "w": "GRENAR",
        "t": "أغصان",
        "s": "Trädets grenar sträcker sig mot himlen.",
        "st": "تمتد أغصان الشجرة نحو السماء."
    },
    {
        "w": "GRIND",
        "t": "بوابة",
        "s": "Stäng grinden efter dig.",
        "st": "أغلق البوابة خلفك."
    },
    {
        "w": "GRODA",
        "t": "ضفدع",
        "s": "En grön groda.",
        "st": "ضفدع أخضر."
    },
    {
        "w": "GRODAN",
        "t": "الضفدع",
        "s": "Grodan hoppade i vattnet.",
        "st": "قفز الضفدع في الماء."
    },
    {
        "w": "GROLL",
        "t": "خُصومة",
        "s": "glömma gammalt groll",
        "st": "نَسِيَ الخصومة القديمة"
    },
    {
        "w": "GRÖNSAK",
        "t": "خضار",
        "s": "Ät dina grönsaker.",
        "st": "كل خضرواتك."
    },
    {
        "w": "GRÖT",
        "t": "عصيدة",
        "s": "Jag äter gröt till frukost varje dag.",
        "st": "آكل العصيدة للإفطار كل يوم."
    },
    {
        "w": "GRY",
        "t": "يبزغ (الفجر)",
        "s": "Dagen börjar gry.",
        "st": "بدأ النهار يبزغ."
    },
    {
        "w": "GUD",
        "t": "الله / إله",
        "s": "Gud är kärlek.",
        "st": "الله محبة."
    },
    {
        "w": "GUIDE",
        "t": "مرشد",
        "s": "Vi hade en bra guide.",
        "st": "كان لدينا مرشد جيد."
    },
    {
        "w": "GUL",
        "t": "أصفر",
        "s": "Solen är gul.",
        "st": "الشمس صفراء."
    },
    {
        "w": "GULD",
        "t": "ذهب",
        "s": "Rent guld.",
        "st": "ذهب خالص."
    },
    {
        "w": "GUNGA",
        "t": "أرجوحة / يتأرجح",
        "s": "Barnen gungar in parken.",
        "st": "الأطفال يتأرجحون في الحديقة."
    },
    {
        "w": "GYLF",
        "t": "خليج (قديمة)",
        "s": "Ett ord från fornnordiskan.",
        "st": "كلمة من الإسكندنافية القديمة."
    },
    {
        "w": "HA",
        "t": "يملك",
        "s": "Jag har en bok.",
        "st": "لدي كتاب."
    },
    {
        "w": "HAJJ",
        "t": "حج",
        "s": "Många reser på hajj varje år.",
        "st": "يسافر الكثيرون للحج كل عام."
    },
    {
        "w": "HÄKTE",
        "t": "توقيف / حبس احتياطي",
        "s": "Han sitter i häkte.",
        "st": "هو في الحبس الاحتياطي."
    },
    {
        "w": "HÄL",
        "t": "كعب",
        "s": "Jag har ont i hälen.",
        "st": "لدي ألم في الكعب."
    },
    {
        "w": "HALL",
        "t": "قاعة / مدخل",
        "s": "Vi hängde av oss jackorna i hallen.",
        "st": "علقنا ستراتنا في المدخل."
    },
    {
        "w": "HALS",
        "t": "حلق / رقبة",
        "s": "Hon har en scarf runt halsen.",
        "st": "لديها وشاح حول رقبتها."
    },
    {
        "w": "HÄLSA",
        "t": "صحة",
        "s": "Hälsa är viktigare än pengar.",
        "st": "الصحة أهم من المال."
    },
    {
        "w": "HÄLSAN",
        "t": "الصحة",
        "s": "Hälsan är det viktigaste vi har.",
        "st": "الصحة هي أهم ما نملك."
    },
    {
        "w": "HALSE",
        "t": "رقبة (شكل قديم)",
        "s": "Han föll om halse på henne.",
        "st": "عانقها (وقع على رقبتها)."
    },
    {
        "w": "HALSEN",
        "t": "الحلق / الرقبة",
        "s": "Halsen gör ont när jag sväljer.",
        "st": "يؤلمني حلقي عندما أبتلع."
    },
    {
        "w": "HALVÖ",
        "t": "شبه جزيرة",
        "s": "Italien är en stor halvö.",
        "st": "إيطاليا شبه جزيرة كبيرة."
    },
    {
        "w": "HAMN",
        "t": "ميناء",
        "s": "Båten ligger tryggt i en liten hamn.",
        "st": "القارب يرسو بأمان في ميناء صغير."
    },
    {
        "w": "HAN",
        "t": "هو",
        "s": "Han heter Peter och är mycket snäll.",
        "st": "هو اسمه بيتر ولطيف جداً."
    },
    {
        "w": "HÅN",
        "t": "ازْدِراء",
        "s": "det känns som ett hån",
        "st": "أشعر كـأنه ازدراء من طرفك"
    },
    {
        "w": "HAND",
        "t": "يد",
        "s": "Tvätta händerna.",
        "st": "اغسل يديك."
    },
    {
        "w": "HANDLED",
        "t": "معصم",
        "s": "Jag stukade handleden.",
        "st": "لويت معصمي."
    },
    {
        "w": "HÄR",
        "t": "هنا",
        "s": "Jag är här.",
        "st": "أنا هنا."
    },
    {
        "w": "HAV",
        "t": "بحر",
        "s": "Havet är djupt och blått.",
        "st": "البحر عميق وأزرق."
    },
    {
        "w": "HÅV",
        "t": "شبكة",
        "s": "Fånga med håv.",
        "st": "اصطياد بشبكة."
    },
    {
        "w": "HEJ",
        "t": "مرحباً",
        "s": "Hej på dig!",
        "st": "مرحباً بك!"
    },
    {
        "w": "HEL",
        "t": "كامل",
        "s": "Jag vill ha en hel kaka.",
        "st": "أريد كعكة كاملة."
    },
    {
        "w": "HELG",
        "t": "عطلة نهاية أسبوع",
        "s": "God helg!",
        "st": "عطلة سعيدة!"
    },
    {
        "w": "HELIG",
        "t": "مقدس",
        "s": "Koranen är en helig bok.",
        "st": "القرآن كتاب مقدس."
    },
    {
        "w": "HELIGT",
        "t": "مقدس",
        "s": "Detta är ett heligt rum.",
        "st": "هذه غرفة مقدسة."
    },
    {
        "w": "HELLÅNG",
        "t": "طويل",
        "s": "en hellång ärm en hellång klänning",
        "st": "كُمّ طويل فستان طويل"
    },
    {
        "w": "HELT",
        "t": "تماماً",
        "s": "Jag håller med dig helt och hållet.",
        "st": "أنا أتفق معك تماماً."
    },
    {
        "w": "HEM",
        "t": "منزل",
        "s": "Vi ska gå hem nu.",
        "st": "سنذهب إلى المنزل الآن."
    },
    {
        "w": "HETA",
        "t": "يُدعى / ساخن (جمع)",
        "s": "Vad heter du?",
        "st": "ما اسمك؟"
    },
    {
        "w": "HIMMEL",
        "t": "سماء",
        "s": "Himlen är blå.",
        "st": "السماء زرقاء."
    },
    {
        "w": "HJÄRTA",
        "t": "قلب",
        "s": "Mitt hjärta.",
        "st": "قلبي."
    },
    {
        "w": "HJORT",
        "t": "أيل",
        "s": "En hjort stod i skogsbrynet.",
        "st": "وقف أيل عند حافة الغابة."
    },
    {
        "w": "HJORTRON",
        "t": "توت العليق",
        "s": "Hjortron kallas skogens guld.",
        "st": "يسمى توت العليق ذهب الغابة."
    },
    {
        "w": "HJUL",
        "t": "عجلة",
        "s": "Hjulet snurrar fort.",
        "st": "العجلة تدور بسرعة."
    },
    {
        "w": "HÖSTEN",
        "t": "الخريف",
        "s": "Löven faller på hösten.",
        "st": "أوراق الشجر تسقط في الخريف."
    },
    {
        "w": "HOTELL",
        "t": "فندق",
        "s": "Vi bor på ett fint hotell.",
        "st": "نحن نقيم في فندق جميل."
    },
    {
        "w": "HUD",
        "t": "جلد / بشرة",
        "s": "Huden skyddar kroppen.",
        "st": "الجلد يحمي الجسم."
    },
    {
        "w": "HUS",
        "t": "بيت",
        "s": "Vi bor i ett litet rött hus.",
        "st": "نعيش في منزل أحمر صغير."
    },
    {
        "w": "IDE",
        "t": "مَرْبَض",
        "s": "gå i ide",
        "st": "يرقد في البيات الشتوي"
    },
    {
        "w": "IDÉ",
        "t": "فكرة",
        "s": "Jag har en idé.",
        "st": "لدي فكرة."
    },
    {
        "w": "IDEL",
        "t": "مَحْض",
        "s": "pjäsen möttes av idel lovord",
        "st": "قوبلت المسرحية باستحسان تام"
    },
    {
        "w": "IDROTT",
        "t": "رياضة",
        "s": "Idrott är mitt favoritämne.",
        "st": "الرياضة هي مادتي المفضلة."
    },
    {
        "w": "IFRÅN",
        "t": "مِن",
        "s": "jag är långt ifrån nöjd",
        "st": "لست راضِياً أبداً"
    },
    {
        "w": "IGEL",
        "t": "علقة",
        "s": "En igel i vattnet.",
        "st": "علقة في الماء."
    },
    {
        "w": "IGEN",
        "t": "ثانية",
        "s": "Kom gärna tillbaka igen!",
        "st": "أهلاً بك مجدداً!"
    },
    {
        "w": "IL",
        "t": "سرعة/عجلة",
        "s": "I full il.",
        "st": "في عجلة من أمره."
    },
    {
        "w": "IMAM",
        "t": "إمام",
        "s": "En imam är en religiös ledare.",
        "st": "الإمام هو قائد ديني."
    },
    {
        "w": "IMAMEN",
        "t": "الإمام (المعرف)",
        "s": "Imamen leder bönen i moskén.",
        "st": "الإمام يؤم الصلاة في المسجد."
    },
    {
        "w": "IN",
        "t": "في/إلى الداخل",
        "s": "Gå in.",
        "st": "تعال إلى الداخل."
    },
    {
        "w": "INÅT",
        "t": "إلى الداخل",
        "s": "han bor någonstans inåt landet",
        "st": "إنه يسكن في مكان ما داخل البلاد"
    },
    {
        "w": "INNE",
        "t": "رائج",
        "s": "det är inne att cykla",
        "st": "ركوب الدراجة شائع حالياً"
    },
    {
        "w": "INRE",
        "t": "داخلي",
        "s": "de inre delarna av landet",
        "st": "الأجزاء الداخلية من البلاد"
    },
    {
        "w": "INSEKT",
        "t": "حشرة",
        "s": "En liten insekt kröp på bordet.",
        "st": "زحفت حشرة صغيرة على الطاولة."
    },
    {
        "w": "INTER",
        "t": "إنتر",
        "s": "Inter vann matchen igår.",
        "st": "فاز إنتر بالمباراة أمس."
    },
    {
        "w": "IS",
        "t": "جليد",
        "s": "Det finns is på vägen.",
        "st": "يوجد جليد على الطريق."
    },
    {
        "w": "ISKALL",
        "t": "مُثَلِّج",
        "s": "iskall pilsner iskall beräkning",
        "st": "بيرة مثلجة تقييم بأعصاب باردة"
    },
    {
        "w": "ISLAM",
        "t": "الإسلام",
        "s": "Islam är en världsreligion.",
        "st": "الإسلام دين عالمي."
    },
    {
        "w": "JA",
        "t": "نعم",
        "s": "Ja, jag vill gärna följa med.",
        "st": "نعم، أود الذهاب معك."
    },
    {
        "w": "JÄRN",
        "t": "حديد",
        "s": "Järn är en viktig metall.",
        "st": "الحديد معدن مهم."
    },
    {
        "w": "JO",
        "t": "بلى",
        "s": "Jo, det gjorde jag.",
        "st": "بلى، فعلت."
    },
    {
        "w": "JOBB",
        "t": "عمل",
        "s": "Jag trivs på mitt jobb.",
        "st": "أنا مرتاح في عملي."
    },
    {
        "w": "JOD",
        "t": "يود",
        "s": "Jod används i sår.",
        "st": "يستخدم اليود في الجروح."
    },
    {
        "w": "JU",
        "t": "كما تعلم",
        "s": "Du vet ju det.",
        "st": "أنت تعلم ذلك."
    },
    {
        "w": "JUL",
        "t": "عيد الميلاد",
        "s": "God jul!",
        "st": "عيد ميلاد مجيد!"
    },
    {
        "w": "KADER",
        "t": "كادر",
        "s": "En liten kader av lojala soldater.",
        "st": "كادر صغير من الجنود المخلصين."
    },
    {
        "w": "KADES",
        "t": "قيل (مبني للمجهول)",
        "s": "Det kades ingenting om saken.",
        "st": "لم يُقل شيء عن الأمر."
    },
    {
        "w": "KAFFE",
        "t": "قهوة",
        "s": "En kopp kaffe, tack.",
        "st": "فنجان قهوة، من فضلك."
    },
    {
        "w": "KAKA",
        "t": "كعكة",
        "s": "Vill du ha en liten kaka?",
        "st": "هل تريد كعكة صغيرة؟"
    },
    {
        "w": "KAKOR",
        "t": "كعك",
        "s": "Vi bakade goda kakor.",
        "st": "خبزنا كعكاً لذيذاً."
    },
    {
        "w": "KAL",
        "t": "أصلع / عار",
        "s": "Trädet är kalt på vintern.",
        "st": "الشجرة عارية في الشتاء."
    },
    {
        "w": "KÅL",
        "t": "ملفوف",
        "s": "Kål är en nyttig grönsak.",
        "st": "الملفوف خضار صحي."
    },
    {
        "w": "KÅLAR",
        "t": "أنواع الملفوف",
        "s": "Olika kålar växer i landet.",
        "st": "أنواع مختلفة من الملفوف تنمو في الحقل."
    },
    {
        "w": "KALAS",
        "t": "حفلة",
        "s": "Vi hade ett roligt kalas.",
        "st": "أقمنا حفلة ممتعة."
    },
    {
        "w": "KALL",
        "t": "بارد",
        "s": "Vintern är mörk och kall.",
        "st": "الشتاء مظلم وبارد."
    },
    {
        "w": "KALOTT",
        "t": "قلنسوة ضيقة",
        "s": "bildligt något som liknar en kalott",
        "st": "تقال مجازاً عن شيء يشابه القلنسوة"
    },
    {
        "w": "KÅLROT",
        "t": "لفت سويدي",
        "s": "Rotmos görs på kålrot.",
        "st": "يصنع هريس الجذور من اللفت السويدي."
    },
    {
        "w": "KALV",
        "t": "عجل",
        "s": "Kalvkött är ljust.",
        "st": "لحم العجل فاتح اللون."
    },
    {
        "w": "KAM",
        "t": "مشط",
        "s": "Kamma håret med en kam.",
        "st": "مشط شعرك بمشط."
    },
    {
        "w": "KAMERA",
        "t": "كاميرا",
        "s": "Ta ett kort med kameran.",
        "st": "التقط صورة بالكاميرا."
    },
    {
        "w": "KAN",
        "t": "يستطيع",
        "s": "Jag kan simma.",
        "st": "أستطيع السباحة."
    },
    {
        "w": "KANAL",
        "t": "قناة",
        "s": "Vi tittar på en intressant kanal.",
        "st": "نشاهد قناة مثيرة للاهتمام."
    },
    {
        "w": "KANOT",
        "t": "زورق",
        "s": "Vi paddlar kanot på sjön.",
        "st": "نجدف بالزورق في البحيرة."
    },
    {
        "w": "KANT",
        "t": "حافة",
        "s": "Akta dig för kanten.",
        "st": "احذر من الحافة."
    },
    {
        "w": "KANTRAR",
        "t": "ينقلب",
        "s": "båten kantrar vinden kantrade",
        "st": "ينقلب الزورق إنعكست الريح"
    },
    {
        "w": "KAP",
        "t": "غنيمة",
        "s": "göra ett gott kap",
        "st": "غنم شيئاً جيداً"
    },
    {
        "w": "KAPTEN",
        "t": "قبطان",
        "s": "Kapten styr båten säkert.",
        "st": "القبطان يقود القارب بأمان."
    },
    {
        "w": "KAPTENS",
        "t": "للقبطان (مضاف)",
        "s": "Detta är kaptens gamla hatt.",
        "st": "هذه قبعة القبطان القديمة."
    },
    {
        "w": "KAR",
        "t": "حوض",
        "s": "Ett stort kar fyllt med vatten.",
        "st": "حوض كبير مملوء بالماء."
    },
    {
        "w": "KARL",
        "t": "رَجُل",
        "s": "Han är en stilig karl.",
        "st": "إنه رجل وسيم."
    },
    {
        "w": "KÄRL",
        "t": "وعاء",
        "s": "Ett kärl.",
        "st": "وعاء."
    },
    {
        "w": "KARR",
        "t": "مستنقع",
        "s": "Växten trivs i fuktiga karr.",
        "st": "النبات ينمو في المستنقعات الرطبة."
    },
    {
        "w": "KÄRRA",
        "t": "عربة",
        "s": "Vi drog en tung kärra.",
        "st": "سحبنا عربة ثقيلة."
    },
    {
        "w": "KARTA",
        "t": "خريطة",
        "s": "Titta på kartan.",
        "st": "انظر إلى الخريطة."
    },
    {
        "w": "KAST",
        "t": "رمية",
        "s": "Det var ett mycket bra kast med bollen.",
        "st": "كانت رمية جيدة جداً بالكرة."
    },
    {
        "w": "KATA",
        "t": "كاتا",
        "s": "Han tränar kata varje dag.",
        "st": "يتدرب على الكاتا كل يوم."
    },
    {
        "w": "KATT",
        "t": "قِطّ",
        "s": "Katten jamar.",
        "st": "القطة تموء."
    },
    {
        "w": "KAVAJ",
        "t": "سترة رسمية",
        "s": "Han köpte en ny kavaj.",
        "st": "اشترى سترة رسمية جديدة."
    },
    {
        "w": "KIL",
        "t": "خازوق",
        "s": "slå i en kil",
        "st": "دَقَّ اسْفيناً"
    },
    {
        "w": "KIND",
        "t": "خَدّ",
        "s": "Hon fick en kyss på kinden.",
        "st": "حصلت على قبلة على الخد."
    },
    {
        "w": "KISTA",
        "t": "تابوت / صندوق",
        "s": "Piraterna gömde en kista med guld.",
        "st": "خبأ القراصنة صندوقاً مليئاً بالذهب."
    },
    {
        "w": "KLÄDE",
        "t": "قماش / جوخ",
        "s": "Ett fint kläde till dräkten.",
        "st": "قماش فاخر للزي."
    },
    {
        "w": "KLÄDER",
        "t": "ملابس",
        "s": "Hon köper nya kläder.",
        "st": "هي تشتري ملابس جديدة."
    },
    {
        "w": "KLANG",
        "t": "رنين",
        "s": "Klockans klang hördes vida omkring.",
        "st": "سُمع رنين الجرس من بعيد."
    },
    {
        "w": "KLAR",
        "t": "صافٍ",
        "s": "klara ögon klart vatten",
        "st": "عيون صافية ماء صاف"
    },
    {
        "w": "KLASS",
        "t": "صف / فئة",
        "s": "Hela klassen åkte på utflykt.",
        "st": "ذهب الصف بأكمله في نزهة."
    },
    {
        "w": "KNIV",
        "t": "سكين",
        "s": "Akta dig för kniven.",
        "st": "احذر من السكين."
    },
    {
        "w": "KO",
        "t": "بقرة",
        "s": "En ko betar på ängen.",
        "st": "بقرة ترعى في المرج."
    },
    {
        "w": "KOCK",
        "t": "طباخ",
        "s": "Han är en duktig kock.",
        "st": "هو طباخ ماهر."
    },
    {
        "w": "KOGG",
        "t": "سفينة تجارية قديمة",
        "s": "En kogg är ett gammalt fartyg.",
        "st": "الكوج هي سفينة قديمة."
    },
    {
        "w": "KOK",
        "t": "غليان",
        "s": "Ge soppan ett snabbt uppkok.",
        "st": "دع الحساء يغلي غلية سريعة."
    },
    {
        "w": "KOKA",
        "t": "يغلي",
        "s": "Vattnet börjar koka.",
        "st": "الماء يبدأ بالغليان."
    },
    {
        "w": "KÖKET",
        "t": "المطبخ",
        "s": "Vi lagar mat i köket.",
        "st": "نطبخ في المطبخ."
    },
    {
        "w": "KOL",
        "t": "فحم",
        "s": "Vi grillade maten över glödande kol.",
        "st": "شوينا الطعام على فحم متوهج."
    },
    {
        "w": "KÖL",
        "t": "عارضة",
        "s": "Båtens köl slog i botten.",
        "st": "اصطدمت عارضة القارب بالقاع."
    },
    {
        "w": "KOLA",
        "t": "توفي",
        "s": "Vill du ha en seg kola?",
        "st": "هل تريد قطعة توفي لزجة؟"
    },
    {
        "w": "KOLLEGA",
        "t": "زميل",
        "s": "Min kollega är hjälpsam.",
        "st": "زميلي متعاون."
    },
    {
        "w": "KONTOR",
        "t": "مكتب",
        "s": "Min pappa arbetar på ett stort kontor.",
        "st": "يعمل أبي في مكتب كبير."
    },
    {
        "w": "KÖP",
        "t": "شراء",
        "s": "Det var ett bra köp.",
        "st": "كانت صفقة شراء جيدة."
    },
    {
        "w": "KÖPA",
        "t": "يشتري",
        "s": "Jag ska köpa en ny bil.",
        "st": "سأشتري سيارة جديدة."
    },
    {
        "w": "KOPP",
        "t": "فنجان",
        "s": "Vill du ha en kopp te?",
        "st": "هل تريد فنجان شاي؟"
    },
    {
        "w": "KOR",
        "t": "أبقار",
        "s": "Korna betar gräs på ängen.",
        "st": "الأبقار ترعى العشب في المرج."
    },
    {
        "w": "KÖR",
        "t": "جوقة / يقود",
        "s": "Hon sjunger i en kör.",
        "st": "هي تغني في جوقة."
    },
    {
        "w": "KORA",
        "t": "يختار / ينتخب",
        "s": "De ska kora en vinnare.",
        "st": "سيختارون فائزاً."
    },
    {
        "w": "KÖRA",
        "t": "يقود",
        "s": "Får jag köra din bil?",
        "st": "هل يمكنني قيادة سيارتك؟"
    },
    {
        "w": "KORAN",
        "t": "القرآن",
        "s": "Koranen är en helig bok.",
        "st": "القرآن كتاب مقدس."
    },
    {
        "w": "KÖRAS",
        "t": "يُقاد (مبني للمجهول)",
        "s": "Bilen köras av en expert.",
        "st": "السيارة يقودها خبير."
    },
    {
        "w": "KÖRET",
        "t": "القيادة / العمل الشاق",
        "s": "Det var fullt upp med köret.",
        "st": "كان هناك الكثير من العمل الشاق."
    },
    {
        "w": "KORNA",
        "t": "الأبقار",
        "s": "Korna betar på ängen.",
        "st": "الأبقار ترعى في المرج."
    },
    {
        "w": "KORT",
        "t": "قصير / بطاقة",
        "s": "Skriv ett kort meddelande.",
        "st": "اكتب رسالة قصيرة."
    },
    {
        "w": "KORTA",
        "t": "فشل",
        "s": "komma till korta ( misslyckas )",
        "st": "فشل"
    },
    {
        "w": "KORV",
        "t": "سجق",
        "s": "Grilla korv.",
        "st": "اشوي السجق."
    },
    {
        "w": "KOS",
        "t": "متعة / مرح",
        "s": "Det är kos att leka.",
        "st": "من الممتع اللعب."
    },
    {
        "w": "KOSA",
        "t": "وجهة / مسار",
        "s": "Vi styrde vår kosa mot norr.",
        "st": "وجهنا مسارنا نحو الشمال."
    },
    {
        "w": "KOST",
        "t": "نظام غذائي",
        "s": "En balanserad kost är bra för hälsan.",
        "st": "النظام الغذائي المتوازن جيد للصحة."
    },
    {
        "w": "KOSTAR",
        "t": "يكلف",
        "s": "Vad kostar biljetten?",
        "st": "كم تكلف التذكرة؟"
    },
    {
        "w": "KOTA",
        "t": "فقرة (عظم)",
        "s": "En kota i ryggen.",
        "st": "فقرة في الظهر."
    },
    {
        "w": "KÖTT",
        "t": "لحم",
        "s": "Jag äter inte kött.",
        "st": "أنا لا آكل اللحم."
    },
    {
        "w": "KÖTTFÄRS",
        "t": "لحم مفروم",
        "s": "Vi gör biffar av köttfärs.",
        "st": "نصنع شرائح اللحم من اللحم المفروم."
    },
    {
        "w": "KRAFT",
        "t": "قوة",
        "s": "Han har mycket kraft i armarna.",
        "st": "لديه قوة كبيرة في ذراعيه."
    },
    {
        "w": "KRAM",
        "t": "عناق",
        "s": "Ge mig en kram.",
        "st": "اعطني عناقاً."
    },
    {
        "w": "KRÄM",
        "t": "كريم",
        "s": "Smörj in huden med kräm.",
        "st": "ادهن الجلد بالكريم."
    },
    {
        "w": "KRAMP",
        "t": "تشنج",
        "s": "Jag fick kramp i benet.",
        "st": "أصبت بتشنج في ساقي."
    },
    {
        "w": "KRAS",
        "t": "تحطّم",
        "s": "Vasen gick i kras.",
        "st": "تحطمت المزهرية."
    },
    {
        "w": "KRASS",
        "t": "واقعي",
        "s": "den krassa verkligheten",
        "st": "واقع لا جدال عليه"
    },
    {
        "w": "KRAV",
        "t": "مطالبة",
        "s": "ställa krav på en bättre service",
        "st": "طالب بالحصول على خدمات أفضل"
    },
    {
        "w": "KREDIT",
        "t": "ائتمان",
        "s": "köpa på kredit bevilja långa krediter",
        "st": "اشترى بالتسليف منح ائتمانات طويلة الأجل"
    },
    {
        "w": "KRIS",
        "t": "أزمة",
        "s": "en ekonomisk kris människa i kris",
        "st": "أزمة اقتصادية إنسان في أزمة"
    },
    {
        "w": "KRISTUS",
        "t": "المسيح",
        "s": "Jesus Kristus.",
        "st": "يسوع المسيح."
    },
    {
        "w": "KROPP",
        "t": "جسم",
        "s": "Träning är bra för kroppen.",
        "st": "الرياضة مفيدة للجسم."
    },
    {
        "w": "KROTON",
        "t": "كروتون",
        "s": "En växt.",
        "st": "نبات."
    },
    {
        "w": "KRUS",
        "t": "قدر فخاري",
        "s": "Inget krus, tack.",
        "st": "بدون مجاملات، شكراً."
    },
    {
        "w": "KRYA",
        "t": "يتعافى",
        "s": "Hoppas du kryar på dig snart.",
        "st": "آمل أن تتعافى قريباً."
    },
    {
        "w": "KUL",
        "t": "لطيف",
        "s": "Det var en kul fest.",
        "st": "كانت حفلة ممتعة."
    },
    {
        "w": "KURS",
        "t": "دورة",
        "s": "Jag går en kurs i svenska.",
        "st": "أنا أحضر دورة في اللغة السويدية."
    },
    {
        "w": "KUSIN",
        "t": "ابن عم/خال",
        "s": "Min kusin kommer på besök.",
        "st": "ابن عمي يزورنا."
    },
    {
        "w": "KUST",
        "t": "ساحل",
        "s": "Vi bor vid kusten.",
        "st": "نعيش عند الساحل."
    },
    {
        "w": "KVÄLL",
        "t": "مساء",
        "s": "Vi ses i kväll klockan åtta.",
        "st": "نلتقي هذا المساء في الساعة الثامنة."
    },
    {
        "w": "KVART",
        "t": "ربع",
        "s": "om en kvart ett kvarts kilo",
        "st": "بعد ربع ساعة ربع كيلوغرام"
    },
    {
        "w": "KYL",
        "t": "ثلاجة",
        "s": "I kylen.",
        "st": "في الثلاجة."
    },
    {
        "w": "KYRKAN",
        "t": "الكنيسة (المعرف)",
        "s": "Kyrkan är gammal.",
        "st": "الكنيسة قديمة."
    },
    {
        "w": "KYST",
        "t": "ساحل",
        "s": "Kusten är vacker.",
        "st": "الساحل جميل."
    },
    {
        "w": "LADA",
        "t": "حظيرة",
        "s": "Hästen står inne i en lada.",
        "st": "الحصان يقف داخل الحظيرة."
    },
    {
        "w": "LADDA",
        "t": "يشحن",
        "s": "Ladda mobilen.",
        "st": "اشحن الهاتف."
    },
    {
        "w": "LÄDER",
        "t": "جلد",
        "s": "Jackan är av äkta läder.",
        "st": "السترة من الجلد الحقيقي."
    },
    {
        "w": "LAG",
        "t": "قانون",
        "s": "Lagen gäller lika för alla medborgare.",
        "st": "القانون يسري بالتساوي على جميع المواطنين."
    },
    {
        "w": "LÅG",
        "t": "مُنْخَفِض",
        "s": "ett lågt bord",
        "st": "طاولة منخفضة"
    },
    {
        "w": "LAGA",
        "t": "يصلح",
        "s": "Laga bilen.",
        "st": "أصلح السيارة."
    },
    {
        "w": "LAGAR",
        "t": "قوانين",
        "s": "Sveriges lagar.",
        "st": "قوانين السويد."
    },
    {
        "w": "LAGER",
        "t": "مخزن / طبقة",
        "s": "Kakan har flera lager.",
        "st": "الكعكة لها عدة طبقات."
    },
    {
        "w": "LÄGER",
        "t": "مخيم",
        "s": "Vi åkte på läger.",
        "st": "ذهبنا في مخيم."
    },
    {
        "w": "LAKAN",
        "t": "ملاءة",
        "s": "Vita lakan hänger på tork.",
        "st": "ملاءات بيضاء معلقة لتجف."
    },
    {
        "w": "LÄKARE",
        "t": "طبيب",
        "s": "Läkaren hjälper patienter.",
        "st": "الطبيب يساعد المرضى."
    },
    {
        "w": "LAM",
        "t": "مَشلول",
        "s": "ett lamt intresse",
        "st": "اهتمام ضعيف"
    },
    {
        "w": "LAMA",
        "t": "لاما / مشلول",
        "s": "Laman är ett djur från Anderna.",
        "st": "اللاما حيوان من جبال الأنديز."
    },
    {
        "w": "LAMPA",
        "t": "مصباح",
        "s": "Tänd lampan, det är mörkt.",
        "st": "أشعل المصباح، الجو مظلم."
    },
    {
        "w": "LÅN",
        "t": "قَرضْ",
        "s": "tack för lånet!",
        "st": "شكراً على الإعارة!"
    },
    {
        "w": "LAND",
        "t": "أرض / بلد",
        "s": "Sverige är ett vackert land.",
        "st": "السويد بلد جميل."
    },
    {
        "w": "LANDA",
        "t": "يهبط",
        "s": "Flygplanet ska landa.",
        "st": "الطائرة ستهبط."
    },
    {
        "w": "LÄNDER",
        "t": "بلدان",
        "s": "Vi besökte många länder.",
        "st": "زرنا العديد من البلدان."
    },
    {
        "w": "LÅNG",
        "t": "طويل",
        "s": "två meter lång",
        "st": "طوله متران"
    },
    {
        "w": "LÄNGA",
        "t": "مبنى طويل",
        "s": "En låg länga.",
        "st": "مبنى طويل منخفض."
    },
    {
        "w": "LÄNSA",
        "t": "يفرغ (ماء)",
        "s": "Vi måste länsa båten.",
        "st": "يجب أن نفرغ القارب من الماء."
    },
    {
        "w": "LÄPP",
        "t": "شفة",
        "s": "Han bet sig i läppen.",
        "st": "عض شفته."
    },
    {
        "w": "LÅR",
        "t": "فخذ",
        "s": "Kycklinglår i ugn.",
        "st": "فخذ دجاج في الفرن."
    },
    {
        "w": "LÄR",
        "t": "يعلم",
        "s": "Han lär sig snabbt.",
        "st": "هو يتعلم بسرعة."
    },
    {
        "w": "LÄRA",
        "t": "يعلم / يتعلم",
        "s": "Att lära är att växa.",
        "st": "التعلم هو النمو."
    },
    {
        "w": "LÄRARE",
        "t": "معلم",
        "s": "Läraren undervisar klassen.",
        "st": "المعلم يدرس الفصل."
    },
    {
        "w": "LÄRD",
        "t": "عالم / مثقف",
        "s": "Han är en lärd man.",
        "st": "إنه رجل عالم."
    },
    {
        "w": "LÄRDE",
        "t": "علماء",
        "s": "De lärde tvistar om den saken.",
        "st": "العلماء يختلفون حول هذا الأمر."
    },
    {
        "w": "LÅRET",
        "t": "الفخذ",
        "s": "Han har ont i låret.",
        "st": "لديه ألم في الفخذ."
    },
    {
        "w": "LÅS",
        "t": "قفل",
        "s": "Sätt ett lås på dörren.",
        "st": "ضع قفلاً على الباب."
    },
    {
        "w": "LÄS",
        "t": "اقرأ (أمر)",
        "s": "Läs boken.",
        "st": "اقرأ الكتاب."
    },
    {
        "w": "LÄSA",
        "t": "يقرأ",
        "s": "Jag gillar att läsa böcker.",
        "st": "أحب قراءة الكتب."
    },
    {
        "w": "LÅSER",
        "t": "يقفل",
        "s": "He låser dörren.",
        "st": "هو يقفل الباب."
    },
    {
        "w": "LASS",
        "t": "حمل",
        "s": "Ett lass ved.",
        "st": "حمل حطب."
    },
    {
        "w": "LAST",
        "t": "حمل",
        "s": "Lasten var tung.",
        "st": "الحمل كان ثقيلاً."
    },
    {
        "w": "LASTA",
        "t": "يحمل",
        "s": "Vi måste lasta bilen.",
        "st": "يجب أن نحمل السيارة."
    },
    {
        "w": "LASTAR",
        "t": "يحمل",
        "s": "De lastar lastbilen.",
        "st": "هم يحملون الشاحنة."
    },
    {
        "w": "LASTBIL",
        "t": "شاحنة",
        "s": "En stor lastbil blockerade vägen.",
        "st": "شاحنة كبيرة سدت الطريق."
    },
    {
        "w": "LÅTER",
        "t": "يبدو / يصدر صوتاً",
        "s": "Det låter som en bra idé.",
        "st": "تبدو فكرة جيدة."
    },
    {
        "w": "LAV",
        "t": "أشنة",
        "s": "Lavar växer på gamla stenar.",
        "st": "تنمو الأشنات على الحجارة القديمة."
    },
    {
        "w": "LAVA",
        "t": "حمم",
        "s": "Vulkanen sprutade ut het lava.",
        "st": "قذف البركان حمماً ساخنة."
    },
    {
        "w": "LÄXA",
        "t": "واجب منزلي",
        "s": "Jag har mycket läxa idag.",
        "st": "لدي الكثير من الواجب المنزلي اليوم."
    },
    {
        "w": "LE",
        "t": "يبتسم",
        "s": "Hon ler mot mig.",
        "st": "هي تبتسم دائماً."
    },
    {
        "w": "LED",
        "t": "مفصل / طرييق",
        "s": "Jag har ont i en led.",
        "st": "لدي ألم في مفصل."
    },
    {
        "w": "LEDD",
        "t": "اتّجاه",
        "s": "mattan passar bättre på andra ledden",
        "st": "تُناسِب السجادة بصورة أفضل في الإتّجاه الآخَر"
    },
    {
        "w": "LEG",
        "t": "ابتسامة",
        "s": "Ett vänligt leende.",
        "st": "ابتسامة ودية."
    },
    {
        "w": "LEGAL",
        "t": "قانوني",
        "s": "Legal.",
        "st": "قانوني."
    },
    {
        "w": "LEGER",
        "t": "سبائك",
        "s": "Brons är en legering av koppar.",
        "st": "البرونز هو سبيكة من النحاس."
    },
    {
        "w": "LEGIT",
        "t": "شرعي",
        "s": "Legit.",
        "st": "شرعي (عامية)."
    },
    {
        "w": "LEN",
        "t": "ناعم",
        "s": "Katten har len päls.",
        "st": "القطة لديها فراء ناعم."
    },
    {
        "w": "LER",
        "t": "يبتسم",
        "s": "Hon ler mot mig.",
        "st": "هي تبتسم لي."
    },
    {
        "w": "LEV",
        "t": "عِش (أمر)",
        "s": "Lev livet fullt ut!",
        "st": "عش الحياة على أكمل وجه!"
    },
    {
        "w": "LEVE",
        "t": "يحيا",
        "s": "Leve konungen!",
        "st": "ليحيا الملك!"
    },
    {
        "w": "LEVER",
        "t": "كبد / يعيش",
        "s": "Levern renar blodet.",
        "st": "الكبد ينقي الدم."
    },
    {
        "w": "LIA",
        "t": "ليانا",
        "s": "Tarzan svingar sig i en lia.",
        "st": "طرزان يتأرجح في ليانا."
    },
    {
        "w": "LIK",
        "t": "شَبيه",
        "s": "likt ( som )",
        "st": "مِثلْ , شِبهْ"
    },
    {
        "w": "LIKT",
        "t": "مشابه",
        "s": "Det är likt honom att göra så.",
        "st": "من عادته أن يفعل ذلك."
    },
    {
        "w": "LILA",
        "t": "أرجواني",
        "s": "Lila blommor.",
        "st": "زهور أرجوانية."
    },
    {
        "w": "LILJA",
        "t": "زنبق",
        "s": "En vit lilja.",
        "st": "زنبقة بيضاء."
    },
    {
        "w": "LIM",
        "t": "غراء",
        "s": "Jag behöver lim.",
        "st": "أحتاج إلى غراء."
    },
    {
        "w": "LIMA",
        "t": "ليما (مدينة)",
        "s": "Lima är Perus huvudstad.",
        "st": "ليما هي عاصمة بيرو."
    },
    {
        "w": "LIND",
        "t": "زيزفون",
        "s": "Ett gammalt lindträd.",
        "st": "شجرة زيزفون قديمة."
    },
    {
        "w": "LINJAL",
        "t": "مسطرة",
        "s": "Dra ett streck med linjalen.",
        "st": "ارسم خطاً بالمسطرة."
    },
    {
        "w": "LIRA",
        "t": "يعزف",
        "s": "Ska vi lira lite boll?",
        "st": "هل نلعب الكرة قليلاً؟"
    },
    {
        "w": "LIS",
        "t": "مكر",
        "s": "Han använde list för att vinna.",
        "st": "استخدم المكر ليفوز."
    },
    {
        "w": "LISA",
        "t": "تخفيف",
        "s": "En lisa för själen.",
        "st": "راحة للنفس."
    },
    {
        "w": "LIST",
        "t": "قائمة",
        "s": "Han använde list för att vinna.",
        "st": "استخدم المكر ليفوز."
    },
    {
        "w": "LISTA",
        "t": "قائمة",
        "s": "Gör en lista på vad vi behöver.",
        "st": "اصنع قائمة بما نحتاجه."
    },
    {
        "w": "LIT",
        "t": "ثقة",
        "s": "Han satte sin lit till henne.",
        "st": "وضع ثقته فيها."
    },
    {
        "w": "LITE",
        "t": "قليل",
        "s": "Kan jag få lite mer kaffe?",
        "st": "هل يمكنني الحصول على المزيد من القهوة؟"
    },
    {
        "w": "LITER",
        "t": "ليتر",
        "s": "en liter mjölk",
        "st": "ليتر من الحليب"
    },
    {
        "w": "LIV",
        "t": "حياة",
        "s": "Livet är en gåva.",
        "st": "الحياة هدية."
    },
    {
        "w": "LIVS",
        "t": "حيّ",
        "s": "Det är en livs levande älg.",
        "st": "إنه лось حي يرزق."
    },
    {
        "w": "LJUS",
        "t": "ضوء / شمعة",
        "s": "Tänd ett ljus.",
        "st": "أشعل شمعة."
    },
    {
        "w": "LOD",
        "t": "ثقل / رصاص",
        "s": "Snickaren använde ett lod.",
        "st": "استخدم النجار ثقلاً."
    },
    {
        "w": "LOGI",
        "t": "مَسكن مُؤَقّت",
        "s": "kost och logi",
        "st": "طعام وسكن"
    },
    {
        "w": "LÖGN",
        "t": "كذبة",
        "s": "Det var en lögn.",
        "st": "كانت تلك كذبة."
    },
    {
        "w": "LOK",
        "t": "قاطرة",
        "s": "Tåget dras av ett lok.",
        "st": "القطار تسحبه قاطرة."
    },
    {
        "w": "LÖK",
        "t": "بصل",
        "s": "Jag hackar lök till såsen.",
        "st": "أفرم البصل للصلصة."
    },
    {
        "w": "LOKAL",
        "t": "محلي",
        "s": "Vi hyrde en lokal för festen.",
        "st": "استأجرنا مكاناً للحفلة."
    },
    {
        "w": "LÖKAR",
        "t": "بصل (جمع)",
        "s": "Vi behöver lök till maten.",
        "st": "نحتاج بصل للطبخ."
    },
    {
        "w": "LÖN",
        "t": "راتب",
        "s": "Min lön.",
        "st": "راتبي."
    },
    {
        "w": "LOS",
        "t": "يفك",
        "s": "Vi måste kasta loss nu genast.",
        "st": "يجب أن نفك الحبال ونبحر فوراً."
    },
    {
        "w": "LOTS",
        "t": "مرشد (سفن)",
        "s": "Fartyget behövde en lots.",
        "st": "احتاجت السفينة إلى مرشد."
    },
    {
        "w": "LOTTA",
        "t": "جُندية مُتَطَوِّعة",
        "s": "Lotta är en lottakår.",
        "st": "لوتا هي مجندة متطوعة."
    },
    {
        "w": "LÖV",
        "t": "ورقة شجر",
        "s": "Ett gult löv föll från trädet.",
        "st": "سقطت ورقة صفراء من الشجرة."
    },
    {
        "w": "LÖVA",
        "t": "تكتسي بالأوراق",
        "s": "Träden börjar löva sig på våren.",
        "st": "تبدأ الأشجار باكتساء الأوراق في الربيع."
    },
    {
        "w": "LUGN",
        "t": "هادئ",
        "s": "Han är en lugn person.",
        "st": "هو شخص هادئ."
    },
    {
        "w": "LUGNA",
        "t": "يهدئ",
        "s": "Försök att lugna ner dig.",
        "st": "حاول أن تهدأ."
    },
    {
        "w": "LUKT",
        "t": "شَمّ",
        "s": "lukt och smak",
        "st": "شَمّ وذَوْق"
    },
    {
        "w": "LUKTAR",
        "t": "تفوح منه رائحة",
        "s": "fisken luktar illa du luktar rök",
        "st": "تفوح رائحة كريهة من السمك تفوح منك رائحة الدخان"
    },
    {
        "w": "LUNCH",
        "t": "غداء",
        "s": "Vi äter lunch klockan tolv.",
        "st": "نحن نتناول الغداء الساعة الثانية عشرة."
    },
    {
        "w": "LUND",
        "t": "بستان",
        "s": "En lund.",
        "st": "بستان."
    },
    {
        "w": "LURA",
        "t": "يخدع",
        "s": "Du kan inte lura mig.",
        "st": "لا يمكنك خداعي."
    },
    {
        "w": "LUS",
        "t": "قملة",
        "s": "En lus i håret.",
        "st": "قملة في الشعر."
    },
    {
        "w": "LUTA",
        "t": "يميل",
        "s": "Luta dig.",
        "st": "استند."
    },
    {
        "w": "LYFT",
        "t": "رفع / دفعة",
        "s": "Ett tungt lyft för ryggen.",
        "st": "رفع ثقيل للظهر."
    },
    {
        "w": "MAG",
        "t": "قدرة / معدة",
        "s": "Hon har en stark mag.",
        "st": "لديها معدة قوية."
    },
    {
        "w": "MAGE",
        "t": "معدة",
        "s": "Jag har ont i magen.",
        "st": "لدي ألم في معدتي."
    },
    {
        "w": "MAKRILL",
        "t": "إسقمري",
        "s": "Rökt makrill är gott.",
        "st": "الإسقمري المدخن لذيذ."
    },
    {
        "w": "MAKT",
        "t": "سلطة / قوة",
        "s": "Kunskap är makt, brukar man säga.",
        "st": "المعرفة قوة، كما يقال عادة."
    },
    {
        "w": "MAL",
        "t": "سمك السلور",
        "s": "Malen är en stor fisk.",
        "st": "السلور سمكة كبيرة."
    },
    {
        "w": "MAN",
        "t": "رجل",
        "s": "En gammal man satt på bänken.",
        "st": "رجل عجوز جلس على المقعد."
    },
    {
        "w": "MÄN",
        "t": "رجال",
        "s": "Två män stod och pratade utanför.",
        "st": "كان رجلان يقفان ويتحدثان في الخارج."
    },
    {
        "w": "MANAT",
        "t": "حث",
        "s": "Han har manat till lugn och ro.",
        "st": "لقد دعا إلى الهدوء والسكينة."
    },
    {
        "w": "MARK",
        "t": "أرض",
        "s": "Sitta på marken.",
        "st": "الجلوس على الأرض."
    },
    {
        "w": "MÄRKE",
        "t": "ماركة / علامة",
        "s": "Det är ett känt märke.",
        "st": "إنها ماركة معروفة."
    },
    {
        "w": "MAST",
        "t": "صارية",
        "s": "Seglet hänger slappt på masten.",
        "st": "الشراع يتدلى برخاوة على الصارية."
    },
    {
        "w": "MAT",
        "t": "طعام",
        "s": "The food at the restaurant tastes very good.",
        "st": "الطعام في المطعم طعمه جيد جداً."
    },
    {
        "w": "MÄTA",
        "t": "يقيس",
        "s": "Mäta.",
        "st": "يقيس."
    },
    {
        "w": "MÄTAR",
        "t": "عداد",
        "s": "Vi måste läsa av elmätaren nu.",
        "st": "يجب أن نقرأ عداد الكهرباء الآن."
    },
    {
        "w": "MATEN",
        "t": "الطعام",
        "s": "Kom och ät, maten är klar!",
        "st": "تعالوا لتناول الطعام، الأكل جاهز!"
    },
    {
        "w": "MATRÄTT",
        "t": "طبق",
        "s": "Vilken är din favorit maträtt?",
        "st": "ما هو طبقك المفضل؟"
    },
    {
        "w": "MATROS",
        "t": "بحار",
        "s": "En matros arbetar hårt på fartyget.",
        "st": "يعمل البحار بجد على السفينة."
    },
    {
        "w": "MATSAL",
        "t": "غرفة طعام / مقصف",
        "s": "Vi äter in skolans matsal.",
        "st": "نأكل في مقصف المدرسة."
    },
    {
        "w": "MATT",
        "t": "ضعيف",
        "s": "Färgen är matt.",
        "st": "اللون باهت."
    },
    {
        "w": "MÄTT",
        "t": "شبعان",
        "s": "Jag är proppmätt.",
        "st": "أنا شبعان تماماً."
    },
    {
        "w": "MATTA",
        "t": "سجادة",
        "s": "Vi köpte en ny matta till vardagsrummet.",
        "st": "اشترينا سجادة جديدة لغرفة المعيشة."
    },
    {
        "w": "MATTAN",
        "t": "السجادة",
        "s": "Katten ligger och sover på mattan.",
        "st": "القطة نائمة على السجادة."
    },
    {
        "w": "MATTE",
        "t": "رياضيات",
        "s": "Vi har matte in skolan.",
        "st": "لدينا رياضيات في المدرسة."
    },
    {
        "w": "MED",
        "t": "مع",
        "s": "Kom med mig.",
        "st": "تعال معي."
    },
    {
        "w": "MEDICIN",
        "t": "دواء",
        "s": "Ta din medicin i tid.",
        "st": "تناول دواءك في الوقت المحدد."
    },
    {
        "w": "MEN",
        "t": "لكن",
        "s": "Liten men naggande god.",
        "st": "صغير لكنه جيد."
    },
    {
        "w": "MER",
        "t": "أكثر",
        "s": "Jag vill ha mer mat.",
        "st": "أريد المزيد من الطعام."
    },
    {
        "w": "MESON",
        "t": "ميزون",
        "s": "Meson.",
        "st": "ميزون (فيزياء)."
    },
    {
        "w": "META",
        "t": "يصطاد",
        "s": "Att meta fisk är roligt.",
        "st": "صيد السمك ممتع."
    },
    {
        "w": "MIDDAG",
        "t": "عشاء",
        "s": "Vad blir det till middag?",
        "st": "ماذا للعشاء؟"
    },
    {
        "w": "MILA",
        "t": "كومة فحم / ميل (عامية)",
        "s": "En mila i skogen.",
        "st": "كومة فحم في الغابة."
    },
    {
        "w": "MJÖL",
        "t": "طحين",
        "s": "Vi behöver mjöl för att baka bröd.",
        "st": "نحتاج الطحين لخبز الخبز."
    },
    {
        "w": "MJÖLK",
        "t": "حليب",
        "s": "Barnet dricker ett glas kall mjölk.",
        "st": "يشرب الطفل كوباً من الحليب البارد."
    },
    {
        "w": "MJUK",
        "t": "ناعم",
        "s": "Kudden är väldigt mjuk och skön.",
        "st": "الوسادة ناعمة ومريحة جداً."
    },
    {
        "w": "MÖ",
        "t": "عذراء (قديم)",
        "s": "En ung mö.",
        "st": "فتاة شابة."
    },
    {
        "w": "MOD",
        "t": "شجاعة",
        "s": "Stort mod.",
        "st": "شجاعة كبيرة."
    },
    {
        "w": "MODE",
        "t": "موضة",
        "s": "Hon följer alltid senaste mode.",
        "st": "هي تتبع دائماً أحدث صيحات الموضة."
    },
    {
        "w": "MODER",
        "t": "أم (شكل قديم)",
        "s": "Hans moder var mycket vis.",
        "st": "كانت والدته حكيمة جداً."
    },
    {
        "w": "MODERN",
        "t": "حديث",
        "s": "Det är en modern byggnad.",
        "st": "إنه مبنى حديث."
    },
    {
        "w": "MOLN",
        "t": "سحابة",
        "s": "Ett vitt moln på himlen.",
        "st": "سحابة بيضاء في السماء."
    },
    {
        "w": "MOR",
        "t": "أم",
        "s": "Min mor är mycket snäll och hjälpsam.",
        "st": "أمي لطيفة جداً ومتعاونة."
    },
    {
        "w": "MÖR",
        "t": "طري",
        "s": "Köttet var mycket mört och gott.",
        "st": "كان اللحم طرياً جداً ولذيذاً."
    },
    {
        "w": "MÖRA",
        "t": "طرية",
        "s": "Biffarna var mycket möra och goda.",
        "st": "كانت شرائح اللحم طرية جداً ولذيذة."
    },
    {
        "w": "MORFAR",
        "t": "جد (أب الأم)",
        "s": "Morfar berättar sagor.",
        "st": "جدي يحكي قصصاً."
    },
    {
        "w": "MORR",
        "t": "زمجرة",
        "s": "Hunden gav ifrån sig ett dovt morr.",
        "st": "أصدر الكلب زمجرة خافتة."
    },
    {
        "w": "MOS",
        "t": "هريس / بطاطس مهروسة",
        "s": "Jag gillar korv med varmt mos.",
        "st": "أحب النقانق مع البطاطس المهروسة الساخنة."
    },
    {
        "w": "MOSKE",
        "t": "مسجد",
        "s": "Det finns en vacker moske i staden.",
        "st": "يوجد مسجد جميل في المدينة."
    },
    {
        "w": "MOSKÉ",
        "t": "مسجد",
        "s": "En vacker moské.",
        "st": "مسجد جميل."
    },
    {
        "w": "MOSKEN",
        "t": "المسجد (المعرف)",
        "s": "Många människor går till mosken på fredagar.",
        "st": "يذهب الكثير من الناس إلى المسجد أيام الجمعة."
    },
    {
        "w": "MOSKÉN",
        "t": "المسجد",
        "s": "Vi går till moskén på fredagar.",
        "st": "نذهب إلى المسجد أيام الجمعة."
    },
    {
        "w": "MOT",
        "t": "نحو",
        "s": "He smiled kindly at me.",
        "st": "ابتسم لي بود."
    },
    {
        "w": "MÖTE",
        "t": "اجتماع",
        "s": "Vi har ett viktigt möte.",
        "st": "لدينا اجتماع مهم."
    },
    {
        "w": "MOTOR",
        "t": "محرك",
        "s": "Bilen har en mycket stark motor.",
        "st": "السيارة لها محرك قوي جداً."
    },
    {
        "w": "MUR",
        "t": "جدار",
        "s": "De byggde en hög mur runt huset.",
        "st": "بنوا جداراً عالياً حول المنزل."
    },
    {
        "w": "MUS",
        "t": "فأر",
        "s": "En liten mus.",
        "st": "فأر صغير."
    },
    {
        "w": "MYR",
        "t": "مستنقع",
        "s": "Vi gick över en myr.",
        "st": "مشينا عبر مستنقع."
    },
    {
        "w": "MYRA",
        "t": "نملة",
        "s": "En liten myra kröp på marken.",
        "st": "زحفت نملة صغيرة على الأرض."
    },
    {
        "w": "MYROR",
        "t": "نمل",
        "s": "Myror är mycket starka insekter.",
        "st": "النمل حشرات قوية جداً."
    },
    {
        "w": "NÅ",
        "t": "يصل",
        "s": "Har du nått fram?",
        "st": "هل وصلت؟"
    },
    {
        "w": "NACKE",
        "t": "رقبة",
        "s": "Han har ont i nacken.",
        "st": "لديه ألم في الرقبة."
    },
    {
        "w": "NÅGRA",
        "t": "بعض",
        "s": "Jag har några frågor.",
        "st": "لدي بعض الأسئلة."
    },
    {
        "w": "NÅL",
        "t": "إبرة",
        "s": "nål och tråd",
        "st": "إبرة وخيط"
    },
    {
        "w": "NALKA",
        "t": "يقترب",
        "s": "Vintern nalkas med stormsteg.",
        "st": "الشتاء يقترب بخطى سريعة."
    },
    {
        "w": "NÄR",
        "t": "متى؟",
        "s": "när kommer tåget?",
        "st": "متى سيأتي القطار؟"
    },
    {
        "w": "NÄRA",
        "t": "قريب",
        "s": "Vi bor nära skolan.",
        "st": "نسكن قريباً من المدرسة."
    },
    {
        "w": "NÄRDE",
        "t": "غذى",
        "s": "Han närde en dröm.",
        "st": "كان يغذي حلماً."
    },
    {
        "w": "NÄS",
        "t": "برزخ",
        "s": "Ett näs.",
        "st": "برزخ."
    },
    {
        "w": "NÄSA",
        "t": "أنف",
        "s": "Han har en stor näsa.",
        "st": "لديه أنف كبير."
    },
    {
        "w": "NATO",
        "t": "الناتو",
        "s": "NATO är en försvarsallians.",
        "st": "الناتو تحالف دفاعي."
    },
    {
        "w": "NATT",
        "t": "ليل",
        "s": "Det var en mörk natt.",
        "st": "كانت ليلة مظلمة."
    },
    {
        "w": "NATUR",
        "t": "طبيعة",
        "s": "Sverige har en mycket vacker natur.",
        "st": "تتمتع السويد بطبيعة جميلة جداً."
    },
    {
        "w": "NATUREN",
        "t": "الطبيعة",
        "s": "Vi måste alla hjälpas åt att skydda naturen.",
        "st": "يجب أن نتعاون جميعاً لحماية الطبيعة."
    },
    {
        "w": "NAV",
        "t": "محور",
        "s": "Navet är hjulets viktigaste del.",
        "st": "المحور هو أهم جزء في العجلة."
    },
    {
        "w": "NED",
        "t": "أسفل",
        "s": "Solen går ned.",
        "st": "الشمس تغرب."
    },
    {
        "w": "NEDAN",
        "t": "إلى الأسفل",
        "s": "bilden nedan till vänster",
        "st": "الصورة السُفليّة اليُسرى"
    },
    {
        "w": "NEDRE",
        "t": "سفلي",
        "s": "Nedre våningen.",
        "st": "الطابق السفلي."
    },
    {
        "w": "NERE",
        "t": "مُكْتَئِب",
        "s": "Katten är där nere.",
        "st": "القطة هناك في الأسفل."
    },
    {
        "w": "NERVÖS",
        "t": "مُضطرب, عصبيّ",
        "s": "vara nervös inför en tävling",
        "st": "شعر بقلق قُبَيل المباراة"
    },
    {
        "w": "NI",
        "t": "أنتم",
        "s": "Kommer ni?",
        "st": "هل أنتم جاهزون؟"
    },
    {
        "w": "NIT",
        "t": "خسارة",
        "s": "Det var en nit.",
        "st": "كانت ورقة خاسرة."
    },
    {
        "w": "NOBLA",
        "t": "نبلاء (جمع)",
        "s": "De hade nobla avsikter.",
        "st": "كانت لديهم نوايا نبيلة."
    },
    {
        "w": "NÖD",
        "t": "ضَرُورَة, عَوَز - حاجة - محنة - كرب - خطر",
        "s": "en människa i nöd",
        "st": "إنسان في حالة العوز"
    },
    {
        "w": "NOG",
        "t": "ربما / كاف",
        "s": "Det är nog sant.",
        "st": "ربما يكون ذلك صحيحاً."
    },
    {
        "w": "NORD",
        "t": "شمال",
        "s": "vind mellan nord och nordost",
        "st": "الرياح ما بين شمالية وشمال شرقية"
    },
    {
        "w": "NORPA",
        "t": "يسرق",
        "s": "Norpa.",
        "st": "يسرق."
    },
    {
        "w": "NORR",
        "t": "شمال",
        "s": "Vi bor i norr.",
        "st": "نعيش في الشمال."
    },
    {
        "w": "NORSK",
        "t": "نرويجي",
        "s": "Han är norsk medborgare.",
        "st": "هو مواطن نرويجي."
    },
    {
        "w": "NOT",
        "t": "ملاحظة / نوتة",
        "s": "He wrote a small note in the book.",
        "st": "كتب ملاحظة صغيرة في الكتاب."
    },
    {
        "w": "NÖT",
        "t": "جوز",
        "s": "En hård nöt att knäcka.",
        "st": "جوزة صعبة الكسر."
    },
    {
        "w": "NOTA",
        "t": "فاتورة",
        "s": "Kan vi få notan, tack?",
        "st": "هل يمكننا الحصول على الفاتورة، من فضلك؟"
    },
    {
        "w": "NYCKEL",
        "t": "مفتاح",
        "s": "Jag tappade min nyckel.",
        "st": "أضعت مفتاحي."
    },
    {
        "w": "ÖBO",
        "t": "ساكن جزيرة",
        "s": "Han är en öbo.",
        "st": "هو ساكن جزيرة."
    },
    {
        "w": "ÖDE",
        "t": "قدر/مهجور",
        "s": "en öde ö",
        "st": "هذا قدرك."
    },
    {
        "w": "ODEN",
        "t": "أودين",
        "s": "Oden var en mäktig gud i mytologin.",
        "st": "كان أودين إلهاً قوياً في الأساطير."
    },
    {
        "w": "OENIG",
        "t": "غَير مُتَّفِق",
        "s": "partierna är oeniga ifråga om kärnkraften",
        "st": "كان الطرفان غير مُتَّفِقين حول مسألة الطاقة الذرية"
    },
    {
        "w": "ÖGA",
        "t": "عين",
        "s": "Jag fick skräp i mitt öga.",
        "st": "دخل غبار في عيني."
    },
    {
        "w": "OK",
        "t": "حسناً",
        "s": "Det är helt ok.",
        "st": "حسناً، سأفعل ذلك."
    },
    {
        "w": "ÖKA",
        "t": "يزيد",
        "s": "Vi måste öka farten.",
        "st": "يجب أن نزيد السرعة."
    },
    {
        "w": "ÖKAR",
        "t": "يزيد",
        "s": "Priserna ökar varje år.",
        "st": "الأسعار تزيد كل عام."
    },
    {
        "w": "ÖKNA",
        "t": "لقب",
        "s": "Ett roligt öknamn.",
        "st": "لقب مضحك."
    },
    {
        "w": "ÖL",
        "t": "بيرة",
        "s": "En kall öl.",
        "st": "بيرة باردة."
    },
    {
        "w": "OLJA",
        "t": "زيت",
        "s": "Vi steker maten i olja.",
        "st": "نقلي الطعام في الزيت."
    },
    {
        "w": "OM",
        "t": "حول/إذا",
        "s": "Berätta om det.",
        "st": "أخبرني عن ذلك."
    },
    {
        "w": "ÖM",
        "t": "حساس/مؤلم",
        "s": "Min fot är öm.",
        "st": "قدمي تؤلمني."
    },
    {
        "w": "ÖN",
        "t": "الجزيرة",
        "s": "Vi åkte till ön med båt.",
        "st": "ذهبنا إلى الجزيرة بالقارب."
    },
    {
        "w": "OND",
        "t": "غاضب",
        "s": "Han har ont i magen.",
        "st": "لديه ألم في البطن."
    },
    {
        "w": "OPP",
        "t": "فوق",
        "s": "Opp och hoppa!",
        "st": "انهض واقفز!"
    },
    {
        "w": "ÖRA",
        "t": "أذن",
        "s": "Jag har ont i mitt öra.",
        "st": "أذني تؤلمني."
    },
    {
        "w": "ORANGE",
        "t": "برتقالي",
        "s": "Apelsinen är orange.",
        "st": "البرتقالة برتقالية."
    },
    {
        "w": "ORD",
        "t": "كلمة",
        "s": "Ett vänligt ord betyder mycket.",
        "st": "كلمة لطيفة تعني الكثير."
    },
    {
        "w": "ORDNAR",
        "t": "يُنَظِّم",
        "s": "Jag ordnar festen.",
        "st": "أنا أنظم الحفلة."
    },
    {
        "w": "ÖRE",
        "t": "أوره",
        "s": "det stämmer på öret",
        "st": "الحساب مضبوط بالأوره"
    },
    {
        "w": "ORGAN",
        "t": "عضو (جسم/موسيقى)",
        "s": "Hjärtat är ett viktigt organ.",
        "st": "القلب عضو مهم."
    },
    {
        "w": "ORK",
        "t": "طاقة",
        "s": "Jag har ingen ork.",
        "st": "ليس لدي طاقة."
    },
    {
        "w": "ORKAN",
        "t": "إعصار",
        "s": "En orkan närmar sig kusten.",
        "st": "إعصار يقترب من الساحل."
    },
    {
        "w": "ORM",
        "t": "ثعبان",
        "s": "Jag såg en orm i skogen igår.",
        "st": "رأيت ثعباناً في الغابة البارحة."
    },
    {
        "w": "ORMA",
        "t": "يتلوى (كثعبان)",
        "s": "Kön ormar sig fram.",
        "st": "الطابور يتلوى."
    },
    {
        "w": "ORMAR",
        "t": "ثعابين",
        "s": "Jag är rädd för ormar.",
        "st": "أنا خائف من الثعابين."
    },
    {
        "w": "ÖRN",
        "t": "نسر",
        "s": "Örnen flyger högt över bergen.",
        "st": "النسر يطير عالياً فوق الجبال."
    },
    {
        "w": "ORO",
        "t": "قلق",
        "s": "Jag känner en viss oro för framtiden.",
        "st": "أشعر ببعض القلق تجاه المستقبل."
    },
    {
        "w": "ORSAK",
        "t": "سبب",
        "s": "Vad var orsaken till olyckan?",
        "st": "ما كان سبب الحادث؟"
    },
    {
        "w": "ORT",
        "t": "منطقة / مكان",
        "s": "Vi bor på en liten ort in norr.",
        "st": "نعيش في منطقة صغيرة في الشمال."
    },
    {
        "w": "ÖRT",
        "t": "عشب",
        "s": "Timjan är en doftande ört.",
        "st": "الزعتر عشب فواح."
    },
    {
        "w": "ORTEN",
        "t": "الحي",
        "s": "Från orten.",
        "st": "من الحي."
    },
    {
        "w": "ORTER",
        "t": "أماكن",
        "s": "Vi besökte vackra orter.",
        "st": "زرنا أماكن جميلة."
    },
    {
        "w": "OS",
        "t": "دخان / رائحة كريهة",
        "s": "Det luktar os från köket.",
        "st": "تفوح رائحة دخان من المطبخ."
    },
    {
        "w": "OST",
        "t": "جبن",
        "s": "Jag älskar ost på mackan.",
        "st": "أحب الجبن على الشطيرة."
    },
    {
        "w": "ÖST",
        "t": "شرق",
        "s": "Solen går upp i öst.",
        "st": "الشمس تشرق من الشرق."
    },
    {
        "w": "OSTAR",
        "t": "أجبان",
        "s": "Vi provade olika ostar.",
        "st": "جربنا أجباناً مختلفة."
    },
    {
        "w": "ÖSTER",
        "t": "شرق",
        "s": "Solen går alltid upp i öster.",
        "st": "الشمس تشرق دائماً من الشرق."
    },
    {
        "w": "ÖT",
        "t": "فوق الوقت (عامية)",
        "s": "Han jobbade övertid.",
        "st": "عمل إضافي."
    },
    {
        "w": "OTAKT",
        "t": "عدم انتظام",
        "s": "komma i otakt",
        "st": "حالة عدم انتظام"
    },
    {
        "w": "OTAL",
        "t": "لا يُحصى",
        "s": "Ett otal gånger.",
        "st": "مرات لا تحصى."
    },
    {
        "w": "OTUR",
        "t": "سوء حظ",
        "s": "han hade oturen att missa tåget",
        "st": "لسوء الحظ فاته القطار"
    },
    {
        "w": "ÖVRE",
        "t": "علوي",
        "s": "i övre delen av backen",
        "st": "في الجزء العلوي من الهضبة"
    },
    {
        "w": "PÅ",
        "t": "على",
        "s": "Det är skönt att ligga på soffan.",
        "st": "من الرائع الاستلقاء على الأريكة."
    },
    {
        "w": "PACKA",
        "t": "يحزم",
        "s": "Vi måste packa väskorna.",
        "st": "يجب أن نحزم الحقائب."
    },
    {
        "w": "PAKET",
        "t": "طرد / حزمة",
        "s": "Jag fick ett stort paket med posten.",
        "st": "تلقيت طرداً كبيراً بالبريد."
    },
    {
        "w": "PALM",
        "t": "نخلة",
        "s": "En hög palm växte vid stranden.",
        "st": "نمت نخلة طويلة عند الشاطئ."
    },
    {
        "w": "PANN",
        "t": "مقدمة (في مركبات)",
        "s": "Pannlampa är bra i mörkret.",
        "st": "مصباح الجبهة جيد في الظلام."
    },
    {
        "w": "PANNA",
        "t": "جبهة / مقلاة",
        "s": "Han kände på hennes panna.",
        "st": "تحسس جبهتها."
    },
    {
        "w": "PAR",
        "t": "زوجان",
        "s": "ett par skor ett äkta par",
        "st": "زوجا أحذية زوجان شرعيّان"
    },
    {
        "w": "PÅSAR",
        "t": "أكياس",
        "s": "Vi bar hem maten i stora påsar.",
        "st": "حملنا الطعام إلى المنزل في أكياس كبيرة."
    },
    {
        "w": "PÅSE",
        "t": "كيس",
        "s": "Jag bär maten in en påse.",
        "st": "أحمل الطعام في كيس."
    },
    {
        "w": "PÅSEN",
        "t": "الكيس",
        "s": "Påsen är tung.",
        "st": "الكيس ثقيل."
    },
    {
        "w": "PASS",
        "t": "جواز سفر",
        "s": "Glöm inte ditt pass.",
        "st": "لا تنس جواز سفرك."
    },
    {
        "w": "PASTA",
        "t": "معكرونة",
        "s": "Vi äter pasta idag.",
        "st": "نأكل المعكرونة اليوم."
    },
    {
        "w": "PASTOR",
        "t": "قس",
        "s": "Pastorn predikade i kyrkan.",
        "st": "القس وعظ في الكنيسة."
    },
    {
        "w": "PATOS",
        "t": "شعور, عاطفة",
        "s": "hennes politiska patos",
        "st": "مشاعرها السياسيّة"
    },
    {
        "w": "PENGAR",
        "t": "نقود",
        "s": "Har du några pengar?",
        "st": "هل لديك أي نقود؟"
    },
    {
        "w": "PENNA",
        "t": "قلم",
        "s": "Jag skriver med en blå penna.",
        "st": "أكتب بقلم أزرق."
    },
    {
        "w": "PENNOR",
        "t": "أقلام",
        "s": "Jag har många färgglada pennor.",
        "st": "لدي العديد من الأقلام الملونة."
    },
    {
        "w": "PENSION",
        "t": "تقاعد",
        "s": "Han gick i pension vid 65 års ålder.",
        "st": "تقاعد في سن الخامسة والستين."
    },
    {
        "w": "PEPPAR",
        "t": "فلفل",
        "s": "Peppar är starkt.",
        "st": "الفلفل حار."
    },
    {
        "w": "PER",
        "t": "اسم",
        "s": "Per är ett namn.",
        "st": "بير هو اسم."
    },
    {
        "w": "PEST",
        "t": "طاعون",
        "s": "Pesten var en hemsk sjukdom.",
        "st": "الطاعون كان مرضاً فظيعاً."
    },
    {
        "w": "PET",
        "t": "نكز",
        "s": "En lätt pet i sidan.",
        "st": "نكزة خفيفة في الجانب."
    },
    {
        "w": "PIL",
        "t": "سهم",
        "s": "En pil pekar åt höger.",
        "st": "سهم يشير إلى اليمين."
    },
    {
        "w": "PILOT",
        "t": "طيار",
        "s": "Piloten flyger planet säkert.",
        "st": "الطيار يقود الطائرة بأمان."
    },
    {
        "w": "PILT",
        "t": "صبي",
        "s": "En liten pilt lekte på gården.",
        "st": "صبي صغير كان يلعب في الفناء."
    },
    {
        "w": "PION",
        "t": "فاوانيا",
        "s": "En vacker pion blommar i trädgården.",
        "st": "زهرة فاوانيا جميلة تزهر في الحديقة."
    },
    {
        "w": "PLAN",
        "t": "طائرة / خطة",
        "s": "Vi har en plan.",
        "st": "لدينا خطة."
    },
    {
        "w": "PLANET",
        "t": "كوكب",
        "s": "Jorden är en planet.",
        "st": "الأرض كوكب."
    },
    {
        "w": "PLAST",
        "t": "بلاستيك",
        "s": "Flaskan är gjord av plast.",
        "st": "الزجاجة مصنوعة من البلاستيك."
    },
    {
        "w": "PLÅSTER",
        "t": "لاصق جروح",
        "s": "Sätt ett plåster på såret.",
        "st": "ضع لاصق جروح على الجرح."
    },
    {
        "w": "PLATS",
        "t": "مكان",
        "s": "Var vänlig och ta plats i väntrummet.",
        "st": "تفضل بالجلوس في غرفة الانتظار."
    },
    {
        "w": "PLIKT",
        "t": "واجب",
        "s": "Det är din plikt att hjälpa till.",
        "st": "إنه واجبك أن تساعد."
    },
    {
        "w": "PLUS",
        "t": "زائد",
        "s": "Det är ett stort plus i kanten.",
        "st": "هذه ميزة إضافية كبيرة."
    },
    {
        "w": "POET",
        "t": "شاعر",
        "s": "Han var en känd poet.",
        "st": "كان شاعراً مشهوراً."
    },
    {
        "w": "POL",
        "t": "قطب",
        "s": "Nordpolen är täckt av is.",
        "st": "القطب الشمالي مغطى بالجليد."
    },
    {
        "w": "POLIS",
        "t": "شرطة",
        "s": "Ring polisen om du ser något.",
        "st": "اتصل بالشرطة إذا رأيت شيئاً."
    },
    {
        "w": "POP",
        "t": "بوب",
        "s": "Han gillar pop musik.",
        "st": "هو يحب موسيقى البوب."
    },
    {
        "w": "PORT",
        "t": "بوابة",
        "s": "Vi gick in genom den stora porten.",
        "st": "دخلنا عبر البوابة الكبيرة."
    },
    {
        "w": "POSERAR",
        "t": "يَتَّخذ وضعاً متكلفاً",
        "s": "hon poserar framför kameran",
        "st": "تَتَّخذ وضعاً أمام الكاميرا"
    },
    {
        "w": "POSTA",
        "t": "يرسل بالبريد",
        "s": "Jag ska posta brevet.",
        "st": "سأرسل الرسالة بالبريد."
    },
    {
        "w": "POSTER",
        "t": "ملصقات / بنود",
        "s": "Det hänger många poster på väggen.",
        "st": "هناك العديد من الملصقات معلقة على الجدار."
    },
    {
        "w": "PRAT",
        "t": "ثَرثرة",
        "s": "det är bara löst prat",
        "st": "هذه مجرد ثرثرة"
    },
    {
        "w": "PRIS",
        "t": "سعر / جائزة",
        "s": "Vad är det för pris?",
        "st": "ما هو السعر؟"
    },
    {
        "w": "PRO",
        "t": "لصالح",
        "s": "Han är pro fred.",
        "st": "هو مؤيد للسلام."
    },
    {
        "w": "PROFET",
        "t": "نبي",
        "s": "En profet kommer med budskap från Gud.",
        "st": "النبي يأتي برسالة من الله."
    },
    {
        "w": "PROV",
        "t": "اختبار / عينة",
        "s": "Vi har prov in matematik imorgon.",
        "st": "لدينا اختبار في الرياضيات غداً."
    },
    {
        "w": "PROVA",
        "t": "يجرب",
        "s": "Prova.",
        "st": "يجرب."
    },
    {
        "w": "PULS",
        "t": "نبض",
        "s": "Känn din puls.",
        "st": "تحسس نبضك."
    },
    {
        "w": "RÅ",
        "t": "نيء",
        "s": "Köttet är rått.",
        "st": "لحم نيء."
    },
    {
        "w": "RÅA",
        "t": "نيئة",
        "s": "Grönsakerna är godast råa.",
        "st": "الخضروات ألذ وهي نيئة."
    },
    {
        "w": "RAD",
        "t": "مجموعة",
        "s": "Stå i en rad.",
        "st": "قف في صف."
    },
    {
        "w": "RADA",
        "t": "يصف / يرتب",
        "s": "Rada upp böckerna på hyllan.",
        "st": "رتب الكتب على الرف."
    },
    {
        "w": "RADER",
        "t": "صفوف",
        "s": "Skriv två rader.",
        "st": "اكتب صفين."
    },
    {
        "w": "RADERGUMMI",
        "t": "ممحاة",
        "s": "Jag använder radergummi.",
        "st": "أستخدم الممحاة."
    },
    {
        "w": "RAFSA",
        "t": "يجمع بسرعة",
        "s": "Rafsa ihop.",
        "st": "يجمع بسرعة."
    },
    {
        "w": "RÅG",
        "t": "جاودار",
        "s": "Detta bröd är bakat av råg.",
        "st": "هذا الخبز مخبوز من الجاودار."
    },
    {
        "w": "RÅGAD",
        "t": "طافح",
        "s": "en rågad sked",
        "st": "ملعقة طافحة"
    },
    {
        "w": "RAK",
        "t": "مستقيم",
        "s": "Rita en rak linje med linjalen.",
        "st": "ارسم خطاً مستقيماً بالمسطرة."
    },
    {
        "w": "RAKA",
        "t": "مستقيم",
        "s": "Gå raka vägen hem.",
        "st": "اذهب مباشرة إلى المنزل."
    },
    {
        "w": "RÄKA",
        "t": "روبيان",
        "s": "Jag åt en räka.",
        "st": "أكلت روبيانة."
    },
    {
        "w": "RAKAR",
        "t": "يَحْلِق ذَقْنَه",
        "s": "han rakar sig bara varannan dag",
        "st": "يحلق ذقنه مرة كل يومين فقط"
    },
    {
        "w": "RAKAS",
        "t": "يحلق (مبني للمجهول)",
        "s": "Skägget rakas av hos frisören.",
        "st": "تحلق اللحية عند الحلاق."
    },
    {
        "w": "RAKET",
        "t": "صاروخ",
        "s": "En snabb raket.",
        "st": "صاروخ سريع."
    },
    {
        "w": "RÄKNA",
        "t": "يحسب",
        "s": "Kan du räkna till tio?",
        "st": "هل يمكنك العد إلى عشرة؟"
    },
    {
        "w": "RÄKNAR",
        "t": "يحسب",
        "s": "Han räknar sina pengar.",
        "st": "هو يحسب نقوده."
    },
    {
        "w": "RÄLS",
        "t": "قضيب ( من قضبان السكة الحديدية )",
        "s": "tåget går på räls",
        "st": "يسير القطار على السكة الحديدية"
    },
    {
        "w": "RAMAR",
        "t": "إطارات",
        "s": "Fina ramar.",
        "st": "إطارات جميلة."
    },
    {
        "w": "RÅNAR",
        "t": "يسرق",
        "s": "Han rånar banken.",
        "st": "هو يسرق البنك."
    },
    {
        "w": "RÅNARE",
        "t": "لص / سارق",
        "s": "Polisen grep rånaren.",
        "st": "الشرطة قبضت على السارق."
    },
    {
        "w": "RÄNDE",
        "t": "نسج / ركض (قديم)",
        "s": "Hon rände väven igår.",
        "st": "نسجت النسيج أمس."
    },
    {
        "w": "RANKA",
        "t": "كرمة / غير مستقر",
        "s": "Vinranka.",
        "st": "كرمة عنب."
    },
    {
        "w": "RÄNNA",
        "t": "مزراب",
        "s": "En ränna.",
        "st": "مزراب."
    },
    {
        "w": "RÄNTA",
        "t": "فائدة",
        "s": "Ränta på ränta ger stor effekt.",
        "st": "الفائدة المركبة تعطي تأثيراً كبيراً."
    },
    {
        "w": "RAPP",
        "t": "سريع",
        "s": "ett rappt svar",
        "st": "إجابة سريعة"
    },
    {
        "w": "RAPS",
        "t": "لفت",
        "s": "Gula fält av raps.",
        "st": "حقول صفراء من اللفت."
    },
    {
        "w": "RAS",
        "t": "انهيار",
        "s": "Det gick ett ras i bergen.",
        "st": "حدث انهيار في الجبال."
    },
    {
        "w": "RASAR",
        "t": "ينهار",
        "s": "Huset rasar.",
        "st": "المنزل ينهار."
    },
    {
        "w": "RASAT",
        "t": "انهار",
        "s": "Taket har rasat in.",
        "st": "لقد انهار السقف."
    },
    {
        "w": "RASET",
        "t": "الانهيار",
        "s": "Raset blockerade vägen.",
        "st": "الانهيار سد الطريق."
    },
    {
        "w": "RASK",
        "t": "سَريع",
        "s": "gå med raska steg",
        "st": "سار بخطىً سريعة"
    },
    {
        "w": "RAST",
        "t": "استراحة",
        "s": "Barnen leker ute på sin rast.",
        "st": "الأطفال يلعبون في الخارج خلال استراحتهم."
    },
    {
        "w": "RASTER",
        "t": "استراحات",
        "s": "Vi har två raster varje dag.",
        "st": "لدينا استراحتان كل يوم."
    },
    {
        "w": "RÅT",
        "t": "نيء",
        "s": "Man ska inte äta rått kött.",
        "st": "لا ينبغي أكل اللحم الني."
    },
    {
        "w": "RÄT",
        "t": "مستقيم",
        "s": "en rät linje",
        "st": "مستقيم خط"
    },
    {
        "w": "RATA",
        "t": "يرفض",
        "s": "Man ska inte rata mat.",
        "st": "لا ينبغي رفض الطعام."
    },
    {
        "w": "RATT",
        "t": "مِقْوَد",
        "s": "sitta vid ratten",
        "st": "جلس وراء عجلة القيادة"
    },
    {
        "w": "RÄTT",
        "t": "حق / صحيح",
        "s": "Alla har rätt till en advokat.",
        "st": "للجميع الحق في محام."
    },
    {
        "w": "RATTER",
        "t": "عجلات قيادة",
        "s": "Bilen har två ratter (övningsbil).",
        "st": "السيارة لها عجلتا قيادة (سيارة تدريب)."
    },
    {
        "w": "RÄV",
        "t": "ثعلب",
        "s": "En röd räv i skogen.",
        "st": "ثعلب أحمر في الغابة."
    },
    {
        "w": "REA",
        "t": "تخفيضات",
        "s": "Det är stor rea på kläder nu.",
        "st": "هناك تخفيضات كبيرة على الملابس الآن."
    },
    {
        "w": "RECEPT",
        "t": "وصفة طبية",
        "s": "Läkaren skrev ett recept.",
        "st": "كتب الطبيب وصفة طبية."
    },
    {
        "w": "RED",
        "t": "ركب",
        "s": "Han red på en ståtlig häst.",
        "st": "ركب حصاناً مهيباً."
    },
    {
        "w": "REDIG",
        "t": "جَلِيّ",
        "s": "ett redigt och klart resonemang",
        "st": "نقاش واضح وجليّ"
    },
    {
        "w": "REGEL",
        "t": "قاعدة",
        "s": "Ingen regel utan undantag.",
        "st": "لا توجد قاعدة بدون استثناء."
    },
    {
        "w": "REGI",
        "t": "إخراج",
        "s": "regi och dekor",
        "st": "إخراج و ديكور"
    },
    {
        "w": "REGLA",
        "t": "يغلق بمزلاج",
        "s": "Regla dörren ordentligt.",
        "st": "أغلق الباب بالمزلاج جيداً."
    },
    {
        "w": "REGLER",
        "t": "قواعد",
        "s": "Det finns regler man måste följa.",
        "st": "هناك قواعد يجب اتباعها."
    },
    {
        "w": "REGN",
        "t": "مطر",
        "s": "Vi behöver regn för växterna.",
        "st": "نحتاج المطر للنباتات."
    },
    {
        "w": "REGNA",
        "t": "تمطر",
        "s": "Det ska regna hela dagen.",
        "st": "ستنهمر الأمطار طوال اليوم."
    },
    {
        "w": "REKA",
        "t": "يستطلع",
        "s": "Vi måste reka området först.",
        "st": "يجب أن نستطلع المنطقة أولاً."
    },
    {
        "w": "REN",
        "t": "نظيف / رنة",
        "s": "Luften är ren och frisk i bergen.",
        "st": "الهواء نظيف ومنعش في الجبال."
    },
    {
        "w": "RENAR",
        "t": "حيوانات الرنة",
        "s": "Många renar i norr.",
        "st": "الكثير من الرنة في الشمال."
    },
    {
        "w": "RENS",
        "t": "بقايا / أحشاء",
        "s": "Kasta allt rens i soptunnan.",
        "st": "ارمِ كل البقايا في القمامة."
    },
    {
        "w": "RENSA",
        "t": "ينظف / يزيل",
        "s": "Rensa fisken.",
        "st": "نظف السمكة."
    },
    {
        "w": "REP",
        "t": "حبل",
        "s": "Barnen hoppar rep på skolgården.",
        "st": "الأطفال يقفزون بالحبل في فناء المدرسة."
    },
    {
        "w": "REPA",
        "t": "خَدْش",
        "s": "en repa i lacken",
        "st": "خَدْش في الدهان"
    },
    {
        "w": "REPAN",
        "t": "الخدش",
        "s": "Repan i lacken var djup.",
        "st": "الخدش في الطلاء كان عميقاً."
    },
    {
        "w": "RES",
        "t": "سافر (أمر)",
        "s": "Res dig upp och gå!",
        "st": "انهض وامشِ!"
    },
    {
        "w": "RESA",
        "t": "سفر / رحلة",
        "s": "Vi ska göra en lång resa.",
        "st": "سنقوم برحلة طويلة."
    },
    {
        "w": "RESAN",
        "t": "الرحلة",
        "s": "Resan var lång.",
        "st": "الرحلة كانت طويلة."
    },
    {
        "w": "RESÄR",
        "t": "مطاط",
        "s": "Byxorna har resår i midjan.",
        "st": "السراويل لها مطاط في الخصر."
    },
    {
        "w": "RESOR",
        "t": "رحلات",
        "s": "Mina resor har lärt mig mycket.",
        "st": "رحلاتي علمتني الكثير."
    },
    {
        "w": "REST",
        "t": "سافر",
        "s": "Vi har rest hela dagen.",
        "st": "سافرنا طوال اليوم."
    },
    {
        "w": "RESTAR",
        "t": "بقايا (شكل نادر)",
        "s": "Inga restar fanns kvar.",
        "st": "لم تبق أي بقايا."
    },
    {
        "w": "RET",
        "t": "إغاظة",
        "s": "Han gjorde det bara på ret.",
        "st": "فعل ذلك فقط للإغاظة."
    },
    {
        "w": "RETAR",
        "t": "يغيظ",
        "s": "Han retar sin syster.",
        "st": "هو يغيظ أخته."
    },
    {
        "w": "RETAS",
        "t": "يغيظ",
        "s": "Barnen retas ibland.",
        "st": "الأطفال يغيظون بعضهم أحياناً."
    },
    {
        "w": "REV",
        "t": "شقوق / صدع",
        "s": "Det blev en rev i kläd",
        "st": "حدث شق في الملابس."
    },
    {
        "w": "REVS",
        "t": "هُدم",
        "s": "Huset revs.",
        "st": "هُدم المنزل."
    },
    {
        "w": "RID",
        "t": "اركب (أمر)",
        "s": "Rid försiktigt.",
        "st": "اركب بحذر."
    },
    {
        "w": "RIDIT",
        "t": "ركب (الماضي)",
        "s": "Hon har ridit in många år.",
        "st": "لقد ركبت الخيل لسنوات عديدة."
    },
    {
        "w": "RIK",
        "t": "ثَريّ",
        "s": "en rik kvinna",
        "st": "امرأة ثريّة"
    },
    {
        "w": "RIKA",
        "t": "أغنياء",
        "s": "De är rika på erfarenheter.",
        "st": "هم أغنياء بالتجارب."
    },
    {
        "w": "RIKARE",
        "t": "أغنى",
        "s": "De rika blir allt rikare.",
        "st": "الأغنياء يزدادون غنى."
    },
    {
        "w": "RIKE",
        "t": "دولة",
        "s": "fara land och rike runt",
        "st": "تَجَوَّل في أنحاء البلاد"
    },
    {
        "w": "RING",
        "t": "خاتم",
        "s": "Hon bär en vacker guldring på fingret.",
        "st": "ترتدي خاتماً ذهبياً جميلاً في إصبعها."
    },
    {
        "w": "RINGA",
        "t": "يتصل / قليل",
        "s": "Kan du ringa mig imorgon?",
        "st": "هل يمكنك الاتصال بي غداً؟"
    },
    {
        "w": "RIS",
        "t": "أرز / أغصان",
        "s": "Vi äter ris till middag.",
        "st": "نأكل الأرز للعشاء."
    },
    {
        "w": "RISK",
        "t": "خطر",
        "s": "Det är en stor risk.",
        "st": "إنها مخاطرة كبيرة."
    },
    {
        "w": "RITEN",
        "t": "الطقس",
        "s": "Riten utfördes med stort allvar.",
        "st": "أقيمت الطقوس بجدية كبيرة."
    },
    {
        "w": "RIV",
        "t": "مزق",
        "s": "Riv inte sönder den viktiga biljetten.",
        "st": "لا تمزق التذكرة المهمة."
    },
    {
        "w": "RIVA",
        "t": "يهدم / يمزق",
        "s": "De ska riva det gamla huset.",
        "st": "سيهدمون المنزل القديم."
    },
    {
        "w": "RO",
        "t": "سكينة / هدوء",
        "s": "Jag känner ro i själen.",
        "st": "أشعر بالسكينة في الروح."
    },
    {
        "w": "RÖD",
        "t": "أحمر",
        "s": "röd tråd ( sammanhang )",
        "st": "خيط دليلي ( سياق الكلام )"
    },
    {
        "w": "RODA",
        "t": "يجذف",
        "s": "Att roda båten.",
        "st": "أن تجذف القارب."
    },
    {
        "w": "RÖDA",
        "t": "حمر",
        "s": "Hon fick röda rosor på sin födelsedag.",
        "st": "حصلت على ورود حمراء في عيد ميلادها."
    },
    {
        "w": "RODER",
        "t": "دفة",
        "s": "Han styrde båten med ett roder.",
        "st": "وجه القارب بالدفة."
    },
    {
        "w": "RÖK",
        "t": "دخان",
        "s": "Ingen rök utan eld.",
        "st": "لا دخان بلا نار."
    },
    {
        "w": "RÖKTE",
        "t": "دخن (الماضي)",
        "s": "Han rökte en cigarr.",
        "st": "دخن سيجاراً."
    },
    {
        "w": "ROLL",
        "t": "دَوْر",
        "s": "spela rollen som Hamlet",
        "st": "أدّى دور هاملت"
    },
    {
        "w": "ROM",
        "t": "بطرخ / روما",
        "s": "Alla vägar bär till Rom.",
        "st": "كل الطرق تؤدي إلى روما."
    },
    {
        "w": "RÖN",
        "t": "إكتشاف",
        "s": "Nya rön om hälsa.",
        "st": "اكتشافات جديدة حول الصحة."
    },
    {
        "w": "ROND",
        "t": "دَورة",
        "s": "läkaren gick ronden",
        "st": "قام الطبيب بجولة استطلاع"
    },
    {
        "w": "RÖNN",
        "t": "شجرة الغبيراء",
        "s": "Rönnens bär är röda på hösten.",
        "st": "توت الغبيراء أحمر في الخريف."
    },
    {
        "w": "ROP",
        "t": "نداء",
        "s": "Ett rop på hjälp hördes.",
        "st": "سُمع نداء طلب للمساعدة."
    },
    {
        "w": "ROPAR",
        "t": "ينادي",
        "s": "Någon ropar på dig.",
        "st": "شخص ما يناديك."
    },
    {
        "w": "ROPEN",
        "t": "الصرخات",
        "s": "Ropen skallade över torget.",
        "st": "دوت الصرخات في الساحة."
    },
    {
        "w": "ROPET",
        "t": "النداء / الصرخة",
        "s": "Vi hörde ropet från skogen.",
        "st": "سمعنا النداء من الغابة."
    },
    {
        "w": "RÖR",
        "t": "أنبوب",
        "s": "Vattnet rinner i rör.",
        "st": "الماء يجري في الأنابيب."
    },
    {
        "w": "RORA",
        "t": "فوضى / خليط",
        "s": "Det var en enda rora i rummet.",
        "st": "كانت الغرفة في فوضى عارمة."
    },
    {
        "w": "RÖRA",
        "t": "فوضى",
        "s": "Vilken röra du har ställt till med!",
        "st": "يا لها من فوضى تسببت بها!"
    },
    {
        "w": "RÖRD",
        "t": "مُتَأثّر",
        "s": "alla var djupt rörda",
        "st": "تأثر الجميع بصورة كبيرة"
    },
    {
        "w": "ROS",
        "t": "وردة",
        "s": "Ingen ros utan taggar.",
        "st": "لا وردة بدون أشواك."
    },
    {
        "w": "RÖS",
        "t": "رجم",
        "s": "Ett gammalt rös.",
        "st": "رجم قديم."
    },
    {
        "w": "ROSA",
        "t": "وردي",
        "s": "Hon gillar rosa kläder.",
        "st": "هي تحب الملابس الوردية."
    },
    {
        "w": "ROST",
        "t": "صدأ",
        "s": "Det finns rost på den gamla cykeln.",
        "st": "يوجد صدأ على الدراجة القديمة."
    },
    {
        "w": "RÖST",
        "t": "صوت",
        "s": "Han talade med låg röst.",
        "st": "تحدث بصوت منخفض."
    },
    {
        "w": "ROSTA",
        "t": "يحمص / يصدأ",
        "s": "Järnet rostar.",
        "st": "الحديد يصدأ."
    },
    {
        "w": "ROSTAR",
        "t": "يحمص / يصدأ",
        "s": "Han rostar bröd till frukost.",
        "st": "هو يحمص الخبز للإفطار."
    },
    {
        "w": "ROSTBIFF",
        "t": "روست بيف",
        "s": "Rostbiff med potatissallad.",
        "st": "روست بيف مع سلطة البطاطس."
    },
    {
        "w": "ROT",
        "t": "جذر",
        "s": "Trädets rot är djup.",
        "st": "جذر الشجرة عميق."
    },
    {
        "w": "ROTOR",
        "t": "دوار",
        "s": "Rotor.",
        "st": "دوار."
    },
    {
        "w": "ROTT",
        "t": "جذف (ماضي)",
        "s": "Vi har rott hela vägen.",
        "st": "لقد جذفنا طوال الطريق."
    },
    {
        "w": "ROV",
        "t": "فريسة",
        "s": "Lejonet fångade sitt rov.",
        "st": "اصطاد الأسد فريسته."
    },
    {
        "w": "RUIN",
        "t": "أنقاض",
        "s": "Huset är en ruin.",
        "st": "المنزل عبارة عن حطام."
    },
    {
        "w": "RULLA",
        "t": "يدحرج",
        "s": "Rulla en boll.",
        "st": "دحرج كرة."
    },
    {
        "w": "RUM",
        "t": "غرفة",
        "s": "Detta är mitt eget lilla rum.",
        "st": "هذه غرفتي الصغيرة الخاصة."
    },
    {
        "w": "RUNA",
        "t": "الأبجدية الرونية",
        "s": "En gammal runa på stenen.",
        "st": "حرف رونية قديم على الحجر."
    },
    {
        "w": "RUND",
        "t": "مستدير",
        "s": "Bollen är rund.",
        "st": "الكرة مستديرة."
    },
    {
        "w": "RUNDA",
        "t": "جَوْلة",
        "s": "gå en runda",
        "st": "تَجَوّل الطبيب على المرضى , قام بِجَولة"
    },
    {
        "w": "RUNT",
        "t": "حول",
        "s": "Han seglade jorden runt ensam.",
        "st": "أبحر حول العالم بمفرده."
    },
    {
        "w": "RUS",
        "t": "نَشْوة",
        "s": "Han sov ruset av sig.",
        "st": "نام ليزول عنه السكر."
    },
    {
        "w": "RUSA",
        "t": "يندفع",
        "s": "Du behöver inte rusa iväg så fort.",
        "st": "لا داعي للاندفاع والمغادرة بهذه السرعة."
    },
    {
        "w": "RUSK",
        "t": "عاصفة",
        "s": "regn och rusk",
        "st": "مطر وعواصف"
    },
    {
        "w": "RUST",
        "t": "صدأ (شكل نادر)",
        "s": "Gammal rust på bilen.",
        "st": "صدأ قديم على السيارة."
    },
    {
        "w": "RUTA",
        "t": "مربع",
        "s": "Rita en ruta på papperet.",
        "st": "ارسم مربعاً على الورقة."
    },
    {
        "w": "RYGG",
        "t": "ظهر",
        "s": "Han har ont i ryggen.",
        "st": "لديه ألم في الظهر."
    },
    {
        "w": "RYK",
        "t": "دخن",
        "s": "Ryk ihop och sluta bråka!",
        "st": "تماسكوا وتوقفوا عن الشجار!"
    },
    {
        "w": "RYNKA",
        "t": "تجعد",
        "s": "En rynka i pannan.",
        "st": "تجعد في الجبهة."
    },
    {
        "w": "RYSER",
        "t": "يرتجف",
        "s": "Jag ryser av kyla.",
        "st": "أرتجف من البرد."
    },
    {
        "w": "SÅ",
        "t": "يزرع",
        "s": "Man måste så ett frö för att skörda.",
        "st": "يجب أن تزرع بذرة لتحصد."
    },
    {
        "w": "SADLA",
        "t": "يسرج",
        "s": "Sadla hästen.",
        "st": "اسرج الحصان."
    },
    {
        "w": "SAFT",
        "t": "عصير",
        "s": "Barnen dricker saft.",
        "st": "الأطفال يشربون العصير."
    },
    {
        "w": "SAK",
        "t": "شيء",
        "s": "Det är en annan sak.",
        "st": "هذا شيء آخر."
    },
    {
        "w": "SAKNAR",
        "t": "يفتقر",
        "s": "checken saknar täckning",
        "st": "يفتقر الشيك إلى تغطية نقدية"
    },
    {
        "w": "SAL",
        "t": "قاعة",
        "s": "Vi skrev provet i en stor sal.",
        "st": "كتبنا الامتحان في قاعة كبيرة."
    },
    {
        "w": "SÄL",
        "t": "فقمة",
        "s": "En säl simmade i havet.",
        "st": "سبحت فقمة في البحر."
    },
    {
        "w": "SALA",
        "t": "يملح (السمك)",
        "s": "Man måste sala fisken väl.",
        "st": "يجب تمليح السمك جيداً."
    },
    {
        "w": "SALAR",
        "t": "قاعات",
        "s": "Slottet har många vackra salar.",
        "st": "يحتوي القصر على العديد من القاعات الجميلة."
    },
    {
        "w": "SALEN",
        "t": "القاعة",
        "s": "Salen var full av folk.",
        "st": "كانت القاعة مليئة بالناس."
    },
    {
        "w": "SÄLJ",
        "t": "بِع (أمر)",
        "s": "Sälj bilen nu.",
        "st": "بع السيارة الآن."
    },
    {
        "w": "SÄLJA",
        "t": "يبيع",
        "s": "Han ska sälja sitt hus.",
        "st": "سيبيع منزله."
    },
    {
        "w": "SÅLLA",
        "t": "يغربل",
        "s": "Sålla mjölet.",
        "st": "غربل الدقيق."
    },
    {
        "w": "SALLAD",
        "t": "سلطة",
        "s": "Jag vill ha en fräsch sallad.",
        "st": "أريد سلطة طازجة."
    },
    {
        "w": "SALT",
        "t": "ملح",
        "s": "Soppan behöver lite mer salt.",
        "st": "الحساء يحتاج القليل من الملح الإضافي."
    },
    {
        "w": "SALTA",
        "t": "يمالح",
        "s": "Salta maten.",
        "st": "ملح الطعام."
    },
    {
        "w": "SALTET",
        "t": "الملح",
        "s": "Var är saltet?",
        "st": "أين الملح؟"
    },
    {
        "w": "SALU",
        "t": "بَيع",
        "s": "till salu ( till försäljning )",
        "st": "للبيع"
    },
    {
        "w": "SAM",
        "t": "سام (اسم)",
        "s": "Sam och jag går i samma klass.",
        "st": "أنا وسام في نفس الصف."
    },
    {
        "w": "SAMLA",
        "t": "يجمع",
        "s": "Vi ska samla in pengar.",
        "st": "سنجمع المال."
    },
    {
        "w": "SAMS",
        "t": "مُتَّفِق",
        "s": "barnen kan aldrig vara sams",
        "st": "لايتفق الأطفال أبداً"
    },
    {
        "w": "SAND",
        "t": "رمل",
        "s": "Stranden har vit och mjuk sand.",
        "st": "الشاطئ به رمال بيضاء وناعمة."
    },
    {
        "w": "SÄNG",
        "t": "سرير",
        "s": "Jag sover gott i min säng.",
        "st": "أنام جيداً في سريري."
    },
    {
        "w": "SANKT",
        "t": "مقدس / قديس",
        "s": "Sankt Göran och draken.",
        "st": "القديس جورج والتنين."
    },
    {
        "w": "SANN",
        "t": "حقيقي",
        "s": "En sann historia.",
        "st": "قصة حقيقية."
    },
    {
        "w": "SANNA",
        "t": "حقيقية",
        "s": "Sanna mina ord.",
        "st": "صدق كلماتي."
    },
    {
        "w": "SÅR",
        "t": "جرح",
        "s": "Han fick ett sår på handen.",
        "st": "أصيب بجرح في يده."
    },
    {
        "w": "SÄRTA",
        "t": "بطة",
        "s": "En särta simmade i viken.",
        "st": "سبحت بطة في الخليج."
    },
    {
        "w": "SÅS",
        "t": "صلصة",
        "s": "Såsen är pricken över i.",
        "st": "الصلصة هي اللمسة الأخيرة."
    },
    {
        "w": "SÄTE",
        "t": "مقعد",
        "s": "Ta plats i ditt säte.",
        "st": "اجلس في مقعدك."
    },
    {
        "w": "SATT",
        "t": "جلس",
        "s": "Han satt tyst på sin stol.",
        "st": "جلس صامتاً على كرسيه."
    },
    {
        "w": "SE",
        "t": "يرى",
        "s": "Kan du se vad som står där?",
        "st": "هل يمكنك رؤية ما هو مكتوب هناك؟"
    },
    {
        "w": "SEG",
        "t": "قاسي / لزج",
        "s": "Köttet var segt och svårtuggat.",
        "st": "كان اللحم قاسياً وصعب المضغ."
    },
    {
        "w": "SEGLA",
        "t": "يبحر",
        "s": "Att segla kräver kunskap om vinden.",
        "st": "الإبحار يتطلب معرفة بالرياح."
    },
    {
        "w": "SEGLAR",
        "t": "يبحر",
        "s": "Hon seglar jorden runt.",
        "st": "هي تبحر حول العالم."
    },
    {
        "w": "SEGRA",
        "t": "ينتصر",
        "s": "Rättvisan ska segra.",
        "st": "العدالة ستنتصر."
    },
    {
        "w": "SELAN",
        "t": "الحمالة (شكل نادر)",
        "s": "Hästen fick skav av selan.",
        "st": "أصيب الحصان بجروح من الحمالة."
    },
    {
        "w": "SEMESTER",
        "t": "إجازة",
        "s": "Vi är på semester.",
        "st": "نحن في إجازة."
    },
    {
        "w": "SEN",
        "t": "متأخر",
        "s": "Bussen var sen.",
        "st": "الحافلة كانت متأخرة."
    },
    {
        "w": "SENA",
        "t": "وتر",
        "s": "Köttet hade en hård sena.",
        "st": "كان في اللحم وتر قاس."
    },
    {
        "w": "SENIG",
        "t": "وَتَريّ",
        "s": "mager och senig",
        "st": "نحيل ووتري"
    },
    {
        "w": "SER",
        "t": "يرى",
        "s": "Jag ser en båt på havet.",
        "st": "أرى قارباً في البحر."
    },
    {
        "w": "SET",
        "t": "مجموعة",
        "s": "Hon köpte ett nytt set med pennor.",
        "st": "اشترت مجموعة جديدة من الأقلام."
    },
    {
        "w": "SI",
        "t": "انظر (قديم)",
        "s": "En ton.",
        "st": "انظر هناك."
    },
    {
        "w": "SIA",
        "t": "يتنبأ",
        "s": "Ingen kan med säkerhet sia om framtiden.",
        "st": "لا أحد يستطيع التنبؤ بالمستقبل بيقين."
    },
    {
        "w": "SIDA",
        "t": "سيدا",
        "s": "Vänd sida i boken.",
        "st": "اقلب الصفحة في الكتاب."
    },
    {
        "w": "SIDEN",
        "t": "حرير",
        "s": "Klänningen är gjord av siden.",
        "st": "الفستان مصنوع من الحرير."
    },
    {
        "w": "SIK",
        "t": "سمك السيك",
        "s": "Sik är en populär matfisk.",
        "st": "السيك سمكة طعام شائعة."
    },
    {
        "w": "SIKAR",
        "t": "أسماك السيك",
        "s": "Sikar trivs i kallt vatten.",
        "st": "تعيش أسماك السيك في الماء البارد."
    },
    {
        "w": "SIKTA",
        "t": "يهدف / ينخل",
        "s": "Du måste sikta noga.",
        "st": "يجب أن تصوب بدقة."
    },
    {
        "w": "SIL",
        "t": "مصفاة",
        "s": "Använd en sil för att hälla av vattnet.",
        "st": "استخدم مصفاة لسكب الماء."
    },
    {
        "w": "SILA",
        "t": "يصفي",
        "s": "Sila såsen.",
        "st": "صف الصلصة."
    },
    {
        "w": "SILL",
        "t": "رنجة",
        "s": "Inlagd sill till jul.",
        "st": "رنجة مخللة لعيد الميلاد."
    },
    {
        "w": "SILO",
        "t": "صومعة",
        "s": "Bonden lagrar säd i en silo.",
        "st": "يخزن المزارع الحبوب في صومعة."
    },
    {
        "w": "SION",
        "t": "صهيون",
        "s": "Sion är ett berg i Jerusalem.",
        "st": "صهيون هو جبل في القدس."
    },
    {
        "w": "SIST",
        "t": "أخيراً",
        "s": "Sist men inte minst.",
        "st": "أخيراً وليس آخراً."
    },
    {
        "w": "SIT",
        "t": "اجلس (أمر إنجليزي مستعار)",
        "s": "Sit down please.",
        "st": "اجلس من فضلك."
    },
    {
        "w": "SITS",
        "t": "مقعد / وضع",
        "s": "En bekväm sits.",
        "st": "مقعد مريح."
    },
    {
        "w": "SJÄL",
        "t": "روح",
        "s": "Kropp och själ.",
        "st": "جسد وروح."
    },
    {
        "w": "SJÖFART",
        "t": "مِلاحة بحرية",
        "s": "den internationella sjöfarten",
        "st": "حركة الملاحة البحرية الدولية"
    },
    {
        "w": "SJU",
        "t": "سبعة",
        "s": "Klockan är sju.",
        "st": "الساعة السابعة."
    },
    {
        "w": "SJUK",
        "t": "مريض",
        "s": "Han är sjuk idag.",
        "st": "هو مريض اليوم."
    },
    {
        "w": "SJUKDOM",
        "t": "مرض",
        "s": "Cancer är en svår sjukdom.",
        "st": "السرطان مرض صعب."
    },
    {
        "w": "SJUNG",
        "t": "غنِّ (أمر)",
        "s": "Sjung en sång för oss.",
        "st": "غنِّ لنا أغنية."
    },
    {
        "w": "SJUNGA",
        "t": "يغني",
        "s": "Vi ska sjunga in kören.",
        "st": "سنغني في الجوقة."
    },
    {
        "w": "SKA",
        "t": "سوف",
        "s": "Jag ska gå hem.",
        "st": "سأذهب إلى المنزل."
    },
    {
        "w": "SKADE",
        "t": "أذى (ماضي)",
        "s": "Det skade inte att försöka.",
        "st": "لم يضر المحاولة."
    },
    {
        "w": "SKAL",
        "t": "قشرة",
        "s": "Apelsinens skal är tjockt.",
        "st": "قشرة البرتقال سميكة."
    },
    {
        "w": "SKÅL",
        "t": "وعاء",
        "s": "Jag häller soppan i en skål.",
        "st": "أصب الحساء في وعاء."
    },
    {
        "w": "SKALA",
        "t": "يقشر",
        "s": "Kan du skala potatisen?",
        "st": "هل يمكنك تقشير البطاطس؟"
    },
    {
        "w": "SKÅLA",
        "t": "يشرب نخب",
        "s": "Låt oss skåla för brudparet.",
        "st": "دعونا نشرب نخب العروسين."
    },
    {
        "w": "SKÅLAR",
        "t": "أوعية / يشرب نخب",
        "s": "Vi lyfter våra skålar.",
        "st": "نرفع كؤوسنا (لشرب النخب)."
    },
    {
        "w": "SKÅRA",
        "t": "شق / ثلم",
        "s": "En djup skåra i bordet.",
        "st": "شق عميق في الطاولة."
    },
    {
        "w": "SKARP",
        "t": "حادّ",
        "s": "skarp ammunition ( riktig ammunition )",
        "st": "ذخيرة حيّة"
    },
    {
        "w": "SKAV",
        "t": "جرح احتكاك",
        "s": "Skorna gav mig skav.",
        "st": "سببت لي الأحذية جرحاً."
    },
    {
        "w": "SKEDAR",
        "t": "ملاعق",
        "s": "Vi behöver fler skedar till soppan.",
        "st": "نحتاج المزيد من الملاعق للحساء."
    },
    {
        "w": "SKEN",
        "t": "سطوع / ضوء",
        "s": "Solen sken klart på himlen.",
        "st": "سطعت الشمس بوضوح في السماء."
    },
    {
        "w": "SKENA",
        "t": "سكة / قضيب",
        "s": "Tåget rullar på sin skena.",
        "st": "القطار يسير على سكته."
    },
    {
        "w": "SKENAR",
        "t": "يندفع هائجاً",
        "s": "hästen skenade tiden skenar iväg",
        "st": "اندفع الحصان هائجاً يمر الوقت بسرعة"
    },
    {
        "w": "SKENBAR",
        "t": "زائف",
        "s": "en skenbar förändring",
        "st": "تَغَيُّر زائف"
    },
    {
        "w": "SKIDA",
        "t": "زحّافة",
        "s": "Vi åker skidor i fjällen.",
        "st": "نتزلج في الجبال."
    },
    {
        "w": "SKIFT",
        "t": "وَرْدِية, مُناوَبة, نوبة عمل",
        "s": "arbeta ( i ) skift",
        "st": "عَمِلَ في وردية"
    },
    {
        "w": "SKIR",
        "t": "رقيق",
        "s": "vårens skira grönska skira moln",
        "st": "خَضار الربيع الرقيق غيوم رقيقة"
    },
    {
        "w": "SKIT",
        "t": "كثيراً",
        "s": "Det var bara skit.",
        "st": "كان مجرد هراء."
    },
    {
        "w": "SKIVA",
        "t": "شريحة",
        "s": "Vill du ha en skiva bröd?",
        "st": "هل تريد شريحة خبز؟"
    },
    {
        "w": "SKJORTA",
        "t": "قميص",
        "s": "Han har en vit snygg skjorta.",
        "st": "لديه قميص أبيض أنيق."
    },
    {
        "w": "SKO",
        "t": "حذاء",
        "s": "Jag har tappat min ena sko.",
        "st": "لقد فقدت فردة حذائي."
    },
    {
        "w": "SKOG",
        "t": "غابة",
        "s": "Det finns många träd i skogen.",
        "st": "يوجد الكثير من الأشجار في الغابة."
    },
    {
        "w": "SKOGS",
        "t": "غابة (مضاف)",
        "s": "Vi gick till skogs för att plocka bär.",
        "st": "ذهبنا إلى الغابة لقطف التوت."
    },
    {
        "w": "SKOLA",
        "t": "مدرسة",
        "s": "En ny skola ska byggas.",
        "st": "سيتم بناء مدرسة جديدة."
    },
    {
        "w": "SKOLAN",
        "t": "المدرسة (المعرف)",
        "s": "Skolan ligger nära mitt hem.",
        "st": "المدرسة تقع بالقرب من منزلي."
    },
    {
        "w": "SKOR",
        "t": "أحذية",
        "s": "Nya skor är sköna.",
        "st": "الأحذية الجديدة مريحة."
    },
    {
        "w": "SKÖR",
        "t": "رقيق",
        "s": "ett skört vinglas",
        "st": "كأس نبيذ رقيق"
    },
    {
        "w": "SKORNA",
        "t": "الأحذية",
        "s": "Ta på dig skorna.",
        "st": "ارتدِ حذائك."
    },
    {
        "w": "SKORPA",
        "t": "قسماط",
        "s": "Doppa en skorpa i kaffet.",
        "st": "غمس قطعة قسماط في القهوة."
    },
    {
        "w": "SKÖTER",
        "t": "يعتني بـ",
        "s": "Hon sköter sina blommor.",
        "st": "هي تعتني بزهورها."
    },
    {
        "w": "SKRAL",
        "t": "سيّئ",
        "s": "skrala kunskaper känna sig skral",
        "st": "معرفة رديئة شَعَرَ بسوء صحته"
    },
    {
        "w": "SKRI",
        "t": "صرخة",
        "s": "Ett gällt skri hördes i natten.",
        "st": "سُمعت صرخة مدوية في الليل."
    },
    {
        "w": "SKRIFT",
        "t": "كتابة",
        "s": "tal och skrift",
        "st": "الكلام والكتابة"
    },
    {
        "w": "SKRIK",
        "t": "صُراخ حادّ",
        "s": "ett gällt skrik",
        "st": "صراخ حاد"
    },
    {
        "w": "SKRIV",
        "t": "اكتب",
        "s": "Skriv ner dina tankar.",
        "st": "اكتب أفكارك."
    },
    {
        "w": "SKRIVA",
        "t": "يكتب",
        "s": "Jag gillar att skriva brev.",
        "st": "أحب كتابة الرسائل."
    },
    {
        "w": "SKROT",
        "t": "خردة",
        "s": "Det ligger massa skrot här.",
        "st": "يوجد الكثير من الخردة هنا."
    },
    {
        "w": "SKULD",
        "t": "دين",
        "s": "Betala sin skuld.",
        "st": "ادفع دينك."
    },
    {
        "w": "SKUR",
        "t": "وابل",
        "s": "En skur av regn.",
        "st": "زخّة مطر."
    },
    {
        "w": "SKURA",
        "t": "يفرك",
        "s": "Jag måste skura golvet i köket.",
        "st": "يجب أن أفرك أرضية المطبخ."
    },
    {
        "w": "SLAK",
        "t": "مرخيّ",
        "s": "seglen hängde slaka i stiltjen",
        "st": "أرخى الشراع عند توقف هبوب الرياح"
    },
    {
        "w": "SLÄT",
        "t": "مُسْتَوٍ, ناعم - أملس",
        "s": "en slät yta släta betyg",
        "st": "سطح مستو علامات على حافة النجاح"
    },
    {
        "w": "SLIT",
        "t": "كدح",
        "s": "Det var mycket slit och släp.",
        "st": "كان هناك الكثير من الكدح والعناء."
    },
    {
        "w": "SLOTT",
        "t": "قلعة",
        "s": "Kungen bor i ett slott.",
        "st": "يعيش الملك في قلعة."
    },
    {
        "w": "SLUP",
        "t": "قارب",
        "s": "Vi seglade med en gammal slup.",
        "st": "أبحرنا بقارب قديم."
    },
    {
        "w": "SLURK",
        "t": "رَشْفة",
        "s": "ta sig en slurk ur flaskan",
        "st": "أخذ رشفة من الزجاجة"
    },
    {
        "w": "SLUT",
        "t": "نهاية",
        "s": "Slut på filmen.",
        "st": "نهاية الفيلم."
    },
    {
        "w": "SMAK",
        "t": "طعم",
        "s": "Matens smak var fantastisk.",
        "st": "طعم الطعام كان رائعاً."
    },
    {
        "w": "SMAL",
        "t": "ضيّق",
        "s": "Vägen är smal.",
        "st": "الطريق ضيق."
    },
    {
        "w": "SMALT",
        "t": "ضيق / ذاب",
        "s": "Ett smalt sund.",
        "st": "مضيق ضيق."
    },
    {
        "w": "SMÄRT",
        "t": "نحيل",
        "s": "Han är lång och smärt i kroppen.",
        "st": "هو طويل ونحيل الجسم."
    },
    {
        "w": "SMÄRTA",
        "t": "ألم",
        "s": "Hon kände en stor smärta i ryggen.",
        "st": "شعرت بألم كبير في ظهرها."
    },
    {
        "w": "SMASKIG",
        "t": "شَهيّ",
        "s": "en smaskig tårta",
        "st": "كعكة مشهية"
    },
    {
        "w": "SMISK",
        "t": "خَبْطَة",
        "s": "barnen fick smisk på fingrarna",
        "st": "تَعَرَّض الأطفال لخبطة على أصابعهم"
    },
    {
        "w": "SMÖR",
        "t": "زبدة",
        "s": "Smöret smälter långsamt i pannan.",
        "st": "الزبدة تذوب ببطء في المقلاة."
    },
    {
        "w": "SMÖRA",
        "t": "يدهن بالزبدة",
        "s": "Du måste smöra formen innan du bakar.",
        "st": "يجب أن تدهن القالب بالزبدة قبل الخبز."
    },
    {
        "w": "SMÖRGÅS",
        "t": "شطيرة",
        "s": "Jag vill ha en smörgås med ost.",
        "st": "أريد شطيرة بالجبن."
    },
    {
        "w": "SMULA",
        "t": "مقدار ضئيل",
        "s": "en smula ( lite ) hänsyn",
        "st": "مقدار ضئيل من الاعتبار"
    },
    {
        "w": "SMULTRON",
        "t": "فراولة برية",
        "s": "Smultron är sommarens bär.",
        "st": "الفراولة البرية هي توت الصيف."
    },
    {
        "w": "SNAR",
        "t": "قريب",
        "s": "Vi ses inom en snar framtid.",
        "st": "نراك في المستقبل القريب."
    },
    {
        "w": "SNÄV",
        "t": "ضيّق",
        "s": "Kjolen är för snäv.",
        "st": "التنورة ضيقة جداً."
    },
    {
        "w": "SNIP",
        "t": "قارب",
        "s": "En liten snip guppade på vågorna.",
        "st": "قارب صغير كان يتمايل على الأمواج."
    },
    {
        "w": "SNÖD",
        "t": "بَسيط",
        "s": "för snöd vinnings skull",
        "st": "من أجل ربح بسيط"
    },
    {
        "w": "SNÖRE",
        "t": "خَيْط",
        "s": "slå ett snöre om paketet",
        "st": "لَفَّ رباطاً على الطَّرد"
    },
    {
        "w": "SNOS",
        "t": "يُسرق",
        "s": "Cyklar snos.",
        "st": "تُسرق الدراجات."
    },
    {
        "w": "SO",
        "t": "خنزيرة",
        "s": "En so med kultingar.",
        "st": "خنزيرة مع خنازير صغيرة."
    },
    {
        "w": "SOCKER",
        "t": "سكر",
        "s": "Vill du ha socker i kaffet?",
        "st": "هل تريد سكر في القهوة؟"
    },
    {
        "w": "SÖDER",
        "t": "جنوباً",
        "s": "söder om Stockholm",
        "st": "جنوب ستوكهولم"
    },
    {
        "w": "SOFFA",
        "t": "أريكة",
        "s": "Vi sitter i vår nya soffa.",
        "st": "نجلس على أريكتنا الجديدة."
    },
    {
        "w": "SOFFAN",
        "t": "الأريكة",
        "s": "Vi sitter och myser i soffan.",
        "st": "نجلس ونستمتع بالراحة على الأريكة."
    },
    {
        "w": "SÖKER",
        "t": "يبحث",
        "s": "Han söker nytt jobb.",
        "st": "هو يبحث عن عمل جديد."
    },
    {
        "w": "SOL",
        "t": "شمس",
        "s": "Solen skiner idag.",
        "st": "الشمس مشرقة اليوم."
    },
    {
        "w": "SOLA",
        "t": "يتشمس",
        "s": "Hon gillar att sola på stranden.",
        "st": "هي تحب أن تتشمس على الشاطئ."
    },
    {
        "w": "SOLO",
        "t": "منفرد",
        "s": "Han sjöng ett solo.",
        "st": "غنى منفرداً."
    },
    {
        "w": "SOLT",
        "t": "مسمر",
        "s": "Han blev solt.",
        "st": "اكتسب سمرة."
    },
    {
        "w": "SOM",
        "t": "مثل",
        "s": "Som man bäddar får man ligga.",
        "st": "كما تزرع تحصد."
    },
    {
        "w": "SÖM",
        "t": "درزة",
        "s": "Sömmen gick upp på byxorna.",
        "st": "انفكت درزة البنطال."
    },
    {
        "w": "SOMMAR",
        "t": "صيف",
        "s": "Sommaren är varm.",
        "st": "الصيف حار."
    },
    {
        "w": "SÖMN",
        "t": "نوم",
        "s": "God sömn ger energi.",
        "st": "النوم الجيد يعطي طاقة."
    },
    {
        "w": "SON",
        "t": "ابن",
        "s": "Han är min äldsta son.",
        "st": "هو ابني الأكبر."
    },
    {
        "w": "SÖNDER",
        "t": "تالِف",
        "s": "bilen är sönder gå sönder",
        "st": "تَعَطَّلَت السيارة تَلِفَ"
    },
    {
        "w": "SOP",
        "t": "قمامة",
        "s": "Kasta det i soporna.",
        "st": "ارمها في القمامة."
    },
    {
        "w": "SOPAR",
        "t": "يكنس",
        "s": "Han sopar golvet.",
        "st": "هو يكنس الأرض."
    },
    {
        "w": "SOPPA",
        "t": "حساء",
        "s": "Varm soppa är gott på vintern.",
        "st": "الحساء الساخن لذيذ في الشتاء."
    },
    {
        "w": "SORT",
        "t": "نوع",
        "s": "Vilken sort vill du ha?",
        "st": "أي نوع تريد؟"
    },
    {
        "w": "SORTER",
        "t": "أنواع / أصناف",
        "s": "Det finns många sorter av äpplen.",
        "st": "هناك العديد من أصناف التفاح."
    },
    {
        "w": "SÖT",
        "t": "حلو",
        "s": "Kakan är väldigt söt.",
        "st": "الكعكة حلوة جداً."
    },
    {
        "w": "SOVRUM",
        "t": "غرفة نوم",
        "s": "Jag sover i sovrummet.",
        "st": "أنام في غرفة النوم."
    },
    {
        "w": "SPÅR",
        "t": "أثر / مسار",
        "s": "Polisen säkrade spår på platsen.",
        "st": "أمنت الشرطة الآثار في الموقع."
    },
    {
        "w": "SPÅRA",
        "t": "يتتبع",
        "s": "Hunden kan spåra tjuven.",
        "st": "يمكن للكلب تتبع اللص."
    },
    {
        "w": "SPÅREN",
        "t": "الآثار",
        "s": "Följ spåren i snön.",
        "st": "اتبع الآثار في الثلج."
    },
    {
        "w": "SPARK",
        "t": "ركلة",
        "s": "hon gav katten en spark",
        "st": "ركَلَتْ القطة برجلها"
    },
    {
        "w": "SPE",
        "t": "إهانة",
        "s": "spott och spe",
        "st": "تحقير وإهانة"
    },
    {
        "w": "SPEGEL",
        "t": "مرآة",
        "s": "Hon tittade sig i spegeln.",
        "st": "نظرت إلى نفسها في المرآة."
    },
    {
        "w": "SPEL",
        "t": "لعبة",
        "s": "Detta är ett mycket roligt spel.",
        "st": "هذه لعبة ممتعة جداً."
    },
    {
        "w": "SPETA",
        "t": "شظية / عود",
        "s": "Hon fick en speta i fingret.",
        "st": "دخلت شظية في إصبعها."
    },
    {
        "w": "SPINDEL",
        "t": "عنكبوت",
        "s": "Spindeln väver sitt nät.",
        "st": "العنكبوت ينسج شبكته."
    },
    {
        "w": "SPION",
        "t": "جاسوس",
        "s": "Han anklagades för att vara spion.",
        "st": "اتُهم بأنه جاسوس."
    },
    {
        "w": "SPOL",
        "t": "ملف",
        "s": "En spole.",
        "st": "ملف."
    },
    {
        "w": "SPORT",
        "t": "رياضة",
        "s": "Fotboll är en sport.",
        "st": "كرة القدم رياضة."
    },
    {
        "w": "STAD",
        "t": "مدينة",
        "s": "Stockholm är en stor stad.",
        "st": "ستوكهولم مدينة كبيرة."
    },
    {
        "w": "STAFF",
        "t": "طاقم",
        "s": "En kompetent staff.",
        "st": "طاقم مؤهل."
    },
    {
        "w": "STAL",
        "t": "سرق",
        "s": "Tjuven stal cykeln mitt på dagen.",
        "st": "سرق اللص الدراجة في وضح النهار."
    },
    {
        "w": "STALL",
        "t": "إسطبل",
        "s": "Hästarna står i stallet.",
        "st": "الخيول في الإسطبل."
    },
    {
        "w": "STAN",
        "t": "المدينة",
        "s": "Vi ska åka in till stan.",
        "st": "سنذهب إلى المدينة."
    },
    {
        "w": "STAPEL",
        "t": "كومة / عمود",
        "s": "En stapel med böcker.",
        "st": "كومة من الكتب."
    },
    {
        "w": "STÅR",
        "t": "يقف, ينهض, يقوم",
        "s": "Bilen står på gatan.",
        "st": "السيارة واقفة في الشارع."
    },
    {
        "w": "STARK",
        "t": "قويّ",
        "s": "starka armar stark regering stark kyla",
        "st": "أذرع قوية حكومة قوية برد قارس"
    },
    {
        "w": "STARR",
        "t": "مرض السّاد البصري",
        "s": "grå starr grön starr",
        "st": "الماء الأزرق ( يُسَبّب عتامة عدسة العين ) غْلُوكوما: الماء الأسود ( عِلّة في العين )"
    },
    {
        "w": "START",
        "t": "بداية",
        "s": "Detta är en bra start.",
        "st": "هذه بداية جيدة."
    },
    {
        "w": "STAT",
        "t": "دولة",
        "s": "Staten ansvarar för vård och skola.",
        "st": "الدولة مسؤولة عن الرعاية الصحية والمدارس."
    },
    {
        "w": "STATION",
        "t": "محطة",
        "s": "Vi möts vid nästa station.",
        "st": "نلتقي في المحطة التالية."
    },
    {
        "w": "STEKA",
        "t": "يقلي",
        "s": "Vi ska steka köttbullar till middag.",
        "st": "سنقلي كرات اللحم للعشاء."
    },
    {
        "w": "STEN",
        "t": "حجر",
        "s": "Han kastade en sten i vattnet.",
        "st": "رمى حجراً في الماء."
    },
    {
        "w": "STENAR",
        "t": "أحجار",
        "s": "Kasta inte stenar.",
        "st": "لا ترمِ الحجارة."
    },
    {
        "w": "STEWARD",
        "t": "مضيف",
        "s": "En steward serverade kaffe.",
        "st": "قدم المضيف القهوة."
    },
    {
        "w": "STIG",
        "t": "مسار",
        "s": "En smal stig genom skogen.",
        "st": "مسار ضيق عبر الغابة."
    },
    {
        "w": "STIL",
        "t": "أسلوب",
        "s": "Jag gillar verkligen din unika stil.",
        "st": "أنا معجب حقاً بأسلوبك الفريد."
    },
    {
        "w": "STJÄL",
        "t": "يَسْرُق",
        "s": "stjäla en cykel stjäla en idé",
        "st": "سَرَقَ درّاجة سَرَقَ فِكْرة"
    },
    {
        "w": "STJÄRNA",
        "t": "نجمة",
        "s": "En stjärna föll från himlen.",
        "st": "سقطت نجمة من السماء."
    },
    {
        "w": "STO",
        "t": "وقف",
        "s": "Tåget sto vid stationen.",
        "st": "وقف القطار عند المحطة."
    },
    {
        "w": "STOD",
        "t": "وقف",
        "s": "Han stod och väntade.",
        "st": "كان واقفاً ينتظر."
    },
    {
        "w": "STÖD",
        "t": "مسند",
        "s": "ta stöd mot väggen",
        "st": "استند إلى الجدار"
    },
    {
        "w": "STOL",
        "t": "كرسي",
        "s": "Sitt på en stol.",
        "st": "اجلس على كرسي."
    },
    {
        "w": "STOLD",
        "t": "سرقة",
        "s": "En stöld.",
        "st": "سرقة."
    },
    {
        "w": "STOLPE",
        "t": "عمود",
        "s": "Körde in i en stolpe.",
        "st": "اصطدم بعمود."
    },
    {
        "w": "STOR",
        "t": "كبير",
        "s": "Han took en stor portion mat.",
        "st": "أخذ حصة كبيرة من الطعام."
    },
    {
        "w": "STORA",
        "t": "كبيرة",
        "s": "De har stora planer.",
        "st": "لديهم خطط كبيرة."
    },
    {
        "w": "STORM",
        "t": "عاصفة",
        "s": "En kraftig storm drog in.",
        "st": "هبت عاصفة قوية."
    },
    {
        "w": "STORMAR",
        "t": "يَعْصِف",
        "s": "det stormar stormande känslor",
        "st": "تَعْصِف مشاعر عنيفة"
    },
    {
        "w": "STORMIG",
        "t": "عاصف",
        "s": "Det var en stormig natt.",
        "st": "كانت ليلة عاصفة."
    },
    {
        "w": "STRAFF",
        "t": "عقاب",
        "s": "Han fick ett strängt straff för brottet.",
        "st": "تلقى عقاباً شديداً على الجريمة."
    },
    {
        "w": "STRAM",
        "t": "ضَيِّق",
        "s": "en stram stil",
        "st": "طابع مُتَحَفِّظ"
    },
    {
        "w": "STRAND",
        "t": "شاطئ",
        "s": "Vi badar vid stranden.",
        "st": "نسبح عند الشاطئ."
    },
    {
        "w": "STRÄV",
        "t": "خَشِن",
        "s": "en sträv röst",
        "st": "صوت خشن , صوت غليظ"
    },
    {
        "w": "STRIKT",
        "t": "صارم",
        "s": "strikt tillämpning av reglerna strikt klädsel",
        "st": "تطبيق صارم للقواعد ملابس مُتَزمّتة"
    },
    {
        "w": "STUDENT",
        "t": "طالب",
        "s": "Han är student vid universitetet.",
        "st": "هو طالب في الجامعة."
    },
    {
        "w": "STUDIE",
        "t": "دراسة",
        "s": "En ny studie visar att sömn är viktigt.",
        "st": "تظهر دراسة جديدة أن النوم مهم."
    },
    {
        "w": "STUND",
        "t": "لحظة / برهة",
        "s": "Vänta en liten stund.",
        "st": "انتظر لحظة صغيرة."
    },
    {
        "w": "STUT",
        "t": "ثور صغير",
        "s": "En ung stut betade på ängen.",
        "st": "ثور صغير كان يرعى في المرج."
    },
    {
        "w": "STYRKA",
        "t": "قوة",
        "s": "Han visade prov på stor styrka.",
        "st": "أظهر دليلاً على قوة كبيرة."
    },
    {
        "w": "SUCK",
        "t": "تَنَهُّد",
        "s": "Hon drog en djup suck.",
        "st": "تنهدت بعمق."
    },
    {
        "w": "SUDD",
        "t": "ممحاة (عامية)",
        "s": "Har du ett sudd?",
        "st": "هل لديك ممحاة؟"
    },
    {
        "w": "SUM",
        "t": "مجموع",
        "s": "En stor summa pengar.",
        "st": "مبلغ كبير من المال."
    },
    {
        "w": "SUND",
        "t": "صحي / مضيق",
        "s": "En sund själ i en sund kropp.",
        "st": "عقل سليم في جسم سليم."
    },
    {
        "w": "SUNT",
        "t": "صحي",
        "s": "Det är sunt förnuft.",
        "st": "إنه المنطق السليم."
    },
    {
        "w": "SUR",
        "t": "غاضب",
        "s": "Varför är han så sur idag?",
        "st": "لماذا هو غاضب جداً اليوم؟"
    },
    {
        "w": "SURRA",
        "t": "يطن / يربط",
        "s": "En fluga surrar i fönstret.",
        "st": "ذبابة تطن في النافذة."
    },
    {
        "w": "SUS",
        "t": "حفيف",
        "s": "Vindens sus.",
        "st": "حفيف الريح."
    },
    {
        "w": "SVAL",
        "t": "بارد / منعش",
        "s": "En sval vind blåser från havet.",
        "st": "تهب رياح منعشة من البحر."
    },
    {
        "w": "SVALA",
        "t": "سنونو",
        "s": "En svala flög förbi.",
        "st": "طار طائر سنونو."
    },
    {
        "w": "SVALL",
        "t": "تلاطم الأمواج",
        "s": "Vi hörde havets svall.",
        "st": "سمعنا تلاطم البحر."
    },
    {
        "w": "SVALLA",
        "t": "تلاطم / تدفق",
        "s": "Vågorna svallade mot stranden.",
        "st": "تلاطمت الأمواج على الشاطئ."
    },
    {
        "w": "SVAR",
        "t": "جواب",
        "s": "Jag väntar på ditt svar.",
        "st": "أنتظر جوابك."
    },
    {
        "w": "SVEK",
        "t": "خيانة",
        "s": "Det var ett stort svek.",
        "st": "كانت خيانة كبيرة."
    },
    {
        "w": "SVENSK",
        "t": "سويدي",
        "s": "Han är svensk medborgare.",
        "st": "هو مواطن سويدي."
    },
    {
        "w": "SVENSKA",
        "t": "اللغة السويدية",
        "s": "Jag lär mig svenska.",
        "st": "أتعلم اللغة السويدية."
    },
    {
        "w": "SYNDER",
        "t": "خطايا",
        "s": "Förlåtelse för synder.",
        "st": "مغفرة الخطايا."
    },
    {
        "w": "SYNER",
        "t": "رؤى",
        "s": "Han hade syner.",
        "st": "كانت لديه رؤى."
    },
    {
        "w": "SYSTER",
        "t": "أخت",
        "s": "Min syster läser en bok.",
        "st": "أختي تقرأ كتاباً."
    },
    {
        "w": "TÅ",
        "t": "إصبع قدم",
        "s": "Jag slog min tå.",
        "st": "إصبعي يؤلمني."
    },
    {
        "w": "TAG",
        "t": "قبضة",
        "s": "Ta ett tag i repet och dra.",
        "st": "أمسك بالحبل واسحب."
    },
    {
        "w": "TÅG",
        "t": "قطار",
        "s": "Jag åker tåg till jobbet.",
        "st": "أركب القطار إلى العمل."
    },
    {
        "w": "TÅGA",
        "t": "يسير في موكب",
        "s": "Vi såg them tåga genom staden.",
        "st": "رأيناهم يسيرون في موكب عبر المدينة."
    },
    {
        "w": "TAK",
        "t": "سقف",
        "s": "Taket läcker när det regnar.",
        "st": "السقف يسرب عندما تمطر."
    },
    {
        "w": "TAL",
        "t": "خطاب / عدد",
        "s": "Han höll ett långt tal.",
        "st": "ألقى خطاباً طويلاً."
    },
    {
        "w": "TALA",
        "t": "تحدث",
        "s": "Tala är silver, tiga är guld.",
        "st": "الكلام من فضة والسكوت من ذهب."
    },
    {
        "w": "TALANG",
        "t": "موهبة",
        "s": "Hon har en stor musikalisk talang.",
        "st": "لديها موهبة موسيقية كبيرة."
    },
    {
        "w": "TALAR",
        "t": "يتحدث",
        "s": "Han talar svenska.",
        "st": "هو يتحدث السويدية."
    },
    {
        "w": "TÅLER",
        "t": "يتحمل",
        "s": "Hon tåler inte stark mat.",
        "st": "هي لا تتحمل الطعام الحار."
    },
    {
        "w": "TAM",
        "t": "أليف",
        "s": "Hunden är mycket tam och snäll.",
        "st": "الكلب أليف جداً ولطيف."
    },
    {
        "w": "TAND",
        "t": "سن",
        "s": "Jag har ont i en tand.",
        "st": "لدي ألم في سن."
    },
    {
        "w": "TÄNDE",
        "t": "أشعل",
        "s": "Han tände ljuset.",
        "st": "أشعل الشمعة."
    },
    {
        "w": "TÄNDER",
        "t": "أسنان",
        "s": "Borsta tänderna noga.",
        "st": "فرش أسنانك جيداً."
    },
    {
        "w": "TANK",
        "t": "دبابة / خزان",
        "s": "Bilen har full tank.",
        "st": "السيارة خزانها ممتلئ."
    },
    {
        "w": "TANT",
        "t": "عمة / خالة / سيدة",
        "s": "En snäll tant gav mig godis.",
        "st": "سيدة لطيفة أعطتني حلوى."
    },
    {
        "w": "TAR",
        "t": "يأخذ",
        "s": "Det tar tid.",
        "st": "الأمر يستغرق وقتاً."
    },
    {
        "w": "TÅR",
        "t": "دموع",
        "s": "Tårarna rann nerför hennes kinder.",
        "st": "انهمرت الدموع على خديها."
    },
    {
        "w": "TÄR",
        "t": "يستهلك / يقطع",
        "s": "Oron tär på hans krafter.",
        "st": "القلق يستنزف قواه."
    },
    {
        "w": "TARM",
        "t": "أمعاء",
        "s": "Tarmen är lång.",
        "st": "الأمعاء طويلة."
    },
    {
        "w": "TÄRNA",
        "t": "وصيفة / طائر الخرشنة",
        "s": "Hon var tärna på bröllopet.",
        "st": "كانت وصيفة في حفل الزفاف."
    },
    {
        "w": "TAS",
        "t": "يؤخذ",
        "s": "Provet tas på morgonen.",
        "st": "تؤخذ العينة في الصباح."
    },
    {
        "w": "TÄT",
        "t": "كثيف",
        "s": "Skogen var mörk och tät.",
        "st": "كانت الغابة مظلمة وكثيفة."
    },
    {
        "w": "TAVLA",
        "t": "لوحة",
        "s": "Läraren skriver på en tavla.",
        "st": "المعلم يكتب على السبورة."
    },
    {
        "w": "TE",
        "t": "شاي",
        "s": "Vill du ha te?",
        "st": "هل تريد شاي؟"
    },
    {
        "w": "TEAM",
        "t": "فريق",
        "s": "Vi är ett bra team.",
        "st": "نحن فريق جيد."
    },
    {
        "w": "TELEFON",
        "t": "هاتف",
        "s": "Telefonen ringer.",
        "st": "الهاتف يرن."
    },
    {
        "w": "TEMA",
        "t": "موضوع",
        "s": "Dagens tema är miljö.",
        "st": "موضوع اليوم هو البيئة."
    },
    {
        "w": "TENTA",
        "t": "امتحان جامعي",
        "s": "Jag pluggar till en tenta.",
        "st": "أدرس لامتحان جامعي."
    },
    {
        "w": "TERMIN",
        "t": "فصل دراسي",
        "s": "Höstterminen är ganska lång.",
        "st": "فصل الخريف الدراسي طويل نوعاً ما."
    },
    {
        "w": "TEST",
        "t": "اختبار",
        "s": "Provet var ett svårt test.",
        "st": "الامتحان كان اختباراً صعباً."
    },
    {
        "w": "TID",
        "t": "وقت",
        "s": "Det tar lång tid att lära sig.",
        "st": "يستغرق الأمر وقتاً طويلاً للتعلم."
    },
    {
        "w": "TILL",
        "t": "مرة أخرى",
        "s": "ta en kaka till!",
        "st": "خذ كعكة ثانية!"
    },
    {
        "w": "TILLS",
        "t": "حتى",
        "s": "vänta här tills jag kommer",
        "st": "انتظر هنا حتى آتي"
    },
    {
        "w": "TIMER",
        "t": "مؤقت",
        "s": "Sätt en timer på tio minuter.",
        "st": "اضبط المؤقت على عشر دقائق."
    },
    {
        "w": "TIO",
        "t": "عشرة",
        "s": "Tio kronor.",
        "st": "عشر كرونات."
    },
    {
        "w": "TJÄRA",
        "t": "قطران",
        "s": "Båten var struken med tjära.",
        "st": "كان القارب مطلياً بالقطران."
    },
    {
        "w": "TJÄRN",
        "t": "بحيرة صغيرة",
        "s": "Vi badade i en liten tjärn.",
        "st": "سبحنا في بحيرة صغيرة."
    },
    {
        "w": "TJÄRNA",
        "t": "بحيرة",
        "s": "Vi badade i en liten skogstjärna.",
        "st": "سبحنا في بحيرة غابة صغيرة."
    },
    {
        "w": "TOK",
        "t": "أحمق",
        "s": "Han är en riktig tok ibland.",
        "st": "إنه أحمق حقيقي في بعض الأحيان."
    },
    {
        "w": "TOM",
        "t": "فارغ",
        "s": "Lådan är tyvärr helt tom.",
        "st": "الصندوق للأسف فارغ تماماً."
    },
    {
        "w": "TOMT",
        "t": "فارغ",
        "s": "Det är tomt.",
        "st": "إنه فارغ."
    },
    {
        "w": "TON",
        "t": "نغمة",
        "s": "En ton.",
        "st": "نغمة."
    },
    {
        "w": "TONA",
        "t": "تتلاشى",
        "s": "Färgerna började tona bort.",
        "st": "بدأت الألوان تتلاشى."
    },
    {
        "w": "TOPPAR",
        "t": "يحتلّ مرتبة الصَدارة",
        "s": "boken toppar listan på bra barnböcker",
        "st": "يحتل الكتاب مرتبة الصدارة بين أفضل كتب الأطفال"
    },
    {
        "w": "TORG",
        "t": "ساحة",
        "s": "Vi möts på torget.",
        "st": "نلتقي في الساحة."
    },
    {
        "w": "TORKA",
        "t": "يجفف / جفاف",
        "s": "Häng tvätten på tork i solen.",
        "st": "علق الغسيل ليجف في الشمس."
    },
    {
        "w": "TORN",
        "t": "برج",
        "s": "Kyrkans torn syns på långt håll.",
        "st": "برج الكنيسة يُرى من بعيد."
    },
    {
        "w": "TORPE",
        "t": "كوخ",
        "s": "Ett torp.",
        "st": "كوخ."
    },
    {
        "w": "TORR",
        "t": "جاف",
        "s": "Torr.",
        "st": "جاف."
    },
    {
        "w": "TORRT",
        "t": "جاف",
        "s": "Gräset är torrt.",
        "st": "العشب جاف."
    },
    {
        "w": "TÖRS",
        "t": "يجرؤ",
        "s": "hon törs inte säga ifrån",
        "st": "لا تجرؤ على الرفض"
    },
    {
        "w": "TORSK",
        "t": "سمك القد",
        "s": "Torsk är en mycket god fisk.",
        "st": "القد سمكة لذيذة جداً."
    },
    {
        "w": "TOTAL",
        "t": "شامل",
        "s": "en total förnyelse totalt sett",
        "st": "تجديد شامل بصورة إجمالية"
    },
    {
        "w": "TRÄ",
        "t": "خشب",
        "s": "Möbeln är gjord av trä.",
        "st": "الأثاث مصنوع من الخشب."
    },
    {
        "w": "TRÄD",
        "t": "شجرة",
        "s": "Ett gammalt träd står i parken.",
        "st": "شجرة قديمة تقف في الحديقة."
    },
    {
        "w": "TRÄDE",
        "t": "بور",
        "s": "Åkern fick ligga i träde ett år.",
        "st": "تُرك الحقل بوراً لمدة عام."
    },
    {
        "w": "TRÄDGÅRD",
        "t": "حديقة",
        "s": "Vi har en fin trädgård.",
        "st": "لدينا حديقة جميلة."
    },
    {
        "w": "TRAFIK",
        "t": "حركة مرور",
        "s": "Det är mycket trafik idag.",
        "st": "هناك الكثير من حركة المرور اليوم."
    },
    {
        "w": "TRÅLE",
        "t": "شباك الجر (شكل نادر)",
        "s": "Fiskarna lagade sin tråle.",
        "st": "أصلح الصيادون شباك الجر."
    },
    {
        "w": "TRÄNA",
        "t": "يتدرب",
        "s": "Jag ska träna på gymmet.",
        "st": "سأتدرب في الصالة الرياضية."
    },
    {
        "w": "TRE",
        "t": "ثلاثة",
        "s": "Jag har tre bröder och en syster.",
        "st": "لدي ثلاثة إخوة وأخت واحدة."
    },
    {
        "w": "TREAR",
        "t": "ثلاثات",
        "s": "Två trear i kortspel.",
        "st": "ثلاثتان في لعبة الورق."
    },
    {
        "w": "TRISS",
        "t": "ثلاثة من نوع (بوكر) / بكرة",
        "s": "Triss i damer.",
        "st": "ثلاث ملكات."
    },
    {
        "w": "TRIST",
        "t": "مُحْزِن",
        "s": "ett trist bostadsområde en trist föreläsning",
        "st": "منطقة سكنية كئيبة مُحاضَرة مُضْجِرة"
    },
    {
        "w": "TRO",
        "t": "إيمان / يعتقد",
        "s": "Jag har a stark tro.",
        "st": "لدي إيمان قوي."
    },
    {
        "w": "TROLIG",
        "t": "مُحْتَمل",
        "s": "en trolig utveckling",
        "st": "تَطَوُّر مُحْتَمَل"
    },
    {
        "w": "TRON",
        "t": "الإيمان (المعرف) / العرش",
        "s": "Tron ger oss styrka i livet.",
        "st": "الإيمان يعطينا القوة في الحياة."
    },
    {
        "w": "TROTT",
        "t": "اعتقد (الماضي)",
        "s": "Jag hade trott det.",
        "st": "كنت قد اعتقدت ذلك."
    },
    {
        "w": "TUFT",
        "t": "خصلة",
        "s": "En tuft gräs växte mellan stenarna.",
        "st": "نبتت خصلة عشب بين الحجارة."
    },
    {
        "w": "TUNA",
        "t": "ساحة",
        "s": "Eskilstuna är en fin gammal stad.",
        "st": "إسكيلستونا مدينة قديمة وجميلة."
    },
    {
        "w": "TUNNBRÖD",
        "t": "خبز رقيق",
        "s": "Tunnbröd med lax.",
        "st": "خبز رقيق مع السلمون."
    },
    {
        "w": "TUNT",
        "t": "رقيق",
        "s": "Isen är tunt på sjön.",
        "st": "الجليد رقيق على البحيرة."
    },
    {
        "w": "TUR",
        "t": "رحلة",
        "s": "båten gör två turer om dagen",
        "st": "قام القارب برحلتين في اليوم"
    },
    {
        "w": "TURER",
        "t": "جولات",
        "s": "Vi bokade flera turer.",
        "st": "حجزنا عدة جولات."
    },
    {
        "w": "TURIST",
        "t": "سائح",
        "s": "En turist frågade om vägen.",
        "st": "سأل سائح عن الطريق."
    },
    {
        "w": "TVÄR",
        "t": "فجائيّ",
        "s": "en tvär inbromsning sur och tvär",
        "st": "فرملة فجائيّة غاضب وغير لَبِق"
    },
    {
        "w": "TVÄRS",
        "t": "عرضيّاً",
        "s": "tvärs över gatan",
        "st": "بِعَرض الشارع"
    },
    {
        "w": "TYG",
        "t": "قماش",
        "s": "Klänningen är sydd av ett mjukt tyg.",
        "st": "الفستان مخيط من قماش ناعم."
    },
    {
        "w": "TYP",
        "t": "نوع",
        "s": "Vilken typ av bil har du?",
        "st": "ما نوع السيارة التي لديك؟"
    },
    {
        "w": "TYSK",
        "t": "ألماني",
        "s": "Jag träffade en trevlig tysk turist.",
        "st": "التقيت بسائح ألماني لطيف."
    },
    {
        "w": "UGN",
        "t": "فرن",
        "s": "Kakan ska gräddas i ugnen.",
        "st": "يجب خبز الكعكة في الفرن."
    },
    {
        "w": "UNDAN",
        "t": "جانباً",
        "s": "dra sig undan hålla sig undan",
        "st": "تحاشى الناس تحاشى الناس"
    },
    {
        "w": "UNDRAN",
        "t": "تَعَجُّب",
        "s": "hans agerande väckte undran",
        "st": "دَعَت تصرفاته إلى العَجَب"
    },
    {
        "w": "UNG",
        "t": "شاب / صغير",
        "s": "Han var ung och oerfaren.",
        "st": "كان شاباً وعديم الخبرة."
    },
    {
        "w": "UR",
        "t": "من/ساعة",
        "s": "Gå ur rummet.",
        "st": "أخرج من الغرفة."
    },
    {
        "w": "UT",
        "t": "خارج",
        "s": "Gå ut och lek i den friska luften.",
        "st": "اخرج والعب في الهواء الطلق."
    },
    {
        "w": "UTFLYKT",
        "t": "نزهة",
        "s": "Vi åkte på en utflykt till skogen.",
        "st": "ذهبنا في نزهة إلى الغابة."
    },
    {
        "w": "UTIFRÅN",
        "t": "من الخارج",
        "s": "skaffa folk utifrån",
        "st": "أحْضَرَ عُمّالاً من الخارج"
    },
    {
        "w": "UTKANT",
        "t": "طَرَف",
        "s": "i utkanten av staden",
        "st": "في طرف المدينة"
    },
    {
        "w": "UTLAND",
        "t": "خارج",
        "s": "I utlandet.",
        "st": "في الخارج."
    },
    {
        "w": "VÅ",
        "t": "نحن (لهجة)",
        "s": "Vå är här (dialekt).",
        "st": "نحن هنا."
    },
    {
        "w": "VAD",
        "t": "بطة الساق / ماذا",
        "s": "Jag har ont i vaden.",
        "st": "لدي ألم في بطة الساق."
    },
    {
        "w": "VÄDRET",
        "t": "الطقس",
        "s": "Alla gillar att prata om vädret.",
        "st": "الجميع يحب الحديث عن الطقس."
    },
    {
        "w": "VÅFFLA",
        "t": "وافل",
        "s": "Vi äter våfflor med sylt.",
        "st": "نأكل الوافل مع المربى."
    },
    {
        "w": "VAG",
        "t": "غير واضح",
        "s": "en vag känsla av obehag",
        "st": "إحساس غامض بعدم الارتياح"
    },
    {
        "w": "VÄG",
        "t": "طريق",
        "s": "Vi har en lång väg att vandra.",
        "st": "لدينا طريق طويل لنقطعه."
    },
    {
        "w": "VÄGAR",
        "t": "طرق",
        "s": "Herrens vägar äro outgrundliga.",
        "st": "طرق الرب لا يمكن سبر أغوارها."
    },
    {
        "w": "VÄGG",
        "t": "جدار",
        "s": "Tavlan hänger på den vita väggen.",
        "st": "اللوحة معلقة على الجدار الأبيض."
    },
    {
        "w": "VAGN",
        "t": "عربة",
        "s": "Barnet sover gott i sin vagn.",
        "st": "ينام الطفل جيداً في عربته."
    },
    {
        "w": "VAGNAR",
        "t": "عربات",
        "s": "Tåget har många vagnar.",
        "st": "القطار له العديد من العربات."
    },
    {
        "w": "VAKA",
        "t": "يسهر",
        "s": "Vaka hela natten.",
        "st": "اسهر طوال الليل."
    },
    {
        "w": "VAKEN",
        "t": "مستيقظ",
        "s": "Är you vaken?",
        "st": "هل أنت مستيقظ؟"
    },
    {
        "w": "VAKET",
        "t": "مستيقظ (محايد)",
        "s": "Ett vaket barn.",
        "st": "طفل مستيقظ."
    },
    {
        "w": "VAKT",
        "t": "حِراسة",
        "s": "även om platsen där man vaktar",
        "st": "تقال أيضاً عن المكان المحروس"
    },
    {
        "w": "VAKTA",
        "t": "يحرس",
        "s": "Vakta hunden.",
        "st": "احرس الكلب."
    },
    {
        "w": "VAKTER",
        "t": "حراس",
        "s": "Två vakter stod vid dörren.",
        "st": "وقف حارسان عند الباب."
    },
    {
        "w": "VAL",
        "t": "حوت / خيار",
        "s": "Vi såg en stor val i havet.",
        "st": "رأينا حوتاً كبيراً في البحر."
    },
    {
        "w": "VÄL",
        "t": "حسناً / جيداً",
        "s": "Det går väl bra för dig?",
        "st": "الأمور تسير جيداً معك، أليس كذلك؟"
    },
    {
        "w": "VÄLDIG",
        "t": "عظيم",
        "s": "ett väldigt fartyg en väldig påfrestning",
        "st": "سفينة ضخمة إجهاد كبير"
    },
    {
        "w": "VÄLDIGT",
        "t": "جدّ",
        "s": "väldigt glad väldigt svårt",
        "st": "سعيد جداً صعب جداً"
    },
    {
        "w": "VALLA",
        "t": "شمع التزلج / يرعى",
        "s": "Han måste valla sina skidor.",
        "st": "يجب أن يضع الشمع على زلاجاته."
    },
    {
        "w": "VALT",
        "t": "مختار",
        "s": "Han har valt att sluta arbeta.",
        "st": "لقد اختار التوقف عن العمل."
    },
    {
        "w": "VAN",
        "t": "معتاد",
        "s": "Han är van vid det kalla vädret.",
        "st": "هو معتاد على الطقس البارد."
    },
    {
        "w": "VÄN",
        "t": "لطيف",
        "s": "en vän varelse",
        "st": "مخلوق لطيف"
    },
    {
        "w": "VANA",
        "t": "عادة",
        "s": "Gammal vana sitter i.",
        "st": "العادات القديمة تموت بصعوبة."
    },
    {
        "w": "VAR",
        "t": "أين / كان",
        "s": "Var har du lagt mina nycklar?",
        "st": "أين وضعت مفاتيحي؟"
    },
    {
        "w": "VÅR",
        "t": "لنا",
        "s": "vårt eget modersmål",
        "st": "لغتنا الأم"
    },
    {
        "w": "VARA",
        "t": "سلعة / يكون",
        "s": "Det är en bra vara.",
        "st": "إنها سلعة جيدة."
    },
    {
        "w": "VÅRAS",
        "t": "الربيع الفائت",
        "s": "i våras ( förra våren )",
        "st": "في الربيع الفائت"
    },
    {
        "w": "VÅRD",
        "t": "رعاية",
        "s": "Alla har rätt till vård.",
        "st": "الجميع لديهم الحق في الرعاية."
    },
    {
        "w": "VÄRDE",
        "t": "قيمة",
        "s": "Detta har ett stort sentimentalt värde.",
        "st": "هذا له قيمة عاطفية كبيرة."
    },
    {
        "w": "VÄRDET",
        "t": "القيمة",
        "s": "Värdet av allt vi äger är stort.",
        "st": "قيمة كل ما نملكه كبيرة."
    },
    {
        "w": "VÅREN",
        "t": "الربيع",
        "s": "Blommorna slår ut på våren.",
        "st": "الزهور تتفتح في الربيع."
    },
    {
        "w": "VARG",
        "t": "ذئب",
        "s": "Man ska inte ropa varg.",
        "st": "لا ينبغي الصراخ بوجود ذئب (كذباً)."
    },
    {
        "w": "VÄRLD",
        "t": "عالم",
        "s": "Vi lever i en föränderlig värld.",
        "st": "نحن نعيش في عالم متغير."
    },
    {
        "w": "VÄRLDEN",
        "t": "العالم",
        "s": "Han vill resa runt hela världen.",
        "st": "يريد السفر حول العالم بأسره."
    },
    {
        "w": "VARO",
        "t": "كن (أمر)",
        "s": "Varo den som ljuger.",
        "st": "احذر من يكذب."
    },
    {
        "w": "VAROR",
        "t": "بضائع",
        "s": "Butiken säljer många varor.",
        "st": "المتجر يبيع العديد من البضائع."
    },
    {
        "w": "VARS",
        "t": "مَن",
        "s": "En man vars bil är röd.",
        "st": "رجل سيارته حمراء."
    },
    {
        "w": "VÄRST",
        "t": "أسوأ",
        "s": "Det var det värsta jag hört.",
        "st": "هذا أسوأ ما سمعت."
    },
    {
        "w": "VART",
        "t": "إلى أين",
        "s": "vart ska du åka?",
        "st": "إلى أين تسافر؟"
    },
    {
        "w": "VAS",
        "t": "مزهريّة",
        "s": "Blommorna står i en vas.",
        "st": "الزهور في مزهرية."
    },
    {
        "w": "VÄSA",
        "t": "يفح / يهمس بغضب",
        "s": "Ormen började väsa.",
        "st": "بدأ الثعبان بالفحيح."
    },
    {
        "w": "VASER",
        "t": "مزهريات",
        "s": "Hon samlar på gamla vaser.",
        "st": "هي تجمع المزهريات القديمة."
    },
    {
        "w": "VÄSKA",
        "t": "حقيبة",
        "s": "Jag glömde min väska på bussen.",
        "st": "نسيت حقيبتي في الحافلة."
    },
    {
        "w": "VÄST",
        "t": "سترة",
        "s": "Han har en snygg blå väst på sig.",
        "st": "يرتدي سترة زرقاء جميلة."
    },
    {
        "w": "VÄSTER",
        "t": "غرب",
        "s": "Solen går alltid ner i väster.",
        "st": "تغرب الشمس دائماً في الغرب."
    },
    {
        "w": "VÄSTRA",
        "t": "الغربي",
        "s": "den västra sidan av sjön",
        "st": "الجهة الغربية من البحيرة"
    },
    {
        "w": "VÄTA",
        "t": "بَلَل",
        "s": "tyget stöter bort väta",
        "st": "قماش صادّ للبلل"
    },
    {
        "w": "VATTEN",
        "t": "ماء",
        "s": "Drick mycket vatten.",
        "st": "اشرب الكثير من الماء."
    },
    {
        "w": "VÄXA",
        "t": "ينمو",
        "s": "Blommorna växa snabbt.",
        "st": "الزهور تنمو بسرعة."
    },
    {
        "w": "VERK",
        "t": "عمل / مصنع",
        "s": "Detta är ett känt verk av konstnären.",
        "st": "هذا عمل معروف للفنان."
    },
    {
        "w": "VERKTYG",
        "t": "أداة",
        "s": "Snickaren har många olika verktyg.",
        "st": "النجار لديه العديد من الأدوات المختلفة."
    },
    {
        "w": "VERS",
        "t": "آية",
        "s": "Läs en vers ur boken.",
        "st": "اقرأ بيتاً من الكتاب."
    },
    {
        "w": "VET",
        "t": "يعرف",
        "s": "Jag vet att du kan klara det.",
        "st": "أعرف أنك تستطيع فعل ذلك."
    },
    {
        "w": "VID",
        "t": "واسع / عند",
        "s": "Huset ligger vid en vacker sjö.",
        "st": "يقع المنزل عند بحيرة جميلة."
    },
    {
        "w": "VIDA",
        "t": "واسع / عريض",
        "s": "De har rest över vida hav.",
        "st": "لقد سافروا عبر بحار واسعة."
    },
    {
        "w": "VIDGA",
        "t": "يوسع",
        "s": "Vi måste vidga vägen.",
        "st": "يجب أن نوسع الطريق."
    },
    {
        "w": "VIDGAR",
        "t": "يُوَسِّع",
        "s": "medicinen vidgar blodkärlen vidgat inflytande",
        "st": "يوسع الدواء الأوعية الدمويّة نفوذ ممتدّ , نفوذ واسع"
    },
    {
        "w": "VIG",
        "t": "مَرِن",
        "s": "ett vigt språng",
        "st": "قفزة رشيقة"
    },
    {
        "w": "VIK",
        "t": "اطوِ",
        "s": "Vik kläderna snyggt och lägg in dem.",
        "st": "اطوِ الملابس بشكل مرتب وضعها في الداخل."
    },
    {
        "w": "VIKS",
        "t": "خليج (مضاف) / يُطوى",
        "s": "Pappret viks på mitten.",
        "st": "تُطوى الورقة من المنتصف."
    },
    {
        "w": "VIL",
        "t": "يريد (عامية/قديم)",
        "s": "Gör vad du vil.",
        "st": "افعل ما تريد."
    },
    {
        "w": "VILD",
        "t": "بَريّ",
        "s": "vilda växter vilda djur",
        "st": "نباتات بريّة حيوانات برية ( وحشيّة )"
    },
    {
        "w": "VIN",
        "t": "نبيذ",
        "s": "Ett glas rött vin.",
        "st": "كأس من النبيذ الأحمر."
    },
    {
        "w": "VIND",
        "t": "ريح",
        "s": "En stark vind blåser i träden.",
        "st": "رياح قوية تعصف بالأشجار."
    },
    {
        "w": "VINTER",
        "t": "شتاء",
        "s": "Vintern är kall.",
        "st": "الشتاء بارد."
    },
    {
        "w": "VIPS",
        "t": "طَرْفة عَيْن",
        "s": "vips , var han försvunnen",
        "st": "اختفى بطرفة عين"
    },
    {
        "w": "VIRKA",
        "t": "يكروشيه",
        "s": "Min mormor lärde mig virka.",
        "st": "جدتي علمتني الكروشيه."
    },
    {
        "w": "VIS",
        "t": "حكيم / طريقة",
        "s": "På visst vis.",
        "st": "بطريقة معينة."
    },
    {
        "w": "VISUM",
        "t": "تأشيرة",
        "s": "Jag behöver ett visum.",
        "st": "أحتاج إلى تأشيرة."
    },
    {
        "w": "VIT",
        "t": "أبيض",
        "s": "Snön är vit.",
        "st": "الثلج أبيض."
    },
    {
        "w": "VITTNE",
        "t": "شاهد",
        "s": "Ett vittne såg vad som hände.",
        "st": "رأى شاهد ما حدث."
    },
    {
        "w": "VRÅ",
        "t": "زاوية",
        "s": "leta igenom varenda vrå av huset",
        "st": "بَحَث في كل زوايا المنزل"
    },
    {
        "w": "YRA",
        "t": "هذيان/دوخة",
        "s": "Han yrar av feber.",
        "st": "يشعر بالدوخة."
    },
    {
        "w": "YRKA",
        "t": "يطالب",
        "s": "Åklagaren valde att yrka på fängelse.",
        "st": "اختار المدعي العام المطالبة بالسجن."
    },
    {
        "w": "YRKAR",
        "t": "يطالب",
        "s": "Åklagaren yrkar på fängelse.",
        "st": "المدعي العام يطالب بالسجن."
    },
    {
        "w": "YRKE",
        "t": "مهنة",
        "s": "Lärare är ett mycket viktigt yrke.",
        "st": "المعلم مهنة مهمة جداً."
    },
    {
        "w": "YTA",
        "t": "سطح",
        "s": "Vattnets yta.",
        "st": "سطح الماء."
    },
    {
        "w": "YXA",
        "t": "فأس",
        "s": "Hugg ved med yxan.",
        "st": "اقطع الخشب بالفأس."
    },
    {
        "w": "ZAKAT",
        "t": "زكاة",
        "s": "Zakat är en av islams pelare.",
        "st": "الزكاة هي أحد أركان الإسلام."
    },
    {
        "w": "ZON",
        "t": "منطقة",
        "s": "Det är en farlig zon.",
        "st": "منطقة خطر."
    },
    {
        "w": "ZOO",
        "t": "حديقة حيوان",
        "s": "Vi besökte ett zoo.",
        "st": "زرنا حديقة الحيوان."
    }
]
    ;

