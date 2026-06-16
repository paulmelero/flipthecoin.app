---
title: Flipping a Coin Until You Get Pi
slug: flipping-a-coin-until-you-get-pi
series: random-walks
seriesOrder: 3
_locale: en
description: Discover how flipping a coin until heads outnumber tails leads,
  unexpectedly, to the number π — through the Catalan numbers and the arcsine
  series.
published: true
level: advanced
date: 2026-05-27T10:00:00Z
tags:
  - pi
  - fair coin
  - arcsine
  - catalan numbers
  - pascal triangle
---

# Flipping a Coin Until You Get Pi

Matt Parker, from the [Stand-up Maths](https://www.youtube.com/@standupmaths) channel, recently published [a video](https://www.youtube.com/watch?v=kahGSss6SsU) with a premise as simple to state as it is hard to believe: if you flip a coin repeatedly until heads outnumber tails, and compute the average ratio of heads to total flips... the result is $\frac{\pi}{4}$.

Yes, $\pi$. _The number that belongs to circles_. Hiding inside coin flips.

In our [previous article on Pascal's triangle](https://flipthecoin.app/blog/pascals-triangle-combinatorics-and-coin-flips/) we saw how a triangle built from simple addition contained, within its rows, the seeds of :term[combinatorics]{slug="combinatorics"}, algebra, and probability. Today we are going to pull on that same thread. And it will take us somewhere no one expected.

<!--more-->

The rules of the experiment are straightforward:

1. Flip a fair coin repeatedly.
2. Stop **the moment** the number of heads exceeds the number of tails.
3. Record the **ratio of heads** to total flips for that sequence.

The question is: if we repeat this process infinitely many times and compute the average of all those ratios... what do we get?

Before answering, let's think about what range that ratio can take. In the best case, the very first flip is heads: we stop immediately and the ratio is $\frac{1}{1} = 1$ (100% heads). In the worst case, we need thousands of flips before heads finally edges ahead by one, and the ratio will be barely above $\frac{1}{2}$. So the average must land somewhere between $0.5$ and $1$. Let's find out exactly where.

## ::try-this

## title: Run it before you read on…

All you need is a coin — or the [flip simulator](/play/).

1. Flip repeatedly, **stop the first time heads outnumber tails**.
2. Write down the ratio: _heads / total flips_.
3. Repeat 20 times (💡 _in a class, one run per person works great_).

What is your average ratio across all trials?
::

## Building the sequences, step by step

Let's construct the possible sequences starting from the shortest ones. We will use **O** for heads and **X** for tails — the same notation we use in [our coin flip simulator](https://flipthecoin.app/play/).

### Length 1

The shortest possible sequence: flip once, get heads.

$$\textbf{O}$$

We stop. We have 1 heads and 0 tails. The ratio is $\frac{1}{1} = 1$ and the probability of this happening is $\frac{1}{2}$.

### Length 3

If the first flip is tails, we cannot stop. And with just two flips, the best we can achieve is a tie (1 heads, 1 tails) — a tie is not enough, we need heads to _exceed_ tails. So the next possible sequence has length 3:

$$\textbf{X O O}$$

Tails, heads, heads. The third flip gives us 2 heads versus 1 tails. Ratio: $\frac{2}{3}$ (2 heads out of 3 flips). Probability: $\left(\frac{1}{2}\right)^3 = \frac{1}{8}$. And it is the only possible sequence of this length.

### Length 5

This is where things get interesting. We need 3 heads and 2 tails, and the fifth flip (the one that stops us) must be heads. Moreover — and this is the key constraint — **at no point before the end can we have had more heads than tails**, because if that had happened, we would have stopped earlier.

It is not enough for the sequence to end with more heads than tails; it must be **the first time** it happens.

How many sequences satisfy these conditions? Only two:

```text
X X O O O
X O X O O
```

Let's check the first: **XXOOO**. Counting O as $+1$ and X as $-1$, the running totals are:

$$-1,\; -2,\; -1,\; 0,\; +1$$

Never exceeds zero until the fifth flip. ✅

Now the second: **XOXOO**.

$$-1,\; 0,\; -1,\; 0,\; +1$$

It returns to zero at the second and fourth flip, but never exceeds it. This is the first time it reaches $+1$. ✅

What about **OXXOO**? Let's see: $+1, 0, -1, 0, +1$. The first flip already puts us at $+1$: we would have stopped right there. Not valid. ❌

So there are exactly **2 sequences** of length 5, each with probability $\left(\frac{1}{2}\right)^5 = \frac{1}{32}$ and ratio $\frac{3}{5}$ (3 heads out of 5 flips).

### Length 7

The same reasoning applies to sequences of length 7 (4 heads, 3 tails). If you enumerate them all — and trust me, it takes a while — you find exactly **5 valid sequences**.

### The summary table

| Length ($2n+1$) |  Heads ratio  | Valid sequences | Probability of each |
| :-------------: | :-----------: | :-------------: | :-----------------: |
|    1 ($n=0$)    | $\frac{1}{1}$ |        1        |    $\frac{1}{2}$    |
|    3 ($n=1$)    | $\frac{2}{3}$ |        1        |    $\frac{1}{8}$    |
|    5 ($n=2$)    | $\frac{3}{5}$ |        2        |   $\frac{1}{32}$    |
|    7 ($n=3$)    | $\frac{4}{7}$ |        5        |   $\frac{1}{128}$   |
|    9 ($n=4$)    | $\frac{5}{9}$ |       14        |   $\frac{1}{512}$   |

Notice the patterns:

- The length is always odd: $2n + 1$.
- The ratio of heads is always $\frac{n+1}{2n+1}$.
- The probability of each individual sequence is $\left(\frac{1}{2}\right)^{2n+1}$ — each of the $2n+1$ flips has a one-in-two chance.

But the column that really matters is the number of valid sequences: $1, 1, 2, 5, 14, \ldots$

Ring a bell?

## From manual counting to the Catalan numbers

Those numbers — $1, 1, 2, 5, 14, 42, 132, \ldots$ — have a name. They are the [**Catalan numbers**](https://en.wikipedia.org/wiki/Catalan_number), one of the most ubiquitous sequences in all of combinatorics.

Their history is itself a story of unexpected connections. The Mongolian mathematician [**Mingantu**](https://en.wikipedia.org/wiki/Minggatu) (c. 1692–1763), working in China, was the first known person to use them — around the 1730s, in trigonometric series included in his book _Ge Yuan Mi Lu Jie Fa_. Two decades later, in 1751, **Leonhard Euler** [independently discovered](https://en.wikipedia.org/wiki/Catalan_number#History) the same sequence in a letter to Goldbach, this time counting the number of ways to cut a polygon into triangles. And nearly a century after Mingantu, the Franco-Belgian mathematician **Eugène Charles Catalan** (1814–1894) found them again in 1838, while counting the number of ways to parenthesize a product of factors. The sequence bears his name — coined by John Riordan in the 20th century — even though the numbers had been surfacing, in different guises, for over a hundred years before him.

The same sequence, discovered independently across three corners of the world and three centuries, each time in a completely different context. If that pattern sounds familiar... keep reading.

The $n$-th :term[Catalan number]{slug="catalan-numbers"} is defined as:

$$C_n = \frac{1}{n+1}\binom{2n}{n}$$

where $\binom{2n}{n}$ — read "$2n$ choose $n$" — is the :term[binomial coefficient]{slug="binomial-coefficient"}: the number of ways to pick $n$ elements from a set of $2n$. In practice, it answers questions like "how many ways can I arrange $n$ heads among $2n$ flips?" We explored this notation in detail in the [article on Pascal's triangle](https://flipthecoin.app/blog/pascals-triangle-combinatorics-and-coin-flips/).

Let's verify against our data:

$$C_0 = \frac{1}{1}\binom{0}{0} = 1 \qquad C_1 = \frac{1}{2}\binom{2}{1} = 1$$

$$C_2 = \frac{1}{3}\binom{4}{2} = 2 \qquad C_3 = \frac{1}{4}\binom{6}{3} = 5 $$

$$C_4 = \frac{1}{5}\binom{8}{4} = 14$$

A perfect match. The Catalan numbers count precisely how many flip sequences end **for the first time** with more heads than tails at each possible length.

## The connection to Pascal's triangle

There is another way to see why the Catalan numbers appear here. Think of each flip sequence as a **path** on a lattice: heads moves one step up, tails moves one step down. The total number of paths of length $2n+1$ that end one step above zero is the binomial coefficient $\binom{2n+1}{n+1}$ — an entry in :term[Pascal's triangle]{slug="pascals-triangle"}. The Catalan numbers count only the paths that never cross above zero before the final step. They are, quite literally, a filtered selection within the triangle — the same tool we used in the [previous article](https://flipthecoin.app/blog/pascals-triangle-combinatorics-and-coin-flips/) to count coin combinations, now with an additional constraint. If you want to explore this connection in more depth, Matt Parker covers it brilliantly in [his video](https://www.youtube.com/watch?v=kahGSss6SsU).

## The infinite series

Back to our table. The contribution of length-$(2n+1)$ sequences to the overall average is:

$$\underbrace{\left(\frac{1}{2}\right)^{2n+1}}_{\text{probability}} \times \underbrace{C_n}_{\text{no. of sequences}} \times \underbrace{\frac{n+1}{2n+1}}_{\text{heads ratio}}$$

And the overall average ratio is the sum of **all** these contributions, from $n = 0$ to infinity:

$$\text{Average} = \sum_{n=0}^{\infty} \frac{C_n}{2^{2n+1}} \cdot \frac{n+1}{2n+1}$$

Let's compute the first few terms:

| $n$ | Contribution                                                | Running total |
| :-: | :---------------------------------------------------------- | :------------ |
|  0  | $\frac{1}{2} \times 1 \times 1 = 0.5$                       | $0.5000$      |
|  1  | $\frac{1}{8} \times 1 \times \frac{2}{3} \approx 0.0833$    | $0.5833$      |
|  2  | $\frac{1}{32} \times 2 \times \frac{3}{5} = 0.0375$         | $0.6208$      |
|  3  | $\frac{1}{128} \times 5 \times \frac{4}{7} \approx 0.0223$  | $0.6431$      |
|  4  | $\frac{1}{512} \times 14 \times \frac{5}{9} \approx 0.0152$ | $0.6583$      |

With just five terms we are at $0.6583$, slowly approaching $\frac{\pi}{4} \approx 0.7854$. The convergence is slow, but the direction is unmistakable when the number of flips is sufficiently large.

## The appearance of arcsine

This is where the magic happens. Let's substitute the Catalan number formula into our series:

$$C_n = \frac{1}{n+1}\binom{2n}{n}$$

When we multiply $C_n$ by $\frac{n+1}{2n+1}$, the factor $(n+1)$ cancels cleanly:

$$\frac{1}{n+1}\binom{2n}{n} \cdot \frac{n+1}{2n+1} = \frac{\binom{2n}{n}}{2n+1}$$

And the series becomes:

$$\text{Average} = \sum_{n=0}^{\infty} \frac{\binom{2n}{n}}{2^{2n+1}(2n+1)} = \frac{1}{2} \sum_{n=0}^{\infty} \frac{\binom{2n}{n}}{4^n(2n+1)}$$

Now comes the moment that makes Matt Parker "angry out of sheer disbelief." It turns out there is a classical function in mathematical analysis called the **arcsine** — the inverse function of sine — whose power series expansion is:

$$\arcsin(x) = \sum_{n=0}^{\infty} \frac{\binom{2n}{n}}{4^n} \cdot \frac{x^{2n+1}}{2n+1}$$

Look familiar? It is exactly our series, multiplied by $2$, with $x$ instead of $1$.

If we evaluate at $x = 1$:

$$\arcsin(1) = \sum_{n=0}^{\infty} \frac{\binom{2n}{n}}{4^n(2n+1)}$$

And what is $\arcsin(1)$? It is the angle whose sine is $1$, that is, $90°$:

$$\arcsin(1) = \frac{\pi}{2}$$

Therefore:

$$\text{Average} = \frac{1}{2} \cdot \frac{\pi}{2} = \frac{\pi}{4}$$

This connection was [discovered in 2025 by the mathematician **Jim Propp**](https://arxiv.org/abs/2602.14487). And what makes it extraordinary is not that $\pi$ appears in an infinite series — that is common enough. What is extraordinary is that a series born from a process as elementary as flipping coins turns out to be _exactly_ the same series that defines a trigonometric function.

It is not an approximation or a numerical coincidence — it is an exact mathematical identity.

Of course, that does not make it a practical way to compute $\pi$. As Propp himself [told in the Arxiv paper itself](https://arxiv.org/abs/2602.14487):

> To get pi to the accuracy of 3.14, it might take up to one trillion coin flips. This is partially because sequences of coin flips can get really long before heads overtake tails, so much so that the expected value of a sequence's length is infinity! On top of that, you can't flip all the coins at once the same way you can drop needles — the order of heads and tails matters.

## Final reflection

In the previous article, we discovered that Pascal's triangle connected combinatorics, algebra, and probability. Three languages for the same story.

Today we have added a fourth character to the plot: the number $\pi$.

Flipping a coin seems like a purely random process. Pascal's triangle seems like pure arithmetic. The Catalan numbers seem like a curiosity of combinatorics. And $\pi$ seems to belong exclusively to geometry — to circles, to curves, to the continuous world.

And yet, they all end up connected in a single equation.

There is something deeply satisfying about discovering that a new fact about $\pi$ was hiding, all along, behind something as mundane as flipping a coin. And that nobody noticed until 2025.

Mathematics still has secrets. And sometimes, they are closer than we think.

Put the theory into practice: [flip a coin online](https://flipthecoin.app/play/) and watch the patterns unfold.
