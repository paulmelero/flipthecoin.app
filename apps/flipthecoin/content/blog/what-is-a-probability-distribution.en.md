---
title: What Is a Probability Distribution?
slug: what-is-a-probability-distribution
series: probability-basics
seriesOrder: 3
_locale: en
description: A gentle introduction to probability distributions and the binomial distribution — with an interactive Galton board you can play with.
published: true
level: beginner
date: 2026-06-12T10:00:00Z
tags:
  - Probability distribution
  - Binomial distribution
  - Francis Galton
  - Bell curve
  - Galton board
---

# What Is a Probability Distribution?

Flip a coin once and the outcome is a coin toss. Flip it a hundred times and something more interesting appears: a _shape_. Count how often each result happens and you are no longer looking at luck — you are looking at a **probability distribution**. This short article explains what that means, introduces the most famous distribution born from coin flips, and lets you watch one build itself, ball by ball, in an interactive Galton board.

<!--more-->

## A distribution is just a map of "how likely"

A **probability distribution** is a complete answer to the question _"what can happen, and how likely is each thing?"_ It pairs every possible outcome with its probability.

For a single fair coin flip, the distribution is tiny:

$$P(\text{heads}) = \tfrac{1}{2}, \qquad P(\text{tails}) = \tfrac{1}{2}$$

Two outcomes, each with probability one-half. There is one rule a distribution can never break: **all the probabilities have to add up to 1**, because _something_ always happens.

$$\tfrac{1}{2} + \tfrac{1}{2} = 1$$

That is the whole idea. Distributions get interesting not when one event happens, but when we repeat an experiment many times and ask how the results spread out. (If the words _probability_ and _likelihood_ still feel slippery, start with [Probability Basics](https://flipthecoin.app/blog/probability-basics/).)

## The binomial distribution

Now flip a fair coin $n$ times and count the heads. The number of heads can be anything from $0$ to $n$, and the probabilities of each count form the **binomial distribution** — the distribution of "how many successes in $n$ independent yes/no trials".

For a fair coin its formula is:

$$P(k \text{ heads in } n \text{ flips}) = \binom{n}{k}\left(\tfrac{1}{2}\right)^{n}$$

and more generally, when "heads" has probability $p$ (not necessarily one-half):

$$P(k) = \binom{n}{k}\, p^{k} (1-p)^{n-k}$$

The interesting part is the **shape**. Extreme results — all heads or all tails — are rare, because there is only _one_ way to get each of them. Middle results are common, because there are _many_ different orderings that land there. Plot the probabilities and you get a hump that is tall in the centre and thin at the edges: the beginnings of the famous **bell curve**.

Why exactly those $\binom{n}{k}$ counts appear — and why they are the rows of Pascal's triangle — is a story in itself, told in [What Do Pascal's Triangle and a Coin Have in Common?](https://flipthecoin.app/blog/pascals-triangle-combinatorics-and-coin-flips/). Here we just need the punchline: **add up enough fair, independent choices and the results pile up into a bell.**

## Enter: Francis Galton

The most charming way to _see_ a binomial distribution was dreamed up by **Sir Francis Galton** (1822–1911), a restless Victorian polymath and a half-cousin of Charles Darwin (they shared a grandfather, Erasmus Darwin). Galton explored south-west Africa as a young man, then spent the rest of his life measuring and counting almost everything he could — weather (he drew the first newspaper weather map), fingerprints, even the supposed "efficacy" of prayer. Along the way he pioneered statistical ideas we still use daily, including **correlation** and **regression toward the mean**.

To demonstrate how order emerges from randomness, Galton built a device he called the **quincunx** — today we call it the **Galton board**. Drop a ball into a triangular array of pegs. At every peg it bounces left or right, more or less at random — exactly like a coin flip. After many rows of pegs, each ball lands in a bin near the bottom. A single ball is unpredictable. But pour in hundreds, and the bins fill up into the unmistakable bell shape of the binomial distribution. Galton had turned an abstract formula into something you can watch with your own eyes.

## See it happen

Press **Release balls** and watch the pile build. Each ball is one little experiment; the growing stacks are the distribution drawing itself. Press **Reset** to start over.

::galton-board
::

Notice how no single ball "knows" where it should go, yet the crowd reliably sketches the same bell every time. That is the quiet magic of probability distributions: individual events stay unpredictable, but their _collective_ behaviour is remarkably orderly.

So how does this connect to a single coin? **Each left-or-right bounce in the board is one coin flip** — and every ball that reaches the bottom is one whole experiment of several flips, landing in the bin that matches how many times it went "heads". That is exactly why a single toss can never reveal a curve: a curve is a pattern that lives in _many_ results, not in one. Flip once and you simply get heads or tails. Flip again and again, keep count, and those counts slowly trace the same bell you see above.

[Flip a coin online](https://flipthecoin.app/play/) and watch your own flip history grow — the distribution only takes shape once the tosses pile up, just like the balls.
