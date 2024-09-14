import * as THREE from 'three';
import gsap from 'gsap';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const vec3ToThreeVector = (vec3: CANNON.Vec3): THREE.Vector3 =>
  new THREE.Vector3(vec3.x, vec3.y, vec3.z);

const cannonToThreeQuaternion = (quat: CANNON.Quaternion): THREE.Quaternion =>
  new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);

const COIN_COLOR = 0xeab308;
const FLOOR_COLOR = 0x4caf50;

export default (canvas: HTMLCanvasElement) => {
  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3, 4);
  camera.lookAt(0, 0, 0);

  // Renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, canvas });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.shadowMap.enabled = true;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  // Physics
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // m/s²
  });
  world.broadphase = new CANNON.NaiveBroadphase();
  (world.solver as CANNON.GSSolver).iterations = 10;

  world.allowSleep = true;

  world.defaultContactMaterial.contactEquationStiffness = 5e6;
  world.defaultContactMaterial.contactEquationRelaxation = 3;

  // Optimizations
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  // Coin
  const COIN_PARAMS = {
    radiusTop: 1,
    radiusBottom: 1,
    height: 0.2,
    radialSegments: 100,
  };
  const geometry = new THREE.CylinderGeometry(...Object.values(COIN_PARAMS));
  // TODO: change one side of the coin to a different color
  const coinMaterial = new THREE.MeshPhongMaterial({ color: COIN_COLOR });
  const coinMesh = new THREE.Mesh(geometry, coinMaterial);
  coinMesh.name = 'coin';
  coinMesh.castShadow = true;
  coinMesh.position.set(0, 4, 0);
  coinMesh.matrixWorldNeedsUpdate = true;
  scene.add(coinMesh);

  // Add the coin to the physics world
  const coinShape = new CANNON.Cylinder(...Object.values(COIN_PARAMS));
  const coinBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(
      coinMesh.position.x,
      coinMesh.position.y,
      coinMesh.position.z
    ),
    shape: coinShape,
    allowSleep: true,
  });
  world.addBody(coinBody);

  coinBody.allowSleep = true;
  coinBody.sleepSpeedLimit = 0.1; // Body will feel sleepy if speed<1 (speed == norm of velocity)
  coinBody.sleepTimeLimit = 1; // Body falls asleep after 1s of sleepiness

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(10, 10);
  const floorMaterial = new THREE.MeshPhongMaterial({ color: FLOOR_COLOR });
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.name = 'floor';
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -0.0001;
  scene.add(floorMesh);

  // Add the floor to the physics world
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    shape: floorShape,
    type: CANNON.Body.STATIC,
    mass: 0,
  });
  floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  world.addBody(floorBody);

  // Implement the texture swapping mechanism
  // TODO: Add code to apply materials and textures

  // Lights
  var dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 1, 1);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 0.2;
  dirLight.shadow.camera.bottom = -0.2;
  dirLight.shadow.camera.left = -0.2;
  dirLight.shadow.camera.right = 0.2;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 2;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);

  // light that illuminates the whole scene
  const ambientLight = new THREE.AmbientLight(0xcba10d, 0.2);
  scene.add(ambientLight);

  // light that illuminates the coin
  const pointLight = new THREE.PointLight(0xf3f4f5, 1, 0, 2);
  pointLight.position.set(0, 4, 0);
  pointLight.castShadow = true;
  scene.add(pointLight);

  // Resize the canvas when the window is resized
  window.addEventListener('resize', () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  // Coin Animation
  let isCoinMoving = false;

  coinBody.addEventListener('sleep', () => {
    isCoinMoving = false;

    console.log('Coin sleeping!', coinBody.velocity.y);

    if (coinBody.velocity.y === 0) zoomToCoin();
  });

  // Make the coin jump when the user clicks on the coin
  const onCoinClick = () => {
    if (isCoinMoving) return;

    controls.enabled = false;

    console.log('camera', camera.position);

    const impulse = new CANNON.Vec3(500 / 60, 13.5, 0);
    coinBody.applyImpulse(impulse);

    pointLight.intensity = 2;

    isCoinMoving = true;

    console.log('Coin clicked!');

    coinMaterial.color.setHex(FLOOR_COLOR);
  };

  // Move the camera to the coin when the user clicks on the coin
  const zoomToCoin = () => {
    //use this code for a object size agnostic solution; build a bounding box around your object you want to zoom and  get its size:
    const aabb = new THREE.Box3().setFromObject(coinMesh);
    const center = aabb.getCenter(new THREE.Vector3());

    gsap.to(camera.position, {
      duration: 1,
      x: center.x,
      y: center.y + 3,
      z: center.z + 4,
      ease: 'power1.in',

      onComplete: () => {
        camera.lookAt(coinMesh.position);
      },
    });

    gsap.to(controls.target, {
      duration: 1,
      x: center.x,
      y: center.y, //set the center of the controler to the zoomed object
      z: center.z, // no distance needed
      onComplete: () => {
        controls.enabled = true; // activate the controler again after animation
      },
    });
  };

  // let mouse = new THREE.Vector2();
  // const raycaster = new THREE.Raycaster();

  canvas.addEventListener(
    'mousedown',
    (event) => {
      // mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
      // mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

      console.log('Canvas clicked!');
      onCoinClick();

      // raycaster.setFromCamera(mouse, camera);

      // const intersects = raycaster.intersectObject(coinMesh);

      // console.log({ intersects });

      // if (intersects.length > 0) {
      //   onCoinClick();
      // }
    },
    false
  );

  canvas.addEventListener(
    'mouseup',
    (event) => {
      setTimeout(() => {
        pointLight.intensity = 1;
        coinMaterial.color.setHex(COIN_COLOR);
      }, 100);
    },
    false
  );

  // animate
  const animate = () => {
    requestAnimationFrame(animate);

    world.fixedStep();

    coinMesh.position.copy(vec3ToThreeVector(coinBody.position));
    coinMesh.quaternion.copy(cannonToThreeQuaternion(coinBody.quaternion));

    renderer.render(scene, camera);
    controls.update();
  };
  animate();
};
