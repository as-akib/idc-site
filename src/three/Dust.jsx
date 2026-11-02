import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, ShaderMaterial } from 'three'
import { paletteGLSL, paletteUniforms } from './palette'
import { scene } from '../lib/scroll'

/** Fine iridescent dust spread along the whole flight path — sells depth and speed. */
export default function Dust({ count, lite }) {
  const geometry = useMemo(() => {
    const p = []
    const s = []
    for (let i = 0; i < count; i++) {
      p.push((Math.random() - 0.5) * 60, (Math.random() - 0.5) * 36, lite ? -Math.random() * 30 : 25 - Math.random() * 285)
      s.push(Math.random())
    }
    const g = new BufferGeometry()
    g.setAttribute('position', new Float32BufferAttribute(p, 3))
    g.setAttribute('aSeed', new Float32BufferAttribute(s, 1))
    return g
  }, [count, lite])

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uTime: { value: 0 }, uOffset: { value: 0 }, uPR: { value: Math.min(devicePixelRatio, 2) }, ...paletteUniforms() },
        vertexShader: /* glsl */ `
          attribute float aSeed; uniform float uTime; uniform float uOffset; uniform float uPR;
          varying float vSeed; varying float vA;
          void main() {
            vec3 p = position;
            p.y = mod(p.y + uOffset * (0.4 + aSeed) + 18.0, 36.0) - 18.0;
            p.x += sin(uTime * 0.2 + aSeed * 40.0) * 0.4;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (2.0 + aSeed * 5.0) * uPR * (12.0 / -mv.z);
            vSeed = aSeed;
            vA = (0.35 + 0.65 * sin(uTime * (0.6 + aSeed) + aSeed * 30.0) * 0.5 + 0.5) * smoothstep(70.0, 10.0, -mv.z) * smoothstep(0.5, 3.0, -mv.z);
          }
        `,
        fragmentShader: /* glsl */ `
          varying float vSeed; varying float vA; uniform float uTime;
          ${paletteGLSL}
          void main() {
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            vec3 c = vSeed > 0.94 ? uAmber : flowCol(vSeed * 3.0 + uTime * 0.02);
            gl_FragColor = vec4(mix(c, vec3(0.92, 0.96, 1.0), 0.3) * a * vA * 0.3, 1.0);
          }
        `,
      }),
    []
  )

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
    material.uniforms.uOffset.value = lite ? scene.y * 0.01 : 0
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}
