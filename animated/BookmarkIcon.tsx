import React from "react";

/**
 * Animated bookmark / save ("标签 / 收藏") icon.
 *
 * On hover (the SVG itself, OR any ancestor with class `bookmark-trigger`):
 *   The outline bookmark pivots at its top-center hanging point and the
 *   bottom V-notch swings left↔right like a pendulum, decaying to rest —
 *   a playful little wag. The top edge stays fixed.
 *
 * Usage:
 *   <BookmarkIcon />                  // 24px, currentColor
 *   <BookmarkIcon size={16} />
 *
 *   <button className="bookmark-trigger">
 *     <BookmarkIcon /> Save
 *   </button>
 */

export interface BookmarkIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size (width = height). Default 24. */
  size?: number | string;
  /** Stroke color. Default `currentColor`. */
  color?: string;
  /** Stroke width in viewBox units (24×24). Default 2. */
  strokeWidth?: number;
  /** One full cycle in ms. Default 1600. */
  duration?: number;
  /** Disable the hover animation. */
  disabled?: boolean;
}

const STYLE_ID = "bookmark-icon-anim-styles";

const CSS = `
.bookmark-icon{
  display:inline-block;
  vertical-align:middle;
  overflow:visible;
}
.bookmark-icon .bm-shape{
  transform-box:view-box;
  transform-origin:12px 3px;           /* top-center hanging point */
}

/* Hover on the icon itself OR on any ancestor with .bookmark-trigger */
.bookmark-icon:hover .bm-shape,
.bookmark-trigger:hover .bookmark-icon .bm-shape{
  animation:bookmark-wag var(--bookmark-duration,1600ms) cubic-bezier(.36,.07,.19,.97) infinite;
}

.bookmark-icon[data-disabled="true"] *{
  animation:none !important;
  transform:none !important;
}

/* Playful pendulum wag: top fixed, the notch swings L↔R, decaying to rest */
@keyframes bookmark-wag{
  0%   { transform:rotate(0deg);   }
  8%   { transform:rotate(0deg);   }   /* anticipation */
  22%  { transform:rotate(11deg);  }   /* swing right */
  40%  { transform:rotate(-8deg);  }   /* swing left  */
  56%  { transform:rotate(5deg);   }
  70%  { transform:rotate(-3deg);  }
  82%  { transform:rotate(1.5deg); }
  92%  { transform:rotate(0deg);   }   /* settle */
  100% { transform:rotate(0deg);   }   /* rest before repeat */
}

@media (prefers-reduced-motion: reduce){
  .bookmark-icon *{ animation:none !important; transform:none !important; }
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

const PATH = "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z";

export const BookmarkIcon: React.FC<BookmarkIconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  duration = 1600,
  disabled = false,
  className,
  style,
  ...rest
}) => {
  useBookmarkStyles();

  return (
    <svg
      className={["bookmark-icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-disabled={disabled ? "true" : undefined}
      style={{ ["--bookmark-duration" as any]: `${duration}ms`, ...style }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      <path className="bm-shape" d={PATH} />
    </svg>
  );
};

export default BookmarkIcon;
