<template>
  <ul class="menu menu-horizontal flex gap-2 isolate">
    <li v-for="locale in locales" :key="locale.code">
      <NuxtLink
        :to="targetsFor(locale.code)"
        :aria-label="$t(locale.labelKey) as string"
        :title="
          (($t('langSwitcher.title') as string) +
            ' ' +
            $t(locale.labelKey)) as string
        "
        :aria-current="$getLocale() === locale.code ? 'true' : undefined"
        class="px-2 py-2 transition-opacity"
        :class="{
          'cursor-default opacity-50 pointer-events-none active':
            $getLocale() === locale.code,
          'hover:opacity-80': $getLocale() !== locale.code,
        }"
      >
        {{ locale.flag }}
      </NuxtLink>
    </li>
  </ul>
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

// Collections whose detail pages use per-locale slugs. Switching locale on these
// must map to the SIBLING's translated slug (via the shared filename stem), not
// reuse the current slug under the other prefix — that would link to a
// non-existent page and get crawled into soft-404 ghosts at build time.
const SLUG_ROUTES = [
  { collection: 'blog', prefix: '/blog', pattern: /\/blog\/([^/?#]+)\/?$/ },
  {
    collection: 'glossary',
    prefix: '/glossary',
    pattern: /\/glossary\/([^/?#]+)\/?$/,
  },
] as const;

const matchedRoute = computed(() => {
  for (const cfg of SLUG_ROUTES) {
    const match = route.path.match(cfg.pattern);
    if (match) return { ...cfg, slug: decodeURIComponent(match[1] ?? '') };
  }
  return null;
});

const { data: siblings } = await useAsyncData(
  () => `locale-switcher-${$getLocale()}-${route.path}`,
  async () => {
    const ctx = matchedRoute.value;
    if (!ctx) return null;
    const current = await queryCollection(ctx.collection)
      .where('slug', '=', ctx.slug)
      .where('_locale', '=', $getLocale())
      .first();
    if (!current?.stem) return null;
    const baseStem = String(current.stem).replace(/\.[a-z]{2}$/i, '');
    const rows = await queryCollection(ctx.collection)
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
  { watch: [() => route.path, () => $getLocale()] },
);

const targetsFor = (code: LocaleCode) => {
  if ($getLocale() === code) return route.path;

  const ctx = matchedRoute.value;
  if (ctx) {
    const siblingSlug = siblings.value?.[code];
    // Translated slug when the sibling exists; otherwise fall back to the
    // section index rather than emitting a wrong-slug (soft-404) link.
    return pathForLocale(
      code,
      siblingSlug ? `${ctx.prefix}/${siblingSlug}` : ctx.prefix,
    );
  }
  return $switchLocaleRoute(code);
};
</script>
