import { Fragment, useEffect, useRef } from 'react'
import { registerKinetic } from './kinetic'
import { useLite } from './device'

/** Splits text into masked words (.w) and characters (.c) for GSAP reveals.
 *  With `kinetic`, each glyph gets an inner .k that reacts to scroll velocity.
 *  Chars carry --i / --n so a gradient can run continuously across a line (see .line--flow). */
export default function Split({ text, chars = false, kinetic = false, className = '', as: Tag = 'span' }) {
  const ref = useRef(null)
  const lite = useLite()
  useEffect(() => (kinetic && !lite ? registerKinetic(ref.current) : undefined), [kinetic, lite, text])
  const words = text.split(' ')
  const n = text.replace(/ /g, '').length
  let i = 0
  const glyph = (c) => (kinetic ? <span className="k">{c}</span> : c)
  return (
    <Tag ref={ref} className={`split ${kinetic ? 'is-kinetic' : ''} ${className}`} aria-label={text}>
      {words.map((w, wi) => (
        <Fragment key={wi}>
          <span className="w" aria-hidden="true">
            {chars ? (
              [...w].map((c, ci) => (
                <span className="c" key={ci} style={{ '--i': i++, '--n': n }}>
                  {glyph(c)}
                </span>
              ))
            ) : (
              <span className="c">{glyph(w)}</span>
            )}
          </span>
          {wi < words.length - 1 && ' '}
        </Fragment>
      ))}
    </Tag>
  )
}
