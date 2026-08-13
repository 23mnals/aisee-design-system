/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// update-tutorial.jsx
//
// 328 × 160 looping animation teaching users how to UPDATE the aisee browser
// extension to a new version. Single deterministic clock (computeStateAt) drives
// both the live rAF loop and the MP4 recorder, so the preview and the exported
// video are frame-for-frame identical.
//
//   Step 0  (2.8s)  "Update extension"
//     - Only the Update-extension button on stage
//     - Pointer cursor flies in, clicks → new aisee-extension.zip pops out
//
//   Step 1  (2.8s)  "Remove the old version"
//     - Cross-slides to chrome://extensions/ showing the OLD card (v1.1)
//     - Cursor clicks "Remove" → old card disappears → empty drop zone
//
//   Step 2  (2.8s + 1.8s)  "Drag the new package in"
//     - Cursor swaps to the drag/arrow cursor, grabs the parked .zip
//     - Drags it onto the drop zone → new card installs (v2.4, "Updated ✓")
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateUT, useEffect: useEffectUT } = React;

const UT_TOTAL   = 11400;          // 2800 + 4000 + 2800 + 1800
const UT_STAGE_BG = "rgba(144, 120, 0, 0.10)"; // #907800 @ 10%
const UT_LOGO    = "engage-aisee-v2/aisee-logo.png";

function _eo(p) { return 1 - Math.pow(1 - p, 3); }
function _lerp(a, b, p) { return a + (b - a) * p; }

// ── Single source of truth: full animation state at time t (ms) ───────────
function computeUpdateStateAt(t) {
  t = ((t % UT_TOTAL) + UT_TOTAL) % UT_TOTAL;
  let phase = 0, scene = 0, content = "old", hovering = false;
  let cursor = { x: 360, y: 130, op: 0, kind: "pointer", clicking: false };
  let file = { visible: false, x: 0, y: 0, scale: 1, op: 1 };
  let buttonPressing = false, removePulse = false, removeHover = false, dialog = false, dialogConfirmPulse = false, dialogT = 0;

  if (t < 2800) {
    // ── Step 0 — click Update extension ──
    phase = 0; scene = 0;
    if (t < 60) cursor = { x: 360, y: 130, op: 0, kind: "pointer" };
    else if (t < 680) {
      const p = (t - 60) / 620, e = _eo(p);
      cursor = { x: _lerp(360, 176, e), y: _lerp(130, 64, e), op: Math.min(1, p * 2), kind: "pointer" };
    } else cursor = { x: 176, y: 64, op: 1, kind: "pointer" };
    buttonPressing = t >= 1100 && t < 2050;
    cursor.clicking = t >= 1100 && t < 1280;
    if (t >= 2050) {
      const p = Math.min(1, (t - 2050) / 300);
      file = { visible: true, x: 140, y: 94 - (1 - _eo(p)) * 10, scale: 1, op: p };
    }
  } else if (t < 6800) {
    // ── Step 1 — remove the old version (with confirm dialog) ──
    phase = 1; scene = 1; content = "old";
    const lt = t - 2800; // 0 → 4000
    file = { visible: true, x: 250, y: 93, scale: 1, op: 1 }; // new zip parked bottom-right
    // 1) fly to the card's Remove chip and click it
    if (lt < 60) cursor = { x: 176, y: 64, op: 1, kind: "pointer" };
    else if (lt < 720) {
      const p = (lt - 60) / 660, e = _eo(p);
      cursor = { x: _lerp(176, 140, e), y: _lerp(64, 106, e), op: 1, kind: "pointer" };
    } else if (lt < 1280) cursor = { x: 140, y: 106, op: 1, kind: "pointer" };
    // 2) confirm dialog up; move to its blue Remove button
    else if (lt < 1900) {
      const p = (lt - 1280) / 620, e = _eo(p);
      cursor = { x: _lerp(140, 239, e), y: _lerp(106, 87, e), op: 1, kind: "pointer" };
    } else if (lt < 2700) cursor = { x: 239, y: 87, op: 1, kind: "pointer" };
    // 3) dialog gone, card removed; drift toward the parked zip
    else if (lt < 3400) {
      const p = (lt - 2700) / 700, e = _eo(p);
      cursor = { x: _lerp(239, 266, e), y: _lerp(87, 88, e), op: 1, kind: "pointer" };
    } else cursor = { x: 266, y: 88, op: 1, kind: "pointer" };

    removePulse = lt >= 1100 && lt < 1280;            // click the card's Remove chip
    removeHover = lt >= 700 && lt < 1280;             // highlight the instant the cursor reaches Remove
    dialog = lt >= 1160 && lt < 2520;                 // confirm dialog visible
    if (dialog) dialogT = Math.min(1, (lt - 1160) / 260); // smooth entrance progress
    dialogConfirmPulse = lt >= 2320 && lt < 2500;     // click the dialog's blue Remove
    cursor.clicking = (lt >= 1100 && lt < 1280) || (lt >= 2320 && lt < 2500);
    if (lt >= 2520) content = "dropzone";             // old card removed only after confirm
  } else if (t < 9600) {
    // ── Step 2 — drag the new package in ──
    phase = 2; scene = 1; content = "dropzone";
    const lt = t - 6800;
    const grabbed = lt >= 340;
    if (lt < 340) cursor = { x: 266, y: 88, op: 1, kind: "pointer" };
    else if (lt < 1460) {
      const p = (lt - 340) / 1120, e = _eo(p);
      cursor = { x: _lerp(266, 180, e), y: _lerp(88, 70, e), op: 1, kind: "arrow" };
    } else cursor = { x: 180, y: 70, op: 1, kind: "arrow" };
    cursor.clicking = lt >= 340 && lt < 500;
    hovering = lt >= 1660 && lt < 2660;
    const dropped = lt >= 2660;
    if (dropped) content = "new";
    file.visible = !dropped;
    if (!grabbed) { file = { visible: true, x: 250, y: 93, scale: 1, op: 1 }; }
    else { file = { visible: !dropped, x: cursor.x - 16, y: cursor.y + 5, scale: 0.92, op: 1 }; }
  } else {
    // ── Settle — updated card on screen, cursor fades out ──
    phase = 2; scene = 1; content = "new";
    const lt = t - 9600;
    if (lt < 100) cursor = { x: 180, y: 70, op: 1, kind: "arrow" };
    else if (lt < 320) cursor = { x: 180, y: 70, op: 1 - (lt - 100) / 220, kind: "arrow" };
    else cursor = { x: 180, y: 70, op: 0, kind: "arrow" };
    file.visible = false;
  }
  return { phase, scene, content, hovering, cursor, file, buttonPressing, removePulse, removeHover, dialog, dialogConfirmPulse, dialogT };
}

