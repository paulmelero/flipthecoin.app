<script setup lang="ts">
const { $t, $getLocale, localePath } = useI18n();
const locale = computed(() => $getLocale());

const localeToBcp = { en: 'en-US', es: 'es-ES' } as const;

const { data } = await useAsyncData(
  () => `home-recent-${locale.value}`,
  () =>
    queryCollection('blog')
      .where('_locale', '=', locale.value)
      .order('date', 'DESC')
      .limit(3)
      .all(),
  { watch: [locale] },
);

const posts = computed(
  () => data.value?.filter((p) => p.meta?.published !== false) ?? [],
);

const formatDate = (raw: string | undefined) => {
  if (!raw) return '';
  const bcp = localeToBcp[locale.value as keyof typeof localeToBcp] ?? 'en-US';
  return new Intl.DateTimeFormat(bcp, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(raw));
};

const postHref = (post: (typeof posts.value)[number]) => {
  const slug = (post.meta?.slug ?? post.slug) as string | undefined;
  return slug ? localePath(`/blog/${slug}`) : post.path;
};
</script>

<template>
  <section v-if="posts.length" class="container mx-auto px-4 lg:px-8 py-16">
    <div class="flex items-end justify-between mb-8 flex-wrap gap-3">
      <h2 class="font-[Archivo] text-3xl lg:text-4xl font-semibold">
        {{ $t('home.recent.title') }}
      </h2>
      <NuxtLink
        :to="localePath('/blog')"
        class="link link-hover text-base-content/70 hover:text-primary"
      >
        {{ $t('home.recent.viewAll') }}
      </NuxtLink>
    </div>
    <ul class="grid gap-6 md:grid-cols-3">
      <li v-for="post in posts" :key="post.path">
        <NuxtLink
          :to="postHref(post)"
          class="group flex flex-col h-full p-6 rounded-2xl bg-base-100 border border-base-content/5 hover:border-primary/30 hover:shadow-md transition"
        >
          <span class="text-xs uppercase tracking-wider text-primary/80 mb-2">
            {{ formatDate(post.meta?.date as string | undefined) }}
          </span>
          <h3
            class="font-[Archivo] text-xl font-semibold mb-3 group-hover:text-primary transition-colors"
          >
            {{ post.title }}
          </h3>
          <p
            v-if="post.description"
            class="text-base-content/70 text-sm leading-relaxed line-clamp-3"
          >
            {{ post.description }}
          </p>
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
