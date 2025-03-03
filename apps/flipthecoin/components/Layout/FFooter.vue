<template>
  <footer
    class="footer py-8 px-4 lg:px-8 bg-neutral text-neutral-content mx-auto"
  >
    <aside class="flex items-center">
      <BrandLogo />
    </aside>

    <nav class="mb-4">
      <h4 class="footer-title">
        <span class="text-lg font-bold">Company</span>
      </h4>
      <a href="/about-us" class="">About us</a>
      <!-- <a href="/contact" class="">Contact</a> -->
    </nav>

    <nav class="mb-4">
      <h4 class="footer-title">
        <span class="text-lg font-bold">Projects</span>
      </h4>
      <a href="/blog" class="">Blog</a>
      <a href="/browser-extension" class="">Browser extension</a>
      <!-- <a href="/contact" class="">Have more ideas?</a> -->
    </nav>

    <nav class="mb-4">
      <h4 class="footer-title">
        <span class="text-lg font-bold">Legal</span>
      </h4>
      <a href="/privacy-policy" class="">Privacy Policy</a>
      <a href="/terms" class="">Terms of Service</a>
    </nav>
  </footer>
  <footer class="footer py-8 px-4 lg:px-8 bg-neutral text-base-content mx-auto">
    <span
      >&copy; {{ new Date().getFullYear() }} Flip The Coin App. All rights
      reserved.</span
    >
    <div class="flex justify-end w-full"><NavigationThemeSwitcher /></div>
  </footer>
</template>
