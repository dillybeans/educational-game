export class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    preload() {
        // Loading screen
        const bg = this.add.rectangle(400, 300, 800, 600, 0x0D0D1A);
        const loadTxt = this.add.text(400, 280, 'LOADING STUDIO...', {
            fontSize: '20px', fill: '#FF3AF2', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        // Outline border for the loading bar
        this.add.rectangle(400, 320, 404, 12, 0x000000, 0).setStrokeStyle(2, 0x333355);
        const loadBar = this.add.rectangle(200, 320, 0, 8, 0x00F5D4).setOrigin(0, 0.5);
        
        this.load.on('progress', (val) => { loadBar.width = 400 * val; });
        this.load.on('complete', () => { bg.destroy(); loadTxt.destroy(); loadBar.destroy(); });

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
    }

    create() {
        const W = 800, H = 600;
        const COLORS = [0xFF3AF2, 0x00F5D4, 0xFFE600, 0xFF6B35, 0x7B2FFF];

        // ── Background layers ──
        this.add.rectangle(W/2, H/2, W, H, 0x0D0D1A);

        // Gradient mesh blobs (bigger, more colorful)
        const g1 = this.add.circle(120, 100, 260, 0xFF3AF2, 0.08);
        const g2 = this.add.circle(680, 480, 300, 0x00F5D4, 0.07);
        const g3 = this.add.circle(400, 300, 350, 0x7B2FFF, 0.05);
        const g4 = this.add.circle(700, 100, 180, 0xFFE600, 0.04);
        const g5 = this.add.circle(100, 500, 200, 0xFF6B35, 0.05);

        // Animate blobs slowly
        this.tweens.add({ targets: g1, x: 180, y: 140, duration: 8000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: g2, x: 620, y: 420, duration: 10000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // Dot grid pattern
        for (let x = 20; x < W; x += 30) {
            for (let y = 20; y < H; y += 30) {
                this.add.circle(x, y, 1, 0xFF3AF2, 0.15);
            }
        }

        // ── Scanlines overlay ──
        for (let y = 0; y < H; y += 4) {
            this.add.rectangle(W/2, y, W, 1, 0x000000, 0.08);
        }

        // ── Pulsing concentric rings ──
        for (let r = 0; r < 3; r++) {
            const ring = this.add.circle(W/2, 260, 120 + r * 60, COLORS[r], 0).setStrokeStyle(1, COLORS[r], 0.08);
            this.tweens.add({ targets: ring, scaleX: 1.3, scaleY: 1.3, alpha: 0, duration: 3000 + r * 500, repeat: -1, ease: 'Sine.easeOut' });
        }

        // ── Confetti particles ──
        for (let i = 0; i < 25; i++) {
            const cx = Phaser.Math.Between(30, 770);
            const cy = Phaser.Math.Between(30, 570);
            const size = Phaser.Math.Between(3, 8);
            const col = COLORS[i % 5];
            const angle = Phaser.Math.Between(-45, 45);
            const conf = this.add.rectangle(cx, cy, size, size * 0.5, col, 0.25).setAngle(angle);
            this.tweens.add({
                targets: conf, y: cy + Phaser.Math.Between(-25, 25), angle: angle + Phaser.Math.Between(-30, 30),
                alpha: { from: 0.15, to: 0.4 }, duration: 2500 + Math.random() * 2500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        }

        // ── Floating shapes ──
        const shapes = [
            { x: 70, y: 80, txt: '✦', color: '#FF3AF2', size: 28, anim: 'float' },
            { x: 730, y: 100, txt: '⚡', color: '#FFE600', size: 32, anim: 'floatR' },
            { x: 50, y: 500, txt: '★', color: '#FF6B35', size: 36, anim: 'float' },
            { x: 750, y: 480, txt: '♫', color: '#7B2FFF', size: 30, anim: 'floatR' },
            { x: 120, y: 300, txt: '●', color: '#00F5D4', size: 20, anim: 'float' },
            { x: 680, y: 250, txt: '◆', color: '#FF3AF2', size: 22, anim: 'floatR' },
            { x: 400, y: 540, txt: '🎧', color: '#FFE600', size: 26, anim: 'float' },
            { x: 200, y: 450, txt: '🔥', color: '#FF6B35', size: 24, anim: 'floatR' },
        ];
        shapes.forEach(s => {
            const t = this.add.text(s.x, s.y, s.txt, { fontSize: `${s.size}px`, fill: s.color }).setOrigin(0.5).setAlpha(0.5);
            const dy = s.anim === 'float' ? -18 : 18;
            this.tweens.add({ targets: t, y: s.y + dy, duration: 2500 + Math.random() * 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });

        // ── Background giant text ──
        this.add.text(W/2 - 100, H/2 - 60, 'ECHO', {
            fontSize: '180px', fill: '#7B2FFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.04);
        this.add.text(W/2 + 100, H/2 + 60, 'SHIFT', {
            fontSize: '160px', fill: '#FF3AF2', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.03);

        // ── Title with chromatic aberration ──
        // Furthest shadow
        this.add.text(W/2 + 8, 150, 'GROOVING WITH MATH', {
            fontSize: '52px', fill: '#00F5D4', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.3);
        // Mid shadow
        this.add.text(W/2 + 4, 148, 'GROOVING WITH MATH', {
            fontSize: '52px', fill: '#7B2FFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.5);
        // Near shadow
        this.add.text(W/2 + 2, 146, 'GROOVING WITH MATH', {
            fontSize: '52px', fill: '#FF3AF2', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.7);
        // Main title
        const title = this.add.text(W/2, 144, 'GROOVING WITH MATH', {
            fontSize: '52px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        // Wiggle the title
        this.tweens.add({ targets: title, angle: 1, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // ── Subtitle with glow ──
        const sub = this.add.text(W/2, 200, '🎧 REPAIR THE MUSIC 🎧', {
            fontSize: '20px', fill: '#00F5D4', fontFamily: 'Outfit, monospace', fontStyle: 'bold',
            letterSpacing: 6
        }).setOrigin(0.5);
        this.tweens.add({ targets: sub, alpha: { from: 0.7, to: 1 }, duration: 1500, yoyo: true, repeat: -1 });

        // ── Decorative divider ──
        const divL = this.add.rectangle(W/2 - 80, 232, 120, 3, 0xFF3AF2);
        const divR = this.add.rectangle(W/2 + 80, 232, 120, 3, 0x00F5D4);
        const divDot = this.add.circle(W/2, 232, 5, 0xFFE600);
        this.tweens.add({ targets: divL, scaleX: 0.5, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: divR, scaleX: 0.5, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 500 });
        this.tweens.add({ targets: divDot, scaleX: 1.5, scaleY: 1.5, duration: 1000, yoyo: true, repeat: -1 });

        // ── Preview Button ──
        const prevBg = this.add.rectangle(W/2 + 4, 284, 320, 50, 0x7B2FFF);
        const prevBg2 = this.add.rectangle(W/2, 280, 320, 50, 0x2D1B4E).setStrokeStyle(4, 0x00F5D4);
        const prevTxt = this.add.text(W/2, 280, '🎵 PREVIEW FULL MIX', {
            fontSize: '18px', fill: '#00F5D4', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);

        // Shimmer effect on preview btn
        const prevShine = this.add.rectangle(W/2 - 160, 280, 30, 50, 0xFFFFFF, 0.08);
        this.tweens.add({ targets: prevShine, x: W/2 + 160, duration: 3000, repeat: -1, ease: 'Sine.easeInOut', delay: 1000 });

        let previewMusic = null;
        let isPreviewing = false;

        prevBg2.setInteractive({ useHandCursor: true });
        prevBg2.on('pointerover', () => {
            this.sound.play('hover_click');
            prevBg2.setFillStyle(0x00F5D4); prevTxt.setColor('#0D0D1A');
        });
        prevBg2.on('pointerout', () => {
            prevBg2.setFillStyle(isPreviewing ? 0xFF3AF2 : 0x2D1B4E);
            prevTxt.setColor(isPreviewing ? '#FFFFFF' : '#00F5D4');
        });
        prevBg2.on('pointerdown', () => {
            this.sound.play('hover_click');
            if (isPreviewing) {
                if (previewMusic) previewMusic.stop();
                isPreviewing = false;
                prevTxt.setText('🎵 PREVIEW FULL MIX');
                prevBg2.setFillStyle(0x2D1B4E); prevTxt.setColor('#00F5D4');
            } else {
                if (!previewMusic) previewMusic = this.sound.add('full_mix', { volume: 0.8 });
                previewMusic.play();
                isPreviewing = true;
                prevTxt.setText('⏹ STOP PREVIEW');
                prevBg2.setFillStyle(0xFF3AF2); prevTxt.setColor('#FFFFFF');
            }
        });

        // ── Play Button (PRIMARY CTA) ──
        // Stacked shadow layers
        const playS3 = this.add.rectangle(W/2 + 10, 370, 340, 65, 0x00F5D4).setStrokeStyle(0);
        const playS2 = this.add.rectangle(W/2 + 5, 365, 340, 65, 0xFF3AF2).setStrokeStyle(0);
        const playBg = this.add.rectangle(W/2, 360, 340, 65, 0x7B2FFF).setStrokeStyle(4, 0xFFE600);
        const playTxt = this.add.text(W/2, 360, '🎸 REPAIR TRACKS', {
            fontSize: '26px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold',
            letterSpacing: 3
        }).setOrigin(0.5);

        // Pulse glow on play button
        this.tweens.add({
            targets: playBg, alpha: { from: 1, to: 0.85 },
            duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        // Shimmer sweep on play button
        const playShine = this.add.rectangle(W/2 - 170, 360, 40, 65, 0xFFFFFF, 0.1);
        this.tweens.add({ targets: playShine, x: W/2 + 170, duration: 2500, repeat: -1, ease: 'Quad.easeInOut' });

        playBg.setInteractive({ useHandCursor: true });
        playBg.on('pointerover', () => {
            this.sound.play('hover_click');
            this.tweens.add({ targets: [playBg, playTxt, playS2, playS3], scaleX: 1.06, scaleY: 1.06, duration: 200, ease: 'Back.easeOut' });
            playBg.setFillStyle(0xFFE600); playBg.setStrokeStyle(4, 0xFF3AF2); playTxt.setColor('#0D0D1A');
        });
        playBg.on('pointerout', () => {
            this.tweens.add({ targets: [playBg, playTxt, playS2, playS3], scaleX: 1, scaleY: 1, duration: 200 });
            playBg.setFillStyle(0x7B2FFF); playBg.setStrokeStyle(4, 0xFFE600); playTxt.setColor('#FFFFFF');
        });
        playBg.on('pointerdown', () => {
            this.sound.play('hover_click');
            this.sound.stopAll();
            this.scene.start('GameScene');
        });

        // ── Level Select ──
        this.add.text(W/2, 418, 'LEVELS', {
            fontSize: '11px', fill: '#555577', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 8
        }).setOrigin(0.5);

        for (let i = 0; i < 5; i++) {
            const dx = (i - 2) * 50;
            // Glow ring behind dot
            const glow = this.add.circle(W/2 + dx, 448, 18, COLORS[i], 0.08);
            this.tweens.add({ targets: glow, scaleX: 1.5, scaleY: 1.5, alpha: 0, duration: 2000, repeat: -1, delay: i * 200 });

            const dot = this.add.circle(W/2 + dx, 448, 14, COLORS[i], 0.4).setStrokeStyle(2, COLORS[i]);
            const num = this.add.text(W/2 + dx, 448, `${i+1}`, {
                fontSize: '13px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            dot.setInteractive({ useHandCursor: true });
            dot.on('pointerover', () => { dot.setAlpha(1); dot.setScale(1.2); this.sound.play('hover_click'); });
            dot.on('pointerout', () => { dot.setAlpha(0.4); dot.setScale(1); });
            dot.on('pointerdown', () => {
                this.sound.play('hover_click');
                this.sound.stopAll();
                this.scene.start('GameScene', { level: i + 1 });
            });
        }

        // ── Sound Toggle Button ──
        this.isMuted = this.sound.mute || false;
        const soundBtnBg = this.add.rectangle(W - 50, 26, 80, 28, 0x1A1530, 0.8)
            .setStrokeStyle(2, this.isMuted ? 0xFF3AF2 : 0x00F5D4).setInteractive({ useHandCursor: true }).setDepth(10);
        const soundTxt = this.add.text(W - 50, 26, this.isMuted ? '🔇 OFF' : '🔊 ON', {
            fontSize: '12px', fill: this.isMuted ? '#FF3AF2' : '#00F5D4', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(10);

        soundBtnBg.on('pointerover', () => {
            soundBtnBg.setStrokeStyle(2, 0xFFE600); soundTxt.setColor('#FFE600');
        });
        soundBtnBg.on('pointerout', () => {
            soundBtnBg.setStrokeStyle(2, this.isMuted ? 0xFF3AF2 : 0x00F5D4);
            soundTxt.setColor(this.isMuted ? '#FF3AF2' : '#00F5D4');
        });
        soundBtnBg.on('pointerdown', () => {
            this.isMuted = !this.isMuted;
            this.sound.mute = this.isMuted;
            soundTxt.setText(this.isMuted ? '🔇 OFF' : '🔊 ON');
            soundBtnBg.setStrokeStyle(2, this.isMuted ? 0xFF3AF2 : 0x00F5D4);
            soundTxt.setColor(this.isMuted ? '#FF3AF2' : '#00F5D4');
            soundBtnBg.setFillStyle(this.isMuted ? 0x2D1B4E : 0x1A1530, 0.8);
        });

        // ── Corner accents ──
        // Top-left corner bracket
        this.add.rectangle(16, 16, 30, 3, 0xFF3AF2, 0.6);
        this.add.rectangle(16, 16, 3, 30, 0xFF3AF2, 0.6);
        // Top-right corner bracket
        this.add.rectangle(W - 16, 16, 30, 3, 0x00F5D4, 0.6);
        this.add.rectangle(W - 16, 16, 3, 30, 0x00F5D4, 0.6);
        // Bottom-left
        this.add.rectangle(16, H - 48, 30, 3, 0xFFE600, 0.6);
        this.add.rectangle(16, H - 48, 3, 30, 0xFFE600, 0.6);
        // Bottom-right
        this.add.rectangle(W - 16, H - 48, 30, 3, 0xFF6B35, 0.6);
        this.add.rectangle(W - 16, H - 48, 3, 30, 0xFF6B35, 0.6);

        // ── Version badge ──
        this.add.text(W - 20, H - 50, 'v1.0', {
            fontSize: '9px', fill: '#333355', fontFamily: 'Outfit, monospace'
        }).setOrigin(1, 0.5);

        // ── Bottom ticker ──
        const tickerBg = this.add.rectangle(W/2, H - 16, W, 32, 0xFF3AF2);
        this.add.rectangle(W/2, H - 32, W, 3, 0xFFE600);
        this.add.rectangle(W/2, H, W, 2, 0x7B2FFF);
        const tickerText = this.add.text(W, H - 16, 'SOLVE EQUATIONS ★ REPAIR MUSIC ★ LEVEL UP ★ ALGEBRA MEETS AUDIO ★ FIX THE MIX ★ RESTORE THE BEAT ★ SOLVE EQUATIONS ★ REPAIR MUSIC ★ LEVEL UP ★ ', {
            fontSize: '11px', fill: '#0D0D1A', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 4
        }).setOrigin(0, 0.5);
        this.tweens.add({ targets: tickerText, x: -tickerText.width, duration: 20000, repeat: -1, ease: 'Linear' });
    }
}
