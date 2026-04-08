export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.success = data.success || false;
        this.levelIndex = data.levelIndex || 0;
        this.isLastLevel = data.isLastLevel || false;
    }

    create() {
        const msg = this.success ? 'SYNC ACHIEVED' : 'SYNC FAILED\nDISTORTION DETECTED';
        const col = this.success ? '#00FFFF' : '#FF00FF';
        
        this.add.text(400, 250, msg, { 
            fontSize: this.success ? '48px' : '36px', 
            fill: col, 
            fontFamily: 'monospace',
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        let subMsg = 'Equations must be balanced to clear distortion.';
        if (this.success) {
            subMsg = this.isLastLevel ? 'All channels synchronized. Demo complete!' : 'Audio channels balanced successfully.';
        }
        
        this.add.text(400, 320, subMsg, { fontSize: '18px', fill: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);

        let btnText = '> RETRY TRACK';
        if (this.success) {
            btnText = this.isLastLevel ? '> BACK TO TITLE' : '> NEXT TRACK';
        }

        const retryBtn = this.add.text(400, 450, btnText, { 
            fontSize: '24px', 
            fill: '#030914', 
            fontFamily: 'monospace',
            backgroundColor: '#ffffff'
        }).setOrigin(0.5).setPadding(15);
        
        retryBtn.setInteractive({ useHandCursor: true });
        
        retryBtn.on('pointerover', () => {
            retryBtn.setBackgroundColor(col);
            this.sound.play('hover');
        });
        retryBtn.on('pointerout', () => retryBtn.setBackgroundColor('#ffffff'));

        retryBtn.on('pointerdown', () => {
            this.sound.play('snap');
            if (this.success && this.isLastLevel) {
                this.scene.start('MenuScene');
            } else if (this.success) {
                this.scene.start('GameScene', { levelIndex: this.levelIndex + 1 });
            } else {
                this.scene.start('GameScene', { levelIndex: this.levelIndex }); // Retry
            }
        });
    }
}
