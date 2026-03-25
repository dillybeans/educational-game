export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.success = data.success || false;
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

        const retryBtn = this.add.text(400, 450, '> BACK TO STUDIO', { 
            fontSize: '24px', 
            fill: '#030914', 
            fontFamily: 'monospace',
            backgroundColor: '#ffffff'
        }).setOrigin(0.5).setPadding(15);
        
        retryBtn.setInteractive({ useHandCursor: true });
        
        retryBtn.on('pointerover', () => retryBtn.setBackgroundColor(col));
        retryBtn.on('pointerout', () => retryBtn.setBackgroundColor('#ffffff'));

        retryBtn.on('pointerdown', () => {
            if (this.success) {
                this.scene.start('MenuScene'); // In full game, this goes to Next Level
            } else {
                this.scene.start('GameScene'); // Retry
            }
        });
    }
}
