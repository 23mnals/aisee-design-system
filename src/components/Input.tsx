import { forwardRef, useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from 'react';

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

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
}

/** Multiline counterpart of Input, with the same focus, disabled and validation treatment. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, hint, error, className = '', 'aria-describedby': describedBy, ...props }, ref,
) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  const descriptionId = `${inputId}-description`;
  const descriptions = [describedBy, (hint || error) ? descriptionId : undefined].filter(Boolean).join(' ') || undefined;
  return <label className="aisee-field" htmlFor={inputId}>
    {label && <span className="aisee-field__label">{label}</span>}
    <textarea {...props} ref={ref} id={inputId} className={`aisee-input aisee-textarea ${className}`.trim()} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={descriptions} />
    {(error || hint) && <span id={descriptionId} className={error ? 'aisee-field__error' : 'aisee-field__hint'}>{error ?? hint}</span>}
  </label>;
});
