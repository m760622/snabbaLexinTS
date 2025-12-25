/**
 * Vowel Game - لعبة الحروف المتحركة
 * Converted from inline JS to TypeScript module
 */

import { minimalPairsData, MinimalPair } from '../data/vowelGameData';

import { speakSwedish } from '../tts';
import { toggleMobileView } from './games-utils';

        function shuffleArray<T>(arr: T[]): T[] {
            const a = [...arr];
            for (let i = a.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [a[i], a[j]] = [a[j], a[i]];
            }
            return a;
        }

        // State Variables
        let currentStage = 1;
        let currentLevel = 1;
        let score = 0;
        let lives = 3;
        let streak = 0;
        let isProcessing = false;
        let hasStarted = false;
        let isBossWave = false;
        let currentTarget: 1 | 2 = 1;
        let currentPair: MinimalPair | null = null;
        let solvedStatus: { 1: boolean; 2: boolean } = { 1: false, 2: false };
        let failedStatus: { 1: boolean; 2: boolean } = { 1: false, 2: false };
        let seenIndices: number[] = [];
        let dailyTimerInterval: any = null;
        let levelStartTime = 0;
        let handleAnswer: (selectedVowel: string, btnEl: HTMLButtonElement | null, slotId: 1 | 2) => void;
        let levelComplete: () => void;

        const TOTAL_STAGES = 10;
        const LEVELS_PER_STAGE = 7;

        // Elements
        const optionsArea = document.getElementById('optionsArea')!;
        const feedbackOverlay = document.getElementById('feedbackOverlay')!;
        const progressBar = document.getElementById('progressBar')!;
        const levelBadge = document.getElementById('levelBadge')!;
        const cardFlipper = document.getElementById('cardFlipper')!;
        const speedBadge = document.getElementById('speedBadge')!;
        const bossBanner = document.getElementById('bossBanner')!;
        const livesContainer = document.getElementById('livesContainer')!;
        const startScreen = document.getElementById('startScreen')!;
        const playArea = document.getElementById('playArea')!;

        // Tilt Logic
        const container = document.querySelector('.game-container') as HTMLElement;
        if (container) {
            container.addEventListener('mousemove', (e: MouseEvent) => {
                if (isProcessing || !hasStarted) return;
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left; const y = e.clientY - rect.top;
                const centerX = rect.width / 2; const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -5; const rotateY = ((x - centerX) / centerX) * 5;
                cardFlipper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            container.addEventListener('mouseleave', () => { cardFlipper.style.transform = `rotateX(0) rotateY(0)`; });
        }

        function startGame() {
            startScreen.style.opacity = '0';
            setTimeout(() => {
                startScreen.style.display = 'none';
                playArea.style.display = 'block';
                hasStarted = true;
                initGame();
            }, 500);
        }

        function initGame() {
            // Load Saved Stage
            let saved = localStorage.getItem('vowelGameStage');
            currentStage = saved ? parseInt(saved) : 1;
            currentLevel = 1;
            score = 0; lives = 3; streak = 0;
            updateLives();
            setupDropZones(); // Fix: Initialize drop zones
            loadLevel();
        }

        function setupDropZones() {
            // Mouse Drag Support
            document.querySelectorAll('.drop-zone').forEach(zoneNode => {
                const zone = zoneNode as HTMLElement;
                zone.addEventListener('dragover', (e: DragEvent) => {
                    e.preventDefault(); // Necessary to allow dropping
                    if (!zone.classList.contains('solved')) {
                        zone.classList.add('drag-over');
                        if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
                    }
                });

                zone.addEventListener('dragleave', () => {
                    zone.classList.remove('drag-over');
                });

                zone.addEventListener('drop', (e: DragEvent) => {
                    e.preventDefault();
                    zone.classList.remove('drag-over');
                    if (zone.classList.contains('solved')) return;

                    const vowel = e.dataTransfer?.getData('text/plain');
                    if (vowel) {
                        const slotId = parseInt(zone.dataset.slot!);
                        // Only accept answers on the current target slot
                        if (slotId === currentTarget) {
                            handleAnswer(vowel, null, slotId as 1 | 2);
                        }
                    }
                });
            });
        }

        function updateLives() {
            livesContainer.innerHTML = '';
            for (let i = 0; i < 3; i++) {
                const h = document.createElement('span');
                h.className = `heart ${i < lives ? '' : 'lost'}`;
                h.textContent = '❤️';
                livesContainer.appendChild(h);
            }
        }

        function checkSkins() {
            document.body.classList.remove('skin-neon', 'skin-gold');
            if (streak > 5) document.body.classList.add('skin-neon');
            if (score > 2000) document.body.classList.add('skin-gold');
        }

        function loadLevel() {
            if (isProcessing) return;

            // Check Win Condition (Max Stages)
            if (currentStage > TOTAL_STAGES) {
                showEndScreen(true);
                return;
            }

            // Boss Check: Last level of stage (Level 7)
            isBossWave = (currentLevel === LEVELS_PER_STAGE);
            document.body.classList.toggle('boss-mode', isBossWave);
            bossBanner.innerHTML = isBossWave ? '🔥 BOSS LEVEL 🔥' : '';
            bossBanner.style.display = isBossWave ? 'block' : 'none';

            levelBadge.textContent = `Stage ${currentStage} • Level ${currentLevel}/${LEVELS_PER_STAGE}`;

            // Progress Bar (Overall Progress)
            const totalLevelsPlayed = ((currentStage - 1) * LEVELS_PER_STAGE) + currentLevel;
            const totalLevels = TOTAL_STAGES * LEVELS_PER_STAGE;
            progressBar.style.width = `${(totalLevelsPlayed / totalLevels) * 100}%`;

            checkSkins();

            // Reset Card with Slide Animation
            cardFlipper.classList.remove('flipped');
            cardFlipper.classList.remove('slide-in');
            void cardFlipper.offsetWidth; // Force Reflow
            cardFlipper.classList.add('slide-in');

            speedBadge.classList.remove('visible');
            feedbackOverlay.classList.remove('visible');
            document.getElementById('inlineCountdown')!.classList.remove('visible');
            levelStartTime = Date.now();

            // Get Next Pair (Persistent)
            currentPair = getNextPair();
            if (!currentPair) return;

            solvedStatus = { 1: false, 2: false };
            failedStatus = { 1: false, 2: false };
            currentTarget = 1;

            const p = currentPair;
            // Fix: Use Regex for case-insensitive replacement (O -> o in Son)
            let frame1 = p.w1.replace(new RegExp(p.pair[0], 'i'), '<span class="missing-vowel"></span>');
            let frame2 = p.w2.replace(new RegExp(p.pair[1], 'i'), '<span class="missing-vowel"></span>');

            document.querySelector('.word-1-text')!.innerHTML = frame1;
            document.querySelector('.word-2-text')!.innerHTML = frame2;
            (document.querySelector('.word-1-def') as HTMLElement).innerText = p.d1;
            (document.querySelector('.word-2-def') as HTMLElement).innerText = p.d2;
            document.getElementById('emoji1')!.textContent = p.e1 || '📦';
            document.getElementById('emoji2')!.textContent = p.e2 || '📦';

            document.getElementById('backEmoji1')!.textContent = p.e1 || '';
            document.getElementById('backEmoji2')!.textContent = p.e2 || '';
            document.getElementById('sentence1')!.innerHTML = (p.s1 || "").replace(new RegExp(p.w1.substr(0, 3), 'gi'), (m: string) => `<em>${m}</em>`);
            document.getElementById('sentence2')!.innerHTML = (p.s2 || "").replace(new RegExp(p.w2.substr(0, 3), 'gi'), (m: string) => `<em>${m}</em>`);

            updateTargetStyling();

            // All Swedish vowels for distractors
            const allVowels = ['A', 'E', 'I', 'O', 'U', 'Y', 'Å', 'Ä', 'Ö'];
            const correctVowels = p.pair;

            // Get 2 distractor vowels (not in the pair)
            const distractorsPool = allVowels.filter(v => !correctVowels.includes(v));
            const distractors = shuffleArray(distractorsPool).slice(0, 2);

            // Combine and shuffle all 4 options
            const allOptions = shuffleArray([...correctVowels, ...distractors]);

            optionsArea.innerHTML = '';
            allOptions.forEach(v => {
                const btn = document.createElement('button');
                btn.className = 'vowel-btn slide-in';
                btn.textContent = v;
                btn.draggable = true;
                setupInteractions(btn, v);
                optionsArea.appendChild(btn);
            });
        }

        function updateTargetStyling() {
            ([1, 2] as const).forEach(id => {
                const el = document.getElementById(`slot${id}`)!;
                el.classList.remove('active-target', 'solved', 'wrong');

                if (failedStatus[id]) el.classList.add('wrong'); // Priority to fail
                else if (solvedStatus[id]) el.classList.add('solved');
                else if (id === currentTarget) el.classList.add('active-target');
            });
        }

        function setupInteractions(btn: HTMLButtonElement, vowel: string) {
            btn.addEventListener('click', () => animateFly(vowel, btn, currentTarget));

            // Mouse Drag
            btn.addEventListener('dragstart', (e) => {
                btn.classList.add('dragging');
                e.dataTransfer!.setData('text/plain', vowel);
                e.dataTransfer!.effectAllowed = 'move';
            });
            btn.addEventListener('dragend', () => {
                btn.classList.remove('dragging');
                document.querySelectorAll('.word-item').forEach(e => e.classList.remove('drag-over'));
            });

            // Touch Drag (Full Support)
            btn.addEventListener('touchstart', (e) => handleTouchStart(e, btn), { passive: false });
            btn.addEventListener('touchmove', handleTouchMove, { passive: false });
            btn.addEventListener('touchend', (e) => handleTouchEnd(e, btn, vowel));
        }

        // Touch Logic
        let touchClone: HTMLElement | null = null;
        let touchOffset = { x: 0, y: 0 };

        function handleTouchStart(e: TouchEvent, btn: HTMLButtonElement) {
            if (isProcessing) return;
            const touch = e.touches[0];
            const rect = btn.getBoundingClientRect();
            touchOffset.x = touch.clientX - rect.left;
            touchOffset.y = touch.clientY - rect.top;

            btn.classList.add('dragging');

            // Create visual clone for dragging
            touchClone = btn.cloneNode(true) as HTMLElement;
            touchClone!.style.position = 'fixed';
            touchClone!.style.width = rect.width + 'px';
            touchClone!.style.height = rect.height + 'px';
            touchClone!.style.left = rect.left + 'px';
            touchClone!.style.top = rect.top + 'px';
            touchClone!.style.zIndex = '2000';
            touchClone!.style.pointerEvents = 'none';
            touchClone!.style.opacity = '0.9';
            touchClone!.style.transform = 'scale(1.1)';
            touchClone!.style.boxShadow = '0 10px 20px rgba(0,0,0,0.5)';
            document.body.appendChild(touchClone);
        }

        function getNextPair() {
            // Find indices not yet seen
            let available = minimalPairsData.map((_: any, i: number) => i).filter(i => !seenIndices.includes(i));

            // If all seen, reset history (start new cycle)
            if (available.length === 0) {
                const lastSeen = seenIndices[seenIndices.length - 1]; // Last text played
                seenIndices = [];
                available = minimalPairsData.map((_: any, i: number) => i);

                // Prevent immediate repeat of the very last word
                if (available.length > 1) {
                    available = available.filter(i => i !== lastSeen);
                }
            }

            // Pick random
            const randIndex = available[Math.floor(Math.random() * available.length)];

            // Save to history
            seenIndices.push(randIndex);
            localStorage.setItem('vowelPlayedIndices', JSON.stringify(seenIndices));

            return minimalPairsData[randIndex];
        }

        function handleTouchMove(e: TouchEvent) {
            if (!touchClone) return;
            e.preventDefault(); // Prevent scrolling while dragging
            const touch = e.touches[0];
            touchClone!.style.left = (touch.clientX - touchOffset.x) + 'px';
            touchClone!.style.top = (touch.clientY - touchOffset.y) + 'px';

            // Highlight Drop Zones
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = target ? target.closest('.drop-zone') : null;
            document.querySelectorAll('.word-item').forEach(el => el.classList.remove('drag-over'));
            if (dropZone && !dropZone.classList.contains('solved')) {
                dropZone.classList.add('drag-over');
            }
        }

        function handleTouchEnd(e: TouchEvent, btn: HTMLButtonElement, vowel: string) {
            if (!touchClone) return;
            const touch = e.changedTouches[0];
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            const dropZone = target ? target.closest('.drop-zone') : null;

            // Cleanup
            document.body.removeChild(touchClone);
            touchClone = null;
            btn.classList.remove('dragging');
            document.querySelectorAll('.word-item').forEach(el => el.classList.remove('drag-over'));

            if (dropZone && !dropZone.classList.contains('solved')) {
                const slotId = parseInt((dropZone as HTMLElement).dataset.slot!) as 1 | 2;
                // Only accept answers on the current target slot
                if (slotId === currentTarget) {
                    handleAnswer(vowel, btn, slotId);
                }
            }
        }

        function animateFly(vowel: string, btnEl: HTMLButtonElement, targetSlotId: 1 | 2) {
            if (isProcessing || solvedStatus[targetSlotId]) return;
            isProcessing = true;

            // Spawn Clone
            const clone = btnEl.cloneNode(true) as HTMLElement;
            clone.classList.add('flying-clone');
            const rect = btnEl.getBoundingClientRect();
            clone.style.left = rect.left + 'px'; clone.style.top = rect.top + 'px';
            document.body.appendChild(clone);

            const targetEl = document.getElementById(`slot${targetSlotId}`)!;
            const tRect = targetEl.getBoundingClientRect();

            // Animate
            setTimeout(() => {
                (clone as HTMLElement).style.left = (tRect.left + tRect.left + tRect.width / 2 - 25) / 2 + 'px';
                (clone as HTMLElement).style.top = (tRect.top + tRect.top + tRect.height / 2 - 25) / 2 + 'px';
                (clone as HTMLElement).style.transform = 'scale(0.5)'; (clone as HTMLElement).style.opacity = '0';
            }, 10);

            setTimeout(() => { document.body.removeChild(clone); isProcessing = false; handleAnswer(vowel, btnEl, targetSlotId); }, 400); // Fast 400ms
        }

        // ==========================================
        // PARTICLE EFFECTS SYSTEM
        // ==========================================
        function spawnParticle(x: number, y: number, type: string, emoji: string) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            particle.textContent = emoji;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';

            // Random direction
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 100;
            particle.style.setProperty('--tx', Math.cos(angle) * distance + 'px');
            particle.style.setProperty('--ty', Math.sin(angle) * distance + 'px');

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }

        function burstParticles(element: HTMLElement, type: string) {
            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const particles = {
                star: { emojis: ['⭐', '✨', '🌟'], count: 8 },
                flame: { emojis: ['🔥', '💥', '⚡'], count: 12 },
                sparkle: { emojis: ['💜', '💫', '✨'], count: 10 }
            };

            const config = (particles as any)[type] || (particles as any).star;

            for (let i = 0; i < config.count; i++) {
                setTimeout(() => {
                    const emoji = config.emojis[Math.floor(Math.random() * config.emojis.length)];
                    spawnParticle(centerX, centerY, type, emoji);
                }, i * 50);
            }
        }

        function triggerCorrectAnswerEffect(slotId: 1 | 2) {
            const slotEl = document.getElementById(`slot${slotId}`);

            if (streak >= 5) {
                // Flame burst for high streak
                burstParticles(slotEl as HTMLElement, 'flame');
            } else if (streak >= 3) {
                // Sparkle for medium streak
                burstParticles(slotEl as HTMLElement, 'sparkle');
            } else {
                // Stars for normal correct
                burstParticles(slotEl as HTMLElement, 'star');
            }
        }

        // TTS using Unified TTSManager
        function playAudioForSlot(id: number) {
            const w = id === 1 ? currentPair!.w1 : currentPair!.w2;
            if (!w) return;

            if ((window as any).TTSManager) (window as any).TTSManager.speak(w, "sv-SE");
        }

        // Initialize voices setup handled by TTSManager/utils.js

        function showComboText(text: string) {
            const el = document.createElement('div');
            el.className = 'combo-text';
            el.textContent = text;
            const rect = document.getElementById('livesContainer')!.getBoundingClientRect();
            el.style.left = (rect.left - 50) + 'px';
            el.style.top = (rect.top + 20) + 'px';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1000);
        }

        handleAnswer = (selectedVowel: string, btnEl: HTMLButtonElement | null, slotId: 1 | 2) => {
            if (isProcessing) return;
            const expectedVowel = slotId === 1 ? currentPair!.pair[0] : currentPair!.pair[1];

            if (selectedVowel === expectedVowel) {
                solvedStatus[slotId] = true;
                failedStatus[slotId] = false; // Clear failure if corrected
                const slotEl = document.getElementById(`slot${slotId}`)!;
                slotEl.classList.add('solved');
                slotEl.classList.remove('wrong'); // Fix: Remove red border if corrected

                const fullWord = slotId === 1 ? currentPair!.w1 : currentPair!.w2;
                if (slotId === 1) (document.querySelector('.word-1-text') as HTMLElement).innerHTML = fullWord;
                else (document.querySelector('.word-2-text') as HTMLElement).innerHTML = fullWord;

                if (btnEl) btnEl.classList.add('selected-correct'); // Guarded
                playAudioForSlot(slotId);
                triggerCorrectAnswerEffect(slotId); // Particle burst!
                streak++;
                score += 100 * (streak > 5 ? 2 : 1);

                // Combo Visuals
                if (streak % 5 === 0) showComboText(`${streak}x COMBO!`);
                else if (streak === 3) showComboText("HEATING UP!");

                if (solvedStatus[1] && solvedStatus[2]) {
                    levelComplete();
                } else {
                    currentTarget = slotId === 1 ? 2 : 1;
                    updateTargetStyling();
                    if (streak > 3) playAudioForSlot(currentTarget);
                }
            } else {
                if (btnEl) btnEl.classList.add('selected-wrong'); // Guarded
                lives--; streak = 0; updateLives();
                if ((window as any).navigator?.vibrate) (window as any).navigator.vibrate(400);

                // Reveal Answer in RED and Continue
                solvedStatus[slotId] = true;
                failedStatus[slotId] = true; // Mark as failed persistence
                const slotEl = document.getElementById(`slot${slotId}`)!;
                slotEl.classList.add('wrong');

                // Show the USER'S choice (even if wrong) so they see "Böl" instead of "Bol"
                // Match case logic: If "_" is at start, Keep Case. If middle, Lowercase.
                // Simple heuristic: Check frame index 0.
                const isStart = currentPair!.frame.indexOf('_') === 0;
                const vDisplay = isStart ? selectedVowel.toUpperCase() : selectedVowel.toLowerCase();
                const wrongWord = currentPair!.frame.replace('_', vDisplay);

                if (slotId === 1) (document.querySelector('.word-1-text') as HTMLElement).innerText = wrongWord;
                else (document.querySelector('.word-2-text') as HTMLElement).innerText = wrongWord;

                if (lives <= 0) {
                    showEndScreen(false);
                } else {
                    // Continue Flow
                    if (solvedStatus[1] && solvedStatus[2]) {
                        levelComplete();
                    } else {
                        currentTarget = slotId === 1 ? 2 : 1;
                        updateTargetStyling();
                    }
                }
            }
        }

        levelComplete = () => {
            isProcessing = true;
            const timeTaken = Date.now() - levelStartTime;
            if (timeTaken < 5000) { speedBadge.classList.add('visible'); score += 50; }

            // Hide Boss Banner during transition to avoid confusion
            bossBanner.style.display = 'none';

            setTimeout(() => { cardFlipper.classList.add('flipped'); }, 600);

            // Wait for user to read context (reduced to 1s based on request)
            setTimeout(() => {
                startCountdown();
            }, 1000);
        }

        function startCountdown() {
            const container = document.getElementById('inlineCountdown')!;
            // Update Text based on context
            const isStageClear = (currentLevel === LEVELS_PER_STAGE);
            const msg = isStageClear ? "NEXT STAGE" : "NEXT LEVEL";

            container!.innerHTML = `<div class="countdown-number" id="cNum">3</div><div class="countdown-text">${msg}</div>`;
            container!.classList.add('visible');

            let count = 3;
            const numEl = container!.querySelector('#cNum')!;

            const timer = setInterval(() => {
                count--;
                if (count > 0) {
                    numEl.textContent = count.toString();
                } else {
                    clearInterval(timer);
                    container.classList.remove('visible');

                    // Progression Logic
                    if (currentLevel < LEVELS_PER_STAGE) {
                        currentLevel++;
                    } else {
                        // Stage Complete!
                        currentStage++;
                        currentLevel = 1;

                        // Default Reward: +1 Heart (Max 5)
                        if (lives < 5) {
                            lives++;
                            updateLives();
                            showComboText("+1 ❤️");
                        }

                        // Save Progress Explicitly
                        try {
                            localStorage.setItem('vowelGameStage', currentStage.toString());
                        } catch (e) { console.error("Save failed", e); }

                        // Trigger Celebration
                        triggerStageCelebration();
                    }
                    isProcessing = false;
                    loadLevel();
                }
            }, 1000);
        }

        function showEndScreen(win: boolean) {
            playArea.style.display = 'none';
            const endScreen = document.getElementById('endScreen')!;
            endScreen.style.display = 'block';
            endScreen.querySelector('#endTitle')!.textContent = win ? "Grattis! 👑" : "Game Over 💀";
            endScreen.querySelector('#endMessage')!.textContent = win ? "Du har bemästrat alla nivåer!" : "Dina liv tog slut.";
            endScreen.querySelector('#finalScore')!.textContent = `Poäng: ${score}`;
        }

        // ==========================================
        // UI FEATURES
        // ==========================================
        function toggleStageMap() {
            const el = document.getElementById('stageMapOverlay')!;
            if (el.style.display === 'block') {
                el.style.display = 'none';
            } else {
                renderStageMap();
                el.style.display = 'block';
            }
        }

        function renderStageMap() {
            const grid = document.getElementById('stageGrid')!;
            grid.innerHTML = '';
            for (let i = 1; i <= TOTAL_STAGES; i++) {
                const node = document.createElement('div');
                node.className = 'stage-node';
                node.textContent = i.toString();

                if (i < currentStage) {
                    node.classList.add('solved');
                    node.innerHTML += ' ✓';
                    // Allow clicking to replay solved stages
                    node.addEventListener('click', () => {
                        currentStage = i;
                        currentLevel = 1;
                        toggleStageMap();
                        loadLevel();
                    });
                } else if (i === currentStage) {
                    node.classList.add('current');
                    node.addEventListener('click', () => {
                        toggleStageMap(); // Just close and continue
                    });
                } else {
                    node.classList.add('locked');
                    node.innerHTML += ' 🔒';
                }
                grid.appendChild(node);
            }
        }

        function triggerStageCelebration() {
            const overlay = document.getElementById('celebrationOverlay')!;
            overlay.innerHTML = '';
            overlay.style.display = 'block';

            // Create Confetti
            for (let i = 0; i < 100; i++) {
                const c = document.createElement('div');
                c.className = 'confetti';
                c.style.left = Math.random() * 100 + '%';
                c.style.backgroundColor = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'][Math.floor(Math.random() * 6)];
                c.style.animationDuration = (Math.random() * 2 + 1) + 's';
                c.style.animationDelay = Math.random() + 's';
                overlay!.appendChild(c);
            }

            // Big Text
            const text = document.createElement('h1');
            text.textContent = "STAGE CLEAR! 🎉";
            text.style.position = 'absolute';
            text.style.top = '15%'; text.style.left = '50%'; /* Higher up */
            text.style.transform = 'translate(-50%, -50%) scale(0)';
            text.style.color = '#fff';
            text.style.fontSize = '3rem';
            text.style.textShadow = '0 0 20px black';
            text.style.transition = 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            overlay!.appendChild(text);

            setTimeout(() => text.style.transform = 'translate(-50%, -50%) scale(1)', 100);

            // Cleanup
            setTimeout(() => {
                overlay!.style.display = 'none';
                overlay!.innerHTML = '';
            }, 3500);
        }

        // ==========================================
        // DAILY CHALLENGE SYSTEM
        // ==========================================
        let isDailyMode = false;
        let dailyStartTime = 0;
        let dailyWordsCompleted = 0;
        const DAILY_WORDS_COUNT = 5;

        function getTodayKey() {
            const d = new Date();
            return `daily_${d.getFullYear()}_${d.getMonth()}_${d.getDate()}`;
        }

        function isDailyChallengeCompleted() {
            return localStorage.getItem(getTodayKey()) === 'completed';
        }

        function getDailyPairs() {
            // Generate consistent pairs for each day using date as seed
            const today = new Date();
            const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
            const shuffled = [...minimalPairsData].sort((a, b) => {
                const hashA = (seed * minimalPairsData.indexOf(a)) % 1000;
                const hashB = (seed * minimalPairsData.indexOf(b)) % 1000;
                return hashA - hashB;
            });
            return shuffled.slice(0, DAILY_WORDS_COUNT);
        }

        function updateDailyButton() {
            const btn = document.getElementById('dailyBtn');
            if (btn && isDailyChallengeCompleted()) {
                btn.classList.add('completed');
                btn.innerHTML = '✅ Avklarad idag!';
            }
        }

        function startDailyChallenge() {
            if (isDailyChallengeCompleted()) return;

            isDailyMode = true;
            dailyWordsCompleted = 0;
            dailyStartTime = Date.now();

            // Hide start screen, show game
            document.getElementById('startScreen')!.style.display = 'none';
            document.getElementById('playArea')!.style.display = 'block';
            hasStarted = true;

            // Show timer
            const timerEl = document.getElementById('dailyTimer')!;
            timerEl.style.display = 'block';

            // Start timer update
            dailyTimerInterval = setInterval(() => {
                const elapsed = Math.floor((Date.now() - dailyStartTime) / 1000);
                const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
                const secs = (elapsed % 60).toString().padStart(2, '0');
                timerEl!.textContent = `⏱️ ${mins}:${secs}`;
            }, 1000);

            // Set up daily pairs
            (window as any).dailyPairs = getDailyPairs();
            (window as any).dailyIndex = 0;

            // Reset state
            lives = 3;
            streak = 0;
            score = 0;
            updateLives();

            loadDailyLevel();
        }

        function loadDailyLevel() {
            if ((window as any).dailyIndex >= DAILY_WORDS_COUNT) {
                completeDailyChallenge();
                return;
            }

            currentPair = (window as any).dailyPairs[(window as any).dailyIndex];
            solvedStatus = { 1: false, 2: false };
            failedStatus = { 1: false, 2: false };
            currentTarget = 1;
            levelStartTime = Date.now();

            // Update UI
            levelBadge.textContent = `Daily: ${(window as any).dailyIndex + 1}/${DAILY_WORDS_COUNT}`;

            cardFlipper.classList.remove('flipped');
            speedBadge.classList.remove('visible');

            const p = currentPair!;
            let frame1 = p.w1.replace(new RegExp(p.pair[0], 'i'), '<span class="missing-vowel"></span>');
            let frame2 = p.w2.replace(new RegExp(p.pair[1], 'i'), '<span class="missing-vowel"></span>');

            document.querySelector('.word-1-text')!.innerHTML = frame1;
            document.querySelector('.word-2-text')!.innerHTML = frame2;
            (document.querySelector('.word-1-def') as HTMLElement).innerText = p.d1;
            (document.querySelector('.word-2-def') as HTMLElement).innerText = p.d2;
            document.getElementById('emoji1')!.textContent = p.e1 || '📦';
            document.getElementById('emoji2')!.textContent = p.e2 || '📦';

            updateTargetStyling();

            // All Swedish vowels for distractors
            const allVowels = ['A', 'E', 'I', 'O', 'U', 'Y', 'Å', 'Ä', 'Ö'];
            const correctVowels = p.pair;

            // Get 2 distractor vowels (not in the pair)
            const distractors = shuffleArray(allVowels
                .filter(v => !correctVowels.includes(v)))
                .slice(0, 2);

            // Combine and shuffle all 4 options
            const allOptions = shuffleArray([...correctVowels, ...distractors]);

            optionsArea.innerHTML = '';
            allOptions.forEach(v => {
                const btn = document.createElement('button');
                btn.className = 'vowel-btn slide-in';
                btn.textContent = v;
                btn.draggable = true;
                setupInteractions(btn, v);
                optionsArea.appendChild(btn);
            });
        }

        function dailyLevelComplete() {
            (window as any).dailyIndex++;
            dailyWordsCompleted++;

            setTimeout(() => {
                cardFlipper.classList.add('flipped');
            }, 600);

            setTimeout(() => {
                loadDailyLevel();
            }, 1500);
        }

        function completeDailyChallenge() {
            // Stop timer
            if (dailyTimerInterval) clearInterval(dailyTimerInterval);
            document.getElementById('dailyTimer')!.style.display = 'none';

            // Mark as completed
            localStorage.setItem(getTodayKey(), 'completed');

            // Award +3 hearts
            lives = Math.min(lives + 3, 5);
            updateLives();

            // Show badge
            const badge = document.getElementById('dailyBadge')!;
            badge.classList.add('visible');

            // Calculate time
            const elapsed = Math.floor((Date.now() - dailyStartTime) / 1000);
            const mins = Math.floor(elapsed / 60);
            const secs = elapsed % 60;
            badge.innerHTML = `🏆 Dagens Utmaning Avklarad!<br><span style="font-size:1.2rem;">Tid: ${mins}:${secs.toString().padStart(2, '0')}</span><br><span style="font-size:2rem;">+3 ❤️</span>`;

            setTimeout(() => {
                badge.classList.remove('visible');
                isDailyMode = false;
                // Return to start screen
                document.getElementById('playArea')!.style.display = 'none';
                document.getElementById('startScreen')!.style.display = 'flex';
                updateDailyButton();
            }, 4000);
        }

        // Override levelComplete for daily mode
        const originalLevelComplete = levelComplete;
        levelComplete = () => {
            if (isDailyMode) {
                dailyLevelComplete();
            } else {
                originalLevelComplete();
            }
        };

        // Check daily button on load
        document.addEventListener('DOMContentLoaded', () => {
            // Apply saved theme
            const savedTheme = localStorage.getItem('theme') || 'dark';
            document.documentElement.setAttribute('data-theme', savedTheme);

            // Toggle Mobile View Function
            (window as any).toggleMobileView = function () {
                document.documentElement.classList.toggle('iphone-mode');
                document.body.classList.toggle('iphone-view');
                const isActive = document.body.classList.contains('iphone-view');
                localStorage.setItem('mobileView', isActive ? 'true' : 'false');
                const btn = document.getElementById('mobileToggle');
                if (btn) btn.classList.toggle('active', isActive);
            };

            // Apply mobile view from localStorage
            if (localStorage.getItem('mobileView') === 'true') {
                document.documentElement.classList.add('iphone-mode');
                document.body.classList.add('iphone-view');
                const btn = document.getElementById('mobileToggle');
                if (btn) btn.classList.add('active');
            }

            updateDailyButton();
        });




        // ==========================================
        // AUDIO LEARNING MODE
        // ==========================================
        let isAudioMode = false;

        function startAudioMode() {
            isAudioMode = true;

            // Add audio mode class to body
            document.body.classList.add('audio-mode');

            // Start normal game with audio mode active
            startGame();

            // Auto-play first word after a short delay
            setTimeout(() => {
                playAudioForSlot(currentTarget);
            }, 1000);
        }

        function revealWordInAudioMode(slotId: any) {
            if (!isAudioMode) return;
            const wordText = document.querySelector(`.word-${slotId}-text`);
            if (wordText) wordText.classList.add('revealed');
        }

        // Modify handleAnswer to reveal word in audio mode
        const originalHandleAnswer = handleAnswer;
        handleAnswer = (selectedVowel: string, btnEl: HTMLButtonElement | null, slotId: 1 | 2) => {
            // Reveal the word when answered (correct or wrong)
            revealWordInAudioMode(slotId);

            // Call original
            originalHandleAnswer(selectedVowel, btnEl, slotId);
        };

        // Reset audio mode on game restart
        function resetAudioMode() {
            isAudioMode = false;
            document.body.classList.remove('audio-mode');
            document.querySelectorAll('.word-text').forEach(el => el.classList.remove('revealed'));
        }

        // Do NOT auto init; wait for Start Button
console.log("Vowel Game Loaded");

// Expose functions to window
(window as any).startGame = startGame;
(window as any).startDailyChallenge = startDailyChallenge;
(window as any).handleAnswer = handleAnswer;
(window as any).playAudioForSlot = playAudioForSlot;