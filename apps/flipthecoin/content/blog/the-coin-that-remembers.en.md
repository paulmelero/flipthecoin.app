---
title: 'The Coin That Remembers'
slug: the-coin-that-remembers
series: Chaos
seriesOrder: 4
_locale: en
description: 'A coin has a past, but when we study probability, we routinely treat successive coin tosses as independent.'
published: true
level: advanced
date: 2026-08-19T10:00:00Z
tags:
  - random walk
  - memoryless
  - memorylessness
  - Markov process
  - geometric distribution
  - exponential distribution
  - number e
  - coin flip
  - probability
  - mathematics
  - physics
  - causality
  - randomness
  - bias
---

# The Coin That Remembers

I would like to introduce the concept of "memorylessness". We often say that a coin has no memory. But let me explain it better. Some of you may already be familiar with the concept of "Markov property". If not, don't worry, we will go step by step.

<!--more-->

Flip a **fair** coin and get heads. Flip it again, and the previous result shouldn't matter. Get heads ten times in a row and, on the eleventh flip, heads is still just as likely as tails. The chance of having a son when your first two children were girls [is still $\tfrac{1}{2}$](https://woddsup.com/e/1/5/third-child-same-sex).

A fair coin doesn't know what happened before. It has no memory, no recollection, no awareness of its past. It should be purely random, fair, perfect.

But a real coin **does** remember. Not consciously, of course. But physically.

## A real coin remembers its past

When you toss a coin, its final outcome is not created from nothing. It follows from the state in which you launched it: its initial orientation, its position, its velocity, its angular momentum, the way it spins, and the forces acting on it as it flies through the air.

If we knew all of those quantities precisely enough, classical mechanics would tell us where the coin should land.

The coin doesn't suddenly become random when it leaves your hand.

