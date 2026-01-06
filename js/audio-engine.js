/* ========================================
   AUDIO ENGINE - Tone.js
   Handles all drum sounds and playback
   ======================================== */

/*
 * EDUCATIONAL ARCHITECTURE:
 *
 * This audio engine provides THREE modes of sound playback:
 * 1. DIRECT PLAYBACK - User clicks/taps pads (interactive practice)
 * 2. SEQUENCED PLAYBACK - Programmed demonstrations (listen mode)
 * 3. METRONOME - Practice aid for maintaining steady tempo
 *
 * WHY Tone.js INSTEAD OF RAW WEB AUDIO API?
 * - Tone.Transport provides sample-accurate timing
 * - Built-in Sequence for patterns
 * - Easier tempo control (essential for practice)
 * - Better mobile support
 */

class AudioEngine {
    constructor() {
        this.initialized = false;
        this.currentTempo = 80; // BPM - ABRSM Grade 1 standard tempo

        // Drum samples will be loaded here
        // EDUCATIONAL NOTE: Real samples should be provided by the user
        // For now, we'll use synthesized sounds as fallback
        this.players = null;
        this.useFallbackSounds = true; // Set to false when real samples are available

        // Metronome
        this.metronome = null;
        this.metronomeEnabled = false;

        // Sequencer for demonstrations
        this.currentSequence = null;
        this.isPlaying = false;

        // Track if Tone.js has been started (required by browser audio policies)
        this.audioContextStarted = false;
    }

    /**
     * Initialize the audio engine
     * MUST be called after user interaction (browser requirement)
     */
    async initialize() {
        if (this.initialized) return;

        try {
            // Start Tone.js audio context
            await Tone.start();
            this.audioContextStarted = true;
            console.log('Audio engine initialized');

            // Set initial tempo
            Tone.Transport.bpm.value = this.currentTempo;

            // Create fallback synth sounds (until real samples are loaded)
            this.createFallbackSounds();

            // Create metronome
            this.createMetronome();

            this.initialized = true;
        } catch (error) {
            console.error('Failed to initialize audio engine:', error);
        }
    }

