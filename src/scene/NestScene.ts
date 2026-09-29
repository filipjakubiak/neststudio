import { WebGLRenderer, Scene, PerspectiveCamera, Vector2, Vector3, ACESFilmicToneMapping, MathUtils } from 'three';
import { ThreadField } from './ThreadField';
import { getSceneBus, type SceneBus } from './state';

/* dropDetail: bez znaczenia od D15 (chrom to sekwencja klatek z Remotion, ChromeGuide); zostaje opcjonalne,
   żeby SceneCanvas (edytowany równolegle) kompilował się bez zmian. Do usunięcia przy scaleniu. */
export interface SceneOptions { threads: number; dpr: number; dropDetail?: number }

const FOV = 35;

/* Jedna scena na stronę: nici. Stan czyta z SceneBus co klatkę. Chrom nie jest już renderowany tutaj (D15). */
export class NestScene {
  renderer: WebGLRenderer;
  scene = new Scene();
  camera: PerspectiveCamera;
  threads: ThreadField;
  bus: SceneBus;
  private resolution = new Vector2(1, 1);
  private smoothedPointer = new Vector3();
  private frames = 0;
  private frameTimeSum = 0;
  private lastT = 0;
  private running = false;
  private tickFn = (t: number) => this.frame(t);
  private opts: SceneOptions;

  constructor(canvas: HTMLCanvasElement, opts: SceneOptions) {
    this.opts = opts;
    this.bus = getSceneBus();
    this.renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(opts.dpr);
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
    this.camera.position.set(0, 0, 10);

    (window as unknown as { __nestScene?: NestScene }).__nestScene = this;

    this.threads = new ThreadField(opts.threads, this.resolution, opts.dpr);
    this.scene.add(this.threads.mesh);

    this.resize();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.resolution.set(w * this.opts.dpr, h * this.opts.dpr);
  }

  /* px ekranu -> świat na płaszczyźnie z=zPlane */
  screenToWorld(x: number, y: number, zPlane = 0): Vector3 {
    const w = window.innerWidth, h = window.innerHeight;
    const dist = this.camera.position.z - zPlane;
    const halfH = Math.tan(MathUtils.degToRad(FOV / 2)) * dist;
    const halfW = halfH * (w / h);
    return new Vector3(((x / w) * 2 - 1) * halfW, (1 - (y / h) * 2) * halfH + this.camera.position.y, zPlane);
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastT = performance.now();
    import('@/lib/gsap').then(({ gsap }) => gsap.ticker.add(this.tickFn));
  }

  stop() {
    this.running = false;
    import('@/lib/gsap').then(({ gsap }) => gsap.ticker.remove(this.tickFn));
  }

  /* średni czas klatki po rozgrzewce (ms) albo null, gdy za mało próbek */
  averageFrameMs(): number | null {
    if (this.frames < 90) return null;
    return this.frameTimeSum / (this.frames - 30);
  }

  private frame(t: number) {
    if (!this.running) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - this.lastT) / 1000);
    this.lastT = now;
    this.frames++;
    if (this.frames > 30) this.frameTimeSum += dt * 1000;

    const s = this.bus.state;
    const u = this.threads.material.uniforms;
    u.uTime.value = t;
    u.uWeave.value = s.weave;
    u.uChaos.value = s.chaos;
    u.uSpeed.value = s.speed;
    u.uTunnel.value = s.tunnel;
    u.uInk.value = s.ink;
    u.uOpacity.value = s.opacity;
    (u.uNestOffset.value as Vector2).set(s.nestX, s.nestY);

    // wskaźnik (świat, z=0), wygładzony
    const p = this.bus.pointer;
    const target = this.screenToWorld(p.x, p.y, 0);
    this.smoothedPointer.lerp(target, 1 - Math.pow(0.001, dt));
    (u.uPointer.value as Vector3).set(this.smoothedPointer.x, this.smoothedPointer.y, p.active);

    // kamera
    this.camera.position.z = s.camZ;
    this.camera.position.y = s.camY;
    this.camera.rotation.z = s.camRoll;
    this.renderer.toneMappingExposure = s.exposure;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.threads.dispose();
    this.renderer.dispose();
  }
}
