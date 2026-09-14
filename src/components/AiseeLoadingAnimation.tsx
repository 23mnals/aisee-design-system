import { useId } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';

export type AiseeLoadingTone = 'auto' | 'analysis' | 'post-agent';

export interface AiseeLoadingAnimationProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Auto is green by default and becomes yellow inside data-aisee-theme="post-agent". */
  tone?: AiseeLoadingTone;
  /** Rendered width in CSS pixels. Height keeps the original 80 × 56 ratio. */
  size?: number | string;
  /** Stops the blink and eye movement while keeping the mascot visible. */
  animated?: boolean;
  /** Optional accessible name. Omit when nearby loading copy already describes the state. */
  label?: string;
}

/** Shared AISEE loading mascot based on the supplied aisee-blink.svg. */
export function AiseeLoadingAnimation({
  tone = 'auto',
  size = 80,
  animated = true,
  label,
  className = '',
  style,
  ...props
}: AiseeLoadingAnimationProps) {
  const rawId = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const headMaskId = `aisee-loading-head-${rawId}`;
  const eyeMaskId = `aisee-loading-eye-${rawId}`;
  const sizingStyle = { ...style, '--aisee-loading-size': typeof size === 'number' ? `${size}px` : size } as CSSProperties;

  return <span
    {...props}
    className={`aisee-loading-animation ${className}`.trim()}
    data-tone={tone}
    data-animated={animated}
    role={label ? 'img' : undefined}
    aria-label={label}
    aria-hidden={label ? undefined : true}
    style={sizingStyle}
  >
    <svg viewBox="0 0 80 56" fill="none" xmlns="http://www.w3.org/2000/svg" focusable="false" aria-hidden="true">
      <ellipse cx="39.76" cy="28" rx="39.76" ry="28" fill="#000" />
      <mask id={headMaskId} maskUnits="userSpaceOnUse" x="0" y="0" width="80" height="56">
        <ellipse cx="39.76" cy="28" rx="39.76" ry="28" fill="#fff" />
      </mask>
      <g mask={`url(#${headMaskId})`}>
        <path d="M17.0737 32.0633C17.0737 19.3258 27.3995 9 40.137 9C52.8745 9 63.2003 19.3258 63.2003 32.0633V57H17.0737V32.0633Z" fill="currentColor" />
        <mask id={eyeMaskId} maskUnits="userSpaceOnUse" x="27" y="18" width="27" height="13">
          <path d="M27.0015 24.4125C35.7612 16.662 44.5209 16.662 53.2806 24.4125C44.5209 32.163 35.7612 32.163 27.0015 24.4125Z" fill="#fff" />
        </mask>
        <g mask={`url(#${eyeMaskId})`}>
          <rect className="aisee-loading-animation__eye-white" x="27.0015" y="18.5996" width="26.2682" height="11.6658" fill="#fff" />
          <g className="aisee-loading-animation__iris-look">
            <g className="aisee-loading-animation__iris-blink">
              <rect x="34.3008" y="14.6548" width="11.7675" height="11.6658" rx="5.83288" fill="#111" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  </span>;
}
