import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { useLite } from '../lib/device'
import Split from '../lib/Split'
import { Magnetic } from '../lib/ui'
import { contact, cta } from '../data/content'

/** The portal: the camera dives into a vortex of light while the call to action rises out of it. */
export function CtaButton() {
  return (
    <Magnetic strength={0.3} className="cta__btnwrap">
      <a className="sbtn" href={`mailto:${contact.email}`}>
        <span className="sbtn__fill" aria-hidden="true" />
        <span className="sbtn__text">
          <small>{cta.sub[1]}</small>
          <strong>{cta.button}</strong>
        </span>
        <span className="sbtn__orb" aria-hidden="true">
          <span>→</span>
        </span>
      </a>
    </Magnetic>
  )
}

export default function CTA() {
  const root = useRef(null)
  const lite = useLite()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (lite) {
        gsap.from('.cta__title .c, .cta__ask .c', { yPercent: 110, stagger: 0.03, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.cta__title', start: 'top 85%' } })
        gsap.from('.cta__foot > *', { y: 30, opacity: 0, stagger: 0.1, duration: 1, scrollTrigger: { trigger: '.cta__foot', start: 'top 90%' } })
        return
      }
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: root.current, start: 'top 60%' } })
        .from('.cta__ask .c', { yPercent: 120, opacity: 0, stagger: 0.035, duration: 0.9 })
        .from('.cta__title .line', { scale: 0.7, opacity: 0, filter: 'blur(16px)', stagger: 0.15, duration: 1.2, ease: 'power3.out' }, 0.1)
        .from('.cta__title .c', { yPercent: 100, stagger: 0.02, duration: 0.9 }, 0.15)
        .from('.cta__foot > *', { y: 30, opacity: 0, stagger: 0.12, duration: 0.9 }, 0.6)
      // only the halo is tied to scroll: it opens up like a portal while the section is held
      gsap.fromTo('.cta__halo', { scale: 0.45, opacity: 0.3 }, { scale: 1.35, opacity: 1, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.5 } })
    }, root)
    return () => ctx.revert()
  }, [lite])

  return (
    <section id="start" data-scene className="scene cta" ref={root}>
      <div className="sticky cta__stage">
        <div className="cta__halo" aria-hidden="true" />
        <Split as="p" className="cta__ask" text={cta.ask} chars />
        <h2 className="cta__title">
          <span className="line">
            <Split text={cta.title[0]} chars kinetic />
          </span>
          <span className="line">
            <Split className="line--flow" text={cta.title[1]} chars kinetic />
          </span>
        </h2>
        <div className="cta__foot">
          <p className="cta__wait">{cta.sub[0]}</p>
          <CtaButton />
        </div>
      </div>
    </section>
  )
}
