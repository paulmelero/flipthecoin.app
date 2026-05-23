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
    <div class="grid gap-3 w-full">
      <div
        v-for="(item, i) in items"
        :key="i"
        class="collapse collapse-arrow border border-base-content/10 bg-base-200/50"
      >
        <input type="radio" name="faq-accordion" :aria-label="item.q" />
        <div class="collapse-title font-[Archivo] font-semibold text-base">
          {{ item.q }}
        </div>
        <div
          class="collapse-content text-base-content/75 text-sm leading-relaxed"
        >
          {{ item.a }}
        </div>
      </div>
    </div>
  </section>
</template>
