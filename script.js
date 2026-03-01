// Game State
const gameState = {
    phase: 'setup', // setup, role-assignment, night, day, ended
    settings: {
        playerCount: 4,
        language: 'zh-HK'
    },
    players: [], // Array of { id, role, dice: [], diceRolled: false }
    roleCheckIndex: 0,
    roleCheckState: 'waiting', // 'waiting', 'viewing', 'rolled'
    nightState: {
        currentHour: 0,
        timer: null,
        cheeseTaken: false,
        cheeseStealable: false,
        peekingEnabled: false,
        currentStepIndex: 0
    },
    dayTimerInterval: null,
    audio: {
        bgm: null
    }
};

// Audio Logic
function playBGM(type) {
    console.log(`Playing BGM: ${type}`);
    // Placeholder: In real app, load and play Audio objects here
}

function stopBGM() {
    console.log('Stopping BGM');
    // Placeholder: Stop Audio objects here
}

// ─── localStorage Helpers ────────────────────────────────────────────────────

/**
 * Save player names to localStorage.
 */
function savePlayerNames(names) {
    try {
        localStorage.setItem('cheeseThief_playerNames', JSON.stringify(names));
    } catch (e) {
        console.warn('localStorage not available:', e);
    }
}

/**
 * Load player names from localStorage for a given player count.
 */
function loadPlayerNames(playerCount) {
    try {
        const saved = localStorage.getItem('cheeseThief_playerNames');
        if (saved) {
            const names = JSON.parse(saved);
            return names.slice(0, playerCount);
        }
    } catch (e) {
        console.warn('localStorage read failed:', e);
    }
    return [];
}

