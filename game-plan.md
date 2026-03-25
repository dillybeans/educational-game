# Game Plan

## Part 1: The Problem 

### What educational problem are you solving?
> Write 2-3 sentences explaining the problem in simple terms. Be specific — not "kids need to learn math" but "4th graders in the US are falling behind in fraction comprehension, with only 41% reaching proficiency by the end of the year."

I am solving the "Abstract Wall of Algebra." Students are suddenly asked to stop "finding the answer" (arithmetic) and start "understanding relationships" (algebra), causing massive cognitive friction. Currently, up to 50% of students fail Algebra I in many US districts because they rely on fragile rote memorization rather than deep conceptual understanding of balance and variables.

### Who is affected?
> Age range, grade level, location, population size. Be as specific as possible.

12-15 olds, 7th-10th graders, U.S.A., roughly 9 to 12 million students.

### Why do existing solutions fail?
> What's been tried? Why isn't it working? Where is the gap a game could fill?

* **Rote memorization:** Students learn rules, not meaning—so understanding is fragile and breaks easily.
* **Tracking (“general math”):** Moves struggling students off the algebra path, limiting future opportunities.
* **Tutoring systems:** Improve step-by-step execution, but still don’t build real conceptual understanding.
* **Shared problem:** All focus on *how* to do math, not *why* it works.
* **Result:** Students can perform procedures but can’t adapt or think algebraically.

### Why does this problem matter to YOU personally?
> This is your admissions narrative. Why did YOU pick this problem? What's your connection to it?

 - I need to write my personal connection to this problem. Did I struggle with algebra? Did I tutor someone who hit this abstract wall? Why am I passionate about saving kids from math anxiety?

### Key Research Sources
> List 3-5 real sources you found during your research phase. You'll cite these in your Evidence Pack.

1. **Academic Paper on Cognitive Barriers:** Kieran, C. (1992). *The learning and teaching of school algebra*.
2. **Academic Paper on Game-Based Intervention:** Long, Y., & Aleven, V. (2014) regarding *DragonBox Algebra* and gamification of linear equations.
3. **Government Data:** National Center for Education Statistics (2024). *The Nation's Report Card: Mathematics 2024*.
4. **Book on Algebra as a Civil Rights Issue:** Moses, R. P. & Cobb, C. E. (2001). *Radical Equations*.

## Part 2: The Game Concept (Complete During Week 2)

### Game Title (Working Title)
Echo/Shift

### One-Sentence Pitch
> A 2D rhythm and audio-puzzle game that helps 12-16 year old students intuitively master algebraic equation balancing by forcing them to sync audio tracks using beat lengths as constants and 


### Target Player
- **Age range:** 12-16
- **Context:** Home use, casual gaming, or headphones in a computer lab.
- **Session length:** 15-20 minutes at a time (enough to complete a few multi-stage tracks).
- **Prior knowledge assumed:** Basic addition and multiplication of single-digit integers. No prior algebra required.

### Game Genre/Type
> Rhythm / Audio Puzzle. This fits perfectly because audio duration and rhythm physically model algebraic equality without visual numbers. If a track is unbalanced, it literally sounds bad. Balancing an equation becomes a matter of "fixing the beat."



### Core Gameplay Loop
> What does the player DO repeatedly? Describe the loop:
1. **Player does:** Drags and drops neon audio blocks (constants) and glitch blocks (variables) onto an unbalanced multi-track timeline.
2. **Game responds:** The player hits "SYNC." If unbalanced, a harsh high-pass filter distorts the audio. If balanced, the track snaps together and plays a rich, satisfying lo-fi beat.
3. **Player learns:** Deep relational understanding of equality ("what you do to the left side, you must do to the right") and substitution (what the 'x' block represents).
4. **Player wants to:** Hear the full, uncorrupted synthwave song without the nasty distorted filters.

### How Playing = Learning
> This is the most important section. Explain specifically how the game mechanics teach the educational content. The learning should be EMBEDDED in the gameplay, not bolted on as a quiz.

The timeline dividing line is literally the "=" sign. The audio channels represent the two sides of an equation. By physically manipulating blocks of time/rhythm to ensure both the Left Channel and Right Channel equal each other in length, I am mapping the abstract concept of equation balancing to spatial reasoning and auditory feedback. The variable "x" is demystified—it's just a missing synth loop whose length they must deduce by looking at the remaining space. There are no numbers or test questions; solving the algebra is the only physical way to fix the music.

---

## Part 3: Design Details 

### Screens / Views
> List every distinct screen in your game. Most games need 4-6 screens.

