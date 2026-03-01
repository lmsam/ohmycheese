const {
    getNightSequence,
    gameState,
    assignRoles,
    rollDiceForPlayer,
    getAwakePlayersAtHour,
    canPeekAtHour,
    canStealAtHour,
    getRoleName,
    getRoleIcon,
    needsWakeUpChoice,
    handleDiceChoice
} = require('../script.js');

// ─── Night Sequence Tests ────────────────────────────────────────

describe('Night Phase Sequence', () => {
    beforeEach(() => {
        gameState.settings.language = 'en-US';
    });

    test('should return standard 1-6 sequence for 4 players (no accomplice phase)', () => {
        const sequence = getNightSequence(4);
        expect(sequence[0].type).toBe('intro');
        expect(sequence.some(s => s.text.includes("1 o'clock"))).toBe(true);
        expect(sequence.some(s => s.text.includes("6 o'clock"))).toBe(true);
        expect(sequence.some(s => s.text.includes('Thief') && s.text.includes('accomplice'))).toBe(false);
        expect(sequence[sequence.length - 1].type).toBe('morning');
    });

    test('should include accomplice reminder for 5 players', () => {
        const sequence = getNightSequence(5);
        const accompliceSteps = sequence.filter(s => s.type === 'accomplice');
        expect(accompliceSteps.length).toBe(3);
        expect(accompliceSteps[0].text).toContain('Thief woke up with anyone');
        expect(accompliceSteps[0].text).toContain('ONE player');
    });

    test('should include accomplice selection phase for 6 players (choose ONE)', () => {
        const sequence = getNightSequence(6);
        const accompliceSteps = sequence.filter(s => s.type === 'accomplice');
        expect(accompliceSteps.length).toBe(3);
        expect(accompliceSteps[0].text).toContain('Thief wake up and choose an accomplice');
        expect(accompliceSteps[0].text).toContain('ONE');
    });

    test('should include accomplice selection phase for 7 players (choose TWO)', () => {
        const sequence = getNightSequence(7);
        const accompliceSteps = sequence.filter(s => s.type === 'accomplice');
        expect(accompliceSteps.length).toBe(3);
        expect(accompliceSteps[0].text).toContain('TWO');
    });

    test('should include accomplice selection phase for 8 players (choose TWO)', () => {
        const sequence = getNightSequence(8);
        const accompliceSteps = sequence.filter(s => s.type === 'accomplice');
        expect(accompliceSteps[0].text).toContain('TWO');
    });

    test('each wakeUp step should have an hour property', () => {
        const sequence = getNightSequence(5);
        const wakeUpSteps = sequence.filter(s => s.type === 'wakeUp');
        expect(wakeUpSteps).toHaveLength(6);
        wakeUpSteps.forEach((step, i) => {
            expect(step.hour).toBe(i + 1);
        });
    });

    test('sequence ends with morning step', () => {
        for (let count = 4; count <= 8; count++) {
            const sequence = getNightSequence(count);
            expect(sequence[sequence.length - 1].type).toBe('morning');
        }
    });
});

// ─── Role Assignment Tests ───────────────────────────────────────

describe('Role Assignment', () => {
    test('4 players: 1 thief + 3 sleepyheads, no backstabber', () => {
        assignRoles(4);
        const roles = gameState.players.map(p => p.role);
        expect(roles.filter(r => r === 'thief')).toHaveLength(1);
        expect(roles.filter(r => r === 'sleepyhead')).toHaveLength(3);
        expect(roles.filter(r => r === 'backstabber')).toHaveLength(0);
    });

    test('5 players: 1 thief + 4 sleepyheads, no backstabber', () => {
        assignRoles(5);
        const roles = gameState.players.map(p => p.role);
        expect(roles.filter(r => r === 'thief')).toHaveLength(1);
        expect(roles.filter(r => r === 'sleepyhead')).toHaveLength(4);
        expect(roles.filter(r => r === 'backstabber')).toHaveLength(0);
    });

    test('6 players: 1 thief + 1 backstabber + 4 sleepyheads', () => {
        assignRoles(6);
        const roles = gameState.players.map(p => p.role);
        expect(roles.filter(r => r === 'thief')).toHaveLength(1);
        expect(roles.filter(r => r === 'backstabber')).toHaveLength(1);
        expect(roles.filter(r => r === 'sleepyhead')).toHaveLength(4);
    });

    test('7 players: 1 thief + 1 backstabber + 5 sleepyheads', () => {
        assignRoles(7);
        const roles = gameState.players.map(p => p.role);
        expect(roles.filter(r => r === 'thief')).toHaveLength(1);
        expect(roles.filter(r => r === 'backstabber')).toHaveLength(1);
        expect(roles.filter(r => r === 'sleepyhead')).toHaveLength(5);
    });

    test('8 players: 1 thief + 1 backstabber + 6 sleepyheads', () => {
        assignRoles(8);
        const roles = gameState.players.map(p => p.role);
        expect(roles.filter(r => r === 'thief')).toHaveLength(1);
        expect(roles.filter(r => r === 'backstabber')).toHaveLength(1);
        expect(roles.filter(r => r === 'sleepyhead')).toHaveLength(6);
    });

    test('players start with empty dice, null wakeUpChoice, and have names', () => {
        assignRoles(5);
        gameState.players.forEach(p => {
            expect(p.dice).toEqual([]);
            expect(p.diceRolled).toBe(false);
            expect(p.wakeUpChoice).toBeNull();
            expect(p.name).toBeDefined();
            expect(typeof p.name).toBe('string');
        });
    });
});

