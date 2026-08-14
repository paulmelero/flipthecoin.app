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
  /** Override asset URLs; each has a sensible default. */
  assetUrls?: CoinAssetUrls;
  /**
   * `'window'` fills the viewport and reacts to `window` resize.
   * `'element'` uses the canvas element's own size via ResizeObserver.
   * Default: `'window'`.
   */
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
  let resizeObserver: ResizeObserver | null;

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  // Hero rest pose — coin floats upper-right, gently tilted (matches the
  // "mid" tilt spirit of the physics composable's setPose).
  const HERO_POS = new THREE.Vector3(2.6, 1.4, 0);
  const HERO_QUAT = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(Math.PI / 3, Math.PI / 6, Math.PI / 5),
  );

  // Section travel endpoints (world space). Left = night, right = day.
  const LEFT_POS = new THREE.Vector3(-3.2, 0.6, 0);
  const RIGHT_POS = new THREE.Vector3(3.2, 0.6, 0);

  const getSize = () => {
    if (sizeSource === 'element' && canvasRef.value) {
      const { clientWidth, clientHeight } = canvasRef.value;
      if (clientWidth > 0 && clientHeight > 0) {
        return { width: clientWidth, height: clientHeight };
      }
    }
    return { width: window.innerWidth, height: window.innerHeight };
  };

  const applySize = () => {
    const { width, height } = getSize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const createStarfield = () => {
    const count = 420;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Spread stars across a wide plane, biased to the left (night) half.
      positions[i * 3] = (Math.random() * 2 - 1) * 9;
      positions[i * 3 + 1] = (Math.random() * 2 - 1) * 5;
      positions[i * 3 + 2] = (Math.random() * 2 - 1) * 4 - 2;
      sizes[i] = Math.random() * 0.6 + 0.2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometries.push(geometry);

    starMaterial = new THREE.PointsMaterial({
      color: 0xfff5d6,
      size: 0.06,
      sizeAttenuation: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
    });
    materials.push(starMaterial);

    starfield = new THREE.Points(geometry, starMaterial);
    scene.add(starfield);
  };

  const setup = () => {
    const { width, height } = getSize();

    scene = new THREE.Scene();
    scene.background = null;
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value!,
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);

    // Shared lighting rig (same look as the game coin).
    createSceneLighting(scene);

    // The coin itself — visually identical to the game.
    const built = createCoinMesh({ assets, renderer });
    coinMesh = built.coinMesh;
    for (const g of built.geometries) geometries.push(g);
    for (const m of built.materials) materials.push(m);
    scene.add(coinMesh);

    // A warm point light parented to the coin's neighbourhood — this is the
    // "light from the coin itself" that grows as it travels into the day half.
    coinLight = new THREE.PointLight(0xffd27a, 0, 14, 1.6);
    scene.add(coinLight);

    createStarfield();

    // Camera framing: pulled back so the left→right travel reads across the
    // viewport and the hero rest pose sits in the upper-right.
    camera.position.set(0, 1.6, 9);
    camera.lookAt(0, 0.6, 0);

    // Start at the hero idle pose.
    setIdle();

    if (sizeSource === 'window') {
      window.addEventListener('resize', applySize);
    } else if (canvasRef.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => applySize());
      resizeObserver.observe(canvasRef.value);
    }

    animate();
    isReady.value = true;
  };

  const animate = () => {
    animationFrameId.value = requestAnimationFrame(animate);
    // Gentle idle drift on the starfield for life.
    if (starfield) {
      starfield.rotation.y += 0.0004;
    }
    renderer.render(scene, camera);
  };

  const setIdle = () => {
    if (!coinMesh) return;
    coinMesh.position.copy(HERO_POS);
    coinMesh.quaternion.copy(HERO_QUAT);
    if (coinLight) {
      coinLight.position.set(HERO_POS.x, HERO_POS.y, HERO_POS.z + 1.5);
      coinLight.intensity = 0;
    }
    if (starMaterial) starMaterial.opacity = 1;
  };

  /**
   * Flies the coin from the hero rest pose (upper-right) down to the left
   * (night) end of the section. `p` 0 = hero pose, 1 = at the left end.
   * No illumination change here — the night half stays dark.
   */
  const setFlyProgress = (p: number) => {
    if (!coinMesh) return;
    const t = Math.min(1, Math.max(0, p));
    coinMesh.position.lerpVectors(HERO_POS, LEFT_POS, t);
    // Ease the tilt from the idle quaternion toward the flat face-on
    // orientation that begins the left→right travel.
    const endQuat = new THREE.Quaternion();
    coinMesh.quaternion.copy(HERO_QUAT).slerp(endQuat, t);
    if (coinLight) {
      coinLight.position.set(
        coinMesh.position.x,
        coinMesh.position.y,
        coinMesh.position.z + 1.5,
      );
    }
  };

  /**
   * Drives the coin's horizontal travel + one full revolution.
   * `progress` is the post-"fly" timeline value (0 = at left/night,
   * 1 = at right/day). The fly-from-hero leg is handled by the caller
   * mapping scroll into a 0→1 that covers both legs.
   */
  const setProgress = (p: number) => {
    if (!coinMesh) return;
    const t = Math.min(1, Math.max(0, p));
    const e = t;
    coinMesh.position.lerpVectors(LEFT_POS, RIGHT_POS, e);
    // One full revolution around the flip axis (X) as it travels.
    coinMesh.rotation.x = e * Math.PI * 2;
    if (coinLight) {
      coinLight.position.set(
        coinMesh.position.x,
        coinMesh.position.y,
        coinMesh.position.z + 1.5,
      );
    }
  };

  /**
   * Grows the illumination: the coin's own light intensifies, the starfield
   * fades out. `p` 0 = night, 1 = full sunrise.
   */
  const setIllumination = (p: number) => {
    const t = Math.min(1, Math.max(0, p));
    if (coinLight) coinLight.intensity = t * 6;
    if (starMaterial) starMaterial.opacity = 1 - t;
  };

  const dispose = () => {
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
    if (renderer) renderer.dispose();
  };

  return {
    setup,
    dispose,
    setFlyProgress,
    setProgress,
    setIllumination,
    setIdle,
    isReady,
  };
}
