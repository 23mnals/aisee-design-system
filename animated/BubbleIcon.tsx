import React from "react";

/**
 * Animated chat-bubble icon.
 *
 * On hover (the SVG itself, OR any ancestor with the class `bubble-trigger`)
 * the bubble sways gently around its tail and the two inner lines draw in
 * like a typing indicator.
 *
 * Usage:
 *   <BubbleIcon />                          // 16px, currentColor
 *   <BubbleIcon size={24} />
 *   <BubbleIcon size={48} color="#111" />
 *
 *   // trigger from a parent (e.g. a button row):
 *   <button className="bubble-trigger">
 *     <BubbleIcon /> Reply
 *   </button>
 */

export interface BubbleIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size (width = height). Default 16. */
  size?: number | string;
  /** Stroke color. Default `currentColor`. */
  color?: string;
  /** Stroke width in viewBox units (the icon is 16×16). Default 1. */
  strokeWidth?: number;
  /** Sway + draw-in cycle in ms. Default 1600. */
  duration?: number;
  /** Disable the hover animation (icon stays static). */
  disabled?: boolean;
}

const STYLE_ID = "bubble-icon-anim-styles";

const CSS = `
.bubble-icon{
  display:inline-block;
  vertical-align:middle;
  overflow:visible;
  transform-origin:20% 90%;            /* pivot ≈ tail of the bubble */
  transition:transform 240ms ease-out;
}
.bubble-icon .bubble-line-a,
.bubble-icon .bubble-line-b{
  stroke-dasharray:var(--len);
  stroke-dashoffset:0;                  /* default = lines visible (matches source SVG) */
}
.bubble-icon .bubble-line-a{ --len:4; }   /* M6.438 6 H10.438  → len 4 */
.bubble-icon .bubble-line-b{ --len:2; }   /* M6.438 8.8 H8.438 → len 2 */

/* Hover on the icon itself OR on any ancestor with .bubble-trigger */
.bubble-icon:hover,
.bubble-trigger:hover .bubble-icon{
  animation:bubble-sway var(--bubble-duration,1600ms) ease-in-out infinite;
}
.bubble-icon:hover .bubble-line-a,
.bubble-trigger:hover .bubble-icon .bubble-line-a{
  animation:bubble-line-draw var(--bubble-duration,1600ms) ease-in-out infinite;
}
.bubble-icon:hover .bubble-line-b,
.bubble-trigger:hover .bubble-icon .bubble-line-b{
  animation:bubble-line-draw var(--bubble-duration,1600ms) ease-in-out 120ms infinite;
}

.bubble-icon[data-disabled="true"],
.bubble-icon[data-disabled="true"]:hover,
.bubble-trigger:hover .bubble-icon[data-disabled="true"]{
  animation:none;
}
.bubble-icon[data-disabled="true"] .bubble-line-a,
.bubble-icon[data-disabled="true"] .bubble-line-b{
  stroke-dashoffset:0;                  /* show the lines when static */
}

@keyframes bubble-sway{
  0%   { transform:rotate(0deg)  scale(1);    }
  20%  { transform:rotate(-6deg) scale(1.04); }
  50%  { transform:rotate(0deg)  scale(1.02); }
  75%  { transform:rotate(4deg)  scale(1.04); }
  100% { transform:rotate(0deg)  scale(1);    }
}
@keyframes bubble-line-draw{
  0%   { stroke-dashoffset:0; }              /* visible */
  20%  { stroke-dashoffset:var(--len); }     /* wipe out */
  55%  { stroke-dashoffset:0; }              /* draw back in */
  100% { stroke-dashoffset:0; }              /* hold until next sway cycle */
}

@media (prefers-reduced-motion: reduce){
  .bubble-icon,
  .bubble-icon .bubble-line-a,
  .bubble-icon .bubble-line-b{ animation:none !important; }
  .bubble-icon .bubble-line-a,
  .bubble-icon .bubble-line-b{ stroke-dashoffset:0; }
}
`;

/** Inject the keyframes + base rules once per document. */
function useBubbleStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

export const BubbleIcon: React.FC<BubbleIconProps> = ({
  size = 16,
  color = "currentColor",
  strokeWidth = 1,
  duration = 1600,
  disabled = false,
  className,
  style,
  ...rest
}) => {
  useBubbleStyles();

  return (
    <svg
      className={["bubble-icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-disabled={disabled ? "true" : undefined}
      style={{ ["--bubble-duration" as any]: `${duration}ms`, ...style }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      <path d="M6.02809 12.6885L3.31809 14.4001L3.79289 11.4013C2.66649 10.3629 2.03809 8.9209 2.03809 7.3265C2.03809 4.1637 4.51089 1.6001 8.43809 1.6001C12.3653 1.6001 14.8381 4.1641 14.8381 7.3265C14.8381 10.4889 12.3653 13.0529 8.43809 13.0529C7.55809 13.0529 6.75089 12.9241 6.02809 12.6885Z" />
      <path className="bubble-line-a" d="M6.43799 6H10.438" />
      <path className="bubble-line-b" d="M6.43799 8.8H8.43799" />
    </svg>
  );
};

export default BubbleIcon;
