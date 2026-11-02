import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/scroll'
import { useLite } from '../lib/device'
import Split from '../lib/Split'
import { FlowButton } from '../lib/ui'
import ProjectCard from './ProjectCard'
import { allProjects, projects, projectsIntro } from '../data/content'

/**
 * The title block scrolls past on its own; only once it has fully exited does the gallery pin
 * and travel sideways (the pin wrapper starts below the intro, so they never overlap).
 */
export default function Work() {
  const root = useRef(null)
  const pin = useRef(null)
  const track = useRef(null)
  const lite = useLite()

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work__intro .c', { yPercent: 115, stagger: 0.025, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: '.work__intro', start: 'top 88%' } })
      gsap.from('.work__intro .reveal', { y: 40, opacity: 0, stagger: 0.1, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.work__intro', start: 'top 80%' } })
      if (lite) {
        gsap.utils.toArray('.work .pcard').forEach((c) => gsap.from(c, { y: 80, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%' } }))
        return
      }
      const wrap = pin.current
      const distance = () => track.current.scrollWidth - window.innerWidth
      const size = () => (wrap.style.height = `${distance() + window.innerHeight * 1.5}px`)
      size()
      ScrollTrigger.addEventListener('refreshInit', size)

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: wrap, start: 'top top', end: () => `+=${distance() + window.innerHeight * 0.5}`, scrub: 0.6, invalidateOnRefresh: true },
      })
      tl.to(track.current, { x: () => -distance(), duration: 1 }, 0).to('.work__progress span', { scaleX: 1, duration: 1 }, 0)

      gsap.utils.toArray('.work .pcard-slot').forEach((card) => {
        gsap.to(card, {
          keyframes: { rotateY: [-18, 0, 18], z: [-180, 0, -180], ease: 'none' },
          ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: tl, start: 'left right', end: 'right left', scrub: true },
        })
      })
      return () => {
        ScrollTrigger.removeEventListener('refreshInit', size)
        wrap.style.height = ''
      }
    }, root)
    return () => ctx.revert()
  }, [lite])

  return (
    <section id="work" data-scene className="scene work" ref={root}>
      <div className="container work__intro">
        <span className="eyebrow reveal">( 04 ) — Selected work</span>
        <Split as="h2" className="work__title" text={projectsIntro.title} chars kinetic />
        <div className="work__introrow">
          <p className="work__text reveal">{projectsIntro.text}</p>
          <p className="work__count reveal">
            <b>{String(projects.length).padStart(2, '0')}</b> featured <span>/</span> <b>{String(allProjects.length).padStart(2, '0')}</b> total
          </p>
        </div>
      </div>

      <div className="work__pin" ref={pin}>
        <div className="sticky work__stage" data-lenis-prevent={lite ? '' : undefined}>
          <div className="work__veil" aria-hidden="true" />
          <div className="work__track pgrid" ref={track}>
            {projects.map((p, i) => (
              <div className="pcard-slot" key={p.slug}>
                <ProjectCard project={p} index={i} lite={lite} showDesc />
              </div>
            ))}
            <div className="work__end">
              <p className="display-lg">
                <span className="flow-text">{String(allProjects.length).padStart(2, '0')}</span>
                <br />
                Projects
              </p>
              <FlowButton warm to="/projects">
                View All Projects
              </FlowButton>
            </div>
          </div>
          {!lite && (
            <div className="work__progress">
              <span />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
