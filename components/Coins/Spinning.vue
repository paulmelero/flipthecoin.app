<template>
  <canvas class="canvas" :width="size" :height="size"></canvas>
</template>

<script setup lang="ts">


const props = withDefaults(
  defineProps<{
    size?: number;
  }>(),
  {
    size: 400,
  }
);

const coinSize = computed(() => props.size / 2);
const coinThickness = computed(() => props.size / 20);
const coinRingThickness = computed(() => props.size / 10);
const coinRingBorder = computed(() => props.size / 1.81818181);

onMounted(async () => {
  const Zdog = await import('zdog');
  let isSpinning = true;
  const illustration = new Zdog.Illustration({
    // set canvas with selector
    element: '.canvas',
    dragRotate: true,
    onDragStart: function () {
      isSpinning = false;
    },
    onDragEnd() {
      isSpinning = true;
    },
  });

  const group = new Zdog.Group({
    addTo: illustration,
  });

  new Zdog.Cylinder({
    addTo: group,
    diameter: coinSize.value,
    length: coinThickness.value,
    stroke: false,
    color: '#E91',
  });

  new Zdog.RoundedRect({
    addTo: group,
    width: coinRingBorder.value,
    height: coinRingBorder.value,
    cornerRadius: coinRingBorder.value,
    stroke: coinRingThickness.value,
    color: '#EA0',
  });

  function animate() {
    illustration.rotate.y += isSpinning ? -0.02 : 0;
    illustration.rotate.x += isSpinning ? -0.03 : 0;
    illustration.updateRenderGraph();
    requestAnimationFrame(animate);
  }
  animate();
});
</script>
