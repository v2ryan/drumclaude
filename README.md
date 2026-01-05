# ABRSM Drum Trainer - Grade 1 & 2

An interactive educational web application for learning ABRSM percussion fundamentals through visual feedback and hands-on practice.

## 🎯 What This Project Does

This is a **complete educational website** that teaches beginners (children and adults) how to play drums for ABRSM Grade 1-2 exams. It combines:

- **Physics-based rhythm visualization** (Matter.js zero-gravity simulation)
- **Interactive drum pads** with real-time audio feedback (Tone.js)
- **Structured learning modules** aligned with ABRSM syllabus
- **Self-paced practice exercises** with progress tracking

## 🎓 Educational Features

### For Students
- Learn essential rudiments: Single Stroke Roll, Double Stroke Roll, Paradiddle
- Master rhythm notation: quarter notes, eighth notes, time signatures
- Practice full drum kit coordination (rock beats, waltz patterns)
- Track progress with self-assessment checklists
- Visual feedback shows if your rhythm is steady (evenly spaced particles = good timing!)

### For Teachers
- Clean, readable code that students can learn from
- All exercises aligned with ABRSM Grade 1-2 requirements
- Progressive difficulty (start slow at 60 bpm, build to 80 bpm)
- Comments throughout explaining pedagogical decisions
- Easy to extend with new exercises

## 🚀 Quick Start

### Option 1: Open Locally (Instant)

1. **Download this project**
2. **Open `index.html` in a web browser**
3. **Click anywhere to enable audio** (browser requirement)
4. **Start practicing!**

That's it! No build tools, no installation, no server needed.

### Option 2: Deploy to GitHub Pages (Recommended)

**Why GitHub Pages?**
- Free hosting
- Share with students via URL
- Automatic HTTPS
- Easy updates via git push

**Steps:**

1. **Create a GitHub repository**
   ```bash
   # In the project folder
   git init
   git add .
   git commit -m "Initial commit - ABRSM Drum Trainer"
   ```

2. **Push to GitHub**
   ```bash
   # Create a new repo on GitHub first, then:
   git remote add origin https://github.com/YOUR_USERNAME/abrsm-drum-trainer.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select branch: `main`, folder: `/ (root)`
   - Click **Save**
   - Your site will be live at: `https://YOUR_USERNAME.github.io/abrsm-drum-trainer/`

4. **Done!** Share the URL with your students.

## 📁 Project Structure

```
abrsm-drum-trainer/
│
├── index.html              # Main entry point - open this file
├── README.md              # This file
│
├── css/
│   └── style.css          # All styling (educational design principles)
│
├── js/
│   ├── main.js            # Core app logic (initialization, navigation)
│   ├── visualizer.js      # Matter.js rhythm visualization
│   ├── audio-engine.js    # Tone.js audio system
│   └── exercises.js       # Exercise data and progress tracking
│
├── assets/
│   └── sounds/            # Drum samples (YOU UPLOAD THESE)
│       ├── snare.wav      # ← Add your snare sample here
│       ├── bass.wav       # ← Add your bass sample here
│       └── hihat.wav      # ← Add your hi-hat sample here
│
└── lib/                   # External libraries (loaded from CDN)
```

## 🔊 Adding Real Drum Sounds

**Currently:** The app uses synthesized sounds (fallback mode)

**To use real drum samples:**

1. **Get drum samples** (WAV or MP3 format, < 1 second each)
   - Sources: Freesound.org, Splice, or record your own drums
   - Recommended: Punchy, short samples (kick, snare, hi-hat)

2. **Add files to `assets/sounds/`:**
   ```
   assets/sounds/snare.wav
   assets/sounds/bass.wav
   assets/sounds/hihat.wav
   ```

3. **Update `audio-engine.js` (line ~70):**
   ```javascript
   // Change this:
   this.useFallbackSounds = true;

   // To this:
   this.useFallbackSounds = false;

   // And add:
   await this.loadSamples({
       snare: 'assets/sounds/snare.wav',
       bass: 'assets/sounds/bass.wav',
       hihat: 'assets/sounds/hihat.wav'
   });
   ```

4. **Reload the page** - real samples will now be used!

## 🎮 How to Use the App

### Navigation
- **Home** - Overview of what you'll learn
- **Learn** - All rudiments and rhythm patterns with explanations
- **Practice** - Interactive drum pads + rhythm visualizer
- **Exercises** - Guided practice routines with self-assessment

### Practice Mode