const translations = {
    'zh-HK': {
        nightStart: "天黑請閉眼",
        wakeUp: "{n}點！擲到{n}點嘅玩家請睜眼。",
        closeEyes: "請閉眼。",
        thiefAccomplice5P: "如果芝士大盜同其他人同一時間睜眼，大盜請指向一位玩家作為你嘅共犯。",
        thiefAccomplice: "芝士大盜請睜眼，並選擇{n}位共犯。",
        accompliceWake: "被選中嘅共犯請睜眼，同大盜相認。",
        thiefClose: "芝士大盜同共犯請閉眼。",
        morning: "天光啦！所有人請睜眼。",
        votingIntro: "所有人請準備投票，3...",
        voting2: "2...",
        voting1: "1...",
        votingPoint: "請指認！",
        // UI Strings
        uiNight: "🌙 夜晚階段",
        uiDay: "☀️ 白天階段",
        uiDiscuss: "討論時間！搵出誰是芝士大盜！",
        uiVoting: "🗳️ 投票時間！",
        uiPoint: "3... 2... 1... 指！",
        uiReadyVote: "準備投票",
        uiPlayAgain: "再玩一次",
        uiWaiting: "等待開始...",
        // Role Assignment
        uiRoleAssign: "身份確認",
        passToPlayer: "請將裝置交給玩家 {n}",
        iAmPlayer: "我係玩家 {n}",
        revealIdentity: "顯示身份",
        hideAndPass: "隱藏並交給下一位",
        startGame: "開始遊戲",
        roleThief: "芝士大盜",
        roleSleepyhead: "睡夢蟲",
        roleBackstabber: "背鍋鼠",
        yourDice: "你嘅骰仔點數",
        // Dice Rolling
        tapToRoll: "撳骰仔擲骰！",
        rolling: "擲緊...",
        diceResult: "你嘅點數係",
        // Dice Choice (4P)
        chooseDie: "揀一粒骰仔作為你嘅睜眼時間",
        chosenWakeUp: "你會喺{n}點睜眼",
        thiefWakeBoth: "你會喺兩個時間都睜眼",
        // Peek
        peekHint: "你可以偷睇一位玩家嘅骰仔",
        noPeek: "有其他人同時醒緊，唔可以偷睇",
        // Voting
        readyToVote: "準備投票",
        votingIntro: "投票時間！",
        voting3: "三",
        voting2: "二",
        voting1: "一",
        votingPoint: "指！",
        // End Screen
        gameOver: "遊戲結束",
        revealTitle: "身份揭曉",
        playAgain: "再玩一次",
        playerLabel: "玩家 {n}",
        // Setup
        playerNameLabel: "玩家 {n} 名",
        playerNamePlaceholder: "玩家 {n}",
    },
    'en-US': {
        nightStart: "Everyone close your eyes",
        wakeUp: "{n} o'clock! Players with {n}, wake up.",
        closeEyes: "Everyone close your eyes.",
        thiefAccomplice5P: "If the Thief woke up with anyone, Thief now points to ONE player to be your Accomplice.",
        thiefAccomplice: "Thief wake up and choose an accomplice. Touch {n} player(s).",
        accompliceWake: "Selected accomplice(s) wake up and acknowledge the Thief.",
        thiefClose: "Thief and Accomplice(s) close your eyes.",
        morning: "Morning has broken! Everyone wake up.",
        votingIntro: "Everyone, point your finger in 3...",
        voting2: "2...",
        voting1: "1...",
        votingPoint: "Point now!",
        // UI Strings
        uiNight: "🌙 Night Phase",
        uiDay: "☀️ Day Phase",
        uiDiscuss: "Discuss and find the Cheese Thief!",
        uiVoting: "🗳️ Voting Time!",
        uiPoint: "3... 2... 1... Point!",
        uiReadyVote: "Ready to Vote",
        uiPlayAgain: "Play Again",
        uiWaiting: "Waiting to start...",
        // Role Assignment
        uiRoleAssign: "Identity Check",
        passToPlayer: "Pass device to Player {n}",
        iAmPlayer: "I am Player {n}",
        revealIdentity: "Reveal Identity",
        hideAndPass: "Hide & Pass",
        startGame: "Start Game",
        roleThief: "Cheese Thief",
        roleSleepyhead: "Sleepyhead",
        roleBackstabber: "Backstabber",
        yourDice: "Your Dice Roll",
        // Dice Rolling
        tapToRoll: "Tap the dice to roll!",
        rolling: "Rolling...",
        diceResult: "Your number is",
        // Dice Choice (4P)
        chooseDie: "Tap one die to choose your wake-up time",
        chosenWakeUp: "You will wake up at {n} o'clock",
        thiefWakeBoth: "You wake up at BOTH times",
        // Peek
        peekHint: "You may peek at one player's dice",
        noPeek: "Others are awake — no peeking",
        // Voting
        readyToVote: "Ready to Vote",
        votingIntro: "Voting Time!",
        voting3: "Three",
        voting2: "Two",
        voting1: "One",
        votingPoint: "Point!",
        // End Screen
        gameOver: "Game Over",
        revealTitle: "Identity Reveal",
        playAgain: "Play Again",
        playerLabel: "Player {n}",
        // Setup
        playerNameLabel: "Player {n} Name",
        playerNamePlaceholder: "Player {n}",
    }
};

function t(key, params = {}) {
    const lang = gameState.settings.language;
    let text = translations[lang]?.[key] || translations['en-US']?.[key] || key;
    for (const [k, v] of Object.entries(params)) {
        text = text.replaceAll(`{${k}}`, v);
    }
    return text;
}

// ─── Core Functions ──────────────────────────────────────────────

/**
 * Returns players who are actually awake at a given hour.
 * For 5-8P (1 die each): deterministic — wakeUpChoice equals their single die.
 * For 4P Thief: awake at both dice hours.
 * For 4P Sleepyhead/Backstabber: awake only at their chosen die (wakeUpChoice).
 */
function getAwakePlayersAtHour(hour) {
    return gameState.players.filter(p => {
        if (p.wakeUpChoice !== null && p.wakeUpChoice !== undefined) {
            // Player has made an explicit choice (or auto-set for 5-8P)
            if (Array.isArray(p.wakeUpChoice)) {
                // Thief in 4P: wakes at both
                return p.wakeUpChoice.includes(hour);
            }
            return p.wakeUpChoice === hour;
        }
        // Fallback: use raw dice (before choices are made)
        return p.dice.includes(hour);
    });
}

/**
 * Check if a player needs to manually choose their wake-up die.
 * Only 4P Sleepyheads/Backstabbers with 2 different dice need to choose.
 */
function needsWakeUpChoice(player) {
    return gameState.settings.playerCount === 4 && player.role !== 'thief';
}

