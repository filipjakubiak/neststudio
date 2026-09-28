import * as THREE from 'three';
import { ThreadField } from './ThreadField';
import { ChromeDrop } from './ChromeDrop';
import { getSceneBus, type SceneBus } from './state';

export interface SceneOptions { threads: number; dpr: number }

const FOV = 35;

/* Proceduralna mapa środowiska: ciemne studio z jasnymi pasami światła, żeby chrom miał kontrastowe odbicia. */
function makeChromeEnvironment(): THREE.Texture {
  const w = 1024, h = 512;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d')!;
  const base = ctx.createLinearGradient(0, 0, 0, h);
  base.addColorStop(0, '#d9d9dc');
  base.addColorStop(0.42, '#6a6a70');
  base.addColorStop(0.6, '#1c1c1f');
  base.addColorStop(1, '#0a0a0b');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, w, h);
  const band = (y: number, height: number, alpha: number) => {
    const g = ctx.createLinearGradient(0, y - height / 2, 0, y + height / 2);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, y - height / 2, w, height);
  };
  band(70, 110, 1);
  band(160, 30, 0.95);
  band(215, 12, 0.7);
  band(275, 46, 0.5);
  band(345, 16, 0.85);
  band(420, 70, 0.3);
  band(480, 22, 0.55);
  // ciemne przerwy skośne, żeby odbicia miały rytm
  ctx.globalCompositeOperation = 'multiply';
  for (let i = 0; i < 6; i++) {
    const x = (i / 6) * w + 40;
    const g = ctx.createLinearGradient(x, 0, x + 120, 0);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.5, 'rgba(40,40,44,1)');
    g.addColorStop(1, 'rgba(255,255,255,1)');
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, 120, h);
  }
  ctx.globalCompositeOperation = 'source-over';
  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* Jedna scena na stronę: nici + kropla. Stan czyta z SceneBus co klatkę. */
export class NestScene {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera: THREE.PerspectiveCamera;
  threads: ThreadField;
  drop: ChromeDrop;
  bus: SceneBus;
  private resolution = new THREE.Vector2(1, 1);
  private pmrem: THREE.PMREMGenerator;
  private envTexture: THREE.Texture;
  private smoothedPointer = new THREE.Vector3();
  private dropPos = new THREE.Vector3();
  private frames = 0;
  private frameTimeSum = 0;
  private lastT = 0;
  private running = false;
  private tickFn = (t: number) => this.frame(t);
  private opts: SceneOptions;

  constructor(canvas: HTMLCanvasElement, opts: SceneOptions) {
    this.opts = opts;
    this.bus = getSceneBus();
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(opts.dpr);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1;
    this.camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
    this.camera.position.set(0, 0, 10);

    this.pmrem = new THREE.PMREMGenerator(this.renderer);
    const equirect = makeChromeEnvironment();
    this.envTexture = this.pmrem.fromEquirectangular(equirect).texture;
    equirect.dispose();
    this.scene.environment = this.envTexture;
    (window as unknown as { __nestScene?: NestScene }).__nestScene = this;

    this.threads = new ThreadField(opts.threads, this.resolution, opts.dpr);
    this.scene.add(this.threads.mesh);
    this.drop = new ChromeDrop();
    this.scene.add(this.drop.mesh);

    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(3, 4, 6);
    this.scene.add(key);

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
  screenToWorld(x: number, y: number, zPlane = 0): THREE.Vector3 {
    const w = window.innerWidth, h = window.innerHeight;
    const dist = this.camera.position.z - zPlane;
    const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * dist;
    const halfW = halfH * (w / h);
    return new THREE.Vector3(((x / w) * 2 - 1) * halfW, (1 - (y / h) * 2) * halfH + this.camera.position.y, zPlane);
  }

  worldUnitsPerPixel(zPlane = 0): number {
    const dist = this.camera.position.z - zPlane;
    const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * dist;
    return (2 * halfH) / window.innerHeight;
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

    // wskaźnik (świat, z=0), wygładzony
    const p = this.bus.pointer;
    const target = this.screenToWorld(p.x, p.y, 0);
    this.smoothedPointer.lerp(target, 1 - Math.pow(0.001, dt));
    (u.uPointer.value as THREE.Vector3).set(this.smoothedPointer.x, this.smoothedPointer.y, p.active);

    // kamera
    this.camera.position.z = s.camZ;
    this.camera.position.y = s.camY;
    this.camera.rotation.z = s.camRoll;
    this.renderer.toneMappingExposure = s.exposure;

    // kropla: slot w hero (px dokumentu) albo pozycja ze stanu
    const anchor = this.bus.anchors.heroSlot;
    let ax = s.dropX, ay = s.dropY, az = s.dropZ, ar = s.dropScale;
    if (anchor && s.dropDetach < 1) {
      const sw = this.screenToWorld(anchor.x, anchor.y - window.scrollY, 0);
      const r = anchor.r * this.worldUnitsPerPixel(0);
      const k = s.dropDetach;
      ax = sw.x * (1 - k) + s.dropX * k;
      ay = sw.y * (1 - k) + s.dropY * k;
      az = 0 * (1 - k) + s.dropZ * k;
      ar = r * (1 - k) + s.dropScale * k;
    }
    // lekkie podążanie za wskaźnikiem w hero
    const follow = (1 - s.dropDetach) * p.active * 0.12;
    this.dropPos.set(ax + (this.smoothedPointer.x - ax) * follow, ay + (this.smoothedPointer.y - ay) * follow, az);
    this.drop.mesh.position.copy(this.dropPos);
    this.drop.mesh.scale.setScalar(Math.max(0.0001, ar));
    this.drop.mesh.visible = s.dropVisible > 0.01 && ar > 0.001;
    this.drop.material.opacity = s.dropVisible;
    this.drop.update(t, s.dropAmp);

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.stop();
    this.threads.dispose();
    this.drop.dispose();
    this.envTexture.dispose();
    this.pmrem.dispose();
    this.renderer.dispose();
  }
}
