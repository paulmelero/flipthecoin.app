---
title: 'Every Story the Coin Can Tell'
slug: every-story-the-coin-can-tell
series: patterns-in-the-noise
seriesOrder: 2
_locale: en
description: 'How long must you flip a coin before every possible pattern of length n has appeared at least once? The answer is a magic number — and it hides de Bruijn sequences, a doubly-exponential count, and the Euler–Mascheroni constant.'
published: false
level: intermediate
date: 2026-10-01T10:00:00Z
tags:
  - de Bruijn sequence
  - superpattern
  - coin flip
  - combinatorics
  - waiting time
  - Euler-Mascheroni constant
  - pattern matching
---

# Every Story the Coin Can Tell

_Flip a coin long enough and every possible pattern of n tosses will appear somewhere. How long is "long enough"? The answer is a magic number — smaller than you would guess, and stranger than it looks._

Here is a question that sounds like it should be hard. You flip a coin and write down the sequence. How many flips do you need before **every possible block of $n$ tosses** has appeared somewhere in your record — not in order, just at least once each?

There are $2^n$ different blocks of length $n$. So you might guess you need about $2^n$ flips, maybe a bit more.

The exact answer is

$$2^n + n - 1.$$

That is the **shortest possible** sequence containing all $2^n$ blocks of length $n$. Not "about", not "on average" — the minimum, exactly.

<!--more-->

## Why the number is what it is

The lower bound is almost obvious once you see it. A sequence of length $L$ contains exactly $L - n + 1$ blocks of length $n$ (one starting at each position, and the last $n-1$ positions cannot start a full block). To contain all $2^n$ distinct blocks, you need

$$L - n + 1 \ge 2^n,$$

so $L \ge 2^n + n - 1$.

What is not obvious is that this bound is **achievable** — that there really is a string of exactly that length with no wasted window. But there is, and the constructions have a name.

## Small cases

- **$n = 1$.** You need both single results: $H$ and $T$. Length $2 = 2^1 + 1 - 1$. (Two strings work: _HT_ and _TH_.)
- **$n = 2$.** You need _HH_, _HT_, _TH_, _TT_. Length $5 = 2^2 + 2 - 1$. For example _HHTTH_ contains _HH_, _HT_, _TT_, _TH_.
- **$n = 3$.** You need all eight triples. Length $10 = 2^3 + 3 - 1$. One example is _HHHTTTHTHT_.

The shortest lengths run

| $n$               | 1   | 2   | 3   | 4   | 5   | 6   | 7   |
| ----------------- | --- | --- | --- | --- | --- | --- | --- |
| shortest sequence | 2   | 5   | 10  | 19  | 36  | 69  | 134 |

which is OEIS [A052944](https://oeis.org/A052944).

::try-this
---
title: 'Try to beat the machine.'
---
For $n = 3$, can you find a length-10 string containing all eight triples? It is harder than it looks. Try it by hand, or flip on the [play page](/play/) and hunt for the eight patterns yourself — then compare with the example above.
::

## The cyclic cousins: de Bruijn sequences

The cleanest way to build a shortest sequence is to start with something even tidier: a **de Bruijn sequence**.

A binary de Bruijn sequence of order $n$ is a _cyclic_ string of length $2^n$ in which every length-$n$ word appears **exactly once**. For $n = 3$, one example is

```text
0 0 0 1 1 1 0 1
```

Read it around the loop and the eight windows are $000, 001, 011, 111, 110, 101, 010, 100$ — all eight triples, no repeats. To turn the cycle into an ordinary (linear) sequence that contains every word, you simply cut it and repeat the first $n-1$ symbols at the end:

```text
0 0 0 1 1 1 0 1 0 0
```

Length $10 = 2^3 + 3 - 1$. The lower bound and the construction meet, so $2^n + n - 1$ is optimal.

De Bruijn sequences were studied by Nicolaas de Bruijn in [a 1946 paper](https://dwc.knaw.nl/DL/publications/PU00018235.pdf), though the idea goes back further. They turn up everywhere a system must cycle through all its states: in cryptography, in DNA sequencing, in rotary encoders.

## How many shortest strings are there?

Quite a lot. The number of binary de Bruijn sequences of order $n$ is

$$2^{2^{n-1}},$$

giving $2, 4, 16, 256, 65536, \dots$ (OEIS [A001146](https://oeis.org/A001146)). The count grows _doubly exponentially_: for $n = 6$ there are already more than four billion shortest sequences. The length is fixed, but the number of ways to achieve it explodes.

## A hidden coincidence

Now connect this back to the [previous article](/blog/patterns-in-paradoxes-out). There we met the **average waiting time** of a pattern: the expected number of flips until it first appears, and how it depends on a pattern's self-overlap.

Suppose you pick a pattern of length $n$ **at random** — all $2^n$ patterns equally likely — and ask how long, on average, you must wait to see it. Average over all of them, and you get… exactly $2^n + n - 1$ again. (This is OEIS [A052944](https://oeis.org/A052944); for $n = 4$, the average of the sixteen waiting times is $19$.)

That is a genuine surprise. Two completely different questions — _"how short can a string be that contains every pattern?"_ and _"how long does a random pattern take to appear?"_ — have the same answer.

## The hard version is still open

Constructing a shortest string is one thing. Just flipping a coin until you have _seen_ every pattern is another, and that one is not solved.

The conjecture is that as $n$ grows, the expected number of flips needed to have seen all $2^n$ patterns is

$$2^n\left(\gamma + n\ln 2\right),$$

where $\gamma \approx 0.5772$ is the Euler–Mascheroni constant (Havil 2003). The shape is familiar: it is exactly the classical **coupon collector** answer — collect $m$ coupons and the expected time is about $m(\ln m + \gamma)$. Here the "coupons" are the $2^n$ patterns, and $\ln 2^n = n \ln 2$. The difficulty is that the windows of a coin sequence are not independent draws — they overlap — so the classical proof does not apply directly, and the result remains conjectural.

## Every story, eventually

There is something quietly vertiginous here. The number of length-$n$ stories a coin can tell is finite — $2^n$ of them — and there is a single string of length $2^n + n - 1$ that tells every one. Flip long enough and you will not merely _be able_ to tell every story; you will _have_ told them all, in one unbroken sequence, with no editing.

The coin has no plot. But somewhere inside it, every plot of length $n$ is waiting: the run of a hundred heads, the pattern that spells your birthday, the one that looks exactly like a message. They are not rare in any mystical sense. They are a finite, countable list, and a long enough sequence contains all of them.

We like to think of randomness as the absence of meaning. But a truly long random string is closer to a library: every short book is in it, including the ones that look like they were written on purpose.

## See also

:term[Penney's game]{slug='penneys-game'} · :term[Leading number]{slug='leading-number'} · :term[Average waiting time]{slug='average-waiting-time'}

## References

- de Bruijn, N. G. "A Combinatorial Problem." _Indagationes Mathematicae_, 1946. [PDF](https://dwc.knaw.nl/DL/publications/PU00018235.pdf)
- OEIS Foundation. Sequence [A052944](https://oeis.org/A052944) (shortest length containing all $n$-bit strings) and [A001146](https://oeis.org/A001146) (de Bruijn-sequence counts).
- Weisstein, E. W. "Coin Tossing." [MathWorld](https://mathworld.wolfram.com/CoinTossing.html).
