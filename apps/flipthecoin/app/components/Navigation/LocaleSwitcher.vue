<template>
  <div class="flex gap-2 isolate">
    <NuxtLink
      v-for="locale in locales"
      :key="locale.code"
      :to="targetsFor(locale.code)"
      :aria-label="$t(locale.labelKey) as string"
      :aria-current="$getLocale() === locale.code ? 'true' : undefined"
      class="btn btn-ghost px-2 py-2 transition-opacity"
      :class="{
        'cursor-default opacity-50 pointer-events-none':
          $getLocale() === locale.code,
        'hover:opacity-80': $getLocale() !== locale.code,
      }"
      @click="$switchLocale(locale.code)"
    >
      {{ locale.flag }}
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { queryCollection, useAsyncData, useRoute } from '#imports';

const { $t, $switchLocale, $getLocale, $switchLocaleRoute, $defaultLocale } =
  useI18n();
const route = useRoute();

const defaultLocale = $defaultLocale?.() ?? 'en';

const pathForLocale = (code: string, path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (code === defaultLocale) return normalized;
  return `/${code}${normalized === '/' ? '' : normalized}`;
};

const locales = [
  { code: 'en', labelKey: 'langEnglish', flag: '🇬🇧' },
  { code: 'es', labelKey: 'langSpanish', flag: '🇪🇸' },
] as const;

type LocaleCode = (typeof locales)[number]['code'];

const blogPathPattern = /\/blog\/([^/?#]+)\/?$/;

const currentBlogSlug = computed(() => {
  const match = route.path.match(blogPathPattern);
  return match ? decodeURIComponent(match[1] ?? '') : null;
});

const { data: blogSiblings } = await useAsyncData(
  () => `locale-switcher-blog-${$getLocale()}-${currentBlogSlug.value}`,
  async () => {
    if (!currentBlogSlug.value) return null;
    const current = await queryCollection('blog')
      .where('slug', '=', currentBlogSlug.value)
      .where('_locale', '=', $getLocale())
      .first();
    if (!current?.stem) return null;
    const baseStem = String(current.stem).replace(/\.[a-z]{2}$/i, '');
    const rows = await queryCollection('blog')
      .where('stem', 'LIKE', `${baseStem}.%`)
      .all();
    const map: Record<string, string> = {};
    for (const row of rows) {
      if (row._locale && row.slug) {
        map[row._locale as string] = row.slug as string;
      }
    }
    return map;
  },
  { watch: [currentBlogSlug, () => $getLocale()] },
);

const targetsFor = (code: LocaleCode) => {
  if ($getLocale() === code) return route.path;

  const siblingSlug = blogSiblings.value?.[code];
  if (siblingSlug) {
    return pathForLocale(code, `/blog/${siblingSlug}`);
  }
  if (currentBlogSlug.value) {
    return pathForLocale(code, '/blog');
  }
  return $switchLocaleRoute(code);
};
</script>
