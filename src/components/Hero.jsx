import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { useLite } from '../lib/device'
import Split from '../lib/Split'
import { FlowButton, RotatingBadge } from '../lib/ui'
import IdcIcon from '../lib/IdcIcon'
import { brand, contact } from '../data/content'

export default function Hero({ ready }) {
  const root = useRef(null)
  const lite = useLite()

  useLayoutEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('.hero__title .c', { yPercent: 120, rotate: 8, opacity: 0, duration: 1.7, stagger: 0.026 })
        .from('.hero__idx', { opacity: 0, x: -20, duration: 1 }, '-=1.3')
        .from('.hero__top > *, .hero__bottom > * > *', { y: 26, opacity: 0, duration: 1.1, stagger: 0.07 }, '-=1.2')
        .from('.hero__marquee', { yPercent: 100, opacity: 0, duration: 1.2 }, '-=1')
    }, root)
    return () => ctx.revert()
  }, [ready])

  useLayoutEffect(() => {
    if (lite) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.6 },
        defaults: { ease: 'none' },
      })
      // the title opens like a curtain and drifts toward the camera as we fly into the orbits
      tl.to('.hero__top, .hero__bottom', { opacity: 0, y: -40, duration: 0.25 }, 0)
        .to('.hero__marquee', { yPercent: 120, opacity: 0, duration: 0.3 }, 0.05)
        .to('.hero__title .l1', { xPercent: -22, yPercent: -40, duration: 1, ease: 'power2.in' }, 0)
        .to('.hero__title .l2', { xPercent: 18, duration: 1, ease: 'power2.in' }, 0)
        .to('.hero__title .l3', { xPercent: -14, yPercent: 40, duration: 1, ease: 'power2.in' }, 0)
        .to('.hero__title', { scale: 1.9, duration: 1, ease: 'power2.in' }, 0)
        .to('.hero__title', { opacity: 0, filter: 'blur(10px)', duration: 0.4, ease: 'power1.in' }, 0.6)
    }, root)
    return () => ctx.revert()
  }, [lite])

  const ticker = [...brand.lines, brand.tagline]
  return (
    <section id="hero" data-scene className="scene hero" ref={root}>
      <div className="sticky hero__stage">
        <div className="hero__top">
          <p className="hero__kicker">
            <span className="hero__kicker-icon" aria-hidden="true">
              <IdcIcon size={22} />
            </span>
            Digital agency — Chattogram, Bangladesh
          </p>
          <RotatingBadge text={`${brand.tagline} • ${brand.tagline} • `} size={lite ? 110 : 148}>
            <IdcIcon size={lite ? 34 : 46} spin />
          </RotatingBadge>
        </div>

        <h1 className="hero__title" aria-label={brand.full}>
          <span className="line l1">
            <Split text="Impressive" chars kinetic />
          </span>
          <span className="line l2">
            <span className="hero__idx">(IDC)</span>
            <Split className="line--flow" text="Digital" chars kinetic />
          </span>
          <span className="line l3">
            <Split text="Communication" chars kinetic />
          </span>
        </h1>

        <div className="hero__bottom">
          <div className="hero__tagwrap">
            <p className="hero__tagline">{brand.tagline}</p>
            <p className="hero__intro">{brand.intro}</p>
          </div>
          <div className="hero__actions">
            <FlowButton warm href={`mailto:${contact.email}`}>
              Start a project
            </FlowButton>
            <span className="hero__cue">
              <span className="hero__cue-line" /> Scroll to enter
            </span>
          </div>
        </div>

        <div className="hero__marquee" aria-label={brand.lines.join(', ')}>
          <div className="marquee__track" aria-hidden="true">
            {[0, 1].map((k) => (
              <span className="marquee__group" key={k}>
                {[...ticker, ...ticker].map((l, i) => (
                  <span className="marquee__item" key={i}>
                    {l}
                    <i className="marquee__dot" />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
