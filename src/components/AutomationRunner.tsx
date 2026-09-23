import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from 'react';
import dragHandleIcon from '../../assets/automation-runner/drag-handle.svg';
import eyeMask from '../../assets/automation-runner/eye-mask.svg';
import chevronIcon from '../../assets/automation-runner/chevron-down.svg';
import minimizeIcon from '../../assets/automation-runner/minimize.svg';
import closeIcon from '../../assets/automation-runner/close.svg';

export type AutomationRunnerView = 'default' | 'expanded' | 'minimized';
export type AutomationRunnerPlacement = 'bottom-left' | 'bottom-center' | 'bottom-right';

export interface AutomationRunnerDetail {
  id: string;
  label: ReactNode;
  value: ReactNode;
  muted?: boolean;
}

export interface AutomationRunnerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'onDrag'> {
  open?: boolean;
  defaultOpen?: boolean;
  view?: AutomationRunnerView;
  defaultView?: AutomationRunnerView;
  placement?: AutomationRunnerPlacement;
  title?: ReactNode;
  description?: ReactNode;
  details?: readonly AutomationRunnerDetail[];
  actionLabel?: ReactNode;
  onAction?: () => void;
  onOpenChange?: (open: boolean) => void;
  onViewChange?: (view: AutomationRunnerView) => void;
  closeLabel?: string;
  minimizeLabel?: string;
  expandLabel?: string;
  collapseLabel?: string;
  restoreLabel?: string;
  draggable?: boolean;
}

type Position = { x: number; y: number };
type DragSession = { pointerId: number; origin: Position; start: Position; moved: boolean };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}

