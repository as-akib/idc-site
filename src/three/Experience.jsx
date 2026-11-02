import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import Driver from './Driver'
import { CameraRig, LiteRig } from './CameraRig'
import Ribbons from './Ribbons'
import Dust from './Dust'
import Effects from './Effects'
import { PALETTE } from './palette'

export default function Experience({ lite }) {
  const [degraded, setDegraded] = useState(false)
  return (
    <div className="webgl" aria-hidden="true">
      <Canvas
        dpr={lite || degraded ? [1, 1.25] : [1, 1.6]}
        gl={{ antialias: lite, alpha: false, powerPreference: 'high-performance', stencil: false }}
        camera={{ fov: 45, near: 0.1, far: 160, position: [0, 0, 18] }}
      >
        <color attach="background" args={[PALETTE.bg]} />
        <Driver />
        {!lite && <PerformanceMonitor onDecline={() => setDegraded(true)} />}
        <Suspense fallback={null}>
          {lite ? <LiteRig /> : <CameraRig />}
          <Ribbons count={lite ? 5 : 10} lite={lite} />
          <Dust count={lite ? 160 : degraded ? 500 : 900} lite={lite} />
          {!lite && <Effects />}
        </Suspense>
      </Canvas>
    </div>
  )
}
