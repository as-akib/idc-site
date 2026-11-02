import { useEffect, useId, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'motion/react'

/** Circular rotating text — used as a badge. */
export function RotatingBadge({ text, size = 150, className = '', children }) {
  const id = useId().replace(/:/g, '')
  return (
    <div className={`rbadge ${className}`} style={{ width: size, height: size }}>
      <svg viewBox="0 0 200 200" className="rbadge__ring" aria-hidden="true">
        <defs>
          <path id={`rb${id}`} d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" />
        </defs>
        <text>
          <textPath href={`#rb${id}`} startOffset="0">
            {text}
          </textPath>
        </text>
      </svg>
      <div className="rbadge__core">{children}</div>
    </div>
  )
}

const finePointer = () => typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches

/** Pulls its child toward the pointer while hovered (pairs with the custom cursor). */
export function Magnetic({ children, strength = 0.35, className = '' }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 })
  const move = (e) => {
    const r = ref.current.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const leave = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.span ref={ref} className={`magnetic ${className}`} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={leave} data-magnetic>
      {children}
    </motion.span>
  )
}

/**
 * Proximity magnet: the element leans toward the cursor and tilts as the cursor approaches,
 * before it is even hovered. Strength falls off over `radius` (in element half-sizes).
 */
export function MagneticCard({ children, className = '', strength = 14, tilt = 7, radius = 1.2, ...rest }) {
  const ref = useRef(null)
  const cfg = { stiffness: 140, damping: 18, mass: 0.6 }
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const gx = useMotionValue('50%')
  const gy = useMotionValue('50%')
  const sx = useSpring(x, cfg)
  const sy = useSpring(y, cfg)
  const srx = useSpring(rx, cfg)
  const sry = useSpring(ry, cfg)

  useEffect(() => {
    if (!finePointer()) return
    const onMove = (e) => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.bottom < -200 || r.top > innerHeight + 200) return
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2)
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2)
      const d = Math.max(Math.abs(dx), Math.abs(dy))
      const f = d <= 1 ? 1 : Math.max(0, 1 - (d - 1) / radius)
      const cx = Math.max(-1.4, Math.min(1.4, dx))
      const cy = Math.max(-1.4, Math.min(1.4, dy))
      x.set(cx * strength * f)
      y.set(cy * strength * f)
      rx.set(-cy * tilt * f)
      ry.set(cx * tilt * f)
      gx.set(`${(cx * 0.5 + 0.5) * 100}%`)
      gy.set(`${(cy * 0.5 + 0.5) * 100}%`)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [radius, strength, tilt, x, y, rx, ry, gx, gy])

  return (
    <motion.div ref={ref} className={`mcard ${className}`} style={{ x: sx, y: sy, rotateX: srx, rotateY: sry, '--gx': gx, '--gy': gy }} {...rest}>
      {children}
      <span className="mcard__glare" aria-hidden="true" />
    </motion.div>
  )
}

/** Pill button with a liquid fill. `warm` uses the amber accent (primary CTAs). */
export function FlowButton({ href, to, children, warm = false, className = '', ...rest }) {
  const inner = (
    <>
      <motion.span className="fbtn__fill" variants={{ rest: { scaleX: 0 }, hover: { scaleX: 1 } }} transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }} />
      <span className="fbtn__label">{children}</span>
      <motion.span className="fbtn__arrow" variants={{ rest: { rotate: 0 }, hover: { rotate: -45 } }}>
        →
      </motion.span>
    </>
  )
  const cls = `fbtn ${warm ? 'fbtn--warm' : ''} ${className}`
  const motionProps = { whileHover: 'hover', initial: 'rest', animate: 'rest' }
  return (
    <Magnetic>
      {to ? (
        <MotionLink to={to} className={cls} {...motionProps} {...rest}>
          {inner}
        </MotionLink>
      ) : (
        <motion.a href={href} className={cls} {...motionProps} {...rest}>
          {inner}
        </motion.a>
      )}
    </Magnetic>
  )
}

const MotionLink = motion.create(Link)
