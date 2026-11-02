import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { useLite } from '../lib/device'
import Split from '../lib/Split'
import { testimonial } from '../data/content'

/** Asymmetric: a warm quotation glyph and the client card anchor the left; the words light up on the right. */
export default function Testimonial() {
  const root = useRef(null)
  const lite = useLite()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // plays on arrival rather than scrubbing, so the quote is fully readable while it is pinned
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: root.current, start: lite ? 'top 80%' : 'top 65%' } })
        .from('.testi__side > *', { y: 30, opacity: 0, stagger: 0.1, duration: 0.9 })
        .from('.testi__mark', { scale: 0.5, rotate: -15, duration: 1.1 }, 0)
        .from('.testi__line', { scaleX: 0, duration: 0.9 }, 0.15)
        .fromTo('.testi__quote .c', { opacity: 0.12, y: 14 }, { opacity: 1, y: 0, stagger: 0.025, duration: 0.7, ease: 'power2.out' }, 0.2)
    }, root)
    return () => ctx.revert()
  }, [lite])

  return (
    <section id="voice" data-scene className="scene testi" ref={root}>
      <div className="sticky testi__stage">
        <aside className="testi__side">
          <span className="eyebrow">( 05 ) — Client voice</span>
          <span className="testi__mark" aria-hidden="true">
            “
          </span>
          <div className="testi__client">
            <span className="testi__avatar" aria-hidden="true">
              B
            </span>
            <div>
              <strong>{testimonial.name}</strong>
              <span>{testimonial.role}</span>
            </div>
          </div>
        </aside>
        <div className="testi__main">
          <span className="testi__line" aria-hidden="true" />
          <Split as="blockquote" className="testi__quote" text={testimonial.quote} />
        </div>
      </div>
    </section>
  )
}