/**
 * Determine if peeking should be enabled at a given hour.
 * - 4 players: peeking is DISABLED (too easy).
 * - 5-8 players: allowed only if exactly 1 player is awake AND that player is a Sleepyhead.
 */
function canPeekAtHour(hour) {
    if (gameState.settings.playerCount === 4) return false;
    const awake = getAwakePlayersAtHour(hour);
    if (awake.length !== 1) return false;
    return awake[0].role === 'sleepyhead';
}

/**
 * Determine if the Thief can steal the cheese at a given hour.
 * The Thief must be awake (their dice includes the hour number).
 */
function canStealAtHour(hour) {
    const awake = getAwakePlayersAtHour(hour);
    return awake.some(p => p.role === 'thief');
}

/**
 * Build the night phase instruction sequence.
 * Each step: { text, duration, hour?, type }
 * Types: 'intro', 'wakeUp', 'closeEyes', 'accomplice', 'morning'
 */
function getNightSequence(playerCount) {
    const sequence = [
        { text: t('nightStart'), duration: 3, type: 'intro' }
    ];

    for (let h = 1; h <= 6; h++) {
        sequence.push({ text: t('wakeUp', { n: h }), duration: 5, hour: h, type: 'wakeUp' });
        sequence.push({ text: t('closeEyes'), duration: 1, hour: h, type: 'closeEyes' });
    }

    // 5 players: audio reminder for accomplice (physical/honor-based)
    if (playerCount === 5) {
        sequence.push({ text: t('thiefAccomplice5P'), duration: 8, type: 'accomplice' });
        sequence.push({ text: t('accompliceWake'), duration: 5, type: 'accomplice' });
        sequence.push({ text: t('thiefClose'), duration: 3, type: 'accomplice' });
    }

    // 6+ players: Thief chooses accomplice(s)
    if (playerCount >= 6) {
        const accompliceCount = playerCount >= 7
            ? (gameState.settings.language === 'zh-HK' ? "兩" : "TWO")
            : (gameState.settings.language === 'zh-HK' ? "一" : "ONE");
        sequence.push({ text: t('thiefAccomplice', { n: accompliceCount }), duration: 10, type: 'accomplice' });
        sequence.push({ text: t('accompliceWake'), duration: 5, type: 'accomplice' });
        sequence.push({ text: t('thiefClose'), duration: 3, type: 'accomplice' });
    }

    sequence.push({ text: t('morning'), duration: 0, type: 'morning' });
    return sequence;
}

/**
 * Assign roles to players. Dice arrays are left empty — players roll on-screen.
 * Role distribution:
 *   - Always 1 Thief
 *   - 6-8 players: 1 Backstabber (replaces a Sleepyhead)
 *   - Rest are Sleepyheads
 */
