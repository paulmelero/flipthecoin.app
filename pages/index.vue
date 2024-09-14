<template>
  <Jumbo class="bg-yellow-500 text-black min-h-[100dvh] relative overflow-hidden">
    <div class="self-center">
      <canvas
        ref="canvasRef"
        class="w-full h-[80dvh] mt-4 absolute top-0 right-0"
        :class="{
          'cursor-pointer': !isFlipping,
          'cursor-grab': isIntersecting && !isFlipping,
        }"
      ></canvas>
      <div class="isolate z-10">
        <PrimitivesFTitle>"Flip The Coin", the online game</PrimitivesFTitle>
        <p class="mb-3">
          Have you ever let fate decide for you? You certainly shouldn't!
        </p>
        <UButton
          color="white"
          @click="flipCoin"
          :disabled="isFlipping"
          size="md"
        >
          {{ isFlipping ? 'Flipping...' : 'Flip the coin' }}
        </UButton>
        <p
          class="mt-3"
          v-if="result"
        >{{ result }}</p>
      </div>

    </div>
  </Jumbo>
  <Jumbo class="min-h-[400px]">
    <PrimitivesFTitle as="h2">The game to flip coins and complete challenges.</PrimitivesFTitle>
    <p>
      The game of uncertainty: Tossing a coin gives us a 50% chance of it
      landing heads and 50% chance landing tails, but until the coin lands we
      don't know what it will be!
    </p>
    <p>
      Each coin toss is an independent "event" and the outcome of the previous
      toss does not affect the probability of the next toss.
    </p>
  </Jumbo>
  <Jumbo class="flex justify-between items-center gap-4 min-h-[400px]">
    <svg
      class="w-10 h-10 mb-3 text-gray-200 dark:text-gray-700"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 18 14"
    >
      <path
        d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z"
      />
    </svg>
    <blockquote>
      <em>"You are what you are today because of the choices you made yesterday,
        and the choices you make today will make you what you are tomorrow."</em>
      — Michael Josephson
    </blockquote>
  </Jumbo>
  <!-- <Jumbo class="min-h-[400px]">
    <PrimitivesFTitle as="h2">How to play?</PrimitivesFTitle>
    <p>
      The game is simple: you flip a coin and complete the challenge. If you
      don't like the challenge, you can skip it and flip the coin again.
    </p>
    <p>
      The game is played in turns. Each turn consists of flipping a coin and
      completing the challenge. If you don't like the challenge, you can skip it
      and flip the coin again.
    </p>
    <p>
      The game ends when you complete all the challenges or when you give up.
    </p>
  </Jumbo> -->
</template>

<script setup lang="ts">
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { gsap } from 'gsap';

const canvasRef = ref<HTMLCanvasElement | null>(null);
const isFlipping = ref(false);
const result = ref('');
const tossCount = ref(0);
const previousTossCount = ref(0);
const isIntersecting = ref(false);

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
  controls: OrbitControls,
  mainLight: THREE.DirectionalLight;

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(-5, 4, 1);

const initThreeJS = () => {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ canvas: canvasRef.value!, antialias: true });
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
  controls.update()
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
  mainLight.shadow.mapSize.width = 1024;
  mainLight.shadow.mapSize.height = 1024;
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

  const geometry = new THREE.CylinderGeometry(radius, radius, height, segments);
  const material = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,  // Golden color
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
    material,            // Side
    headsMaterial,       // Top
    tailsMaterial        // Bottom
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
  const randomX = Math.random() * 0.5 - 0.25;
  const randomZ = Math.random() * 0.5 - 0.25;

  coinBody.position.set(coinMesh.position.x, coinMesh.position.y, coinMesh.position.z);
  coinBody.velocity.set(randomX, flipForce, randomZ);
  coinBody.angularVelocity.set(Math.random() * 20 - 10, Math.random() * 20 - 10, 0);
};

const determineResult = () => {
  // Create a vector pointing up (0, 1, 0) and transform it by the coin's rotation
  const up = new THREE.Vector3(0, 1, 0);
  up.applyQuaternion(coinMesh.quaternion);

  // If the dot product of the up vector and the world's up vector is positive, the coin is heads
  const isHeads = up.dot(new THREE.Vector3(0, 1, 0)) > 0;

  result.value = isHeads ? 'Heads' : 'Tails';

  // if the rotation is vertical, the coin is standing on its edge
  if (Math.abs(up.y) < 0.1) {
    result.value = 'Edge';
  }


  console.log('Result:', result.value);
};

// Event listeners

function onPointerMove(event: PointerEvent) {
  // calculate pointer position in normalized device coordinates
  // (-1 to +1) for both components
  mouse.x = (event.clientX / canvasRef.value!.clientWidth) * 2 - 1;
  mouse.y = - (event.clientY / canvasRef.value!.clientHeight) * 2 + 1;

}

function onCanvasClick() {
  // if (isIntersecting.value) {
  flipCoin();
  // }
}

const initListeners = () => {
  canvasRef.value!.addEventListener('pointermove', onPointerMove);
  canvasRef.value!.addEventListener('click', onCanvasClick);
};

const destroyListeners = () => {
  canvasRef.value!.removeEventListener('pointermove', onPointerMove);
  canvasRef.value!.removeEventListener('click', onCanvasClick);
};
const zoomToCoin = () => {
  //use this code for a object size agnostic solution; build a bounding box around your object you want to zoom and  get its size:
  const aabb = new THREE.Box3().setFromObject(coinMesh);
  const center = aabb.getCenter(new THREE.Vector3());

  gsap.to(camera.position, {
    duration: .3,
    x: center.x + DEFAULT_CAMERA_POSITION.x,
    y: DEFAULT_CAMERA_POSITION.y,
    z: center.z + DEFAULT_CAMERA_POSITION.z,
    ease: 'power1.inOut',
  });

  gsap.to(controls.target, {
    duration: .2,
    x: center.x,
    y: center.y, //set the center of the controler to the zoomed object
    z: center.z, // no distance needed
    onComplete: () => {
      controls.enabled = true; // activate the controler again after animation
    },
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


  if (isFlipping.value) {
    // Move the floor to follow the coin
    floorMesh.position.set(coinBody.position.x, 0, coinBody.position.z);

  }

  // When the coin is decreasing its speed but it's still moving
  if (isFlipping.value && coinBody && coinBody.velocity.y < 0.1) {
    zoomToCoin();
  }

  // Check if the coin has stopped moving
  if (
    coinBody
    && Math.abs(coinBody.angularVelocity.y) < 0.01
    && Math.abs(coinBody.angularVelocity.x) < 0.01
  ) {
    isFlipping.value = false;

    if (tossCount.value > previousTossCount.value) {
      zoomToCoin();
      updateLightPosition(coinMesh.position);
      determineResult();
      previousTossCount.value = tossCount.value;
    }
  }


  renderer.render(scene, camera);
};

onMounted(() => {
  initThreeJS();
  initPhysics();
  createFloor();
  createCoin();
  animate();
  initListeners();
});

onUnmounted(() => {
  destroyListeners();
});
</script>
