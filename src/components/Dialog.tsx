import { forwardRef, useEffect, useImperativeHandle, useRef, type DialogHTMLAttributes, type ReactNode } from 'react';

export interface DialogProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'open'> {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  footer?: ReactNode;
}
export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(function Dialog({ open, title, description, onClose, footer, children, ...props }, forwardedRef) {
  const innerRef = useRef<HTMLDialogElement>(null);
  useImperativeHandle(forwardedRef, () => innerRef.current as HTMLDialogElement);
  useEffect(() => {
    const dialog = innerRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  return <dialog ref={innerRef} className="aisee-dialog" onClose={onClose} onCancel={onClose} {...props}>
    <div className="aisee-dialog__header"><div><h2 className="aisee-dialog__title">{title}</h2>{description && <p className="aisee-dialog__description">{description}</p>}</div><button className="aisee-dialog__close" type="button" aria-label="关闭" onClick={onClose}>×</button></div>
    <div className="aisee-dialog__content">{children}</div>
    {footer && <div className="aisee-dialog__footer">{footer}</div>}
  </dialog>;
});
