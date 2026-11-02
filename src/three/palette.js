import { Color } from 'three'

/** Sampled from the IDC logo (light-logo-1.png): #00489C → #186CB4 → #009CC0 → #54CCD8, plus one warm accent. */
export const PALETTE = {
  bg: '#070C15',
  deep: '#0B4FA0',
  blue: '#1C77BE',
  cyan: '#12A9CC',
  cyanLt: '#5ED3DF',
  amber: '#F2BE77',
}

/** Light theme: the same logo blues on a cool paper background; amber deepened to read on white. */
export const PALETTE_LIGHT = {
  bg: '#F2F5FA',
  deep: '#0B4FA0',
  blue: '#1C77BE',
  cyan: '#12A9CC',
  cyanLt: '#12A9CC',
  amber: '#D08A2E',
}

export const paletteFor = (theme) => (theme === 'light' ? PALETTE_LIGHT : PALETTE)

export const paletteUniforms = () => ({
  uDeep: { value: new Color(PALETTE.deep) },
  uBlue: { value: new Color(PALETTE.blue) },
  uCyan: { value: new Color(PALETTE.cyanLt) },
  uAmber: { value: new Color(PALETTE.amber) },
})

// GLSL: deep blue -> logo blue -> light cyan, ping-pong (no hue cycling)
export const paletteGLSL = /* glsl */ `
  uniform vec3 uDeep; uniform vec3 uBlue; uniform vec3 uCyan; uniform vec3 uAmber;
  vec3 flowCol(float t) {
    t = abs(fract(t * 0.5) * 2.0 - 1.0);
    vec3 c = mix(uDeep, uBlue, smoothstep(0.0, 0.5, t));
    return mix(c, uCyan, smoothstep(0.5, 1.0, t));
  }
`
