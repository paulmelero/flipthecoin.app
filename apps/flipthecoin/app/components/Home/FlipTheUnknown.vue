<script setup lang="ts">
const { $t } = useI18n();
</script>

<template>
  <section
    id="flip-the-unknown"
    class="flip-section bg-transparent rounded-3xl relative min-h-[100dvh] overflow-hidden"
    style="--illumination: 0"
  >
    <!-- bgs: night base + border frame (bottom) -->
    <div aria-hidden="true" class="night-layer absolute inset-0 z-0"></div>
    <div
      aria-hidden="true"
      class="border-frame rounded-3xl absolute inset-0 z-0"
    ></div>

    <!-- stars (same bg layer as mountains) -->
    <div aria-hidden="true" class="absolute inset-0 z-[1] pointer-events-none">
      <HomeStarfield />
    </div>

    <!-- mountains (dawn backdrop) -->
    <div aria-hidden="true" class="dawn-bg absolute inset-0 z-[2]"></div>

    <!-- sun light (dawn glow) -->
    <div aria-hidden="true" class="dawn-layer absolute inset-0 z-[3]"></div>

    <!-- text content -->
    <div
      class="relative z-10 container mx-auto px-4 lg:px-8 min-h-[100dvh] flex flex-col justify-end items-center text-center pb-20 lg:pb-32"
    >
      <div
        class="grid grid-cols-2 gap-4 w-full mb-auto mt-10 text-sm font-mono uppercase tracking-[0.2em] text-center"
      >
        <span class="left-label">{{ $t('home.flip.left') }}</span>
        <span class="right-label">{{ $t('home.flip.right') }}</span>
      </div>

      <FTitleH2
        class="font-headings font-[500] tracking-tight text-4xl md:text-6xl leading-[1.05] max-w-3xl"
      >
        {{ $t('home.flip.title') }}
      </FTitleH2>

      <h3
        class="mt-5 text-lg lg:text-xl text-base-content/85 max-w-xl leading-relaxed"
      >
        {{ $t('home.flip.subtitle') }}
      </h3>

      <p
        class="mt-8 max-w-2xl text-base lg:text-lg leading-relaxed mission-line"
      >
        {{ $t('home.flip.body') }}
      </p>
    </div>
  </section>
</template>

<style>
@property --illumination {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
</style>

<style scoped>
.dawn-bg {
  background-image: url('/images/home/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: brightness(calc(0.12 + 0.88 * var(--illumination, 0)))
    saturate(calc(0.2 + 0.8 * var(--illumination, 0)));
}

.night-layer {
  background:
    radial-gradient(
      120% 100% at 20% 50%,
      rgba(8, 10, 24, 0.7),
      rgba(12, 14, 28, 0.5) 60%,
      transparent 100%
    ),
    linear-gradient(
      90deg,
      rgba(6, 8, 20, 0.75),
      rgba(10, 12, 26, 0.4) 50%,
      transparent 80%
    );
  opacity: calc(1 - var(--illumination, 0) * 0.85);
}

.dawn-layer {
  background: radial-gradient(
    90% 110% at 78% 45%,
    rgba(255, 220, 140, 0.7),
    rgba(245, 184, 6, 0.42) 45%,
    rgba(245, 160, 40, 0.18) 70%,
    transparent 100%
  );
  opacity: var(--illumination, 0);
}

.border-frame {
  border: 1px solid
    oklch(
      calc(0.7 + 0.2 * var(--illumination, 0))
        calc(0.12 + 0.06 * var(--illumination, 0))
        calc(85 + 10 * var(--illumination, 0))
    );
  margin: 0.5rem;
  pointer-events: none;
  box-shadow: 0 0 calc(40px * var(--illumination, 0))
    rgba(245, 184, 6, calc(0.25 * var(--illumination, 0)));
}

.left-label {
  color: rgba(200, 205, 230, calc(0.55 - var(--illumination, 0) * 0.45));
}
.right-label {
  color: rgba(245, 184, 6, calc(0.35 + var(--illumination, 0) * 0.6));
}

.mission-line {
  color: rgba(230, 232, 240, calc(0.7 + var(--illumination, 0) * 0.25));
}

.flip-section h2 {
  color: oklch(
    calc(0.82 + 0.08 * var(--illumination, 0))
      calc(0.02 + 0.1 * var(--illumination, 0))
      calc(250 - 165 * var(--illumination, 0))
  );
}
</style>
