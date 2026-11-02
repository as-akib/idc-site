import { motion } from 'motion/react'
import { setTheme, useTheme } from '../lib/theme'
import { wipe } from './LightSweep'

/** Sun / moon switch. The change happens behind the same light wipe used between pages. */
export default function ThemeToggle({ className = '' }) {
  const theme = useTheme()
  const light = theme === 'light'
  const toggle = () => wipe(() => setTheme(light ? 'dark' : 'light'))
  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggle}
      aria-label={light ? 'Switch to dark mode' : 'Switch to light mode'}
      title={light ? 'Dark mode' : 'Light mode'}
    >
      <motion.svg viewBox="0 0 24 24" aria-hidden="true" animate={{ rotate: light ? 0 : -90 }} transition={{ type: 'spring', stiffness: 200, damping: 18 }}>
        <motion.circle cx="12" cy="12" fill="currentColor" animate={{ r: light ? 5 : 8 }} transition={{ duration: 0.5 }} />
        {/* moon bite */}
        <motion.circle cx="12" cy="12" r="8" className="theme-toggle__bite" animate={{ cx: light ? 26 : 16, cy: light ? -2 : 8 }} transition={{ duration: 0.5 }} />
        <motion.g stroke="currentColor" strokeWidth="2" strokeLinecap="round" animate={{ opacity: light ? 1 : 0, scale: light ? 1 : 0.4 }} style={{ originX: '12px', originY: '12px' }}>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line key={a} x1="12" y1="1.8" x2="12" y2="4" transform={`rotate(${a} 12 12)`} />
          ))}
        </motion.g>
      </motion.svg>
    </button>
  )
}
