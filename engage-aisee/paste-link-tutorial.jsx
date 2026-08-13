/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// paste-link-tutorial.jsx → app/(pages)/engage/_components/paste-link-tutorial.tsx
//
// Looping tutorial: AFTER copying the reply link on X, return to the platform,
// hit ⌘V to paste it into the Submit Reply Link input, then click Save & finish.
// Sits AFTER <CopyLinkTutorial> in the Engage flow.
//
// Choreography (4 phases):
//   0) cursor enters, glides toward input; ⌘V keypill press → link snaps in
//   1) Save & finish activates from gray → black (status: "Ready to save")
//   2) cursor glides down to Save & finish, click-press
//   3) card morphs into success state ("Reply linked - tracking started")
//   → loop
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStatePLT, useEffect: useEffectPLT, useRef: useRefPLT } = React;

const REPLY_URL_PLT = "https://x.com/sophie/status/1842910283746/comment/9a2f";

// ── Hand cursor — matches user-uploaded SVG: white interior + drop shadow only
// (no black outline). The filtered outer path inherits fill="none" so the only
// visible thing is the white glyph plus a soft drop shadow around it.
function HandCursorPLT() {
  return (
    <svg width="24" height="27" viewBox="0 0 136 154" fill="none" aria-hidden>
      <path
        d="M64.9993 133.957L16.8522 88.1394L24.6178 71.0548L47.1383 88.1394V16.0142H61.1165L64.9993 50.2811L89.8494 53.9704L105.381 58.6299H119.359V116.872L96.062 133.957H64.9993Z"
        fill="white"
      />
      <g filter="url(#plt_handcursor_shadow)">
        <path
          d="M111.22 55.6912V55.6813C118.333 55.6813 123.542 61.4068 123.542 68.4715V94.0321C123.542 118.19 120.175 137.774 83.8817 137.774C67.9998 137.774 60.4872 134.603 53.9297 129.257C53.0513 128.731 52.2383 128.103 51.5076 127.386L15.5444 91.6493C9.42018 85.5201 12.2214 76.9047 16.5143 72.6216C20.7974 68.3287 29.6934 67.6247 34.7297 72.6216L42.5328 80.41V20.7805C42.5471 17.3782 43.9117 14.1209 46.3267 11.7244C48.7416 9.3279 52.0093 7.98832 55.4116 8.00008C62.5253 8.00008 67.8669 13.7158 67.8669 20.7805V43.7576C69.7343 42.7536 71.8218 42.2292 73.9419 42.2315C79.6036 42.2315 83.9998 45.8647 85.7278 50.8961C87.6971 49.6801 90.0848 48.9565 92.5857 48.9565C98.2472 48.9565 102.634 52.5896 104.362 57.6308C106.3 56.3647 108.565 55.6907 110.88 55.6912H111.224H111.22Z"
          fill="white"
        />
      </g>
      <defs>
        <filter
          id="plt_handcursor_shadow"
          x="0"
          y="0"
          width="135.542"
          height="153.773"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="6" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.32 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}

// Success icon — the user-uploaded SVG (document + magnifier + check)
// referenced as a normal <img> so the entire artwork (Figma export with
// embedded fractal-noise texture) renders exactly as designed.
function ReplyLinkedIcon({ size = 64 }) {
  return (
    <img
      src="assets/reply-linked-icon.svg"
      width={size}
      height={size}
      alt=""
      style={{ display: "block" }}
    />
  );
}

// Per-phase durations (ms). 4 phases: arrive+paste, ready, click save, success.
const PHASE_MS_PLT = [1900, 900, 1100, 1900];

window.PasteLinkTutorial = function PasteLinkTutorial({ url = REPLY_URL_PLT }) {
  const I = window.Icons;
  const { cn } = window;
  const [phase, setPhase] = useStatePLT(0);
  const [pasted, setPasted] = useStatePLT(false);
  const [keyDown, setKeyDown] = useStatePLT(false);
  const [saveClicked, setSaveClicked] = useStatePLT(false);
  const [entered, setEntered] = useStatePLT(false);

  const stageRef = useRefPLT(null);
  const inputRef = useRefPLT(null);
  const saveBtnRef = useRefPLT(null);

  const [cursorXY, setCursorXY] = useStatePLT({ x: 9999, y: 9999 });

  const placeOn = (ref) => {
    const stage = stageRef.current;
    const target = ref && ref.current;
    if (!stage || !target) return;
    const s = stage.getBoundingClientRect();
    const t = target.getBoundingClientRect();
    setCursorXY({
      x: t.left - s.left + t.width / 2,
      y: t.top - s.top + t.height / 2,
    });
  };

  // Phase loop
  useEffectPLT(() => {
    const t = setTimeout(() => setPhase((p) => (p + 1) % 4), PHASE_MS_PLT[phase]);
    return () => clearTimeout(t);
  }, [phase]);

  // Per-phase choreography
  useEffectPLT(() => {
    const timers = [];

    if (phase === 0) {
      // Reset → cursor enters from off-card → arrives near input → ⌘V press → URL fills
      setPasted(false);
      setKeyDown(false);
      setSaveClicked(false);
      setEntered(false);
      const stage = stageRef.current;
      if (stage) {
        const s = stage.getBoundingClientRect();
        setCursorXY({ x: s.width + 30, y: s.height - 18 });
      }
      // enter & glide onto input
      timers.push(setTimeout(() => {
        setEntered(true);
        placeOn(inputRef);
      }, 40));
      // ⌘V key press flash
      timers.push(setTimeout(() => setKeyDown(true), 1050));
      // URL appears in field
      timers.push(setTimeout(() => setPasted(true), 1300));
      // release key visual
      timers.push(setTimeout(() => setKeyDown(false), 1500));
    }

    if (phase === 1) {
      // Hold "ready" state briefly before moving to save
      setPasted(true);
    }

    if (phase === 2) {
      // Glide cursor down to Save & finish, then click-press
      timers.push(setTimeout(() => placeOn(saveBtnRef), 30));
      timers.push(setTimeout(() => setSaveClicked(true), 750));
    }

    // phase 3 → success state, cursor stays on the save button position
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Pinned cursor on resize
  useEffectPLT(() => {
    const onResize = () => {
      if (phase === 0 || phase === 1) placeOn(inputRef);
      else if (phase === 2) placeOn(saveBtnRef);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [phase]);

  // Status text from progress
  const status = phase === 0 && !pasted
    ? { txt: "Press ⌘V to paste your link", emoji: "📋" }
    : phase < 2
    ? { txt: "Link pasted — ready to save",   emoji: "✨" }
    : phase === 2 && !saveClicked
    ? { txt: "Click Save & finish",            emoji: "👇" }
    : { txt: "Reply linked — tracking started", emoji: "✅" };

  const showSuccess = phase === 3 && saveClicked;
  const canSave = pasted; // Save button active once link is in input

  return (
    <div className="flex flex-col gap-3">
      {/* ── Card stage ───────────────────────────────────────────────── */}
      <div ref={stageRef} className="relative bg-yellow-fbfbf3 rounded-[14px] p-4">
        {showSuccess ? (
          // ── Success: green "Reply linked - tracking started" ──────────
          <div className="rounded-[12px] px-4 py-7 flex flex-col items-center text-center animate-fade-in"
               style={{ background: "#EBF4E7", color: "#111111" }}>
            <div className="mb-3">
              <ReplyLinkedIcon size={56} />
            </div>
            <div className="text-[15px] font-bold leading-tight">
              Reply linked — tracking started
            </div>
            <div className="text-[12.5px] mt-1.5 leading-snug" style={{ color: "rgba(17,17,17,0.62)" }}>
              We'll watch likes &amp; replies and add it to your Sent tab.
            </div>
          </div>
        ) : (
          // ── Compose: Submit Reply Link card with input + Save button ─
          <div>
            {/* Pill: 🔗 Submit Reply Link for tracking */}
            <div className="inline-flex items-baseline gap-1.5 mb-2.5 text-[13px] text-primary">
              <span aria-hidden className="text-[14px] leading-none" style={{ position: "relative", top: "1px" }}>🔗</span>
              <span className="font-semibold">Submit Reply Link</span>
              <span className="text-primary/45 font-medium text-[12px]">for tracking</span>
            </div>

            {/* Input — white fill, 5% black border by default;
                when focused/pasted: 1px #111 inner border + 3px #FFE253 outer ring */}
            <div
              ref={inputRef}
              key={`input-${pasted}`}
              className="relative bg-white rounded-[10px] h-[44px] px-3.5 flex items-center text-[13px] transition-all duration-200"
              style={pasted
                ? {
                    border: "1px solid #111111",
                    boxShadow: "0 0 0 3px #FFE253",
                  }
                : {
                    border: "1px solid rgba(17,17,17,0.05)",
                  }
              }
            >
              {pasted ? (
                <span className="text-primary truncate" style={{ fontFamily: '"SF Mono", ui-monospace, Menlo, monospace' }}>
                  {url}
                </span>
              ) : (
                <span className="text-primary/35">https://x.com/r/.../comment/...</span>
              )}
            </div>

            {/* ⌘V keyboard hint chip */}
            <div className="flex items-center gap-2 mt-3.5 text-[11.5px] text-primary/55">
              <span>Paste with</span>
              <span
                key={`kbd-${keyDown}`}
                className={cn(
                  "inline-flex items-center gap-1 px-1.5 h-[20px] rounded-[5px] border bg-white font-semibold tabular-nums select-none transition-all duration-150",
                  keyDown
                    ? "border-primary/40 text-primary shadow-[inset_0_-1px_0_rgba(0,0,0,0.10)] translate-y-[1px]"
                    : "border-primary/15 text-primary/75 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
                )}
                style={{ fontFamily: '"SF Mono", ui-monospace, Menlo, monospace', fontSize: "11px" }}
              >
                ⌘
              </span>
              <span
                key={`kbd-v-${keyDown}`}
                className={cn(
                  "inline-flex items-center justify-center w-[20px] h-[20px] rounded-[5px] border bg-white font-semibold select-none transition-all duration-150",
                  keyDown
                    ? "border-primary/40 text-primary shadow-[inset_0_-1px_0_rgba(0,0,0,0.10)] translate-y-[1px]"
                    : "border-primary/15 text-primary/75 shadow-[0_1px_0_rgba(0,0,0,0.04)]"
                )}
                style={{ fontFamily: '"SF Mono", ui-monospace, Menlo, monospace', fontSize: "11px" }}
              >
                V
              </span>
            </div>

            {/* Save & finish button */}
            <div className="mt-4">
              <button
                ref={saveBtnRef}
                key={`save-${saveClicked}`}
                className={cn(
                  "w-full h-10 rounded-[10px] text-[13px] font-bold transition-colors duration-200 select-none",
                  saveClicked && "animate-click-press"
                )}
                style={{
                  transformOrigin: "center center",
                  background: canSave ? "#111111" : "rgba(17,17,17,0.22)",
                  color: "#FFFFFF",
                  cursor: canSave ? "pointer" : "not-allowed",
                }}
              >
                Save &amp; finish
              </button>
            </div>
          </div>
        )}

        {/* Hand cursor */}
        <div
          className="absolute pointer-events-none z-30"
          style={{
            left: `${cursorXY.x}px`,
            top: `${cursorXY.y}px`,
            transform: "translate(-9.7px, -1.4px)",
            transition: entered
              ? "left 650ms cubic-bezier(0.34,1.2,0.64,1), top 650ms cubic-bezier(0.34,1.2,0.64,1), opacity 180ms"
              : "none",
            opacity: entered ? 1 : 0,
          }}
        >
          <span
            key={`cursor-press-${saveClicked}`}
            className={cn("inline-block", saveClicked && "animate-click-press")}
            style={{ transformOrigin: "9.7px 1.4px" }}
          >
            <HandCursorPLT />
          </span>
        </div>

        {/* Progress dots — 4 phases */}
        <div className="flex items-center gap-1.5 mt-4 px-0.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className={cn(
                "h-[3px] rounded-full flex-1 transition-all duration-500",
                i <= phase ? "bg-primary" : "bg-primary/[0.10]"
              )}
            />
          ))}
        </div>

        {/* Status line */}
        <div className="flex items-center gap-2 mt-3 text-[13px] text-primary/75 min-h-[20px]">
          <I.Info className="w-3.5 h-3.5 text-primary/40 shrink-0" />
          <span key={status.txt} className="inline-flex items-center gap-1.5 animate-fade-in">
            <span aria-hidden className="text-[14px] leading-none">{status.emoji}</span>
            <span className={cn(showSuccess && "font-semibold text-primary")}>
              {status.txt}
            </span>
          </span>
        </div>
      </div>

    </div>
  );
};
