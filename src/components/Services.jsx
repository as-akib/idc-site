import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { useLite } from '../lib/device'
import Split from '../lib/Split'
import IdcIcon from '../lib/IdcIcon'
import { services, servicesHeading } from '../data/content'

/** An index rail: titles fill with liquid light one by one while the detail panel swaps beside them. */
export default function Services() {
  const root = useRef(null)
  const lite = useLite()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (lite) {
        gsap.utils.toArray('.svc-panel').forEach((p) =>
          gsap.from(p, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: p, start: 'top 88%' } })
        )
        gsap.from('.services__head > *', { y: 30, opacity: 0, stagger: 0.08, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: '.services__head', start: 'top 88%' } })
        return
      }
      const rows = gsap.utils.toArray('.svc-row')
      const fills = rows.map((r) => r.querySelector('.svc-row__fill'))
      const panels = gsap.utils.toArray('.svc-panel')
      const shown = { opacity: 1, rotateY: 0, z: 0, x: 0, xPercent: 0 }
      const before = { opacity: 0, rotateY: 30, z: -240, x: 0, xPercent: 16 }
      // x is pinned to 0 explicitly: on refresh GSAP can fold xPercent into a px x offset
      const after = { opacity: 0, rotateY: -26, z: -220, x: 0, xPercent: -14 }
      const glowTo = (row) => ({ y: () => row.offsetTop, height: () => row.offsetHeight })

      // the first service is already in place when the section pins; scrolling steps through the rest
      gsap.set(panels, { ...before, transformOrigin: '0% 50%' })
      gsap.set(panels[0], shown)
      gsap.set(fills, { clipPath: 'inset(0% 100% 0% 0%)' })
      gsap.set(fills[0], { clipPath: 'inset(0% 0% 0% 0%)' })
      gsap.set(rows[0], { x: 24 })
      gsap.set('.services__glow', glowTo(rows[0]))

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut', immediateRender: false },
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true },
      })
      tl.to({}, { duration: 0.35 })
      for (let i = 1; i < rows.length; i++) {
        const at = 0.35 + (i - 1)
        tl.fromTo(fills[i - 1], { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.5 }, at)
          .fromTo(rows[i - 1], { x: 24 }, { x: 0, duration: 0.5 }, at)
          .fromTo(panels[i - 1], shown, { ...after, duration: 0.38, ease: 'power2.in' }, at)
          .fromTo(fills[i], { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.6 }, at + 0.25)
          .fromTo(rows[i], { x: 0 }, { x: 24, duration: 0.6 }, at + 0.25)
          .to('.services__glow', { ...glowTo(rows[i]), duration: 0.6 }, at + 0.25)
          .fromTo(panels[i], before, { ...shown, duration: 0.6, ease: 'power3.out' }, at + 0.36)
      }
      tl.to({}, { duration: 0.6 })
      tl.fromTo('.services__meter span', { scaleY: 0 }, { scaleY: 1, ease: 'none', duration: tl.duration() }, 0)

      // entrance plays on arrival (time-based), so the section is never empty while it scrolls in
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: root.current, start: 'top 75%' } })
        .from('.services__head > *', { y: 30, opacity: 0, stagger: 0.08, duration: 0.9 })
        .from('.svc-row > *', { x: -50, opacity: 0, stagger: 0.02, duration: 0.9 }, 0.1)
        .from('.services__detail', { opacity: 0, rotateY: 24, x: 80, duration: 1.1 }, 0.25)
    }, root)
    return () => ctx.revert()
  }, [lite])

  return (
    <section id="services" data-scene className="scene services" ref={root}>
      <div className="sticky services__stage">
        <header className="services__head">
          <span className="eyebrow">( 02 ) — What we do</span>
          <Split as="h2" className="services__statement" text={servicesHeading} />
        </header>
        <div className="services__body">
          <ol className="services__list">
            {!lite && <span className="services__glow" aria-hidden="true" />}
            {services.map((s, i) => (
              <li className="svc-row" key={s.title}>
                <span className="svc-row__n">{String(i + 1).padStart(2, '0')}</span>
                <span className="svc-row__t" data-text={s.title}>
                  {s.title}
                  <span className="svc-row__fill" aria-hidden="true">
                    {s.title}
                  </span>
                </span>
              </li>
            ))}
          </ol>
          <div className="services__detail">
            {services.map((s, i) => (
              <article className="svc-panel" key={s.title}>
                <div className="svc-panel__head">
                  <IdcIcon size={44} />
                  <span>
                    {String(i + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="svc-panel__title">{s.title}</h3>
                <p className="svc-panel__desc">{s.desc}</p>
                <ul className="svc-panel__points">
                  {s.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          {!lite && (
            <div className="services__meter" aria-hidden="true">
              <span />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
