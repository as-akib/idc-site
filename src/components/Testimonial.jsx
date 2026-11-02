import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, lenis } from '../lib/scroll'
import { useLite } from '../lib/device'
import IdcIcon from '../lib/IdcIcon'
import { testimonials } from '../data/content'

// deck positions: front card, the two waiting behind it, and one that has been read
const FRONT = { y: 0, z: 0, scale: 1, rotateX: 0, opacity: 1, filter: 'blur(0px)' }
const BACK1 = { y: 46, z: -140, scale: 0.92, rotateX: -6, opacity: 0.55, filter: 'blur(1.5px)' }
const BACK2 = { y: 92, z: -280, scale: 0.84, rotateX: -10, opacity: 0.25, filter: 'blur(3px)' }
const GONE = { y: -150, z: 80, scale: 1.04, rotateX: 14, opacity: 0, filter: 'blur(6px)' }
const STACK = [FRONT, BACK1, BACK2]

const HOLD = 0.7 // timeline time each voice stays readable
const STEP = 1 // timeline time for the deck to advance

/**
 * Client voices as a deck of cards in 3D. While the section is pinned, scrolling deals the next
 * card forward; the index on the left shows story-style progress and jumps to a voice on click.
 */
export default function Testimonial() {
  const root = useRef(null)
  const tlRef = useRef(null)
  const [active, setActive] = useState(0)
  const lite = useLite()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: root.current, start: lite ? 'top 80%' : 'top 65%' } })
        .from('.voices__side > *', { y: 30, opacity: 0, stagger: 0.08, duration: 0.9 })
        .from('.voices__deck', { y: 80, opacity: 0, rotateX: -18, duration: 1.2 }, 0.1)
      if (lite) return

      const cards = gsap.utils.toArray('.voice')
      const fills = gsap.utils.toArray('.voices__tab i')
      cards.forEach((c, i) => gsap.set(c, { ...(STACK[i] || BACK2), zIndex: cards.length - i }))

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut', immediateRender: false },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
          onUpdate: () => setActive(Math.min(cards.length - 1, Math.floor((tl.time() + STEP * 0.5) / (HOLD + STEP)))),
        },
      })
      for (let i = 0; i < cards.length; i++) {
        const start = i * (HOLD + STEP)
        // story-style progress bar for voice i fills while it is the front card
        tl.fromTo(fills[i], { scaleX: 0 }, { scaleX: 1, ease: 'none', duration: HOLD + (i < cards.length - 1 ? STEP * 0.5 : 0) }, start)
        if (i === cards.length - 1) break
        const at = start + HOLD
        tl.fromTo(cards[i], FRONT, { ...GONE, duration: STEP }, at)
        for (let j = i + 1; j < cards.length; j++) {
          tl.fromTo(cards[j], STACK[j - i] || BACK2, { ...(STACK[j - i - 1] || BACK2), duration: STEP }, at)
        }
      }
      tl.to({}, { duration: 0.3 })
      tlRef.current = tl
    }, root)
    return () => {
      tlRef.current = null
      ctx.revert()
    }
  }, [lite])

  // jump to a voice: scroll to the point in the pinned section where that card is front and centre
  const show = (i) => {
    const tl = tlRef.current
    if (!tl) {
      root.current.querySelectorAll('.voice')[i]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
      return
    }
    const st = tl.scrollTrigger
    const t = i * (HOLD + STEP) + HOLD * 0.4
    const y = st.start + (st.end - st.start) * (t / tl.duration())
    lenis ? lenis.scrollTo(y, { duration: 1.2 }) : window.scrollTo({ top: y, behavior: 'smooth' })
  }

  return (
    <section id="voice" data-scene className="scene voices" ref={root}>
      <div className="sticky voices__stage">
        <aside className="voices__side">
          <span className="eyebrow">( 05 ) — Client voices</span>
          <h2 className="voices__title">
            Trusted by the
            <br />
            <span className="flow-text">people we build for</span>
          </h2>
          <ol className="voices__tabs">
            {testimonials.map((t, i) => (
              <li key={t.name}>
                <button type="button" className={`voices__tab ${i === active ? 'is-active' : ''}`} onClick={() => show(i)} aria-current={i === active}>
                  <span className="voices__tabn">{String(i + 1).padStart(2, '0')}</span>
                  <span className="voices__tabname">{t.name}</span>
                  <span className="voices__bar" aria-hidden="true">
                    <i />
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <div className="voices__deck" data-lenis-prevent={lite ? '' : undefined}>
          <svg className="voices__orbit" viewBox="0 0 600 600" aria-hidden="true">
            <ellipse cx="300" cy="300" rx="290" ry="120" transform="rotate(-24 300 300)" />
            <ellipse cx="300" cy="300" rx="290" ry="120" transform="rotate(24 300 300)" />
          </svg>
          {testimonials.map((t, i) => (
            <figure className="voice" key={t.name}>
              <span className="voice__mark" aria-hidden="true">
                “
              </span>
              <IdcIcon size={120} className="voice__watermark" />
              <blockquote className="voice__quote">{t.quote}</blockquote>
              <figcaption className="voice__who">
                <span className="voice__avatar" aria-hidden="true">
                  {t.initial}
                </span>
                <span className="voice__meta">
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </span>
                <span className="voice__project">{t.project}</span>
              </figcaption>
              <span className="voice__count" aria-hidden="true">
                {String(i + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}
              </span>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