function assignRoles(playerCount) {
    const roles = ['thief'];

    if (playerCount >= 6) {
        roles.push('backstabber');
    }

    while (roles.length < playerCount) {
        roles.push('sleepyhead');
    }

    // Fisher-Yates shuffle
    for (let i = roles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    gameState.players = [];
    const savedNames = loadPlayerNames(playerCount);
    for (let i = 0; i < playerCount; i++) {
        gameState.players.push({
            id: i + 1,
            name: savedNames[i] || t('playerLabel', { n: i + 1 }),
            role: roles[i],
            dice: [],
            diceRolled: false,
            wakeUpChoice: null  // number, array, or null
        });
    }
}

/**
 * Roll dice for a specific player on-screen.
 * 4 players: 2 dice. 5-8 players: 1 die. Duplicates allowed for 4P.
 */
function rollDiceForPlayer(playerIndex) {
    const player = gameState.players[playerIndex];
    if (player.diceRolled) return;

    const playerCount = gameState.settings.playerCount;
    player.dice = [];

    if (playerCount === 4) {
        player.dice.push(Math.floor(Math.random() * 6) + 1);
        player.dice.push(Math.floor(Math.random() * 6) + 1);
    } else {
        player.dice.push(Math.floor(Math.random() * 6) + 1);
    }

    player.diceRolled = true;

    // Auto-set wakeUpChoice for players who don't need to choose
    if (gameState.settings.playerCount !== 4) {
        // 5-8P: single die, auto wake at that number
        player.wakeUpChoice = player.dice[0];
    } else if (player.role === 'thief') {
        // 4P Thief: wakes at both dice
        player.wakeUpChoice = [...player.dice];
    }
    // 4P Sleepyhead/Backstabber: wakeUpChoice stays null until they choose
}

// ─── Game Phase Functions ────────────────────────────────────────

function startRoleAssignment() {
    assignRoles(gameState.settings.playerCount);
    updateGameState({
        phase: 'role-assignment',
        roleCheckIndex: 0,
        roleCheckState: 'waiting'
    });
}

function handleRoleAction() {
    const currentIndex = gameState.roleCheckIndex;
    const playerCount = gameState.settings.playerCount;
    const player = gameState.players[currentIndex];

    if (gameState.roleCheckState === 'waiting') {
        // Player tapped "I am Player X" → show role card with roll prompt
        gameState.roleCheckState = 'viewing';
        renderUI();
    } else if (gameState.roleCheckState === 'viewing') {
        // Player tapped "Roll Dice" → roll and show result
        rollDiceForPlayer(currentIndex);
        gameState.roleCheckState = 'rolled';
        renderUI();
    } else if (gameState.roleCheckState === 'rolled') {
        // Block if 4P Sleepyhead hasn't chosen a die yet
        if (needsWakeUpChoice(player) && player.wakeUpChoice === null) {
            return; // Must tap a die first
        }
        // Player tapped "Hide & Pass" or "Start Game"
        if (currentIndex < playerCount - 1) {
            gameState.roleCheckIndex++;
            gameState.roleCheckState = 'waiting';
            renderUI();
        } else {
            startNightPhase();
        }
    }
}

/**
 * Handle a 4P Sleepyhead tapping a die to choose their wake-up hour.
 */
function handleDiceChoice(diceValue) {
    const player = gameState.players[gameState.roleCheckIndex];
    if (!needsWakeUpChoice(player)) return;
    if (player.wakeUpChoice !== null) return; // already chosen

    player.wakeUpChoice = diceValue;
    renderUI();
}

function renderGameBoard() {
    const container = document.getElementById('players-container');
    const cheese = document.getElementById('cheese-token');
    if (!container || !cheese) return;

    container.innerHTML = '';

    // — Cheese Token —
    if (gameState.nightState.cheeseTaken) {
        cheese.classList.add('taken');
    } else {
        cheese.classList.remove('taken');
    }

    cheese.onclick = () => {
        if (!gameState.nightState.cheeseTaken && gameState.nightState.cheeseStealable) {
            gameState.nightState.cheeseTaken = true;
            cheese.classList.add('taken');
        }
    };

    // — Player Tokens —
    const playerCount = gameState.settings.playerCount;
    const radius = 120;
    const centerX = 150;
    const centerY = 150;

    gameState.players.forEach((player, index) => {
        const angle = (index / playerCount) * 2 * Math.PI - (Math.PI / 2);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        const token = document.createElement('div');
        token.className = 'token player-token';
        token.dataset.playerId = player.id;
        token.style.left = `${x}px`;
        token.style.top = `${y}px`;
        token.style.transform = 'translate(-50%, -50%)';

        const label = document.createElement('span');
        label.className = 'player-label';
        label.textContent = `P${player.id}`;

        const diceVal = document.createElement('span');
        diceVal.className = 'dice-value';
        // Show wakeUpChoice for peeking (the relevant number)
        if (Array.isArray(player.wakeUpChoice)) {
            diceVal.textContent = player.wakeUpChoice.join(',');
        } else if (player.wakeUpChoice !== null && player.wakeUpChoice !== undefined) {
            diceVal.textContent = player.wakeUpChoice;
        } else {
            diceVal.textContent = player.dice.join(',');
        }

        token.appendChild(label);
        token.appendChild(diceVal);

        // Peek handler — only works when peeking is enabled
        token.onclick = () => {
            console.log('[Peek] Token clicked:', player.id, 'peekingEnabled:', gameState.nightState.peekingEnabled);
            if (gameState.nightState.peekingEnabled && !token.classList.contains('revealed')) {
                token.classList.add('revealed');
                // Disable further peeks (only one peek allowed per wake-up)
                gameState.nightState.peekingEnabled = false;
                updatePeekHint();
                updatePeekableTokens();
                setTimeout(() => {
                    token.classList.remove('revealed');
                }, 2000);
            }
        };

        container.appendChild(token);
    });
}

function startNightPhase() {
    updateGameState({ phase: 'night' });
    gameState.nightState.cheeseTaken = false;
    gameState.nightState.cheeseStealable = false;
    gameState.nightState.peekingEnabled = false;
    gameState.nightState.currentHour = 0;
    renderGameBoard();
    playBGM('night');
    const sequence = getNightSequence(gameState.settings.playerCount);
    runSequence(sequence);
}

/**
 * Update the peek hint text during the night phase.
 */
function updatePeekHint() {
    const hintEl = document.getElementById('peek-hint');
    if (!hintEl) return;

    if (gameState.nightState.peekingEnabled) {
        hintEl.textContent = t('peekHint');
        hintEl.classList.remove('hidden');
    } else {
        hintEl.textContent = '';
        hintEl.classList.add('hidden');
    }
}

/**
 * Toggle .peekable class on all player tokens to show visual pulsing cue.
 */
function updatePeekableTokens() {
    const tokens = document.querySelectorAll('.player-token');
    tokens.forEach(tok => {
        if (gameState.nightState.peekingEnabled) {
            tok.classList.add('peekable');
        } else {
            tok.classList.remove('peekable');
        }
    });
}

/**
 * Update cheese token state (no visual change — silent to avoid revealing the Thief).
 */
function updateCheeseToken() {
    // Intentionally no visual change.
    // The cheese onclick handler checks cheeseStealable at tap time.
}

/**
 * Run the night phase instruction sequence step by step.
 */
async function runSequence(sequence) {
    const instructionEl = document.getElementById('instruction-text');
    const timerEl = document.getElementById('timer-display');

    for (let i = 0; i < sequence.length; i++) {
        const step = sequence[i];
        gameState.nightState.currentStepIndex = i;

        // Update instruction UI
        if (instructionEl) instructionEl.textContent = step.text;

        // Handle peeking and cheese-steal state for wakeUp / closeEyes steps
        if (step.type === 'wakeUp' && step.hour) {
            gameState.nightState.currentHour = step.hour;
            const awake = getAwakePlayersAtHour(step.hour);
            const peekAllowed = canPeekAtHour(step.hour);
            console.log(`[Night] Hour ${step.hour}: awake=`, awake.map(p => `P${p.id}(${p.role})`), `peek=${peekAllowed}`);
            gameState.nightState.peekingEnabled = peekAllowed;
            gameState.nightState.cheeseStealable = canStealAtHour(step.hour);
            updatePeekHint();
            updatePeekableTokens();
            updateCheeseToken();
        } else if (step.type === 'closeEyes' || step.type === 'intro' || step.type === 'morning') {
            gameState.nightState.peekingEnabled = false;
            gameState.nightState.cheeseStealable = false;
            updatePeekHint();
            updatePeekableTokens();
            updateCheeseToken();
        }

        // Speak
        await speakText(step.text);

        // Wait / Timer countdown
        if (step.duration > 0) {
            for (let s = step.duration; s > 0; s--) {
                if (timerEl) timerEl.textContent = s;
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            if (timerEl) timerEl.textContent = '';
        }

        // Disable peeking and cheese-steal at end of wakeUp step's timer
        if (step.type === 'wakeUp') {
            gameState.nightState.peekingEnabled = false;
            gameState.nightState.cheeseStealable = false;
            updatePeekHint();
            updatePeekableTokens();
            updateCheeseToken();
        }
    }

    // End of night
    startDayPhase();
}

function startDayPhase() {
    updateGameState({ phase: 'day' });
    playBGM('day');
    
    // Start discussion timer
    let seconds = 0;
    const timerEl = document.getElementById('discussion-timer');
    
    // Clear any existing interval
    if (gameState.dayTimerInterval) clearInterval(gameState.dayTimerInterval);
    
    gameState.dayTimerInterval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        if (timerEl) timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
}

function startVoting() {
    if (gameState.dayTimerInterval) clearInterval(gameState.dayTimerInterval);
    updateGameState({ phase: 'ended' });
    stopBGM();
    
    // Voting countdown sequence
    const sequence = [
        { text: t('votingIntro'), duration: 2 },
        { text: t('voting3'), duration: 1 },
        { text: t('voting2'), duration: 1 },
        { text: t('voting1'), duration: 1 },
        { text: t('votingPoint'), duration: 0 }
    ];
    
    runVotingSequence(sequence);
}

async function runVotingSequence(sequence) {
    const instructionEl = document.getElementById('voting-instruction');
    
    for (const step of sequence) {
        if (instructionEl) instructionEl.textContent = step.text;
        await speakText(step.text);
        if (step.duration > 0) {
            await new Promise(resolve => setTimeout(resolve, step.duration * 1000));
        }
    }
}

function resetGame() {
    if (gameState.dayTimerInterval) clearInterval(gameState.dayTimerInterval);
    stopBGM();
    updateGameState({ phase: 'setup' });
}

function speakText(text) {
    return new Promise((resolve) => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = gameState.settings.language;
            utterance.onend = resolve;
            utterance.onerror = resolve;
            window.speechSynthesis.speak(utterance);
        } else {
            // Fallback if no TTS
            console.log("TTS not supported:", text);
            setTimeout(resolve, 1000);
        }
    });
}

