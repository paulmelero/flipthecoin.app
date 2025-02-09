<template>
  <form @submit.prevent="subscribe">
    <fieldset class="form-control">
      <label class="label">
        <span class="label-text">Enter your email address</span>
      </label>
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        :disabled="loading"
        class="input-md md:input-lg input-bordered input-primary w-full mb-4"
        :class="{
          'input-error': error,
        }"
      />
    </fieldset>
    <label class="label items-center gap-2 mb-4" id="agreeToTerms">
      <input
        type="checkbox"
        class="ml-2 checkbox checkbox-primary"
        v-model="agreeToTerms"
        id="agreeToTerms"
        required
      />
      <span class="label-text grow"> I agree to the terms and conditions </span>
    </label>
    <button type="submit" class="btn" :loading="loading">
      {{ loading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe' }}
    </button>
    <p v-if="error" class="text-red-500 mt-2">{{ error }}</p>
    <p v-if="success" class="text-green-500 mt-2">Thanks for subscribing!</p>
  </form>
</template>

<script setup lang="ts">
const email = ref('');
const agreeToTerms = ref(false);

const loading = ref(false);
const error = ref('');
const success = ref(false);

async function subscribe() {
  loading.value = true;
  error.value = '';
  success.value = false;

  if (!agreeToTerms.value) {
    error.value = 'You must agree to the terms and conditions';
    return;
  }

  $fetch('/api/subscribe', {
    method: 'POST',
    body: { email: email.value },
  })
    .then((res) => {
      success.value = true;
      email.value = '';
    })
    .catch((e) => {
      error.value = 'Something went wrong. Please try again.';
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
