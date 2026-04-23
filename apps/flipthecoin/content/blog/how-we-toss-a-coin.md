---
title: How we toss a coin in FlipTheCoin.app
description: A plain-language tour of the physics behind every coin flip in FlipTheCoin.app — the push, the spin, and the gravity that decides heads or tails.
published: true
date: 2026-04-23T01:00:00Z
---

The mathematics behind a coin flip is simple: a coin has two sides, heads and tails, and each side has an equal chance of landing face up. But how do we actually toss a coin? In this article, we'll explore the science behind coin flips and how we ensure that each flip is fair and random.

<!--more-->

# How we toss a coin

You'd be forgiven for thinking a coin flip in a browser is just `Math.random()` dressed up with a pretty animation. That's one way to do it — and we actually offer that flavour in the [toss engine](https://flipthecoin.app/toss-engine) if you want a clean 50/50 result with no drama.

But the coin you see on the homepage and in our browser extension isn't "a glorified random number". It's an actual little physics simulation: a disc, a floor, gravity, and a push. Whichever face ends up looking at the ceiling wins. Let's walk through what that means.

## Why simulate the physics at all?

Two reasons:

1. **It's more fun to watch.** A thrown, tumbling, bouncing coin feels like a coin. A cutscene that says "HEADS" does not.
2. **It mirrors how real flips work.** In the real world, a coin flip isn't mathematically random — it's a deterministic physical process that's sensitive to the tiny differences in how you launch it. Our simulation has the same character: the randomness sits entirely in _how we throw it_, and the rest is physics.

If you want a mathematically clean 50/50 (and never an "edge"), use the [toss engine](https://flipthecoin.app/toss-engine). If you want the real feel, keep reading.

## The three ingredients of a throw

Every time you click the coin, we give it three things: a push up, a little sideways drift, and a spin.

### 1. An upward push

First we shove it up into the air. In our simulation that push is a fixed value — about 9 units of upward velocity — the same every time. This is what sets how long the coin stays airborne. Not random; just enough height for a proper tumble.

### 2. A consistent sideways lean with a little variation

If every flip launched from the same spot and landed on the same spot, the coin would pile up like a stack of pancakes. So we also give it a sideways push on both horizontal axes — mostly a fixed value, with a small random addition each time. It's the same general direction every throw (so the coin doesn't fly off screen — or at least not too far), but the exact landing spot varies.

This is where the randomness comes from in our simulation, we introduce a "seed" value that determines the exact direction of the sideways push.

### 3. A spin

This is the part that actually decides the outcome. In the pure random mode, we apply a **random angular velocity** between −10 and +10 on two of the three rotation axes — fresh random numbers on every throw. In plain terms: we're telling the coin _how fast and in which direction to tumble_.

We leave the third rotation axis at zero on purpose: it keeps the motion readable instead of letting the coin wobble chaotically in every possible direction at once.

Once those three values are set, we let go. From there, it's all physics.

## Gravity does the rest

The coin lives in a miniature simulated world where gravity is **9.82 m/s²** — the same pull you'd feel on Earth. It rises, slows down, falls, hits the floor, bounces a little, and eventually settles.

Crucially, we don't peek at the outcome ahead of time. We don't pre-decide "this one will be heads". The simulation runs, the coin does its thing, and whatever it's doing when it stops is what we call the result. In that sense, it's exactly like a real flip: the moment the coin leaves your thumb, the outcome is already decided in principle, but nobody knows what it is until it lands.

## How we read the result

Once the coin stops moving, we need to answer: "which face is looking at the ceiling?"

The trick is to take a virtual arrow pointing straight _up out of the top face of the coin_, and see where it ends up pointing after all that tumbling:

- If the arrow is pointing roughly **up** — the top face is facing the sky — it's **heads**.
- If it's pointing roughly **down** — the top face is now face-down on the floor — it's **tails**.
- If it's pointing roughly **sideways** — the coin came to rest balanced on its rim — it's **edge**.

That last one is the rare "edge" case mentioned in the [statistics article](https://flipthecoin.app/blog/the-unexpected-statistics-of-coin-flips) — the coin balancing on its rim — and it happens in the simulation for the same reason it happens in real life: sometimes the tumble just works out that way. If you're curious why calling it an "edge case" is a great pun, I wrote about that [here](https://flipthecoin.app/blog/where-does-the-term-edge-case-come-from).

## Is it actually random, then?

Kind of — with a footnote.

The randomness in our flip comes from the random sideways drift and random spin we hand the coin at launch. Under the hood, those numbers come from JavaScript's `Math.random()`. The physics afterwards is completely deterministic: same inputs, same result, every time. So the simulation inherits whatever quality of randomness `Math.random()` provides, stretched across three seeded values.

Is that "true" randomness? No — it's pseudo-random, like most randomness on a computer. Is it random _enough_ that you can't game it by clicking in a particular way? Absolutely. And it turns out that's also true of real-world coin flips: [research has shown](https://arxiv.org/abs/2310.04153) that real flips are slightly biased towards the side they started on, which means a simulated flip is, ironically, a little _more_ fair than the real thing.

> A simulated flip is, ironically, a little _more_ fair than the real thing

## Conclusion

So the next time you toss a coin on the site, here's what's actually happening: a three-number throw (push, drift, spin), a short physics simulation, and a read of which direction the coin's top face is pointing when it stops. No tricks, no pre-picked winner. Just a very tiny world with very normal gravity.

Curious about the maths underneath? Start with [Probability Basics](https://flipthecoin.app/blog/probability-basics). Curious about the weird statistical reality of real coin flips? [The Unexpected Statistics of Coin Flips](https://flipthecoin.app/blog/the-unexpected-statistics-of-coin-flips) is the one for you.
