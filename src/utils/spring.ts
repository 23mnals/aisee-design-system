/** A damped spring keeps velocity when the pointer changes direction. */
export function stepSpring(value: number, velocity: number, target: number, stiffness: number, damping: number, dt: number) {
  const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
  const h = dt / steps;
  for (let i = 0; i < steps; i++) {
    velocity += ((target - value) * stiffness - velocity * damping) * h;
    value += velocity * h;
  }
  return { value, velocity };
}
