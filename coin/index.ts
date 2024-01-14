import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const vec3ToThreeVector = (vec3: CANNON.Vec3): THREE.Vector3 =>
  new THREE.Vector3(vec3.x, vec3.y, vec3.z);

const cannonToThreeQuaternion = (quat: CANNON.Quaternion): THREE.Quaternion =>
  new THREE.Quaternion(quat.x, quat.y, quat.z, quat.w);

const COIN_COLOR = 0xeab308;

export default (canvas: HTMLCanvasElement) => {
  // Scene
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 3, 4);
  camera.lookAt(0, 0, 0);
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

  // Optimizations
  renderer.setPixelRatio(window.devicePixelRatio);
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();

  // Coin
  const geometry = new THREE.CylinderGeometry(1, 1, 0.2, 100);
  const coinMaterial = new THREE.MeshPhongMaterial({ color: COIN_COLOR });
  const coinMesh = new THREE.Mesh(geometry, coinMaterial);
  coinMesh.castShadow = true;
  const CoinShape = new CANNON.Cylinder(1, 1, 0.2, 100);
  coinMesh.position.set(0, 4, 0);
  const coinBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(
      coinMesh.position.x,
      coinMesh.position.y,
      coinMesh.position.z
    ),
    shape: CoinShape,
    allowSleep: true,
  });
  coinMesh.name = 'coin';
  world.addBody(coinBody);
  scene.add(coinMesh);

  // Floor
  const floorGeometry = new THREE.PlaneGeometry(10, 10);
  const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x4caf50 });
  const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.name = 'floor';
  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    shape: floorShape,
    type: CANNON.Body.STATIC,
  });
  floorBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
  floorMesh.receiveShadow = true;
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.y = -0.0001;
  scene.add(floorMesh);
  world.addBody(floorBody);

  // Implement the texture swapping mechanism
  // TODO: Add code to apply materials and textures

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 4, 1);
  scene.add(light);

  // light that illuminates the whole scene
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // light that illuminates the coin
  const coinLight = new THREE.PointLight(0xf3f4f5, 1);
  coinLight.position.set(0, 4, 0);
  scene.add(coinLight);

  // Resize the canvas when the window is resized
  window.addEventListener('resize', () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  });

  // Make the coin jump when the user clicks on the coin
  const onCoinClick = () => {
    coinBody.applyLocalImpulse(
      new CANNON.Vec3(0, 0, -1),
      new CANNON.Vec3(0, 0, 0)
    );

    coinLight.intensity = 2;

    console.log('Coin clicked!');

    coinMaterial.color.setHex(0x4caf50);

    setTimeout(() => {
      coinLight.intensity = 1;
      coinMaterial.color.setHex(COIN_COLOR);
    }, 100);
  };

  let mouse = new THREE.Vector2();
  let boundingBox = new THREE.Box3().setFromObject(coinMesh);
  const raycaster = new THREE.Raycaster();

  canvas.addEventListener(
    'click',
    (event) => {
      mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1;

      console.log('Canvas clicked!');

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObject(floorMesh);

      const isCoinIntersected = intersects.length > 0;

      if (isCoinIntersected) {
        console.log('Coin intersected!', intersects);

        const intersect = intersects[0];

        if (intersect.object === coinMesh) {
          onCoinClick();
        }
      }

      // const isFloorIntersected = intersects.find(
      //   (intersect) => intersect.object.uuid === floorMesh.uuid
      // );

      // if (isFloorIntersected) {
      //   console.error('Floor intersected!', intersects);
      // }
    },
    false
  );

  // animate
  const animate = () => {
    requestAnimationFrame(animate);

    world.fixedStep();

    coinMesh.position.copy(vec3ToThreeVector(coinBody.position));
    coinMesh.quaternion.copy(cannonToThreeQuaternion(coinBody.quaternion));
    coinMesh.matrixWorldNeedsUpdate = true; // Add this line

    boundingBox.setFromObject(coinMesh);

    renderer.render(scene, camera);

    controls.update();
  };
  animate();
};