// ─── Dice Rolling Tests ─────────────────────────────────────────

describe('Dice Rolling', () => {
    test('4 players get 2 dice each', () => {
        gameState.settings.playerCount = 4;
        assignRoles(4);
        rollDiceForPlayer(0);
        expect(gameState.players[0].dice).toHaveLength(2);
        expect(gameState.players[0].diceRolled).toBe(true);
    });

    test('5+ players get 1 die each', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        rollDiceForPlayer(0);
        expect(gameState.players[0].dice).toHaveLength(1);
        expect(gameState.players[0].diceRolled).toBe(true);
    });

    test('dice values are between 1 and 6', () => {
        gameState.settings.playerCount = 4;
        assignRoles(4);
        for (let i = 0; i < 4; i++) {
            rollDiceForPlayer(i);
            gameState.players[i].dice.forEach(d => {
                expect(d).toBeGreaterThanOrEqual(1);
                expect(d).toBeLessThanOrEqual(6);
            });
        }
    });

    test('rolling twice does nothing (already rolled)', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        rollDiceForPlayer(0);
        const firstRoll = [...gameState.players[0].dice];
        rollDiceForPlayer(0);
        expect(gameState.players[0].dice).toEqual(firstRoll);
    });

    test('4P duplicates are allowed', () => {
        // We can't force duplicates, but we verify the code doesn't prevent them.
        // Run many times and ensure no errors.
        gameState.settings.playerCount = 4;
        for (let run = 0; run < 50; run++) {
            assignRoles(4);
            rollDiceForPlayer(0);
            expect(gameState.players[0].dice).toHaveLength(2);
        }
    });
});

// ─── Peeking Logic Tests ────────────────────────────────────────

describe('Peeking Logic', () => {
    test('4 players: peeking is NEVER allowed (game balance)', () => {
        gameState.settings.playerCount = 4;
        assignRoles(4);
        // Set up scenario where exactly 1 Sleepyhead chose hour 3
        gameState.players[0].dice = [3, 5]; gameState.players[0].role = 'sleepyhead'; gameState.players[0].wakeUpChoice = 3;
        gameState.players[1].dice = [1, 2]; gameState.players[1].role = 'sleepyhead'; gameState.players[1].wakeUpChoice = 1;
        gameState.players[2].dice = [4, 6]; gameState.players[2].role = 'sleepyhead'; gameState.players[2].wakeUpChoice = 4;
        gameState.players[3].dice = [1, 4]; gameState.players[3].role = 'thief';      gameState.players[3].wakeUpChoice = [1, 4];

        // Even though only P1 chose 3, 4P peeking is disabled for balance
        expect(canPeekAtHour(3)).toBe(false);
        expect(canPeekAtHour(1)).toBe(false);
        expect(canPeekAtHour(4)).toBe(false);
    });

    test('5 players: peek allowed if exactly 1 Sleepyhead is awake', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        // Set up: only 1 sleepyhead has dice=3
        gameState.players.forEach((p, i) => {
            p.dice = [i + 1]; // P1=1, P2=2, P3=3, P4=4, P5=5
            p.role = 'sleepyhead';
        });
        gameState.players[0].role = 'thief'; // P1 is thief with dice=[1]

        // Hour 2: only P2 (sleepyhead) is awake → can peek
        expect(canPeekAtHour(2)).toBe(true);

        // Hour 1: only P1 (thief) is awake → cannot peek
        expect(canPeekAtHour(1)).toBe(false);
    });

    test('5 players: no peeking if multiple players are awake at same hour', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        gameState.players[0].dice = [3];
        gameState.players[0].role = 'sleepyhead';
        gameState.players[1].dice = [3];
        gameState.players[1].role = 'sleepyhead';
        gameState.players[2].dice = [1];
        gameState.players[2].role = 'sleepyhead';
        gameState.players[3].dice = [2];
        gameState.players[3].role = 'thief';
        gameState.players[4].dice = [5];
        gameState.players[4].role = 'sleepyhead';

        // Hour 3: 2 players awake → no peek
        expect(canPeekAtHour(3)).toBe(false);
    });

    test('no peeking if Backstabber is the only one awake', () => {
        gameState.settings.playerCount = 6;
        assignRoles(6);
        gameState.players[0].dice = [4];
        gameState.players[0].role = 'backstabber';
        gameState.players[1].dice = [1];
        gameState.players[1].role = 'thief';
        // Ensure no one else has 4
        gameState.players[2].dice = [2];
        gameState.players[3].dice = [3];
        gameState.players[4].dice = [5];
        gameState.players[5].dice = [6];

        expect(canPeekAtHour(4)).toBe(false);
    });

    test('no players awake at a given hour → no peek', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        gameState.players.forEach(p => { p.dice = [1]; });

        expect(canPeekAtHour(6)).toBe(false); // No one has 6
    });
});

