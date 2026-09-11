import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'solid' | 'dot' | 'colour';
export type BadgeColor = 'neutral' | 'lime' | 'yellow' | 'red' | 'blue' | 'purple' | 'green' | 'mint';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  children?: ReactNode;
}

export function Badge({ variant = 'solid', color = 'neutral', className = '', children, ...props }: BadgeProps) {
  return <span className={`aisee-badge aisee-badge--${variant} aisee-badge--${color} ${className}`.trim()} {...props}>
    {variant === 'dot' && <span className="aisee-badge__dot" aria-hidden="true" />}
    {children}
  </span>;
}
