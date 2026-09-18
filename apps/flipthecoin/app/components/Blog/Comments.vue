<script setup lang="ts">
const { $t } = useI18n();

withDefaults(
  defineProps<{
    resource: string;
    providers?: string[];
  }>(),
  {
    providers: () => ['github', 'google'],
  },
);

const providerMeta: Record<string, { icon: string; label: string }> = {
  github: { icon: 'octicon:mark-github', label: 'GitHub' },
  google: { icon: 'logos:google-icon', label: 'Google' },
};

const draft = ref('');
async function submitDraft(submit: (body: string) => Promise<unknown>) {
  const body = draft.value.trim();
  if (!body) return;
  await submit(body);
  draft.value = '';
}
</script>

<template>
  <section class="card not-prose bg-base-200/60 p-6 sm:p-8">
    <Comments :resource="resource" :providers="providers">
      <template #header="{ count }">
        <h2 class="mb-4 font-headings text-2xl">
          {{ $t('blog.comments.title')
          }}<span v-if="count" class="ms-2 text-base opacity-60"
            >({{ count }})</span
          >
        </h2>
      </template>

      <template #login="{ signIn, providers: available }">
        <div class="flex flex-wrap items-center gap-3 py-4">
          <p class="w-full text-sm opacity-70">
            {{ $t('blog.comments.signInPrompt') }}
          </p>
          <button
            v-for="provider in available"
            :key="provider"
            class="btn btn-outline btn-sm"
            type="button"
            @click="signIn(provider)"
          >
            <GIcon
              v-if="providerMeta[provider]"
              :name="providerMeta[provider].icon"
              :size="18"
            />
            {{ $t('blog.comments.continueWith') }}
            {{ providerMeta[provider]?.label ?? provider }}
          </button>
        </div>
      </template>

      <template #composer="{ submit, isSubmitting }">
        <form class="mt-6 space-y-3" @submit.prevent="submitDraft(submit)">
          <textarea
            v-model="draft"
            class="textarea textarea-bordered w-full"
            :placeholder="$t('blog.comments.placeholder')"
            :disabled="isSubmitting"
            rows="3"
            required
          />
          <div class="flex justify-end">
            <button
              class="btn btn-primary btn-sm"
              type="submit"
              :disabled="isSubmitting || !draft.trim()"
            >
              {{
                isSubmitting
                  ? $t('blog.comments.posting')
                  : $t('blog.comments.post')
              }}
            </button>
          </div>
        </form>
      </template>

      <template #comment-author="{ comment }">
        <strong class="font-medium">{{
          comment.authorName ?? $t('blog.comments.anonymous')
        }}</strong>
      </template>

      <template #comment-body="{ comment }">
        <p
          class="whitespace-pre-wrap text-sm leading-relaxed"
          v-text="comment.body ?? $t('blog.comments.deleted')"
        />
      </template>

      <template
        #comment-actions="{ comment, canEdit, onReply, onEdit, onDelete }"
      >
        <div class="flex gap-1">
          <button
            class="btn btn-ghost btn-xs"
            type="button"
            @click="onReply(comment)"
          >
            {{ $t('blog.comments.reply') }}
          </button>
          <button
            v-if="canEdit"
            class="btn btn-ghost btn-xs"
            type="button"
            @click="onEdit(comment)"
          >
            {{ $t('blog.comments.edit') }}
          </button>
          <button
            v-if="canEdit"
            class="btn btn-ghost btn-xs text-error"
            type="button"
            @click="onDelete(comment)"
          >
            {{ $t('blog.comments.delete') }}
          </button>
        </div>
      </template>

      <template #reaction="{ count, active, toggle }">
        <button
          class="btn btn-ghost btn-xs"
          type="button"
          :aria-pressed="active"
          @click="toggle()"
        >
          👍<span v-if="count" class="ms-1">{{ count }}</span>
        </button>
      </template>

      <template #loading>
        <p class="py-4 text-sm opacity-70" role="status">
          {{ $t('blog.comments.loading') }}
        </p>
      </template>

      <template #error>
        <p class="py-4 text-sm text-error" role="alert">
          {{ $t('blog.comments.error') }}
        </p>
      </template>

      <template #empty>
        <p class="py-4 text-sm opacity-70">{{ $t('blog.comments.empty') }}</p>
      </template>

      <template #load-more="{ fetchMore }">
        <button
          class="btn btn-outline btn-sm"
          type="button"
          @click="fetchMore()"
        >
          {{ $t('blog.comments.loadMore') }}
        </button>
      </template>
    </Comments>
  </section>
</template>
