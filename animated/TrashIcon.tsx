import React from "react";

/**
 * Animated trash / delete icon.
 *
 * On hover (the SVG itself, OR any ancestor with class `trash-trigger`):
 *   1. Lid lifts up-left, pivoting around its right end (~ -28°)
 *   2. A small speck flies up-right from the lid and fades out
 *   3. Lid snaps back shut with an ease-in
 *
 * The body, side walls, and the three inner lines never move.
 *
 * Usage:
 *   <TrashIcon />                     // 24px, currentColor
 *   <TrashIcon size={16} />
 *
 *   <button className="trash-trigger">
 *     <TrashIcon /> Delete
 *   </button>
 */

export interface TrashIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size (width = height). Default 24. */
  size?: number | string;
  /** Stroke color. Default `currentColor`. */
  color?: string;
  /** Stroke width in viewBox units (24×24). Default 2. */
  strokeWidth?: number;
  /** One full cycle in ms. Default 1300. */
  duration?: number;
  /** Disable the hover animation. */
  disabled?: boolean;
}

const STYLE_ID = "trash-icon-anim-styles";

const CSS = `
.trash-icon{
  display:inline-block;
  vertical-align:middle;
  overflow:visible;                    /* lid swings outside viewBox */
}
.trash-icon .trash-body{
  transform-box:view-box;
  transform-origin:12px 7px;           /* top-center: body stretches DOWN from here */
}
.trash-icon .trash-lid{
  transform-box:view-box;              /* coords in viewBox units (more reliable than fill-box on <g>) */
  transform-origin:21px 7px;           /* RIGHT END of the lid bar */
}
.trash-icon .trash-speck{
  transform-box:view-box;
  transform-origin:10px 11px;          /* top of LEFT inner line — scaleY/dash grow DOWN from here */
  opacity:0;
  stroke-dasharray:0.01 6;             /* default: tiny round-cap dot (looks like a circle) */
}

/* Hover on the icon itself OR on any ancestor with .trash-trigger */
.trash-icon:hover .trash-lid,
.trash-trigger:hover .trash-icon .trash-lid{
  animation:trash-lid-flip var(--trash-duration,1300ms) ease-in-out infinite;
}
.trash-icon:hover .trash-body,
.trash-trigger:hover .trash-icon .trash-body{
  animation:trash-body-stretch var(--trash-duration,1300ms) ease-in-out infinite;
}
.trash-icon:hover .trash-speck,
.trash-trigger:hover .trash-icon .trash-speck{
  animation:trash-speck-fly var(--trash-duration,1300ms) ease-in infinite;
}

.trash-icon[data-disabled="true"] *{
  animation:none !important;
  transform:none !important;
  opacity:1;
}
.trash-icon[data-disabled="true"] .trash-speck{ opacity:0; }

@keyframes trash-lid-flip{
  0%   { transform:rotate(0deg);  }     /* rest */
  15%  { transform:rotate(0deg);  }     /* hold a beat */
  40%  { transform:rotate(28deg); }     /* open: left side lifts UP */
  55%  { transform:rotate(28deg); }     /* hover at peak */
  75%  { transform:rotate(0deg);  }     /* snap shut */
  100% { transform:rotate(0deg);  }     /* rest */
}
@keyframes trash-body-stretch{
  0%, 15% { transform:scaleY(1);    }   /* rest */
  40%     { transform:scaleY(1.10); }   /* stretched DOWN with lid open */
  55%     { transform:scaleY(1.10); }   /* peak */
  72%     { transform:scaleY(0.95); }   /* overshoot — pulled up too far */
  85%     { transform:scaleY(1.03); }   /* bounce back */
  94%     { transform:scaleY(0.99); }   /* settle */
  100%    { transform:scaleY(1);    }
}
@keyframes trash-speck-fly{
  0%, 20%  { opacity:0; transform:translate(-3px,-8px); stroke-dasharray:0.01 6; }   /* parked: DOT outside lid corner */
  28%      { opacity:1; transform:translate(-3px,-8px); stroke-dasharray:0.01 6; }   /* dot appears outside */
  44%      { opacity:1; transform:translate(-2px,-5px); stroke-dasharray:0.01 6; }   /* DOT arcs in toward TOP of left line */
  60%      { opacity:1; transform:translate(0,0);       stroke-dasharray:0.01 6; }   /* DOT lands EXACTLY on top of left line */
  78%      { opacity:1; transform:translate(0,0);       stroke-dasharray:6 0;    }   /* grows DOWNWARD from top → fully merged with left line */
  84%      { opacity:1; transform:translate(0,0) scaleY(1.06); stroke-dasharray:6 0; }   /* satisfying overshoot pulse */
  90%      { opacity:1; transform:translate(0,0); stroke-dasharray:6 0; }   /* settled */
  96%      { opacity:0; transform:translate(0,0); stroke-dasharray:6 0; }   /* hand off to real left line */
  100%     { opacity:0; transform:translate(-3px,-8px); stroke-dasharray:0.01 6; }
}

@media (prefers-reduced-motion: reduce){
  .trash-icon *{ animation:none !important; transform:none !important; }
  .trash-icon .trash-speck{ opacity:0; }
}
`;

function useTrashStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

export const TrashIcon: React.FC<TrashIconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  duration = 1300,
  disabled = false,
  className,
  style,
  ...rest
}) => {
  useTrashStyles();

  return (
    <svg
      className={["trash-icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-disabled={disabled ? "true" : undefined}
      style={{ ["--trash-duration" as any]: `${duration}ms`, ...style }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      {/* Body group — sides + inner lines stretch together as one */}
      <g className="trash-body">
        <path d="M5 7 L6 20 A2 2 0 0 0 8 22 H16 A2 2 0 0 0 18 20 L19 7" />
        <path d="M10 11 V17" />
        <path d="M14 11 V17" />
      </g>

      {/* Lid group — animates as one (bar + handle) */}
      <g className="trash-lid">
        <path d="M3 7 H21" />
        <path d="M9 7 V5 A2 2 0 0 1 11 3 H13 A2 2 0 0 1 15 5 V7" />
      </g>

      {/* Speck — same shape as the left inner line; descends + grows + perfectly merges */}
      <path className="trash-speck" d="M10 11 V17" />
    </svg>
  );
};

export default TrashIcon;
