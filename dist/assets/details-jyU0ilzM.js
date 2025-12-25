var k=Object.defineProperty;var L=(r,t,e)=>t in r?k(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var y=(r,t,e)=>L(r,typeof t!="symbol"?t+"":t,e);import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              */import{D as b}from"./db-TWgxRddZ.js";import"./loader-CKTsN5EW.js";import{ThemeManager as T,CategoryHelper as F,GrammarHelper as A,TextSizeManager as u,showToast as B}from"./utils-B-9iATqE.js";import{T as D}from"./tts-kfGpRYBQ.js";import{Q as C,F as g}from"./quiz-stats-txqAuu3g.js";import"./pwa-Bxh5GLjF.js";class H{constructor(){y(this,"wordId",null);y(this,"wordData",null);this.init()}async init(){const t=new URLSearchParams(window.location.search);if(this.wordId=t.get("id"),console.log("[Details] Word ID from URL:",this.wordId),!this.wordId){window.location.href="index.html";return}this.setupGeneralListeners(),window.dictionaryData?this.handleDataReady():window.addEventListener("dictionaryLoaded",()=>this.handleDataReady())}setupGeneralListeners(){const t=document.getElementById("themeToggleBtn");t&&t.addEventListener("click",()=>T.toggle())}async handleDataReady(){const t=window.dictionaryData;if(console.log("[Details] Data ready. Word ID:",this.wordId,"Data exists:",!!t,"Count:",t==null?void 0:t.length),!!t)if(this.wordData=t.find(e=>e[0].toString()===this.wordId)||null,console.log("[Details] Word search result:",!!this.wordData),this.wordData||(this.wordData=await b.getWordById(this.wordId)),this.wordData)C.recordStudy(this.wordId),this.renderDetails();else{const e=document.getElementById("detailsArea");e&&(e.innerHTML='<div class="placeholder-message">Ordet hittades inte / لم يتم العثور على الكلمة</div>')}}renderDetails(){const t=this.wordData,e=t[0].toString(),a=t[1],i=t[2],s=t[3],o=t[4]||"",n=t[5]||"",d=t[6]||"",c=t[7]||"",l=t[8]||"",h=t[9]||"",p=t[10]||"",w=F.getCategory(a,i,d),f=g.has(e);this.setupHeaderActions(t,f);const m=document.getElementById("detailsArea");if(!m)return;const S=A.getBadge(a,d,i);let E=`
            <!-- Hero Section -->
            <div class="details-hero type-${w}">
                <div class="details-hero-content">
                    <div class="word-display-main">
                        <span class="details-subtitle">Svensk-Arabiskt Lexikon</span>
                        <h1 class="word-swe-hero">${i}</h1>
                        <p class="word-arb-hero" dir="rtl">${s}</p>
                        ${o?`<p class="word-arb-ext" dir="rtl">${o}</p>`:""}
                    </div>
                    
                    <div class="word-type-row">
                        <button class="audio-btn-badge" id="heroTTSBtn" title="Lyssna">🔊</button>
                        <span class="word-type-badge">${a}</span>
                        ${S}
                        <button class="favorite-btn-badge ${f?"active":""}" id="heroFavBtn" title="Spara">${f?"❤️":"🤍"}</button>
                    </div>
                </div>
            </div>

            <!-- Content Sections -->
            <div class="details-content-grid">
                <!-- Forms Section -->
                ${d?`
                <div class="details-section">
                    <h3 class="section-title">
                        <span class="section-icon">🔗</span> Böjningar / تصريفات
                    </h3>
                    <div class="forms-container">
                        ${d.split(",").map(v=>`<span class="form-chip">${v.trim()}</span>`).join("")}
                    </div>
                </div>
                `:""}

                <!-- Definition Section -->
                ${n||o?`
                <div class="details-section">
                    <h3 class="section-title">
                        <span class="section-icon">📝</span> Betydelse / المعنى
                    </h3>
                    <div class="definition-card">
                        ${n?`<p class="def-text">${n}</p>`:""}
                        ${o?`<p class="def-text" dir="rtl" style="margin-top: 10px; border-top: 1px solid var(--border); padding-top: 10px;">${o}</p>`:""}
                    </div>
                </div>
                `:""}

                <!-- Examples Section -->
                ${c||l?`
                <div class="details-section">
                    <h3 class="section-title">
                        <span class="section-icon">💡</span> Exempel / أمثلة
                    </h3>
                    <div class="example-card">
                        ${c?`<div class="ex-swe-detail" dir="ltr">${c}</div>`:""}
                        ${l?`<div class="ex-arb-detail" dir="rtl">${l}</div>`:""}
                    </div>
                </div>
                `:""}

                <!-- Idioms Section -->
                ${h||p?`
                <div class="details-section">
                    <h3 class="section-title">
                        <span class="section-icon">💬</span> Uttryck / تعبيرات
                    </h3>
                    <div class="example-card idiom-card">
                        ${h?`<div class="ex-swe-detail" dir="ltr">${h}</div>`:""}
                        ${p?`<div class="ex-arb-detail" dir="rtl">${p}</div>`:""}
                    </div>
                </div>
                `:""}
            </div>
        `;m.innerHTML=E;const x=m.querySelector(".word-swe-hero");x&&u.apply(x,i);const $=m.querySelector(".word-arb-hero");$&&u.apply($,s);const I=m.querySelector(".word-arb-ext");I&&u.apply(I,o),m.querySelectorAll(".def-text, .ex-swe-detail, .ex-arb-detail").forEach(v=>{u.apply(v,v.textContent||"")}),this.setupHeroButtons(t)}setupHeaderActions(t,e){const a=t[2],i=t[0].toString(),s=i.startsWith("local_")||i.length>20,o=document.getElementById("headerAudioBtn");o&&(o.onclick=()=>D.speak(a,"sv"));const n=document.getElementById("headerFavoriteBtn");n&&(g.updateButtonIcon(n,e),n.onclick=()=>this.toggleFavorite(i,n));const d=document.getElementById("headerFlashcardBtn");d&&(d.onclick=()=>{window.location.href=`games/flashcards.html?id=${i}`});const c=document.getElementById("customActions");c&&(c.style.display=s?"flex":"none");const l=document.getElementById("editBtn");l&&(l.onclick=()=>{window.location.href=`add.html?edit=${i}`});const h=document.getElementById("deleteBtn");h&&(h.onclick=async()=>{confirm("Är du säker på att du vill ta bort ordet? / هل أنت متأكد من حذف الكلمة؟")&&(await b.clearCache(),B("Ordet borttaget / تم حذف الكلمة"),setTimeout(()=>window.location.href="index.html",1e3))});const p=document.getElementById("smartCopyBtn");p&&(p.onclick=()=>{navigator.clipboard.writeText(a).then(()=>B("Kopierat / تم النسخ 📋"))});const w=document.getElementById("headerShareBtn");w&&(w.onclick=()=>{navigator.share?navigator.share({title:`Lexin: ${a}`,text:`Hur man säger "${a}" på arabiska: ${t[3]}`,url:window.location.href}).catch(console.error):navigator.clipboard.writeText(window.location.href).then(()=>B("Länk kopierad / تم نسخ الرابط 🔗"))})}setupHeroButtons(t){const e=document.getElementById("heroTTSBtn");e&&(e.onclick=()=>D.speak(t[2],"sv"));const a=document.getElementById("heroFavBtn");a&&(a.onclick=()=>this.toggleFavorite(t[0].toString(),a,!0))}toggleFavorite(t,e,a=!1){const i=g.toggle(t);a?(e.textContent=i?"❤️":"🤍",e.classList.toggle("active",i)):g.updateButtonIcon(e,i);const s=a?document.getElementById("headerFavoriteBtn"):document.getElementById("heroFavBtn");s&&(a?g.updateButtonIcon(s,i):(s.textContent=i?"❤️":"🤍",s.classList.toggle("active",i)))}}typeof window<"u"&&(window.detailsManager=new H);
