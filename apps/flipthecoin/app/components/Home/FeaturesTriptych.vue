<script setup lang="ts">
const { $t, localePath } = useI18n();

const features = computed(() => [
  {
    key: 'play',
    href: '#hero',
    icon: 'M19 9V6a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v3M5 9h14m-14 0a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3M9 13h6',
    title: $t('home.features.play.title') as string,
    body: $t('home.features.play.body') as string,
  },
  {
    key: 'read',
    href: localePath('/blog'),
    icon: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 19.5zM8 7h8M8 11h8M8 15h5',
    title: $t('home.features.read.title') as string,
    body: $t('home.features.read.body') as string,
  },
  {
    key: 'install',
    href: localePath('/extension'),
    icon: 'M12 3v12m0 0l-4-4m4 4l4-4M5 21h14',
    title: $t('home.features.install.title') as string,
    body: $t('home.features.install.body') as string,
  },
]);
</script>

<template>
  <section class="container mx-auto px-4 lg:px-8 py-16">
    <h2
      class="font-[Archivo] text-3xl lg:text-4xl font-semibold mb-10 max-w-2xl"
    >
      {{ $t('home.features.title') }}
    </h2>
    <ul class="grid gap-6 md:grid-cols-3">
      <li v-for="feature in features" :key="feature.key">
        <NuxtLink
          :to="feature.href"
          class="group relative flex flex-col h-full p-6 rounded-2xl bg-base-200/70 hover:bg-base-200 transition-colors border border-base-content/5 hover:border-primary/30"
        >
          <span
            class="inline-flex items-center justify-center size-12 rounded-xl bg-primary/10 text-primary mb-5 group-hover:scale-105 transition-transform"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-6"
              aria-hidden="true"
            >
              <path :d="feature.icon" />
            </svg>
          </span>
          <h3 class="font-[Archivo] text-xl font-semibold mb-2">
            {{ feature.title }}
          </h3>
          <p class="text-base-content/70 text-sm leading-relaxed">
            {{ feature.body }}
          </p>
          <span
            aria-hidden="true"
            class="mt-4 text-primary text-sm font-medium opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition"
          >
            →
          </span>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
