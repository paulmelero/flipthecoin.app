import { ref, type Ref } from 'vue';
import * as THREE from 'three';
import {
  createSceneLighting,
  createCoinMesh,
  DEFAULT_COIN_ASSETS,
  type CoinAssetUrls,
} from './coin-scene';

export type { CoinAssetUrls } from './coin-scene';

export interface CoinNarrativeOptions {
  assetUrls?: CoinAssetUrls;
  size?: 'window' | 'element';
}

export default function useCoinNarrative(
  canvasRef: Ref<HTMLCanvasElement | null>,
  options: CoinNarrativeOptions = {},
) {
  const sizeSource = options.size ?? 'window';
  const assets: Required<CoinAssetUrls> = {
    ...DEFAULT_COIN_ASSETS,
    ...(options.assetUrls ?? {}),
  };

  if (typeof window === 'undefined') {
    return {
      setup: () => {},
      dispose: () => {},
      setFlyTrajectoryProgress: (_p: number) => {},
      setArcTrajectoryProgress: (_p: number) => {},
      setIllumination: (_p: number) => {},
      setIdle: () => {},
      setHeroPosition: (_pos: { x: number; y: number }, _scale?: number) => {},
      setArcBounds: (_leftX: number, _rightX: number) => {},
      screenToWorld: (_x: number, _y: number) => ({ x: 0, y: 0 }),
      isReady: ref(false),
    };
  }

  const isReady = ref(false);
  const animationFrameId = ref<number | null>(null);

  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let renderer: THREE.WebGLRenderer;
  let coinMesh: THREE.Mesh;
  let coinLight: THREE.PointLight;
  let resizeObserver: ResizeObserver | null;

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  // Idle orientation as a quaternion: heads face-on, upright, toward
  // camera. Euler (π/2, π/2, 0) tilts the cylinder axis (Y) toward Z
  // and rotates the heads image upright.
  const IDLE_EULER = new THREE.Euler(Math.PI / 2, Math.PI / 2, 0);
  const IDLE_QUAT = new THREE.Quaternion().setFromEuler(IDLE_EULER);

  // Flip axis — world X. Rotating around X makes the coin tumble
  // end-over-end (heads → edge → tails → edge → heads), exactly like
  // the physics-driven flip in the /play scene.
  const FLIP_AXIS = new THREE.Vector3(1, 0, 0);

  // Fly does a quarter flip (heads → edge-on, laying flat).
  // Arc does one full revolution and ends at the same edge-on pose.
  const FLY_ROT = Math.PI / 2;
  const ARC_ROT = 2 * Math.PI;

  // Hero rest pose — set dynamically from the actual hero coin frame position.
  let heroPos = new THREE.Vector3(2.4, 0, 0);

  // Hero rest scale — set from setHeroPosition, restored by setIdle().
  let heroScale = 1;

  // Section travel endpoints. Left = night, right = day. Mutable —
  // updated from the section's real on-screen bounds via setArcBounds()
  // so the coin tracks the section card instead of hardcoded positions.
  const LEFT_POS = new THREE.Vector3(-2.8, 0, 0);
  const RIGHT_POS = new THREE.Vector3(2.8, 0, 0);
  const ARC_HEIGHT = 1.8;

  // Fly curve control point — computed from heroPos when set.
  let flyControl = new THREE.Vector3(0, 1.5, 0);

  // Reusable quaternion for flip composition (avoid GC churn).
  const flipQuat = new THREE.Quaternion();

  // Coin materials, collected at setup — used for end-of-arc fade.
  let coinMaterials: THREE.Material[] = [];

  function getSize() {
    if (sizeSource === 'element' && canvasRef.value) {
      const { clientWidth, clientHeight } = canvasRef.value;
      if (clientWidth > 0 && clientHeight > 0) {
        return { width: clientWidth, height: clientHeight };
      }
    }
    return { width: window.innerWidth, height: window.innerHeight };
  }

  function applySize() {
    const { width, height } = getSize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }

  /**
   * Walks the offsetParent chain to get an element's document-relative
   * position. Unlike getBoundingClientRect(), these values don't change
   * with scroll — essential because the canvas is position:sticky.
   */
  function getDocOffset(el: HTMLElement): { top: number; left: number } {
    let top = 0;
    let left = 0;
    let node: HTMLElement | null = el;
    while (node) {
      top += node.offsetTop;
      left += node.offsetLeft;
      node = node.offsetParent as HTMLElement | null;
    }
    return { top, left };
  }

  /**
   * Converts document-relative pixel coordinates to 3D world coordinates
   * at z=0. Uses offsetTop/offsetLeft (not getBoundingClientRect) so the
   * result is stable regardless of scroll position — the canvas is
   * position:sticky, so its viewport rect shifts when scrolling.
   */
  function screenToWorld(docX: number, docY: number) {
    const canvas = canvasRef.value!;
    const offset = getDocOffset(canvas);
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    const ndcX = ((docX - offset.left) / w) * 2 - 1;
    const ndcY = -(((docY - offset.top) / h) * 2 - 1);

    const visibleHeight =
      2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    const visibleWidth = visibleHeight * camera.aspect;

    return {
      x: (ndcX * visibleWidth) / 2,
      y: (ndcY * visibleHeight) / 2,
    };
  }

  /**
   * Sets the hero idle position from screen coordinates and recomputes
   * the fly curve control point. Also scales the coin to match the
   * poster image's pixel size.
   */
  function setHeroPosition(pos: { x: number; y: number }, scale = 1) {
    heroPos = new THREE.Vector3(pos.x, pos.y, 0);
    heroScale = scale;
    if (coinMesh) coinMesh.scale.setScalar(scale);
    // Control point for the fly bezier: midpoint lifted into an arc.
    const mid = new THREE.Vector3()
      .addVectors(heroPos, LEFT_POS)
      .multiplyScalar(0.5);
    flyControl = new THREE.Vector3(mid.x, mid.y + 1.8, 0);
    // Caller is responsible for calling setIdle() when appropriate.
  }

  /**
   * Sets the arc travel endpoints from screen (document-relative)
   * coordinates and recomputes the fly control point. No-op before setup.
   */
  function setArcBounds(leftX: number, rightX: number) {
    if (!coinMesh) return;
    // Inset the endpoints by the coin's radius at arc size (half of the
    // hero scale) so the coin's edge stays inside the section card.
    const radius = heroScale * 0.5;
    LEFT_POS.x = leftX + radius;
    RIGHT_POS.x = rightX - radius;
    // Re-derive the fly control point for the (possibly new) left end.
    const mid = new THREE.Vector3()
      .addVectors(heroPos, LEFT_POS)
      .multiplyScalar(0.5);
    flyControl = new THREE.Vector3(mid.x, mid.y + 1.8, 0);
  }

  function setup() {
    const { width, height } = getSize();

    scene = new THREE.Scene();
    scene.background = null;
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value!,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);

    createSceneLighting(scene);

    const built = createCoinMesh({ assets, renderer });
    coinMesh = built.coinMesh;
    coinMaterials = [];
    coinMesh.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.isMesh && mesh.material) {
        const mats = Array.isArray(mesh.material)
          ? mesh.material
          : [mesh.material];
        for (const m of mats) {
          (m as THREE.MeshStandardMaterial).transparent = true;
          coinMaterials.push(m);
        }
      }
    });
    for (const g of built.geometries) geometries.push(g);
    for (const m of built.materials) materials.push(m);
    scene.add(coinMesh);

    coinLight = new THREE.PointLight(0xffd27a, 0, 14, 1.6);
    scene.add(coinLight);

    // Camera: straight on, eye-level. Coin faces camera directly.
    camera.position.set(0, 0, 6);
    camera.lookAt(0, 0, 0);

    setIdle();

    if (sizeSource === 'window') {
      window.addEventListener('resize', applySize);
    } else if (canvasRef.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => applySize());
      resizeObserver.observe(canvasRef.value);
    }

    animate();
    isReady.value = true;
  }

  function animate() {
    animationFrameId.value = requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }

  function setIdle() {
    if (!coinMesh) return;
    coinMesh.position.copy(heroPos);
    coinMesh.scale.setScalar(heroScale);
    for (const m of coinMaterials) m.opacity = 1;
    coinMesh.quaternion.copy(IDLE_QUAT);
    if (coinLight) {
      coinLight.position.set(heroPos.x, heroPos.y, 2);
      coinLight.intensity = 0;
    }
  }

  /**
   * Fly phase: coin travels from hero position to the left (night) end
   * of the flip section via a quadratic bezier curve. A quarter-turn
   * flip begins (heads → edge).
   */
  function setFlyTrajectoryProgress(p: number) {
    if (!coinMesh) return;
    const t = Math.min(1, Math.max(0, p));

    // Quadratic bezier: P0=hero, P1=control, P2=left
    const u = 1 - t;
    coinMesh.position.set(
      u * u * heroPos.x + 2 * u * t * flyControl.x + t * t * LEFT_POS.x,
      u * u * heroPos.y + 2 * u * t * flyControl.y + t * t * LEFT_POS.y,
      0,
    );

    // Flip: world-space rotation around X composed with idle quat.
    // At t=0 → idle (heads). At t=1 → edge-on (quarter turn).
    // Scale shrinks from hero size to half across the fly so the coin
    // arrives at the section card at its (smaller) arc size.
    flipQuat.setFromAxisAngle(FLIP_AXIS, t * FLY_ROT);
    coinMesh.quaternion.copy(flipQuat).multiply(IDLE_QUAT);
    coinMesh.scale.setScalar(heroScale * (1 - 0.5 * t));

    if (coinLight) {
      coinLight.position.set(coinMesh.position.x, coinMesh.position.y, 2);
    }
  }

  /**
   * Arc phase: coin follows a parabolic arc left→right. The flip
   * continues from where fly left off and completes a full 2π
   * revolution, ending face-on (idle orientation). Illumination
   * grows via setIllumination().
   */
  function setArcTrajectoryProgress(p: number) {
    if (!coinMesh) return;
    const t = Math.min(1, Math.max(0, p));

    // Parabolic arc: x linear, y = 4*h*t*(1-t) peaking at t=0.5
    const x = LEFT_POS.x + (RIGHT_POS.x - LEFT_POS.x) * t;
    const y = ARC_HEIGHT * 4 * t * (1 - t);
    coinMesh.position.set(x, y, 0);
    coinMesh.scale.setScalar(heroScale * 0.5);

    // Fade out over the last 12% of the arc: the coin "lands" behind
    // the section card, whose backgrounds are partly translucent, so a
    // hard stop would leave it bleeding through the card edge.
    const FADE_START = 0.88;
    const opacity =
      t <= FADE_START ? 1 : 1 - (t - FADE_START) / (1 - FADE_START);
    for (const m of coinMaterials) m.opacity = opacity;

    // Flip continues: FLY_ROT → 2π. At t=1, total = 2π = idle.
    flipQuat.setFromAxisAngle(FLIP_AXIS, FLY_ROT + t * ARC_ROT);
    coinMesh.quaternion.copy(flipQuat).multiply(IDLE_QUAT);

    if (coinLight) {
      coinLight.position.set(x, y, 2);
    }
  }

  function setIllumination(p: number) {
    const t = Math.min(1, Math.max(0, p));
    if (coinLight) coinLight.intensity = t * 6;
  }

  function dispose() {
    if (sizeSource === 'window') {
      window.removeEventListener('resize', applySize);
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    if (renderer) renderer.dispose();
  }

  return {
    setup,
    dispose,
    setFlyTrajectoryProgress,
    setArcTrajectoryProgress,
    setIllumination,
    setIdle,
    setHeroPosition,
    setArcBounds,
    screenToWorld,
    isReady,
  };
}
