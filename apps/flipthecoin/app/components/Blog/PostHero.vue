<template>
  <LayoutMathPanel class="not-prose">
    <div class="relative z-10">
      <p
        v-if="formattedDate"
        class="text-xs uppercase tracking-[0.2em] text-primary mb-3"
      >
        {{ formattedDate }}
      </p>

      <h1 class="font-[Archivo] text-3xl lg:text-4xl font-semibold mb-6">
        {{ post.title }}
      </h1>

      <div v-if="author" class="flex items-center justify-end gap-3">
        <div class="avatar" :class="{ 'avatar-placeholder': !author.avatar }">
          <div
            class="size-12 rounded-full bg-slate-100/20 dark:bg-base-300/20 text-base-content/70"
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
        <div class="leading-tight">
          <span class="block text-xs text-base-content/50">{{
            $t('blog.writtenBy')
          }}</span>
          <span class="text-sm font-medium">{{ author.name }}</span>
        </div>
      </div>
    </div>
  </LayoutMathPanel>
</template>

<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

type Author = { name: string; url?: string; avatar?: string };

const props = defineProps<{
  post: BlogCollectionItem & { date?: string };
  author?: Author;
}>();

const { $t, $getLocale } = useI18n();

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

const initials = computed(() =>
  (props.author?.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join(''),
);
</script>