function updateGameState(updates) {
    Object.assign(gameState, updates);
    renderUI();
}

/**
 * Render player name input fields in setup screen.
 */
function renderPlayerNames() {
    const container = document.getElementById('player-names-container');
    if (!container) return;

    const playerCount = gameState.settings.playerCount;
    const savedNames = loadPlayerNames(playerCount);

    container.innerHTML = '';
    for (let i = 0; i < playerCount; i++) {
        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'player-name-input-wrapper';

        const label = document.createElement('label');
        label.textContent = t('playerNameLabel', { n: i + 1 });
        label.htmlFor = `player-name-${i}`;

        const input = document.createElement('input');
        input.type = 'text';
        input.id = `player-name-${i}`;
        input.className = 'player-name-input';
        input.placeholder = t('playerNamePlaceholder', { n: i + 1 });
        input.value = savedNames[i] || '';
        input.addEventListener('input', () => {
            const allInputs = container.querySelectorAll('.player-name-input');
            const names = Array.from(allInputs).map(inp => inp.value.trim() || t('playerLabel', { n: parseInt(inp.id.split('-')[2]) + 1 }));
            savePlayerNames(names);
        });

        inputWrapper.appendChild(label);
        inputWrapper.appendChild(input);
        container.appendChild(inputWrapper);
    }
}

