import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { useLite } from '../lib/device'
import Split from '../lib/Split'
import { Magnetic } from '../lib/ui'
import ProjectCard from './ProjectCard'
import { CtaButton } from './CTA'
import { allProjects, cta, projectsIntro } from '../data/content'

const filters = ['All', 'Web Development', 'E-Commerce', 'Branding', 'Marketing']

export default function ProjectsPage({ ready, canGoBack }) {
  const root = useRef(null)
  const lite = useLite()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  const entered = useRef(false)
  useEffect(() => {
    if (!ready) return
    const t = setTimeout(() => (entered.current = true), 2500)
    return () => clearTimeout(t)
  }, [ready])
  const list = useMemo(() => (filter === 'All' ? allProjects : allProjects.filter((p) => p.tags.includes(filter))), [filter])

  // horizontal gallery: the wrapper's height buys the sideways travel, the stage stays pinned
  const pin = useRef(null)
  const track = useRef(null)
  useLayoutEffect(() => {
    if (lite) return
    const wrap = pin.current
    const distance = () => Math.max(0, track.current.scrollWidth - window.innerWidth)
    const size = () => (wrap.style.height = `${distance() + window.innerHeight}px`)
    size()
    ScrollTrigger.addEventListener('refreshInit', size)
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: { trigger: wrap, start: 'top top', end: () => `+=${distance()}`, scrub: 0.5, invalidateOnRefresh: true },
        })
        .to(track.current, { x: () => -distance() }, 0)
        .to('.ppage__progress span', { scaleX: 1 }, 0)
    }, root)
    return () => {
      ScrollTrigger.removeEventListener('refreshInit', size)
      ctx.revert()
      wrap.style.height = ''
    }
  }, [lite])

  // the track width changes with the filter: re-measure once cards have settled
  useEffect(() => {
    const t = setTimeout(() => ScrollTrigger.refresh(), 750)
    return () => clearTimeout(t)
  }, [filter])

  useLayoutEffect(() => {
    if (!ready) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.35, defaults: { ease: 'expo.out' } })
      tl.from('.ppage__title .c', { yPercent: 120, rotateX: -80, opacity: 0, duration: 1.6, stagger: 0.035 })
        .from('.ppage__rule', { scaleX: 0, duration: 1.4, ease: 'expo.inOut' }, 0.2)
        .from('.ppage__hero .reveal', { y: 30, opacity: 0, duration: 1.1, stagger: 0.08 }, 0.5)
      gsap.from('.ppage__end > *', {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.ppage__end', start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [ready])

  return (
    <main className="ppage" ref={root}>
      <section className="container ppage__hero">
        <Magnetic strength={0.25} className="reveal">
          <button type="button" className="ppage__back" onClick={() => (canGoBack ? navigate(-1) : navigate('/'))}>
            <span aria-hidden="true">←</span> Back
          </button>
        </Magnetic>
        <span className="eyebrow reveal">( Archive ) — {String(allProjects.length).padStart(2, '0')} Projects</span>
        <Split as="h1" className="ppage__title" text={projectsIntro.title} chars kinetic />
        <span className="ppage__rule" aria-hidden="true" />
        <div className="ppage__row">
          <p className="ppage__intro reveal">{projectsIntro.text}</p>
          <div className="ppage__filters reveal" role="group" aria-label="Filter projects">
            {filters.map((f) => (
              <button key={f} type="button" className={f === filter ? 'is-on' : ''} aria-pressed={f === filter} onClick={() => setFilter(f)}>
                {f === filter && <motion.span layoutId="filter-pill" className="ppage__pill" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <span>{f}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="ppage__gallery" ref={pin}>
        <div className="sticky ppage__stage" data-lenis-prevent={lite ? '' : undefined}>
          <div className="ppage__track pgrid" ref={track}>
            <AnimatePresence mode="popLayout">
              {ready &&
                list.map((p, i) => (
                  <motion.div
                    layout
                    key={p.slug}
                    className="pcard-slot"
                    initial={{ opacity: 0, x: 160, rotateY: -14 }}
                    animate={{ opacity: 1, x: 0, rotateY: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: entered.current ? 0 : 0.9 + i * 0.1 }}
                  >
                    <ProjectCard project={p} index={allProjects.indexOf(p)} showDesc lite={lite} />
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          {!lite && (
            <div className="ppage__progress" aria-hidden="true">
              <span />
            </div>
          )}
        </div>
      </section>

      <section className="container ppage__end">
        <p className="eyebrow">{cta.ask}</p>
        <h2 className="display-lg">
          {cta.title[0]} <span className="flow-text">{cta.title[1]}</span>
        </h2>
        <CtaButton />
      </section>
    </main>
  )
}
