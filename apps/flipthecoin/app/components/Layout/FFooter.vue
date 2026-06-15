<script setup lang="ts">
const { $t, localePath } = useI18n();
</script>

<template>
  <div class="bg-neutral text-neutral-content">
    <div class="container mx-auto">
      <footer class="footer py-6 px-4 lg:px-8">
        <FQuote class="flex gap-4">
          <em>{{ $t('footer.quote') }}</em
          ><br /><span>{{ $t('footer.quoteAuthor') }}</span>
        </FQuote>
      </footer>
      <footer
        class="footer py-8 px-4 lg:px-8 bg-neutral text-neutral-content mx-auto"
      >
        <aside class="flex items-center text-neutral-content">
          <BrandLogo />
        </aside>

        <nav class="mb-4">
          <h4 class="footer-title">
            <span class="text-lg font-bold">{{ $t('footer.company') }}</span>
          </h4>
          <NuxtLink :to="localePath('/about-us')">{{
            $t('footer.aboutUs')
          }}</NuxtLink>
        </nav>

        <nav class="mb-4">
          <h4 class="footer-title">
            <span class="text-lg font-bold">{{ $t('footer.projects') }}</span>
          </h4>
          <NuxtLink :to="localePath('/blog')">{{ $t('footer.blog') }}</NuxtLink>
          <NuxtLink :to="localePath('/glossary')">{{
            $t('footer.glossary')
          }}</NuxtLink>
          <NuxtLink :to="localePath('/extension')">{{
            $t('footer.extension')
          }}</NuxtLink>
        </nav>

        <nav class="mb-4">
          <h4 class="footer-title">
            <span class="text-lg font-bold">{{ $t('footer.legal') }}</span>
          </h4>
          <NuxtLink :to="localePath('/privacy-policy')">{{
            $t('footer.privacy')
          }}</NuxtLink>
          <NuxtLink :to="localePath('/terms')">{{
            $t('footer.terms')
          }}</NuxtLink>
        </nav>
      </footer>
      <footer
        class="footer py-8 px-4 lg:px-8 bg-neutral text-neutral-content mx-auto"
      >
        <span>{{
          $t('footer.copyright', { year: new Date().getFullYear() })
        }}</span>
        <div class="flex justify-end w-full"><NavigationThemeSwitcher /></div>
      </footer>
    </div>
  </div>
</template>