/**
 * Render all players' roles and dice at end screen.
 */
function renderRoleReveal() {
    const container = document.getElementById('role-reveal-container');
    if (!container) return;

    container.innerHTML = '';
    gameState.players.forEach(player => {
        const card = document.createElement('div');
        card.className = `role-reveal-card ${player.role}`;

        const nameEl = document.createElement('div');
        nameEl.className = 'reveal-player-name';
        nameEl.textContent = player.name;

        const roleEl = document.createElement('div');
        roleEl.className = 'reveal-role';
        roleEl.textContent = `${getRoleIcon(player.role)} ${getRoleName(player.role)}`;

        const diceEl = document.createElement('div');
        diceEl.className = 'reveal-dice';
        if (Array.isArray(player.wakeUpChoice)) {
            diceEl.textContent = `🎲 ${player.wakeUpChoice.join(', ')}`;
        } else if (player.wakeUpChoice !== null) {
            diceEl.textContent = `🎲 ${player.wakeUpChoice}`;
        } else {
            diceEl.textContent = `🎲 ${player.dice.join(', ')}`;
        }

        card.appendChild(nameEl);
        card.appendChild(roleEl);
        card.appendChild(diceEl);
        container.appendChild(card);
    });
}

function renderUI() {
    const setupScreen = document.getElementById('setup-screen');
    const roleAssignmentScreen = document.getElementById('role-assignment-screen');
    const nightScreen = document.getElementById('night-screen');
    const dayScreen = document.getElementById('day-screen');
    const endScreen = document.getElementById('end-screen');

    // Hide all screens
    [setupScreen, roleAssignmentScreen, nightScreen, dayScreen, endScreen].forEach(el => {
        if (el) {
            el.classList.add('hidden');
            el.classList.remove('fade-in');
        }
    });

    const showScreen = (screen) => {
        if (screen) {
            screen.classList.remove('hidden');
            void screen.offsetWidth; // trigger reflow for animation
            screen.classList.add('fade-in');
        }
    };

    // ── Setup ─────────────────────────
    if (gameState.phase === 'setup') {
        showScreen(setupScreen);
        renderPlayerNames();
    }

    // ── Role Assignment ───────────────
    else if (gameState.phase === 'role-assignment') {
        showScreen(roleAssignmentScreen);
        if (!roleAssignmentScreen) return;

        const title = document.getElementById('role-phase-title');
        const instruction = document.getElementById('role-instruction');
        const revealArea = document.getElementById('role-reveal-area');
        const actionBtn = document.getElementById('role-action-btn');
        const roleText = document.getElementById('player-role-text');
        const diceDisplay = document.querySelector('.dice-display');
        const diceHint = document.getElementById('dice-roll-hint');

        if (title) title.textContent = t('uiRoleAssign');

        const player = gameState.players[gameState.roleCheckIndex];

        if (gameState.roleCheckState === 'waiting') {
            // Show "Pass device to Player X"
            if (instruction) {
                instruction.classList.remove('hidden');
                instruction.textContent = t('passToPlayer', { n: gameState.roleCheckIndex + 1 });
            }
            if (revealArea) revealArea.classList.add('hidden');
            if (actionBtn) actionBtn.textContent = t('iAmPlayer', { n: gameState.roleCheckIndex + 1 });
            if (diceHint) diceHint.classList.add('hidden');
        }
        else if (gameState.roleCheckState === 'viewing') {
            // Show role card + "Tap to Roll" prompt (dice not yet rolled)
            if (instruction) instruction.classList.add('hidden');
            if (revealArea) revealArea.classList.remove('hidden');

            if (roleText) roleText.textContent = getRoleName(player.role);
            const roleIcon = document.querySelector('.role-icon');
            if (roleIcon) roleIcon.textContent = getRoleIcon(player.role);

            // Show empty dice placeholders with tap-to-roll prompt
            if (diceDisplay) {
                diceDisplay.innerHTML = '';
                const numDice = gameState.settings.playerCount === 4 ? 2 : 1;
                for (let d = 0; d < numDice; d++) {
                    const dieEl = document.createElement('div');
                    dieEl.className = 'die die-placeholder';
                    dieEl.textContent = '?';
                    diceDisplay.appendChild(dieEl);
                }
            }

            if (diceHint) {
                diceHint.textContent = t('tapToRoll');
                diceHint.classList.remove('hidden');
            }

            if (actionBtn) actionBtn.textContent = t('tapToRoll');
        }
        else if (gameState.roleCheckState === 'rolled') {
            // Show role + dice result
            if (instruction) instruction.classList.add('hidden');
            if (revealArea) revealArea.classList.remove('hidden');

            if (roleText) roleText.textContent = getRoleName(player.role);
            const roleIcon = document.querySelector('.role-icon');
            if (roleIcon) roleIcon.textContent = getRoleIcon(player.role);

            const needs4PChoice = needsWakeUpChoice(player);
            const hasChosen = player.wakeUpChoice !== null;

            if (diceDisplay) {
                diceDisplay.innerHTML = '';
                player.dice.forEach(d => {
                    const dieEl = document.createElement('div');

                    if (needs4PChoice && !hasChosen) {
                        // 4P Sleepyhead: dice are clickable for choosing
                        dieEl.className = 'die die-rolled die-choosable';
                        dieEl.textContent = d;
                        dieEl.onclick = () => handleDiceChoice(d);
                    } else if (needs4PChoice && hasChosen) {
                        // 4P Sleepyhead: show chosen vs dimmed
                        dieEl.className = d === player.wakeUpChoice
                            ? 'die die-rolled die-chosen'
                            : 'die die-rolled die-dimmed';
                        dieEl.textContent = d;
                    } else {
                        // 5-8P or 4P Thief: just show dice
                        dieEl.className = 'die die-rolled';
                        dieEl.textContent = d;
                    }

                    diceDisplay.appendChild(dieEl);
                });
            }

            // Hint text
            if (diceHint) {
                if (needs4PChoice && !hasChosen) {
                    diceHint.textContent = t('chooseDie');
                } else if (needs4PChoice && hasChosen) {
                    diceHint.textContent = t('chosenWakeUp', { n: player.wakeUpChoice });
                } else if (gameState.settings.playerCount === 4 && player.role === 'thief') {
                    diceHint.textContent = t('thiefWakeBoth');
                } else {
                    diceHint.textContent = t('diceResult');
                }
                diceHint.classList.remove('hidden');
            }

            // Button text — blocked if choice not yet made
            if (needs4PChoice && !hasChosen) {
                if (actionBtn) {
                    actionBtn.textContent = t('chooseDie');
                    actionBtn.disabled = true;
                }
            } else {
                if (actionBtn) actionBtn.disabled = false;
                if (gameState.roleCheckIndex < gameState.settings.playerCount - 1) {
                    if (actionBtn) actionBtn.textContent = t('hideAndPass');
                } else {
                    if (actionBtn) actionBtn.textContent = t('startGame');
                }
            }
        }
    }

    // ── Night ─────────────────────────
    else if (gameState.phase === 'night') {
        showScreen(nightScreen);
        if (nightScreen) {
            const indicator = document.getElementById('night-phase-indicator');
            if (indicator) indicator.textContent = t('uiNight');
            const instructionText = document.getElementById('instruction-text');
            if (instructionText && instructionText.textContent === 'Waiting to start...') {
                instructionText.textContent = t('uiWaiting');
            }
        }
    }

    // ── Day ───────────────────────────
    else if (gameState.phase === 'day') {
        showScreen(dayScreen);
        if (dayScreen) {
            const indicator = document.getElementById('day-phase-indicator');
            if (indicator) indicator.textContent = t('uiDay');
            const desc = dayScreen.querySelector('p');
            if (desc) desc.textContent = t('uiDiscuss');
            const voteBtn = document.getElementById('vote-btn');
            if (voteBtn) voteBtn.textContent = t('uiReadyVote');
        }
    }

    // ── Ended / Voting ────────────────
    else if (gameState.phase === 'ended') {
        showScreen(endScreen);
        if (endScreen) {
            const heading = endScreen.querySelector('h2');
            if (heading) heading.textContent = t('gameOver');
            const restartBtn = document.getElementById('restart-btn');
            if (restartBtn) restartBtn.textContent = t('playAgain');
        }
        renderRoleReveal();
    }
}

