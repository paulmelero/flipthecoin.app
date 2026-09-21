<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const props = defineProps<{
  submit: (body: string) => Promise<unknown>;
  isSubmitting?: boolean;
  replyingTo?: { authorName?: string | null } | null;
  editing?: { body?: string | null } | null;
  cancel?: () => void;
}>();

const { $t } = useI18n();
const { t } = useCommentsMessages();

const draft = ref('');
const textarea = ref<HTMLTextAreaElement | null>(null);

// Prefill when a comment is opened for editing, and clear when it closes.
watch(
  () => props.editing,
  (comment) => {
    draft.value = comment?.body ?? '';
  },
  { immediate: true },
);

// Bring the composer into view when replying/editing starts.
watch(
  [() => props.replyingTo, () => props.editing],
  async ([replyingTo, editing]) => {
    if (!replyingTo && !editing) return;
    await nextTick();
    textarea.value?.focus();
    textarea.value?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
);

async function onSubmit() {
  const body = draft.value.trim();
  if (!body || props.isSubmitting) return;
  await props.submit(body);
  draft.value = '';
}
</script>

<template>
  <form class="mt-6 space-y-3" @submit.prevent="onSubmit">
    <div
      v-if="replyingTo || editing"
      class="flex items-center justify-between gap-3 rounded-lg bg-base-300/50 px-3 py-2 text-sm"
    >
      <span>
        <template v-if="editing">{{ $t('blog.comments.editing') }}</template>
        <template v-else>
          {{ $t('blog.comments.replyingTo') }}
          {{ replyingTo?.authorName ?? $t('blog.comments.anonymous') }}
        </template>
      </span>
      <button
        v-if="cancel"
        type="button"
        class="btn btn-ghost btn-xs"
        @click="cancel()"
      >
        {{ $t('blog.comments.cancel') }}
      </button>
    </div>

    <textarea
      ref="textarea"
      v-model="draft"
      class="textarea textarea-bordered w-full"
      :placeholder="editing ? t('editComment') : t('writeComment')"
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
        {{ isSubmitting ? $t('blog.comments.posting') : t('post') }}
      </button>
    </div>
  </form>
</template>
