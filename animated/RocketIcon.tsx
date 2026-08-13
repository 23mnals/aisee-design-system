'use client'

import React from 'react'

/**
 * RocketIcon — your original rocket-plane geometry (Lottie export), pointing
 * up-right at 45°. The rocket BODY never moves. The motion comes from:
 *   • Exhaust flame — elastic burst out + spring + contraction (engine firing)
 *   • Porthole window — opacity flicker
 *   • Two speed lines — stream backward (down-left) parallel to the 45° axis
 *
 * Geometry is verbatim from the source SVG, so the shape is unchanged.
 * Color = currentColor (black by default; override via `color`).
 *
 * Drive from a parent's hover by adding `hover-trigger` to the parent.
 */

const css = `
.rocket-icon { display:inline-block; color:currentColor; cursor:pointer; line-height:0; }
.rocket-icon svg { display:block; overflow:visible; }

.rocket-icon svg .r-flame  { transform-box: fill-box; transform-origin: 50% 0%; transform: scaleY(1); }
.rocket-icon svg .r-window { transform-box: fill-box; transform-origin: 50% 50%; }
.rocket-icon svg .r-speed  { opacity: 0; }

.rocket-icon:hover svg .r-flame,
[hover-trigger]:hover .rocket-icon svg .r-flame {
  animation: rocket-flame 850ms cubic-bezier(.34,1.56,.64,1) infinite;
}
.rocket-icon:hover svg .r-window,
[hover-trigger]:hover .rocket-icon svg .r-window {
  animation: rocket-window 850ms ease-in-out infinite;
}
.rocket-icon:hover svg .r-speed-1,
[hover-trigger]:hover .rocket-icon svg .r-speed-1 {
  animation: rocket-speed 950ms cubic-bezier(.45,0,.55,1) infinite;
}
.rocket-icon:hover svg .r-speed-2,
[hover-trigger]:hover .rocket-icon svg .r-speed-2 {
  animation: rocket-speed 950ms cubic-bezier(.45,0,.55,1) infinite;
  animation-delay: -475ms;
}

@keyframes rocket-flame {
  0%   { transform: scaleY(0.45); }
  22%  { transform: scaleY(1.28); }
  40%  { transform: scaleY(0.82); }
  58%  { transform: scaleY(1.12); }
  74%  { transform: scaleY(0.94); }
  88%  { transform: scaleY(1.02); }
  100% { transform: scaleY(0.45); }
}
@keyframes rocket-window {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.2; }
}
@keyframes rocket-speed {
  0%   { opacity: 0; transform: translate(40px, -40px); stroke-dasharray: 4 40; }
  15%  { opacity: 1; }
  50%  { stroke-dasharray: 34 40; }
  85%  { opacity: 1; }
  100% { opacity: 0; transform: translate(-40px, 40px); stroke-dasharray: 5 40; }
}

@media (prefers-reduced-motion: reduce) {
  .rocket-icon svg * { animation: none !important; transform: none !important; }
  .rocket-icon svg .r-speed { opacity: 0; }
}
`

export function RocketIcon({
  size = 24,
  ...props
}: { size?: number } & Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'>) {
  return (
    <span className="rocket-icon" aria-hidden="true">
      <style>{css}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 240"
        width={size}
        height={size}
        fill="none"
        {...props}
      >
        {/* exhaust flame (nudged down-left along axis so its top sits flush with the body) */}
        <g transform="matrix(7.0710678,7.0710678,-7.0710678,7.0710678,68.4,171.6)">
          <g className="r-flame">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M0.008,2.992 C0.141,2.798 2,0.068 2,-0.997 C2,-2.102 1.105,-2.997 0,-2.997 C-1.105,-2.997 -2,-2.102 -2,-0.997 C-2,0.068 -0.141,2.798 -0.008,2.992 C-0.004,2.998 0.004,2.998 0.008,2.992z"
            />
          </g>
        </g>
        {/* rocket body */}
        <g transform="matrix(7.0710678,7.0710678,-7.0710678,7.0710678,137.74130249023438,102.38597106933594)">
          <g>
            <path
              className="r-body"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.943,5.5 C6.667,5 5.234,3.99 5.333,3.5 C6.943,-4.5 0.742,-8.5 0,-8.5 C-0.742,-8.5 -6.943,-4.5 -5.333,3.5 C-5.234,3.99 -6.667,5 -6.943,5.5 C-7.219,6 -6.257,8.5 -5.795,8.5 C-5.333,8.5 -1.992,6.5 0,6.5 C2.992,6.5 5.333,8.5 5.795,8.5 C6.257,8.5 7.219,6 6.943,5.5z"
            />
          </g>
        </g>
        {/* porthole window */}
        <g transform="matrix(7.0710678,7.0710678,-7.0710678,7.0710678,141.19906616210938,98.80094146728516)">
          <g className="r-window">
            <path
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M0,-1 C0.552,-1 1,-0.552 1,0 C1,0.552 0.552,1 0,1 C-0.552,1 -1,0.552 -1,0 C-1,-0.552 -0.552,-1 0,-1z"
            />
          </g>
        </g>
        {/* speed lines: one on each flank, parallel to the 45° flight axis */}
        <g className="r-speed r-speed-1">{/* lower-right flank */}
          <line x1="191" y1="177" x2="213" y2="155" pathLength="32" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
        </g>
        <g className="r-speed r-speed-2">{/* upper-left flank */}
          <line x1="62" y1="48" x2="84" y2="26" pathLength="32" stroke="currentColor" strokeWidth="15" strokeLinecap="round" />
        </g>
      </svg>
    </span>
  )
}
