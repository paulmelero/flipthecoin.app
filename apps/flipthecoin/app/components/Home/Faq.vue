<script setup lang="ts">
const { $t } = useI18n();

const items = computed(() => [
  { q: $t('faq.q1') as string, a: $t('faq.a1') as string },
  { q: $t('faq.q2') as string, a: $t('faq.a2') as string },
  { q: $t('faq.q3') as string, a: $t('faq.a3') as string },
  { q: $t('faq.q4') as string, a: $t('faq.a4') as string },
]);
</script>

<template>
  <section class="container mx-auto px-4 lg:px-8 py-16">
    <h2 class="font-[Archivo] text-3xl lg:text-4xl font-semibold mb-10">
      {{ $t('faq.title') }}
    </h2>
    <dl class="grid gap-3 max-w-3xl">
      <details
        v-for="(item, i) in items"
        :key="i"
        class="group rounded-2xl border border-base-content/10 bg-base-200/50 open:bg-base-200 transition-colors"
      >
        <summary
          class="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 font-[Archivo] font-semibold text-base select-none list-none"
        >
          <dt>{{ item.q }}</dt>
          <span
            aria-hidden="true"
            class="shrink-0 text-primary transition-transform group-open:rotate-45"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="size-5"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
        </summary>
        <dd class="px-6 pb-5 pt-1 text-base-content/75 text-sm leading-relaxed">
          {{ item.a }}
        </dd>
      </details>
    </dl>
  </section>
</template>
