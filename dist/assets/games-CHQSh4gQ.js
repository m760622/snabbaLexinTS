import"./modulepreload-polyfill-B5Qt9EMX.js";/* empty css              *//* empty css                            */import{showToast as O}from"./utils-CfsGp8IC.js";import{s as D}from"./tts-CfZZetlp.js";import{A as p}from"./config-C2usAgi3.js";import{L as G}from"./i18n-D0OWfz62.js";import{C as R}from"./ui-enhancements-DNIZEc2q.js";import{T as F}from"./toast-manager-B6dAfcdf.js";import"./pwa-Bn3RWWLO.js";function j(){console.log("[GamesUI] Initializing..."),y(),b(),w(),k(),U(),X(),requestAnimationFrame(()=>{K()}),window.dictionaryData?v():window.addEventListener("dictionaryLoaded",()=>v(),{once:!0}),window.filterGames=z,window.openDailyChallenge=W,window.updateGameScore=Z,window.updateGamesStats=H,window.trackGamePlayed=Q}function U(){const e=document.getElementById("mobileToggle");e&&e.addEventListener("click",()=>{var t;(t=window.MobileViewManager)==null||t.toggle()})}function X(){"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("../sw.js").then(e=>{console.log("SW registered: ",e),e.update()}).catch(e=>{console.error("SW registration failed: ",e)})})}function y(){const e=JSON.parse(localStorage.getItem("gamesStats")||'{"gamesPlayed": 0, "winStreak": 0, "totalScore": 0}'),t=document.getElementById("gamesPlayedStat"),a=document.getElementById("winStreakStat"),s=document.getElementById("totalScoreStat");t&&(t.textContent=e.gamesPlayed||0),a&&(a.textContent=e.winStreak||0),s&&(s.textContent=e.totalScore||0)}function H(e,t=0){const a=JSON.parse(localStorage.getItem("gamesStats")||'{"gamesPlayed": 0, "winStreak": 0, "totalScore": 0}');a.gamesPlayed++,a.totalScore+=t,e?a.winStreak++:a.winStreak=0,localStorage.setItem("gamesStats",JSON.stringify(a)),y(),V()}function b(){var s;const e=new Date().toISOString().split("T")[0];let t=JSON.parse(localStorage.getItem("dailyGameChallenge")||"{}");t.date!==e&&(t={date:e,gamesPlayed:0,completed:!1},localStorage.setItem("dailyGameChallenge",JSON.stringify(t)));const a=document.getElementById("dailyProgress");a&&(a.textContent=`${t.gamesPlayed}/3`),t.completed&&((s=document.getElementById("dailyChallengeBanner"))==null||s.classList.add("completed"))}function V(){const e=new Date().toISOString().split("T")[0];let t=JSON.parse(localStorage.getItem("dailyGameChallenge")||"{}");if(t.date!==e&&(t={date:e,gamesPlayed:0,completed:!1}),!t.completed){if(t.gamesPlayed++,t.gamesPlayed>=3){t.completed=!0;const a=JSON.parse(localStorage.getItem("gamesStats")||"{}");a.totalScore=(a.totalScore||0)+100,localStorage.setItem("gamesStats",JSON.stringify(a)),O('<span class="sv-text">🎉 Daglig utmaning klar! +100 poäng</span><span class="ar-text">🎉 تحدي اليوم مكتمل! +100 نقطة</span>')}localStorage.setItem("dailyGameChallenge",JSON.stringify(t))}b()}function W(){const e=document.querySelector(".game-cards-grid");e&&e.scrollIntoView({behavior:"smooth"})}const J={vocab:["Vokaler","Neon Search","Hangman","Memory","Minneskor","Bokstav Länk","Ord Hjulet","Svenska Wordle","Gissa Ordet"],grammar:["Grammatik","Bygg Meningen","Fyll i"],listening:["Lyssna","Uttalscoach"],puzzle:["Lås Upp","Neon Blocks","Ord-Regn"]};function z(e){var a;document.querySelectorAll(".category-chip").forEach(s=>s.classList.remove("active")),(a=document.querySelector(`[data-cat="${e}"]`))==null||a.classList.add("active"),document.querySelectorAll(".game-card-item").forEach(s=>{var n;const o=((n=s.querySelector("h3"))==null?void 0:n.textContent)||"";if(e==="all")s.style.display="";else{const r=(J[e]||[]).some(l=>o.includes(l));s.style.display=r?"":"none"}})}function w(){const e=JSON.parse(localStorage.getItem("gameScores")||"{}");document.querySelectorAll(".game-stars").forEach(t=>{const a=t.dataset.game;if(!a)return;const s=e[a]||0;let o=0;s>=100?o=3:s>=50?o=2:s>=10&&(o=1),o>0&&t.setAttribute("data-stars",o.toString())})}function Z(e,t){const a=JSON.parse(localStorage.getItem("gameScores")||"{}"),s=a[e]||0;t>s&&(a[e]=t,localStorage.setItem("gameScores",JSON.stringify(a))),w()}function k(){const e=JSON.parse(localStorage.getItem("gamesStats")||"{}"),t=new Date().toISOString().split("T")[0],a=Y(),s=e.bestStreak||e.winStreak||0,o=document.getElementById("bestStreak");o&&(o.textContent=s);const n=JSON.parse(localStorage.getItem("dailyGamesLog")||"{}"),i=n[t]||0,r=document.getElementById("todayGames");r&&(r.textContent=i);let l=0;Object.keys(n).forEach(d=>{d>=a&&(l+=n[d])});const c=document.getElementById("weeklyGames");c&&(c.textContent=l.toString())}function Y(){const e=new Date,t=e.getDay(),a=e.getDate()-t+(t===0?-6:1);return new Date(e.setDate(a)).toISOString().split("T")[0]}function Q(){const e=new Date().toISOString().split("T")[0],t=JSON.parse(localStorage.getItem("dailyGamesLog")||"{}");t[e]=(t[e]||0)+1,localStorage.setItem("dailyGamesLog",JSON.stringify(t));const a=JSON.parse(localStorage.getItem("gamesStats")||"{}");(!a.bestStreak||a.winStreak>a.bestStreak)&&(a.bestStreak=a.winStreak,localStorage.setItem("gamesStats",JSON.stringify(a))),k()}function v(){const e=window.dictionaryData;if(!e||!e.length)return;const t=new Date().toISOString().split("T")[0];let a=JSON.parse(localStorage.getItem("wotd_cache")||"{}");if(a.date!==t){const c=Math.floor(Math.random()*e.length);let d=e[c];for(let f=0;f<10&&!d[p.COLUMNS.EXAMPLE_SWE];f++)d=e[Math.floor(Math.random()*e.length)];a={date:t,word:d},localStorage.setItem("wotd_cache",JSON.stringify(a))}const s=a.word;if(!s)return;const o=document.getElementById("wordOfTheDay");o&&(o.style.display="block");const n=document.getElementById("wotd-swedish"),i=document.getElementById("wotd-arabic"),r=document.getElementById("wotd-example");n&&(n.textContent=s[p.COLUMNS.SWEDISH]),i&&(i.textContent=s[p.COLUMNS.ARABIC]),r&&(r.innerHTML=s[p.COLUMNS.EXAMPLE_SWE]||'<span class="sv-text">Ingen exempelmening</span><span class="ar-text">لا يوجد مثال</span>');const l=document.getElementById("wotd-speak-btn");l&&(l.onclick=c=>{c.stopPropagation(),D(s[p.COLUMNS.SWEDISH]);const d=l.querySelector("svg");d&&(d.style.fill="#fff"),setTimeout(()=>{d&&(d.style.fill="none")},1e3)})}function K(){const e=document.querySelectorAll(".game-card-item");e.length&&e.forEach(t=>{const a=t;a.addEventListener("mousemove",s=>{const o=a.getBoundingClientRect(),n=s.clientX-o.left,i=s.clientY-o.top,r=o.width/2,l=o.height/2,c=(i-l)/l*-8,d=(n-r)/r*8;a.style.transform=`perspective(1000px) rotateX(${c}deg) rotateY(${d}deg) scale(1.02)`}),a.addEventListener("mouseleave",()=>{a.style.transform="perspective(1000px) rotateX(0) rotateY(0) scale(1)"})})}typeof window<"u"&&document.addEventListener("DOMContentLoaded",()=>{G.init(),j()});const S={isActive:!1,init(){this.isActive=localStorage.getItem("focusMode")==="true",this.isActive&&document.body.classList.add("focus-mode")},createToggleButton(){if(document.querySelector(".focus-mode-toggle"))return;const t=document.createElement("button");t.className="focus-mode-toggle",t.setAttribute("aria-label","Toggle Focus Mode"),t.innerHTML=`
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
        `,t.addEventListener("click",()=>this.toggle()),document.body.appendChild(t)},toggle(){this.isActive=!this.isActive,document.body.classList.toggle("focus-mode",this.isActive),localStorage.setItem("focusMode",String(this.isActive)),"vibrate"in navigator&&navigator.vibrate(this.isActive?[20,50,20]:10),u(this.isActive?"Fokusläge aktiverat ✨":"Fokusläge avaktiverat",this.isActive?"success":"info")}},m={xpPerLevel:100,levelMultiplier:1.5,getProgress(){const e=localStorage.getItem("userProgress");return e?JSON.parse(e):{xp:0,level:1,streak:0,gamesPlayed:0,totalScore:0,wordsLearned:0,timeSpent:0,achievements:[],lastPlayDate:"",dailyGoalsCompleted:0}},saveProgress(e){localStorage.setItem("userProgress",JSON.stringify(e))},getXPForLevel(e){return Math.floor(this.xpPerLevel*Math.pow(this.levelMultiplier,e-1))},addXP(e){const t=this.getProgress();t.xp+=e;const a=this.getXPForLevel(t.level);let s=!1;for(;t.xp>=a;)t.xp-=a,t.level++,s=!0;return this.saveProgress(t),s&&this.showLevelUp(t.level),{newLevel:s,level:t.level,totalXP:t.xp}},showLevelUp(e){const t=document.createElement("div");t.className="level-up-overlay",t.innerHTML=`
            <div class="level-up-content">
                <div class="level-up-icon">🎉</div>
                <h2 class="level-up-title">Nivå ${e}!</h2>
                <p class="level-up-subtitle">Du har gått upp en nivå!</p>
                <div class="level-stars">
                    ${'<span class="level-star">⭐</span>'.repeat(Math.min(e,5))}
                </div>
            </div>
        `,document.body.appendChild(t),g.play("levelUp"),"vibrate"in navigator&&navigator.vibrate([50,100,50,100,50]),setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),500)},3e3)},createXPBar(e){const t=this.getProgress(),a=this.getXPForLevel(t.level),s=t.xp/a*100,o=document.createElement("div");o.className="xp-widget",o.innerHTML=`
            <div class="xp-header">
                <span class="xp-level">Nivå ${t.level}</span>
                <span class="xp-text">${t.xp}/${a} XP</span>
            </div>
            <div class="xp-progress-container">
                <div class="xp-progress-bar" style="width: ${s}%">
                    <div class="xp-progress-glow"></div>
                </div>
            </div>
        `,e.insertBefore(o,e.firstChild)}},x={list:[{id:"first-game",name:"Första Steget",nameAr:"الخطوة الأولى",description:"Spela ditt första spel",icon:"🎮",requirement:1,type:"games",unlocked:!1},{id:"ten-games",name:"Spelentusiast",nameAr:"عاشق الألعاب",description:"Spela 10 spel",icon:"🎯",requirement:10,type:"games",unlocked:!1},{id:"fifty-games",name:"Mästare",nameAr:"محترف",description:"Spela 50 spel",icon:"👑",requirement:50,type:"games",unlocked:!1},{id:"streak-3",name:"På Rulle",nameAr:"متواصل",description:"3 dagars streak",icon:"🔥",requirement:3,type:"streak",unlocked:!1},{id:"streak-7",name:"Vecko-Hjälte",nameAr:"بطل الأسبوع",description:"7 dagars streak",icon:"💪",requirement:7,type:"streak",unlocked:!1},{id:"streak-30",name:"Månads-Legend",nameAr:"أسطورة الشهر",description:"30 dagars streak",icon:"🏆",requirement:30,type:"streak",unlocked:!1},{id:"score-100",name:"Poängjägare",nameAr:"صياد النقاط",description:"Få 100 poäng totalt",icon:"⭐",requirement:100,type:"score",unlocked:!1},{id:"score-1000",name:"Poäng-Kung",nameAr:"ملك النقاط",description:"Få 1000 poäng totalt",icon:"👸",requirement:1e3,type:"score",unlocked:!1},{id:"words-50",name:"Ordsamlare",nameAr:"جامع الكلمات",description:"Lär dig 50 ord",icon:"📚",requirement:50,type:"words",unlocked:!1},{id:"words-200",name:"Ordväktare",nameAr:"حارس الكلمات",description:"Lär dig 200 ord",icon:"📖",requirement:200,type:"words",unlocked:!1},{id:"time-60",name:"Dedikerad",nameAr:"مكرّس",description:"Spela i 60 minuter",icon:"⏰",requirement:60,type:"time",unlocked:!1},{id:"time-300",name:"Tidsmästare",nameAr:"سيد الوقت",description:"Spela i 5 timmar",icon:"⌛",requirement:300,type:"time",unlocked:!1}],loadUnlocked(){const e=m.getProgress();this.list.forEach(t=>{t.unlocked=e.achievements.includes(t.id)})},check(){const e=m.getProgress(),t=[];return this.list.forEach(a=>{if(a.unlocked)return;let s=0;switch(a.type){case"games":s=e.gamesPlayed;break;case"streak":s=e.streak;break;case"score":s=e.totalScore;break;case"words":s=e.wordsLearned;break;case"time":s=e.timeSpent;break}s>=a.requirement&&(a.unlocked=!0,a.unlockedAt=new Date().toISOString(),e.achievements.push(a.id),t.push(a))}),t.length>0&&(m.saveProgress(e),t.forEach(a=>this.showUnlock(a))),t},showUnlock(e){const t=document.createElement("div");t.className="achievement-popup",t.innerHTML=`
            <div class="achievement-popup-badge">
                <div class="achievement-badge unlocked">
                    <div class="achievement-badge-inner">${e.icon}</div>
                    <div class="achievement-badge-shine"></div>
                </div>
            </div>
            <h3 class="achievement-popup-title">${e.name}</h3>
            <p class="achievement-popup-desc">${e.description}</p>
        `,document.body.appendChild(t),g.play("achievement"),"vibrate"in navigator&&navigator.vibrate([30,50,30,50,30]),setTimeout(()=>{t.style.animation="fadeOut 0.5s ease forwards",setTimeout(()=>t.remove(),500)},3500)},showBadges(e){this.loadUnlocked();const t=document.createElement("div");t.className="achievements-grid",t.style.cssText="display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; padding: 16px;",this.list.forEach(a=>{const s=document.createElement("div");s.className=`achievement-badge ${a.unlocked?"unlocked":"locked"}`,s.innerHTML=`
                <div class="achievement-badge-inner">${a.icon}</div>
                ${a.unlocked?'<div class="achievement-badge-shine"></div>':""}
            `,s.title=`${a.name}: ${a.description}`,t.appendChild(s)}),e.appendChild(t)}},h={goals:[{id:"play-3",name:"Spela 3 spel",nameAr:"العب 3 ألعاب",description:"Spela 3 spel idag",icon:"🎮",target:3,current:0,xpReward:20,completed:!1},{id:"score-50",name:"Få 50 poäng",nameAr:"احصل على 50 نقطة",description:"Samla 50 poäng",icon:"⭐",target:50,current:0,xpReward:30,completed:!1},{id:"streak",name:"Behåll streak",nameAr:"حافظ على السلسلة",description:"Logga in och spela",icon:"🔥",target:1,current:0,xpReward:15,completed:!1}],load(){const e=new Date().toDateString(),t=localStorage.getItem("dailyGoals"),a=t?JSON.parse(t):null;a&&a.date===e?this.goals=a.goals:(this.goals.forEach(s=>{s.current=0,s.completed=!1}),this.save())},save(){localStorage.setItem("dailyGoals",JSON.stringify({date:new Date().toDateString(),goals:this.goals}))},updateProgress(e,t){this.load();let a=!1;this.goals.forEach(s=>{s.completed||(e==="games"&&s.id==="play-3"||e==="score"&&s.id==="score-50"||e==="streak"&&s.id==="streak")&&(s.current=Math.min(s.current+t,s.target),s.current>=s.target&&!s.completed&&(s.completed=!0,this.showGoalComplete(s),m.addXP(s.xpReward)),a=!0)}),a&&this.save()},showGoalComplete(e){u(`🎯 ${e.name} - +${e.xpReward} XP!`,"success"),g.play("success")},render(e){this.load();const t=document.createElement("div");t.className="daily-goals-widget glass-card";const a=this.goals.filter(s=>s.completed).length;t.innerHTML=`
            <div class="daily-goals-header">
                <h3 class="daily-goals-title">🎯 Dagens Mål</h3>
                <span class="daily-goals-progress">${a}/${this.goals.length}</span>
            </div>
            ${this.goals.map(s=>`
                <div class="daily-goal-item ${s.completed?"completed":""}">
                    <div class="daily-goal-icon" style="background: ${s.completed?"#4ade80":"#6366f1"}20;">
                        ${s.icon}
                    </div>
                    <div class="daily-goal-info">
                        <div class="daily-goal-name">${s.name}</div>
                        <div class="daily-goal-desc">${s.current}/${s.target}</div>
                    </div>
                    <div class="daily-goal-reward">+${s.xpReward} XP</div>
                </div>
            `).join("")}
        `,e.appendChild(t)}},_={rewards:[{type:"xp",value:10,icon:"✨",name:"10 XP"},{type:"xp",value:25,icon:"⭐",name:"25 XP"},{type:"xp",value:50,icon:"💫",name:"50 XP"},{type:"xp",value:100,icon:"🌟",name:"100 XP"},{type:"streak-freeze",value:1,icon:"❄️",name:"Streak Freeze"},{type:"double-xp",value:1,icon:"🔥",name:"Dubbel XP (1 spel)"}],canOpen(){const e=m.getProgress();if(!e.mysteryBoxLastOpened)return!0;const t=new Date(e.mysteryBoxLastOpened);return(new Date().getTime()-t.getTime())/(1e3*60*60)>=24},open(){if(!this.canOpen())return u("Vänta till imorgon för nästa låda! 📦","info"),null;const e=this.rewards[Math.floor(Math.random()*this.rewards.length)],t=m.getProgress();return t.mysteryBoxLastOpened=new Date().toISOString(),m.saveProgress(t),e.type==="xp"&&m.addXP(e.value),this.showReward(e),e},showReward(e){const t=document.createElement("div");t.className="level-up-overlay",t.innerHTML=`
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
            `,"vibrate"in navigator&&navigator.vibrate([50,100,50])},1e3),setTimeout(()=>{t.classList.add("fade-out"),setTimeout(()=>t.remove(),500)},2e3)},render(e){const t=this.canOpen(),a=document.createElement("div");a.style.cssText="display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 20px;",a.innerHTML=`
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
        `,e.appendChild(a);const s=a.querySelector("#mysteryBox");s&&t&&s.addEventListener("click",()=>this.open())}},A={isRunning:!1,isPaused:!1,timeLeft:25*60,sessionLength:25*60,breakLength:5*60,isBreak:!1,sessionsCompleted:0,interval:null,widget:null,init(){this.createWidget()},createToggleButton(){const e=document.createElement("button");e.className="pomodoro-toggle",e.style.cssText=`
            position: fixed;
            bottom: 90px;
            right: 24px;
            width: 48px;
            height: 48px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3b82f6, #0ea5e9);
            border: none;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 998;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
            transition: transform 0.3s ease;
        `,e.innerHTML="⏱️",e.addEventListener("click",()=>this.toggleWidget()),document.body.appendChild(e)},createWidget(){var t,a,s;const e=document.createElement("div");e.className="pomodoro-widget",e.innerHTML=`
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
        `,document.body.appendChild(e),this.widget=e,(t=e.querySelector(".pomodoro-close"))==null||t.addEventListener("click",()=>this.toggleWidget()),(a=e.querySelector("#pomodoroStart"))==null||a.addEventListener("click",()=>this.toggleTimer()),(s=e.querySelector("#pomodoroReset"))==null||s.addEventListener("click",()=>this.reset())},toggleWidget(){this.widget&&this.widget.classList.toggle("visible")},toggleTimer(){this.isRunning?this.pause():this.start()},start(){this.isRunning=!0,this.isPaused=!1;const e=document.querySelector("#pomodoroStart");e&&(e.textContent="Paus"),this.interval=setInterval(()=>{this.timeLeft--,this.updateDisplay(),this.timeLeft<=0&&this.completeSession()},1e3),g.play("click")},pause(){this.isRunning=!1,this.isPaused=!0,this.interval&&clearInterval(this.interval);const e=document.querySelector("#pomodoroStart");e&&(e.textContent="Fortsätt")},reset(){this.isRunning=!1,this.isPaused=!1,this.interval&&clearInterval(this.interval),this.timeLeft=this.isBreak?this.breakLength:this.sessionLength,this.updateDisplay();const e=document.querySelector("#pomodoroStart");e&&(e.textContent="Start")},completeSession(){this.interval&&clearInterval(this.interval),this.isRunning=!1,this.isBreak?(u("☕ Paus klar! Tillbaka till jobbet!","info"),this.isBreak=!1,this.timeLeft=this.sessionLength):(this.sessionsCompleted++,this.updateSessionDots(),m.addXP(10),u("🍅 Pomodoro klar! +10 XP","success"),this.isBreak=!0,this.timeLeft=this.breakLength),this.updateDisplay(),g.play("notification"),"vibrate"in navigator&&navigator.vibrate([100,50,100]);const e=document.querySelector("#pomodoroStart");e&&(e.textContent="Start")},updateDisplay(){const e=Math.floor(this.timeLeft/60),t=this.timeLeft%60,a=`${e.toString().padStart(2,"0")}:${t.toString().padStart(2,"0")}`,s=document.querySelector("#pomodoroTime");s&&(s.textContent=a)},updateSessionDots(){document.querySelectorAll(".pomodoro-session-dot").forEach((t,a)=>{a<this.sessionsCompleted&&t.classList.add("completed")})}},g={enabled:!0,volume:.5,sounds:{success:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",error:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",click:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",achievement:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",levelUp:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",notification:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU",mysteryBox:"data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU"},init(){this.enabled=localStorage.getItem("soundEnabled")!=="false"},createToggle(){if(document.querySelector(".sound-toggle"))return;const t=document.createElement("button");t.className=`sound-toggle ${this.enabled?"":"muted"}`,t.innerHTML=`
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
        `,t.addEventListener("click",()=>this.toggle()),document.body.appendChild(t)},toggle(){this.enabled=!this.enabled,localStorage.setItem("soundEnabled",String(this.enabled));const e=document.querySelector(".sound-toggle");e&&e.classList.toggle("muted",!this.enabled),this.enabled&&this.play("click"),u(this.enabled?"🔊 Ljud på":"🔇 Ljud av","info")},play(e){if(this.enabled)try{const t=new(window.AudioContext||window.webkitAudioContext),a=t.createOscillator(),s=t.createGain();switch(a.connect(s),s.connect(t.destination),s.gain.value=this.volume*.1,e){case"success":a.frequency.setValueAtTime(523.25,t.currentTime),a.frequency.setValueAtTime(659.25,t.currentTime+.1),a.frequency.setValueAtTime(783.99,t.currentTime+.2);break;case"error":a.frequency.setValueAtTime(200,t.currentTime);break;case"click":a.frequency.setValueAtTime(800,t.currentTime),s.gain.exponentialRampToValueAtTime(.01,t.currentTime+.05);break;case"achievement":case"levelUp":a.frequency.setValueAtTime(392,t.currentTime),a.frequency.setValueAtTime(523.25,t.currentTime+.1),a.frequency.setValueAtTime(659.25,t.currentTime+.2),a.frequency.setValueAtTime(783.99,t.currentTime+.3);break;case"notification":a.frequency.setValueAtTime(440,t.currentTime),a.frequency.setValueAtTime(660,t.currentTime+.1);break;default:a.frequency.setValueAtTime(440,t.currentTime)}a.type="sine",a.start(t.currentTime),a.stop(t.currentTime+.3)}catch{console.log("Audio not supported")}}};function u(e,t="info"){F.show(e,{type:t})}function ee(e,t,a=100,s=8){const o=(a-s)/2,n=o*2*Math.PI,i=n-t/100*n;e.innerHTML=`
        <svg class="progress-ring" width="${a}" height="${a}">
            <defs>
                <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#6366f1"/>
                    <stop offset="50%" style="stop-color:#3b82f6"/>
                    <stop offset="100%" style="stop-color:#f59e0b"/>
                </linearGradient>
            </defs>
            <circle class="progress-ring-circle-bg"
                stroke="rgba(255,255,255,0.1)"
                stroke-width="${s}"
                fill="transparent"
                r="${o}"
                cx="${a/2}"
                cy="${a/2}"/>
            <circle class="progress-ring-circle-progress"
                stroke="url(#progress-gradient)"
                stroke-width="${s}"
                fill="transparent"
                r="${o}"
                cx="${a/2}"
                cy="${a/2}"
                style="stroke-dasharray: ${n}; stroke-dashoffset: ${i}"/>
        </svg>
        <span class="progress-ring-text">${Math.round(t)}%</span>
    `,e.className="progress-ring-container"}document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{S.init(),g.init(),A.init(),x.loadUnlocked(),h.load(),h.updateProgress("streak",1)},500)});typeof window<"u"&&(window.FocusMode=S,window.XPSystem=m,window.Achievements=x,window.DailyGoals=h,window.MysteryBox=_,window.PomodoroTimer=A,window.SoundEffects=g,window.Celebrations=R,window.createProgressRing=ee,window.showToast=u);const E={init(){document.querySelectorAll(".game-card-item").forEach(e=>{this.addTiltEffect(e)})},addTiltEffect(e){e.classList.add("tilt-card");const t=document.createElement("div");t.className="tilt-shine",e.appendChild(t),e.addEventListener("mousemove",a=>{const s=e.getBoundingClientRect(),o=a.clientX-s.left,n=a.clientY-s.top,i=s.width/2,r=s.height/2,l=(n-r)/10,c=(i-o)/10;e.style.setProperty("--tilt-x",`${l}deg`),e.style.setProperty("--tilt-y",`${c}deg`),t.style.background=`radial-gradient(circle at ${o}px ${n}px, rgba(255,255,255,0.2) 0%, transparent 50%)`}),e.addEventListener("mouseleave",()=>{e.style.setProperty("--tilt-x","0deg"),e.style.setProperty("--tilt-y","0deg")})}},M={difficulties:{flashcards:"easy",vokaler:"medium","unblock-me":"hard","block-puzzle":"medium","word-search":"easy",hangman:"medium",memory:"easy","word-wheel":"medium","word-connect":"hard","fill-blank":"medium",listening:"medium",grammar:"hard","missing-word":"medium",spelling:"hard","sentence-builder":"hard","word-rain":"medium",wordle:"hard",pronunciation:"hard"},labels:{easy:{sv:"Lätt",ar:"سهل"},medium:{sv:"Medel",ar:"متوسط"},hard:{sv:"Svårt",ar:"صعب"}},init(){document.querySelectorAll(".game-card-item").forEach(e=>{const t=e.getAttribute("data-game-id");t&&this.difficulties[t]&&this.addBadge(e,this.difficulties[t])})},addBadge(e,t){var o;if(e.querySelector(".difficulty-badge"))return;const s=document.createElement("span");s.className=`difficulty-badge difficulty-${t}`,s.textContent=((o=this.labels[t])==null?void 0:o.sv)||t,e.appendChild(s)}},L={init(){const e=localStorage.getItem("lastPlayedGame");if(!e)return;const t=JSON.parse(e),a=document.querySelector(`[data-game-id="${t.gameId}"]`);a&&this.addBadge(a)},addBadge(e){if(e.querySelector(".last-played-badge"))return;const a=document.createElement("div");a.className="last-played-badge",a.innerHTML=`
            <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
            Senast
        `,e.appendChild(a)},recordPlay(e){localStorage.setItem("lastPlayedGame",JSON.stringify({gameId:e,timestamp:Date.now()}))}},T={recommendations:{memory:5,flashcards:5,grammar:4,vokaler:5,"word-connect":4,hangman:4,"fill-blank":3,listening:4,"word-wheel":3,wordle:3,pronunciation:4,spelling:3,"sentence-builder":3,"word-rain":4,"missing-word":3,"unblock-me":2,"block-puzzle":2,"word-search":3},init(){document.querySelectorAll(".game-card-item").forEach(e=>{const t=e.getAttribute("data-game-id");t&&this.recommendations[t]&&this.addStars(e,this.recommendations[t])})},addStars(e,t){var n;if(e.querySelector(".recommendation-stars"))return;const s=document.createElement("div");s.className="recommendation-stars";for(let i=1;i<=5;i++){const r=document.createElement("svg");r.className=`recommendation-star ${i>t?"empty":""}`,r.setAttribute("viewBox","0 0 24 24"),r.innerHTML='<path fill="currentColor" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',s.appendChild(r)}const o=e.querySelector(".high-score, .game-stars");o?(n=o.parentNode)==null||n.insertBefore(s,o.nextSibling):e.appendChild(s)}},te={baseCount:12,init(){const e=document.querySelector(".games-container");if(!e||document.querySelector(".live-players-widget"))return;const a=this.createWidget(),s=document.getElementById("xpWidget");if(s&&s.parentNode===e)e.insertBefore(a,s.nextSibling);else{const o=document.querySelector(".games-header");o&&o.parentNode===e?e.insertBefore(a,o.nextSibling):e.prepend(a)}this.startUpdating()},createWidget(){const e=this.getRandomCount(),t=document.createElement("div");return t.className="live-players-widget",t.innerHTML=`
            <div class="live-indicator">
                <div class="live-dot"></div>
                <span class="live-count" id="livePlayerCount">${e}</span>
            </div>
            <span class="live-text">spelare online just nu / لاعب متصل الآن</span>
            <div class="live-avatars">
                ${this.createAvatars(Math.min(e,5))}
            </div>
        `,t},createAvatars(e){const t=["👤","🧑","👩","🧑‍🦱","👨","👧","🧒"];let a="";for(let s=0;s<e;s++)a+=`<div class="live-avatar">${t[s%t.length]}</div>`;return a},getRandomCount(){return this.baseCount+Math.floor(Math.random()*20)},startUpdating(){setInterval(()=>{const e=document.getElementById("livePlayerCount");if(e){const t=this.getRandomCount();e.textContent=String(t)}},15e3)}},ae={quotes:[{text:"Varje ord du lär dig är ett steg närmare fluency.",author:"SnabbaLexin",textAr:"كل كلمة تتعلمها هي خطوة نحو الطلاقة."},{text:"Övning ger färdighet. Fortsätt träna!",author:"Svenskt ordspråk",textAr:"الممارسة تصنع الكمال. استمر في التدريب!"},{text:"Att lära sig ett nytt språk är att öppna en ny dörr.",author:"Frank Smith",textAr:"تعلم لغة جديدة هو فتح باب جديد."},{text:"Din streak visar ditt engagemang. Imponerande!",author:"SnabbaLexin",textAr:"سلسلتك تظهر التزامك. مثير للإعجاب!"},{text:"Små framsteg varje dag leder till stora resultat.",author:"Kinesiskt ordspråk",textAr:"التقدم الصغير كل يوم يؤدي إلى نتائج كبيرة."},{text:"Du är en stjärna! Fortsätt lysa.",author:"SnabbaLexin",textAr:"أنت نجم! استمر في التألق."},{text:"Misstag är bevis på att du försöker.",author:"Okänd",textAr:"الأخطاء دليل على أنك تحاول."},{text:"Språket är nyckeln till en annan kultur.",author:"Rita Mae Brown",textAr:"اللغة هي مفتاح ثقافة أخرى."}],currentIndex:0,init(){const e=document.querySelector(".games-container");if(!e||document.querySelector(".quote-widget"))return;this.currentIndex=Math.floor(Math.random()*this.quotes.length);const a=this.createWidget(),s=document.querySelector(".live-players-widget");if(s&&s.parentNode===e)e.insertBefore(a,s.nextSibling);else{const o=document.querySelector(".stats-hero");o&&o.parentNode===e?e.insertBefore(a,o):e.prepend(a)}},createWidget(){var a;const e=this.quotes[this.currentIndex],t=document.createElement("div");return t.className="quote-widget",t.innerHTML=`
            <span class="quote-icon">"</span>
            <p class="quote-text" id="quoteText">${e.text}</p>
            <p class="quote-author" id="quoteAuthor">— ${e.author}</p>
            <button class="quote-refresh" id="quoteRefresh" title="Nytt citat">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M23 4v6h-6M1 20v-6h6"/>
                    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/>
                </svg>
            </button>
        `,(a=t.querySelector("#quoteRefresh"))==null||a.addEventListener("click",()=>this.showNext()),t},showNext(){this.currentIndex=(this.currentIndex+1)%this.quotes.length;const e=this.quotes[this.currentIndex],t=document.getElementById("quoteText"),a=document.getElementById("quoteAuthor");t&&a&&(t.style.opacity="0",a.style.opacity="0",setTimeout(()=>{t.textContent=e.text,a.textContent=`— ${e.author}`,t.style.opacity="1",a.style.opacity="1"},200))}},B={init(){const e=document.querySelector(".leaderboard-section");if(!e||document.querySelector(".progress-dashboard"))return;const a=this.createDashboard();e.insertBefore(a,e.firstChild)},createDashboard(){const e=this.getWeeklyStats(),t=document.createElement("div");return t.className="progress-dashboard",t.innerHTML=`
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
        `,t},getWeeklyStats(){const e=localStorage.getItem("weeklyStats");return e?JSON.parse(e):{daily:[3,5,2,7,4,6,8],skills:{vocab:75,grammar:45,listening:60,puzzle:30}}},createBarChart(e){const t=["Mån","Tis","Ons","Tor","Fre","Lör","Sön"],a=Math.max(...e,1);return e.map((s,o)=>`
            <div class="bar-item">
                <div class="bar" style="height: ${s/a*100}px;" data-value="${s}"></div>
                <span class="bar-label">${t[o]}</span>
            </div>
        `).join("")},createSkillItems(e){const t={vocab:{name:"Ordförråd",icon:"📚"},grammar:{name:"Grammatik",icon:"📖"},listening:{name:"Lyssna",icon:"👂"},puzzle:{name:"Pussel",icon:"🧩"}};return Object.entries(e).map(([a,s])=>{var o,n;return`
            <div class="skill-item">
                <div class="skill-icon" style="background: rgba(99, 102, 241, 0.2);">
                    ${((o=t[a])==null?void 0:o.icon)||"📊"}
                </div>
                <div class="skill-info">
                    <div class="skill-name">${((n=t[a])==null?void 0:n.name)||a}</div>
                    <div class="skill-bar-bg">
                        <div class="skill-bar-fill ${a}" style="width: ${s}%;"></div>
                    </div>
                </div>
            </div>
        `}).join("")}},I={intervalMinutes:30,timer:null,startTime:0,init(){this.startTime=Date.now(),this.scheduleReminder()},scheduleReminder(){this.timer&&clearTimeout(this.timer),this.timer=setTimeout(()=>{this.showReminder()},this.intervalMinutes*60*1e3)},showReminder(){var t,a;const e=document.createElement("div");e.className="break-reminder-overlay",e.id="breakReminder",e.innerHTML=`
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
        `,document.body.appendChild(e),(t=document.getElementById("startBreak"))==null||t.addEventListener("click",()=>{this.startBreakTimer()}),(a=document.getElementById("skipBreak"))==null||a.addEventListener("click",()=>{this.dismiss()})},startBreakTimer(){let e=300;const t=document.getElementById("breakTimer"),a=setInterval(()=>{if(e--,t){const s=Math.floor(e/60),o=e%60;t.textContent=`${s.toString().padStart(2,"0")}:${o.toString().padStart(2,"0")}`}e<=0&&(clearInterval(a),this.dismiss(),typeof window.showToast=="function"&&window.showToast("☕ Paus klar! Bra jobbat!","success"))},1e3)},dismiss(){const e=document.getElementById("breakReminder");e&&(e.style.animation="fadeOut 0.3s ease forwards",setTimeout(()=>e.remove(),300)),this.scheduleReminder()}},C={isActive:!1,init(){this.isActive=localStorage.getItem("eyeCareMode")==="true",this.isActive&&document.body.classList.add("eye-care-mode")},createToggle(){if(document.querySelector(".eye-care-toggle"))return;const t=document.createElement("button");t.className="eye-care-toggle",t.title="Eye Care Mode",t.innerHTML=`
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>
        `,t.addEventListener("click",()=>this.toggle()),document.body.appendChild(t)},toggle(){this.isActive=!this.isActive,document.body.classList.toggle("eye-care-mode",this.isActive),localStorage.setItem("eyeCareMode",String(this.isActive)),typeof window.showToast=="function"&&window.showToast(this.isActive?"👁️ Eye Care aktiverat":"👁️ Eye Care avaktiverat","info")}},P={messages:["Lycka till! 🍀","Du klarar det! 💪","Fortsätt så! 🌟","Imponerande! 👏","Bra jobbat! 🎉","Du är grym! 🔥"],init(){},getRandomMessage(){return this.messages[Math.floor(Math.random()*this.messages.length)]},speak(){const e=document.getElementById("mascotSpeech");e&&(e.textContent=this.getRandomMessage(),e.style.opacity="1",setTimeout(()=>{e.style.opacity="0"},2e3)),"vibrate"in navigator&&navigator.vibrate(10)}},q={players:[{name:"Erik S.",score:2450,emoji:"🧑"},{name:"Sara A.",score:2180,emoji:"👩"},{name:"Mohammed K.",score:1950,emoji:"🧔"},{name:"Lisa N.",score:1820,emoji:"👧"},{name:"Du",score:0,emoji:"⭐",isCurrentUser:!0}],init(){const e=document.querySelector(".leaderboard-section");if(!e||document.querySelector(".leaderboard-widget"))return;const a=this.getUserScore();this.players[4].score=a,this.players.sort((o,n)=>n.score-o.score);const s=this.createWidget();e.appendChild(s)},getUserScore(){const e=localStorage.getItem("userProgress");return e&&JSON.parse(e).totalScore||0},createWidget(){const e=document.createElement("div");return e.className="leaderboard-widget",e.innerHTML=`
            <div class="leaderboard-header">
                <h3 class="leaderboard-title">🏆 Veckans Topplista</h3>
            </div>
            ${this.players.slice(0,5).map((t,a)=>`
                <div class="leaderboard-entry ${t.isCurrentUser?"current-user":""}">
                    <div class="leaderboard-rank ${a<3?"rank-"+(a+1):"rank-other"}">
                        ${a+1}
                    </div>
                    <div class="leaderboard-avatar">${t.emoji}</div>
                    <span class="leaderboard-name">${t.name}</span>
                    <span class="leaderboard-score">${t.score}</span>
                </div>
            `).join("")}
        `,e}},$={recommendations:[{game:"memory",reason:"Bra för att träna minnet",reasonAr:"جيد لتدريب الذاكرة"},{game:"grammar",reason:"Förbättra din grammatik",reasonAr:"حسّن قواعدك"},{game:"listening",reason:"Träna hörförståelse",reasonAr:"درب مهارة الاستماع"},{game:"vokaler",reason:"Lär dig svenska ljud",reasonAr:"تعلم الأصوات السويدية"}],init(){const e=document.querySelector(".games-container");if(!e||document.querySelector(".ai-recommendation"))return;const a=this.getRecommendation(),s=this.createWidget(a),o=document.querySelector(".category-filter-container");o&&o.parentNode?o.parentNode.insertBefore(s,o.nextSibling):e.appendChild(s)},getRecommendation(){return this.recommendations[Math.floor(Math.random()*this.recommendations.length)]},createWidget(e){const t=document.createElement("div");return t.className="ai-recommendation",t.innerHTML=`
            <div class="ai-icon">🤖</div>
            <div class="ai-content">
                <div class="ai-label">AI Förslag / اقتراح ذكي</div>
                <div class="ai-message">${e.reason}</div>
            </div>
            <svg class="ai-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
        `,t.addEventListener("click",()=>{const a=document.querySelector(`[data-game-id="${e.game}"]`);a&&(a.scrollIntoView({behavior:"smooth",block:"center"}),a.style.animation="pulse 0.5s ease")}),t}},se={init(){const e=new IntersectionObserver(t=>{t.forEach(a=>{a.isIntersecting&&(a.target.classList.add("bounce-scroll"),e.unobserve(a.target))})},{threshold:.1});document.querySelectorAll(".game-card-item").forEach(t=>{e.observe(t)})}};document.addEventListener("DOMContentLoaded",()=>{setTimeout(()=>{E.init(),M.init(),L.init(),T.init(),P.init(),q.init(),$.init(),I.init(),C.init(),B.init(),se.init()},800)});typeof window<"u"&&(window.TiltEffect=E,window.DifficultyIndicator=M,window.LastPlayedBadge=L,window.RecommendationStars=T,window.LivePlayersCounter=te,window.MotivationalQuotes=ae,window.ProgressDashboard=B,window.BreakReminder=I,window.EyeCareMode=C,window.GameMascot=P,window.WeeklyLeaderboard=q,window.AIRecommendations=$);const N={isOpen:!1,menuElement:null,menuItems:[{id:"focus-mode",icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>`,label:"Fokusläge",labelAr:"وضع التركيز",color:"#22c55e",action:"toggleFocusMode"},{id:"eye-care",icon:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
            </svg>`,label:"Ögonvård",labelAr:"حماية العين",color:"#fbbf24",action:"toggleEyeCare"},{id:"pomodoro",icon:"⏱️",label:"Pomodoro",labelAr:"مؤقت بومودورو",color:"#3b82f6",action:"togglePomodoro"},{id:"sound",icon:`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>`,label:"Ljud",labelAr:"الصوت",color:"#3b82f6",action:"toggleSound"},{id:"mascot",icon:"🦉",label:"Hjälpare",labelAr:"المساعد",color:"#f97316",action:"showMascotMessage"}],init(){this.removeScatteredButtons(),this.createMenu(),document.addEventListener("keydown",e=>{e.key==="Escape"&&this.isOpen&&this.close()})},removeScatteredButtons(){[".focus-mode-toggle",".eye-care-toggle",".sound-toggle",".pomodoro-toggle",".game-mascot"].forEach(t=>{document.querySelectorAll(t).forEach(a=>a.remove())})},createMenu(){if(document.querySelector(".fab-menu-container"))return;const t=document.createElement("div");t.className="fab-menu-container",t.innerHTML=`
            <!-- Backdrop -->
            <div class="fab-menu-backdrop" id="fabBackdrop"></div>
            
            <!-- Menu Items -->
            <div class="fab-menu-items" id="fabMenuItems">
                ${this.menuItems.map((a,s)=>`
                    <div class="fab-menu-item" data-action="${a.action}" style="--item-index: ${s}; --item-color: ${a.color}">
                        <span class="fab-menu-item-label">${a.label}</span>
                        <div class="fab-menu-item-btn" style="background: linear-gradient(135deg, ${a.color}, ${this.darkenColor(a.color)})">
                            ${a.icon}
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
        `,document.body.appendChild(t),this.menuElement=t,this.bindEvents()},bindEvents(){const e=document.getElementById("fabMainBtn"),t=document.getElementById("fabBackdrop"),a=document.querySelectorAll(".fab-menu-item");e==null||e.addEventListener("click",()=>this.toggle()),t==null||t.addEventListener("click",()=>this.close()),a.forEach(s=>{s.addEventListener("click",o=>{const n=o.currentTarget.getAttribute("data-action");n&&(this.executeAction(n),this.close())})})},toggle(){this.isOpen?this.close():this.open()},open(){var e;this.isOpen=!0,(e=this.menuElement)==null||e.classList.add("open"),"vibrate"in navigator&&navigator.vibrate(10)},close(){var e;this.isOpen=!1,(e=this.menuElement)==null||e.classList.remove("open")},executeAction(e){switch(e){case"toggleFocusMode":this.toggleFocusMode();break;case"toggleEyeCare":this.toggleEyeCare();break;case"togglePomodoro":this.togglePomodoro();break;case"toggleSound":this.toggleSound();break;case"showMascotMessage":this.showMascotMessage();break}},toggleFocusMode(){const e=document.body.classList.toggle("focus-mode");localStorage.setItem("focusMode",String(e)),"vibrate"in navigator&&navigator.vibrate(e?[20,50,20]:10),this.showToast(e?"Fokusläge aktiverat ✨ / وضع التركيز مفعّل":"Fokusläge avaktiverat / وضع التركيز معطّل",e?"success":"info")},toggleEyeCare(){const e=document.body.classList.toggle("eye-care-mode");localStorage.setItem("eyeCareMode",String(e)),this.showToast(e?"👁️ Ögonvård aktiverat / حماية العين مفعّلة":"👁️ Ögonvård avaktiverat / حماية العين معطّلة","info")},togglePomodoro(){const e=document.querySelector(".pomodoro-widget");e?e.classList.toggle("visible"):typeof window.PomodoroTimer<"u"&&window.PomodoroTimer.toggleWidget()},toggleSound(){const t=!(localStorage.getItem("soundEnabled")!=="false");localStorage.setItem("soundEnabled",String(t)),this.showToast(t?"🔊 Ljud på / الصوت مفعّل":"🔇 Ljud av / الصوت مكتوم","info"),t&&typeof window.SoundEffects<"u"&&window.SoundEffects.play("click")},showMascotMessage(){const e=["Lycka till! 🍀 / حظاً سعيداً!","Du klarar det! 💪 / ستنجح!","Fortsätt så! 🌟 / استمر!","Imponerande! 👏 / رائع!","Bra jobbat! 🎉 / أحسنت!","Du är grym! 🔥 / أنت رائع!"],t=e[Math.floor(Math.random()*e.length)];this.showToast(t,"success"),"vibrate"in navigator&&navigator.vibrate(10)},showToast(e,t="info"){if(typeof window.showToast=="function")window.showToast(e,t);else{const a=document.querySelector(".toast-notification.visible");a&&a.remove();let s=document.getElementById("toast");s||(s=document.createElement("div"),s.id="toast",s.className="toast-notification",document.body.appendChild(s)),s.textContent=e,s.className=`toast-notification visible ${t}`,setTimeout(()=>{s.classList.remove("visible")},3e3)}},darkenColor(e,t=20){const a=parseInt(e.replace("#",""),16),s=Math.round(2.55*t),o=(a>>16)-s,n=(a>>8&255)-s,i=(a&255)-s;return"#"+(16777216+(o<255?o<1?0:o:255)*65536+(n<255?n<1?0:n:255)*256+(i<255?i<1?0:i:255)).toString(16).slice(1)}},oe=`
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
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
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
    background: linear-gradient(135deg, #3b82f6, #1e40af);
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
`;function ne(){const e="fab-menu-styles";if(document.getElementById(e))return;const t=document.createElement("style");t.id=e,t.textContent=oe,document.head.appendChild(t)}document.addEventListener("DOMContentLoaded",()=>{ne(),setTimeout(()=>{N.init()},1e3)});typeof window<"u"&&(window.FABMenu=N);
