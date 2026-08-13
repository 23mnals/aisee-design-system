/* global React, window */
/* eslint-disable */
// ─────────────────────────────────────────────────────────────────────────────
// install-tutorial.jsx — v3
//
// 328 × 144 looping animation that teaches users how to install the aisee
// browser extension.
//
//   Phase 0  (2.8s)  "Get extensions"
//     - Stage shows only the Get-extensions button (no card chrome)
//     - Pointer-hand cursor flies in, clicks
//     - Click triggers a 700ms progress-bar fill inside the button
//     - aisee-extension.zip pops out from the button with a bouncy entrance
//
//   Phase 1  (3.0s)  "Drag onto chrome://extensions/"
//     - Stage cross-slides to a mock Chrome extensions page
//     - Cursor swaps to the arrow / drag cursor and grabs the .zip
//     - .zip is dragged across to the dashed drop zone
//
//   Phase 2  (1.8s)  "Installed"
//     - Drop zone becomes a Chrome-style installed-extension card with a
//       clearly visible blue toggle ON
// ─────────────────────────────────────────────────────────────────────────────

const { useState: useStateIT, useEffect: useEffectIT } = React;

const PHASE_MS_IT = [2800, 3000, 1800];
const STAGE_BG = "rgba(144, 120, 0, 0.10)"; // #907800 @ 10%
const LOGO_SRC = "engage-aisee-v2/aisee-logo.png";

// Pure state-at-time function for the MP4 recorder. Mirrors the timer
// choreography below but is fully deterministic.
function _easeOutCubic(p) { return 1 - Math.pow(1 - p, 3); }
function computeStateAt(t) {
  let phase = 0, downloading = false, downloaded = false, grabbed = false, hovering = false, dropped = false;
  let cursor = { x: 360, y: 130, op: 0 };
  if (t < 2800) {
    phase = 0;
    if (t < 60) { cursor = { x: 360, y: 130, op: 0 }; }
    else if (t < 680) {
      const p = (t - 60) / 620, e = _easeOutCubic(p);
      cursor = { x: 360 + (198 - 360) * e, y: 130 + (64 - 130) * e, op: Math.min(1, p * 2) };
    } else { cursor = { x: 198, y: 64, op: 1 }; }
    if (t >= 1100 && t < 2050) downloading = true;
    if (t >= 2050) downloaded = true;
  } else if (t < 5800) {
    phase = 1; downloaded = true;
    const lt = t - 2800;
    if (lt < 540) { cursor = { x: 198, y: 64, op: 1 }; }
    else if (lt < 1160) {
      const p = (lt - 540) / 620, e = _easeOutCubic(p);
      cursor = { x: 198 + (52 - 198) * e, y: 64 + (65 - 64) * e, op: 1 };
    } else if (lt < 1300) { cursor = { x: 52, y: 65, op: 1 }; }
    else {
      grabbed = true;
      if (lt < 1450) { cursor = { x: 52, y: 65, op: 1 }; }
      else if (lt < 2070) {
        const p = (lt - 1450) / 620, e = _easeOutCubic(p);
        cursor = { x: 52 + (180 - 52) * e, y: 65 + (70 - 65) * e, op: 1 };
      } else { cursor = { x: 180, y: 70, op: 1 }; }
      if (lt >= 1650 && lt < 2650) hovering = true;
      if (lt >= 2650) { dropped = true; hovering = false; }
    }
  } else {
    phase = 2; downloaded = true; grabbed = true; dropped = true;
    const lt = t - 5800;
    if (lt < 100) { cursor = { x: 180, y: 70, op: 1 }; }
    else if (lt < 320) { cursor = { x: 180, y: 70, op: 1 - (lt - 100) / 220 }; }
    else { cursor = { x: 180, y: 70, op: 0 }; }
  }
  return { phase, downloading, downloaded, grabbed, hovering, dropped, cursor };
}

