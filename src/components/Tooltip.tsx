import { useId, type ReactNode } from 'react';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  placement?: 'top' | 'bottom';
  triggerTabIndex?: number;
  className?: string;
}

export function Tooltip({ content, children, placement = 'top', triggerTabIndex, className = '' }: TooltipProps) {
  const tooltipId = useId();
  return <span className={`aisee-tooltip-trigger ${className}`.trim()} tabIndex={triggerTabIndex} aria-describedby={tooltipId}>
    {children}
    <span id={tooltipId} className={`aisee-tooltip aisee-tooltip--${placement}`} role="tooltip">{content}</span>
  </span>;
}