In fact, [experiments by Persi Diaconis, Susan Holmes and Richard Montgomery](https://www.stat.berkeley.edu/~aldous/157/Papers/diaconis_coinbias.pdf) found that a naturally tossed coin has a small but measurable tendency to land on the same face it started on. In their experiments, that probability was around 51%, rather than the idealized 50%.

So if the coin starts heads-up, that information has not completely disappeared.

The physical coin has **memory**.

And yet, when we study probability, we routinely treat successive coin tosses as independent. Is that a contradiction?

Not really. It is the difference between the **physical world** and the **mathematical model we choose to describe it**.

A physical coin toss is causal. Given sufficiently detailed initial conditions, its motion follows the laws of physics.

It can also be extremely sensitive to those initial conditions. A microscopic difference in the way you launch the coin can eventually produce a different outcome.

And from our point of view, because we cannot measure all those initial conditions with infinite precision, the result is effectively random.

Randomness, in other words, does not necessarily mean **absence of causality** when we look closely at the physical details of a process.

It can simply mean that we don't have access to all the information and we need to simplify the model to make it tractable.

## What does "memoryless" actually mean?

When probability theory says that successive coin flips are independent, it isn't claiming that a physical coin has literally forgotten its past.

It is describing an **idealized process** in which knowing the previous outcomes gives us no information about the next one.

This idea becomes much more interesting when we move from coin flips to :term[stochastic processes]{slug='stochastic-process'}, as we saw in the [previous article "How a Fair Coin Spends Most of Its Life Looking Unfair?"](https://flipthecoin.app/blog/fair-coin-random-walk-arcsine-law).

A stochastic process is simply a system that evolves over time while involving some element of randomness. Our familiar random walk is one: start at zero, move one step up (↗️) for heads and one step down (↘️) for tails, and repeat.

### Markov

A particularly important class of stochastic processes are :term[Markov processes]{slug='markov-process'}.

The Markov property says something surprisingly specific:

> **Once you know the present state, knowing the entire past gives you no additional information about the future.**

The present may contain everything that matters about the past. For a coin flip, the present state is all its previous outcomes collapsed into a single value, folded into a single state.

That is a much more precise meaning of "no memory", a more fine-grained way to describe the concept.

## The coin flip has a discrete memoryless cousin

There is an even more direct way to encounter this idea with a coin.

Imagine flipping a fair coin until you get your first heads.

How many flips will you need?

The answer is uncertain. You might get heads immediately:

```
H
```

Or you might need:

```
T T T H
```

Or perhaps:

```
T T T T T T T H
```

Now suppose you've already flipped the coin five times without seeing heads.

Does that change the probability that you will need to wait another three flips? **No**.

The coin doesn't become more likely to produce heads because you've been waiting for a while.

The number of flips until the first heads follows a :term[geometric distribution]{slug='geometric-distribution'}, and the geometric distribution has the remarkable property of being :term[memoryless]{slug='memorylessness'}.

If you've already waited $n$ flips, the probability of waiting another $m$ flips is exactly the same as it would have been at the beginning.

In symbols,

$$
P(N>n+m\mid N>n)=P(N>m).
$$

This is read as:

> The probability that $N$ is greater than $n+m$, given that $N$ is greater than $n$, equals the probability that $N$ is greater than $m$.

In other words, if you've already waited $n$ flips, the probability of waiting at least another $m$ flips is exactly the same as the probability of waiting $m$ flips from the beginning.

The $n$ flips we've already endured simply disappear from the equation.

That is memorylessness in its purest mathematical form.

But something even more beautiful happens when we **stop counting flips**.

## From flips to time

Instead of asking:

> How many coin flips until something happens?

imagine asking:

> How long until _something_ happens?

Now time is **continuous** rather than a sequence of discrete steps.

Suppose events occur randomly at a constant average rate $\lambda$. What is the probability that we will still be waiting after time $t$?

The answer is:

$$
S(t)=P(T>t)=e^{-\lambda t}.
$$

And what a surprising appearance it is.

**$e$**

The number $2.71828\ldots$ has appeared in our coin-flipping story.

But why? Why this foundamental number in mathematics?

## The shape of oblivion

> **/ob•liv•i•on/**
>
> _noun_
>
> 1. the state of being completely forgotten

The answer is hiding inside the memoryless property itself.

Suppose we've already waited $s$ seconds. What is the probability that we will have to wait another $t$ seconds?

Memorylessness demands that this should depend only on $t$, not on the time we've already spent waiting:

$$
P(T>s+t\mid T>s)=P(T>t).
$$

Read it as:

> The probability that $T$ is greater than $s+t$, given that $T$ is greater than $s$, equals the probability that $T$ is greater than $t$.

Using the exponential formula and resolving algebraically (we will skip it for this article but you can find the derivation in [the Wikipedia article](https://en.wikipedia.org/wiki/Memorylessness#Characterization_of_exponential_distribution)), we get:

$$
e^{-\lambda t}.
$$

And look what happened.

The past, $s$, cancelled out.

The amount of time we've already waited has completely disappeared.

The exponential function isn't merely _a_ function that happens to describe memorylessness. It is the continuous mathematical form of this idea.

The former expression can be understood as:

> If we've already waited $s$ seconds, the probability of waiting at least another $t$ seconds is exactly the same as the probability of waiting $t$ seconds when we started.

A fresh start. Forgetting the past.

There is an equally beautiful way to see why $e$ keeps appearing.

The **exponential function** has the unique property that its rate of change is proportional to itself:

$$
\frac{d}{dt}e^t=e^t.
$$

A quantity can therefore grow or decay continuously while always changing at a rate determined by its current size.

Expressed differently, $e^t$ grows at a constant rate and at any moment, its future growth follows the same rule $e^t$.

That is why $e$ appears everywhere we encounter continuous growth and decay: populations, radioactive decay, compound interest, diffusion, differential equations—and, here, the probability of waiting for something to happen.

The same mathematical structure keeps returning. I find it fascinating how often the same mathematical ideas appear in different contexts.

## A coin is a toy model

A fair coin is a [toy model](https://en.wikipedia.org/wiki/Toy_model).

It is not a perfect description of a real coin. We deliberately leave out almost everything: the shape of the coin, its spin, air resistance, the force of the throw, its initial orientation, its imperfections. We keep only what we need for the question we want to ask: heads or tails.

This is what mathematicians do. They simplify the world to its essentials, and then they study the consequences of that simplification until something fundamental becomes visible.

For the coin, **independence** allows us to forget the details of the previous toss. For a Markov process, the **present state** contains everything from the past that matters for predicting the future. And for the exponential distribution, **the elapsed waiting time can disappear** from the calculation altogether.

The real world is messier. But the toy model can reveal something that the mess was hiding.

A fair coin is random by construction. The real coin is deterministic, but its motion can be extremely sensitive to its initial conditions (remember [Brownian motion](https://flipthecoin.app/blog/fair-coin-random-walk-arcsine-law)?).

> **Randomness and chaos may look similar from the outside, but they are not the same thing.**

Perhaps that is why the humble coin is such a useful object to think with. It is simple enough to teach us probability, but not so simple that it leaves the real world behind.

It just depends on the details you choose to include or ignore.
