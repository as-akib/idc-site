import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { onScene, scrollToId } from '../lib/scroll'
import { sections } from '../data/content'

/** Vertical chapter rail: a progress line plus one dot per section.
 *  The active label flashes briefly on each section change (and on hover) so it never sits on content. */
export default function ScrollNav({ ready }) {
  const [active, setActive] = useState(0)
  const [flash, setFlash] = useState(false)
  const fill = useRef(null)
  useEffect(() => {
    setFlash(true)
    const t = setTimeout(() => setFlash(false), 1600)
    return () => clearTimeout(t)
  }, [active])
  useEffect(
    () =>
      onScene((s) => {
        setActive(s.index)
        if (fill.current) fill.current.style.transform = `scaleY(${s.progress})`
      }),
    []
  )
  return (
    <motion.nav
      className={`snav ${flash ? 'is-flash' : ''}`}
      aria-label="Sections"
      initial={{ opacity: 0, x: 20 }}
      animate={ready ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 1, delay: 1.2 }}
    >
      <span className="snav__line">
        <span ref={fill} />
      </span>
      <ol>
        {sections.map((s, i) => (
          <li key={s.id} className={i === active ? 'is-active' : ''}>
            <button type="button" onClick={() => scrollToId(s.id)} aria-label={`Go to ${s.label}`} aria-current={i === active ? 'step' : undefined}>
              <span className="snav__label">
                <em>{String(i + 1).padStart(2, '0')}</em> {s.label}
              </span>
              <span className="snav__dot" />
            </button>
          </li>
        ))}
      </ol>
    </motion.nav>
  )
}
