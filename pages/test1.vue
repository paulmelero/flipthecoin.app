<template>
  <main class="container mx-auto prose dark:prose-invert">
    <h1>Watch the coin flip continuously</h1>
    <p>This is a test page. It's not meant to be used as a real game.</p>

    <blockquote>
      <h2 class="text-red-500">Notice</h2>

      <p class="not-prose">The content of this page ⚠️ flashes a lot, be aware if you have
        photosensitive epilepsy or other conditions that may be triggered by
        flashing lights or motion.</p>
    </blockquote>

    <!-- <button @click="toss">Toss me</button> -->
    <button @click="reset">Reset</button>
    <button @click="pause">{{ paused ? 'Resume' : 'Pause' }}</button>

    <p v-if="coin">
      <output v-if="biasNonetheless.toFixed(2) !== '0.00'">{{ winningSide }} wins by
        <span class="biassed">{{ percentageFormatter.format(biasNonetheless) }}</span>!</output>
      <output v-else>
        The coin is fair!
      </output>
    </p>

    <p v-if="coin">
      You got <output>{{ coin }}</output>!
    </p>

    <p>
      Biggest rounds: <output>{{ biggestRound.heads }}</output> heads in a row
      and <output>{{ biggestRound.tails }}</output> tails in a row
    </p>

    <p>
      Total <output>{{ history.heads + history.tails }}</output>!
    </p>

    <table>
      <thead>
        <tr>
          <th>
            <span>Heads</span>
            <span v-if="biasTowardsHeads > 0" class="tabular" :class="{
              biassed: biasTowardsHeads > 0,
            }">
              +{{ percentageFormatter.format(biasTowardsHeads) }}
            </span>
          </th>
          <th>
            <span>Tails</span>
            <span v-if="biasTowardsTails > 0" class="tabular" :class="{
              biassed: biasTowardsTails > 0,
            }">
              +{{ percentageFormatter.format(biasTowardsTails) }}
            </span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ history.heads }}</td>
          <td>{{ history.tails }}</td>
        </tr>
      </tbody>
    </table>

    <button @click="reset">Reset</button>
    <button @click="pause">{{ paused ? 'Resume' : 'Pause' }}</button>
  </main>
  <NuxtPage />
</template>

<script setup lang="ts">
import { ref } from 'vue';

type Coin = 'heads' | 'tails';
type CoinHistory = Record<Coin, number>;

const coin = ref<Coin | undefined>(undefined);
const history = ref<CoinHistory>({ heads: 0, tails: 0 });
const rounds = ref<CoinHistory>({ heads: 0, tails: 0 });
const biggestRound = ref<CoinHistory>({ heads: 0, tails: 0 });

const paused = ref(false);

const pause = () => {
  paused.value = !paused.value;
  if (!paused.value) {
    flipCoin();
  }
};

const calculateRounds = (newValue: Coin) => {
  if (coin.value === newValue) {
    rounds.value[newValue]++;
    if (rounds.value[newValue] > biggestRound.value[newValue]) {
      biggestRound.value[newValue] = rounds.value[newValue];
    }
  } else {
    rounds.value[newValue] = 0;
  }
};

const toss = () => {
  const newValue = Math.random() < 0.5 ? 'heads' : 'tails';

  calculateRounds(newValue);

  coin.value = newValue;
  history.value[coin.value]++;
};

const flipCoin = () => {
  if (paused.value) {
    return;
  }

  toss();

  requestAnimationFrame(flipCoin);
};

const percentageFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  minimumFractionDigits: 2,
});

const biasTowardsHeads = computed(() => {
  if (history.value.heads === 0 || history.value.tails === 0) {
    return 0;
  }
  return history.value.heads / history.value.tails - 1;
});

const biasTowardsTails = computed(() => {
  return 1 / (biasTowardsHeads.value + 1) - 1;
});

const biasNonetheless = computed(() => {
  return 1 / (biasTowardsHeads.value + 1) - 1;
});

const winningSide = computed(() => {
  return biasTowardsHeads.value > biasTowardsTails.value ? 'Heads' : 'Tails';
});

const reset = () => {
  coin.value = undefined;
  history.value = { heads: 0, tails: 0 };
};

onMounted(() => {
  requestAnimationFrame(flipCoin);
});
</script>

<style scoped>
button {
  padding: 1rem;
  font-size: 1.5rem;
  border-radius: 0.5rem;
  border: none;
  background-color: #000;
  color: #fff;
  cursor: pointer;
}

button:hover {
  background-color: #333;
}

button:active {
  background-color: #666;
}

table {
  margin-top: 2rem;
  border-collapse: collapse;
  min-width: 100%;
}

th,
td {
  padding: 1rem;
  border: 1px solid #000;
  width: 50%;
}

th {
  background-color: #000;
  color: #fff;
}

td {
  font-size: 2rem;
}

td:first-child {
  background-color: #333;
  color: #fff;
}

td:last-child {
  background-color: #666;
  color: #fff;
}

output {
  font-size: 2rem;
  font-weight: bold;
  font-family: monospace;
}

button+p {
  margin-top: 2rem;
}

button+p output {
  font-size: 2rem;
  font-weight: bold;
}

.tabular {
  font-variant-numeric: tabular-nums;
  font-family: monospace;
}

.biassed {
  color: red;
}
</style>
