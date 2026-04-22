export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.level = data.level || 1;

        // Define levels with numX (number of variables)
        const levelConfigs = {
            1: { leftTarget: 5, rightBase: 2, requiredX: 3, numX: 1, trackName: 'TRACK 01', property: 'OFF-BEAT', stems: ['stem_drums', 'stem_keys'] },
            2: { leftTarget: 7, rightBase: 3, requiredX: 4, numX: 1, trackName: 'TRACK 02', property: 'VOLUME', stems: ['stem_drums', 'stem_keys', 'stem_synth1'] },
            3: { leftTarget: 8, rightBase: 2, requiredX: 3, numX: 2, trackName: 'TRACK 03', property: 'PITCH', stems: ['stem_drums', 'stem_keys', 'stem_synth1', 'stem_synth2'] },
            4: { leftTarget: 8, rightBase: 2, requiredX: 2, numX: 3, trackName: 'TRACK 04', property: 'SPEED', stems: ['stem_drums', 'stem_keys', 'stem_synth1', 'stem_synth2', 'stem_synth4'] },
            5: { leftTarget: 10, rightBase: 0, requiredX: 5, numX: 2, trackName: 'TRACK 05', property: 'ALL', stems: ['stem_drums', 'stem_keys', 'stem_synth1', 'stem_synth2', 'stem_synth4', 'stem_synth', 'stem_fx'] }
        };

        this.config = levelConfigs[this.level] || levelConfigs[5];
    }

    create() {
        this.beatWidth = 35; // Shrink beat width slightly to fit up to 10 beats elegantly
        const blockHeight = 60;

        // UI Header
        this.add.text(400, 50, `${this.config.trackName} - FIX: ${this.config.property}`, {
            fontSize: '24px',
            fill: '#ffffff',
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Main Menu Button
        const menuBtn = this.add.text(50, 50, '< MAIN MENU', {
            fontSize: '16px',
            fill: '#00FFFF',
            fontFamily: 'monospace',
        }).setInteractive({ useHandCursor: true });
        
        menuBtn.on('pointerdown', () => {
            this.sound.play('hover_click');
            this.sound.stopAll();
            this.scene.start('MenuScene');
        });

        // Initialize Broken Background Audio
        this.bgAudios = [];
        this.config.stems.forEach(stem => {
            let config = { volume: 0.8, loop: true };
            
            if (this.config.property === 'OFF-BEAT' || this.config.property === 'ALL') {
                config.delay = Math.random() * 2;
            }
            if (this.config.property === 'VOLUME' || this.config.property === 'ALL') {
                config.volume = 0.2 + Math.random();
            }
            if (this.config.property === 'PITCH' || this.config.property === 'ALL') {
                config.detune = (Math.random() * 1800) - 1200;
            }
            if (this.config.property === 'SPEED' || this.config.property === 'ALL') {
                config.rate = 0.6 + (Math.random() * 0.6);
            }

            let sound = this.sound.add(stem, config);
            sound.play();
            this.bgAudios.push(sound);
        });

        // The "=" Divider
        this.add.rectangle(400, 250, 4, 300, 0x00FFFF);
        this.add.text(400, 250, '=', { fontSize: '32px', fill: '#00FFFF', fontFamily: 'monospace', backgroundColor: '#030914' }).setOrigin(0.5).setPadding(20, 4);

        // Left Channel
        this.add.text(200, 150, 'LEFT CHANNEL (L)', { fill: '#fff', fontSize: '18px', fontFamily: 'monospace' }).setOrigin(0.5);
        const leftTargetBeats = this.config.leftTarget;
        this.add.rectangle(400 - (leftTargetBeats * this.beatWidth) / 2 - 10, 250, leftTargetBeats * this.beatWidth, blockHeight, 0x00FFFF, 0.2).setStrokeStyle(2, 0x00FFFF);
        this.add.text(400 - (leftTargetBeats * this.beatWidth) / 2 - 10, 250, `${leftTargetBeats} BEATS`, { fill: '#fff', fontSize: '16px', fontFamily: 'monospace' }).setOrigin(0.5);

        // Right Channel
        const rightBaseBeats = this.config.rightBase;
        this.add.text(600, 150, 'RIGHT CHANNEL (R)', { fill: '#fff', fontSize: '18px', fontFamily: 'monospace' }).setOrigin(0.5);

        if (rightBaseBeats > 0) {
            const rightBaseX = 400 + (rightBaseBeats * this.beatWidth) / 2 + 10;
            this.add.rectangle(rightBaseX, 250, rightBaseBeats * this.beatWidth, blockHeight, 0xFF00FF).setStrokeStyle(2, 0xFFFFFF);
            this.add.text(rightBaseX, 250, `${rightBaseBeats}`, { fill: '#fff', fontSize: '16px', fontFamily: 'monospace' }).setOrigin(0.5);
        }

        // Multi Drop Zones
        const remainingBeats = leftTargetBeats - rightBaseBeats;
        const beatsPerZone = remainingBeats / this.config.numX;

        this.dropZones = [];
        this.placedBlocks = new Array(this.config.numX).fill(null);

        for (let i = 0; i < this.config.numX; i++) {
            let zX = 400 + (rightBaseBeats * this.beatWidth) + 10 + (i * beatsPerZone * this.beatWidth) + (beatsPerZone * this.beatWidth) / 2;
            let dZ = this.add.zone(zX, 250, beatsPerZone * this.beatWidth, blockHeight).setRectangleDropZone(beatsPerZone * this.beatWidth, blockHeight);
            dZ.setData('index', i);
            let outline = this.add.rectangle(zX, 250, beatsPerZone * this.beatWidth, blockHeight).setStrokeStyle(2, 0x555555);
            this.add.text(zX, 250, 'DROP X', { fill: '#555', fontFamily: 'monospace', fontSize: '16px' }).setOrigin(0.5);

            this.dropZones.push({ zone: dZ, outline: outline });
        }

        // Inventory Area
        this.add.rectangle(400, 500, 800, 200, 0x111111);
        this.add.text(400, 420, 'ASSET TRAY (DRAG TO TIMELINE)', { fontSize: '16px', fill: '#bbb', fontFamily: 'monospace' }).setOrigin(0.5);

        let options = [this.config.requiredX, this.config.requiredX - 1, this.config.requiredX + 1];
        options = options.map(v => v < 1 ? v + 3 : v);
        options.sort(() => Math.random() - 0.5);

        const colors = [0x00aa00, 0xaa00aa, 0xaaaa00];

        this.createBlock(200, 480, options[0], colors[0]);
        this.createBlock(400, 480, options[1], colors[1]);
        this.createBlock(600, 480, options[2], colors[2]);

        this.setupDragEvents();

        // Sync Button
        this.syncBtn = this.add.text(400, 560, '[ SYNC TRACK ]', {
            fontSize: '28px',
            fill: '#030914',
            fontFamily: 'monospace',
            backgroundColor: '#00FFFF'
        }).setOrigin(0.5).setPadding(10, 5);

        this.syncBtn.setInteractive({ useHandCursor: true });
        this.syncBtn.on('pointerover', () => this.sound.play('hover_click'));
        this.syncBtn.on('pointerdown', () => {
            this.sound.play('hover_click');
            this.checkSync();
        });
    }

    setupDragEvents() {
        this.input.on('dragstart', (pointer, gameObject) => {
            if (!gameObject.getData('isClone')) {
                // Infinite inventory: spawn a new one in the tray as soon as dragging starts
                this.createBlock(gameObject.getData('startX'), gameObject.getData('startY'), gameObject.getData('beats'), gameObject.getData('color'));
                gameObject.setData('isClone', true);
            }
            this.sound.play('block_snap');
            this.children.bringToTop(gameObject);
            gameObject.setAlpha(0.8);

            // Removing from a drop zone if it was in one
            let oldZoneIndex = gameObject.getData('zoneIndex');
            if (oldZoneIndex !== undefined) {
                this.placedBlocks[oldZoneIndex] = null;
                gameObject.setData('zoneIndex', undefined);
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragenter', (pointer, gameObject, dropZone) => {
            let dzInfo = this.dropZones.find(dz => dz.zone === dropZone);
            if (dzInfo) dzInfo.outline.setStrokeStyle(4, 0x00FFFF);
        });

        this.input.on('dragleave', (pointer, gameObject, dropZone) => {
            let dzInfo = this.dropZones.find(dz => dz.zone === dropZone);
            if (dzInfo) dzInfo.outline.setStrokeStyle(2, 0x555555);
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            this.sound.play('block_snap');

            let zoneIndex = dropZone.getData('index');
            // Check if slot occupied
            if (this.placedBlocks[zoneIndex] !== null) {
                gameObject.destroy();
                return;
            }

            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            this.placedBlocks[zoneIndex] = gameObject;
            gameObject.setData('zoneIndex', zoneIndex);

            let dzInfo = this.dropZones.find(dz => dz.zone === dropZone);
            if (dzInfo) dzInfo.outline.setStrokeStyle(4, 0x00FFFF);
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            gameObject.setAlpha(1);
            if (!dropped) {
                this.sound.play('block_snap');
                gameObject.destroy(); // Burn off unassigned clones
            }
        });
    }

    createBlock(x, y, beats, color) {
        let rect = this.add.rectangle(0, 0, beats * this.beatWidth, 60, color).setStrokeStyle(2, 0xffffff);
        let innerRect = this.add.rectangle(0, 0, beats * this.beatWidth - 8, 52, 0xffffff, 0.1);
        let txt = this.add.text(0, 0, `X=${beats}`, { fontSize: '20px', fill: '#fff', fontFamily: 'monospace', fontStyle: 'bold' }).setOrigin(0.5);

        let container = this.add.container(x, y, [rect, innerRect, txt]);
        container.setSize(beats * this.beatWidth, 60);
        container.setInteractive({ useHandCursor: true });
        this.input.setDraggable(container);

        container.setData('beats', beats);
        container.setData('startX', x);
        container.setData('startY', y);
        container.setData('color', color);
        container.setData('isClone', false);
        return container;
    }

    checkSync() {
        if (this.placedBlocks.includes(null)) {
            this.cameras.main.flash(200, 255, 0, 0, 0.5);
            return;
        }

        let firstBeat = this.placedBlocks[0].getData('beats');
        let identical = this.placedBlocks.every(b => b.getData('beats') === firstBeat);

        const isSuccess = identical && (firstBeat === this.config.requiredX);

        if (isSuccess) {
            this.sound.play('success_chime');
            this.cameras.main.flash(500, 0, 255, 255);
            this.syncBtn.disableInteractive();

            // Stop broken background music
            this.bgAudios.forEach(s => s.stop());

            // Play correct mix
            this.config.stems.forEach(stem => {
                this.sound.add(stem, { volume: 0.8 }).play();
            });

            this.time.delayedCall(4000, () => {
                this.sound.stopAll();
                this.scene.start('ResultScene', { success: true, level: this.level });
            });
        } else {
            this.sound.play('error_buzzer');
            this.cameras.main.shake(400, 0.02);
            this.cameras.main.flash(400, 255, 0, 0, 0.5);
        }
    }
}
