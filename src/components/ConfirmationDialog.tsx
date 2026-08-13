import { forwardRef, useEffect, useId, useImperativeHandle, useRef, type DialogHTMLAttributes } from 'react';
import dialogCloseIcon from '../../assets/dialog-close.svg';
import { Button } from './Button';

export interface ConfirmationDialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open' | 'title'> {
  open: boolean;
  title: string;
  description: string;
  cancelLabel?: string;
  confirmLabel?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmationDialog = forwardRef<HTMLDialogElement, ConfirmationDialogProps>(function ConfirmationDialog(
  { open, title, description, cancelLabel = 'Keep Editing', confirmLabel = 'Discard Changes', onClose, onConfirm, ...props },
  forwardedRef,
) {
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

  return <dialog
    ref={innerRef}
    className="aisee-confirmation-dialog"
    aria-labelledby={titleId}
    aria-describedby={descriptionId}
    onClose={onClose}
    onCancel={onClose}
    {...props}
  >
    <header className="aisee-confirmation-dialog__header">
      <h2 id={titleId} className="aisee-confirmation-dialog__title">{title}</h2>
      <button className="aisee-confirmation-dialog__close" type="button" aria-label="关闭" onClick={onClose}>
        <img src={dialogCloseIcon} alt="" />
      </button>
    </header>
    <p id={descriptionId} className="aisee-confirmation-dialog__description">{description}</p>
    <footer className="aisee-confirmation-dialog__actions">
      <Button variant="secondary" onClick={onClose}>{cancelLabel}</Button>
      <Button variant="danger" onClick={onConfirm}>{confirmLabel}</Button>
    </footer>
  </dialog>;
});
