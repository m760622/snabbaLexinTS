import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css                            *//* empty css                       */import{showToast as U}from"./utils-DkwAXeNx.js";import{s as X}from"./tts-BPLy4HEw.js";import{A as h}from"./config-CfHoVMbv.js";import{L as V}from"./i18n-CIWjEN3D.js";import{T as W}from"./toast-manager-CZ3snF2j.js";import"./pwa-Bxh5GLjF.js";function J(){console.log("[GamesUI] Initializing..."),w(),k(),S(),x(),Y(),z(),requestAnimationFrame(()=>{oe()}),window.dictionaryData?b():window.addEventListener("dictionaryLoaded",()=>b(),{once:!0}),window.filterGames=ee,window.openDailyChallenge=K,window.updateGameScore=te,window.updateGamesStats=Z,window.trackGamePlayed=ae}function Y(){const e=document.getElementById("mobileToggle");e&&e.addEventListener("click",()=>{var t;(t=window.MobileViewManager)==null||t.toggle()})}function z(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("../sw.js").then(e=>{console.log("SW registered: ",e),e.update()}).catch(e=>{console.error("SW registration failed: ",e)})})}function w(){const e=JSON.parse(localStorage.getItem("gamesStats")||'{"gamesPlayed": 0, "winStreak": 0, "totalScore": 0}'),t=document.getElementById("gamesPlayedStat"),s=document.getElementById("winStreakStat"),a=document.getElementById("totalScoreStat");t&&(t.textContent=e.gamesPlayed||0),s&&(s.textContent=e.winStreak||0),a&&(a.textContent=e.totalScore||0)}function Z(e,t=0){const s=JSON.parse(localStorage.getItem("gamesStats")||'{"gamesPlayed": 0, "winStreak": 0, "totalScore": 0}');s.gamesPlayed++,s.totalScore+=t,e?s.winStreak++:s.winStreak=0,localStorage.setItem("gamesStats",JSON.stringify(s)),w(),Q()}function k(){var a;const e=new Date().toISOString().split("T")[0];let t=JSON.parse(localStorage.getItem("dailyGameChallenge")||"{}");t.date!==e&&(t={date:e,gamesPlayed:0,completed:!1},localStorage.setItem("dailyGameChallenge",JSON.stringify(t)));const s=document.getElementById("dailyProgress");s&&(s.textContent=`${t.gamesPlayed}/3`),t.completed&&((a=document.getElementById("dailyChallengeBanner"))==null||a.classList.add("completed"))}function Q(){const e=new Date().toISOString().split("T")[0];let t=JSON.parse(localStorage.getItem("dailyGameChallenge")||"{}");if(t.date!==e&&(t={date:e,gamesPlayed:0,completed:!1}),!t.completed){if(t.gamesPlayed++,t.gamesPlayed>=3){t.completed=!0;const s=JSON.parse(localStorage.getItem("gamesStats")||"{}");s.totalScore=(s.totalScore||0)+100,localStorage.setItem("gamesStats",JSON.stringify(s)),U('<span class="sv-text">🎉 Daglig utmaning klar! +100 poäng</span><span class="ar-text">🎉 تحدي اليوم مكتمل! +100 نقطة</span>')}localStorage.setItem("dailyGameChallenge",JSON.stringify(t))}k()}function K(){const e=document.querySelector(".game-cards-grid");e&&e.scrollIntoView({behavior:"smooth"})}const _={vocab:["Vokaler","Neon Search","Hangman","Memory","Minneskor","Bokstav Länk","Ord Hjulet","Svenska Wordle","Gissa Ordet"],grammar:["Grammatik","Bygg Meningen","Fyll i"],listening:["Lyssna","Uttalscoach"],puzzle:["Lås Upp","Neon Blocks","Ord-Regn"]};function ee(e){var s;document.querySelectorAll(".category-chip").forEach(a=>a.classList.remove("active")),(s=document.querySelector(`[data-cat="${e}"]`))==null||s.classList.add("active"),document.querySelectorAll(".game-card-item").forEach(a=>{var i;const o=((i=a.querySelector("h3"))==null?void 0:i.textContent)||"";if(e==="all")a.style.display="";else{const r=(_[e]||[]).some(l=>o.includes(l));a.style.display=r?"":"none"}})}function S(){const e=JSON.parse(localStorage.getItem("gameScores")||"{}");document.querySelectorAll(".game-stars").forEach(t=>{const s=t.dataset.game;if(!s)return;const a=e[s]||0;let o=0;a>=100?o=3:a>=50?o=2:a>=10&&(o=1),o>0&&t.setAttribute("data-stars",o.toString())})}function te(e,t){const s=JSON.parse(localStorage.getItem("gameScores")||"{}"),a=s[e]||0;t>a&&(s[e]=t,localStorage.setItem("gameScores",JSON.stringify(s))),S()}function x(){const e=JSON.parse(localStorage.getItem("gamesStats")||"{}"),t=new Date().toISOString().split("T")[0],s=se(),a=e.bestStreak||e.winStreak||0,o=document.getElementById("bestStreak");o&&(o.textContent=a);const i=JSON.parse(localStorage.getItem("dailyGamesLog")||"{}"),n=i[t]||0,r=document.getElementById("todayGames");r&&(r.textContent=n);let l=0;Object.keys(i).forEach(c=>{c>=s&&(l+=i[c])});const d=document.getElementById("weeklyGames");d&&(d.textContent=l.toString())}function se(){const e=new Date,t=e.getDay(),s=e.getDate()-t+(t===0?-6:1);return new Date(e.setDate(s)).toISOString().split("T")[0]}function ae(){const e=new Date().toISOString().split("T")[0],t=JSON.parse(localStorage.getItem("dailyGamesLog")||"{}");t[e]=(t[e]||0)+1,localStorage.setItem("dailyGamesLog",JSON.stringify(t));const s=JSON.parse(localStorage.getItem("gamesStats")||"{}");(!s.bestStreak||s.winStreak>s.bestStreak)&&(s.bestStreak=s.winStreak,localStorage.setItem("gamesStats",JSON.stringify(s))),x()}function b(){const e=window.dictionaryData;if(!e||!e.length)return;const t=new Date().toISOString().split("T")[0];let s=JSON.parse(localStorage.getItem("wotd_cache")||"{}");if(s.date!==t){const d=Math.floor(Math.random()*e.length);let c=e[d];for(let y=0;y<10&&!c[h.COLUMNS.EXAMPLE_SWE];y++)c=e[Math.floor(Math.random()*e.length)];s={date:t,word:c},localStorage.setItem("wotd_cache",JSON.stringify(s))}const a=s.word;if(!a)return;const o=document.getElementById("wordOfTheDay");o&&(o.style.display="block");const i=document.getElementById("wotd-swedish"),n=document.getElementById("wotd-arabic"),r=document.getElementById("wotd-example");i&&(i.textContent=a[h.COLUMNS.SWEDISH]),n&&(n.textContent=a[h.COLUMNS.ARABIC]),r&&(r.innerHTML=a[h.COLUMNS.EXAMPLE_SWE]||'<span class="sv-text">Ingen exempelmening</span><span class="ar-text">لا يوجد مثال</span>');const l=document.getElementById("wotd-speak-btn");l&&(l.onclick=d=>{d.stopPropagation(),X(a[h.COLUMNS.SWEDISH]);const c=l.querySelector("svg");c&&(c.style.fill="#fff"),setTimeout(()=>{c&&(c.style.fill="none")},1e3)})}function oe(){const e=document.querySelectorAll(".game-card-item");e.length&&e.forEach(t=>{const s=t;s.addEventListener("mousemove",a=>{const o=s.getBoundingClientRect(),i=a.clientX-o.left,n=a.clientY-o.top,r=o.width/2,l=o.height/2,d=(n-l)/l*-8,c=(i-r)/r*8;s.style.transform=`perspective(1000px) rotateX(${d}deg) rotateY(${c}deg) scale(1.02)`}),s.addEventListener("mouseleave",()=>{s.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale(1)"})})}typeof window<"u"&&document.addEventListener("DOMContentLoaded",()=>{V.init(),J()});const ie={hide(){const e=document.getElementById("splashScreen");e&&(e.classList.add("hidden"),setTimeout(()=>e.remove(),600))},showUntilReady(e=800){const t=Date.now();window.addEventListener("load",()=>{const s=Date.now()-t,a=Math.max(0,e-s);setTimeout(()=>this.hide(),a)})}};typeof window<"u"&&ie.showUntilReady(1e3);const u={isSupported(){return"vibrate"in navigator},light(){this.isSupported()&&navigator.vibrate(10)},medium(){this.isSupported()&&navigator.vibrate(25)},success(){this.isSupported()&&navigator.vibrate([15,50,15])},error(){this.isSupported()&&navigator.vibrate([50,30,50,30,50])},selection(){this.isSupported()&&navigator.vibrate(5)}},ne={createCardSkeleton(){const e=document.createElement("div");return e.className="skeleton-game-card",e.innerHTML=`
            <div class="skeleton-icon"></div>
            <div class="skeleton-title"></div>
            <div class="skeleton-subtitle"></div>
        `,e},showInContainer(e,t=6){e.innerHTML="";for(let s=0;s<t;s++){const a=this.createCardSkeleton();a.style.animationDelay=`${s*.1}s`,e.appendChild(a)}},hide(e){e.querySelectorAll(".skeleton-game-card").forEach((s,a)=>{setTimeout(()=>{s.classList.add("skeleton-fade-out"),setTimeout(()=>s.remove(),300)},a*50)})}},re={confetti(e={}){const s={...{particleCount:100,spread:70,origin:{x:.5,y:.6}},...e};typeof window.confetti=="function"?window.confetti(s):this.cssConfetti()},cssConfetti(){const e=document.createElement("div");e.className="confetti-container",e.innerHTML="";const t=["#ff6b6b","#4ecdc4","#45b7d1","#96ceb4","#ffeaa7","#dfe6e9","#fd79a8","#a29bfe"];for(let s=0;s<50;s++){const a=document.createElement("div");a.className="confetti-piece",a.style.cssText=`
                left: ${Math.random()*100}%;
                background: ${t[Math.floor(Math.random()*t.length)]};
                animation-delay: ${Math.random()*.5}s;
                animation-duration: ${2+Math.random()}s;
            `,e.appendChild(a)}document.body.appendChild(e),setTimeout(()=>e.remove(),3e3)},starBurst(e){const t=e.getBoundingClientRect(),s=t.left+t.width/2,a=t.top+t.height/2;for(let o=0;o<8;o++){const i=document.createElement("div");i.className="star-particle",i.textContent="⭐",i.style.cssText=`
                left: ${s}px;
                top: ${a}px;
                --angle: ${o*45}deg;
            `,document.body.appendChild(i),setTimeout(()=>i.remove(),800)}},showSuccess(e="Bra jobbat!"){const t=document.createElement("div");t.className="success-overlay",t.innerHTML=`
            <div class="success-content">
                <div class="success-checkmark">
                    <svg viewBox="0 0 52 52">
                        <circle cx="26" cy="26" r="25" fill="none" stroke="#4ade80" stroke-width="2"/>
                        <path fill="none" stroke="#4ade80" stroke-width="3" d="M14 27l7 7 16-16"/>
                    </svg>
                </div>
                <p class="success-message">${e}</p>
            </div>
        `,document.body.appendChild(t),u.success(),setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),300)},1500)},levelUp(e){const t=document.createElement("div");t.className="level-up-overlay",t.innerHTML=`
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <h2 class="level-up-title">Nivå ${e}!</h2>
                <p class="level-up-subtitle">Du har gått upp en nivå!</p>
            </div>
        `,document.body.appendChild(t),this.confetti({particleCount:150,spread:100}),u.success(),setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),500)},2500)},streakCelebration(e){const t=document.createElement("div");t.className="streak-overlay",t.innerHTML=`
            <div class="streak-content">
                <div class="streak-fire">🔥</div>
                <h2 class="streak-days">${e} dagar!</h2>
                <p class="streak-text">Din streak fortsätter!</p>
            </div>
        `,document.body.appendChild(t),u.medium(),setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),300)},2e3)}},A={steps:[{element:".games-header h1",title:"Välkommen! مرحباً!",text:"Här hittar du roliga spel för att lära dig svenska.",position:"bottom"},{element:".stats-hero",title:"Din statistik",text:"Följ dina framsteg: spelade spel, streak och poäng.",position:"bottom"},{element:".category-chips",title:"Kategorier",text:"Filtrera spel efter typ: ordförråd, grammatik, uttal...",position:"bottom"},{element:".game-card-item",title:"Välj ett spel",text:"Tryck på ett spel för att börja lära dig!",position:"top"}],currentStep:0,overlay:null,shouldShow(){return localStorage.getItem("onboardingCompleted")!=="true"},start(){this.shouldShow()&&(this.currentStep=0,this.showStep())},showStep(){var n,r;const e=this.steps[this.currentStep];if(!e){this.complete();return}const t=document.querySelector(e.element);if(!t){this.nextStep();return}this.overlay&&this.overlay.remove(),this.overlay=document.createElement("div"),this.overlay.className="tour-overlay";const s=t.getBoundingClientRect(),a=document.createElement("div");a.className="tour-spotlight",a.style.cssText=`
            top: ${s.top-8}px;
            left: ${s.left-8}px;
            width: ${s.width+16}px;
            height: ${s.height+16}px;
        `;const o=document.createElement("div");o.className=`tour-tooltip tour-${e.position}`,o.innerHTML=`
            <h3>${e.title}</h3>
            <p>${e.text}</p>
            <div class="tour-actions">
                <button class="tour-skip">Hoppa över</button>
                <button class="tour-next">${this.currentStep<this.steps.length-1?"Nästa":"Klar!"}</button>
            </div>
            <div class="tour-progress">
                ${this.steps.map((l,d)=>`<span class="tour-dot ${d===this.currentStep?"active":""}"></span>`).join("")}
            </div>
        `;const i=e.position==="bottom"?s.bottom+20:s.top-160;o.style.cssText=`
            top: ${i}px;
            left: ${Math.max(20,s.left+s.width/2-150)}px;
        `,this.overlay.appendChild(a),this.overlay.appendChild(o),document.body.appendChild(this.overlay),(n=o.querySelector(".tour-next"))==null||n.addEventListener("click",()=>{u.light(),this.nextStep()}),(r=o.querySelector(".tour-skip"))==null||r.addEventListener("click",()=>{this.complete()}),u.selection()},nextStep(){this.currentStep++,this.showStep()},complete(){this.overlay&&(this.overlay.classList.add("fade-out"),setTimeout(()=>{var e;return(e=this.overlay)==null?void 0:e.remove()},300)),localStorage.setItem("onboardingCompleted","true")},reset(){localStorage.removeItem("onboardingCompleted")}},E={addRipple(e){e.addEventListener("click",t=>{const s=e.getBoundingClientRect(),a=t.clientX-s.left,o=t.clientY-s.top,i=document.createElement("span");i.className="ripple-effect",i.style.cssText=`left: ${a}px; top: ${o}px;`,e.appendChild(i),u.light(),setTimeout(()=>i.remove(),600)})},addPressEffect(e){e.addEventListener("touchstart",()=>{e.style.transform="scale(0.95)",u.selection()},{passive:!0}),e.addEventListener("touchend",()=>{e.style.transform=""},{passive:!0})},init(){document.querySelectorAll(".game-card-item").forEach(e=>{this.addRipple(e),this.addPressEffect(e)}),document.querySelectorAll("button, .btn, .back-btn").forEach(e=>{this.addPressEffect(e)})}},le={isEnabled:!1,startY:0,isPulling:!1,init(e,t){if(this.isEnabled)return;this.isEnabled=!0;let s=null;e.addEventListener("touchstart",a=>{e.scrollTop===0&&(this.startY=a.touches[0].clientY,this.isPulling=!0)},{passive:!0}),e.addEventListener("touchmove",a=>{if(!this.isPulling)return;const i=a.touches[0].clientY-this.startY;i>0&&i<150&&(s||(s=document.createElement("div"),s.className="pull-refresh-indicator",s.innerHTML='<div class="pull-spinner"></div>',e.prepend(s)),s.style.height=`${i}px`,s.style.opacity=String(Math.min(i/80,1)))},{passive:!0}),e.addEventListener("touchend",async()=>{s&&s.offsetHeight>=80&&(s.classList.add("refreshing"),u.medium(),await t()),s&&(s.style.height="0",setTimeout(()=>{s==null||s.remove(),s=null},300)),this.isPulling=!1},{passive:!0})}};document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{E.init()},500),setTimeout(()=>{A.start()},1e3)});typeof window<"u"&&(window.HapticFeedback=u,window.SkeletonLoader=ne,window.Celebrations=re,window.OnboardingTour=A,window.MicroInteractions=E,window.PullToRefresh=le);const T={isActive:!1,init(){this.isActive=localStorage.getItem("focusMode")==="true",this.isActive&&document.body.classList.add("focus-mode")},createToggleButton(){if(document.querySelector(".focus-mode-toggle"))return;const t=document.createElement("button");t.className="focus-mode-toggle",t.setAttribute("aria-label","Toggle Focus Mode"),t.innerHTML=`
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
        `,t.addEventListener("click",()=>this.toggle()),document.body.appendChild(t)},toggle(){this.isActive=!this.isActive,document.body.classList.toggle("focus-mode",this.isActive),localStorage.setItem("focusMode",String(this.isActive)),"vibrate"in navigator&&navigator.vibrate(this.isActive?[20,50,20]:10),p(this.isActive?"Fokusläge aktiverat ✨":"Fokusläge avaktiverat",this.isActive?"success":"info")}},m={xpPerLevel:100,levelMultiplier:1.5,getProgress(){const e=localStorage.getItem("userProgress");return e?JSON.parse(e):{xp:0,level:1,streak:0,gamesPlayed:0,totalScore:0,wordsLearned:0,timeSpent:0,achievements:[],lastPlayDate:"",dailyGoalsCompleted:0}},saveProgress(e){localStorage.setItem("userProgress",JSON.stringify(e))},getXPForLevel(e){return Math.floor(this.xpPerLevel*Math.pow(this.levelMultiplier,e-1))},addXP(e){const t=this.getProgress();t.xp+=e;const s=this.getXPForLevel(t.level);let a=!1;for(;t.xp>=s;)t.xp-=s,t.level++,a=!0;return this.saveProgress(t),a&&this.showLevelUp(t.level),{newLevel:a,level:t.level,totalXP:t.xp}},showLevelUp(e){const t=document.createElement("div");t.className="level-up-overlay",t.innerHTML=`
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <h2 class="level-up-title">Nivå ${e}!</h2>
                <p class="level-up-subtitle">Du har gått upp en nivå!</p>
                <div class="level-stars">
                    ${'<span class="level-star">⭐</span>'.repeat(Math.min(e,5))}
                </div>
            </div>
        `,document.body.appendChild(t),f.confetti({particleCount:150,spread:100}),g.play("levelUp"),"vibrate"in navigator&&navigator.vibrate([50,100,50,100,50]),setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),500)},3e3)},createXPBar(e){const t=this.getProgress(),s=this.getXPForLevel(t.level),a=t.xp/s*100,o=document.createElement("div");o.className="xp-widget",o.innerHTML=`
            <div class="xp-header">
                <span class="xp-level">Nivå ${t.level}</span>
                <span class="xp-text">${t.xp}/${s} XP</span>
            </div>
            <div class="xp-progress-container">
                <div class="xp-progress-bar" style="width: ${a}%">
                    <div class="xp-progress-glow"></div>
                </div>
            </div>
        `,e.insertBefore(o,e.firstChild)}},M={list:[{id:"first-game",name:"Första Steget",nameAr:"الخطوة الأولى",description:"Spela ditt första spel",icon:"🎮",requirement:1,type:"games",unlocked:!1},{id:"ten-games",name:"Spelentusiast",nameAr:"عاشق الألعاب",description:"Spela 10 spel",icon:"🎯",requirement:10,type:"games",unlocked:!1},{id:"fifty-games",name:"Mästare",nameAr:"محترف",description:"Spela 50 spel",icon:"👑",requirement:50,type:"games",unlocked:!1},{id:"streak-3",name:"På Rulle",nameAr:"متواصل",description:"3 dagars streak",icon:"🔥",requirement:3,type:"streak",unlocked:!1},{id:"streak-7",name:"Vecko-Hjälte",nameAr:"بطل الأسبوع",description:"7 dagars streak",icon:"💪",requirement:7,type:"streak",unlocked:!1},{id:"streak-30",name:"Månads-Legend",nameAr:"أسطورة الشهر",description:"30 dagars streak",icon:"🏆",requirement:30,type:"streak",unlocked:!1},{id:"score-100",name:"Poängjägare",nameAr:"صياد النقاط",description:"Få 100 poäng totalt",icon:"⭐",requirement:100,type:"score",unlocked:!1},{id:"score-1000",name:"Poäng-Kung",nameAr:"ملك النقاط",description:"Få 1000 poäng totalt",icon:"👸",requirement:1e3,type:"score",unlocked:!1},{id:"words-50",name:"Ordsamlare",nameAr:"جامع الكلمات",description:"Lär dig 50 ord",icon:"📚",requirement:50,type:"words",unlocked:!1},{id:"words-200",name:"Ordväktare",nameAr:"حارس الكلمات",description:"Lär dig 200 ord",icon:"📖",requirement:200,type:"words",unlocked:!1},{id:"time-60",name:"Dedikerad",nameAr:"مكرّس",description:"Spela i 60 minuter",icon:"⏰",requirement:60,type:"time",unlocked:!1},{id:"time-300",name:"Tidsmästare",nameAr:"سيد الوقت",description:"Spela i 5 timmar",icon:"⌛",requirement:300,type:"time",unlocked:!1}],loadUnlocked(){const e=m.getProgress();this.list.forEach(t=>{t.unlocked=e.achievements.includes(t.id)})},check(){const e=m.getProgress(),t=[];return this.list.forEach(s=>{if(s.unlocked)return;let a=0;switch(s.type){case"games":a=e.gamesPlayed;break;case"streak":a=e.streak;break;case"score":a=e.totalScore;break;case"words":a=e.wordsLearned;break;case"time":a=e.timeSpent;break}a>=s.requirement&&(s.unlocked=!0,s.unlockedAt=new Date().toISOString(),e.achievements.push(s.id),t.push(s))}),t.length>0&&(m.saveProgress(e),t.forEach(s=>this.showUnlock(s))),t},showUnlock(e){const t=document.createElement("div");t.className="achievement-popup",t.innerHTML=`
            <div class="achievement-popup-badge">
                <div class="achievement-badge unlocked">
                    <div class="achievement-badge-inner">${e.icon}</div>
                    <div class="achievement-badge-shine"></div>
                </div>
            </div>
            <h3 class="achievement-popup-title">${e.name}</h3>
            <p class="achievement-popup-desc">${e.description}</p>
        `,document.body.appendChild(t),g.play("achievement"),f.confetti({particleCount:80,spread:60}),"vibrate"in navigator&&navigator.vibrate([30,50,30,50,30]),setTimeout(()=>{t.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>t.remove(),500)},3500)},showBadges(e){this.loadUnlocked();const t=document.createElement("div");t.className="achievements-grid",t.style.cssText="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 16px;",this.list.forEach(s=>{const a=document.createElement("div");a.className=`achievement-badge ${s.unlocked?"unlocked":"locked"}`,a.innerHTML=`
                <div class="achievement-badge-inner">${s.icon}</div>
                ${s.unlocked?'<div class="achievement-badge-shine"></div>':""}
            `,a.title=`${s.name}: ${s.description}`,t.appendChild(a)}),e.appendChild(t)}},v={goals:[{id:"play-3",name:"Spela 3 spel",nameAr:"العب 3 ألعاب",description:"Spela 3 spel idag",icon:"🎮",target:3,current:0,xpReward:20,completed:!1},{id:"score-50",name:"Få 50 poäng",nameAr:"احصل على 50 نقطة",description:"Samla 50 poäng",icon:"⭐",target:50,current:0,xpReward:30,completed:!1},{id:"streak",name:"Behåll streak",nameAr:"حافظ على السلسلة",description:"Logga in och spela",icon:"🔥",target:1,current:0,xpReward:15,completed:!1}],load(){const e=new Date().toDateString(),t=localStorage.getItem("dailyGoals"),s=t?JSON.parse(t):null;s&&s.date===e?this.goals=s.goals:(this.goals.forEach(a=>{a.current=0,a.completed=!1}),this.save())},save(){localStorage.setItem("dailyGoals",JSON.stringify({date:new Date().toDateString(),goals:this.goals}))},updateProgress(e,t){this.load();let s=!1;this.goals.forEach(a=>{a.completed||(e==="games"&&a.id==="play-3"||e==="score"&&a.id==="score-50"||e==="streak"&&a.id==="streak")&&(a.current=Math.min(a.current+t,a.target),a.current>=a.target&&!a.completed&&(a.completed=!0,this.showGoalComplete(a),m.addXP(a.xpReward)),s=!0)}),s&&this.save()},showGoalComplete(e){p(`🎯 ${e.name} - +${e.xpReward} XP!`,"success"),g.play("success")},render(e){this.load();const t=document.createElement("div");t.className="daily-goals-widget glass-card";const s=this.goals.filter(a=>a.completed).length;t.innerHTML=`
            <div class="daily-goals-header">
                <h3 class="daily-goals-title">🎯 Dagens Mål</h3>
                <span class="daily-goals-progress">${s}/${this.goals.length}</span>
            </div>
            ${this.goals.map(a=>`
                <div class="daily-goal-item ${a.completed?"completed":""}">
                    <div class="daily-goal-icon" style="background: ${a.completed?"#4ade80":"#6366f1"}20;">
                        ${a.icon}
                    </div>
                    <div class="daily-goal-info">
                        <div class="daily-goal-name">${a.name}</div>
                        <div class="daily-goal-desc">${a.current}/${a.target}</div>
                    </div>
                    <div class="daily-goal-reward">+${a.xpReward} XP</div>
                </div>
            `).join("")}
        `,e.appendChild(t)}},ce={rewards:[{type:"xp",value:10,icon:"✨",name:"10 XP"},{type:"xp",value:25,icon:"⭐",name:"25 XP"},{type:"xp",value:50,icon:"💫",name:"50 XP"},{type:"xp",value:100,icon:"🌟",name:"100 XP"},{type:"streak-freeze",value:1,icon:"❄️",name:"Streak Freeze"},{type:"double-xp",value:1,icon:"🔥",name:"Dubbel XP (1 spel)"}],canOpen(){const e=m.getProgress();if(!e.mysteryBoxLastOpened)return!0;const t=new Date(e.mysteryBoxLastOpened);return(new Date().getTime()-t.getTime())/(1e3*60*60)>=24},open(){if(!this.canOpen())return p("Vänta till imorgon för nästa låda! 📦","info"),null;const e=this.rewards[Math.floor(Math.random()*this.rewards.length)],t=m.getProgress();return t.mysteryBoxLastOpened=new Date().toISOString(),m.saveProgress(t),e.type==="xp"&&m.addXP(e.value),this.showReward(e),e},showReward(e){const t=document.createElement("div");t.className="level-up-overlay",t.innerHTML=`
            <div class="level-up-content">
                <div class="mystery-box opening">
                    <span class="mystery-box-icon">🎁</span>
                </div>
            </div>
        `,document.body.appendChild(t),g.play("mysteryBox"),setTimeout(()=>{t.innerHTML=`
                <div class="level-up-content">
                    <div class="level-up-icon">${e.icon}</div>
                    <h2 class="level-up-title">${e.name}!</h2>
                    <p class="level-up-subtitle">Du fick en belöning!</p>
                </div>
            `,f.confetti({particleCount:100,spread:80}),"vibrate"in navigator&&navigator.vibrate([50,100,50])},1e3),setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),500)},4e3)},render(e){const t=this.canOpen(),s=document.createElement("div");s.style.cssText="display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px;",s.innerHTML=`
            <div class="mystery-box ${t?"":"locked"}" id="mysteryBox">
                <span class="mystery-box-icon">🎁</span>
                <div class="mystery-box-sparkles">
                    <div class="mystery-box-sparkle"></div>
                    <div class="mystery-box-sparkle"></div>
                    <div class="mystery-box-sparkle"></div>
                    <div class="mystery-box-sparkle"></div>
                </div>
            </div>
            <p style="color: var(--text-secondary); font-size: 0.9rem;">
                ${t?"Klicka för att öppna!":"Kommer tillbaka imorgon"}
            </p>
        `,e.appendChild(s);const a=s.querySelector("#mysteryBox");a&&t&&a.addEventListener("click",()=>this.open())}},L={isRunning:!1,isPaused:!1,timeLeft:25*60,sessionLength:25*60,breakLength:5*60,isBreak:!1,sessionsCompleted:0,interval:null,widget:null,init(){this.createWidget()},createToggleButton(){const e=document.createElement("button");e.className="pomodoro-toggle",e.style.cssText=`
            position: fixed;
            bottom: 90px;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 998;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            transition: transform 0.3s ease;
        `,e.innerHTML="⏱️",e.addEventListener("click",()=>this.toggleWidget()),document.body.appendChild(e)},createWidget(){var t,s,a;const e=document.createElement("div");e.className="pomodoro-widget",e.innerHTML=`
            <div class="pomodoro-header">
                <span class="pomodoro-title">⏱️ Pomodoro</span>
                <button class="pomodoro-close">✕</button>
            </div>
            <div class="pomodoro-timer" id="pomodoroTime">25:00</div>
            <div class="pomodoro-controls">
                <button class="pomodoro-btn pomodoro-btn-primary" id="pomodoroStart">Start</button>
                <button class="pomodoro-btn pomodoro-btn-secondary" id="pomodoroReset">Reset</button>
            </div>
            <div class="pomodoro-sessions" id="pomodoroSessions">
                <span class="pomodoro-session-dot"></span>
                <span class="pomodoro-session-dot"></span>
                <span class="pomodoro-session-dot"></span>
                <span class="pomodoro-session-dot"></span>
            </div>
        `,document.body.appendChild(e),this.widget=e,(t=e.querySelector(".pomodoro-close"))==null||t.addEventListener("click",()=>this.toggleWidget()),(s=e.querySelector("#pomodoroStart"))==null||s.addEventListener("click",()=>this.toggleTimer()),(a=e.querySelector("#pomodoroReset"))==null||a.addEventListener("click",()=>this.reset())},toggleWidget(){this.widget&&this.widget.classList.toggle("visible")},toggleTimer(){this.isRunning?this.pause():this.start()},start(){this.isRunning=!0,this.isPaused=!1;const e=document.querySelector("#pomodoroStart");e&&(e.textContent="Paus"),this.interval=setInterval(()=>{this.timeLeft--,this.updateDisplay(),this.timeLeft<=0&&this.completeSession()},1e3),g.play("click")},pause(){this.isRunning=!1,this.isPaused=!0,this.interval&&clearInterval(this.interval);const e=document.querySelector("#pomodoroStart");e&&(e.textContent="Fortsätt")},reset(){this.isRunning=!1,this.isPaused=!1,this.interval&&clearInterval(this.interval),this.timeLeft=this.isBreak?this.breakLength:this.sessionLength,this.updateDisplay();const e=document.querySelector("#pomodoroStart");e&&(e.textContent="Start")},completeSession(){this.interval&&clearInterval(this.interval),this.isRunning=!1,this.isBreak?(p("☕ Paus klar! Tillbaka till jobbet!","info"),this.isBreak=!1,this.timeLeft=this.sessionLength):(this.sessionsCompleted++,this.updateSessionDots(),m.addXP(10),p("🍅 Pomodoro klar! +10 XP","success"),this.isBreak=!0,this.timeLeft=this.breakLength),this.updateDisplay(),g.play("notification"),"vibrate"in navigator&&navigator.vibrate([100,50,100]);const e=document.querySelector("#pomodoroStart");e&&(e.textContent="Start")},updateDisplay(){const e=Math.floor(this.timeLeft/60),t=this.timeLeft%60,s=`${e.toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`,a=document.querySelector("#pomodoroTime");a&&(a.textContent=s)},updateSessionDots(){document.querySelectorAll(".pomodoro-session-dot").forEach((t,s)=>{s<this.sessionsCompleted&&t.classList.add("completed")})}},g={enabled:!0,volume:.5,sounds:{success:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",error:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",click:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",achievement:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",levelUp:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",notification:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",mysteryBox:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"},init(){this.enabled=localStorage.getItem("soundEnabled")!=="false"},createToggle(){if(document.querySelector(".sound-toggle"))return;const t=document.createElement("button");t.className=`sound-toggle ${this.enabled?"":"muted"}`,t.innerHTML=`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `,t.addEventListener("click",()=>this.toggle()),document.body.appendChild(t)},toggle(){this.enabled=!this.enabled,localStorage.setItem("soundEnabled",String(this.enabled));const e=document.querySelector(".sound-toggle");e&&e.classList.toggle("muted",!this.enabled),this.enabled&&this.play("click"),p(this.enabled?"🔊 Ljud på":"🔇 Ljud av","info")},play(e){if(this.enabled)try{const t=new(window.AudioContext||window.webkitAudioContext),s=t.createOscillator(),a=t.createGain();switch(s.connect(a),a.connect(t.destination),a.gain.value=this.volume*.1,e){case"success":s.frequency.setValueAtTime(523.25,t.currentTime),s.frequency.setValueAtTime(659.25,t.currentTime+.1),s.frequency.setValueAtTime(783.99,t.currentTime+.2);break;case"error":s.frequency.setValueAtTime(200,t.currentTime);break;case"click":s.frequency.setValueAtTime(800,t.currentTime),a.gain.exponentialRampToValueAtTime(.01,t.currentTime+.05);break;case"achievement":case"levelUp":s.frequency.setValueAtTime(392,t.currentTime),s.frequency.setValueAtTime(523.25,t.currentTime+.1),s.frequency.setValueAtTime(659.25,t.currentTime+.2),s.frequency.setValueAtTime(783.99,t.currentTime+.3);break;case"notification":s.frequency.setValueAtTime(440,t.currentTime),s.frequency.setValueAtTime(660,t.currentTime+.1);break;default:s.frequency.setValueAtTime(440,t.currentTime)}s.type="sine",s.start(t.currentTime),s.stop(t.currentTime+.3)}catch{console.log("Audio not supported")}}},f={confetti(e={}){const t={particleCount:e.particleCount||100,spread:e.spread||70,origin:e.origin||{x:.5,y:.6}};if(typeof window.confetti=="function"){window.confetti(t);return}this.cssConfetti(t.particleCount)},cssConfetti(e=50){const t=document.createElement("div");t.className="confetti-container";const s=["#ff6b6b","#4ecdc4","#45b7d1","#96ceb4","#ffeaa7","#fd79a8","#a29bfe","#6c5ce7"];for(let a=0;a<e;a++){const o=document.createElement("div");o.className="confetti-piece",o.style.left=`${Math.random()*100}%`,o.style.background=s[Math.floor(Math.random()*s.length)],o.style.animationDelay=`${Math.random()*.5}s`,o.style.animationDuration=`${2+Math.random()}s`,t.appendChild(o)}document.body.appendChild(t),setTimeout(()=>t.remove(),3e3)}};function p(e,t="info"){W.show(e,{type:t})}function de(e,t,s=100,a=8){const o=(s-a)/2,i=o*2*Math.PI,n=i-t/100*i;e.innerHTML=`
        <svg class="progress-ring" width="${s}" height="${s}">
            <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6366f1"/>
                    <stop offset="50%" style="stop-color:#ec4899"/>
                    <stop offset="100%" style="stop-color:#f59e0b"/>
                </linearGradient>
            </defs>
            <circle class="progress-ring-circle-bg"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="${a}"
                fill="transparent"
                r="${o}"
                cx="${s/2}"
                cy="${s/2}"/>
            <circle class="progress-ring-circle-progress"
                stroke="url(#progress-gradient)"
                stroke-width="${a}"
                fill="transparent"
                r="${o}"
                cx="${s/2}"
                cy="${s/2}"
                style="stroke-dasharray: ${i}; stroke-dashoffset: ${n}"/>
        </svg>
        <span class="progress-ring-text">${Math.round(t)}%</span>
    `,e.className="progress-ring-container"}document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{T.init(),g.init(),L.init(),M.loadUnlocked(),v.load(),v.updateProgress("streak",1)},500)});typeof window<"u"&&(window.FocusMode=T,window.XPSystem=m,window.Achievements=M,window.DailyGoals=v,window.MysteryBox=ce,window.PomodoroTimer=L,window.SoundEffects=g,window.Celebrations=f,window.createProgressRing=de,window.showToast=p);const C={init(){document.querySelectorAll(".game-card-item").forEach(e=>{this.addTiltEffect(e)})},addTiltEffect(e){e.classList.add("tilt-card");const t=document.createElement("div");t.className="tilt-shine",e.appendChild(t),e.addEventListener("mousemove",s=>{const a=e.getBoundingClientRect(),o=s.clientX-a.left,i=s.clientY-a.top,n=a.width/2,r=a.height/2,l=(i-r)/10,d=(n-o)/10;e.style.setProperty("--tilt-x",`${l}deg`),e.style.setProperty("--tilt-y",`${d}deg`),t.style.background=`radial-gradient(circle at ${o}px ${i}px, rgba(255,255,255,0.2) 0%, transparent 50%)`}),e.addEventListener("mouseleave",()=>{e.style.setProperty("--tilt-x","0deg"),e.style.setProperty("--tilt-y","0deg")})}},B={difficulties:{flashcards:"easy",vokaler:"medium","unblock-me":"hard","block-puzzle":"medium","word-search":"easy",hangman:"medium",memory:"easy","word-wheel":"medium","word-connect":"hard","fill-blank":"medium",listening:"medium",grammar:"hard","missing-word":"medium",spelling:"hard","sentence-builder":"hard","word-rain":"medium",wordle:"hard",pronunciation:"hard"},labels:{easy:{sv:"Lätt",ar:"سهل"},medium:{sv:"Medel",ar:"متوسط"},hard:{sv:"Svårt",ar:"صعب"}},init(){document.querySelectorAll(".game-card-item").forEach(e=>{const t=e.getAttribute("data-game-id");t&&this.difficulties[t]&&this.addBadge(e,this.difficulties[t])})},addBadge(e,t){var o;if(e.querySelector(".difficulty-badge"))return;const a=document.createElement("span");a.className=`difficulty-badge difficulty-${t}`,a.textContent=((o=this.labels[t])==null?void 0:o.sv)||t,e.appendChild(a)}},I={init(){const e=localStorage.getItem("lastPlayedGame");if(!e)return;const t=JSON.parse(e),s=document.querySelector(`[data-game-id="${t.gameId}"]`);s&&this.addBadge(s)},addBadge(e){if(e.querySelector(".last-played-badge"))return;const s=document.createElement("div");s.className="last-played-badge",s.innerHTML=`
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            Senast
        `,e.appendChild(s)},recordPlay(e){localStorage.setItem("lastPlayedGame",JSON.stringify({gameId:e,timestamp:Date.now()}))}},$={recommendations:{memory:5,flashcards:5,grammar:4,vokaler:5,"word-connect":4,hangman:4,"fill-blank":3,listening:4,"word-wheel":3,wordle:3,pronunciation:4,spelling:3,"sentence-builder":3,"word-rain":4,"missing-word":3,"unblock-me":2,"block-puzzle":2,"word-search":3},init(){document.querySelectorAll(".game-card-item").forEach(e=>{const t=e.getAttribute("data-game-id");t&&this.recommendations[t]&&this.addStars(e,this.recommendations[t])})},addStars(e,t){var i;if(e.querySelector(".recommendation-stars"))return;const a=document.createElement("div");a.className="recommendation-stars";for(let n=1;n<=5;n++){const r=document.createElement("svg");r.className=`recommendation-star ${n>t?"empty":""}`,r.setAttribute("viewBox","0 0 24 24"),r.innerHTML='<path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',a.appendChild(r)}const o=e.querySelector(".high-score, .game-stars");o?(i=o.parentNode)==null||i.insertBefore(a,o.nextSibling):e.appendChild(a)}},P={init(){if(document.querySelector(".particles-container"))return;const t=document.createElement("div");t.className="particles-container";for(let s=0;s<15;s++){const a=document.createElement("div");a.className="particle",a.style.animationDelay=`${Math.random()*10}s`,a.style.left=`${Math.random()*100}%`,t.appendChild(a)}document.body.insertBefore(t,document.body.firstChild)}},q={baseCount:12,init(){const e=document.querySelector(".games-container");if(!e||document.querySelector(".live-players-widget"))return;const s=this.createWidget(),a=document.getElementById("xpWidget");if(a&&a.nextSibling)e.insertBefore(s,a.nextSibling);else{const o=document.querySelector(".games-header");o&&o.nextSibling&&e.insertBefore(s,o.nextSibling)}this.startUpdating()},createWidget(){const e=this.getRandomCount(),t=document.createElement("div");return t.className="live-players-widget",t.innerHTML=`
            <div class="live-indicator">
                <div class="live-dot"></div>
                <span class="live-count" id="livePlayerCount">${e}</span>
            </div>
            <span class="live-text">spelare online just nu / لاعب متصل الآن</span>
            <div class="live-avatars">
                ${this.createAvatars(Math.min(e,5))}
            </div>
        `,t},createAvatars(e){const t=["👤","🧑","👩","🧑‍🦱","👨","👧","🧒"];let s="";for(let a=0;a<e;a++)s+=`<div class="live-avatar">${t[a%t.length]}</div>`;return s},getRandomCount(){return this.baseCount+Math.floor(Math.random()*20)},startUpdating(){setInterval(()=>{const e=document.getElementById("livePlayerCount");if(e){const t=this.getRandomCount();e.textContent=String(t)}},15e3)}},N={quotes:[{text:"Varje ord du lär dig är ett steg närmare fluency.",author:"SnabbaLexin",textAr:"كل كلمة تتعلمها هي خطوة نحو الطلاقة."},{text:"Övning ger färdighet. Fortsätt träna!",author:"Svenskt ordspråk",textAr:"الممارسة تصنع الكمال. استمر في التدريب!"},{text:"Att lära sig ett nytt språk är att öppna en ny dörr.",author:"Frank Smith",textAr:"تعلم لغة جديدة هو فتح باب جديد."},{text:"Din streak visar ditt engagemang. Imponerande!",author:"SnabbaLexin",textAr:"سلسلتك تظهر التزامك. مثير للإعجاب!"},{text:"Små framsteg varje dag leder till stora resultat.",author:"Kinesiskt ordspråk",textAr:"التقدم الصغير كل يوم يؤدي إلى نتائج كبيرة."},{text:"Du är en stjärna! Fortsätt lysa.",author:"SnabbaLexin",textAr:"أنت نجم! استمر في التألق."},{text:"Misstag är bevis på att du försöker.",author:"Okänd",textAr:"الأخطاء دليل على أنك تحاول."},{text:"Språket är nyckeln till en annan kultur.",author:"Rita Mae Brown",textAr:"اللغة هي مفتاح ثقافة أخرى."}],currentIndex:0,init(){const e=document.querySelector(".games-container");if(!e||document.querySelector(".quote-widget"))return;this.currentIndex=Math.floor(Math.random()*this.quotes.length);const s=this.createWidget(),a=document.querySelector(".live-players-widget");if(a&&a.nextSibling)e.insertBefore(s,a.nextSibling);else{const o=document.querySelector(".stats-hero");o&&e.insertBefore(s,o)}},createWidget(){var s;const e=this.quotes[this.currentIndex],t=document.createElement("div");return t.className="quote-widget",t.innerHTML=`
            <span class="quote-icon">"</span>
            <p class="quote-text" id="quoteText">${e.text}</p>
            <p class="quote-author" id="quoteAuthor">— ${e.author}</p>
            <button class="quote-refresh" id="quoteRefresh" title="Nytt citat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
            </button>
        `,(s=t.querySelector("#quoteRefresh"))==null||s.addEventListener("click",()=>this.showNext()),t},showNext(){this.currentIndex=(this.currentIndex+1)%this.quotes.length;const e=this.quotes[this.currentIndex],t=document.getElementById("quoteText"),s=document.getElementById("quoteAuthor");t&&s&&(t.style.opacity="0",s.style.opacity="0",setTimeout(()=>{t.textContent=e.text,s.textContent=`— ${e.author}`,t.style.opacity="1",s.style.opacity="1"},200))}},O={init(){const e=document.querySelector(".leaderboard-section");if(!e||document.querySelector(".progress-dashboard"))return;const s=this.createDashboard();e.insertBefore(s,e.firstChild)},createDashboard(){const e=this.getWeeklyStats(),t=document.createElement("div");return t.className="progress-dashboard",t.innerHTML=`
            <div class="dashboard-header">
                <h3 class="dashboard-title">📊 Din Vecka / أسبوعك</h3>
                <span class="dashboard-period">Senaste 7 dagar</span>
            </div>
            
            <div class="bar-chart" id="weeklyChart">
                ${this.createBarChart(e.daily)}
            </div>
            
            <div class="skill-grid">
                ${this.createSkillItems(e.skills)}
            </div>
        `,t},getWeeklyStats(){const e=localStorage.getItem("weeklyStats");return e?JSON.parse(e):{daily:[3,5,2,7,4,6,8],skills:{vocab:75,grammar:45,listening:60,puzzle:30}}},createBarChart(e){const t=["Mån","Tis","Ons","Tor","Fre","Lör","Sön"],s=Math.max(...e,1);return e.map((a,o)=>`
            <div class="bar-item">
                <div class="bar" style="height: ${a/s*100}px;" data-value="${a}"></div>
                <span class="bar-label">${t[o]}</span>
            </div>
        `).join("")},createSkillItems(e){const t={vocab:{name:"Ordförråd",icon:"📚"},grammar:{name:"Grammatik",icon:"📖"},listening:{name:"Lyssna",icon:"👂"},puzzle:{name:"Pussel",icon:"🧩"}};return Object.entries(e).map(([s,a])=>{var o,i;return`
            <div class="skill-item">
                <div class="skill-icon" style="background: rgba(99, 102, 241, 0.2);">
                    ${((o=t[s])==null?void 0:o.icon)||"📊"}
                </div>
                <div class="skill-info">
                    <div class="skill-name">${((i=t[s])==null?void 0:i.name)||s}</div>
                    <div class="skill-bar-bg">
                        <div class="skill-bar-fill ${s}" style="width: ${a}%;"></div>
                    </div>
                </div>
            </div>
        `}).join("")}},D={intervalMinutes:30,timer:null,startTime:0,init(){this.startTime=Date.now(),this.scheduleReminder()},scheduleReminder(){this.timer&&clearTimeout(this.timer),this.timer=setTimeout(()=>{this.showReminder()},this.intervalMinutes*60*1e3)},showReminder(){var t,s;const e=document.createElement("div");e.className="break-reminder-overlay",e.id="breakReminder",e.innerHTML=`
            <div class="break-reminder-content">
                <div class="break-icon">☕</div>
                <h2 class="break-title">Dags för en paus! / وقت الراحة!</h2>
                <p class="break-message">
                    Du har spelat i ${this.intervalMinutes} minuter. 
                    Ta en kort paus för att vila ögonen.
                </p>
                <div class="break-timer" id="breakTimer">05:00</div>
                <div class="break-actions">
                    <button class="break-btn break-btn-primary" id="startBreak">Starta paus</button>
                    <button class="break-btn break-btn-secondary" id="skipBreak">Hoppa över</button>
                </div>
            </div>
        `,document.body.appendChild(e),(t=document.getElementById("startBreak"))==null||t.addEventListener("click",()=>{this.startBreakTimer()}),(s=document.getElementById("skipBreak"))==null||s.addEventListener("click",()=>{this.dismiss()})},startBreakTimer(){let e=300;const t=document.getElementById("breakTimer"),s=setInterval(()=>{if(e--,t){const a=Math.floor(e/60),o=e%60;t.textContent=`${a.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}e<=0&&(clearInterval(s),this.dismiss(),typeof window.showToast=="function"&&window.showToast("☕ Paus klar! Bra jobbat!","success"))},1e3)},dismiss(){const e=document.getElementById("breakReminder");e&&(e.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>e.remove(),300)),this.scheduleReminder()}},R={isActive:!1,init(){this.isActive=localStorage.getItem("eyeCareMode")==="true",this.isActive&&document.body.classList.add("eye-care-mode")},createToggle(){if(document.querySelector(".eye-care-toggle"))return;const t=document.createElement("button");t.className="eye-care-toggle",t.title="Eye Care Mode",t.innerHTML=`
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `,t.addEventListener("click",()=>this.toggle()),document.body.appendChild(t)},toggle(){this.isActive=!this.isActive,document.body.classList.toggle("eye-care-mode",this.isActive),localStorage.setItem("eyeCareMode",String(this.isActive)),typeof window.showToast=="function"&&window.showToast(this.isActive?"👁️ Eye Care aktiverat":"👁️ Eye Care avaktiverat","info")}},G={messages:["Lycka till! 🍀","Du klarar det! 💪","Fortsätt så! 🌟","Imponerande! 👏","Bra jobbat! 🎉","Du är grym! 🔥"],init(){},getRandomMessage(){return this.messages[Math.floor(Math.random()*this.messages.length)]},speak(){const e=document.getElementById("mascotSpeech");e&&(e.textContent=this.getRandomMessage(),e.style.opacity="1",setTimeout(()=>{e.style.opacity="0"},2e3)),"vibrate"in navigator&&navigator.vibrate(10)}},F={players:[{name:"Erik S.",score:2450,emoji:"🧑"},{name:"Sara A.",score:2180,emoji:"👩"},{name:"Mohammed K.",score:1950,emoji:"🧔"},{name:"Lisa N.",score:1820,emoji:"👧"},{name:"Du",score:0,emoji:"⭐",isCurrentUser:!0}],init(){const e=document.querySelector(".leaderboard-section");if(!e||document.querySelector(".leaderboard-widget"))return;const s=this.getUserScore();this.players[4].score=s,this.players.sort((o,i)=>i.score-o.score);const a=this.createWidget();e.appendChild(a)},getUserScore(){const e=localStorage.getItem("userProgress");return e&&JSON.parse(e).totalScore||0},createWidget(){const e=document.createElement("div");return e.className="leaderboard-widget",e.innerHTML=`
            <div class="leaderboard-header">
                <h3 class="leaderboard-title">🏆 Veckans Topplista</h3>
            </div>
            ${this.players.slice(0,5).map((t,s)=>`
                <div class="leaderboard-entry ${t.isCurrentUser?"current-user":""}">
                    <div class="leaderboard-rank ${s<3?"rank-"+(s+1):"rank-other"}">
                        ${s+1}
                    </div>
                    <div class="leaderboard-avatar">${t.emoji}</div>
                    <span class="leaderboard-name">${t.name}</span>
                    <span class="leaderboard-score">${t.score}</span>
                </div>
            `).join("")}
        `,e}},H={recommendations:[{game:"memory",reason:"Bra för att träna minnet",reasonAr:"جيد لتدريب الذاكرة"},{game:"grammar",reason:"Förbättra din grammatik",reasonAr:"حسّن قواعدك"},{game:"listening",reason:"Träna hörförståelse",reasonAr:"درب مهارة الاستماع"},{game:"vokaler",reason:"Lär dig svenska ljud",reasonAr:"تعلم الأصوات السويدية"}],init(){const e=document.querySelector(".games-container");if(!e||document.querySelector(".ai-recommendation"))return;const s=this.getRecommendation(),a=this.createWidget(s),o=document.querySelector(".category-filter-container");o&&e.insertBefore(a,o.nextSibling)},getRecommendation(){return this.recommendations[Math.floor(Math.random()*this.recommendations.length)]},createWidget(e){const t=document.createElement("div");return t.className="ai-recommendation",t.innerHTML=`
            <div class="ai-icon">🤖</div>
            <div class="ai-content">
                <div class="ai-label">AI Förslag / اقتراح ذكي</div>
                <div class="ai-message">${e.reason}</div>
            </div>
            <svg class="ai-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        `,t.addEventListener("click",()=>{const s=document.querySelector(`[data-game-id="${e.game}"]`);s&&(s.scrollIntoView({behavior:"smooth",block:"center"}),s.style.animation="pulse 0.5s ease")}),t}},me={init(){const e=new IntersectionObserver(t=>{t.forEach(s=>{s.isIntersecting&&(s.target.classList.add("bounce-scroll"),e.unobserve(s.target))})},{threshold:.1});document.querySelectorAll(".game-card-item").forEach(t=>{e.observe(t)})}};document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{C.init(),B.init(),I.init(),$.init(),P.init(),G.init(),q.init(),N.init(),F.init(),H.init(),D.init(),R.init(),O.init(),me.init()},800)});typeof window<"u"&&(window.TiltEffect=C,window.DifficultyIndicator=B,window.LastPlayedBadge=I,window.RecommendationStars=$,window.ParticleBackground=P,window.LivePlayersCounter=q,window.MotivationalQuotes=N,window.ProgressDashboard=O,window.BreakReminder=D,window.EyeCareMode=R,window.GameMascot=G,window.WeeklyLeaderboard=F,window.AIRecommendations=H);const j={isOpen:!1,menuElement:null,menuItems:[{id:"focus-mode",icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>`,label:"Fokusläge",labelAr:"وضع التركيز",color:"#22c55e",action:"toggleFocusMode"},{id:"eye-care",icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>`,label:"Ögonvård",labelAr:"حماية العين",color:"#fbbf24",action:"toggleEyeCare"},{id:"pomodoro",icon:"⏱️",label:"Pomodoro",labelAr:"مؤقت بومودورو",color:"#8b5cf6",action:"togglePomodoro"},{id:"sound",icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>`,label:"Ljud",labelAr:"الصوت",color:"#3b82f6",action:"toggleSound"},{id:"mascot",icon:"🦉",label:"Hjälpare",labelAr:"المساعد",color:"#f97316",action:"showMascotMessage"}],init(){this.removeScatteredButtons(),this.createMenu(),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.close()})},removeScatteredButtons(){[".focus-mode-toggle",".eye-care-toggle",".sound-toggle",".pomodoro-toggle",".game-mascot"].forEach(t=>{document.querySelectorAll(t).forEach(s=>s.remove())})},createMenu(){if(document.querySelector(".fab-menu-container"))return;const t=document.createElement("div");t.className="fab-menu-container",t.innerHTML=`
            <!-- Backdrop -->
            <div class="fab-menu-backdrop" id="fabBackdrop"></div>
            
            <!-- Menu Items -->
            <div class="fab-menu-items" id="fabMenuItems">
                ${this.menuItems.map((s,a)=>`
                    <div class="fab-menu-item" data-action="${s.action}" style="--item-index: ${a}; --item-color: ${s.color}">
                        <span class="fab-menu-item-label">${s.label}</span>
                        <div class="fab-menu-item-btn" style="background: linear-gradient(135deg, ${s.color}, ${this.darkenColor(s.color)})">
                            ${s.icon}
                        </div>
                    </div>
                `).join("")}
            </div>
            
            <!-- Main FAB Button -->
            <button class="fab-main-btn" id="fabMainBtn" aria-label="Settings Menu">
                <span class="fab-main-icon fab-main-icon-menu">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="3"/>
                        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
                    </svg>
                </span>
                <span class="fab-main-icon fab-main-icon-close">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </span>
            </button>
        `,document.body.appendChild(t),this.menuElement=t,this.bindEvents()},bindEvents(){const e=document.getElementById("fabMainBtn"),t=document.getElementById("fabBackdrop"),s=document.querySelectorAll(".fab-menu-item");e==null||e.addEventListener("click",()=>this.toggle()),t==null||t.addEventListener("click",()=>this.close()),s.forEach(a=>{a.addEventListener("click",o=>{const i=o.currentTarget.getAttribute("data-action");i&&(this.executeAction(i),this.close())})})},toggle(){this.isOpen?this.close():this.open()},open(){var e;this.isOpen=!0,(e=this.menuElement)==null||e.classList.add("open"),"vibrate"in navigator&&navigator.vibrate(10)},close(){var e;this.isOpen=!1,(e=this.menuElement)==null||e.classList.remove("open")},executeAction(e){switch(e){case"toggleFocusMode":this.toggleFocusMode();break;case"toggleEyeCare":this.toggleEyeCare();break;case"togglePomodoro":this.togglePomodoro();break;case"toggleSound":this.toggleSound();break;case"showMascotMessage":this.showMascotMessage();break}},toggleFocusMode(){const e=document.body.classList.toggle("focus-mode");localStorage.setItem("focusMode",String(e)),"vibrate"in navigator&&navigator.vibrate(e?[20,50,20]:10),this.showToast(e?"Fokusläge aktiverat ✨ / وضع التركيز مفعّل":"Fokusläge avaktiverat / وضع التركيز معطّل",e?"success":"info")},toggleEyeCare(){const e=document.body.classList.toggle("eye-care-mode");localStorage.setItem("eyeCareMode",String(e)),this.showToast(e?"👁️ Ögonvård aktiverat / حماية العين مفعّلة":"👁️ Ögonvård avaktiverat / حماية العين معطّلة","info")},togglePomodoro(){const e=document.querySelector(".pomodoro-widget");e?e.classList.toggle("visible"):typeof window.PomodoroTimer<"u"&&window.PomodoroTimer.toggleWidget()},toggleSound(){const t=!(localStorage.getItem("soundEnabled")!=="false");localStorage.setItem("soundEnabled",String(t)),this.showToast(t?"🔊 Ljud på / الصوت مفعّل":"🔇 Ljud av / الصوت مكتوم","info"),t&&typeof window.SoundEffects<"u"&&window.SoundEffects.play("click")},showMascotMessage(){const e=["Lycka till! 🍀 / حظاً سعيداً!","Du klarar det! 💪 / ستنجح!","Fortsätt så! 🌟 / استمر!","Imponerande! 👏 / رائع!","Bra jobbat! 🎉 / أحسنت!","Du är grym! 🔥 / أنت رائع!"],t=e[Math.floor(Math.random()*e.length)];this.showToast(t,"success"),"vibrate"in navigator&&navigator.vibrate(10)},showToast(e,t="info"){if(typeof window.showToast=="function")window.showToast(e,t);else{const s=document.querySelector(".toast-notification.visible");s&&s.remove();let a=document.getElementById("toast");a||(a=document.createElement("div"),a.id="toast",a.className="toast-notification",document.body.appendChild(a)),a.textContent=e,a.className=`toast-notification visible ${t}`,setTimeout(()=>{a.classList.remove("visible")},3e3)}},darkenColor(e,t=20){const s=parseInt(e.replace("#",""),16),a=Math.round(2.55*t),o=(s>>16)-a,i=(s>>8&255)-a,n=(s&255)-a;return"#"+(16777216+(o<255?o<1?0:o:255)*65536+(i<255?i<1?0:i:255)*256+(n<255?n<1?0:n:255)).toString(16).slice(1)}},ue=`
/* FAB Menu Container */
.fab-menu-container {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 9999;
}

/* Backdrop */
.fab-menu-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: -1;
}

.fab-menu-container.open .fab-menu-backdrop {
    opacity: 1;
    visibility: visible;
}

/* Main FAB Button */
.fab-main-btn {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
        0 4px 20px rgba(99, 102, 241, 0.5),
        0 0 0 4px rgba(99, 102, 241, 0.2);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    z-index: 10;
}

.fab-main-btn:hover {
    transform: scale(1.08);
    box-shadow: 
        0 6px 30px rgba(99, 102, 241, 0.6),
        0 0 0 6px rgba(99, 102, 241, 0.3);
}

.fab-main-btn:active {
    transform: scale(0.95);
}

.fab-main-icon {
    position: absolute;
    width: 28px;
    height: 28px;
    transition: all 0.3s ease;
}

.fab-main-icon svg {
    width: 100%;
    height: 100%;
    color: white;
}

.fab-main-icon-menu {
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

.fab-main-icon-close {
    opacity: 0;
    transform: rotate(-90deg) scale(0.5);
}

.fab-menu-container.open .fab-main-icon-menu {
    opacity: 0;
    transform: rotate(90deg) scale(0.5);
}

.fab-menu-container.open .fab-main-icon-close {
    opacity: 1;
    transform: rotate(0deg) scale(1);
}

/* Menu Items Container */
.fab-menu-items {
    position: absolute;
    bottom: 70px;
    right: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: flex-end;
    pointer-events: none;
}

.fab-menu-container.open .fab-menu-items {
    pointer-events: auto;
}

/* Individual Menu Item */
.fab-menu-item {
    display: flex;
    align-items: center;
    gap: 12px;
    opacity: 0;
    transform: translateY(20px) scale(0.8);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transition-delay: calc(var(--item-index) * 50ms);
}

.fab-menu-container.open .fab-menu-item {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.fab-menu-item-label {
    background: rgba(30, 41, 59, 0.95);
    color: white;
    padding: 8px 14px;
    border-radius: 10px;
    font-size: 0.9rem;
    font-weight: 600;
    white-space: nowrap;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    opacity: 0;
    transform: translateX(10px);
    transition: all 0.2s ease;
}

.fab-menu-item:hover .fab-menu-item-label {
    opacity: 1;
    transform: translateX(0);
}

.fab-menu-item-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 
        0 4px 15px rgba(0, 0, 0, 0.3),
        0 0 0 3px rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
}

.fab-menu-item-btn svg {
    width: 22px;
    height: 22px;
    color: white;
}

.fab-menu-item-btn:hover {
    transform: scale(1.15);
    box-shadow: 
        0 6px 20px rgba(0, 0, 0, 0.4),
        0 0 0 4px rgba(255, 255, 255, 0.2);
}

/* Pulse animation for main button */
@keyframes fabPulse {
    0%, 100% {
        box-shadow: 
            0 4px 20px rgba(99, 102, 241, 0.5),
            0 0 0 4px rgba(99, 102, 241, 0.2);
    }
    50% {
        box-shadow: 
            0 4px 30px rgba(99, 102, 241, 0.7),
            0 0 0 8px rgba(99, 102, 241, 0.15);
    }
}

.fab-main-btn {
    animation: fabPulse 3s ease-in-out infinite;
}

.fab-menu-container.open .fab-main-btn {
    animation: none;
    background: linear-gradient(135deg, #ef4444, #dc2626);
}

/* Mobile optimizations */
@media (max-width: 768px) {
    .fab-menu-container {
        bottom: 20px;
        right: 20px;
    }
    
    .fab-main-btn {
        width: 54px;
        height: 54px;
    }
    
    .fab-menu-item-btn {
        width: 44px;
        height: 44px;
    }
    
    .fab-menu-item-label {
        display: block;
        opacity: 1;
        transform: translateX(0);
    }
}
`;function ge(){const e="fab-menu-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=ue,document.head.appendChild(t)}document.addEventListener("DOMContentLoaded",()=>{ge(),setTimeout(()=>{j.init()},1e3)});typeof window<"u"&&(window.FABMenu=j);