export const AutomationRunner = forwardRef<HTMLDivElement, AutomationRunnerProps>(function AutomationRunner(
  {
    open,
    defaultOpen = true,
    view,
    defaultView = 'default',
    placement = 'bottom-right',
    title = 'Automation running',
    description = 'Keep one AISEE tab open',
    details = [],
    actionLabel = 'Back to Automation',
    onAction,
    onOpenChange,
    onViewChange,
    closeLabel = 'Close runner window',
    minimizeLabel = 'Minimize runner',
    expandLabel = 'Show automation details',
    collapseLabel = 'Hide automation details',
    restoreLabel = 'Restore runner',
    draggable = true,
    className = '',
    style,
    ...props
  },
  forwardedRef,
) {
  const controlledOpen = open !== undefined;
  const controlledView = view !== undefined;
  const [localOpen, setLocalOpen] = useState(defaultOpen);
  const [localView, setLocalView] = useState<AutomationRunnerView>(defaultView);
  const [rendered, setRendered] = useState(controlledOpen ? Boolean(open) : defaultOpen);
  const [phase, setPhase] = useState<'enter' | 'idle' | 'exit'>('enter');
  const [position, setPosition] = useState<Position | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragSession | null>(null);
  const suppressClickRef = useRef(false);
  const detailsId = useId();
  const currentOpen = controlledOpen ? Boolean(open) : localOpen;
  const currentView = controlledView ? view : localView;

  const setRootRef = (node: HTMLDivElement | null) => {
    rootRef.current = node;
    if (typeof forwardedRef === 'function') forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };

  const updateOpen = (next: boolean) => {
    if (!controlledOpen) setLocalOpen(next);
    onOpenChange?.(next);
  };
  const updateView = (next: AutomationRunnerView) => {
    if (!controlledView) setLocalView(next);
    onViewChange?.(next);
  };

  useEffect(() => {
    if (currentOpen) {
      setRendered(true);
      setPhase('enter');
      const timer = window.setTimeout(() => setPhase('idle'), 620);
      return () => window.clearTimeout(timer);
    }
    if (!rendered) return;
    setPhase('exit');
    const timer = window.setTimeout(() => setRendered(false), 360);
    return () => window.clearTimeout(timer);
  }, [currentOpen, rendered]);

  useEffect(() => {
    if (!rendered) return;
    const followPointer = (event: globalThis.PointerEvent) => {
      const eye = rootRef.current?.querySelector<HTMLElement>('.aisee-automation-runner__eye-window');
      if (!eye) return;
      const box = eye.getBoundingClientRect();
      const dx = clamp((event.clientX - (box.left + box.width / 2)) / 80, -1, 1);
      const dy = clamp((event.clientY - (box.top + box.height / 2)) / 80, -1, 1);
      rootRef.current?.style.setProperty('--aisee-runner-eye-x', `${dx * 2.3}px`);
      rootRef.current?.style.setProperty('--aisee-runner-eye-y', `${dy * 1.15}px`);
      rootRef.current?.style.setProperty('--aisee-runner-eye-x-wide', `${dx * 2.99}px`);
      rootRef.current?.style.setProperty('--aisee-runner-eye-y-wide', `${dy * 1.932}px`);
      rootRef.current?.style.setProperty('--aisee-runner-eye-number', dx.toFixed(3));
      rootRef.current?.style.setProperty('--aisee-runner-lean', `${dx * 6}deg`);
      rootRef.current?.style.setProperty('--aisee-runner-lean-card', `${dx * 1.32}deg`);
      rootRef.current?.style.setProperty('--aisee-runner-lean-soft', `${dx * 2.1}deg`);
      rootRef.current?.style.setProperty('--aisee-runner-lean-over', `${dx * 7.2}deg`);
      rootRef.current?.style.setProperty('--aisee-runner-lean-settle', `${dx * 4.92}deg`);
    };
    window.addEventListener('pointermove', followPointer, { passive: true });
    return () => window.removeEventListener('pointermove', followPointer);
  }, [rendered]);

  useEffect(() => {
    if (!position || !rootRef.current) return;
    const box = rootRef.current.getBoundingClientRect();
    const next = {
      x: clamp(position.x, 8, window.innerWidth - box.width - 8),
      y: clamp(position.y, 8, window.innerHeight - box.height - 8),
    };
    if (next.x !== position.x || next.y !== position.y) setPosition(next);
  }, [currentView, position]);

  const beginDrag = (event: PointerEvent<HTMLElement>) => {
    if (!draggable || !rootRef.current || event.button !== 0) return;
    const box = rootRef.current.getBoundingClientRect();
    dragRef.current = { pointerId: event.pointerId, origin: { x: box.left, y: box.top }, start: { x: event.clientX, y: event.clientY }, moved: false };
  };
  const drag = (event: PointerEvent<HTMLElement>) => {
    const session = dragRef.current;
    if (!session || session.pointerId !== event.pointerId || !rootRef.current) return;
    const deltaX = event.clientX - session.start.x;
    const deltaY = event.clientY - session.start.y;
    if (!session.moved && Math.hypot(deltaX, deltaY) < 4) return;
    if (!session.moved) {
      session.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    rootRef.current.dataset.dragging = 'true';
    event.preventDefault();
    const box = rootRef.current.getBoundingClientRect();
    setPosition({
      x: clamp(session.origin.x + deltaX, 8, window.innerWidth - box.width - 8),
      y: clamp(session.origin.y + deltaY, 8, window.innerHeight - box.height - 8),
    });
  };
  const endDrag = (event: PointerEvent<HTMLElement>) => {
    const session = dragRef.current;
    if (session?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    rootRef.current?.removeAttribute('data-dragging');
    if (session.moved) {
      suppressClickRef.current = true;
      window.setTimeout(() => { suppressClickRef.current = false; }, 0);
    }
  };
  const preventDragClick = (event: MouseEvent<HTMLElement>) => {
    if (!suppressClickRef.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClickRef.current = false;
  };
  const restoreFromMinimized = () => {
    if (minimized) updateView('default');
  };
  const nudge = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (!draggable || !['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key) || !rootRef.current) return;
    event.preventDefault();
    const box = rootRef.current.getBoundingClientRect();
    const delta = event.shiftKey ? 24 : 8;
    const x = box.left + (event.key === 'ArrowLeft' ? -delta : event.key === 'ArrowRight' ? delta : 0);
    const y = box.top + (event.key === 'ArrowUp' ? -delta : event.key === 'ArrowDown' ? delta : 0);
    setPosition({ x: clamp(x, 8, window.innerWidth - box.width - 8), y: clamp(y, 8, window.innerHeight - box.height - 8) });
  };

  if (!rendered) return null;
  const expanded = currentView === 'expanded';
  const minimized = currentView === 'minimized';
  const positionStyle = position ? { left: position.x, top: position.y, right: 'auto', bottom: 'auto' } : undefined;
  const rootStyle = {
    ...style,
    ...positionStyle,
    '--aisee-runner-eye-mask': `url("${eyeMask}")`,
  } as CSSProperties;

  return <div
    {...props}
    ref={setRootRef}
    className={`aisee-automation-runner${className ? ` ${className}` : ''}`}
    data-view={currentView}
    data-placement={placement}
    data-phase={phase}
    data-dragged={position ? true : undefined}
    style={rootStyle}
  >
    <section
      className="aisee-automation-runner__panel"
      aria-label="Automation runner"
      onPointerDown={beginDrag}
      onPointerMove={drag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={preventDragClick}
      onClick={restoreFromMinimized}
    >
      <header className="aisee-automation-runner__header">
        <button
          className="aisee-automation-runner__drag"
          type="button"
          aria-label={draggable ? 'Drag runner; use arrow keys to move' : 'Runner position'}
          disabled={!draggable}
          onKeyDown={nudge}
        ><img src={dragHandleIcon} alt="" /></button>
        <button
          className="aisee-automation-runner__mascot"
          type="button"
          aria-label={minimized ? restoreLabel : undefined}
          aria-hidden={!minimized}
          tabIndex={minimized ? 0 : -1}
          onClick={event => { event.stopPropagation(); restoreFromMinimized(); }}
          onPointerEnter={event => {
            event.currentTarget.classList.remove('is-jelly');
            void event.currentTarget.offsetWidth;
            event.currentTarget.classList.add('is-jelly');
          }}
          onAnimationEnd={event => {
            if (event.animationName === 'aisee-runner-mascot-jelly') event.currentTarget.classList.remove('is-jelly');
          }}
        >
          <span className="aisee-automation-runner__eye-window"><span className="aisee-automation-runner__iris" /></span>
        </button>
        <button
          className="aisee-automation-runner__summary"
          type="button"
          aria-expanded={expanded}
          aria-controls={detailsId}
          onClick={() => updateView(expanded ? 'default' : 'expanded')}
        >
          <span className="aisee-automation-runner__title">{title}</span>
          <span className="aisee-automation-runner__description">{description}</span>
        </button>
        <button className="aisee-automation-runner__expand" type="button" aria-label={expanded ? collapseLabel : expandLabel} onClick={() => updateView(expanded ? 'default' : 'expanded')}>
          <img src={chevronIcon} alt="" />
        </button>
        <button className="aisee-automation-runner__minimize" type="button" aria-label={minimizeLabel} onClick={() => updateView('minimized')}>
          <img src={minimizeIcon} alt="" />
        </button>
        <button className="aisee-automation-runner__close" type="button" aria-label={closeLabel} onClick={() => updateOpen(false)}>
          <img src={closeIcon} alt="" />
        </button>
      </header>
      <div id={detailsId} className="aisee-automation-runner__details" aria-hidden={!expanded}>
        <div className="aisee-automation-runner__details-inner">
          <dl>
            {details.map(item => <div key={item.id} className="aisee-automation-runner__detail">
              <dt>{item.label}</dt><dd data-muted={item.muted || undefined}>{item.value}</dd>
            </div>)}
          </dl>
          {onAction && <button className="aisee-automation-runner__action" type="button" onClick={onAction}>{actionLabel}</button>}
        </div>
      </div>
    </section>
  </div>;
});
