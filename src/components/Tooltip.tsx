import { cloneElement, isValidElement, useId, useEffect, useLayoutEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useTooltipSpring } from '../hooks/useTooltipSpring';
import { positionTooltip, type TooltipPlacement } from '../utils/tooltip-position';

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  /** Auto by default. An explicit side is a preference and still flips at viewport edges. */
  placement?: TooltipPlacement;
  /** Subtle for functional labels; playful is opt-in for avatar / member details. */
  animation?: 'subtle' | 'playful' | 'none';
  triggerTabIndex?: number;
  className?: string;
}

export function Tooltip({ content, children, placement = 'auto', animation = 'subtle', triggerTabIndex, className = '' }: TooltipProps) {
  const tooltipId = useId();
  const trigger = useRef<HTMLSpanElement>(null);
  const bubble = useRef<HTMLSpanElement>(null);
  const hovered = useRef(false), focused = useRef(false);
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const pointer = useRef(0);
  const wakeSpring = useTooltipSpring(bubble, pointer, present && animation === 'playful' && !keyboard);
  useEffect(() => {
    if (open || !present) return;
    const reduced = trigger.current?.ownerDocument.defaultView?.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => setPresent(false), animation === 'none' || reduced ? 0 : 120);
    return () => clearTimeout(timer);
  }, [open, present, animation]);
  const [position, setPosition] = useState<ReturnType<typeof positionTooltip> | null>(null);
  const [anchorVisible, setAnchorVisible] = useState(true);

  useLayoutEffect(() => {
    if (!present || !trigger.current || !bubble.current) return;
    const anchor = trigger.current, tip = bubble.current;
    const doc = anchor.ownerDocument, win = doc.defaultView!;
    // Top-layer rendering escapes clipped / transformed containers, including native dialogs.
    if (typeof tip.showPopover === 'function') tip.showPopover();
    const update = () => {
      const rect = anchor.getBoundingClientRect();
      let left = 0, top = 0, right = doc.documentElement.clientWidth, bottom = win.innerHeight;
      for (let parent = anchor.parentElement; parent; parent = parent.parentElement) {
        const style = win.getComputedStyle(parent), bounds = parent.getBoundingClientRect();
        if (/auto|scroll|hidden|clip/.test(style.overflowX)) { left = Math.max(left, bounds.left); right = Math.min(right, bounds.right); }
        if (/auto|scroll|hidden|clip/.test(style.overflowY)) { top = Math.max(top, bounds.top); bottom = Math.min(bottom, bounds.bottom); }
      }
      setAnchorVisible(rect.right > left && rect.left < right && rect.bottom > top && rect.top < bottom);
      setPosition(positionTooltip(rect, {width:tip.offsetWidth, height:tip.offsetHeight}, {width:doc.documentElement.clientWidth, height:win.innerHeight}, placement));
    };
    update();
    let frame = 0;
    const schedule = () => { win.cancelAnimationFrame(frame); frame = win.requestAnimationFrame(update); };
    const dismiss = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    win.addEventListener('resize', schedule);
    doc.addEventListener('scroll', schedule, true);
    doc.addEventListener('keydown', dismiss);
    const observer = new ResizeObserver(schedule);
    observer.observe(anchor); observer.observe(tip);
    return () => {
      win.cancelAnimationFrame(frame);
      win.removeEventListener('resize', schedule);
      doc.removeEventListener('scroll', schedule, true);
      doc.removeEventListener('keydown', dismiss);
      observer.disconnect();
      if (typeof tip.hidePopover === 'function' && tip.matches(':popover-open')) tip.hidePopover();
    };
  }, [present, placement, content]);

  const reveal = (fromKeyboard: boolean) => {
    setKeyboard(fromKeyboard);
    if (!present) setPosition(null);
    setPresent(true); setOpen(true);
  };
  const trackPointer = (clientX: number, anchor: HTMLSpanElement) => {
    const rect = anchor.getBoundingClientRect();
    pointer.current = Math.max(-1, Math.min(1, ((clientX - rect.left) / Math.max(1, rect.width) - .5) * 2));
    wakeSpring.current();
  };
  const target = trigger.current?.closest('dialog') ?? trigger.current?.ownerDocument.body;
  return <span ref={trigger} className={`aisee-tooltip-trigger ${className}`.trim()} tabIndex={triggerTabIndex} aria-describedby={open ? tooltipId : undefined}
    onMouseEnter={event => { hovered.current = true; trackPointer(event.clientX, event.currentTarget); reveal(false); }}
    onMouseMove={event => {
      if (animation === 'playful' && !keyboard) trackPointer(event.clientX, event.currentTarget);
    }}
    onMouseLeave={() => { hovered.current = false; if (!focused.current) setOpen(false); }}
    onFocus={event => { focused.current = true; reveal(event.target.matches(':focus-visible')); }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) { focused.current = false; if (!hovered.current) setOpen(false); } }}>
    {isValidElement(children) ? cloneElement(children as ReactElement<{ 'aria-describedby'?: string }>, {
      'aria-describedby': [(children.props as { 'aria-describedby'?: string })['aria-describedby'], open ? tooltipId : undefined].filter(Boolean).join(' ') || undefined,
    }) : children}
    {present && target && createPortal(<span ref={bubble} id={tooltipId} className="aisee-tooltip aisee-tooltip--floating" role="tooltip" popover="manual"
      data-placement={position?.side} data-animation={animation} data-input={keyboard ? 'keyboard' : 'pointer'} data-state={open ? 'open' : 'closed'} data-ready={Boolean(position)} aria-hidden={!open || !anchorVisible}
      style={{left:position?.x ?? 0, top:position?.y ?? 0, visibility:position && anchorVisible ? 'visible' : 'hidden'}}><span className="aisee-tooltip-motion"><span className="aisee-tooltip-surface">{content}</span></span></span>, target)}
  </span>;
}
