# Drum Sound Files

This folder is for your drum sample audio files.

## Current Status

⚠️ **No sound files included** - The app currently uses synthesized sounds (fallback mode).

For a better learning experience, add real drum samples!

## Required Files

Add these three files to this folder:

```
snare.wav   - Snare drum sample
bass.wav    - Bass drum (kick) sample
hihat.wav   - Hi-hat sample
```

## File Requirements

- **Format**: WAV or MP3
- **Length**: < 1 second (short, punchy samples work best)
- **Quality**: Clear, crisp recordings
- **Size**: < 500KB per file (recommended)

## Where to Get Drum Samples

### Free Sources
1. **Freesound.org** - Large library of free drum samples
   - Search: "snare one shot", "kick drum", "hi hat closed"
   - Filter by Creative Commons licenses

2. **99Sounds.org** - Free sample packs
   - Look for "one-shot drum samples"

3. **Bedroom Producers Blog** - Free drum kits
   - Many include isolated snare/kick/hat samples

### Paid Sources (Professional Quality)
1. **Splice** - Subscription service with thousands of samples
2. **Loopmasters** - Professional drum libraries
3. **Native Instruments** - Kontakt drum libraries

### Record Your Own
If you have access to a drum kit:
- Use your phone or a simple USB microphone
- Record one clean hit of each drum
- Keep the recording short (trim silence)
- Normalize volume in a free audio editor (Audacity)

## How to Enable Real Samples

Once you've added the three WAV/MP3 files to this folder:

1. Open `js/audio-engine.js`
2. Find line ~70 (the `createFallbackSounds` function)
3. Add this code in the `initialize()` function:

```javascript
// Add these lines after Tone.start()
await this.loadSamples({
    snare: 'assets/sounds/snare.wav',
    bass: 'assets/sounds/bass.wav',
    hihat: 'assets/sounds/hihat.wav'
});
this.useFallbackSounds = false;
```

4. Save and reload the page

## Sample Characteristics

### Snare
- Bright, sharp attack
- Short decay (~200-300ms)
- Frequency range: 200Hz - 5kHz
- Example: Typical acoustic snare drum

### Bass Drum (Kick)
- Deep, punchy low end
- Very short (50-150ms)
- Frequency range: 50Hz - 200Hz
- Example: Kick drum from rock/pop kit

### Hi-Hat
- High-frequency content
- Very short, crisp
- Frequency range: 4kHz - 12kHz
- Should be "closed" hi-hat (not open)

## File Naming

You can use different names, just update the paths in `audio-engine.js`:

```javascript
await this.loadSamples({
    snare: 'assets/sounds/my-snare.mp3',
    bass: 'assets/sounds/my-kick.wav',
    hihat: 'assets/sounds/my-hat.wav'
});
```

## Legal Considerations

⚠️ **Copyright**: Only use samples you have rights to use!

- **Public domain** - Free to use
- **Creative Commons** - Check license requirements
- **Royalty-free** - Usually okay for educational use
- **Your own recordings** - Always safe!

## Troubleshooting

### Samples not playing?
- Check file paths are correct
- Check files are actually in this folder
- Check browser console for loading errors
- Try opening files directly in browser to test

### Samples sound distorted?
- Normalize volume in audio editor
- Reduce sample rate (44.1kHz is plenty)
- Check file isn't corrupted

### Still using synth sounds?
- Make sure you set `this.useFallbackSounds = false`
- Check that `loadSamples()` is called in `initialize()`
- Wait for `await Tone.loaded()` to complete

## Sample Pack Recommendations

Good starting points for educational drum sounds:

1. **MT Power Drum Kit** (Free) - Realistic rock drums
2. **Steven Slate SSD5 Free** - Professional quality
3. **Sennheiser DrumMic'a** (Free) - Natural drum tones

All of these include isolated one-shot samples you can extract.

---

**Once you add samples, the app will sound much more professional!**

Students will hear realistic drum tones instead of synthesized beeps.
