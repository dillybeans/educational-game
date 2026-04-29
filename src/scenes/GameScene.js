export class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.level = data.level || 1;
        const allStems = [
            { key: 'stem_drums', label: 'DRUMS' },
            { key: 'stem_keys', label: 'KEYS' },
            { key: 'stem_synth1', label: 'SYNTH 1' },
            { key: 'stem_synth2', label: 'SYNTH 2' },
            { key: 'stem_synth4', label: 'SYNTH 4' },
            { key: 'stem_synth', label: 'SYNTH PAD' },
            { key: 'stem_fx', label: 'FX' }
        ];
        const levelConfigs = {
            1: { trackName: 'TRACK 01 — FOUNDATIONS', playing: [0], missing: [1],
                equations: [{ display: '7 + ? = 12', answer: 5, choices: [3, 5, 7, 9] }] },
            2: { trackName: 'TRACK 02 — LAYERING', playing: [0, 1], missing: [2, 3],
                equations: [
                    { display: '? × 4 = 24', answer: 6, choices: [4, 6, 8, 12] },
                    { display: '36 ÷ ? = 9', answer: 4, choices: [3, 4, 6, 9] }] },
            3: { trackName: 'TRACK 03 — TEXTURE', playing: [0, 1], missing: [2, 3, 4],
                equations: [
                    { display: '2x + 3 = 11    x = ?', answer: 4, choices: [3, 4, 5, 7] },
                    { display: '5x - 4 = 16    x = ?', answer: 4, choices: [2, 3, 4, 6] },
                    { display: '3x + 1 = 19    x = ?', answer: 6, choices: [4, 5, 6, 8] }] },
            4: { trackName: 'TRACK 04 — DEPTH', playing: [0], missing: [1, 2, 3, 4, 5],
                equations: [
                    { display: '15 - ? = 7', answer: 8, choices: [6, 7, 8, 9] },
                    { display: '? × 3 = 27', answer: 9, choices: [6, 8, 9, 12] },
                    { display: '3(x+2) = 18   x = ?', answer: 4, choices: [3, 4, 5, 6] },
                    { display: 'x÷4 + 5 = 8   x = ?', answer: 12, choices: [8, 10, 12, 16] },
                    { display: '2x - 7 = 9     x = ?', answer: 8, choices: [6, 7, 8, 10] }] },
            5: { trackName: 'TRACK 05 — FULL MIX', playing: [0], missing: [1, 2, 3, 4, 5, 6],
                equations: [
                    { display: '2x+3 = x+10   x = ?', answer: 7, choices: [5, 6, 7, 9] },
                    { display: '4(x-1) = 2x+6 x = ?', answer: 5, choices: [3, 4, 5, 7] },
                    { display: '3x+8 = 5x-2   x = ?', answer: 5, choices: [3, 4, 5, 6] },
                    { display: '(x+3)×2 = 18  x = ?', answer: 6, choices: [4, 5, 6, 8] },
                    { display: '7x-4 = 3x+12  x = ?', answer: 4, choices: [3, 4, 5, 6] },
                    { display: '5(x+1)=3x+13  x = ?', answer: 4, choices: [2, 3, 4, 6] }] }
        };
        this.config = levelConfigs[this.level] || levelConfigs[1];
        this.allStems = allStems;
        this.tracks = [];
        const used = [...this.config.playing, ...this.config.missing];
        used.forEach(i => {
            this.tracks.push({ ...allStems[i], stemIndex: i, isPlaying: this.config.playing.includes(i), isRestored: this.config.playing.includes(i), audio: null });
        });
        this.missingTracks = this.tracks.filter(t => !t.isPlaying);
        this.missingTracks.forEach((track, i) => { track.equation = this.config.equations[i]; });
        this.restoredCount = this.config.playing.length;
        this.totalTracks = this.tracks.length;
        this.activeEquationTrack = null;
    }

    create() {
        const W = 800, H = 600;
        const COLORS = [0xFF3AF2, 0x00F5D4, 0xFFE600, 0xFF6B35, 0x7B2FFF];
        const CHEX = ['#FF3AF2', '#00F5D4', '#FFE600', '#FF6B35', '#7B2FFF'];
        const LANE_H = 46, LANE_GAP = 6, LANE_LEFT = 30, LANE_W = 640;

        // ── Background ──
        this.add.rectangle(W/2, H/2, W, H, 0x0D0D1A);
        this.add.circle(100, 100, 180, 0xFF3AF2, 0.04);
        this.add.circle(700, 500, 220, 0x00F5D4, 0.03);
        this.add.circle(400, 300, 260, 0x7B2FFF, 0.03);

        // Dot grid
        for (let x = 15; x < W; x += 25) for (let y = 15; y < H; y += 25) this.add.circle(x, y, 0.8, 0xFF3AF2, 0.1);

        // ── Header ──
        // Shadow
        this.add.text(W/2 + 3, 28, this.config.trackName, {
            fontSize: '20px', fill: '#7B2FFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.add.text(W/2, 26, this.config.trackName, {
            fontSize: '20px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);

        const levelBadge = this.add.text(W/2, 52, `LEVEL ${this.level}/5`, {
            fontSize: '11px', fill: '#FF3AF2', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 6
        }).setOrigin(0.5);

        // Divider line
        this.add.rectangle(W/2, 66, 500, 2, 0xFF3AF2, 0.3);

        // ── Menu Button ──
        const menuTxt = this.add.text(50, 26, '✕ MENU', {
            fontSize: '13px', fill: '#555577', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0, 0.5).setInteractive({ useHandCursor: true });
        menuTxt.on('pointerover', () => { menuTxt.setColor('#FF3AF2'); this.sound.play('hover_click'); });
        menuTxt.on('pointerout', () => menuTxt.setColor('#555577'));
        menuTxt.on('pointerdown', () => { this.sound.play('hover_click'); this.sound.stopAll(); window.dispatchEvent(new CustomEvent('character:hide')); this.scene.start('MenuScene'); });

        // ── Sound Toggle Button ──
        this.isMuted = false;
        const soundBtnBg = this.add.rectangle(W - 50, 26, 80, 28, 0x1A1530, 0.8)
            .setStrokeStyle(2, 0x00F5D4).setInteractive({ useHandCursor: true });
        const soundTxt = this.add.text(W - 50, 26, '🔊 ON', {
            fontSize: '12px', fill: '#00F5D4', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);

        soundBtnBg.on('pointerover', () => {
            soundBtnBg.setStrokeStyle(2, 0xFFE600);
            soundTxt.setColor('#FFE600');
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
            if (this.isMuted) {
                soundBtnBg.setFillStyle(0x2D1B4E, 0.8);
            } else {
                soundBtnBg.setFillStyle(0x1A1530, 0.8);
            }
        });

        // ── Track Lanes ──
        this.trackLanes = [];
        this.waveformBars = [];
        const startY = 82;

        this.tracks.forEach((track, i) => {
            const y = startY + i * (LANE_H + LANE_GAP);
            const col = COLORS[i % 5];
            const colHex = CHEX[i % 5];

            // Shadow rectangle
            this.add.rectangle(LANE_LEFT + LANE_W/2 + 4, y + 3, LANE_W, LANE_H, col, 0.1);

            // Lane bg
            const laneBg = this.add.rectangle(LANE_LEFT + LANE_W/2, y, LANE_W, LANE_H, 0x1A1530, 0.85)
                .setStrokeStyle(track.isPlaying ? 3 : 2, track.isPlaying ? col : 0x333355);

            // Icon + Label
            const icon = track.isPlaying ? '♫' : '🔒';
            const labelText = this.add.text(LANE_LEFT + 14, y, `${icon} ${track.label}`, {
                fontSize: '14px', fill: track.isPlaying ? colHex : '#555577',
                fontFamily: 'Outfit, monospace', fontStyle: 'bold'
            }).setOrigin(0, 0.5);

            // Status
            const statusText = this.add.text(LANE_LEFT + LANE_W - 14, y, track.isPlaying ? 'PLAYING ▸' : 'MISSING ✗', {
                fontSize: '11px', fill: track.isPlaying ? colHex : '#FF3AF2',
                fontFamily: 'Outfit, monospace', fontStyle: 'bold'
            }).setOrigin(1, 0.5);

            // Waveform bars
            const bars = [];
            const barCount = 35;
            const barLeft = LANE_LEFT + 120;
            const barW = (LANE_W - 200) / barCount - 1.5;
            for (let b = 0; b < barCount; b++) {
                const bx = barLeft + b * (barW + 1.5);
                const bh = track.isPlaying ? (3 + Math.random() * (LANE_H - 14)) : 2;
                const bar = this.add.rectangle(bx, y, barW, bh, track.isPlaying ? col : 0x222233, track.isPlaying ? 0.65 : 0.2);
                bars.push(bar);
            }

            // Interactivity for missing tracks
            if (!track.isPlaying) {
                laneBg.setInteractive({ useHandCursor: true });
                laneBg.on('pointerover', () => {
                    if (!track.isRestored) { laneBg.setStrokeStyle(3, 0xFF3AF2); this.sound.play('hover_click'); }
                });
                laneBg.on('pointerout', () => {
                    if (!track.isRestored) laneBg.setStrokeStyle(2, 0x333355);
                });
                laneBg.on('pointerdown', () => {
                    if (!track.isRestored) { this.sound.play('block_snap'); this.showEquation(track); }
                });
            }

            this.trackLanes.push({ laneBg, labelText, statusText, bars, track, color: col, colorHex: colHex });
            this.waveformBars.push({ bars, isActive: track.isPlaying, track, color: col });
        });

        // ── Progress Bar ──
        const progY = startY + this.tracks.length * (LANE_H + LANE_GAP) + 8;
        // Shadow
        this.add.rectangle(W/2 + 3, progY + 2, LANE_W, 16, 0x7B2FFF, 0.15);
        this.add.rectangle(W/2, progY, LANE_W, 16, 0x111122).setStrokeStyle(2, 0x333355);
        this.progressBarFill = this.add.rectangle(
            LANE_LEFT + 1, progY,
            (this.restoredCount / this.totalTracks) * (LANE_W - 2), 12,
            0x00F5D4, 0.8
        ).setOrigin(0, 0.5);
        this.progressText = this.add.text(W/2, progY, `${this.restoredCount}/${this.totalTracks} STEMS RESTORED`, {
            fontSize: '10px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 2
        }).setOrigin(0.5);

        // ── Equation Panel ──
        const panelY = H - 90;
        this.eqPanel = this.add.container(W/2, panelY);

        // Panel shadow
        this.eqPanel.add(this.add.rectangle(5, 5, 720, 145, 0x7B2FFF, 0.15));
        // Panel bg
        const panelBg = this.add.rectangle(0, 0, 720, 145, 0x0D0D1A, 0.95).setStrokeStyle(3, 0x00F5D4);
        this.eqPanel.add(panelBg);
        // Corner accent
        this.eqPanel.add(this.add.rectangle(-356, -69, 8, 8, 0xFF3AF2));
        this.eqPanel.add(this.add.rectangle(356, -69, 8, 8, 0xFFE600));
        this.eqPanel.add(this.add.rectangle(-356, 69, 8, 8, 0xFFE600));
        this.eqPanel.add(this.add.rectangle(356, 69, 8, 8, 0xFF3AF2));

        this.eqPrompt = this.add.text(0, -5, '▲ SELECT A MISSING TRACK TO REPAIR ▲', {
            fontSize: '14px', fill: '#555577', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.eqPanel.add(this.eqPrompt);

        this.eqDisplay = this.add.text(0, -35, '', {
            fontSize: '22px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.eqPanel.add(this.eqDisplay);

        this.eqTarget = this.add.text(0, -58, '', {
            fontSize: '12px', fill: '#FF3AF2', fontFamily: 'Outfit, monospace', fontStyle: 'bold', letterSpacing: 3
        }).setOrigin(0.5);
        this.eqPanel.add(this.eqTarget);

        this.answerButtons = [];

        // ── Start audio ──
        this.stemAudios = {};
        this.tracks.forEach(track => {
            const audio = this.sound.add(track.key, { volume: track.isPlaying ? 0.7 : 0, loop: true });
            audio.play();
            this.stemAudios[track.key] = audio;
            if (!track.isPlaying) audio.setVolume(0);
        });

        // Instruction hint
        this.hintText = this.add.text(W/2, progY + 22, 'Click a 🔒 track to begin repairing', {
            fontSize: '11px', fill: '#555577', fontFamily: 'Outfit, monospace'
        }).setOrigin(0.5);
        this.tweens.add({ targets: this.hintText, alpha: 0.4, duration: 1500, yoyo: true, repeat: -1 });

        // ── 3D Character ──
        if (window.characterRenderer && !window.characterRenderer.isInitialized) {
            window.characterRenderer.init('character-viewport');
        }
        window.dispatchEvent(new CustomEvent('character:show'));
        window.dispatchEvent(new CustomEvent('character:idle'));
    }

    showEquation(track) {
        if (track.isRestored) return;
        this.activeEquationTrack = track;
        this.answerButtons.forEach(btn => btn.destroy());
        this.answerButtons = [];

        this.eqPrompt.setVisible(false);
        this.eqTarget.setText(`▸ REPAIR: ${track.label}`);
        this.eqDisplay.setText(track.equation.display);
        if (this.hintText) this.hintText.setVisible(false);

        const choices = [...track.equation.choices].sort(() => Math.random() - 0.5);
        const COLORS = [0xFF3AF2, 0x00F5D4, 0xFFE600, 0xFF6B35];
        const btnW = 110, spacing = 130;
        const startX = -((choices.length - 1) * spacing) / 2;

        choices.forEach((choice, i) => {
            const bx = startX + i * spacing;
            const by = 25;
            const col = COLORS[i % 4];

            // Shadow
            const sh = this.add.rectangle(bx + 3, by + 3, btnW, 44, col, 0.2);
            // Button
            const bg = this.add.rectangle(bx, by, btnW, 44, 0x1A1530).setStrokeStyle(3, col)
                .setInteractive({ useHandCursor: true });
            const txt = this.add.text(bx, by, `${choice}`, {
                fontSize: '22px', fill: '#FFFFFF', fontFamily: 'Outfit, monospace', fontStyle: 'bold'
            }).setOrigin(0.5);

            bg.on('pointerover', () => {
                bg.setFillStyle(col); txt.setColor('#0D0D1A'); this.sound.play('hover_click');
            });
            bg.on('pointerout', () => {
                bg.setFillStyle(0x1A1530); txt.setColor('#FFFFFF');
            });
            bg.on('pointerdown', () => this.handleAnswer(choice, track));

            this.eqPanel.add(sh); this.eqPanel.add(bg); this.eqPanel.add(txt);
            this.answerButtons.push(sh, bg, txt);
        });
    }

    handleAnswer(selected, track) {
        const COLORS_ARR = [0xFF3AF2, 0x00F5D4, 0xFFE600, 0xFF6B35, 0x7B2FFF];

        if (selected === track.equation.answer) {
            this.sound.play('success_chime');
            track.isRestored = true;
            this.restoredCount++;

            // Trigger 3D character punch celebration
            window.dispatchEvent(new CustomEvent('character:punch'));

            // Fade in audio
            const audio = this.stemAudios[track.key];
            this.tweens.add({ targets: audio, volume: 0.7, duration: 1500, ease: 'Sine.easeIn' });

            // Update lane visuals
            const laneData = this.trackLanes.find(l => l.track === track);
            if (laneData) {
                this.cameras.main.flash(300, 0, 245, 212, 0.25);
                laneData.laneBg.setStrokeStyle(3, laneData.color);
                laneData.laneBg.setFillStyle(0x1A1530, 0.85);
                laneData.laneBg.disableInteractive();
                laneData.labelText.setText(`♫ ${track.label}`);
                laneData.labelText.setColor(laneData.colorHex);
                laneData.statusText.setText('RESTORED ✓');
                laneData.statusText.setColor(laneData.colorHex);

                const wfData = this.waveformBars.find(w => w.track === track);
                if (wfData) {
                    wfData.isActive = true;
                    wfData.bars.forEach((bar, idx) => {
                        this.tweens.add({
                            targets: bar, fillAlpha: 0.65, delay: idx * 15,
                            duration: 300, ease: 'Back.easeOut'
                        });
                        bar.setFillStyle(wfData.color, 0.65);
                    });
                }
            }

            // Update progress
            this.tweens.add({
                targets: this.progressBarFill,
                displayWidth: (this.restoredCount / this.totalTracks) * 638,
                duration: 800, ease: 'Cubic.easeOut'
            });
            this.progressText.setText(`${this.restoredCount}/${this.totalTracks} STEMS RESTORED`);

            // Clear equation
            this.answerButtons.forEach(btn => btn.destroy());
            this.answerButtons = [];
            this.eqDisplay.setText(''); this.eqTarget.setText('');

            if (this.restoredCount >= this.totalTracks) {
                this.eqPrompt.setText('🎵 ALL STEMS RESTORED! 🎵');
                this.eqPrompt.setVisible(true); this.eqPrompt.setColor('#00F5D4').setFontSize('18px');
                this.cameras.main.flash(800, 255, 58, 242, 0.4);
                this.time.delayedCall(3500, () => {
                    this.sound.stopAll();
                    window.dispatchEvent(new CustomEvent('character:hide'));
                    this.scene.start('ResultScene', { success: true, level: this.level });
                });
            } else {
                this.eqPrompt.setText(`✓ ${track.label} RESTORED — Select another track`);
                this.eqPrompt.setVisible(true); this.eqPrompt.setColor('#00F5D4');
            }
        } else {
            this.sound.play('error_buzzer');
            this.cameras.main.shake(300, 0.015);
            this.eqDisplay.setColor('#FF6B35');
            this.time.delayedCall(400, () => this.eqDisplay.setColor('#FFFFFF'));

            // Trigger 3D character death animation
            window.dispatchEvent(new CustomEvent('character:death'));
        }
    }

    update() {
        this.waveformBars.forEach(wf => {
            if (wf.isActive) {
                wf.bars.forEach((bar, i) => {
                    const t = this.time.now / 180;
                    const h = 3 + Math.abs(Math.sin(t + i * 0.45)) * 28;
                    bar.setSize(bar.width, h);
                });
            }
        });
    }
}