    /**
     * Create synthesized drum sounds as fallback
     * EDUCATIONAL NOTE: These are basic sounds. Real drum samples sound much better!
     * R/L DIFFERENTIATION: Right hand = higher pitch, Left hand = slightly lower
     */
    createFallbackSounds() {
        // RIGHT HAND Snare: Short, bright, high-pitched (original)
        this.snareRightSynth = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 4,
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.001,
                decay: 0.2,
                sustain: 0,
                release: 0.2
            }
        }).toDestination();

        // LEFT HAND Snare: Slightly lower pitch for differentiation
        this.snareLeftSynth = new Tone.MembraneSynth({
            pitchDecay: 0.05,
            octaves: 3.8,  // Slightly lower
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.001,
                decay: 0.2,
                sustain: 0,
                release: 0.2
            }
        }).toDestination();

        // Bass: Low, punchy, short decay (no L/R needed for foot)
        this.bassSynth = new Tone.MembraneSynth({
            pitchDecay: 0.08,
            octaves: 2,
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.001,
                decay: 0.3,
                sustain: 0,
                release: 0.3
            }
        }).toDestination();

        // Hi-hat: High-pitched noise burst (no L/R needed)
        this.hihatSynth = new Tone.MetalSynth({
            frequency: 300,
            envelope: {
                attack: 0.001,
                decay: 0.1,
                release: 0.05
            },
            harmonicity: 5.1,
            modulationIndex: 32,
            resonance: 4000,
            octaves: 1.5
        }).toDestination();

        // Tom: Mid-low, resonating sound (Grade 2)
        this.tomSynth = new Tone.MembraneSynth({
            pitchDecay: 0.1,
            octaves: 3,
            oscillator: { type: 'sine' },
            envelope: {
                attack: 0.001,
                decay: 0.5,
                sustain: 0,
                release: 0.5
            }
        }).toDestination();

        // Crash: Explosive, long decay metal sound (Grade 2)
        this.crashSynth = new Tone.MetalSynth({
            frequency: 200,
            envelope: {
                attack: 0.005,
                decay: 1.0,
                release: 0.5
            },
            harmonicity: 6.5,
            modulationIndex: 40,
            resonance: 6000,
            octaves: 2.5
        }).toDestination();

        console.log('Fallback synth sounds created (R/L, Tom, Crash enabled)');
    }

    /**
     * Load real drum samples (optional - user uploads later)
     * @param {Object} samplePaths - { snare: 'path', bass: 'path', hihat: 'path' }
     */
    async loadSamples(samplePaths) {
        try {
            this.players = new Tone.Players({
                snare: samplePaths.snare,
                bass: samplePaths.bass,
                hihat: samplePaths.hihat
            }).toDestination();

            await Tone.loaded();
            this.useFallbackSounds = false;
            console.log('Real drum samples loaded');
        } catch (error) {
            console.error('Failed to load samples, using fallback sounds:', error);
            this.useFallbackSounds = true;
        }
    }

    /**
     * Play a drum sound immediately
     * @param {string} drumType - 'snare', 'bass', 'hihat', 'snare-right', 'snare-left'
     * @param {number} velocity - 0.0 to 1.0 (volume control for dynamics)
     * @param {string} hand - 'right' or 'left' (optional, for sticking patterns)
     */
    playDrum(drumType, velocity = 1.0, hand = null) {
        if (!this.audioContextStarted) {
            console.warn('Audio not started. User interaction required first.');
            return;
        }

        // EDUCATIONAL NOTE: Velocity control teaches dynamics (loud vs soft)
        // ABRSM Grade 1 requires understanding of f (forte) and p (piano)
        const volume = this.velocityToVolume(velocity);

        if (this.useFallbackSounds) {
            // Use synthesized sounds with R/L differentiation
            switch (drumType) {
                case 'snare':
                case 'snare-right':
                    this.snareRightSynth.volume.value = volume;
                    this.snareRightSynth.triggerAttackRelease('C3', '16n');
                    break;
                case 'snare-left':
                    this.snareLeftSynth.volume.value = volume;
                    this.snareLeftSynth.triggerAttackRelease('B2', '16n');  // Slightly lower note
                    break;
                case 'bass':
                    this.bassSynth.volume.value = volume;
                    this.bassSynth.triggerAttackRelease('C1', '8n');
                    break;
                case 'hihat':
                    this.hihatSynth.volume.value = volume;
                    this.hihatSynth.triggerAttackRelease('16n');
                    break;
                case 'tom':
                    this.tomSynth.volume.value = volume;
                    this.tomSynth.triggerAttackRelease('A2', '4n');
                    break;
                case 'crash':
                    this.crashSynth.volume.value = volume;
                    this.crashSynth.triggerAttackRelease('1n');
                    break;
            }

            // Auto-determine hand if not specified for snare
            if (drumType === 'snare' && hand) {
                if (hand === 'left') {
                    this.snareLeftSynth.volume.value = volume;
                    this.snareLeftSynth.triggerAttackRelease('B2', '16n');
                } else {
                    this.snareRightSynth.volume.value = volume;
                    this.snareRightSynth.triggerAttackRelease('C3', '16n');
                }
            }
        } else {
            // Use real samples (would need separate R/L samples)
            if (this.players && this.players.has(drumType)) {
                this.players.player(drumType).volume.value = volume;
                this.players.player(drumType).start();
            }
        }
    }

    /**
     * Convert velocity (0-1) to volume in decibels
     * EDUCATIONAL NOTE: Human hearing is logarithmic, not linear
     */
    velocityToVolume(velocity) {
        // Map 0-1 to -20dB to 0dB (reasonable dynamic range)
        const minDb = -20;
        const maxDb = 0;
        return minDb + (velocity * (maxDb - minDb));
    }

    /**
     * Create metronome for practice
     * EDUCATIONAL NOTE: Metronome is ESSENTIAL for developing steady pulse
     */
    createMetronome() {
        // Simple metronome synth (high-pitched click)
        const metronomeClick = new Tone.MembraneSynth({
            pitchDecay: 0.008,
            envelope: {
                attack: 0.001,
                decay: 0.05,
                sustain: 0,
                release: 0.05
            }
        }).toDestination();

        // Create a repeating event on every quarter note
        this.metronome = new Tone.Loop((time) => {
            metronomeClick.triggerAttackRelease('C5', '32n', time);
        }, '4n'); // Quarter note intervals
    }

    /**
     * Toggle metronome on/off
     */
    toggleMetronome() {
        if (!this.metronome) return;

        if (this.metronomeEnabled) {
            this.metronome.stop();
            this.metronomeEnabled = false;
            Tone.Transport.stop();
        } else {
            Tone.Transport.start();
            this.metronome.start(0);
            this.metronomeEnabled = true;
        }

        return this.metronomeEnabled;
    }

    /**
     * Set tempo (BPM)
     * @param {number} bpm - Beats per minute (typically 60-120 for beginners)
     */
    setTempo(bpm) {
        this.currentTempo = bpm;
        Tone.Transport.bpm.value = bpm;
    }

    /**
     * Play a rhythmic pattern (for demonstration mode)
     * @param {Array} pattern - Array of { drum: 'snare', time: '0:0:0', velocity: 1.0 }
     * @param {number} tempo - Optional tempo override
     */
    playPattern(pattern, tempo = null, loop = true) {
        // Stop any currently playing sequence
        this.stopPattern();

        if (tempo) {
            this.setTempo(tempo);
        }

        // EDUCATIONAL NOTE: Tone.Part allows scheduling notes at specific times
        // This is perfect for teaching rhythmic patterns
        this.currentSequence = new Tone.Part((time, event) => {
            this.playDrum(event.drum, event.velocity);
        }, pattern);

        this.currentSequence.start(0);
        this.currentSequence.loop = loop;  // Repeat for practice if loop is true

        // If not looping, we need to know when it ends
        if (!loop) {
            // Find the last event time to determine duration
            const lastEvent = pattern.reduce((prev, curr) => {
                const prevTime = Tone.Time(prev.time).toSeconds();
                const currTime = Tone.Time(curr.time).toSeconds();
                return currTime > prevTime ? curr : prev;
            });

            const duration = Tone.Time(lastEvent.time).toSeconds() + 1; // Add 1s buffer

            this.currentSequence.loop = false;

            // Set a timeout to update isPlaying state when done
            setTimeout(() => {
                if (this.currentSequence && !this.currentSequence.loop) {
                    this.isPlaying = false;
                    console.log('Demonstration finished');
                }
            }, duration * 1000 * (60 / this.currentTempo));
        }

        Tone.Transport.start();
        this.isPlaying = true;
    }

    /**
     * Stop the currently playing pattern
     */
    stopPattern() {
        if (this.currentSequence) {
            this.currentSequence.stop();
            this.currentSequence.dispose();
            this.currentSequence = null;
        }

        if (!this.metronomeEnabled) {
            Tone.Transport.stop();
        }

        this.isPlaying = false;
    }

    /**
     * Play a specific exercise demonstration
     * @param {string} exerciseType - 'single-stroke', 'double-stroke', etc.
     * @param {number} tempo - BPM
     */
    playExercise(exerciseType, tempo = 80, loop = true) {
        // Pattern definitions
        const patterns = {
            // Grade 1
            'single-stroke': this.createSingleStrokePattern(),
            'double-stroke': this.createDoubleStrokePattern(),
            'paradiddle': this.createParadiddlePattern(),
            'quarter-notes': this.createQuarterNotesPattern(),
            'eighth-notes': this.createEighthNotesPattern(),
            'rock-beat': this.createRockBeatPattern(),
            'waltz': this.createWaltzPattern(),
            'quarter-eighth': this.createQuarterEighthPattern(),
            // Grade 2
            'flam': this.createFlamPattern(),
            'triplets': this.createTripletsPattern(),
            'sixteenth-notes': this.createSixteenthNotesPattern(),
            'double-paradiddle': this.createDoubleParadiddlePattern(),
            'drag': this.createDragPattern(),
            'accents': this.createAccentsPattern(),
            'sixteenth-coord': this.createSixteenthCoordPattern(),
            'syncopation': this.createSyncopationPattern()
        };

        const pattern = patterns[exerciseType];
        if (pattern) {
            this.playPattern(pattern, tempo, loop);
        } else {
            console.error(`Unknown exercise: ${exerciseType}`);
        }
    }

    /**
     * Pattern generators
     * EDUCATIONAL NOTE: These patterns match ABRSM Grade 1 requirements
     */

    createSingleStrokePattern() {
        // R L R L - Alternating hands with audible differentiation
        // TEACHING: Focus on even spacing and equal volume, but distinct R/L sounds
        return [
            { drum: 'snare-right', time: '0:0:0', velocity: 1.0 },  // R - Beat 1
            { drum: 'snare-left', time: '0:0:2', velocity: 1.0 },   // L - & of 1
            { drum: 'snare-right', time: '0:1:0', velocity: 1.0 },  // R - Beat 2
            { drum: 'snare-left', time: '0:1:2', velocity: 1.0 },   // L - & of 2
            { drum: 'snare-right', time: '0:2:0', velocity: 1.0 },  // R - Beat 3
            { drum: 'snare-left', time: '0:2:2', velocity: 1.0 },   // L - & of 3
            { drum: 'snare-right', time: '0:3:0', velocity: 1.0 },  // R - Beat 4
            { drum: 'snare-left', time: '0:3:2', velocity: 1.0 }    // L - & of 4
        ];
    }

    createDoubleStrokePattern() {
        // RR LL - Double strokes with R/L differentiation
        // TEACHING: Second stroke uses stick rebound
        return [
            { drum: 'snare-right', time: '0:0:0', velocity: 1.0 },   // R
            { drum: 'snare-right', time: '0:0:1', velocity: 0.9 },   // R (rebound)
            { drum: 'snare-left', time: '0:0:2', velocity: 1.0 },    // L
            { drum: 'snare-left', time: '0:0:3', velocity: 0.9 },    // L (rebound)
            { drum: 'snare-right', time: '0:1:0', velocity: 1.0 },   // R
            { drum: 'snare-right', time: '0:1:1', velocity: 0.9 },   // R (rebound)
            { drum: 'snare-left', time: '0:1:2', velocity: 1.0 },    // L
            { drum: 'snare-left', time: '0:1:3', velocity: 0.9 }     // L (rebound)
        ];
    }

    createParadiddlePattern() {
        // R L R R  L R L L - Classic paradiddle with R/L differentiation
        // TEACHING: Combination of singles and doubles
        return [
            { drum: 'snare-right', time: '0:0:0', velocity: 1.0 },   // R
            { drum: 'snare-left', time: '0:0:2', velocity: 1.0 },    // L
            { drum: 'snare-right', time: '0:1:0', velocity: 1.0 },   // R
            { drum: 'snare-right', time: '0:1:2', velocity: 1.0 },   // R
            { drum: 'snare-left', time: '0:2:0', velocity: 1.0 },    // L
            { drum: 'snare-right', time: '0:2:2', velocity: 1.0 },   // R
            { drum: 'snare-left', time: '0:3:0', velocity: 1.0 },    // L
            { drum: 'snare-left', time: '0:3:2', velocity: 1.0 }     // L
        ];
    }

    createQuarterNotesPattern() {
        // Four steady beats
        return [
            { drum: 'bass', time: '0:0:0', velocity: 1.0 },
            { drum: 'bass', time: '0:1:0', velocity: 1.0 },
            { drum: 'bass', time: '0:2:0', velocity: 1.0 },
            { drum: 'bass', time: '0:3:0', velocity: 1.0 }
        ];
    }

    createEighthNotesPattern() {
        // Eight steady beats (twice as fast as quarters)
        const pattern = [];
        for (let i = 0; i < 8; i++) {
            const beat = Math.floor(i / 2);
            const subdivision = (i % 2) * 2;
            pattern.push({
                drum: 'hihat',
                time: `0:${beat}:${subdivision}`,
                velocity: 1.0
            });
        }
        return pattern;
    }

    createRockBeatPattern() {
        // Basic rock: Bass on 1 & 3, Snare on 2 & 4, Hi-hat on all eighths
        // TEACHING: Multi-limb coordination
        const pattern = [];

        // Hi-hat eighth notes
        for (let i = 0; i < 8; i++) {
            const beat = Math.floor(i / 2);
            const subdivision = (i % 2) * 2;
            pattern.push({
                drum: 'hihat',
                time: `0:${beat}:${subdivision}`,
                velocity: 0.8
            });
        }

        // Bass on 1 and 3
        pattern.push({ drum: 'bass', time: '0:0:0', velocity: 1.0 });
        pattern.push({ drum: 'bass', time: '0:2:0', velocity: 1.0 });

        // Snare on 2 and 4 (backbeat)
        pattern.push({ drum: 'snare', time: '0:1:0', velocity: 1.0 });
        pattern.push({ drum: 'snare', time: '0:3:0', velocity: 1.0 });

        return pattern;
    }

    createWaltzPattern() {
        // 3/4 time - three beats per measure
        return [
            { drum: 'bass', time: '0:0:0', velocity: 1.0 },  // Beat 1 (emphasized)
            { drum: 'snare', time: '0:1:0', velocity: 0.8 }, // Beat 2
            { drum: 'snare', time: '0:2:0', velocity: 0.8 }  // Beat 3
        ];
    }

    createQuarterEighthPattern() {
        // Transition pattern: 2 bars quarters, 2 bars eighths
        const pattern = [];

        // Bar 1-2: Quarter notes
        for (let i = 0; i < 4; i++) {
            pattern.push({ drum: 'snare', time: `0:${i}:0`, velocity: 1.0 });
        }

        // Bar 3-4: Eighth notes (would be in next measure in real music)
        // For demo purposes, using beats 0-3 with subdivisions
        for (let i = 0; i < 8; i++) {
            const beat = Math.floor(i / 2);
            const subdivision = (i % 2) * 2;
            pattern.push({
                drum: 'bass',
                time: `1:${beat}:${subdivision}`,
                velocity: 0.9
            });
        }

        return pattern;
    }

    // ========================================
    // GRADE 2 PATTERNS
    // ========================================

    createFlamPattern() {
        // Flam: Grace note (soft) + main stroke (loud) with R/L alternation
        // TEACHING: Two notes almost simultaneous but not quite
        // Pattern: L-R, R-L, L-R, R-L (grace-main pairs alternate)
        const pattern = [];

        for (let beat = 0; beat < 4; beat++) {
            const isEven = beat % 2 === 0;

            if (isEven) {
                // L-R flam
                pattern.push({
                    drum: 'snare-left',
                    time: `0:${beat}:0`,
                    velocity: 0.4  // Soft grace note (left)
                });
                pattern.push({
                    drum: 'snare-right',
                    time: `0:${beat}:0.1`,
                    velocity: 1.0  // Strong main note (right)
                });
            } else {
                // R-L flam
                pattern.push({
                    drum: 'snare-right',
                    time: `0:${beat}:0`,
                    velocity: 0.4  // Soft grace note (right)
                });
                pattern.push({
                    drum: 'snare-left',
                    time: `0:${beat}:0.1`,
                    velocity: 1.0  // Strong main note (left)
                });
            }
        }

        return pattern;
    }

    createTripletsPattern() {
        // Triplets: Three notes per beat (3:2 ratio) with R/L sticking
        // TEACHING: Divide each beat into three equal parts
        // Pattern: RLR LRL RLR LRL (alternating starting hand)
        const pattern = [];

        for (let beat = 0; beat < 4; beat++) {
            const isEven = beat % 2 === 0;

            if (isEven) {
                // R L R
                pattern.push({ drum: 'snare-right', time: `0:${beat}:0`, velocity: 1.0 });
                pattern.push({ drum: 'snare-left', time: `0:${beat}:1.33`, velocity: 0.9 });
                pattern.push({ drum: 'snare-right', time: `0:${beat}:2.66`, velocity: 0.9 });
            } else {
                // L R L
                pattern.push({ drum: 'snare-left', time: `0:${beat}:0`, velocity: 1.0 });
                pattern.push({ drum: 'snare-right', time: `0:${beat}:1.33`, velocity: 0.9 });
                pattern.push({ drum: 'snare-left', time: `0:${beat}:2.66`, velocity: 0.9 });
            }
        }

        return pattern;
    }

    createSixteenthNotesPattern() {
        // Sixteenth notes: Four notes per beat
        // TEACHING: Fast subdivision, twice as fast as eighths
        const pattern = [];

        for (let i = 0; i < 16; i++) {
            const beat = Math.floor(i / 4);
            const subdivision = (i % 4);
            pattern.push({
                drum: 'hihat',
                time: `0:${beat}:${subdivision}`,
                velocity: i % 4 === 0 ? 1.0 : 0.8  // Accent first of each group
            });
        }

        return pattern;
    }

    createDoubleParadiddlePattern() {
        // Double Paradiddle: R L R L R R  L R L R L L
        // TEACHING: Extension of paradiddle with 6-note grouping
        // Pattern: RLRLRR LRLRLL
        const pattern = [];
        const sticking = [
            { drum: 'snare-right', time: '0:0:0', velocity: 1.0 },   // R
            { drum: 'snare-left', time: '0:0:2', velocity: 1.0 },    // L
            { drum: 'snare-right', time: '0:1:0', velocity: 1.0 },   // R
            { drum: 'snare-left', time: '0:1:2', velocity: 1.0 },    // L
            { drum: 'snare-right', time: '0:2:0', velocity: 1.0 },   // R
            { drum: 'snare-right', time: '0:2:2', velocity: 1.0 },   // R
            { drum: 'snare-left', time: '0:3:0', velocity: 1.0 },    // L
            { drum: 'snare-right', time: '0:3:2', velocity: 1.0 },   // R
            { drum: 'snare-left', time: '1:0:0', velocity: 1.0 },    // L
            { drum: 'snare-right', time: '1:0:2', velocity: 1.0 },   // R
            { drum: 'snare-left', time: '1:1:0', velocity: 1.0 },    // L
            { drum: 'snare-left', time: '1:1:2', velocity: 1.0 }     // L
        ];
        return sticking;
    }

    createDragPattern() {
        // Drag/Ruff: LL-R RR-L (buzz/double grace notes before main stroke)
        // TEACHING: Two grace notes (quick bounce) before main stroke
        const pattern = [];

        for (let beat = 0; beat < 4; beat++) {
            const isEven = beat % 2 === 0;

            if (isEven) {
                // LL-R pattern
                pattern.push({ drum: 'snare-left', time: `0:${beat}:0`, velocity: 0.5 });     // Grace 1
                pattern.push({ drum: 'snare-left', time: `0:${beat}:0.3`, velocity: 0.5 });   // Grace 2
                pattern.push({ drum: 'snare-right', time: `0:${beat}:1`, velocity: 1.0 });    // Main
            } else {
                // RR-L pattern
                pattern.push({ drum: 'snare-right', time: `0:${beat}:0`, velocity: 0.5 });    // Grace 1
                pattern.push({ drum: 'snare-right', time: `0:${beat}:0.3`, velocity: 0.5 });  // Grace 2
                pattern.push({ drum: 'snare-left', time: `0:${beat}:1`, velocity: 1.0 });     // Main
            }
        }

        return pattern;
    }

    createAccentsPattern() {
        // Accent Control: R L R L (with accents on 1st and 3rd)
        // TEACHING: Dynamic control - loud vs soft
        const pattern = [
            { drum: 'snare-right', time: '0:0:0', velocity: 1.0 },   // ACCENT
            { drum: 'snare-left', time: '0:0:2', velocity: 0.6 },    // soft
            { drum: 'snare-right', time: '0:1:0', velocity: 1.0 },   // ACCENT
            { drum: 'snare-left', time: '0:1:2', velocity: 0.6 },    // soft
            { drum: 'snare-right', time: '0:2:0', velocity: 1.0 },   // ACCENT
            { drum: 'snare-left', time: '0:2:2', velocity: 0.6 },    // soft
            { drum: 'snare-right', time: '0:3:0', velocity: 1.0 },   // ACCENT
            { drum: 'snare-left', time: '0:3:2', velocity: 0.6 }     // soft
        ];
        return pattern;
    }

    createSixteenthCoordPattern() {
        // 16th Note Coordination: Hands play 16ths, Feet play quarters
        // TEACHING: Independence - different rhythms simultaneously
        const pattern = [];

        // Hands: 16th notes (alternating R L R L...)
        for (let i = 0; i < 16; i++) {
            const beat = Math.floor(i / 4);
            const subdivision = (i % 4);
            const drum = i % 2 === 0 ? 'snare-right' : 'snare-left';
            pattern.push({
                drum: drum,
                time: `0:${beat}:${subdivision}`,
                velocity: 0.8
            });
        }

        // Feet: Quarter notes (bass drum)
        for (let beat = 0; beat < 4; beat++) {
            pattern.push({
                drum: 'bass',
                time: `0:${beat}:0`,
                velocity: 1.0
            });
        }

        return pattern;
    }

    createSyncopationPattern() {
        // Syncopation: Off-beat accents (Grade 2 rhythm concept)
        // TEACHING: Playing strong notes on weak beats (the "&" of beats)
        const pattern = [
            { drum: 'snare', time: '0:0:0', velocity: 0.6 },    // Beat 1 (soft)
            { drum: 'snare', time: '0:0:2', velocity: 1.0 },    // & of 1 (ACCENT)
            { drum: 'snare', time: '0:1:0', velocity: 0.6 },    // Beat 2 (soft)
            { drum: 'snare', time: '0:1:2', velocity: 1.0 },    // & of 2 (ACCENT)
            { drum: 'snare', time: '0:2:0', velocity: 0.6 },    // Beat 3 (soft)
            { drum: 'snare', time: '0:2:2', velocity: 1.0 },    // & of 3 (ACCENT)
            { drum: 'snare', time: '0:3:0', velocity: 0.6 },    // Beat 4 (soft)
            { drum: 'snare', time: '0:3:2', velocity: 1.0 }     // & of 4 (ACCENT)
        ];
        return pattern;
    }

    /**
     * Stop all audio playback (patterns, metronome, transport)
     * CRITICAL: Auto-stop mechanism for clean transitions
     */
    stopAllAudio() {
        // Stop pattern
        this.stopPattern();

        // Stop metronome if running
        if (this.metronomeEnabled && this.metronome) {
            this.metronome.stop();
            this.metronomeEnabled = false;
        }

        // Stop transport
        Tone.Transport.stop();
        Tone.Transport.cancel();  // Clear all scheduled events

        this.isPlaying = false;

        console.log('All audio stopped');
    }

    /**
     * Cleanup
     */
    dispose() {
        this.stopAllAudio();
        if (this.metronome) {
            this.metronome.dispose();
        }
        if (this.players) {
            this.players.dispose();
        }
    }
}

// Export for use in main.js
