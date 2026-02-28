# Current Work & Roadmap

## Project Goal
Create a web-based "AI Moderator" for the board game **Cheese Thief (奶酪大盜)**.
It replaces the human moderator, handling the complex night phase sequence, timing, and voice instructions.

## 🗺️ Development Roadmap

### Phase 1: Core Night Loop (✅ Complete)
*Focus: The "Brain" and "Voice" of the moderator.*
-   ✅ **Logic**: Generate correct instruction sequence based on player count (4-8 players).
-   ✅ **Logic**: 5-player accomplice audio reminder after hour 6.
-   ✅ **Logic**: 6+ player accomplice selection phase (1 for 6P, 2 for 7-8P).
-   ✅ **Logic**: App-enforced peeking — `canPeekAtHour()` checks awake count and role.
-   ✅ **Logic**: `getAwakePlayersAtHour()` uses known dice data.
-   ✅ **Test**: 27 unit tests covering sequence, roles, dice, peeking, helpers.
-   ✅ **UI**: Night Screen with instruction text, countdown timer, peek hint.
-   ✅ **Sequencer**: State machine handling `Instruction` -> `Wait Timer` -> `Next Step` with peek toggling.

### Phase 1.5: Role Assignment & Dice (✅ Complete)
*Focus: Digital role assignment with on-screen dice rolling.*
-   ✅ **Logic**: `assignRoles()` — 1 Thief always; 1 Backstabber for 6-8P; rest Sleepyheads.
-   ✅ **Logic**: `rollDiceForPlayer()` — players tap to roll. 4P: 2 dice. 5-8P: 1 die. Duplicates allowed.
-   ✅ **UI**: 3-step role assignment flow: Pass → View role & roll dice → Hide & pass.
-   ✅ **UI**: Dice placeholder (?) → animated roll → result display.
-   ✅ **Roles**: Backstabber role (🐀) included for 6-8 players.

### Phase 2: Game Setup & Configuration (🔲 Next)
*Focus: Customization.*
-   🔲 **Feature**: Timer Settings (adjust wait time duration per hour).
-   🔲 **Feature**: Language Toggle live preview on setup screen.
-   🔲 **Audio**: Integrate Web Speech API (TTS) for voice instructions (Cantonese/English).

### Phase 3: Day Phase & Game Loop
*Focus: Completing the cycle.*
-   ✅ **UI**: Day Screen with discussion timer.
-   ✅ **UI**: End/Voting Screen with countdown.
-   ✅ **Logic**: Full state transitions (Setup → Role Assignment → Night → Day → Voting → Setup).
-   🔲 **UI**: Polish transitions between phases.

### Phase 4: Audio & Visual Polish
*Focus: Immersion.*
-   🔲 **Audio**: Background Ambient Music (Suspenseful Night / Cheerful Day).
-   🔲 **Visual**: Theme styling (Cheese colors, dark mode for night).
-   🔲 **Visual**: Animations (dice roll, cheese steal, fade transitions).

### Phase 5: Advanced Features (Backlog)
-   🔲 **Audio**: Custom recorded voice clips (replacing TTS).
-   🔲 **Feature**: Configurable discussion time limit.
-   🔲 **Feature**: Sound effects for cheese steal, peek, voting.

---

## Current Task
**Phase 2 — Setup Enhancements & TTS Integration**