// ─── getAwakePlayersAtHour Tests ─────────────────────────────────

describe('getAwakePlayersAtHour', () => {
    test('returns correct players for a given hour', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        gameState.players[0].dice = [1];
        gameState.players[1].dice = [3];
        gameState.players[2].dice = [3];
        gameState.players[3].dice = [5];
        gameState.players[4].dice = [6];

        const awakeAt3 = getAwakePlayersAtHour(3);
        expect(awakeAt3).toHaveLength(2);
        expect(awakeAt3.map(p => p.id)).toEqual([2, 3]);
    });

    test('4P player with 2 dice: fallback to both hours when no choice made', () => {
        gameState.settings.playerCount = 4;
        assignRoles(4);
        gameState.players[0].dice = [2, 5];
        // wakeUpChoice is null (no choice yet) → fallback uses dice.includes()
        expect(getAwakePlayersAtHour(2).map(p => p.id)).toContain(1);
        expect(getAwakePlayersAtHour(5).map(p => p.id)).toContain(1);
        expect(getAwakePlayersAtHour(3).map(p => p.id)).not.toContain(1);
    });

    test('4P Sleepyhead with wakeUpChoice: only appears at chosen hour', () => {
        gameState.settings.playerCount = 4;
        assignRoles(4);
        gameState.players[0].role = 'sleepyhead';
        gameState.players[0].dice = [2, 5];
        gameState.players[0].wakeUpChoice = 2; // chose to wake at 2

        expect(getAwakePlayersAtHour(2).map(p => p.id)).toContain(1);
        expect(getAwakePlayersAtHour(5).map(p => p.id)).not.toContain(1);
    });

    test('4P Thief with array wakeUpChoice: appears at both hours', () => {
        gameState.settings.playerCount = 4;
        assignRoles(4);
        gameState.players[0].role = 'thief';
        gameState.players[0].dice = [2, 5];
        gameState.players[0].wakeUpChoice = [2, 5]; // Thief wakes at both

        expect(getAwakePlayersAtHour(2).map(p => p.id)).toContain(1);
        expect(getAwakePlayersAtHour(5).map(p => p.id)).toContain(1);
        expect(getAwakePlayersAtHour(3).map(p => p.id)).not.toContain(1);
    });

    test('5-8P player with single wakeUpChoice: appears only at that hour', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        gameState.players[0].dice = [3];
        gameState.players[0].wakeUpChoice = 3;

        expect(getAwakePlayersAtHour(3).map(p => p.id)).toContain(1);
        expect(getAwakePlayersAtHour(1).map(p => p.id)).not.toContain(1);
    });
});

// ─── Helper Tests ────────────────────────────────────────────────

describe('Helpers', () => {
    beforeEach(() => {
        gameState.settings.language = 'en-US';
    });

    test('getRoleName returns correct names', () => {
        expect(getRoleName('thief')).toBe('Cheese Thief');
        expect(getRoleName('sleepyhead')).toBe('Sleepyhead');
        expect(getRoleName('backstabber')).toBe('Backstabber');
    });

    test('getRoleIcon returns correct icons', () => {
        expect(getRoleIcon('thief')).toBe('🧀');
        expect(getRoleIcon('sleepyhead')).toBe('😴');
        expect(getRoleIcon('backstabber')).toBe('🐀');
    });
});

