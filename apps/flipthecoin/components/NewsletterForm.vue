<template>
  <form @submit.prevent="subscribe" class="newsletter-form">
    <UInput v-model="email" type="email" placeholder="Email" required :disabled="loading" size="xl"
      class="w-full mb-4" />
    <UCheckbox class="mb-4" v-model="agreeToTerms" required label="I agree to the terms and conditions" />
    <UButton type="submit" :loading="loading" size="xl">
      {{ loading ? 'Subscribing...' : 'Subscribe' }}
    </UButton>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p v-if="success" class="text-green-500 mt-2">Thanks for subscribing!</p>
  </form>
</template>

<script setup lang="ts">
const email = ref('')
const agreeToTerms = ref(false)

const loading = ref(false)
const error = ref('')
const success = ref(false)

async function subscribe() {
  loading.value = true
  error.value = ''
  success.value = false

  if (!agreeToTerms.value) {
    error.value = 'You must agree to the terms and conditions'
    return
  }

  $fetch('/api/subscribe', {
    method: 'POST',
    body: { email: email.value },
  }).then((res) => {
    success.value = true
    email.value = ''
  }).catch((e) => {
    error.value = 'Something went wrong. Please try again.'
  }).finally(() => {
    loading.value = false
  })
}
</script>
