---
title: 'How to Beat a Fair Coin'
slug: how-to-beat-a-fair-coin
series: patterns-in-the-noise
seriesOrder: 1
_locale: en
description: "You and a friend each pick a three-flip pattern. The coin is perfectly fair. Yet whoever chooses second wins almost every time. This is Penney's game — the strangest thing a fair coin can do."
published: true
level: intermediate
date: 2026-09-24T10:00:00Z
tags:
  - Penney's game
  - nontransitive
  - racing patterns
  - pattern matching
  - fair coin
  - waiting time
  - paradox
  - probability
  - game theory
  - randomness
---

# How to Beat a Fair Coin

_You and a friend each pick a pattern of three coin flips. The coin is perfectly fair. Yet one of you wins seven times out of eight — and if you choose second, it is always you._ 🤔

Ask a friend to name any pattern of three coin flips — say, heads-heads-heads. Now you name yours. Then flip a fair coin over and over, writing down every result, until one of the two patterns appears in the sequence. Whoever's pattern shows up first wins.

Your friend chose first, so they had the whole universe of patterns to choose from. The coin is fair. Every flip is independent. There is no trick in the metal. And yet the game is not a coin toss at all: whatever your friend picks, there is a pattern you can pick that beats it. Not narrowly. Against their proud _HHH_, you choose _THH_ and win **seven times out of eight**.

