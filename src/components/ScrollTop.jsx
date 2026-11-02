import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { lenis, onScene } from '../lib/scroll'

const R = 22
const C = 2 * Math.PI * R

/** One-click back to top. The ring around it doubles as a page-progress meter. */
export default function ScrollTop() {
  const [show, setShow] = useState(false)
  const ring = useRef(null)
  useEffect(
    () =>
      onScene((s) => {
        setShow(s.y > window.innerHeight * 0.9)
        if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - s.progress))
      }),
    []
  )
  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: Math.min(2.4, 0.8 + window.scrollY / 8000), easing: (t) => 1 - Math.pow(1 - t, 4) })
    else window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          className="totop"
          aria-label="Scroll to top"
          onClick={toTop}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        >
          <svg viewBox="0 0 52 52" aria-hidden="true">
            <circle cx="26" cy="26" r={R} className="totop__track" />
            <circle cx="26" cy="26" r={R} className="totop__ring" ref={ring} strokeDasharray={C} strokeDashoffset={C} />
          </svg>
          <span className="totop__arrow" aria-hidden="true">
            ↑
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