// ── Pointer-hand cursor (fingertip hot-point at 9.7, 1.4 in 24×27 px) ─────
function HandPointer() {
  return (
    <svg width="22" height="25" viewBox="0 0 136 154" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)]" aria-hidden>
      <path
        d="M64.9993 133.957L16.8522 88.1394L24.6178 71.0548L47.1383 88.1394V16.0142H61.1165L64.9993 50.2811L89.8494 53.9704L105.381 58.6299H119.359V116.872L96.062 133.957H64.9993Z"
        fill="#FFFFFF"
      />
      <path
        d="M111.22 55.6912V55.6813C118.333 55.6813 123.542 61.4068 123.542 68.4715V94.0321C123.542 118.19 120.175 137.774 83.8817 137.774C67.9998 137.774 60.4872 134.603 53.9297 129.257C53.0513 128.731 52.2383 128.103 51.5076 127.386L15.5444 91.6493C9.42018 85.5201 12.2214 76.9047 16.5143 72.6216C20.7974 68.3287 29.6934 67.6247 34.7297 72.6216L42.5328 80.41V20.7805C42.5471 17.3782 43.9117 14.1209 46.3267 11.7244C48.7416 9.3279 52.0093 7.98832 55.4116 8.00008C62.5253 8.00008 67.8669 13.7158 67.8669 20.7805V43.7576C69.7343 42.7536 71.8218 42.2292 73.9419 42.2315C79.6036 42.2315 83.9998 45.8647 85.7278 50.8961C87.6971 49.6801 90.0848 48.9565 92.5857 48.9565C98.2472 48.9565 102.634 52.5896 104.362 57.6308C106.3 56.3647 108.565 55.6907 110.88 55.6912H111.224H111.22ZM116.743 94.0321V94.0518H116.773V69.2887C116.773 62.9971 110.86 63.2432 110.86 63.2432C107.493 63.2432 104.987 65.9508 104.987 69.2887V82.5908H104.918C104.961 82.8148 104.984 83.0422 104.987 83.2702C104.993 83.7096 104.912 84.1459 104.748 84.5536C104.584 84.9613 104.341 85.3323 104.032 85.6449C103.723 85.9574 103.355 86.2053 102.949 86.3741C102.544 86.5428 102.108 86.629 101.669 86.6277C101.169 86.6286 100.675 86.5185 100.223 86.3053C99.7705 86.0921 99.3712 85.7812 99.0538 85.395C98.7363 85.0088 98.5086 84.5569 98.3869 84.072C98.2653 83.587 98.2529 83.0811 98.3506 82.5908H98.2818V63.0758C98.2818 57.4093 92.1868 57.0253 92.1868 57.0253C88.8196 57.0253 86.4268 59.7378 86.4268 63.0758V78.5687H86.3481C86.4466 79.0587 86.4349 79.5645 86.314 80.0494C86.193 80.5344 85.9658 80.9864 85.6487 81.3727C85.3316 81.7591 84.9326 82.0701 84.4806 82.2833C84.0285 82.4965 83.5347 82.6066 83.0349 82.6056C82.535 82.6065 82.0411 82.4963 81.5889 82.2831C81.1367 82.07 80.7374 81.759 80.42 81.3728C80.1025 80.9866 79.8748 80.5347 79.7532 80.0498C79.6316 79.5649 79.6192 79.059 79.7168 78.5687H79.6478V56.3656C79.6478 50.2266 73.6762 50.3102 73.6762 50.3102C70.3087 50.3102 67.8669 53.018 67.8669 56.3656V73.1828H67.8029C67.9017 73.6741 67.8898 74.1812 67.768 74.6672C67.6462 75.1533 67.4177 75.6061 67.0989 75.9927C66.7802 76.3794 66.3793 76.6901 65.9254 76.9024C65.4715 77.1146 64.976 77.2231 64.4749 77.2198C63.975 77.2207 63.4811 77.1106 63.0289 76.8974C62.5766 76.6842 62.1774 76.3733 61.8599 75.987C61.5425 75.6008 61.3147 75.1489 61.1931 74.664C61.0716 74.179 61.0591 73.6731 61.1568 73.1828H61.0928V22.1391C61.0928 18.8013 58.7888 16.0838 55.4214 16.0838C52.0442 16.0838 49.3168 18.8013 49.3168 22.1392V96.666C43.1629 90.5613 37.0189 84.4468 30.8749 78.3373C28.4922 75.9742 23.9678 76.0628 21.5063 78.5342C19.0497 80.9958 18.2866 84.8407 21.2946 87.8586L55.3328 121.675C61.6491 127.947 69.9888 131.039 83.8621 131.039C116.645 131.039 116.743 114.473 116.743 94.0321Z"
        fill="#141414"
      />
    </svg>
  );
}

