import { ref, type Ref } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * useGaltonBoard — a small three.js engine that renders an interactive Galton
 * board (quincunx). Balls drop from the top, hop through a triangular lattice
 * of pegs, and pile up into the bins at the bottom, tracing out a binomial /
 * bell-shaped distribution.
 *
 * Design: the motion is SCRIPTED, not physically simulated. Each ball makes
 * `rows` fair left/right choices (a Bernoulli(0.5) random walk); the number of
 * "rights" picks its destination bin, so the histogram of bins IS the binomial
 * by construction. The ball is then tweened peg-to-peg along that path with a
 * little bounce arc and dropped onto the pile in its bin.
 *
 * Why no physics engine: a real rigid-body solver (we previously used cannon-es)
 * forced into a 2D plane is fragile — balls jam in the lattice, tunnel through
 * thin walls, and drift off-plane. None of that adds anything a viewer can
 * perceive over the scripted version, which is deterministic, jam-free, and far
 * lighter. The bell is exact, every time.
 */
export interface GaltonBoardOptions {
  /** Number of peg rows (bins = rows + 1). Default 8. */
  rows?: number;
  /** Hard cap on simultaneous balls. Default 120. */
  maxBalls?: number;
  /** Balls released per "Release balls" press, staggered. Default 60. */
  ballsPerDrop?: number;
}

export interface GaltonBoardApi {
  setup: () => void;
  dispose: () => void;
  dropBalls: () => void;
  reset: () => void;
  setPaused: (paused: boolean) => void;
  isReady: Ref<boolean>;
  /** True once the board has reached `maxBalls` — reset to drop more. */
  isFull: Ref<boolean>;
  animationFrameId: Ref<number | null>;
}

const COL_GAP = 1; // centre-to-centre distance between pegs in a row
const ROW_GAP = 0.9; // vertical distance between rows
const HEX_R = 0.34; // peg hexagon circumradius (visual only)
const BALL_R = 0.13; // ball radius
const BIN_HEIGHT = 5;
const DROP_HEIGHT = 2; // entry point height above the apex peg

// Tween timing (seconds per segment) and the height of the little bounce arc
// the ball traces as it hops from one peg to the next.
const HOP_DUR = 0.1;
const DROP_DUR = 0.16;
const HOP_ARC = 0.18;

const SPAWN_INTERVAL_MS = 45; // stagger releases so balls cascade, not clump

const DIVIDER_HX = 0.06; // bin divider half-thickness
const WALL_HX = 0.12; // outer wall half-thickness

// Camera padding around the board (world units).
const PAD_X = 0.6;
const PAD_TOP = 1;
const PAD_BOTTOM = 0.5;

// Colours tuned for the light lavender DaisyUI theme.
const COLOR_PEG = 0x7c3aed; // violet
const COLOR_BALL = 0xd4af37; // brand gold (matches the coin)
const COLOR_STRUCTURE = 0xb39ddb; // soft purple for dividers / floor

// Debug aid: when true, mount OrbitControls so the (flat-on) camera can be
// rotated/zoomed to inspect the scene, and keep the render loop always-on so
// dragging stays smooth. Off for production — this is a 2D demo.
const DEBUG_3D = false;

interface Waypoint {
  x: number;
  y: number;
}

interface Ball {
  mesh: THREE.Mesh;
  wp: Waypoint[];
  seg: number; // current path segment index
  t: number; // [0,1) progress within the current segment
  durScale: number; // per-ball speed variation
  done: boolean;
}

