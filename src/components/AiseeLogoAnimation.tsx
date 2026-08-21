import { useEffect, useId, useRef } from 'react';
import type { CSSProperties, SVGAttributes } from 'react';

const SHELL_PATH = 'M0 200C0 89.5431 89.5431 0 200 0C310.457 0 400 89.5431 400 200V400H0V200Z';
const EYE_PATH = 'M85.603 134.409C161.565 67.1981 237.528 67.1981 313.49 134.409C237.528 201.62 161.565 201.62 85.603 134.409Z';
const OPEN_EYELIDS = 'M0 0H400V134.409C237.528 67.1981 161.565 67.1981 85.603 134.409Z M0 400H400V134.409C237.528 201.62 161.565 201.62 85.603 134.409Z';

export interface AiseeLogoAnimationProps extends Omit<SVGAttributes<SVGSVGElement>, 'viewBox' | 'width' | 'height'> {
  /** Rendered size in CSS pixels (the internal coordinate system remains 400 × 400). */
  size?: number | string;
  /** Disable pointer-follow and autonomous motion while keeping the static Logo visible. */
  disabled?: boolean;
}

/**
 * The production React version of the animated aisee Logo.
 *
 * Pointer movement is listened for at page level, so the pointer does not need
 * to enter the Logo itself. The pupil is constrained against the real eye path
 * and then protected again by the matching SVG clipPath.
 */
