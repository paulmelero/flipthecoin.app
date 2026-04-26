<script setup lang="ts">
const { $t, localePath } = useI18n();
</script>

<template>
  <section class="container mx-auto px-4 lg:px-8 py-16">
    <div
      class="relative grid gap-10 lg:grid-cols-2 items-center p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/10 border border-primary/10 overflow-hidden"
    >
      <div class="relative z-10">
        <p class="text-xs uppercase tracking-[0.2em] text-primary mb-3">
          {{ $t('home.extension.eyebrow') }}
        </p>
        <h2 class="font-[Archivo] text-3xl lg:text-4xl font-semibold mb-4">
          {{ $t('home.extension.title') }}
        </h2>
        <p class="text-base-content/75 text-lg leading-relaxed mb-8 max-w-lg">
          {{ $t('home.extension.body') }}
        </p>
        <div class="flex flex-wrap gap-3">
          <NuxtLink :to="localePath('/extension')" class="btn btn-primary">
            {{ $t('home.extension.installChrome') }}
          </NuxtLink>
          <NuxtLink :to="localePath('/extension')" class="btn btn-outline">
            {{ $t('home.extension.installFirefox') }}
          </NuxtLink>
        </div>
      </div>

      <div class="relative flex justify-center lg:justify-end">
        <div
          class="relative w-[260px] h-[360px] rounded-3xl bg-base-100 shadow-2xl border border-base-content/10 p-3 flex flex-col gap-3 -rotate-3 hover:rotate-0 transition-transform duration-500"
        >
          <div
            class="flex items-center justify-between px-2 py-1 border-b border-base-content/5"
          >
            <BrandMark :size="20" />
            <div class="flex gap-1">
              <span class="size-1.5 rounded-full bg-base-content/20"></span>
              <span class="size-1.5 rounded-full bg-base-content/20"></span>
              <span class="size-1.5 rounded-full bg-base-content/20"></span>
            </div>
          </div>
          <div
            class="flex-1 rounded-xl bg-gradient-to-br from-base-200 to-base-300 flex items-center justify-center"
          >
            <BrandMark :size="120" />
          </div>
          <button class="btn btn-primary btn-sm w-full pointer-events-none">
            {{ $t('hero.cta') }}
          </button>
          <ul class="space-y-1.5">
            <li
              v-for="i in 3"
              :key="i"
              class="flex items-center gap-2 text-xs text-base-content/60"
            >
              <span class="size-2 rounded-full bg-primary/40"></span>
              <span class="flex-1 h-1.5 rounded-full bg-base-content/10"></span>
            </li>
          </ul>
        </div>

        <div
          aria-hidden="true"
          class="absolute -top-6 -right-4 text-5xl font-mono text-primary/20 select-none rotate-12"
        >
          ½
        </div>
      </div>
    </div>
  </section>
</template>
