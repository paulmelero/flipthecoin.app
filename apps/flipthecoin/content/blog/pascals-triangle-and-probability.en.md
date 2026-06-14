---
title: What Do Pascal's Triangle and a Coin Have in Common?
slug: pascals-triangle-combinatorics-and-coin-flips
series: random-walks
seriesOrder: 1
_locale: en
description: Discover how Pascal's triangle connects combinatorics, algebra, and
  probability — explained step by step through coin flips.
published: true
level: intermediate
date: 2026-05-24T10:00:00Z
tags:
  - Pascal's triangle
  - Bell curve
  - Omar Khayyam
  - Jia Xian
  - Blaise Pascal
---

# What Do Pascal's Triangle and a Coin Have in Common?

There is a triangle of numbers that has fascinated mathematicians across the globe for centuries. Its construction is so simple a child could draw it in a notebook. And yet, hidden within its rows lies a deep connection between three branches of mathematics that, at first glance, seem to have nothing in common: combinatorics, algebra, and probability. The most surprising part? That connection reveals itself through something as ordinary as flipping a coin.

<!--more-->

## A bit of history

In the English-speaking world this pattern is known as **Pascal's triangle**, after the French mathematician Blaise Pascal, who published a treatise in 1654 — the _Traité du triangle arithmétique_ — where he formalized its properties and, crucially, connected it for the first time to the problems of chance posed to him by the Chevalier de Méré. In many Spanish-speaking countries it is called the **triangle of Tartaglia**, after the Italian mathematician Niccolò Fontana Tartaglia (1499–1557), who studied it in the context of solving cubic equations.

But the real history of this triangle goes much further back. In 11th-century China, the mathematician Jia Xian was already describing the same pattern for computing coefficients of powers. Later, in the 13th century, Yang Hui reproduced it in a diagram that survives to this day. In Persia, Omar Khayyam worked with the same ideas in the 12th century. And in India, Pingala explored similar combinatorial patterns centuries before the common era.

The fact that civilizations so distant in time and space independently discovered the same triangle tells us something important: this is not an arbitrary human invention, but a structure that emerges naturally whenever anyone asks _how many ways can I arrange this?_

## How to build the triangle

The construction rule is elegantly simple:

1. Start by placing a **1** at the top.
2. On each new row, place a **1** at each end.
3. Each inner number is the **sum of the two numbers** directly above it.

The first few rows look like this:

```text
            1
          1   1
        1   2   1
      1   3   3   1
    1   4   6   4   1
  1   5  10  10   5   1
```

The first row (the lone **1** at the top) is called **row 0**. The next one is row 1, and so on. This is not a quirk: numbering from zero will make everything fit neatly once we connect the triangle to the formulas.

Look at row 4: $1, 4, 6, 4, 1$. The $6$ in the center comes from adding the two numbers above it: $3 + 3$. The $4$ on the left comes from $1 + 3$. Always the same rule.

### Binomial coefficients

Every number in the triangle has a formal name: it is a **binomial coefficient**. It is written as:

$$\binom{n}{k}$$

and read "**$n$ choose $k$**". Its meaning is straightforward: it represents the number of ways to choose $k$ elements from a set of $n$, regardless of order.

For example, $\binom{4}{2} = 6$ means there are 6 ways to choose 2 items from 4. And indeed, if you look at row 4 of the triangle, position 2 (counting from 0) is precisely $6$.

The formula to compute it is:

$$\binom{n}{k} = \frac{n!}{k! \cdot (n-k)!}$$

Here, the symbol $n!$ is called **factorial** and means multiplying all whole numbers from $1$ up to $n$. For instance, $4! = 4 \times 3 \times 2 \times 1 = 24$. By convention, $0! = 1$.

Let's verify: $\binom{4}{2} = \frac{4!}{2! \cdot 2!} = \frac{24}{2 \times 2} = \frac{24}{4} = 6$. Correct.

So row $n$ of the triangle contains the values:

$$\binom{n}{0},\; \binom{n}{1},\; \binom{n}{2},\; \ldots,\; \binom{n}{n}$$

## Combinatorics: the art of counting without listing

**Combinatorics** is the branch of mathematics that studies how many distinct ways there are to arrange, group, or choose elements. Its power lies in letting us know the number of possibilities _without having to list them one by one_.

To see why this is useful, consider flipping a coin. Each flip has two possible outcomes: **heads** (O) or **tails** (X). If we flip the coin once, there are $2$ outcomes. If we flip it twice, each of the 2 outcomes of the first flip combines with the 2 outcomes of the second, giving $2 \times 2 = 4$ outcomes. With three flips, $2 \times 2 \times 2 = 8$.

