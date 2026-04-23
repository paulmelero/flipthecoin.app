import { ref, type Ref } from 'vue';
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';

export interface CoinAssetUrls {
  heads?: string;
  tails?: string;
  font?: string;
}

export interface CoinEngineOptions {
  /**
   * `'window'` — canvas fills `window.innerWidth` x `window.innerHeight` and
   * reacts to `window` resize. Matches the original home-page behaviour.
   *
   * `'element'` — canvas uses its own `clientWidth`/`clientHeight` and is
   * observed via `ResizeObserver`. Use this for fixed-size containers such
   * as a browser extension popup.
   *
   * Default: `'window'`.
   */
  size?: 'window' | 'element';
  /** Default: `true`. Set false to hide drag-to-rotate in compact UIs. */
  enableOrbitControls?: boolean;
  /** Override asset URLs; each has a sensible default. */
  assetUrls?: CoinAssetUrls;
}

const DEFAULT_ASSETS: Required<CoinAssetUrls> = {
  heads: '/img/head.webp',
  tails: '/img/tails.webp',
  font: 'fonts/helvetiker_bold.typeface.json',
};

export default function useThreeJsCoin(
  canvasRef: Ref<HTMLCanvasElement | null>,
  isFlipping: Ref<boolean>,
  result: Ref<string>,
  tossCount: Ref<number>,
  previousTossCount: Ref<number>,
  isIntersecting: Ref<boolean>,
  options: CoinEngineOptions = {},
) {
  const sizeSource = options.size ?? 'window';
  const enableOrbitControls = options.enableOrbitControls ?? true;
  const assets: Required<CoinAssetUrls> = {
    ...DEFAULT_ASSETS,
    ...(options.assetUrls ?? {}),
  };

  let scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    world: CANNON.World,
    coinMesh: THREE.Mesh,
    coinBody: CANNON.Body,
    floorMesh: THREE.Mesh,
    floorBody: CANNON.Body,
    raycaster: THREE.Raycaster,
    mouse: THREE.Vector2,
    resultText: THREE.Mesh | null,
    font: any,
    controls: OrbitControls | null,
    mainLight: THREE.DirectionalLight,
    resizeObserver: ResizeObserver | null;

  if (typeof window === 'undefined') {
    return {
      setup: () => {},
      disposeSceneResources: () => {},
      flipCoin: () => {},
      animationFrameId: ref<number | null>(null),
    };
  }

  const DEFAULT_CAMERA_POSITION = new THREE.Vector3(-5, 4, 1);

  const animationFrameId = ref<number | null>(null);
  const geometries: THREE.BufferGeometry[] = [];

  const getSize = () => {
    if (sizeSource === 'element' && canvasRef.value) {
      const { clientWidth, clientHeight } = canvasRef.value;
      // Fall back to window if the element has no layout yet.
      if (clientWidth > 0 && clientHeight > 0) {
        return { width: clientWidth, height: clientHeight };
      }
    }
    return { width: window.innerWidth, height: window.innerHeight };
  };

  const initThreeJS = () => {
    const { width, height } = getSize();

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value!,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height, false);
    // make the shadows look softer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // make the canvas transparent
    renderer.setClearColor(0x000000, 0);
    // controls
    if (enableOrbitControls) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = false;
      controls.update();
    } else {
      controls = null;
    }
    // initialises raycaster and mouse vector
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.1);
    scene.add(ambientLight);

    // Main directional light (sun-like)
    mainLight = new THREE.DirectionalLight(0xffffff, 1.1);
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

    // Fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 2);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    // Adjust camera position
    camera.position.copy(DEFAULT_CAMERA_POSITION);
    camera.lookAt(0, 0, 0);
  };

  const createCoin = () => {
    const radius = 1;
    const height = 0.1;
    const segments = 32;

    const geometry = new THREE.CylinderGeometry(
      radius,
      radius,
      height,
      segments,
    );
    geometries.push(geometry);
    const material = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.7,
      roughness: 0.3,
    });

    coinMesh = new THREE.Mesh(geometry, material);
    coinMesh.castShadow = true;

    const textureLoader = new THREE.TextureLoader();
    const headsTexture = textureLoader.load(assets.heads);
    const tailsTexture = textureLoader.load(assets.tails);

    const headsMaterial = new THREE.MeshStandardMaterial({ map: headsTexture });
    const tailsMaterial = new THREE.MeshStandardMaterial({ map: tailsTexture });

    coinMesh.material = [
      material, // Side
      headsMaterial, // Top
      tailsMaterial, // Bottom
    ];

    coinMesh.position.set(0, 1, 0);
    scene.add(coinMesh);

    const coinShape = new CANNON.Cylinder(radius, radius, height, segments);
    coinBody = new CANNON.Body({
      mass: 1,
      shape: coinShape,
    });
    coinBody.position.copy(coinMesh.position as any);
    world.addBody(coinBody);
  };

  const createFloor = () => {
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    geometries.push(floorGeometry);
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    floorBody = new CANNON.Body({
      type: CANNON.Body.STATIC,
      shape: new CANNON.Plane(),
    });
    floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    world.addBody(floorBody);
  };

  const initPhysics = () => {
    world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0),
    });
  };

  const flipCoin = () => {
    if (isFlipping.value) return;
    removeText();

    if (controls) controls.enabled = false;
    result.value = '';
    isFlipping.value = true;
    tossCount.value++;

    const flipForce = 9;
    const randomX = Math.random() * 0.5 + 2;
    const randomZ = Math.random() * 0.5 + 0.25;

    coinBody.position.set(
      coinMesh.position.x,
      coinMesh.position.y,
      coinMesh.position.z,
    );
    coinBody.velocity.set(randomX, flipForce, randomZ);
    coinBody.angularVelocity.set(
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
      0,
    );
  };

  const initFont = async () => {
    const loader = new FontLoader();
    return new Promise((resolve) => {
      loader.load(assets.font, (loadedFont: any) => {
        font = loadedFont;
        resolve(font);
      });
    });
  };

  const determineResult = () => {
    const up = new THREE.Vector3(0, 1, 0);
    up.applyQuaternion(coinMesh.quaternion);

    const isHeads = up.dot(new THREE.Vector3(0, 1, 0)) > 0;

    result.value = isHeads ? 'Heads' : 'Tails';

    if (Math.abs(up.y) < 0.1) {
      result.value = 'Edge';
    }
  };

  const removeText = () => {
    if (resultText) {
      scene.remove(resultText);
      resultText = null;
    }
  };

  const showText = () => {
    const textGeometry = new TextGeometry(result.value, {
      font: font,
      size: 0.8,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.01,
      bevelSegments: 6,
    });
    geometries.push(textGeometry);

    textGeometry.scale(0.9, 1, 1);

    textGeometry.computeBoundingBox();
    const textWidth =
      textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
    const textHeight =
      textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y;
    const textDepth =
      textGeometry.boundingBox!.max.z - textGeometry.boundingBox!.min.z;

    textGeometry.translate(-textWidth / 2, -textHeight / 2, -textDepth / 2);

    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0x990000,
      metalness: 0.1,
      roughness: 0.2,
      emissive: 0xff0000,
      emissiveIntensity: 0.2,
    });

    resultText = new THREE.Mesh(textGeometry, textMaterial);

    resultText.position.set(
      coinBody.position.x,
      coinBody.position.y + 0.5,
      coinBody.position.z,
    );

    (resultText.material as THREE.Material).transparent = true;
    (resultText.material as THREE.Material).opacity = 0;

    scene.add(resultText);

    gsap.to(resultText.position, {
      duration: 0.8,
      y: coinBody.position.y + 1.5,
      ease: 'power2.out',
    });

    gsap.to(resultText.material, {
      duration: 0.6,
      opacity: 1,
      ease: 'power1.out',
    });

    const textLight = new THREE.SpotLight(0xffff00, 8.0);
    textLight.position.set(0, 5, 0);
    textLight.target = resultText;
    textLight.angle = Math.PI / 4;
    textLight.penumbra = 1;
    textLight.decay = 1.5;
    scene.add(textLight);
  };

  function onPointerMove(event: PointerEvent) {
    if (!canvasRef.value) return;
    mouse.x = (event.clientX / canvasRef.value.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / canvasRef.value.clientHeight) * 2 + 1;
  }

  function onCanvasClick() {
    flipCoin();
  }

  const applySize = () => {
    const { width, height } = getSize();
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const initListeners = () => {
    canvasRef.value?.addEventListener('pointermove', onPointerMove);
    canvasRef.value?.addEventListener('click', onCanvasClick);
    if (sizeSource === 'window') {
      window.addEventListener('resize', applySize);
    } else if (canvasRef.value && typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(() => applySize());
      resizeObserver.observe(canvasRef.value);
    }
  };

  const destroyListeners = () => {
    canvasRef.value?.removeEventListener('pointermove', onPointerMove);
    canvasRef.value?.removeEventListener('click', onCanvasClick);
    if (sizeSource === 'window') {
      window.removeEventListener('resize', applySize);
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  };

  const zoomToGroup = () => {
    const aabb = new THREE.Box3().setFromObject(coinMesh);
    const center = aabb.getCenter(new THREE.Vector3());

    const CAMERA_MOVEMENT_OPTIONS = {
      duration: 0.4,
      ease: 'power1.inOut',
    };

    gsap.to(camera.position, {
      ...CAMERA_MOVEMENT_OPTIONS,
      x: center.x + DEFAULT_CAMERA_POSITION.x,
      y: DEFAULT_CAMERA_POSITION.y,
      z: center.z + DEFAULT_CAMERA_POSITION.z,
    });

    if (controls) {
      gsap.to(controls.target, {
        ...CAMERA_MOVEMENT_OPTIONS,
        x: center.x,
        y: center.y,
        z: center.z,
      });
    } else {
      gsap.to(camera, {
        ...CAMERA_MOVEMENT_OPTIONS,
        onUpdate: () => camera.lookAt(center),
      });
    }
  };

  const updateLightPosition = (pos: THREE.Vector3) => {
    gsap.to(mainLight.position, {
      x: pos.x + 5,
      y: pos.y + 10,
      z: pos.z + 7,
      duration: 1,
    });
  };

  const animate = () => {
    animationFrameId.value = requestAnimationFrame(animate);

    world.step(1 / 60);

    raycaster.setFromCamera(mouse, camera);

    if (coinMesh && coinBody) {
      coinMesh.position.copy(coinBody.position as any);
      coinMesh.quaternion.copy(coinBody.quaternion as any);

      isIntersecting.value = raycaster.intersectObject(coinMesh).length > 0;
    }

    if (resultText) {
      resultText.lookAt(camera.position);
    }

    if (isFlipping.value) {
      floorMesh.position.set(coinBody.position.x, 0, coinBody.position.z);
    }

    if (
      coinBody &&
      Math.abs(coinBody.angularVelocity.y) < 0.01 &&
      Math.abs(coinBody.angularVelocity.x) < 0.01 &&
      tossCount.value > previousTossCount.value
    ) {
      isFlipping.value = false;
      if (controls) controls.enabled = true;
      zoomToGroup();
      updateLightPosition(coinMesh.position);
      determineResult();
      showText();
      previousTossCount.value = tossCount.value;
    }

    if (controls) controls.update();

    renderer.render(scene, camera);
  };

  function setup() {
    initThreeJS();
    initPhysics();
    initFont().then(() => {
      createFloor();
      createCoin();
      animate();
      initListeners();
    });
  }

  function disposeSceneResources() {
    destroyListeners();
    geometries.forEach((geometry) => geometry.dispose());
    if (animationFrameId.value !== null) {
      cancelAnimationFrame(animationFrameId.value);
      animationFrameId.value = null;
    }
    if (controls) {
      controls.dispose();
      controls = null;
    }
    if (renderer) renderer.dispose();
  }

  return {
    setup,
    disposeSceneResources,
    flipCoin,
    animationFrameId,
  };
}