export function useGaltonBoard(
  canvasRef: Ref<HTMLCanvasElement | null>,
  isDropping: Ref<boolean>,
  options: GaltonBoardOptions = {},
): GaltonBoardApi {
  const animationFrameId = ref<number | null>(null);
  const isReady = ref(false);
  const isFull = ref(false);

  if (typeof window === 'undefined') {
    return {
      setup: () => {},
      dispose: () => {},
      dropBalls: () => {},
      reset: () => {},
      setPaused: () => {},
      isReady,
      isFull,
      animationFrameId,
    };
  }

  const rows = options.rows ?? 8;
  const maxBalls = options.maxBalls ?? 120;
  const ballsPerDrop = options.ballsPerDrop ?? 60;

  let scene: THREE.Scene;
  let camera: THREE.OrthographicCamera;
  let renderer: THREE.WebGLRenderer;
  let controls: OrbitControls | null = null;
  let resizeObserver: ResizeObserver | null = null;
  let spawnTimer: ReturnType<typeof setInterval> | null = null;
  let paused = false;
  let lastTime = 0;

  // Tracked for disposal.
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const balls: Ball[] = [];
  let sharedBallGeo: THREE.SphereGeometry | null = null;
  let sharedBallMat: THREE.MeshStandardMaterial | null = null;

  // How many balls have landed in each bin → drives the stacking height.
  const binCounts: number[] = new Array(rows + 1).fill(0);

  // World bounds, used to fit the orthographic frustum on resize.
  let worldLeft = 0;
  let worldRight = 0;
  let worldTop = 0;
  let worldBottom = 0;

  // Vertical layout (peg block centred on y ≈ 0).
  const pegTopY = ((rows - 1) * ROW_GAP) / 2;
  const pegY = (r: number) => pegTopY - r * ROW_GAP;
  const bottomPegY = pegY(rows - 1);
  const entryY = pegTopY + DROP_HEIGHT;
  const binTopY = bottomPegY - 0.7;
  const floorY = binTopY - BIN_HEIGHT;

  // Horizontal layout. Bin k (0..rows) is centred half a column off the
  // bottom-row pegs, so balls fall through the peg gaps straight into a bin.
  const halfWidth = (rows / 2 + 0.5) * COL_GAP;
  const binCenterX = (k: number) => (k - rows / 2) * COL_GAP;
  const binInnerWidth = COL_GAP - 2 * DIVIDER_HX - 0.04;
  const columnsPerBin = Math.max(1, Math.floor(binInnerWidth / (BALL_R * 2)));

  const getSize = () => {
    const el = canvasRef.value;
    if (el && el.clientWidth > 0 && el.clientHeight > 0) {
      return { width: el.clientWidth, height: el.clientHeight };
    }
    return { width: 600, height: 450 };
  };

  const fitCamera = (width: number, height: number) => {
    const aspect = width / height;
    const cx = (worldLeft + worldRight) / 2;
    const cy = (worldTop + worldBottom) / 2;
    const contentW = worldRight - worldLeft;
    const contentH = worldTop - worldBottom;
    let halfW: number;
    let halfH: number;
    if (contentW / contentH > aspect) {
      halfW = contentW / 2;
      halfH = halfW / aspect;
    } else {
      halfH = contentH / 2;
      halfW = halfH * aspect;
    }
    camera.left = cx - halfW;
    camera.right = cx + halfW;
    camera.top = cy + halfH;
    camera.bottom = cy - halfH;
    camera.updateProjectionMatrix();
  };

  const applySize = () => {
    if (!renderer || !camera) return;
    const { width, height } = getSize();
    fitCamera(width, height);
    renderer.setSize(width, height, false);
  };

  const initScene = () => {
    const { width, height } = getSize();

    scene = new THREE.Scene();

    worldLeft = -halfWidth - PAD_X;
    worldRight = halfWidth + PAD_X;
    worldTop = entryY + PAD_TOP;
    worldBottom = floorY - PAD_BOTTOM;

    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 100);
    camera.position.set(0, 0, 20);
    camera.lookAt(0, 0, 0);
    fitCamera(width, height);

    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value!,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.AmbientLight(0xffffff, 0.9));
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 6, 8);
    scene.add(dir);

    if (DEBUG_3D) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, (worldTop + worldBottom) / 2, 0);
      controls.enableDamping = true;
      controls.dampingFactor = 0.1;
      controls.update();
      controls.addEventListener('change', () => renderer.render(scene, camera));
    }
  };

  const addBox = (
    x: number,
    y: number,
    hx: number,
    hy: number,
    color: number,
  ) => {
    const geo = new THREE.BoxGeometry(hx * 2, hy * 2, 0.4);
    geometries.push(geo);
    const mat = new THREE.MeshStandardMaterial({ color });
    materials.push(mat);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, 0);
    scene.add(mesh);
  };

  const buildPegs = () => {
    // Filled hexagon (pointy-top) in the x-y plane, shared across all pegs.
    const pegGeo = new THREE.CircleGeometry(HEX_R, 6);
    pegGeo.rotateZ(Math.PI / 6);
    geometries.push(pegGeo);
    const pegMat = new THREE.MeshStandardMaterial({
      color: COLOR_PEG,
      roughness: 0.5,
      metalness: 0.1,
    });
    materials.push(pegMat);

    for (let r = 0; r < rows; r++) {
      const count = r + 1;
      const y = pegY(r);
      const xStart = -((count - 1) * COL_GAP) / 2;
      for (let c = 0; c < count; c++) {
        const mesh = new THREE.Mesh(pegGeo, pegMat);
        mesh.position.set(xStart + c * COL_GAP, y, 0);
        scene.add(mesh);
      }
    }
  };

  const buildBins = () => {
    const binCenterY = binTopY - BIN_HEIGHT / 2;
    // Dividers aligned under each bottom-row peg.
    for (let i = 0; i < rows; i++) {
      const x = (i - (rows - 1) / 2) * COL_GAP;
      addBox(x, binCenterY, DIVIDER_HX, BIN_HEIGHT / 2, COLOR_STRUCTURE);
    }
    // Outer side walls + floor.
    addBox(-halfWidth, binCenterY, WALL_HX, BIN_HEIGHT / 2, COLOR_STRUCTURE);
    addBox(halfWidth, binCenterY, WALL_HX, BIN_HEIGHT / 2, COLOR_STRUCTURE);
    addBox(0, floorY, halfWidth + WALL_HX, 0.15, COLOR_STRUCTURE);
  };

  const initBallAssets = () => {
    sharedBallGeo = new THREE.SphereGeometry(BALL_R, 16, 16);
    geometries.push(sharedBallGeo);
    sharedBallMat = new THREE.MeshStandardMaterial({
      color: COLOR_BALL,
      roughness: 0.35,
      metalness: 0.4,
    });
    materials.push(sharedBallMat);
  };

  // Build a ball's full path: enter above the apex, hop peg-to-peg making a
  // fair left/right choice at each row, then drop onto the pile in its bin.
  const buildBallPath = (): Waypoint[] => {
    const wp: Waypoint[] = [{ x: 0, y: entryY }];
    let slot = 0; // horizontal position in column units; pegs sit on half-steps
    for (let r = 0; r < rows; r++) {
      // Sit the ball on TOP of the hexagon (peg top vertex is at pegY + HEX_R),
      // not inside it, so the hop reads as a bounce off the peg, not a clip.
      wp.push({ x: slot * COL_GAP, y: pegY(r) + HEX_R + BALL_R });
      slot += Math.random() < 0.5 ? -0.5 : 0.5; // fair coin → left / right
    }
    const k = Math.round(slot + rows / 2); // destination bin index
    wp.push({ x: binCenterX(k), y: binTopY }); // funnel into the bin mouth

    // Resting place in the pile: fill the bin in rows of `columnsPerBin`.
    const idx = binCounts[k]!++;
    const col = idx % columnsPerBin;
    const level = Math.floor(idx / columnsPerBin);
    const d = BALL_R * 2;
    const restX =
      binCenterX(k) -
      binInnerWidth / 2 +
      (col + 0.5) * (binInnerWidth / columnsPerBin);
    const restY = Math.min(
      floorY + 0.15 + BALL_R + level * d,
      binTopY - BALL_R,
    );
    wp.push({ x: restX, y: restY });
    return wp;
  };

  const spawnOne = () => {
    if (balls.length >= maxBalls || !sharedBallGeo || !sharedBallMat) return;
    const mesh = new THREE.Mesh(sharedBallGeo, sharedBallMat);
    mesh.position.set(0, entryY, 0);
    scene.add(mesh);
    balls.push({
      mesh,
      wp: buildBallPath(),
      seg: 0,
      t: 0,
      durScale: 0.85 + Math.random() * 0.3,
      done: false,
    });
  };

  const dropBalls = () => {
    if (!isReady.value || isDropping.value) return;
    if (balls.length >= maxBalls) return;
    isDropping.value = true;
    let dropped = 0;
    spawnTimer = setInterval(() => {
      if (dropped >= ballsPerDrop || balls.length >= maxBalls) {
        if (spawnTimer) clearInterval(spawnTimer);
        spawnTimer = null;
        return;
      }
      spawnOne();
      dropped++;
      if (balls.length >= maxBalls) isFull.value = true;
    }, SPAWN_INTERVAL_MS);
    kick();
  };

  const reset = () => {
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
    for (const b of balls) scene.remove(b.mesh);
    balls.length = 0;
    binCounts.fill(0);
    isDropping.value = false;
    isFull.value = false;
    kick();
  };

  // Advance one ball along its scripted path; returns false once it has landed.
  const stepBall = (b: Ball, dt: number): boolean => {
    const numSegs = b.wp.length - 1;
    const isDropSeg = (seg: number) => seg === 0 || seg >= rows;
    b.t += dt / ((isDropSeg(b.seg) ? DROP_DUR : HOP_DUR) * b.durScale);
    while (b.t >= 1) {
      b.t -= 1;
      b.seg++;
      if (b.seg >= numSegs) {
        const last = b.wp[numSegs]!;
        b.mesh.position.set(last.x, last.y, 0);
        b.done = true;
        return false;
      }
    }
    const a = b.wp[b.seg]!;
    const c = b.wp[b.seg + 1]!;
    const isHop = b.seg >= 1 && b.seg < rows;
    let x: number;
    let y: number;
    if (isHop) {
      // Linear x, with an upward arc → reads as a bounce off the peg.
      x = a.x + (c.x - a.x) * b.t;
      y = a.y + (c.y - a.y) * b.t + HOP_ARC * Math.sin(Math.PI * b.t);
    } else {
      // Drop segments (entry + into the bin): ease-in for a falling feel.
      const u = b.t * b.t;
      x = a.x + (c.x - a.x) * u;
      y = a.y + (c.y - a.y) * u;
    }
    b.mesh.position.set(x, y, 0);
    return true;
  };

  const animate = () => {
    if (paused) {
      animationFrameId.value = null;
      return;
    }

    const now = performance.now();
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60;
    lastTime = now;

    let anyActive = false;
    for (const b of balls) {
      if (b.done) continue;
      if (stepBall(b, dt)) anyActive = true;
    }

    const finishedSpawning = spawnTimer === null;
    if (
      isDropping.value &&
      finishedSpawning &&
      !anyActive &&
      balls.length > 0
    ) {
      isDropping.value = false;
    }

    controls?.update();
    renderer.render(scene, camera);

    // Idle when nothing is animating and nothing is queued (last frame stays on
    // screen). In DEBUG_3D the loop never idles so OrbitControls stays smooth.
    const idle = !DEBUG_3D && finishedSpawning && !anyActive;
    animationFrameId.value = idle ? null : requestAnimationFrame(animate);
  };

  const kick = () => {
    if (!paused && isReady.value && animationFrameId.value === null) {
      lastTime = 0;
      animate();
    }
  };

  const setPaused = (next: boolean) => {
    if (paused === next) return;
    paused = next;
    if (!paused) kick();
  };

  const setup = () => {
    if (isReady.value || !canvasRef.value) return;
    initScene();
    buildPegs();
    buildBins();
    initBallAssets();

    resizeObserver = new ResizeObserver(() => applySize());
    resizeObserver.observe(canvasRef.value);

    isReady.value = true;
    lastTime = 0;
    animate();
  };

  const dispose = () => {
    if (spawnTimer) {
      clearInterval(spawnTimer);
      spawnTimer = null;
    }
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (controls) {
      controls.dispose();
      controls = null;
    }
    for (const b of balls) scene.remove(b.mesh);
    balls.length = 0;
    binCounts.fill(0);
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    geometries.length = 0;
    materials.length = 0;
    sharedBallGeo = null;
    sharedBallMat = null;
    if (renderer) renderer.dispose();
    isReady.value = false;
  };

  return {
    setup,
    dispose,
    dropBalls,
    reset,
    setPaused,
    isReady,
    isFull,
    animationFrameId,
  };
}
