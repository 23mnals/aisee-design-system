import type { HTMLAttributes, ReactNode } from 'react';

export interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> { title?: ReactNode; shadow?: boolean; }
export function Card({ title, shadow = false, className = '', children, ...props }: CardProps) {
  return <section className={`aisee-card${shadow ? ' aisee-card--shadow' : ''} ${className}`.trim()} {...props}>
    {title && <h3 className="aisee-card__title">{title}</h3>}
    <div className="aisee-card__body">{children}</div>
  </section>;
}
