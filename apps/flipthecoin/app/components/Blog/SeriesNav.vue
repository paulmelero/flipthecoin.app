<template>
  <nav
    v-if="members.length"
    class="flex flex-col gap-5 rounded-[2rem] border border-primary/20 bg-primary/5 p-6 md:p-8"
  >
    <div class="flex flex-col gap-1">
      <span
        class="text-xs font-semibold uppercase tracking-wider text-primary/80"
      >
        {{ $t('blog.series.label') }}
      </span>
      <h2 class="font-[Archivo] text-xl font-bold leading-snug">
        {{ series.title }}
      </h2>
      <p v-if="currentIndex >= 0" class="text-sm text-base-content/60">
        {{
          $t('blog.series.partOf', {
            n: currentIndex + 1,
            total: members.length,
          })
        }}
      </p>
    </div>

    <ol class="flex flex-col gap-1">
      <li v-for="(member, i) in members" :key="member.path">
        <nuxt-link
          v-if="i !== currentIndex"
          :to="pathFor(member)"
          class="flex items-baseline gap-3 rounded-xl px-3 py-2 transition hover:bg-base-content/5"
        >
          <span class="text-sm">{{ member.title }}</span>
        </nuxt-link>
        <div
          v-else
          aria-current="true"
          class="flex items-baseline gap-3 rounded-xl bg-base-content/5 px-3 py-2"
        >
          <span class="shrink-0 text-xs font-semibold text-primary">📍</span>
          <span class="text-sm font-semibold">{{ member.title }}</span>
        </div>
      </li>
    </ol>

    <div
      class="flex justify-between gap-4 border-t border-base-content/10 pt-4"
    >
      <nuxt-link v-if="prev" :to="pathFor(prev)" class="btn btn-sm btn-ghost">
        ← {{ $t('blog.series.prev') }}
      </nuxt-link>
      <span v-else />
      <nuxt-link v-if="next" :to="pathFor(next)" class="btn btn-sm btn-ghost">
        {{ $t('blog.series.next') }} →
      </nuxt-link>
      <span v-else />
    </div>
  </nav>
</template>

<script setup lang="ts">
import type { BlogCollectionItem } from '@nuxt/content';

const props = defineProps<{
  series: { title: string };
  members: BlogCollectionItem[];
  currentSlug: string;
}>();

const { $t, localePath } = useI18n();

const slugOf = (member: BlogCollectionItem) =>
  ((member.meta?.slug ?? member.slug) as string | undefined) ?? '';

const currentIndex = computed(() =>
  props.members.findIndex((m) => slugOf(m) === props.currentSlug),
);

const prev = computed(() =>
  currentIndex.value > 0 ? props.members[currentIndex.value - 1] : null,
);

const next = computed(() =>
  currentIndex.value >= 0 && currentIndex.value < props.members.length - 1
    ? props.members[currentIndex.value + 1]
    : null,
);

const pathFor = (member: BlogCollectionItem) => {
  const slug = slugOf(member);
  return slug ? localePath(`/blog/${slug}`) : (member.path as string);
};
</script>
