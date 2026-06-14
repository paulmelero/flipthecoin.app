<template>
  <section class="flex flex-col gap-6">
    <header
      class="flex flex-col gap-2 rounded-[2rem] border border-primary/20 bg-primary/5 p-6 md:p-8"
    >
      <div class="flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          class="text-xs font-semibold uppercase tracking-wider text-primary/80"
        >
          {{ $t('blog.series.count', { n: members.length }) }}
        </span>
        <span v-if="seriesAuthor" class="text-primary/40" aria-hidden="true"
          >·</span
        >
        <span
          v-if="seriesAuthor"
          class="flex items-center gap-1.5 text-xs text-base-content/60"
        >
          <span
            class="avatar"
            :class="{ 'avatar-placeholder': !seriesAuthor.avatar }"
          >
            <span
              class="size-5 rounded-full bg-slate-100/20 text-base-content/70 dark:bg-base-300/20"
              :class="{ 'ring-1 ring-base-content/10': seriesAuthor.avatar }"
            >
              <img
                v-if="seriesAuthor.avatar"
                :src="seriesAuthor.avatar"
                :alt="seriesAuthor.name"
                loading="lazy"
              />
              <span v-else class="text-[0.6rem] font-semibold">{{
                authorInitials
              }}</span>
            </span>
          </span>
          {{ $t('blog.writtenBy') }} {{ seriesAuthor.name }}
        </span>
      </div>
      <FTitle as="h2">
        <nuxt-link
          :to="localePath('/blog/series/' + slug)"
          class="transition-colors hover:text-primary"
        >
          {{ series.title }}
        </nuxt-link>
      </FTitle>
      <p v-if="series.description" class="text-base-content/70">
        {{ series.description }}
      </p>
      <nuxt-link
        :to="localePath('/blog/series/' + slug)"
        class="text-sm font-semibold text-primary transition-colors hover:text-primary/70"
      >
        {{ $t('blog.series.viewSeries') }}
      </nuxt-link>
    </header>

    <ol class="flex flex-col gap-6">
      <li
        v-for="(member, i) in members"
        :key="member.path"
        class="flex flex-col gap-2"
      >
        <span
          class="pl-2 text-xs font-semibold uppercase tracking-wider text-primary/70"
        >
          {{ $t('blog.series.partOf', { n: i + 1, total: members.length }) }}
        </span>
        <BlogPost :post="member" :in-series="true" />
      </li>
    </ol>
  </section>
</template>

<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

type Author = { name: string; url?: string; avatar?: string };

const props = defineProps<{
  series: { title: string; description: string };
  slug: string;
  members: BlogCollectionItem[];
  authorFor: (post: BlogCollectionItem) => Author | undefined;
}>();

const { $t, localePath } = useI18n();

// A series is written by a single author, so derive it once from the first
// member and show it in the header instead of repeating it on every post.
const seriesAuthor = computed(() =>
  props.members.length ? props.authorFor(props.members[0]!) : undefined,
);

const authorInitials = computed(() =>
  (seriesAuthor.value?.name ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join(''),
);
</script>
