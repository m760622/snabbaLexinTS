var m=Object.defineProperty;var k=(e,s,t)=>s in e?m(e,s,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[s]=t;var n=(e,s,t)=>k(e,typeof s!="symbol"?s+"":s,t);const r="snabbalexin_mistakes";class c{constructor(){n(this,"mistakes",[]);this.load()}load(){try{const s=localStorage.getItem(r);this.mistakes=s?JSON.parse(s):[]}catch{this.mistakes=[]}}save(){this.mistakes.length>50&&(this.mistakes=this.mistakes.slice(-50)),localStorage.setItem(r,JSON.stringify(this.mistakes))}addMistake(s){const t=this.mistakes.find(a=>a.word===s.word);t?(t.attempts++,t.timestamp=Date.now()):this.mistakes.push({...s,timestamp:Date.now(),attempts:1}),this.save()}markAsLearned(s){this.mistakes=this.mistakes.filter(t=>t.word!==s),this.save()}getMistakes(){return[...this.mistakes].sort((s,t)=>t.attempts-s.attempts)}getTopMistakes(s=10){return this.getMistakes().slice(0,s)}getMistakeCount(){return this.mistakes.length}getFrequentMistakes(){return this.mistakes.filter(s=>s.attempts>=2)}clearAll(){this.mistakes=[],this.save()}}const i=new c;window.mistakesManager=i;function o(e){const s=document.getElementById(e);if(!s)return;const t=i.getMistakes();if(t.length===0){s.innerHTML=`
            <div class="mistakes-empty">
                <div class="mistakes-empty-icon">🎉</div>
                <h3>No Mistakes Yet!</h3>
                <p>لا توجد أخطاء بعد! / Inga fel ännu!</p>
            </div>
        `;return}s.innerHTML=`
        <div class="mistakes-header">
            <h2>مراجعة أخطائي / Mina Fel</h2>
            <span class="mistakes-count">${t.length} كلمة / ord</span>
        </div>
        <div class="mistakes-list">
            ${t.map(a=>`
                <div class="mistake-card" data-word="${a.word}">
                    <div class="mistake-word">${a.word}</div>
                    <div class="mistake-translation">${a.translation}</div>
                    <div class="mistake-meta">
                        <span class="mistake-attempts">❌ ${a.attempts} مرة</span>
                        <span class="mistake-game">${a.game}</span>
                    </div>
                    <div class="mistake-actions">
                        <button class="mistake-practice" onclick="practiceMistake('${a.word}')">
                            🎯 تمرن / Öva
                        </button>
                        <button class="mistake-learned" onclick="markLearned('${a.word}')">
                            ✓ تعلمتها
                        </button>
                    </div>
                </div>
            `).join("")}
        </div>
    `}window.renderMistakesReview=o;window.practiceMistake=e=>{console.log("Practice:",e)};window.markLearned=e=>{i.markAsLearned(e),o("mistakesContainer")};export{i as m};
