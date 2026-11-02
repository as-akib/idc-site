import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { scrollToId } from '../lib/scroll'
import Hero from './Hero'
import Services from './Services'
import About from './About'
import Work from './Work'
import Testimonial from './Testimonial'
import CTA from './CTA'

export default function Home({ ready }) {
  const { state } = useLocation()
  useEffect(() => {
    if (!state?.to) return
    const t = setTimeout(() => scrollToId(state.to), 1300)
    return () => clearTimeout(t)
  }, [state])
  return (
    <main className={ready ? 'is-ready' : ''}>
      <Hero ready={ready} />
      <Services />
      <About />
      <Work />
      <Testimonial />
      <CTA />
    </main>
  )
}