// ── Pointer-hand cursor (fingertip hot-point 9.7,1.4) ─────────────────────
function UTHandPointer() {
  return (
    <svg width="22" height="25" viewBox="0 0 136 154" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)]" aria-hidden>
      <path d="M64.9993 133.957L16.8522 88.1394L24.6178 71.0548L47.1383 88.1394V16.0142H61.1165L64.9993 50.2811L89.8494 53.9704L105.381 58.6299H119.359V116.872L96.062 133.957H64.9993Z" fill="#FFFFFF"/>
      <path d="M111.22 55.6912V55.6813C118.333 55.6813 123.542 61.4068 123.542 68.4715V94.0321C123.542 118.19 120.175 137.774 83.8817 137.774C67.9998 137.774 60.4872 134.603 53.9297 129.257C53.0513 128.731 52.2383 128.103 51.5076 127.386L15.5444 91.6493C9.42018 85.5201 12.2214 76.9047 16.5143 72.6216C20.7974 68.3287 29.6934 67.6247 34.7297 72.6216L42.5328 80.41V20.7805C42.5471 17.3782 43.9117 14.1209 46.3267 11.7244C48.7416 9.3279 52.0093 7.98832 55.4116 8.00008C62.5253 8.00008 67.8669 13.7158 67.8669 20.7805V43.7576C69.7343 42.7536 71.8218 42.2292 73.9419 42.2315C79.6036 42.2315 83.9998 45.8647 85.7278 50.8961C87.6971 49.6801 90.0848 48.9565 92.5857 48.9565C98.2472 48.9565 102.634 52.5896 104.362 57.6308C106.3 56.3647 108.565 55.6907 110.88 55.6912H111.224H111.22ZM116.743 94.0321V94.0518H116.773V69.2887C116.773 62.9971 110.86 63.2432 110.86 63.2432C107.493 63.2432 104.987 65.9508 104.987 69.2887V82.5908H104.918C104.961 82.8148 104.984 83.0422 104.987 83.2702C104.993 83.7096 104.912 84.1459 104.748 84.5536C104.584 84.9613 104.341 85.3323 104.032 85.6449C103.723 85.9574 103.355 86.2053 102.949 86.3741C102.544 86.5428 102.108 86.629 101.669 86.6277C101.169 86.6286 100.675 86.5185 100.223 86.3053C99.7705 86.0921 99.3712 85.7812 99.0538 85.395C98.7363 85.0088 98.5086 84.5569 98.3869 84.072C98.2653 83.587 98.2529 83.0811 98.3506 82.5908H98.2818V63.0758C98.2818 57.4093 92.1868 57.0253 92.1868 57.0253C88.8196 57.0253 86.4268 59.7378 86.4268 63.0758V78.5687H86.3481C86.4466 79.0587 86.4349 79.5645 86.314 80.0494C86.193 80.5344 85.9658 80.9864 85.6487 81.3727C85.3316 81.7591 84.9326 82.0701 84.4806 82.2833C84.0285 82.4965 83.5347 82.6066 83.0349 82.6056C82.535 82.6065 82.0411 82.4963 81.5889 82.2831C81.1367 82.07 80.7374 81.759 80.42 81.3728C80.1025 80.9866 79.8748 80.5347 79.7532 80.0498C79.6316 79.5649 79.6192 79.059 79.7168 78.5687H79.6478V56.3656C79.6478 50.2266 73.6762 50.3102 73.6762 50.3102C70.3087 50.3102 67.8669 53.018 67.8669 56.3656V73.1828H67.8029C67.9017 73.6741 67.8898 74.1812 67.768 74.6672C67.6462 75.1533 67.4177 75.6061 67.0989 75.9927C66.7802 76.3794 66.3793 76.6901 65.9254 76.9024C65.4715 77.1146 64.976 77.2231 64.4749 77.2198C63.975 77.2207 63.4811 77.1106 63.0289 76.8974C62.5766 76.6842 62.1774 76.3733 61.8599 75.987C61.5425 75.6008 61.3147 75.1489 61.1931 74.664C61.0716 74.179 61.0591 73.6731 61.1568 73.1828H61.0928V22.1391C61.0928 18.8013 58.7888 16.0838 55.4214 16.0838C52.0442 16.0838 49.3168 18.8013 49.3168 22.1392V96.666C43.1629 90.5613 37.0189 84.4468 30.8749 78.3373C28.4922 75.9742 23.9678 76.0628 21.5063 78.5342C19.0497 80.9958 18.2866 84.8407 21.2946 87.8586L55.3328 121.675C61.6491 127.947 69.9888 131.039 83.8621 131.039C116.645 131.039 116.743 114.473 116.743 94.0321Z" fill="#141414"/>
    </svg>
  );
}

