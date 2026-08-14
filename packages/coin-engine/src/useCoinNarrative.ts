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
      setFlyProgress: (_p: number) => {},
      setProgress: (_p: number) => {},
      setIllumination: (_p: number) => {},
      setIdle: () => {},
      setHeroPosition: (_pos: { x: number; y: number }, _scale?: number) => {},
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
  let starfield: THREE.Points;
  let starMaterial: THREE.PointsMaterial;
  let starTexture: THREE.Texture;
  let resizeObserver: ResizeObserver | null;

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  // Face-on idle rotation: X=π/2 tilts the cylinder so heads (+Y face)
  // points toward the camera. Y=π/2 rotates it so the heads image is
  // upright. Together: heads face-on, upright, looking at the camera.
  const IDLE_ROT_X = Math.PI / 2;
  const IDLE_ROT_Y = Math.PI / 2;
  const IDLE_ROT_Z = 0;

  // Hero rest pose — set dynamically from the actual hero coin frame position.
  let heroPos = new THREE.Vector3(2.4, 0, 0);

  // Section travel endpoints. Left = night, right = day.
  const LEFT_POS = new THREE.Vector3(-2.8, 0, 0);
  const RIGHT_POS = new THREE.Vector3(2.8, 0, 0);
  const ARC_HEIGHT = 1.8;

  // Fly curve control point — computed from heroPos when set.
  let flyControl = new THREE.Vector3(0, 1.5, 0);

  // Rotation: fly covers a quarter turn, arc covers one full revolution.
  const FLY_ROT = Math.PI / 4;
  const ARC_ROT = Math.PI * 2;

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
   * Converts screen pixel coordinates (viewport-relative) to 3D world
   * coordinates at z=0. Accounts for the canvas's actual position in the
   * viewport (it may be offset by header/main padding).
   */
  function screenToWorld(clientX: number, clientY: number) {
    const canvasRect = canvasRef.value!.getBoundingClientRect();
    const ndcX = ((clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    const ndcY = -(((clientY - canvasRect.top) / canvasRect.height) * 2 - 1);

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
    if (coinMesh) coinMesh.scale.setScalar(scale);
    // Control point for the fly bezier: midpoint lifted into an arc.
    const mid = new THREE.Vector3()
      .addVectors(heroPos, LEFT_POS)
      .multiplyScalar(0.5);
    flyControl = new THREE.Vector3(mid.x, mid.y + 1.8, 0);
    setIdle();
  }

  function createStarTexture(): THREE.Texture {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 245, 214, 0.9)');
    gradient.addColorStop(0.5, 'rgba(255, 245, 214, 0.3)');
    gradient.addColorStop(1, 'rgba(255, 245, 214, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  function createStarfield() {
    const count = 350;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() * 2 - 1) * 8;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * 4.5;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * 3 - 4;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometries.push(geometry);

    starTexture = createStarTexture();
    textures.push(starTexture);

    starMaterial = new THREE.PointsMaterial({
      map: starTexture,
      color: 0xfff5d6,
      size: 0.12,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    materials.push(starMaterial);

    starfield = new THREE.Points(geometry, starMaterial);
    scene.add(starfield);
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
    for (const g of built.geometries) geometries.push(g);
    for (const m of built.materials) materials.push(m);
    scene.add(coinMesh);

    coinLight = new THREE.PointLight(0xffd27a, 0, 14, 1.6);
    scene.add(coinLight);

    createStarfield();

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
    coinMesh.rotation.set(IDLE_ROT_X, IDLE_ROT_Y, IDLE_ROT_Z);
    if (coinLight) {
      coinLight.position.set(heroPos.x, heroPos.y, 2);
      coinLight.intensity = 0;
    }
    if (starMaterial) starMaterial.opacity = 0;
  }

  /**
   * Fly phase: coin travels from hero position to the left (night) end of
   * the flip section via a quadratic bezier curve. Rotation begins.
   * Stars fade in as we enter the night section.
   */
  function setFlyProgress(p: number) {
    if (!coinMesh) return;
    const t = Math.min(1, Math.max(0, p));

    // Quadratic bezier: P0=hero, P1=control, P2=left
    const u = 1 - t;
    coinMesh.position.set(
      u * u * heroPos.x + 2 * u * t * flyControl.x + t * t * LEFT_POS.x,
      u * u * heroPos.y + 2 * u * t * flyControl.y + t * t * LEFT_POS.y,
      0,
    );

    // Rotation: starts from idle (π/2, π/2, 0), adds FLY_ROT on X
    coinMesh.rotation.x = IDLE_ROT_X + t * FLY_ROT;

    if (coinLight) {
      coinLight.position.set(coinMesh.position.x, coinMesh.position.y, 2);
    }

    // Stars fade in only during the second half of fly, so they don't
    // appear over the hero section.
    if (starMaterial) starMaterial.opacity = Math.max(0, (t - 0.5) * 2);
  }

  /**
   * Arc phase: coin follows a parabolic arc left→right with one full
   * revolution. Illumination grows, stars fade out.
   */
  function setProgress(p: number) {
    if (!coinMesh) return;
    const t = Math.min(1, Math.max(0, p));

    // Parabolic arc: x linear, y = 4*h*t*(1-t) peaking at t=0.5
    const x = LEFT_POS.x + (RIGHT_POS.x - LEFT_POS.x) * t;
    const y = ARC_HEIGHT * 4 * t * (1 - t);
    coinMesh.position.set(x, y, 0);

    // One full revolution, continuing from where fly left off
    coinMesh.rotation.x = IDLE_ROT_X + FLY_ROT + t * ARC_ROT;

    if (coinLight) {
      coinLight.position.set(x, y, 2);
    }
  }

  function setIllumination(p: number) {
    const t = Math.min(1, Math.max(0, p));
    if (coinLight) coinLight.intensity = t * 6;
    if (starMaterial) starMaterial.opacity = Math.max(0, 1 - t * 1.5);
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
    setFlyProgress,
    setProgress,
    setIllumination,
    setIdle,
    setHeroPosition,
    screenToWorld,
    isReady,
  };
}
