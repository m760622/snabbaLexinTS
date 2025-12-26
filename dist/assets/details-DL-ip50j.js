var Y=Object.defineProperty;var P=(d,t,e)=>t in d?Y(d,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):d[t]=e;var u=(d,t,e)=>P(d,typeof t!="symbol"?t+"":t,e);import"./modulepreload-polyfill-B5Qt9EMX.js";import"./config-CfHoVMbv.js";import{D as T}from"./db-bEbbjtoI.js";import{showToast as y,ThemeManager as j,CategoryHelper as O,GrammarHelper as U,TextSizeManager as F}from"./utils-DkwAXeNx.js";import{T as R}from"./tts-BPLy4HEw.js";import{Q as N,F as C}from"./quiz-stats-C6Jzjky6.js";import"./pwa-Bxh5GLjF.js";import"./toast-manager-CZ3snF2j.js";class W{static process(t){return t?t.replace(/([a-zåäöA-ZÅÄÖ]{4,})/g,e=>`<span class="smart-link" data-word="${e.toLowerCase()}">${e}</span>`):""}static setupListeners(t){t.querySelectorAll(".smart-link").forEach(e=>{e.addEventListener("click",s=>{const a=s.currentTarget.dataset.word;if(a){const n=window.dictionaryData,i=n==null?void 0:n.find(o=>o[2].toLowerCase()===a);i?window.location.href=`details.html?id=${i[0]}`:window.location.href=`index.html?s=${a}`}})})}}class H{static async init(t){const e=document.getElementById("wordNotes"),s=document.getElementById("saveNotesBtn"),a=document.getElementById("notesStatus");if(!e||!s)return;const n=await T.getNote(t);n&&(e.value=n),s.onclick=async()=>{const i=e.value.trim();s.disabled=!0,a&&(a.textContent="Sparar...");const o=await T.saveNote(t,i);s.disabled=!1,a&&(a.textContent=o?"Sparat!":"Fel",setTimeout(()=>{a.textContent=""},3e3))}}}class q{static getArabicFeatures(t){const e=t.startsWith("ال"),s=t.endsWith("ة"),a=t.includes("و"),n=t.endsWith("ي")||t.endsWith("ى"),i=t.endsWith("ون")||t.endsWith("ين")||t.endsWith("ات"),o=t.split(" ").length;return{hasAl:e,hasTaa:s,hasWaw:a,hasYaa:n,hasPlural:i,wordCount:o,length:t.length}}static similarityScore(t,e){const s=this.getArabicFeatures(t),a=this.getArabicFeatures(e);let n=0;return s.hasAl===a.hasAl&&(n+=3),s.hasTaa===a.hasTaa&&(n+=2),s.hasPlural===a.hasPlural&&(n+=2),s.hasYaa===a.hasYaa&&(n+=1),s.wordCount===a.wordCount&&(n+=3),Math.abs(s.length-a.length)<=1&&(n+=4),Math.abs(s.length-a.length)===0&&(n+=3),t.charAt(0)===e.charAt(0)&&(n+=2),t.charAt(t.length-1)===e.charAt(e.length-1)&&(n+=2),n}static getSmartDistractors(t,e,s=3){const a=t[1],n=t[3];t[2];const i=[],o=new Set([n]),l=e.filter(r=>r[3]!==n&&r[1]===a).map(r=>({text:r[3],score:this.similarityScore(n,r[3])})).sort((r,c)=>c.score-r.score);for(const r of l){if(i.length>=s)break;o.has(r.text)||(i.push(r.text),o.add(r.text))}if(i.length<s)for(const r of e.sort(()=>Math.random()-.5)){if(i.length>=s)break;o.has(r[3])||(i.push(r[3]),o.add(r[3]))}return console.log("[Quiz] EXTREME distractors:",{correct:n,features:this.getArabicFeatures(n),distractors:i.map(r=>({text:r,score:this.similarityScore(n,r),features:this.getArabicFeatures(r)}))}),i}static pickRandom(t,e,s,a){const n=t.sort(()=>Math.random()-.5);for(const i of n){if(e.length>=e.length+a||a<=0)break;s.has(i[3])||(e.push(i[3]),s.add(i[3]),a--)}}static swedishSimilarityScore(t,e){let s=0;t.length===e.length?s+=10:Math.abs(t.length-e.length)===1&&(s+=5),t.charAt(0).toLowerCase()===e.charAt(0).toLowerCase()&&(s+=4),t.charAt(t.length-1)===e.charAt(e.length-1)&&(s+=3);const a=["ar","er","or","ning","tion","het","lig","isk"];for(const n of a)if(t.endsWith(n)&&e.endsWith(n)){s+=4;break}return t.substring(0,2).toLowerCase()===e.substring(0,2).toLowerCase()&&(s+=3),s}static getSwedishDistractors(t,e,s=3){const a=t[1],n=t[2],i=[],o=new Set([n]),l=e.filter(r=>r[2]!==n&&r[1]===a).map(r=>({text:r[2],score:this.swedishSimilarityScore(n,r[2])})).sort((r,c)=>c.score-r.score);for(const r of l){if(i.length>=s)break;o.has(r.text)||(i.push(r.text),o.add(r.text))}if(i.length<s)for(const r of e.sort(()=>Math.random()-.5)){if(i.length>=s)break;o.has(r[2])||(i.push(r[2]),o.add(r[2]))}return console.log("[Quiz] EXTREME Swedish distractors:",{correct:n,correctLen:n.length,distractors:i.map(r=>({text:r,len:r.length,score:this.swedishSimilarityScore(n,r)}))}),i}static init(t){const e=document.getElementById("miniQuizContainer"),s=document.getElementById("miniQuizQuestion"),a=document.getElementById("miniQuizOptions"),n=document.getElementById("miniQuizFeedback");if(!e||!s||!a||!n)return;const i=t[2],o=t[3],l=t[1],r=t[7]||"",c=window.dictionaryData,p=i.substring(0,Math.min(4,i.length)).toLowerCase(),m=r&&r.length>10&&r.toLowerCase().includes(p),g=m?[1,2,3]:[2,3],M=g[Math.floor(Math.random()*g.length)];let f,w,k,b,x;if(M===1&&m){const h=r.replace(new RegExp(`\\b(${p}\\w*)\\b`,"gi"),"______");f=[...c?this.getSwedishDistractors(t,c,3):[],i].sort(()=>Math.random()-.5),w=i,k=`
                <div class="quiz-sentence" dir="ltr">"${h}"</div>
                <div class="quiz-instruction">Välj rätt ord</div>
            `,b="Fyll i",x="📝",console.log("[Quiz] FILL BLANK mode:",{sentence:r,correctAnswer:i})}else M===2?(f=[...c?this.getSwedishDistractors(t,c,3):[],i].sort(()=>Math.random()-.5),w=i,k=`
                <div class="quiz-listen-container">
                    <button class="quiz-listen-btn" onclick="window.TTSManager?.speak('${i}', 'sv')">
                        🔊 <span>Lyssna</span>
                    </button>
                </div>
                <div class="quiz-instruction">Vilket ord hörde du?</div>
            `,b="Lyssna",x="🎧",setTimeout(()=>R.speak(i,"sv"),500),console.log("[Quiz] LISTENING mode:",{correctAnswer:i})):Math.random()<.5?(f=[...c?this.getSwedishDistractors(t,c,3):[],i].sort(()=>Math.random()-.5),w=i,k=`Vad är det svenska ordet för <strong>"${o}"</strong>?`,b="Omvänd",x="🔄"):(f=[...c?this.getSmartDistractors(t,c,3):[],o].sort(()=>Math.random()-.5),w=o,k=`Vad betyder <strong>"${i}"</strong>?`,b=l,x="📖");const I=parseInt(localStorage.getItem("quizStreak")||"0"),B=parseInt(localStorage.getItem("quizXP")||"0");s.innerHTML=`
            <div class="quiz-header-row">
                <span class="quiz-word-type">${x} ${b}</span>
                <div class="quiz-stats">
                    <span class="quiz-xp">⭐ ${B} XP</span>
                    ${I>0?`<span class="quiz-streak">🔥 ${I}</span>`:""}
                </div>
            </div>
            <div class="quiz-timer-bar"><div class="quiz-timer-progress"></div></div>
            ${k}
        `,a.innerHTML=f.map(h=>`
            <div class="mini-quiz-option" data-value="${h}">${h}</div>
        `).join("");let E=15;const $=s.querySelector(".quiz-timer-progress"),L=setInterval(()=>{if(E--,$){const h=E/15*100;$.style.width=`${h}%`,h<30?$.style.background="#ef4444":h<60&&($.style.background="#f59e0b")}E<=0&&(clearInterval(L),this.handleAnswer(a,n,"",w,t,!1))},1e3);a.querySelectorAll(".mini-quiz-option").forEach(h=>{h.addEventListener("click",D=>{clearInterval(L);const X=D.currentTarget.dataset.value;this.handleAnswer(a,n,X,w,t,!0)})})}static handleAnswer(t,e,s,a,n,i){const o=s===a,l=n[0].toString();let r=parseInt(localStorage.getItem("quizStreak")||"0"),c=parseInt(localStorage.getItem("quizXP")||"0");o?(r++,c+=10+r*2,this.showConfetti()):r=0,localStorage.setItem("quizStreak",r.toString()),localStorage.setItem("quizXP",c.toString()),z.updateMastery(l,o),o?A.recordCorrect(l):A.recordWrong(l),t.querySelectorAll(".mini-quiz-option").forEach(g=>{g.classList.add("disabled"),g.dataset.value===a?g.classList.add("correct"):g.dataset.value===s&&!o&&g.classList.add("wrong")});const p=o&&r>1?`<span class="streak-bonus">🔥 ${r}x streak! +${r*2} XP</span>`:"",m=i?"":'⏰ <span class="sv-text">Tiden är slut!</span><span class="ar-text">انتهى الوقت!</span>';e.classList.remove("hidden"),e.innerHTML=`
            ${m}
            ${o?`🎉 <span class="sv-text">Rätt! Bra jobbat!</span><span class="ar-text">صحيح! أحسنت!</span> ${p}`:`❌ <span class="sv-text">Fel. Rätt svar är "${a}".</span><span class="ar-text">خطأ. الجواب الصحيح هو "${a}".</span>`}
            <button class="quiz-retry-btn" onclick="MiniQuizManager.init(window.currentWordData)">
                🔄 <span class="sv-text">Testa igen</span><span class="ar-text">حاول مرة أخرى</span>
            </button>
        `,e.className=`mini-quiz-feedback ${o?"correct":"wrong"}`,window.currentWordData=n}static showConfetti(){const t=document.getElementById("miniQuizContainer");if(!t)return;const e=30;for(let s=0;s<e;s++){const a=document.createElement("div");a.className="quiz-confetti",a.style.left=`${Math.random()*100}%`,a.style.animationDelay=`${Math.random()*.5}s`,a.style.background=["#ff6b6b","#feca57","#48dbfb","#ff9ff3","#54a0ff"][Math.floor(Math.random()*5)],t.appendChild(a),setTimeout(()=>a.remove(),2e3)}}}window.MiniQuizManager=q;class _{static init(t){const e=document.getElementById("relatedWordsContainer");if(!e)return;const s=t[1],a=t[2],n=window.dictionaryData;if(!n)return;const i=n.filter(o=>o[2]!==a&&(o[1]===s||o[2].startsWith(a.substring(0,2)))).sort(()=>Math.random()-.5).slice(0,6);e.innerHTML=i.map(o=>`
            <div class="related-word-chip" onclick="window.location.href='details.html?id=${o[0]}'">
                <span class="swe">${o[2]}</span>
                <span class="arb">${o[3]}</span>
            </div>
        `).join("")}}class S{static init(t){const e=window.dictionaryData;if(!e||(this.currentWordIndex=e.findIndex(a=>a[0].toString()===t),this.currentWordIndex===-1))return;const s=document.getElementById("detailsArea");s&&(this.addSwipeHints(s),s.addEventListener("touchstart",a=>this.handleTouchStart(a),{passive:!0}),s.addEventListener("touchend",a=>this.handleTouchEnd(a),{passive:!0}))}static addSwipeHints(t){const e=document.createElement("div");e.className="swipe-hints",e.innerHTML=`
            <span class="swipe-hint left" onclick="SwipeNavigator.navigate(-1)"><span class="sv-text">‹ Föregående</span><span class="ar-text">‹ السابق</span></span>
            <span class="swipe-hint right" onclick="SwipeNavigator.navigate(1)"><span class="sv-text">Nästa ›</span><span class="ar-text">التالي ›</span></span>
        `,t.prepend(e)}static handleTouchStart(t){this.startX=t.touches[0].clientX,this.startY=t.touches[0].clientY}static handleTouchEnd(t){const e=t.changedTouches[0].clientX,s=t.changedTouches[0].clientY,a=e-this.startX,n=Math.abs(s-this.startY);Math.abs(a)>80&&n<50&&(a>0?this.navigate(-1):this.navigate(1))}static navigate(t){var a;const e=window.dictionaryData;if(!e||this.currentWordIndex===-1)return;const s=this.currentWordIndex+t;if(s>=0&&s<e.length){const n=e[s][0];(a=document.getElementById("detailsArea"))==null||a.classList.add(t>0?"slide-left":"slide-right"),setTimeout(()=>{window.location.href=`details.html?id=${n}`},150)}}}u(S,"startX",0),u(S,"startY",0),u(S,"currentWordIndex",-1);window.SwipeNavigator=S;class z{static getKey(t){return`mastery_${t}`}static getMastery(t){return parseInt(localStorage.getItem(this.getKey(t))||"0")}static updateMastery(t,e){let s=this.getMastery(t);return s+=e?20:-10,s=Math.max(0,Math.min(100,s)),localStorage.setItem(this.getKey(t),s.toString()),s}static getLastStudied(t){return localStorage.getItem(`lastStudied_${t}`)}static recordStudy(t){localStorage.setItem(`lastStudied_${t}`,new Date().toISOString())}static getTimeAgo(t){const e=this.getLastStudied(t);if(!e)return"";const s=Date.now()-new Date(e).getTime(),a=Math.floor(s/(1e3*60*60*24)),n=Math.floor(s/(1e3*60*60)),i=Math.floor(s/(1e3*60));return a>0?`<span class="sv-text">Studerad ${a} dagar sedan</span><span class="ar-text">درست منذ ${a} أيام</span>`:n>0?`<span class="sv-text">Studerad ${n} timmar sedan</span><span class="ar-text">درست منذ ${n} ساعات</span>`:i>0?`<span class="sv-text">Studerad ${i} minuter sedan</span><span class="ar-text">درست منذ ${i} دقائق</span>`:'<span class="sv-text">Nyligen</span><span class="ar-text">مؤخراً</span>'}static renderMasteryBar(t,e){const s=this.getMastery(t),a=this.getTimeAgo(t),n=A.isWeak(t),i=document.createElement("div");i.className="mastery-section",i.innerHTML=`
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
        `,e.prepend(i),this.recordStudy(t)}}class A{static getKey(t){return`weak_${t}`}static recordWrong(t){const e=this.getWrongCount(t)+1;localStorage.setItem(this.getKey(t),e.toString())}static recordCorrect(t){const e=Math.max(0,this.getWrongCount(t)-1);localStorage.setItem(this.getKey(t),e.toString())}static getWrongCount(t){return parseInt(localStorage.getItem(this.getKey(t))||"0")}static isWeak(t){return this.getWrongCount(t)>=3}}class K{static checkAndUpdateStreak(){const t=new Date().toDateString(),e=localStorage.getItem(this.LAST_DATE_KEY);let s=parseInt(localStorage.getItem(this.STREAK_KEY)||"0");if(e===t)return s;const a=new Date;return a.setDate(a.getDate()-1),e===a.toDateString()?s++:e!==t&&(s=1),localStorage.setItem(this.STREAK_KEY,s.toString()),localStorage.setItem(this.LAST_DATE_KEY,t),s}static getStreak(){return parseInt(localStorage.getItem(this.STREAK_KEY)||"0")}static renderStreakBadge(t){const e=this.checkAndUpdateStreak();if(e<2)return;const s=document.createElement("div");s.className="daily-streak-badge",s.innerHTML=`
            <span class="streak-fire">🔥</span>
            <span>${e} أيام متتالية!</span>
        `,t.prepend(s)}}u(K,"STREAK_KEY","dailyStreak"),u(K,"LAST_DATE_KEY","lastStudyDate");class Q{static getRandomQuote(){return this.quotes[Math.floor(Math.random()*this.quotes.length)]}static renderQuote(t){const e=this.getRandomQuote(),s=document.createElement("div");s.className="motivation-quote",s.innerHTML=`
            <p>"${e.text}"</p>
            <div class="author">— ${e.author}</div>
        `,t.appendChild(s)}}u(Q,"quotes",[{text:"Varje nytt ord är ett fönster mot en ny värld",author:"Okänd"},{text:"Lärande är ingen tävling, det är en resa",author:"Visdom"},{text:"Den som lär sig ett språk, förstår en kultur",author:"Ordspråk"},{text:"Språket är nationens själ",author:"Fichte"},{text:"Varje dag lär du dig något nytt",author:"Svenskt ordspråk"},{text:"Språket är nyckeln till kulturen",author:"Visdom"},{text:"Ett språk är en värld",author:"Okänd"},{text:"Övning ger färdighet",author:"Svenskt ordspråk"}]);class G{static share(t){const e=t[2],s=t[3],a=t[1],n=`📚 تعلمت كلمة جديدة!

🇸🇪 ${e} (${a})
🇸🇦 ${s}

#SnabbaLexin #LearnSwedish`;navigator.share?navigator.share({title:`${e} - SnabbaLexin`,text:n,url:window.location.href}).catch(()=>{}):(navigator.clipboard.writeText(n),y('<span class="sv-text">Kopierad!</span><span class="ar-text">تم النسخ!</span>'))}static renderShareButton(t,e){const s=document.createElement("button");s.className="share-btn",s.innerHTML='📤 <span class="sv-text">Dela</span><span class="ar-text">مشاركة</span>',s.onclick=()=>this.share(e),t.appendChild(s)}}class v{static getTypeGlowClass(t){const e=t.toLowerCase();return e.includes("verb")?"glow-verb":e.includes("subst")||e.includes("noun")?"glow-noun":e.includes("adj")?"glow-adjective":e.includes("adv")?"glow-adverb":e.includes("prep")?"glow-preposition":"glow-default"}static getTextSizeClass(t){const e=t.length;return e<=8?"text-xl":e<=15?"text-lg":e<=25?"text-md":e<=40?"text-sm":"text-xs"}static showSuccessGlow(){const t=document.querySelector(".flashcard-clean");t&&(t.classList.add("fc-success-glow"),setTimeout(()=>t.classList.remove("fc-success-glow"),600))}static showErrorFlash(){const t=document.querySelector(".flashcard-clean");t&&(t.classList.add("fc-error-flash"),setTimeout(()=>t.classList.remove("fc-error-flash"),400))}static toggleFocus(){this.focusMode=!this.focusMode;const t=document.querySelector(".fc-card-area"),e=document.getElementById("fcStatsBar"),s=document.querySelector(".fc-minimal-header");this.focusMode?(t==null||t.classList.add("focus-mode"),e==null||e.classList.add("hidden"),s==null||s.classList.add("hidden"),y('🧘 <span class="sv-text">Fokusläge aktiverat</span><span class="ar-text">وضع التركيز مُفعّل</span>',{type:"info"})):(t==null||t.classList.remove("focus-mode"),e==null||e.classList.remove("hidden"),s==null||s.classList.remove("hidden"),y('<span class="sv-text">Fokusläge avslutat</span><span class="ar-text">انتهى وضع التركيز</span>'))}static playAudio(t){window.TTSManager&&window.TTSManager.speak(t,"sv")}static formatTime(t){const e=Math.floor(t/1e3),s=Math.floor(e/60),a=e%60;return`${s}:${a.toString().padStart(2,"0")}`}static getAccuracy(){return this.sessionStats.total===0?0:Math.round(this.sessionStats.correct/this.sessionStats.total*100)}static init(t){const e=document.getElementById("flashcardContainer");if(!e)return;this.currentWordData=t;const s=t[2],a=t[3],n=t[1],i=t[7]||"",o=this.getTypeGlowClass(n),l=this.getTextSizeClass(s),r=this.getTextSizeClass(a),c=this.currentMode==="reverse"?a:s;this.currentMode;const p=this.currentMode==="reverse"?"rtl":"ltr";this.currentMode,e.innerHTML=`
            <!-- Minimal Header: Mode + Focus Toggle -->
            <div class="fc-minimal-header">
                <div class="fc-mode-pills">
                    <button class="fc-pill ${this.currentMode==="normal"?"active":""}" onclick="FlashcardManager.setMode('normal')" title="Normal">🇸🇪</button>
                    <button class="fc-pill ${this.currentMode==="reverse"?"active":""}" onclick="FlashcardManager.setMode('reverse')" title="Omvänd">🔄</button>
                    <button class="fc-pill ${this.currentMode==="listening"?"active":""}" onclick="FlashcardManager.setMode('listening')" title="Lyssna">🎧</button>
                </div>
                <button class="fc-focus-toggle" onclick="FlashcardManager.toggleFocus()" title="Fokusläge">
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
                                <div class="fc-front-word ${this.currentMode==="reverse"?r:l}" dir="${p}">${c}</div>
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
                    <button class="fc-action-btn wrong" onclick="FlashcardManager.markWrong('${t[0]}')" title="Vet inte">
                        ❌
                    </button>
                    <button class="fc-action-btn correct" onclick="FlashcardManager.markCorrect('${t[0]}')" title="Vet">
                        ✅
                    </button>
                </div>
                
                <!-- Minimal Navigation (hidden in focus mode) -->
                <div class="fc-nav-simple">
                    <button class="fc-nav-icon" onclick="SwipeNavigator.navigate(-1)" title="Föregående">←</button>
                    <button class="fc-nav-icon random" onclick="FlashcardManager.randomWord()" title="Slumpmässigt">🎲</button>
                    <button class="fc-nav-icon" onclick="SwipeNavigator.navigate(1)" title="Nästa">→</button>
                </div>
            </div>
        `,this.isFlipped=!1,this.setupKeyboardShortcuts(),this.startTimeUpdater()}static generateListeningOptions(t){return[...(window.dictionaryData||[]).filter(n=>n[2]!==t).sort(()=>Math.random()-.5).slice(0,3).map(n=>n[2]),t].sort(()=>Math.random()-.5).map(n=>`
            <button class="fc-listen-option" onclick="FlashcardManager.checkListeningAnswer('${n}', '${t}')">
                ${n}
            </button>
        `).join("")}static checkListeningAnswer(t,e){var s,a;t===e?this.markCorrect(((s=this.currentWordData)==null?void 0:s[0])||""):this.markWrong(((a=this.currentWordData)==null?void 0:a[0])||"")}static setMode(t){this.currentMode=t,this.currentWordData&&this.init(this.currentWordData)}static setupKeyboardShortcuts(){document.onkeydown=t=>{var e,s;t.code==="Space"?(t.preventDefault(),this.flip()):t.code==="ArrowRight"||t.code==="KeyD"?S.navigate(1):t.code==="ArrowLeft"||t.code==="KeyA"?S.navigate(-1):t.code==="ArrowUp"||t.code==="KeyW"?this.markCorrect(((e=this.currentWordData)==null?void 0:e[0])||""):(t.code==="ArrowDown"||t.code==="KeyS")&&this.markWrong(((s=this.currentWordData)==null?void 0:s[0])||"")}}static startTimeUpdater(){setInterval(()=>{const t=document.getElementById("fcTime");t&&(t.textContent=this.formatTime(Date.now()-this.startTime))},1e3)}static flip(){const t=document.querySelector(".flashcard-clean");t&&(this.isFlipped=!this.isFlipped,t.classList.toggle("flipped",this.isFlipped),t.classList.add("shimmering"),setTimeout(()=>t.classList.remove("shimmering"),1500),this.isFlipped&&this.currentWordData&&setTimeout(()=>this.playAudio(this.currentWordData[2]),300))}static randomWord(){const t=window.dictionaryData;if(!t||t.length===0)return;const e=Math.floor(Math.random()*t.length),s=t[e];window.location.href=`details.html?id=${s[0]}`}static markCorrect(t){this.streak++,this.xp+=10+this.streak*2,this.sessionStats.correct++,this.sessionStats.total++,this.updateStatsUI(),this.showSuccessGlow(),y(`✅ +${10+this.streak*2} XP`,{type:"success"}),z.updateMastery(t,!0),A.recordCorrect(t),setTimeout(()=>S.navigate(1),800)}static markWrong(t){this.streak=0,this.sessionStats.wrong++,this.sessionStats.total++,this.updateStatsUI(),this.showErrorFlash(),y("❌",{type:"error"}),z.updateMastery(t,!1),A.recordWrong(t)}static updateStatsUI(){const t=document.getElementById("fcStreak"),e=document.getElementById("fcXP"),s=document.getElementById("fcAccuracy");t&&(t.textContent=this.streak.toString()),e&&(e.textContent=this.xp.toString()),s&&(s.textContent=`${this.getAccuracy()}%`)}}u(v,"isFlipped",!1),u(v,"currentMode","normal"),u(v,"focusMode",!1),u(v,"streak",0),u(v,"xp",0),u(v,"sessionStats",{correct:0,wrong:0,total:0}),u(v,"startTime",Date.now()),u(v,"currentWordData",null);window.FlashcardManager=v;window.ShareManager=G;class V{constructor(){u(this,"wordId",null);u(this,"wordData",null);this.init()}async init(){const t=new URLSearchParams(window.location.search);if(this.wordId=t.get("id"),!this.wordId){window.location.href="index.html";return}this.setupGeneralListeners(),this.setupTabListeners();try{await T.init();const e=await T.getWordById(this.wordId);if(e){console.log("[Details] ⚡ Instant load from cache"),this.wordData=e,this.renderDetails(),N.recordStudy(this.wordId),H.init(this.wordId),this.loadBackgroundData();return}}catch(e){console.warn("[Details] Cache lookup failed:",e)}console.warn("[Details] Word not in cache. Fallback disabled.")}async loadBackgroundData(){window.dictionaryData?this.initDeferredFeatures():this.initDeferredFeatures()}initDeferredFeatures(){if(!this.wordData)return;const t=document.getElementById("detailsArea");if(t&&(z.renderMasteryBar(this.wordId,t),K.renderStreakBadge(t)),window.dictionaryData)q.init(this.wordData),_.init(this.wordData),S.init(this.wordId),v.init(this.wordData);else{const e=document.querySelector(".notes-section");e&&Q.renderQuote(e)}}setupGeneralListeners(){const t=document.getElementById("themeToggleBtn");t&&t.addEventListener("click",()=>j.toggle())}setupTabListeners(){const t=document.querySelectorAll(".details-tab-btn"),e=document.querySelectorAll(".tab-content");e.forEach(s=>{const a=s.dataset.tab==="info";s.style.display=a?"block":"none"}),t.forEach(s=>{s.addEventListener("click",()=>{const a=s.dataset.tab;t.forEach(n=>n.classList.toggle("active",n===s)),e.forEach(n=>{const i=n.dataset.tab===a;n.classList.toggle("active",i),n.style.display=i?"block":"none"}),a==="play"&&this.wordData&&q.init(this.wordData)})})}async handleDataReady(){const t=window.dictionaryData;if(t)if(this.wordData=t.find(e=>e[0].toString()===this.wordId)||null,this.wordData||(this.wordData=await T.getWordById(this.wordId)),this.wordData)N.recordStudy(this.wordId),this.renderDetails(),H.init(this.wordId),q.init(this.wordData),_.init(this.wordData);else{const e=document.getElementById("detailsArea");e&&(e.innerHTML='<div class="placeholder-message"><span class="sv-text">Ordet hittades inte</span><span class="ar-text">الكلمة غير موجودة</span></div>')}}renderDetails(){const t=this.wordData,e=t[0].toString(),s=t[1],a=t[2],n=t[3],i=t[4]||"",o=t[5]||"",l=t[6]||"",r=t[7]||"",c=t[8]||"",p=t[9]||"",m=t[10]||"";O.getCategory(s,a,l);const g=C.has(e),M=this.getTypeGlowClass(s);this.setupHeaderActions(t,g);const f=document.getElementById("detailsArea");if(!f)return;const w=U.getBadge(s,l,a),k=W.process(o),b=W.process(r),x=W.process(p),I=document.querySelector(".details-tabs");I&&(I.className="details-tabs "+M);const B=document.querySelector(".details-header-sticky");B&&(B.className="details-header details-header-sticky "+M);let E=`
            <!-- Hero Section with Type Glow -->
            <div class="details-hero ${M}">
                <div class="hero-inner">
                    <h1 class="word-swe-hero">${a}</h1>
                    <div class="hero-divider"></div>
                    <p class="word-arb-hero" dir="rtl">${n}</p>
                    ${i?`<p class="word-arb-ext" dir="rtl">${i}</p>`:""}
                </div>
                
                <div class="word-meta-row">
                    <span class="word-type-pill">${s}</span>
                    ${w}
                </div>
            </div>

            <div class="details-content-grid">
                ${l?`
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">🔗</span> <span class="sv-text">Böjningar</span><span class="ar-text">التصريفات</span></h3>
                    <div class="forms-container">
                        ${l.split(",").map(h=>`<span class="form-chip">${h.trim()}</span>`).join("")}
                    </div>
                </div>
                `:""}

                ${o||i?`
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">📝</span> <span class="sv-text">Betydelse</span><span class="ar-text">المعنى</span></h3>
                    <div class="definition-card">
                        ${o?`<p class="def-text">${k}</p>`:""}
                        ${i?`<p class="def-text" dir="rtl" style="margin-top: 10px; border-top: 1px solid var(--border); padding-top: 10px;">${i}</p>`:""}
                    </div>
                </div>
                `:""}

                ${r||c?`
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">💡</span> <span class="sv-text">Exempel</span><span class="ar-text">أمثلة</span></h3>
                    <div class="example-card">
                        ${r?`<div class="ex-swe-detail" dir="ltr">${b}</div>`:""}
                        ${c?`<div class="ex-arb-detail" dir="rtl">${c}</div>`:""}
                    </div>
                </div>
                `:""}

                ${p||m?`
                <div class="details-section">
                    <h3 class="section-title"><span class="section-icon">💬</span> <span class="sv-text">Uttryck</span><span class="ar-text">تعابير</span></h3>
                    <div class="example-card idiom-card">
                        ${p?`<div class="ex-swe-detail" dir="ltr">${x}</div>`:""}
                        ${m?`<div class="ex-arb-detail" dir="rtl">${m}</div>`:""}
                    </div>
                </div>
                `:""}
            </div>
        `;f.innerHTML=E,W.setupListeners(f);const $=f.querySelector(".word-swe-hero");$&&F.apply($,a);const L=f.querySelector(".word-arb-hero");L&&F.apply(L,n),f.querySelectorAll(".def-text, .ex-swe-detail, .ex-arb-detail").forEach(h=>{F.apply(h,h.textContent||"")})}setupHeaderActions(t,e){const s=t[2],a=t[0].toString(),n=a.startsWith("local_")||a.length>20,i=document.getElementById("headerAudioBtn");i&&(i.onclick=()=>R.speak(s,"sv"));const o=document.getElementById("headerFavoriteBtn");o&&(C.updateButtonIcon(o,e),o.onclick=()=>this.toggleFavorite(a,o));const l=document.getElementById("headerFlashcardBtn");l&&(l.onclick=()=>{window.location.href=`games/flashcards.html?id=${a}`});const r=document.getElementById("customActions");r&&(r.style.display=n?"flex":"none");const c=document.getElementById("editBtn");c&&(c.onclick=()=>{window.location.href=`add.html?edit=${a}`});const p=document.getElementById("deleteBtn");p&&(p.onclick=async()=>{confirm("هل أنت متأكد من حذف الكلمة؟ / Är du säker?")&&(await T.deleteWord(a),y('<span class="sv-text">Ordet borttaget</span><span class="ar-text">تم حذف الكلمة</span>'),setTimeout(()=>window.location.href="index.html",1e3))});const m=document.getElementById("smartCopyBtn");m&&(m.onclick=()=>{navigator.clipboard.writeText(s).then(()=>y('<span class="sv-text">Kopierat</span><span class="ar-text">تم النسخ</span> 📋'))});const g=document.getElementById("headerShareBtn");g&&(g.onclick=()=>{navigator.share?navigator.share({title:`Lexin: ${s}`,text:`Hur man säger "${s}" på arabiska: ${t[3]}`,url:window.location.href}).catch(console.error):navigator.clipboard.writeText(window.location.href).then(()=>y('<span class="sv-text">Länk kopierad</span><span class="ar-text">تم نسخ الرابط</span> 🔗'))})}toggleFavorite(t,e){const s=C.toggle(t);C.updateButtonIcon(e,s)}getTypeGlowClass(t){const e=t.toLowerCase();return e.includes("verb")?"glow-verb":e.includes("subst")||e.includes("noun")?"glow-noun":e.includes("adj")?"glow-adjective":e.includes("adv")?"glow-adverb":e.includes("prep")?"glow-preposition":"glow-default"}}typeof window<"u"&&(window.detailsManager=new V);
