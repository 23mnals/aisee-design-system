import { useLayoutEffect, useRef, type RefObject } from 'react';

import { stepSpring } from '../utils/spring';

export function useTooltipSpring(bubble: RefObject<HTMLSpanElement | null>, pointer: RefObject<number>, enabled: boolean) {
  const wake = useRef<() => void>(() => {});
  useLayoutEffect(() => {
    const tip = bubble.current;
    if (!tip || !enabled) return;
    const win = tip.ownerDocument.defaultView!;
    const reduced = win.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0, last = 0;
    let angle = {value:pointer.current * 12, velocity:pointer.current * 160};
    let x = {value:pointer.current * 12, velocity:pointer.current * 120};
    let entry = {value:0, velocity:0};
    const reset = () => {
      win.cancelAnimationFrame(frame); frame = 0;
      tip.style.removeProperty('--tooltip-spring-transform');
    };
    const tick = (now: number) => {
      frame = 0;
      const dt = last ? Math.min((now - last) / 1000, .032) : 1 / 60;
      last = now;
      angle = stepSpring(angle.value, angle.velocity, pointer.current * 18, 100, 5, dt);
      x = stepSpring(x.value, x.velocity, pointer.current * 22, 100, 5, dt);
      entry = stepSpring(entry.value, entry.velocity, 1, 260, 10, dt);
      const scale = .6 + .4 * entry.value;
      const offset = 20 * (1 - entry.value);
      const side = tip.dataset.placement;
      let tx = x.value + (side === 'left' ? offset : side === 'right' ? -offset : 0);
      let ty = side === 'top' ? offset : side === 'bottom' ? -offset : 0;
      // Account for the rotated surface as well as its untransformed anchor box.
      const box = tip.getBoundingClientRect(), radians = angle.value * Math.PI / 180;
      const halfWidth = (Math.abs(box.width * Math.cos(radians)) + Math.abs(box.height * Math.sin(radians))) * scale / 2;
      const halfHeight = (Math.abs(box.height * Math.cos(radians)) + Math.abs(box.width * Math.sin(radians))) * scale / 2;
      const cx = box.left + box.width / 2, cy = box.top + box.height / 2;
      tx = Math.max(8 + halfWidth - cx, Math.min(tip.ownerDocument.documentElement.clientWidth - 8 - halfWidth - cx, tx));
      ty = Math.max(8 + halfHeight - cy, Math.min(win.innerHeight - 8 - halfHeight - cy, ty));
      tip.style.setProperty('--tooltip-spring-transform', `translate(${tx}px, ${ty}px) rotate(${angle.value}deg) scale(${scale})`);
      const moving = Math.abs(angle.value - pointer.current * 18) > .01 || Math.abs(angle.velocity) > .02 || Math.abs(x.velocity) > .02 || Math.abs(x.value - pointer.current * 22) > .01 || Math.abs(entry.value - 1) > .001 || Math.abs(entry.velocity) > .01;
      if (moving) frame = win.requestAnimationFrame(tick);
    };
    const start = () => {
      if (reduced.matches || frame) return;
      last = 0; frame = win.requestAnimationFrame(tick);
    };
    const onPreference = () => reduced.matches ? reset() : start();
    wake.current = start;
    reduced.addEventListener('change', onPreference);
    win.addEventListener('resize', start);
    tip.ownerDocument.addEventListener('scroll', start, true);
    start();
    return () => {
      reset(); wake.current = () => {};
      reduced.removeEventListener('change', onPreference);
      win.removeEventListener('resize', start);
      tip.ownerDocument.removeEventListener('scroll', start, true);
    };
  }, [enabled, bubble, pointer]);
  return wake;
}
