<template>
  <canvas ref="canvasRef" class="w-[300px] h-[300px] dark:bg-gray-900"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';

const canvasRef = ref<HTMLCanvasElement | null>(null);
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let cube: THREE.Mesh;
let animationFrameId: number;

onMounted(() => {
  if (!canvasRef.value) return;

  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, 300 / 300, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
  });
  renderer.setSize(300, 300);

  // Create cube
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial({
    color: 0x00ff00,
    shininess: 100,
  });
  cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  // Add lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(1, 1, 1);
  scene.add(light);

  const ambientLight = new THREE.AmbientLight(0x404040);
  scene.add(ambientLight);

  camera.position.z = 5;

  // Animation loop
  const animate = () => {
    animationFrameId = requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  };

  animate();
});

onBeforeUnmount(() => {
  cancelAnimationFrame(animationFrameId);
  if (renderer) {
    renderer.dispose();
  }
  if (cube) {
    cube.geometry.dispose();
    (cube.material as THREE.Material).dispose();
  }
});
</script>
