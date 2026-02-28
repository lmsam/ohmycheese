# System Architecture

## Tech Stack
-   **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+).
-   **Testing**: Jest (via JSDOM).
-   **Storage**: `localStorage` for saving game settings (optional).
-   **Audio**: Web Audio API or HTML5 Audio for moderator voice/SFX.

## Data Structures

### Game State (`gameState`)
The single source of truth for the application.

```javascript
const gameState = {
    phase: 'setup', // 'setup', 'night', 'day', 'ended'
    players: [], // Array of Player objects
    settings: {
        playerCount: 4,
        useTTS: true, // Use Text-to-Speech
        language: 'zh-HK' // 'zh-HK', 'en-US'
    },
    nightState: {
        currentHour: 0, // 0 (start), 1-6, 7 (end)
        timer: null
    }
};
```

### Player Object
```javascript
{
    id: 1,
    role: 'sleepyhead', // 'thief', 'sleepyhead', 'backstabber'
    dice: [3, 5], // Array of numbers (1 or 2 dice)
    wakeUpAt: [3] // The hour(s) the player decided to wake up (for logic tracking, though mostly manual in real life)
}
```
*Note: Since this is a moderator tool for a physical/hybrid game, the app might not need to know everyone's exact role/dice unless we implement a "Pass & Play" setup mode. For now, we assume the App is primarily the **Moderator** (Timer/Voice).*

**Revised Scope for AI Moderator**:
The user wants an "AI Moderator". This implies the app primarily handles the **Night Phase orchestration** (calling out numbers, timing).
However, to make it "AI" and support 4 players "without a human moderator", the app could also:
1.  **Assign Roles**: Players pass the device around to see their role/dice? Or just use physical cards/dice?
    *   *User Request*: "Even if we only have 4 players... don't need a person to be moderator".
    *   *Interpretation*: The App replaces the human who calls out "Eyes closed... 1 o'clock...".
    *   *Physical vs Digital*: If players have physical dice/cards, the App just plays audio. If they don't, the App needs to assign roles/dice secretly.
    *   *Assumption*: Let's build it to support **Digital Roles/Dice** (Pass & Play) so it's a complete package, but the core feature is the **Night Phase Sequencer**.

## Core Modules

### 1. `GameManager`
-   Initializes game.
-   Manages state transitions (Setup -> Night -> Day).
-   Handles "Pass & Play" logic for role assignment (if digital).

### 2. `NightPhaseHandler`
-   The "AI Moderator" logic.
-   Sequences the night steps:
    -   Intro ("Close eyes")
    -   Loop 1-6 ("Hour X... wake up... wait... close eyes")
    -   Outro ("Morning")
-   Manages Audio playback.

### 3. `AudioManager`
-   Handles playing voice clips or TTS.
-   Handles background ambient music.

### 4. `UIManager`
-   Renders the current state to the DOM.
-   Screens:
    -   **SetupScreen**: Choose player count, settings.
    -   **RoleRevealScreen** (Optional): Pass device to see role.
    -   **NightScreen**: Visual timer, current instruction.
    -   **DayScreen**: Timer for discussion, voting interface (optional).

## Directory Structure
```
/
├── index.html
├── style.css
├── script.js       # Main entry, imports modules
├── modules/        # (If using ES modules, otherwise all in script.js for simplicity as requested)
│   ├── state.js
│   ├── audio.js
│   └── ui.js
├── assets/
│   └── audio/      # Voice clips
└── __tests__/
```

## Testing Strategy
-   **Unit Tests**: Test state transitions, timer logic.
-   **Integration Tests**: Test full night cycle flow.
```