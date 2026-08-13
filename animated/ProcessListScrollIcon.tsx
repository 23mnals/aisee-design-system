import React from "react";

/**
 * Animated process-list / checklist icon — SCROLL (conveyor) variant.
 *
 * On hover (the SVG itself, OR any ancestor with the class `process-list-trigger`):
 *   - a row completes (its check ticks on, its line strikes across left -> right)
 *   - the whole list then slides up one row; the finished row dissolves out the top
 *   - a fresh blank row arrives at the bottom and completes next
 *   - after three rows the belt reseats seamlessly and the loop repeats
 *
 * Seven identical rows ride a belt clipped to the 16x16 box; a fixed fade mask
 * dissolves rows at the top & bottom edges.
 *
 * Usage:
 *   <ProcessListScrollIcon />
 *   <ProcessListScrollIcon size={24} />
 *   <button className="process-list-trigger"><ProcessListScrollIcon /> Queue</button>
 */

export interface ProcessListScrollIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size (width = height). Default 16. */
  size?: number | string;
  /** Stroke color. Default `currentColor`. */
  color?: string;
  /** One full cycle in ms (three rows + reset). Default 2800. */
  duration?: number;
  /** Disable the hover animation. */
  disabled?: boolean;
}

const STYLE_ID = "process-list-scroll-icon-anim-styles";
const G = 4.42124;
const Y0 = 3.94736;
const ROWS = [0, 1, 2, 3, 4, 5, 6];

const CSS = `
.process-list-scroll-icon{ display:inline-block; vertical-align:middle; }
.process-list-scroll-icon svg, .process-list-scroll-icon{ overflow:hidden; }
.process-list-scroll-icon .plc-line{ stroke-dasharray:100; }
.process-list-scroll-icon .plc-check{ transform-box:fill-box; transform-origin:center; }
.process-list-scroll-icon .plc-belt{ transform-box:view-box; }

.process-list-scroll-icon:hover .plc-belt,
.process-list-trigger:hover .process-list-scroll-icon .plc-belt{ animation:plc-belt var(--plc-d,2800ms) cubic-bezier(0.66,0,0.34,1) infinite; }

.process-list-scroll-icon:hover .plc-r2-line,  .process-list-trigger:hover .process-list-scroll-icon .plc-r2-line { animation:plc-line-2 var(--plc-d,2800ms) cubic-bezier(0.4,0,0.2,1) infinite; }
.process-list-scroll-icon:hover .plc-r3-line,  .process-list-trigger:hover .process-list-scroll-icon .plc-r3-line { animation:plc-line-3 var(--plc-d,2800ms) cubic-bezier(0.4,0,0.2,1) infinite; }
.process-list-scroll-icon:hover .plc-r4-line,  .process-list-trigger:hover .process-list-scroll-icon .plc-r4-line { animation:plc-line-4 var(--plc-d,2800ms) cubic-bezier(0.4,0,0.2,1) infinite; }
.process-list-scroll-icon:hover .plc-r2-check, .process-list-trigger:hover .process-list-scroll-icon .plc-r2-check{ animation:plc-check-2 var(--plc-d,2800ms) ease-out infinite; }
.process-list-scroll-icon:hover .plc-r3-check, .process-list-trigger:hover .process-list-scroll-icon .plc-r3-check{ animation:plc-check-3 var(--plc-d,2800ms) ease-out infinite; }
.process-list-scroll-icon:hover .plc-r4-check, .process-list-trigger:hover .process-list-scroll-icon .plc-r4-check{ animation:plc-check-4 var(--plc-d,2800ms) ease-out infinite; }
.process-list-scroll-icon:hover .plc-r5-line,  .process-list-scroll-icon:hover .plc-r6-line,
.process-list-trigger:hover .process-list-scroll-icon .plc-r5-line,
.process-list-trigger:hover .process-list-scroll-icon .plc-r6-line { stroke-dashoffset:100; }
.process-list-scroll-icon:hover .plc-r5-check, .process-list-scroll-icon:hover .plc-r6-check,
.process-list-trigger:hover .process-list-scroll-icon .plc-r5-check,
.process-list-trigger:hover .process-list-scroll-icon .plc-r6-check{ opacity:0; }

.process-list-scroll-icon[data-disabled="true"] *{ animation:none !important; transform:none !important; }
.process-list-scroll-icon[data-disabled="true"] .plc-line{ stroke-dashoffset:0; }
.process-list-scroll-icon[data-disabled="true"] .plc-check{ opacity:1; }

@keyframes plc-belt{
  0%, 22%   { transform:translateY(0); }
  31%, 56%  { transform:translateY(-4.421px); }
  65%, 90%  { transform:translateY(-8.842px); }
  99%, 100% { transform:translateY(-13.264px); }
}
@keyframes plc-line-2{ 0%,1%{stroke-dashoffset:100;} 14%{stroke-dashoffset:0;} 100%{stroke-dashoffset:0;} }
@keyframes plc-line-3{ 0%,32%{stroke-dashoffset:100;} 45%{stroke-dashoffset:0;} 100%{stroke-dashoffset:0;} }
@keyframes plc-line-4{ 0%,66%{stroke-dashoffset:100;} 79%{stroke-dashoffset:0;} 100%{stroke-dashoffset:0;} }
@keyframes plc-check-2{ 0%,15%{opacity:0;transform:scale(.4);} 19%{opacity:1;transform:scale(1.2);} 22%{opacity:1;transform:scale(1);} 100%{opacity:1;transform:scale(1);} }
@keyframes plc-check-3{ 0%,46%{opacity:0;transform:scale(.4);} 50%{opacity:1;transform:scale(1.2);} 53%{opacity:1;transform:scale(1);} 100%{opacity:1;transform:scale(1);} }
@keyframes plc-check-4{ 0%,80%{opacity:0;transform:scale(.4);} 84%{opacity:1;transform:scale(1.2);} 87%{opacity:1;transform:scale(1);} 100%{opacity:1;transform:scale(1);} }

@media (prefers-reduced-motion: reduce){
  .process-list-scroll-icon *{ animation:none !important; transform:none !important; }
  .process-list-scroll-icon .plc-line{ stroke-dashoffset:0; }
  .process-list-scroll-icon .plc-check{ opacity:1; }
}
`;

function useScrollStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

const f = (n: number) => Math.round(n * 1000) / 1000;

export const ProcessListScrollIcon: React.FC<ProcessListScrollIconProps> = ({
  size = 16,
  color = "currentColor",
  duration = 2800,
  disabled = false,
  className,
  style,
  ...rest
}) => {
  useScrollStyles();
  const uid = React.useId().replace(/[:]/g, "");
  const maskId = `plc-fade-${uid}`;
  const gradId = `plc-grad-${uid}`;

  return (
    <svg
      className={["process-list-scroll-icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="square"
      data-disabled={disabled ? "true" : undefined}
      style={{ ["--plc-d" as any]: `${duration}ms`, ...style }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="16" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#000" />
          <stop offset="0.05" stopColor="#000" />
          <stop offset="0.19" stopColor="#fff" />
          <stop offset="0.85" stopColor="#fff" />
          <stop offset="1" stopColor="#000" />
        </linearGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
          <rect x="0" y="0" width="16" height="16" fill={`url(#${gradId})`} />
        </mask>
      </defs>
      <g mask={`url(#${maskId})`}>
        <g className="plc-belt">
          {ROWS.map((k) => {
            const Y = Y0 + k * G;
            return (
              <React.Fragment key={k}>
                <path
                  className={`plc-check plc-r${k}-check`}
                  d={`M2.32 ${f(Y)}L3.267 ${f(Y + 0.94736)}L5.162 ${f(Y - 0.94736)}`}
                />
                <path
                  className={`plc-line plc-r${k}-line`}
                  pathLength={100}
                  d={`M7.373 ${f(Y)}H14.32`}
                />
              </React.Fragment>
            );
          })}
        </g>
      </g>
    </svg>
  );
};

export default ProcessListScrollIcon;
