import { useRef } from 'react'
import { MagneticCard } from '../lib/ui'

/**
 * Browser-framed project card. On hover the static poster gives way to a live-feeling preview:
 * the page auto-scrolls inside the frame while a scan of light passes over it.
 */
export default function ProjectCard({ project: p, index, showDesc = false, lite = false }) {
  const screen = useRef(null)
  const scroller = useRef(null)
  const measure = () => {
    const s = screen.current
    const c = scroller.current
    if (!s || !c) return
    s.style.setProperty('--dist', `${Math.max(0, c.scrollHeight - s.clientHeight)}px`)
  }
  const shots = p.scroll || [p.image]
  return (
    <MagneticCard className="pcard" strength={lite ? 0 : 10} tilt={lite ? 0 : 5} onPointerEnter={measure} data-cursor="Live preview">
      <div className="pcard__browser">
        <div className="pcard__bar">
          <i />
          <i />
          <i />
          <span className="pcard__url">{p.domain}</span>
          <span className="pcard__live">
            <b /> Live
          </span>
        </div>
        <div className="pcard__screen" ref={screen}>
          <img className="pcard__poster" src={p.image} alt={p.title} loading="lazy" />
          <div className="pcard__scroller" ref={scroller}>
            {shots.map((src, i) => (
              <img key={i} src={src} alt="" loading="lazy" onLoad={measure} />
            ))}
          </div>
          <span className="pcard__scan" />
        </div>
      </div>
      <div className="pcard__meta">
        <span className="pcard__i">{String(index + 1).padStart(2, '0')}</span>
        <div className="pcard__body">
          <h3 className="pcard__title">{p.title}</h3>
          {showDesc && p.desc && <p className="pcard__desc">{p.desc}</p>}
          <ul className="pcard__tags">
            {p.tags.map((t) => (
              <li key={t}>{t}</li>
            ))}
            {p.url && (
              <li className="pcard__visit">
                <a href={p.url} target="_blank" rel="noreferrer">
                  Visit live ↗
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
    </MagneticCard>
  )
}
