var j=Object.defineProperty;var W=(o,t,e)=>t in o?j(o,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):o[t]=e;var m=(o,t,e)=>W(o,typeof t!="symbol"?t+"":t,e);import"./modulepreload-polyfill-B5Qt9EMX.js";import{T as M}from"./type-color-system-MHZQElil.js";import{Loader as Q}from"./loader-dpivfNje.js";import{showToast as B,TextSizeManager as E,ThemeManager as _,normalizeArabic as T,VoiceSearchManager as P}from"./utils-CfsGp8IC.js";import{T as q}from"./tts-CfZZetlp.js";import{Q as f,F as L}from"./quiz-stats-BL77K9JB.js";import{A as G}from"./config-C2usAgi3.js";import{L as A,t as z}from"./i18n-BpwFYk4h.js";import"./pwa-Bn3RWWLO.js";import"./db-CDJvXXn2.js";import"./toast-manager-B6dAfcdf.js";const I=[{id:"first_quiz",title:"Första testet",titleAr:"الاختبار الأول",description:"Avsluta ditt första quiz",icon:"🎯",condition:()=>f.getStats().totalQuizzes>=1},{id:"streak_5",title:"5 i rad",titleAr:"5 متتالية",description:"Få 5 rätt svar i rad",icon:"🔥",condition:()=>f.getStats().bestStreak>=5},{id:"streak_10",title:"10 i rad",titleAr:"10 متتالية",description:"Få 10 rätt svar i rad",icon:"⚡",condition:()=>f.getStats().bestStreak>=10},{id:"correct_50",title:"50 rätt",titleAr:"50 صحيح",description:"Svara rätt på 50 frågor totalt",icon:"📚",condition:()=>f.getStats().totalCorrect>=50},{id:"correct_100",title:"100 rätt",titleAr:"100 صحيح",description:"Svara rätt på 100 frågor totalt",icon:"🏆",condition:()=>f.getStats().totalCorrect>=100},{id:"correct_500",title:"Ordmästare",titleAr:"سيد الكلمات",description:"Svara rätt på 500 frågor totalt",icon:"👑",condition:()=>f.getStats().totalCorrect>=500},{id:"speed_demon",title:"Snabbtänkt",titleAr:"سريع البديهة",description:"Svara på under 2 sekunder",icon:"⏱️",condition:()=>f.getStats().fastestResponse<2e3},{id:"perfect_10",title:"Perfekt 10",titleAr:"عشرة مثالية",description:"Få 10/10 i ett quiz",icon:"💯",condition:()=>!1},{id:"accuracy_90",title:"Träffsäker",titleAr:"دقة عالية",description:"Uppnå 90% noggrannhet (minst 50 svar)",icon:"🎯",condition:()=>{const o=f.getStats();return o.totalCorrect+o.totalWrong>=50&&f.getAccuracy()>=90}},{id:"quiz_10",title:"Flitig övare",titleAr:"متدرب مجتهد",description:"Avsluta 10 quiz",icon:"📝",condition:()=>f.getStats().totalQuizzes>=10}];class N{constructor(){m(this,"STORAGE_KEY","achievements");m(this,"unlocked");this.unlocked=this.load()}load(){const t=localStorage.getItem(this.STORAGE_KEY);return t?new Set(JSON.parse(t)):new Set}save(){localStorage.setItem(this.STORAGE_KEY,JSON.stringify(Array.from(this.unlocked)))}check(){const t=[];for(const e of I)!this.unlocked.has(e.id)&&e.condition()&&(this.unlock(e),t.push(e));return t}unlock(t){this.unlocked.has(t.id)||(this.unlocked.add(t.id),this.save(),B(`${t.icon} ${t.title} - ${t.titleAr}`),this.playCelebration())}unlockById(t){const e=I.find(s=>s.id===t);e&&this.unlock(e)}playCelebration(){}getUnlocked(){return I.filter(t=>this.unlocked.has(t.id))}getLocked(){return I.filter(t=>!this.unlocked.has(t.id))}getProgress(){return{unlocked:this.unlocked.size,total:I.length,percent:Math.round(this.unlocked.size/I.length*100)}}getAll(){return I}}const H=new N;typeof window<"u"&&(window.Achievements=H);const R={hund:"🐶",katt:"🐱",mus:"🐭",hamster:"🐹",kanin:"🐰",björn:"🐻",panda:"🐼",tiger:"🐯",lejon:"🦁",ko:"🐮",gris:"🐷",groda:"🐸",apa:"🐵",kyckling:"🐔",pingvin:"🐧",fågel:"🐦",anka:"🦆",örn:"🦅",uggla:"🦉",varg:"🐺",häst:"🐴",enhörning:"🦄",bi:"🐝",mask:"🐛",fjäril:"🦋",snigel:"🐌",spindel:"🕷",sköldpadda:"🐢",orm:"🐍",ödla:"🦎",fisk:"🐟",delfin:"🐬",val:"🐋",haj:"🦈",bläckfisk:"🐙",krabba:"🦀",kamel:"🐫",elefant:"🐘",noshörning:"🦏",gorilla:"🦍",giraff:"🦒",krokodil:"🐊",zebra:"🦓",äpple:"🍎",päron:"🍐",apelsin:"🍊",citron:"🍋",banan:"🍌",vattenmelon:"🍉",vindruvor:"🍇",jordgubbe:"🍓",körsbär:"🍒",persika:"🍑",ananas:"🍍",kokosnöt:"🥥",kiwi:"🥝",tomat:"🍅",potatis:"🥔",morot:"🥕",majs:"🌽",lök:"🧅",vitlök:"🧄",gurka:"🥒",bröd:"🍞",croissant:"🥐",pannkaka:"🥞",ost:"🧀",kött:"🥩",bacon:"🥓",hamburgare:"🍔","pommes frites":"🍟",pizza:"🍕",korv:"🌭",tacos:"🌮",burrito:"🌯",ägg:"🥚",popcorn:"🍿",ris:"🍚",spaghetti:"🍝",sushi:"🍣",glass:"🍦",munk:"🍩",kaka:"🍪",tårta:"🎂",choklad:"🍫",godis:"🍬",klubba:"🍭",mjölk:"🥛",kaffe:"☕",te:"🍵",öl:"🍺",vin:"🍷",bil:"🚗",taxi:"🚕",buss:"🚌",tåg:"🚆",brandbil:"🚒",polisbil:"🚓",ambulans:"🚑",cykel:"🚲",motorcykel:"🏍",traktor:"🚜",flygplan:"✈️",helikopter:"🚁",båt:"⛵",raket:"🚀",klocka:"⌚",mobil:"📱",dator:"💻",tangentbord:"⌨️",kamera:"📷",video:"📹",teve:"📺",radio:"📻",bok:"📖",penna:"✏️",sax:"✂️",nyckel:"🔑",hammare:"🔨",yxa:"🪓",svärd:"⚔️",pistol:"🔫",sköld:"🛡",paraply:"☂️",glasögon:"👓",väska:"👜",sko:"👞",klänning:"👗",byxor:"👖",tröja:"👕",sol:"☀️",måne:"🌙",stjärna:"⭐",moln:"☁️",regn:"🌧",snö:"❄️",eld:"🔥",vatten:"💧",träd:"🌳",blomma:"🌸",ros:"🌹",kaktus:"🌵",fotboll:"⚽",baseboll:"⚾",basket:"🏀",tennis:"🎾",golf:"⛳",medalj:"🥇",pokal:"🏆",leende:"😄",hjärta:"❤️",spöke:"👻",utomjording:"👽",robot:"🤖",skelett:"💀"};class U{constructor(){m(this,"data",[]);m(this,"questions",[]);m(this,"currentIndex",0);m(this,"score",0);m(this,"isAnswered",!1);m(this,"container",null);m(this,"currentWord",null);m(this,"mode","normal");m(this,"questionCount",10);m(this,"timerSeconds",10);m(this,"timerInterval",null);m(this,"timeLeft",0);this.container=document.getElementById("quizInlineContainer"),this.init()}init(){const t=document.getElementById("quickQuizBtn"),e=document.getElementById("quizBtn"),s=document.getElementById("closeQuiz"),n=document.getElementById("nextQuestion"),i=document.getElementById("restartQuiz"),a=document.getElementById("quizModeSelect");t&&(t.onclick=()=>this.start()),e&&(e.onclick=()=>this.start()),s&&(s.onclick=()=>this.hide()),n&&(n.onclick=()=>this.next()),i&&(i.onclick=()=>this.start()),a&&(a.onchange=()=>{this.mode=a.value,console.log("[Quiz] Mode changed to:",this.mode),this.container&&!this.container.classList.contains("hidden")&&this.start()},this.mode=a.value);const c=document.getElementById("quizFavBtn");c&&(c.onclick=()=>this.toggleCurrentFavorite(c)),document.addEventListener("keydown",r=>this.handleKeyboard(r)),window.addEventListener("dictionaryLoaded",()=>{this.data=window.dictionaryData||[]}),window.dictionaryData&&(this.data=window.dictionaryData)}handleKeyboard(t){if(!(!this.container||this.container.classList.contains("hidden"))){if(t.key>="1"&&t.key<="4"){const e=parseInt(t.key)-1,s=document.querySelectorAll(".quiz-option");s[e]&&s[e].click()}(t.key==="Enter"||t.key===" ")&&(t.preventDefault(),this.isAnswered&&this.next())}}start(t){if(t&&(this.mode=t),!this.data||this.data.length<5){B("Laddar ordbok... / جاري تحميل القاموس ⏳");return}if(this.questions=this.getQuestions(),this.questions.length===0){B("Inga ord tillgängliga för detta läge / لا توجد كلمات متاحة");return}this.currentIndex=0,this.score=0,this.isAnswered=!1,f.resetSession(),this.container&&(this.container.classList.remove("hidden"),this.container.scrollIntoView({behavior:"smooth",block:"center"}));const e=document.getElementById("quizEndScreen");e&&e.classList.add("hidden");const s=document.querySelector(".quiz-body");s&&Array.from(s.children).forEach(n=>{n.id!=="quizEndScreen"&&(n.style.display="block")}),this.updateProgressBar(),this.showQuestion(),this.updateScore()}hide(){this.stopTimer(),f.endSession(),this.container&&this.container.classList.add("hidden")}getQuestions(){let t=[];switch(this.mode){case"favorites":const s=L.getAll();t=this.data.filter(i=>s.includes(i[0].toString()));break;case"weak":const n=f.getWeakWords(20);t=this.data.filter(i=>n.includes(i[0].toString())),t.length<5&&(t=this.data);break;case"picture":t=this.data.filter(i=>{const a=(i[2]||"").toLowerCase().trim();return R.hasOwnProperty(a)});break;case"sentence":t=this.data.filter(i=>{const a=(i[2]||"").toLowerCase().trim(),c=(i[7]||"").toLowerCase();return c.length>5&&c.includes(a)});break;default:t=this.data}const e=[...t].sort(()=>.5-Math.random());return e.slice(0,Math.min(this.questionCount,e.length))}showQuestion(){const t=this.questions[this.currentIndex];this.currentWord=t;const e=t[2],s=t[3];let n="",i="",a="arb",c=!1;if(this.mode==="reverse")n=s,i=e,a="swe";else if(this.mode==="listening")n="🔊 Lyssna och välj rätt ord",i=s,q.speak(e,"sv");else if(this.mode==="picture"){const w=(e||"").toLowerCase().trim();n=R[w]||"❓",i=e,a="swe",c=!0}else if(this.mode==="sentence"){const w=(e||"").toLowerCase().trim(),S=t[7]||"",p=new RegExp(w,"gi");n=S.replace(p,"_______"),i=e,a="swe"}else n=e,i=s;const r=document.getElementById("quizQuestion");r&&(r.textContent=n,c?(r.style.fontSize="4.5rem",r.dir="ltr"):this.mode==="sentence"?(r.style.fontSize="1.4rem",r.style.direction="ltr"):(r.style.fontSize="",r.dir=this.mode==="reverse"?"rtl":"ltr",E.apply(r,n)));const u=document.getElementById("quizExample");if(u)if(this.mode==="listening")u.textContent="";else if(this.mode==="picture")u.textContent="Vilket ord är detta? / ما هذه الكلمة؟",E.apply(u,u.textContent);else if(this.mode==="sentence")u.textContent="Vilket ord saknas? / أي كلمة مفقودة؟";else{const w=t[7]||"";u.textContent=w,E.apply(u,w)}const l=document.getElementById("quizHelp");l&&(this.mode==="normal"?l.classList.remove("hidden"):l.classList.add("hidden"));const g=document.getElementById("quizOptions");if(g){console.log("[Quiz] Found optionsEl, clearing content"),g.innerHTML="";const w=this.generateOptions(t,a);console.log("[Quiz] Generated options:",w),w.length===0&&console.error("[Quiz] Options array is EMPTY!"),w.forEach((S,p)=>{console.log("[Quiz] Creating button for:",S);const d=document.createElement("button");d.className="quiz-option",d.textContent=S,d.dir=a==="arb"?"rtl":"ltr",E.apply(d,S),d.setAttribute("data-key",(p+1).toString()),d.onclick=()=>this.handleAnswer(S,i,d),g.appendChild(d)}),console.log("[Quiz] Appended buttons. Children count:",g.children.length)}else console.error("[Quiz] optionsEl NOT FOUND!");const h=document.getElementById("quizFeedback");h&&(h.textContent="",h.className="quiz-feedback");const v=document.getElementById("nextQuestion");v&&(v.disabled=!0),this.isAnswered=!1,this.mode==="timed"&&this.startTimer(),f.startQuestion(),this.mode==="normal"&&q.speak(e,"sv"),this.updateProgressBar()}generateOptions(t,e){const s=e==="arb"?t[3]:t[2],n=t[1],i=[],a=this.data.filter(u=>u[1]===n&&u[0]!==t[0]),r=[...a.length>=3?a:this.data].sort(()=>.5-Math.random());for(const u of r){if(i.length>=3)break;const l=e==="arb"?u[3]:u[2];l!==s&&!i.includes(l)&&i.push(l)}return[s,...i].sort(()=>.5-Math.random())}handleAnswer(t,e,s){if(this.isAnswered)return;this.isAnswered=!0,this.stopTimer();const n=t===e,i=this.currentWord[0].toString(),a=f.recordAnswer(i,n),c=window.app;if(c&&(typeof c.updateDailyChallenge=="function"&&c.updateDailyChallenge(),typeof c.updateDailyProgressBar=="function"&&c.updateDailyProgressBar()),n){this.score++,s.classList.add("correct");const u=f.formatTime(a);this.showFeedback(`Rätt! ${u} / صحيح ✅`,!0)}else s.classList.add("wrong"),this.showFeedback(`Fel! Rätt: ${e} / خطأ ❌`,!1),document.querySelectorAll(".quiz-option").forEach(u=>{u.textContent===e&&u.classList.add("correct")});this.updateScore();const r=document.getElementById("nextQuestion");r&&(r.disabled=!1),this.mode==="reverse"||this.mode==="picture"||this.mode==="sentence"?q.speak(e,"sv"):q.speak(e,"ar")}startTimer(){this.timeLeft=this.timerSeconds,this.updateTimerDisplay(),this.timerInterval=window.setInterval(()=>{this.timeLeft--,this.updateTimerDisplay(),this.timeLeft<=0&&(this.stopTimer(),this.timeOut())},1e3)}stopTimer(){this.timerInterval&&(clearInterval(this.timerInterval),this.timerInterval=null)}updateTimerDisplay(){const t=document.getElementById("quizTimer");t&&(t.textContent=this.timeLeft.toString(),t.classList.toggle("warning",this.timeLeft<=3))}timeOut(){if(this.isAnswered)return;this.isAnswered=!0;const t=this.currentWord[0].toString();f.recordAnswer(t,!1),this.showFeedback("Tiden är slut! / انتهى الوقت ⏱️",!1);const e=this.mode==="reverse"||this.mode==="picture"||this.mode==="sentence"?this.currentWord[2]:this.currentWord[3];document.querySelectorAll(".quiz-option").forEach(n=>{n.textContent===e&&n.classList.add("correct")}),this.updateScore();const s=document.getElementById("nextQuestion");s&&(s.disabled=!1)}showFeedback(t,e){const s=document.getElementById("quizFeedback");s&&(s.textContent=t,s.className=`quiz-feedback ${e?"correct":"wrong"}`)}updateScore(){const t=document.getElementById("quizScore");t&&(t.textContent=this.score.toString())}updateProgressBar(){const t=document.getElementById("quizProgress");if(t){const s=this.currentIndex/this.questions.length*100;t.style.width=`${s}%`}const e=document.getElementById("quizProgressText");e&&(e.textContent=`${this.currentIndex+1}/${this.questions.length}`)}toggleCurrentFavorite(t){if(!this.currentWord)return;const e=this.currentWord[0].toString(),s=L.toggle(e);t.classList.toggle("active",s);const n=t.querySelector("svg");n&&(s?(n.setAttribute("fill","#ef4444"),n.setAttribute("stroke","#ef4444")):(n.setAttribute("fill","none"),n.setAttribute("stroke","currentColor")))}next(){this.currentIndex++,this.currentIndex<this.questions.length?this.showQuestion():this.end()}end(){this.stopTimer(),f.endSession();const t=f.getSessionStats(),e=f.getTodayStats(),s=document.getElementById("quizEndScreen");if(s){s.classList.remove("hidden");const i=document.getElementById("endScoreValue");i&&(i.textContent=this.score.toString());const a=document.getElementById("endMessage");a&&(this.score===this.questions.length?(a.innerHTML=`🎉 Perfekt! Bästa serien: ${t.bestStreak}`,this.showConfetti(),H.unlockById("perfect_10")):this.score>=this.questions.length*.8?a.innerHTML=`Fantastiskt! Tid: ${f.formatTime(t.avgTime)}`:this.score>=this.questions.length*.5?a.textContent="Bra jobbat! / جيد جداً 👍":a.textContent="Fortsätt öva! / استمر في التدريب 💪",E.apply(a,a.textContent||"",2));const c=document.getElementById("endStats");c&&(c.innerHTML=`
                    <div class="end-stat"><span>📅 Idag:</span> ${e.correct}/${e.total}</div>
                    <div class="end-stat"><span>🔥 Bästa serien:</span> ${t.bestStreak}</div>
                    <div class="end-stat"><span>⏱️ Snitttid:</span> ${f.formatTime(t.avgTime)}</div>
                `)}const n=document.querySelector(".quiz-body");n&&Array.from(n.children).forEach(i=>{i.id!=="quizEndScreen"&&(i.style.display="none")})}showConfetti(){const t=this.container;if(t)for(let e=0;e<50;e++){const s=document.createElement("div");s.className="confetti",s.style.left=Math.random()*100+"%",s.style.animationDelay=Math.random()*2+"s",s.style.backgroundColor=["#10B981","#1e3a8a","#F59E0B","#EF4444","#3b82f6"][Math.floor(Math.random()*5)],t.appendChild(s),setTimeout(()=>s.remove(),3e3)}}}typeof window<"u"&&(window.QuizManager=new U);class K{constructor(){m(this,"canvas",null);m(this,"ctx",null);m(this,"particles",[]);m(this,"animationId",null);m(this,"isActive",!1);m(this,"colors",["#FFD700","#FF6B6B","#4ECDC4","#45B7D1","#96CEB4","#FFEAA7","#DDA0DD","#98D8C8","#F7DC6F","#BB8FCE"]);m(this,"animate",()=>{!this.ctx||!this.canvas||(this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.particles=this.particles.filter(t=>(t.x+=t.velocityX,t.y+=t.velocityY,t.velocityY+=.5,t.rotation+=t.rotationSpeed,t.opacity-=.005,t.velocityX*=.99,t.opacity>0?(this.ctx.save(),this.ctx.translate(t.x,t.y),this.ctx.rotate(t.rotation*Math.PI/180),this.ctx.globalAlpha=t.opacity,this.ctx.fillStyle=t.color,this.ctx.fillRect(-t.size/2,-t.size/4,t.size,t.size/2),this.ctx.restore(),!0):!1)),this.particles.length>0?this.animationId=requestAnimationFrame(this.animate):(this.isActive=!1,this.animationId&&cancelAnimationFrame(this.animationId)))})}init(){this.canvas||(this.canvas=document.createElement("canvas"),this.canvas.id="confetti-canvas",this.canvas.style.cssText=`
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 99999;
        `,document.body.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d"),this.resize(),window.addEventListener("resize",()=>this.resize()))}resize(){this.canvas&&(this.canvas.width=window.innerWidth,this.canvas.height=window.innerHeight)}createParticle(t,e){return{x:t,y:e,size:Math.random()*10+5,color:this.colors[Math.floor(Math.random()*this.colors.length)],velocityX:(Math.random()-.5)*15,velocityY:Math.random()*-15-10,rotation:Math.random()*360,rotationSpeed:(Math.random()-.5)*10,opacity:1}}burst(t,e,s=50){this.init();const n=t??window.innerWidth/2,i=e??window.innerHeight/3;for(let a=0;a<s;a++)this.particles.push(this.createParticle(n,i));this.isActive||(this.isActive=!0,this.animate())}rain(t=3e3){this.init();const e=setInterval(()=>{for(let s=0;s<5;s++){const n=this.createParticle(Math.random()*window.innerWidth,-20);n.velocityY=Math.random()*3+2,n.velocityX=(Math.random()-.5)*2,this.particles.push(n)}},50);setTimeout(()=>clearInterval(e),t),this.isActive||(this.isActive=!0,this.animate())}celebrate(){this.burst(window.innerWidth/2,window.innerHeight/2,100),setTimeout(()=>{this.burst(window.innerWidth*.25,window.innerHeight/2,50),this.burst(window.innerWidth*.75,window.innerHeight/2,50)},200)}stop(){this.particles=[],this.isActive=!1,this.animationId&&cancelAnimationFrame(this.animationId),this.ctx&&this.canvas&&this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height)}}const Y=new K;typeof window<"u"&&(window.Confetti=Y);class C{static add(t){const e=t.trim();if(!e)return;const n=this.get().filter(a=>a.toLowerCase()!==e.toLowerCase());n.unshift(e);const i=n.slice(0,this.MAX_ITEMS);localStorage.setItem(this.STORAGE_KEY,JSON.stringify(i))}static get(){try{const t=localStorage.getItem(this.STORAGE_KEY);return t?JSON.parse(t):[]}catch(t){return console.error("Failed to load search history",t),[]}}static clear(){localStorage.removeItem(this.STORAGE_KEY)}}m(C,"MAX_ITEMS",10),m(C,"STORAGE_KEY",G.STORAGE_KEYS.SEARCH_HISTORY||"searchHistory");class X{static generateSections(){return[this.getGeneralSection(),this.getAppearanceSection(),this.getSoundSection(),this.getLearningSection(),this.getNavigationSection(),this.getDataSection(),this.getAboutSection()].join("")}static getGeneralSection(){return`
            <section class="settings-section glass-card expanded" data-section="general">
                <div class="section-header" onclick="toggleSection('general')">
                    <div class="section-icon gradient-amber">🌍</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Allmänt</span><span class="ar-text">عام</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="general-content">
                    <div class="section-inner">
                    <div class="language-selection-container">
                        <h4 class="settings-subtitle"><span class="sv-text">Välj Språk</span><span class="ar-text">اختر اللغة</span></h4>
                        <div class="language-grid-premium" id="languageSelector">
                            <button class="lang-card-premium" data-lang="sv">
                                <span class="lang-flag-large">🇸🇪</span>
                                <span class="lang-name-large">Svenska</span>
                                <span class="lang-check">✓</span>
                            </button>
                            <button class="lang-card-premium" data-lang="ar">
                                <span class="lang-flag-large">🇸🇦</span>
                                <span class="lang-name-large">العربية</span>
                                <span class="lang-check">✓</span>
                            </button>
                            <button class="lang-card-premium" data-lang="both">
                                <span class="lang-flag-large">🌍</span>
                                <span class="lang-name-large"><span class="sv-text">Båda</span><span class="ar-text">كلتا</span></span>
                                <span class="lang-check">✓</span>
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            </section>`}static getAppearanceSection(){return`
            <section class="settings-section glass-card" data-section="appearance">
                <div class="section-header" onclick="toggleSection('appearance')">
                    <div class="section-icon gradient-blue">🎨</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Utseende</span><span class="ar-text">المظهر</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="appearance-content">
                    <div class="section-inner">
                    <!-- Dark Mode Toggle -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🌙</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Mörkt läge</span><span class="ar-text">الوضع الداكن</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="darkModeToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Mobile View Toggle -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">📱</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Mobilvy</span><span class="ar-text">عرض الجوال</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="mobileViewToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Color Theme -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🎨</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Färgtema</span><span class="ar-text">لون الثيم</span></span>
                            </div>
                        </div>
                        <div class="color-themes" id="colorThemes">
                            <button class="color-btn active" data-theme="default" style="background: linear-gradient(135deg, #3b82f6, #60a5fa)" title="Standard"></button>
                            <button class="color-btn" data-theme="ocean" style="background: linear-gradient(135deg, #0ea5e9, #0284c7)" title="Ocean"></button>
                            <button class="color-btn" data-theme="sunset" style="background: linear-gradient(135deg, #f97316, #ea580c)" title="Sunset"></button>
                            <button class="color-btn" data-theme="forest" style="background: linear-gradient(135deg, #22c55e, #16a34a)" title="Forest"></button>
                            <button class="color-btn" data-theme="rose" style="background: linear-gradient(135deg, #ef4444, #b91c1c)" title="Ruby"></button>
                            <button class="color-btn" data-theme="neon" style="background: linear-gradient(135deg, #0ea5e9, #22d3ee)" title="Neon"></button>
                        </div>
                    </div>

                    <!-- Font Size -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🔤</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Textstorlek</span><span class="ar-text">حجم الخط</span></span>
                            </div>
                        </div>
                        <div class="font-size-control">
                            <button class="font-btn" data-size="small">A</button>
                            <button class="font-btn active" data-size="medium">A</button>
                            <button class="font-btn" data-size="large">A</button>
                        </div>
                    </div>

                    <!-- Reduce Motion -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">✨</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Animationer</span><span class="ar-text">الحركات</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="animationsToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </section>`}static getSoundSection(){return`
            <section class="settings-section glass-card" data-section="sound">
                <div class="section-header" onclick="toggleSection('sound')">
                    <div class="section-icon gradient-blue">🔔</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Ljud & Notiser</span><span class="ar-text">الصوت والإشعارات</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="sound-content">
                    <div class="section-inner">
                    <!-- Sound Effects -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🔊</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Ljudeffekter</span><span class="ar-text">المؤثرات الصوتية</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="soundEffectsToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- TTS Speed -->
                    <div class="settings-item slider-item">
                        <div class="item-left">
                            <span class="item-icon">🗣️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Uttalshastighet</span><span class="ar-text">سرعة النطق</span></span>
                            </div>
                        </div>
                        <div class="slider-control">
                            <input type="range" id="ttsSpeedSlider" min="50" max="150" value="85">
                            <span class="slider-value" id="ttsSpeedValue">85%</span>
                        </div>
                    </div>
                    
                     <!-- TTS Voice Selection -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🎭</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Rösttyp</span><span class="ar-text">نوع الصوت</span></span>
                            </div>
                        </div>
                        <div class="voice-selector">
                            <button class="voice-btn active" data-voice="natural" title="Naturlig / طبيعي">🌍</button>
                            <button class="voice-btn" data-voice="female" title="Kvinna / أنثى">👩</button>
                            <button class="voice-btn" data-voice="male" title="Man / ذكر">👨</button>
                        </div>
                    </div>


                    <!-- Test TTS -->
                    <div class="settings-item center-item">
                        <button class="test-btn" id="testTTSBtn">
                            <span>🔊</span> <span class="sv-text">Testa uttal</span><span class="ar-text">اختبر النطق</span>
                        </button>
                    </div>

                    <!-- Daily Reminder -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">⏰</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Daglig påminnelse</span><span class="ar-text">تذكير يومي</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="reminderToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Reminder Time -->
                    <div class="settings-item" id="reminderTimeItem" style="display: none;">
                        <div class="item-left">
                            <span class="item-icon">🕐</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Påminnelsetid</span><span class="ar-text">وقت التذكير</span></span>
                            </div>
                        </div>
                        <input type="time" id="reminderTime" value="18:00" class="time-input">
                    </div>
                </div>
            </section>`}static getLearningSection(){return`
            <section class="settings-section glass-card" data-section="learning">
                <div class="section-header" onclick="toggleSection('learning')">
                    <div class="section-icon gradient-green">📚</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Lärverktyg</span><span class="ar-text">أدوات التعلم</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="learning-content">
                    <div class="section-inner">
                    <!-- Daily Goal -->
                    <div class="settings-item slider-item">
                        <div class="item-left">
                            <span class="item-icon">🎯</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Dagligt mål</span><span class="ar-text">الهدف اليومي</span></span>
                            </div>
                        </div>
                        <div class="goal-selector">
                            <button class="goal-btn" data-goal="5">5</button>
                            <button class="goal-btn active" data-goal="10">10</button>
                            <button class="goal-btn" data-goal="20">20</button>
                            <button class="goal-btn" data-goal="50">50</button>
                        </div>
                    </div>

                    <!-- Auto-Play Audio -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">▶️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Auto-spela ljud</span><span class="ar-text">تشغيل الصوت تلقائياً</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="autoPlayToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Show Examples -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">💬</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Visa exempel</span><span class="ar-text">عرض الأمثلة</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="showExamplesToggle" checked>
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Focus Mode -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">🧘</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Fokusläge</span><span class="ar-text">وضع التركيز</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="focusModeToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <!-- Eye Care -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">👁️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Ögonvård</span><span class="ar-text">حماية العين</span></span>
                            </div>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" id="eyeCareToggle">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </section>`}static getNavigationSection(){return`
            <section class="settings-section glass-card" data-section="navigation">
                <div class="section-header" onclick="toggleSection('navigation')">
                    <div class="section-icon gradient-amber">🧭</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Snabbnavigering</span><span class="ar-text">التنقل السريع</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="navigation-content">
                    <div class="section-inner">
                    <div class="quick-links-grid">
                        <a href="games/games.html" class="quick-link-card">
                            <span class="quick-link-icon">🎮</span>
                            <span class="quick-link-label"><span class="sv-text">Spel</span><span class="ar-text">ألعاب</span></span>
                        </a>
                        <a href="learn/learn.html" class="quick-link-card">
                            <span class="quick-link-icon">📖</span>
                            <span class="quick-link-label"><span class="sv-text">Grammatik</span><span class="ar-text">القواعد</span></span>
                        </a>
                        <a href="profile.html" class="quick-link-card">
                            <span class="quick-link-icon">👤</span>
                            <span class="quick-link-label"><span class="sv-text">Min Profil</span><span class="ar-text">ملفي</span></span>
                        </a>
                        <a href="add.html" class="quick-link-card">
                            <span class="quick-link-icon">➕</span>
                            <span class="quick-link-label"><span class="sv-text">Lägg till</span><span class="ar-text">إضافة</span></span>
                        </a>
                    </div>
                </div>
            </section>`}static getDataSection(){return`
            <section class="settings-section glass-card" data-section="data">
                <div class="section-header" onclick="toggleSection('data')">
                    <div class="section-icon gradient-cyan">💾</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Data & Sekretess</span><span class="ar-text">البيانات والخصوصية</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="data-content">
                    <div class="section-inner">
                    <!-- Export Data -->
                    <div class="settings-item clickable" onclick="exportData()">
                        <div class="item-left">
                            <span class="item-icon">📤</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Exportera data</span><span class="ar-text">تصدير البيانات</span></span>
                            </div>
                        </div>
                        <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- Import Data -->
                    <div class="settings-item clickable" onclick="document.getElementById('importFile').click()">
                        <div class="item-left">
                            <span class="item-icon">📥</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Importera data</span><span class="ar-text">استيراد البيانات</span></span>
                            </div>
                        </div>
                        <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                    <input type="file" id="importFile" accept=".json" style="display: none;">

                    <!-- Clear Favorites -->
                    <div class="settings-item clickable danger" onclick="clearFavorites()">
                        <div class="item-left">
                            <span class="item-icon">🗑️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Rensa favoriter</span><span class="ar-text">مسح المفضلة</span></span>
                            </div>
                        </div>
                        <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- Clear All Data -->
                    <div class="settings-item clickable danger" onclick="clearAllData()">
                        <div class="item-left">
                            <span class="item-icon">⚠️</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Rensa all data</span><span class="ar-text">مسح جميع البيانات</span></span>
                            </div>
                        </div>
                        <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>

                    <!-- Storage Info -->
                    <div class="storage-info">
                        <div class="storage-header">
                            <span><span class="sv-text">Använt lagringsutrymme</span><span class="ar-text">المساحة المستخدمة</span></span>
                            <span id="storageUsed">0 KB</span>
                        </div>
                        <div class="storage-bar-bg">
                            <div class="storage-bar-fill" id="storageBar"></div>
                        </div>
                    </div>
                </div>
            </section>`}static getAboutSection(){return`
            <section class="settings-section glass-card" data-section="about">
                <div class="section-header" onclick="toggleSection('about')">
                    <div class="section-icon gradient-rose">ℹ️</div>
                    <div class="section-title-wrapper">
                        <h3 class="section-title"><span class="sv-text">Om SnabbaLexin</span><span class="ar-text">حول التطبيق</span></h3>
                    </div>
                    <svg class="section-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </div>
                <div class="section-content" id="about-content">
                    <div class="section-inner">
                    <!-- Version -->
                    <div class="settings-item">
                        <div class="item-left">
                            <span class="item-icon">📱</span>
                            <div class="item-info">
                                <span class="item-name"><span class="sv-text">Version</span><span class="ar-text">الإصدار</span></span>
                            </div>
                        </div>
                        <span class="version-badge">v3.0.0</span>
                    </div>

                     <!-- Links -->
                     <!-- Links -->
                        <a href="changelog.html" class="settings-item clickable">
                            <div class="item-left">
                                <span class="item-icon">📋</span>
                                <div class="item-info">
                                    <span class="item-name"><span class="sv-text">Ändringslogg</span><span class="ar-text">سجل التغييرات</span></span>
                                </div>
                            </div>
                            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </a>
                        <a href="device.html" class="settings-item clickable">
                            <div class="item-left">
                                <span class="item-icon">🖥️</span>
                                <div class="item-info">
                                    <span class="item-name"><span class="sv-text">Enhetsinformation</span><span class="ar-text">معلومات الجهاز</span></span>
                                </div>
                            </div>
                            <svg class="item-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <polyline points="9 18 15 12 9 6"></polyline>
                            </svg>
                        </a>

                    <!-- Copyright -->
                    <div class="copyright-info">
                        <p>SnabbaLexin © 2025</p>
                        <p><span class="sv-text">Made with ❤️ for language learners</span><span class="ar-text">صنع بحب ❤️ لمتعلمي اللغات</span></p>
                    </div>
                </div>
            </section>`}}let V=!1;async function J(){const o=document.getElementById("settingsBtn"),t=document.getElementById("settingsMenu");if(!o||!t)return;let e="#22c55e";e="#eab308",t.style.border=`2px solid ${e}`,t.style.boxShadow=`0 0 15px ${e}44`,o.addEventListener("click",s=>{s.preventDefault(),s.stopPropagation(),V||(t.innerHTML=X.generateSections(),Z(),V=!0),t.classList.contains("hidden")?(t.classList.remove("hidden"),t.setAttribute("aria-hidden","false"),t.style.display="flex",requestAnimationFrame(()=>{t.style.opacity="1",t.style.transform="scale(1) translateY(0)"})):O()}),document.addEventListener("click",s=>{t&&o&&!t.contains(s.target)&&!o.contains(s.target)&&O()})}function O(){const o=document.getElementById("settingsMenu");o&&(o.classList.add("hidden"),o.setAttribute("aria-hidden","true"),o.style.display="none",o.style.opacity="0")}function b(o,t){try{const e=localStorage.getItem("userSettings"),s=e?JSON.parse(e):{};s[o]=t,localStorage.setItem("userSettings",JSON.stringify(s)),window.SettingsManager&&window.SettingsManager.update(o,t)}catch(e){console.error("Failed to sync settings:",e)}}function Z(){const o=document.getElementById("settingsMenu");if(!o)return;o.querySelectorAll(".section-header").forEach(p=>{p.addEventListener("click",()=>{const d=p.parentElement,y=d==null?void 0:d.classList.contains("expanded");o.querySelectorAll(".settings-section").forEach(k=>{k!==d&&k.classList.remove("expanded")}),y?d==null||d.classList.remove("expanded"):d==null||d.classList.add("expanded")})});const t=o.querySelector("#darkModeToggle");t&&(t.checked=document.documentElement.getAttribute("data-theme")==="dark",t.addEventListener("change",()=>{const p=t.checked?"dark":"light";document.documentElement.setAttribute("data-theme",p),localStorage.setItem("theme",p),b("darkMode",t.checked)}));const e=o.querySelector("#colorThemes");if(e){const p=localStorage.getItem("colorTheme")||"default",d=e.querySelectorAll(".color-btn");d.forEach(y=>{y.getAttribute("data-theme")===p?y.classList.add("active"):y.classList.remove("active")}),e.addEventListener("click",y=>{const k=y.target.closest(".color-btn");if(!k)return;d.forEach(F=>F.classList.remove("active")),k.classList.add("active");const x=k.getAttribute("data-theme")||"default";x!=="default"?document.documentElement.setAttribute("data-color-theme",x):document.documentElement.removeAttribute("data-color-theme"),localStorage.setItem("colorTheme",x),b("colorTheme",x)})}const s=o.querySelector("#mobileViewToggle");if(s){const p=document.body.classList.contains("iphone-view");s.checked=p,s.addEventListener("change",()=>{const d=s.checked;document.body.classList.toggle("iphone-view",d),localStorage.setItem("mobileView",String(d)),b("mobileView",d),window.MobileViewManager&&window.MobileViewManager.apply(d)})}const n=o.querySelector(".font-size-control");if(n){const p=localStorage.getItem("fontSize")||"medium";n.querySelectorAll(".font-btn").forEach(d=>{d.getAttribute("data-size")===p?d.classList.add("active"):d.classList.remove("active")}),n.addEventListener("click",d=>{const y=d.target.closest(".font-btn");if(!y)return;const k=y.getAttribute("data-size")||"medium",x={small:"14px",medium:"16px",large:"18px"};document.documentElement.style.fontSize=x[k],n.querySelectorAll(".font-btn").forEach(F=>F.classList.remove("active")),y.classList.add("active"),localStorage.setItem("fontSize",k),b("fontSize",k)})}const i=o.querySelector("#animationsToggle");if(i){const p=!document.body.classList.contains("reduce-motion");i.checked=p,i.addEventListener("change",()=>{document.body.classList.toggle("reduce-motion",!i.checked),b("animations",i.checked)})}const a=o.querySelector("#soundEffectsToggle");if(a){const p=localStorage.getItem("soundEnabled")!=="false";a.checked=p,a.addEventListener("change",()=>{localStorage.setItem("soundEnabled",String(a.checked)),b("soundEffects",a.checked)})}const c=o.querySelector("#ttsSpeedSlider"),r=o.querySelector("#ttsSpeedValue");if(c&&r){const p=localStorage.getItem("ttsSpeed")||"85";c.value=p,r.textContent=`${p}%`,c.addEventListener("input",()=>{r.textContent=`${c.value}%`,localStorage.setItem("ttsSpeed",c.value),b("ttsSpeed",parseInt(c.value))})}const u=o.querySelector(".voice-selector");if(u){const p=localStorage.getItem("ttsVoice")||"natural";u.querySelectorAll(".voice-btn").forEach(d=>{d.getAttribute("data-voice")===p?d.classList.add("active"):d.classList.remove("active")}),u.addEventListener("click",d=>{const y=d.target.closest(".voice-btn");if(!y)return;const k=y.getAttribute("data-voice")||"natural";u.querySelectorAll(".voice-btn").forEach(x=>x.classList.remove("active")),y.classList.add("active"),localStorage.setItem("ttsVoice",k),b("ttsVoicePreference",k)})}const l=o.querySelector(".goal-selector");l&&l.addEventListener("click",p=>{const d=p.target.closest(".goal-btn");d&&(l.querySelectorAll(".goal-btn").forEach(y=>y.classList.remove("active")),d.classList.add("active"),b("dailyGoal",parseInt(d.getAttribute("data-goal")||"10")))});const g=o.querySelector("#autoPlayToggle");g&&g.addEventListener("change",()=>{b("autoPlay",g.checked)});const h=o.querySelector("#showExamplesToggle");h&&h.addEventListener("change",()=>{b("showExamples",h.checked)});const v=o.querySelector("#focusModeToggle");if(v){const p=document.body.classList.contains("focus-mode");v.checked=p,v.addEventListener("change",()=>{document.body.classList.toggle("focus-mode",v.checked),localStorage.setItem("focusMode",String(v.checked)),b("focusMode",v.checked)})}const w=o.querySelector("#eyeCareToggle");w&&w.addEventListener("change",()=>{b("eyeCare",w.checked)});const S=o.querySelector("#languageSelector");S&&S.addEventListener("click",p=>{const d=p.target.closest(".lang-card-premium");if(!d)return;const y=d.getAttribute("data-lang")||"both";localStorage.setItem("appLanguage",y),window.LanguageManager?window.LanguageManager.setLanguage(y):location.reload()})}function tt(){console.log("Initializing Main UI..."),et(),J(),st(),nt(),it(),at(),ot(),ct()}function et(){const o=localStorage.getItem("theme")||"dark";if(o==="auto"){const t=new Date().getHours(),e=t>=18||t<7;document.documentElement.setAttribute("data-theme",e?"dark":"light")}else document.documentElement.setAttribute("data-theme",o)}function st(){const o=document.getElementById("mobileViewToggle");o&&o.addEventListener("click",()=>{var t;(t=window.MobileViewManager)==null||t.toggle()}),window.toggleMobileView=()=>{var t;return(t=window.MobileViewManager)==null?void 0:t.toggle()}}function nt(){const o=document.getElementById("progressBadge"),t=document.getElementById("progressModal"),e=document.getElementById("closeProgress");o&&t&&o.addEventListener("click",()=>{t.style.display="flex",t.classList.remove("hidden")}),e&&t&&(e.addEventListener("click",()=>{t.style.display="none"}),t.addEventListener("click",s=>{s.target===t&&(t.style.display="none")}))}function it(){const o=document.getElementById("quickWodBtn");o&&o.addEventListener("click",()=>{const s=document.getElementById("wordOfTheDay");s&&(s.scrollIntoView({behavior:"smooth",block:"center"}),s.classList.add("pulse-animation"),setTimeout(()=>s.classList.remove("pulse-animation"),500))});const t=document.getElementById("quickFavBtn");t&&t.addEventListener("click",()=>{var s;(s=window.app)==null||s.performSearch("favorites")});const e=document.getElementById("quickQuizBtn");e&&e.addEventListener("click",()=>{var s,n;(n=(s=window.QuizManager)==null?void 0:s.start)==null||n.call(s)})}function at(){const o=document.getElementById("onboardingModal");if(!o)return;const t=document.querySelectorAll(".onboarding-slide"),e=document.querySelectorAll(".dot"),s=document.getElementById("nextSlide"),n=document.getElementById("prevSlide"),i=document.getElementById("skipOnboarding");let a=0;const c=t.length;localStorage.getItem("onboardingComplete")||(o.style.display="flex",o.classList.remove("hidden"));function r(l){t.forEach((h,v)=>h.classList.toggle("active",v===l)),e.forEach((h,v)=>h.classList.toggle("active",v===l)),n&&(n.style.visibility=l===0?"hidden":"visible"),s&&(s.textContent=l===c-1?"Börja! 🚀":"Nästa ⟶");const g=t[l];g&&g.querySelectorAll("h2, p").forEach(h=>{E.apply(h,h.textContent||"")})}function u(){localStorage.setItem("onboardingComplete","true"),o.style.opacity="0",setTimeout(()=>{o.style.display="none"},300)}s&&s.addEventListener("click",()=>{a<c-1?(a++,r(a)):u()}),n&&n.addEventListener("click",()=>{a>0&&(a--,r(a))}),i&&i.addEventListener("click",u),e.forEach((l,g)=>{l.addEventListener("click",()=>{a=g,r(a)})})}function ot(){const o=document.getElementById("saveGoalBtn"),t=document.getElementById("dailyGoalInput");o&&t&&o.addEventListener("click",()=>{var e,s;localStorage.setItem("dailyGoal",t.value),(e=window.app)==null||e.updateDailyProgressBar(),(s=window.showToast)==null||s.call(window,"Mål sparat! / تم حفظ الهدف 🎯")})}function ct(){document.querySelectorAll(".game-card h3, .section-title, .stat-label").forEach(o=>{E.apply(o,o.textContent||"")})}function $(){const o=A.getLanguage();lt(o),A.updateTranslations(),rt(o),dt(o),ut()}function lt(o){const t=window.location.pathname,e={"/index.html":{sv:"Svensk-Arabiskt Lexikon | SnabbaLexin",ar:"القاموس السويدي العربي | سنابا لكسين"},"/settings.html":{sv:"Inställningar - SnabbaLexin",ar:"الإعدادات - سنابا لكسين"},"/learn.html":{sv:"Lär dig - SnabbaLexin",ar:"تعلم - سنابا لكسين"},"/games/games.html":{sv:"Spel - SnabbaLexin",ar:"الألعاب - سنابا لكسين"},"/":{sv:"Svensk-Arabiskt Lexikon | SnabbaLexin",ar:"القاموس السويدي العربي | سنابا لكسين"}},s=Object.keys(e).find(i=>t.endsWith(i))||"/",n=e[s]||e["/"];o==="sv"?document.title=n.sv:o==="ar"?document.title=n.ar:document.title=`${n.sv} - ${n.ar}`}function rt(o){const t=document.getElementById("searchInput");if(t){const e={sv:"Sök ord...",ar:"ابحث عن كلمة...",both:"Sök / بحث..."};t.placeholder=e[o]||e.both}}function dt(o){Object.values({home:{el:'.nav-link[href*="index"] .nav-text',sv:"Hem",ar:"الرئيسية"},games:{el:'.nav-link[href*="games"] .nav-text',sv:"Spel",ar:"ألعاب"},learn:{el:'.nav-link[href*="learn"] .nav-text',sv:"Lär dig",ar:"تعلم"},settings:{el:'.nav-link[href*="settings"] .nav-text',sv:"Mer",ar:"المزيد"}}).forEach(e=>{if(e.el){const s=document.querySelector(e.el);s&&(o==="sv"?s.textContent=e.sv:o==="ar"?s.textContent=e.ar:s.textContent=`${e.sv}`)}})}function gt(o,t){var s;const e=z(o)||t||o;(s=window.showToast)==null||s.call(window,e)}function ut(){const o=window.showToast;o&&(window.showToastTranslated=(t,e)=>{const s=z(t);o(s,{type:e||"success"})})}function pt(o,t){const e=A.getLanguage();return e==="sv"?o:e==="ar"?t:`${o} / ${t}`}if(typeof document<"u"){const o=()=>{$(),A.onLanguageChange(()=>{$()})};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",o):o()}typeof window<"u"&&(window.applyPageTranslations=$,window.showTranslatedToast=gt,window.getTranslatedText=pt);function ht(o,t){o.textContent=t}function D(o,t={},e){const s=document.createElement(o);return Object.entries(t).forEach(([n,i])=>{!n.startsWith("on")&&!i.includes("javascript:")&&!i.includes("data:")&&s.setAttribute(n,i)}),e!==void 0&&ht(s,e),s}function mt(o,t){let e;return(...s)=>{clearTimeout(e),e=setTimeout(()=>o(...s),t)}}class vt{constructor(){m(this,"isLoading",!0);m(this,"searchIndex",[]);m(this,"currentResults",[]);m(this,"BATCH_SIZE",20);m(this,"renderedCount",0);m(this,"activeFilterMode","all");m(this,"activeTypeFilter","all");m(this,"activeSortMethod","relevance");m(this,"handleSearch",mt(t=>{const e=t.target,s=e.value.trim();if(window.history.replaceState){const n=s?`${window.location.pathname}?s=${encodeURIComponent(s)}`:window.location.pathname;window.history.replaceState({path:n},"",n)}sessionStorage.setItem("snabbaLexin_lastSearch",s),this.performSearch(e.value)},300));this.init()}async init(){A.init(),tt(),Q.checkCacheAndLoad(),this.initStreaks(),this.setupSearchListeners(),this.setupThemeListener(),this.initQuickActions(),this.setupInfiniteScroll(),this.setupGlobalHandlers(),this.setupFilters(),this.setupVoiceSearch(),this.setupVoiceSelection(),this.updateDailyChallenge(),this.updateDailyProgressBar();const e=new URLSearchParams(window.location.search).get("s");if(e){const s=document.getElementById("searchInput");s&&(s.value=e)}window.addEventListener("dictionaryLoaded",()=>{console.log("[App] Data loaded event received"),this.handleDataLoaded()}),window.dictionaryData&&window.dictionaryData.length>0&&this.handleDataLoaded(),window.addEventListener("pageshow",s=>{if(s.persisted&&(console.log("[App] Restoring from BFCache"),window.dictionaryData&&window.dictionaryData.length>0)){const i=new URLSearchParams(window.location.search).get("s"),a=document.getElementById("searchInput");i&&a&&(a.value=i,this.performSearch(i))}})}initStreaks(){const t="lastVisitDate",e="dailyStreak",s=new Date().toISOString().split("T")[0],n=localStorage.getItem(t);let i=parseInt(localStorage.getItem(e)||"0");if(n!==s){const c=new Date;c.setDate(c.getDate()-1);const r=c.toISOString().split("T")[0];n===r?i++:i=1,localStorage.setItem(t,s),localStorage.setItem(e,i.toString())}const a=document.getElementById("currentStreak");a&&(a.innerHTML=i.toString())}setupThemeListener(){const t=document.getElementById("themeToggle");t&&t.addEventListener("click",()=>{_.toggle()})}setupSearchListeners(){const t=document.getElementById("searchInput");if(!t)return;t.addEventListener("input",s=>this.handleSearch(s)),t.addEventListener("keydown",s=>{if(s.key==="Enter"){const n=t.value.trim();n&&C.add(n)}});const e=document.getElementById("clearSearch");t.addEventListener("input",()=>{e&&(e.style.display=t.value.length>0?"flex":"none")}),e&&e.addEventListener("click",()=>{t.value="",e.style.display="none",this.performSearch("")})}setupFilters(){const t=document.getElementById("filterModeSelect"),e=document.getElementById("typeSelect"),s=document.getElementById("sortSelect"),n=document.getElementById("categorySelect"),i=document.getElementById("quickFavBtn"),a=()=>{t&&(this.activeFilterMode=t.value),e&&(this.activeTypeFilter=e.value),s&&(this.activeSortMethod=s.value);const u=document.getElementById("searchInput");this.performSearch((u==null?void 0:u.value)||"")};t&&t.addEventListener("change",a),e&&e.addEventListener("change",a),s&&s.addEventListener("change",a),n&&n.addEventListener("change",a),i&&i.addEventListener("click",()=>{t&&(t.value=t.value==="favorites"?"all":"favorites",a())});const c=document.getElementById("filterToggleBtn"),r=document.getElementById("filterChipsContainer");c&&r&&c.addEventListener("click",()=>{r.classList.toggle("hidden"),c.classList.toggle("active")})}handleDataLoaded(){if(!this.isLoading)return;this.isLoading=!1,console.log("[App] Data loaded, initializing...");const t=document.getElementById("loader");t&&(t.style.display="none");const e=window.dictionaryData;if(!e)return;this.searchIndex=e.map(r=>`${r[2]} ${r[3]}`.toLowerCase()),this.initWordOfTheDay();const n=new URLSearchParams(window.location.search).get("s"),i=sessionStorage.getItem("snabbaLexin_lastSearch"),a=document.getElementById("searchInput"),c=n||i||(a==null?void 0:a.value.trim())||"";if(console.log("[Debug] Persistence | URL:",n,"| Session:",i,"| Input:",a==null?void 0:a.value,"| Using:",c),c){if(console.log("[Debug] Restoring search:",c),a&&(a.value=c),!n&&i&&window.history.replaceState){const r=`${window.location.pathname}?s=${encodeURIComponent(i)}`;window.history.replaceState({path:r},"",r)}this.performSearch(c)}else console.log("[Debug] No search state found, showing landing page."),this.performSearch("");this.updateDailyChallenge(),this.updateTypeCounts(e)}updateTypeCounts(t){const e={};t.forEach(n=>{const i=M.getCategory(n[1],n[2],n[6],n[13]||"",n[3]||"");let a=i;i==="noun"&&(a="subst"),i==="conj"&&(a="konj"),i==="pronoun"&&(a="pron"),(i==="phrase"||i==="phrasal")&&(a="fras"),i==="prep"&&(a="prep"),i==="adj"&&(a="adj"),i==="adv"&&(a="adv");const c=(n[1]||"").toLowerCase();c.includes("interj")&&(a="interj"),(c.includes("räkne")||c.includes("num"))&&(a="num"),e[a]=(e[a]||0)+1,c.includes("juridik")&&(e.juridik=(e.juridik||0)+1),c.includes("medicin")&&(e.medicin=(e.medicin||0)+1),(c.includes("data")||c.includes("dator")||c.includes("it")||c.includes("teknik"))&&(e.it=(e.it||0)+1),(c.includes("politik")||c.includes("samhäll"))&&(e.politik=(e.politik||0)+1),(c.includes("religion")||c.includes("islam")||c.includes("krist")||c.includes("bibel")||c.includes("koran"))&&(e.religion=(e.religion||0)+1)});const s=document.getElementById("typeSelect");s&&Array.from(s.querySelectorAll("option")).forEach(n=>{var a;const i=n.value;if(i==="all"){n.textContent=`Alla (${t.length})`;return}if(e[i]){const c=(a=n.textContent)==null?void 0:a.split(" (")[0].trim();n.textContent=`${c} (${e[i]})`}})}initWordOfTheDay(){const t=window.dictionaryData;if(!t||t.length===0)return;let e=null,s=0;for(;s<500;){const n=Math.floor(Math.random()*t.length),i=t[n],a=i[9]&&i[9].length>0||i[10]&&i[10].length>0,c=i[7]&&i[7].split(" ").length>5;if(a||c){e=i;break}s++}e||(e=t[Math.floor(Math.random()*t.length)]),f.recordStudy(e[0].toString()),this.renderWod(e)}renderWod(t){const e=document.getElementById("wordOfTheDay");if(!e)return;e.classList.remove("hidden");const s=e.querySelector(".wod-swe"),n=e.querySelector(".wod-arb"),i=e.querySelector(".wod-type-badge");s&&(s.textContent=t[2],E.apply(s,t[2])),n&&(n.textContent=t[3],E.apply(n,t[3])),i&&(i.textContent=t[1]),[".wod-forms-preview",".wod-def-preview",".wod-example-preview",".wod-example-arb-preview",".wod-idiom-preview"].forEach(g=>{const h=e.querySelector(g);h&&h.classList.add("hidden")});const c=document.getElementById("wodTTSBtn");c&&(c.onclick=()=>{var g;return(g=window.TTSManager)==null?void 0:g.speak(t[2],"sv")});const r=document.getElementById("wodDetailsBtn");r&&(r.onclick=()=>window.location.href=`details.html?id=${t[0]}`);const u=document.getElementById("wodLoopBtn");u&&(u.onclick=()=>this.initWordOfTheDay());const l=document.getElementById("wodFavBtn");if(l){const g=t[0].toString(),h=L.has(g);L.updateButtonIcon(l,h),l.onclick=()=>{const v=L.toggle(g);L.updateButtonIcon(l,v)}}}initQuickActions(){const t=document.getElementById("quickWodBtn");t&&t.addEventListener("click",()=>{const e=document.getElementById("wordOfTheDay");e&&(e.scrollIntoView({behavior:"smooth",block:"center"}),e.classList.add("pulse-animation"),setTimeout(()=>e.classList.remove("pulse-animation"),500))})}performSearch(t){const e=t.toLowerCase().trim();if(window.history.replaceState){const l=e?`${window.location.pathname}?s=${encodeURIComponent(e)}`:window.location.pathname;window.history.replaceState({path:l},"",l)}const s=window.dictionaryData||[];if(!s)return;const n=document.getElementById("landingPageContent"),i=document.getElementById("searchResults"),a=document.getElementById("emptyState");this.renderedCount=0;let c=s;this.activeFilterMode==="favorites"&&(c=c.filter(l=>L.has(l[0].toString()))),e&&(c=c.filter(l=>{const g=l[2].toLowerCase(),h=T(l[3]||"").toLowerCase(),v=T(e);return this.activeFilterMode==="start"?g.startsWith(v)||h.startsWith(v):this.activeFilterMode==="end"?g.endsWith(v)||h.endsWith(v):this.activeFilterMode==="exact"?g===v||h===v:g.includes(v)||h.includes(v)})),this.updateTypeCounts(c),this.activeTypeFilter!=="all"&&(c=c.filter(l=>M.getCategory(l[1],l[2],l[6],l[13]||"",l[3]||"")===this.activeTypeFilter));const r=document.getElementById("categorySelect");if(r&&r.value!=="all"){const l=r.value;c=c.filter(g=>(g[11]||"").toLowerCase().includes(l))}this.activeSortMethod==="az"||this.activeSortMethod==="alpha_asc"?c=[...c].sort((l,g)=>l[2].localeCompare(g[2],"sv")):this.activeSortMethod==="za"||this.activeSortMethod==="alpha_desc"?c=[...c].sort((l,g)=>g[2].localeCompare(l[2],"sv")):this.activeSortMethod==="richness"?c=[...c].sort((l,g)=>{const h=(l[5]||"").length+(l[7]||"").length;return(g[5]||"").length+(g[7]||"").length-h}):c=[...c].sort((l,g)=>{const h=l[2].toLowerCase(),v=g[2].toLowerCase(),w=T(l[3]||"").toLowerCase(),S=T(g[3]||"").toLowerCase(),p=T(e),d=h===p||w===p,y=v===p||S===p;if(d&&!y)return-1;if(!d&&y)return 1;const k=h.startsWith(p)||w.startsWith(p),x=v.startsWith(p)||S.startsWith(p);return k&&!x?-1:!k&&x?1:0}),this.currentResults=c,!e&&this.activeFilterMode==="all"?(n&&(n.style.display="block"),i&&(i.style.display="none",i.innerHTML=""),a&&(a.style.display="block"),this.renderSearchHistory()):(n&&(n.style.display="none"),i&&(i.style.display="grid",i.innerHTML=""),a&&(a.style.display=c.length===0?"block":"none"),this.renderNextBatch()),this.updateResultCount()}renderNextBatch(){if(this.renderedCount>=this.currentResults.length)return;const t=document.getElementById("searchResults");if(!t)return;const e=this.currentResults.slice(this.renderedCount,this.renderedCount+this.BATCH_SIZE),s=document.createDocumentFragment();e.forEach(n=>{const i=document.createElement("div");for(i.innerHTML=this.createCard(n);i.firstChild;)s.appendChild(i.firstChild)}),t.appendChild(s),this.renderedCount+=e.length,E.autoApply()}createCard(t){const e=t[0],s=t[2],n=t[3],i=t[1],a=t[6]||"",c=t[13]||"",r=M.generateBadge(i,s,a,c,n),u=M.getDataType(i,s,a,c,n),l=L.has(e.toString()),g=l?'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>':'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>',h='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>',v='<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>',w=a?`<div class="ghost-forms">${a}</div>`:"",S=parseInt(e)%4*33;return`
            <div class="card card-link compact-card" data-type="${u}" onclick="if(!event.target.closest('button')) window.location.href='details.html?id=${e}'">
                <div class="card-top-row">
                    ${r}
                    <div class="card-actions">
                        <button class="action-button audio-btn" onclick="speakText('${s.replace(/'/g,"\\'")}', 'sv'); event.stopPropagation();" title="Lyssna">
                            ${v}
                        </button>
                        <button class="copy-btn action-button" onclick="copyWord('${s.replace(/'/g,"\\'")}', event)" title="Kopiera">
                            ${h}
                        </button>
                        <button class="fav-btn action-button ${l?"active":""}" onclick="toggleFavorite('${e}', this, event)" title="Spara">
                            ${g}
                        </button>
                    </div>
                </div>
                <div class="card-main-content">
                    <h2 class="word-swe" dir="ltr" data-auto-size data-max-lines="1">${s}</h2>
                    ${w}
                    <p class="word-arb" dir="rtl" data-auto-size data-max-lines="1">${n}</p>
                </div>
                <div class="mastery-bar-container"><div class="mastery-fill" style="width: ${S}%"></div></div>
            </div>
        `}setupInfiniteScroll(){window.addEventListener("scroll",()=>{if(this.currentResults.length===0)return;const{scrollTop:t,scrollHeight:e,clientHeight:s}=document.documentElement;t+s>=e-300&&this.renderNextBatch()})}setupGlobalHandlers(){window.copyWord=(t,e)=>{e.stopPropagation(),navigator.clipboard.writeText(t).then(()=>B(z("toast.copied")+" 📋"))},window.toggleFavorite=(t,e,s)=>{s.stopPropagation();const n=t.toString(),i=L.toggle(n);e.classList.toggle("active",i),e.innerHTML=i?'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>':'<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>'}}updateResultCount(){const t=document.getElementById("resultCount");t&&(t.textContent=this.currentResults.length.toLocaleString())}updateDailyChallenge(){const t=parseInt(localStorage.getItem("dailyGoal")||"10"),e=f.getTodayStats(),s=e.correct+(e.studied||0),n=Math.min(100,s/t*100),i=document.getElementById("challengeProgressBar");i&&(i.style.width=`${n}%`,s>=t&&i.classList.add("completed"));const a=document.getElementById("challengeProgressText");a&&(a.textContent=`${s}/${t}`,s>=t&&a.classList.add("completed"));const c=document.getElementById("dailyChallengeCard");c&&s>=t&&c.classList.add("completed"),console.log(`[App] Daily challenge: ${s}/${t} (${n.toFixed(0)}%)`),this.updateDailyProgressBar()}updateDailyProgressBar(){const t=parseInt(localStorage.getItem("dailyGoal")||"10"),e=f.getTodayStats(),s=e.correct+(e.studied||0),n=Math.min(100,s/t*100),i=document.getElementById("dailyProgressCount");i&&(i.textContent=s.toString());const a=document.getElementById("dailyWordsCount");a&&(a.textContent=s.toString());const c=document.getElementById("dailyProgressFill");c&&(c.style.width=`${n}%`,s>=t&&c.classList.add("completed"));const r=document.getElementById("progressRingValue");r&&(r.textContent=s.toString());const u=document.getElementById("progressRingGoal");u&&(u.textContent=t.toString());const l=document.querySelector(".progress-ring-circle");if(l){const h=314.159-n/100*314.159;l.style.strokeDashoffset=h.toString()}console.log(`[App] Daily progress: ${s}/${t} (${n.toFixed(0)}%)`)}setupVoiceSearch(){const t=document.getElementById("voiceSearchBtn"),e=document.getElementById("searchInput");!t||!e||(t.addEventListener("click",()=>{P.toggle()}),P.onResult=(s,n)=>{e.value=s,n&&(this.performSearch(s),B(`🎤 "${s}"`))})}setupVoiceSelection(){const t=document.querySelectorAll(".voice-selector-inline .voice-btn"),e=localStorage.getItem("ttsVoicePreference")||"natural";t.forEach(s=>{s.classList.toggle("active",s.getAttribute("data-voice")===e),s.addEventListener("click",n=>{n.stopPropagation();const i=s.getAttribute("data-voice");t.forEach(a=>a.classList.remove("active")),s.classList.add("active"),localStorage.setItem("ttsVoicePreference",i),B(`🗣️ ${z("settings.voiceChanged")||"Rösttyp ändrad"}`)})})}renderSearchHistory(){const t=document.getElementById("searchHistoryContainer"),e=document.getElementById("searchHistoryList"),s=document.getElementById("clearHistoryBtn");if(!t||!e)return;const n=C.get();if(n.length===0){t.classList.add("hidden");return}t.classList.remove("hidden"),e.innerHTML="",n.forEach(i=>{const a=D("button",{class:"history-chip",onclick:`window.location.href='?s=${encodeURIComponent(i)}'`}),c=D("span",{class:"history-icon"},"🕒"),r=D("span",{class:"history-text"},i);a.appendChild(c),a.appendChild(r),e.appendChild(a)}),s&&(s.onclick=()=>{C.clear(),this.renderSearchHistory()})}}typeof window<"u"&&(window.app=new vt);
