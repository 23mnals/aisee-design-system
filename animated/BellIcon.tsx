import React from "react";

/**
 * Animated notification bell ("通知铃铛") icon.
 *
 * On hover (the SVG itself, OR any ancestor with class `bell-trigger`):
 *   The bell rings — its body does a damped left↔right oscillation while
 *   bobbing slightly up/down, pivoting from the top hanging point, and the
 *   inner clapper swings on its own offset rhythm (slightly larger amplitude).
 *   Faithfully recreated from the source Lottie (43 frames @ 30fps ≈ 1.433s).
 *
 * Usage:
 *   <BellIcon />                  // 24px, currentColor
 *   <BellIcon size={16} />
 *
 *   <button className="bell-trigger">
 *     <BellIcon /> Notify me
 *   </button>
 */

export interface BellIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size (width = height). Default 24. */
  size?: number | string;
  /** Stroke color. Default `currentColor`. */
  color?: string;
  /** Stroke width in viewBox units (16×16). Default 1.33333. */
  strokeWidth?: number;
  /** One full ring cycle in ms. Default 1433 (43f @ 30fps). */
  duration?: number;
  /** Disable the hover animation. */
  disabled?: boolean;
}

const STYLE_ID = "bell-icon-anim-styles";

const CSS = `
.bell-icon{
  display:inline-block;
  vertical-align:middle;
  overflow:visible;
}
.bell-icon path{ fill:none; }

/* Body hangs from the top (8,2); the clapper also pivots from (8,2) and adds
   its own offset rhythm — the fixed mouth-line clip hides the connection points. */
.bell-icon .swing,
.bell-icon .clap{ transform-box:view-box; transform-origin:8px 2px; }

/* Hover on the icon itself OR on any ancestor with .bell-trigger */
.bell-icon:hover .swing,
.bell-trigger:hover .bell-icon .swing{
  animation:bell-swing var(--bell-duration,1433ms) cubic-bezier(.26,0,.41,1) infinite;
}
.bell-icon:hover .bob,
.bell-trigger:hover .bell-icon .bob{
  animation:bell-bob var(--bell-duration,1433ms) cubic-bezier(.26,0,.41,1) infinite;
}
.bell-icon:hover .clap,
.bell-trigger:hover .bell-icon .clap{
  animation:bell-clap var(--bell-duration,1433ms) cubic-bezier(.26,0,.41,1) infinite;
}

.bell-icon[data-disabled="true"] *{
  animation:none !important;
  transform:none !important;
}

/* Body: damped oscillation — exact Lottie keyframes. */
@keyframes bell-swing{
  0%    { transform:rotate(0deg);      animation-timing-function:cubic-bezier(.26,0,.41,1); }
  18.6% { transform:rotate(-3.845deg); animation-timing-function:cubic-bezier(.26,0,.41,1); }
  27.9% { transform:rotate(5.339deg);  animation-timing-function:cubic-bezier(.26,0,.41,1); }
  37.2% { transform:rotate(-11.12deg); animation-timing-function:cubic-bezier(.26,0,.41,1); }
  46.5% { transform:rotate(5.339deg);  animation-timing-function:cubic-bezier(.26,0,.41,1); }
  58.1% { transform:rotate(-6.386deg); animation-timing-function:cubic-bezier(.26,0,.41,1); }
  72.1% { transform:rotate(0deg);      }
  100%  { transform:rotate(0deg);      }
}

/* Body: slight vertical bounce synced to the swing. */
@keyframes bell-bob{
  0%   { transform:translateY(0);      }
  14%  { transform:translateY(0.6px);  }
  44%  { transform:translateY(-0.4px); }
  65%  { transform:translateY(0.3px);  }
  79%  { transform:translateY(0);      }
  100% { transform:translateY(0);      }
}

/* Clapper: own offset rhythm, slightly larger amplitude. */
@keyframes bell-clap{
  0%    { transform:rotate(0deg);      animation-timing-function:cubic-bezier(.26,0,.41,1); }
  14%   { transform:rotate(0deg);      animation-timing-function:cubic-bezier(.26,0,.41,1); }
  24.3% { transform:rotate(4.809deg);  animation-timing-function:cubic-bezier(.26,0,.41,1); }
  32.6% { transform:rotate(5.701deg);  animation-timing-function:cubic-bezier(.26,0,.41,1); }
  40.8% { transform:rotate(-6.101deg); animation-timing-function:cubic-bezier(.26,0,.41,1); }
  50.1% { transform:rotate(8.45deg);   animation-timing-function:cubic-bezier(.26,0,.41,1); }
  61.7% { transform:rotate(-5.545deg); animation-timing-function:cubic-bezier(.26,0,.41,1); }
  79%   { transform:rotate(1.197deg);  }
  93%   { transform:rotate(0deg);      }
  100%  { transform:rotate(0deg);      }
}

@media (prefers-reduced-motion: reduce){
  .bell-icon *{ animation:none !important; transform:none !important; }
}
`;

function useBellStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

const BODY_PATH =
  "M8 2.00002C5.79069 1.99045 3.99229 3.77335 3.98272 5.98266L3.97118 8.6493L2.62631 11.3102L13.2929 11.3564L11.9711 8.68394L11.9826 6.0173C11.9922 3.80799 10.2093 2.00958 8 2.00002Z";
const CLAPPER_PATH =
  "M5.72018 11.269C5.68696 12.3731 6.55496 13.295 7.65913 13.3282C8.76329 13.3615 9.68515 12.4935 9.71837 11.3893";

export const BellIcon: React.FC<BellIconProps> = ({
  size = 24,
  color = "currentColor",
  strokeWidth = 1.33333,
  duration = 1433,
  disabled = false,
  className,
  style,
  ...rest
}) => {
  useBellStyles();

  // Unique clip id per instance — clips the clapper to the bell silhouette
  // (extended to the viewBox bottom to keep the hanging tongue) so it never
  // pokes out the sides during the swing. Faithful to the Lottie track matte.
  const reactId = React.useId();
  const clipId = `bell-clip-${reactId.replace(/[:]/g, "")}`;

  return (
    <svg
      className={["bell-icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-disabled={disabled ? "true" : undefined}
      style={{ ["--bell-duration" as any]: `${duration}ms`, ...style }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      <defs>
        <clipPath id={clipId}>
          {/* Only the area below the mouth line, so the clapper's top endpoints
              stay tucked under the body's mouth stroke — no visible connection point. */}
          <path d="M2.62631 11.55L13.2929 11.55L13.2929 16L2.62631 16Z" />
        </clipPath>
      </defs>
      <g className="bob">
        <g className="swing">
          {/* Clapper drawn first (behind) so the body's mouth stroke hides its connection points. */}
          <g clipPath={`url(#${clipId})`}>
            <g className="clap">
              <path className="bell-clapper" d={CLAPPER_PATH} />
            </g>
          </g>
          <path className="bell-body" d={BODY_PATH} />
        </g>
      </g>
    </svg>
  );
};

export default BellIcon;
