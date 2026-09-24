<script setup lang="ts">
/**
 * PenneyGraph — lays the best-response table (passed as the default
 * markdown slot) side by side with the diagram of how the eight
 * three-flip patterns dominate each other. Each arrow points from a
 * pattern to a pattern it beats. The SVG uses currentColor so it adapts
 * to the light/dark theme.
 */
const { coinSymbolTail = 'T', coinSymbolHead = 'H' } = defineProps<{
  /** Caption shown under the diagram. */
  caption?: string;

  /** Symbol used for heads in the diagram. */
  coinSymbolHead?: string;
  /** Symbol used for tails in the diagram. */
  coinSymbolTail?: string;
}>();
</script>

<template>
  <div
    class="my-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:items-center"
  >
    <div class="min-w-0">
      <slot />
    </div>

    <figure class="not-prose m-0 min-w-0">
      <svg
        viewBox="0 0 460 230"
        role="img"
        aria-label="Diagram of Penney's game: arrows connect each pattern to a pattern it beats, forming a nontransitive cycle."
        class="mx-auto h-auto w-full max-w-[460px] text-base-content"
      >
        <defs>
          <marker
            id="penney-arrow"
            markerWidth="10"
            markerHeight="10"
            refX="8.5"
            refY="3"
            orient="auto"
            markerUnits="userSpaceOnUse"
          >
            <path d="M0,0 L9,3 L0,6 Z" fill="currentColor" />
          </marker>
        </defs>

        <g
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          marker-end="url(#penney-arrow)"
        >
          <line x1="95" y1="105" x2="95" y2="57" />
          <line x1="112" y1="112" x2="216" y2="54" />
          <line x1="262" y1="42" x2="344" y2="42" />
          <line x1="256" y1="52" x2="354" y2="104" />
          <line x1="372" y1="131" x2="372" y2="180" />
          <line x1="352" y1="124" x2="262" y2="188" />
          <line x1="218" y1="195" x2="114" y2="195" />
          <line x1="218" y1="189" x2="110" y2="130" />
        </g>

        <g
          fill="currentColor"
          font-family="Georgia, 'Times New Roman', serif"
          font-size="15"
          text-anchor="middle"
          dominant-baseline="central"
        >
          <text x="95" y="42">
            {{ coinSymbolHead }}{{ coinSymbolTail }}{{ coinSymbolHead }}
          </text>
          <text x="240" y="42">
            {{ coinSymbolHead }}{{ coinSymbolTail }}{{ coinSymbolTail }}
          </text>
          <text x="372" y="42">
            {{ coinSymbolTail }}{{ coinSymbolTail }}{{ coinSymbolTail }}
          </text>
          <text x="95" y="118">
            {{ coinSymbolHead }}{{ coinSymbolHead }}{{ coinSymbolTail }}
          </text>
          <text x="372" y="118">
            {{ coinSymbolTail }}{{ coinSymbolTail }}{{ coinSymbolHead }}
          </text>
          <text x="240" y="195">
            {{ coinSymbolTail }}{{ coinSymbolHead }}{{ coinSymbolHead }}
          </text>
          <text x="95" y="195">
            {{ coinSymbolHead }}{{ coinSymbolHead }}{{ coinSymbolHead }}
          </text>
          <text x="372" y="195">
            {{ coinSymbolTail }}{{ coinSymbolHead }}{{ coinSymbolTail }}
          </text>
        </g>
      </svg>

      <figcaption
        v-if="caption"
        class="mt-2 text-center text-sm text-base-content/60"
      >
        {{ caption }}
      </figcaption>
    </figure>
  </div>
</template>
