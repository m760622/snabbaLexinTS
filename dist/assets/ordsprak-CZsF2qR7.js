import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css                            */import{o as ae}from"./ordsprak-D1Yflj3Y.js";import{T as H}from"./tts-BZUKiY6M.js";import{L as Q}from"./i18n-D0OWfz62.js";import{c as ie}from"./LearnViewManager-RsT_Dh_9.js";import"./pwa-Bn3RWWLO.js";console.log("[Ordspråk] Module loaded");Q&&Q.init();const r=ae;let u=JSON.parse(localStorage.getItem("ordsprak_saved")||"[]"),p=JSON.parse(localStorage.getItem("ordsprak_learned")||"[]"),B=parseInt(localStorage.getItem("ordsprak_streak")||"0"),E=localStorage.getItem("ordsprak_last_visit")||"",f=[],b=0,C="all",m=!1,g=0,L=1,h=[],y=null;function le(){C="all",k("flashcard")}function oe(){C="saved",k("flashcard")}function D(){const e=document.getElementById("flashcardView");e&&!document.getElementById("flashcard")&&(e.innerHTML=`
            <div class="flashcard-progress">
                <div class="progress-text"><span id="fcCurrent">0</span> / <span id="fcTotal">0</span></div>
                <div class="progress-bar">
                    <div class="fill" id="fcProgress"></div>
                </div>
            </div>

            <div class="flashcard" id="flashcard" onclick="flipCard()">
                <div class="flashcard-inner">
                    <div class="flashcard-front">
                        <div class="flashcard-word" id="fcWord"></div>
                        <div class="flashcard-hint"><span class="sv-text">Klicka för att vända</span><span
                                class="ar-text">اضغط للقلب</span></div>
                    </div>
                    <div class="flashcard-back">
                        <div class="flashcard-translation" id="fcTranslation"></div>
                        <div class="flashcard-literal" id="fcLiteral"></div>
                    </div>
                </div>
            </div>

            <div class="flashcard-controls">
                <button class="fc-btn wrong" onclick="flashcardAnswer(false)">❌ <span class="sv-text">Inte
                        än</span><span class="ar-text">ليس بعد</span></button>
                <button class="fc-btn correct" onclick="flashcardAnswer(true)">✅ <span class="sv-text">Kan
                        det!</span><span class="ar-text">أعرفها!</span></button>
            </div>
        `);let t=[...r];if(C==="saved"&&(t=t.filter(s=>u.includes(s.id)),t.length===0)){alert("Du har inga sparade ordspråk än! / ليس لديك أمثال محفوظة بعد!"),k("browse");return}f=t.sort(()=>.5-Math.random()),C==="all"&&(f=f.slice(0,20)),b=0,Y()}let d={questions:[],index:0,score:0};const R=15;let A=0,w=[],x=null,M="all",F="all",S=!1;const re={patience:["vänta","tålamod","tid","rom","sent","långsam","صبر","انتظ","تأخ"],wisdom:["visdom","tala","tiga","guld","silver","klok","حكم","ذهب","فضة","سكوت"],consequences:["bädda","ligga","bränt","skyr","dropp","bägar","جزاء","عاقب","قصم"],family:["barn","äpple","träd","fader","moder","أب","أم","ابن","شجرة"],experience:["fågel","hand","skogen","björn","skinn","تجرب","يد","عصفور"],time:["morgon","dag","tid","aldrig","läka","sår","وقت","زمن","يوم","صباح"],speech:["tala","höra","öron","säga","ropa","كلام","سمع","آذان","قول"],nature:["fågel","träd","sommar","vinter","gräs","vatten","طبيع","شجر","عشب","ماء"],love:["kärlek","hjärta","älska","حب","قلب","عشق"]};function N(e){const t=`${e.swedishProverb} ${e.literalMeaning} ${e.arabicEquivalent}`.toLowerCase();for(const[s,n]of Object.entries(re))for(const a of n)if(t.includes(a.toLowerCase()))return s;return"wisdom"}function ce(){console.log("[Ordspråk] Initializing..."),fe(),ue(),w=[...r],O(),U(),de(),ve(),k("browse")}function de(){const e=document.getElementById("searchInput");e&&e.addEventListener("input",ke)}function ue(){const e=new Date().toISOString().split("T")[0];if(E!==e){if(E){const t=new Date(E),s=new Date(e),n=Math.abs(s.getTime()-t.getTime()),a=Math.ceil(n/(1e3*60*60*24));a===1?B++:a>1&&(B=1)}else B=1;E=e,V()}}function V(){localStorage.setItem("ordsprak_saved",JSON.stringify(u)),localStorage.setItem("ordsprak_learned",JSON.stringify(p)),localStorage.setItem("ordsprak_streak",B.toString()),localStorage.setItem("ordsprak_last_visit",E)}function O(){const e=document.getElementById("totalProverbs"),t=document.getElementById("learnedCount"),s=document.getElementById("streakCount"),n=document.getElementById("savedCount");e&&(e.textContent=r.length.toString()),t&&(t.textContent=p.length.toString()),s&&(s.textContent=B.toString()),n&&(n.textContent=u.length.toString())}function pe(){const e=document.body.classList.toggle("iphone-view");localStorage.setItem("mobileView",e.toString());const t=document.getElementById("mobileToggle");t&&t.classList.toggle("mobile-active",e)}function ve(){const e=localStorage.getItem("mobileView")==="true";e&&document.body.classList.add("iphone-view");const t=document.getElementById("mobileToggle");t&&t.classList.toggle("mobile-active",e)}const W=ie();function fe(){W.registerViews({browse:{viewId:"browseView"},flashcard:{viewId:"flashcardView",onActivate:D},saved:{viewId:"savedView",onActivate:Be},quiz:{viewId:"quizView"},"quiz-fill":{viewId:"quizView",onActivate:G},"quiz-match":{viewId:"quizView",onActivate:ee}})}function k(e){W.switchTo(e),document.querySelectorAll(".mode-btn").forEach(s=>s.classList.remove("active"));const t=document.getElementById(`btn-${e}`);t&&(t.classList.add("active"),ge(t))}function ge(e){const t=document.getElementById("modeIndicator"),s=document.getElementById("modeSelectionBar");if(!t||!s)return;const n=s.getBoundingClientRect(),a=e.getBoundingClientRect(),i=a.left-n.left;t.style.width=`${a.width}px`,t.style.transform=`translateX(${i-6}px)`}function he(){k("saved")}function me(){S=!S;const e=document.getElementById("filtersDropdown"),t=document.getElementById("filterToggleBtn");e&&e.classList.toggle("collapsed",!S),t&&t.classList.toggle("active",S),S&&xe()}function be(e){M=e,document.querySelectorAll(".filter-chip[data-filter]").forEach(t=>{t.classList.toggle("active",t.getAttribute("data-filter")===e)}),J(),j()}function we(e){F=e,document.querySelectorAll(".topic-chip").forEach(t=>{t.classList.toggle("active",t.getAttribute("data-topic")===e)}),J(),j()}function J(){const e=document.getElementById("filterBadge");if(!e)return;let t=0;M!=="all"&&t++,F!=="all"&&t++,e.textContent=t.toString(),e.style.display=t>0?"flex":"none"}function xe(){const e=r.length,t=u.length,s=p.length,n=r.filter(i=>!p.includes(i.id)).length;P("all",e),P("saved",t),P("learned",s),P("notLearned",n);const a={all:r.length,patience:0,wisdom:0,consequences:0,family:0,experience:0,time:0,speech:0,nature:0,love:0};r.forEach(i=>{const l=N(i);a[l]!==void 0&&a[l]++}),Object.entries(a).forEach(([i,l])=>{ye(i,l)})}function P(e,t){const s=document.querySelector(`.filter-chip[data-filter="${e}"]`);if(!s)return;let n=s.querySelector(".filter-counter");n||(n=document.createElement("span"),n.className="filter-counter",s.appendChild(n)),n.textContent=t.toString()}function ye(e,t){const s=document.querySelector(`.topic-chip[data-topic="${e}"]`);if(!s)return;let n=s.querySelector(".filter-counter");n||(n=document.createElement("span"),n.className="filter-counter",s.appendChild(n)),n.textContent=t.toString()}function j(){const e=document.getElementById("searchInput"),t=(e==null?void 0:e.value.toLowerCase().trim())||"";let s=[...r];M==="saved"?s=s.filter(n=>u.includes(n.id)):M==="learned"?s=s.filter(n=>p.includes(n.id)):M==="notLearned"&&(s=s.filter(n=>!p.includes(n.id))),F!=="all"&&(s=s.filter(n=>N(n)===F)),t&&(s=s.filter(n=>n.swedishProverb.toLowerCase().includes(t)||n.arabicEquivalent.includes(t)||n.literalMeaning.includes(t)||n.verb.toLowerCase().includes(t))),w=s,A=0,U()}function ke(){j()}function U(){const e=document.getElementById("content");if(e){if(A=0,e.innerHTML="",w.length===0){e.innerHTML='<div class="no-results"><span class="sv-text">Inga resultat</span><span class="ar-text">لا توجد نتائج</span></div>';return}K(e),qe(e)}}function K(e){const t=A*R,s=Math.min(t+R,w.length);if(t>=w.length)return;const n=e.querySelector(".load-more-sentinel");n&&n.remove();for(let i=t;i<s;i++){const l=w[i],c=X(l);e.appendChild(c)}if(A++,s<w.length){const i=document.createElement("div");i.className="load-more-sentinel",i.innerHTML='<span class="loading-text">⏳ Laddar...</span>',e.appendChild(i)}const a=e.querySelector(".load-more-sentinel");a&&x&&x.observe(a)}function qe(e){x&&x.disconnect(),x=new IntersectionObserver(s=>{s.forEach(n=>{n.isIntersecting&&n.target.classList.contains("load-more-sentinel")&&K(e)})},{rootMargin:"200px",threshold:.1});const t=e.querySelector(".load-more-sentinel");t&&x.observe(t)}function X(e){const t=document.createElement("div");t.className="proverb-card";const s=u.includes(e.id),n=p.includes(e.id);return t.innerHTML=`
        <div class="proverb-header">
            <span class="proverb-number">${e.id}</span>
            <div class="proverb-actions">
                <button class="speak-btn" onclick="speakProverb(${e.id})" title="Lyssna / استمع">🔊</button>
                <button class="save-btn ${s?"saved":""}" onclick="toggleSave(${e.id})" title="Spara / حفظ">${s?"⭐":"☆"}</button>
                <button class="learn-btn ${n?"learned":""}" onclick="toggleLearned(${e.id})" title="Lärt / تعلمت">${n?"✅":"⬜"}</button>
            </div>
        </div>
        <div class="proverb-swedish">${e.swedishProverb}</div>
        <div class="proverb-literal">📝 ${e.literalMeaning}</div>
        <div class="proverb-arabic">🌙 ${e.arabicEquivalent}</div>
        <div class="verb-conjugation">
            <div class="verb-header">
                <span class="verb-main">${e.verb}</span>
                <span class="verb-translation">${e.verbTranslation}</span>
            </div>
            <div class="verb-forms">
                <div class="verb-form"><span class="label">Infinitiv</span><span class="value">${e.verbInfinitive}</span></div>
                <div class="verb-form"><span class="label">Presens</span><span class="value">${e.verbPresent}</span></div>
                <div class="verb-form"><span class="label">Preteritum</span><span class="value">${e.verbPast}</span></div>
                <div class="verb-form"><span class="label">Supinum</span><span class="value">${e.verbSupine}</span></div>
            </div>
        </div>
    `,t}function Ie(e){const t=r.find(s=>s.id===e);if(t)if(typeof H<"u"&&H)H.speak(t.swedishProverb,"sv");else{const s=new SpeechSynthesisUtterance(t.swedishProverb);s.lang="sv-SE",s.rate=.9,speechSynthesis.speak(s)}}function Se(e){const t=u.indexOf(e);t>-1?u.splice(t,1):u.push(e),V(),O();const s=document.querySelector(`.proverb-card .save-btn[onclick="toggleSave(${e})"]`);s&&(s.classList.toggle("saved"),s.textContent=u.includes(e)?"⭐":"☆")}function Ee(e){const t=p.indexOf(e);t>-1?p.splice(t,1):p.push(e),V(),O();const s=document.querySelector(`.proverb-card .learn-btn[onclick="toggleLearned(${e})"]`);s&&(s.classList.toggle("learned"),s.textContent=p.includes(e)?"✅":"⬜")}function Be(){const e=document.getElementById("savedList");if(e){if(u.length===0){e.innerHTML='<div class="no-saved"><span class="sv-text">Inga sparade ordspråk</span><span class="ar-text">لا توجد أمثال محفوظة</span></div>';return}e.innerHTML="",u.forEach(t=>{const s=r.find(n=>n.id===t);if(s){const n=X(s);e.appendChild(n)}})}}function Y(){if(b>=f.length){Ce();return}const e=f[b],t=document.getElementById("flashcard"),s=document.getElementById("fcWord"),n=document.getElementById("fcTranslation"),a=document.getElementById("fcLiteral"),i=document.getElementById("fcCurrent"),l=document.getElementById("fcTotal"),c=document.getElementById("fcProgress");t&&t.classList.remove("flipped"),s&&(s.textContent=e.swedishProverb),n&&(n.textContent=e.arabicEquivalent),a&&(a.textContent=e.literalMeaning),i&&(i.textContent=(b+1).toString()),l&&(l.textContent=f.length.toString()),c&&(c.style.width=`${(b+1)/f.length*100}%`)}function Le(){const e=document.getElementById("flashcard");e&&e.classList.toggle("flipped")}function Me(e){if(e){const t=f[b];p.includes(t.id)||(p.push(t.id),V(),O())}b++,Y()}function Ce(){const e=document.getElementById("flashcardView");e&&(e.innerHTML=`
            <div class="flashcard-complete">
                <div class="complete-icon">🎉</div>
                <h2><span class="sv-text">Bra jobbat!</span><span class="ar-text">عمل رائع!</span></h2>
                <p><span class="sv-text">Du har gått igenom ${f.length} ordspråk</span><span class="ar-text">لقد راجعت ${f.length} مثل</span></p>
                <button class="restart-btn" onclick="initFlashcards()"><span class="sv-text">Börja om</span><span class="ar-text">ابدأ من جديد</span></button>
                <button class="back-btn-inline" onclick="switchMode('browse')"><span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
            </div>
        `)}let o={questions:[],index:0,score:0};function G(){o={questions:[...r].sort(()=>.5-Math.random()).slice(0,10).map(s=>$e(s)),index:0,score:0},Z()}function $e(e){const t=e.swedishProverb.split(/\s+/),s=t.map((v,_)=>({word:v,index:_})).filter(v=>v.word.length>=3&&v.index>0&&v.index<t.length-1&&!/^[0-9]+$/.test(v.word));let n;if(s.length>0)n=s[Math.floor(Math.random()*s.length)];else{const v=Math.floor(t.length/2);n={word:t[v],index:v}}const a=n.word,i=n.index,l=[],c=new Set([a.toLowerCase()]);for(const v of r){if(l.length>=3)break;const _=v.swedishProverb.split(/\s+/);for(const I of _){if(l.length>=3)break;I.length>=3&&!c.has(I.toLowerCase())&&!/^[0-9]+$/.test(I)&&(l.push(I),c.add(I.toLowerCase()))}}const z=[a,...l].sort(()=>.5-Math.random());return{proverb:e,blankWord:a,blankIndex:i,options:z}}function Z(){const e=document.getElementById("quizContent");if(!e)return;if(o.index>=o.questions.length){Pe();return}const t=o.questions[o.index],n=t.proverb.swedishProverb.split(/\s+/).map((a,i)=>i===t.blankIndex?'<span class="blank-word">______</span>':a).join(" ");e.innerHTML=`
        <div class="quiz-progress">
            <div class="quiz-progress-text">${o.index+1} / ${o.questions.length}</div>
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width: ${(o.index+1)/o.questions.length*100}%"></div>
            </div>
        </div>
        <div class="quiz-question">
            <div class="quiz-label"><span class="sv-text">Välj rätt ord för att komplettera ordspråket:</span><span class="ar-text">اختر الكلمة الصحيحة لإكمال المثل:</span></div>
            <div class="quiz-swedish fill-blank">${n}</div>
        </div>
        <div class="quiz-options fill-blank-options">
            ${t.options.map(a=>`
                <button class="quiz-option fill-blank-option" onclick="checkFillBlankAnswer('${a.replace(/'/g,"\\'")}', '${t.blankWord.replace(/'/g,"\\'")}', this)">
                    ${a}
                </button>
            `).join("")}
        </div>
        <div class="quiz-feedback" id="quizFeedback" style="display: none;"></div>
    `}function ze(e,t,s){const n=document.querySelectorAll(".fill-blank-option");n.forEach(c=>c.disabled=!0);const a=o.questions[o.index],i=document.getElementById("quizFeedback"),l=e.toLowerCase()===t.toLowerCase();l?(s.classList.add("correct"),o.score++):(s.classList.add("wrong"),n.forEach(c=>{var z;((z=c.textContent)==null?void 0:z.trim().toLowerCase())===t.toLowerCase()&&c.classList.add("correct")})),i&&(i.style.display="block",i.innerHTML=`
            <div class="feedback-content ${l?"correct":"wrong"}">
                <div class="feedback-icon">${l?"✅":"❌"}</div>
                <div class="feedback-message">
                    <span class="sv-text">${l?"Rätt!":"Fel!"}</span>
                    <span class="ar-text">${l?"صحيح!":"خطأ!"}</span>
                </div>
                <div class="complete-proverb">
                    <div class="proverb-text-sv">"${a.proverb.swedishProverb}"</div>
                </div>
                <div class="arabic-translation">
                    <div class="translation-label"><span class="sv-text">Arabiskt motsvarighet:</span><span class="ar-text">المثل العربي المقابل:</span></div>
                    <div class="proverb-text-ar">"${a.proverb.arabicEquivalent}"</div>
                </div>
                <div class="literal-meaning">
                    <div class="literal-label"><span class="sv-text">Ordagrann översättning:</span><span class="ar-text">الترجمة الحرفية:</span></div>
                    <div class="literal-text">"${a.proverb.literalMeaning}"</div>
                </div>
            </div>
        `),setTimeout(()=>{o.index++,Z()},3500)}function Pe(){const e=document.getElementById("quizContent");if(!e)return;const t=Math.round(o.score/o.questions.length*100);let s="",n="",a="";t===100?(s="Perfekt!",n="ممتاز!",a="🏆"):t>=80?(s="Mycket bra!",n="رائع جداً!",a="🌟"):t>=50?(s="Bra jobbat!",n="أحسنت!",a="👍"):(s="Fortsätt öva!",n="واصل التدريب!",a="📚"),e.innerHTML=`
        <div class="quiz-results">
            <div class="result-icon">${a}</div>
            <div class="result-message"><span class="sv-text">${s}</span><span class="ar-text">${n}</span></div>
            <div class="result-score">${o.score} / ${o.questions.length}</div>
            <div class="result-percentage">${t}%</div>
            <div class="result-stats">
                <div class="stat-item">
                    <span class="stat-icon">✅</span>
                    <span class="stat-value">${o.score}</span>
                    <span class="stat-label"><span class="sv-text">Rätt</span><span class="ar-text">صحيح</span></span>
                </div>
                <div class="stat-item">
                    <span class="stat-icon">❌</span>
                    <span class="stat-value">${o.questions.length-o.score}</span>
                    <span class="stat-label"><span class="sv-text">Fel</span><span class="ar-text">خطأ</span></span>
                </div>
            </div>
            <div class="result-actions">
                <button class="result-btn" onclick="startFillBlankQuiz()"><span class="sv-text">Försök igen</span><span class="ar-text">حاول مرة أخرى</span></button>
                <button class="result-btn secondary" onclick="switchMode('quiz-match')"><span class="sv-text">Byt till Matcha</span><span class="ar-text">انتقل للمطابقة</span></button>
                <button class="result-btn secondary" onclick="switchMode('browse')"><span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
            </div>
        </div>
    `}function Te(){const e=document.getElementById("quizContent");e&&(e.innerHTML=`
        <div class="quiz-selector">
            <div class="quiz-selector-title">
                <span class="sv-text">Välj quiztyp</span>
                <span class="ar-text">اختر نوع الاختبار</span>
            </div>
            <div class="quiz-type-cards">
                <button class="quiz-type-card" onclick="startFillBlankQuiz()">
                    <div class="quiz-type-icon">✏️</div>
                    <div class="quiz-type-name"><span class="sv-text">Fyll i luckan</span><span class="ar-text">أكمل الفراغ</span></div>
                    <div class="quiz-type-desc"><span class="sv-text">Välj rätt ord för att komplettera ordspråket</span><span class="ar-text">اختر الكلمة الصحيحة لإكمال المثل</span></div>
                </button>
                <button class="quiz-type-card" onclick="startMatchingQuiz()">
                    <div class="quiz-type-icon">🔗</div>
                    <div class="quiz-type-name"><span class="sv-text">Matcha ordspråk</span><span class="ar-text">طابق الأمثال</span></div>
                    <div class="quiz-type-desc"><span class="sv-text">Hitta rätt arabiskt ordspråk</span><span class="ar-text">اعثر على المثل العربي الصحيح</span></div>
                </button>
            </div>
        </div>
    `)}function ee(){d={questions:[...r].sort(()=>.5-Math.random()).slice(0,10),index:0,score:0},te()}function te(){const e=document.getElementById("quizContent");if(!e)return;if(d.index>=d.questions.length){Fe();return}const t=d.questions[d.index],s=[t];for(;s.length<4;){const a=r[Math.floor(Math.random()*r.length)];s.find(i=>i.id===a.id)||s.push(a)}const n=s.sort(()=>.5-Math.random());e.innerHTML=`
        <div class="quiz-progress">
            <div class="quiz-progress-text">${d.index+1} / ${d.questions.length}</div>
            <div class="quiz-progress-bar">
                <div class="quiz-progress-fill" style="width: ${(d.index+1)/d.questions.length*100}%"></div>
            </div>
        </div>
        <div class="quiz-question">
            <div class="quiz-label"><span class="sv-text">Vilket arabiskt ordspråk motsvarar detta?</span><span class="ar-text">ما المثل العربي المقابل؟</span></div>
            <div class="quiz-swedish">${t.swedishProverb}</div>
        </div>
        <div class="quiz-options matching-options">
            ${n.map(a=>`
                <button class="quiz-option" onclick="checkMatchingAnswer(${a.id}, ${t.id}, this)">
                    ${a.arabicEquivalent}
                </button>
            `).join("")}
        </div>
    `}function Ae(e,t,s){const n=document.querySelectorAll(".matching-options .quiz-option");n.forEach(a=>a.disabled=!0),e===t?(s.classList.add("correct"),d.score++):(s.classList.add("wrong"),n.forEach(a=>{var l,c;parseInt(((c=(l=a.getAttribute("onclick"))==null?void 0:l.match(/\d+/))==null?void 0:c[0])||"0")===t&&a.classList.add("correct")})),setTimeout(()=>{d.index++,te()},1500)}function Fe(){const e=document.getElementById("quizContent");if(!e)return;const t=Math.round(d.score/d.questions.length*100);let s="",n="",a="";t===100?(s="Perfekt!",n="ممتاز!",a="🏆"):t>=80?(s="Mycket bra!",n="رائع جداً!",a="🌟"):t>=50?(s="Bra jobbat!",n="أحسنت!",a="👍"):(s="Fortsätt öva!",n="واصل التدريب!",a="📚"),e.innerHTML=`
        <div class="quiz-results">
            <div class="result-icon">${a}</div>
            <div class="result-message"><span class="sv-text">${s}</span><span class="ar-text">${n}</span></div>
            <div class="result-score">${d.score} / ${d.questions.length}</div>
            <div class="result-percentage">${t}%</div>
            <div class="result-actions">
                <button class="result-btn" onclick="startMatchingQuiz()"><span class="sv-text">Försök igen</span><span class="ar-text">حاول مرة أخرى</span></button>
                <button class="result-btn secondary" onclick="switchMode('quiz-fill')"><span class="sv-text">Byt till Fyll i luckan</span><span class="ar-text">انتقل لأكمل الفراغ</span></button>
                <button class="result-btn secondary" onclick="switchMode('browse')"><span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
            </div>
        </div>
    `}window.switchMode=k;window.toggleMobileView=pe;window.openSavedModal=he;window.speakProverb=Ie;window.toggleSave=Se;window.toggleLearned=Ee;window.flipCard=Le;window.flashcardAnswer=Me;window.startSavedFlashcards=oe;window.startAllFlashcards=le;window.initFlashcards=D;window.startFillBlankQuiz=G;window.startMatchingQuiz=ee;window.checkFillBlankAnswer=ze;window.checkMatchingAnswer=Ae;window.showQuizSelector=Te;window.setFilter=be;window.toggleFilters=me;window.setTopicFilter=we;document.addEventListener("DOMContentLoaded",ce);let T=1;function Ve(){m?se():Oe()}function Oe(){if(m=!0,h=C==="saved"?u.map(t=>r.find(s=>s.id===t)).filter(Boolean):[...r],h.length===0)return;const e=document.getElementById("audioPlayer");e&&e.classList.remove("hidden"),q(),$()}function se(){m=!1,y&&(clearTimeout(y),y=null),speechSynthesis.cancel(),q()}function _e(){var e;se(),(e=document.getElementById("audioPlayer"))==null||e.classList.add("hidden")}function $(e=0){if(!m||h.length===0)return;const t=h[g];if(!t)return;q();const s=new SpeechSynthesisUtterance(t.swedishProverb);s.lang="sv-SE",s.rate=L,s.onend=()=>{m&&(y=setTimeout(()=>{const n=new SpeechSynthesisUtterance(t.arabicEquivalent);n.lang="ar-SA",n.rate=L,n.onend=()=>{m&&(e+1<T?y=setTimeout(()=>{$(e+1)},1e3):y=setTimeout(()=>{ne()},1500))},speechSynthesis.speak(n)},500))},speechSynthesis.speak(s)}function ne(){g<h.length-1?g++:g=0,q(),$()}function He(){g>0?g--:g=h.length-1,q(),$()}function q(){const e=document.getElementById("playPauseBtn"),t=document.getElementById("playerTitleSv"),s=document.getElementById("playerTitleAr");e&&(e.textContent=m?"❚❚":"▶");const n=h[g];n&&(t&&(t.textContent=n.swedishProverb),s&&(s.textContent=n.arabicEquivalent))}function je(){const e=[.5,.75,1,1.25,1.5],t=e.indexOf(L);L=e[(t+1)%e.length];const s=document.getElementById("speedBtn");s&&(s.textContent=`${L}x`)}function Qe(){const e=[1,2,3],t=e.indexOf(T);T=e[(t+1)%e.length];const s=document.getElementById("playerRepeatBtn");s&&(s.textContent=`↻ ${T}x`)}function Re(e){m=!0;const t=document.getElementById("audioPlayer");t&&t.classList.remove("hidden");let s=h.findIndex(n=>n.id===e);s===-1?r.find(a=>a.id===e)&&(h=[...r],g=r.findIndex(a=>a.id===e)):g=s,$(),q()}window.togglePlay=Ve;window.playNext=ne;window.playPrev=He;window.closeAudioPlayer=_e;window.toggleSpeed=je;window.togglePlayerRepeat=Qe;window.playProverb=Re;
