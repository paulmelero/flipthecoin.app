<script setup lang="ts">
const { $t, localePath } = useI18n();
</script>

<template>
  <section class="relative isolate overflow-hidden bg-base-200/60 rounded-2xl">
    <HomeHeroMathBackdrop class="text-base-content" />

    <div
      class="container mx-auto px-4 lg:px-8 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10"
    >
      <div class="lg:col-span-7 order-2 lg:order-1">
        <p
          class="inline-flex items-center gap-2 text-sm font-mono text-base-content/60 mb-4"
        >
          <span class="inline-block w-1.5 h-1.5 rounded-full bg-primary"></span>
          flipthecoin.app
        </p>
        <FTitle class="!mb-4">{{ $t('hero.title') }}</FTitle>
        <p class="text-lg lg:text-xl text-base-content/80 mb-8 max-w-2xl">
          {{ $t('app.description') }}
        </p>
        <div class="flex flex-wrap items-center gap-3">
          <NuxtLink :to="localePath('/play')" class="btn btn-primary btn-lg">
            {{ $t('home.hero.playCta') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/blog')" class="btn btn-ghost btn-lg">
            {{ $t('hero.secondaryCta') }}
          </NuxtLink>
        </div>
      </div>

      <div class="lg:col-span-5 order-1 lg:order-2">
        <NuxtLink
          :to="localePath('/play')"
          class="group relative block w-full max-w-[460px] aspect-square mx-auto rounded-3xl bg-gradient-to-br from-primary/25 via-primary/5 to-secondary/20 border border-primary/15 shadow-2xl backdrop-blur-sm transition-transform duration-500 hover:-rotate-2 hover:scale-[1.02] overflow-hidden"
        >
          <div
            aria-hidden="true"
            class="absolute inset-0 opacity-70"
            style="
              background-image:
                radial-gradient(
                  60% 60% at 30% 30%,
                  rgba(255, 235, 150, 0.55),
                  transparent 60%
                ),
                radial-gradient(
                  50% 50% at 75% 75%,
                  rgba(212, 175, 55, 0.4),
                  transparent 60%
                );
            "
          ></div>
          <img
            src="/img/head.webp"
            alt=""
            class="absolute inset-0 m-auto w-2/3 h-2/3 object-contain drop-shadow-[0_20px_30px_rgba(212,175,55,0.45)] transition-transform duration-500 group-hover:scale-105"
          />
          <span
            class="absolute bottom-4 inset-x-4 text-center text-xs font-mono uppercase tracking-[0.25em] text-base-content/70 group-hover:text-primary transition"
          >
            {{ $t('home.hero.playHint') }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
