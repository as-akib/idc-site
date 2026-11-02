import { useEffect, useRef } from 'react'
import { gsap, onScene } from '../lib/scroll'

/**
 * Cinematic cuts: a soft band of light leads a full-screen wipe for route and theme changes.
 * (A behind-content sweep on section changes is available via `enabled`, currently off.)
 */
let api = null
export const lightSweep = (dir) => api?.sweep(dir)
export const wipe = (onCovered) => (api ? api.wipe(onCovered) : onCovered())

export default function LightSweep({ enabled }) {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const band = el.querySelector('.sweep__band')
    const veil = el.querySelector('.sweep__veil')
    let busy = false

    api = {
      sweep(dir = 1) {
        if (busy) return
        busy = true
        const tl = gsap.timeline({ onComplete: () => (busy = false) })
        gsap.set(el, { scaleX: dir > 0 ? 1 : -1, zIndex: 1 })
        tl.fromTo(band, { xPercent: -130, opacity: 0 }, { xPercent: 130, opacity: 0.45, duration: 1.4, ease: 'power2.inOut' }, 0).to(band, { opacity: 0, duration: 0.4 }, 1)
      },
      wipe(onCovered) {
        busy = true
        gsap.set(el, { scaleX: 1, zIndex: 400 })
        const tl = gsap.timeline({
          onComplete: () => {
            busy = false
            gsap.set(el, { zIndex: 1 })
          },
        })
        tl.set(veil, { xPercent: -101, display: 'block' })
          .fromTo(band, { xPercent: -130, opacity: 1 }, { xPercent: 0, duration: 0.55, ease: 'power3.in' }, 0)
          .to(veil, { xPercent: 0, duration: 0.55, ease: 'power3.in' }, 0.05)
          .add(() => onCovered())
          .to({}, { duration: 0.15 })
          .to(veil, { xPercent: 101, duration: 0.85, ease: 'power3.inOut' })
          .to(band, { xPercent: 130, duration: 0.85, ease: 'power3.inOut' }, '<')
          .set(veil, { display: 'none' })
      },
    }
    return () => (api = null)
  }, [])

  useEffect(() => {
    if (!enabled) return
    let last = 0
    let lastY = 0
    return onScene((s) => {
      const dir = s.y >= lastY ? 1 : -1
      lastY = s.y
      if (s.index !== last) {
        last = s.index
        lightSweep(dir)
      }
    })
  }, [enabled])

  return (
    <div className="sweep" ref={root} aria-hidden="true">
      <div className="sweep__veil" />
      <div className="sweep__band" />
    </div>
  )
}
