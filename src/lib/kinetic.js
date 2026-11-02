import { gsap, scene } from './scroll'

/**
 * Kinetic typography: every registered character skews, stretches and drifts with scroll
 * velocity, each on its own lag so they settle back into place at slightly different times.
 */
const groups = new Set()
let vel = 0
let running = false

function tick() {
  const idle = performance.now() - scene.t > 120
  const target = idle ? 0 : Math.max(-1.3, Math.min(1.3, scene.velocity / 38))
  vel += (target - vel) * 0.18
  for (const g of groups) {
    if (!g.visible) continue
    for (const c of g.chars) {
      c.v += (vel - c.v) * c.r
      const a = Math.abs(c.v)
      if (a < 0.002) {
        if (c.dirty) {
          c.el.style.transform = ''
          c.dirty = false
        }
        continue
      }
      c.dirty = true
      c.el.style.transform = `translate3d(0, ${(c.v * 12 * c.b).toFixed(2)}%, 0) skewX(${(-c.v * 10 * c.a).toFixed(2)}deg) scaleY(${(1 + a * 0.14 * c.a).toFixed(3)})`
    }
  }
}

export function registerKinetic(root) {
  if (!root) return () => {}
  const chars = [...root.querySelectorAll('.k')].map((el, i) => ({
    el,
    v: 0,
    r: 0.05 + ((i * 0.618) % 1) * 0.13,
    a: 0.65 + 0.35 * Math.sin(i * 1.7),
    b: Math.sin(i * 0.9 + 0.5),
    dirty: false,
  }))
  const g = { chars, visible: true }
  const io = new IntersectionObserver(([e]) => (g.visible = e.isIntersecting))
  io.observe(root)
  groups.add(g)
  if (!running) {
    gsap.ticker.add(tick)
    running = true
  }
  return () => {
    groups.delete(g)
    io.disconnect()
  }
}
