/* ========================================
   EXERCISES DATA
   Complete exercise library for ABRSM Grade 1-2
   ======================================== */

/*
 * EDUCATIONAL STRUCTURE:
 *
 * Each exercise contains:
 * - Pedagogical metadata (difficulty, focus areas)
 * - Step-by-step learning instructions
 * - Assessment criteria (self-check items)
 * - Tempo progression (start slow, build to target)
 * - Pattern data for playback
 *
 * This data-driven approach makes it easy to add new exercises
 * and ensures consistency across the learning experience.
 */

const EXERCISES = {
    /* ====================================
       GRADE 1 RUDIMENTS
       ==================================== */

    'single-stroke': {
        id: 'single-stroke',
        name: 'Single Stroke Roll',
        grade: 1,
        difficulty: 'beginner',
        targetTempo: 80,
        minTempo: 60,

        // What this exercise teaches
        focusAreas: [
            'Even spacing between hits',
            'Equal volume (dynamics) between both hands',
            'Steady pulse maintenance',
            'Foundation for all other rudiments'
        ],

        // Sticking pattern
        sticking: 'R L R L R L R L',

        // Learning instructions
        instructions: [
            'Start with your hands on the drum, sticks ready',
            'Play alternating hands: Right, Left, Right, Left',
            'Focus on making both hands sound exactly the same',
            'Watch the visualizer - particles should be evenly spaced',
            'Start at 60 bpm, gradually increase to 80 bpm'
        ],

        // Self-assessment checklist
        checklistItems: [
            'Both hands sound equal in volume',
            'Spacing between hits is perfectly even',
            'Can maintain 80 bpm for 30 seconds without speeding up/slowing down',
            'Grip remains relaxed throughout'
        ],

        // Common mistakes
        commonMistakes: [
            'One hand playing louder than the other (usually the dominant hand)',
            'Rushing (speeding up gradually without noticing)',
            'Tensing up arms/shoulders - stay relaxed!'
        ],

        // EXTENSION: Grade 2 progression
        grade2Extension: 'Increase speed to 100+ bpm, add accents on specific beats'
    },

    'double-stroke': {
        id: 'double-stroke',
        name: 'Double Stroke Roll',
        grade: 1,
        difficulty: 'beginner',
        targetTempo: 80,
        minTempo: 60,

        focusAreas: [
            'Stick rebound control',
            'Paired hits (RR LL)',
            'Second stroke uses natural bounce',
            'Even volume across all four strokes in the pattern'
        ],

        sticking: 'RR LL RR LL',

        instructions: [
            'Play two hits with the right hand, then two with the left',
            'The FIRST hit is a full stroke, the SECOND uses the stick\'s natural rebound',
            'Don\'t force the second hit - let the stick bounce',
            'All four notes should sound even and controlled',
            'Watch for pairs of particles in the visualizer'
        ],

        checklistItems: [
            'Can clearly hear pairs of hits (RR LL)',
            'Second stroke in each pair sounds as clear as the first',
            'No "crushing" or muffling of the second hit',
            'Pattern sounds smooth and flowing, not choppy'
        ],

        commonMistakes: [
            'Forcing the second hit instead of using rebound',
            'Second hit too soft or barely audible',
            'Gripping stick too tightly (prevents natural bounce)'
        ],

        grade2Extension: 'Use double strokes in rudiments like the "Five Stroke Roll"'
    },

    'paradiddle': {
        id: 'paradiddle',
        name: 'Single Paradiddle',
        grade: 1,
        difficulty: 'intermediate',
        targetTempo: 80,
        minTempo: 60,

        focusAreas: [
            'Combination of single and double strokes',
            'Hand-to-hand coordination',
            'Foundation for complex drum beats',
            'Smooth transitions between sticking patterns'
        ],

        sticking: 'R L R R  L R L L',

        instructions: [
            'The pattern is: Single, Single, Double (RLRR), then switch hands (LRLL)',
            'Think of it as "Pa-ra-did-dle"',
            'The accent naturally falls on the first note of each group',
            'This builds the coordination needed for full drum kit playing',
            'Watch how the visualizer creates asymmetric patterns'
        ],

        checklistItems: [
            'Can clearly distinguish the single-single-double pattern',
            'Smooth transition when switching lead hands',
            'Pattern remains steady without hesitation',
            'Can repeat continuously for at least 1 minute'
        ],

        commonMistakes: [
            'Rushing through the double stroke',
            'Hesitating when switching lead hands',
            'Accenting incorrectly (accent should be on first note)'
        ],

        grade2Extension: 'Paradiddle-diddle, Double Paradiddle, variations with accents'
    },

    /* ====================================
       RHYTHM PATTERNS
       ==================================== */

    'quarter-notes': {
        id: 'quarter-notes',
        name: 'Quarter Notes (4/4)',
        grade: 1,
        difficulty: 'beginner',
        targetTempo: 80,
        minTempo: 60,

        focusAreas: [
            'Understanding quarter note duration',
            'Steady pulse (one note per beat)',
            'Foundation of all rhythm reading',
            'Counting: 1, 2, 3, 4'
        ],

        notation: '♩ ♩ ♩ ♩',

        instructions: [
            'In 4/4 time, play one note on each beat',
            'Count out loud: "1, 2, 3, 4"',
            'Each note gets one full beat',
            'This is the foundation - master this first!',
            'Visualizer particles should be widely and evenly spaced'
        ],

        checklistItems: [
            'Can count steadily: 1, 2, 3, 4',
            'Each note lands exactly on the beat',
            'No rushing between beats',
            'Can maintain pattern with metronome for 2 minutes'
        ],

        commonMistakes: [
            'Rushing (notes getting closer together)',
            'Uneven spacing between beats'
        ],

        grade2Extension: 'Combine with eighth notes and rests'
    },

    'eighth-notes': {
        id: 'eighth-notes',
        name: 'Eighth Notes (4/4)',
        grade: 1,
        difficulty: 'beginner',
        targetTempo: 80,
        minTempo: 60,

        focusAreas: [
            'Understanding eighth note duration',
            'Playing twice as fast as quarter notes',
            'Counting: 1 & 2 & 3 & 4 &',
            'Transition control'
        ],

        notation: '♫ ♫ ♫ ♫',

        instructions: [
            'In 4/4 time, play TWO notes per beat',
            'Count: "1 and 2 and 3 and 4 and"',
            'Each eighth note is exactly half a quarter note',
            'Common in hi-hat patterns',
            'Visualizer particles will be closer together than quarters'
        ],

        checklistItems: [
            'Can count: "1 & 2 & 3 & 4 &" steadily',
            'Eighth notes are exactly twice as fast as quarters',
            'All eighth notes are evenly spaced',
            'Can switch smoothly between quarters and eighths'
        ],

        commonMistakes: [
            'Eighth notes not exactly twice as fast',
            'Hesitation when switching between quarters and eighths'
        ],

        grade2Extension: 'Sixteenth notes, syncopation'
    },

    'quarter-eighth-transition': {
        id: 'quarter-eighth',
        name: 'Quarter & Eighth Note Transitions',
        grade: 1,
        difficulty: 'intermediate',
        targetTempo: 80,
        minTempo: 60,

        focusAreas: [
            'Smooth transitions between note values',
            'Maintaining steady pulse during changes',
            'Essential skill for sight reading',
            'Rhythm flexibility'
        ],

        pattern: 'Measure 1-2: Quarter notes | Measure 3-4: Eighth notes | Repeat',

        instructions: [
            'Play 2 measures of quarter notes (1, 2, 3, 4)',
            'Then switch to 2 measures of eighth notes (1 & 2 & 3 & 4 &)',
            'The PULSE stays the same - only the subdivision changes',
            'Focus on the transition point - no hesitation!',
            'Watch visualizer particle spacing change smoothly'
        ],

        checklistItems: [
            'Quarter notes section is steady',
            'Eighth notes section is steady',
            'Transition is smooth with no hesitation',
            'Can repeat pattern 4 times continuously'
        ],

        commonMistakes: [
            'Speeding up during eighth notes',
            'Pausing at the transition point',
            'Losing the underlying pulse'
        ],

        grade2Extension: 'Add triplets, sixteenth notes, mixed patterns'
    },

    /* ====================================
       FULL KIT COORDINATION
       ==================================== */

    'rock-beat': {
        id: 'rock-beat',
        name: 'Basic Rock Beat',
        grade: 1,
        difficulty: 'intermediate',
        targetTempo: 80,
        minTempo: 60,

        focusAreas: [
            'Multi-limb coordination',
            'Bass drum on beats 1 and 3',
            'Snare on backbeat (2 and 4)',
            'Hi-hat steady eighth notes',
            'Essential groove for rock music'
        ],

        pattern: {
            bass: 'Beats 1 and 3',
            snare: 'Beats 2 and 4',
            hihat: 'Steady eighth notes (all beats)'
        },

        instructions: [
            'STEP 1: Practice each part separately first',
            '  - Bass drum alone: 1, _, 3, _',
            '  - Snare alone: _, 2, _, 4',
            '  - Hi-hat alone: 1 & 2 & 3 & 4 &',
            'STEP 2: Combine bass + snare',
            'STEP 3: Add hi-hat last',
            'Listen to demonstration to hear how parts lock together',
            'All three colors should appear in visualizer'
        ],

        checklistItems: [
            'Each part maintains steady pulse independently',
            'Bass and Snare land precisely on correct beats',
            'Hi-hat eighth notes remain even throughout',
            'Can play continuously for 1 minute without stopping',
            'Body remains relaxed (no tension in shoulders/arms)'
        ],

        commonMistakes: [
            'Hi-hat rushing or slowing down',
            'Missing the backbeat (snare on 2 & 4)',
            'Tensing up when adding limbs',
            'Losing independence between hands and feet'
        ],

        grade2Extension: 'Add bass drum variations, 16th note hi-hats, fills'
    },

    'waltz-pattern': {
        id: 'waltz',
        name: '3/4 Waltz Pattern',
        grade: 1,
        difficulty: 'beginner',
        targetTempo: 90,
        minTempo: 70,

        focusAreas: [
            'Understanding 3/4 time signature',
            'Three beats per measure',
            'Emphasis on beat 1',
            'Different feel from 4/4'
        ],

        pattern: '♩ ♩ ♩ (1, 2, 3)',

        instructions: [
            'In 3/4 time, there are only THREE beats per measure',
            'Count: "1, 2, 3, 1, 2, 3"',
            'Beat 1 is usually emphasized (slightly louder)',
            'Common in classical and folk music',
            'Visualizer will show triangular patterns'
        ],

        checklistItems: [
            'Can count "1, 2, 3" steadily',
            'Beat 1 is slightly emphasized',
            'No accidental fourth beat!',
            'Feel the "waltz" swing'
        ],

        commonMistakes: [
            'Adding a fourth beat (falling back into 4/4)',
            'Not emphasizing beat 1',
            'Counting too fast or too slow'
        ],

        grade2Extension: 'Compound time signatures (6/8, 9/8)'
    },

    /* ====================================
       GRADE 2 RUDIMENTS & RHYTHMS
       ==================================== */

    'flam': {
        id: 'flam',
        name: 'Flam',
        grade: 2,
        difficulty: 'intermediate',
        targetTempo: 90,
        minTempo: 70,

        focusAreas: [
            'Grace note vs main note',
            'Consistency of "thickness" in sound',
            'Alternating lead hand'
        ],

        sticking: 'lR rL lR rL',

        instructions: [
            'The flam consists of a soft "grace note" followed by a strong "main note"',
            'The two hits should be very close together but not simultaneous',
            'Keep the grace note hand low (near the drum) and the main note hand higher',
            'Think of the sound "flam" itself'
        ],

        checklistItems: [
            'Can clearly hear two distinct notes in each flam',
            'Grace note is consistently softer than the main note',
            'Can play flams starting with both right and left hands',
            'Consistent timing between grace and main notes'
        ]
    },

    'triplets': {
        id: 'triplets',
        name: 'Triplets (3:2)',
        grade: 2,
        difficulty: 'intermediate',
        targetTempo: 80,
        minTempo: 60,

        focusAreas: [
            'Dividing the beat into three equal parts',
            'Alternating sticking (RLR LRL)',
            'Emphasis on the first note of each triplet'
        ],

        sticking: 'RLR LRL RLR LRL',

        instructions: [
            'Divide each beat into three even strokes',
            'Use alternating hands: R L R, then L R L',
            'The lead hand changes with every beat',
            'Think of the word "Trip-le-let" for counting'
        ],

        checklistItems: [
            'All three notes in each triplet are evenly spaced',
            'Can count "1-trip-let, 2-trip-let" steadily',
            'Lead hand switches correctly on each beat',
            'First note of each triplet is slightly emphasized'
        ]
    },

    'sixteenth-notes': {
        id: 'sixteenth-notes',
        name: 'Sixteenth Notes',
        grade: 2,
        difficulty: 'intermediate',
        targetTempo: 80,
        minTempo: 60,

        focusAreas: [
            'Dividing the beat into four equal parts',
            'Speed and precision',
            'Stamina development'
        ],

        sticking: 'RLRL RLRL RLRL RLRL',

        instructions: [
            'Divide each beat into four even strokes',
            'Count as "1 e & a, 2 e & a..."',
            'Focus on extreme evenness between all 16 notes in a bar',
            'Keep the strokes small and relaxed for speed'
        ],

        checklistItems: [
            'Can maintain steady speed for 30 seconds',
            'All 16 notes sound identical in volume',
            'Notes are perfectly evenly spaced',
            'Arms and shoulders remain relaxed'
        ]
    }

    /* ====================================
       GRADE 2 EXTENSIONS (Placeholders)
       ==================================== */

    // These would be added when Grade 2 content is developed:
    // - 'flam'
    // - 'triplets'
    // - 'flam-tap'
    // - 'advanced-dynamics'
    // - 'syncopation'
};

