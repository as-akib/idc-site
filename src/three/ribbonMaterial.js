import { DoubleSide, NormalBlending, ShaderMaterial, Vector3 } from 'three'
import { paletteGLSL, paletteUniforms } from './palette'
import { CENTERS } from './formations'

/**
 * Liquid-light ribbon. The whole curve lives in the vertex shader: uv.x walks along the ribbon,
 * uv.y walks around its flattened cross-section. Each section has its own analytic flow shape;
 * the ribbon morphs between shape uK and uK+1 by uMorph.
 */
const vertexShader = /* glsl */ `
  uniform float uTime; uniform float uK; uniform float uMorph; uniform float uSeed; uniform float uIdx;
  uniform float uWidth; uniform float uThick; uniform float uTwist; uniform float uAspect; uniform float uAboutX;
  uniform vec3 uArc; uniform vec3 uC[8];
  varying float vT; varying vec3 vN; varying vec3 vWorld; varying float vEdge;

  const float TAU = 6.2831853;
  vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
  vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
  vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }

  float closed(float k) { return (k < 0.5 || (k > 3.5 && k < 4.5)) ? 1.0 : 0.0; }

  vec3 shape(float k, float t) {
    float s = uSeed; float i = uIdx; vec3 p;
    if (k < 0.5) {
      // HERO — crossing orbits, an echo of the IDC logo mark
      bool hero = i < 2.0;
      float a = t * TAU + uTime * (hero ? 0.12 : 0.05 + s * 0.1) * (mod(i, 2.0) < 1.0 ? 1.0 : -1.0);
      float R = hero ? 6.4 : 3.8 + s * 7.5;
      float e = hero ? 0.4 : 0.3 + s * 0.45;
      p = vec3(cos(a) * R * uAspect, sin(a) * R * e, 0.0);
      p = rotZ(p, hero ? (i < 1.0 ? 0.42 : -0.42) : (s - 0.5) * 3.0);
      p = rotX(p, hero ? 0.22 : (s - 0.5) * 1.6);
      p.z -= hero ? 2.0 : 3.0 + s * 6.0;
    } else if (k < 1.5) {
      // SERVICES — light streams running down the flight path
      float ang = s * TAU + t * TAU * (0.6 + s);
      float R = 5.5 + 4.0 * fract(s * 7.31);
      p = vec3(cos(ang) * R * 1.25, sin(ang) * R * 0.75, 22.0 - t * 60.0);
    } else if (k < 2.5) {
      // ABOUT — a slow torus-knot vortex
      float a = t * TAU;
      float r = 3.0 + cos(3.0 * a + s * TAU) * 1.3;
      p = vec3(r * cos(2.0 * a), r * sin(2.0 * a), -sin(3.0 * a + s * TAU) * 1.6);
      p = rotX(p, 0.5 + s * 1.2);
      p = rotY(p, s * 3.0);
      p.x += uAboutX;
    } else if (k < 3.5) {
      // WORK — silk waves running with the horizontal gallery
      float x = -34.0 + t * 68.0;
      p = vec3(x, sin(x * 0.17 + s * TAU + uTime * 0.25) * 2.2 + (s - 0.5) * 8.0, -8.0 + cos(x * 0.11 + s * 5.0) * 3.0);
    } else if (k < 4.5) {
      // VOICE — concentric ripples, like sound
      float a = t * TAU + uTime * 0.04 * (mod(i, 2.0) < 1.0 ? 1.0 : -1.0);
      float R = 2.4 + i * 1.05;
      p = vec3(cos(a) * R, sin(a * 3.0 + s * 6.0 + uTime * 0.4) * 0.35, sin(a) * R);
      p = rotX(p, 0.42);
    } else if (k < 5.5) {
      // START — a vortex funnel: the portal
      float a = t * TAU * 2.2 + s * TAU + uTime * 0.35;
      float R = mix(12.0, 0.9, pow(t, 0.8));
      p = vec3(cos(a) * R, sin(a) * R, 4.0 - t * 12.0);
    } else if (k < 6.5) {
      // CONTACT — calm horizon lines
      float x = -42.0 + t * 84.0;
      p = vec3(x, -5.0 + sin(x * 0.1 + s * TAU + uTime * 0.2) * 1.4 + i * 0.4, -8.0 - i * 1.3);
    } else {
      // PROJECTS PAGE — a wide drifting silk field
      float x = -38.0 + t * 76.0;
      p = vec3(x, (s - 0.5) * 18.0 + sin(x * 0.13 + s * TAU + uTime * 0.2) * 2.6, -10.0 + cos(x * 0.09 + s * 4.0) * 6.0);
    }
    return p + uC[int(k + 0.5)];
  }

  vec3 curve(float t) {
    vec3 a = shape(uK, t);
    vec3 b = shape(min(uK + 1.0, 7.0), t);
    vec3 p = mix(a, b, uMorph) + uArc * sin(uMorph * 3.14159);
    p += vec3(sin(t * 11.0 + uTime * 0.7 + uSeed * 7.0), cos(t * 9.0 - uTime * 0.55 + uSeed * 3.0), sin(t * 7.0 + uTime * 0.4)) * 0.22;
    return p;
  }

  void main() {
    float t = uv.x;
    float ang = uv.y * TAU;
    vec3 p = curve(t);
    vec3 T = normalize(curve(t + 0.002) - curve(max(t - 0.002, 0.0)) + 1e-5);
    vec3 up = abs(T.y) > 0.92 ? vec3(1.0, 0.0, 0.0) : vec3(0.0, 1.0, 0.0);
    vec3 N = normalize(cross(T, up));
    vec3 B = cross(T, N);
    float tw = t * uTwist + uTime * 0.25 + uSeed * 6.0;
    vec3 n1 = N * cos(tw) + B * sin(tw);
    vec3 b1 = -N * sin(tw) + B * cos(tw);

    float cl = mix(closed(uK), closed(min(uK + 1.0, 7.0)), uMorph);
    float taper = mix(smoothstep(0.0, 0.08, t) * smoothstep(1.0, 0.92, t), 1.0, cl);
    float w = uWidth * taper * (0.7 + 0.3 * sin(t * 18.0 + uTime * 0.9 + uSeed * 10.0));
    float th = uThick * taper;
    vec3 pos = p + n1 * cos(ang) * w + b1 * sin(ang) * th;

    vN = normalize(n1 * cos(ang) * th + b1 * sin(ang) * w + 1e-5);
    vT = t;
    vEdge = taper;
    vec4 wp = modelMatrix * vec4(pos, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime; uniform float uSeed; uniform float uAmberMix; uniform float uIntensity; uniform float uFlow;
  varying float vT; varying vec3 vN; varying vec3 vWorld; varying float vEdge;
  ${paletteGLSL}
  void main() {
    vec3 V = normalize(cameraPosition - vWorld);
    float fres = pow(1.0 - abs(dot(normalize(vN), V)), 2.0);
    // soft satin: colour stays inside the logo's blue range, never pushed to white
    vec3 col = flowCol(vT * 1.4 + uSeed * 2.0 + uTime * 0.02) * (0.72 + fres * 0.5);
    // slow, gentle packets of light travelling along the ribbon
    float ph = fract(vT * 1.5 - uTime * 0.05 * uFlow + uSeed);
    float pulse = pow(smoothstep(0.0, 0.5, ph) * smoothstep(1.0, 0.5, ph), 6.0);
    col = mix(col, mix(uCyan, uAmber, uAmberMix), pulse * 0.2);
    float d = distance(cameraPosition, vWorld);
    float fade = smoothstep(1.5, 5.0, d) * (1.0 - smoothstep(40.0, 70.0, d));
    float alpha = (0.18 + fres * 0.32 + pulse * 0.12) * uIntensity * fade * (0.4 + 0.6 * vEdge);
    gl_FragColor = vec4(col, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`

export function createRibbonMaterial({ seed, idx, width, thick, twist, amber, intensity, arc, aspect, aboutX }) {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: NormalBlending,
    side: DoubleSide,
    uniforms: {
      uTime: { value: 0 },
      uK: { value: 0 },
      uMorph: { value: 0 },
      uSeed: { value: seed },
      uIdx: { value: idx },
      uWidth: { value: width },
      uThick: { value: thick },
      uTwist: { value: twist },
      uAspect: { value: aspect },
      uAboutX: { value: aboutX },
      uArc: { value: arc },
      uC: { value: CENTERS.map((c) => c.clone()) },
      uAmberMix: { value: amber },
      uIntensity: { value: intensity },
      uFlow: { value: 1 },
      ...paletteUniforms(),
    },
  })
}

export const randomArc = (r) => new Vector3(r() - 0.5, r() - 0.5, r() - 0.5).normalize().multiplyScalar(2 + r() * 5)
