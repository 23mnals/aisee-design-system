import type { HTMLAttributes, ReactNode } from 'react';

export interface StatCardProps extends HTMLAttributes<HTMLElement> {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  delta?: ReactNode;
  deltaTone?: 'positive' | 'negative' | 'neutral';
  helper?: ReactNode;
}

export function StatCard({
  label,
  value,
  unit,
  delta,
  deltaTone = 'neutral',
  helper,
  className = '',
  ...props
}: StatCardProps) {
  return <article {...props} className={`aisee-stat-card ${className}`.trim()}>
    <span className="aisee-stat-card__label">{label}</span>
    <div className="aisee-stat-card__metric"><strong>{value}</strong>{unit && <span>{unit}</span>}</div>
    {(delta || helper) && <div className="aisee-stat-card__footer">
      {delta && <span className={`aisee-stat-card__delta aisee-stat-card__delta--${deltaTone}`}>{delta}</span>}
      {helper && <span>{helper}</span>}
    </div>}
  </article>;
}