/* ====================================
   EXERCISE UTILITIES
   ==================================== */

/**
 * Get exercise by ID
 */
function getExercise(exerciseId) {
    return EXERCISES[exerciseId] || null;
}

/**
 * Get all exercises for a specific grade
 */
function getExercisesByGrade(grade) {
    return Object.values(EXERCISES).filter(ex => ex.grade === grade);
}

/**
 * Get all exercises of a specific difficulty
 */
function getExercisesByDifficulty(difficulty) {
    return Object.values(EXERCISES).filter(ex => ex.difficulty === difficulty);
}

/**
 * Get recommended tempo range for an exercise
 */
function getTempoRange(exerciseId) {
    const exercise = getExercise(exerciseId);
    if (!exercise) return null;

    return {
        min: exercise.minTempo,
        target: exercise.targetTempo,
        recommended: Math.floor((exercise.minTempo + exercise.targetTempo) / 2)
    };
}

/**
 * Save exercise progress to localStorage
 */
function saveProgress(exerciseId, checklistData) {
    const key = `exercise_progress_${exerciseId}`;
    const progress = {
        exerciseId,
        checklistData,
        lastPracticed: new Date().toISOString(),
        completedItems: Object.values(checklistData).filter(v => v).length
    };

    localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Load exercise progress from localStorage
 */
function loadProgress(exerciseId) {
    const key = `exercise_progress_${exerciseId}`;
    const data = localStorage.getItem(key);

    if (data) {
        try {
            return JSON.parse(data);
        } catch (e) {
            console.error('Failed to parse progress data:', e);
            return null;
        }
    }

    return null;
}

/**
 * Get overall progress summary
 */
function getProgressSummary() {
    const allExercises = Object.keys(EXERCISES);
    const summary = {
        total: allExercises.length,
        started: 0,
        completed: 0,
        exercises: {}
    };

    allExercises.forEach(id => {
        const progress = loadProgress(id);
        if (progress) {
            summary.started++;
            const exercise = getExercise(id);
            const totalItems = exercise.checklistItems.length;

            if (progress.completedItems === totalItems) {
                summary.completed++;
            }

            summary.exercises[id] = {
                completedItems: progress.completedItems,
                totalItems,
                lastPracticed: progress.lastPracticed,
                percentage: Math.round((progress.completedItems / totalItems) * 100)
            };
        }
    });

    return summary;
}

// Export for use in other files
