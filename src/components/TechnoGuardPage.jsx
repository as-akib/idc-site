import { useLayoutEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap, lenis } from '../lib/scroll'
import Split from '../lib/Split'
import { FlowButton, Magnetic, MagneticCard } from '../lib/ui'
import { useLite } from '../lib/device'
import { contact, technoGuard as tg } from '../data/content'

const tel = (p) => `tel:${p.replace(/[^+\d]/g, '')}`

function Check() {
  return (
    <svg className="tg__check" viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="9" />
      <path d="M6 10.4l2.6 2.6L14.2 7.4" />
    </svg>
  )
}

/** Techno-Guard Engineering — IDC's offline engineering & fire-safety service. */
export default function TechnoGuardPage({ ready, canGoBack }) {
  const root = useRef(null)
  const navigate = useNavigate()
  const lite = useLite()

  useLayoutEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ delay: 0.35, defaults: { ease: 'expo.out' } })
        .from('.tg__title .c', { yPercent: 120, rotateX: -80, opacity: 0, duration: 1.5, stagger: 0.03 })
        .from('.tg__hero .ppage__rule', { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, 0.2)
        .from('.tg__hero .reveal', { y: 30, opacity: 0, duration: 1, stagger: 0.07 }, 0.4)

      gsap.utils.toArray('.tg .reveal-up').forEach((el) =>
        gsap.from(el, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 92%' } })
      )
      gsap.utils.toArray('.tg__grid').forEach((grid) =>
        gsap.from(grid.children, { y: 70, opacity: 0, duration: 1, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: grid, start: 'top 88%' } })
      )
      gsap.utils.toArray('.tg__gline').forEach((line) =>
        gsap.from(line, { scaleX: 0, duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: line, start: 'top 92%' } })
      )
    }, root)
    return () => ctx.revert()
  }, [ready])

  const jump = (id) => {
    const el = document.getElementById(id)
    if (!el) return
    if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 })
    else el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="tg" ref={root}>
      <section className="container tg__hero">
        <Magnetic strength={0.25} className="reveal">
          <button type="button" className="ppage__back" onClick={() => (canGoBack ? navigate(-1) : navigate('/'))}>
            <span aria-hidden="true">←</span> Back
          </button>
        </Magnetic>
        <span className="eyebrow reveal">( Offline service ) — by IDC</span>
        <h1 className="tg__title" aria-label={tg.name}>
          <Split className="line" text="Techno-Guard" chars kinetic={!lite} />
          <Split className="line line--flow" text="Engineering" chars kinetic={!lite} />
        </h1>
        <ul className="tg__tags reveal" aria-label={tg.tagline}>
          {tg.tagline.split('|').map((t) => (
            <li key={t}>{t.trim()}</li>
          ))}
        </ul>
        <span className="ppage__rule" aria-hidden="true" />
        <div className="tg__row">
          <p className="tg__intro reveal">{tg.intro}</p>
          <nav className="tg__jump reveal" aria-label="On this page">
            {tg.groups.map((g, i) => (
              <button key={g.id} type="button" onClick={() => jump(`tg-${g.id}`)}>
                <em>{String(i + 1).padStart(2, '0')}</em> {g.title}
              </button>
            ))}
            <button type="button" onClick={() => jump('tg-contact')}>
              <em>03</em> Get a quote
            </button>
          </nav>
        </div>
      </section>

      <section className="container tg__about">
        <div className="tg__vision reveal-up">
          <span className="eyebrow">Our vision</span>
          <p>{tg.vision}</p>
        </div>
        <div className="tg__commit reveal-up">
          <span className="tg__commitmark" aria-hidden="true">
            “
          </span>
          <h2>{tg.commitmentTitle}</h2>
          {tg.commitment.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      </section>

      {tg.groups.map((g, gi) => (
        <section key={g.id} id={`tg-${g.id}`} className={`tg__group tg__group--${g.id}`}>
          <div className="container tg__ghead reveal-up">
            <span className="tg__gnum">{String(gi + 1).padStart(2, '0')}</span>
            <h2 className="tg__gtitle">{g.title}</h2>
            <span className="tg__gcount">{g.items.length} services</span>
            <span className="tg__gline" aria-hidden="true" />
          </div>

          <div className="tg__marquee" aria-hidden="true">
            <div className={`tg__mtrack ${gi % 2 ? 'is-reverse' : ''}`}>
              {[...g.gallery, ...g.gallery].map((src, i) => (
                <img key={i} src={src} alt="" loading="lazy" />
              ))}
            </div>
          </div>

          <div className="container tg__grid">
            {g.items.map((it, i) => (
              <MagneticCard key={it.title} className="tg__card" strength={lite ? 0 : 6} tilt={lite ? 0 : 5} radius={0.5}>
                <span className="tg__cardn">{String(i + 1).padStart(2, '0')}</span>
                <h3>{it.title}</h3>
                <ul>
                  {it.points.map((p) => (
                    <li key={p}>
                      <Check />
                      {p}
                    </li>
                  ))}
                </ul>
              </MagneticCard>
            ))}
          </div>
        </section>
      ))}

      <section id="tg-contact" className="container tg__package">
        <div className="tg__pkg reveal-up">
          <div className="tg__pkghead">
            <span className="eyebrow">{tg.package.label}</span>
            <h2 className="display-lg">{tg.package.title}</h2>
            <p className="tg__note">{tg.package.note}</p>
          </div>
          <ul className="tg__pkglist">
            {tg.package.points.map((p) => (
              <li key={p}>
                <Check />
                {p}
              </li>
            ))}
          </ul>
          <div className="tg__actions">
            <FlowButton warm href={`mailto:${contact.email}?subject=${encodeURIComponent('Techno-Guard Engineering enquiry')}`}>
              Request a quote
            </FlowButton>
            <div className="tg__phones">
              {contact.phones.map((p) => (
                <a key={p} href={tel(p)}>
                  {p}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
