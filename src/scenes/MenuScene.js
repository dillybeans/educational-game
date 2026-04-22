export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        let loadingText = this.add.text(400, 500, 'LOADING STUDIO ASSETS... [MAY TAKE A MOMENT]', { fontSize: '18px', fill: '#00FFFF', fontFamily: 'monospace' }).setOrigin(0.5);
        
        this.load.audio('hover_click', 'src/sfx/hover_click.wav');
        this.load.audio('block_snap', 'src/sfx/block_snap.wav');
        this.load.audio('error_buzzer', 'src/sfx/error_buzzer.wav');
        this.load.audio('success_chime', 'src/sfx/success_chime.wav');

        this.load.audio('stem_drums', 'src/stems/Whispers of Self-Evolution (drums).wav');
        this.load.audio('stem_keys', 'src/stems/Whispers of Self-Evolution (keys).wav');
        this.load.audio('stem_synth1', 'src/stems/Whispers of Self-Evolution (synth 1).wav');
        this.load.audio('stem_synth2', 'src/stems/Whispers of Self-Evolution (synth 2).wav');
        this.load.audio('stem_synth4', 'src/stems/Whispers of Self-Evolution (synth four).wav');
        this.load.audio('stem_synth', 'src/stems/Whispers of Self-Evolution (synth).wav');
        this.load.audio('stem_fx', 'src/stems/Whispers of Self-Evolution (fx).wav');
        this.load.audio('full_mix', 'src/stems/Full Mix - "Whispers of Self-Evolution".wav');

        this.load.on('complete', () => loadingText.destroy());
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

        // Preview Button
        const previewBtn = this.add.text(400, 350, '> PREVIEW FULL MIX', { 
            fontSize: '24px', 
            fill: '#ffffff', 
            fontFamily: 'monospace',
            backgroundColor: '#0055ff'
        }).setOrigin(0.5).setPadding(15);
        
        let previewMusic = null;
        let isPreviewing = false;

        previewBtn.setInteractive({ useHandCursor: true });
        
        previewBtn.on('pointerover', () => {
            this.sound.play('hover_click');
            previewBtn.setBackgroundColor('#00FFFF');
            previewBtn.setColor('#030914');
        });

        previewBtn.on('pointerout', () => {
            previewBtn.setBackgroundColor(isPreviewing ? '#ff3333' : '#0055ff');
            previewBtn.setColor('#ffffff');
        });

        previewBtn.on('pointerdown', () => {
            this.sound.play('hover_click');
            if (isPreviewing) {
                if (previewMusic) previewMusic.stop();
                isPreviewing = false;
                previewBtn.setText('> PREVIEW FULL MIX');
                previewBtn.setBackgroundColor('#0055ff');
            } else {
                if (!previewMusic) previewMusic = this.sound.add('full_mix', { volume: 0.8 });
                previewMusic.play();
                isPreviewing = true;
                previewBtn.setText('> STOP PREVIEW');
                previewBtn.setBackgroundColor('#ff3333');
            }
        });

        // Play Button
        const playBtn = this.add.text(400, 430, '> START SYNC', { 
            fontSize: '32px', 
            fill: '#ffffff', 
            fontFamily: 'monospace',
            backgroundColor: '#FF00FF'
        }).setOrigin(0.5).setPadding(20);

        playBtn.setInteractive({ useHandCursor: true });
        
        playBtn.on('pointerover', () => {
            this.sound.play('hover_click');
            playBtn.setBackgroundColor('#00FFFF');
            playBtn.setColor('#030914');
        });

        playBtn.on('pointerout', () => {
            playBtn.setBackgroundColor('#FF00FF');
            playBtn.setColor('#ffffff');
        });

        playBtn.on('pointerdown', () => {
            this.sound.play('hover_click');
            this.sound.stopAll();
            this.scene.start('GameScene');
        });
    }
}
