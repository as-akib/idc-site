import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Shared, mutable scroll/scene state read every frame by the 3D world.
 * u: continuous scene parameter. Section i spans [i, i+1):
 *    first half  = the section's pinned "hold" phase,
 *    second half = the transition out to section i+1.
 */
export const scene = { u: 0, index: 0, y: 0, progress: 0, velocity: 0, count: 0, t: 0, route: 'home' }

let anchors = []
const listeners = new Set()
export let lenis = null

export const getAnchors = () => anchors
export const onScene = (fn) => {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function measure() {
  const sy = window.scrollY
  anchors = [...document.querySelectorAll('[data-scene]')].map((el) => {
    const r = el.getBoundingClientRect()
    return { id: el.id, top: r.top + sy, h: r.height }
  })
  scene.count = anchors.length
  update(sy)
}

function update(sy) {
  scene.y = sy
  const vh = window.innerHeight
  const max = document.documentElement.scrollHeight - vh
  scene.progress = max > 0 ? Math.min(1, sy / max) : 0
  if (!anchors.length) {
    scene.u = 0
    listeners.forEach((fn) => fn(scene))
    return
  }
  let i = 0
  while (i < anchors.length - 1 && sy >= anchors[i + 1].top) i++
  const a = anchors[i]
  const next = anchors[i + 1]
  const span = next ? next.top - a.top : Math.max(a.h - vh, 1)
  const hold = Math.max(Math.min(a.h - vh, span), 1)
  const local = Math.min(1, Math.max(0, (sy - a.top) / hold))
  const trans = next ? Math.min(1, Math.max(0, (sy - a.top - hold) / Math.max(span - hold, 1))) : 0
  scene.u = i + local * 0.5 + trans * 0.5
  const idx = trans > 0.5 ? i + 1 : i
  if (idx !== scene.index) scene.index = idx
  listeners.forEach((fn) => fn(scene))
}

export function initSmoothScroll(lite) {
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
  window.scrollTo(0, 0)
  lenis = new Lenis({ lerp: lite ? 0.12 : 0.09, wheelMultiplier: 1, smoothWheel: true })
  if (import.meta.env.DEV) window.__lenis = lenis
  lenis.on('scroll', (e) => {
    scene.velocity = e.velocity
    scene.t = performance.now()
    ScrollTrigger.update()
    update(e.scroll)
  })
  const raf = (t) => lenis.raf(t * 1000)
  gsap.ticker.add(raf)
  gsap.ticker.lagSmoothing(0)
  ScrollTrigger.addEventListener('refresh', measure)
  const onResize = () => ScrollTrigger.refresh()
  window.addEventListener('resize', onResize)
  return () => {
    window.removeEventListener('resize', onResize)
    ScrollTrigger.removeEventListener('refresh', measure)
    gsap.ticker.remove(raf)
    lenis.destroy()
    lenis = null
  }
}

/**
 * Pinned sections animate in while they are held, so landing exactly on a section's top shows
 * its "empty" first frame. Each entry is how far (in viewport heights) into the section to land
 * so its content is already revealed.
 */
const LANDING = { about: 0.3, voice: 0.15, start: 0.4 }

export const scrollToId = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  // measure live: pinned/horizontal sections resize after load, so cached anchors can be stale
  lenis?.resize()
  const top = el.getBoundingClientRect().top + window.scrollY
  const target = id === 'hero' ? 0 : top + (LANDING[id] || 0) * window.innerHeight
  const distance = Math.abs(target - window.scrollY)
  const duration = Math.min(2.4, 0.9 + distance / 6000)
  if (lenis) lenis.scrollTo(target, { duration, easing: (t) => 1 - Math.pow(1 - t, 4), force: true })
  else window.scrollTo({ top: target, behavior: 'smooth' })
}

export { gsap, ScrollTrigger }
