<template>
  <FTitle as="h2">Newsletter</FTitle>
  <p class="prose dark:prose-invert">
    Want to know more about the science of coin flips or just interesting facts
    about statistics and how they apply in life?
  </p>
  <p>
    Stay tuned for more articles and resources. Sign up for our newsletter to
    get notified when we launch the <b>game</b>, <b>the browser extension</b>,
    and more!
  </p>
  <form @submit.prevent="subscribe">
    <label class="label mb-2" for="email">
      <span class="label-text">Enter your email address</span>
    </label>
    <div class="grid gap-4 grid-cols-1 md:grid-cols-[60%,1fr]">
      <input
        v-model="email"
        id="email"
        type="email"
        placeholder="Email"
        required
        :disabled="loading"
        class="input-md md:input-lg input-bordered border rounded-lg input-primary w-full md:mb-4"
        :class="{
          'input-error': error,
        }"
      />
      <button
        type="submit"
        class="btn btn-primary btn-md md:btn-lg md:mb-0 mb-4"
        :loading="loading"
      >
        {{ loading ? 'Subscribing...' : success ? 'Subscribed!' : 'Subscribe' }}
      </button>
    </div>
    <label class="label items-center gap-2 mb-4" for="agreeToTerms">
      <input
        type="checkbox"
        class="checkbox checkbox-primary"
        v-model="agreeToTerms"
        id="agreeToTerms"
        required
      />
      <span class="label-text grow"> I agree to the terms and conditions </span>
    </label>
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