// ─── Helpers ─────────────────────────────────────────────────────

function getRoleName(role) {
    if (role === 'thief') return t('roleThief');
    if (role === 'backstabber') return t('roleBackstabber');
    return t('roleSleepyhead');
}

function getRoleIcon(role) {
    if (role === 'thief') return '🧀';
    if (role === 'backstabber') return '🐀';
    return '😴';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ─── Init ────────────────────────────────────────────────────────

function initGame() {
    gameState.phase = 'setup';

    const startBtn = document.getElementById('start-btn');
    const playerCountSelect = document.getElementById('player-count');
    const languageSelect = document.getElementById('language-select');
    const voteBtn = document.getElementById('vote-btn');
    const restartBtn = document.getElementById('restart-btn');
    const roleActionBtn = document.getElementById('role-action-btn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            const count = parseInt(playerCountSelect.value);
            const lang = languageSelect.value;
            gameState.settings.playerCount = count;
            gameState.settings.language = lang;
            startRoleAssignment();
        });
    }

    if (playerCountSelect) {
        playerCountSelect.addEventListener('change', () => {
            gameState.settings.playerCount = parseInt(playerCountSelect.value);
            renderPlayerNames();
        });
    }

    if (languageSelect) {
        languageSelect.addEventListener('change', () => {
            gameState.settings.language = languageSelect.value;
            renderPlayerNames();
        });
    }

    if (roleActionBtn) {
        roleActionBtn.addEventListener('click', handleRoleAction);
    }

    if (voteBtn) {
        voteBtn.addEventListener('click', startVoting);
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', resetGame);
    }

    renderUI();
}

// Initialize on load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', initGame);
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        gameState,
        initGame,
        updateGameState,
        getNightSequence,
        assignRoles,
        rollDiceForPlayer,
        getAwakePlayersAtHour,
        canPeekAtHour,
        canStealAtHour,
        getRoleName,
        getRoleIcon,
        needsWakeUpChoice,
        handleDiceChoice
    };
}