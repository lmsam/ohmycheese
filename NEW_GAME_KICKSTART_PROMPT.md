# Game Development Project Setup

## Project Overview
I want to create a new web-based game: [遊戲名稱]

Game Description: [簡短描述遊戲玩法]

## Technology Stack
- **Frontend**: Vanilla HTML/CSS/JavaScript (no framework)
- **Testing**: Jest for unit tests
- **Structure**: Single-page application with responsive design (desktop + mobile)
- **i18n**: Built-in multi-language support (zh-HK, en-US)

## Development Workflow (TDD-First Approach)

### Phase 1: Project Setup
1. Create project folder structure:
   ```
   project-name/
   ├── index.html          # Main entry point
   ├── desktop.html        # Desktop-specific layout (optional)
   ├── mobile.html         # Mobile-specific layout (optional)
   ├── style.css           # All styles
   ├── script.js           # Main game logic
   ├── package.json        # Dependencies (jest)
   ├── jest.config.js      # Jest configuration
   ├── README.md           # Project documentation
   ├── __tests__/          # All test files
   │   └── *.test.js
   ├── images/             # Game assets
   └── spec/               # Design documentation
       ├── GAME_RULES.md           # Complete game rules
       ├── SYSTEM_ARCHITECTURE.md  # Technical architecture
       ├── CURRENT_WORK.md         # Work-in-progress tracking
       └── [OTHER_SPECS].md        # Feature-specific specs
   ```

2. Initialize npm and install Jest:
   ```bash
   npm init -y
   npm install --save-dev jest
   ```

3. Configure Jest for browser-like environment in `jest.config.js`:
   ```javascript
   module.exports = {
     testEnvironment: 'jsdom',
     verbose: true,
     testMatch: ['**/__tests__/**/*.test.js'],
   };
   ```

### Phase 2: Documentation First
Before writing any code, create these spec documents:

1. **GAME_RULES.md** - Complete game rules in detail:
   - Game objective
   - Setup process
   - Turn/phase structure
   - Win/lose conditions
   - All game entities and their behaviors

2. **SYSTEM_ARCHITECTURE.md** - Technical design:
   - Data structures (game state, player state, etc.)
   - Core functions and their responsibilities
   - Event flow diagrams
   - UI component breakdown

3. **CURRENT_WORK.md** - Track progress:
   - Current phase
   - Completed features
   - Known issues
   - Next steps

### Phase 3: TDD Development Cycle
For EACH feature, follow this strict order:

1. **Write spec first** - Document the feature behavior in spec/
2. **Write tests first** - Create test cases in `__tests__/`
3. **Run tests (expect failure)** - Confirm tests fail initially
4. **Implement feature** - Write minimal code to pass tests
5. **Run tests (expect pass)** - Confirm all tests pass
6. **Refactor if needed** - Clean up while keeping tests green

### Phase 4: Code Organization Pattern

#### State Management
```javascript
// Global game state object
const gameState = {
    phase: 'setup', // setup | playing | ended
    currentTurn: 0,
    players: [],
    // ... other state
};

// State modification through functions only
function updateGameState(updates) {
    Object.assign(gameState, updates);
    renderUI(); // Re-render after state change
}
```

#### Handler Pattern (for different game entities/actions)
```javascript
class EntityHandler {
    constructor() {
        this.actionState = {};
    }
    
    reset() {
        this.actionState = {};
    }
    
    startAction(context) {
        // Initialize action
        return { handled: true, message: '...' };
    }
    
    handleInput(input, context) {
        // Process user input
        return { handled: true, shouldComplete: false };
    }
    
    isActionComplete() {
        return this.actionState.completed;
    }
}
```

#### i18n Pattern
```javascript
const i18n = {
    'zh-HK': {
        title: '遊戲標題',
        // ... all strings
    },
    'en-US': {
        title: 'Game Title',
        // ... all strings
    }
};

let currentLanguage = 'zh-HK';

function t(key) {
    return i18n[currentLanguage][key] || key;
}
```

#### UI Rendering Pattern
```javascript
// Separate data from presentation
function renderUI() {
    renderHeader();
    renderGameArea();
    renderControls();
}

// Each render function reads from gameState
function renderGameArea() {
    const container = document.getElementById('game-area');
    container.innerHTML = generateGameHTML(gameState);
    attachEventListeners();
}
```

### Phase 5: Testing Patterns

```javascript
// __tests__/example.test.js
const { functionToTest, ClassName } = require('../script.js');

describe('Feature Name', () => {
    let instance;
    
    beforeEach(() => {
        // Reset state before each test
        instance = new ClassName();
        instance.reset();
    });
    
    afterEach(() => {
        // Cleanup if needed
    });
    
    test('should do X when Y', () => {
        // Arrange
        const input = { ... };
        
        // Act
        const result = instance.handleInput(input);
        
        // Assert
        expect(result.handled).toBe(true);
        expect(instance.actionState.someValue).toBe(expectedValue);
    });
});
```

### Phase 6: Module Exports for Testing
At the end of script.js:
```javascript
// Export for testing (CommonJS for Jest compatibility)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Export all testable functions and classes
        gameState,
        updateGameState,
        EntityHandler,
        // ... etc
    };
}
```

## Important Principles

1. **Documentation drives development** - Write specs before code
2. **Tests drive implementation** - Write tests before features
3. **Single source of truth** - One gameState object
4. **Separation of concerns** - Logic, rendering, and handlers are separate
5. **Incremental progress** - Small, testable increments
6. **Always runnable** - Game should be playable at each milestone

## Communication Style

When implementing features:
1. First confirm understanding of the feature
2. Show the test cases to be written
3. Run tests to confirm they fail
4. Implement the feature
5. Run tests to confirm they pass
6. Update CURRENT_WORK.md

Report progress in this format:
- ✅ Completed: [feature]
- 🔄 In Progress: [feature]
- ⏳ Next: [feature]

## Start Here
Please begin by:
1. Creating the project folder structure
2. Writing GAME_RULES.md based on my game description
3. Writing SYSTEM_ARCHITECTURE.md with proposed data structures
4. Creating the first set of test cases for core game setup

---

## My Game Details

**遊戲名稱**: [填入你嘅遊戲名]

**遊戲描述**: [填入遊戲玩法]

**參考**: 開發流程參考自 One Night Ultimate Werewolf web app 項目

Let's start!
