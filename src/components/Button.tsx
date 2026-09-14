import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', leadingIcon, className = '', children, type = 'button', ...props },
  ref,
) {
  return <button ref={ref} type={type} className={`aisee-button aisee-button--${variant} aisee-button--${size} ${className}`.trim()} {...props}>
    <span className="aisee-button__content">{leadingIcon}{children}</span>
  </button>;
});