// ── Arrow / drag cursor (tip 7.2,3.9) ─────────────────────────────────────
function UTArrowCursor() {
  return (
    <svg width="26" height="26" viewBox="0 0 12 12" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)]" aria-hidden>
      <path d="M3.27452 1.8291L3.07392 7.41047C3.0699 7.52148 3.10469 7.63041 3.17231 7.71853L3.20861 7.76056C3.29027 7.84442 3.39989 7.89536 3.51663 7.90372C3.63338 7.91209 3.74914 7.87729 3.84192 7.80594L4.83822 7.04033L6.03607 9.79519C6.06109 9.85271 6.0972 9.90473 6.14233 9.94829C6.18746 9.99186 6.24073 10.0261 6.2991 10.0491C6.35746 10.072 6.41978 10.0833 6.4825 10.0822C6.54521 10.0811 6.60709 10.0676 6.66461 10.0426L7.75977 9.56689L7.80944 9.54158C7.91058 9.48271 7.98658 9.38877 8.02303 9.27757C8.05948 9.16637 8.05384 9.04567 8.00718 8.93835L6.80932 6.18301L8.04921 5.97668C8.13849 5.96166 8.22166 5.92158 8.28903 5.8611C8.3564 5.80062 8.4052 5.72223 8.42972 5.63508C8.45425 5.54793 8.4535 5.45561 8.42757 5.36887C8.40163 5.28213 8.35158 5.20454 8.28324 5.14516L4.06449 1.48522C3.99639 1.42624 3.91299 1.38773 3.82394 1.37413C3.73488 1.36053 3.64379 1.37239 3.56119 1.40835C3.47859 1.4443 3.40784 1.50289 3.35712 1.57734C3.30639 1.65179 3.27776 1.73907 3.27452 1.8291Z" fill="white"/>
      <path d="M3.97231 2.354L7.43022 5.3534L6.23906 5.55209L6.19464 5.56259C6.14619 5.57716 6.10138 5.60182 6.06315 5.63496C6.02492 5.66809 5.99415 5.70895 5.97285 5.75484C5.95155 5.80073 5.94021 5.8506 5.93959 5.90119C5.93896 5.95178 5.94905 6.00192 5.96921 6.04833L7.25494 9.00474L6.59774 9.29036L5.31249 6.33394L5.29147 6.29334C5.26554 6.25 5.23073 6.21263 5.18933 6.18369C5.14793 6.15475 5.10088 6.1349 5.05127 6.12542C5.00166 6.11595 4.9506 6.11708 4.90145 6.12873C4.85231 6.14039 4.80618 6.1623 4.7661 6.19304L3.80753 6.92856L3.97231 2.354Z" fill="#111"/>
    </svg>
  );
}

