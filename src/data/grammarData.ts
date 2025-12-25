import { GrammarDatabase } from '../types';

export const grammarDatabase: GrammarDatabase = {
    'word-order': [
        {
            words: ['Jag', 'äter', 'ett', 'äpple'],
            correct: ['Jag', 'äter', 'ett', 'äpple'],
            hint: 'Översätt: أنا آكل تفاحة',
            explanation: 'Rak ordföljd: Subjekt + Verb + Objekt',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مفعول به'
        },
        {
            words: ['Hon', 'läser', 'en', 'bok'],
            correct: ['Hon', 'läser', 'en', 'bok'],
            hint: 'Översätt: هي تقرأ كتاباً',
            explanation: 'Rak ordföljd: Subjekt + Verb + Objekt',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مفعول به'
        },
        {
            words: ['Vi', 'spelar', 'fotboll', 'idag'],
            correct: ['Vi', 'spelar', 'fotboll', 'idag'],
            hint: 'Översätt: نحن نلعب كرة القدم اليوم',
            explanation: 'Rak ordföljd: Subjekt + Verb + Objekt + Tid',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مفعول + زمان'
        },
        {
            words: ['De', 'bor', 'i', 'Stockholm'],
            correct: ['De', 'bor', 'i', 'Stockholm'],
            hint: 'Översätt: هم يسكنون في ستوكهولم',
            explanation: 'Rak ordföljd: Subjekt + Verb + Plats',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مكان'
        },
        {
            words: ['Han', 'köper', 'en', 'ny', 'bil'],
            correct: ['Han', 'köper', 'en', 'ny', 'bil'],
            hint: 'Översätt: هو يشتري سيارة جديدة',
            explanation: 'Rak ordföljd: Subjekt + Verb + Objekt',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مفعول به'
        },
        {
            words: ['Katten', 'sover', 'på', 'soffan'],
            correct: ['Katten', 'sover', 'på', 'soffan'],
            hint: 'Översätt: القطة تنام على الأريكة',
            explanation: 'Rak ordföljd: Subjekt + Verb + Plats',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مكان'
        },
        {
            words: ['Pojken', 'dricker', 'kall', 'mjölk'],
            correct: ['Pojken', 'dricker', 'kall', 'mjölk'],
            hint: 'Översätt: الولد يشرب حليباً بارداً',
            explanation: 'Rak ordföljd: Subjekt + Verb + Objekt',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مفعول به'
        },
        {
            words: ['Flickan', 'skriver', 'ett', 'långt', 'brev'],
            correct: ['Flickan', 'skriver', 'ett', 'långt', 'brev'],
            hint: 'Översätt: الفتاة تكتب رسالة طويلة',
            explanation: 'Rak ordföljd: Subjekt + Verb + Objekt',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مفعول به'
        },
        {
            words: ['Vi', 'tittar', 'på', 'TV', 'nu'],
            correct: ['Vi', 'tittar', 'på', 'TV', 'nu'],
            hint: 'Översätt: نحن نشاهد التلفاز الآن',
            explanation: 'Rak ordföljd: Subjekt + Verb + Objekt + Tid',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مفعول + زمان'
        },
        {
            words: ['Mannen', 'arbetar', 'på', 'ett', 'kontor'],
            correct: ['Mannen', 'arbetar', 'på', 'ett', 'kontor'],
            hint: 'Översätt: الرجل يعمل في مكتب',
            explanation: 'Rak ordföljd: Subjekt + Verb + Plats',
            explanationAr: 'ترتيب مباشر: فاعل + فعل + مكان'
        }
    ],
    'v2-rule': [
        {
            words: ['Idag', 'äter', 'jag', 'fisk'],
            correct: ['Idag', 'äter', 'jag', 'fisk'],
            hint: 'Översätt: اليوم آكل السمك',
            explanation: 'V2-regeln: Verbet kommer alltid på andra plats',
            explanationAr: 'قاعدة V2: الفعل يأتي دائماً في المرتبة الثانية'
        },
        {
            words: ['Imorgon', 'reser', 'vi', 'till', 'Spanien'],
            correct: ['Imorgon', 'reser', 'vi', 'till', 'Spanien'],
            hint: 'Översätt: غداً نسافر إلى إسبانيا',
            explanation: 'V2-regeln: Tidsadverb först → Verbet på plats 2',
            explanationAr: 'قاعدة V2: ظرف الزمان أولاً ← الفعل ثانياً'
        },
        {
            words: ['Nu', 'måste', 'du', 'lyssna'],
            correct: ['Nu', 'måste', 'du', 'lyssna'],
            hint: 'Översätt: الآن يجب عليك أن تستمع',
            explanation: 'V2-regeln: Tidsadverb först → Verbet på plats 2',
            explanationAr: 'قاعدة V2: ظرف الزمان أولاً ← الفعل ثانياً'
        },
        {
            words: ['Ibland', 'går', 'jag', 'på', 'bio'],
            correct: ['Ibland', 'går', 'jag', 'på', 'bio'],
            hint: 'Översätt: أحياناً أذهب إلى السينما',
            explanation: 'V2-regeln: Tidsadverb först → Verbet på plats 2',
            explanationAr: 'قاعدة V2: ظرف الزمان أولاً ← الفعل ثانياً'
        },
        {
            words: ['Sedan', 'gick', 'hon', 'hem'],
            correct: ['Sedan', 'gick', 'hon', 'hem'],
            hint: 'Översätt: ثم ذهبت هي إلى المنزل',
            explanation: 'V2-regeln: Adverb först → Verbet på plats 2',
            explanationAr: 'قاعدة V2: الظرف أولاً ← الفعل ثانياً'
        },
        {
            words: ['Därför', 'är', 'jag', 'glad'],
            correct: ['Därför', 'är', 'jag', 'glad'],
            hint: 'Översätt: لذلك أنا سعيد',
            explanation: 'V2-regeln: Orsak först → Verbet på plats 2',
            explanationAr: 'قاعدة V2: السبب أولاً ← الفعل ثانياً'
        },
        {
            words: ['Kanske', 'kommer', 'han', 'senare'],
            correct: ['Kanske', 'kommer', 'han', 'senare'],
            hint: 'Översätt: ربما يأتي هو لاحقاً',
            explanation: 'V2-regeln: Adverb först → Verbet på plats 2',
            explanationAr: 'قاعدة V2: الظرف أولاً ← الفعل ثانياً'
        },
        {
            words: ['I', 'Sverige', 'talar', 'man', 'svenska'],
            correct: ['I', 'Sverige', 'talar', 'man', 'svenska'],
            hint: 'Översätt: في السويد يتحدث المرء السويدية',
            explanation: 'V2-regeln: Plats först → Verbet på plats 2',
            explanationAr: 'قاعدة V2: المكان أولاً ← الفعل ثانياً'
        },
        {
            words: ['På', 'sommaren', 'badar', 'vi', 'ofta'],
            correct: ['På', 'sommaren', 'badar', 'vi', 'ofta'],
            hint: 'Översätt: في الصيف نسبح غالباً',
            explanation: 'V2-regeln: Tid först → Verbet på plats 2',
            explanationAr: 'قاعدة V2: الزمان أولاً ← الفعل ثانياً'
        },
        {
            words: ['Tyvärr', 'har', 'jag', 'inga', 'pengar'],
            correct: ['Tyvärr', 'har', 'jag', 'inga', 'pengar'],
            hint: 'Översätt: للأسف ليس لدي أي نقود',
            explanation: 'V2-regeln: Satsadverb först → Verbet på plats 2',
            explanationAr: 'قاعدة V2: ظرف الجملة أولاً ← الفعل ثانياً'
        }
    ],
    'questions': [
        {
            words: ['Vad', 'heter', 'du', '?'],
            correct: ['Vad', 'heter', 'du', '?'],
            hint: 'Översätt: ما اسمك؟',
            explanation: 'Frågeord + Verb + Subjekt',
            explanationAr: 'أداة استفهام + فعل + فاعل'
        },
        {
            words: ['Var', 'bor', 'du', '?'],
            correct: ['Var', 'bor', 'du', '?'],
            hint: 'Översätt: أين تسكن؟',
            explanation: 'Frågeord + Verb + Subjekt',
            explanationAr: 'أداة استفهام + فعل + فاعل'
        },
        {
            words: ['När', 'kommer', 'bussen', '?'],
            correct: ['När', 'kommer', 'bussen', '?'],
            hint: 'Översätt: متى تأتي الحافلة؟',
            explanation: 'Frågeord + Verb + Subjekt',
            explanationAr: 'أداة استفهام + فعل + فاعل'
        },
        {
            words: ['Hur', 'mår', 'du', 'idag', '?'],
            correct: ['Hur', 'mår', 'du', 'idag', '?'],
            hint: 'Översätt: كيف حالك اليوم؟',
            explanation: 'Frågeord + Verb + Subjekt',
            explanationAr: 'أداة استفهام + فعل + فاعل'
        },
        {
            words: ['Varför', 'gråter', 'barnet', '?'],
            correct: ['Varför', 'gråter', 'barnet', '?'],
            hint: 'Översätt: لماذا يبكي الطفل؟',
            explanation: 'Frågeord + Verb + Subjekt',
            explanationAr: 'أداة استفهام + فعل + فاعل'
        },
        {
            words: ['Vem', 'är', 'den', 'där', 'mannen', '?'],
            correct: ['Vem', 'är', 'den', 'där', 'mannen', '?'],
            hint: 'Översätt: من هو ذلك الرجل؟',
            explanation: 'Frågeord + Verb + Subjekt',
            explanationAr: 'أداة استفهام + فعل + فاعل'
        },
        {
            words: ['Vilken', 'färg', 'gillar', 'du', '?'],
            correct: ['Vilken', 'färg', 'gillar', 'du', '?'],
            hint: 'Översätt: أي لون تحب؟',
            explanation: 'Frågeord + Verb + Subjekt',
            explanationAr: 'أداة استفهام + فعل + فاعل'
        },
        {
            words: ['Har', 'du', 'en', 'katt', '?'],
            correct: ['Har', 'du', 'en', 'katt', '?'],
            hint: 'Översätt: هل لديك قطة؟',
            explanation: 'Ja/Nej-fråga: Verb + Subjekt',
            explanationAr: 'سؤال نعم/لا: فعل + فاعل'
        },
        {
            words: ['Talar', 'du', 'svenska', '?'],
            correct: ['Talar', 'du', 'svenska', '?'],
            hint: 'Översätt: هل تتحدث السويدية؟',
            explanation: 'Ja/Nej-fråga: Verb + Subjekt',
            explanationAr: 'سؤال نعم/لا: فعل + فاعل'
        },
        {
            words: ['Är', 'du', 'hungrig', 'nu', '?'],
            correct: ['Är', 'du', 'hungrig', 'nu', '?'],
            hint: 'Översätt: هل أنت جائع الآن؟',
            explanation: 'Ja/Nej-fråga: Verb + Subjekt',
            explanationAr: 'سؤال نعم/لا: فعل + فاعل'
        }
    ],
    'adverbs': [
        {
            words: ['Jag', 'dricker', 'alltid', 'kaffe'],
            correct: ['Jag', 'dricker', 'alltid', 'kaffe'],
            hint: 'Översätt: أنا أشرب القهوة دائماً',
            explanation: 'Satsadverb placeras efter verbet i huvudsats',
            explanationAr: 'ظرف الجملة يوضع بعد الفعل في الجملة الرئيسية'
        },
        {
            words: ['Hon', 'kommer', 'aldrig', 'försent'],
            correct: ['Hon', 'kommer', 'aldrig', 'försent'],
            hint: 'Översätt: هي لا تأتي متأخرة أبداً',
            explanation: 'Satsadverb placeras efter verbet i huvudsats',
            explanationAr: 'ظرف الجملة يوضع بعد الفعل في الجملة الرئيسية'
        },
        {
            words: ['Vi', 'träffas', 'ofta', 'i', 'parken'],
            correct: ['Vi', 'träffas', 'ofta', 'i', 'parken'],
            hint: 'Översätt: نحن نلتقي غالباً في الحديقة',
            explanation: 'Satsadverb placeras efter verbet i huvudsats',
            explanationAr: 'ظرف الجملة يوضع بعد الفعل في الجملة الرئيسية'
        },
        {
            words: ['Han', 'är', 'inte', 'hemma'],
            correct: ['Han', 'är', 'inte', 'hemma'],
            hint: 'Översätt: هو ليس في المنزل',
            explanation: '"Inte" placeras efter verbet',
            explanationAr: '"Inte" توضع بعد الفعل'
        },
        {
            words: ['Du', 'förstår', 'kanske', 'problemet'],
            correct: ['Du', 'förstår', 'kanske', 'problemet'],
            hint: 'Översätt: ربما تفهم المشكلة',
            explanation: 'Satsadverb placeras efter verbet',
            explanationAr: 'ظرف الجملة يوضع بعد الفعل'
        },
        {
            words: ['De', 'äter', 'sällan', 'kött'],
            correct: ['De', 'äter', 'sällan', 'kött'],
            hint: 'Översätt: هم نادراً ما يأكلون اللحم',
            explanation: 'Satsadverb placeras efter verbet',
            explanationAr: 'ظرف الجملة يوضع بعد الفعل'
        },
        {
            words: ['Jag', 'kan', 'tyvärr', 'inte', 'komma'],
            correct: ['Jag', 'kan', 'tyvärr', 'inte', 'komma'],
            hint: 'Översätt: للأسف لا أستطيع المجيء',
            explanation: 'Satsadverb placeras efter första verbet (hjälpverbet)',
            explanationAr: 'ظرف الجملة يوضع بعد الفعل المساعد الأول'
        },
        {
            words: ['Hon', 'vill', 'gärna', 'hjälpa', 'till'],
            correct: ['Hon', 'vill', 'gärna', 'hjälpa', 'till'],
            hint: 'Översätt: هي تود المساعدة بسرور',
            explanation: 'Satsadverb placeras efter första verbet',
            explanationAr: 'ظرف الجملة يوضع بعد الفعل الأول'
        },
        {
            words: ['Vi', 'har', 'redan', 'ätit', 'middag'],
            correct: ['Vi', 'har', 'redan', 'ätit', 'middag'],
            hint: 'Översätt: لقد تناولنا العشاء بالفعل',
            explanation: 'Satsadverb placeras efter hjälpverbet "har"',
            explanationAr: 'ظرف الجملة يوضع بعد الفعل المساعد "har"'
        },
        {
            words: ['Bussen', 'går', 'snart', 'från', 'stationen'],
            correct: ['Bussen', 'går', 'snart', 'från', 'stationen'],
            hint: 'Översätt: الحافلة تغادر قريباً من المحطة',
            explanation: 'Tidsadverb kan placeras efter verbet',
            explanationAr: 'ظرف الزمان يمكن وضعه بعد الفعل'
        }
    ],
    'time-manner-place': [
        {
            words: ['Jag', 'åker', 'buss', 'till', 'skolan', 'varje', 'dag'],
            correct: ['Jag', 'åker', 'buss', 'till', 'skolan', 'varje', 'dag'],
            hint: 'Översätt: أركب الحافلة إلى المدرسة كل يوم',
            explanation: 'Plats (till skolan) kommer före Tid (varje dag)',
            explanationAr: 'المكان يأتي قبل الزمان'
        },
        {
            words: ['Hon', 'springer', 'snabbt', 'i', 'skogen', 'på', 'morgonen'],
            correct: ['Hon', 'springer', 'snabbt', 'i', 'skogen', 'på', 'morgonen'],
            hint: 'Översätt: هي تركض بسرعة في الغابة في الصباح',
            explanation: 'Sätt (snabbt) > Plats (i skogen) > Tid (på morgonen)',
            explanationAr: 'الطريقة > المكان > الزمان'
        },
        {
            words: ['Vi', 'åt', 'middag', 'hemma', 'igår'],
            correct: ['Vi', 'åt', 'middag', 'hemma', 'igår'],
            hint: 'Översätt: تناولنا العشاء في المنزل أمس',
            explanation: 'Plats (hemma) kommer före Tid (igår)',
            explanationAr: 'المكان يأتي قبل الزمان'
        },
        {
            words: ['Han', 'spelar', 'piano', 'vackert', 'i', 'kyrkan'],
            correct: ['Han', 'spelar', 'piano', 'vackert', 'i', 'kyrkan'],
            hint: 'Översätt: هو يعزف البيانو بجمال في الكنيسة',
            explanation: 'Sätt (vackert) kommer före Plats (i kyrkan)',
            explanationAr: 'الطريقة تأتي قبل المكان'
        },
        {
            words: ['De', 'träffades', 'i', 'parken', 'klockan', 'tre'],
            correct: ['De', 'träffades', 'i', 'parken', 'klockan', 'tre'],
            hint: 'Översätt: التقوا في الحديقة الساعة الثالثة',
            explanation: 'Plats (i parken) kommer före Tid (klockan tre)',
            explanationAr: 'المكان يأتي قبل الزمان'
        },
        {
            words: ['Jag', 'läste', 'boken', 'noga', 'hela', 'kvällen'],
            correct: ['Jag', 'läste', 'boken', 'noga', 'hela', 'kvällen'],
            hint: 'Översätt: قرأت الكتاب بعناية طوال المساء',
            explanation: 'Sätt (noga) kommer före Tid (hela kvällen)',
            explanationAr: 'الطريقة تأتي قبل الزمان'
        },
        {
            words: ['Barnen', 'lekte', 'glatt', 'på', 'gården'],
            correct: ['Barnen', 'lekte', 'glatt', 'på', 'gården'],
            hint: 'Översätt: لعب الأطفال بمرح في الفناء',
            explanation: 'Sätt (glatt) kommer före Plats (på gården)',
            explanationAr: 'الطريقة تأتي قبل المكان'
        },
        {
            words: ['Vi', 'ska', 'resa', 'till', 'Italien', 'nästa', 'vecka'],
            correct: ['Vi', 'ska', 'resa', 'till', 'Italien', 'nästa', 'vecka'],
            hint: 'Översätt: سنسافر إلى إيطاليا الأسبوع القادم',
            explanation: 'Plats (till Italien) kommer före Tid (nästa vecka)',
            explanationAr: 'المكان يأتي قبل الزمان'
        },
        {
            words: ['Han', 'körde', 'långsamt', 'genom', 'staden'],
            correct: ['Han', 'körde', 'långsamt', 'genom', 'staden'],
            hint: 'Översätt: قاد ببطء عبر المدينة',
            explanation: 'Sätt (långsamt) kommer före Plats (genom staden)',
            explanationAr: 'الطريقة تأتي قبل المكان'
        },
        {
            words: ['Hon', 'sjöng', 'högt', 'i', 'duschen', 'i', 'morse'],
            correct: ['Hon', 'sjöng', 'högt', 'i', 'duschen', 'i', 'morse'],
            hint: 'Översätt: غنت بصوت عالٍ في الدش هذا الصباح',
            explanation: 'Sätt > Plats > Tid',
            explanationAr: 'الطريقة > المكان > الزمان'
        }
    ],
    'bisatser': [
        {
            words: ['Jag', 'vet', 'att', 'han', 'inte', 'kommer'],
            correct: ['Jag', 'vet', 'att', 'han', 'inte', 'kommer'],
            hint: 'Översätt: أنا أعلم أنه لن يأتي',
            explanation: 'BIFF-regeln: I Bisats kommer "Inte" Före Första verbet',
            explanationAr: 'قاعدة BIFF: في الجملة التابعة تأتي "inte" قبل الفعل الأول'
        },
        {
            words: ['Hon', 'sa', 'att', 'hon', 'var', 'trött'],
            correct: ['Hon', 'sa', 'att', 'hon', 'var', 'trött'],
            hint: 'Översätt: قالت إنها كانت متعبة',
            explanation: 'Bisats inleds med "att"',
            explanationAr: 'الجملة التابعة تبدأ بـ "att"'
        },
        {
            words: ['Om', 'det', 'regnar', 'stannar', 'vi', 'hemma'],
            correct: ['Om', 'det', 'regnar', 'stannar', 'vi', 'hemma'],
            hint: 'Översätt: إذا أمطرت سنبقى في المنزل',
            explanation: 'Bisats (Om det regnar) först → Huvudsats med omvänd ordföljd',
            explanationAr: 'الجملة التابعة أولاً ← الجملة الرئيسية بترتيب معكوس'
        },
        {
            words: ['När', 'jag', 'var', 'liten', 'bodde', 'jag', 'där'],
            correct: ['När', 'jag', 'var', 'liten', 'bodde', 'jag', 'där'],
            hint: 'Översätt: عندما كنت صغيراً سكنت هناك',
            explanation: 'Bisats först → Verbet kommer direkt efter i huvudsatsen',
            explanationAr: 'الجملة التابعة أولاً ← الفعل يأتي مباشرة بعدها في الجملة الرئيسية'
        },
        {
            words: ['Han', 'frågade', 'om', 'jag', 'ville', 'fika'],
            correct: ['Han', 'frågade', 'om', 'jag', 'ville', 'fika'],
            hint: 'Översätt: سأل عما إذا كنت أرغب في شرب القهوة',
            explanation: 'Indirekt fråga inleds med "om"',
            explanationAr: 'السؤال غير المباشر يبدأ بـ "om"'
        },
        {
            words: ['Eftersom', 'han', 'är', 'sjuk', 'arbetar', 'han', 'inte'],
            correct: ['Eftersom', 'han', 'är', 'sjuk', 'arbetar', 'han', 'inte'],
            hint: 'Översätt: لأنه مريض فهو لا يعمل',
            explanation: 'Bisats med "eftersom" beskriver orsak',
            explanationAr: 'الجملة التابعة بـ "eftersom" تصف السبب'
        },
        {
            words: ['Jag', 'tror', 'att', 'det', 'kommer', 'att', 'snöa'],
            correct: ['Jag', 'tror', 'att', 'det', 'kommer', 'att', 'snöa'],
            hint: 'Översätt: أعتقد أنها سوف تثلج',
            explanation: 'Bisats efter "tror att"',
            explanationAr: 'جملة تابعة بعد "tror att"'
        },
        {
            words: ['Mannen', 'som', 'bor', 'här', 'är', 'trevlig'],
            correct: ['Mannen', 'som', 'bor', 'här', 'är', 'trevlig'],
            hint: 'Översätt: الرجل الذي يسكن هنا لطيف',
            explanation: 'Relativ bisats inleds med "som"',
            explanationAr: 'جملة الوصل تبدأ بـ "som"'
        },
        {
            words: ['Boken', 'som', 'jag', 'läser', 'är', 'spännande'],
            correct: ['Boken', 'som', 'jag', 'läser', 'är', 'spännande'],
            hint: 'Översätt: الكتاب الذي أقرأه مثير',
            explanation: 'Relativ bisats inleds med "som"',
            explanationAr: 'جملة الوصل تبدأ بـ "som"'
        },
        {
            words: ['Vi', 'gick', 'ut', 'fastän', 'det', 'var', 'kallt'],
            correct: ['Vi', 'gick', 'ut', 'fastän', 'det', 'var', 'kallt'],
            hint: 'Översätt: خرجنا رغم أنها كانت باردة',
            explanation: 'Bisats med "fastän" (trots att)',
            explanationAr: 'جملة تابعة بـ "fastän" (رغم أن)'
        }
    ],
    'possessiva': [
        {
            words: ['Det', 'här', 'är', 'min', 'bil'],
            correct: ['Det', 'här', 'är', 'min', 'bil'],
            hint: 'Översätt: هذه سيارتي',
            explanation: 'Possessivt pronomen: Min (en-ord)',
            explanationAr: 'ضمير الملكية: Min (للكلمات من نوع en)'
        },
        {
            words: ['Var', 'är', 'ditt', 'hus', '?'],
            correct: ['Var', 'är', 'ditt', 'hus', '?'],
            hint: 'Översätt: أين منزلك؟',
            explanation: 'Possessivt pronomen: Ditt (ett-ord)',
            explanationAr: 'ضمير الملكية: Ditt (للكلمات من نوع ett)'
        },
        {
            words: ['Hennes', 'katt', 'är', 'mycket', 'gammal'],
            correct: ['Hennes', 'katt', 'är', 'mycket', 'gammal'],
            hint: 'Översätt: قطتها عجوزة جداً',
            explanation: 'Possessivt pronomen: Hennes (henne)',
            explanationAr: 'ضمير الملكية: Hennes (لها)'
        },
        {
            words: ['Hans', 'bror', 'bor', 'i', 'Norge'],
            correct: ['Hans', 'bror', 'bor', 'i', 'Norge'],
            hint: 'Översätt: أخوه يسكن في النرويج',
            explanation: 'Possessivt pronomen: Hans (honom)',
            explanationAr: 'ضمير الملكية: Hans (له)'
        },
        {
            words: ['Vårt', 'land', 'är', 'vackert'],
            correct: ['Vårt', 'land', 'är', 'vackert'],
            hint: 'Översätt: بلدنا جميل',
            explanation: 'Possessivt pronomen: Vårt (vi, ett-ord)',
            explanationAr: 'ضمير الملكية: Vårt (نحن، لكلمات ett)'
        },
        {
            words: ['Era', 'böcker', 'ligger', 'på', 'bordet'],
            correct: ['Era', 'böcker', 'ligger', 'på', 'bordet'],
            hint: 'Översätt: كتبكم موجودة على الطاولة',
            explanation: 'Possessivt pronomen: Era (ni, plural)',
            explanationAr: 'ضمير الملكية: Era (أنتم، للجمع)'
        },
        {
            words: ['Deras', 'barn', 'går', 'i', 'skolan'],
            correct: ['Deras', 'barn', 'går', 'i', 'skolan'],
            hint: 'Översätt: أطفالهم يذهبون إلى المدرسة',
            explanation: 'Possessivt pronomen: Deras (de)',
            explanationAr: 'ضمير الملكية: Deras (هم)'
        },
        {
            words: ['Jag', 'älskar', 'mina', 'föräldrar'],
            correct: ['Jag', 'älskar', 'mina', 'föräldrar'],
            hint: 'Översätt: أنا أحب والديّ',
            explanation: 'Possessivt pronomen: Mina (jag, plural)',
            explanationAr: 'ضمير الملكية: Mina (أنا، للجمع)'
        },
        {
            words: ['Är', 'detta', 'er', 'bil', '?'],
            correct: ['Är', 'detta', 'er', 'bil', '?'],
            hint: 'Översätt: هل هذه سيارتكم؟',
            explanation: 'Possessivt pronomen: Er (ni, en-ord)',
            explanationAr: 'ضمير الملكية: Er (أنتم، لكلمات en)'
        },
        {
            words: ['Sin', 'egen', 'lyckas', 'smed'],
            correct: ['Sin', 'egen', 'lyckas', 'smed'],
            hint: 'Översätt: صانع سعادته بنفسه',
            explanation: 'Reflexivt possessivt: Sin (syftar på subjektet)',
            explanationAr: 'ضمير ملكية انعكاسي: Sin (يعود على الفاعل)'
        }
    ],
    'prepositioner': [
        {
            words: ['Boken', 'ligger', 'på', 'bordet'],
            correct: ['Boken', 'ligger', 'på', 'bordet'],
            hint: 'Översätt: الكتاب موضوع على الطاولة',
            explanation: 'Preposition: På (ovanpå yta)',
            explanationAr: 'حرف الجر: På (على سطح)'
        },
        {
            words: ['Katten', 'sover', 'under', 'stolen'],
            correct: ['Katten', 'sover', 'under', 'stolen'],
            hint: 'Översätt: القطة تنام تحت الكرسي',
            explanation: 'Preposition: Under',
            explanationAr: 'حرف الجر: Under (تحت)'
        },
        {
            words: ['Tavlan', 'hänger', 'på', 'väggen'],
            correct: ['Tavlan', 'hänger', 'på', 'väggen'],
            hint: 'Översätt: اللوحة معلقة على الحائط',
            explanation: 'Preposition: På (yta)',
            explanationAr: 'حرف الجر: På (على سطح)'
        },
        {
            words: ['Han', 'går', 'in', 'i', 'rummet'],
            correct: ['Han', 'går', 'in', 'i', 'rummet'],
            hint: 'Översätt: هو يدخل إلى الغرفة',
            explanation: 'Preposition: I (rörelse inåt)',
            explanationAr: 'حرف الجر: I (حركة للداخل)'
        },
        {
            words: ['Lampan', 'hänger', 'över', 'bordet'],
            correct: ['Lampan', 'hänger', 'över', 'bordet'],
            hint: 'Översätt: المصباح معلق فوق الطاولة',
            explanation: 'Preposition: Över (ovanför utan kontakt)',
            explanationAr: 'حرف الجر: Över (فوق بدون تلامس)'
        },
        {
            words: ['Vi', 'sitter', 'vid', 'bordet'],
            correct: ['Vi', 'sitter', 'vid', 'bordet'],
            hint: 'Översätt: نحن نجلس عند الطاولة',
            explanation: 'Preposition: Vid (bredvid/nära)',
            explanationAr: 'حرف الجر: Vid (عند/بجانب)'
        },
        {
            words: ['Hon', 'springer', 'mot', 'bussen'],
            correct: ['Hon', 'springer', 'mot', 'bussen'],
            hint: 'Översätt: هي تركض نحو الحافلة',
            explanation: 'Preposition: Mot (riktning)',
            explanationAr: 'حرف الجر: Mot (نحو)'
        },
        {
            words: ['Han', 'gömmer', 'sig', 'bakom', 'trädet'],
            correct: ['Han', 'gömmer', 'sig', 'bakom', 'trädet'],
            hint: 'Översätt: هو يختبئ خلف الشجرة',
            explanation: 'Preposition: Bakom',
            explanationAr: 'حرف الجر: Bakom (خلف)'
        },
        {
            words: ['Bilen', 'står', 'framför', 'huset'],
            correct: ['Bilen', 'står', 'framför', 'huset'],
            hint: 'Översätt: السيارة واقفة أمام المنزل',
            explanation: 'Preposition: Framför',
            explanationAr: 'حرف الجر: Framför (أمام)'
        },
        {
            words: ['De', 'promenerar', 'längs', 'stranden'],
            correct: ['De', 'promenerar', 'längs', 'stranden'],
            hint: 'Översätt: هم يتنزهون على طول الشاطئ',
            explanation: 'Preposition: Längs',
            explanationAr: 'حرف الجر: Längs (على طول)'
        },
        {
            words: ['Fågeln', 'flyger', 'mellan', 'träden'],
            correct: ['Fågeln', 'flyger', 'mellan', 'träden'],
            hint: 'Översätt: الطائر يطير بين الأشجار',
            explanation: 'Preposition: Mellan',
            explanationAr: 'حرف الجر: Mellan (بين)'
        },
        {
            words: ['Han', 'tittar', 'på', 'TV'],
            correct: ['Han', 'tittar', 'på', 'TV'],
            hint: 'Översätt: هو يشاهد التلفاز',
            explanation: 'Preposition: Titta PÅ',
            explanationAr: 'حرف الجر: ينظر إلى (Titta PÅ)'
        },
        {
            words: ['Hon', 'tycker', 'om', 'choklad'],
            correct: ['Hon', 'tycker', 'om', 'choklad'],
            hint: 'Översätt: هي تحب الشوكولاتة',
            explanation: 'Partikelverb: Tycka OM (gilla)',
            explanationAr: 'فعل مركب: Tycka OM (يحب)'
        },
        {
            words: ['Vi', 'åker', 'till', 'Stockholm'],
            correct: ['Vi', 'åker', 'till', 'Stockholm'],
            hint: 'Översätt: نحن ذاهبون إلى ستوكهولم',
            explanation: 'Preposition: Till (riktning)',
            explanationAr: 'حرف الجر: Till (إلى - اتجاه)'
        },
        {
            words: ['Jag', 'kommer', 'från', 'Sverige'],
            correct: ['Jag', 'kommer', 'från', 'Sverige'],
            hint: 'Översätt: أنا قادم من السويد',
            explanation: 'Preposition: Från (ursprung)',
            explanationAr: 'حرف الجر: Från (من - أصل)'
        },
        {
            words: ['Han', 'är', 'kär', 'i', 'henne'],
            correct: ['Han', 'är', 'kär', 'i', 'henne'],
            hint: 'Översätt: هو مغرم بها',
            explanation: 'Preposition: Kär I någon',
            explanationAr: 'حرف الجر: مغرم بـ (Kär I)'
        },
        {
            words: ['De', 'talar', 'med', 'varandra'],
            correct: ['De', 'talar', 'med', 'varandra'],
            hint: 'Översätt: هم يتحدثون مع بعضهم البعض',
            explanation: 'Preposition: Med (tillsammans)',
            explanationAr: 'حرف الجر: Med (مع)'
        },
        {
            words: ['Nyckeln', 'sitter', 'i', 'dörren'],
            correct: ['Nyckeln', 'sitter', 'i', 'dörren'],
            hint: 'Översätt: المفتاح موجود في الباب',
            explanation: 'Preposition: I (inuti)',
            explanationAr: 'حرف الجر: I (في - داخل)'
        },
        {
            words: ['Vi', 'väntar', 'på', 'bussen'],
            correct: ['Vi', 'väntar', 'på', 'bussen'],
            hint: 'Översätt: نحن ننتظر الحافلة',
            explanation: 'Preposition: Vänta PÅ',
            explanationAr: 'حرف الجر: ينتظر (Vänta PÅ)'
        }
    ],
    'passiv': [
        {
            words: ['Dörren', 'öppnas', 'av', 'mannen'],
            correct: ['Dörren', 'öppnas', 'av', 'mannen'],
            hint: 'Översätt: الباب يُفتح من قبل الرجل',
            explanation: 'Passiv: Verbet slutar på -s',
            explanationAr: 'المبني للمجهول: الفعل ينتهي بـ -s'
        },
        {
            words: ['Boken', 'skrevs', 'av', 'Astrid', 'Lindgren'],
            correct: ['Boken', 'skrevs', 'av', 'Astrid', 'Lindgren'],
            hint: 'Översätt: الكتاب كُتب من قبل أستريد ليندغرين',
            explanation: 'Passiv dåtid: Skrevs',
            explanationAr: 'المبني للمجهول ماضي: Skrevs'
        },
        {
            words: ['Huset', 'målades', 'rött'],
            correct: ['Huset', 'målades', 'rött'],
            hint: 'Översätt: المنزل دُهن باللون الأحمر',
            explanation: 'Passiv: Målades (någon målade det)',
            explanationAr: 'المبني للمجهول: Målades (شخص ما دهنه)'
        },
        {
            words: ['Maten', 'lagas', 'i', 'köket'],
            correct: ['Maten', 'lagas', 'i', 'köket'],
            hint: 'Översätt: الطعام يُطهى في المطبخ',
            explanation: 'Passiv: Lagas',
            explanationAr: 'المبني للمجهول: Lagas'
        },
        {
            words: ['Brevet', 'skickades', 'igår'],
            correct: ['Brevet', 'skickades', 'igår'],
            hint: 'Översätt: الرسالة أُرسلت أمس',
            explanation: 'Passiv: Skickades',
            explanationAr: 'المبني للمجهول: Skickades'
        },
        {
            words: ['Bilen', 'tvättas', 'varje', 'vecka'],
            correct: ['Bilen', 'tvättas', 'varje', 'vecka'],
            hint: 'Översätt: السيارة تُغسل كل أسبوع',
            explanation: 'Passiv: Tvättas',
            explanationAr: 'المبني للمجهول: Tvättas'
        },
        {
            words: ['Svenska', 'talas', 'i', 'Sverige'],
            correct: ['Svenska', 'talas', 'i', 'Sverige'],
            hint: 'Översätt: السويدية تُتحدث في السويد',
            explanation: 'Passiv: Talas',
            explanationAr: 'المبني للمجهول: Talas'
        },
        {
            words: ['Läxan', 'gjordes', 'av', 'eleven'],
            correct: ['Läxan', 'gjordes', 'av', 'eleven'],
            hint: 'Översätt: الوظيفة عُملت من قبل التلميذ',
            explanation: 'Passiv: Gjordes',
            explanationAr: 'المبني للمجهول: Gjordes'
        },
        {
            words: ['Kaffet', 'dricks', 'varmt'],
            correct: ['Kaffet', 'dricks', 'varmt'],
            hint: 'Översätt: القهوة تُشرب ساخنة',
            explanation: 'Passiv: Dricks',
            explanationAr: 'المبني للمجهول: Dricks'
        },
        {
            words: ['Nyheter', 'läses', 'på', 'TV'],
            correct: ['Nyheter', 'läses', 'på', 'TV'],
            hint: 'Översätt: الأخبار تُقرأ على التلفاز',
            explanation: 'Passiv: Läses',
            explanationAr: 'المبني للمجهول: Läses'
        }
    ],
    'imperativ': [
        {
            words: ['Kom', 'hit', '!'],
            correct: ['Kom', 'hit', '!'],
            hint: 'Översätt: تعال إلى هنا!',
            explanation: 'Imperativ: Uppmaning',
            explanationAr: 'صيغة الأمر: طلب أو أمر'
        },
        {
            words: ['Lyssna', 'på', 'mig', '!'],
            correct: ['Lyssna', 'på', 'mig', '!'],
            hint: 'Översätt: استمع إلي!',
            explanation: 'Imperativ: Lyssna',
            explanationAr: 'صيغة الأمر: استمع'
        },
        {
            words: ['Stäng', 'dörren', '!'],
            correct: ['Stäng', 'dörren', '!'],
            hint: 'Översätt: أغلق الباب!',
            explanation: 'Imperativ: Stäng',
            explanationAr: 'صيغة الأمر: أغلق'
        },
        {
            words: ['Öppna', 'fönstret', '!'],
            correct: ['Öppna', 'fönstret', '!'],
            hint: 'Översätt: افتح النافذة!',
            explanation: 'Imperativ: Öppna',
            explanationAr: 'صيغة الأمر: افتح'
        },
        {
            words: ['Var', 'tyst', '!'],
            correct: ['Var', 'tyst', '!'],
            hint: 'Översätt: كن صامتاً!',
            explanation: 'Imperativ: Var (av vara)',
            explanationAr: 'صيغة الأمر: كن'
        },
        {
            words: ['Sitt', 'ner', '!'],
            correct: ['Sitt', 'ner', '!'],
            hint: 'Översätt: اجلس!',
            explanation: 'Imperativ: Sitt',
            explanationAr: 'صيغة الأمر: اجلس'
        },
        {
            words: ['Ät', 'upp', 'maten', '!'],
            correct: ['Ät', 'upp', 'maten', '!'],
            hint: 'Översätt: أنهِ طعامك!',
            explanation: 'Imperativ: Ät',
            explanationAr: 'صيغة الأمر: كل'
        },
        {
            words: ['Skriv', 'ditt', 'namn', '!'],
            correct: ['Skriv', 'ditt', 'namn', '!'],
            hint: 'Översätt: اكتب اسمك!',
            explanation: 'Imperativ: Skriv',
            explanationAr: 'صيغة الأمر: اكتب'
        },
        {
            words: ['Ring', 'mig', 'senare', '!'],
            correct: ['Ring', 'mig', 'senare', '!'],
            hint: 'Översätt: اتصل بي لاحقاً!',
            explanation: 'Imperativ: Ring',
            explanationAr: 'صيغة الأمر: اتصل'
        },
        {
            words: ['Gå', 'hem', 'nu', '!'],
            correct: ['Gå', 'hem', 'nu', '!'],
            hint: 'Översätt: اذهب للمنزل الآن!',
            explanation: 'Imperativ: Gå',
            explanationAr: 'صيغة الأمر: اذهب'
        }
    ],
    'komparativ': [
        {
            words: ['Jag', 'är', 'äldre', 'än', 'du'],
            correct: ['Jag', 'är', 'äldre', 'än', 'du'],
            hint: 'Översätt: أنا أكبر منك سناً',
            explanation: 'Komparativ: Gammal -> Äldre',
            explanationAr: 'المقارنة: Gammal -> Äldre (أكبر)'
        },
        {
            words: ['Min', 'bil', 'är', 'snabbare', 'än', 'din'],
            correct: ['Min', 'bil', 'är', 'snabbare', 'än', 'din'],
            hint: 'Översätt: سيارتي أسرع من سيارتك',
            explanation: 'Komparativ: Snabb -> Snabbare',
            explanationAr: 'المقارنة: Snabb -> Snabbare (أسرع)'
        },
        {
            words: ['Sverige', 'är', 'kallare', 'än', 'Spanien'],
            correct: ['Sverige', 'är', 'kallare', 'än', 'Spanien'],
            hint: 'Översätt: السويد أبرد من إسبانيا',
            explanation: 'Komparativ: Kall -> Kallare',
            explanationAr: 'المقارنة: Kall -> Kallare (أبرد)'
        },
        {
            words: ['Hon', 'är', 'längre', 'än', 'sin', 'syster'],
            correct: ['Hon', 'är', 'längre', 'än', 'sin', 'syster'],
            hint: 'Översätt: هي أطول من أختها',
            explanation: 'Komparativ: Lång -> Längre',
            explanationAr: 'المقارنة: Lång -> Längre (أطول)'
        },
        {
            words: ['Det', 'är', 'bättre', 'att', 'fråga'],
            correct: ['Det', 'är', 'bättre', 'att', 'fråga'],
            hint: 'Översätt: من الأفضل أن تسأل',
            explanation: 'Oregelbunden komparativ: Bra -> Bättre',
            explanationAr: 'مقارنة شاذة: Bra -> Bättre (أفضل)'
        },
        {
            words: ['Denna', 'bok', 'är', 'mer', 'intressant'],
            correct: ['Denna', 'bok', 'är', 'mer', 'intressant'],
            hint: 'Översätt: هذا الكتاب أكثر إثارة للاهتمام',
            explanation: 'Komparativ med "mer" för långa ord',
            explanationAr: 'المقارنة بـ "mer" للكلمات الطويلة'
        },
        {
            words: ['Elefanten', 'är', 'större', 'än', 'musen'],
            correct: ['Elefanten', 'är', 'större', 'än', 'musen'],
            hint: 'Översätt: الفيل أكبر من الفأر',
            explanation: 'Oregelbunden komparativ: Stor -> Större',
            explanationAr: 'مقارنة شاذة: Stor -> Större (أكبر)'
        },
        {
            words: ['Vem', 'är', 'yngst', 'i', 'familjen', '?'],
            correct: ['Vem', 'är', 'yngst', 'i', 'familjen', '?'],
            hint: 'Översätt: من هو الأصغر في العائلة؟',
            explanation: 'Superlativ: Ung -> Yngre -> Yngst',
            explanationAr: 'التفضيل: Ung -> Yngre -> Yngst (الأصغر)'
        },
        {
            words: ['Det', 'var', 'det', 'värsta', 'jag', 'hört'],
            correct: ['Det', 'var', 'det', 'värsta', 'jag', 'hört'],
            hint: 'Översätt: كان ذلك أسوأ ما سمعت',
            explanation: 'Superlativ: Dålig -> Sämre -> Värsta',
            explanationAr: 'التفضيل: Dålig -> Sämre -> Värsta (الأسوأ)'
        },
        {
            words: ['Hon', 'springer', 'fortast', 'av', 'alla'],
            correct: ['Hon', 'springer', 'fortast', 'av', 'alla'],
            hint: 'Översätt: هي تركض الأسرع بين الجميع',
            explanation: 'Superlativ: Fort -> Fortast',
            explanationAr: 'التفضيل: Fort -> Fortast (الأسرع)'
        }
    ],
    'subjunktioner': [
        {
            words: ['Jag', 'stannar', 'hemma', 'eftersom', 'jag', 'är', 'sjuk'],
            correct: ['Jag', 'stannar', 'hemma', 'eftersom', 'jag', 'är', 'sjuk'],
            hint: 'Översätt: سأبقى في المنزل لأنني مريض',
            explanation: 'Subjunktion: Eftersom (orsak)',
            explanationAr: 'أداة ربط: Eftersom (السبب)'
        },
        {
            words: ['Vi', 'går', 'ut', 'när', 'det', 'slutar', 'regna'],
            correct: ['Vi', 'går', 'ut', 'när', 'det', 'slutar', 'regna'],
            hint: 'Översätt: سنخرج عندما يتوقف المطر',
            explanation: 'Subjunktion: När (tid)',
            explanationAr: 'أداة ربط: När (الزمان)'
        },
        {
            words: ['Hon', 'frågade', 'om', 'jag', 'ville', 'komma'],
            correct: ['Hon', 'frågade', 'om', 'jag', 'ville', 'komma'],
            hint: 'Översätt: سألت عما إذا كنت أريد المجيء',
            explanation: 'Subjunktion: Om (fråga)',
            explanationAr: 'أداة ربط: Om (إذا/لو)'
        },
        {
            words: ['Han', 'sa', 'att', 'han', 'älskar', 'dig'],
            correct: ['Han', 'sa', 'att', 'han', 'älskar', 'dig'],
            hint: 'Översätt: قال إنه يحبك',
            explanation: 'Subjunktion: Att (inleder bisats)',
            explanationAr: 'أداة ربط: Att (أن)'
        },
        {
            words: ['Medan', 'jag', 'sov', 'ringde', 'telefonen'],
            correct: ['Medan', 'jag', 'sov', 'ringde', 'telefonen'],
            hint: 'Översätt: بينما كنت نائماً رن الهاتف',
            explanation: 'Subjunktion: Medan (samtidighet)',
            explanationAr: 'أداة ربط: Medan (بينما)'
        },
        {
            words: ['Innan', 'vi', 'äter', 'måste', 'vi', 'tvätta', 'händerna'],
            correct: ['Innan', 'vi', 'äter', 'måste', 'vi', 'tvätta', 'händerna'],
            hint: 'Översätt: قبل أن نأكل يجب أن نغسل أيدينا',
            explanation: 'Subjunktion: Innan (tid)',
            explanationAr: 'أداة ربط: Innan (قبل أن)'
        },
        {
            words: ['Därför', 'att', 'det', 'är', 'roligt'],
            correct: ['Därför', 'att', 'det', 'är', 'roligt'],
            hint: 'Översätt: لأنه ممتع',
            explanation: 'Subjunktion: Därför att (orsak)',
            explanationAr: 'أداة ربط: Därför att (لأنه)'
        },
        {
            words: ['Trots', 'att', 'det', 'snöar', 'cyklar', 'han'],
            correct: ['Trots', 'att', 'det', 'snöar', 'cyklar', 'han'],
            hint: 'Översätt: رغم أنها تثلج فهو يركب الدراجة',
            explanation: 'Subjunktion: Trots att (motsats)',
            explanationAr: 'أداة ربط: Trots att (رغم أن)'
        },
        {
            words: ['Om', 'du', 'vill', 'kan', 'vi', 'gå'],
            correct: ['Om', 'du', 'vill', 'kan', 'vi', 'gå'],
            hint: 'Översätt: إذا كنت تريد يمكننا الذهاب',
            explanation: 'Subjunktion: Om (villkor)',
            explanationAr: 'أداة ربط: Om (إذا - شرط)'
        },
        {
            words: ['Tills', 'vi', 'ses', 'igen'],
            correct: ['Tills', 'vi', 'ses', 'igen'],
            hint: 'Översätt: حتى نلتقي مجدداً',
            explanation: 'Subjunktion: Tills (tid)',
            explanationAr: 'أداة ربط: Tills (حتى)'
        }
    ]
};

