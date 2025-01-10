<template>
  <form @submit.prevent="subscribe" class="newsletter-form">
    <UInput v-model="email" type="email" placeholder="Email" required :disabled="loading" size="xl"
      class="w-full mb-4" />
    <UButton type="submit" :loading="loading" size="xl">
      {{ loading ? 'Subscribing...' : 'Subscribe' }}
    </UButton>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p v-if="success" class="text-green-500 mt-2">Thanks for subscribing!</p>
  </form>
</template>

<script setup lang="ts">
const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function subscribe() {
  loading.value = true
  error.value = ''
  success.value = false

  // TODO
}
</script>
