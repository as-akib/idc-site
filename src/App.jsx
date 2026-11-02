import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from 'react-router-dom'
import { initSmoothScroll, lenis, scene, ScrollTrigger } from './lib/scroll'
import { LiteContext, useDetectLite } from './lib/device'
import Header from './components/Header'
import Cursor from './components/Cursor'
import ScrollNav from './components/ScrollNav'
import LightSweep, { wipe } from './components/LightSweep'
import Home from './components/Home'
import ProjectsPage from './components/ProjectsPage'
import Footer from './components/Footer'

const Experience = lazy(() => import('./three/Experience'))

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Shell />
    </BrowserRouter>
  )
}

const routeOf = (path) => (path.startsWith('/projects') ? 'projects' : 'home')

function Shell() {
  const lite = useDetectLite()
  // no intro loader: the site opens straight onto the hero
  const ready = true
  const location = useLocation()
  const navType = useNavigationType()
  const [shown, setShown] = useState(location)
  const positions = useRef({})

  useEffect(() => {
    const destroy = initSmoothScroll(lite)
    // late-loading webfonts change text metrics, so re-measure once they arrive
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return destroy
  }, [lite])

  useEffect(() => {
    document.documentElement.classList.toggle('is-lite', lite)
  }, [lite])

  useEffect(() => {
    ScrollTrigger.refresh()
    const t = setTimeout(() => ScrollTrigger.refresh(), 600)
    return () => clearTimeout(t)
  }, [lite])

  // route change: remember where we were, then cut to the new page behind the light wipe
  useEffect(() => {
    if (location.key === shown.key) return
    positions.current[shown.key] = window.scrollY
    wipe(() => setShown(location))
  }, [location, shown])

  useLayoutEffect(() => {
    scene.route = routeOf(shown.pathname)
    document.documentElement.dataset.route = scene.route
    const back = navType === 'POP' ? positions.current[shown.key] || 0 : 0
    lenis?.scrollTo(0, { immediate: true, force: true })
    window.scrollTo(0, 0)
    const id = requestAnimationFrame(() => {
      lenis?.resize()
      ScrollTrigger.refresh()
      if (back) {
        window.scrollTo(0, back)
        lenis?.scrollTo(back, { immediate: true, force: true })
      }
    })
    return () => cancelAnimationFrame(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown])

  const isHome = routeOf(shown.pathname) === 'home'
  const canGoBack = (window.history.state?.idx ?? 0) > 0

  return (
    <LiteContext.Provider value={lite}>
      <Suspense fallback={null}>
        <Experience lite={lite} />
      </Suspense>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <LightSweep enabled={ready && isHome && !lite} />
      <Header ready={ready} />
      {isHome && !lite && <ScrollNav ready={ready} />}
      <Routes location={shown}>
        <Route path="/" element={<Home ready={ready} />} />
        <Route path="/projects" element={<ProjectsPage ready={ready} canGoBack={canGoBack} />} />
        <Route path="*" element={<Home ready={ready} />} />
      </Routes>
      <Footer key={shown.pathname} />
    </LiteContext.Provider>
  )
}
