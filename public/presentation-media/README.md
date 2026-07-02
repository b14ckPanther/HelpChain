# Helpchain — Presentation Media

## Live Demo Video

The `/presentation` slide deck (Slide 16) expects a silent screen recording of the Helpchain demo flow.

### Recording instructions

1. Start the Helpchain prototype: `npm run dev`
2. Open a screen recording tool (QuickTime Player → File → New Screen Recording, or OBS)
3. **Turn off audio capture** — the video must be silent
4. Set resolution to at least 1280×720 (16:9)
5. Record the following sequence (20–35 seconds total):
   - `/requester` → tap "I need help" → choose "Read text" → send request
   - `/volunteer` → accept request → confirm arrival → mark complete
   - `/requester` → confirm help received → star awarded
   - `/rewards` → redeem Haven Café coupon → show QR
   - `/partner` → validate coupon → success
6. **Stop recording**

### Export settings

- Format: MP4 (H.264)
- Filename: `helpchain-live-demo.mp4`
- Place file in: `public/presentation-media/helpchain-live-demo.mp4`
- Resolution: 1280×720 or 1920×1080
- No browser chrome, toolbars, or notification overlays
- No audio track

### Behavior in presentation

- If the MP4 file exists, Slide 16 plays it silently on loop
- If the MP4 file does not exist, a graceful Hebrew fallback message appears:
  - "סרטון ההדגמה יופעל כאן בזמן ההצגה"
  - "בינתיים ניתן להמשיך לדמו החי דרך /requester"
- No broken media controls or error text will appear
