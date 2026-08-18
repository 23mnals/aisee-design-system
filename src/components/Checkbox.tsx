import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: ReactNode;
  description?: ReactNode;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { id, label, description, className = '', ...props },
  ref,
) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const descriptionId = description ? `${inputId}-description` : undefined;

  return <label className={`aisee-checkbox ${className}`.trim()} htmlFor={inputId}>
    <input
      ref={ref}
      id={inputId}
      className="aisee-sr-only"
      type="checkbox"
      aria-describedby={descriptionId}
      {...props}
    />
    <span className="aisee-checkbox__control" aria-hidden="true" />
    {(label || description) && <span className="aisee-checkbox__copy">
      {label && <span className="aisee-checkbox__label">{label}</span>}
      {description && <span id={descriptionId} className="aisee-checkbox__description">{description}</span>}
    </span>}
  </label>;
});
