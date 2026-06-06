<template>
  <nuxt-link
    :to="postPath"
    class="group flex flex-col gap-5 rounded-[2rem] border border-base-content/10 bg-base-100 p-6 transition hover:border-primary/30 hover:shadow-lg md:flex-row md:gap-8 md:p-8"
  >
    <!-- meta column -->
    <div
      class="flex shrink-0 flex-col justify-between gap-4 md:w-48 md:border-r md:border-base-content/10 md:pr-4"
    >
      <div v-if="author" class="flex items-center justify-between gap-3">
        <div class="avatar" :class="{ 'avatar-placeholder': !author.avatar }">
          <div
            class="size-16 rounded-full bg-slate-100/20 dark:bg-base-300/20 text-base-content/70"
            :class="{ 'ring-1 ring-base-content/10': author.avatar }"
          >
            <img
              v-if="author.avatar"
              :src="author.avatar"
              :alt="author.name"
              loading="lazy"
            />
            <span v-else class="text-sm font-semibold">{{ initials }}</span>
          </div>
        </div>
        <div class="leading-tight text-end">
          <span class="block text-xs text-base-content/50">{{
            $t('blog.writtenBy')
          }}</span>
          <span class="text-sm font-medium">{{ author.name }}</span>
        </div>
      </div>

      <span class="text-xs uppercase tracking-wider text-primary/80 text-end">
        {{ formattedDate }}
      </span>
    </div>

    <!-- main column -->
    <div class="flex flex-1 flex-col gap-4">
      <h2
        class="font-[Archivo] text-2xl font-semibold leading-snug transition-colors group-hover:text-primary"
      >
        {{ post.title }}
      </h2>

      <ContentRenderer
        v-if="excerptBody"
        :value="{ body: excerptBody }"
        class="prose prose-sm max-w-none text-base-content/70"
      />

      <div class="mt-auto flex justify-end pt-2">
        <!-- Not a real link/button: the whole card is the link. -->
        <div
          class="btn btn-md btn-primary transition-[transform,box-shadow] group-hover:-translate-y-0.5 group-hover:shadow-md group-active:-translate-y-0 group-active:shadow-none"
        >
          {{ $t('blog.readMore') }}
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

type Author = { name: string; url?: string; avatar?: string };

const props = defineProps<{
  post: BlogCollectionItem & { date?: string; slug?: string };
  author?: Author;
}>();

const { $t, $getLocale, localePath } = useI18n();

const localeToBcp = { en: 'en-US', es: 'es-ES' } as const;

const formattedDate = computed(() => {
  const raw = (props.post.meta?.date ?? props.post.date) as string | undefined;
  if (!raw) return '';
  const bcp = localeToBcp[$getLocale() as keyof typeof localeToBcp] ?? 'en-US';
  return new Intl.DateTimeFormat(bcp, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(raw));
});

const postPath = computed(() => {
  const slug = (props.post.meta?.slug ?? props.post.slug) as string | undefined;
  if (slug) return localePath(`/blog/${slug}`);
  return props.post.path;
});

const initials = computed(() =>
  (props.author?.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join(''),
);

// The excerpt (content before `<!--more-->`) begins with the article's H1,
// which duplicates `post.title`. In Nuxt Content v3 the excerpt tree lives
// under `.value` as tuple nodes: `["tag", props, ...children]`.
// We (1) strip the leading heading and (2) turn any links into plain spans —
// the whole card is already a link, so a nested <a> would be invalid HTML.
type Node = string | [string, Record<string, unknown>, ...Node[]];

const isHeading = (n: Node) =>
  Array.isArray(n) && typeof n[0] === 'string' && /^h[1-6]$/.test(n[0]);

const deAnchor = (nodes: Node[]): Node[] =>
  nodes.map((n) => {
    if (!Array.isArray(n)) return n;
    const [tag, , ...kids] = n;
    const children = deAnchor(kids);
    if (tag === 'a') return ['span', {}, ...children];
    return [tag, n[1], ...children];
  });

const excerptBody = computed(() => {
  const ex = props.post.excerpt as
    | { type?: string; value?: Node[] }
    | undefined;
  if (!ex?.value) return ex;
  const value = deAnchor(ex.value.filter((n, i) => !(i < 2 && isHeading(n))));
  return { ...ex, value };
});
</script>