// ── Puzzle-line icon (Update-extension button) ────────────────────────────
const UTPuzzle = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path d="M11.8079 13.6004V9.79239L12.4093 9.89265C13.5016 10.0746 14.4959 9.23235 14.4959 8.12501V7.87577C14.4959 6.76843 13.5016 5.92611 12.4093 6.10816L11.8079 6.20839V2.40039H8.21047L8.27555 3.07581C8.36794 4.03457 7.61424 4.86439 6.65104 4.86439C5.69135 4.86439 4.93882 4.04035 5.02571 3.08459L5.08791 2.40039H1.50391V13.6004H11.8079Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"/>
  </svg>
);

// ── Update arrows badge (for the button + version pill) ───────────────────
const UTRefresh = ({ size = 12, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13.5 4.5A6 6 0 0 0 3 5.2"/>
    <path d="M13 2v3h-3"/>
    <path d="M2.5 11.5A6 6 0 0 0 13 10.8"/>
    <path d="M3 14v-3h3"/>
  </svg>
);

// ── New-version aisee-extension.zip icon ──────────────────────────────────
function UTZipFile({ glowing }) {
  const { cn } = window;
  return (
    <div className="flex flex-col items-center gap-[3px]">
      <div className={cn(
        "relative w-[46px] h-[52px] rounded-[5px] bg-white border border-primary/[0.12] flex items-center justify-center transition-shadow",
        glowing ? "shadow-[0_10px_26px_rgba(0,0,0,0.22)]" : "shadow-[0_2px_6px_rgba(0,0,0,0.10)]"
      )}>
        <span className="absolute top-0 right-0 w-[10px] h-[10px]" style={{ background: "rgba(144,120,0,0.18)", clipPath: "polygon(100% 0, 100% 100%, 0 0)", borderTopRightRadius: "5px" }}/>
        <img src={UT_LOGO} alt="" className="w-[26px] h-[26px] object-contain -mt-0.5"/>
        <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 text-[6.5px] font-mono font-bold text-primary/45 leading-none tracking-wider">ZIP</span>
      </div>
      <span className="text-[7.5px] font-mono font-medium text-primary/70 leading-none whitespace-nowrap">aisee-extension.zip</span>
    </div>
  );
}

function UTToggleOn() {
  return (
    <span className="relative w-[28px] h-[16px] rounded-full inline-flex items-center shrink-0" style={{ backgroundColor: "#1A73E8" }}>
      <span className="absolute right-[2px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full bg-white" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }}/>
    </span>
  );
}

