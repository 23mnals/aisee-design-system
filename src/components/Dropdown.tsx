import { Fragment, useCallback, useEffect, useId, useMemo, useRef, useState, type ChangeEvent, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type MouseEvent as ReactMouseEvent, type ReactNode } from 'react';
import dropdownChevronIcon from '../../assets/stemui/line_chevron-up.svg';
import dropdownCheckIcon from '../../assets/stemui/action-check.svg';

export interface DropdownItem {
  id: string;
  label: string;
  leading?: ReactNode;
  supportingText?: string;
  trailing?: ReactNode;
  action?: {
    label: string;
    icon?: ReactNode;
    onClick?: (item: DropdownItem) => void;
  };
  group?: string;
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
  filterPlaceholder?: string;
  noResultsText?: string;
  menuHeader?: ReactNode;
  footer?: ReactNode;
  disabled?: boolean;
  fluidHover?: boolean;
  gapClick?: boolean | { maxDistance?: number };
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
  filterPlaceholder = 'Filter options',
  noResultsText = 'No results',
  menuHeader,
  footer,
  disabled = false,
  fluidHover = true,
  gapClick = true,
  ariaLabel,
  className = '',
}: DropdownProps) {
  const id = useId();
  const menuId = `${id}-menu`;
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef(new Map<string, HTMLButtonElement>());
  const itemGeometryRef = useRef(new Map<string, { x: number; y: number; width: number; height: number; centerY: number }>());
  const highlightSizeRef = useRef({ width: 0, height: 0 });
  const activeIndexRef = useRef(0);
  const pointerFrameRef = useRef<number | null>(null);
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
  const enabledItems = useMemo(() => visibleItems.filter((item) => !item.disabled), [visibleItems]);

  const measureItems = useCallback(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const menuRect = menu.getBoundingClientRect();
    const nextGeometry = new Map<string, { x: number; y: number; width: number; height: number; centerY: number }>();
    enabledItems.forEach((item) => {
      const element = itemRefs.current.get(item.id);
      if (!element) return;
      const itemRect = (element.closest<HTMLElement>('.aisee-dropdown__option-shell') ?? element).getBoundingClientRect();
      nextGeometry.set(item.id, {
        x: itemRect.left - menuRect.left - menu.clientLeft,
        y: itemRect.top - menuRect.top - menu.clientTop,
        width: itemRect.width,
        height: itemRect.height,
        centerY: itemRect.top + itemRect.height / 2,
      });
    });
    itemGeometryRef.current = nextGeometry;
  }, [enabledItems]);

  const positionHighlight = useCallback((index: number, instant = false) => {
    if (!fluidHover) return;
    const highlight = highlightRef.current;
    const item = enabledItems[index];
    if (!highlight || !item) {
      highlight?.removeAttribute('data-visible');
      return;
    }
    if (!itemGeometryRef.current.has(item.id)) measureItems();
    const geometry = itemGeometryRef.current.get(item.id);
    if (!geometry) {
      highlight.removeAttribute('data-visible');
      return;
    }
    if (instant) highlight.setAttribute('data-instant', 'true');
    if (highlightSizeRef.current.width !== geometry.width) {
      highlight.style.width = `${geometry.width}px`;
      highlightSizeRef.current.width = geometry.width;
    }
    if (highlightSizeRef.current.height !== geometry.height) {
      highlight.style.height = `${geometry.height}px`;
      highlightSizeRef.current.height = geometry.height;
    }
    highlight.style.transform = `translate3d(${geometry.x}px, ${geometry.y}px, 0)`;
    highlight.setAttribute('data-visible', 'true');
    if (instant) requestAnimationFrame(() => highlight.removeAttribute('data-instant'));
  }, [enabledItems, fluidHover, measureItems]);

  const activateIndex = useCallback((index: number) => {
    const nextIndex = Math.max(0, Math.min(index, enabledItems.length - 1));
    if (activeIndexRef.current === nextIndex && highlightRef.current?.getAttribute('data-visible') === 'true') return;
    activeIndexRef.current = nextIndex;
    setActiveIndex(nextIndex);
    positionHighlight(nextIndex);
  }, [enabledItems.length, positionHighlight]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => document.removeEventListener('pointerdown', closeOnOutsidePointer);
  }, [open]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    if (activeIndex >= enabledItems.length) {
      const nextIndex = Math.max(0, enabledItems.length - 1);
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
    }
  }, [activeIndex, enabledItems.length]);

  useEffect(() => () => {
    if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current);
  }, []);

  useEffect(() => {
    if (!open || !fluidHover) return;
    const frame = requestAnimationFrame(() => {
      measureItems();
      positionHighlight(activeIndexRef.current);
    });
    const remeasure = () => {
      measureItems();
      positionHighlight(activeIndexRef.current, true);
    };
    window.addEventListener('resize', remeasure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', remeasure);
    };
  }, [fluidHover, measureItems, open, positionHighlight, visibleItems]);

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
    const nextIndex = event.key === 'Home' ? 0
      : event.key === 'End' ? enabledItems.length - 1
        : event.key === 'ArrowUp' ? (activeIndex - 1 + enabledItems.length) % enabledItems.length
          : (activeIndex + 1) % enabledItems.length;
    activateIndex(nextIndex);
  };

  const triggerCopy = selectionMode === 'multiple'
    ? selectedValues.length ? `${selectedValues.length} selected` : placeholder
    : selectedItem?.label ?? placeholder;
  const activeItemId = enabledItems[activeIndex] ? `${id}-option-${enabledItems[activeIndex].id}` : undefined;
  const handleEditableChange = (event: ChangeEvent<HTMLInputElement>) => {
    updateInputValue(event.target.value);
    activeIndexRef.current = 0;
    setActiveIndex(0);
    setOpen(true);
  };

  const handleMenuPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!fluidHover || !enabledItems.length) return;
    const target = event.target as HTMLElement;
    if (target.closest('.aisee-dropdown__filter, .aisee-dropdown__menu-header, .aisee-dropdown__footer, .aisee-dropdown__option-action')) return;
    const direct = target.closest<HTMLButtonElement>('.aisee-dropdown__option:not(:disabled)');
    if (direct && event.currentTarget.contains(direct)) {
      const directIndex = enabledItems.findIndex((item) => item.id === direct.dataset.dropdownItem);
      if (directIndex >= 0 && directIndex !== activeIndexRef.current) activateIndex(directIndex);
      return;
    }
    const pointerY = event.clientY;
    if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current);
    pointerFrameRef.current = requestAnimationFrame(() => {
      pointerFrameRef.current = null;
      const nearest = enabledItems.reduce<{ index: number; distance: number } | null>((closest, item, index) => {
        const geometry = itemGeometryRef.current.get(item.id);
        if (!geometry) return closest;
        const distance = Math.abs(geometry.centerY - pointerY);
        return !closest || distance < closest.distance ? { index, distance } : closest;
      }, null);
      if (nearest && nearest.index !== activeIndexRef.current) activateIndex(nearest.index);
    });
  };

  const handleMenuGapClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!gapClick || !enabledItems.length) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, input, a, .aisee-dropdown__menu-header, .aisee-dropdown__footer')) return;
    const maxDistance = typeof gapClick === 'object' ? gapClick.maxDistance : undefined;
    if (maxDistance !== undefined) {
      const element = itemRefs.current.get(enabledItems[activeIndex]?.id ?? '');
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const distance = Math.max(rect.top - event.clientY, event.clientY - rect.bottom, 0);
      if (distance > maxDistance) return;
    }
    selectItem(enabledItems[activeIndex]);
  };

  return <div ref={rootRef} className={`aisee-dropdown${fluidHover ? ' aisee-dropdown--fluid' : ''} ${className}`.trim()}>
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
    {open && <div ref={menuRef} id={menuId} className="aisee-dropdown__menu" role="listbox" aria-multiselectable={selectionMode === 'multiple' || undefined} aria-label={ariaLabel ?? label ?? placeholder} onPointerMove={handleMenuPointerMove} onClick={handleMenuGapClick}>
      {fluidHover && <span ref={highlightRef} className="aisee-dropdown__fluid-highlight" aria-hidden="true" />}
      {menuHeader && <div className="aisee-dropdown__menu-header">{menuHeader}</div>}
      {filterable && !editable && <input
        className="aisee-dropdown__filter"
        type="search"
        value={filterQuery}
        placeholder={filterPlaceholder}
        aria-label={filterPlaceholder}
        autoFocus
        onChange={(event) => { setFilterQuery(event.target.value); activeIndexRef.current = 0; setActiveIndex(0); }}
        onKeyDown={handleKeyDown}
      />}
      {visibleItems.length ? visibleItems.map((item, index) => <Fragment key={item.id}>
        {item.group && item.group !== visibleItems[index - 1]?.group && <div className="aisee-dropdown__group-label">{item.group}</div>}
        <div className={`aisee-dropdown__option-shell${item.action ? ' aisee-dropdown__option-shell--action' : ''}`}>
          <button
            id={`${id}-option-${item.id}`}
            className="aisee-dropdown__option"
            ref={(element) => { if (element) itemRefs.current.set(item.id, element); else itemRefs.current.delete(item.id); }}
            data-dropdown-item={item.id}
            data-fluid-hover-active={fluidHover && enabledItems[activeIndex]?.id === item.id || undefined}
            data-active={enabledItems[activeIndex]?.id === item.id || undefined}
            type="button"
            role="option"
            aria-selected={isSelected(item.id)}
            disabled={item.disabled}
            onClick={() => selectItem(item)}
          >
            <span className="aisee-dropdown__option-leading">
              {selectionMode === 'multiple' && <span className="aisee-dropdown__checkbox" aria-hidden="true">
                {isSelected(item.id) && <img src={dropdownCheckIcon} alt="" />}
              </span>}
              {item.leading && <span className="aisee-dropdown__option-icon" aria-hidden="true">{item.leading}</span>}
              <span className="aisee-dropdown__option-copy"><span>{item.label}</span>{item.supportingText && <span>{item.supportingText}</span>}</span>
            </span>
            {item.trailing && <span className="aisee-dropdown__option-trailing">{item.trailing}</span>}
          </button>
          {item.action && !item.disabled && <button
            className="aisee-dropdown__option-action"
            type="button"
            aria-label={item.action.label}
            onClick={(event) => { event.stopPropagation(); item.action?.onClick?.(item); }}
          >{item.action.icon ?? <span aria-hidden="true">+</span>}</button>}
        </div>
      </Fragment>) : <p className="aisee-dropdown__empty">{noResultsText}</p>}
      {footer && <div className="aisee-dropdown__footer">{footer}</div>}
    </div>}
  </div>;
}
