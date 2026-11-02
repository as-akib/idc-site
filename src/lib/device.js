import { createContext, useContext, useEffect, useState } from 'react'

const query = '(max-width: 900px), (pointer: coarse), (prefers-reduced-motion: reduce)'
const detect = () => {
  if (typeof window === 'undefined') return false
  const force = new URLSearchParams(window.location.search)
  if (force.has('lite')) return true
  if (force.has('full')) return false
  const weak = (navigator.hardwareConcurrency || 8) <= 2
  return window.matchMedia(query).matches || weak
}

export const LiteContext = createContext(false)
export const useLite = () => useContext(LiteContext)

/** "Lite" = mobile / touch / reduced-motion: simplified layered parallax instead of the 3D fly-through. */
export function useDetectLite() {
  const [lite, setLite] = useState(detect)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const fn = () => setLite(detect())
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return lite
}
