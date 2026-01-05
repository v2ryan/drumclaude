/* ========================================
   MAIN APPLICATION
   Coordinates all components and handles user interaction
   ======================================== */

/*
 * APPLICATION ARCHITECTURE:
 *
 * This file acts as the "conductor" that brings together:
 * - RhythmVisualizer (Matter.js physics)
 * - AudioEngine (Tone.js sound)
 * - Exercises (data and patterns)
 * - UI interactions (navigation, buttons, controls)
 *
 * EDUCATIONAL DESIGN PRINCIPLE:
 * Every user interaction provides immediate feedback through
 * BOTH sound (audio) AND sight (visualization).
 */

// ========================================
// GLOBAL STATE
// ========================================

let visualizer = null;
let audioEngine = null;
let currentSection = 'home';
let currentGrade = 1;
let metronomeEnabled = false;
let visualizationEnabled = true;

// ========================================
// INITIALIZATION
// ========================================

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('ABRSM Drum Trainer initializing...');

    // Initialize visualizer
    initializeVisualizer();

    // Initialize audio (requires user interaction due to browser policies)
    setupAudioInitialization();

    // Setup navigation
    setupNavigation();

    // Setup drum pads
    setupDrumPads();

    // Setup controls
    setupControls();

    // Setup exercise buttons
    setupExerciseButtons();

    // Setup keyboard shortcuts
    setupKeyboardControls();

    // Setup drum kit visual interactions
    setupDrumKitVisual();

    // Load saved progress
    loadSavedProgress();

    console.log('Initialization complete!');
});

/**
 * Initialize the rhythm visualizer
 */
function initializeVisualizer() {
    try {
        visualizer = new RhythmVisualizer('rhythm-canvas');
        console.log('Visualizer initialized');
    } catch (error) {
        console.error('Failed to initialize visualizer:', error);
        alert('Visualization failed to load. Check console for details.');
    }
}

/**
 * Setup audio initialization
 * IMPORTANT: Browser audio policies require user interaction first
 */
function setupAudioInitialization() {
    audioEngine = new AudioEngine();

    // Create a one-time click listener to initialize audio
    const initAudio = async () => {
        if (!audioEngine.initialized) {
            await audioEngine.initialize();
            console.log('Audio engine ready');

            // Show a brief notification
            showNotification('Audio system ready! 🎵', 'success');
        }
    };

    // Initialize on first user interaction
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
}

// ========================================
// NAVIGATION
// ========================================

/**
 * Setup section navigation
 */
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const section = btn.dataset.section;
            navigateToSection(section);
        });
    });

    // Grade selector (CRITICAL FIX #1: Enable Grade 2)
    const gradeButtons = document.querySelectorAll('.grade-btn');
    gradeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const grade = parseInt(btn.dataset.grade);
            selectGrade(grade);
        });
    });
}

/**
 * Navigate to a section
 * @param {string} sectionId - Section to navigate to
 * @param {string} context - Optional context (e.g., specific exercise)
 */
function navigateToSection(sectionId, context = null) {
    // CRITICAL: Stop all audio when switching sections (FIX #2)
    if (audioEngine && audioEngine.initialized) {
        audioEngine.stopAllAudio();
    }

    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionId;

        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.section === sectionId) {
                btn.classList.add('active');
            }
        });

        // Handle section-specific setup
        if (sectionId === 'practice' && context) {
            // If navigating to practice with a specific exercise context
            loadExerciseInPracticeMode(context);
        }
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Select grade
 * Shows/hides Grade 2 content based on selection
 */
function selectGrade(grade) {
    // CRITICAL: Stop all audio when switching grades (FIX #2)
    if (audioEngine && audioEngine.initialized) {
        audioEngine.stopAllAudio();
    }

    currentGrade = grade;

    document.querySelectorAll('.grade-btn').forEach(btn => {
        btn.classList.remove('active');
        if (parseInt(btn.dataset.grade) === grade) {
            btn.classList.add('active');
        }
    });

    // Toggle Grade 2 content visibility
    const grade2Content = document.querySelectorAll('.grade-2-content');
    if (grade === 2) {
        grade2Content.forEach(el => el.classList.add('visible'));
        showNotification('已切換至二級內容', 'info');
    } else {
        grade2Content.forEach(el => el.classList.remove('visible'));
        showNotification('已切換至一級內容', 'info');
    }

    console.log(`Switched to Grade ${grade}`);
}

