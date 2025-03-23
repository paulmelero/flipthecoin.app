---
title: The Unexpected Statistics of Coin Flips
published: true
date: 2025-03-22T01:00:00Z
---

# The Unexpected Statistics of Coin Flips

You have probably flipped a coin at some point in your life. Maybe you flipped a coin to decide who would go first in a game, or maybe you flipped a coin to decide where to go for dinner. But have you ever stopped to think about the statistics of coin flips?

## The Basics

A coin has two sides: heads and tails. When you flip a coin, theoretically there is a 50% chance that it will land on heads and a 50% chance that it will land on tails. This is because the coin has two sides, and each side has an equal chance of landing face up.

But there is another case where the coin can land on its edge. This is a rare event, but it is possible. The probability of a coin landing on its edge is very low, but it is not zero. It is estimated that the probability of a coin landing on its edge is about 1 in 6000 flips depending on the conditions ([source](https://ui.adsabs.harvard.edu/abs/1993PhRvE..48.2547M/abstract)).

This is the real "edge case" in coin flips. But don't be confused, it's not related to the origin of this expression. Read more about where does the term ["edge case"](https://flipthecoin.app/blog/where-does-the-term-edge-case-come-from) come from.

Learn more about how do we toss a coin in FlipTheCoin.app [here](https://flipthecoin.app/blog/how-we-toss-a-coin).

## The Reality

In reality, the statistics of coin flips are a bit more complicated. For example, if you flip a coin 100 times, you might not get exactly 50 heads and 50 tails. In fact, you might get 60 heads and 40 tails, or 55 heads and 45 tails. This is because there is an element of randomness to coin flips, and the outcome of each flip is not entirely predictable.

You could blame this on the fact that the coin is not perfectly balanced, or that the person flipping the coin is not perfectly consistent in their technique. But the truth is that even with a perfectly balanced coin and a perfectly consistent flipper, there will still be some variation in the results. See [The Gambler's Fallacy section](#the-gamblers-fallacy) below.

<!-- 💡 If you want to see an ideal coin flip simulation, check the [toss engine tool](https://flipthecoin.app/toss-engine). It is designed to be as mathematically fair as possible (and excludes the "edge" cases) using the JavaScript's `Math.random()` method to simulate a coin flip. -->

## The unfairness of fair coins

Recently, a group of Dutch researchers published a [paper](https://arxiv.org/abs/2310.04153) that explored the statistics of coin flips in more detail. They found that the outcome of a coin flip is influenced by a variety of factors, including the initial conditions of the flip. They also found that the outcome of a coin flip is not entirely random, but is influenced by the initial conditions of the flip: when people flip an ordinary coin, it tends to land on the same side it started on.

For this study, they were condecorated with the [Ig Nobel Prize](https://improbable.com/ig/winners/#ig2024) in 2024.

## The Gambler's Fallacy

One common misconception about coin flips is known as The Gambler's Fallacy. This is the misconception that if a coin has landed on heads several times in a row, it is more likely to land on tails on the next flip. In reality, each coin flip is independent of the ones that came before it, and the outcome of one flip does not affect the outcome of the next flip.

It is related to a statistics topic called "independence". In statistics, two events are said to be **independent** if the occurrence of one event does not affect the probability of the other event. In the case of coin flips, each flip is an independent event, and the outcome of one flip does not affect the outcome of the next flip.

An example of dependant events would be drawing cards from a deck without replacement. If you draw a card from a deck of cards, the probability of drawing a red card is 26/52. But if you draw a red card and do not replace it, the probability of drawing another red card is now 25/51. The first event has affected the probability of the second event.

💡 If you want to learn more about what does it mean to have a probability of "26/52" or "25/51", check the [Probability Basics](https://flipthecoin.app/blog/probability-basics) blog post.

## The Law of Large Numbers

The law of large numbers states that the more times you flip a coin, the closer the results will get to the theoretical 50/50 split. For example, if you flip a coin 10 times, you might get 6 heads and 4 tails. But if you flip a coin 1 million times, you are more likely to get closer to a 50/50 split.

In practice, the law of large numbers is not always perfect. There will still be some variation in the results, even with a **very large** number of flips. But the more times you flip the coin, the closer the results will get to the theoretical 50/50 split.

### How many times should you flip a coin to get a 50/50 split?

In theory, the more times you flip a coin, the closer the results will get to a 50/50 split. But do you reach a point where the results are exactly 50/50?

The answer is no. Even if you flip a coin an infinite number of times, you will never get exactly a 50/50 split. This is related to the concept of **standard deviation** in statistics. The standard deviation measures how spread out the values in a data set are. In the case of coin flips, the standard deviation measures how far the results are from the theoretical 50/50 split.

Imagine we toss the coin 1000 times. The probability of getting **exactly** 500 heads and 500 tails is very low. In fact, it is somewhere around 2.5% ([source](https://www.wolframalpha.com/input?i=probability+of+getting+exactly+500+heads+and+500+tails+in+1000+flips+of+a+fair+coin)). The ranges, such as 95% of the time falling between 469 and 530 heads or 99% of the time between 450 and 550 heads, are derived using the **binomial distribution** and **standard deviation**. These statistical tools help describe the spread of outcomes in repeated trials. To clarify, this means 99% of the times you flip a coin 1000 times, the result will fall within this range.

## Conclusion

The statistics of coin flips are a fascinating topic that can teach us a lot about probability and randomness.

It is commonly used as one of the first examples when teaching about statistics, but it is also a topic that can be explored in more depth. It is a simple concept that can lead to complex discussions about independence, randomness, and the law of large numbers. For some people it is just a fun way to make decisions, for others it is a way to explore the world of statistics.

So the next time you flip a coin, take a moment to appreciate the unexpected statistics behind this simple act.
