<script setup lang="ts">
const { $t } = useI18n();
</script>

<template>
  <section
    id="flip-the-unknown"
    class="flip-section relative min-h-[100dvh] overflow-hidden"
    style="--illumination: 0"
  >
    <!-- Night base -->
    <div aria-hidden="true" class="night-layer absolute inset-0"></div>
    <!-- Dawn glow that grows from the coin (rightward), tied to --illumination -->
    <div aria-hidden="true" class="dawn-layer absolute inset-0"></div>
    <!-- Animated gradient border frame -->
    <div aria-hidden="true" class="border-frame absolute inset-0"></div>

    <div
      class="relative z-10 container mx-auto px-4 lg:px-8 min-h-[100dvh] flex flex-col justify-center"
    >
      <!-- Side labels -->
      <div
        class="grid grid-cols-2 gap-4 mb-10 lg:mb-16 text-sm font-mono uppercase tracking-[0.2em]"
      >
        <span class="left-label">{{ $t('home.flip.left') }}</span>
        <span class="right-label text-right">{{ $t('home.flip.right') }}</span>
      </div>

      <!-- Headline -->
      <h2
        class="font-headings font-[500] tracking-tight text-4xl md:text-6xl leading-[1.05] max-w-4xl"
      >
        {{ $t('home.flip.title') }}
      </h2>

      <!-- Subtitle -->
      <p
        class="mt-5 text-lg lg:text-xl text-base-content/85 max-w-xl leading-relaxed"
      >
        {{ $t('home.flip.subtitle') }}
      </p>

      <!-- Mission line -->
      <p
        class="mt-10 lg:mt-14 max-w-2xl text-base lg:text-lg leading-relaxed mission-line"
      >
        {{ $t('home.flip.body') }}
      </p>
    </div>
  </section>
</template>

<style>
/* Register --illumination as an animatable number so CSS calc() math and
   opacity transitions interpolate smoothly when GSAP sets it. */
@property --illumination {
  syntax: '<number>';
  inherits: true;
  initial-value: 0;
}
</style>

<style scoped>
.flip-section {
  /* Section sits above the fixed coin canvas (z-0). Give it a transparent
     core so the 3D coin shows through; only the layers below paint. */
  background: transparent;
  /* Dawn halo: stacked amber-tinted box-shadows that bloom as the coin
     illuminates the section. Tinted to the brand hue, no pure-black. */
  box-shadow:
    inset 0 0 calc(120px * var(--illumination, 0))
      rgba(245, 184, 6, calc(0.18 * var(--illumination, 0))),
    inset 0 0 calc(260px * var(--illumination, 0))
      rgba(255, 210, 122, calc(0.12 * var(--illumination, 0)));
}

/* Night base: a translucent dark wash — thin enough for the 3D coin (z-0,
   behind main) to glow through, thick enough to read as night. Recedes as
   dawn rises. */
.night-layer {
  background:
    radial-gradient(
      120% 100% at 20% 50%,
      rgba(8, 10, 24, 0.55),
      rgba(12, 14, 28, 0.4) 60%,
      transparent 100%
    ),
    linear-gradient(
      90deg,
      rgba(6, 8, 20, 0.6),
      rgba(10, 12, 26, 0.35) 50%,
      transparent 80%
    );
  opacity: calc(1 - var(--illumination, 0) * 0.85);
}

/* Dawn layer: warm amber sunrise pouring in from the right, intensity tied
   to illumination. The gradient edge reads as the moving day/night divide. */
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

/* Animated gradient border frame — reuses the brand gradient-border pattern,
   brightened and swept as illumination rises. */
.border-frame {
  border: 1px solid
    oklch(
      calc(0.7 + 0.2 * var(--illumination, 0))
        calc(0.12 + 0.06 * var(--illumination, 0))
        calc(85 + 10 * var(--illumination, 0))
    );
  border-radius: 1rem;
  margin: 0.5rem;
  pointer-events: none;
  box-shadow: 0 0 calc(40px * var(--illumination, 0))
    rgba(245, 184, 6, calc(0.25 * var(--illumination, 0)));
}

/* Side labels: the night label fades/desaturates as light arrives; the day
   label warms up. */
.left-label {
  color: rgba(200, 205, 230, calc(0.55 - var(--illumination, 0) * 0.45));
}
.right-label {
  color: rgba(245, 184, 6, calc(0.35 + var(--illumination, 0) * 0.6));
}

.mission-line {
  color: rgba(230, 232, 240, calc(0.7 + var(--illumination, 0) * 0.25));
}

/* The headline warms from cool-white toward amber as dawn breaks. */
.flip-section h2 {
  color: oklch(
    calc(0.82 + 0.08 * var(--illumination, 0))
      calc(0.02 + 0.1 * var(--illumination, 0))
      calc(250 - 165 * var(--illumination, 0))
  );
}

/* Mobile: the split reads as a vertical night→dawn gradient instead of a
   hard left/right divide. */
@media (max-width: 767px) {
  .night-layer,
  .dawn-layer {
    background-size: 100% 100%;
  }
}
</style>
