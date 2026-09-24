<script setup lang="ts">
import { commentsMessagesEs } from '../../lib/comments/messages.es';
import { commentsMessagesEn } from '../../lib/comments/messages.en';

const { t } = useCommentsMessages();
const config = useRuntimeConfig();
const { $t, $getLocale, localePath } = useI18n();

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

// Layout via the package's class API (0.4.0). Actions on the left, reactions
// (the like button) on the opposite edge; replies indented under their parent.
const commentsClasses = {
  list: 'flex list-none flex-col gap-6 p-0',
};
const commentClasses = {
  root: 'flex flex-col gap-1.5',
  footer: 'flex items-center justify-between gap-2',
  reactions: 'flex items-center gap-1',
  repliesList:
    'mt-3 flex list-none flex-col gap-4 border-s border-secondary/10 p-0 ps-5',
};

// @graficos/nuxt-comments ships an English message catalog; swap in the
// Spanish overrides when the active locale is `es`.
const publicComments = config.public.comments as unknown as {
  messages?: Record<string, string>;
};
watchEffect(() => {
  publicComments.messages =
    $getLocale() === 'es' ? commentsMessagesEs : commentsMessagesEn;
});
</script>

<template>
  <section class="card not-prose bg-base-200/60 p-6 sm:p-8">
    <Comments
      :resource="resource"
      :providers="providers"
      :expand-replies="true"
      :classes="commentsClasses"
      :comment-classes="commentClasses"
    >
      <template #header="{ count }">
        <h2 class="mb-4 font-headings text-2xl">
          {{ t('comments')
          }}<span v-if="count" class="ms-2 text-base opacity-60"
            >({{ count }})</span
          >
        </h2>
      </template>

      <template #login="{ signIn, providers: available }">
        <div class="flex flex-wrap items-center gap-3 py-4">
          <p class="w-full text-sm opacity-70">
            {{ t('signInPrompt') }}
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
            {{
              t('continueWith', {
                provider: providerMeta[provider]?.label ?? provider,
              })
            }}
          </button>
        </div>
      </template>

      <template #composer="slotProps">
        <BlogCommentComposerForm v-bind="slotProps" />
      </template>

      <template #comment-author="{ comment }">
        <div class="flex items-center gap-2">
          <img
            v-if="comment.authorImage"
            :src="comment.authorImage"
            :alt="comment.authorName ?? ''"
            class="h-7 w-7 rounded-full object-cover"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          <span
            v-else
            class="flex h-7 w-7 items-center justify-center rounded-full bg-base-300 text-xs font-medium uppercase"
            aria-hidden="true"
          >
            {{ (comment.authorName ?? '?').charAt(0) }}
          </span>
          <strong class="font-medium">{{
            comment.authorName ?? t('deletedAuthor')
          }}</strong>
        </div>
      </template>

      <template #comment-body="{ comment }">
        <p
          class="whitespace-pre-wrap text-sm leading-relaxed"
          v-text="comment.body ?? t('deleted')"
        />
      </template>

      <template
        #comment-actions="{ comment, canEdit, onReply, onEdit, onDelete }"
      >
        <div class="flex gap-1">
          <button
            class="btn btn-ghost btn-xs"
            type="button"
            :aria-label="t('replyToComment', { id: comment.id })"
            @click="onReply(comment)"
          >
            {{ t('reply') }}
          </button>
          <button
            v-if="canEdit"
            class="btn btn-ghost btn-xs"
            type="button"
            :aria-label="t('editCommentAria', { id: comment.id })"
            @click="onEdit(comment)"
          >
            {{ t('edit') }}
          </button>
          <button
            v-if="canEdit"
            class="btn btn-ghost btn-xs text-error"
            type="button"
            :aria-label="t('deleteCommentAria', { id: comment.id })"
            @click="onDelete(comment)"
          >
            {{ t('delete') }}
          </button>
        </div>
      </template>

      <template #reaction="{ count, active, toggle }">
        <button
          class="btn btn-ghost btn-xs"
          type="button"
          :aria-label="t('reactWith', { type: 'like' })"
          :aria-pressed="active"
          @click="toggle()"
        >
          👍<span v-if="count" class="ms-1">{{ count }}</span>
        </button>
      </template>

      <template #loading>
        <p class="py-4 text-sm opacity-70" role="status">
          {{ t('loading') }}
        </p>
      </template>

      <template #error>
        <p class="py-4 text-sm text-error" role="alert">
          {{ t('loadFailed') }}
        </p>
      </template>

      <template #empty>
        <p class="py-4 text-sm opacity-70">{{ t('empty') }}</p>
      </template>

      <template #load-more="{ fetchMore }">
        <button
          class="btn btn-outline btn-sm"
          type="button"
          @click="fetchMore()"
        >
          {{ t('loadMore') }}
        </button>
      </template>

      <template #footer>
        <p class="mt-4 text-xs opacity-70">
          <NuxtLink :to="localePath('/privacy-policy')" class="link">
            {{ $t('comments.privacyLink') as string }}
          </NuxtLink>
        </p>
      </template>
    </Comments>
  </section>
</template>
