<script setup lang="ts">
import { ref, computed, onBeforeUnmount, useSlots } from 'vue';
import type { GlossaryTerm } from '~/composables/useGlossary';

// Inline MDC component used inside blog posts: `:term[label]{slug="probability"}`.
// Base behavior (works without JS, on mobile, for SEO + a11y): the term is a
// <dfn> wrapping a link to the standalone /glossary/<slug>/ page. On
// pointer-fine devices it is progressively enhanced with a Wikipedia-style
// hovercard fetched on first hover.
const props = defineProps<{
  slug: string;
  // Optional explicit label override; normally the inline `[label]` slot is used.
  label?: string;
}>();

const { localePath } = useI18n();
const { resolve } = useGlossary();
const slots = useSlots();

const to = computed(() => localePath(`/glossary/${props.slug}`));

const triggerRef = ref<HTMLElement | null>(null);
const open = ref(false);
const loading = ref(false);
const term = ref<GlossaryTerm | null>(null);
const pos = ref<{ top: number; left: number; placement: 'top' | 'bottom' }>({
  top: 0,
  left: 0,
  placement: 'bottom',
});

let hoverCapable = false;
let enterTimer: ReturnType<typeof setTimeout> | null = null;
let leaveTimer: ReturnType<typeof setTimeout> | null = null;

if (import.meta.client) {
  hoverCapable = window.matchMedia(
    '(hover: hover) and (pointer: fine)',
  ).matches;
}

function clearTimers() {
  if (enterTimer) clearTimeout(enterTimer);
  if (leaveTimer) clearTimeout(leaveTimer);
  enterTimer = leaveTimer = null;
}

function place() {
  const el = triggerRef.value;
  if (!el) return;
  const r = el.getBoundingClientRect();
  const CARD = 320;
  const margin = 12;
  // Prefer below; flip above when there isn't room.
  const below = r.bottom + 8;
  const placement: 'top' | 'bottom' =
    window.innerHeight - r.bottom < 220 && r.top > 220 ? 'top' : 'bottom';
  let left = r.left + r.width / 2 - CARD / 2;
  left = Math.max(margin, Math.min(left, window.innerWidth - CARD - margin));
  pos.value = {
    left,
    top: placement === 'bottom' ? below : r.top - 8,
    placement,
  };
}

async function reveal() {
  clearTimers();
  place();
  open.value = true;
  if (term.value || loading.value) return;
  loading.value = true;
  try {
    term.value = await resolve(props.slug);
  } finally {
    loading.value = false;
  }
}

function onEnter() {
  if (!hoverCapable) return;
  clearTimers();
  enterTimer = setTimeout(reveal, 120);
}

function scheduleClose() {
  if (!hoverCapable) return;
  clearTimers();
  leaveTimer = setTimeout(() => (open.value = false), 160);
}

function onFocus() {
  // Keyboard users get the card immediately (no hover-intent delay).
  if (!hoverCapable) return;
  reveal();
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    open.value = false;
    triggerRef.value?.querySelector('a')?.focus();
  }
}

onBeforeUnmount(clearTimers);

const hasLabel = computed(() => !!slots.default || !!props.label);
</script>

<template>
  <dfn
    ref="triggerRef"
    class="glossary-term"
    @mouseenter="onEnter"
    @mouseleave="scheduleClose"
    @focusin="onFocus"
    @focusout="scheduleClose"
    @keydown="onKeydown"
  >
    <NuxtLink :to="to">
      <slot v-if="hasLabel">{{ label }}</slot>
      <template v-else>{{ slug }}</template>
    </NuxtLink>

    <Teleport to="body">
      <Transition name="glossary-pop">
        <div
          v-if="open"
          class="glossary-card"
          :class="`is-${pos.placement}`"
          :style="{
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            transform:
              pos.placement === 'top' ? 'translateY(-100%)' : undefined,
          }"
          @mouseenter="clearTimers"
          @mouseleave="scheduleClose"
        >
          <template v-if="loading">
            <div class="skeleton mb-2 h-4 w-2/3"></div>
            <div class="skeleton mb-1.5 h-3 w-full"></div>
            <div class="skeleton mb-1.5 h-3 w-full"></div>
            <div class="skeleton h-3 w-4/5"></div>
          </template>

          <template v-else-if="term">
            <p class="glossary-card__title">{{ term.title }}</p>
            <p class="glossary-card__desc">{{ term.description }}</p>
            <NuxtLink :to="to" class="glossary-card__more">
              {{ $t('glossary.readMore') }}
            </NuxtLink>
          </template>
        </div>
      </Transition>
    </Teleport>
  </dfn>
</template>

<style scoped>
.glossary-term {
  font-style: normal;
}
.glossary-term :deep(a) {
  color: var(--fallback-p, oklch(var(--p)));
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
  cursor: help;
}
.glossary-term :deep(a:hover) {
  text-decoration-style: solid;
}

.glossary-card {
  position: fixed;
  z-index: 60;
  width: 320px;
  max-width: calc(100vw - 24px);
  padding: 1rem;
  border-radius: 1rem;
  background: var(--fallback-b1, oklch(var(--b1)));
  color: var(--fallback-bc, oklch(var(--bc)));
  border: 1px solid color-mix(in oklch, currentColor 12%, transparent);
  box-shadow:
    0 10px 30px -12px rgba(0, 0, 0, 0.45),
    0 4px 10px -6px rgba(0, 0, 0, 0.3);
}
.glossary-card__title {
  font-weight: 600;
  margin-bottom: 0.35rem;
}
.glossary-card__desc {
  font-size: 0.875rem;
  line-height: 1.4;
  opacity: 0.85;
  margin-bottom: 0.6rem;
}
.glossary-card__more {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--fallback-p, oklch(var(--p)));
}

.glossary-pop-enter-active,
.glossary-pop-leave-active {
  transition:
    opacity 0.14s ease,
    translate 0.14s ease;
}
.glossary-pop-enter-from,
.glossary-pop-leave-to {
  opacity: 0;
  translate: 0 4px;
}
.is-top.glossary-pop-enter-from,
.is-top.glossary-pop-leave-to {
  translate: 0 -4px;
}

@media (prefers-reduced-motion: reduce) {
  .glossary-pop-enter-active,
  .glossary-pop-leave-active {
    transition: opacity 0.14s ease;
  }
}
</style>
