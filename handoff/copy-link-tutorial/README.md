# CopyLinkTutorial — handoff

A small **looping** "show, don't tell" tutorial that teaches users how to copy a reply link on X. Designed to sit in the Engage flow's reply-finish panel beside the link-paste input.

> One yellow stage. Hand cursor enters from the right, lands on **Share**, presses it (menu opens **instantly**), slides to **Copy link**, presses it, shows ✅ "Link copied — paste it below," and loops.

---

## What's in this folder

| File | Purpose |
| --- | --- |
| `CopyLinkTutorial.mp4` | **The video.** 5.6s H.264 MP4 (720×700), one full loop. Drop into Figma, Notion, your spec doc, anywhere. |
| `CopyLinkTutorial.tsx.txt` | The React component (rename to `.tsx` on import). Imports `lucide-react` + `@/lib/cn`. All SVGs (hand cursor, X glyphs) inlined. |
| `copy-link-tutorial.css` | All styles + keyframes. Class names prefixed `clt-` to avoid collisions. |
| `recorder.html` | Bonus: open in Chrome → click “Record 6s” to capture a fresh `.webm` / `.mp4` of the live React component. Use if you want to re-record after editing. |
| `_tutorial-src/` | Source files used by `recorder.html`. Don’t ship to production. |
| `README.md` | This file. |

No external animation library is used — it's just `useState` + `useEffect` + CSS transitions / keyframes.

---

## Getting a video (MP4)

Producing an MP4 video file directly from this design tool isn’t reliable — browser-only video encoders don’t guarantee H.264. Two paths:

**Easiest (browser-side, no install)** — open `recorder.html` in Chrome 130+ and click “Record 6s.” Chrome 130+ encodes directly to H.264 MP4. Older browsers fall back to `.webm` (still a valid video, accepted by Premiere/Final Cut/After Effects). To convert webm → mp4:

```bash
ffmpeg -i CopyLinkTutorial.webm \
  -c:v libx264 -pix_fmt yuv420p -movflags +faststart \
  CopyLinkTutorial.mp4
```

**Highest quality** — run the tutorial in your real app, screen-record with QuickTime (macOS) or OBS (Windows/Linux), trim to one loop, save as MP4.

---

## Drop-in steps

1. Copy both files into `app/(pages)/engage/_components/` (and rename `.tsx.txt` → `.tsx`):
   ```
   app/(pages)/engage/_components/
     ├── CopyLinkTutorial.tsx
     └── copy-link-tutorial.css
   ```
2. Import & render where the reply-link input lives:
   ```tsx
   import { CopyLinkTutorial } from "./_components/CopyLinkTutorial";

   <CopyLinkTutorial
       handle="@yinye"
       snippet="About: SuperHi is an online learning platform that…"
   />
   ```
3. Ensure `lucide-react` is installed (`yarn add lucide-react`).
4. Ensure `@/lib/cn` resolves (the project's existing classnames helper).

The CSS file is imported directly from the `.tsx` (`import "./copy-link-tutorial.css"`), so as long as your bundler handles plain CSS imports (Next.js does), no extra wiring is needed.

---

## Props

```ts
interface CopyLinkTutorialProps {
    /** Reply text shown inside the mock tweet card. Truncated to 2 lines. */
    snippet?: string;
    /** @-handle with or without the leading "@". Default "@yinye". */
    handle?: string;
    /** Extra className applied to the outer wrapper. */
    className?: string;
}
```

Both `snippet` and `handle` are optional — the component ships a sensible fallback so you can drop it in before wiring data.

---

## Timing (one loop ≈ 5s)

| Phase | Duration | What happens |
| --- | --- | --- |
| 0 | 2000 ms | Hand slides in from off-card right onto the Share icon. At 1100 ms a click-press animation fires and the share menu pops open INSTANTLY (no transition). |
| 1 | 1500 ms | Hand glides from the Share icon onto the **Copy link** row. At 800 ms the click-press animation fires. |
| 2 | 1500 ms | Holds "Link copied — paste it below" success state, then loops back to phase 0. |

To change pacing, edit the `PHASE_MS` array in `CopyLinkTutorial.tsx` and/or the per-phase `setTimeout` delays in the choreography `useEffect`.

---

## Color tokens

The component reads these from your existing CSS custom properties (defined in `engage/styles.css`):

- `--primary` → yellow `#FFE253` (avatar fill)
- `--primary-pale` → pale yellow `#FBFBF3` (stage background)
- `--black` → text color
- `--white`

Hard-coded X platform colors (intentional — these match X's brand):

- `#1D9BF1` — share icon active color
- `#E4EEF7` — share icon active background
- `#F5F5F5` — neutral hover fill on menu items

---

## Accessibility

- `prefers-reduced-motion: reduce` disables all transitions and click-press animations — the component still renders all states correctly, it just snaps between them.
- The hand cursor is decorative (`aria-hidden`).
- Emoji glyphs in the status line are wrapped with `aria-hidden` so screen readers read only the instruction text.

---

## Not included

- Listening for / verifying the user's actual paste — this component is purely instructional. Wire it next to your real `<input>` and use the input's value to drive submit state.
- Real data fetching for the X post being shown — the snippet & handle are passed in as props.
