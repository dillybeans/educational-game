# Educational Game Pathway

## Folder Structure

```
educational-game-pathway/
│
├── README.md                ← You are here│
├── agents/                  ← AI agent role definitions
│   ├── dispatcher.md        ← Main orchestrator — routes tasks to specialists
│   ├── game-designer.md     ← Game mechanics, UX, educational alignment
│   ├── developer.md         ← Code architecture, implementation, deployment
│   ├── artist.md            ← Visual design, UI, asset guidance
│   ├── qa-tester.md         ← Testing, bug finding, playtest facilitation
│   └── portfolio-writer.md  ← Evidence Pack, essays, README, demo video script
│
├── api-docs/                ← Put API documentation here 
│
├── skills/                  
│
└── projects/
```

---


## The Agent System

The `agents/` folder contains specialized AI agent roles. 

| Agent | When to Use |
|-------|------------|
| **Dispatcher** | Start here. It figures out which specialist you need. |
| **Game Designer** | "How should my game work?" / Mechanics / UX / Educational alignment |
| **Developer** | "Build this feature" / Code / Debugging / Deployment |
| **Artist** | "Make it look good" / Visual design / CSS / Asset guidance |
| **QA Tester** | "Is it working right?" / Bug finding / Playtest facilitation |
| **Portfolio Writer** | "Help me write this up" / Evidence Pack / Essays / README |


---


## Framework Decision Guide

| If the game needs... | Recommend | Why |
|---------------------|-----------|-----|
| 2D sprites, physics, tilemaps | **Phaser 3** | Most mature 2D game framework, huge community |
| 3D environments or objects | **Three.js** | Standard for web 3D, good docs |
| Simple 2D, pixel art style | **Kaboom.js** | Lighter than Phaser, beginner-friendly |
| DOM-based interactions (quizzes, cards, drag-drop) | **Vanilla JS** | No framework needed — HTML/CSS/JS is enough |
| Canvas drawing without sprites | **Vanilla Canvas API** | Direct control, good for custom visuals |

## Skills Folder
agent-orchestration-multi-agent-optimize
browser-automation
autonomous-agents
database-design
game-development
javascript-mastery
tailwind-patterns
threejs-skills
ui-ux-pro-max
web-performance-optimization
writing-plans