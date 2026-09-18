import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import minusIcon from '../../assets/stemui/action-minus.svg';
import plusIcon from '../../assets/stemui/action-plus.svg';

export interface QuantityStepperProps {
  value?: number;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  size?: 'sm' | 'md' | 'lg';
  inputMode?: 'editable' | 'buttons-only';
  unit?: string;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  ariaLabel?: string;
  className?: string;
}

type Direction = 'up' | 'down';
type RollState = { id: number; previous: number; repeating: boolean } | undefined;

const HOLD_DELAY = 400;
const HOLD_INTERVAL = 80;
const HOLD_FAST_INTERVAL = 40;
const HOLD_FAST_AFTER = 10;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function QuantityStepper({
  value,
  defaultValue = 1,
  min = 0,
  max = 99,
  step = 1,
  size = 'md',
  inputMode = 'editable',
  unit,
  disabled = false,
  onValueChange,
  ariaLabel = 'Quantity',
  className = '',
}: QuantityStepperProps) {
  const safeMax = Math.max(min, max);
  const safeStep = Math.max(Number.EPSILON, Math.abs(step));
  const [internalValue, setInternalValue] = useState(() => clamp(defaultValue, min, safeMax));
  const activeValue = clamp(value ?? internalValue, min, safeMax);
  const activeValueRef = useRef(activeValue);
  const previousValueRef = useRef(activeValue);
  const pendingDirectionRef = useRef<Direction | undefined>(undefined);
  const repeatingRef = useRef(false);
  const rollIdRef = useRef(0);
  const [roll, setRoll] = useState<RollState>();
  const [direction, setDirection] = useState<Direction>('up');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(activeValue));
  const [boundary, setBoundary] = useState<'min' | 'max' | undefined>();
  const [announcement, setAnnouncement] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const rollTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const boundaryTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const holdDelay = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const holdInterval = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const repeatCount = useRef(0);
  activeValueRef.current = activeValue;

  useEffect(() => {
    const previous = previousValueRef.current;
    if (previous !== activeValue) {
      const inferredDirection: Direction = activeValue > previous ? 'up' : 'down';
      const nextDirection = pendingDirectionRef.current ?? inferredDirection;
      pendingDirectionRef.current = undefined;
      setDirection(nextDirection);
      const nextRoll = { id: ++rollIdRef.current, previous, repeating: repeatingRef.current };
      setRoll(nextRoll);
      if (rollTimer.current) clearTimeout(rollTimer.current);
      rollTimer.current = setTimeout(() => setRoll(undefined), nextRoll.repeating ? 110 : 280);
      previousValueRef.current = activeValue;
    }
    if (!editing) setDraft(String(activeValue));
  }, [activeValue, editing]);

  useEffect(() => {
    if (editing) requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  }, [editing]);

  const stopHold = useCallback(() => {
    if (holdDelay.current) clearTimeout(holdDelay.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
    holdDelay.current = undefined;
    holdInterval.current = undefined;
    repeatCount.current = 0;
    repeatingRef.current = false;
  }, []);

  useEffect(() => () => {
    stopHold();
    if (rollTimer.current) clearTimeout(rollTimer.current);
    if (boundaryTimer.current) clearTimeout(boundaryTimer.current);
  }, [stopHold]);

  const signalBoundary = useCallback((edge: 'min' | 'max') => {
    if (boundaryTimer.current) clearTimeout(boundaryTimer.current);
    setBoundary(undefined);
    requestAnimationFrame(() => {
      setBoundary(edge);
      setAnnouncement(edge === 'min' ? `Minimum quantity is ${min}` : `Maximum quantity is ${safeMax}`);
      boundaryTimer.current = setTimeout(() => setBoundary(undefined), 410);
    });
  }, [min, safeMax]);

  const commit = useCallback((next: number, nextDirection: Direction) => {
    const previous = activeValueRef.current;
    const clamped = clamp(next, min, safeMax);
    if (next < min || (nextDirection === 'down' && previous <= min)) signalBoundary('min');
    if (next > safeMax || (nextDirection === 'up' && previous >= safeMax)) signalBoundary('max');
    if (clamped === previous) return false;
    pendingDirectionRef.current = nextDirection;
    activeValueRef.current = clamped;
    if (value === undefined) setInternalValue(clamped);
    setDraft(String(clamped));
    setAnnouncement(`Quantity ${clamped}`);
    onValueChange?.(clamped);
    return true;
  }, [min, safeMax, signalBoundary, value, onValueChange]);

  const adjust = useCallback((amount: number) => commit(activeValueRef.current + amount, amount > 0 ? 'up' : 'down'), [commit]);
  const startHold = (event: PointerEvent<HTMLButtonElement>, amount: number) => {
    if (disabled || (event.pointerType === 'mouse' && event.button !== 0)) return;
    event.preventDefault();
    stopHold();
    if (!adjust(amount)) return;
    holdDelay.current = setTimeout(() => {
      repeatingRef.current = true;
      const tick = () => {
        if (!adjust(amount)) {
          stopHold();
          return;
        }
        repeatCount.current += 1;
        if (repeatCount.current === HOLD_FAST_AFTER) {
          if (holdInterval.current) clearInterval(holdInterval.current);
          holdInterval.current = setInterval(tick, HOLD_FAST_INTERVAL);
        }
      };
      holdInterval.current = setInterval(tick, HOLD_INTERVAL);
    }, HOLD_DELAY);
  };

  const handleKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (disabled) return;
    const pageStep = safeStep * 10;
    if (event.key === 'Enter' && inputMode === 'editable' && !editing) { event.preventDefault(); setEditing(true); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); adjust(safeStep); }
    else if (event.key === 'ArrowDown') { event.preventDefault(); adjust(-safeStep); }
    else if (event.key === 'PageUp') { event.preventDefault(); adjust(pageStep); }
    else if (event.key === 'PageDown') { event.preventDefault(); adjust(-pageStep); }
    else if (event.key === 'Home') { event.preventDefault(); commit(min, 'down'); }
    else if (event.key === 'End') { event.preventDefault(); commit(safeMax, 'up'); }
  };

  const valueProps = {
    role: 'spinbutton' as const,
    'aria-label': ariaLabel,
    'aria-valuemin': min,
    'aria-valuemax': safeMax,
    'aria-valuenow': activeValue,
    'aria-valuetext': unit ? `${activeValue} ${unit}` : String(activeValue),
  };
  const atMin = activeValue <= min;
  const atMax = activeValue >= safeMax;
  const editable = inputMode === 'editable' && !disabled;

  return <div
    className={`aisee-quantity-stepper aisee-quantity-stepper--${size} ${className}`.trim()}
    data-disabled={disabled || undefined}
    data-input-mode={inputMode}
    aria-disabled={disabled || undefined}
  >
    <button className="aisee-quantity-stepper__button" type="button" aria-label={`Decrease ${ariaLabel}`} aria-disabled={disabled || atMin} disabled={disabled} onPointerDown={(event) => startHold(event, -safeStep)} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} onLostPointerCapture={stopHold} onClick={(event) => { if (event.detail === 0) adjust(-safeStep); }}><img src={minusIcon} alt="" aria-hidden="true" /></button>
    <div
      className="aisee-quantity-stepper__value-wrap"
      data-boundary={boundary}
      data-editable={editable || undefined}
      onClick={(event) => {
        if (!editable || editing || event.target instanceof HTMLInputElement) return;
        setEditing(true);
      }}
    >
      {editing && inputMode === 'editable' ? <input
        ref={inputRef}
        className="aisee-quantity-stepper__input"
        type="number"
        inputMode="numeric"
        min={min}
        max={safeMax}
        step={safeStep}
        value={draft}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(event) => setDraft(event.currentTarget.value)}
        onBlur={() => {
          const parsed = Number(draft);
          if (Number.isFinite(parsed)) commit(parsed, parsed >= activeValue ? 'up' : 'down');
          else setDraft(String(activeValue));
          setEditing(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') event.currentTarget.blur();
          if (event.key === 'Escape') { setDraft(String(activeValue)); event.currentTarget.blur(); }
        }}
      /> : <span {...valueProps} className="aisee-quantity-stepper__output" tabIndex={disabled ? -1 : 0} onKeyDown={handleKeyboard}>
        <span className="aisee-quantity-stepper__digit-stage" data-direction={direction} data-repeating={roll?.repeating || undefined}>
          {roll && <span className="aisee-quantity-stepper__digit aisee-quantity-stepper__digit--out" key={`out-${roll.id}`}>{roll.previous}</span>}
          <span className={`aisee-quantity-stepper__digit${roll ? ' aisee-quantity-stepper__digit--in' : ''}`} key={`in-${activeValue}-${roll?.id ?? 0}`}>{activeValue}</span>
        </span>
      </span>}
      {unit && <span className="aisee-quantity-stepper__unit">{unit}</span>}
    </div>
    <button className="aisee-quantity-stepper__button" type="button" aria-label={`Increase ${ariaLabel}`} aria-disabled={disabled || atMax} disabled={disabled} onPointerDown={(event) => startHold(event, safeStep)} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} onLostPointerCapture={stopHold} onClick={(event) => { if (event.detail === 0) adjust(safeStep); }}><img src={plusIcon} alt="" aria-hidden="true" /></button>
    <span className="aisee-visually-hidden" aria-live="polite">{announcement}</span>
  </div>;
}
