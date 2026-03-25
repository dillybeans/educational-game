export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        // Title
        this.add.text(400, 200, 'ECHO/SHIFT', { 
            fontSize: '64px', 
            fill: '#00FFFF', 
            fontFamily: 'monospace',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 270, 'MVP BUILD v0.1', { 
            fontSize: '20px', 
            fill: '#FF00FF', 
            fontFamily: 'monospace'
        }).setOrigin(0.5);

        // Play Button
        const playBtn = this.add.text(400, 400, '> START SYNC', { 
            fontSize: '32px', 
            fill: '#ffffff', 
            fontFamily: 'monospace',
            backgroundColor: '#FF00FF'
        }).setOrigin(0.5).setPadding(20);

        playBtn.setInteractive({ useHandCursor: true });
        
        playBtn.on('pointerover', () => {
            playBtn.setBackgroundColor('#00FFFF');
            playBtn.setColor('#030914');
        });

        playBtn.on('pointerout', () => {
            playBtn.setBackgroundColor('#FF00FF');
            playBtn.setColor('#ffffff');
        });

        playBtn.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
