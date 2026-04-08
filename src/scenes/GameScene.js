export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.levelIndex = data.levelIndex || 0;
        
        this.levelData = [
            { id: 1, name: "TRACK 01: BALANCE THE BEAT", text: "2 + x = 5", target: 5, base: 2, vars: [{ type: 'x', mult: 1 }], choices: [2, 3, 4] },
            { id: 2, name: "TRACK 02: PUSH THE TEMPO", text: "x + 3 = 7", target: 7, base: 3, vars: [{ type: 'x', mult: 1 }], choices: [3, 4, 5] },
            { id: 3, name: "TRACK 03: DOUBLE DROP", text: "2x = 8", target: 8, base: 0, vars: [{ type: 'x', mult: 2 }], choices: [2, 4, 6] },
            { id: 4, name: "TRACK 04: COMPLEX OVERLAY", text: "2x + 1 = 7", target: 7, base: 1, vars: [{ type: 'x', mult: 2 }], choices: [2, 3, 4] },
            { id: 5, name: "TRACK 05: SQUARING THE BASS", text: "x^2 + 2 = 11", target: 11, base: 2, vars: [{ type: 'x^2', mult: 1 }], choices: [2, 3, 4] },
            { id: 6, name: "TRACK 06: POLYNOMIAL GROOVE", text: "x^2 + 2x = 8", target: 8, base: 0, vars: [{ type: 'x^2', mult: 1 }, { type: 'x', mult: 2 }], choices: [1, 2, 3] },
        ];
        
        if (this.levelIndex >= this.levelData.length) {
            this.levelIndex = 0; // fallback
        }
        this.currentLevel = this.levelData[this.levelIndex];
    }

    create() {
        // UI Header
        this.add.text(400, 30, this.currentLevel.name, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        this.add.text(400, 60, `LEVEL EQUATION: ${this.currentLevel.text}`, {
            fontSize: '18px',
            fill: '#00FFFF',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // The "=" Divider
        this.add.rectangle(400, 250, 4, 300, 0x00FFFF);
        this.add.text(400, 110, '=', { fontSize: '32px', fill: '#00FFFF', fontFamily: 'monospace' }).setOrigin(0.5);

        const beatWidth = 30; // visually scaled so 11 fit
        const blockHeight = 60;

        // Left Channel (Target)
        const leftTargetBeats = this.currentLevel.target;
        this.add.text(200, 150, 'LEFT CHANNEL (L)', { fill: '#fff', fontSize: '18px', fontFamily: 'monospace' }).setOrigin(0.5);
        
        let leftWidth = leftTargetBeats * beatWidth;
        let leftCenterX = 400 - leftWidth / 2 - 10;
        this.add.rectangle(leftCenterX, 250, leftWidth, blockHeight, 0x00FFFF, 0.2).setStrokeStyle(2, 0x00FFFF);
        this.add.text(leftCenterX, 250, `${leftTargetBeats}`, { fill: '#fff', fontSize: '20px', fontFamily: 'monospace' }).setOrigin(0.5);

        // Right Channel
        this.add.text(600, 150, 'RIGHT CHANNEL (R)', { fill: '#fff', fontSize: '18px', fontFamily: 'monospace' }).setOrigin(0.5);

        const rightBaseBeats = this.currentLevel.base;
        let currentX = 400 + 10;
        if (rightBaseBeats > 0) {
            let width = rightBaseBeats * beatWidth;
            let centerX = currentX + width / 2;
            this.add.rectangle(centerX, 250, width, blockHeight, 0xFF00FF).setStrokeStyle(2, 0xFFFFFF);
            this.add.text(centerX, 250, `${rightBaseBeats}`, { fill: '#fff', fontSize: '16px', fontFamily: 'monospace' }).setOrigin(0.5);
            currentX += width + 10;
        }

        this.dropZones = [];
        this.currentLevel.vars.forEach((v, index) => {
            const dropWidth = 80;
            
            // Add visual for the operator (+, etc.) if not first element
            if (index > 0 || (index === 0 && rightBaseBeats > 0)) {
                 this.add.text(currentX + 15, 250, '+', { fill: '#fff', fontSize: '24px', fontFamily: 'monospace' }).setOrigin(0.5);
                 currentX += 30; // space for '+'
            }
            
            let dropZoneCenterX = currentX + dropWidth / 2;
            let dropZone = this.add.zone(dropZoneCenterX, 250, dropWidth, blockHeight).setRectangleDropZone(dropWidth, blockHeight);
            
            let color = v.type === 'x^2' ? 0xFFFF00 : 0xaaaa00;
            let outline = this.add.rectangle(dropZoneCenterX, 250, dropWidth, blockHeight).setStrokeStyle(2, 0x555555);
            
            let labelText = v.type.toUpperCase();
            if (v.mult > 1) labelText = `${v.mult}${labelText}`;
            this.add.text(dropZoneCenterX, 250, `${labelText}`, { fill: '#555', fontFamily: 'monospace', fontSize: '16px' }).setOrigin(0.5);
            
            this.dropZones.push({
                zone: dropZone,
                outline: outline,
                varData: v,
                placedBlock: null
            });
            
            currentX += dropWidth + 10;
        });

        // Inventory Area
        this.add.rectangle(400, 500, 800, 200, 0x111111);
        this.add.text(400, 420, 'ASSET TRAY (DRAG TO TIMELINE)', { fontSize: '16px', fill: '#bbb', fontFamily: 'monospace' }).setOrigin(0.5);

        // Create draggable blocks in inventory
        const colors = [0x00aa00, 0xaa00aa, 0xaaaa00];
        let spacing = 800 / (this.currentLevel.choices.length + 1);
        this.currentLevel.choices.forEach((choice, i) => {
            let xPos = spacing * (i + 1);
            this.createSpawner(xPos, 480, choice, colors[i % colors.length]);
        });

        // Drag events
        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
            gameObject.setAlpha(0.8);
            
            // if pulled from spawner, create a new one to replace it
            if (gameObject.getData('isSpawnerItem') && gameObject.x === gameObject.getData('spawnerX') && gameObject.y === gameObject.getData('spawnerY')) {
               let newBlock = this.createDraggableBlock(
                   gameObject.getData('spawnerX'),
                   gameObject.getData('spawnerY'),
                   gameObject.getData('beats'),
                   gameObject.getData('color')
               );
               newBlock.setData('spawnerX', gameObject.getData('spawnerX'));
               newBlock.setData('spawnerY', gameObject.getData('spawnerY'));
               newBlock.setData('color', gameObject.getData('color'));
               newBlock.setData('isSpawnerItem', true);
            }
            
            // if it was previously placed in a drop zone, clear it
            let zoneData = gameObject.getData('placedInZone');
            if (zoneData) {
                zoneData.placedBlock = null;
                gameObject.setData('placedInZone', null);
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragenter', (pointer, gameObject, dropZone) => {
            let zoneInfo = this.dropZones.find(dz => dz.zone === dropZone);
            if (zoneInfo) zoneInfo.outline.setStrokeStyle(4, 0x00FFFF);
        });

        this.input.on('dragleave', (pointer, gameObject, dropZone) => {
            let zoneInfo = this.dropZones.find(dz => dz.zone === dropZone);
            if (zoneInfo) {
                zoneInfo.outline.setStrokeStyle(2, 0x555555);
            }
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            let zoneInfo = this.dropZones.find(dz => dz.zone === dropZone);
            if (zoneInfo) {
                 if (zoneInfo.placedBlock && zoneInfo.placedBlock !== gameObject) {
                     zoneInfo.placedBlock.destroy();
                 }
                 
                 gameObject.x = dropZone.x;
                 gameObject.y = dropZone.y;
                 zoneInfo.placedBlock = gameObject;
                 gameObject.setData('placedInZone', zoneInfo);
                 
                 zoneInfo.outline.setStrokeStyle(4, 0x00FFFF);
                 this.sound.play('snap');
                 gameObject.setData('isSpawnerItem', false); // No longer a spawner item
            }
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            gameObject.setAlpha(1);
            if (!dropped) {
                // Destroy if left hanging
                this.sound.play('error');
                gameObject.destroy();
            }
        });

        // Sync Button
        this.syncBtn = this.add.text(400, 560, '[ SYNC TRACK ]', {
            fontSize: '28px',
            fill: '#030914',
            fontFamily: 'monospace',
            backgroundColor: '#00FFFF'
        }).setOrigin(0.5).setPadding(10, 5);

        this.syncBtn.setInteractive({ useHandCursor: true });
        this.syncBtn.on('pointerover', () => {
            this.syncBtn.setBackgroundColor('#ffffff');
            this.sound.play('hover');
        });
        this.syncBtn.on('pointerout', () => this.syncBtn.setBackgroundColor('#00FFFF'));
        this.syncBtn.on('pointerdown', () => {
            this.sound.play('snap');
            this.checkSync();
        });
    }

    createSpawner(x, y, beats, color) {
        // Ghost background for spawner
        this.add.rectangle(x, y, beats * 30, 60, color).setAlpha(0.2);
        this.add.text(x, y, `X=${beats}`, { fontSize: '16px', fill: '#555', fontFamily: 'monospace', fontStyle: 'bold' }).setOrigin(0.5);
        
        let block = this.createDraggableBlock(x, y, beats, color);
        block.setData('spawnerX', x);
        block.setData('spawnerY', y);
        block.setData('color', color);
        block.setData('isSpawnerItem', true);
    }

    createDraggableBlock(x, y, beats, color) {
        let width = beats * 30; // visual width
        let rect = this.add.rectangle(0, 0, width, 60, color).setStrokeStyle(2, 0xffffff);
        // inner glitch
        let innerRect = this.add.rectangle(0, 0, width - 8, 52, 0xffffff, 0.1);
        let txt = this.add.text(0, 0, `X=${beats}`, { fontSize: '16px', fill: '#fff', fontFamily: 'monospace', fontStyle: 'bold' }).setOrigin(0.5);

        let container = this.add.container(x, y, [rect, innerRect, txt]);
        container.setSize(width, 60);
        container.setInteractive({ useHandCursor: true });
        container.on('pointerover', () => { if (!this.input.isDragging) this.sound.play('hover') });
        this.input.setDraggable(container);

        container.setData('beats', beats);
        container.setData('startX', x);
        container.setData('startY', y);
        return container;
    }

    checkSync() {
        let allFilled = true;
        let currentBeats = this.currentLevel.base;
        
        let selectedX = null;
        let identicalX = true;

        this.dropZones.forEach(dz => {
            if (!dz.placedBlock) {
                 allFilled = false;
                 dz.outline.setStrokeStyle(4, 0xFF0000);
            } else {
                 let val = dz.placedBlock.getData('beats');
                 
                 if (selectedX === null) {
                     selectedX = val;
                 } else if (selectedX !== val) {
                     identicalX = false;
                 }
                 
                 let evaluated = val;
                 if (dz.varData.type === 'x^2') {
                     evaluated = val * val;
                 }
                 evaluated = evaluated * dz.varData.mult;
                 
                 currentBeats += evaluated;
            }
        });

        if (!allFilled) {
            this.cameras.main.flash(200, 255, 0, 0, 0.5);
            return;
        }

        if (!identicalX) {
            let errorTxt = this.add.text(400, 300, 'ALL X MUST MATCH!', { fill: '#ffffff', backgroundColor: '#ff0000', fontSize: '24px', fontFamily: 'monospace' }).setOrigin(0.5).setPadding(10);
            this.time.delayedCall(1500, () => errorTxt.destroy());
            
            this.sound.play('error');
            this.cameras.main.shake(400, 0.02);
            return;
        }

        if (currentBeats === this.currentLevel.target) {
            // Success
            this.sound.play('success');
            this.cameras.main.flash(500, 0, 255, 255);
            this.time.delayedCall(800, () => {
                this.scene.start('ResultScene', { 
                    success: true, 
                    levelIndex: this.levelIndex,
                    isLastLevel: this.levelIndex >= this.levelData.length - 1
                });
            });
        } else {
            // Distorted fail
            this.sound.play('error');
            this.cameras.main.shake(400, 0.02);
            this.cameras.main.flash(400, 255, 0, 0, 0.5);
            this.time.delayedCall(800, () => {
                this.scene.start('ResultScene', { 
                    success: false,
                    levelIndex: this.levelIndex,
                    isLastLevel: this.levelIndex >= this.levelData.length - 1
                });
            });
        }
    }
}
