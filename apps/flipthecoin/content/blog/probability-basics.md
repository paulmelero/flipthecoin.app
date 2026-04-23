---
title: Probability Basics
description: Learn the basics of probability and how it relates to coin flips.
published: true
date: 2026-04-23T01:00:00Z
---

# Probability Basics

Probability is a branch of mathematics that deals with the likelihood of an event occurring. It is a way of quantifying uncertainty and measuring the likelihood of different outcomes. In the context of coin flips, probability is used to determine the likelihood of the coin landing on **heads** or **tails**.

This article is an introduction to the topic of probability. We will stick to plain language and use a coin as the only example. More advanced statistics will come in future articles.

## The Basics

When we talk about probability, this is a mathematical concept that can be represented in a few different ways. The most common way to represent probability is as a fraction, decimal, or percentage. For example, if you flip a fair coin, the probability of it landing on heads is $\frac{1}{2}$, which is the same as **0.5**, or also **50%**. The three representations are equivalent and can be used interchangeably.

As we will see in [The Unexpected Statistics of Coin Flips blog post](https://flipthecoin.app/blog/the-unexpected-statistics-of-coin-flips), the probability of a coin landing is not exactly 50-50 every time.

## Outcomes and events

Before we go further, two small pieces of vocabulary:

- An **outcome** is one of the possible things that can happen. When you flip a coin, the outcomes are _heads_, _tails_, and (very rarely) _edge_.
- An **event** is a question we ask about the outcomes, like "did it land on heads?" or "did it land on a face at all?".

Probability is the tool we use to put a number on how likely an event is.

## The probability scale

Probabilities always live on a scale from **0 to 1**:

- **0** means the event is impossible. A coin turning into a pigeon mid-air has probability 0.
- **1** means the event is certain. A flipped coin eventually coming back down, thanks to gravity, has probability 1.
- Anything in between is "somewhat likely". A fair coin landing on heads sits right in the middle, at **0.5**.

In percentage terms, that same scale goes from **0%** to **100%**. Same idea, expressed in a different way.

## The complement rule

Every event has a mirror image called its **complement**: the event of it _not_ happening. And because something either happens or it doesn't, the two probabilities always add up to 1. In symbols:

$$P(\text{not } A) = 1 - P(A)$$

For a fair coin:

- $P(\text{heads}) = 0.5$, so $P(\text{not heads}) = 1 - 0.5 = 0.5$.
- $P(\text{face}) \approx 1 - \tfrac{1}{6000} \approx 0.99983$, because the only other option is the rare "edge" landing. (More on that 1-in-6000 number in [The Unexpected Statistics of Coin Flips](https://flipthecoin.app/blog/the-unexpected-statistics-of-coin-flips).)

The complement rule is often the easiest way to compute a probability: instead of counting every way something _can_ happen, count the one way it _can't_ and subtract from 1.

## Combining events: "and" vs "or"

Things get interesting when we ask about more than one flip at a time. Two rules cover most of what you'll ever need:

### "AND" — both things happen

Coin flips don't influence each other (they are **independent**). In this case, you **multiply** their probabilities:

- $P(\text{HH}) = 0.5 \times 0.5 = 0.25$, or 25%.
- $P(\text{HHH}) = 0.5 \times 0.5 \times 0.5 = 0.125$, or 12.5%.

Each extra flip halves the probability. That's why long streaks feel surprising — not because the coin is "due" for the other side, but because each new flip piles another $\tfrac{1}{2}$ onto the product.

### "OR" — at least one of several things happens

If two outcomes **can't happen at the same time** (they're **mutually exclusive**), you **add** their probabilities:

- $P(\text{H} \cup \text{T}) = 0.5 + 0.5 = 1$. Unsurprising — that's every non-edge outcome.
- $P(1 \cup 2) = \tfrac{1}{6} + \tfrac{1}{6} = \tfrac{2}{6}$ (rolling a 1 or a 2 on a six-sided die).

If the events _can_ overlap, simple addition double-counts the overlap and you have to subtract it back out:

$$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$

That's the **inclusion–exclusion principle**, and the deeper version is a topic for a future article.

## A quick note on independence

Two events are **independent** when the outcome of one doesn't change the probability of the other. Coin flips are the textbook example: the coin has no memory, so a run of ten heads in a row doesn't make tails any more likely on the eleventh flip.

This is the setup behind the famous **Gambler's Fallacy**, which I unpack in [the statistics article](https://flipthecoin.app/blog/the-unexpected-statistics-of-coin-flips#the-gamblers-fallacy). For now, the short version: each flip is a fresh start.

## Conclusion

That's really it for the basics:

1. Probabilities live between 0 and 1.
2. Use the **complement** (1 − P) when it's easier to count what _doesn't_ happen.
3. **Multiply** for "and", **add** for mutually exclusive "or".
4. Independent events don't care about each other's history.

With just those four ideas you can reason about almost any coin-flip question — and most dice, cards, and lottery-style problems too.
