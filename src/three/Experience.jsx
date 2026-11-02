import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import Driver from './Driver'
import { CameraRig, LiteRig } from './CameraRig'
import Ribbons from './Ribbons'
import Dust from './Dust'
import Effects from './Effects'
import { paletteFor } from './palette'
import { useTheme } from '../lib/theme'

export default function Experience({ lite }) {
  const [degraded, setDegraded] = useState(false)
  const theme = useTheme()
  return (
    <div className="webgl" aria-hidden="true">
      <Canvas
        dpr={lite || degraded ? [1, 1.25] : [1, 1.6]}
        gl={{ antialias: lite, alpha: false, powerPreference: 'high-performance', stencil: false }}
        camera={{ fov: 45, near: 0.1, far: 160, position: [0, 0, 18] }}
      >
        <color attach="background" args={[paletteFor(theme).bg]} key={theme} />
        <Driver />
        {!lite && <PerformanceMonitor onDecline={() => setDegraded(true)} />}
        <Suspense fallback={null}>
          {lite ? <LiteRig /> : <CameraRig />}
          <Ribbons count={lite ? 5 : 10} lite={lite} theme={theme} />
          <Dust count={lite ? 160 : degraded ? 500 : 900} lite={lite} theme={theme} />
          {/* bloom would wash out a light background */}
          {!lite && theme === 'dark' && <Effects />}
        </Suspense>
      </Canvas>
    </div>
  )
}
