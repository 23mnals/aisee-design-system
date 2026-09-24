export type TooltipSide = 'top' | 'right' | 'bottom' | 'left';
export type TooltipPlacement = TooltipSide | 'auto';
type Rect = { left: number; top: number; right: number; bottom: number; width: number; height: number };

/** Prefer the requested side, flip when needed, then keep the bubble within the viewport. */
export function positionTooltip(anchor: Rect, bubble: { width: number; height: number }, viewport: { width: number; height: number }, placement: TooltipPlacement = 'auto') {
  const gap = 8, padding = 8;
  const opposite: Record<TooltipSide, TooltipSide> = {top:'bottom', bottom:'top', left:'right', right:'left'};
  const sides: TooltipSide[] = ['top', 'bottom', 'right', 'left'];
  const order = placement === 'auto' ? sides : [placement, opposite[placement], ...sides.filter(side => side !== placement && side !== opposite[placement])];
  const candidates = order.map(side => {
    const x = side === 'left' ? anchor.left - gap - bubble.width : side === 'right' ? anchor.right + gap : anchor.left + (anchor.width - bubble.width) / 2;
    const y = side === 'top' ? anchor.top - gap - bubble.height : side === 'bottom' ? anchor.bottom + gap : anchor.top + (anchor.height - bubble.height) / 2;
    // Cross-axis overflow can be shifted without changing the chosen side.
    const overflow = side === 'top' || side === 'bottom'
      ? Math.max(0, padding - y) + Math.max(0, y + bubble.height + padding - viewport.height)
      : Math.max(0, padding - x) + Math.max(0, x + bubble.width + padding - viewport.width);
    return {side, x, y, overflow};
  });
  const best = candidates.find(candidate => candidate.overflow === 0) ?? candidates.reduce((a,b) => a.overflow <= b.overflow ? a : b);
  return {side:best.side, x:Math.max(padding, Math.min(best.x, viewport.width - bubble.width - padding)), y:Math.max(padding, Math.min(best.y, viewport.height - bubble.height - padding))};
}
