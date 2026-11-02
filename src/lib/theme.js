import { useEffect, useState } from 'react'

const KEY = 'idc-theme'
const EVENT = 'idc:theme'

/** Current theme, as set on <html data-theme> by the inline script in index.html. */
export const getTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

export function setTheme(theme) {
  document.documentElement.dataset.theme = theme
  try {
    localStorage.setItem(KEY, theme)
  } catch {
    // storage blocked (private mode): the choice simply won't persist
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: theme }))
}

export function useTheme() {
  const [theme, set] = useState(getTheme)
  useEffect(() => {
    const fn = (e) => set(e.detail)
    window.addEventListener(EVENT, fn)
    return () => window.removeEventListener(EVENT, fn)
  }, [])
  return theme
}
