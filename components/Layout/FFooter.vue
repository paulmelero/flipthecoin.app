<template>
  <footer class="container mx-auto py-8 px-4">
    <div class="flex flex-col md:flex-row justify-between items-center gap-4">
      <div class="flex items-center">
        <Logo />
      </div>

      <div class="text-sm text-gray-600">
        <nav class="flex gap-6 mb-4">
          <!-- <a href="/privacy" class="hover:text-gray-900">Privacy Policy</a>
          <a href="/terms" class="hover:text-gray-900">Terms of Service</a> -->
        </nav>
        <p>&copy; {{ new Date().getFullYear() }} Flip The Coin App. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>