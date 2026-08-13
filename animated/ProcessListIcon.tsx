import React from "react";

/**
 * Animated process-list / checklist icon (outline, list_check_2_line).
 *
 * On hover (the SVG itself, OR any ancestor with the class `process-list-trigger`):
 *   - the list completes ONE ROW AT A TIME, top to bottom:
 *       a check ticks on, then its line strikes across left -> right,
 *       then the next row, then the next
 *   - once all three are done the list clears and the loop repeats
 *
 * Usage:
 *   <ProcessListIcon />                  // 16px, currentColor
 *   <ProcessListIcon size={24} />
 *
 *   <button className="process-list-trigger">
 *     <ProcessListIcon /> Tasks
 *   </button>
 */

export interface ProcessListIconProps extends React.SVGAttributes<SVGSVGElement> {
  /** Pixel size (width = height). Default 16. */
  size?: number | string;
  /** Stroke color. Default `currentColor`. */
  color?: string;
  /** One full cycle in ms (all three rows + reset). Default 2700. */
  duration?: number;
  /** Disable the hover animation. */
  disabled?: boolean;
}

const STYLE_ID = "process-list-icon-anim-styles";

const CSS = `
.process-list-icon{
  display:inline-block;
  vertical-align:middle;
  overflow:visible;
}
.process-list-icon .pl-line{ stroke-dasharray:100; }
.process-list-icon .pl-check{ transform-box:fill-box; transform-origin:center; }

/* One sequential timeline: complete row 1, then 2, then 3, clear, repeat.
   Triggered by hovering the icon itself or any .process-list-trigger ancestor. */
.process-list-icon:hover .pl-check-1,
.process-list-trigger:hover .process-list-icon .pl-check-1{ animation:pl-check-1 var(--pl-duration,2700ms) ease-out infinite; }
.process-list-icon:hover .pl-line-1,
.process-list-trigger:hover .process-list-icon .pl-line-1{ animation:pl-line-1 var(--pl-duration,2700ms) ease-out infinite; }
.process-list-icon:hover .pl-check-2,
.process-list-trigger:hover .process-list-icon .pl-check-2{ animation:pl-check-2 var(--pl-duration,2700ms) ease-out infinite; }
.process-list-icon:hover .pl-line-2,
.process-list-trigger:hover .process-list-icon .pl-line-2{ animation:pl-line-2 var(--pl-duration,2700ms) ease-out infinite; }
.process-list-icon:hover .pl-check-3,
.process-list-trigger:hover .process-list-icon .pl-check-3{ animation:pl-check-3 var(--pl-duration,2700ms) ease-out infinite; }
.process-list-icon:hover .pl-line-3,
.process-list-trigger:hover .process-list-icon .pl-line-3{ animation:pl-line-3 var(--pl-duration,2700ms) ease-out infinite; }

.process-list-icon[data-disabled="true"] *{ animation:none !important; transform:none !important; opacity:1 !important; }

/* Row 1 */
@keyframes pl-check-1{
  0%   { opacity:0; transform:scale(0.4); }
  2%   { opacity:0; transform:scale(0.4); }
  7%   { opacity:1; transform:scale(1.25); }
  12%  { opacity:1; transform:scale(1); }
  100% { opacity:1; transform:scale(1); }
}
@keyframes pl-line-1{
  0%   { stroke-dashoffset:100; }
  9%   { stroke-dashoffset:100; }
  26%  { stroke-dashoffset:0; }
  100% { stroke-dashoffset:0; }
}
/* Row 2 */
@keyframes pl-check-2{
  0%,35% { opacity:0; transform:scale(0.4); }
  40%    { opacity:1; transform:scale(1.25); }
  45%    { opacity:1; transform:scale(1); }
  100%   { opacity:1; transform:scale(1); }
}
@keyframes pl-line-2{
  0%,42% { stroke-dashoffset:100; }
  59%    { stroke-dashoffset:0; }
  100%   { stroke-dashoffset:0; }
}
/* Row 3, then the whole list clears for the next pass */
@keyframes pl-check-3{
  0%,68% { opacity:0; transform:scale(0.4); }
  73%    { opacity:1; transform:scale(1.25); }
  78%    { opacity:1; transform:scale(1); }
  94%    { opacity:1; transform:scale(1); }
  100%   { opacity:0; transform:scale(0.4); }
}
@keyframes pl-line-3{
  0%,75% { stroke-dashoffset:100; }
  92%    { stroke-dashoffset:0; }
  96%    { stroke-dashoffset:0; }
  100%   { stroke-dashoffset:100; }
}

@media (prefers-reduced-motion: reduce){
  .process-list-icon *{ animation:none !important; transform:none !important; opacity:1 !important; }
}
`;

function useProcessListStyles() {
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (document.getElementById(STYLE_ID)) return;
    const el = document.createElement("style");
    el.id = STYLE_ID;
    el.textContent = CSS;
    document.head.appendChild(el);
  }, []);
}

export const ProcessListIcon: React.FC<ProcessListIconProps> = ({
  size = 16,
  color = "currentColor",
  duration = 2700,
  disabled = false,
  className,
  style,
  ...rest
}) => {
  useProcessListStyles();

  return (
    <svg
      className={["process-list-icon", className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke={color}
      strokeWidth={1.2}
      strokeLinecap="square"
      data-disabled={disabled ? "true" : undefined}
      style={{ ["--pl-duration" as any]: `${duration}ms`, ...style }}
      aria-hidden={rest["aria-label"] ? undefined : true}
      {...rest}
    >
      {/* Three checks, top → bottom */}
      <path className="pl-check pl-check-1" d="M2.32007 3.94736L3.26743 4.89472L5.16214 3" />
      <path className="pl-check pl-check-2" d="M2.32007 8.36849L3.26743 9.31585L5.16214 7.42113" />
      <path className="pl-check pl-check-3" d="M2.32007 12.7896L3.26743 13.737L5.16214 11.8423" />
      {/* Three list lines, top → bottom */}
      <path className="pl-line pl-line-1" pathLength={100} d="M7.3729 3.94736H14.3201" />
      <path className="pl-line pl-line-2" pathLength={100} d="M7.3729 8.36849H14.3201" />
      <path className="pl-line pl-line-3" pathLength={100} d="M7.3729 12.7896H14.3201" />
    </svg>
  );
};

export default ProcessListIcon;