That pattern is expressed with an **exponent**:

$$2^n$$

where $n$ is the number of flips. The exponent tells us how many times we multiply the base ($2$) by itself. So:

| Flips ($n$) | Possible outcomes ($2^n$) |
| :---------: | :-----------------------: |
|      1      |             2             |
|      2      |             4             |
|      3      |             8             |
|      5      |            32             |
|     10      |           1,024           |

With just 10 flips there are already over a thousand possible combinations. Combinatorics helps us handle those numbers without losing our minds.

If you need a refresher on what probability means and how it is measured, check out [Probability Basics](https://flipthecoin.app/blog/probability-basics/).

## Case study: 3 flips

Let's connect everything with a concrete example. We flip a coin 3 times. We know there are $2^3 = 8$ possible outcomes. Here they all are:

```text
OOO    OOX    OXO    XOO    OXX    XOX    XXO    XXX
```

Now let's group these results by the **number of heads**:

| Heads | Combinations  | Count |
| :---: | :------------ | :---: |
|   0   | XXX           |   1   |
|   1   | OXX, XOX, XXO |   3   |
|   2   | OOX, OXO, XOO |   3   |
|   3   | OOO           |   1   |

Look at the count column: $1, 3, 3, 1$. Sound familiar? It is exactly **row 3** of Pascal's triangle.

And it is no coincidence. The number of ways to get exactly $k$ heads in $n$ flips is precisely $\binom{n}{k}$ — the binomial coefficient at position $k$ in row $n$ of the triangle.

### Probability enters the scene

**Probability** measures how likely an event is to occur. It is calculated as:

$$P = \frac{\text{favorable outcomes}}{\text{total outcomes}}$$

If the coin is fair, each of the 8 outcomes is equally likely. So the probability of getting exactly $k$ heads in 3 flips is:

$$P(k \text{ heads}) = \frac{\binom{3}{k}}{2^3} = \frac{\binom{3}{k}}{8}$$

Let's compute each case:

| $k$ heads | $\binom{3}{k}$ |      Probability      | Percentage |
| :-------: | :------------: | :-------------------: | :--------: |
|     0     |       1        | $\frac{1}{8} = 0.125$ |   12.5%    |
|     1     |       3        | $\frac{3}{8} = 0.375$ |   37.5%    |
|     2     |       3        | $\frac{3}{8} = 0.375$ |   37.5%    |
|     3     |       1        | $\frac{1}{8} = 0.125$ |   12.5%    |

If we add all probabilities: $0.125 + 0.375 + 0.375 + 0.125 = 1$. The sum always equals $1$, because together all cases cover 100% of the possibilities.

The general formula we have just discovered works for any number of flips:

$$P(k \text{ heads in } n \text{ flips}) = \frac{\binom{n}{k}}{2^n}$$

## Case study: 5 flips

Let's raise the stakes. With 5 flips, the corresponding row of the triangle is:

$$1 \quad 5 \quad 10 \quad 10 \quad 5 \quad 1$$

and the total number of possible outcomes is $2^5 = 32$.

Let's look at some concrete examples. How many ways can we get exactly **2 heads**? The triangle tells us $\binom{5}{2} = 10$. Here are all 10 combinations:

```text
OOXXX   OXOXX   OXXOX   OXXXO   XOOXX
XOXOX   XOXXO   XXOOX   XXOXO   XXXOO
```

And exactly **3 heads**? Also $\binom{5}{3} = 10$. The triangle is symmetric: there are just as many ways to get 2 heads (and 3 tails) as 3 heads (and 2 tails).

The complete probability table:

| $k$ heads | $\binom{5}{k}$ |   Probability   | Percentage |
| :-------: | :------------: | :-------------: | :--------: |
|     0     |       1        | $\frac{1}{32}$  |    3.1%    |
|     1     |       5        | $\frac{5}{32}$  |   15.6%    |
|     2     |       10       | $\frac{10}{32}$ |   31.3%    |
|     3     |       10       | $\frac{10}{32}$ |   31.3%    |
|     4     |       5        | $\frac{5}{32}$  |   15.6%    |
|     5     |       1        | $\frac{1}{32}$  |    3.1%    |

If we sketch this as a histogram, the distribution has a familiar shape:

```text
0 heads  ▌              3.1%
1 head   ▌▌▌▌▌         15.6%
2 heads  ▌▌▌▌▌▌▌▌▌▌    31.3%
3 heads  ▌▌▌▌▌▌▌▌▌▌    31.3%
4 heads  ▌▌▌▌▌         15.6%
5 heads  ▌              3.1%
```

Notice three things:

1. **Symmetry.** The distribution is a perfect mirror around the center. Getting 0 heads is just as unlikely as getting 5; getting 1 is just as likely as getting 4.
2. **Central concentration.** The most probable results cluster around the center (2 or 3 heads), while the extremes (all heads or all tails) are very rare.
3. **Bell shape.** The silhouette resembles the famous Gaussian curve. This is no accident: as we increase the number of flips, the distribution increasingly approximates that curve.

If you are interested in exploring more of the statistics behind coin flips, read [The Unexpected Statistics of Coin Flips](https://flipthecoin.app/blog/the-unexpected-statistics-of-coin-flips/).

## The algebraic connection: the binomial theorem

So far we have talked about triangles and coins. But there is a third protagonist that ties everything together: **algebra**. Specifically, an expression you may remember from school:

$$(a + b)^n$$

Before expanding it, let's clarify a couple of concepts:

- A **polynomial** is a mathematical expression made up of sums of terms with variables raised to various powers. For example: $3x^2 + 2x + 1$.
- A **binomial** is a special case of a polynomial: it has exactly **two** terms. For example: $(a + b)$.

Raising a binomial to a power means multiplying it by itself $n$ times. Let's start with the simplest cases:

**Power 2:**

$$(a + b)^2 = a^2 + 2ab + b^2$$

The coefficients are $1, 2, 1$ — row 2 of the triangle.

**Power 3:**

$$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$$

The coefficients are $1, 3, 3, 1$ — row 3.

**Power 5:**

$$(a + b)^5 = a^5 + 5a^4b + 10a^3b^2 + 10a^2b^3 + 5ab^4 + b^5$$

The coefficients are $1, 5, 10, 10, 5, 1$ — row 5.

See the pattern? **The rows of Pascal's triangle are exactly the coefficients of the binomial expansion.** This relationship is formalized by the **binomial theorem**:

$$(a+b)^n = \sum_{k=0}^{n} \binom{n}{k} \, a^{n-k} \, b^k$$

The symbol $\sum$ (sigma) simply means «add up all terms from $k = 0$ to $k = n$». Each term has a binomial coefficient $\binom{n}{k}$ that comes directly from the triangle.

### The bridge between algebra and probability

Now comes the fascinating part. Substitute $a$ with the probability of getting **heads** and $b$ with the probability of getting **tails**:

$$a = P(\text{heads}) = \frac{1}{2}, \quad b = P(\text{tails}) = \frac{1}{2}$$

The binomial becomes:

$$\left(\frac{1}{2} + \frac{1}{2}\right)^n = \sum_{k=0}^{n} \binom{n}{k} \left(\frac{1}{2}\right)^{n-k} \left(\frac{1}{2}\right)^k = \sum_{k=0}^{n} \frac{\binom{n}{k}}{2^n}$$

The left side is simply $1^n = 1$: total certainty. The right side is the sum of all individual probabilities. And each term $\frac{\binom{n}{k}}{2^n}$ is exactly the probability of getting $k$ tails (or equivalently, $n - k$ heads).

Let's verify with 5 flips:

$$\frac{1 + 5 + 10 + 10 + 5 + 1}{32} = \frac{32}{32} = 1$$

Each number in row 5 divided by $2^5$ gives us a probability, and together they sum to $1$. The triangle, combinatorics, and algebra are not three different stories: **they are the same story told in three different languages**.

## Final reflection

Throughout this article we have followed a thread that connects three branches of mathematics through a single object:

- **Combinatorics** tells us how many ways we can arrange a set of outcomes.
- The **algebra** of the binomial generates those same quantities as coefficients in a formula.
- **Probability** transforms those numbers into predictions about the real world.

And **Pascal's triangle** is the object that unites them: a visual table where all three disciplines converge.

What started as a triangle for counting combinations — drawn in 11th-century China — ends up describing with precision what happens when you flip a coin five, ten, or a hundred times. An abstract structure created for counting objects turns out to describe random phenomena.

And there is one more detail worth mentioning. As the number of flips grows, the rows of the triangle increasingly resemble the Gaussian bell curve: that ubiquitous curve that appears in statistics, physics, and biology. The deep reason for that convergence is another story, but the fact that a triangle built from such simple sums contains the seed of one of the most important distributions in science is, at the very least, beautiful.

Mathematics has a unique quality: it reveals hidden patterns behind what appears to be pure randomness. A single coin flip is unpredictable. Ten flips already hint at an order. A hundred flips draw an almost perfect curve. And it was all written, from the very beginning, in a triangle.

Put theory into practice: [flip a coin online](https://flipthecoin.app/play/) and watch combinatorics in action.
