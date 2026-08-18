import { useEffect, type HTMLAttributes, type ReactNode } from 'react';

export interface ToastProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  open?: boolean;
  children: ReactNode;
  tone?: 'default' | 'success' | 'error';
  duration?: number;
  onDismiss?: () => void;
  dismissLabel?: string;
}

export function Toast({
  open = true,
  children,
  tone = 'default',
  duration = 3500,
  onDismiss,
  dismissLabel = 'Dismiss notification',
  className = '',
  ...props
}: ToastProps) {
  useEffect(() => {
    if (!open || duration <= 0 || !onDismiss) return;
    const timer = window.setTimeout(onDismiss, duration);
    return () => window.clearTimeout(timer);
  }, [duration, onDismiss, open]);

  if (!open) return null;
  return <div
    {...props}
    className={`aisee-toast aisee-toast--${tone} ${className}`.trim()}
    role={tone === 'error' ? 'alert' : 'status'}
    aria-live={tone === 'error' ? 'assertive' : 'polite'}
  >
    <span>{children}</span>
    {onDismiss && <button type="button" className="aisee-toast__dismiss" aria-label={dismissLabel} onClick={onDismiss}>×</button>}
  </div>;
}

export function ToastViewport({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`aisee-toast-viewport ${className}`.trim()} aria-label="Notifications" />;
}
