import { useLayoutEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { gsap } from '../lib/scroll'
import { Magnetic } from '../lib/ui'
import IdcIcon from '../lib/IdcIcon'
import Split from '../lib/Split'
import { brand, contact } from '../data/content'

const tel = (p) => `tel:${p.replace(/[^+\d]/g, '')}`

export default function Footer() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer__mail .c', { yPercent: 110, stagger: 0.02, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.footer__mail', start: 'top 90%' } })
      gsap.from('.footer__col', { y: 50, opacity: 0, stagger: 0.08, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: '.footer__cols', start: 'top 90%' } })
      gsap.fromTo('.footer__mark', { '--lvl': '0%' }, { '--lvl': '100%', ease: 'none', scrollTrigger: { trigger: '.footer__mark', start: 'top bottom', end: 'bottom bottom', scrub: true } })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <footer id="contact" data-scene className="scene footer" ref={root}>
      <div className="container">
        <div className="footer__lead">
          <span className="eyebrow">( 07 ) — Contact</span>
          <p className="footer__support">
            <span className="footer__pulse" /> {contact.support[0]} — {contact.support[1]}
          </p>
        </div>

        <Magnetic strength={0.12} className="footer__mailwrap">
          <a className="footer__mail" href={`mailto:${contact.email}`}>
            <Split text={contact.email} chars kinetic />
          </a>
        </Magnetic>

        <div className="footer__cols">
          <div className="footer__col">
            <h4>Call</h4>
            {contact.phones.map((p) => (
              <a className="footer__phone" key={p} href={tel(p)}>
                {p}
              </a>
            ))}
          </div>
          <div className="footer__col">
            <h4>Visit</h4>
            <address>
              {contact.address.map((l) => (
                <span key={l}>{l}</span>
              ))}
            </address>
            <a className="footer__link" href={contact.map} target="_blank" rel="noreferrer">
              Location on map ↗
            </a>
          </div>
          <div className="footer__col">
            <h4>Quick links</h4>
            <ul className="footer__list">
              {contact.links.map((l) => (
                <motion.li key={l} whileHover={{ x: 6 }}>
                  {l}
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="footer__col">
            <h4>Follow</h4>
            <ul className="footer__list">
              {contact.social.map((l) => (
                <motion.li key={l} whileHover={{ x: 6 }}>
                  {l}
                </motion.li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__brandrow">
          <p>
            <IdcIcon size={22} /> {brand.tagline}
          </p>
        </div>

        <div className="footer__mark" aria-hidden="true">
          IDC
        </div>

        <div className="footer__bottom">
          <span>{contact.copyright}</span>
          <span>{brand.lines.join(' | ')}</span>
        </div>
      </div>
    </footer>
  )
}
