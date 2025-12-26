var J=Object.defineProperty;var Z=(l,t,e)=>t in l?J(l,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):l[t]=e;var p=(l,t,e)=>Z(l,typeof t!="symbol"?t+"":t,e);import"./modulepreload-polyfill-B5Qt9EMX.js";import"./config-CfHoVMbv.js";import{D as A}from"./db-bEbbjtoI.js";import{showToast as b,ThemeManager as tt,CategoryHelper as et,GrammarHelper as st,TextSizeManager as W}from"./utils-DkwAXeNx.js";import{T as K}from"./tts-C5U53K2V.js";import{Q as Y,F}from"./quiz-stats-C6Jzjky6.js";import{a as v,L as _,t as T}from"./i18n-1qhfGv7S.js";import{A as at,P as U,H,C as nt,M as it}from"./ui-enhancements-DUZ6U4ck.js";import"./pwa-Bxh5GLjF.js";import"./toast-manager-CZ3snF2j.js";const rt=[{patter:/sj|stj|skj/i,tip:{sv:"Sj-ljudet: Forma läpparna som om du ska vissla och blås ut.",ar:"صوت الـ Sj: شكل شفاهك كأنك ستصفر واخرج الهواء (صوت يشبه العطس الخفيف)."},example:"sju, stjärna, skjorta"},{patter:/ö/i,tip:{sv:"Ö: Som 'i' men med runda läppar. Tänk på 'hurt' på engelska.",ar:"حرف Ö: يشبه صوت حرف 'i' ولكن مع تدوير الشفاه (مثل صوت كلمة hurt بالإنجليزية)."},example:"öga, dörr"},{patter:/y/i,tip:{sv:"Y: Som 'i' men med läpparna långt framåt.",ar:"حرف Y: انطق حرف 'i' ولكن مع دفع الشفتين للأمام بحدة."},example:"ny, lyssna"},{patter:/r/i,tip:{sv:"R: Rullande r i början av ord, men mjukare efter vokal.",ar:"حرف R: يكون 'مرفرفاً' في بداية الكلمات، ويصبح ناعماً جداً إذا جاء بعد حرف علة."},example:"röd, barn"}],P={splitIntoSyllables(l){const t="aeiouyåäö",e=[];let s="";for(let a=0;a<l.length;a++)s+=l[a],t.includes(l[a].toLowerCase())&&a+2<l.length&&!t.includes(l[a+1].toLowerCase())&&t.includes(l[a+2].toLowerCase())&&(e.push(s),s=""),a>0&&l[a]===l[a-1]&&!t.includes(l[a].toLowerCase())&&(e.push(s),s="");return s&&e.push(s),e},getTipsForWord(l){return rt.filter(t=>t.patter.test(l))}};typeof window<"u"&&(window.PronunciationHelper=P);class S{static init(t){this.currentWord=t;try{this.visualizer||(this.visualizer=new at("audioVisualizerContainer","#7dd3fc"),this.visualizer.setMode("liquid")),this.recorder||(this.recorder=new U),this.setupEvents(),this.setupPracticeLevels(),this.renderStaticInfo(),this.initSpeechRecognition()}catch(e){console.warn("PronunciationLab init failed:",e)}}static setupPracticeLevels(){const t=document.getElementById("practiceLevelsContainer");t&&(t.innerHTML=`
            <div class="practice-levels">
                <button class="practice-level-btn active" data-level="listen">
                    <span class="practice-level-icon">👂</span>
                    <span class="sv-text">Lyssna</span><span class="ar-text">استمع</span>
                </button>
                <button class="practice-level-btn" data-level="repeat">
                    <span class="practice-level-icon">🔁</span>
                    <span class="sv-text">Upprepa</span><span class="ar-text">كرر</span>
                </button>
                <button class="practice-level-btn" data-level="challenge">
                    <span class="practice-level-icon">🎯</span>
                    <span class="sv-text">Utmaning</span><span class="ar-text">تحدي</span>
                </button>
            </div>
        `,t.querySelectorAll(".practice-level-btn").forEach(e=>{e.addEventListener("click",()=>{t.querySelectorAll(".practice-level-btn").forEach(s=>s.classList.remove("active")),e.classList.add("active"),this.currentLevel=e.dataset.level,this.updateUIForLevel()})}))}static updateUIForLevel(){const t=document.getElementById("pronounceNormalBtn"),e=document.getElementById("pronounceSlowBtn"),s=document.getElementById("recordingSection");this.currentLevel==="listen"?(t==null||t.classList.remove("hidden"),e==null||e.classList.remove("hidden"),s==null||s.classList.add("hidden")):this.currentLevel==="repeat"?(t==null||t.classList.remove("hidden"),e==null||e.classList.remove("hidden"),s==null||s.classList.remove("hidden")):(t==null||t.classList.add("hidden"),e==null||e.classList.add("hidden"),s==null||s.classList.remove("hidden"))}static setupEvents(){const t=document.getElementById("pronounceNormalBtn"),e=document.getElementById("pronounceSlowBtn"),s=document.getElementById("recordBtn"),a=document.getElementById("playRecordedBtn");t==null||t.addEventListener("click",()=>{H.light(),K.speakSwedish(this.currentWord)}),e==null||e.addEventListener("click",()=>{H.light(),K.speakSlowly(this.currentWord,"sv")}),s==null||s.addEventListener("click",()=>this.toggleRecording()),a==null||a.addEventListener("click",async()=>{H.light();const n=this.lastRecordedBlob;n&&U.playBlob(n)}),window.addEventListener("tts-start",()=>{var n,i;(n=this.visualizer)==null||n.start(),this.updateKaraokeActive(!0),(i=document.getElementById("audioVisualizerContainer"))==null||i.classList.add("active"),this.startSyllableHighlight()}),window.addEventListener("tts-end",()=>{var n,i;(n=this.visualizer)==null||n.stop(),this.updateKaraokeActive(!1),(i=document.getElementById("audioVisualizerContainer"))==null||i.classList.remove("active"),this.stopSyllableHighlight()}),window.addEventListener("tts-boundary",n=>{this.highlightWord(n.detail.word)})}static startSyllableHighlight(){const t=document.querySelectorAll(".syllable-chip");if(t.length===0)return;t.forEach(r=>r.classList.remove("active"));const e=this.currentWord.length,s=parseFloat(localStorage.getItem("ttsSpeed")||"0.85"),a=e*80/s,n=[];let i=0;t.forEach(r=>{const c=r.textContent||"",u=Math.max(1,c.length);i+=u,r._weight=u}),t.forEach((r,c)=>{const m=r._weight/i*a;n[c]=Math.max(200,m)});let o=0;const d=()=>{if(o>=t.length)return;o>0&&t[o-1].classList.remove("active"),t[o].classList.add("active");const c=n[o];o++,this.syllableInterval=setTimeout(d,c)};d()}static stopSyllableHighlight(){this.syllableInterval&&(clearTimeout(this.syllableInterval),this.syllableInterval=null),document.querySelectorAll(".syllable-chip").forEach(t=>t.classList.remove("active"))}static renderStaticInfo(){const t=document.getElementById("karaokeDisplay");t&&(t.innerHTML=this.currentWord.split(" ").map((a,n)=>`<span class="karaoke-word" data-word-index="${n}">${a}</span>`).join(" "),t.setAttribute("data-auto-size",""),t.setAttribute("data-max-lines","1"),setTimeout(()=>W.apply(t,this.currentWord,1,2.5),50));const e=document.getElementById("syllableDisplay");if(e){const a=P.splitIntoSyllables(this.currentWord);e.innerHTML=a.map(n=>`<span class="syllable-chip" data-auto-size data-max-lines="1">${n}</span>`).join(""),setTimeout(()=>W.applyToContainer(e),50)}const s=document.getElementById("phoneticTipsArea");if(s){const a=P.getTipsForWord(this.currentWord);s.innerHTML=a.map(n=>`
                <div class="tip-card">
                    <div class="tip-title">💡 <span class="sv-text">Tips</span><span class="ar-text">نصيحة</span></div>
                    <div class="tip-text">${_.getLanguage()==="sv"?n.tip.sv:n.tip.ar}</div>
                    <div class="tip-ex">Ex: ${n.example}</div>
                </div>
            `).join("")}}static highlightWord(t){const e=document.getElementById("karaokeDisplay");if(!e)return;e.querySelectorAll(".karaoke-word").forEach(a=>{var o;const n=(o=a.textContent)==null?void 0:o.toLowerCase().replace(/[.,!?;:]/g,""),i=t.toLowerCase().replace(/[.,!?;:]/g,"");n===i&&(a.classList.add("active"),setTimeout(()=>a.classList.remove("active"),800))})}static updateKaraokeActive(t){const e=document.getElementById("karaokeDisplay");e&&(t?e.classList.add("playing"):e.classList.remove("playing"))}static async toggleRecording(){var n,i,o,d,r,c;const t=document.getElementById("recordBtn"),e=document.getElementById("recordingFeedback"),s=document.getElementById("playbackArea"),a=document.querySelector(".pronunciation-lab-section");if(!this.isRecording)this.isRecording=!0,t==null||t.classList.add("active"),t.innerHTML='⏹️ <span class="sv-text">Stoppa</span><span class="ar-text">إيقاف</span>',e==null||e.classList.remove("hidden"),s==null||s.classList.add("hidden"),a==null||a.classList.add("recording"),(n=this.visualizer)==null||n.start(),(i=document.querySelector(".audio-visualizer-canvas"))==null||i.classList.add("recording"),await((o=this.recorder)==null?void 0:o.start()),this.startSpeechRecognition();else{this.isRecording=!1,t==null||t.classList.remove("active"),t.innerHTML='🎙️ <span class="sv-text">Spela in</span><span class="ar-text">تسجيل</span>',e==null||e.classList.add("hidden"),a==null||a.classList.remove("recording"),(d=document.querySelector(".audio-visualizer-canvas"))==null||d.classList.remove("recording"),(r=this.visualizer)==null||r.stop();const u=await((c=this.recorder)==null?void 0:c.stop());this.lastRecordedBlob=u,s==null||s.classList.remove("hidden"),this.stopSpeechRecognition()}}static initSpeechRecognition(){const t=window.SpeechRecognition||window.webkitSpeechRecognition;t&&(this.recognition=new t,this.recognition.lang="sv-SE",this.recognition.interimResults=!1,this.recognition.maxAlternatives=1,this.recognition.onresult=e=>{const s=e.results[0][0].transcript.toLowerCase(),a=e.results[0][0].confidence;this.calculateScore(s,a)})}static startSpeechRecognition(){if(this.recognition)try{this.recognition.start()}catch{}}static stopSpeechRecognition(){if(this.recognition)try{this.recognition.stop()}catch{}}static calculateScore(t,e){const s=this.currentWord.toLowerCase();let a=0;t===s?a=Math.round(e*100):t.includes(s)||s.includes(t)?a=Math.round(e*80):a=Math.round(e*40);const n=document.getElementById("pronunciationScore"),i=document.getElementById("masteryBadgeContainer"),o=document.querySelector(".pronunciation-lab-section");n&&(n.innerHTML=`⭐ <span class="sv-text">Resultat: ${a}%</span><span class="ar-text">النتيجة: ${a}%</span>`,a>50&&(o==null||o.classList.add("success"),setTimeout(()=>o==null?void 0:o.classList.remove("success"),2e3)),a>80&&(nt.confetti({particleCount:50,spread:50}),H.success(),this.showGoldParticles()),i&&(i.innerHTML="",it.renderBadge(a,i)))}static showGoldParticles(){const t=document.getElementById("audioVisualizerContainer");if(t)for(let e=0;e<15;e++){const s=document.createElement("div");s.className="gold-particle",s.style.left=`${Math.random()*100}%`,s.style.animationDelay=`${Math.random()*.5}s`,t.appendChild(s),setTimeout(()=>s.remove(),1500)}}}p(S,"visualizer",null),p(S,"recorder",null),p(S,"currentWord",""),p(S,"recognition",null),p(S,"currentLevel","listen"),p(S,"syllableInterval",null),p(S,"isRecording",!1);class R{static process(t){return t?t.replace(/([a-zåäöA-ZÅÄÖ]{4,})/g,e=>`<span class="smart-link" data-word="${e.toLowerCase()}">${e}</span>`):""}static setupListeners(t){t.querySelectorAll(".smart-link").forEach(e=>{e.addEventListener("click",async s=>{const a=s.currentTarget.dataset.word;if(a){const n=window.dictionaryData;let i=n==null?void 0:n.find(o=>o[2].toLowerCase()===a);if(!i)try{const o=await A.getAllWords();i=o==null?void 0:o.find(d=>d[2].toLowerCase()===a)}catch(o){console.warn("[SmartLink] DB fallback fail:",o)}i?window.location.href=`details.html?id=${i[0]}`:window.location.href=`index.html?s=${a}`}})})}}class X{static async init(t){const e=document.getElementById("wordNotes"),s=document.getElementById("saveNotesBtn"),a=document.getElementById("notesStatus");if(!e||!s)return;const n=await A.getNote(t);n&&(e.value=n),s.onclick=async()=>{const i=e.value.trim();s.disabled=!0,a&&(a.innerHTML=`<span class="sv-text">${T("details.saving")}</span><span class="ar-text">${T("details.saving")}</span>`);const o=await A.saveNote(t,i);s.disabled=!1,a&&(a.innerHTML=o?`<span class="sv-text">${T("details.saved")}</span><span class="ar-text">${T("details.saved")}</span>`:`<span class="sv-text">${T("common.error")}</span><span class="ar-text">${T("common.error")}</span>`,setTimeout(()=>{a.innerHTML=""},3e3))}}}class N{static getArabicFeatures(t){const e=t.startsWith("ال"),s=t.endsWith("ة"),a=t.includes("و"),n=t.endsWith("ي")||t.endsWith("ى"),i=t.endsWith("ون")||t.endsWith("ين")||t.endsWith("ات"),o=t.split(" ").length;return{hasAl:e,hasTaa:s,hasWaw:a,hasYaa:n,hasPlural:i,wordCount:o,length:t.length}}static similarityScore(t,e){const s=this.getArabicFeatures(t),a=this.getArabicFeatures(e);let n=0;return s.hasAl===a.hasAl&&(n+=3),s.hasTaa===a.hasTaa&&(n+=2),s.hasPlural===a.hasPlural&&(n+=2),s.hasYaa===a.hasYaa&&(n+=1),s.wordCount===a.wordCount&&(n+=3),Math.abs(s.length-a.length)<=1&&(n+=4),Math.abs(s.length-a.length)===0&&(n+=3),t.charAt(0)===e.charAt(0)&&(n+=2),t.charAt(t.length-1)===e.charAt(e.length-1)&&(n+=2),n}static getSmartDistractors(t,e,s=3){const a=t[1],n=t[3];t[2];const i=[],o=new Set([n]),d=e.filter(r=>r[3]!==n&&r[1]===a).map(r=>({text:r[3],score:this.similarityScore(n,r[3])})).sort((r,c)=>c.score-r.score);for(const r of d){if(i.length>=s)break;o.has(r.text)||(i.push(r.text),o.add(r.text))}if(i.length<s)for(const r of e.sort(()=>Math.random()-.5)){if(i.length>=s)break;o.has(r[3])||(i.push(r[3]),o.add(r[3]))}return console.log("[Quiz] EXTREME distractors:",{correct:n,features:this.getArabicFeatures(n),distractors:i.map(r=>({text:r,score:this.similarityScore(n,r),features:this.getArabicFeatures(r)}))}),i}static pickRandom(t,e,s,a){const n=t.sort(()=>Math.random()-.5);for(const i of n){if(e.length>=e.length+a||a<=0)break;s.has(i[3])||(e.push(i[3]),s.add(i[3]),a--)}}static swedishSimilarityScore(t,e){let s=0;t.length===e.length?s+=10:Math.abs(t.length-e.length)===1&&(s+=5),t.charAt(0).toLowerCase()===e.charAt(0).toLowerCase()&&(s+=4),t.charAt(t.length-1)===e.charAt(e.length-1)&&(s+=3);const a=["ar","er","or","ning","tion","het","lig","isk"];for(const n of a)if(t.endsWith(n)&&e.endsWith(n)){s+=4;break}return t.substring(0,2).toLowerCase()===e.substring(0,2).toLowerCase()&&(s+=3),s}static getSwedishDistractors(t,e,s=3){const a=t[1],n=t[2],i=[],o=new Set([n]),d=e.filter(r=>r[2]!==n&&r[1]===a).map(r=>({text:r[2],score:this.swedishSimilarityScore(n,r[2])})).sort((r,c)=>c.score-r.score);for(const r of d){if(i.length>=s)break;o.has(r.text)||(i.push(r.text),o.add(r.text))}if(i.length<s)for(const r of e.sort(()=>Math.random()-.5)){if(i.length>=s)break;o.has(r[2])||(i.push(r[2]),o.add(r[2]))}return console.log("[Quiz] EXTREME Swedish distractors:",{correct:n,correctLen:n.length,distractors:i.map(r=>({text:r,len:r.length,score:this.swedishSimilarityScore(n,r)}))}),i}static init(t){const e=document.getElementById("miniQuizContainer"),s=document.getElementById("miniQuizQuestion"),a=document.getElementById("miniQuizOptions"),n=document.getElementById("miniQuizFeedback");if(!e||!s||!a||!n)return;const i=t[2],o=t[3],d=t[1],r=t[7]||"",c=window.dictionaryData,u=i.substring(0,Math.min(4,i.length)).toLowerCase(),m=r&&r.length>10&&r.toLowerCase().includes(u),f=m?[1,2,3]:[2,3],k=f[Math.floor(Math.random()*f.length)];let g,x,$,M,E;if(k===1&&m){const h=r.replace(new RegExp(`\\b(${u}\\w*)\\b`,"gi"),"______");g=[...c?this.getSwedishDistractors(t,c,3):[],i].sort(()=>Math.random()-.5),x=i,$=`
                <div class="quiz-sentence" dir="ltr">"${h}"</div>
                <div class="quiz-instruction"><span class="sv-text">Välj rätt ord</span><span class="ar-text">اختر الكلمة الصحيحة</span></div>
            `,M='<span class="sv-text">Fyll i</span><span class="ar-text">إكمال</span>',E="📝",console.log("[Quiz] FILL BLANK mode:",{sentence:r,correctAnswer:i})}else k===2?(g=[...c?this.getSwedishDistractors(t,c,3):[],i].sort(()=>Math.random()-.5),x=i,$=`
                <div class="quiz-listen-container">
                    <button class="quiz-listen-btn" onclick="window.TTSManager?.speak('${i}', 'sv')">
                        🔊 <span><span class="sv-text">${v("btn.test","sv")}</span><span class="ar-text">${v("btn.test","ar")}</span></span>
                    </button>
                </div>
                <div class="quiz-instruction"><span class="sv-text">Vilket ord hörde du?</span><span class="ar-text">ما هي الكلمة التي سمعتها؟</span></div>
            `,M='<span class="sv-text">Lyssna</span><span class="ar-text">استماع</span>',E="🎧",setTimeout(()=>K.speak(i,"sv"),500),console.log("[Quiz] LISTENING mode:",{correctAnswer:i})):Math.random()<.5?(g=[...c?this.getSwedishDistractors(t,c,3):[],i].sort(()=>Math.random()-.5),x=i,$=`
                    <span class="sv-text">Vad är det svenska ordet för</span><span class="ar-text">ما هي الكلمة السويدية لـ</span> 
                    <strong>"${o}"</strong>?`,M='<span class="sv-text">Omvänd</span><span class="ar-text">عكسي</span>',E="🔄"):(g=[...c?this.getSmartDistractors(t,c,3):[],o].sort(()=>Math.random()-.5),x=o,$=`
                    <span class="sv-text">Vad betyder</span><span class="ar-text">ما معنى</span> 
                    <strong>"${i}"</strong>?`,M=`<span class="sv-text">${d}</span><span class="ar-text">${d}</span>`,E="📖");const B=parseInt(localStorage.getItem("quizStreak")||"0"),q=parseInt(localStorage.getItem("quizXP")||"0");s.innerHTML=`
            <div class="quiz-header-row">
                <span class="quiz-word-type">${E} ${M}</span>
                <div class="quiz-stats">
                    <span class="quiz-xp">⭐ ${q} XP</span>
                    ${B>0?`<span class="quiz-streak">🔥 ${B}</span>`:""}
                </div>
            </div>
            <div class="quiz-timer-bar"><div class="quiz-timer-progress"></div></div>
            ${$}
        `,a.innerHTML=g.map(h=>`
            <div class="mini-quiz-option" data-value="${h}">${h}</div>
        `).join("");let C=15;const I=s.querySelector(".quiz-timer-progress"),D=setInterval(()=>{if(C--,I){const h=C/15*100;I.style.width=`${h}%`,h<30?I.style.background="#ef4444":h<60&&(I.style.background="#f59e0b")}C<=0&&(clearInterval(D),this.handleAnswer(a,n,"",x,t,!1))},1e3);a.querySelectorAll(".mini-quiz-option").forEach(h=>{h.addEventListener("click",w=>{clearInterval(D);const V=w.currentTarget.dataset.value;this.handleAnswer(a,n,V,x,t,!0)})})}static handleAnswer(t,e,s,a,n,i){const o=s===a,d=n[0].toString();let r=parseInt(localStorage.getItem("quizStreak")||"0"),c=parseInt(localStorage.getItem("quizXP")||"0");o?(r++,c+=10+r*2,this.showConfetti()):r=0,localStorage.setItem("quizStreak",r.toString()),localStorage.setItem("quizXP",c.toString()),j.updateMastery(d,o),o?z.recordCorrect(d):z.recordWrong(d),t.querySelectorAll(".mini-quiz-option").forEach(f=>{f.classList.add("disabled"),f.dataset.value===a?f.classList.add("correct"):f.dataset.value===s&&!o&&f.classList.add("wrong")});const u=o&&r>1?`<span class="streak-bonus">🔥 ${r}x streak! +${r*2} XP</span>`:"",m=i?"":`⏰ <span class="sv-text">${v("details.timeUp","sv")}</span><span class="ar-text">${v("details.timeUp","ar")}</span>`;e.classList.remove("hidden"),e.innerHTML=`
            ${m}
            ${o?`🎉 <span class="sv-text">${v("details.correct","sv")}</span><span class="ar-text">${v("details.correct","ar")}</span> ${u}`:`❌ <span class="sv-text">${v("details.wrong","sv")} "${a}".</span><span class="ar-text">${v("details.wrong","ar")} "${a}".</span>`}
            <button class="quiz-retry-btn" onclick="MiniQuizManager.init(window.currentWordData)">
                🔄 <span class="sv-text">${v("details.retry","sv")}</span><span class="ar-text">${v("details.retry","ar")}</span>
            </button>
        `,e.className=`mini-quiz-feedback ${o?"correct":"wrong"}`,window.currentWordData=n}static showConfetti(){const t=document.getElementById("miniQuizContainer");if(!t)return;const e=30;for(let s=0;s<e;s++){const a=document.createElement("div");a.className="quiz-confetti",a.style.left=`${Math.random()*100}%`,a.style.animationDelay=`${Math.random()*.5}s`,a.style.background=["#ff6b6b","#feca57","#48dbfb","#ff9ff3","#54a0ff"][Math.floor(Math.random()*5)],t.appendChild(a),setTimeout(()=>a.remove(),2e3)}}}window.MiniQuizManager=N;class G{static init(t){const e=document.getElementById("relatedWordsContainer");if(!e)return;const s=t[1],a=t[2],n=window.dictionaryData;if(!n)return;const i=n.filter(o=>o[2]!==a&&(o[1]===s||o[2].startsWith(a.substring(0,2)))).sort(()=>Math.random()-.5).slice(0,6);e.innerHTML=i.map(o=>`
            <div class="related-word-chip" onclick="window.location.href='details.html?id=${o[0]}'">
                <span class="swe">${o[2]}</span>
                <span class="arb">${o[3]}</span>
            </div>
        `).join("")}}class L{static init(t){const e=window.dictionaryData;if(!e||(this.currentWordIndex=e.findIndex(a=>a[0].toString()===t),this.currentWordIndex===-1))return;const s=document.getElementById("detailsArea");s&&(this.addSwipeHints(s),s.addEventListener("touchstart",a=>this.handleTouchStart(a),{passive:!0}),s.addEventListener("touchend",a=>this.handleTouchEnd(a),{passive:!0}))}static addSwipeHints(t){const e=document.createElement("div");e.className="swipe-hints",e.innerHTML=`
            <span class="swipe-hint left" onclick="SwipeNavigator.navigate(-1)"><span class="sv-text">‹ Föregående</span><span class="ar-text">‹ السابق</span></span>
            <span class="swipe-hint right" onclick="SwipeNavigator.navigate(1)"><span class="sv-text">Nästa ›</span><span class="ar-text">التالي ›</span></span>
        `,t.prepend(e)}static handleTouchStart(t){this.startX=t.touches[0].clientX,this.startY=t.touches[0].clientY}static handleTouchEnd(t){const e=t.changedTouches[0].clientX,s=t.changedTouches[0].clientY,a=e-this.startX,n=Math.abs(s-this.startY);Math.abs(a)>80&&n<50&&(a>0?this.navigate(-1):this.navigate(1))}static navigate(t){var a;const e=window.dictionaryData;if(!e||this.currentWordIndex===-1)return;const s=this.currentWordIndex+t;if(s>=0&&s<e.length){const n=e[s][0];(a=document.getElementById("detailsArea"))==null||a.classList.add(t>0?"slide-left":"slide-right"),setTimeout(()=>{window.location.href=`details.html?id=${n}`},150)}}}p(L,"startX",0),p(L,"startY",0),p(L,"currentWordIndex",-1);window.SwipeNavigator=L;class j{static getKey(t){return`mastery_${t}`}static getMastery(t){return parseInt(localStorage.getItem(this.getKey(t))||"0")}static updateMastery(t,e){let s=this.getMastery(t);return s+=e?20:-10,s=Math.max(0,Math.min(100,s)),localStorage.setItem(this.getKey(t),s.toString()),s}static getLastStudied(t){return localStorage.getItem(`lastStudied_${t}`)}static recordStudy(t){localStorage.setItem(`lastStudied_${t}`,new Date().toISOString())}static getTimeAgo(t){const e=this.getLastStudied(t);if(!e)return"";const s=Date.now()-new Date(e).getTime(),a=Math.floor(s/(1e3*60*60*24)),n=Math.floor(s/(1e3*60*60)),i=Math.floor(s/(1e3*60));return a>0?`<span class="sv-text">Studerad ${a} dagar sedan</span><span class="ar-text">درست منذ ${a} أيام</span>`:n>0?`<span class="sv-text">Studerad ${n} timmar sedan</span><span class="ar-text">درست منذ ${n} ساعات</span>`:i>0?`<span class="sv-text">Studerad ${i} minuter sedan</span><span class="ar-text">درست منذ ${i} دقائق</span>`:'<span class="sv-text">Nyligen</span><span class="ar-text">مؤخراً</span>'}static renderMasteryBar(t,e){const s=this.getMastery(t),a=this.getTimeAgo(t),n=z.isWeak(t),i=document.createElement("div");i.className="mastery-section",i.innerHTML=`
            <div class="mastery-header">
                <span class="mastery-label">
                    📈 <span class="sv-text">Behärskningsnivå</span><span class="ar-text">مستوى الإتقان</span>
                    ${n?'<span class="weak-badge">⚠️ <span class="sv-text">Svagt ord</span><span class="ar-text">كلمة ضعيفة</span></span>':""}
                </span>
                <span class="mastery-percent">${s}%</span>
            </div>
            <div class="mastery-bar">
                <div class="mastery-progress" style="width: ${s}%"></div>
            </div>
            ${a?`<div class="last-studied">${a}</div>`:""}
        `,e.prepend(i),this.recordStudy(t)}}class z{static getKey(t){return`weak_${t}`}static recordWrong(t){const e=this.getWrongCount(t)+1;localStorage.setItem(this.getKey(t),e.toString())}static recordCorrect(t){const e=Math.max(0,this.getWrongCount(t)-1);localStorage.setItem(this.getKey(t),e.toString())}static getWrongCount(t){return parseInt(localStorage.getItem(this.getKey(t))||"0")}static isWeak(t){return this.getWrongCount(t)>=3}}class Q{static checkAndUpdateStreak(){const t=new Date().toDateString(),e=localStorage.getItem(this.LAST_DATE_KEY);let s=parseInt(localStorage.getItem(this.STREAK_KEY)||"0");if(e===t)return s;const a=new Date;return a.setDate(a.getDate()-1),e===a.toDateString()?s++:e!==t&&(s=1),localStorage.setItem(this.STREAK_KEY,s.toString()),localStorage.setItem(this.LAST_DATE_KEY,t),s}static getStreak(){return parseInt(localStorage.getItem(this.STREAK_KEY)||"0")}static renderStreakBadge(t){const e=this.checkAndUpdateStreak();if(e<2)return;const s=document.createElement("div");s.className="daily-streak-badge",s.innerHTML=`
            <span class="streak-fire">🔥</span>
            <span class="sv-text">${e} dagar i rad!</span><span class="ar-text">${e} أيام متتالية!</span>
        `,t.prepend(s)}}p(Q,"STREAK_KEY","dailyStreak"),p(Q,"LAST_DATE_KEY","lastStudyDate");class O{static getRandomQuote(){return this.quotes[Math.floor(Math.random()*this.quotes.length)]}static renderQuote(t){const e=this.getRandomQuote(),s=document.createElement("div");s.className="motivation-quote",s.innerHTML=`
            <p>"${e.text}"</p>
            <div class="author">— ${e.author}</div>
        `,t.appendChild(s)}}p(O,"quotes",[{text:'<span class="sv-text">Varje nytt ord är ett fönster mot en ny värld</span><span class="ar-text">كل كلمة جديدة هي نافذة على عالم جديد</span>',author:'<span class="sv-text">Okänd</span><span class="ar-text">مجهول</span>'},{text:'<span class="sv-text">Lärande är ingen tävling, det är en resa</span><span class="ar-text">التعلم ليس سباقاً، بل رحلة</span>',author:'<span class="sv-text">Visdom</span><span class="ar-text">حكمة</span>'},{text:'<span class="sv-text">Den som lär sig ett språk, förstår en kultur</span><span class="ar-text">من يتعلم لغة، يفهم ثقافة</span>',author:'<span class="sv-text">Ordspråk</span><span class="ar-text">مثل</span>'},{text:'<span class="sv-text">Sprائكة هو روح الأمة</span><span class="ar-text">اللغة هي روح الأمة</span>',author:'<span class="sv-text">Fichte</span><span class="ar-text">فيخته</span>'}]);class ot{static share(t){const e=t[2],s=t[3],a=t[1],n=`📚 تعلمت كلمة جديدة!

🇸🇪 ${e} (${a})
🇸🇦 ${s}

#SnabbaLexin #LearnSwedish`;navigator.share?navigator.share({title:`${e} - SnabbaLexin`,text:n,url:window.location.href}).catch(()=>{}):(navigator.clipboard.writeText(n),b('<span class="sv-text">Kopierad!</span><span class="ar-text">تم النسخ!</span>'))}static renderShareButton(t,e){const s=document.createElement("button");s.className="share-btn",s.innerHTML='📤 <span class="sv-text">Dela</span><span class="ar-text">مشاركة</span>',s.onclick=()=>this.share(e),t.appendChild(s)}}class y{static getTypeGlowClass(t){const e=t.toLowerCase();return e.includes("verb")?"glow-verb":e.includes("subst")||e.includes("noun")?"glow-noun":e.includes("adj")?"glow-adjective":e.includes("adv")?"glow-adverb":e.includes("prep")?"glow-preposition":"glow-default"}static getTextSizeClass(t){const e=t.length;return e<=8?"text-xl":e<=15?"text-lg":e<=25?"text-md":e<=40?"text-sm":"text-xs"}static showSuccessGlow(){const t=document.querySelector(".flashcard-clean");t&&(t.classList.add("fc-success-glow"),setTimeout(()=>t.classList.remove("fc-success-glow"),600))}static showErrorFlash(){const t=document.querySelector(".flashcard-clean");t&&(t.classList.add("fc-error-flash"),setTimeout(()=>t.classList.remove("fc-error-flash"),400))}static toggleFocus(){this.focusMode=!this.focusMode;const t=document.querySelector(".fc-card-area"),e=document.getElementById("fcStatsBar"),s=document.querySelector(".fc-minimal-header");this.focusMode?(t==null||t.classList.add("focus-mode"),e==null||e.classList.add("hidden"),s==null||s.classList.add("hidden"),b('🧘 <span class="sv-text">Fokusläge aktiverat</span><span class="ar-text">وضع التركيز مُفعّل</span>',{type:"info"})):(t==null||t.classList.remove("focus-mode"),e==null||e.classList.remove("hidden"),s==null||s.classList.remove("hidden"),b('<span class="sv-text">Fokusläge avslutat</span><span class="ar-text">انتهى وضع التركيز</span>'))}static playAudio(t){window.TTSManager&&window.TTSManager.speak(t,"sv")}static formatTime(t){const e=Math.floor(t/1e3),s=Math.floor(e/60),a=e%60;return`${s}:${a.toString().padStart(2,"0")}`}static getAccuracy(){return this.sessionStats.total===0?0:Math.round(this.sessionStats.correct/this.sessionStats.total*100)}static init(t){const e=document.getElementById("flashcardContainer");if(!e)return;this.currentWordData=t;const s=t[2],a=t[3],n=t[1],i=t[7]||"",o=this.getTypeGlowClass(n),d=this.getTextSizeClass(s),r=this.getTextSizeClass(a),c=this.currentMode==="reverse"?a:s;this.currentMode;const u=this.currentMode==="reverse"?"rtl":"ltr";this.currentMode,e.innerHTML=`
            <!-- Minimal Header: Mode + Focus Toggle -->
            <div class="fc-minimal-header">
                <div class="fc-mode-pills">
                    <button class="fc-pill ${this.currentMode==="normal"?"active":""}" onclick="FlashcardManager.setMode('normal')" title="Normal / عادي">🇸🇪</button>
                    <button class="fc-pill ${this.currentMode==="reverse"?"active":""}" onclick="FlashcardManager.setMode('reverse')" title="Omvänd / عكسي">🔄</button>
                    <button class="fc-pill ${this.currentMode==="listening"?"active":""}" onclick="FlashcardManager.setMode('listening')" title="Lyssna / استماع">🎧</button>
                </div>
                <button class="fc-focus-toggle" onclick="FlashcardManager.toggleFocus()" title="Fokusläge / وضع التركيز">
                    ⛶
                </button>
            </div>
            
            <!-- Collapsible Stats (hidden by default, show on hover/click) -->
            <div class="fc-stats-minimal" id="fcStatsBar">
                <span class="fc-mini-stat">🔥<span id="fcStreak">${this.streak}</span></span>
                <span class="fc-mini-stat">⭐<span id="fcXP">${this.xp}</span></span>
                <span class="fc-mini-stat">🎯<span id="fcAccuracy">${this.getAccuracy()}%</span></span>
            </div>
            
            <div class="fc-card-area ${this.focusMode?"focus-mode":""}">
                ${this.currentMode==="listening"?`
                    <!-- Listening Mode: Simple Design -->
                    <div class="fc-listen-simple">
                        <button class="fc-listen-circle" onclick="FlashcardManager.playAudio('${s}')">
                            🔊
                        </button>
                        <div class="fc-listen-grid">
                            ${this.generateListeningOptions(s)}
                        </div>
                    </div>
                `:`
                    <!-- Ultra Clean Flashcard -->
                    <div class="flashcard-clean ${o}" onclick="FlashcardManager.flip()">
                        <div class="flashcard-clean-inner">
                            <!-- Front: Word Only -->
                            <div class="flashcard-clean-front">
                                <div class="fc-front-word ${this.currentMode==="reverse"?r:d}" dir="${u}">${c}</div>
                            </div>
                            <!-- Back: Translation + Example -->
                            <div class="flashcard-clean-back">
                                <div class="fc-back-swe">${s}</div>
                                <div class="fc-back-divider"></div>
                                <div class="fc-back-arb">${a}</div>
                                ${i?`<div class="fc-back-example">"${i}"</div>`:""}
                            </div>
                        </div>
                        <!-- Audio: Appears on hover/tap -->
                        <button class="fc-audio-float" onclick="event.stopPropagation(); FlashcardManager.playAudio('${s}')">🔊</button>
                    </div>
                `}
                
                <!-- Icon-Only Rating Buttons -->
                <div class="fc-actions-simple">
                    <button class="fc-action-btn wrong" onclick="FlashcardManager.markWrong('${t[0]}')" title="Vet inte / لا أعرف">
                        ❌
                    </button>
                    <button class="fc-action-btn correct" onclick="FlashcardManager.markCorrect('${t[0]}')" title="Vet / أعرف">
                        ✅
                    </button>
                </div>
                
                <!-- Minimal Navigation (hidden in focus mode) -->
                <div class="fc-nav-simple">
                    <button class="fc-nav-icon" onclick="SwipeNavigator.navigate(-1)" title="Föregående / السابق">←</button>
                    <button class="fc-nav-icon random" onclick="FlashcardManager.randomWord()" title="Slumpmässigt / عشوائي">🎲</button>
                    <button class="fc-nav-icon" onclick="SwipeNavigator.navigate(1)" title="Nästa / التالي">→</button>
                </div>
            </div>
        `,this.isFlipped=!1,this.setupKeyboardShortcuts(),this.startTimeUpdater()}static generateListeningOptions(t){return[...(window.dictionaryData||[]).filter(n=>n[2]!==t).sort(()=>Math.random()-.5).slice(0,3).map(n=>n[2]),t].sort(()=>Math.random()-.5).map(n=>`
            <button class="fc-listen-option" onclick="FlashcardManager.checkListeningAnswer('${n}', '${t}')">
                ${n}
            </button>
        `).join("")}static checkListeningAnswer(t,e){var s,a;t===e?this.markCorrect(((s=this.currentWordData)==null?void 0:s[0])||""):this.markWrong(((a=this.currentWordData)==null?void 0:a[0])||"")}static setMode(t){this.currentMode=t,this.currentWordData&&this.init(this.currentWordData)}static setupKeyboardShortcuts(){document.onkeydown=t=>{var e,s;t.code==="Space"?(t.preventDefault(),this.flip()):t.code==="ArrowRight"||t.code==="KeyD"?L.navigate(1):t.code==="ArrowLeft"||t.code==="KeyA"?L.navigate(-1):t.code==="ArrowUp"||t.code==="KeyW"?this.markCorrect(((e=this.currentWordData)==null?void 0:e[0])||""):(t.code==="ArrowDown"||t.code==="KeyS")&&this.markWrong(((s=this.currentWordData)==null?void 0:s[0])||"")}}static startTimeUpdater(){setInterval(()=>{const t=document.getElementById("fcTime");t&&(t.textContent=this.formatTime(Date.now()-this.startTime))},1e3)}static flip(){const t=document.querySelector(".flashcard-clean");t&&(this.isFlipped=!this.isFlipped,t.classList.toggle("flipped",this.isFlipped),t.classList.add("shimmering"),setTimeout(()=>t.classList.remove("shimmering"),1500),this.isFlipped&&this.currentWordData&&setTimeout(()=>this.playAudio(this.currentWordData[2]),300))}static randomWord(){const t=window.dictionaryData;if(!t||t.length===0)return;const e=Math.floor(Math.random()*t.length),s=t[e];window.location.href=`details.html?id=${s[0]}`}static markCorrect(t){this.streak++,this.xp+=10+this.streak*2,this.sessionStats.correct++,this.sessionStats.total++,this.updateStatsUI(),this.showSuccessGlow(),b(`✅ +${10+this.streak*2} XP`,{type:"success"}),j.updateMastery(t,!0),z.recordCorrect(t),setTimeout(()=>L.navigate(1),800)}static markWrong(t){this.streak=0,this.sessionStats.wrong++,this.sessionStats.total++,this.updateStatsUI(),this.showErrorFlash(),b("❌",{type:"error"}),j.updateMastery(t,!1),z.recordWrong(t)}static updateStatsUI(){const t=document.getElementById("fcStreak"),e=document.getElementById("fcXP"),s=document.getElementById("fcAccuracy");t&&(t.textContent=this.streak.toString()),e&&(e.textContent=this.xp.toString()),s&&(s.textContent=`${this.getAccuracy()}%`)}}p(y,"isFlipped",!1),p(y,"currentMode","normal"),p(y,"focusMode",!1),p(y,"streak",0),p(y,"xp",0),p(y,"sessionStats",{correct:0,wrong:0,total:0}),p(y,"startTime",Date.now()),p(y,"currentWordData",null);window.FlashcardManager=y;window.ShareManager=ot;class ct{constructor(){p(this,"wordId",null);p(this,"wordData",null);this.init()}async init(){const t=new URLSearchParams(window.location.search);if(this.wordId=t.get("id"),!this.wordId){window.location.href="index.html";return}this.setupGeneralListeners(),this.setupTabListeners();try{await A.init();const e=await A.getWordById(this.wordId);if(e){console.log("[Details] ⚡ Instant load from cache"),this.wordData=e,this.renderDetails(),Y.recordStudy(this.wordId),X.init(this.wordId),this.loadBackgroundData();return}}catch(e){console.warn("[Details] Cache lookup failed:",e)}console.warn("[Details] Word not in cache. Fallback disabled.")}async loadBackgroundData(){window.dictionaryData?this.initDeferredFeatures():this.initDeferredFeatures()}initDeferredFeatures(){if(!this.wordData)return;const t=document.getElementById("detailsArea");if(t&&(j.renderMasteryBar(this.wordId,t),Q.renderStreakBadge(t)),window.dictionaryData)N.init(this.wordData),G.init(this.wordData),L.init(this.wordId),y.init(this.wordData);else{const e=document.querySelector(".notes-section");e&&O.renderQuote(e)}}setupGeneralListeners(){const t=document.getElementById("themeToggleBtn");t&&t.addEventListener("click",()=>tt.toggle())}setupTabListeners(){const t=document.querySelectorAll(".details-tab-btn"),e=document.querySelectorAll(".tab-content");e.forEach(s=>{const a=s.dataset.tab==="info";s.style.display=a?"block":"none"}),t.forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.tab;t.forEach(n=>n.classList.toggle("active",n===s)),e.forEach(n=>{const i=n.dataset.tab===a;n.classList.toggle("active",i),n.style.display=i?"block":"none"}),a==="play"&&this.wordData&&N.init(this.wordData)})})}async handleDataReady(){const t=window.dictionaryData;if(t)if(this.wordData=t.find(e=>e[0].toString()===this.wordId)||null,this.wordData||(this.wordData=await A.getWordById(this.wordId)),this.wordData)Y.recordStudy(this.wordId),this.renderDetails(),X.init(this.wordId),N.init(this.wordData),G.init(this.wordData);else{const e=document.getElementById("detailsArea");e&&(e.innerHTML='<div class="placeholder-message"><span class="sv-text">Ordet hittades inte</span><span class="ar-text">الكلمة غير موجودة</span></div>')}}renderDetails(){const t=this.wordData,e=t[0].toString(),s=t[1],a=t[2],n=t[3],i=t[4]||"",o=t[5]||"",d=t[6]||"",r=t[7]||"",c=t[8]||"",u=t[9]||"",m=t[10]||"";et.getCategory(s,a,d);const f=F.has(e),k=this.getTypeGlowClass(s);this.setupHeaderActions(t,f);const g=document.getElementById("detailsArea");if(!g)return;const x=st.getBadge(s,d,a),$=R.process(o),M=R.process(r),E=R.process(u),B=document.querySelector(".details-tabs");B&&(B.className="details-tabs "+k);const q=document.querySelector(".details-header-sticky");q&&(q.className="details-header details-header-sticky "+k);let C=`
            <!-- Hero Section with Type Glow -->
            <div class="details-hero ${k}">
                <div class="hero-inner">
                    <h1 class="word-swe-hero">${a}</h1>
                    <div class="hero-divider"></div>
                    <p class="word-arb-hero" dir="rtl">${n}</p>
                    ${i?`<p class="word-arb-ext" dir="rtl">${i}</p>`:""}
                </div>
                
                <div class="word-meta-row">
                    <span class="word-type-pill">
                        <span class="sv-text">${s}</span>
                        <span class="sv-text ar-text"> / </span>
                        <span class="ar-text">${v("quran."+s.toLowerCase().replace("substantiv","noun"),"ar")||s}</span>
                    </span>
                    ${x}
                </div>
            </div>

            <div class="details-content-grid">
                ${d?`
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">🔗</span> <span class="sv-text">Böjningar</span><span class="ar-text">التصريفات</span></h3>
                    <div class="forms-container">
                        ${d.split(",").map(w=>`<span class="form-chip">${w.trim()}</span>`).join("")}
                    </div>
                </div>
                `:""}

                ${o||i?`
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">📝</span> <span class="sv-text">Betydelse</span><span class="ar-text">المعنى</span></h3>
                    <div class="definition-card">
                        ${o?`<p class="def-text">${$}</p>`:""}
                        ${i?`<p class="def-text" dir="rtl" style="margin-top: 10px; border-top: 1px solid var(--border); padding-top: 10px;">${i}</p>`:""}
                    </div>
                </div>
                `:""}

                ${r||c?`
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">💡</span> <span class="sv-text">Exempel</span><span class="ar-text">أمثلة</span></h3>
                    <div class="example-card">
                        ${r?`<div class="ex-swe-detail" dir="ltr">${M}</div>`:""}
                        ${c?`<div class="ex-arb-detail" dir="rtl">${c}</div>`:""}
                    </div>
                </div>
                `:""}

                ${u||m?`
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">💬</span> <span class="sv-text">Uttryck</span><span class="ar-text">تعابير</span></h3>
                    <div class="example-card idiom-card">
                        ${u?`<div class="ex-swe-detail" dir="ltr">${E}</div>`:""}
                        ${m?`<div class="ex-arb-detail" dir="rtl">${m}</div>`:""}
                    </div>
                </div>
                `:""}
            </div>
        `;g.innerHTML=C,R.setupListeners(g);const I=g.querySelector(".word-swe-hero");I&&W.apply(I,a);const D=g.querySelector(".word-arb-hero");D&&W.apply(D,n),g.querySelectorAll(".def-text, .ex-swe-detail, .ex-arb-detail").forEach(w=>{W.apply(w,w.textContent||"")});const h=_.getLanguage();h==="sv"?document.title=`${a} - SnabbaLexin`:h==="ar"?document.title=`${n} - سنابا لكسين`:document.title=`${a} | ${n} - SnabbaLexin`,setTimeout(()=>{S.init(a)},100)}setupHeaderActions(t,e){const s=t[2],a=t[0].toString(),n=a.startsWith("local_")||a.length>20,i=document.getElementById("headerAudioBtn");i&&(i.onclick=()=>K.speak(s,"sv"));const o=document.getElementById("headerFavoriteBtn");o&&(F.updateButtonIcon(o,e),o.onclick=()=>this.toggleFavorite(a,o));const d=document.getElementById("headerFlashcardBtn");d&&(d.onclick=()=>{window.location.href=`games/flashcards.html?id=${a}`});const r=document.getElementById("customActions");r&&(r.style.display=n?"flex":"none");const c=document.getElementById("editBtn");c&&(c.onclick=()=>{window.location.href=`add.html?edit=${a}`});const u=document.getElementById("deleteBtn");u&&(u.onclick=async()=>{confirm(T("details.confirmDelete"))&&(await A.deleteWord(a),b('<span class="sv-text">Ordet borttaget</span><span class="ar-text">تم حذف الكلمة</span>'),setTimeout(()=>window.location.href="index.html",1e3))});const m=document.getElementById("smartCopyBtn");m&&(m.onclick=()=>{navigator.clipboard.writeText(s).then(()=>b('<span class="sv-text">Kopierat</span><span class="ar-text">تم النسخ</span> 📋'))});const f=document.getElementById("headerShareBtn");f&&(f.onclick=()=>{const g=_.getLanguage()==="ar"?`📚 تعلمت كلمة جديدة!

🇸🇪 ${s}
🇸🇦 ${t[3]}

#SnabbaLexin`:`📚 Jag lärde mig ett nytt ord!

🇸🇪 ${s}
🇸🇦 ${t[3]}

#SnabbaLexin`;navigator.share?navigator.share({title:`Lexin: ${s}`,text:g,url:window.location.href}).catch(console.error):navigator.clipboard.writeText(window.location.href).then(()=>b('<span class="sv-text">Länk kopierad</span><span class="ar-text">تم نسخ الرابط</span> 🔗'))})}toggleFavorite(t,e){const s=F.toggle(t);F.updateButtonIcon(e,s)}getTypeGlowClass(t){const e=t.toLowerCase();return e.includes("verb")?"glow-verb":e.includes("subst")||e.includes("noun")?"glow-noun":e.includes("adj")?"glow-adjective":e.includes("adv")?"glow-adverb":e.includes("prep")?"glow-preposition":"glow-default"}}typeof window<"u"&&(window.detailsManager=new ct);
