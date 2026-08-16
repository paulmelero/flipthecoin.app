<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const canvasRef = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let starfield: THREE.Points;
let starMaterial: THREE.PointsMaterial;
let animationId: number | null = null;
let trigger: ScrollTrigger | null = null;
let resizeObserver: ResizeObserver | null;

const geometries: THREE.BufferGeometry[] = [];
const materials: THREE.Material[] = [];
const textures: THREE.Texture[] = [];

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

function applySize() {
  if (!canvasRef.value || !renderer || !camera) return;
  const w = canvasRef.value.clientWidth;
  const h = canvasRef.value.clientHeight;
  if (w === 0 || h === 0) return;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}

function setup() {
  const canvas = canvasRef.value!;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;

  scene = new THREE.Scene();
  scene.background = null;

  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
  camera.position.set(0, 0, 6);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h, false);
  renderer.setClearColor(0x000000, 0);

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

  const tex = createStarTexture();
  textures.push(tex);

  starMaterial = new THREE.PointsMaterial({
    map: tex,
    color: 0xfff5d6,
    size: 0.12,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  materials.push(starMaterial);

  starfield = new THREE.Points(geometry, starMaterial);
  scene.add(starfield);

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => applySize());
    resizeObserver.observe(canvas);
  }

  animate();
}

function animate() {
  animationId = requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

onMounted(() => {
  if (!canvasRef.value) return;

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;
  const isDesktop = window.matchMedia('(min-width: 768px)').matches;
  if (reduceMotion || !isDesktop) return;

  try {
    setup();
  } catch (err) {
    console.error('[HomeStarfield] setup failed:', err);
    return;
  }

  const section = document.getElementById('flip-the-unknown');
  if (!section) return;

  trigger = ScrollTrigger.create({
    trigger: section,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1,
    onUpdate: (self) => {
      starfield.rotation.z = (self.progress * Math.PI * 2) / 10;
      starMaterial.opacity = (1 - self.progress) * 0.8;
    },
  });
});

onBeforeUnmount(() => {
  if (trigger) {
    trigger.kill();
    trigger = null;
  }
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  geometries.forEach((g) => g.dispose());
  materials.forEach((m) => m.dispose());
  textures.forEach((t) => t.dispose());
  if (renderer) renderer.dispose();
});
</script>

<template>
  <canvas
    ref="canvasRef"
    class="block w-full h-full pointer-events-none"
    style="background: transparent"
  />
</template>
