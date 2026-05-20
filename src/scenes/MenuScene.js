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

        // Initialize the AudioEngine (procedural tracks)
        if (window.audioEngine && !window.audioEngine.isReady) {
            window.audioEngine.init();
        }

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
            const ring = this.add.circle(W/2, 200, 80 + r * 40, COLORS[r], 0).setStrokeStyle(1, COLORS[r], 0.08);
            this.tweens.add({ targets: ring, scaleX: 1.3, scaleY: 1.3, alpha: 0, duration: 3000 + r * 500, repeat: -1, ease: 'Sine.easeOut' });
        }

        // ── Confetti particles ──
        for (let i = 0; i < 20; i++) {
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
            { x: 70, y: 60, txt: '✦', color: '#FF3AF2', size: 22, anim: 'float' },
            { x: 730, y: 80, txt: '⚡', color: '#FFE600', size: 26, anim: 'floatR' },
            { x: 50, y: 520, txt: '★', color: '#FF6B35', size: 28, anim: 'float' },
            { x: 750, y: 500, txt: '♫', color: '#7B2FFF', size: 24, anim: 'floatR' },
            { x: 120, y: 280, txt: '●', color: '#00F5D4', size: 16, anim: 'float' },
            { x: 680, y: 230, txt: '◆', color: '#FF3AF2', size: 18, anim: 'floatR' },
        ];
        shapes.forEach(s => {
            const t = this.add.text(s.x, s.y, s.txt, { fontSize: `${s.size}px`, fill: s.color }).setOrigin(0.5).setAlpha(0.5);
            const dy = s.anim === 'float' ? -18 : 18;
            this.tweens.add({ targets: t, y: s.y + dy, duration: 2500 + Math.random() * 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });

        // ── Background giant text ──
        this.add.text(W/2 - 100, H/2 - 40, 'ECHO', {
            fontSize: '140px', fill: '#7B2FFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.03);
        this.add.text(W/2 + 100, H/2 + 40, 'SHIFT', {
            fontSize: '120px', fill: '#FF3AF2', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.02);

        // ── Title with chromatic aberration ──
        this.add.text(W/2 + 6, 76, 'GROOVING WITH MATH', {
            fontSize: '40px', fill: '#00F5D4', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.3);
        this.add.text(W/2 + 3, 74, 'GROOVING WITH MATH', {
            fontSize: '40px', fill: '#7B2FFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.5);
        this.add.text(W/2 + 1, 73, 'GROOVING WITH MATH', {
            fontSize: '40px', fill: '#FF3AF2', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.7);
        const title = this.add.text(W/2, 72, 'GROOVING WITH MATH', {
            fontSize: '40px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.tweens.add({ targets: title, angle: 1, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // ── Subtitle ──
        const sub = this.add.text(W/2, 112, '🎧 SELECT A TRACK & REPAIR THE MUSIC 🎧', {
            fontSize: '13px', fill: '#00F5D4', fontFamily: 'Outfit, monospace', fontStyle: 'bold',
            letterSpacing: 3
        }).setOrigin(0.5);
        this.tweens.add({ targets: sub, alpha: { from: 0.7, to: 1 }, duration: 1500, yoyo: true, repeat: -1 });

        // ── Decorative divider ──
        const divL = this.add.rectangle(W/2 - 80, 134, 120, 2, 0xFF3AF2);
        const divR = this.add.rectangle(W/2 + 80, 134, 120, 2, 0x00F5D4);
        const divDot = this.add.circle(W/2, 134, 4, 0xFFE600);
        this.tweens.add({ targets: divL, scaleX: 0.5, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.tweens.add({ targets: divR, scaleX: 0.5, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: 500 });
        this.tweens.add({ targets: divDot, scaleX: 1.5, scaleY: 1.5, duration: 1000, yoyo: true, repeat: -1 });

        // ── Track Selection Cards ──
        const tracks = [
            { id: 'track1', name: 'WHISPERS OF\nSELF-EVOLUTION', genre: 'AMBIENT / SYNTH', color: 0xFF3AF2, colorHex: '#FF3AF2', stems: 7, isProcedural: false },
            { id: 'track2', name: 'DIGITAL\nDREAMSCAPE', genre: 'SYNTH-WAVE', color: 0x00F5D4, colorHex: '#00F5D4', stems: 7, isProcedural: true },
            { id: 'track3', name: 'NEON\nPULSE', genre: 'LO-FI BEATS', color: 0xFFE600, colorHex: '#FFE600', stems: 7, isProcedural: true },
            { id: 'track4', name: 'CIRCUIT\nBREAKER', genre: 'CHIPTUNE / 8-BIT', color: 0x7B2FFF, colorHex: '#7B2FFF', stems: 7, isProcedural: true },
        ];

        this.selectedTrack = null;
        this.previewPlaying = false;
        this.previewAudio = null;
        this.trackCards = [];

        const CARD_W = 164, CARD_H = 155, CARD_GAP = 14;
        const totalW = tracks.length * CARD_W + (tracks.length - 1) * CARD_GAP;
        const cardStartX = (W - totalW) / 2 + CARD_W / 2;
        const cardY = 230;

        tracks.forEach((track, idx) => {
            const cx = cardStartX + idx * (CARD_W + CARD_GAP);

            // Card shadow
            this.add.rectangle(cx + 4, cardY + 4, CARD_W, CARD_H, track.color, 0.12);

            // Card background
            const cardBg = this.add.rectangle(cx, cardY, CARD_W, CARD_H, 0x1A1530, 0.9)
                .setStrokeStyle(2, 0x333355);

            // Track number badge
            const numBg = this.add.rectangle(cx, cardY - CARD_H/2 + 16, 32, 22, track.color, 0.3)
                .setStrokeStyle(1, track.color);
            this.add.text(cx, cardY - CARD_H/2 + 16, `0${idx + 1}`, {
                fontSize: '11px', fill: track.colorHex, fontFamily: 'Outfit, monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            // Track name
            this.add.text(cx, cardY - 10, track.name, {
                fontSize: '13px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold',
                align: 'center', lineSpacing: 3
            }).setOrigin(0.5);

            // Genre label
            this.add.text(cx, cardY + 30, track.genre, {
                fontSize: '8px', fill: '#555577', fontFamily: 'Outfit, monospace', fontStyle: 'bold',
                letterSpacing: 2
            }).setOrigin(0.5);

            // Stem count
            this.add.text(cx, cardY + 48, `${track.stems} STEMS`, {
                fontSize: '9px', fill: track.colorHex, fontFamily: 'Outfit, monospace', fontStyle: 'bold'
            }).setOrigin(0.5).setAlpha(0.7);

            // Mini waveform decoration
            for (let b = 0; b < 12; b++) {
                const bx = cx - 30 + b * 5.5;
                const bh = 2 + Math.random() * 10;
                this.add.rectangle(bx, cardY + 62, 3, bh, track.color, 0.3);
            }

            // Selection highlight ring (hidden initially)
            const selRing = this.add.rectangle(cx, cardY, CARD_W + 6, CARD_H + 6, 0x000000, 0)
                .setStrokeStyle(3, track.color, 0).setDepth(5);

            // Interaction
            cardBg.setInteractive({ useHandCursor: true });
            cardBg.on('pointerover', () => {
                if (this.selectedTrack !== track.id) {
                    cardBg.setStrokeStyle(2, track.color);
                    this.sound.play('hover_click');
                }
            });
            cardBg.on('pointerout', () => {
                if (this.selectedTrack !== track.id) {
                    cardBg.setStrokeStyle(2, 0x333355);
                }
            });
            cardBg.on('pointerdown', () => {
                this.sound.play('block_snap');
                this._selectTrack(track.id, idx);
            });

            this.trackCards.push({ cardBg, selRing, track, cx, cy: cardY });
        });

        // ── Preview Button ──
        const prevBg2 = this.add.rectangle(W/2, 332, 260, 36, 0x2D1B4E).setStrokeStyle(3, 0x00F5D4);
        const prevTxt = this.add.text(W/2, 332, '🎵 PREVIEW FULL MIX', {
            fontSize: '13px', fill: '#00F5D4', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.prevBg2 = prevBg2;
        this.prevTxt = prevTxt;

        // Shimmer
        const prevShine = this.add.rectangle(W/2 - 130, 332, 20, 36, 0xFFFFFF, 0.06);
        this.tweens.add({ targets: prevShine, x: W/2 + 130, duration: 3000, repeat: -1, ease: 'Sine.easeInOut', delay: 1000 });

        prevBg2.setInteractive({ useHandCursor: true });
        prevBg2.on('pointerover', () => {
            this.sound.play('hover_click');
            prevBg2.setFillStyle(0x00F5D4); prevTxt.setColor('#0D0D1A');
        });
        prevBg2.on('pointerout', () => {
            prevBg2.setFillStyle(this.previewPlaying ? 0xFF3AF2 : 0x2D1B4E);
            prevTxt.setColor(this.previewPlaying ? '#FFFFFF' : '#00F5D4');
        });
        prevBg2.on('pointerdown', () => {
            this.sound.play('hover_click');
            this._togglePreview();
        });

        // ── Play Button (PRIMARY CTA) ──
        const playS3 = this.add.rectangle(W/2 + 8, 392, 320, 52, 0x00F5D4);
        const playS2 = this.add.rectangle(W/2 + 4, 388, 320, 52, 0xFF3AF2);
        const playBg = this.add.rectangle(W/2, 384, 320, 52, 0x7B2FFF).setStrokeStyle(4, 0xFFE600);
        const playTxt = this.add.text(W/2, 384, '🎸 REPAIR TRACKS', {
            fontSize: '22px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold',
            letterSpacing: 3
        }).setOrigin(0.5);

        this.tweens.add({
            targets: playBg, alpha: { from: 1, to: 0.85 },
            duration: 1200, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });

        const playShine = this.add.rectangle(W/2 - 160, 384, 30, 52, 0xFFFFFF, 0.08);
        this.tweens.add({ targets: playShine, x: W/2 + 160, duration: 2500, repeat: -1, ease: 'Quad.easeInOut' });

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
            this._stopPreview();
            this.sound.stopAll();
            const trackId = this.selectedTrack || 'track1';
            this.scene.start('GameScene', { track: trackId });
        });

        // ── Level Select ──
        this.add.text(W/2, 434, 'LEVELS', {
            fontSize: '10px', fill: '#555577', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 8
        }).setOrigin(0.5);

        for (let i = 0; i < 5; i++) {
            const dx = (i - 2) * 45;
            const glow = this.add.circle(W/2 + dx, 458, 16, COLORS[i], 0.08);
            this.tweens.add({ targets: glow, scaleX: 1.5, scaleY: 1.5, alpha: 0, duration: 2000, repeat: -1, delay: i * 200 });

            const dot = this.add.circle(W/2 + dx, 458, 12, COLORS[i], 0.4).setStrokeStyle(2, COLORS[i]);
            const num = this.add.text(W/2 + dx, 458, `${i+1}`, {
                fontSize: '11px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            dot.setInteractive({ useHandCursor: true });
            dot.on('pointerover', () => { dot.setAlpha(1); dot.setScale(1.2); this.sound.play('hover_click'); });
            dot.on('pointerout', () => { dot.setAlpha(0.4); dot.setScale(1); });
            dot.on('pointerdown', () => {
                this.sound.play('hover_click');
                this._stopPreview();
                this.sound.stopAll();
                const trackId = this.selectedTrack || 'track1';
                this.scene.start('GameScene', { level: i + 1, track: trackId });
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
            // Mute procedural audio too
            if (window.audioEngine) {
                window.audioEngine.setMasterMute(this.isMuted);
            }
        });

        // ── Corner accents ──
        this.add.rectangle(16, 16, 30, 3, 0xFF3AF2, 0.6);
        this.add.rectangle(16, 16, 3, 30, 0xFF3AF2, 0.6);
        this.add.rectangle(W - 16, 16, 30, 3, 0x00F5D4, 0.6);
        this.add.rectangle(W - 16, 16, 3, 30, 0x00F5D4, 0.6);
        this.add.rectangle(16, H - 48, 30, 3, 0xFFE600, 0.6);
        this.add.rectangle(16, H - 48, 3, 30, 0xFFE600, 0.6);
        this.add.rectangle(W - 16, H - 48, 30, 3, 0xFF6B35, 0.6);
        this.add.rectangle(W - 16, H - 48, 3, 30, 0xFF6B35, 0.6);

        // ── Version badge ──
        this.add.text(W - 20, H - 50, 'v2.0', {
            fontSize: '9px', fill: '#333355', fontFamily: 'Outfit, monospace'
        }).setOrigin(1, 0.5);

        // ── Bottom ticker ──
        const tickerBg = this.add.rectangle(W/2, H - 16, W, 32, 0xFF3AF2);
        this.add.rectangle(W/2, H - 32, W, 3, 0xFFE600);
        this.add.rectangle(W/2, H, W, 2, 0x7B2FFF);
        const tickerText = this.add.text(W, H - 16, '4 TRACKS ★ 7 STEMS EACH ★ SOLVE EQUATIONS ★ REPAIR MUSIC ★ LEVEL UP ★ ALGEBRA MEETS AUDIO ★ FIX THE MIX ★ RESTORE THE BEAT ★ ', {
            fontSize: '11px', fill: '#0D0D1A', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 4
        }).setOrigin(0, 0.5);
        this.tweens.add({ targets: tickerText, x: -tickerText.width, duration: 20000, repeat: -1, ease: 'Linear' });

        // Auto-select track 1
        this._selectTrack('track1', 0);
    }

    _selectTrack(trackId, idx) {
        this.selectedTrack = trackId;
        this._stopPreview();

        // Update all card visuals
        this.trackCards.forEach((card, i) => {
            if (card.track.id === trackId) {
                card.cardBg.setStrokeStyle(3, card.track.color);
                card.cardBg.setFillStyle(0x2D1B4E, 0.95);
                card.selRing.setStrokeStyle(3, card.track.color, 0.6);
            } else {
                card.cardBg.setStrokeStyle(2, 0x333355);
                card.cardBg.setFillStyle(0x1A1530, 0.9);
                card.selRing.setStrokeStyle(3, 0x000000, 0);
            }
        });
    }

    _togglePreview() {
        if (this.previewPlaying) {
            this._stopPreview();
        } else {
            this._startPreview();
        }
    }

    _startPreview() {
        const trackId = this.selectedTrack || 'track1';
        this.previewPlaying = true;
        this.prevTxt.setText('⏹ STOP PREVIEW');
        this.prevBg2.setFillStyle(0xFF3AF2);
        this.prevTxt.setColor('#FFFFFF');

        if (trackId === 'track1') {
            // File-based preview
            if (!this.previewAudio) this.previewAudio = this.sound.add('full_mix', { volume: 0.8 });
            this.previewAudio.play();
        } else {
            // Procedural preview via AudioEngine
            if (window.audioEngine) {
                window.audioEngine.playStem(trackId, 'fullMix', 0.8);
            }
        }
    }

    _stopPreview() {
        this.previewPlaying = false;
        this.prevTxt.setText('🎵 PREVIEW FULL MIX');
        this.prevBg2.setFillStyle(0x2D1B4E);
        this.prevTxt.setColor('#00F5D4');

        if (this.previewAudio) {
            this.previewAudio.stop();
        }
        if (window.audioEngine) {
            window.audioEngine.stopAll();
        }
    }
}
