import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

export interface DropdownItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function Dropdown({
  items,
  value,
  onValueChange,
  label,
  placeholder = 'Select an option',
  disabled = false,
  ariaLabel,
  className = '',
}: DropdownProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const enabledItems = items.filter((item) => !item.disabled);
  const selectedItem = items.find((item) => item.id === value);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [open]);

  const selectItem = (item: DropdownItem) => {
    if (item.disabled) return;
    onValueChange?.(item.id);
    setOpen(false);
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled || !enabledItems.length) return;
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      return;
    }
    const currentIndex = Math.max(0, enabledItems.findIndex((item) => item.id === value));
    const nextIndex = event.key === 'Home' ? 0
      : event.key === 'End' ? enabledItems.length - 1
        : event.key === 'ArrowUp' ? (currentIndex - 1 + enabledItems.length) % enabledItems.length
          : event.key === 'ArrowDown' ? (currentIndex + 1) % enabledItems.length
            : currentIndex;
    selectItem(enabledItems[nextIndex]);
  };

  return <div ref={rootRef} className={`aisee-dropdown ${className}`.trim()}>
    {label && <span className="aisee-field__label">{label}</span>}
    <button
      className="aisee-dropdown__trigger"
      type="button"
      aria-label={ariaLabel ?? label}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={menuId}
      disabled={disabled}
      onClick={() => setOpen((current) => !current)}
      onKeyDown={handleTriggerKeyDown}
    >
      <span className={selectedItem ? '' : 'aisee-dropdown__placeholder'}>{selectedItem?.label ?? placeholder}</span>
      <svg className="aisee-dropdown__caret" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
    </button>
    {open && <div id={menuId} className="aisee-dropdown__menu" role="listbox" aria-label={ariaLabel ?? label ?? placeholder}>
      {items.map((item) => <button
        key={item.id}
        className="aisee-dropdown__option"
        type="button"
        role="option"
        aria-selected={item.id === value}
        disabled={item.disabled}
        onClick={() => selectItem(item)}
      >
        <span>{item.label}</span>
        {item.id === value && <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>}
      </button>)}
    </div>}
  </div>;
}
