import React from "react";

/**
 * Animated bookmark / save icon — faithful to the supplied Lottie
 * ("01_Bookmark 2", 30fps, 31 frames).
 *
 * On hover (the SVG itself, OR any ancestor with class `bookmark-trigger`):
 *   A single closed stroked path morphs — the top two corners stay fixed
 *   while the bottom edge flexes left → right → left → home in a damped
 *   elastic sway (the side legs bend like rubber). Driven by animating the
 *   SVG `d` property between the exact Lottie keyframes, using the Lottie's
 *   own per-segment bezier easings.
 *
 * Note: relies on CSS `d`-property animation (Chromium / Safari).
 *
 * Usage:
 *   <BookmarkIcon2 />                 // 24px, currentColor
 *   <BookmarkIcon2 size={16} />
 *
 *   <button className="bookmark-trigger">
 *     <BookmarkIcon2 /> Save
 *   </button>
 */

export interface BookmarkIcon2Props extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size (width = height). Default 24. */
  size?: number | string;
  /** Stroke color. Default `currentColor`. */
  color?: string;
  /** One full sway cycle in ms. Default 1000. */
  duration?: number;
  /** Disable the hover animation. */
  disabled?: boolean;
}

const STYLE_ID = "bookmark-icon2-anim-styles";

// Exact Lottie path keyframes (viewBox 0 0 200 200)
const REST   = 'path("M 142.05 145.10 C 142.03 95.94 142.04 87.75 142.04 47.27 C 110.19 47.12 93.25 47.26 57.89 47.40 C 58.00 66.75 58.03 102.88 58.07 145.13 C 74.53 131.74 80.66 127.94 100.06 112.60 C 113.78 123.56 124.32 130.53 142.05 145.10 Z")';
const LEFT_A = 'path("M 127.98 157.44 C 139.24 111.75 142.04 87.75 142.04 47.27 C 110.19 47.12 93.25 47.26 57.89 47.40 C 58.00 66.75 56.24 98.50 45.62 136.43 C 64.66 127.07 72.34 123.14 94.69 112.54 C 108.24 125.75 116.99 138.50 127.98 157.44 Z")';
const RIGHT  = 'path("M 151.73 139.63 C 143.99 100.50 142.50 74.00 143.54 47.27 C 111.69 47.12 93.25 47.26 57.89 47.40 C 58.00 66.75 59.82 111.65 66.75 153.33 C 80.49 135.25 88.49 128.25 103.80 111.93 C 119.35 120.47 131.57 128.20 151.73 139.63 Z")';
const LEFT_B = 'path("M 138.97 149.20 C 142.85 100.19 142.04 87.75 142.04 47.27 C 110.19 47.12 93.25 47.26 57.89 47.40 C 58.00 66.75 57.48 100.37 54.17 142.49 C 71.86 130.47 78.47 125.55 99.28 111.82 C 112.26 123.84 122.22 133.25 138.97 149.20 Z")';
const REST_2 = 'path("M 142.05 145.16 C 142.03 96.00 142.04 87.75 142.04 47.27 C 110.19 47.12 93.25 47.26 57.89 47.40 C 58.00 66.75 58.03 102.94 58.07 145.19 C 74.53 131.80 80.66 127.88 100.06 112.54 C 113.78 123.50 124.32 130.60 142.05 145.16 Z")';

const CSS = `
.bookmark-icon2{ display:inline-block; vertical-align:middle; overflow:visible; }
.bookmark-icon2 .bm-shape{ d:${REST}; }

.bookmark-icon2:hover .bm-shape,
.bookmark-trigger:hover .bookmark-icon2 .bm-shape{
  animation:bookmark-morph var(--bookmark-duration,1000ms) linear infinite;
}
.bookmark-icon2[data-disabled="true"] .bm-shape{ animation:none !important; }

@keyframes bookmark-morph{
  0%     { d:${REST};   animation-timing-function:cubic-bezier(.167,0,.59,1);  }
  20.69% { d:${LEFT_A}; animation-timing-function:cubic-bezier(.434,0,.764,1); }
  44.83% { d:${RIGHT};  animation-timing-function:cubic-bezier(.414,0,.527,1); }
  72.41% { d:${LEFT_B}; animation-timing-function:cubic-bezier(.309,0,.6,1);   }
  100%   { d:${REST_2}; }
}

@media (prefers-reduced-motion: reduce){
  .bookmark-icon2 .bm-shape{ animation:none !important; }
}
`;

function useBookmarkStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

const D0 = "M 142.05 145.10 C 142.03 95.94 142.04 87.75 142.04 47.27 C 110.19 47.12 93.25 47.26 57.89 47.40 C 58.00 66.75 58.03 102.88 58.07 145.13 C 74.53 131.74 80.66 127.94 100.06 112.60 C 113.78 123.56 124.32 130.53 142.05 145.10 Z";

export const BookmarkIcon2: React.FC<BookmarkIcon2Props> = ({
  size = 24,
  color = "currentColor",
  duration = 1000,
  disabled = false,
  className,
  style,
  ...rest
}) => {
  useBookmarkStyles();

  return (
    <svg
      className={["bookmark-icon2", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      stroke={color}
      strokeWidth={15}
      strokeLinecap="butt"
      strokeLinejoin="miter"
      strokeMiterlimit={4}
      data-disabled={disabled ? "true" : undefined}
      style={{ ["--bookmark-duration" as any]: `${duration}ms`, ...style }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      <path className="bm-shape" d={D0} />
    </svg>
  );
};

export default BookmarkIcon2;
