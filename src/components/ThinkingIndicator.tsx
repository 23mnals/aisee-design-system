import { forwardRef, useEffect, useState, useSyncExternalStore, type HTMLAttributes } from 'react';

// Circle / infinity geometry and timing adapted from Fluid Functionalism's
// ThinkingIndicator. Native SVG interpolation avoids a host animation dependency.
const circleA = 'M 12 8 C 14.21 8 16 9.79 16 12 C 16 14.21 14.21 16 12 16 C 9.79 16 8 14.21 8 12 C 8 9.79 9.79 8 12 8 Z';
const infinity = 'M 12 12 C 14 8.5 19 8.5 19 12 C 19 15.5 14 15.5 12 12 C 10 8.5 5 8.5 5 12 C 5 15.5 10 15.5 12 12 Z';
const circleB = 'M 12 16 C 14.21 16 16 14.21 16 12 C 16 9.79 14.21 8 12 8 C 9.79 8 8 9.79 8 12 C 8 14.21 9.79 16 12 16 Z';
const defaultLabels = ['Thinking', 'Planning', 'Refining'];
const motionQuery = '(prefers-reduced-motion: reduce)';
function subscribeMotion(notify: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}
const getReducedMotion = () => window.matchMedia(motionQuery).matches;
const getServerMotion = () => true;

export interface ThinkingIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  showIcon?: boolean;
  size?: 'default' | 'compact';
  /** Decorative status phrases, not progress or a record of model reasoning. */
  labels?: readonly string[];
}

/** Mount while the host is waiting, remove when its reply or result is ready. */
export const ThinkingIndicator = forwardRef<HTMLDivElement, ThinkingIndicatorProps>(function ThinkingIndicator(
  { showIcon = true, size = 'default', labels = defaultLabels, className = '', 'aria-label': accessibleLabel = 'Thinking…', ...props }, ref,
) {
  const reducedMotion = useSyncExternalStore(subscribeMotion, getReducedMotion, getServerMotion);
  const available = labels.filter(label => label.trim().length > 0);
  const words = available.length ? available : defaultLabels;
  const signature = JSON.stringify(words);
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    if (reducedMotion || words.length < 2) return;
    const timer = window.setInterval(() => setStep(value => value + 1), 4000);
    return () => window.clearInterval(timer);
  }, [signature, reducedMotion, words.length]);
  const index = reducedMotion ? 0 : step % words.length;

  return <div {...props} ref={ref} role="status" aria-live="polite" aria-atomic="true"
    className={`aisee-thinking-indicator ${className}`.trim()} data-size={size} data-reduced-motion={reducedMotion}>
    <span className="aisee-thinking-indicator__sr-only">{accessibleLabel}</span>
    {showIcon && <svg className="aisee-thinking-indicator__icon" aria-hidden="true" width={size === 'compact' ? 18 : 20} height={size === 'compact' ? 18 : 20}
      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={reducedMotion ? infinity : circleA}>
        {!reducedMotion && <animate attributeName="d" values={[circleA, infinity, circleB, infinity, circleA].join(';')}
          dur="6s" repeatCount="indefinite" calcMode="spline" keyTimes="0;0.25;0.5;0.75;1"
          keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1" />}
      </path>
    </svg>}
    <span className="aisee-thinking-indicator__words" aria-hidden="true">
      {words.map((word, i) => <span key={`measure-${i}`} className="aisee-thinking-indicator__measure">{word}</span>)}
      {!reducedMotion && step > 0 && words.length > 1 && <span key={`out-${step}`} className="aisee-thinking-indicator__word aisee-thinking-indicator__word--out">{words[(index + words.length - 1) % words.length]}</span>}
      <span key={`in-${step}-${reducedMotion}`} className={`aisee-thinking-indicator__word${!reducedMotion && step > 0 ? ' aisee-thinking-indicator__word--in' : ''}`}>
        <span className="aisee-thinking-indicator__shimmer">{words[index]}</span>
      </span>
    </span>
  </div>;
});
