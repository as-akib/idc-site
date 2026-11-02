import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'

/** Steady bloom turns the ribbons into soft liquid light (dark theme only). */
export default function Effects() {
  return (
    <EffectComposer multisampling={4}>
      <Bloom mipmapBlur intensity={0.65} luminanceThreshold={0.45} luminanceSmoothing={0.4} radius={0.7} />
      <Vignette offset={0.3} darkness={0.55} />
    </EffectComposer>
  )
}
