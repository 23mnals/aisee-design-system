import {
  forwardRef,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  type DialogHTMLAttributes,
  type ReactNode,
} from 'react';
import actionCheckIcon from '../../assets/stemui/action-check.svg';
import actionCloseIcon from '../../assets/stemui/action-close.svg';
import connectionIcon from '../../assets/stemui/nav-connection.svg';
import growthIcon from '../../assets/stemui/nav-growth.svg';
import improveScoreIcon from '../../assets/stemui/nav-improve-score.svg';

export type EventDialogKind =
  | 'success'
  | 'error'
  | 'subscribe'
  | 'upgrade'
  | 'insufficient-balance'
  | 'locked';

export interface EventDialogProps
  extends Omit<
    DialogHTMLAttributes<HTMLDialogElement>,
    'open' | 'title' | 'onClose' | 'onCancel'
  > {
  open: boolean;
  kind: EventDialogKind;
  title: string;
  description?: ReactNode;
  onClose: () => void;
  showClose?: boolean;
  icon?: ReactNode;
  footer?: ReactNode;
}

const eventIcons: Record<EventDialogKind, string> = {
  success: actionCheckIcon,
  error: actionCloseIcon,
  subscribe: growthIcon,
  upgrade: improveScoreIcon,
  'insufficient-balance': actionCloseIcon,
  locked: connectionIcon,
};

export const EventDialog = forwardRef<HTMLDialogElement, EventDialogProps>(function EventDialog(
  {
    open,
    kind,
    title,
    description,
    onClose,
    showClose = false,
    icon,
    footer,
    children,
    className,
    ...props
  },
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

  return (
    <dialog
      ref={innerRef}
      className={['aisee-dialog', 'aisee-event-dialog', `aisee-event-dialog--${kind}`, className]
        .filter(Boolean)
        .join(' ')}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onClose={onClose}
      onCancel={onClose}
      {...props}
    >
      <div className="aisee-event-dialog__header">
        <div className="aisee-event-dialog__icon" aria-hidden="true">
          {icon ?? <img src={eventIcons[kind]} alt="" />}
        </div>
        <div className="aisee-event-dialog__copy">
          <h2 id={titleId} className="aisee-event-dialog__title">
            {title}
          </h2>
          {description && (
            <div id={descriptionId} className="aisee-event-dialog__description">
              {description}
            </div>
          )}
        </div>
        {showClose && (
          <button className="aisee-dialog__close" type="button" aria-label="关闭" onClick={onClose}>
            <img src={actionCloseIcon} alt="" />
          </button>
        )}
      </div>
      {children && <div className="aisee-event-dialog__content">{children}</div>}
      {footer && <div className="aisee-event-dialog__footer">{footer}</div>}
    </dialog>
  );
});

