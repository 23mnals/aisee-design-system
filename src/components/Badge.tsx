import type { HTMLAttributes, ReactNode } from 'react';
import fromPlan from '../../assets/badge/from-plan.svg';
import manual from '../../assets/badge/manual.svg';
import rewritten from '../../assets/badge/rewritten.svg';
import scheduled from '../../assets/badge/scheduled.svg';
import published from '../../assets/badge/published.svg';
import draft from '../../assets/badge/draft.svg';
import failed from '../../assets/badge/failed.svg';

export type BadgeVariant = 'solid' | 'dot' | 'colour' | 'source' | 'status';
export type BadgeColor = 'neutral' | 'lime' | 'yellow' | 'red' | 'blue' | 'purple' | 'green' | 'mint';
export type BadgeStatus = 'scheduled' | 'published' | 'draft' | 'failed' | 'removed';
export const badgeIcons = { 'from-plan': fromPlan, manual, rewritten, scheduled, published, draft, failed, removed: failed } as const;
export type BadgeIconName = keyof typeof badgeIcons;
const statusLabels: Record<BadgeStatus, string> = { scheduled: 'Scheduled', published: 'Published', draft: 'Draft', failed: 'Failed', removed: 'Removed' };

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'> {
  variant?: BadgeVariant;
  color?: BadgeColor;
  /** Semantic status presets apply only to variant="status". */
  status?: BadgeStatus;
  icon?: ReactNode;
  iconName?: BadgeIconName;
  children?: ReactNode;
}

export function Badge({ variant = 'solid', color = 'neutral', status = 'draft', icon, iconName, className = '', children, ...props }: BadgeProps) {
  const name = iconName ?? (variant === 'status' ? status : undefined);
  const iconContent = icon ?? (name ? <span className="aisee-badge__glyph" style={{ maskImage: `url("${badgeIcons[name]}")`, WebkitMaskImage: `url("${badgeIcons[name]}")` }} /> : null);
  return <span className={`aisee-badge aisee-badge--${variant} aisee-badge--${color} ${variant === 'status' ? `aisee-badge--status-${status}` : ''} ${className}`.trim()} {...props}>
    {variant === 'dot' && !iconContent && <span className="aisee-badge__dot" aria-hidden="true" />}
    {iconContent && <span className="aisee-badge__icon" aria-hidden="true">{iconContent}</span>}
    {children ?? (variant === 'status' ? statusLabels[status] : null)}
  </span>;
}
