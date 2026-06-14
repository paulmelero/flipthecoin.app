<script setup lang="ts">
/**
 * DemoFrame — a reusable, accessible frame that hosts interactive demos
 * inside blog articles (and anywhere else). It renders a semantic
 * <figure> with a heading and caption, and only activates its slotted
 * demo when scrolled into view. It also pauses the demo while it is
 * offscreen and respects `prefers-reduced-motion`.
 *
 * It exposes scoped slot props so the demo can react to its lifecycle:
 *   { active, paused, reducedMotion, start }
 *
 * Usage (in a .vue file):
 *   <DemoFrame :title="..." :caption="..." v-slot="{ active, paused }">
 *     <MyDemo :active="active" :paused="paused" />
 *   </DemoFrame>
 */
const props = withDefaults(
  defineProps<{
    /** Heading text (overridden by the #title slot). */
    title?: string;
    /** Caption text below the demo (overridden by the #caption slot). */
    caption?: string;
    /** Activate immediately instead of waiting to scroll into view. */
    eager?: boolean;
  }>(),
  { eager: false },
);

const { $t } = useI18n();
const titleId = useId();

const rootRef = ref<HTMLElement | null>(null);

const inView = ref(false);
const userStarted = ref(false);
const reducedMotion = ref(false);

// Should the demo render/run its animation loop?
const active = computed(() =>
  reducedMotion.value ? userStarted.value : props.eager || inView.value,
);
// Mounted but should stop stepping (scrolled offscreen). Only meaningful
// once active. Honoured by the demo to halt its requestAnimationFrame loop.
const paused = computed(() => active.value && !inView.value);

const start = () => {
  userStarted.value = true;
};

let io: IntersectionObserver | null = null;
let mq: MediaQueryList | null = null;

const onMqChange = (e: MediaQueryListEvent) => {
  reducedMotion.value = e.matches;
};

onMounted(() => {
  mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion.value = mq.matches;
  mq.addEventListener('change', onMqChange);

  if (typeof IntersectionObserver !== 'undefined' && rootRef.value) {
    io = new IntersectionObserver(
      ([entry]) => {
        if (entry) inView.value = entry.isIntersecting;
      },
      { rootMargin: '200px 0px', threshold: 0.1 },
    );
    io.observe(rootRef.value);
  } else {
    // No observer support: fall back to always-on.
    inView.value = true;
  }
});

onBeforeUnmount(() => {
  mq?.removeEventListener('change', onMqChange);
  mq = null;
  io?.disconnect();
  io = null;
});
</script>

<template>
  <figure ref="rootRef" :aria-labelledby="titleId" class="my-8 not-prose">
    <component
      :is="'h3'"
      :id="titleId"
      class="text-lg font-semibold text-base-content mb-3"
    >
      <slot name="title">{{ title }}</slot>
    </component>

    <div
      class="relative rounded-3xl overflow-hidden border border-base-content/5 bg-base-200/40"
    >
      <slot
        :active="active"
        :paused="paused"
        :reduced-motion="reducedMotion"
        :start="start"
      />

      <!-- prefers-reduced-motion: don't auto-run, offer an explicit start -->
      <div
        v-if="reducedMotion && !userStarted"
        role="note"
        class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-base-100/80 backdrop-blur-sm p-6 text-center"
      >
        <p class="max-w-sm text-sm text-base-content/80">
          {{ $t('demo.reducedMotionNotice') }}
        </p>
        <button type="button" class="btn btn-primary btn-sm" @click="start">
          {{ $t('demo.startButton') }}
        </button>
      </div>
    </div>

    <figcaption
      v-if="caption || $slots.caption"
      class="mt-2 text-sm text-base-content/60"
    >
      <slot name="caption">{{ caption }}</slot>
    </figcaption>
  </figure>
</template>
