import type { KeyboardEvent, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label?: string;
  icon?: ReactNode;
  count?: ReactNode;
  ariaLabel?: string;
  disabled?: boolean;
}
export type TabsVariant = 'underline' | 'segmented';
export type TabsLayout = 'text' | 'icon-text' | 'icon' | 'platform';
export interface TabsProps {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel?: string;
  variant?: TabsVariant;
  layout?: TabsLayout;
  className?: string;
}

export function Tabs({ items, value, onValueChange, ariaLabel = '页面导航', variant = 'underline', layout = 'text', className = '' }: TabsProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const enabled = items.filter((item) => !item.disabled);
    const current = enabled.findIndex((item) => item.id === value);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length;
    onValueChange(enabled[next].id);
  };
  return <div className={`aisee-tabs aisee-tabs--${variant} aisee-tabs--${layout} ${className}`.trim()} role="tablist" aria-label={ariaLabel} onKeyDown={handleKeyDown}>
    {items.map((item) => <button
      key={item.id}
      className="aisee-tab"
      role="tab"
      aria-label={item.ariaLabel ?? (layout === 'icon' ? item.label : undefined)}
      aria-selected={value === item.id}
      tabIndex={value === item.id ? 0 : -1}
      disabled={item.disabled}
      onClick={() => onValueChange(item.id)}
    >
      {item.icon && <span className="aisee-tab__icon" aria-hidden="true">{item.icon}</span>}
      {item.label && layout !== 'icon' && <span className="aisee-tab__label">{item.label}</span>}
      {item.count !== undefined && layout === 'text' && <span className="aisee-tab__count">{item.count}</span>}
    </button>)}
  </div>;
}