// ── Arrow / drag cursor (user-supplied v2 — compact 12×12 source) ─────────
// Tip ≈ (3.3, 1.8) in viewBox 12 → at 26 displayed → (7.2, 3.9)
function ArrowCursor() {
  return (
    <svg width="26" height="26" viewBox="0 0 12 12" className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)]" aria-hidden>
      <path
        d="M3.27452 1.8291L3.07392 7.41047C3.0699 7.52148 3.10469 7.63041 3.17231 7.71853L3.20861 7.76056C3.29027 7.84442 3.39989 7.89536 3.51663 7.90372C3.63338 7.91209 3.74914 7.87729 3.84192 7.80594L4.83822 7.04033L6.03607 9.79519C6.06109 9.85271 6.0972 9.90473 6.14233 9.94829C6.18746 9.99186 6.24073 10.0261 6.2991 10.0491C6.35746 10.072 6.41978 10.0833 6.4825 10.0822C6.54521 10.0811 6.60709 10.0676 6.66461 10.0426L7.75977 9.56689L7.80944 9.54158C7.91058 9.48271 7.98658 9.38877 8.02303 9.27757C8.05948 9.16637 8.05384 9.04567 8.00718 8.93835L6.80932 6.18301L8.04921 5.97668C8.13849 5.96166 8.22166 5.92158 8.28903 5.8611C8.3564 5.80062 8.4052 5.72223 8.42972 5.63508C8.45425 5.54793 8.4535 5.45561 8.42757 5.36887C8.40163 5.28213 8.35158 5.20454 8.28324 5.14516L4.06449 1.48522C3.99639 1.42624 3.91299 1.38773 3.82394 1.37413C3.73488 1.36053 3.64379 1.37239 3.56119 1.40835C3.47859 1.4443 3.40784 1.50289 3.35712 1.57734C3.30639 1.65179 3.27776 1.73907 3.27452 1.8291Z"
        fill="white"
      />
      <path
        d="M3.97231 2.354L7.43022 5.3534L6.23906 5.55209L6.19464 5.56259C6.14619 5.57716 6.10138 5.60182 6.06315 5.63496C6.02492 5.66809 5.99415 5.70895 5.97285 5.75484C5.95155 5.80073 5.94021 5.8506 5.93959 5.90119C5.93896 5.95178 5.94905 6.00192 5.96921 6.04833L7.25494 9.00474L6.59774 9.29036L5.31249 6.33394L5.29147 6.29334C5.26554 6.25 5.23073 6.21263 5.18933 6.18369C5.14793 6.15475 5.10088 6.1349 5.05127 6.12542C5.00166 6.11595 4.9506 6.11708 4.90145 6.12873C4.85231 6.14039 4.80618 6.1623 4.7661 6.19304L3.80753 6.92856L3.97231 2.354Z"
        fill="#111"
      />
    </svg>
  );
}

