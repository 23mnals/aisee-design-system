import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type DialogHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import dialogCloseIcon from '../../assets/dialog-close.svg';

export type DialogLayout = 'standard' | 'centered' | 'split';
export type DialogSize = 'sm' | 'md' | 'lg';
export type DialogHeadingSize = 'sm' | 'md';
export type DialogFooterLayout = 'inline' | 'stacked' | 'split';

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'title' | 'onClose'> {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  onClose: () => void;
  layout?: DialogLayout;
  size?: DialogSize;
  headingSize?: DialogHeadingSize;
  illustration?: ReactNode;
  notice?: ReactNode;
  sidebar?: ReactNode;
  sidebarLabel?: string;
  footer?: ReactNode;
  footerLayout?: DialogFooterLayout;
  closeable?: boolean;
  closeLabel?: string;
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog({
  open,
  title,
  description,
  onClose,
  layout = 'standard',
  size = 'md',
  headingSize = 'md',
  illustration,
  notice,
  sidebar,
  sidebarLabel = 'Dialog sections',
  footer,
  footerLayout = 'inline',
  closeable = true,
  closeLabel = 'Close dialog',
  className = '',
  children,
  ...props
}, forwardedRef) {
  const innerRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDialogElement);
  useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const body = <div className="aisee-dialog__main">
    {illustration && <div className="aisee-dialog__illustration">{illustration}</div>}
    <header className="aisee-dialog__header">
      <div className="aisee-dialog__heading">
        <h2 id={titleId} className="aisee-dialog__title">{title}</h2>
        {description && <p id={descriptionId} className="aisee-dialog__description">{description}</p>}
      </div>
      {closeable && <button className="aisee-dialog__close" type="button" aria-label={closeLabel} onClick={onClose}>
        <img src={dialogCloseIcon} alt="" />
      </button>}
    </header>
    {notice && <div className="aisee-dialog__notice-slot">{notice}</div>}
    {children && <div className="aisee-dialog__content">{children}</div>}
    {footer && <footer className={`aisee-dialog__footer aisee-dialog__footer--${footerLayout}`}>{footer}</footer>}
  </div>;

  return <dialog
    {...props}
    ref={innerRef}
    className={`aisee-dialog aisee-dialog--${layout} aisee-dialog--${size} aisee-dialog--heading-${headingSize} ${className}`.trim()}
    aria-labelledby={titleId}
    aria-describedby={description ? descriptionId : undefined}
    onClose={onClose}
    onCancel={onClose}
  >
    {layout === 'split'
      ? <div className="aisee-dialog__split">
        {sidebar && <aside className="aisee-dialog__sidebar" aria-label={sidebarLabel}>{sidebar}</aside>}
        {body}
      </div>
      : body}
  </dialog>;
});

export type DialogNoticeTone = 'info' | 'warning' | 'danger';
export interface DialogNoticeProps extends HTMLAttributes<HTMLDivElement> {
  tone?: DialogNoticeTone;
  icon?: ReactNode;
}

export function DialogNotice({ tone = 'info', icon, className = '', children, ...props }: DialogNoticeProps) {
  return <div
    {...props}
    className={`aisee-dialog-notice aisee-dialog-notice--${tone} ${className}`.trim()}
    role={tone === 'danger' ? 'alert' : 'note'}
  >
    {icon && <span className="aisee-dialog-notice__icon" aria-hidden="true">{icon}</span>}
    <span>{children}</span>
  </div>;
}

export interface DialogDetailsProps extends HTMLAttributes<HTMLDListElement> {}
export function DialogDetails({ className = '', ...props }: DialogDetailsProps) {
  return <dl {...props} className={`aisee-dialog-details ${className}`.trim()} />;
}

export interface DialogDetailRowProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  valueTone?: 'default' | 'muted' | 'danger';
}
export function DialogDetailRow({ label, value, valueTone = 'default', className = '', ...props }: DialogDetailRowProps) {
  return <div {...props} className={`aisee-dialog-details__row ${className}`.trim()}>
    <dt>{label}</dt>
    <dd data-tone={valueTone}>{value}</dd>
  </div>;
}

export interface DialogSummaryProps extends HTMLAttributes<HTMLDivElement> {}
export function DialogSummary({ className = '', ...props }: DialogSummaryProps) {
  return <div {...props} className={`aisee-dialog-summary ${className}`.trim()} />;
}
