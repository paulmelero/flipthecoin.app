<script setup lang="ts">
import ChromeIcon from '@brand/img/icons/google-chrome-logo-svgrepo-com.svg?component';

const { $t } = useI18n();

const STORE_URL =
  'https://chromewebstore.google.com/detail/afkjlnjcpgjiecnfhkokeohlmipchohc?utm_source=item-share-cb';
</script>

<template>
  <section class="container mx-auto px-4 lg:px-8 py-10 lg:py-16">
    <div
      class="relative grid gap-10 lg:grid-cols-2 items-center p-8 lg:p-12 rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-secondary/10 border border-primary/10 overflow-hidden"
    >
      <!-- Math backdrop decorations -->
      <span
        aria-hidden="true"
        class="absolute left-6 bottom-8 text-xs font-mono opacity-[0.08] dark:opacity-[0.12] -rotate-6 select-none"
      >
        P(H) = ½
      </span>
      <span
        aria-hidden="true"
        class="absolute right-6 lg:right-1/2 top-8 text-xs font-mono opacity-[0.08] dark:opacity-[0.12] rotate-3 select-none"
      >
        σ = √(np(1−p))
      </span>

      <div class="relative z-10">
        <p class="text-xs uppercase tracking-[0.2em] text-primary mb-3">
          {{ $t('extension.hero.eyebrow') }}
        </p>
        <h1 class="font-[Archivo] text-3xl lg:text-4xl font-semibold mb-4">
          {{ $t('extension.hero.title') }}
        </h1>
        <p class="text-base-content/75 text-lg leading-relaxed mb-8 max-w-lg">
          {{ $t('extension.hero.body') }}
        </p>
        <div class="flex flex-wrap gap-3 mb-4">
          <a
            :href="STORE_URL"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary"
          >
            <ChromeIcon
              class="size-4 shrink-0"
              fill="currentColor"
              aria-hidden="true"
            />
            {{ $t('extension.hero.addToChrome') }}
          </a>
          <a href="#install" class="btn btn-outline">
            <ChromeIcon
              class="size-4 shrink-0"
              fill="currentColor"
              aria-hidden="true"
            />
            {{ $t('extension.hero.installFromSource') }}
          </a>
        </div>
        <p class="text-sm text-base-content/50 font-mono">
          {{ $t('extension.hero.firefoxComingSoon') }}
        </p>
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
