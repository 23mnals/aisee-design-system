import { useId, useState, type ChangeEvent, type KeyboardEvent } from 'react';

export interface TagInputProps {
  label?: string;
  values?: string[];
  defaultValues?: string[];
  onValuesChange?: (values: string[]) => void;
  placeholder?: string;
  helperText?: string;
  addLabel?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function TagInput({
  label = 'What to mention',
  values,
  defaultValues = [],
  onValuesChange,
  placeholder = 'Enter a topic',
  helperText = 'Enter or click to add · ⌫ on empty to remove last',
  addLabel = 'Add',
  disabled = false,
  className = '',
  id,
}: TagInputProps) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const [internalValues, setInternalValues] = useState(defaultValues);
  const [draft, setDraft] = useState('');
  const currentValues = values ?? internalValues;

  const updateValues = (nextValues: string[]) => {
    if (values === undefined) setInternalValues(nextValues);
    onValuesChange?.(nextValues);
  };

  const commitDraft = () => {
    const nextValue = draft.trim();
    if (!nextValue || disabled) return;
    if (!currentValues.includes(nextValue)) updateValues([...currentValues, nextValue]);
    setDraft('');
  };

  const removeValue = (value: string) => {
    if (disabled) return;
    updateValues(currentValues.filter((item) => item !== value));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitDraft();
      return;
    }
    if (event.key === 'Backspace' && !draft && currentValues.length) {
      event.preventDefault();
      removeValue(currentValues[currentValues.length - 1]);
    }
  };

  return <div className={`aisee-tag-input-field ${className}`.trim()}>
    {label && <label className="aisee-tag-input-field__label" htmlFor={inputId}>{label}</label>}
    <div className="aisee-tag-input" aria-disabled={disabled || undefined}>
      <div className="aisee-tag-input__content">
        {draft && <span className="aisee-tag-input__draft" aria-hidden="true">{draft}</span>}
        {currentValues.map((value) => <span key={value} className="aisee-tag-input__tag">
          <span>{value}</span>
          <button type="button" className="aisee-tag-input__remove" onClick={() => removeValue(value)} aria-label={`移除 ${value}`} disabled={disabled}>
            <span aria-hidden="true" />
          </button>
        </span>)}
        <input
          id={inputId}
          className="aisee-tag-input__input"
          value={draft}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={currentValues.length ? '' : placeholder}
          disabled={disabled}
          aria-describedby={helperText ? `${inputId}-description` : undefined}
        />
      </div>
      <button type="button" className="aisee-tag-input__add" onClick={commitDraft} disabled={disabled || !draft.trim()}>
        <span className="aisee-tag-input__add-icon" aria-hidden="true" />
        <span>{addLabel}</span>
      </button>
    </div>
    {helperText && <span id={`${inputId}-description`} className="aisee-tag-input-field__hint">{helperText}</span>}
  </div>;
}
