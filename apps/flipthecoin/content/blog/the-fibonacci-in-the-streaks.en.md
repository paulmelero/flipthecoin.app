---
title: 'The Fibonacci in the Streaks'
slug: the-fibonacci-in-the-streaks
series: patterns-in-the-noise
seriesOrder: 3
_locale: en
description: 'The chance of never seeing two tails in a row is a Fibonacci number divided by 2ⁿ. Streak-avoidance hides the golden ratio — and a set of constants Feller found at the edge of randomness.'
published: false
level: intermediate
date: 2026-10-08T10:00:00Z
tags:
  - Fibonacci
  - golden ratio
  - runs
  - streaks
  - coin flip
  - combinatorics
  - Feller
  - pattern matching
---

# The Fibonacci in the Streaks

_Flip a coin $n$ times. What is the chance you never see two tails in a row? The answer is a Fibonacci number divided by $2^n$ — the coin has been counting in golden-ratio arithmetic all along._

Start with something you can check by hand. Toss a coin three times. There are eight possible sequences, and the ones with **no two tails in a row** are

```text
HHH   HHT   HTH   THH   THT
```

five of them. So the probability is $5/8$.

Now do four tosses. Sixteen sequences, and the streak-free ones number $8$ — exactly half. Five tosses: $13/32$. Six: $21/64$. The numerators are

$$2,\ 3,\ 5,\ 8,\ 13,\ 21,\ \dots$$

which is the **Fibonacci sequence**. The probability that $n$ tosses contain no $TT$ is

$$\frac{F_{n+2}}{2^n}.$$

<!--more-->

## Why Fibonacci shows up

The reason is a recurrence, and it is almost embarrassingly simple.

Let $a_n$ be the number of length-$n$ sequences with no two consecutive tails. Look at the **last** symbol.

- If it is **H**, the first $n-1$ symbols can be any streak-free sequence: $a_{n-1}$ ways.
- If it is **T**, the symbol before it cannot be T (that would make $TT$), so the sequence ends in **HT**, and the first $n-2$ symbols can be any streak-free sequence: $a_{n-2}$ ways.

So

$$a_n = a_{n-1} + a_{n-2},$$

which is exactly the Fibonacci recurrence. With $a_1 = 2$ and $a_2 = 3$, this gives $a_n = F_{n+2}$. Divide by the $2^n$ total sequences and you have the probability.

> A constraint on the _end_ of the string — "the last two cannot both be T" — is enough to generate the Fibonacci numbers. The golden ratio is hiding in a rule about a single pair of adjacent flips.

## More than two: the $k$-step Fibonacci

Nothing special about two. Ask instead for **no $k$ tails in a row**. The same "look at the end" argument gives a longer recurrence,

$$a_n = a_{n-1} + a_{n-2} + \dots + a_{n-k},$$

the **$k$-step Fibonacci** (or $k$-bonacci) numbers. For $k = 3$ they are the tribonacci numbers $0, 1, 1, 2, 4, 7, 13, 24, \dots$, and the probability of no $TTT$ in $n$ tosses is $F^{(3)}_{n+2}/2^n$:

| $n$      | 1     | 2     | 3     | 4       | 5       | 6       |
| -------- | ----- | ----- | ----- | ------- | ------- | ------- |
| no $TT$  | $2/2$ | $3/4$ | $5/8$ | $8/16$  | $13/32$ | $21/64$ |
| no $TTT$ | $2/2$ | $4/4$ | $7/8$ | $13/16$ | $24/32$ | $44/64$ |

The longer the forbidden run, the slower the probability falls — as you would expect. Forbidding one specific triple costs you very little at first.

::try-this
---
title: 'Count the streaks.'
---
Flip a coin twenty times on the [play page](/play/) and look at your longest run of tails. Two in a row is common; five is rare. The table above says the chance of _never_ getting two tails in a row drops below one in ten somewhere around $n = 12$ — see how quickly your own flips stop being streak-free.
::

## The golden ratio in the decay

