import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** One semantic icon. Omit for a text-only button. */
  icon?: ReactNode;
  /** Actions lead; forward navigation and AI generation trail. */
  iconPosition?: 'left' | 'right';
  /** Hides the icon and its spacing without changing the action. */
  showIcon?: boolean;
  /** Backwards-compatible leading slot; prefer icon for new usage. */
  leadingIcon?: ReactNode;
  /** Optional trailing slot; pair with leadingIcon for two-sided actions. icon takes precedence over both slots. */
  trailingIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', icon, iconPosition = 'left', showIcon = true, leadingIcon, trailingIcon, className = '', children, type = 'button', ...props },
  ref,
) {
  const leftIcon = icon != null ? (iconPosition === 'left' ? icon : null) : leadingIcon;
  const rightIcon = icon != null ? (iconPosition === 'right' ? icon : null) : trailingIcon;
  const iconSlot = (content: ReactNode) => showIcon && content != null && content !== false && <span className="aisee-button__icon" aria-hidden="true">{content}</span>;
  return <button ref={ref} type={type} className={`aisee-button aisee-button--${variant} aisee-button--${size} ${className}`.trim()} {...props}>
    <span className="aisee-button__content">{iconSlot(leftIcon)}{children}{iconSlot(rightIcon)}</span>
  </button>;
});
