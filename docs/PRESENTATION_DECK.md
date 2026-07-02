# Helpchain — Presentation Deck Reference

## Overview

16-slide interactive presentation for a Hebrew-speaking Israeli classroom audience.
Route: `/presentation` (opened manually by presenter).

Total duration target: ~8–10 minutes.

---

## Speaker Assignment

| Person | Slides |
|---|---|
| דובר/ת 1 | 1, 2, 3 |
| דובר/ת 2 | 4, 5, 6 |
| דובר/ת 3 | 7, 8 |
| דובר/ת 4 | 9, 10 |
| דובר/ת 5 | 11, 12 |
| דובר/ת 6 | 13, 14, 15, 16 |

---

## Slide-by-Slide Summary

### Slide 01 — Introduction (דובר/ת 1, ~40 שניות)
**Title:** HelpChain
**Content:** Brand mark, subtitle "עזרה אנושית. בזמן הנכון. במקום הנכון.", supporting line about the interactive prototype.
**Visual:** `01-hero-helpchain-network.png`

### Slide 02 — The Problem (דובר/ת 1, ~45 שניות)
**Title:** הבעיה: הצורך מיידי. העזרה לא תמיד זמינה.
**Content:** Core problem line + three situation cards (transit sign, high shelf, unfamiliar space).
**Visual:** `02-problem-situations.png`

### Slide 03 — Market Model (דובר/ת 1, ~40 שניות)
**Title:** מודל תלת־צדדי שמחבר בין צורך, נכונות וערך
**Content:** Three segments (requesters, volunteers, partner businesses) + reward flow.
**Visual:** Animated three-node cards.

### Slide 04 — System Overview (דובר/ת 2, ~35 שניות)
**Title:** המטרה שלנו: להפוך רצון טוב לרשת זמינה
**Content:** Four pillars + MVP badge.
**Visual:** `01-hero-helpchain-network.png` (cropped)

### Slide 05 — Requester Personas (דובר/ת 2, ~40 שניות)
**Title:** אנשים אמיתיים. צרכים מיידיים.
**Content:** Rajaa (34, visual impairment) and David (52, wheelchair user).
**Visual:** `03-requester-personas.png`

### Slide 06 — Volunteer & Partner Personas (דובר/ת 2, ~40 שניות)
**Title:** האנשים שמחזיקים את הרשת פעילה
**Content:** Noor (22, student volunteer) and Ahmed (38, business owner).
**Visual:** `04-volunteer-partner-personas.png`

### Slide 07 — Registration & Verification (דובר/ת 3, ~35 שניות)
**Title:** כניסה בטוחה. תפקיד ברור.
**Content:** Four registration steps + honest prototype note.
**Visual:** Numbered step cards with icons.

### Slide 08 — User Journey (דובר/ת 3, ~40 שניות)
**Title:** מפעולה אחת לחיבור בזמן אמת
**Content:** Four-step flow from help button to shared map.
**Visual:** `05-live-human-connection.png`

### Slide 09 — Double Validation (דובר/ת 4, ~35 שניות)
**Title:** אמון לפני תגמול
**Content:** Dual confirmation cards converging into verified session + star.
**Visual:** Animated converging cards.

### Slide 10 — Rewards & Partners (דובר/ת 4, ~40 שניות)
**Title:** התנדבות מקבלת ערך אמיתי
**Content:** Reward loop + three callout cards.
**Visual:** `06-rewards-and-partners.png`

### Slide 11 — Safety (דובר/ת 5, ~35 שניות)
**Title:** בטיחות היא חלק מהתכן — לא תוספת
**Content:** Four safety controls.
**Visual:** `07-safety-and-trust.png`

### Slide 12 — NFR (דובר/ת 5, ~40 שניות)
**Title:** דרישות לא־פונקציונליות: איכות שנמדדת
**Content:** Six large metric tiles (latency, touch targets, uptime, concurrency, screen readers, encryption).
**Visual:** Metric grid cards.

### Slide 13 — Matching Algorithm (דובר/ת 6, ~45 שניות)
**Title:** מנוע ההתאמה: מהבקשה למתנדב המתאים
**Content:** Seven-step decision flow.
**Visual:** Numbered algorithm steps.

### Slide 14 — Use Cases (דובר/ת 6, ~35 שניות)
**Title:** שלושה מקרי שימוש שמוכיחים את הליבה
**Content:** UC-01 (request), UC-02 (assist), UC-03 (redeem).
**Visual:** Three use case cards.

### Slide 15 — Gantt / Process (דובר/ת 6, ~35 שניות)
**Title:** מתהליך תכן להוכחת יכולת
**Content:** Eight development phases, all marked complete.
**Visual:** Animated Gantt-style timeline.

### Slide 16 — Live Demo (דובר/ת 6, ~40 שניות)
**Title:** HelpChain בפעולה
**Content:** Video player (or fallback) + "תודה".
**Visual:** `08-presentation-finale.png` as poster.

---

## Generated Image Asset Map

| Asset | File | Used In |
|---|---|---|
| Hero network | `public/presentation-images/01-hero-helpchain-network.png` | Slides 1, 4 |
| Problem situations | `public/presentation-images/02-problem-situations.png` | Slide 2 |
| Requester personas | `public/presentation-images/03-requester-personas.png` | Slide 5 |
| Volunteer/partner personas | `public/presentation-images/04-volunteer-partner-personas.png` | Slide 6 |
| Live connection | `public/presentation-images/05-live-human-connection.png` | Slide 8 |
| Rewards & partners | `public/presentation-images/06-rewards-and-partners.png` | Slide 10 |
| Safety & trust | `public/presentation-images/07-safety-and-trust.png` | Slide 11 |
| Finale | `public/presentation-images/08-presentation-finale.png` | Slide 16 (poster) |

---

## Video Replacement Instructions

1. Start the prototype: `npm run dev`
2. Record a **silent 20–35 second** screen capture of:
   - `/requester` → request → `/volunteer` → accept → session → complete → confirm → star → `/rewards` → redeem → QR → `/partner` → validate
3. Export as MP4 (H.264), no audio
4. Name: `helpchain-live-demo.mp4`
5. Place in: `public/presentation-media/helpchain-live-demo.mp4`
6. Avoid browser chrome and notifications
7. Slide 16 will automatically play the video on loop

---

## Speaker Note Overview

Each slide includes hidden speaker notes accessible via the N key:

- **דובר/ת** (speaker label)
- **משך מומלץ** (recommended duration)
- **מה לומר** (what to say — natural Hebrew guidance)
- **מה הקהל צריך להבין** (what the audience should understand)

Speaker notes are never shown on the public slide canvas.

---

## Speaker Allocation and Scripts

- **Speaker 1:** Slides 1–3, recommended duration: ~2:05 minutes
- **Speaker 2:** Slides 4–6, recommended duration: ~1:55 minutes
- **Speaker 3:** Slides 7–8, recommended duration: ~1:15 minutes
- **Speaker 4:** Slides 9–10, recommended duration: ~1:15 minutes
- **Speaker 5:** Slides 11–12, recommended duration: ~1:15 minutes
- **Speaker 6:** Slides 13–16, recommended duration: ~2:35 minutes

**Total Duration Target:** 8–10 minutes (current estimate: 8:40 minutes).

Detailed spoken scripts, audience takeaways, handoff cues, and rehearsal checklists are documented in the standalone file [docs/PRESENTATION_SPEAKER_SCRIPTS.md](file:///Users/zangeel/Desktop/Helpchain_Prototype/docs/PRESENTATION_SPEAKER_SCRIPTS.md).
