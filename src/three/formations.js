import { Vector3 } from 'three'

/** Station centers along the flight path — one per home section, plus the projects page. */
export const CENTERS = [
  new Vector3(0, 0, 0), // hero orbits
  new Vector3(0, 0, -34), // services streams
  new Vector3(0, 0, -78), // about vortex
  new Vector3(0, 0, -110), // work waves
  new Vector3(0, 0, -140), // voice ripples
  new Vector3(0, 0, -172), // start portal
  new Vector3(0, 0, -204), // contact horizon
  new Vector3(0, 0, -240), // projects page field
]

/** Camera key-frames: [hold start, hold end] per station. */
const v = (x, y, z) => new Vector3(x, y, z)
export const STATIONS = [
  { from: { pos: v(0, 0, 18), look: v(0, 0, -1) }, to: { pos: v(0, 0.4, 3), look: v(0, 0, -8) } },
  { from: { pos: v(0, 0, -12), look: v(0, 0, -30) }, to: { pos: v(0, 0, -36), look: v(0, 0, -56) } },
  { from: { pos: v(-1, 0.6, -64), look: v(1.6, 0, -78) }, to: { pos: v(-15, 6, -47), look: v(-11, 0, -78) } },
  { from: { pos: v(-11, 1, -96), look: v(-11, 0, -112) }, to: { pos: v(11, -1, -96), look: v(11, 0, -112) } },
  { from: { pos: v(0, 7, -126), look: v(0, 0, -140) }, to: { pos: v(0, 2.5, -129), look: v(0, 0, -140) } },
  { from: { pos: v(0, 0, -152), look: v(0, 0, -172) }, to: { pos: v(0, 0, -161), look: v(0, 0, -174) } },
  { from: { pos: v(0, 0, -188), look: v(0, -2, -204) }, to: { pos: v(0, -1, -190), look: v(0, -2, -204) } },
  { from: { pos: v(0, 1, -222), look: v(0, 0, -240) }, to: { pos: v(0, -3, -226), look: v(0, -2, -240) } },
]

/** Index of the station used by the projects page. */
export const PROJECTS_STATION = 7

// deterministic RNG
export function mulberry32(a) {
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
