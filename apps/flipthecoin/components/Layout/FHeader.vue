<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from '#app';

interface NavLink {
  to: string;
  label: string;
}

const navLinks: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/blog', label: 'Blog' },
  { to: '/extension', label: 'Browser Extension' },
];

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
  <header class="navbar bg-base-100 container mx-auto py-5">
    <div class="navbar-start">
      <nuxt-link to="/" class="flex items-center">
        <BrandLogo />
      </nuxt-link>
    </div>
    <nav class="navbar-end flex gap-4 md:gap-2">
      <div class="isolate z-10">
        <details ref="dropdownRef" class="dropdown md:hidden">
          <summary class="btn btn-square md:hidden">
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
          <ul
            aria-live="polite"
            class="dropdown menu bg-base-200 rounded-box w-52 p-2 z-1 absolute right-0 top-14 shadow-sm md:hidden"
          >
            <li v-for="link in navLinks" :key="link.to">
              <nuxt-link :to="link.to">{{ link.label }}</nuxt-link>
            </li>
          </ul>
        </details>
      </div>
      <ul class="menu menu-horizontal hidden md:inline-flex">
        <li v-for="link in navLinks" :key="link.to">
          <nuxt-link :to="link.to">{{ link.label }}</nuxt-link>
        </li>
      </ul>
      <NavigationThemeSwitcher />
    </nav>
  </header>
</template>
