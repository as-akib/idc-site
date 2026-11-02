import { useFrame, useThree } from '@react-three/fiber'
import { MathUtils, Vector3 } from 'three'
import { STATIONS } from './formations'
import { easeInOut, easeSine, phase, world } from './world'
import { scene } from '../lib/scroll'

const P = new Vector3()
const L = new Vector3()
const LAST = STATIONS.length - 1

/** Flies the camera through the crystal world, keyed to the scroll scene parameter. */
export function CameraRig() {
  const camera = useThree((s) => s.camera)
  useFrame((_, dt) => {
    const { k, hold, trans } = phase(world.u, LAST)
    const S = STATIONS[k]
    let bump = 0
    if (trans <= 0) {
      const e = easeSine(hold)
      P.lerpVectors(S.from.pos, S.to.pos, e)
      L.lerpVectors(S.from.look, S.to.look, e)
    } else {
      const N = STATIONS[Math.min(k + 1, LAST)].from
      const e = easeInOut(trans)
      P.lerpVectors(S.to.pos, N.pos, e)
      L.lerpVectors(S.to.look, N.look, e)
      bump = Math.sin(e * Math.PI)
      P.y += bump * 1.4
    }
    P.x += world.mouse.x * 0.8
    P.y += world.mouse.y * 0.5
    camera.position.copy(P)
    camera.lookAt(L)
    camera.rotateZ(bump * 0.14 * (k % 2 ? 1 : -1) + world.mouse.x * -0.02)
    const fov = 45 + bump * 16
    camera.fov = MathUtils.damp(camera.fov, fov, 4, dt)
    camera.updateProjectionMatrix()
    world.look.copy(L)
  })
  return null
}

/** Mobile / reduced-motion: a fixed camera with a gentle scroll drift (layered parallax lives in the shards). */
export function LiteRig() {
  const camera = useThree((s) => s.camera)
  useFrame(() => {
    camera.position.set(0, 0, 15)
    camera.lookAt(0, 0, 0)
    camera.rotateZ(scene.progress * 0.6)
  })
  return null
}
