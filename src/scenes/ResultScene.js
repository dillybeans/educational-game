export class ResultScene extends Phaser.Scene {
    constructor() {
        super('ResultScene');
    }

    init(data) {
        this.success = data.success || false;
        this.level = data.level || 1;
    }

    create() {
        const W = 800, H = 600;
        const COLORS = [0xFF3AF2, 0x00F5D4, 0xFFE600, 0xFF6B35, 0x7B2FFF];
        const CHEX = ['#FF3AF2', '#00F5D4', '#FFE600', '#FF6B35', '#7B2FFF'];

        // ── Background ──
        this.add.rectangle(W/2, H/2, W, H, 0x0D0D1A);
        this.add.circle(200, 150, 200, 0xFF3AF2, 0.05);
        this.add.circle(600, 450, 250, 0x00F5D4, 0.04);
        this.add.circle(400, 300, 300, 0x7B2FFF, 0.03);

        // Dot grid
        for (let x = 15; x < W; x += 28) for (let y = 15; y < H; y += 28) this.add.circle(x, y, 0.8, 0x00F5D4, 0.12);

        // ── Floating shapes ──
        const shapes = [
            { x: 80, y: 100, txt: '🎵', size: 30 }, { x: 720, y: 120, txt: '✨', size: 28 },
            { x: 60, y: 450, txt: '⚡', size: 32 }, { x: 740, y: 500, txt: '★', size: 34 },
            { x: 150, y: 520, txt: '🔥', size: 26 }, { x: 650, y: 80, txt: '💫', size: 28 },
        ];
        shapes.forEach((s, i) => {
            const t = this.add.text(s.x, s.y, s.txt, { fontSize: `${s.size}px` }).setOrigin(0.5).setAlpha(0.5);
            const dy = i % 2 === 0 ? -16 : 16;
            this.tweens.add({ targets: t, y: s.y + dy, duration: 2500 + i * 300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        });

        // ── Giant bg text ──
        this.add.text(W/2, H/2, 'WOW', {
            fontSize: '200px', fill: '#FF3AF2', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0.03);

        // ── Confetti burst (colored rectangles) ──
        for (let i = 0; i < 40; i++) {
            const cx = Phaser.Math.Between(50, 750);
            const cy = Phaser.Math.Between(50, 550);
            const cw = Phaser.Math.Between(4, 12);
            const ch = Phaser.Math.Between(4, 12);
            const col = COLORS[i % 5];
            const angle = Phaser.Math.Between(-45, 45);
            const conf = this.add.rectangle(cx, cy, cw, ch, col, 0.5).setAngle(angle);
            this.tweens.add({
                targets: conf, y: cy + Phaser.Math.Between(-30, 30), angle: angle + Phaser.Math.Between(-20, 20),
                alpha: 0.2, duration: 2000 + Math.random() * 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
            });
        }

        // ── Title ──
        const accentCol = CHEX[(this.level - 1) % 5];
        // Shadow layers
        this.add.text(W/2 + 5, 165, '🎵 TRACK RESTORED 🎵', {
            fontSize: '36px', fill: '#7B2FFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(W/2 + 2, 163, '🎵 TRACK RESTORED 🎵', {
            fontSize: '36px', fill: '#FF3AF2', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        const titleTxt = this.add.text(W/2, 160, '🎵 TRACK RESTORED 🎵', {
            fontSize: '36px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        // Subtle wiggle
        this.tweens.add({ targets: titleTxt, angle: 1, duration: 1500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // Level badge
        const badgeBg = this.add.rectangle(W/2, 210, 180, 30, COLORS[(this.level - 1) % 5], 0.2)
            .setStrokeStyle(2, COLORS[(this.level - 1) % 5]);
        this.add.text(W/2, 210, `LEVEL ${this.level} COMPLETE`, {
            fontSize: '13px', fill: accentCol, fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 3
        }).setOrigin(0.5);

        // Divider
        const div = this.add.rectangle(W/2, 240, 300, 3, 0xFF3AF2, 0.4);
        this.tweens.add({ targets: div, scaleX: 0.5, duration: 2000, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        // Sub message
        this.add.text(W/2, 268, 'All missing stems repaired successfully.', {
            fontSize: '15px', fill: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, monospace'
        }).setOrigin(0.5);

        // Stats
        const stemCounts = { 1: 1, 2: 2, 3: 3, 4: 5, 5: 6 };
        const count = stemCounts[this.level] || 1;
        this.add.text(W/2, 300, `STEMS: ${count}  ·  EQUATIONS: ${count}`, {
            fontSize: '12px', fill: '#555577', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 3
        }).setOrigin(0.5);

        // ── Next Track / Back Button ──
        const isLast = this.level >= 5;
        const btnLabel = isLast ? '🏠 BACK TO STUDIO' : '▶ NEXT TRACK';

        // Stacked shadows
        this.add.rectangle(W/2 + 8, 378, 300, 58, 0x00F5D4);
        this.add.rectangle(W/2 + 4, 374, 300, 58, 0xFF3AF2);
        const nextBg = this.add.rectangle(W/2, 370, 300, 58, 0x7B2FFF).setStrokeStyle(4, 0xFFE600);
        const nextTxt = this.add.text(W/2, 370, btnLabel, {
            fontSize: '20px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 2
        }).setOrigin(0.5);

        // Pulse
        this.tweens.add({ targets: nextBg, alpha: { from: 1, to: 0.85 }, duration: 1200, yoyo: true, repeat: -1 });

        nextBg.setInteractive({ useHandCursor: true });
        nextBg.on('pointerover', () => {
            this.sound.play('hover_click');
            nextBg.setFillStyle(0xFFE600); nextBg.setStrokeStyle(4, 0xFF3AF2);
            nextTxt.setColor('#0D0D1A');
        });
        nextBg.on('pointerout', () => {
            nextBg.setFillStyle(0x7B2FFF); nextBg.setStrokeStyle(4, 0xFFE600);
            nextTxt.setColor('#FFFFFF');
        });
        nextBg.on('pointerdown', () => {
            this.sound.play('hover_click');
            if (isLast) this.scene.start('MenuScene');
            else this.scene.start('GameScene', { level: this.level + 1 });
        });

        // ── Replay Button ──
        const replayTxt = this.add.text(W/2, 430, '↻ REPLAY TRACK', {
            fontSize: '14px', fill: '#FF6B35', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });

        replayTxt.on('pointerover', () => { replayTxt.setColor('#FFE600'); this.sound.play('hover_click'); });
        replayTxt.on('pointerout', () => replayTxt.setColor('#FF6B35'));
        replayTxt.on('pointerdown', () => {
            this.sound.play('hover_click');
            this.scene.start('GameScene', { level: this.level });
        });

        // ── Bottom ticker ──
        this.add.rectangle(W/2, H - 16, W, 32, 0x00F5D4);
        this.add.rectangle(W/2, H - 32, W, 3, 0xFFE600);
        const ticker = this.add.text(W, H - 16, 'NICE WORK ★ TRACK RESTORED ★ KEEP GOING ★ MATH IS MUSIC ★ YOU DID IT ★ NICE WORK ★ TRACK RESTORED ★ KEEP GOING ★ MATH IS MUSIC ★ ', {
            fontSize: '11px', fill: '#0D0D1A', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 4
        }).setOrigin(0, 0.5);
        this.tweens.add({ targets: ticker, x: -ticker.width, duration: 18000, repeat: -1, ease: 'Linear' });
    }
}
