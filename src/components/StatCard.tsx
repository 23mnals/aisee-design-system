import type { HTMLAttributes, ReactNode } from 'react';

export interface StatCardProps extends HTMLAttributes<HTMLElement> {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  /** Compact status shown beside the value, for example “— baseline”. */
  badge?: ReactNode;
  delta?: ReactNode;
  deltaTone?: 'positive' | 'negative' | 'neutral';
  helper?: ReactNode;
}

export interface StatCardGroupProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  children: ReactNode;
}

export function StatCard({
  label,
  value,
  unit,
  badge,
  delta,
  deltaTone = 'neutral',
  helper,
  className = '',
  ...props
}: StatCardProps) {
  return <article {...props} className={`aisee-stat-card ${className}`.trim()}>
    <div className="aisee-stat-card__metric">
      <strong>{value}</strong>
      {unit && <span className="aisee-stat-card__unit">{unit}</span>}
      {badge && <span className="aisee-stat-card__badge">{badge}</span>}
    </div>
    <span className="aisee-stat-card__label" title={typeof label === 'string' ? label : undefined}>{label}</span>
    {(delta || helper) && <div className="aisee-stat-card__footer">
      {delta && <span className={`aisee-stat-card__delta aisee-stat-card__delta--${deltaTone}`}>{delta}</span>}
      {helper && <span className="aisee-stat-card__helper">{helper}</span>}
    </div>}
  </article>;
}

export function StatCardGroup({ title, children, className = '', ...props }: StatCardGroupProps) {
  return <section {...props} className={`aisee-stat-card-group ${className}`.trim()}>
    {title && <h2 className="aisee-stat-card-group__title">{title}</h2>}
    <div className="aisee-stat-card-group__grid">{children}</div>
  </section>;
}
