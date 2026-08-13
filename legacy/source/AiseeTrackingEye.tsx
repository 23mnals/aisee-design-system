// AiseeTrackingEye.tsx
// Drop-in React + TypeScript component. No deps. Pure CSS animation.
//
// The aisee "tracking eye" — the yellow dome mascot with a dark pupil that
// scans left↔right and blinks. Used wherever aisee is actively monitoring
// something (hosted reply tracking, source scanning, live sync).
//
// Usage:
//   import AiseeTrackingEye from './AiseeTrackingEye';
//   <AiseeTrackingEye />                              // 80×56 default
//   <AiseeTrackingEye size={160} />                   // scaled (keeps 80:56 ratio)
//   <AiseeTrackingEye size={120} ariaLabel="Scanning sources" />
//   <AiseeTrackingEye float={false} />                // disable the idle bob
//
// ── Animation notes (why it's built this way) ────────────────────────────
// The pupil is a rounded rect clipped to an ALMOND-shaped path (`-almond`).
// The almond is ~26px wide; the pupil ~11.8px, so the pupil center has only
// ~7px of horizontal clearance before it touches the clip edge. If the pupil
// travels further than that, the clip slices it into a thin crescent near the
// almond's pointed corners — that stray sliver reads as a "second eye" for a
// frame or two. Fix: cap pupil travel at ±6px and keep vertical movement at 0
// so it never rides into the narrow pointed ends. DO NOT raise the ±6 above ±7.

import React from 'react';

const css = `
@keyframes aisee-float {
  0%, 100% { transform: translateY(0); }
  50%      { transform: translateY(-2px); }
}
@keyframes aisee-pupil {
  0%        { transform: translate(  0px, 0px); }
  14%, 28%  { transform: translate( -6px, 0px); }
  50%       { transform: translate(  1px, 0px); }
  64%, 78%  { transform: translate(  6px, 0px); }
  92%       { transform: translate( -2px, 0px); }
  100%      { transform: translate(  0px, 0px); }
}
@keyframes aisee-blink {
  0%, 88%, 100% { transform: scaleY(0); }
  92%, 94%      { transform: scaleY(1); }
  97%           { transform: scaleY(0); }
}
.aisee-eye { display: inline-block; line-height: 0; }
.aisee-eye.aisee-eye--float { animation: aisee-float 4.6s ease-in-out infinite; }
.aisee-eye svg { width: 100%; height: 100%; display: block; }
.aisee-eye .aisee-pupil {
  transform-box: fill-box; transform-origin: center;
  animation: aisee-pupil 6.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}
.aisee-eye .aisee-lid {
  transform-box: fill-box; transform-origin: center top;
  transform: scaleY(0);
  animation: aisee-blink 5.6s ease-in-out infinite;
}
@media (prefers-reduced-motion: reduce) {
  .aisee-eye,
  .aisee-eye .aisee-pupil,
  .aisee-eye .aisee-lid { animation: none; }
}
`;

// Singleton style injection so multiple instances share one <style> tag.
let injected = false;
function useStyles(): void {
  if (typeof document === 'undefined' || injected) return;
  const tag = document.createElement('style');
  tag.setAttribute('data-aisee-eye', '');
  tag.textContent = css;
  document.head.appendChild(tag);
  injected = true;
}

// Unique-id helper so multiple instances on the page don't clash on clip IDs.
let _seq = 0;
const nextId = (): string => `aisee-${++_seq}`;

export interface AiseeTrackingEyeProps {
  /** Width in px; height is derived from the fixed 80:56 ratio. Default 80. */
  size?: number;
  /** Accessible label for the icon. Default "Tracking". */
  ariaLabel?: string;
  /** Extra class names on the wrapper. */
  className?: string;
  /** Inline style overrides on the wrapper. */
  style?: React.CSSProperties;
  /** Idle vertical bob. Default true. Set false inside dense UI (chips, rows). */
  float?: boolean;
}

export default function AiseeTrackingEye({
  size = 80,
  ariaLabel = 'Tracking',
  className = '',
  style = {},
  float = true,
}: AiseeTrackingEyeProps): JSX.Element {
  useStyles();

  const width = size;
  const height = Math.round(width * 56 / 80);

  // Stable per-instance clipPath IDs.
  const idRef = React.useRef<string | null>(null);
  if (!idRef.current) idRef.current = nextId();
  const uid = idRef.current;

  return (
    <span
      className={`aisee-eye ${float ? 'aisee-eye--float' : ''} ${className}`.trim()}
      role="img"
      aria-label={ariaLabel}
      style={{ width, height, ...style }}
    >
      <svg viewBox="0 0 80 56" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <clipPath id={`${uid}-outer`}>
            <ellipse cx="39.76" cy="28" rx="39.76" ry="28" />
          </clipPath>
          <clipPath id={`${uid}-rect`}>
            <rect x="27.0015" y="18.5996" width="26.2682" height="11.6658" />
          </clipPath>
          <clipPath id={`${uid}-almond`}>
            <path d="M27.0015 24.4125 C35.7612 16.662 44.5209 16.662 53.2806 24.4125 C44.5209 32.163 35.7612 32.163 27.0015 24.4125 Z" />
          </clipPath>
          <clipPath id={`${uid}-dome`}>
            <path d="M17.0737 32.0633 C17.0737 19.3258 27.3995 9 40.137 9 C52.8745 9 63.2003 19.3258 63.2003 32.0633 V57 H17.0737 Z" />
          </clipPath>
        </defs>

        {/* Black backing disc */}
        <ellipse cx="39.76" cy="28" rx="39.76" ry="28" fill="#111111" />

        <g clipPath={`url(#${uid}-outer)`}>
          {/* Yellow aisee dome */}
          <path
            d="M17.0737 32.0633 C17.0737 19.3258 27.3995 9 40.137 9 C52.8745 9 63.2003 19.3258 63.2003 32.0633 V57 H17.0737 Z"
            fill="#FFE253"
          />

          {/* Eye area: white sclera + tracking pupil (double-clipped to the almond) */}
          <g clipPath={`url(#${uid}-rect)`}>
            <g clipPath={`url(#${uid}-almond)`}>
              <rect x="27.0015" y="18.5996" width="26.2682" height="11.6658" fill="#FFFFFF" />
              <rect
                className="aisee-pupil"
                x="34.3008"
                y="14.6548"
                width="11.7675"
                height="11.6658"
                rx="5.83288"
                fill="#111111"
              />
            </g>
          </g>

          {/* Blink lid, clipped to dome shape */}
          <g clipPath={`url(#${uid}-dome)`}>
            <rect className="aisee-lid" x="27" y="16" width="26.27" height="15" fill="#FFE253" />
          </g>
        </g>
      </svg>
    </span>
  );
}
