import * as THREE from 'three';

export interface CoinAssetUrls {
  heads?: string;
  tails?: string;
  font?: string;
}

export const DEFAULT_COIN_ASSETS: Required<CoinAssetUrls> = {
  heads: '/img/head.webp',
  tails: '/img/tails.webp',
  font: '/fonts/helvetiker_bold.typeface.json',
};

export interface SceneLighting {
  ambient: THREE.AmbientLight;
  hemi: THREE.HemisphereLight;
  mainLight: THREE.DirectionalLight;
  fillLight: THREE.DirectionalLight;
}

/**
 * Adds the shared lighting rig (ambient + hemisphere + keyed directional +
 * fill) to a scene. Returns the lights so callers can manipulate them later
 * (e.g. the physics composable retargets `mainLight` after each flip).
 */
export function createSceneLighting(scene: THREE.Scene): SceneLighting {
  const ambient = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambient);

  const hemi = new THREE.HemisphereLight(0xfff5d6, 0x2a1a05, 2);
  scene.add(hemi);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.1);
  mainLight.position.set(5, 10, 7);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.bias = 0.02;
  mainLight.shadow.radius = 4;
  mainLight.shadow.camera.left = -10;
  mainLight.shadow.camera.right = 10;
  mainLight.shadow.camera.top = 10;
  mainLight.shadow.camera.bottom = -10;
  mainLight.shadow.camera.far = 100;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
  fillLight.position.set(-5, 3, -5);
  scene.add(fillLight);

  return { ambient, hemi, mainLight, fillLight };
}

export interface CreateCoinOptions {
  assets: Required<CoinAssetUrls>;
  renderer: THREE.WebGLRenderer;
}

/**
 * Builds the canonical Flip The Coin mesh: gold cylinder with head/tails
 * face textures, bump-mapped, shadow-casting. The same look is shared by the
 * physics game, the extension, and the scroll narrative so the coin is
 * visually identical everywhere.
 *
 * Disposing the returned geometry/materials is the caller's responsibility
 * (each composable tracks its own disposables).
 */
export function createCoinMesh({ assets, renderer }: CreateCoinOptions): {
  coinMesh: THREE.Mesh;
  geometries: THREE.BufferGeometry[];
  materials: THREE.Material[];
} {
  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];

  const radius = 1;
  const height = 0.1;
  const segments = 96;

  const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
  geometries.push(geometry);

  const sideMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    metalness: 0.7,
    roughness: 0.3,
  });
  materials.push(sideMaterial);

  const textureLoader = new THREE.TextureLoader();
  const maxAniso = renderer.capabilities.getMaxAnisotropy();

  const decorateTexture = (t: THREE.Texture) => {
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAniso;
    return t;
  };

  const headsTexture = decorateTexture(textureLoader.load(assets.heads));
  const tailsTexture = decorateTexture(textureLoader.load(assets.tails));

  const faceMaterialFor = (tex: THREE.Texture) => {
    const m = new THREE.MeshStandardMaterial({
      map: tex,
      bumpMap: tex,
      bumpScale: 0.025,
      metalness: 0.55,
      roughness: 0.42,
    });
    materials.push(m);
    return m;
  };

  const headsMaterial = faceMaterialFor(headsTexture);
  const tailsMaterial = faceMaterialFor(tailsTexture);

  const coinMesh = new THREE.Mesh(geometry, [
    sideMaterial, // Side
    headsMaterial, // Top
    tailsMaterial, // Bottom
  ]);
  coinMesh.castShadow = true;

  return { coinMesh, geometries, materials };
}
