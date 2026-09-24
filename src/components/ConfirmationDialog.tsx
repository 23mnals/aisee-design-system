import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type DialogHTMLAttributes, type ReactNode } from 'react';
import dialogCloseIcon from '../../assets/dialog-close.svg';
import { Button } from './Button';

export interface ConfirmationDialogNotice {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  /** Optional host icon; business-specific illustrations are not bundled. */
  icon?: ReactNode;
  tone: 'positive' | 'warning';
}

export interface ConfirmationDialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'title' | 'onClose'> {
  open: boolean;
  title: ReactNode;
  description?: ReactNode;
  notices?: ConfirmationDialogNotice[];
  cancelLabel?: string;
  confirmLabel?: string;
  closeLabel?: string;
  confirmVariant?: 'primary' | 'danger';
  confirmDisabled?: boolean;
  onClose: () => void;
  /** The host owns the operation, errors and whether the dialog closes. */
  onConfirm: () => void;
}

export const ConfirmationDialog = forwardRef<HTMLDialogElement, ConfirmationDialogProps>(function ConfirmationDialog(
  { open, title, description, notices = [], children, cancelLabel = 'Keep Editing', confirmLabel = 'Discard Changes', closeLabel = 'Close dialog', confirmVariant = 'danger', confirmDisabled = false, onClose, onConfirm, onCancel, className = '', ...props },
  forwardedRef,
) {
  const innerRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDialogElement);

  useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      cancelRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return <dialog
    {...props}
    ref={innerRef}
    className={`aisee-confirmation-dialog${notices.length ? ' aisee-confirmation-dialog--with-notices' : ''} ${className}`.trim()}
    aria-labelledby={titleId}
    aria-describedby={description ? descriptionId : undefined}
    onClose={() => { if (open) onClose(); }}
    onCancel={event => {
      onCancel?.(event);
      if (event.defaultPrevented) return;
      event.preventDefault();
      onClose();
    }}
  >
    <header className="aisee-confirmation-dialog__header">
      <h2 id={titleId} className="aisee-confirmation-dialog__title">{title}</h2>
      <button className="aisee-confirmation-dialog__close" type="button" aria-label={closeLabel} onClick={onClose}>
        <img src={dialogCloseIcon} alt="" />
      </button>
    </header>
    <div className="aisee-confirmation-dialog__body">
      {description && <p id={descriptionId} className="aisee-confirmation-dialog__description">{description}</p>}
      {notices.length > 0 && <ul className="aisee-confirmation-dialog__notices">
        {notices.map(notice => <li key={notice.id} className={`aisee-confirmation-dialog__notice aisee-confirmation-dialog__notice--${notice.tone}`}>
          {notice.icon && <span className="aisee-confirmation-dialog__notice-icon" aria-hidden="true">{notice.icon}</span>}
          <div className="aisee-confirmation-dialog__notice-copy">
            <div className="aisee-confirmation-dialog__notice-title">{notice.title}</div>
            {notice.description && <div className="aisee-confirmation-dialog__notice-description">{notice.description}</div>}
          </div>
        </li>)}
      </ul>}
      {children && <div className="aisee-confirmation-dialog__content">{children}</div>}
    </div>
    <footer className="aisee-confirmation-dialog__actions">
      <Button ref={cancelRef} variant="secondary" onClick={onClose}>{cancelLabel}</Button>
      <Button variant={confirmVariant} disabled={confirmDisabled} onClick={onConfirm}>{confirmLabel}</Button>
    </footer>
  </dialog>;
});
