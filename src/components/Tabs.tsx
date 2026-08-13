import type { KeyboardEvent } from 'react';

export interface TabItem { id: string; label: string; disabled?: boolean; }
export interface TabsProps { items: TabItem[]; value: string; onValueChange: (value: string) => void; ariaLabel?: string; }

export function Tabs({ items, value, onValueChange, ariaLabel = '页面导航' }: TabsProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const enabled = items.filter((item) => !item.disabled);
    const current = enabled.findIndex((item) => item.id === value);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? enabled.length - 1 : (current + (event.key === 'ArrowRight' ? 1 : -1) + enabled.length) % enabled.length;
    onValueChange(enabled[next].id);
  };
  return <div className="aisee-tabs" role="tablist" aria-label={ariaLabel} onKeyDown={handleKeyDown}>
    {items.map((item) => <button key={item.id} className="aisee-tab" role="tab" aria-selected={value === item.id} tabIndex={value === item.id ? 0 : -1} disabled={item.disabled} onClick={() => onValueChange(item.id)}>{item.label}</button>)}
  </div>;
}