As $n$ grows, $F_{n+2}/2^n$ does not just shrink — it shrinks at a _fixed rate_, and that rate is the golden ratio. Since $F_m \sim \varphi^m/\sqrt5$ with $\varphi = (1+\sqrt5)/2 \approx 1.618$,

$$\frac{F_{n+2}}{2^n} \;\sim\; \frac{\varphi^{2}}{\sqrt5}\left(\frac{\varphi}{2}\right)^{n}.$$

The probability decays by a factor of $\varphi/2 \approx 0.809$ per flip. The golden ratio, which usually appears in spirals and pentagons, is here a **decay constant**: the rate at which the coin forgets how to avoid a streak.

## Feller's constants

For a fixed forbidden run length $k$, the exact probability has a beautiful limiting form, worked out by William Feller. Let $w_k(n)$ be the probability that $n$ tosses contain no run of $k$ heads. Then

$$w_k(n)\,\alpha_k^{\,n+1} \to \beta_k,$$

where $\alpha_k$ is the smallest positive root of

$$1 - x + \left(\frac{x}{2}\right)^{k+1} = 0,$$

and

$$\beta_k = \frac{2 - \alpha_k}{k + 1 - k\,\alpha_k}.$$

For $k = 3$ this gives $\alpha_3 = 1.087378025\ldots$ and $\beta_3 = 1.236839845\ldots$. For $k = 2$ the root is a golden-ratio expression in disguise:

$$\alpha_2 = \frac{2}{\varphi} = \sqrt5 - 1, \qquad \beta_2 = \frac{2\varphi}{\sqrt5}.$$

The constants are not decoration. They are the exact asymptotics of the streak problem — the same kind of "leading number" structure we met in [Patterns In, Paradoxes Out](/blog/patterns-in-paradoxes-out), now applied to the probability of _avoiding_ a pattern instead of waiting for one.

For an unfair coin, with heads at probability $p$ and tails at $q = 1-p$, the root moves: $\alpha_k'$ is the smallest positive root of

$$1 - x + q\,p^{k}x^{k+1} = 0,$$

and $\beta_k' = (1 - p\,\alpha_k')/\big((k+1 - k\,\alpha_k')\,p\big)$.

## The other side of the coin

There is a symmetry worth pausing on. In the [first article](/blog/patterns-in-paradoxes-out) we asked how long we must **wait** for a pattern. Here we asked how many sequences **avoid** one. The two are the same geometry seen from opposite sides.

A pattern like $HHH$ overlaps itself completely, which is why it takes a long time to arrive. The sequences that avoid it are exactly the ones that never fall into that overlapping trap — and counting them produces the Fibonacci numbers. The forbidden pattern, not the coin, is what creates the arithmetic.

## Order out of independence

Every flip is independent. The coin does not know what it did before, and no sequence is more likely than any other. And yet the moment you impose a single, local constraint — _no two tails in a row_ — a rigid structure appears: a linear recurrence, a golden-ratio decay rate, and constants that a mathematician could compute to six decimal places.

This is one of the quiet lessons of probability. Randomness is not the enemy of order; it is the raw material. Impose almost nothing on it and you get noise. Impose one small rule and the noise sorts itself into Fibonacci numbers.

The coin has no memory. But the set of histories that _avoid_ something has a shape — and the shape is the golden ratio.

## See also

:term[Leading number]{slug='leading-number'} · :term[Average waiting time]{slug='average-waiting-time'} · :term[Penney's game]{slug='penneys-game'}

## References

- Weisstein, E. W. "Coin Tossing." [MathWorld](https://mathworld.wolfram.com/CoinTossing.html).
- Weisstein, E. W. "Coin Tossing." _CRC Concise Encyclopedia of Mathematics_ (archive). [archive.lib.msu.edu](https://archive.lib.msu.edu/crcmath/math/math/c/c429.htm) — source of Feller's constants.
- "Fibonacci number." [Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number).
- OEIS Foundation. Sequence [A000045](https://oeis.org/A000045) (Fibonacci numbers).
