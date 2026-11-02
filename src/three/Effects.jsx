import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { world } from './world'

/** Bloom turns the additive ribbons into liquid light; it swells slightly with scroll speed. */
export default function Effects() {
  const bloom = useRef()
  useFrame(() => {
    const v = Math.min(Math.abs(world.vel) / 50, 1)
    if (bloom.current) bloom.current.intensity = 0.65 + v * 0.15
  })
  return (
    <EffectComposer multisampling={4}>
      <Bloom ref={bloom} mipmapBlur intensity={0.5} luminanceThreshold={0.45} luminanceSmoothing={0.4} radius={0.7} />
      <Vignette offset={0.3} darkness={0.55} />
    </EffectComposer>
  )
}
