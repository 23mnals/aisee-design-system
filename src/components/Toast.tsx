import { useEffect, type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import toastCheckIcon from '../../assets/stemui/action-check.svg';
import toastCloseIcon from '../../assets/stemui/action-close.svg';

export type ToastTone = 'default' | 'success' | 'error' | 'agent';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  open?: boolean;
  children: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  duration?: number;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function Toast({
  open = true,
  children,
  description,
  tone = 'default',
  duration = 3500,
  onDismiss,
  dismissLabel = 'Dismiss notification',
  className = '',
  style,
  ...props
}: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0 || !onDismiss) return;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss, open]);

  if (!open) return null;
  const visualTone = tone === 'default' ? 'success' : tone;
  const icon = {
    success: toastCheckIcon,
    error: toastCloseIcon,
    agent: toastCheckIcon,
  }[visualTone];
  const toastStyle = {
    ...style,
    '--aisee-toast-duration': `${Math.max(duration, 0)}ms`,
  } as CSSProperties;

  return <div
    {...props}
    className={`aisee-toast aisee-toast--${visualTone}${description ? ' aisee-toast--two-line' : ''}${duration <= 0 ? ' aisee-toast--persistent' : ''} ${className}`.trim()}
    style={toastStyle}
    role={tone === 'error' ? 'alert' : 'status'}
    aria-live={tone === 'error' ? 'assertive' : 'polite'}
  >
    <span className="aisee-toast__icon" aria-hidden="true"><span><img src={icon} alt="" /></span></span>
    <span className="aisee-toast__content">
      <span className="aisee-toast__title">{children}</span>
      {description && <span className="aisee-toast__description">{description}</span>}
    </span>
    {onDismiss && <button type="button" className="aisee-toast__dismiss" aria-label={dismissLabel} onClick={onDismiss}>
      <img src={toastCloseIcon} alt="" aria-hidden="true" />
    </button>}
    <span className="aisee-toast__progress" aria-hidden="true"><span /></span>
  </div>;
}

export function ToastViewport({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`aisee-toast-viewport ${className}`.trim()} aria-label="Notifications" />;
}
