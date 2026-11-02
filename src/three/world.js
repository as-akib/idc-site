import { Vector2, Vector3 } from 'three'

/** Per-frame, damped mirror of the scroll scene state for the 3D layer. */
export const world = {
  u: 0,
  vel: 0,
  look: new Vector3(),
  mouse: new Vector2(),
  mouseTarget: new Vector2(),
}

export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
export const easeSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2

/** Splits world.u into section index k, hold progress (0..1) and transition progress (0..1). */
export function phase(u, last) {
  const k = Math.min(Math.max(Math.floor(u), 0), last)
  const r = k >= last ? Math.min(u - k, 0.5) : u - k
  return { k, hold: clamp(r * 2), trans: clamp((r - 0.5) * 2) }
}
