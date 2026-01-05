/* ========================================
   RHYTHM VISUALIZER - Matter.js Physics
   Zero-Gravity Rhythm Chamber
   ======================================== */

/*
 * EDUCATIONAL CONCEPT:
 * This visualizer uses physics simulation to make rhythm VISIBLE.
 * In traditional physics engines, objects fall due to gravity.
 * We set gravity = 0 (zero-G) so particles move in straight lines forever.
 *
 * WHY THIS MATTERS FOR LEARNING DRUMS:
 * - Steady rhythm = evenly spaced particles
 * - Rushing (playing too fast) = particles getting closer together
 * - Dragging (playing too slow) = particles spreading apart
 * - Visual patterns help internalize timing without staring at sheet music
 */

class RhythmVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);

        // Set canvas resolution (important for crisp rendering)
        this.setCanvasSize();
        window.addEventListener('resize', () => this.setCanvasSize());

        // Matter.js modules
        const { Engine, Render, World, Bodies, Body, Events } = Matter;

        // Create Matter.js engine with ZERO GRAVITY
        // EDUCATIONAL NOTE: gravity: { x: 0, y: 0 } creates perpetual motion
        this.engine = Engine.create({
            gravity: { x: 0, y: 0 }
        });

        // Create renderer
        this.render = Render.create({
            canvas: this.canvas,
            engine: this.engine,
            options: {
                width: this.canvas.width,
                height: this.canvas.height,
                wireframes: false, // Use filled shapes
                background: 'transparent',
                pixelRatio: window.devicePixelRatio || 1
            }
        });

        // Create boundaries (walls) to contain particles
        this.createBoundaries();

        // Start the engine and renderer
        Engine.run(this.engine);
        Render.run(this.render);

        // Particle configuration
        this.particleConfig = {
            snare: {
                color: '#e74c3c',  // Red
                radius: 15,
                mass: 1,
                label: 'snare'
            },
            bass: {
                color: '#3498db',  // Blue
                radius: 20,        // Larger for "bass" feel
                mass: 1.5,
                label: 'bass'
            },
            hihat: {
                color: '#f39c12',  // Yellow/Orange
                radius: 12,        // Smaller for "hihat" feel
                mass: 0.8,
                label: 'hihat'
            }
        };

        // Particle management
        this.particles = [];
        this.maxParticles = 100; // Prevent performance issues

        // Cleanup old particles periodically
        this.startParticleCleanup();
    }

    /**
     * Set canvas size to match container (responsive)
     */
    setCanvasSize() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        if (this.render) {
            this.render.options.width = rect.width;
            this.render.options.height = rect.height;
            this.render.canvas.width = rect.width;
            this.render.canvas.height = rect.height;

            // Recreate boundaries when canvas resizes
            this.createBoundaries();
        }
    }

    /**
     * Create invisible walls around the canvas
     * Particles bounce off these walls forever (zero gravity = perpetual motion)
     */
    createBoundaries() {
        const { Bodies, World } = Matter;
        const width = this.canvas.width;
        const height = this.canvas.height;
        const wallThickness = 50;

        // Remove old walls if they exist
        if (this.walls) {
            World.remove(this.engine.world, this.walls);
        }

        // Create walls (static bodies)
        this.walls = [
            // Top wall
            Bodies.rectangle(width / 2, -wallThickness / 2, width, wallThickness, {
                isStatic: true,
                restitution: 1.0, // Perfect bounce (no energy loss)
                render: { visible: false }
            }),
            // Bottom wall
            Bodies.rectangle(width / 2, height + wallThickness / 2, width, wallThickness, {
                isStatic: true,
                restitution: 1.0,
                render: { visible: false }
            }),
            // Left wall
            Bodies.rectangle(-wallThickness / 2, height / 2, wallThickness, height, {
                isStatic: true,
                restitution: 1.0,
                render: { visible: false }
            }),
            // Right wall
            Bodies.rectangle(width + wallThickness / 2, height / 2, wallThickness, height, {
                isStatic: true,
                restitution: 1.0,
                render: { visible: false }
            })
        ];

        World.add(this.engine.world, this.walls);
    }

    /**
     * Add a particle when a drum is hit
     * @param {string} drumType - 'snare', 'bass', or 'hihat'
     * @param {number} velocity - Optional: controls initial speed (affects dynamics visualization)
     */
    addParticle(drumType, velocity = 1.0) {
        const { Bodies, World, Body } = Matter;
        const config = this.particleConfig[drumType];

        if (!config) {
            console.error(`Unknown drum type: ${drumType}`);
            return;
        }

        // Spawn position: random location in canvas
        const x = Math.random() * (this.canvas.width - 100) + 50;
        const y = Math.random() * (this.canvas.height - 100) + 50;

        // EDUCATIONAL NOTE: Velocity affects particle speed
        // Louder hits (higher velocity) = faster particles
        // This visualizes DYNAMICS (volume control)
        const baseSpeed = 3;
        const speed = baseSpeed * velocity;

        // Random direction (angle)
        const angle = Math.random() * Math.PI * 2;
        const velocityX = Math.cos(angle) * speed;
        const velocityY = Math.sin(angle) * speed;

        // Create particle
        const particle = Bodies.circle(x, y, config.radius, {
            restitution: 1.0,     // Perfect bounce (no energy loss)
            friction: 0,          // No friction (perpetual motion)
            frictionAir: 0,       // No air resistance
            mass: config.mass,
            label: config.label,
            render: {
                fillStyle: config.color,
                strokeStyle: '#ffffff',
                lineWidth: 2
            }
        });

        // Set initial velocity
        Body.setVelocity(particle, { x: velocityX, y: velocityY });

        // Add to world
        World.add(this.engine.world, particle);
        this.particles.push({
            body: particle,
            timestamp: Date.now()
        });

        // EDUCATIONAL NOTE: Limit particles to prevent performance issues
        // In a real drum performance, you don't want infinite visual clutter
        this.enforceParticleLimit();
    }

    /**
     * Remove oldest particles if we exceed the limit
     */
    enforceParticleLimit() {
        const { World } = Matter;

        while (this.particles.length > this.maxParticles) {
            const oldest = this.particles.shift();
            World.remove(this.engine.world, oldest.body);
        }
    }

    /**
     * Start automatic cleanup of old particles
     * Removes particles older than 30 seconds
     */
    startParticleCleanup() {
        setInterval(() => {
            const now = Date.now();
            const maxAge = 30000; // 30 seconds
            const { World } = Matter;

            this.particles = this.particles.filter(p => {
                const age = now - p.timestamp;
                if (age > maxAge) {
                    World.remove(this.engine.world, p.body);
                    return false;
                }
                return true;
            });
        }, 5000); // Check every 5 seconds
    }

    /**
     * Clear all particles from the canvas
     * Useful for starting fresh
     */
    clearAll() {
        const { World } = Matter;

        this.particles.forEach(p => {
            World.remove(this.engine.world, p.body);
        });
        this.particles = [];
    }

    /**
     * Create a specific pattern visualization
     * Used for demonstration mode (e.g., showing what a single stroke roll looks like)
     *
     * @param {string} patternType - 'single-stroke', 'double-stroke', 'paradiddle', etc.
     */
    demonstratePattern(patternType) {
        // Clear existing particles first
        this.clearAll();

        // EDUCATIONAL NOTE: These patterns create visual shapes
        // that help students understand rhythmic structure

        switch (patternType) {
            case 'single-stroke':
                // Alternating snare (representing R L R L)
                // Creates a uniform circular pattern
                this.createAlternatingPattern(['snare', 'snare'], 8);
                break;

            case 'double-stroke':
                // Pairs of hits (representing RR LL)
                this.createPairedPattern('snare', 8);
                break;

            case 'paradiddle':
                // RLRR LRLL pattern - creates interesting visual asymmetry
                this.createParadiddlePattern(4);
                break;

            case 'quarter-notes':
                // Four evenly spaced hits
                this.createEvenPattern('bass', 4);
                break;

            case 'eighth-notes':
                // Eight evenly spaced hits (twice as dense as quarters)
                this.createEvenPattern('hihat', 8);
                break;

            case 'flam':
                // Flams create close pairs of particles
                this.createFlamPattern(4);
                break;

            case 'triplets':
                // Triplets create triangular patterns
                this.createTripletPattern(4);
                break;

            case 'sixteenth-notes':
                // Very dense pattern (16 notes)
                this.createEvenPattern('hihat', 16);
                break;

            default:
                console.warn(`Unknown pattern: ${patternType}`);
        }
    }

    /**
     * Helper: Create evenly spaced particles in a circle
     * Visualizes steady pulse
     */
    createEvenPattern(drumType, count) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // Calculate velocity pointing outward
            const speed = 2;
            const velocityX = Math.cos(angle) * speed;
            const velocityY = Math.sin(angle) * speed;

            this.addParticleAtPosition(drumType, x, y, velocityX, velocityY);
        }
    }

    /**
     * Helper: Create paired particles (for double stroke)
     */
    createPairedPattern(drumType, pairCount) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        for (let i = 0; i < pairCount; i++) {
            const angle = (i / pairCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // Add two particles close together (representing the "double")
            const offset = 15;
            this.addParticleAtPosition(drumType, x - offset, y, Math.cos(angle) * 2, Math.sin(angle) * 2);
            this.addParticleAtPosition(drumType, x + offset, y, Math.cos(angle) * 2, Math.sin(angle) * 2);
        }
    }

    /**
     * Helper: Create alternating pattern
     */
    createAlternatingPattern(drumTypes, count) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        for (let i = 0; i < count; i++) {
            const drumType = drumTypes[i % drumTypes.length];
            const angle = (i / count) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            this.addParticleAtPosition(drumType, x, y, Math.cos(angle) * 2, Math.sin(angle) * 2);
        }
    }

    /**
     * Helper: Create paradiddle pattern (RLRR LRLL)
     * Creates visual groupings
     */
    createParadiddlePattern(groupCount) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;
        const pattern = ['snare', 'bass', 'snare', 'snare']; // Visual representation

        let particleIndex = 0;
        for (let group = 0; group < groupCount; group++) {
            for (let i = 0; i < pattern.length; i++) {
                const angle = (particleIndex / (groupCount * pattern.length)) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                this.addParticleAtPosition(pattern[i], x, y, Math.cos(angle) * 2, Math.sin(angle) * 2);
                particleIndex++;
            }
        }
    }

    /**
     * Helper: Create flam pattern (Grade 2)
     * Close pairs of particles to represent grace note + main note
     */
    createFlamPattern(count) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;

            // Grace note (smaller, softer)
            this.addParticleAtPosition('snare', x - 8, y, Math.cos(angle) * 1.5, Math.sin(angle) * 1.5);

            // Main note (larger, stronger)
            this.addParticleAtPosition('snare', x + 8, y, Math.cos(angle) * 2.5, Math.sin(angle) * 2.5);
        }
    }

    /**
     * Helper: Create triplet pattern (Grade 2)
     * Three particles per group forming triangular arrangements
     */
    createTripletPattern(groupCount) {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) * 0.6;

        let particleIndex = 0;
        for (let group = 0; group < groupCount; group++) {
            // Each group has 3 notes (triplet)
            for (let i = 0; i < 3; i++) {
                const totalParticles = groupCount * 3;
                const angle = (particleIndex / totalParticles) * Math.PI * 2;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;

                // Accent first note of each triplet
                const velocity = i === 0 ? 2.5 : 2.0;
                this.addParticleAtPosition('snare', x, y, Math.cos(angle) * velocity, Math.sin(angle) * velocity);
                particleIndex++;
            }
        }
    }

    /**
     * Helper: Add particle at specific position with velocity
     */
    addParticleAtPosition(drumType, x, y, velocityX, velocityY) {
        const { Bodies, World, Body } = Matter;
        const config = this.particleConfig[drumType];

        const particle = Bodies.circle(x, y, config.radius, {
            restitution: 1.0,
            friction: 0,
            frictionAir: 0,
            mass: config.mass,
            label: config.label,
            render: {
                fillStyle: config.color,
                strokeStyle: '#ffffff',
                lineWidth: 2
            }
        });

        Body.setVelocity(particle, { x: velocityX, y: velocityY });
        World.add(this.engine.world, particle);
        this.particles.push({
            body: particle,
            timestamp: Date.now()
        });
    }

    /**
     * Enable or disable visualization
     */
    setEnabled(enabled) {
        if (enabled) {
            this.render.canvas.style.opacity = '1';
        } else {
            this.render.canvas.style.opacity = '0.3';
        }
    }
}

// Export for use in main.js
// Note: This will be accessible globally via window.RhythmVisualizer
