import { useId, useState, type CSSProperties } from 'react';
import { Tooltip } from './Tooltip';
import infoIcon from '../../assets/segmented-choice/info.svg';

export interface SegmentedChoiceOption {
  id: string;
  label: string;
  requirement?: string;
  /** Explanation shown below the group and on the information control. */
  description?: string;
  disabled?: boolean;
}
export interface SegmentedChoiceProps {
  label: string;
  options: readonly SegmentedChoiceOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  tone?: 'lime' | 'yellow';
  className?: string;
}
/** A compact single choice for 2–4 options with short requirements. */
export function SegmentedChoice({ label, options, value, defaultValue = '', onValueChange,
  name, required = false, disabled = false, tone = 'lime', className = '' }: SegmentedChoiceProps) {
  const id = useId();
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selected = value ?? internalValue;
  const selectedOption = options.find(option => option.id === selected);
  return <fieldset className={`aisee-segmented-choice aisee-segmented-choice--${tone} ${className}`.trim()} disabled={disabled}>
    <legend>{label}{required && <span aria-hidden="true"> *</span>}</legend>
    <div className="aisee-segmented-choice__options" style={{ '--choice-count': Math.max(1, options.length) } as CSSProperties}>
      {options.map((option, index) => <label className="aisee-segmented-choice__option" key={option.id}>
        <input type="radio" name={name ?? id} value={option.id} checked={selected === option.id} required={required}
          disabled={option.disabled} aria-label={option.label}
          aria-describedby={[option.requirement ? `${id}-${index}-requirement` : '', option.description ? `${id}-${index}-description` : ''].filter(Boolean).join(' ') || undefined}
          onChange={() => { if (value === undefined) setInternalValue(option.id); onValueChange?.(option.id); }} />
        <span className="aisee-segmented-choice__surface">
          <span className="aisee-segmented-choice__label">{option.label}</span>
          {option.requirement && <span id={`${id}-${index}-requirement`} className="aisee-segmented-choice__requirement">{option.requirement}</span>}
        </span>
        {option.description && <span id={`${id}-${index}-description`} hidden>{option.description}</span>}
      </label>)}
    </div>
    {selectedOption?.description && <div className="aisee-segmented-choice__help">
      <Tooltip content={selectedOption.description} placement="bottom">
        <button type="button" className="aisee-segmented-choice__info" aria-label={`${selectedOption.label}: ${selectedOption.description}`}>
          <img src={infoIcon} alt="" />
        </button>
      </Tooltip>
      <span aria-live="polite">{selectedOption.description}</span>
    </div>}
  </fieldset>;
}
