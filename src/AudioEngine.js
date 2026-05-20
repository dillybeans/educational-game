/**
 * AudioEngine.js — Procedural music synthesizer for Echo/Shift
 *
 * Generates 3 unique music tracks using the Web Audio API.
 * Each track has 7 stems rendered into loopable AudioBuffers.
 *
 * Track 1 ("Whispers of Self-Evolution") remains file-based via Phaser.
 * Tracks 2–4 are procedurally generated here.
 */

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.stems = {};      // { trackId: { stemName: { buffer, source, gain } } }
        this.isReady = false;
        this.sampleRate = 44100;
    }

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 1.0;
        this.masterGain.connect(this.ctx.destination);
        this._generateAllTracks();
        this.isReady = true;
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // ── Track Definitions ──

    _generateAllTracks() {
        this._generateTrack('track2', {
            name: 'Digital Dreamscape',
            bpm: 110,
            bars: 8,
            key: 'Dm',
            baseFreqs: [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 329.63], // D minor scale
            chordProgression: [
                [146.83, 174.61, 220.00],  // Dm
                [130.81, 164.81, 196.00],  // C
                [116.54, 146.83, 174.61],  // Bb
                [130.81, 164.81, 196.00],  // C
            ],
            padFreqs: [73.42, 87.31, 110.00],
            leadMelody: [220, 262, 294, 330, 294, 262, 220, 196, 220, 262, 330, 392, 330, 294, 262, 220],
            arpNotes: [220, 330, 440, 330, 262, 392, 330, 262],
            bassNotes: [73.42, 65.41, 58.27, 65.41],
        });

        this._generateTrack('track3', {
            name: 'Neon Pulse',
            bpm: 90,
            bars: 8,
            key: 'Am',
            baseFreqs: [220.00, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00],
            chordProgression: [
                [220.00, 261.63, 329.63],  // Am
                [196.00, 246.94, 293.66],  // G
                [174.61, 220.00, 261.63],  // F
                [164.81, 196.00, 246.94],  // Em
            ],
            padFreqs: [110.00, 130.81, 164.81],
            leadMelody: [330, 392, 440, 392, 330, 294, 262, 294, 330, 440, 523, 440, 392, 330, 294, 330],
            arpNotes: [330, 440, 523, 440, 392, 523, 440, 392],
            bassNotes: [110.00, 98.00, 87.31, 82.41],
        });

        this._generateTrack('track4', {
            name: 'Circuit Breaker',
            bpm: 140,
            bars: 8,
            key: 'Em',
            baseFreqs: [164.81, 185.00, 196.00, 220.00, 246.94, 261.63, 293.66],
            chordProgression: [
                [164.81, 196.00, 246.94],  // Em
                [146.83, 174.61, 220.00],  // Dm
                [130.81, 164.81, 196.00],  // C
                [146.83, 174.61, 220.00],  // Dm
            ],
            padFreqs: [82.41, 98.00, 123.47],
            leadMelody: [330, 294, 262, 330, 392, 440, 392, 330, 294, 330, 392, 523, 494, 440, 392, 330],
            arpNotes: [330, 494, 659, 494, 392, 659, 494, 392],
            bassNotes: [82.41, 73.42, 65.41, 73.42],
        });
    }

    _generateTrack(trackId, config) {
        const { bpm, bars } = config;
        const beatDuration = 60 / bpm;
        const barDuration = beatDuration * 4;
        const totalDuration = barDuration * bars;
        const totalSamples = Math.ceil(totalDuration * this.sampleRate);

        this.stems[trackId] = {};

        // Generate each stem
        this.stems[trackId].drums = this._createStemNode(this._genDrums(totalSamples, bpm, bars, config));
        this.stems[trackId].bass = this._createStemNode(this._genBass(totalSamples, bpm, bars, config));
        this.stems[trackId].keys = this._createStemNode(this._genKeys(totalSamples, bpm, bars, config));
        this.stems[trackId].lead = this._createStemNode(this._genLead(totalSamples, bpm, bars, config));
        this.stems[trackId].pad = this._createStemNode(this._genPad(totalSamples, bpm, bars, config));
        this.stems[trackId].fx = this._createStemNode(this._genFX(totalSamples, bpm, bars, config));
        this.stems[trackId].arp = this._createStemNode(this._genArp(totalSamples, bpm, bars, config));

        // Generate full mix by summing all stems
        this.stems[trackId].fullMix = this._createStemNode(this._genFullMix(trackId, totalSamples));
    }

    _createStemNode(buffer) {
        return { buffer, source: null, gain: null };
    }

    // ── Stem Generators ──

    _genDrums(totalSamples, bpm, bars, config) {
        const buffer = this.ctx.createBuffer(2, totalSamples, this.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        const beatSamples = Math.floor((60 / bpm) * this.sampleRate);
        const totalBeats = bars * 4;

        for (let beat = 0; beat < totalBeats; beat++) {
            const startSample = beat * beatSamples;

            // Kick on beats 1, 3 (every other beat)
            if (beat % 2 === 0) {
                this._renderKick(left, right, startSample, bpm);
            }

            // Snare on beats 2, 4
            if (beat % 2 === 1) {
                this._renderSnare(left, right, startSample, bpm);
            }

            // Hi-hat on every beat
            this._renderHihat(left, right, startSample, bpm);

            // Off-beat hi-hat (8th notes)
            this._renderHihat(left, right, startSample + Math.floor(beatSamples / 2), bpm, 0.4);

            // Extra 16th note hi-hats for higher BPM tracks
            if (bpm >= 130) {
                this._renderHihat(left, right, startSample + Math.floor(beatSamples / 4), bpm, 0.2);
                this._renderHihat(left, right, startSample + Math.floor(beatSamples * 3 / 4), bpm, 0.2);
            }
        }

        return buffer;
    }

    _renderKick(left, right, start, bpm) {
        const duration = Math.min(Math.floor(0.15 * this.sampleRate), left.length - start);
        for (let i = 0; i < duration && (start + i) < left.length; i++) {
            const t = i / this.sampleRate;
            const freq = 150 * Math.exp(-t * 30) + 40;
            const env = Math.exp(-t * 12);
            const val = Math.sin(2 * Math.PI * freq * t) * env * 0.7;
            left[start + i] += val;
            right[start + i] += val;
        }
    }

    _renderSnare(left, right, start, bpm) {
        const duration = Math.min(Math.floor(0.1 * this.sampleRate), left.length - start);
        for (let i = 0; i < duration && (start + i) < left.length; i++) {
            const t = i / this.sampleRate;
            const env = Math.exp(-t * 18);
            const noise = (Math.random() * 2 - 1) * 0.35;
            const tone = Math.sin(2 * Math.PI * 200 * t) * 0.25;
            const val = (noise + tone) * env;
            left[start + i] += val;
            right[start + i] += val;
        }
    }

    _renderHihat(left, right, start, bpm, volume = 0.6) {
        const duration = Math.min(Math.floor(0.04 * this.sampleRate), left.length - start);
        for (let i = 0; i < duration && (start + i) < left.length; i++) {
            const t = i / this.sampleRate;
            const env = Math.exp(-t * 60);
            const noise = (Math.random() * 2 - 1) * 0.15 * volume;
            const val = noise * env;
            left[start + i] += val;
            right[start + i] += val;
        }
    }

    _genBass(totalSamples, bpm, bars, config) {
        const buffer = this.ctx.createBuffer(2, totalSamples, this.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        const barSamples = Math.floor((240 / bpm) * this.sampleRate);
        const { bassNotes } = config;

        for (let bar = 0; bar < bars; bar++) {
            const noteFreq = bassNotes[bar % bassNotes.length];
            const barStart = bar * barSamples;
            const beatSamples = barSamples / 4;

            // Play bass note on beats 1 and 3 with slight variation
            for (let beat = 0; beat < 4; beat++) {
                const noteStart = barStart + Math.floor(beat * beatSamples);
                const noteDur = Math.floor(beatSamples * 0.8);
                const freq = (beat % 2 === 0) ? noteFreq : noteFreq * 1.5;

                for (let i = 0; i < noteDur && (noteStart + i) < totalSamples; i++) {
                    const t = i / this.sampleRate;
                    const env = Math.min(1, t * 20) * Math.exp(-t * 3);
                    // Sawtooth approximation
                    let val = 0;
                    for (let h = 1; h <= 6; h++) {
                        val += Math.sin(2 * Math.PI * freq * h * t) / h * (h % 2 === 0 ? -1 : 1);
                    }
                    val = val * 0.15 * env;
                    left[noteStart + i] += val;
                    right[noteStart + i] += val;
                }
            }
        }

        return buffer;
    }

    _genKeys(totalSamples, bpm, bars, config) {
        const buffer = this.ctx.createBuffer(2, totalSamples, this.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        const barSamples = Math.floor((240 / bpm) * this.sampleRate);
        const { chordProgression } = config;

        for (let bar = 0; bar < bars; bar++) {
            const chord = chordProgression[bar % chordProgression.length];
            const barStart = bar * barSamples;

            // Stab chords on beat 1 and the "and" of beat 2
            const offsets = [0, 0.375, 0.5, 0.875]; // rhythmic pattern
            offsets.forEach((offset, idx) => {
                const noteStart = barStart + Math.floor(offset * barSamples);
                const noteDur = Math.floor(barSamples * 0.12);

                chord.forEach((freq, ci) => {
                    // Double the frequency for brightness
                    const f = freq * 2;
                    for (let i = 0; i < noteDur && (noteStart + i) < totalSamples; i++) {
                        const t = i / this.sampleRate;
                        const env = Math.exp(-t * 10);
                        const val = Math.sin(2 * Math.PI * f * t) * 0.08 * env;
                        // Slight stereo spread
                        left[noteStart + i] += val * (1 - ci * 0.15);
                        right[noteStart + i] += val * (0.7 + ci * 0.15);
                    }
                });
            });
        }

        return buffer;
    }

    _genLead(totalSamples, bpm, bars, config) {
        const buffer = this.ctx.createBuffer(2, totalSamples, this.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        const beatSamples = Math.floor((60 / bpm) * this.sampleRate);
        const { leadMelody } = config;
        const totalBeats = bars * 4;

        // Lead plays a melody, 2 notes per beat (8th notes)
        for (let step = 0; step < totalBeats * 2; step++) {
            const noteIdx = step % leadMelody.length;
            const freq = leadMelody[noteIdx];
            const noteStart = Math.floor(step * beatSamples / 2);
            const noteDur = Math.floor(beatSamples * 0.4);

            // Only play on certain steps for melodic interest (not every step)
            if (step % 4 === 0 || step % 4 === 1 || step % 4 === 3) {
                for (let i = 0; i < noteDur && (noteStart + i) < totalSamples; i++) {
                    const t = i / this.sampleRate;
                    const env = Math.min(1, t * 40) * Math.exp(-t * 5);
                    // Square-ish wave with slight detune for richness
                    const val = (
                        Math.sin(2 * Math.PI * freq * t) * 0.5 +
                        Math.sin(2 * Math.PI * freq * 1.003 * t) * 0.3 +
                        Math.sin(2 * Math.PI * freq * 2 * t) * 0.15
                    ) * 0.1 * env;

                    // Auto-pan
                    const pan = Math.sin(step * 0.4) * 0.3;
                    left[noteStart + i] += val * (0.5 + pan);
                    right[noteStart + i] += val * (0.5 - pan);
                }
            }
        }

        return buffer;
    }

    _genPad(totalSamples, bpm, bars, config) {
        const buffer = this.ctx.createBuffer(2, totalSamples, this.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        const barSamples = Math.floor((240 / bpm) * this.sampleRate);
        const { padFreqs, chordProgression } = config;

        for (let bar = 0; bar < bars; bar++) {
            const chord = chordProgression[bar % chordProgression.length];
            const barStart = bar * barSamples;

            chord.forEach((freq, ci) => {
                // Lower octave for pads
                const f = freq * 0.5;
                for (let i = 0; i < barSamples && (barStart + i) < totalSamples; i++) {
                    const t = i / this.sampleRate;
                    const globalT = (barStart + i) / this.sampleRate;
                    // Slow attack and release
                    const attack = Math.min(1, t * 2);
                    const release = Math.min(1, (barSamples - i) / (this.sampleRate * 0.3));
                    const env = attack * release;
                    // Detuned sine waves for warmth
                    const val = (
                        Math.sin(2 * Math.PI * f * globalT) * 0.4 +
                        Math.sin(2 * Math.PI * f * 1.005 * globalT) * 0.3 +
                        Math.sin(2 * Math.PI * f * 0.998 * globalT) * 0.3
                    ) * 0.07 * env;

                    // Wide stereo
                    left[barStart + i] += val * (0.7 + ci * 0.1);
                    right[barStart + i] += val * (0.5 - ci * 0.05);
                }
            });
        }

        return buffer;
    }

    _genFX(totalSamples, bpm, bars, config) {
        const buffer = this.ctx.createBuffer(2, totalSamples, this.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        const barSamples = Math.floor((240 / bpm) * this.sampleRate);

        for (let bar = 0; bar < bars; bar++) {
            const barStart = bar * barSamples;

            // Riser every 2 bars
            if (bar % 2 === 1) {
                const riserDur = Math.floor(barSamples * 0.8);
                for (let i = 0; i < riserDur && (barStart + i) < totalSamples; i++) {
                    const t = i / this.sampleRate;
                    const progress = i / riserDur;
                    const freq = 200 + progress * 2000;
                    const env = progress * 0.12;
                    const noise = (Math.random() * 2 - 1) * 0.03 * progress;
                    const val = Math.sin(2 * Math.PI * freq * t) * env + noise;
                    left[barStart + i] += val * (0.5 + Math.sin(progress * 6) * 0.3);
                    right[barStart + i] += val * (0.5 - Math.sin(progress * 6) * 0.3);
                }
            }

            // Impact/crash on bar 1, 5
            if (bar % 4 === 0) {
                const crashDur = Math.floor(barSamples * 0.4);
                for (let i = 0; i < crashDur && (barStart + i) < totalSamples; i++) {
                    const t = i / this.sampleRate;
                    const env = Math.exp(-t * 3);
                    const noise = (Math.random() * 2 - 1) * 0.08 * env;
                    left[barStart + i] += noise;
                    right[barStart + i] += noise * 0.9;
                }
            }

            // Blip/glitch sounds on bar 3, 7
            if (bar % 4 === 2) {
                for (let blip = 0; blip < 4; blip++) {
                    const blipStart = barStart + Math.floor(barSamples * blip / 4);
                    const blipDur = Math.floor(0.02 * this.sampleRate);
                    const blipFreq = 800 + blip * 400;
                    for (let i = 0; i < blipDur && (blipStart + i) < totalSamples; i++) {
                        const t = i / this.sampleRate;
                        const env = Math.exp(-t * 80);
                        const val = Math.sin(2 * Math.PI * blipFreq * t) * 0.06 * env;
                        left[blipStart + i] += val;
                        right[blipStart + i] += val;
                    }
                }
            }
        }

        return buffer;
    }

    _genArp(totalSamples, bpm, bars, config) {
        const buffer = this.ctx.createBuffer(2, totalSamples, this.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        const sixteenthSamples = Math.floor((15 / bpm) * this.sampleRate);
        const { arpNotes } = config;
        const totalSixteenths = bars * 16;

        for (let step = 0; step < totalSixteenths; step++) {
            const noteIdx = step % arpNotes.length;
            const freq = arpNotes[noteIdx];
            const noteStart = step * sixteenthSamples;
            const noteDur = Math.floor(sixteenthSamples * 0.6);

            for (let i = 0; i < noteDur && (noteStart + i) < totalSamples; i++) {
                const t = i / this.sampleRate;
                const env = Math.min(1, t * 80) * Math.exp(-t * 12);
                // Bright square-ish tone
                const val = (
                    Math.sin(2 * Math.PI * freq * t) +
                    Math.sin(2 * Math.PI * freq * 3 * t) * 0.3 +
                    Math.sin(2 * Math.PI * freq * 5 * t) * 0.1
                ) * 0.06 * env;

                // Ping-pong panning
                const pan = (step % 2 === 0) ? 0.3 : -0.3;
                left[noteStart + i] += val * (0.5 + pan);
                right[noteStart + i] += val * (0.5 - pan);
            }
        }

        return buffer;
    }

    _genFullMix(trackId, totalSamples) {
        const buffer = this.ctx.createBuffer(2, totalSamples, this.sampleRate);
        const left = buffer.getChannelData(0);
        const right = buffer.getChannelData(1);
        const stemNames = ['drums', 'bass', 'keys', 'lead', 'pad', 'fx', 'arp'];

        stemNames.forEach(name => {
            const stemBuf = this.stems[trackId][name].buffer;
            const sLeft = stemBuf.getChannelData(0);
            const sRight = stemBuf.getChannelData(1);
            for (let i = 0; i < totalSamples; i++) {
                left[i] += sLeft[i];
                right[i] += sRight[i];
            }
        });

        // Soft clip to prevent clipping
        for (let i = 0; i < totalSamples; i++) {
            left[i] = Math.tanh(left[i]);
            right[i] = Math.tanh(right[i]);
        }

        return buffer;
    }

    // ── Playback API ──

    /**
     * Play a specific stem of a track.
     * @param {string} trackId - e.g. 'track2'
     * @param {string} stemName - e.g. 'drums', 'bass', 'keys', 'lead', 'pad', 'fx', 'arp', 'fullMix'
     * @param {number} volume - 0 to 1
     * @returns {object} stem reference for later control
     */
    playStem(trackId, stemName, volume = 0.7) {
        this.resume();
        const stem = this.stems[trackId]?.[stemName];
        if (!stem) return null;

        // Stop if already playing
        this.stopStem(trackId, stemName);

        const source = this.ctx.createBufferSource();
        source.buffer = stem.buffer;
        source.loop = true;

        const gainNode = this.ctx.createGain();
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this.masterGain);
        source.start(0);

        stem.source = source;
        stem.gain = gainNode;
        return stem;
    }

    /**
     * Play all stems of a track simultaneously.
     * Returns a map of stem references.
     */
    playAllStems(trackId, stemVolumes = {}) {
        this.resume();
        const track = this.stems[trackId];
        if (!track) return {};
        const refs = {};
        const stemNames = ['drums', 'bass', 'keys', 'lead', 'pad', 'fx', 'arp'];
        stemNames.forEach(name => {
            const vol = stemVolumes[name] !== undefined ? stemVolumes[name] : 0.7;
            refs[name] = this.playStem(trackId, name, vol);
        });
        return refs;
    }

    stopStem(trackId, stemName) {
        const stem = this.stems[trackId]?.[stemName];
        if (!stem || !stem.source) return;
        try {
            stem.source.stop();
        } catch(e) { /* already stopped */ }
        stem.source = null;
        stem.gain = null;
    }

    stopTrack(trackId) {
        const track = this.stems[trackId];
        if (!track) return;
        Object.keys(track).forEach(stemName => this.stopStem(trackId, stemName));
    }

    stopAll() {
        Object.keys(this.stems).forEach(trackId => this.stopTrack(trackId));
    }

    setStemVolume(trackId, stemName, volume) {
        const stem = this.stems[trackId]?.[stemName];
        if (stem?.gain) {
            stem.gain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05);
        }
    }

    /**
     * Fade a stem's volume over time.
     */
    fadeStemVolume(trackId, stemName, targetVolume, durationMs = 1500) {
        const stem = this.stems[trackId]?.[stemName];
        if (stem?.gain) {
            stem.gain.gain.linearRampToValueAtTime(
                targetVolume,
                this.ctx.currentTime + durationMs / 1000
            );
        }
    }

    setMasterMute(muted) {
        if (this.masterGain) {
            this.masterGain.gain.value = muted ? 0 : 1;
        }
    }

    /**
     * Get stem metadata for a track.
     * Used by GameScene to know which stems are available.
     */
    getTrackStems(trackId) {
        return [
            { key: `${trackId}_drums`, label: 'DRUMS', engineStem: 'drums' },
            { key: `${trackId}_bass`, label: 'BASS', engineStem: 'bass' },
            { key: `${trackId}_keys`, label: 'KEYS', engineStem: 'keys' },
            { key: `${trackId}_lead`, label: 'LEAD', engineStem: 'lead' },
            { key: `${trackId}_pad`, label: 'PAD', engineStem: 'pad' },
            { key: `${trackId}_fx`, label: 'FX', engineStem: 'fx' },
            { key: `${trackId}_arp`, label: 'ARP', engineStem: 'arp' },
        ];
    }
}

// Singleton
const audioEngine = new AudioEngine();
export default audioEngine;