This is :term[Penney's game]{slug='penneys-game'}, and it is the cleanest example I know of a fair process producing a thoroughly unfair game. Along the way we will meet a pattern that wins races it is supposed to lose, and we will end somewhere less comfortable: asking what "fair" even means when the coin has no preferences — and we do.

<!--more-->

## Who was Walter Penney?

Walter Francis Penney (1913–2000) was an American mathematician and cryptanalyst. He spent his career in signals intelligence — first in the U.S. Navy's code-breaking group, then for 34 years at the National Security Agency, where he rose to division chief.

A cryptanalyst spends a working life staring at long strings of symbols, asking a very specific question: _which pattern shows up first, and where does it overlap with another?_ Finding repeated structure in what is supposed to look random is the whole job. So it is no surprise that Penney, off the clock, invented a game about exactly that.

He posed it as a recreational puzzle — "Problem 95: Penney-Ante" — in the _Journal of Recreational Mathematics_ in October 1969. It might have stayed a footnote to a puzzle column if **Martin Gardner** had not picked it up for his _Mathematical Games_ column in _Scientific American_ in 1974, the moment the game reached a wide audience. Penney was also famous among puzzle lovers for his "Problem of the Month" series, which ran from 1966 to 1974. The game outlived him; the question it asks is still one of the sharpest in probability.

## The bet

Here are the rules:

1. Two players each choose a pattern of heads and tails — we will use patterns of length 3.
2. A fair coin is flipped repeatedly.
3. The first player whose pattern appears _as a consecutive run_ in the sequence wins.

Two things make this different from a plain coin toss.

First, the patterns **overlap**. If the sequence is _H H H T_, then _HHH_ appears at positions 1–3 and _HHT_ appears at positions 2–4. A single stretch of flips can contain several patterns, and the race is decided by whichever one is _completed first_.

Second — and this is the whole story — **the order in which you choose matters**. In a normal coin toss the past is irrelevant. Here the past _is_ the game, because a pattern is a statement about the **order** of things, not just their counts.

## The grid of grudges

Your opponent picks a pattern first; you pick second. The table gives your best choice and your chance of winning:

::penney-graph
---
caption: 'Figure 1: Relationship between the eight patterns. Each arrow points from a pattern to a pattern it beats.'
---
| Opponent | **You** | Your chance of winning |
| -------- | ------- | ---------------------- |
| HHH      | **THH** | 7/8                    |
| HHT      | **THH** | 3/4                    |
| HTH      | **HHT** | 2/3                    |
| HTT      | **HHT** | 2/3                    |
| THH      | **TTH** | 2/3                    |
| THT      | **TTH** | 2/3                    |
| TTH      | **HTT** | 3/4                    |
| TTT      | **HTT** | 7/8                    |
::

Look at the shape of it. You never win less than two-thirds of the time. Against the two extreme patterns, _HHH_ and _TTT_, you win seven times out of eight.

And there is no "best" pattern. Every pattern is beaten by another, and the relationships run in a loop: _HHH_ is crushed by _THH_; _THH_ is beaten by _TTH_; _TTH_ falls to _HTT_; _HTT_ loses to _HHT_ — which is itself beaten by _THH_. It is **rock-paper-scissors played with coins**.

::try-this
---
title: 'Try it yourself.'
---
Flip a few coins on the [play page](/play/) and watch for patterns. Then run the bet with a friend: have them pick a three-flip pattern first, and use the table above to choose yours. You will win far more often than you lose — with a coin that is doing absolutely nothing "wrong".
::

## Why this happens

When you pick _THH_ against your opponent's _HHH_, you are not betting on the coin. You are betting on the **transition**. Pay attention to the continuum.

The dangerous moment for your opponent is when the sequence is _H H_ — one flip from their _HHH_. But that same _HH_ is the _second and third_ symbols of your _THH_. If the next flip is tails, your pattern simply begins again. Your pattern is _fragile in a useful way_: it can overlap with itself, so a failed attempt does not always reset you to zero.

_HHH_ is the opposite. To complete it you need three heads in a row, and any tail wipes out all progress. _THH_ can recover from a tail; _HHH_ cannot. The pattern that looked _stronger_ — three of a kind, the boldest choice — is actually the more brittle one.

There is a clean way to say this. Each pattern has a **self-overlap structure**: how much of its own ending can serve as its own beginning. _HHH_ overlaps itself completely (its last two symbols are its first two), which makes its completions arrive in tight, all-or-nothing bunches. _THH_ has less self-overlap and can be reached by more routes.

## Conway's numbers

The exact win probabilities come from a method invented by **John Horton Conway** (1937–2020)—the creator of the [Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). A simple idea that will be very helpful later.

A chain of flips is just a string. To compare two strings, slide one along the other and ask, at each alignment, _does the ending of one match the beginning of the other?_ Write `1` when it matches and `0` when it doesn't. That string of _bits_ is the **leading number** — or Conway number — for that ordered pair: a compact fingerprint of how the two patterns overlap.

Take $A = HHH$ and $B = THH$. For each ordered pair, compare the last $r$ symbols of the first pattern with the first $r$ symbols of the second, from $r = 3$ down to $r = 1$, and weight a match at $r$ by $2^{r-1}$:

**AA — _HHH_ over _HHH_:**

| $r$ | last $r$ of A | first $r$ of A | match      | weight |
| --- | ------------- | -------------- | ---------- | ------ |
| 3   | HHH           | HHH            | HHH=HHH; ✓ | 4      |
| 2   | HH            | HH             | HH=HH; ✓   | 2      |
| 1   | H             | H              | H=H; ✓     | 1      |

The bits read `111`, and in **binary** $111_2$ is $7$, so **AA = 7**.

The other three come out as:

- **AB** (_HHH_ over _THH_): no alignment matches (HHH≠THH; HH≠TH; H≠T) → `000` → **AB = 0**
- **BB** (_THH_ over _THH_): only $r = 3$ matches (THH=THH) → `100` → **BB = 4**
- **BA** (_THH_ over _HHH_): $r = 2$ and $r = 1$ match (THH≠HHH; HH=HH; H=H) → `011` → **BA = 3**

Together they form a 2×2 matrix:

|             | A = HHH | B = THH |
| ----------- | ------- | ------- |
| **A = HHH** | 7       | 0       |
| **B = THH** | 3       | 4       |

And the race is decided by comparing each pattern's overlap with itself against its overlap with the opponent:

$$\text{odds that } B \text{ beats } A = (AA - AB) : (BB - BA) = (7 - 0) : (4 - 3) = 7 : 1$$

Seven to one, from three lines of arithmetic. No simulation, no infinity of flips — just the overlap structure, written in binary. The leading numbers are not bookkeeping; they _are_ the overlap structure.

## The paper that proved the trick

Conway's algorithm was elegant, but for years it came without a proof. The proof arrived in 1982, from **Stanley Collings**, who introduced the quantity that makes everything click: the **average waiting time** — the expected number of flips until a pattern first appears. Collings proved three results that turn the leading numbers into real times:

| Theorem | What it gives                                            | In plain words                                |
| ------- | -------------------------------------------------------- | --------------------------------------------- |
| **X**   | $E[\text{wait for } A] = 2 \cdot AA$                     | how long until A appears on its own           |
| **Y**   | $E[\text{wait for } A \mid B] = 2 \cdot AA - 2 \cdot BA$ | the head start you inherit if B just appeared |
| **Z**   | odds $B$ before $A = (AA - AB) : (BB - BA)$              | who wins the race, and by how much            |

For _HHH_: $2 \times 7 = 14$ flips on average. For _THH_: $2 \times 4 = 8$. The single number `111₂` already knew both answers.

This is the part I find genuinely beautiful. The coin has no memory, yet the _pattern_ does: its ending can be its own beginning, and that self-overlap is exactly what the leading numbers measure. Conway's arithmetic is not a shortcut around the probabilities — it is the probabilities, written in the geometry of the strings themselves.

A modern, readable write-up of Collings's proof is a [2012 paper by **Yutaka Nishiyama**](https://www.researchgate.net/publication/259609321_Pattern_matching_probabilities_and_paradoxes_as_a_new_variation_on_penney's_coin_game), which restates the three theorems cleanly and extends the game.

