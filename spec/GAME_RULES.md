# Game Rules: Cheese Thief (芝士大盜)

## Overview
Cheese Thief is a light strategy party game for 4-8 players. It plays like a fast-paced "Werewolf" or "Mafia" but uses dice mechanics to determine when players wake up during the night phase.

**App Mode**: Single Device Pass & Play (一部裝置傳閱遊玩).

**Objective**:
- **Sleepyheads (Good Team)**: Identify the Cheese Thief.
- **Cheese Thief (Bad Team)**: Avoid being identified and keep the stolen cheese.

## Components (Virtual)
- **Device**: Acts as the game board and moderator.
- **Virtual Cheese**: Displayed in the center of the screen.
- **Virtual Dice**: Assigned by the app to each player.
- **Player Tokens**: Represent each player's position and hidden dice.

## Game Flow

### 1. Setup Phase (Identity Check)
1.  **Select Settings**: Choose player count (4-8) and language.
2.  **Pass & Play**: The device is passed to each player one by one.
3.  **Reveal**: Player views their **Role** (Thief/Sleepyhead) and **Dice Number(s)**.
4.  **Hide**: Player hides the info and passes to the next person.
5.  **Start**: Once all players have seen their info, the device is placed in the center.

### 2. Night Phase (Moderated by App)
The App calls out hours from 1 o'clock to 6 o'clock.

1.  **"Everyone close your eyes."**
2.  **"1 o'clock! Players with 1, wake up."** (Wait ~8 seconds) -> **"Close your eyes."**
3.  Repeat for 2, 3, 4, 5, 6 o'clock.
4.  **"Morning has broken! Everyone wake up."**

**Actions during Night (Interaction with Screen)**:
-   **Sleepyheads**:
    -   Wake up at their rolled number.
    -   **Standard Rule (5-8 Players)**: If you are the *only* one awake, you may **TAP** another player's token on the screen to peek at their dice (displayed for 2 seconds). If anyone else is awake, you do nothing.
    -   **4-Player Variant Rule**:
        -   You have 2 dice but **MUST CHOOSE ONLY ONE** of your numbers to wake up at.
        -   If you wake up alone, you **CANNOT** peek at other players' dice.
-   **Cheese Thief**:
    -   Wakes up at their rolled number(s).
    -   **Action**: **TAP** the central Cheese Token to steal it. The cheese will disappear from the screen.
    -   **4-Player Variant Rule**:
        -   If you have 2 different numbers, you wake up at **BOTH** times.
        -   You can steal the cheese at either time (if not already stolen).

### 3. Day Phase
-   Players discuss who the thief is.
-   Players can claim what time they woke up and who they saw (or didn't see).
-   Players **CANNOT** show their dice or character cards (unless revealed by game end).
-   Discussion time is timed by the app.

### 4. Voting & End Game
-   When discussion ends, the App counts down "3, 2, 1, Vote!".
-   Everyone points at a suspect simultaneously.
-   The player with the most votes reveals their character card.

**Winning Conditions**:
-   **Sleepyheads Win**: If the **Cheese Thief** receives the most votes.
-   **Cheese Thief Wins**: If anyone else (a Sleepyhead) receives the most votes.
-   *(Tie Breaker)*: If there is a tie for most votes, and one of them is the Thief, Sleepyheads win.

## Player Count Variants

### 4 Players (Special Focus)
-   **Dice**: 2 per player (Assigned by App).
-   **Thief**: Wakes up at BOTH rolled numbers (if different).
-   **Sleepyhead**: Chooses ONE of their rolled numbers to wake up.
-   **Peeking**: Sleepyheads CANNOT peek even if alone.
-   **No Backstabber**.

### 5-8 Players (Standard Game)
-   **Dice**: 1 per player (Assigned by App).
-   **Thief**: Wakes up at rolled number.
-   **Sleepyhead**: Wakes up at rolled number. Can peek if alone.
-   **Accomplice (共犯) Mechanics**:
    -   **5 Players**: If the Thief sees other Sleepyheads awake at their time, those Sleepyheads become Accomplices. If multiple see the Thief, the Thief points to ONE to be the Accomplice.
    -   **6 Players**: After 6 o'clock, App adds a phase: "Thief wake up, touch one player to be Accomplice."
    -   **7-8 Players**: After 6 o'clock, App adds a phase: "Thief wake up, touch TWO players to be Accomplices."
    -   *Accomplice Win Condition*: Wins with the Thief if the Thief is NOT caught.

### Optional Characters
-   **Backstabber (背鍋鼠)** (6-8 Players): Replaces one Sleepyhead. Wins if they receive the most votes. (Not yet implemented)

## AI Moderator Features
The web app serves as the Game Board and Moderator.
-   **Voice Instructions**: Text-to-Speech for game phases.
-   **Visuals**: Central Cheese (interactive), Player Tokens (interactive for peeking).
-   **Timer**: Visual countdown for each "hour".
-   **Background Music**: Ambient noise.
