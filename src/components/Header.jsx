import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { lenis, onScene, scrollToId } from '../lib/scroll'
import { FlowButton } from '../lib/ui'
import { brand, contact } from '../data/content'

// every header link scrolls to its home section; only "View All Projects" opens /projects
const links = [
  ['services', 'Services'],
  ['about', 'About'],
  ['work', 'Projects'],
  ['contact', 'Contact'],
]

export default function Header({ ready }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  useEffect(() => onScene((s) => setScrolled(s.y > 40)), [])

  // mobile menu: freeze the page behind it while open
  useEffect(() => {
    if (open) lenis?.stop()
    else lenis?.start()
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open])

  const go = (id) => (e) => {
    e.preventDefault()
    const run = () => (pathname === '/' ? scrollToId(id) : navigate('/', { state: { to: id } }))
    if (!open) return run()
    // closing the menu restarts Lenis, which would cancel a scroll started in the same tick
    setOpen(false)
    setTimeout(run, 120)
  }

  return (
    <motion.header
      className={`header ${scrolled ? 'is-scrolled' : ''}`}
      initial={{ y: -40, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to="/" className="header__logo" onClick={pathname === '/' ? go('hero') : undefined} data-magnetic>
        <img src={brand.logo} alt="IDC — Impressive Digital Communication" width="150" height="40" />
      </Link>
      <nav className="header__nav" aria-label="Primary">
        {links.map(([id, label]) => (
          <a key={id} href={`#${id}`} onClick={go(id)}>
            <span data-text={label}>{label}</span>
          </a>
        ))}
      </nav>
      <FlowButton warm href={`mailto:${contact.email}`} className="fbtn--sm header__quote">
        Request a quote
      </FlowButton>
      <button
        type="button"
        className={`header__menu ${open ? 'is-open' : ''}`}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((v) => !v)}
      >
        <span />
        <span />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.nav
              id="mobile-nav"
              className="mnav"
              aria-label="Mobile"
              initial={{ clipPath: 'circle(0% at 92% 4%)' }}
              animate={{ clipPath: 'circle(150% at 92% 4%)' }}
              exit={{ clipPath: 'circle(0% at 92% 4%)' }}
              transition={{ duration: 0.7, ease: [0.7, 0, 0.2, 1] }}
            >
              <ol className="mnav__list">
                {links.map(([id, label], i) => (
                  <motion.li
                    key={id}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <a href={`#${id}`} onClick={go(id)}>
                      <em>{String(i + 1).padStart(2, '0')}</em>
                      {label}
                    </a>
                  </motion.li>
                ))}
              </ol>
              <motion.div className="mnav__foot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
                <span>{contact.phones[0]}</span>
              </motion.div>
            </motion.nav>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </motion.header>
  )
}