// ========================================
// DRUM PADS
// ========================================

/**
 * Setup interactive drum pads
 */
function setupDrumPads() {
    const pads = document.querySelectorAll('.drum-pad');

    pads.forEach(pad => {
        const drumType = pad.dataset.drum;

        // Mouse click
        pad.addEventListener('click', () => {
            playDrum(drumType, pad);
        });

        // Touch support for mobile
        pad.addEventListener('touchstart', (e) => {
            e.preventDefault();
            playDrum(drumType, pad);
        });
    });
}

/**
 * Play a drum sound and trigger visualization
 * EDUCATIONAL NOTE: This is where audio and visual feedback combine
 */
function playDrum(drumType, padElement = null) {
    // Play sound
    if (audioEngine && audioEngine.initialized) {
        audioEngine.playDrum(drumType, 1.0);
    }

    // Add visual particle
    if (visualizer && visualizationEnabled) {
        visualizer.addParticle(drumType, 1.0);
    }

    // Visual feedback on pad (brief flash)
    if (padElement) {
        padElement.classList.add('hit');
        setTimeout(() => {
            padElement.classList.remove('hit');
        }, 300);
    }
}

// ========================================
// KEYBOARD CONTROLS
// ========================================

/**
 * Setup keyboard shortcuts for drum pads
 * EDUCATIONAL NOTE: Keyboard is faster than mouse for practicing rudiments
 */
function setupKeyboardControls() {
    const keyMap = {
        'a': 'snare',
        'A': 'snare',
        's': 'bass',
        'S': 'bass',
        'd': 'hihat',
        'D': 'hihat'
    };

    document.addEventListener('keydown', (e) => {
        const drumType = keyMap[e.key];
        if (drumType) {
            e.preventDefault();

            // Find corresponding pad for visual feedback
            const pad = document.querySelector(`.drum-pad[data-drum="${drumType}"]`);
            playDrum(drumType, pad);
        }
    });
}

// ========================================
// PRACTICE CONTROLS
// ========================================

/**
 * Setup practice section controls
 */
function setupControls() {
    // Tempo slider
    const tempoSlider = document.getElementById('tempo-slider');
    const tempoDisplay = document.getElementById('tempo-display');

    if (tempoSlider) {
        tempoSlider.addEventListener('input', (e) => {
            const tempo = parseInt(e.target.value);
            tempoDisplay.textContent = tempo;

            if (audioEngine && audioEngine.initialized) {
                audioEngine.setTempo(tempo);
            }
        });
    }

    // Metronome toggle
    const metronomeToggle = document.getElementById('metronome-toggle');
    if (metronomeToggle) {
        metronomeToggle.addEventListener('click', () => {
            if (!audioEngine || !audioEngine.initialized) {
                showNotification('請先點擊畫面任何位置以啟動音頻', 'warning');
                return;
            }

            metronomeEnabled = audioEngine.toggleMetronome();
            metronomeToggle.textContent = metronomeEnabled ? '開啟' : '關閉';
            metronomeToggle.classList.toggle('active', metronomeEnabled);

            showNotification(
                metronomeEnabled ? '節拍器已啟動' : '節拍器已停止',
                'info'
            );
        });
    }

    // Visualization toggle
    const vizToggle = document.getElementById('viz-toggle');
    if (vizToggle) {
        vizToggle.addEventListener('click', () => {
            visualizationEnabled = !visualizationEnabled;
            vizToggle.textContent = visualizationEnabled ? '開啟' : '關閉';
            vizToggle.classList.toggle('active', visualizationEnabled);

            if (visualizer) {
                visualizer.setEnabled(visualizationEnabled);
            }
        });
    }

    // Clear canvas button
    const clearBtn = document.getElementById('clear-canvas');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (visualizer) {
                visualizer.clearAll();
                showNotification('已清除視覺化畫面', 'info');
            }
        });
    }

    // Stop All Audio button (CRITICAL FIX #2)
    const stopAllBtn = document.getElementById('stop-all-audio');
    if (stopAllBtn) {
        stopAllBtn.addEventListener('click', () => {
            if (!audioEngine || !audioEngine.initialized) {
                showNotification('音頻引擎未啟動', 'warning');
                return;
            }

            audioEngine.stopAllAudio();

            // Update metronome button state if needed
            const metronomeToggle = document.getElementById('metronome-toggle');
            if (metronomeToggle) {
                metronomeToggle.textContent = '關閉';
                metronomeToggle.classList.remove('active');
            }

            showNotification('✅ 所有音頻已停止', 'success');
        });
    }
}

