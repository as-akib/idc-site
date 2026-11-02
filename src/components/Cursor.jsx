import { useEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'

/** Glowing dot + ring. The ring snaps to and wraps magnetic targets (buttons, links). */
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, x: innerWidth / 2, y: innerHeight / 2 })
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.5, ease: 'power3' })
    let target = null // element the ring is wrapped around (magnetic mode)
    let mode = 'idle' // 'idle' | 'target' | 'label'

    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      if (target) {
        const r = target.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        rx(cx + (e.clientX - cx) * 0.18)
        ry(cy + (e.clientY - cy) * 0.18)
      } else {
        rx(e.clientX)
        ry(e.clientY)
      }
    }

    const setMode = (next, el = null, label = '') => {
      if (next === mode && el === target) return
      mode = next
      target = next === 'target' ? el : null
      const r = ring.current
      r.dataset.label = label
      r.classList.toggle('has-label', next === 'label')
      r.classList.toggle('is-active', next === 'target')
      gsap.killTweensOf(r, 'width,height,borderRadius')
      if (next === 'label') {
        gsap.to(r, { width: 156, height: 46, borderRadius: 999, duration: 0.45, ease: 'expo.out' })
        gsap.to(dot.current, { scale: 0, duration: 0.25 })
      } else if (next === 'target') {
        const b = el.getBoundingClientRect()
        gsap.to(r, { width: b.width + 18, height: b.height + 18, borderRadius: Math.min(b.height, 999), duration: 0.45, ease: 'expo.out' })
        gsap.to(dot.current, { scale: 0.4, duration: 0.25 })
      } else {
        gsap.to(r, { width: 38, height: 38, borderRadius: 999, duration: 0.45, ease: 'expo.out' })
        gsap.to(dot.current, { scale: 1, duration: 0.25 })
      }
    }

    // links and buttons always win over the card's "Live preview" label
    const over = (e) => {
      const el = e.target.closest('[data-magnetic], a, button')
      if (el) return setMode('target', el)
      const card = e.target.closest('[data-cursor]')
      if (card) return setMode('label', null, card.dataset.cursor)
      setMode('idle')
    }
    // pointerover doesn't fire when the pointer leaves into nothing (e.g. a card slides away under a still cursor)
    const out = (e) => {
      if (!e.relatedTarget) setMode('idle')
    }
    const down = () => gsap.to(ring.current, { scale: 0.85, duration: 0.15 })
    const up = () => gsap.to(ring.current, { scale: 1, duration: 0.4, ease: 'elastic.out(1,0.4)' })
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.3 })
    const enter = () => gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 })

    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerover', over, { passive: true })
    window.addEventListener('pointerout', out, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    document.addEventListener('pointerenter', enter)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      window.removeEventListener('pointerout', out)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
      document.removeEventListener('pointerenter', enter)
    }
  }, [])

  return (
    <div className="cursor" aria-hidden="true">
      <div className="cursor__ring" ref={ring} />
      <div className="cursor__dot" ref={dot} />
    </div>
  )
}