// ── Old extension card (v1.1, with a targetable Remove chip) ──────────────
function UTOldCard({ removePulse, removeHover }) {
  const { cn } = window;
  const lit = removeHover || removePulse;
  return (
    <div className="absolute inset-0 rounded-[8px] border border-primary/[0.08] bg-white p-2.5 flex gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <img src={UT_LOGO} alt="" className="shrink-0 w-[38px] h-[38px] object-contain opacity-80"/>
      <div className="flex-1 min-w-0 flex flex-col gap-[2px] pt-[1px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[11.5px] font-semibold text-primary leading-tight">Aisee</span>
          <span className="text-[9px] font-semibold leading-none px-1 py-[1px] rounded-full bg-gray-f5f5f5 text-primary/55 tabular-nums">v1.1</span>
          <span className="flex-1" />
          <UTToggleOn />
        </div>
        <div className="text-[9.5px] text-primary/65 leading-[1.35] truncate">Your ultimate social media scheduling tool</div>
        <div className="text-[8.5px] font-mono text-primary/40 leading-tight truncate">ID: mlfcicmmfffjnaohkbfjbhbgbjjaeiak</div>
        <div className="flex items-center gap-1 mt-[2px]">
          <span className="text-[8.5px] text-blue-4398ff font-medium px-1.5 py-[1px] rounded-full border border-blue-4398ff/35 leading-none">Details</span>
          <span
            className="text-[8.5px] font-semibold px-1.5 py-[1px] rounded-full leading-none border"
            style={{
              color: "#d4380d",
              borderColor: lit ? "rgba(212,56,13,0.7)" : "rgba(212,56,13,0.4)",
              backgroundColor: removePulse ? "rgba(212,56,13,0.18)" : (removeHover ? "rgba(212,56,13,0.08)" : "transparent"),
              transform: removePulse ? "scale(0.9)" : (removeHover ? "scale(1.05)" : "scale(1)"),
              boxShadow: removeHover && !removePulse ? "0 1px 4px rgba(212,56,13,0.2)" : "none",
            }}
          >Remove</span>
        </div>
      </div>
    </div>
  );
}

