import { forwardRef, useId, type InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { id, label, hint, error, className = '', ...props }, ref,
) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const descriptionId = `${inputId}-description`;
  return <label className="aisee-field" htmlFor={inputId}>
    {label && <span className="aisee-field__label">{label}</span>}
    <input ref={ref} id={inputId} className={`aisee-input ${className}`.trim()} aria-invalid={Boolean(error)} aria-describedby={(hint || error) ? descriptionId : undefined} {...props} />
    {(error || hint) && <span id={descriptionId} className={error ? 'aisee-field__error' : 'aisee-field__hint'}>{error ?? hint}</span>}
  </label>;
});