// ========================================
// DRUM KIT VISUAL
// ========================================

/**
 * Setup drum kit visual section interactions
 * Clicking drum components plays their sound
 */
function setupDrumKitVisual() {
    // Drum play buttons
    const drumPlayButtons = document.querySelectorAll('.drum-play-btn');
    drumPlayButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent triggering parent click
            const drumType = btn.dataset.drum;
            playDrumKitSound(drumType);
        });
    });

    // Drum component cards (click anywhere on card)
    const drumComponents = document.querySelectorAll('.drum-component');
    drumComponents.forEach(component => {
        component.addEventListener('click', () => {
            const drumType = component.dataset.drum;
            playDrumKitSound(drumType);
        });
    });
}

/**
 * Play sound from drum kit visual section
 * @param {string} drumType - Type of drum to play
 */
function playDrumKitSound(drumType) {
    if (!audioEngine || !audioEngine.initialized) {
        showNotification('請先點擊畫面任何位置以啟動音頻', 'warning');
        return;
    }

    // Play the drum sound
    audioEngine.playDrum(drumType, 1.0);

    // Add visual particle if visualizer is enabled
    if (visualizer && visualizationEnabled) {
        visualizer.addParticle(drumType, 1.0);
    }

    // Show notification with drum name
    const drumNames = {
        'snare': '小鼓',
        'bass': '大鼓',
        'hihat': '腳踏鈸',
        'tom': '中鼓',
        'crash': '碎音鈸'
    };

    showNotification(`播放：${drumNames[drumType] || drumType}`, 'success');
}

// ========================================
// EXERCISE BUTTONS
// ========================================

/**
 * Setup all exercise-related buttons
 */
function setupExerciseButtons() {
    // Listen buttons (play demonstration)
    document.querySelectorAll('.btn-listen').forEach(btn => {
        btn.addEventListener('click', () => {
            const pattern = btn.dataset.pattern;
            playDemonstration(pattern);
        });
    });

    // Demo buttons (full tempo)
    document.querySelectorAll('.btn-demo').forEach(btn => {
        btn.addEventListener('click', () => {
            const exercise = btn.dataset.exercise;
            playExerciseDemo(exercise, 'normal');
        });
    });

    // Demo slow buttons
    document.querySelectorAll('.btn-demo-slow').forEach(btn => {
        btn.addEventListener('click', () => {
            const exercise = btn.dataset.exercise;
            playExerciseDemo(exercise, 'slow');
        });
    });

    // Setup self-check checkboxes to save progress
    document.querySelectorAll('.self-check-list input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            const checkId = e.target.dataset.check;
            saveCheckboxState(checkId, e.target.checked);
        });
    });
}

/**
 * Play a demonstration pattern
 */
function playDemonstration(patternType) {
    if (!audioEngine || !audioEngine.initialized) {
        showNotification('請先點擊畫面任何位置以啟動音頻', 'warning');
        return;
    }

    // CRITICAL: Stop ALL audio before starting (FIX #2)
    audioEngine.stopAllAudio();

    // Show visualization
    if (visualizer) {
        visualizer.demonstratePattern(patternType);
    }

    // Play audio pattern
    audioEngine.playExercise(patternType, audioEngine.currentTempo);

    showNotification(`播放中：${patternType}`, 'info');
}

/**
 * Play exercise demonstration
 */
