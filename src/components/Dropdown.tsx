import { useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent } from 'react';
import dropdownChevronIcon from '../../assets/stemui/action-chevron-down.svg';

export interface DropdownItem {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  items: DropdownItem[];
  value?: string;
  onValueChange?: (value: string) => void;
  selectionMode?: 'single' | 'multiple';
  selectedValues?: string[];
  onSelectedValuesChange?: (values: string[]) => void;
  filterable?: boolean;
  editable?: boolean;
  inputValue?: string;
  onInputValueChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  noResultsText?: string;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function Dropdown({
  items,
  value,
  onValueChange,
  selectionMode = 'single',
  selectedValues = [],
  onSelectedValuesChange,
  filterable = false,
  editable = false,
  inputValue,
  onInputValueChange,
  label,
  placeholder = 'Select an option',
  noResultsText = 'No results',
  disabled = false,
  ariaLabel,
  className = '',
}: DropdownProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');
  const [internalInputValue, setInternalInputValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const query = editable ? (inputValue ?? internalInputValue) : filterQuery;
  const selectedItem = items.find((item) => item.id === value);

  const visibleItems = useMemo(() => {
    if (!(filterable || editable) || !query.trim()) return items;
    const normalized = query.trim().toLocaleLowerCase();
    return items.filter((item) => item.label.toLocaleLowerCase().includes(normalized));
  }, [editable, filterable, items, query]);
  const enabledItems = visibleItems.filter((item) => !item.disabled);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [open]);

  useEffect(() => {
    if (activeIndex >= enabledItems.length) setActiveIndex(Math.max(0, enabledItems.length - 1));
  }, [activeIndex, enabledItems.length]);

  const isSelected = (itemId: string) => selectionMode === 'multiple'
    ? selectedValues.includes(itemId)
    : itemId === value;

  const updateInputValue = (nextValue: string) => {
    if (inputValue === undefined) setInternalInputValue(nextValue);
    onInputValueChange?.(nextValue);
  };

  const selectItem = (item: DropdownItem) => {
    if (item.disabled) return;
    if (selectionMode === 'multiple') {
      const nextValues = selectedValues.includes(item.id)
        ? selectedValues.filter((selectedValue) => selectedValue !== item.id)
        : [...selectedValues, item.id];
      onSelectedValuesChange?.(nextValues);
      return;
    }
    onValueChange?.(item.id);
    if (editable) updateInputValue(item.label);
    setOpen(false);
    setFilterQuery('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) return;
    if (editable && event.key === ' ') return;
    event.preventDefault();
    if (!open) {
      setOpen(true);
      return;
    }
    if (!enabledItems.length) return;
    if (event.key === 'Enter' || event.key === ' ') {
      selectItem(enabledItems[activeIndex] ?? enabledItems[0]);
      return;
    }
    setActiveIndex((current) => event.key === 'Home' ? 0
      : event.key === 'End' ? enabledItems.length - 1
        : event.key === 'ArrowUp' ? (current - 1 + enabledItems.length) % enabledItems.length
          : (current + 1) % enabledItems.length);
  };

  const triggerCopy = selectionMode === 'multiple'
    ? selectedValues.length ? `${selectedValues.length} selected` : placeholder
    : selectedItem?.label ?? placeholder;
  const activeItemId = enabledItems[activeIndex] ? `${id}-option-${enabledItems[activeIndex].id}` : undefined;
  const handleEditableChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateInputValue(event.target.value);
    setActiveIndex(0);
    setOpen(true);
  };

  return <div ref={rootRef} className={`aisee-dropdown ${className}`.trim()}>
    {label && <label className="aisee-field__label" htmlFor={editable ? id : undefined}>{label}</label>}
    {editable ? <div className={`aisee-dropdown__trigger aisee-dropdown__trigger--input${open ? ' is-open' : ''}`}>
      <input
        id={id}
        className="aisee-dropdown__input"
        role="combobox"
        aria-label={ariaLabel ?? label}
        aria-autocomplete="list"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={menuId}
        aria-activedescendant={open ? activeItemId : undefined}
        value={query}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleEditableChange}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <img className="aisee-dropdown__caret" src={dropdownChevronIcon} alt="" aria-hidden="true" />
    </div> : <button
      className="aisee-dropdown__trigger"
      type="button"
      aria-label={ariaLabel ?? label}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={menuId}
      disabled={disabled}
      onClick={() => setOpen((current) => !current)}
      onKeyDown={handleKeyDown}
    >
      <span className={selectionMode === 'multiple' ? (selectedValues.length ? '' : 'aisee-dropdown__placeholder') : (selectedItem ? '' : 'aisee-dropdown__placeholder')}>{triggerCopy}</span>
      <img className="aisee-dropdown__caret" src={dropdownChevronIcon} alt="" aria-hidden="true" />
    </button>}
    {open && <div id={menuId} className="aisee-dropdown__menu" role="listbox" aria-multiselectable={selectionMode === 'multiple' || undefined} aria-label={ariaLabel ?? label ?? placeholder}>
      {filterable && !editable && <input
        className="aisee-dropdown__filter"
        type="search"
        value={filterQuery}
        placeholder="Filter options"
        aria-label="Filter options"
        autoFocus
        onChange={(event) => { setFilterQuery(event.target.value); setActiveIndex(0); }}
        onKeyDown={handleKeyDown}
      />}
      {visibleItems.length ? visibleItems.map((item) => <button
        id={`${id}-option-${item.id}`}
        key={item.id}
        className="aisee-dropdown__option"
        data-active={enabledItems[activeIndex]?.id === item.id || undefined}
        type="button"
        role="option"
        aria-selected={isSelected(item.id)}
        disabled={item.disabled}
        onClick={() => selectItem(item)}
      >
        <span className="aisee-dropdown__option-leading">
          {selectionMode === 'multiple' && <span className="aisee-dropdown__checkbox" aria-hidden="true" />}
          <span>{item.label}</span>
        </span>
      </button>) : <p className="aisee-dropdown__empty">{noResultsText}</p>}
    </div>}
  </div>;
}
