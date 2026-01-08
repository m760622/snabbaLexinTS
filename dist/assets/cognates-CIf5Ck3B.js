import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css                            */import{c as g}from"./cognatesData-BlpZJuMf.js";import{T as j}from"./tts-CfZZetlp.js";import{TextSizeManager as Q}from"./utils-CfsGp8IC.js";import{L as ot}from"./i18n-BpwFYk4h.js";import{c as it}from"./LearnViewManager-RsT_Dh_9.js";import"./pwa-Bn3RWWLO.js";import"./toast-manager-B6dAfcdf.js";let h="all",v=JSON.parse(localStorage.getItem("cognates_saved")||"[]"),$=JSON.parse(localStorage.getItem("cognates_learned")||"[]"),q=parseInt(localStorage.getItem("cognates_streak")||"0"),f=[],m=0,M=0,o=null,x="normal";const L={Substantiv:"📦",Adjektiv:"🎨",Verb:"🏃",Geografi:"🌍","Medicin & Vetenskap":"🔬","Musik & Konst":"🎵","Mat & Dryck":"🍽️",Teknik:"💻",Övrigt:"📌"},k=20;let S={},T=0,I=null;function ct(){ot.init();const t=localStorage.getItem("theme")||"dark";document.documentElement.setAttribute("data-theme",t),localStorage.getItem("mobileView")==="true"&&(document.documentElement.classList.add("iphone-mode"),document.body.classList.add("iphone-view")),C(),lt(),w("browse"),dt(),_(g);const s=document.getElementById("searchInput");s&&s.addEventListener("input",e=>P(e)),window.switchMode=w,window.filterByCategory=ut,window.toggleSave=G,window.openSavedModal=ft,window.startQuiz=Y,window.closeQuiz=Z,window.flipCard=U,window.flashcardAnswer=X,window.setQuizType=tt,window.checkAnswer=et,window.checkWrittenAnswer=wt,window.playTTS=E,window.toggleMobileView=O,window.toggleFilters=N}function O(){const t=document.body.classList.toggle("iphone-view");document.documentElement.classList.toggle("iphone-mode",t),localStorage.setItem("mobileView",t.toString())}function N(){const t=document.getElementById("filterChips"),s=document.getElementById("filterToggle");if(t&&s){const e=t.classList.toggle("collapsed");s.classList.toggle("active",!e),s.textContent=e?"🔽":"🔼"}}const W=it();function lt(){W.registerViews({browse:{viewId:"browseView"},flashcard:{viewId:"flashcardView",onActivate:J},saved:{viewId:"savedView",onActivate:A},quiz:{viewId:"quizView",onActivate:mt}})}function w(t){W.switchTo(t),document.querySelectorAll(".mode-btn").forEach(e=>e.classList.remove("active"));const s=document.getElementById(`btn-${t}`);s&&(s.classList.add("active"),rt(s))}function rt(t){const s=document.getElementById("modeIndicator"),e=document.getElementById("modeSelectionBar");if(!s||!e)return;const n=e.getBoundingClientRect(),i=t.getBoundingClientRect(),u=i.left-n.left;s.style.width=`${i.width}px`,s.style.transform=`translateX(${u-6}px)`}function C(){const t=document.getElementById("totalWords"),s=document.getElementById("learnedCount"),e=document.getElementById("savedCount"),n=document.getElementById("streakCount");t&&(t.textContent=g.length.toString()),s&&(s.textContent=$.length.toString()),e&&(e.textContent=v.length.toString()),n&&(n.textContent=q.toString())}function B(){localStorage.setItem("cognates_saved",JSON.stringify(v)),localStorage.setItem("cognates_learned",JSON.stringify($)),localStorage.setItem("cognates_streak",q.toString()),C()}function P(t){const e=t.target.value.toLowerCase().trim();let n=g.filter(i=>i.swe.toLowerCase().includes(e)||i.arb.includes(e));h!=="all"&&(n=n.filter(i=>i.category===h)),_(n)}function dt(){const t=document.getElementById("filterChips");if(!t)return;const s=["all",...new Set(g.map(e=>e.category||"Övrigt"))];t.innerHTML=s.map(e=>`
        <button class="chip ${e==="all"?"active":""}" onclick="filterByCategory('${e}')">
            ${e==="all"?'🌐 <span class="sv-text">Alla</span><span class="ar-text">الكل</span>':(L[e]||"📌")+" "+e}
        </button>
    `).join("")}function ut(t){var n;h=t,document.querySelectorAll(".chip").forEach(i=>i.classList.remove("active"));const s=(n=window.event)==null?void 0:n.target;s&&s.classList.add("active");const e=document.getElementById("searchInput");P({target:e})}function _(t){const s=document.getElementById("content");if(s){if(T=0,s.innerHTML="",t.length===0){s.innerHTML='<div class="empty-state"><span class="sv-text">Inga ord hittades</span><span class="ar-text">لا توجد نتائج</span></div>';return}S={},t.forEach(e=>{const n=e.category||"Övrigt";S[n]||(S[n]=[]),S[n].push(e)}),R(s),pt(s)}}function R(t){const s=Object.keys(S),e=T*k,n=[];for(const c of s)for(const y of S[c])n.push({item:y,category:c});const i=Math.min(e+k,n.length);if(e>=n.length)return;const u={};for(let c=e;c<i;c++){const{item:y,category:d}=n[c];u[d]||(u[d]=[]),u[d].push(y)}const r=t.querySelector(".load-more-sentinel");r&&r.remove();for(const[c,y]of Object.entries(u)){let d=t.querySelector(`[data-category="${c}"]`);d||(d=document.createElement("div"),d.className="category-section",d.setAttribute("data-category",c),d.innerHTML=`
                <div class="category-title">
                    <span>${L[c]||"📌"}</span>
                    <span>${c} (${S[c].length})</span>
                </div>
                <div class="cognates-grid"></div>
            `,t.appendChild(d));const V=d.querySelector(".cognates-grid");V&&y.forEach(b=>{const z=v.includes(b.swe),nt=$.includes(b.swe),F=b.swe.replace(/'/g,"\\'"),at=`
                    <div class="cognate-card ${nt?"learned":""} ${z?"saved":""}" onclick="playTTS('${F}')">
                        <div>
                            <span class="word-swe" data-auto-size>${b.swe}</span>
                            <span class="speaker-icon">🔊</span>
                            ${b.type?`<span class="word-type">${b.type}</span>`:""}
                        </div>
                        <div class="flex-center-gap">
                            <span class="word-arb" data-auto-size>${b.arb}</span>
                            <button class="mini-btn ${z?"saved":""}" onclick="event.stopPropagation(); toggleSave('${F}')">${z?"⭐":"☆"}</button>
                        </div>
                    </div>`;V.insertAdjacentHTML("beforeend",at)})}T++;const p=n.length,a=T*k;if(a<p){const c=document.createElement("div");c.className="load-more-sentinel",c.style.cssText="height: 50px; display: flex; align-items: center; justify-content: center; color: #60a5fa; opacity: 0.7;";const y=p-a;c.innerHTML=`<span>⏳ جاري تحميل ${Math.min(k,y)} كلمة أخرى...</span>`,t.appendChild(c)}else{const c=document.createElement("div");c.className="end-of-list",c.style.cssText="text-align: center; padding: 1rem; color: #60a5fa; opacity: 0.6;",c.innerHTML=`✨ تم عرض ${p} كلمة`,t.appendChild(c)}Q.autoApply();const l=t.querySelector(".load-more-sentinel");l&&I&&I.observe(l)}function pt(t){I&&I.disconnect(),I=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&R(t)})},{rootMargin:"100px"});const s=t.querySelector(".load-more-sentinel");s&&I.observe(s)}function E(t){j?j.speak(t,"sv"):console.error("TTSManager not loaded")}function ft(){w("saved")}function A(){const t=document.getElementById("savedList");t&&(v.length===0?t.innerHTML=`
            <div class="empty-state-card">
                <div class="empty-icon">⭐</div>
                <p><span class="sv-text">Du har inga sparade ord ännu.</span><span class="ar-text">ليس لديك كلمات محفوظة حتى الآن.</span></p>
                <p class="sub-text"><span class="sv-text">Klicka på stjärnan för att spara ord.</span><span class="ar-text">اضغط على النجمة لحفظ الكلمات.</span></p>
            </div>`:t.innerHTML=v.map(s=>{const e=g.find(n=>n.swe===s);return`
                <div class="cognate-card saved-card">
                    <div class="card-left">
                        <strong>${s}</strong>
                        <span class="card-type">${(e==null?void 0:e.type)||""}</span>
                    </div>
                    <div class="card-right">
                        <span class="word-arb">${(e==null?void 0:e.arb)||""}</span>
                        <button class="mini-btn saved active" onclick="toggleSave('${s.replace(/'/g,"\\'")}', true); event.stopPropagation();">⭐</button>
                    </div>
                </div>`}).join(""))}function G(t){var n;const s=v.indexOf(t);s===-1?v.push(t):v.splice(s,1),localStorage.setItem("snabbaLexin_cognates_saved",JSON.stringify(v)),C();const e=document.querySelector(`.btn-star[onclick*="${t}"]`);e&&e.classList.toggle("active",s===-1),(n=document.getElementById("savedView"))!=null&&n.classList.contains("active")&&A()}function D(){const t=document.getElementById("fcFilterChips");if(!t)return;const s=["all",...new Set(g.map(e=>e.category||"Övrigt"))];t.innerHTML=s.map(e=>`
        <button class="fc-chip ${e===h?"active":""}" onclick="filterFlashcards('${e}')" title="${e==="all"?"Alla":e}">
            ${e==="all"?"🌐":L[e]||"📌"}
        </button>
    `).join("")}function gt(t){h=t,D(),J()}function J(){D(),f=[...h==="all"?g:g.filter(s=>s.category===h)].sort(()=>.5-Math.random()),m=0,M=0,K()}function K(){if(m>=f.length){vt();return}const t=f[m],s=document.getElementById("fcWord"),e=document.getElementById("fcTranslation"),n=document.getElementById("fcType"),i=document.getElementById("fcCurrent"),u=document.getElementById("fcTotal"),r=document.getElementById("fcProgress"),p=document.getElementById("flashcard");if(s){s.textContent=t.swe;const a=t.swe.length;a>20?s.style.fontSize="1rem":a>15?s.style.fontSize="1.3rem":a>10?s.style.fontSize="1.7rem":s.style.fontSize="2.5rem"}if(e){e.textContent=t.arb;const a=t.arb.length;a>20?e.style.fontSize="1rem":a>15?e.style.fontSize="1.3rem":a>10?e.style.fontSize="1.7rem":e.style.fontSize="2.2rem"}n&&(n.textContent=t.type||t.category),i&&(i.textContent=(m+1).toString()),u&&(u.textContent=f.length.toString()),r&&(r.style.width=m/f.length*100+"%"),p&&p.classList.remove("flipped")}function U(){const t=document.getElementById("flashcard");t&&(t.classList.toggle("flipped"),E(f[m].swe))}function X(t){t&&(M++,$.includes(f[m].swe)||($.push(f[m].swe),B())),m++,K()}function vt(){q++,B();const t=Math.round(M/f.length*100),s=document.getElementById("flashcardView");s&&(s.innerHTML=`
            <div class="result-container">
                <div class="result-icon">${t>=70?"🎉":"📚"}</div>
                <div class="result-title">${t>=70?'<span class="sv-text">Bra jobbat!</span><span class="ar-text">أحسنت!</span>':'<span class="sv-text">Fortsätt öva!</span><span class="ar-text">واصل التمرين!</span>'}</div>
                <div class="result-score">${M} / ${f.length} <span class="sv-text">ord</span><span class="ar-text">كلمة</span> (${t}%)</div>
                <div class="result-actions">
                    <button class="result-btn primary" onclick="location.reload()">🔄 <span class="sv-text">Igen</span><span class="ar-text">مرة أخرى</span></button>
                    <button class="result-btn secondary" onclick="switchMode('browse')">← <span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
                </div>
            </div>`)}function Y(){w("quiz")}function mt(){let t=h==="all"?g:g.filter(e=>e.category===h);if(t.length<4){const e=document.getElementById("quizContent");e&&(e.innerHTML=`
                <div class="quiz-message">
                    <p>⚠️ <span class="sv-text">Inte tillräckligt med ord!</span><span class="ar-text">توجد كلمات غير كافية!</span></p>
                </div>`);return}o={questions:[...t].sort(()=>.5-Math.random()).slice(0,10),index:0,score:0,pool:t},x="normal",H()}function Z(){w("browse"),o=null}function tt(t){if(x=t,o){o.index=0,o.score=0;const s=[...o.pool].sort(()=>.5-Math.random());o.questions=s.slice(0,10)}H()}function H(){if(!o)return;const t=o.questions[o.index],s=o.questions.length,n=o.pool.filter(a=>a.swe!==t.swe).sort(()=>.5-Math.random()).slice(0,3),i={normal:"🇸🇪→🇸🇦",reverse:"🇸🇦→🇸🇪",audio:"🔊",write:"✍️"};let r=`
        ${`
        <div class="quiz-type-selector">
            ${["normal","reverse","audio","write"].map(a=>`
                <button class="type-chip ${a===x?"active":""}" 
                        onclick="setQuizType('${a}')" title="${a==="normal"?"Svenska → Arabiska":a==="reverse"?"Arabiska → Svenska":a==="audio"?"Lyssna":"Skriv"}">
                    ${i[a]}
                </button>
            `).join("")}
        </div>`}
        <div class="quiz-header">
            <div class="quiz-progress-text">
                <span>Fråga ${o.index+1} / ${s}</span>
                <span>${Math.round(o.index/s*100)}%</span>
            </div>
            <div class="quiz-progress-bar">
                <div class="fill" style="width: ${o.index/s*100}%"></div>
            </div>
        </div>
        `;if(x==="normal"){const a=[t.arb,...n.map(l=>l.arb)].sort(()=>.5-Math.random());r+=`
            <div class="quiz-question">
                <div class="question-word">${t.swe}</div>
                <div class="question-hint"><span class="sv-text">Välj rätt arabisk översättning</span><span class="ar-text">اختر الترجمة الصحيحة</span></div>
            </div>
            <div class="options-grid" id="optionsGrid">
                ${a.map(l=>`<button class="option-btn arb" data-correct="${l===t.arb}"
                    onclick="checkAnswer(this, ${l===t.arb})">${l}</button>`).join("")}
            </div>`}else if(x==="reverse"){const a=[t.swe,...n.map(l=>l.swe)].sort(()=>.5-Math.random());r+=`
            <div class="quiz-question">
                <div class="question-word arabic-font" style="font-family:'Tajawal'">${t.arb}</div>
                <div class="question-hint"><span class="sv-text">Välj rätt svenskt ord</span><span class="ar-text">اختر الكلمة السويدية</span></div>
            </div>
            <div class="options-grid" id="optionsGrid">
                ${a.map(l=>`<button class="option-btn" data-correct="${l===t.swe}"
                    onclick="checkAnswer(this, ${l===t.swe})">${l}</button>`).join("")}
            </div>`}else if(x==="audio"){const a=[t.arb,...n.map(l=>l.arb)].sort(()=>.5-Math.random());r+=`
            <div class="quiz-question">
                <div class="question-word">
                    <button class="action-btn" style="width:auto; height:80px; width:80px; border-radius:50%; font-size:2rem;" onclick="playTTS('${t.swe.replace(/'/g,"\\'")}')">🔊</button>
                </div>
                <div class="question-hint"><span class="sv-text">Vad hörde du?</span><span class="ar-text">ماذا سمعت؟</span></div>
            </div>
            <div class="options-grid" id="optionsGrid">
                ${a.map(l=>`<button class="option-btn arb" data-correct="${l===t.arb}"
                    onclick="checkAnswer(this, ${l===t.arb})">${l}</button>`).join("")}
            </div>`,setTimeout(()=>E(t.swe),500)}else x==="write"&&(r+=`
            <div class="quiz-question">
                <div class="question-word">${t.swe}</div>
                <div class="question-hint"><span class="sv-text">Skriv den arabiska översättningen</span><span class="ar-text">اكتب الترجمة العربية</span></div>
            </div>
            <input type="text" class="writing-input" id="writeAnswer" placeholder="اكتب هنا..." dir="rtl">
            <button class="submit-btn" onclick="checkWrittenAnswer('${t.arb.replace(/'/g,"\\'")}')"><span class="sv-text">Kontrollera</span><span class="ar-text">تحقق</span></button>`);r+='<div class="feedback" id="feedback"></div>';const p=document.getElementById("quizContent");p&&(p.innerHTML=r,p.querySelectorAll(".question-text, .option-btn, .writing-input").forEach(a=>{Q.apply(a,a.textContent||a.value||"")}))}function et(t,s){document.querySelectorAll(".option-btn").forEach(n=>{n.disabled=!0,n.getAttribute("data-correct")==="true"?n.classList.add("correct"):n===t&&!s&&n.classList.add("wrong")}),st(s)}function wt(t){const s=document.getElementById("writeAnswer"),e=s.value.trim(),n=e===t||e.includes(t)||t.includes(e);s.disabled=!0;const i=document.querySelector(".submit-btn");i&&(i.disabled=!0),st(n,t)}function st(t,s=null){if(!o)return;const e=document.getElementById("feedback");e&&(e.classList.add("show"),t?(o.score++,e.className="feedback show correct",e.innerHTML='✅ <span class="sv-text">Rätt!</span><span class="ar-text">صحيح!</span>'):(e.className="feedback show wrong",e.innerHTML=`❌ <span class="sv-text">Fel!</span><span class="ar-text">خطأ!</span> ${s?'<span class="sv-text">Rätt:</span><span class="ar-text">الصحيح:</span> '+s:""}`),setTimeout(()=>{o&&(o.index++,o.index<o.questions.length?H():ht())},1500))}function ht(){if(!o)return;const t=o.score,s=o.questions.length,e=Math.round(t/s*100),n=e>=60;n&&q++,B();const i=document.getElementById("quizContent");i&&(i.innerHTML=`
            <div class="result-container">
                <div class="result-icon">${n?"🎉":"😕"}</div>
                <div class="result-title">${n?'<span class="sv-text">Grattis!</span><span class="ar-text">مبروك!</span>':'<span class="sv-text">Försök igen</span><span class="ar-text">حاول مرة أخرى</span>'}</div>
                <div class="result-score">${t} / ${s} <span class="sv-text">rätt</span><span class="ar-text">صحيح</span> (${e}%)</div>
                <div class="result-actions">
                    <button class="result-btn primary" onclick="startQuiz()">🔄 <span class="sv-text">Gör om</span><span class="ar-text">أعد</span></button>
                    <button class="result-btn secondary" onclick="closeQuiz()">← <span class="sv-text">Tillbaka</span><span class="ar-text">رجوع</span></button>
                </div>
            </div>`)}window.switchMode=w;window.toggleFilters=N;window.toggleMobileView=O;window.playTTS=E;window.toggleSave=G;window.startQuiz=Y;window.closeQuiz=Z;window.flipCard=U;window.flashcardAnswer=X;window.filterFlashcards=gt;window.checkAnswer=et;window.setQuizType=tt;window.renderSavedWords=A;document.addEventListener("DOMContentLoaded",()=>{ct();const s=new URLSearchParams(window.location.search).get("mode");setTimeout(()=>{s==="quiz"?w("quiz"):s==="flashcard"?w("flashcard"):s==="saved"&&w("saved")},100)});
