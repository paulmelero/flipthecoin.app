<template>
  <footer class="footer bg-neutral text-neutral-content mx-auto py-8 px-4">
    <aside class="flex items-center">
      <BrandLogo />
    </aside>

    <nav class="mb-4">
      <h4 class="footer-title">
        <span class="text-lg font-bold">Navigation</span>
      </h4>
      <a href="/privacy" class="hover:text-gray-900">Privacy Policy</a>
      <a href="/terms" class="hover:text-gray-900">Terms of Service</a>
    </nav>
    <div>
      &copy; {{ new Date().getFullYear() }} Flip The Coin App. All rights
      reserved.
    </div>
  </footer>
</template>