// ── Puzzle-line icon (user-supplied) — for the Get-extensions button ─────
const PuzzleLine = ({ size = 14, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
    <path
      d="M11.8079 13.6004V9.79239L12.4093 9.89265C13.5016 10.0746 14.4959 9.23235 14.4959 8.12501V7.87577C14.4959 6.76843 13.5016 5.92611 12.4093 6.10816L11.8079 6.20839V2.40039H8.21047L8.27555 3.07581C8.36794 4.03457 7.61424 4.86439 6.65104 4.86439C5.69135 4.86439 4.93882 4.04035 5.02571 3.08459L5.08791 2.40039H1.50391V13.6004H11.8079Z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

// ── aisee-extension.zip file icon ─────────────────────────────────────────
function ZipFileIcon({ glowing }) {
  const { cn } = window;
  return (
    <div className="flex flex-col items-center gap-[3px]">
      <div
        className={cn(
          "relative w-[46px] h-[52px] rounded-[5px] bg-white border border-primary/[0.12] flex items-center justify-center transition-shadow",
          glowing ? "shadow-[0_10px_26px_rgba(0,0,0,0.22)]" : "shadow-[0_2px_6px_rgba(0,0,0,0.10)]"
        )}
      >
        <span
          className="absolute top-0 right-0 w-[10px] h-[10px]"
          style={{
            background: "rgba(144,120,0,0.18)",
            clipPath: "polygon(100% 0, 100% 100%, 0 0)",
            borderTopRightRadius: "5px",
          }}
        />
        <img src={LOGO_SRC} alt="" className="w-[26px] h-[26px] object-contain -mt-0.5" />
        <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 text-[6.5px] font-mono font-bold text-primary/45 leading-none tracking-wider">ZIP</span>
      </div>
      <span className="text-[7.5px] font-mono font-medium text-primary/70 leading-none whitespace-nowrap">aisee-extension.zip</span>
    </div>
  );
}

// ── Toggle ON (Chrome style — bigger, brighter blue) ──────────────────────
function ToggleOn() {
  return (
    <span
      className="relative w-[28px] h-[16px] rounded-full inline-flex items-center shrink-0"
      style={{ backgroundColor: "#1A73E8" }}
    >
      <span
        className="absolute right-[2px] top-1/2 -translate-y-1/2 w-[12px] h-[12px] rounded-full bg-white"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.25)" }}
      />
    </span>
  );
}

// ── Keyframes injected once into <head> ───────────────────────────────────
function useInstallTutorialKeyframes() {
  useEffectIT(() => {
    const id = "install-tutorial-keyframes";
    if (document.getElementById(id)) return;
    const s = document.createElement("style");
    s.id = id;
    s.textContent = `
      @keyframes filePop {
        0%   { transform: translateY(-12px); opacity: 0; }
        100% { transform: translateY(0); opacity: 1; }
      }
    `;
    document.head.appendChild(s);
  }, []);
}

// ── Main Install Tutorial ─────────────────────────────────────────────────
window.InstallTutorial = function InstallTutorial() {
  const { cn } = window;
  useInstallTutorialKeyframes();

  const [phase, setPhase]           = useStateIT(0);
  const [downloading, setDownloading] = useStateIT(false); // animates the bar inside the button
  const [downloaded, setDownloaded]   = useStateIT(false); // file present
  const [grabbed, setGrabbed]       = useStateIT(false);
  const [hovering, setHovering]     = useStateIT(false);
  const [dropped, setDropped]       = useStateIT(false);
  const [cursor, setCursor]         = useStateIT({ x: 360, y: 130, op: 0, snap: true });
  const [pressKey, setPressKey]     = useStateIT(0);
  const [runId, setRunId]           = useStateIT(0);
  const [, _forceTick]              = useStateIT(0);

  // Recorder-mode override: when window.__captureT is set, all state is computed
  // deterministically from that timestamp (driven by the MP4 recorder's
  // requestAnimationFrame loop) instead of from the real-time setTimeouts.
  useEffectIT(() => {
    if (typeof window === "undefined") return;
    window.__installTutorialSetCaptureT = (t) => {
      window.__captureT = t;
      _forceTick((k) => k + 1);
    };
    return () => { try { delete window.__installTutorialSetCaptureT; } catch (_) {} };
  }, []);
  const isCapture = typeof window !== "undefined" && window.__captureT != null;
  let _phase = phase, _downloading = downloading, _downloaded = downloaded;
  let _grabbed = grabbed, _hovering = hovering, _dropped = dropped, _cursor = cursor;
  if (isCapture) {
    const s = computeStateAt(window.__captureT);
    _phase = s.phase; _downloading = s.downloading; _downloaded = s.downloaded;
    _grabbed = s.grabbed; _hovering = s.hovering; _dropped = s.dropped;
    _cursor = { ...s.cursor, snap: true };
  }

  // Phase loop
  useEffectIT(() => {
    if (isCapture) return;
    const t = setTimeout(() => setPhase((p) => (p + 1) % 3), PHASE_MS_IT[phase]);
    return () => clearTimeout(t);
  }, [phase, isCapture]);

  // Per-phase choreography
  useEffectIT(() => {
    if (isCapture) return;
    if (typeof window !== "undefined") {
      window.__installTutorialResetAndPlay = () => {
        setPhase(0);
        setDownloading(false);
        setDownloaded(false);
        setGrabbed(false);
        setHovering(false);
        setDropped(false);
        setCursor({ x: 360, y: 130, op: 0, snap: true });
        setPressKey((k) => k + 1);
        setRunId((r) => r + 1);
      };
    }
    const timers = [];

    if (phase === 0) {
      setDownloading(false);
      setDownloaded(false);
      setGrabbed(false);
      setHovering(false);
      setDropped(false);
      setCursor({ x: 360, y: 130, op: 0, snap: true });
      // Cursor flies in to the button
      timers.push(setTimeout(() => setCursor({ x: 198, y: 64, op: 1, snap: false }), 60));
      // Click → start downloading
      timers.push(setTimeout(() => {
        setPressKey((k) => k + 1);
        setDownloading(true);
      }, 1100));
      // Hold the clicked-button state visible longer so the press frame
      // is reliably captured by html-to-image (~10fps capture rate)
      timers.push(setTimeout(() => {
        setDownloading(false);
        setDownloaded(true);
      }, 2050));
    }

    if (phase === 1) {
      // Cursor lands ON the .zip file so the grab happens in place (no jump)
      timers.push(setTimeout(() => setCursor({ x: 52, y: 65, op: 1, snap: false }), 540));
      // Grab — cursor swaps to arrow / drag cursor, file stays put (offset keeps it pinned)
      timers.push(setTimeout(() => {
        setPressKey((k) => k + 1);
        setGrabbed(true);
      }, 1300));
      // Drag directly into the drop zone center
      timers.push(setTimeout(() => setCursor({ x: 180, y: 70, op: 1, snap: false }), 1450));
      // Drop zone lights up as soon as the file enters it
      timers.push(setTimeout(() => setHovering(true), 1650));
      // Drop
      timers.push(setTimeout(() => {
        setPressKey((k) => k + 1);
        setDropped(true);
        setHovering(false);
      }, 2650));
    }

    if (phase === 2) {
      timers.push(setTimeout(() => setCursor((c) => ({ ...c, op: 0, snap: false })), 100));
    }

    return () => timers.forEach(clearTimeout);
  }, [phase, runId, isCapture]);

  // .zip file position + scale + opacity
  let fileVisible = false;
  let fileX = 0, fileY = 0;
  let fileScale = 1;
  let fileOpacity = 1;
  let filePopAnim = false;
  if (_phase === 0 && _downloaded) {
    fileVisible = true;
    fileX = 140;
    fileY = 94;
    filePopAnim = !isCapture;
  } else if (_phase === 1) {
    fileVisible = true;
    if (!_grabbed) {
      fileX = 36; fileY = 70;
    } else if (!_dropped) {
      fileX = _cursor.x - 16;
      fileY = _cursor.y + 5;
      fileScale = 0.92;
    } else {
      fileX = _cursor.x - 16;
      fileY = _cursor.y + 5;
      fileScale = 1;
      fileOpacity = 0;
    }
  }

  const cursorTranslate = _grabbed ? "translate(-7.2px, -3.9px)" : "translate(-9.7px, -1.4px)";

  return (
    <div
      className="relative w-[328px] h-[160px] overflow-hidden select-none font-karla"
      style={{ backgroundColor: STAGE_BG }}
    >
      {/* ── SCENE A — just the Get-extensions button ─────────────────── */}
      <div
        className="absolute inset-0 transition-transform duration-[560ms] ease-[cubic-bezier(0.65,0,0.35,1)] flex items-center justify-center"
        style={{ transform: _phase === 0 ? "translateX(0)" : "translateX(-100%)", transition: isCapture ? "none" : undefined }}
      >
        <div className="-translate-y-[14px]">
          <button
            key={`dl-${pressKey}-${_phase}`}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 h-[36px] rounded-[10px] text-primary text-[13px] font-semibold whitespace-nowrap shadow-[0_2px_8px_rgba(144,120,0,0.18)]",
              !isCapture && (_downloading || _downloaded) && "animate-click-press"
            )}
            style={{ backgroundColor: "#FFF2B3", transform: isCapture && _downloading ? "scale(0.94)" : undefined }}
          >
            <PuzzleLine size={14} />
            <span className="whitespace-nowrap">Get extension</span>
          </button>
        </div>
      </div>

      {/* ── SCENE B — Chrome extensions page ─────────────────────────── */}
      <div
        className="absolute inset-0 transition-transform duration-[560ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
        style={{ transform: _phase === 0 ? "translateX(100%)" : "translateX(0)", transition: isCapture ? "none" : undefined }}
      >
        <div className="w-full h-full bg-white p-[12px] flex flex-col gap-1.5">
          {/* Faux Chrome URL bar */}
          <div className="h-[22px] rounded-full bg-gray-f5f5f5 px-2.5 inline-flex items-center gap-1.5 shrink-0">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-primary/35">
              <rect x="3" y="6" width="10" height="7" rx="1.5"/>
              <path d="M5.5 6V4.5a2.5 2.5 0 0 1 5 0V6"/>
            </svg>
            <span className="text-[9.5px] text-primary/70 font-mono tracking-tight whitespace-nowrap">chrome://extensions/</span>
            <span className="flex-1" />
            <span className="text-[8.5px] text-primary/35 font-medium whitespace-nowrap">Developer mode</span>
            <span className="relative w-[16px] h-[8px] rounded-full shrink-0" style={{ backgroundColor: "#1A73E8" }}>
              <span className="absolute right-[1.5px] top-1/2 -translate-y-1/2 w-[5px] h-[5px] rounded-full bg-white" />
            </span>
          </div>

          {/* Drop zone OR installed card */}
          <div className="flex-1 relative">
            {!_dropped && (
              <div
                className={cn(
                  "absolute inset-0 rounded-[8px] border-[1.5px] border-dashed transition-all duration-200 inline-flex items-center justify-center gap-1.5",
                  _hovering ? "border-primary/45" : "border-primary/15 bg-gray-fafafa"
                )}
                style={_hovering ? { backgroundColor: "rgba(144,120,0,0.10)" } : undefined}
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className={cn(_hovering ? "text-primary" : "text-primary/40")}>
                  <path d="M8 11V3"/>
                  <path d="M4.5 6.5 8 3l3.5 3.5"/>
                  <path d="M3 13h10"/>
                </svg>
                <span className={cn("text-[10px] font-medium tracking-tight whitespace-nowrap", _hovering ? "text-primary" : "text-primary/45")}>
                  {_hovering ? "Release to install" : "Drop installer here"}
                </span>
              </div>
            )}
            {_dropped && <InstalledCard suppressAnim={isCapture} />}
          </div>
        </div>
      </div>

      {/* ── Floating .zip file — outer handles position/opacity/entrance ── */}
      {fileVisible && (
        <div
          className="absolute z-20 pointer-events-none"
          style={{
            left: `${fileX}px`,
            top: `${fileY}px`,
            opacity: fileOpacity,
            transition: isCapture
              ? "none"
              : "left 600ms cubic-bezier(0.22, 1, 0.36, 1), top 600ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms ease",
            animation: filePopAnim ? "filePop 420ms cubic-bezier(0.22, 1, 0.36, 1) both" : undefined,
          }}
        >
          {/* inner handles scale only — no transform conflict with the entrance animation */}
          <div
            style={{
              transform: `scale(${fileScale})`,
              transformOrigin: "center top",
              transition: isCapture ? "none" : "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <ZipFileIcon glowing={_grabbed && !_dropped} />
          </div>
        </div>
      )}

      {/* ── Cursor (pointer hand ↔ arrow/drag cursor) ────────────────── */}
      <div
        className="absolute z-30 pointer-events-none"
        style={{
          left: `${_cursor.x}px`,
          top: `${_cursor.y}px`,
          opacity: _cursor.op,
          transition: isCapture || _cursor.snap
            ? "none"
            : "left 620ms cubic-bezier(0.34,1.2,0.64,1), top 620ms cubic-bezier(0.34,1.2,0.64,1), opacity 220ms",
          transform: cursorTranslate,
        }}
      >
        <span
          key={`press-${pressKey}`}
          className={cn("inline-block", !isCapture && "animate-click-press")}
          style={{ transformOrigin: _grabbed ? "7.2px 3.9px" : "9.7px 1.4px" }}
        >
          {_grabbed ? <ArrowCursor /> : <HandPointer />}
        </span>
      </div>

      {/* ── Step dots ────────────────────────────────────────────────── */}
      <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 flex items-center gap-1 z-40">
        {[0, 1].map((i) => {
          const active = (i === 0 && _phase === 0) || (i === 1 && _phase >= 1);
          return (
            <span
              key={i}
              className={cn(
                "h-[2.5px] rounded-full transition-all duration-300",
                active ? "w-4 bg-primary/80" : "w-2 bg-primary/15"
              )}
            />
          );
        })}
      </div>
    </div>
  );
};

// ── Installed extension card (Chrome-style) ───────────────────────────────
function InstalledCard({ suppressAnim }) {
  const { cn } = window;
  return (
    <div className={cn("absolute inset-0 rounded-[8px] border border-primary/[0.08] bg-white p-2.5 flex gap-2.5 shadow-[0_1px_3px_rgba(0,0,0,0.03)]", !suppressAnim && "animate-fade-in")}>
      <div className="relative shrink-0 w-[38px] h-[38px]">
        <img src={LOGO_SRC} alt="" className="w-[38px] h-[38px] object-contain animate-target-pulse" />
        <span className="absolute -bottom-0.5 -right-0.5 w-[12px] h-[12px] rounded-full bg-white flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.18)]">
          <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#5a8b00" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m2 6.4 2.6 2.6L10 3"/>
          </svg>
        </span>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-[2px] pt-[1px]">
        <div className="flex items-center gap-1.5">
          <span className="text-[11.5px] font-semibold text-primary leading-tight">Aisee</span>
          <span className="text-[10px] text-primary/45 leading-tight tabular-nums">1.0.3</span>
          <span className="flex-1" />
          <ToggleOn />
        </div>
        <div className="text-[9.5px] text-primary/65 leading-[1.35] truncate">Your ultimate social media scheduling tool</div>
        <div className="text-[8.5px] font-mono text-primary/40 leading-tight truncate">ID: mlfcicmmfffjnaohkbfjbhbgbjjaeiak</div>
        <div className="flex items-center gap-1 mt-[2px]">
          <span className="text-[8.5px] text-blue-4398ff font-medium px-1.5 py-[1px] rounded-full border border-blue-4398ff/35 leading-none">Details</span>
          <span className="text-[8.5px] text-blue-4398ff font-medium px-1.5 py-[1px] rounded-full border border-blue-4398ff/35 leading-none">Remove</span>
        </div>
      </div>
    </div>
  );
}
