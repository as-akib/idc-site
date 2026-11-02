import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import { scene } from '../lib/scroll'
import { world } from './world'
import { PROJECTS_STATION } from './formations'

/** Runs first each frame: damps scroll + pointer into the shared `world` state. */
export default function Driver() {
  useEffect(() => {
    const move = (e) => world.mouseTarget.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1)
    window.addEventListener('pointermove', move, { passive: true })
    return () => window.removeEventListener('pointermove', move)
  }, [])
  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05)
    // every sub-page (projects, techno-guard) shares the drifting silk-field station
    const projects = scene.route !== 'home'
    const target = projects ? PROJECTS_STATION + scene.progress * 0.5 : scene.u
    // a route change is a hard cut (hidden by the light sweep), not a fly-through
    if (projects !== (world.u >= PROJECTS_STATION - 0.01)) world.u = target
    else world.u = MathUtils.damp(world.u, target, 3.4, d)
    world.vel = MathUtils.damp(world.vel, scene.velocity, 6, d)
    world.mouse.x = MathUtils.damp(world.mouse.x, world.mouseTarget.x, 2.5, d)
    world.mouse.y = MathUtils.damp(world.mouse.y, world.mouseTarget.y, 2.5, d)
  }, -1)
  return null
}
