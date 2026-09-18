import { forwardRef, useId, type InputHTMLAttributes } from 'react';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  /** Omit to inherit the current module colour. */
  color?: 'lime' | 'yellow';
  /** Track height in pixels; 16 preserves the existing compact control. */
  size?: 16 | 24;
  surface?: 'light' | 'dark';
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(function Toggle({ id, label, color, size = 16, surface = 'light', ...props }, ref) {
  const fallbackId = useId();
  const inputId = id ?? fallbackId;
  return <label className="aisee-toggle" data-color={color} data-size={size} data-surface={surface} htmlFor={inputId}>
    <input ref={ref} className="aisee-sr-only" id={inputId} type="checkbox" role="switch" {...props} />
    <span className="aisee-toggle__control" aria-hidden="true"><span className="aisee-toggle__thumb" /></span>
    {label && <span className="aisee-toggle__label">{label}</span>}
  </label>;
});
