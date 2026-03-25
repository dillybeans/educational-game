# Game Specification Document: Echo/Shift

## 1. GAMEPLAY MECHANICS & RULES
**Core Concept:** The player is an audio engineer trying to restore corrupted music tracks. A track is split into two visual audio channels (Left and Right).
**Mechanics:**
- The horizontal timeline functions as the "equation" and the midpoint dividing line acts as the "=" sign.
- **Constants:** Colored neon blocks representing known audio lengths (e.g., a green block = 2 beats of bass).
- **Variables (x):** Glitchy "unknown" synth loops.
- **The Rule of Balance:** To successfully hit "SYNC" and restore a segment of the song, the total duration/weight of the blocks on the Left channel MUST equal the Right channel.
- **Solving:** Players drag blocks from a side-inventory onto the timeline. If the Right side has 8 beats total, and the Left side has a 2-beat block and two unknown `x` blocks (`2 + 2x = 8`), the player must deduce that `x = 3` beats and drop the correct size blocks to define `x`.
- **Feedback:** If unbalanced, hitting play results in a harsh, distorted sound and a failed state. If balanced, the channels sync perfectly, emitting a rich, full sound, and the level is cleared.

## 2. SCREEN-BY-SCREEN UI DESCRIPTION
**1. Main Menu:**
- **Visual:** A retro mixing console in a dark studio.
- **Elements:** Large neon "PLAY" button, "OPTIONS", "CREDITS".
**2. Level Select:**
- **Visual:** A rack of cassette tapes, each representing a "Track" ().
**3. Gameplay Screen:**
- **Top:** Track title, current level number, and a glowing "SYNC" button.
- **Center (The Equation):** A horizontal timeline. A bold vertical line separates the Left Channel from the Right Channel. Empty silhouette slots indicate where blocks can be placed.
- **Bottom (Inventory):** A dock of draggable audio blocks (constants 1, 2, 3) and glitch blocks (variables).
**4. Results Screen:**
- **Visual:** An audio spectrum analyzing the fixed track. Shows "SYNC ACHIEVED" in bright neon, time taken, and a "Next Track" button.

## 3. ART STYLE & COLOR PALETTE
- **Style:** Minimalist Synthwave / Cyberpunk. Clean, geometric, retro-futuristic UI. It should feel like a cool piece of DJ software rather than "school math."
- **Color Palette:**
  - **Background:** Deep Void Space (`#030914`, very dark navy).
  - **UI Accents:** Electric Cyan (`#00FFFF`) and Neon Magenta (`#FF00FF`).
  - **Constants (Blocks):** Vibrant solid colors (Yellow for 1, Orange for 2, Green for 3, etc.).
  - **Variables (x):** Static-filled, glitchy grey/white blocks with a neon question mark.

## 4. SOUND & MUSIC DIRECTION
- **Genre:** Lo-Fi Hip Hop and Synthwave (easy to structure mathematically, highly popular demographic fit).
- **Audio Stems:** The game requires *multitrack stems* (separate files for drums, bass, synth, melody) rather than full MP3s.
- **Dynamic Audio:** When the equation is unbalanced, the audio should sound terrible—specifically, it should use a high-pass filter to sound "tinny" or heavily distorted. When a player successfully balances the equation, a satisfying snap occurs, the bass drops, and the rich, lossless audio plays as an intrinsic reward.

## 5. DIFFICULTY PROGRESSION
- **Level 1–2 (Arithmetic):** Missing constants on one side. (e.g., `5 + [?] = 8`). Introduces drag-and-drop mechanics.
- **Level 3–5 (Basic Algebra):** Introduces the 'x' glitch block. One side has constants, the other has constants + x. (e.g., `4 + x = 7`).
- **Level 6–7 (Multiplication):** Multiple 'x' glitch blocks. (e.g., `2 + 2x = 10`).
- **Level 8–9 (Variables on Both Sides):** The true wall of algebra. Player must balance blocks where both sides have 'x'. (e.g., `3x + 2 = x + 8`).
- **Level 10 (Boss Track):** A continuous scrolling timeline where players must solve 3 successive equations perfectly to the music in real-time.

## 6. DATA TO TRACK (PORTFOLIO EVIDENCE)
To prove the game's educational efficacy in your portfolio, implement basic analytics tracking:
- **Time to Solve:** Milliseconds spent on a level. Does the speed increase as intuition builds?
- **Error Rate:** How many times the player hits "SYNC" with an unbalanced track.
- **Friction Points:** Which specific equation structures (e.g., moving from 1x to 2x) cause the biggest spike in errors.

## 7. TECHNICAL RECOMMENDATION
**Recommendation: 2D Framework using Phaser 3.**
- **Why 2D?** 3D is entirely unnecessary and complicates UI interactions. 2D is perfect for flat timeline/audio editing visual metaphors.
- **Why Phaser 3?** It is an incredibly mature, open-source HTML5 framework. Most importantly, it handles **drag-and-drop mechanics natively** and has an excellent **Web Audio API wrapper** built-in, which is highly crucial for a game relying on audio manipulation. It’s highly manageable for a 10-week AI-assisted project.

## 8. REQUIRED ASSETS LIST
- **Sprites:**
  - UI Elements: Play button, Menu buttons, Audio Sliders.
  - Blocks: 5 simple vector rectangles of varying widths (representing lengths 1 through 5).
  - Glitch Block: 1 animated GIF or Javascript sprite-sheet of TV static for the variable.
- **Audio:**
  - Sound Effects: Block snap/click, UI hover, Error buzzer, Success chime.
  - Music Stems: 3 short, looping tracks (30 seconds each) split into 4 separate stem files (Drums, Bass, Chords, Lead).
- **Fonts:**
  - A retro, monospace pixel font (e.g., "VT323" or "Press Start 2P" from Google Fonts).

## 9. MVP SCOPE vs. STRETCH GOALS (10-Week Plan)
**MVP (Minimum Viable Product - Must Finish by Week 6):**
- 1 single song (Level 1 to 5).
- Working drag-and-drop mechanics onto specific drop zones.
- The logic checking if `Sum of Left == Sum of Right`.
- Basic audio implementation (full track plays on success, silence on failure).

**Nice-to-Have (Weeks 7–10):**
- 10 distinct levels pacing up the algebra difficulty correctly.
- Real-time audio distortion (Low-pass/high-pass filters applied via Web Audio API) when unbalanced.
- Neon glow visual effects (bloom) and smooth UI transitions.

**Stretch Goals (Post-Project/Portfolio Flex):**
- A backend database (like Firebase) to actually collect and graph the player data.
- "Endless Mode" dynamically generating valid equations to an infinite beat.
