import { Children, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';

export interface StatCardProps extends HTMLAttributes<HTMLElement> {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  /** Compact status shown beside the value, for example “— baseline”. */
  badge?: ReactNode;
  delta?: ReactNode;
  deltaTone?: 'positive' | 'negative' | 'neutral';
  helper?: ReactNode;
  /** Compact information strip cell. It remains read-only. */
  variant?: 'default' | 'compact';
}

export interface StatCardGroupProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title?: ReactNode;
  children: ReactNode;
  variant?: 'default' | 'compact';
}

export function StatCard({
  label,
  value,
  unit,
  badge,
  delta,
  deltaTone = 'neutral',
  helper,
  variant = 'default',
  className = '',
  ...props
}: StatCardProps) {
  return <article {...props} className={`aisee-stat-card${variant === 'compact' ? ' aisee-stat-card--compact' : ''} ${className}`.trim()}>
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

export function StatCardGroup({ title, children, variant = 'default', className = '', ...props }: StatCardGroupProps) {
  return <section {...props} className={`aisee-stat-card-group${variant === 'compact' ? ' aisee-stat-card-group--compact' : ''} ${className}`.trim()}>
    {title && <h2 className="aisee-stat-card-group__title">{title}</h2>}
    <div className="aisee-stat-card-group__grid" style={variant === 'compact' ? { '--aisee-stat-columns': Math.max(1, Children.toArray(children).length) } as CSSProperties : undefined}>{children}</div>
  </section>;
}
