'use client'

import React from 'react'

/**
 * FeedIcon — voice / "now playing" indicator.
 *
 * Idle: 5 symmetric vertical bars (outer→center: short→tall).
 * Hover: each bar pulses scaleY around its own center, with a phase
 * delay propagating from the OUTER bars inward to the CENTER bar —
 * giving a "wave coming in" feel rather than uniform scaling.
 *
 * Pass `hover-trigger` on a parent element (e.g. a button) to drive
 * the animation from that parent's hover state instead of the icon
 * itself.
 */

const css = `
.feed-icon { display:inline-block; color:currentColor; cursor:pointer; }
.feed-icon svg { display:block; overflow:visible; }

/* each bar pulses around its own midpoint (y = 8) */
.feed-icon svg .feed-bar { transform-box: view-box; }
.feed-icon svg .feed-bar.b-outer-l  { transform-origin: 3px    8px; }
.feed-icon svg .feed-bar.b-mid-l    { transform-origin: 5.5px  8px; }
.feed-icon svg .feed-bar.b-center   { transform-origin: 8px    8px; }
.feed-icon svg .feed-bar.b-mid-r    { transform-origin: 10.5px 8px; }
.feed-icon svg .feed-bar.b-outer-r  { transform-origin: 13px   8px; }

/* hover triggers — covers BOTH self-hover and parent[hover-trigger]:hover */
.feed-icon:hover svg .feed-bar,
[hover-trigger]:hover .feed-icon svg .feed-bar {
  /* linear easing on a sine-shaped curve = continuously smooth velocity,
     no hitches at peaks/troughs */
  animation: feed-pulse 1400ms linear infinite;
}

/* phase offsets: outer first → center last (wave travels inward) */
.feed-icon:hover svg .b-outer-l,
.feed-icon:hover svg .b-outer-r,
[hover-trigger]:hover .feed-icon svg .b-outer-l,
[hover-trigger]:hover .feed-icon svg .b-outer-r { animation-delay: 0ms;   }

.feed-icon:hover svg .b-mid-l,
.feed-icon:hover svg .b-mid-r,
[hover-trigger]:hover .feed-icon svg .b-mid-l,
[hover-trigger]:hover .feed-icon svg .b-mid-r   { animation-delay: 140ms; }

.feed-icon:hover svg .b-center,
[hover-trigger]:hover .feed-icon svg .b-center  { animation-delay: 280ms; }

/* Sine-shaped scaleY: 1 → 1.22 → 1 → 0.6 → 1.
   Many small steps make the curve continuous so linear timing feels organic. */
@keyframes feed-pulse {
  0%   { transform: scaleY(1);    }
  12.5%{ transform: scaleY(1.17); }
  25%  { transform: scaleY(1.22); }   /* tall peak */
  37.5%{ transform: scaleY(1.13); }
  50%  { transform: scaleY(1);    }   /* through rest */
  62.5%{ transform: scaleY(0.78); }
  75%  { transform: scaleY(0.6);  }   /* short trough */
  87.5%{ transform: scaleY(0.78); }
  100% { transform: scaleY(1);    }
}

@media (prefers-reduced-motion: reduce) {
  .feed-icon:hover svg .feed-bar,
  [hover-trigger]:hover .feed-icon svg .feed-bar { animation: none; }
}
`

export function FeedIcon({
  size = 16,
  ...props
}: { size?: number } & Omit<React.SVGProps<SVGSVGElement>, 'width' | 'height'>) {
  return (
    <span className="feed-icon" aria-hidden="true">
      <style>{css}</style>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width={size}
        height={size}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        {...props}
      >
        {/* 5 bars, drawn from each line's TOP to BOTTOM (vertical) */}
        <line className="feed-bar b-outer-l" x1="3"    y1="6.7"  x2="3"    y2="9.3" />
        <line className="feed-bar b-mid-l"   x1="5.5"  y1="4.82" x2="5.5"  y2="11.18" />
        <line className="feed-bar b-center"  x1="8"    y1="3.04" x2="8"    y2="13" />
        <line className="feed-bar b-mid-r"   x1="10.5" y1="4.82" x2="10.5" y2="11.18" />
        <line className="feed-bar b-outer-r" x1="13"   y1="6.7"  x2="13"   y2="9.3" />
      </svg>
    </span>
  )
}
