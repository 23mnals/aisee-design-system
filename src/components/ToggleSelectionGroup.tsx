import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Checkbox } from './Checkbox';
import { Toggle } from './Toggle';

export interface ToggleSelectionOption {
  id: string;
  label: ReactNode;
  disabled?: boolean;
  disabledReason?: string;
}
export interface ToggleSelectionValue {
  enabled: boolean;
  /** Omit until the first activation. An explicit [] is a saved empty selection. */
  selectedIds?: readonly string[];
}
export type ToggleSelectionAction = { type: 'enabled'; enabled: boolean } | { type: 'option'; id: string } | { type: 'all' };

export function resolveToggleSelection(options: readonly ToggleSelectionOption[], value: ToggleSelectionValue) {
  const selectableIds = options.filter(option => !option.disabled).map(option => option.id);
  const savedIds = [...new Set(value.selectedIds ?? (value.enabled ? selectableIds : []))];
  const visibleSelectedIds = options.filter(option => savedIds.includes(option.id)).map(option => option.id);
  const allSelected = selectableIds.length > 0 && selectableIds.every(id => savedIds.includes(id));
  const someSelected = selectableIds.some(id => savedIds.includes(id));
  return { savedIds, visibleSelectedIds, selectableIds, allSelected, someSelected,
    activeSelectedIds: value.enabled ? selectableIds.filter(id => savedIds.includes(id)) : [] };
}

/** Pure transition shared by the component and tests; disabling never clears saved IDs. */
export function updateToggleSelection(options: readonly ToggleSelectionOption[], value: ToggleSelectionValue, action: ToggleSelectionAction): ToggleSelectionValue {
  const current = resolveToggleSelection(options, value);
  if (action.type === 'enabled') {
    return { enabled: action.enabled, selectedIds: value.selectedIds === undefined && action.enabled ? current.selectableIds : current.savedIds };
  }
  if (!value.enabled) return value;
  if (action.type === 'option' && !current.selectableIds.includes(action.id)) return value;
  const selected = new Set(current.savedIds);
  if (action.type === 'all') current.selectableIds.forEach(id => current.allSelected ? selected.delete(id) : selected.add(id));
  else if (selected.has(action.id)) selected.delete(action.id);
  else selected.add(action.id);
  return { enabled: value.enabled, selectedIds: [...selected] };
}

export interface ToggleSelectionGroupProps {
  label: string;
  options: readonly ToggleSelectionOption[];
  value?: ToggleSelectionValue;
  defaultValue?: ToggleSelectionValue;
  onChange?: (value: ToggleSelectionValue, action: ToggleSelectionAction) => void;
  icon?: ReactNode;
  metadata?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  showAll?: boolean;
  allLabel?: string;
  enabledLabel?: string;
  disabledLabel?: string;
  emptyText?: string;
  selectionLabel?: (selected: number, total: number) => ReactNode;
  className?: string;
}

export function ToggleSelectionGroup({
  label, options, value, defaultValue = { enabled: false }, onChange, icon, metadata, description,
  disabled = false, showAll = true, allLabel = 'All', enabledLabel = 'Included', disabledLabel = 'Excluded',
  emptyText = 'No options available.', selectionLabel, className = '',
}: ToggleSelectionGroupProps) {
  const id = useId();
  const allRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState<ToggleSelectionValue>(() => defaultValue.enabled && defaultValue.selectedIds === undefined
    ? { enabled: true, selectedIds: options.filter(option => !option.disabled).map(option => option.id) } : defaultValue);
  const current = value ?? internalValue;
  const state = resolveToggleSelection(options, current);
  const optionsDisabled = disabled || !current.enabled;
  const mixed = state.someSelected && !state.allSelected;
  useEffect(() => { if (allRef.current) allRef.current.indeterminate = mixed; }, [mixed]);

  function change(action: ToggleSelectionAction) {
    if (disabled || (action.type === 'enabled' && options.length === 0)) return;
    const next = updateToggleSelection(options, current, action);
    if (next === current) return;
    if (value === undefined) setInternalValue(next);
    onChange?.(next, action);
  }

  return <div className={`aisee-selection-group ${className}`.trim()} role="group" aria-labelledby={`${id}-label`} aria-describedby={description ? `${id}-description` : undefined}>
    <div className="aisee-selection-group__header">
      <div className="aisee-selection-group__identity">
        {icon && <span className="aisee-selection-group__icon" aria-hidden="true">{icon}</span>}
        <span className="aisee-selection-group__label" id={`${id}-label`}>{label}</span>
        <span className="aisee-selection-group__count">{selectionLabel ? selectionLabel(state.visibleSelectedIds.length, options.length) : <><strong>{state.visibleSelectedIds.length}</strong>/{options.length} selected</>}</span>
        {metadata && <span className="aisee-selection-group__metadata">{metadata}</span>}
      </div>
      <Toggle checked={current.enabled} onChange={event => change({ type: 'enabled', enabled: event.target.checked })} disabled={disabled || options.length === 0} aria-label={`${label}: ${current.enabled ? enabledLabel : disabledLabel}`} label={current.enabled ? enabledLabel : disabledLabel} />
    </div>
    {description && <div className="aisee-selection-group__description" id={`${id}-description`}>{description}</div>}
    {options.length > 0 ? <div className="aisee-selection-group__options" aria-label={`${label} options`}>
      {showAll && <Checkbox ref={allRef} className="aisee-selection-group__option aisee-selection-group__all" label={allLabel} checked={state.allSelected} aria-checked={mixed ? 'mixed' : state.allSelected} disabled={optionsDisabled || state.selectableIds.length === 0} onChange={() => change({ type: 'all' })} />}
      {options.map(option => <Checkbox className="aisee-selection-group__option" key={option.id} label={option.label} checked={state.savedIds.includes(option.id)} disabled={optionsDisabled || option.disabled} title={option.disabledReason} onChange={() => change({ type: 'option', id: option.id })} />)}
    </div> : <div className="aisee-selection-group__description">{emptyText}</div>}
  </div>;
}