function playExerciseDemo(exerciseId, speed = 'normal') {
    if (!audioEngine || !audioEngine.initialized) {
        showNotification('請先點擊畫面任何位置以啟動音頻', 'warning');
        return;
    }

    const exercise = getExercise(exerciseId);
    if (!exercise) {
        console.error(`Exercise not found: ${exerciseId}`);
        return;
    }

    // Determine tempo
    const tempo = speed === 'slow' ? exercise.minTempo : exercise.targetTempo;

    // CRITICAL: Stop ALL audio before starting (FIX #2)
    audioEngine.stopAllAudio();

    // Show visualization
    if (visualizer) {
        visualizer.demonstratePattern(exerciseId);
    }

    // Play pattern
    audioEngine.playExercise(exerciseId, tempo);

    showNotification(`播放中：${exercise.name || exerciseId} (${tempo} BPM)`, 'info');
}

/**
 * Load an exercise in practice mode
 */
function loadExerciseInPracticeMode(exerciseId) {
    const exercise = getExercise(exerciseId);
    if (!exercise) return;

    // Set tempo to recommended starting tempo
    const tempoSlider = document.getElementById('tempo-slider');
    const tempoDisplay = document.getElementById('tempo-display');

    if (tempoSlider && tempoDisplay) {
        const startTempo = exercise.minTempo;
        tempoSlider.value = startTempo;
        tempoDisplay.textContent = startTempo;

        if (audioEngine && audioEngine.initialized) {
            audioEngine.setTempo(startTempo);
        }
    }

    // Clear visualization
    if (visualizer) {
        visualizer.clearAll();
    }

    showNotification(`Ready to practice: ${exercise.name}`, 'success');
}

// ========================================
// PROGRESS TRACKING
// ========================================

/**
 * Save checkbox state to localStorage
 */
function saveCheckboxState(checkId, checked) {
    const key = `checkbox_${checkId}`;
    localStorage.setItem(key, checked ? '1' : '0');

    // Show encouragement when checklist items are completed
    if (checked) {
        const encouragements = [
            'Great progress! 🎯',
            'You\'re getting better! 🌟',
            'Excellent work! 👏',
            'Keep it up! 💪'
        ];
        const message = encouragements[Math.floor(Math.random() * encouragements.length)];
        showNotification(message, 'success');
    }
}

/**
 * Load saved checkbox states
 */
function loadSavedProgress() {
    document.querySelectorAll('.self-check-list input[type="checkbox"]').forEach(checkbox => {
        const checkId = checkbox.dataset.check;
        const key = `checkbox_${checkId}`;
        const saved = localStorage.getItem(key);

        if (saved === '1') {
            checkbox.checked = true;
        }
    });

    console.log('Progress loaded from localStorage');
}

// ========================================
// UI HELPERS
// ========================================

/**
 * Show a notification message
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: ${type === 'success' ? '#27ae60' : type === 'warning' ? '#f39c12' : '#3498db'};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: bold;
    `;

    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// GLOBAL FUNCTIONS (called from HTML)
// ========================================

/**
 * Global function for inline onclick handlers
 */
window.navigateToSection = navigateToSection;

// ========================================
// EDUCATIONAL COMMENTS FOR TEACHERS
// ========================================

/*
 * HOW THIS APPLICATION TEACHES DRUMMING:
 *
 * 1. MULTI-SENSORY LEARNING
 *    - Visual: Particles show rhythm patterns
 *    - Audio: Immediate sound feedback
 *    - Kinesthetic: Physical interaction with pads/keyboard
 *
 * 2. PROGRESSIVE DIFFICULTY
 *    - Start slow (60 bpm), build to target (80 bpm)
 *    - Master simple patterns before complex ones
 *    - Self-assessment checklists guide progress
 *
 * 3. INSTANT FEEDBACK
 *    - See if rhythm is even (particle spacing)
 *    - Hear if volume is balanced
 *    - No waiting for teacher correction
 *
 * 4. ABRSM-ALIGNED
 *    - All exercises match Grade 1-2 syllabus
 *    - Tempos match exam requirements
 *    - Terminology is exam-appropriate
 *
 * 5. SELF-PACED
 *    - No time pressure
 *    - Progress saved locally
 *    - Practice anywhere, anytime
 *
 * EXTENSION OPPORTUNITIES:
 * - Add recording feature (save performance, compare to target)
 * - Add accuracy scoring (timing deviation analysis)
 * - Add backing tracks for musicality practice
 * - Add teacher dashboard (if backend added)
 */
