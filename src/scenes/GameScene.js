export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    create() {
        // UI Header
        this.add.text(400, 50, 'TRACK 01: BALANCE THE BEAT', { 
            fontSize: '24px', 
            fill: '#ffffff', 
            fontFamily: 'monospace' 
        }).setOrigin(0.5);
        
        // The "=" Divider
        this.add.rectangle(400, 250, 4, 300, 0x00FFFF);
        this.add.text(400, 90, '=', { fontSize: '32px', fill: '#00FFFF', fontFamily: 'monospace'}).setOrigin(0.5);

        const beatWidth = 60;
        const blockHeight = 60;

        // Left Channel (Target = 5 beats)
        const leftTargetBeats = 5;
        this.add.text(200, 150, 'LEFT CHANNEL (L)', { fill: '#fff', fontSize: '18px', fontFamily: 'monospace' }).setOrigin(0.5);
        // Draw the target block
        this.add.rectangle(400 - (leftTargetBeats*beatWidth)/2 - 10, 250, leftTargetBeats*beatWidth, blockHeight, 0x00FFFF, 0.2).setStrokeStyle(2, 0x00FFFF);
        this.add.text(400 - (leftTargetBeats*beatWidth)/2 - 10, 250, '5 BEAT LOOP', { fill: '#fff', fontSize: '16px', fontFamily: 'monospace' }).setOrigin(0.5);


        // Right Channel (Player drop zone)
        // Level equation: 2 + x = 5 (needs 3)
        const rightBaseBeats = 2; 
        this.add.text(600, 150, 'RIGHT CHANNEL (R)', { fill: '#fff', fontSize: '18px', fontFamily: 'monospace' }).setOrigin(0.5);
        
        // The existing constant on the right side
        const rightBaseX = 400 + (rightBaseBeats*beatWidth)/2 + 10;
        this.add.rectangle(rightBaseX, 250, rightBaseBeats*beatWidth, blockHeight, 0xFF00FF).setStrokeStyle(2, 0xFFFFFF);
        this.add.text(rightBaseX, 250, '2 BEATS', { fill: '#fff', fontSize: '16px', fontFamily: 'monospace' }).setOrigin(0.5);

        // Drop Zone for the variable
        const dropZoneX = 400 + (rightBaseBeats*beatWidth) + 10 + (3*beatWidth)/2;
        this.dropZone = this.add.zone(dropZoneX, 250, 3*beatWidth, blockHeight).setRectangleDropZone(3*beatWidth, blockHeight);
        
        // Visual indicator for drop zone
        this.dropZoneOutline = this.add.rectangle(dropZoneX, 250, 3*beatWidth, blockHeight).setStrokeStyle(2, 0x555555);
        this.add.text(dropZoneX, 250, 'DROP X', {fill: '#555', fontFamily: 'monospace', fontSize: '16px'}).setOrigin(0.5);

        // Inventory Area
        this.add.rectangle(400, 500, 800, 200, 0x111111);
        this.add.text(400, 420, 'ASSET TRAY (DRAG TO TIMELINE)', { fontSize: '16px', fill: '#bbb', fontFamily: 'monospace' }).setOrigin(0.5);
        
        // Create draggable blocks in inventory
        this.createBlock(200, 480, 2, 0x00aa00);
        this.createBlock(400, 480, 3, 0xaa00aa); // Correct answer
        this.createBlock(600, 480, 4, 0xaaaa00);

        // Drag events
        this.input.on('dragstart', (pointer, gameObject) => {
            this.children.bringToTop(gameObject);
            gameObject.setAlpha(0.8);
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragenter', (pointer, gameObject, dropZone) => {
            this.dropZoneOutline.setStrokeStyle(4, 0x00FFFF);
        });

        this.input.on('dragleave', (pointer, gameObject, dropZone) => {
            this.dropZoneOutline.setStrokeStyle(2, 0x555555);
        });

        this.placedBlock = null;

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;
            this.placedBlock = gameObject;
            this.dropZoneOutline.setStrokeStyle(4, 0x00FFFF);
        });

        this.input.on('dragend', (pointer, gameObject, dropped) => {
            gameObject.setAlpha(1);
            if (!dropped) {
                // Snap back to original position
                gameObject.x = gameObject.getData('startX');
                gameObject.y = gameObject.getData('startY');
                if(this.placedBlock === gameObject) this.placedBlock = null;
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
        this.syncBtn.on('pointerdown', () => this.checkSync());
    }

    createBlock(x, y, beats, color) {
        let rect = this.add.rectangle(0, 0, beats*60, 60, color).setStrokeStyle(2, 0xffffff);
        // TV Static/glitch placeholder effect for variables
        let innerRect = this.add.rectangle(0, 0, beats*60 - 8, 52, 0xffffff, 0.1);
        let txt = this.add.text(0, 0, `X=${beats}`, {fontSize: '20px', fill: '#fff', fontFamily: 'monospace', fontStyle: 'bold'}).setOrigin(0.5);
        
        let container = this.add.container(x, y, [rect, innerRect, txt]);
        container.setSize(beats*60, 60);
        container.setInteractive({ useHandCursor: true });
        this.input.setDraggable(container);
        
        // Save data
        container.setData('beats', beats);
        container.setData('startX', x);
        container.setData('startY', y);
        
        return container;
    }

    checkSync() {
        if(!this.placedBlock) {
            // Flash red if no block placed
            this.cameras.main.flash(200, 255, 0, 0, 0.5);
            return;
        }

        const beats = this.placedBlock.getData('beats');
        
        // Left is 5, Right is 2. We need 3.
        if(beats === 3) {
            // Success
            this.cameras.main.flash(500, 0, 255, 255);
            this.time.delayedCall(800, () => {
                this.scene.start('ResultScene', { success: true });
            });
        } else {
            // Distorted fail
            this.cameras.main.shake(400, 0.02);
            this.cameras.main.flash(400, 255, 0, 0, 0.5);
            this.time.delayedCall(800, () => {
                this.scene.start('ResultScene', { success: false });
            });
        }
    }
}
