import"./modulepreload-polyfill-B5Qt9EMX.js";import"./loader-CKTsN5EW.js";import"./pwa-Bxh5GLjF.js";import"./db-TWgxRddZ.js";import"./utils-B-9iATqE.js";class m{constructor(){this.ctx=new(window.AudioContext||window.webkitAudioContext),this.enabled=!0}playTone(e,t,s,i=.1,n=0){if(!this.enabled)return;const o=this.ctx.createOscillator(),l=this.ctx.createGain();o.type=t,o.frequency.setValueAtTime(e,this.ctx.currentTime),n!==0&&o.frequency.exponentialRampToValueAtTime(e+n,this.ctx.currentTime+s),l.gain.setValueAtTime(i,this.ctx.currentTime),l.gain.exponentialRampToValueAtTime(.01,this.ctx.currentTime+s),o.connect(l),l.connect(this.ctx.destination),o.start(),o.stop(this.ctx.currentTime+s)}playSlide(){this.playTone(400,"sine",.1,.1,200)}playHit(){this.playTone(150,"square",.1,.05,-50)}playWin(){this.ctx.currentTime,[523.25,659.25,783.99,1046.5,783.99,1046.5].forEach((e,t)=>{setTimeout(()=>this.playTone(e,"square",.1,.1),t*80)}),setTimeout(()=>this.playTone(1318.51,"square",.4,.1),480)}playUndo(){this.playTone(600,"sawtooth",.15,.1,-400)}}class y{constructor(e,t,s,i,n,o){this.id=e,this.x=t,this.y=s,this.length=i,this.orientation=n,this.type=o,this.el=null}}class g{constructor(){this.board=document.getElementById("board"),this.cellSize=55,this.gap=4,this.gridSize=6,this.blocks=[],this.currentLevel=0,this.moves=0,this.history=[],this.sound=new m,this.gameMode="classic",this.progress=JSON.parse(localStorage.getItem("unblockMe_progress"))||{},this.levels=[{par:10,blocks:[{x:1,y:2,len:2,dir:"h",type:"target"},{x:0,y:0,len:3,dir:"v",type:"normal"},{x:1,y:0,len:2,dir:"h",type:"normal"},{x:3,y:0,len:3,dir:"v",type:"normal"},{x:4,y:2,len:2,dir:"v",type:"normal"},{x:0,y:4,len:2,dir:"h",type:"normal"},{x:2,y:4,len:2,dir:"v",type:"normal"},{x:4,y:4,len:2,dir:"h",type:"normal"}]},{par:15,blocks:[{x:0,y:2,len:2,dir:"h",type:"target"},{x:2,y:0,len:3,dir:"v",type:"normal"},{x:3,y:1,len:2,dir:"v",type:"normal"},{x:0,y:4,len:3,dir:"h",type:"normal"},{x:4,y:3,len:2,dir:"v",type:"normal"},{x:2,y:3,len:2,dir:"h",type:"normal"},{x:0,y:0,len:1,dir:"h",type:"fixed"},{x:5,y:5,len:1,dir:"h",type:"fixed"}]},{par:20,blocks:[{x:1,y:2,len:2,dir:"h",type:"target"},{x:0,y:0,len:2,dir:"h",type:"normal"},{x:2,y:0,len:2,dir:"h",type:"normal"},{x:4,y:0,len:2,dir:"v",type:"normal"},{x:0,y:1,len:2,dir:"v",type:"normal"},{x:3,y:1,len:3,dir:"v",type:"normal"},{x:1,y:3,len:2,dir:"v",type:"normal"},{x:0,y:4,len:2,dir:"h",type:"normal"},{x:4,y:4,len:2,dir:"v",type:"normal"},{x:2,y:2,len:1,dir:"h",type:"fixed"}]}],this.addEventListeners(),window.addEventListener("click",()=>{this.sound.ctx.state==="suspended"&&this.sound.ctx.resume()},{once:!0}),localStorage.getItem("unblockMe_nightMode")==="true"&&this.toggleNightMode(!0)}toggleNightMode(e=null){const t=document.body,s=e!==null?e:!t.classList.contains("night-mode");s?(t.classList.add("night-mode"),document.getElementById("theme-icon").innerHTML='<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>'):(t.classList.remove("night-mode"),document.getElementById("theme-icon").innerHTML='<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>'),localStorage.setItem("unblockMe_nightMode",s)}startMode(e){this.gameMode=e,document.getElementById("start-screen").classList.add("hidden"),this.initLevel(this.currentLevel)}initLevel(e){this.currentLevel=e,this.moves=0,this.history=[],this.updateUI(),this.board.innerHTML='<div class="exit-gate"></div><div class="exit-arrow">➜</div>',this.blocks=[],this.levels[e%this.levels.length].blocks.forEach((s,i)=>{const n=new y(i,s.x,s.y,s.len,s.dir,s.type);this.createBlockElement(n),this.blocks.push(n)})}updateUI(){document.getElementById("level-display").textContent=this.currentLevel+1,document.getElementById("moves-display").textContent=this.moves;const e=`$ {
                this.gameMode
            }

            _$ {
                this.currentLevel
            }

            `,t=this.progress[e]?this.progress[e].moves:"-";document.getElementById("best-display").textContent=t}createBlockElement(e){const t=document.createElement("div");let s=`block $ {
                block.type
            }

            $ {
                block.orientation==='h' ? 'horizontal': 'vertical'
            }

            `;this.gameMode==="ice"&&(s+=" ice-theme"),t.className=s,t.style.width=e.orientation==="h"?`calc($ {
                    block.length
                }

                * var(--cell-size) + $ {
                    block.length - 1
                }

                * var(--gap))`:"var(--cell-size)",t.style.height=e.orientation==="v"?`calc($ {
                    block.length
                }

                * var(--cell-size) + $ {
                    block.length - 1
                }

                * var(--gap))`:"var(--cell-size)",this.updateBlockPosition(t,e.x,e.y),t.dataset.id=e.id,this.board.appendChild(t),e.el=t}updateBlockPosition(e,t,s){t*(this.cellSize+this.gap),s*(this.cellSize+this.gap),e.style.transform=`translate($ {
                    left
                }

                px, $ {
                    top
                }

                px)`}addEventListeners(){const e=i=>{if(!i.target.classList.contains("block"))return;const n=i.target.dataset.id,o=this.blocks[n];if(o.type==="fixed"){this.sound.playHit();return}i.preventDefault(),this.isDragging=!0,this.draggedBlock=o;const l=i.touches?i.touches[0]:i;this.startPos={x:l.clientX,y:l.clientY},this.blockStartPos={x:this.draggedBlock.x,y:this.draggedBlock.y},this.hasMoved=!1},t=i=>{if(!this.isDragging||!this.draggedBlock)return;i.preventDefault();const n=i.touches?i.touches[0]:i,o=n.clientX-this.startPos.x,l=n.clientY-this.startPos.y;(Math.abs(o)>5||Math.abs(l)>5)&&(this.hasMoved=!0);const r=(this.draggedBlock.orientation==="h"?o:l)/(this.cellSize+this.gap);let d=this.blockStartPos.x,c=this.blockStartPos.y;this.draggedBlock.orientation==="h"?d+=r:c+=r;const h=this.constrainPosition(this.draggedBlock,d,c);h.x*(this.cellSize+this.gap),h.y*(this.cellSize+this.gap),this.draggedBlock.el.style.transform=`translate($ {
                        pixelX
                    }

                    px, $ {
                        pixelY
                    }

                    px)`,this.draggedBlock.tempX=h.x,this.draggedBlock.tempY=h.y},s=()=>{if(!this.isDragging||!this.draggedBlock)return;let i,n;if(this.gameMode==="ice"&&this.hasMoved){const o=this.getLimits(this.draggedBlock),l=this.draggedBlock.tempX-this.blockStartPos.x,r=this.draggedBlock.tempY-this.blockStartPos.y;i=this.blockStartPos.x,n=this.blockStartPos.y,this.draggedBlock.orientation==="h"?l>.2?i=o.max:l<-.2&&(i=o.min):r>.2?n=o.max:r<-.2&&(n=o.min)}else i=Math.round(this.draggedBlock.tempX),n=Math.round(this.draggedBlock.tempY);(i!==this.blockStartPos.x||n!==this.blockStartPos.y)&&(this.history.push({id:this.draggedBlock.id,x:this.blockStartPos.x,y:this.blockStartPos.y}),this.moves++,this.updateUI(),this.sound.playSlide()),this.draggedBlock.x=i,this.draggedBlock.y=n,this.draggedBlock.el.style.transition="transform 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)",this.updateBlockPosition(this.draggedBlock.el,i,n),setTimeout(()=>{this.draggedBlock&&this.draggedBlock.el&&(this.draggedBlock.el.style.transition="transform 0.1s")},200),this.isDragging=!1,this.draggedBlock=null,this.checkWin()};this.board.addEventListener("mousedown",e),this.board.addEventListener("touchstart",e,{passive:!1}),window.addEventListener("mousemove",t),window.addEventListener("touchmove",t,{passive:!1}),window.addEventListener("mouseup",s),window.addEventListener("touchend",s)}getLimits(e){let t=0,s=this.gridSize-e.length;if(e.orientation==="h"){for(let i of this.blocks)i!==e&&i.y<=e.y&&i.y+(i.orientation==="v"?i.length:1)>e.y&&(i.x+(i.orientation==="h"?i.length:1)<=this.blockStartPos.x&&(t=Math.max(t,i.x+(i.orientation==="h"?i.length:1))),i.x>=this.blockStartPos.x+e.length&&(s=Math.min(s,i.x-e.length)));return{min:t,max:s}}else{for(let i of this.blocks)i!==e&&i.x<=e.x&&i.x+(i.orientation==="h"?i.length:1)>e.x&&(i.y+(i.orientation==="v"?i.length:1)<=this.blockStartPos.y&&(t=Math.max(t,i.y+(i.orientation==="v"?i.length:1))),i.y>=this.blockStartPos.y+e.length&&(s=Math.min(s,i.y-e.length)));return{min:t,max:s}}}constrainPosition(e,t,s){const i=this.getLimits(e);return e.orientation==="h"?(t=Math.max(i.min,Math.min(i.max,t)),{x:t,y:e.y}):(s=Math.max(i.min,Math.min(i.max,s)),{x:e.x,y:s})}undo(){if(this.history.length===0)return;const e=this.history.pop(),t=this.blocks[e.id];t.x=e.x,t.y=e.y,this.updateBlockPosition(t.el,t.x,t.y),this.moves--,this.updateUI(),this.sound.playUndo()}checkWin(){if(this.blocks.find(t=>t.type==="target").x>=4){this.sound.playWin(),this.saveScore();const t=this.levels[this.currentLevel%this.levels.length].par;let s=1;this.moves<=t?s=3:this.moves<=t*1.5&&(s=2),document.getElementById("modal-stars").textContent="★".repeat(s)+"☆".repeat(3-s),document.getElementById("modal-moves").textContent=this.moves,document.getElementById("modal-moves-ar").textContent=this.moves,setTimeout(()=>{document.getElementById("win-modal").classList.add("active"),this.createConfetti()},200)}}saveScore(){const e=`$ {
                this.gameMode
            }

            _$ {
                this.currentLevel
            }

            `,t=this.progress[e]?this.progress[e].moves:1/0;this.moves<t&&(this.progress[e]={moves:this.moves},localStorage.setItem("unblockMe_progress",JSON.stringify(this.progress)))}nextLevel(){document.getElementById("win-modal").classList.remove("active"),this.initLevel(this.currentLevel+1)}resetLevel(){this.initLevel(this.currentLevel),this.sound.playUndo()}createConfetti(){for(let e=0;e<50;e++){const t=document.createElement("div");t.style.position="fixed",t.style.left=Math.random()*100+"vw",t.style.top="-10px",t.style.width="10px",t.style.height="10px",t.style.background=`hsl($ {
                        Math.random() * 360
                    }

                    , 100%, 50%)`,t.style.zIndex="2000",t.style.pointerEvents="none",document.body.appendChild(t);const s=t.animate([{transform:"translate(0, 0) rotate(0deg)",opacity:1},{transform:`translate($ {
                            Math.random() * 100 - 50
                        }

                        px, 100vh) rotate($ {
                            Math.random() * 720
                        }

                        deg)`,opacity:0}],{duration:1e3+Math.random()*2e3,easing:"cubic-bezier(0.25, 0.46, 0.45, 0.94)"});s.onfinish=()=>t.remove()}}}window.onload=()=>{new g};localStorage.getItem("mobileView")==="true"&&(document.body.classList.add("iphone-view"),document.addEventListener("DOMContentLoaded",()=>{const a=document.getElementById("mobileToggle");a&&a.classList.add("active")}));