**Yutaka Nishiyama** (b. 1948) is a Japanese mathematician at Osaka University of Economics, known as the "boomerang professor" for his work on boomerangs and for a long series of books on mathematics in everyday life (Kaprekar's 6174, egg shapes, flexagons). [His homepage](http://yutaka-nishiyama.sakura.ne.jp/) collects the rest.

## The mischievous wait

Now it gets stranger. There are two different questions you can ask about a pattern, and a fair coin answers them differently:

1. **How long does this pattern take to appear on its own?** This is its :term[average waiting time]{slug='average-waiting-time'}, written $W$: the expected number of flips until the pattern first shows up.
2. **If this pattern and another are racing, which is more likely to appear first?**

Your instinct says the pattern with the shorter average waiting time should win the race. Often it does. But not always.

Collings's Theorem X tells us how to compute $W$: it is twice the pattern's _self_ leading number. Concretely, let $L(S)$ be the set of lengths $r$ for which the last $r$ symbols of $S$ are the same as its first $r$ symbols — the pattern's self-overlaps. Then

$$W(S)=\sum_{r\in L(S)} 2^{r}$$

For _HHH_ the self-overlaps are $r=1,2,3$, so $W(HHH)=2+4+8=14$. For _THH_ only $r=3$ is a self-overlap, so $W(THH)=2^3=8$. The more a pattern overlaps itself, the longer it tends to take to appear.

So _HHH_ takes nearly twice as long as _THH_, and it loses the race — that part is intuitive. Now look at a pair where the intuition breaks:

| Pattern pair     | Average waiting time         | Probability the first pattern wins  |
| ---------------- | ---------------------------- | ----------------------------------- |
| _THTH_ vs _HTHH_ | $W(THTH)=20$ vs $W(HTHH)=18$ | $P(\text{THTH before HTHH}) = 9/14$ |
| _TTHH_ vs _HHH_  | $W(TTHH)=16$ vs $W(HHH)=14$  | $P(\text{TTHH before HHH}) = 7/12$  |
| _THHH_ vs _HHH_  | $W(THHH)=16$ vs $W(HHH)=14$  | $P(\text{THHH before HHH}) = 7/8$   |

The first row is Collings's own example. _THTH_ takes **longer** to appear on average than _HTHH_ — 20 flips against 18 — yet _THTH_ is the one favored to appear first, nine times out of fourteen. The second and third rows show the same reversal against _HHH_: it is the **fastest** pattern in both — average waiting time 14, less than 16 — and it **loses the race** in both. Against _THHH_ it loses seven times out of eight. Against _TTHH_ it loses more than half the time.

> "Arrives sooner on average" and "wins the race" are different questions. A fair coin answers them differently.

Collings, who first wrote this down, called it _a paradox within a paradox_. It feels like a contradiction until you see why the questions separate. An average waiting time is computed over thousands of separate, independent runs. A race is a single shared sequence, where one pattern's arrival can block the other before it ever gets started. The average is a fact about many worlds; the race is a fact about one.

## Same coin, everywhere

The loop we found is not a coin trick. It is a general structure called :term[nontransitivity]{slug='nontransitive'} — a game with no best move, only a best move _against something_. Once you see it, you find it everywhere:

- **Rock-paper-scissors** is the purest example: no gesture beats the other two, yet every gesture beats one and loses to another.
- [**Nontransitive dice**](https://en.wikipedia.org/wiki/Intransitive_dice) exist in the same way — sets of dice where each die is more likely to beat the next, around and around.
- **Condorcet cycles** in voting: with three candidates, a majority can prefer A to B, B to C, and C to A. No candidate beats all the others, so there is no "will of the people" to read off — only the order in which you ask.

And then there is biology. In a striking 2020 experiment, researchers engineered three strains of _E. coli_ that kill each other in a loop: 🔴 Red kills Green, 🟢 Green kills Blue, 🔵 Blue kills Red. But the kills are not equally strong — Red's toxin is by far the deadliest. You would expect Red, the strongest, to take over the plate. It never does. Red kills its victim so quickly that it soon faces the one enemy it cannot beat, while the mildest strain, ignored because it is no one's immediate threat, survives, spreads, and slowly inherits everything. The authors called it [**survival of the weakest**](https://www.nature.com/articles/s41467-020-19963-8). In a nontransitive world, the "strongest weapon" is a liability.

In each of these examples, nothing is wrong with any single option. The cycle appears only when you compare them two at a time.

## There is no strongest pattern

Penney spent a lifetime reading sequences that someone else was trying to keep secret. It is not hard to see why a game about which pattern appears first would appeal to him: in cryptanalysis the answer never depends on the symbols alone. Decyphering a message has a lot to do with uncovering hidden patterns.

What he left behind is more than a math trick. It is a small, perfect demonstration of a large idea: if there is no strategy that beats all the others, then "the best" is not a property a strategy has on its own. It is a property of the **relationship** between two players. Strength is relational. A pattern is strong only because of the pattern it faces; change the opponent and the same pattern becomes the loser.

This is why the waiting-time paradox and the _E. coli_ experiment are the same story. In a cyclic world, being the strongest is not a safe position — it is the position that has a predator. The deadliest strain is the one that overcommits and exposes itself, the bravest. The "weakest" wins because it is nobody's target until it is too late. And the same self-overlap that decides the coin game is what makes a pattern's strength relational: the ending that helps you against one opponent is the ending that betrays you against another.

Nontransitivity is also the shape of most real disagreements. When A beats B, B beats C, and C beats A, no amount of careful ranking will produce a stable order — not because the players are irrational, but because the relation itself contains a cycle.

So perhaps the oldest use of the coin — to produce one winner, cleanly, without argument — has been quietly telling us the opposite of what we assumed. A fair coin can settle a race in a binary decision. It cannot tell you which of three things is best, because "best" may not exist. What exists is the cycle, and every position in it is someone's strength and someone else's weakness.

We spend a lot of time searching for the best pattern to play. The coin suggests a more honest question: not _what is the best move?_ but _is this the right moment, and is this the right opponent?_ In a world of cycles, winning is less about being the strongest and more about being in the right place at the right time.

## See also

:term[Penney's game]{slug='penneys-game'} · :term[Leading number]{slug='leading-number'} · :term[Average waiting time]{slug='average-waiting-time'} · :term[Nontransitive]{slug='nontransitive'}

## References

- Penney, W. "Problem 95. Penney-Ante." _Journal of Recreational Mathematics_, 1969. Overview: [Penney's game](https://en.wikipedia.org/wiki/Penney%27s_game).
- Nishiyama, Y. "Pattern Matching Probabilities and Paradoxes — A New Variation on Penney's Coin Game." _Osaka Keidai Ronshu_, 2012. [ResearchGate](https://www.researchgate.net/publication/259609321_Pattern_matching_probabilities_and_paradoxes_as_a_new_variation_on_penney's_coin_game)
- Collings, S. "Coin Sequence Probabilities and Paradoxes." _Bulletin of the Institute of Mathematics and its Applications_, 1982. [PDF scan](https://yutaka-nishiyama.sakura.ne.jp/math/stanley_collings.pdf)
- Li, S.-Y. R. "A Martingale Approach to the Study of Occurrence of Sequence Patterns in Repeated Experiments." _The Annals of Probability_, 1980. [doi.org/10.1214/aop/1176994578](https://doi.org/10.1214/aop/1176994578)
- Lynn, B. "Penney's Game." [theory.stanford.edu/~blynn/pr/penney.html](https://theory.stanford.edu/~blynn/pr/penney.html) — the generating-function derivation behind Conway's algorithm.
- Liao, M. J. et al. "Survival of the Weakest in Non-transitive Asymmetric Interactions among Strains of _E. coli_." _Nature Communications_, 2020. [nature.com/articles/s41467-020-19963-8](https://www.nature.com/articles/s41467-020-19963-8)
- Walter Penney (1913–2000): [obituary](https://www.washingtonpost.com/archive/local/2000/06/26/walter-penney-cryptographer-dies-at-87/09b7cefc-fc18-4339-8757-304bd5814704/) · [biography (FR)](https://fr.wikipedia.org/wiki/Walter_Penney)
- Weisstein, E. W. "Coin Tossing." [MathWorld](https://mathworld.wolfram.com/CoinTossing.html).
