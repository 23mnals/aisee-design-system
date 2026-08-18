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
  max = 100,
  label = 'Score',
  precision = 1,
  description,
  className = '',
  ...props
}: ScoreGaugeProps) {
  const safeMax = max > 0 ? max : 100;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const progress = clampedValue / safeMax;
  const style = { '--aisee-score-angle': `${progress * 360}deg` } as CSSProperties;
  return <article {...props} className={`aisee-score-gauge ${className}`.trim()} aria-label={`${String(label)} ${clampedValue} of ${safeMax}`}>
    <h3>{label}</h3>
    <div className="aisee-score-gauge__dial" style={style} role="meter" aria-valuemin={0} aria-valuemax={safeMax} aria-valuenow={clampedValue}>
      <strong>{clampedValue.toFixed(precision)}</strong>
    </div>
    {description && <p>{description}</p>}
  </article>;
}