| Screen | Purpose | Key Elements |
|--------|---------|-------------|
| Title/Menu | Entry point | Neon "PLAY" button, Mixing console aesthetic, Options |
| Level Select | Choose a track | Rack of retro cassette tapes, unlocked status |
| Gameplay | Core experience | Horizontal timeline, Left/Right channel divide, draggable inventory dock |
| Feedback | Immediate track response| Visual audio spectrum spiking, distorted vs rich audio playback |
| Results | Session summary | "SYNC ACHIEVED" neon text, time taken to solve, progression to next track |

### Difficulty Progression
> How does the game get harder as the player improves?

- **Easy:** Missing constants on one side. Just dragging known blocks to fill the visual gap.
- **Medium:** Introducing the 'x' glitch block. One side has constants, the other has constants + x.
- **Hard:** The true wall of algebra: Variables on *both* sides of the timeline (`3x + 2 = x + 8`) where players must deduce the value of x when x is on both Left and Right channels.

### Win / Lose Conditions
- **What does "winning" look like?** The audio tracks align perfectly, the bass drops, the UI transitions to a satisfying "SYNC ACHIEVED" screen, and the player gets to hear the clean song loop.
- **What does "failing" look like?** A harsh, tinny, distorted audio filter ruins the song loop, and the UI flashes red indicating asynchronous channels.
- **How does the game encourage the player to try again?** The music is intentionally unsatisfying when broken. Humans intrinsically want to resolve musical dissonance, driving them to fix the track immediately.

### Content / Levels
> What educational content does the game contain? How many levels/rounds for MVP?

For the MVP, I plan to build 3 distinct songs, broken into 10 total levels. The educational content maps heavily to introductory Algebra 1 standards (Linear Equations, Solving for single variables, Substitution). 

---

## Part 4: Technical Specs (Complete During Week 3)

### Platform
- [x] Web-based (browser game)
- [x] 2D
- [ ] 3D
- [ ] DOM-based (no canvas — HTML/CSS driven)

### Framework Choice
> Which framework (if any) and why? Discuss with your mentor.

- [ ] **Vanilla JS** (no framework — for simpler DOM-based or Canvas games)
- [x] **Phaser 3** (2D games with sprites, physics, tilemaps)
- [ ] **Three.js** (3D games or 3D visuals)
- [ ] **Kaboom.js** (lightweight 2D, great for pixel art style)
- [ ] **AI Decides**

*Why:* Phaser 3 has native drag-and-drop mechanics built-in, but most importantly, it has an incredibly robust Web Audio API wrapper that makes manipulating music tracks, syncing stems, and applying high-pass/low-pass filters highly manageable in a 10-week window.

### Key Data the Game Tracks
> What information does your game need to store/manage?

- [ ] Player score / points
- [x] Current level / progress
- [x] Correct / incorrect answers (Failed sync attempts)
- [x] Time spent per question / level
- [ ] Player streak / combo count
- [ ] Difficulty setting
- [ ] High scores / personal bests
- [x] Learning analytics (for Evidence Pack) - specifically which equation structures cause the biggest spike in errors.
- [ ] Other: _______________

### Asset Needs
> What visual and audio assets do you need?

**Audio:**
- Multitrack stems for 3 synthwave/lo-fi tracks (separated into Drums, Bass, Chords, Lead).
- UI sound effects (block snapping, error buzzer, success chime).

**Visual:**
- Deep void space background (#030914).
- Electric Cyan and Neon Magenta UI elements.
- 5 solid vector rectangles of varying widths (constants).
- TV static/glitch sprite-sheet for the variable 'x' block.
- Retro cassette tape assets for level select.

### Visual Style

Synthwave / Cyberpunk minimal. It should feel like an extremely cool piece of professional DJ mixing software, absolutely avoiding the childish "school math game" aesthetic. 

## Part 5: Scope & Milestones

### MVP (MUST ship — the bare minimum for a working game)
> Be ruthless. What is the absolute minimum that makes this a playable educational game?

- [ ] Build the core Phaser 3 scene with a horizontal divider acting as the "=" sign.
- [ ] Implement flawless drag-and-drop mechanics from an inventory dock onto the timeline slots.
- [ ] Build the validation logic: `Sum of Left Block Widths == Sum of Right Block Widths`.
- [ ] Complete Level 1 through 5 using a single song.
- [ ] Implement basic audio feedback (clean track plays on success, silence/error beep on failure).

### Nice-to-Have (add if time allows)
> Features that would make it better but aren't required for the portfolio.

- [ ] All 10 distinct levels pacing up the algebra difficulty correctly.
- [ ] Real-time audio distortion (Low-pass/high-pass filters applied via Web Audio API) when unbalanced.
- [Draw a graph based on the music rhythm]

### Stretch Goals (only if everything else is done)
- [ ] A backend database (like Firebase) to actually collect and graph the player data for my portfolio.
- [ ] "Endless Mode" dynamically generating valid equations to an infinite beat.