// ── New extension card (v2.4 — "Updated ✓") ───────────────────────────────
function UTNewCard({ suppressAnim }) {
  const { cn } = window;
  return (
    <div className={cn("absolute inset-0 rounded-[8px] border border-primary/[0.08] bg-white p-2.5 flex gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]", !suppressAnim && "animate-fade-in")}>
      <div className="relative shrink-0 w-[38px] h-[38px]">
        <img src={UT_LOGO} alt="" className={cn("w-[38px] h-[38px] object-contain", !suppressAnim && "animate-target-pulse")}/>
        <span className="absolute -bottom-0.5 -right-0.5 w-[12px] h-[12px] rounded-full bg-white flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.18)]">
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#5a8b00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m2 6.4 2.6 2.6L10 3"/></svg>
        </span>
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-[2px] pt-[1px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[11.5px] font-semibold text-primary leading-tight">Aisee</span>
          <span className="inline-flex items-center gap-[4px] text-[9px] font-bold leading-none px-[6px] py-[3px] rounded-full tabular-nums" style={{ backgroundColor: "#e9f7e3", color: "#5a8b00" }}>
            <UTRefresh size={8} /> v2.4
          </span>
          <span className="flex-1" />
          <UTToggleOn />
        </div>
        <div className="text-[9.5px] leading-[1.35] truncate font-semibold inline-flex items-center gap-[3px]" style={{ color: "#5a8b00" }}>
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 6.4 2.6 2.6L10 3"/></svg>
          Updated to v2.4
        </div>
        <div className="text-[8.5px] font-mono text-primary/40 leading-tight truncate">ID: mlfcicmmfffjnaohkbfjbhbgbjjaeiak</div>
        <div className="flex items-center gap-1 mt-[2px]">
          <span className="text-[8.5px] text-blue-4398ff font-medium px-1.5 py-[1px] rounded-full border border-blue-4398ff/35 leading-none">Details</span>
          <span className="text-[8.5px] text-blue-4398ff font-medium px-1.5 py-[1px] rounded-full border border-blue-4398ff/35 leading-none">Remove</span>
        </div>
      </div>
    </div>
  );
}

// ── Main Update Tutorial ──────────────────────────────────────────────────
window.UpdateTutorial = function UpdateTutorial() {
  const { cn } = window;
  const [now, setNow] = useStateUT(0);
  const [, _tick] = useStateUT(0);

  // Recorder hook: when window.__captureT is set, that timestamp drives state.
  // Notify EVERY mounted instance via a shared event (multiple instances can
  // coexist on a preview page; the setter is global so it must broadcast).
  useEffectUT(() => {
    if (typeof window === "undefined") return;
    window.__updateTutorialSetCaptureT = (t) => {
      window.__captureT = t;
      window.dispatchEvent(new Event("ut-capture"));
    };
    const onCap = () => _tick((k) => k + 1);
    window.addEventListener("ut-capture", onCap);
    return () => { window.removeEventListener("ut-capture", onCap); };
  }, []);
  const isCapture = typeof window !== "undefined" && window.__captureT != null;

  // Live mode: continuous rAF clock looping 0 → UT_TOTAL.
  useEffectUT(() => {
    if (isCapture) return;
    let raf, start = null;
    const loop = (ts) => {
      if (start == null) start = ts;
      setNow((ts - start) % UT_TOTAL);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isCapture]);

  const t = isCapture ? window.__captureT : now;
  const s = computeUpdateStateAt(t);
  const { cursor, file } = s;
  const cursorTranslate = cursor.kind === "arrow" ? "translate(-7.2px, -3.9px)" : "translate(-9.7px, -1.4px)";

  return (
    <div className="relative w-[328px] h-[160px] overflow-hidden select-none font-karla" style={{ backgroundColor: UT_STAGE_BG }}>
      {/* ── SCENE A — Update-extension button ── */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ transform: s.scene === 0 ? "translateX(0)" : "translateX(-100%)" }}>
        <div className="-translate-y-[14px]">
          <button
            className="relative inline-flex items-center gap-1.5 px-4 h-[36px] rounded-[10px] text-[13px] font-semibold whitespace-nowrap"
            style={{ backgroundColor: "#FFF3E0", border: "1px solid rgba(203,139,35,0.12)", color: "#AD6B00", transform: s.buttonPressing ? "scale(0.94)" : "scale(1)", transformOrigin: "center" }}
          >
            <UTPuzzle size={14} />
            <span className="whitespace-nowrap">Update extension</span>
            {/* red notification dot — inside the button so it presses together */}
            <span
              className="absolute -top-[3px] -right-[3px] w-[8px] h-[8px] rounded-full"
              style={{ backgroundColor: "#EC5212", boxShadow: "0 0 0 1.5px rgba(238,240,236,1)" }}
            />
          </button>
        </div>
      </div>

      {/* ── SCENE B — chrome://extensions/ ── */}
      <div className="absolute inset-0" style={{ transform: s.scene === 0 ? "translateX(100%)" : "translateX(0)" }}>
        <div className="w-full h-full bg-white p-[12px] flex flex-col gap-1.5">
          {/* URL bar */}
          <div className="h-[22px] rounded-full bg-gray-f5f5f5 px-2.5 inline-flex items-center gap-1.5 shrink-0">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-primary/35">
              <rect x="3" y="6" width="10" height="7" rx="1.5"/><path d="M5.5 6V4.5a2.5 2.5 0 0 1 5 0V6"/>
            </svg>
            <span className="text-[9.5px] text-primary/70 font-mono tracking-tight whitespace-nowrap">chrome://extensions/</span>
            <span className="flex-1" />
            <span className="text-[8.5px] text-primary/35 font-medium whitespace-nowrap">Developer mode</span>
            <span className="relative w-[16px] h-[8px] rounded-full shrink-0" style={{ backgroundColor: "#1A73E8" }}>
              <span className="absolute right-[1.5px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-white" />
            </span>
          </div>

          {/* Content: old card → drop zone → new card */}
          <div className="flex-1 relative">
            {s.content === "old" && <UTOldCard removePulse={s.removePulse} removeHover={s.removeHover} />}
            {s.content === "dropzone" && (
              <div
                className={cn(
                  "absolute inset-0 rounded-[8px] border-[1.5px] border-dashed transition-colors duration-150 inline-flex items-center justify-center gap-1.5",
                  s.hovering ? "border-primary/45" : "border-primary/15 bg-gray-fafafa"
                )}
                style={s.hovering ? { backgroundColor: "rgba(144,120,0,0.10)" } : undefined}
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cn(s.hovering ? "text-primary" : "text-primary/40")}>
                  <path d="M8 11V3"/><path d="M4.5 6.5 8 3l3.5 3.5"/><path d="M3 13h10"/>
                </svg>
                <span className={cn("text-[10px] font-medium tracking-tight whitespace-nowrap", s.hovering ? "text-primary" : "text-primary/45")}>
                  {s.hovering ? "Release to update" : "Drop new version here"}
                </span>
              </div>
            )}
            {s.content === "new" && <UTNewCard suppressAnim={isCapture} />}
          </div>
        </div>

        {/* ── Remove confirmation dialog (Chrome-style) ── */}
        {s.dialog && (() => {
          const de = 1 - Math.pow(1 - s.dialogT, 3);   // eased entrance 0→1
          return (
          <>
            <div className="absolute inset-0 z-10" style={{ backgroundColor: `rgba(17,17,17,${0.18 * de})` }} />
            <div
              className="absolute z-10 rounded-[10px] bg-white px-3 py-2.5 flex flex-col gap-2 shadow-[0_10px_30px_rgba(0,0,0,0.22)] border border-primary/[0.06]"
              style={{
                top: "38px", left: "50%", width: "238px",
                opacity: de,
                transform: `translateX(-50%) translateY(${(1 - de) * -7}px) scale(${0.9 + de * 0.1})`,
                transformOrigin: "top center",
              }}
            >
              <div className="flex items-center gap-2">
                <img src={UT_LOGO} alt="" className="w-[22px] h-[22px] object-contain shrink-0" />
                <span className="text-[12px] font-semibold text-primary leading-tight whitespace-nowrap">Remove &ldquo;Aisee&rdquo;?</span>
              </div>
              <div className="flex items-center justify-end gap-1.5">
                <span className="text-[10.5px] font-medium px-2.5 py-[3px] rounded-full bg-gray-f5f5f5 text-primary/70 leading-none">Cancel</span>
                <span
                  className="text-[10.5px] font-semibold px-2.5 py-[3px] rounded-full text-white leading-none transition-transform"
                  style={{ backgroundColor: "#1A73E8", transform: s.dialogConfirmPulse ? "scale(0.9)" : "scale(1)", boxShadow: s.dialogConfirmPulse ? "0 0 0 3px rgba(26,115,232,0.25)" : "none" }}
                >Remove</span>
              </div>
            </div>
          </>
          );
        })()}
      </div>

      {/* ── Floating .zip ── */}
      {file.visible && (
        <div className="absolute z-20 pointer-events-none" style={{ left: `${file.x}px`, top: `${file.y}px`, opacity: file.op }}>
          <div style={{ transform: `scale(${file.scale})`, transformOrigin: "center top" }}>
            <UTZipFile glowing={file.scale < 1} />
          </div>
        </div>
      )}

      {/* ── Cursor ── */}
      <div className="absolute z-30 pointer-events-none" style={{ left: `${cursor.x}px`, top: `${cursor.y}px`, opacity: cursor.op, transform: cursorTranslate }}>
        <span className="inline-block" style={{ transform: cursor.clicking ? "scale(0.86)" : "scale(1)", transformOrigin: cursor.kind === "arrow" ? "7.2px 3.9px" : "9.7px 1.4px" }}>
          {cursor.kind === "arrow" ? <UTArrowCursor /> : <UTHandPointer />}
        </span>
      </div>

      {/* ── Step dots (3) ── */}
      <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 flex items-center gap-1 z-40">
        {[0, 1, 2].map((i) => {
          const active = (i === 0 && s.phase === 0) || (i === 1 && s.phase === 1) || (i === 2 && s.phase >= 2);
          return <span key={i} className={cn("h-[2.5px] rounded-full transition-all duration-300", active ? "w-4 bg-primary/80" : "w-2 bg-primary/15")} />;
        })}
      </div>
    </div>
  );
};
