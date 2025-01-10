import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import type { Ref } from 'vue';

export function useThreeJsCoin(
  canvasRef: Ref<HTMLCanvasElement | null>,
  isFlipping: Ref<boolean>,
  result: Ref<string>,
  tossCount: Ref<number>,
  previousTossCount: Ref<number>,
  isIntersecting: Ref<boolean>
) {
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
    controls: OrbitControls,
    mainLight: THREE.DirectionalLight;

  const DEFAULT_CAMERA_POSITION = new THREE.Vector3(-5, 4, 1);

  const initThreeJS = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.value!,
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // make the shadows look softer
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    // make the canvas transparent
    renderer.setClearColor(0x000000, 0);
    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;
    controls.update();
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

    // Add these lines to extend the shadow camera frustum
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
      segments
    );
    const material = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Golden color
      metalness: 0.7,
      roughness: 0.3,
    });

    coinMesh = new THREE.Mesh(geometry, material);
    coinMesh.castShadow = true;

    // Create textures for heads and tails
    const textureLoader = new THREE.TextureLoader();
    const headsTexture = textureLoader.load('/img/head.webp');
    const tailsTexture = textureLoader.load('/img/tails.webp');

    // Create materials for the faces
    const headsMaterial = new THREE.MeshStandardMaterial({ map: headsTexture });
    const tailsMaterial = new THREE.MeshStandardMaterial({ map: tailsTexture });

    // Apply materials to the top and bottom faces
    coinMesh.material = [
      material, // Side
      headsMaterial, // Top
      tailsMaterial, // Bottom
    ];

    coinMesh.position.set(0, 1, 0);
    scene.add(coinMesh);

    // Physical representation
    const coinShape = new CANNON.Cylinder(radius, radius, height, segments);
    coinBody = new CANNON.Body({
      mass: 1,
      shape: coinShape,
    });
    coinBody.position.copy(coinMesh.position as any);
    world.addBody(coinBody);
  };

  const createFloor = () => {
    // Visual representation to show shadows
    const floorGeometry = new THREE.PlaneGeometry(100, 100);
    // set to ShadowMaterial to receive shadows but not be visible
    const floorMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Physical representation
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
    controls.enabled = false;
    result.value = '';
    isFlipping.value = true;
    tossCount.value++;

    const flipForce = 9;
    const randomX = Math.random() * 0.5 + 2;
    const randomZ = Math.random() * 0.5 + 0.25;

    coinBody.position.set(
      coinMesh.position.x,
      coinMesh.position.y,
      coinMesh.position.z
    );
    coinBody.velocity.set(randomX, flipForce, randomZ);
    coinBody.angularVelocity.set(
      Math.random() * 20 - 10,
      Math.random() * 20 - 10,
      0
    );
  };

  const initFont = async () => {
    const loader = new FontLoader();
    return new Promise((resolve) => {
      loader.load('fonts/helvetiker_bold.typeface.json', (loadedFont: any) => {
        font = loadedFont;
        resolve(font);
      });
    });
  };

  const determineResult = () => {
    // Create a vector pointing up (0, 1, 0) and transform it by the coin's rotation
    const up = new THREE.Vector3(0, 1, 0);
    up.applyQuaternion(coinMesh.quaternion);

    // If the dot product of the up vector and the world's up vector is positive, the coin is heads
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
    // Create new 3D text with larger size and depth
    const textGeometry = new TextGeometry(result.value, {
      font: font,
      size: 0.8,
      height: 0.2,
      curveSegments: 12, // Added for smoother curves
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.01,
      bevelSegments: 6,
    });

    textGeometry.scale(0.9, 1, 1);

    // Center the geometry itself
    textGeometry.computeBoundingBox();
    const textWidth =
      textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
    const textHeight =
      textGeometry.boundingBox!.max.y - textGeometry.boundingBox!.min.y;
    const textDepth =
      textGeometry.boundingBox!.max.z - textGeometry.boundingBox!.min.z;

    // Center the geometry by moving its vertices
    textGeometry.translate(-textWidth / 2, -textHeight / 2, -textDepth / 2);

    const textMaterial = new THREE.MeshStandardMaterial({
      color: 0x990000,
      metalness: 0.1,
      roughness: 0.2,
      emissive: 0xff0000,
      emissiveIntensity: 0.2,
    });

    resultText = new THREE.Mesh(textGeometry, textMaterial);

    // Position the text above the coin's center
    resultText.position.set(
      coinBody.position.x,
      coinBody.position.y + 0.5, // Start lower
      coinBody.position.z
    );

    // Set initial opacity to 0
    (resultText.material as THREE.Material).transparent = true;
    (resultText.material as THREE.Material).opacity = 0;

    resultText.castShadow = true;
    scene.add(resultText);

    // Animate both position and opacity
    gsap.to(resultText.position, {
      duration: 0.8,
      y: coinBody.position.y + 1.5, // Final position
      ease: 'power2.out',
    });

    gsap.to(resultText.material, {
      duration: 0.6,
      opacity: 1,
      ease: 'power1.out',
    });

    // Add a spotlight specifically for the text
    const textLight = new THREE.SpotLight(0xffff00, 8.0); // Yellow light
    textLight.position.set(0, 5, 0);
    textLight.target = resultText;
    textLight.angle = Math.PI / 4;
    textLight.penumbra = 1;
    textLight.decay = 1.5;
    scene.add(textLight);
  };

  // Event listeners

  function onPointerMove(event: PointerEvent) {
    // calculate pointer position in normalized device coordinates
    // (-1 to +1) for both components
    mouse.x = (event.clientX / canvasRef.value!.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / canvasRef.value!.clientHeight) * 2 + 1;
  }

  function onCanvasClick() {
    removeText();
    // if (isIntersecting.value) {
    flipCoin();
    // }
  }

  const initListeners = () => {
    canvasRef.value?.addEventListener('pointermove', onPointerMove);
    canvasRef.value?.addEventListener('click', onCanvasClick);
  };

  const destroyListeners = () => {
    canvasRef.value?.removeEventListener('pointermove', onPointerMove);
    canvasRef.value?.removeEventListener('click', onCanvasClick);
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

    // Update controls target to look at the coin
    gsap.to(controls.target, {
      ...CAMERA_MOVEMENT_OPTIONS,
      x: center.x,
      y: center.y,
      z: center.z,
    });
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
    requestAnimationFrame(animate);

    world.step(1 / 60);

    raycaster.setFromCamera(mouse, camera);

    // Update the coin's position and rotation
    if (coinMesh && coinBody) {
      coinMesh.position.copy(coinBody.position as any);
      coinMesh.quaternion.copy(coinBody.quaternion as any);

      // Check if the mouse is intersecting with the coin
      isIntersecting.value = raycaster.intersectObject(coinMesh).length > 0;
    }

    // Make result text always face the camera
    if (resultText) {
      resultText.lookAt(camera.position);
    }

    if (isFlipping.value) {
      // Move the floor to follow the coin
      floorMesh.position.set(coinBody.position.x, 0, coinBody.position.z);
    }

    // Check if the coin has stopped moving
    if (
      coinBody &&
      // 0.001 is too low, it will sometimes never stop
      Math.abs(coinBody.angularVelocity.y) < 0.01 &&
      Math.abs(coinBody.angularVelocity.x) < 0.01 &&
      // Ensures it's only called once
      tossCount.value > previousTossCount.value
    ) {
      isFlipping.value = false;
      controls.enabled = true;
      zoomToGroup();
      updateLightPosition(coinMesh.position);
      determineResult();
      showText();
      previousTossCount.value = tossCount.value;
    }

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render(scene, camera);
  };

  // Setup and cleanup functions
  function setup() {
    initThreeJS();
    initPhysics();
    initFont();
    createFloor();
    createCoin();
    animate();
    initListeners();
  }

  function cleanup() {
    destroyListeners();
  }

  return {
    setup,
    cleanup,
    flipCoin,
  };
}
