export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.success = data.success || false;
        this.level = data.level || 1;
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
        
        const subMsg = this.success ? 'Audio channels balanced successfully.' : 'Equations must be balanced to clear distortion.';
        this.add.text(400, 320, subMsg, { fontSize: '18px', fill: '#fff', fontFamily: 'monospace' }).setOrigin(0.5);

        let btnText = '> NEXT TRACK';
        if (!this.success) btnText = '> RETRY SYNC';
        if (this.success && this.level >= 5) btnText = '> RETURN TO STUDIO';

        const retryBtn = this.add.text(400, 450, btnText, { 
            fontSize: '24px', 
            fill: '#030914', 
            fontFamily: 'monospace',
            backgroundColor: '#ffffff'
        }).setOrigin(0.5).setPadding(15);
        
        retryBtn.setInteractive({ useHandCursor: true });
        
        retryBtn.on('pointerover', () => {
            this.sound.play('hover_click');
            retryBtn.setBackgroundColor(col);
        });
        retryBtn.on('pointerout', () => retryBtn.setBackgroundColor('#ffffff'));

        retryBtn.on('pointerdown', () => {
            this.sound.play('hover_click');
            if (this.success) {
                if (this.level >= 5) {
                    this.scene.start('MenuScene'); // Beat the game
                } else {
                    this.scene.start('GameScene', { level: this.level + 1 }); // Next Level
                }
            } else {
                this.scene.start('GameScene', { level: this.level }); // Retry
            }
        });
    }
}
