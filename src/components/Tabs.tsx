import { useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

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
export type PlatformLabelDisplay = 'auto' | 'active' | 'all';
export interface TabsProps {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel?: string;
  variant?: TabsVariant;
  layout?: TabsLayout;
  platformLabelDisplay?: PlatformLabelDisplay;
  className?: string;
}

export function Tabs({ items, value, onValueChange, ariaLabel = '页面导航', variant = 'underline', layout = 'text', platformLabelDisplay = 'auto', className = '' }: TabsProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [autoShowsAllLabels, setAutoShowsAllLabels] = useState(false);

  useLayoutEffect(() => {
    const list = listRef.current;
    if (!list || layout !== 'platform' || platformLabelDisplay !== 'auto') return;

    let frame = 0;
    let cancelled = false;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (cancelled) return;
        list.classList.add('aisee-tabs--platform-measure-all');
        const fits = list.scrollWidth <= list.clientWidth + 1;
        list.classList.remove('aisee-tabs--platform-measure-all');
        setAutoShowsAllLabels((current) => current === fits ? current : fits);
      });
    };

    measure();
    const resizeObserver = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(measure);
    resizeObserver?.observe(list);
    void document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      resizeObserver?.disconnect();
      list.classList.remove('aisee-tabs--platform-measure-all');
    };
  }, [items, layout, platformLabelDisplay]);

  const effectivePlatformLabelDisplay = platformLabelDisplay === 'auto'
    ? (autoShowsAllLabels ? 'all' : 'active')
    : platformLabelDisplay;
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const enabled = items.filter((item) => !item.disabled);
    const current = enabled.findIndex((item) => item.id === value);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length;
    onValueChange(enabled[next].id);
  };
  return <div
    ref={listRef}
    className={`aisee-tabs aisee-tabs--${variant} aisee-tabs--${layout}${layout === 'platform' ? ` aisee-tabs--platform-labels-${effectivePlatformLabelDisplay}` : ''} ${className}`.trim()}
    data-platform-label-display={layout === 'platform' ? effectivePlatformLabelDisplay : undefined}
    role="tablist"
    aria-label={ariaLabel}
    onKeyDown={handleKeyDown}
  >
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
