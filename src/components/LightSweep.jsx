import { useEffect, useRef } from 'react'
import { gsap, onScene } from '../lib/scroll'

/**
 * Cinematic cuts. A ribbon of light sweeps the viewport whenever the home page crosses into a
 * new section — behind the content, so it never washes over text. Route changes lift the same
 * ribbon above everything as the leading edge of a full-screen wipe.
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
    const paths = el.querySelectorAll('.sweep__path')
    let busy = false

    const ribbon = (tl, at, dir, dur) => {
      tl.fromTo(paths, { strokeDashoffset: dir > 0 ? 1.4 : -0.4 }, { strokeDashoffset: dir > 0 ? -0.4 : 1.4, duration: dur, ease: 'power2.inOut' }, at)
        .fromTo(paths, { opacity: 0 }, { opacity: 1, duration: dur * 0.25, yoyo: true, repeat: 1, repeatDelay: dur * 0.5 }, at)
    }

    api = {
      sweep(dir = 1) {
        if (busy) return
        busy = true
        const tl = gsap.timeline({ onComplete: () => (busy = false) })
        gsap.set(el, { scaleX: dir > 0 ? 1 : -1, zIndex: 1 })
        tl.fromTo(band, { xPercent: -130, opacity: 0 }, { xPercent: 130, opacity: 0.45, duration: 1.4, ease: 'power2.inOut' }, 0).to(band, { opacity: 0, duration: 0.4 }, 1)
        ribbon(tl, 0, 1, 1.5)
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
        ribbon(tl, 0.2, 1, 1.4)
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
      <svg className="sweep__svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sweepg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0B4FA0" />
            <stop offset=".5" stopColor="#5ED3DF" />
            <stop offset=".85" stopColor="#F4FAFF" />
            <stop offset="1" stopColor="#F2BE77" />
          </linearGradient>
        </defs>
        <path className="sweep__path sweep__path--glow" pathLength="1" d="M-10,78 C22,18 48,108 72,42 S102,8 112,30" />
        <path className="sweep__path sweep__path--core" pathLength="1" d="M-10,78 C22,18 48,108 72,42 S102,8 112,30" />
      </svg>
    </div>
  )
}
