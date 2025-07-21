<template>
  <footer class="footer bg-neutral text-neutral-content py-6 px-4 lg:px-8">
    <FQuote class="flex gap-4">
      <em
        >"You are what you are today because of the choices you made yesterday,
        and the choices you make today will make you what you are tomorrow."</em
      ><br /><span>— Michael Josephson</span>
    </FQuote>
  </footer>
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
      <NuxtLink to="/about-us" class="">About us</NuxtLink>
      <!-- <NuxtLink to="/contact" class="">Contact</NuxtLink> -->
    </nav>

    <nav class="mb-4">
      <h4 class="footer-title">
        <span class="text-lg font-bold">Projects</span>
      </h4>
      <NuxtLink to="/blog" class="">Blog</NuxtLink>
      <NuxtLink to="/extension" class="">Browser extension</NuxtLink>
      <!-- <NuxtLink to="/contact" class="">Have more ideas?</NuxtLink> -->
    </nav>

    <nav class="mb-4">
      <h4 class="footer-title">
        <span class="text-lg font-bold">Legal</span>
      </h4>
      <NuxtLink to="/privacy-policy" class="">Privacy Policy</NuxtLink>
      <NuxtLink to="/terms" class="">Terms of Service</NuxtLink>
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
