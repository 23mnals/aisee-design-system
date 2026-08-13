# aisee Tracking Eye — animation spec

> The yellow-dome mascot with a dark pupil that **scans left↔right and blinks**.
> Shown wherever aisee is *actively monitoring* something — hosted reply tracking,
> source scanning, live sync. Pure CSS, no JS animation loop, no dependencies.
>
> Source of truth: `AiseeTrackingEye.tsx` (typed React component).
> The same markup + keyframes are inlined into `Engage Replies (Tracking).html`
> (component `engage-tracking.jsx → TrackEye`).

---

## 1. Anatomy

The icon is a `viewBox="0 0 80 56"` SVG (fixed **80 : 56** ratio) built from 4 layers,
all clipped to an outer ellipse:

| Layer | Shape | Fill | Role |
|---|---|---|---|
| Backing disc | ellipse `cx39.76 cy28 rx39.76 ry28` | `#111111` | black surround |
| Dome | rounded path | `#FFE253` (aisee yellow) | the mascot body |
| Sclera | rect, clipped to **almond** | `#FFFFFF` | the white of the eye |
| **Pupil** | rounded rect `rx5.83` | `#111111` | the moving dark dot |
| Blink lid | rect, clipped to **dome** | `#FFE253` | drops down to blink |

Two nested clips matter: `-rect` (a bounding box) → `-almond` (the eye-shaped path).
The pupil lives **inside the almond**, so anything that leaves the almond is sliced off.

---

## 2. Motion

Three independent, looping keyframe tracks (deliberately different periods so the
eye never looks mechanically synced):

| Track | Element | Duration | Easing | What it does |
|---|---|---|---|---|
| `aisee-pupil` | `.aisee-pupil` | **6.8s** | `cubic-bezier(0.65,0,0.35,1)` | scans L → R → back |
| `aisee-blink` | `.aisee-lid` | **5.6s** | `ease-in-out` | quick blink near loop end |
| `aisee-float` | `.aisee-eye` | 4.6s | `ease-in-out` | optional idle bob (±2px) |

```css
@keyframes aisee-pupil {
  0%        { transform: translate(  0px, 0px); }
  14%, 28%  { transform: translate( -6px, 0px); }   /* hold left  */
  50%       { transform: translate(  1px, 0px); }
  64%, 78%  { transform: translate(  6px, 0px); }   /* hold right */
  92%       { transform: translate( -2px, 0px); }
  100%      { transform: translate(  0px, 0px); }
}
@keyframes aisee-blink {
  0%, 88%, 100% { transform: scaleY(0); }            /* lid up (open) */
  92%, 94%      { transform: scaleY(1); }            /* lid down (closed) */
  97%           { transform: scaleY(0); }
}
```

`transform-box: fill-box` + `transform-origin` are required so the SVG rects scale/translate
about their own centre, not the SVG origin. The lid uses `transform-origin: center top` so it
drops *down* like an eyelid.

---

## 3. ⚠️ The "multiple eyes" bug (fixed)

**Symptom:** for 1–2 frames mid-scan the pupil appeared to split into a second eye.

**Cause:** the almond is ~26px wide and the pupil ~11.8px, so the pupil centre has only
**~7px** of horizontal clearance before it touches the clip edge. The earlier keyframes drove
the pupil **±10px** (and ±1px vertically). At the extremes the almond clipped the pupil into a
thin crescent near its **pointed corners** — that detached sliver read as a second pupil.

**Fix (do not regress):**
- Cap pupil travel at **±6px** (must stay under the ~7px clearance).
- Keep vertical movement at **0** — any `y` offset rides the pupil into the narrow pointed
  ends where clearance is even smaller.

> Rule of thumb: if you ever widen the pupil or narrow the almond, re-check that
> `max |translateX| + pupilHalfWidth < almondHalfWidth`.

---

## 4. Accessibility & implementation

- Wrapper is `role="img"` with an `aria-label` (default `"Tracking"`; pass a context-specific
  label like `"Scanning sources"`).
- **`prefers-reduced-motion: reduce`** halts all three tracks — the eye renders open & still.
- Styles inject once via a singleton `<style data-aisee-eye>`; clip IDs are per-instance
  (`aisee-N`) so multiple eyes on one page don't collide.
- Size: pass `size` (px width); height derives from the 80:56 ratio. In dense UI (chips,
  list rows) pass `float={false}` to drop the idle bob.

```tsx
<AiseeTrackingEye size={120} ariaLabel="Monitoring this reply" />
<AiseeTrackingEye size={16} float={false} />   // inline in a chip
```

---

## 5. Changelog

- **v1.1** — pupil travel ±10→±6px, vertical drift removed; blink retimed 5.4→5.6s
  (88/92/94/97%). Fixes the "multiple eyes" crescent artifact.
- **v1.0** — initial scan + blink + idle float.