// ─── Dice Choice Tests (4P) ──────────────────────────────────────

describe('Dice Choice (4P Sleepyhead)', () => {
    test('needsWakeUpChoice: true for 4P sleepyheads', () => {
        gameState.settings.playerCount = 4;
        expect(needsWakeUpChoice({ role: 'sleepyhead' })).toBe(true);
    });

    test('needsWakeUpChoice: true for 4P backstabber', () => {
        gameState.settings.playerCount = 4;
        expect(needsWakeUpChoice({ role: 'backstabber' })).toBe(true);
    });

    test('needsWakeUpChoice: false for 4P thief', () => {
        gameState.settings.playerCount = 4;
        expect(needsWakeUpChoice({ role: 'thief' })).toBe(false);
    });

    test('needsWakeUpChoice: false for 5+ players', () => {
        gameState.settings.playerCount = 5;
        expect(needsWakeUpChoice({ role: 'sleepyhead' })).toBe(false);
        gameState.settings.playerCount = 6;
        expect(needsWakeUpChoice({ role: 'sleepyhead' })).toBe(false);
    });

    test('rollDiceForPlayer auto-sets wakeUpChoice for 5-8P', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        rollDiceForPlayer(0);
        expect(gameState.players[0].wakeUpChoice).toBe(gameState.players[0].dice[0]);
    });

    test('rollDiceForPlayer auto-sets array wakeUpChoice for 4P Thief', () => {
        gameState.settings.playerCount = 4;
        assignRoles(4);
        const thiefIdx = gameState.players.findIndex(p => p.role === 'thief');
        rollDiceForPlayer(thiefIdx);
        const thief = gameState.players[thiefIdx];
        expect(Array.isArray(thief.wakeUpChoice)).toBe(true);
        expect(thief.wakeUpChoice).toEqual(thief.dice);
    });

    test('rollDiceForPlayer leaves wakeUpChoice null for 4P Sleepyhead', () => {
        gameState.settings.playerCount = 4;
        assignRoles(4);
        const shIdx = gameState.players.findIndex(p => p.role === 'sleepyhead');
        rollDiceForPlayer(shIdx);
        expect(gameState.players[shIdx].wakeUpChoice).toBeNull();
        expect(gameState.players[shIdx].diceRolled).toBe(true);
    });
});

// ─── Cheese Stealing Tests ───────────────────────────────────────

describe('Cheese Stealing Logic', () => {
    test('Thief can steal at their awake hour', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        gameState.players[0].dice = [3];
        gameState.players[0].role = 'thief';
        gameState.players[1].dice = [1];
        gameState.players[1].role = 'sleepyhead';
        gameState.players[2].dice = [2];
        gameState.players[3].dice = [4];
        gameState.players[4].dice = [5];

        expect(canStealAtHour(3)).toBe(true);
    });

    test('cannot steal at hours when Thief is asleep', () => {
        gameState.settings.playerCount = 5;
        assignRoles(5);
        gameState.players[0].dice = [3];
        gameState.players[0].role = 'thief';
        gameState.players[1].dice = [1];
        gameState.players[1].role = 'sleepyhead';
        gameState.players[2].dice = [2];
        gameState.players[2].role = 'sleepyhead';
        gameState.players[3].dice = [4];
        gameState.players[3].role = 'sleepyhead';
        gameState.players[4].dice = [5];
        gameState.players[4].role = 'sleepyhead';

        expect(canStealAtHour(1)).toBe(false);
        expect(canStealAtHour(2)).toBe(false);
        expect(canStealAtHour(6)).toBe(false);
    });

    test('4P Thief can steal at both dice hours', () => {
        gameState.settings.playerCount = 4;
        assignRoles(4);
        gameState.players[0].dice = [2, 5];
        gameState.players[0].role = 'thief';
        gameState.players[1].dice = [1, 3];
        gameState.players[1].role = 'sleepyhead';
        gameState.players[2].dice = [4, 6];
        gameState.players[3].dice = [1, 4];

        expect(canStealAtHour(2)).toBe(true);
        expect(canStealAtHour(5)).toBe(true);
        expect(canStealAtHour(3)).toBe(false);
    });
});