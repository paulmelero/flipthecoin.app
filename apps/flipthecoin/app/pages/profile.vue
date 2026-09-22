<script setup lang="ts">
const { $t, localePath } = useI18n();

const { user, session, signOut } = useUserSession();
const { signIn } = useCommentsSession();

definePageMeta({
  layout: 'blogpost',
  auth: { only: 'user', redirectTo: '/' },
});

// User data must never land in the SSR HTML (the Worker response can be cached
// while warming up the CDN), so the whole page is rendered client-side.
useSeoMeta({
  title: () => $t('profile.title'),
  robots: 'noindex, nofollow',
});

const providers: { id: string; label: string }[] = [
  { id: 'github', label: 'GitHub' },
  { id: 'google', label: 'Google' },
];

// Better Auth's self-delete requires a session newer than `session.freshAge`
// (default 1 day). The server enforces the real value; this mirrors it for UX.
const FRESH_AGE_SECONDS = 60 * 60 * 24;
const sessionFresh = computed(() => {
  const createdAt = session.value?.createdAt;
  if (!createdAt) return true;
  return (
    (Date.now() - new Date(createdAt).getTime()) / 1000 < FRESH_AGE_SECONDS
  );
});

const deleteOpen = ref(false);
const deleting = ref(false);
const deleteError = ref<string | null>(null);
const sessionExpired = ref(false);

async function confirmDelete() {
  deleting.value = true;
  deleteError.value = null;
  try {
    await $fetch('/api/me', { method: 'DELETE' });
    await signOut().catch(() => {});
    await navigateTo(localePath('/'));
  } catch (err) {
    const status = (err as { statusCode?: number }).statusCode;
    if (status === 409) sessionExpired.value = true;
    else deleteError.value = $t('profile.deleteError');
    deleteOpen.value = false;
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <div class="not-prose">
    <ClientOnly>
      <div v-if="user" class="mx-auto max-w-2xl">
        <h1 class="font-headings text-3xl">{{ $t('profile.title') }}</h1>
        <p class="mt-3 opacity-80">{{ $t('profile.intro') }}</p>

        <section class="card mt-8 bg-base-200/60 p-6">
          <h2 class="font-headings text-xl">
            {{ $t('profile.accountTitle') }}
          </h2>
          <div class="mt-4 flex items-center gap-4">
            <img
              v-if="user.image"
              :src="user.image"
              :alt="user.name ?? ''"
              class="h-14 w-14 rounded-full object-cover"
              referrerpolicy="no-referrer"
            />
            <span
              v-else
              class="flex h-14 w-14 items-center justify-center rounded-full bg-base-300 text-lg font-medium uppercase"
              aria-hidden="true"
            >
              {{ (user.name ?? '?').charAt(0) }}
            </span>
            <div>
              <p class="font-medium">{{ user.name }}</p>
              <p class="text-sm opacity-70">{{ user.email }}</p>
            </div>
          </div>
          <p class="mt-4 text-sm opacity-70">{{ $t('profile.commentData') }}</p>
        </section>

        <section class="mt-8">
          <p class="text-sm leading-relaxed opacity-80">
            {{ $t('profile.gdpr') }}
          </p>
          <p class="mt-3 text-sm">
            <NuxtLink
              :to="localePath('/privacy-policy')"
              class="link link-primary"
            >
              {{ $t('profile.privacyLink') }}
            </NuxtLink>
          </p>
        </section>

        <section class="mt-10 border-t border-base-content/10 pt-6">
          <h2 class="font-headings text-xl text-error">
            {{ $t('profile.deleteTitle') }}
          </h2>
          <p class="mt-2 text-sm opacity-80">
            {{ $t('profile.deleteWarning') }}
          </p>

          <template v-if="sessionFresh">
            <button
              type="button"
              class="btn btn-error mt-4"
              @click="deleteOpen = true"
            >
              {{ $t('profile.deleteButton') }}
            </button>
          </template>
          <template v-else>
            <p class="mt-4 text-sm text-warning">
              {{ $t('profile.sessionExpired') }}
            </p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button
                v-for="provider in providers"
                :key="provider.id"
                type="button"
                class="btn btn-outline btn-sm"
                @click="signIn(provider.id)"
              >
                {{ $t('profile.signInAgain') }} {{ provider.label }}
              </button>
            </div>
          </template>

          <p v-if="deleteError" class="mt-3 text-sm text-error">
            {{ deleteError }}
          </p>
        </section>
      </div>

      <template #fallback>
        <div class="mx-auto max-w-2xl">
          <div class="skeleton h-8 w-48" />
          <div class="skeleton mt-6 h-40 w-full" />
        </div>
      </template>
    </ClientOnly>

    <div v-if="deleteOpen" class="modal modal-open" role="dialog">
      <div class="modal-box">
        <h3 class="font-headings text-lg">{{ $t('profile.deleteTitle') }}</h3>
        <p class="py-4 text-sm">{{ $t('profile.deleteWarning') }}</p>
        <div class="modal-action">
          <button
            type="button"
            class="btn btn-ghost"
            :disabled="deleting"
            @click="deleteOpen = false"
          >
            {{ $t('profile.cancel') }}
          </button>
          <button
            type="button"
            class="btn btn-error"
            :disabled="deleting"
            @click="confirmDelete"
          >
            {{
              deleting ? $t('profile.deleting') : $t('profile.confirmDelete')
            }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
