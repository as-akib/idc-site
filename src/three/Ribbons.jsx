import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PlaneGeometry } from 'three'
import { createRibbonMaterial, randomArc } from './ribbonMaterial'
import { mulberry32, STATIONS } from './formations'
import { clamp, easeInOut, phase, world } from './world'
import { scene } from '../lib/scroll'
import { paletteFor } from './palette'

const LAST = STATIONS.length - 1
// per-station brightness: quieter where the DOM carries dense text
const DIM = [2, 1, 1.25, 1, 0.85, 1.25, 1.1, 1.05]

/** Flowing ribbons of liquid light. They reform per section as the camera travels. */
export default function Ribbons({ count, lite, theme = 'dark' }) {
  const group = useRef()
  const ribbons = useMemo(() => {
    const r = mulberry32(11)
    const geo = new PlaneGeometry(1, 1, lite ? 160 : 360, lite ? 6 : 10)
    // PlaneGeometry uvs are what the shader uses; positions are ignored
    return Array.from({ length: count }, (_, i) => {
      const main = i < 2
      const material = createRibbonMaterial({
        seed: r(),
        idx: i,
        width: main ? 0.34 : 0.1 + r() * 0.16,
        thick: main ? 0.05 : 0.025,
        twist: Math.PI * 2 * (1 + Math.floor(r() * 3)),
        amber: main ? 0.85 : r() < 0.18 ? 1 : 0,
        intensity: main ? 1 : 0.5 + r() * 0.4,
        arc: randomArc(r),
        aspect: lite ? 0.7 : 1.3,
        aboutX: lite ? 0 : 4.6,
      })
      return { material, geo, delay: main ? 0.05 : r() * 0.35, base: material.uniforms.uIntensity.value }
    })
  }, [count, lite])

  // recolour for the active theme; light mode needs a bit more presence on a pale background
  useEffect(() => {
    const p = paletteFor(theme)
    for (const rb of ribbons) {
      const u = rb.material.uniforms
      u.uDeep.value.set(p.deep)
      u.uBlue.value.set(p.blue)
      u.uCyan.value.set(p.cyanLt)
      u.uAmber.value.set(p.amber)
    }
  }, [theme, ribbons])
  const themeBoost = theme === 'light' ? 1.3 : 1

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const { k, trans } = phase(lite ? 0 : world.u, LAST)
    const dim = lite ? 1.1 : DIM[k] + (DIM[Math.min(k + 1, LAST)] - DIM[k]) * trans
    for (const rb of ribbons) {
      const u = rb.material.uniforms
      u.uTime.value = t * 0.6
      u.uK.value = k
      u.uMorph.value = lite ? 0 : easeInOut(clamp((trans - rb.delay) / 0.65))
      // constant flow: tying it to scroll speed made the ribbons flicker while scrolling
      u.uFlow.value = 1
      u.uIntensity.value = rb.base * dim * themeBoost
    }
    if (lite && group.current) {
      // mobile: layered parallax — the orbit cluster turns and drifts with scroll
      group.current.rotation.set(scene.progress * 1.4, scene.progress * 2.2, scene.y * 0.0004)
      group.current.position.y = Math.sin(scene.progress * Math.PI * 4) * 1.2
    }
  })

  return (
    <group ref={group}>
      {ribbons.map((rb, i) => (
        <mesh key={i} geometry={rb.geo} material={rb.material} frustumCulled={false} renderOrder={i} />
      ))}
    </group>
  )
}
