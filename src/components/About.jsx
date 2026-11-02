import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../lib/scroll'
import { useLite } from '../lib/device'
import Split from '../lib/Split'
import { MagneticCard } from '../lib/ui'
import IdcIcon from '../lib/IdcIcon'
import { about, stats } from '../data/content'

const RING = 2 * Math.PI * 54

export default function About() {
  const root = useRef(null)
  const lite = useLite()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // manifesto: the number counts up on arrival, then fills with liquid light as you scroll
      const level = (v) => gsap.set('.about__num--fill', { '--lvl': `${v}%` })
      const nums = gsap.utils.toArray('.about__num')
      const count = { v: 0 }
      const countTo = (v) => nums.forEach((n) => (n.textContent = String(Math.round(v)).padStart(2, '0')))
      countTo(0)
      gsap
        .timeline({ defaults: { ease: 'expo.out' }, scrollTrigger: { trigger: '.about__pin', start: lite ? 'top 80%' : 'top 70%' } })
        .from('.about__lens', { scale: 0.6, opacity: 0, duration: 1.4 })
        .from('.about__ring', { rotate: -90, opacity: 0, duration: 1.6 }, 0)
        .from('.about__nums', { y: 40, opacity: 0, duration: 1.1 }, 0.15)
        .to(count, { v: about.years, duration: 1.4, ease: 'power2.out', onUpdate: () => countTo(count.v) }, 0.25)
        .from('.about__left > *', { y: 30, opacity: 0, stagger: 0.1, duration: 0.9 }, 0.1)
        .fromTo('.about__statement .c', { opacity: 0.15 }, { opacity: 1, stagger: 0.07, duration: 0.6, ease: 'power1.out' }, 0.3)
        .from('.about__label', { opacity: 0, y: 16, duration: 0.8 }, 0.7)
      if (!lite) {
        const o = { v: 0 }
        gsap.to(o, {
          v: 100,
          ease: 'none',
          onUpdate: () => level(o.v),
          scrollTrigger: { trigger: '.about__pin', start: 'top 65%', end: 'bottom 125%', scrub: 0.5 },
        })
      } else {
        level(100)
      }

      gsap.utils.toArray('.reveal').forEach((el) =>
        gsap.from(el, { y: 40, opacity: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 94%' } })
      )
      gsap.from('.about__capsule', { clipPath: 'inset(50% 50% 50% 50% round 999px)', duration: 1.8, ease: 'expo.inOut', scrollTrigger: { trigger: '.about__capsule', start: 'top 90%' } })
      gsap.fromTo('.about__capsule img', { yPercent: -10, scale: 1.2 }, { yPercent: 10, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.about__capsule', start: 'top bottom', end: 'bottom top', scrub: true } })
      gsap.from('.bento__cell', { y: 50, opacity: 0, duration: 0.9, stagger: 0.06, ease: 'expo.out', scrollTrigger: { trigger: '.bento', start: 'top 90%' } })

      gsap.utils.toArray('.gauge').forEach((el) => {
        const num = el.querySelector('.gauge__num')
        const arc = el.querySelector('.gauge__arc')
        const target = Number(num.dataset.to)
        const frac = Number(el.dataset.frac)
        const o = { p: 0 }
        gsap.set(arc, { strokeDashoffset: RING })
        gsap.to(o, {
          p: 1,
          duration: 2.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%', once: true },
          onUpdate: () => {
            num.textContent = Math.round(o.p * target)
            arc.style.strokeDashoffset = RING * (1 - o.p * frac)
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [lite])

  return (
    <section id="about" data-scene className="scene about" ref={root}>
      <div className="about__pin">
        <div className="sticky about__stage">
          <div className="about__left">
            <span className="eyebrow">( 03 ) — About IDC</span>
            <Split as="p" className="about__statement" text={`Years of experience ${about.statement.replace('years of experience ', '')}`} />
          </div>
          <div className="about__badge">
            <div className="about__lens" aria-hidden="true" />
            <svg className="about__ring" viewBox="0 0 600 600" aria-hidden="true">
              <defs>
                <path id="aboutRingPath" d="M300,300 m-262,0 a262,262 0 1,1 524,0 a262,262 0 1,1 -524,0" />
              </defs>
              <circle cx="300" cy="300" r="286" className="about__ringline" />
              <text>
                <textPath href="#aboutRingPath" textLength="1640" lengthAdjust="spacing">{`Years of experience • Helping people for best solutions • Years of experience • Helping people for best solutions • `}</textPath>
              </text>
            </svg>
            <div className="about__nums" aria-label={`${String(about.years).padStart(2, '0')} years of experience`}>
              <span className="about__num about__num--line" aria-hidden="true">
                {String(about.years).padStart(2, '0')}
              </span>
              <span className="about__num about__num--fill" aria-hidden="true">
                {String(about.years).padStart(2, '0')}
              </span>
            </div>
            <span className="about__label">Years of experience</span>
          </div>
        </div>
      </div>

      <div className="container about__mission">
        <div className="about__copy">
          <span className="eyebrow reveal">{about.missionEyebrow}</span>
          <h3 className="about__title reveal">{about.missionTitle}</h3>
          <p className="about__text reveal">{about.missionText}</p>
          <ul className="about__points">
            {about.missionPoints.map((p) => (
              <li className="reveal" key={p}>
                <IdcIcon size={22} />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <figure className="about__figure">
          <div className="about__capsule">
            <img src={about.image} alt="The IDC team collaborating around a table" loading="lazy" />
          </div>
          <svg className="about__orbit" viewBox="0 0 400 600" aria-hidden="true">
            <ellipse cx="200" cy="300" rx="190" ry="120" transform="rotate(-58 200 300)" />
          </svg>
        </figure>
      </div>

      <div className="container bento">
        <div className="bento__cell bento__intro">
          <h3 className="display-lg">
            We Love <br />
            <span className="flow-text">What We Do</span>
          </h3>
          <p>{about.loveIntro}</p>
        </div>
        {about.love.map((item, i) => (
          <MagneticCard className={`bento__cell bento__item ${i === 0 ? 'is-warm' : ''}`} key={item} strength={8} tilt={6} radius={0.6}>
            <span className="bento__n">{String(i + 1).padStart(2, '0')}</span>
            <p>{item}</p>
          </MagneticCard>
        ))}
        <div className="bento__cell bento__outro">
          <p>{about.loveOutro}</p>
        </div>
      </div>

      <div className="container gauges">
        {stats.map((s) => (
          <div className="gauge" key={s.label} data-frac={s.suffix === '%' ? s.value / 100 : 1}>
            <svg viewBox="0 0 120 120" className="gauge__svg" aria-hidden="true">
              <circle cx="60" cy="60" r="54" className="gauge__track" />
              <circle cx="60" cy="60" r="54" className="gauge__arc" strokeDasharray={RING} />
            </svg>
            <div className="gauge__value">
              <span className="gauge__num" data-to={s.value}>
                0
              </span>
              <span className="gauge__suffix">{s.suffix}</span>
            </div>
            <span className="gauge__label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
