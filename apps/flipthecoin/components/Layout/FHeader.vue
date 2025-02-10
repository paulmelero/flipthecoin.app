import { _height } from '#tailwind-config/theme';
<template>
  <header class="navbar bg-base-100 container mx-auto py-5">
    <div class="navbar-start">
      <nuxt-link to="/" class="flex items-center">
        <BrandLogo />
      </nuxt-link>
    </div>
    <nav class="navbar-end flex gap-2">
      <ul class="menu menu-horizontal">
        <li>
          <nuxt-link to="/">Home</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/blog">Blog</nuxt-link>
        </li>
        <li>
          <nuxt-link to="/extension">Browser Extension</nuxt-link>
        </li>
      </ul>
      <NavigationThemeSwitcher />
    </nav>
  </header>
</template>