export function AiseeLogoAnimation({
  size = 400,
  disabled = false,
  className = '',
  style,
  ...props
}: AiseeLogoAnimationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const eyeWhiteRef = useRef<SVGPathElement>(null);
  const pupilRef = useRef<SVGGElement>(null);
  const eyelidsRef = useRef<SVGPathElement>(null);
  const rawId = useId();
  const clipId = `aisee-eye-clip-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;

  useEffect(() => {
    if (disabled) return undefined;

    const svg = svgRef.current;
    const eyeWhite = eyeWhiteRef.current;
    const pupil = pupilRef.current;
    const eyelids = eyelidsRef.current;
    if (!svg || !eyeWhite || !pupil || !eyelids) return undefined;

    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (reducedMotion) return undefined;

    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
    const smooth = (value: number) => value * value * (3 - 2 * value);
    const pointer = { active: false, lastMove: 0, targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    const eyeBox = eyeWhite.getBBox();
    const pupilRadius = 34;
    const centerX = eyeBox.x + eyeBox.width / 2;
    const centerY = eyeBox.y + eyeBox.height / 2;
    const safety = Math.min(eyeBox.width, eyeBox.height) * 0.04;
    const boundary: Array<[number, number]> = [];
    const pathLength = eyeWhite.getTotalLength();

    for (let index = 0; index < 720; index += 1) {
      const point = eyeWhite.getPointAtLength((pathLength * index) / 720);
      boundary.push([point.x, point.y]);
    }

    const insideEye = (x: number, y: number) => {
      let inside = false;
      for (let i = 0, j = boundary.length - 1; i < boundary.length; j = i += 1) {
        const [xi, yi] = boundary[i];
        const [xj, yj] = boundary[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
      }
      return inside;
    };

    const circleFits = (offsetX: number, offsetY: number) => {
      const radius = pupilRadius + safety;
      for (let index = 0; index < 360; index += 1) {
        const angle = (Math.PI * 2 * index) / 360;
        if (!insideEye(centerX + offsetX + radius * Math.cos(angle), centerY + offsetY + radius * Math.sin(angle))) return false;
      }
      return true;
    };

    const findSafeMove = (axis: 'x' | 'y') => {
      let low = 0;
      let high = axis === 'x' ? eyeBox.width / 2 : eyeBox.height / 2;
      for (let index = 0; index < 18; index += 1) {
        const middle = (low + high) / 2;
        if (circleFits(axis === 'x' ? middle : 0, axis === 'y' ? middle : 0)) low = middle;
        else high = middle;
      }
      return low;
    };

    const availableWidth = Math.max(0, eyeBox.width - 2 * (pupilRadius + safety));
    const availableHeight = Math.max(0, eyeBox.height - 2 * (pupilRadius + safety));
    const maxMoveX = Math.min(availableWidth * 0.42, findSafeMove('x') * 0.99);
    const maxMoveY = Math.min(availableHeight * 0.20, findSafeMove('y') * 0.9);
    const constrainTarget = (x: number, y: number) => {
      const radius = Math.hypot(maxMoveX ? x / maxMoveX : 0, maxMoveY ? y / maxMoveY : 0);
      return radius <= 1 ? { x, y } : { x: x / radius, y: y / radius };
    };

    const setPointerDirection = (normalizedX: number, normalizedY: number) => {
      const x = clamp(normalizedX, -1, 1);
      const y = clamp(normalizedY, -1, 1);
      const directionX = Math.sign(x) * Math.pow(Math.abs(x), 0.7);
      const directionY = Math.sign(y) * Math.pow(Math.abs(y), 0.8);
      const target = constrainTarget(directionX * maxMoveX, directionY * maxMoveY);
      pointer.active = true;
      pointer.lastMove = performance.now();
      pointer.targetX = target.x;
      pointer.targetY = target.y;
    };

    const updatePointer = (event: PointerEvent | MouseEvent) => {
      setPointerDirection((event.clientX / window.innerWidth) * 2 - 1, (event.clientY / window.innerHeight) * 2 - 1);
    };
    const resetPointer = () => {
      pointer.active = false;
      pointer.lastMove = 0;
      pointer.targetX = 0;
      pointer.targetY = 0;
    };

    const lookKeys: Array<[number, number]> = [[0, 0], [.12, -24], [.28, -40], [.45, 0], [.62, 30], [.78, 40], [.92, 8], [1, 0]];
    const idleLook = (phase: number) => {
      for (let index = 1; index < lookKeys.length; index += 1) {
        if (phase <= lookKeys[index][0]) {
          const [start, startX] = lookKeys[index - 1];
          const [end, endX] = lookKeys[index];
          return startX + (endX - startX) * smooth((phase - start) / (end - start));
        }
      }
      return 0;
    };

    const setEyelids = (progress: number) => {
      const seam = 0.8 * progress;
      const upperCurveY = 67.1981 + (134.409 - 67.1981) * progress + seam;
      const lowerCurveY = 201.62 + (134.409 - 201.62) * progress - seam;
      eyelids.setAttribute('d', `M0 0H400V134.409C237.528 ${upperCurveY} 161.565 ${upperCurveY} 85.603 134.409Z M0 400H400V134.409C237.528 ${lowerCurveY} 161.565 ${lowerCurveY} 85.603 134.409Z`);
    };

    let frameId = 0;
    let lastFrame = performance.now();
    let blinkStart = -1;
    let nextBlink = lastFrame + 2000 + Math.random() * 800;

    const renderBlink = (now: number) => {
      if (blinkStart < 0 && now >= nextBlink) {
        blinkStart = now;
        pointer.currentX = 0;
        pointer.currentY = 0;
        pupil.setAttribute('transform', 'translate(0 0)');
      }
      if (blinkStart < 0) return;

      const elapsed = now - blinkStart;
      const closeMs = 45;
      const holdMs = 15;
      const openMs = 80;
      let progress: number;
      if (elapsed <= closeMs) progress = smooth(elapsed / closeMs);
      else if (elapsed <= closeMs + holdMs) progress = 1;
      else if (elapsed <= closeMs + holdMs + openMs) progress = 1 - smooth((elapsed - closeMs - holdMs) / openMs);
      else {
        progress = 0;
        blinkStart = -1;
        nextBlink = now + 3000 + Math.random() * 1500;
      }
      setEyelids(progress);
    };

    const frame = (now: number) => {
      if (document.hidden) return;
      const delta = Math.min(64, now - lastFrame);
      lastFrame = now;
      const idle = !pointer.active || now - pointer.lastMove > 2000;
      if (blinkStart < 0) {
        const targetX = idle ? idleLook((now % 3500) / 3500) : pointer.targetX;
        const targetY = idle ? Math.sin(now / 2300) * 1.5 : pointer.targetY;
        const alpha = 1 - Math.exp(-delta / (idle ? 220 : 82));
        pointer.currentX += (targetX - pointer.currentX) * alpha;
        pointer.currentY += (targetY - pointer.currentY) * alpha;
        pupil.setAttribute('transform', `translate(${pointer.currentX.toFixed(3)} ${pointer.currentY.toFixed(3)})`);
      }
      renderBlink(now);
      frameId = window.requestAnimationFrame(frame);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        window.cancelAnimationFrame(frameId);
        resetPointer();
        pointer.currentX = 0;
        pointer.currentY = 0;
        blinkStart = -1;
        pupil.setAttribute('transform', 'translate(0 0)');
        setEyelids(0);
      } else {
        lastFrame = performance.now();
        frameId = window.requestAnimationFrame(frame);
      }
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    window.addEventListener('mousemove', updatePointer, { passive: true });
    window.addEventListener('blur', resetPointer);
    window.addEventListener('mouseleave', resetPointer);
    document.addEventListener('visibilitychange', handleVisibility);
    frameId = window.requestAnimationFrame(frame);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('pointermove', updatePointer);
      window.removeEventListener('mousemove', updatePointer);
      window.removeEventListener('blur', resetPointer);
      window.removeEventListener('mouseleave', resetPointer);
      document.removeEventListener('visibilitychange', handleVisibility);
      pupil.setAttribute('transform', 'translate(0 0)');
      setEyelids(0);
    };
  }, [disabled]);

  const mergedStyle: CSSProperties = { width: size, height: size, ...style };
  return <svg
    ref={svgRef}
    width={size}
    height={size}
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="aisee animated logo"
    className={className || undefined}
    style={mergedStyle}
    {...props}
  >
    <path d={SHELL_PATH} fill="#C9FE12" />
    <defs>
      <clipPath id={clipId}>
        <path d={EYE_PATH} />
      </clipPath>
    </defs>
    <path ref={eyeWhiteRef} d={EYE_PATH} fill="white" />
    <g ref={pupilRef} clipPath={`url(#${clipId})`}>
      <circle cx="199.5465" cy="134.409" r="34" fill="#111111" />
    </g>
    <path ref={eyelidsRef} clipPath={`url(#${clipId})`} d={OPEN_EYELIDS} fill="#C9FE12" />
  </svg>;
}

