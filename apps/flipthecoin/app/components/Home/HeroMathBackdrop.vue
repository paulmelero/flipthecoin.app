<script setup lang="ts">
const { $t } = useI18n();

const distributionPath = (() => {
  const n = 20;
  const p = 0.5;
  const xs: number[] = [];
  const ys: number[] = [];

  const factorialCache: number[] = [1];
  const fact = (k: number) => {
    while (factorialCache.length <= k) {
      factorialCache.push(
        factorialCache[factorialCache.length - 1]! * factorialCache.length,
      );
    }
    return factorialCache[k]!;
  };

  for (let k = 0; k <= n; k++) {
    const coeff = fact(n) / (fact(k) * fact(n - k));
    const prob = coeff * Math.pow(p, k) * Math.pow(1 - p, n - k);
    xs.push((k / n) * 800);
    ys.push(prob);
  }

  const maxY = Math.max(...ys);
  const points = xs.map((x, i) => ({
    x,
    y: 220 - (ys[i]! / maxY) * 200,
  }));

  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const cur = points[i]!;
    const cpX = (prev.x + cur.x) / 2;
    d += ` C ${cpX} ${prev.y}, ${cpX} ${cur.y}, ${cur.x} ${cur.y}`;
  }
  return d;
})();
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 overflow-hidden"
    aria-hidden="true"
  >
    <svg
      :aria-label="$t('home.motif.alt') as string"
      viewBox="0 0 800 240"
      preserveAspectRatio="none"
      class="absolute inset-x-0 bottom-0 h-[55%] w-full opacity-[0.07] dark:opacity-[0.10]"
    >
      <path
        :d="distributionPath"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      />
      <g v-for="i in 21" :key="i" stroke="currentColor" stroke-width="1">
        <line
          :x1="((i - 1) / 20) * 800"
          :y1="220"
          :x2="((i - 1) / 20) * 800"
          :y2="225"
        />
      </g>
      <line
        x1="0"
        y1="220"
        x2="800"
        y2="220"
        stroke="currentColor"
        stroke-width="1"
        stroke-opacity="0.5"
      />
    </svg>

    <span
      class="absolute left-6 bottom-10 text-xs sm:text-sm font-mono opacity-[0.08] dark:opacity-[0.12] -rotate-6 select-none"
    >
      P(H) = ½
    </span>
    <span
      class="absolute right-6 top-10 text-xs sm:text-sm font-mono opacity-[0.08] dark:opacity-[0.12] rotate-3 select-none"
    >
      σ = √(np(1−p))
    </span>
    <span
      class="absolute right-1/4 top-1/2 text-[10px] sm:text-xs font-mono opacity-[0.06] dark:opacity-[0.10] -rotate-12 select-none"
    >
      E[X] = np
    </span>
  </div>
</template>
