import { Vector2, WebGLRenderTarget, HalfFloatType, type WebGLRenderer, type Scene, type Camera } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

/* Post-processing "taśmy": bloom (pół rozdzielczości), aberracja radialna, ziarno, winieta, na końcu
   tone mapping i sRGB (OutputPass). Alfa zachowana, bo canvas leży nad tłem strony. */

const FilmShader = {
  uniforms: {
    tDiffuse: { value: null },
    uChroma: { value: 0.003 },
    uGrain: { value: 0.035 },
    uVignette: { value: 0 },
    uTime: { value: 0 },
  },
  vertexShader: /* glsl */ `
varying vec2 vUv;
void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`,
  fragmentShader: /* glsl */ `
uniform sampler2D tDiffuse;
uniform float uChroma, uGrain, uVignette, uTime;
varying vec2 vUv;
float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
void main() {
  vec2 d = vUv - 0.5;
  vec2 off = d * uChroma;
  vec4 c = texture2D(tDiffuse, vUv);
  float r = texture2D(tDiffuse, vUv + off).r;
  float b = texture2D(tDiffuse, vUv - off).b;
  vec3 col = vec3(r, c.g, b);
  float a = c.a;
  float n = hash(gl_FragCoord.xy + fract(uTime * 0.37) * 977.0) - 0.5;
  col += n * uGrain * a;
  float v = 1.0 - uVignette * smoothstep(0.3, 0.95, length(d) * 1.35);
  gl_FragColor = vec4(col * v, a);
}
`,
};

export class Post {
  composer: EffectComposer;
  bloom: UnrealBloomPass;
  film: ShaderPass;

  constructor(renderer: WebGLRenderer, scene: Scene, camera: Camera, width: number, height: number, dpr: number, samples: number) {
    const target = new WebGLRenderTarget(Math.round(width * dpr), Math.round(height * dpr), { type: HalfFloatType, samples });
    this.composer = new EffectComposer(renderer, target);
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(width, height);
    this.composer.addPass(new RenderPass(scene, camera));
    this.bloom = new UnrealBloomPass(new Vector2(width * dpr, height * dpr), 0.7, 0.35, 0.9);
    this.composer.addPass(this.bloom);
    this.film = new ShaderPass(FilmShader);
    this.composer.addPass(this.film);
    this.composer.addPass(new OutputPass());
  }

  setSize(width: number, height: number, dpr: number) {
    this.composer.setPixelRatio(dpr);
    this.composer.setSize(width, height);
  }

  render(delta: number) {
    this.composer.render(delta);
  }

  dispose() {
    this.composer.dispose();
  }
}
