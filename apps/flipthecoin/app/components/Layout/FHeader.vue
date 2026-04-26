<script setup lang="ts">
import { ref, watch, computed } from 'vue';

const { $t, localePath } = useI18n();

const navLinks = computed(() => [
  { to: localePath('/'), label: $t('nav.home') as string },
  { to: localePath('/play'), label: $t('nav.play') as string },
  { to: localePath('/blog'), label: $t('nav.blog') as string },
  { to: localePath('/extension'), label: $t('nav.extension') as string },
]);

const dropdownRef = ref<HTMLDetailsElement | null>(null);
const route = useRoute();

const closeDropdown = () => {
  if (dropdownRef.value) {
    dropdownRef.value.open = false;
  }
};

watch(() => route.path, closeDropdown);
</script>

<template>
  <header class="navbar container mx-auto py-5">
    <div class="navbar-start w-full md:w-fit">
      <nuxt-link :to="localePath('/')">
        <BrandLogo />
      </nuxt-link>
    </div>
    <nav class="navbar-end md:w-full flex gap-4 md:gap-2">
      <div class="isolate z-10 md:hidden">
        <details ref="dropdownRef" class="dropdown dropdown-end">
          <summary class="btn btn-square">
            <span class="sr-only"> open or close </span>

            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-5 w-5 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </summary>
          <div
            aria-live="polite"
            class="dropdown-content bg-base-200 rounded-box w-52 p-2 mt-2 shadow-sm flex flex-col gap-2"
          >
            <ul class="menu w-full p-0 gap-1">
              <li v-for="link in navLinks" :key="link.to">
                <nuxt-link :to="link.to">{{ link.label }}</nuxt-link>
              </li>
            </ul>
            <div
              class="border-t border-base-content/10 pt-2 px-2 flex items-center justify-between gap-2"
            >
              <NavigationLocaleSwitcher />
              <NavigationThemeSwitcher />
            </div>
          </div>
        </details>
      </div>
      <ul class="menu menu-horizontal gap-2 hidden md:inline-flex">
        <li v-for="link in navLinks" :key="link.to">
          <nuxt-link :to="link.to">{{ link.label }}</nuxt-link>
        </li>
      </ul>
      <div class="hidden md:flex items-center gap-2">
        <NavigationLocaleSwitcher />
        <NavigationThemeSwitcher />
      </div>
    </nav>
  </header>
</template>