1. **Set your tempo** (start at 60 bpm if you're a beginner)
2. **Enable metronome** if you need help staying on beat
3. **Click drum pads or use keyboard:**
   - `A` = Snare
   - `S` = Bass Drum
   - `D` = Hi-Hat
4. **Watch the visualization:**
   - Evenly spaced particles = steady rhythm ✅
   - Irregular spacing = you're rushing or dragging ❌
5. **Increase tempo gradually** as you improve

### Exercise Workflow

For each exercise:
1. **Listen** - Click "Play Demo" to hear the target
2. **Watch** - Observe the rhythm visualization
3. **Practice** - Start at slow tempo (60 bpm)
4. **Self-Check** - Mark checklist items as you master them
5. **Build Speed** - Gradually increase to 80 bpm (Grade 1 exam tempo)

## 🧠 Educational Design Principles

### Why Zero-Gravity Physics?

Traditional physics engines make objects fall down (gravity). We set gravity = 0 so particles float forever in straight lines. This creates:

- **Visual rhythm persistence** - See your entire pattern, not just the last hit
- **Spatial timing feedback** - Even spacing = steady pulse
- **Pattern recognition** - Geometric shapes emerge from rhythmic structures

### Why Multi-Sensory Learning?

The app provides THREE types of feedback simultaneously:

1. **Visual** - Particles show rhythm patterns
2. **Audio** - Immediate sound feedback
3. **Kinesthetic** - Physical interaction (click/tap)

This matches how drum teachers work: students SEE demonstrations, HEAR the rhythm, and FEEL it in their hands.

### ABRSM Alignment

Every exercise matches official ABRSM Grade 1-2 requirements:

- **Tempo**: 80 bpm (Grade 1 standard)
- **Rudiments**: Single Stroke, Double Stroke, Paradiddle
- **Notation**: Quarter notes, eighth notes, 4/4 and 3/4 time
- **Dynamics**: Understanding f (forte) and p (piano)
- **Coordination**: Multi-limb patterns for full kit

## 🛠️ Technical Details

### Technologies Used

- **HTML5 Canvas** - Rendering
- **Matter.js (v0.19.0)** - Physics engine for visualization
- **Tone.js (v14.8.49)** - Audio engine with sample-accurate timing
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **CSS3** - Responsive design, mobile-friendly

### Browser Requirements

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **JavaScript enabled**
- **Audio API support** (all modern browsers)
- **Works on mobile/tablet** (touch-enabled drum pads)

### Performance

- Optimized for 60fps rendering
- Particle limit (100 max) prevents slowdown
- Automatic cleanup of old particles
- No backend required = instant loading

## 📝 Code Comments for Learning

Every JavaScript file includes extensive **educational comments** explaining:

- **Why** certain design decisions were made
- **How** each component teaches drumming concepts
- **What** ABRSM requirements are being addressed
- **Where** Grade 2 extensions can be added later

Teachers and students can read the code to understand both programming AND music pedagogy.

## 🎯 Grade 2 Extension Points

The code is architected to easily add Grade 2 content. Look for comments marked:

```javascript
// GRADE 2 EXTENSION POINT
```

Future additions include:
- **Flams** - Grace note technique
- **Triplets** - Three-note groupings (visualized as triangular patterns)
- **Advanced Dynamics** - pp, mp, mf, ff, accents
- **Faster Tempos** - 100+ bpm
- **Syncopation** - Off-beat rhythms
- **Compound Time** - 6/8, 9/8

All HTML structure for Grade 2 previews is already in place (currently disabled).

## 🐛 Troubleshooting

### No sound?
- **Click anywhere first** - Browsers require user interaction before audio
- Check that you're not muted
- Check browser console for errors

### Visualization not showing?
- Check that Matter.js loaded from CDN (inspect Network tab)
- Try refreshing the page
- Check browser console for errors

### Performance issues?
- Clear visualization (button in Practice section)
- Close other tabs/applications
- Lower particle count in `visualizer.js` (line 189: change `maxParticles`)

### GitHub Pages not working?
- Wait 1-2 minutes after enabling Pages
- Check that branch is set to `main` (not `master`)
- Ensure repository is public
- Check repository Settings → Pages for build status

## 📚 Next Improvements

### Phase 1 (High Priority)
- [ ] **Recording feature** - Record performance, compare to target pattern
- [ ] **Accuracy scoring** - Analyze timing deviation, give percentage score
- [ ] **More exercises** - Add all ABRSM Grade 1 pieces
- [ ] **Mobile optimization** - Better touch targets, portrait mode layout

### Phase 2 (Medium Priority)
- [ ] **Backing tracks** - Play along with music (Rock, Pop, Waltz)
- [ ] **Video demonstrations** - Embed technique videos
- [ ] **Notation display** - Show drum notation alongside practice
- [ ] **Slow-motion playback** - Visual slowdown for complex patterns

### Phase 3 (Advanced)
- [ ] **Grade 2 content** - Unlock all advanced exercises
- [ ] **Custom exercises** - Teachers can create their own patterns
- [ ] **Export progress** - Download PDF report cards
- [ ] **Teacher dashboard** - (Requires backend) Track student progress

### Phase 4 (Ambitious)
- [ ] **MIDI support** - Connect real electronic drums
- [ ] **Multiplayer mode** - Practice with friends
- [ ] **AI feedback** - Computer vision for stick technique analysis
- [ ] **Gamification** - Points, badges, achievements

## 🤝 Contributing

This is an educational project. Contributions welcome!

**Areas that need help:**
- Real drum samples (professional quality)
- Video demonstrations of techniques
- Translation to other languages
- Accessibility improvements (screen reader support)
- More exercises and practice patterns

## 📄 License

This project is educational software. Free to use, modify, and distribute.

**Attribution appreciated but not required.**

If you use this in your teaching, I'd love to hear about it!

## 🎓 About ABRSM

The Associated Board of the Royal Schools of Music (ABRSM) is the world's leading music assessment board. This application teaches skills aligned with their Grade 1-2 percussion syllabus.

**This is an independent educational tool, not officially affiliated with ABRSM.**

For official ABRSM materials, visit: [abrsm.org](https://www.abrsm.org/)

## 📧 Support

**Issues?** Check the Troubleshooting section above.

**Feature requests?** See "Next Improvements" - many features are already planned!

**Questions?** Read the code comments - they're written to be educational.

---

**Built with ❤️ for drum students and teachers**

Happy practicing! 🥁
