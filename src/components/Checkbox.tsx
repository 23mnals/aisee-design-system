import { forwardRef, useEffect, useId, useRef, useState, type ChangeEvent, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, description, className = '', onChange, ...props },
  ref,
) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const [celebrating, setCelebrating] = useState(false);
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => {
    if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked && !event.currentTarget.disabled) {
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current);
      setCelebrating(false);
      requestAnimationFrame(() => {
        setCelebrating(true);
        celebrationTimer.current = setTimeout(() => setCelebrating(false), 620);
      });
    }
    onChange?.(event);
  };

  return <label className={`aisee-checkbox ${className}`.trim()} htmlFor={inputId}>
    <input
      ref={ref}
      id={inputId}
      className="aisee-sr-only"
      type="checkbox"
      aria-describedby={descriptionId}
      onChange={handleChange}
      {...props}
    />
    <span className="aisee-checkbox__control" data-celebrating={celebrating || undefined} aria-hidden="true">
      <span className="aisee-checkbox__burst">
        {Array.from({ length: 8 }, (_, index) => <span className="aisee-checkbox__burst-dot" style={{ '--aisee-checkbox-burst-index': index } as CSSProperties} key={index} />)}
      </span>
    </span>
    {(label || description) && <span className="aisee-checkbox__copy">
      {label && <span className="aisee-checkbox__label">{label}</span>}
      {description && <span id={descriptionId} className="aisee-checkbox__description">{description}</span>}
    </span>}
  </label>;
});
