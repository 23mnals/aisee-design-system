import { forwardRef, useId, type InputHTMLAttributes } from 'react';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> { label?: string; }

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle({ id, label, ...props }, ref) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  return <label className="aisee-toggle" htmlFor={inputId}>
    <input ref={ref} className="aisee-sr-only" id={inputId} type="checkbox" role="switch" {...props} />
    <span className="aisee-toggle__control" aria-hidden="true"><span className="aisee-toggle__thumb" /></span>
    {label && <span>{label}</span>}
  </label>;
});
