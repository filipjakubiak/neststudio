import { WebGLRenderer, Scene, PerspectiveCamera, Vector2, Vector3, ACESFilmicToneMapping, MathUtils } from 'three';
import { ThreadField } from './ThreadField';
import { Titles } from './Titles';
import { Post } from './post';
import { getSceneBus, type SceneBus, type TitleAnchor } from './state';

export interface SceneOptions { threads: number; dpr: number; curveSegments?: number; samples?: number }

const FOV = 35;
const REST_Z = 10;

function hash1(n: number): number {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

/* Jedna scena na stronę: nici + litery "NEST STUDIO". Stan czyta z SceneBus co klatkę. */
export class NestScene {
  renderer: WebGLRenderer;
  scene = new Scene();
  camera: PerspectiveCamera;
  threads: ThreadField;
  titles: Titles;
  post: Post;
  bus: SceneBus;
  private resolution = new Vector2(1, 1);
  private smoothedPointer = new Vector3();
  private lightPos = new Vector3(0.4, 1.4, 3);
  private lightTarget = new Vector3();
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
    this.camera.position.set(0, 0, REST_Z);
    window.__nestScene = this;

    this.threads = new ThreadField(opts.threads, this.resolution, opts.dpr);
    this.scene.add(this.threads.mesh);
    this.titles = new Titles(opts.curveSegments ?? 12);
    this.scene.add(this.titles.group);
    this.post = new Post(this.renderer, this.scene, this.camera, window.innerWidth, window.innerHeight, opts.dpr, opts.samples ?? 4);

    this.resize();
  }

  resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.resolution.set(w * this.opts.dpr, h * this.opts.dpr);
    this.post.setSize(w, h, this.opts.dpr);
  }

  /* px ekranu -> świat na płaszczyźnie z=zPlane, dla kamery spoczynkowej (0, 0, 10). Litery i kotwice DOM
     liczone są względem tej kamery, więc podczas sekwencji kamera może się ruszać, a litery stoją w świecie. */
  screenToWorld(x: number, y: number, zPlane = 0): Vector3 {
    const w = window.innerWidth, h = window.innerHeight;
    const dist = REST_Z - zPlane;
    const halfH = Math.tan(MathUtils.degToRad(FOV / 2)) * dist;
    const halfW = halfH * (w / h);
    return new Vector3(((x / w) * 2 - 1) * halfW, (1 - (y / h) * 2) * halfH, zPlane);
  }

  worldUnitsPerPixel(zPlane = 0): number {
    const dist = REST_Z - zPlane;
    const halfH = Math.tan(MathUtils.degToRad(FOV / 2)) * dist;
    return (2 * halfH) / window.innerHeight;
  }

  /* Skala grupy liter dla kotwicy (jednostki świata na jednostkę cap). */
  titleScale(anchor: TitleAnchor): number {
    this.titles.setLayout(anchor.stacked);
    return (anchor.w * this.worldUnitsPerPixel(0)) / this.titles.layout.width;
  }

  /* Grupa liter w boksie kotwicy; recede cofa ją w głąb i przechyla (scroll przez hero). */
  private placeTitles(anchor: TitleAnchor, recede: number) {
    const g = this.titles.group;
    const wu = this.worldUnitsPerPixel(0);
    const tl = this.screenToWorld(anchor.x, anchor.y - window.scrollY, 0);
    const sc = this.titleScale(anchor);
    /* recede: litery odrywają się od boksu DOM (który odjeżdża ze scrollem), zostają w kadrze i cofają się w głąb */
    const ax = tl.x + (anchor.w * wu) / 2, ay = tl.y - (anchor.h * wu) / 2;
    g.position.set(ax, ay * (1 - recede) + 0.6 * recede, -6 * recede);
    g.scale.setScalar(sc);
    g.rotation.x = 0.4 * recede;
    this.titles.apply();
    g.visible = true;
  }

  /* Rozgrzewka przed sekwencją: shadery nici i liter kompilują się asynchronicznie (KHR_parallel_shader_compile,
     gdy sterownik wspiera), a materiały post-processingu w pierwszych klatkach pętli (ekspozycja 0, więc czarno).
     Dzięki temu czas sekwencji nie startuje w trakcie jednego długiego zadania kompilacji. */
  async warm(): Promise<void> {
    const anchor = this.bus.anchors.hero;
    if (!anchor) return;
    this.placeTitles(anchor, 0);
    if (this.renderer.extensions.has('KHR_parallel_shader_compile')) await this.renderer.compileAsync(this.scene, this.camera);
    else this.renderer.compile(this.scene, this.camera);
    await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
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

  resetFrameStats() {
    this.frames = 0;
    this.frameTimeSum = 0;
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
    u.uGlow.value = s.glow;
    (u.uNestOffset.value as Vector2).set(s.nestX, s.nestY);

    // wskaźnik (świat, z=0), wygładzony
    const p = this.bus.pointer;
    const target = this.screenToWorld(p.x, p.y, 0);
    this.smoothedPointer.lerp(target, 1 - Math.pow(0.001, dt));
    (u.uPointer.value as Vector3).set(this.smoothedPointer.x, this.smoothedPointer.y, p.active);

    // kamera
    this.camera.position.set(s.camX, s.camY, s.camZ);
    this.camera.rotation.z = s.camRoll;
    this.renderer.toneMappingExposure = s.exposure;

    // litery: kotwica w stopce (gdy widoczne tam) albo w hero
    const useFooter = s.titlesFooter > 0.001 && !!this.bus.anchors.footer;
    const anchor = useFooter ? this.bus.anchors.footer : this.bus.anchors.hero;
    const recede = useFooter ? 0 : s.titlesRecede;
    const fade = MathUtils.smoothstep(recede, 0, 0.7);
    const alpha = useFooter ? s.titlesFooter : s.titlesHero * (1 - fade);
    const g = this.titles.group;
    if (anchor && alpha > 0.004) {
      this.placeTitles(anchor, recede);
      const tu = this.titles.material.uniforms;
      tu.uOpacity.value = alpha;
      // światło: baza ze stanu + podążanie za wskaźnikiem albo powolne krążenie
      const follow = s.lightFollow;
      const active = p.active;
      this.lightTarget.set(
        s.lightX + (this.smoothedPointer.x - s.lightX) * follow * active + Math.sin(t * 0.5) * 0.9 * follow * (1 - active),
        s.lightY + (this.smoothedPointer.y - s.lightY) * follow * active + Math.cos(t * 0.37) * 0.5 * follow * (1 - active),
        s.lightZ,
      );
      this.lightPos.lerp(this.lightTarget, 1 - Math.pow(0.002, dt));
      (tu.uLight.value as Vector3).copy(this.lightPos);
      const flick = 1 - s.flicker * (0.35 * (0.5 + 0.5 * Math.sin(t * 31) * Math.sin(t * 11.3)) + 0.65 * hash1(Math.floor(t * 18)));
      tu.uIntensity.value = s.lightIntensity * flick * (1 + 0.06 * Math.sin(t * 0.9)) * (1 - 0.7 * recede);
      tu.uRim.value = s.rim;
      tu.uEdge.value = s.edge;
    } else {
      g.visible = false;
    }

    const usePost = g.visible || s.glow > 0.01;
    if (usePost) {
      this.post.bloom.strength = s.bloom;
      this.post.bloom.threshold = 0.9 - 0.55 * s.glow; // żar: także pojedyncze nici gniazda wchodzą w bloom
      const fu = this.post.film.uniforms;
      fu.uChroma.value = s.chroma;
      fu.uGrain.value = s.grain;
      fu.uVignette.value = s.vignette;
      fu.uTime.value = t;
      this.post.render(dt);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  dispose() {
    this.stop();
    this.threads.dispose();
    this.titles.dispose();
    this.post.dispose();
    this.renderer.dispose();
    if (window.__nestScene === this) window.__nestScene = undefined;
  }
}
