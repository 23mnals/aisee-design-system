import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

export interface ScoreGaugeProps extends HTMLAttributes<HTMLElement> {
  value: number;
  max?: number;
  label?: ReactNode;
  precision?: number;
  description?: ReactNode;
}

export function ScoreGauge({
  value,
  max = 50,
  label = 'Score',
  precision = 1,
  description,
  className = '',
  ...props
}: ScoreGaugeProps) {
  const safeMax = max > 0 ? max : 50;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const progress = clampedValue / safeMax;
  const activeTicks = Math.round(progress * 14);
  const ticks = Array.from({ length: 15 }, (_, index) => ({
    angle: -93.333 + index * 13.333,
    active: index <= activeTicks,
  }));
  return <article {...props} className={`aisee-score-gauge ${className}`.trim()} aria-label={`${String(label)} ${clampedValue} of ${safeMax}`}>
    <h3>{label}</h3>
    <div className="aisee-score-gauge__container">
      <div className="aisee-score-gauge__scale" role="meter" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={clampedValue}>
        <svg className="aisee-score-gauge__guide" viewBox="0 0 118.182 59.091" aria-hidden="true">
          <path d="M0 59.091A59.091 59.091 0 0 0 118.182 59.091" />
        </svg>
        {ticks.map(({ angle, active }, index) => <span
          aria-hidden="true"
          className={`aisee-score-gauge__tick${active ? ' is-active' : ''}`}
          key={index}
          style={{ '--aisee-score-tick-angle': `${angle}deg` } as CSSProperties}
        />)}
        <span className="aisee-score-gauge__needle" aria-hidden="true" />
        <span className="aisee-score-gauge__hub" aria-hidden="true" />
      </div>
      <strong className="aisee-score-gauge__value">{clampedValue.toFixed(precision)}</strong>
    </div>
    {description && <span className="aisee-sr-only">{description}</span>}
  </article>;
}
