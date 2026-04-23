---
title: Flip The Coin – Browser Extension
description: A fair, random 3D coin flip right in your browser toolbar. Same physics as flipthecoin.app, one click away.
---

# Flip The Coin – Browser Extension

Cannot decide between two options? Flip a coin — without leaving the tab you're on.

The Flip The Coin browser extension puts the same 3D coin from [flipthecoin.app](https://flipthecoin.app) one click away in your toolbar. Click the icon, hit **Flip the coin**, let fate decide.

## What it does

- Opens a compact popup (360×460) with the full 3D coin scene.
- A single **Flip the coin** button triggers the flip with the exact same physics as the web app — we share the animation code between both, so the coin feels identical wherever you use it.
- Shows the result (Heads, Tails, or the occasional Edge) as soon as the coin settles.
- That's it. No tracking, no analytics, no network calls, no permissions.

## Install

### Chrome

🔜 **Coming soon to the Chrome Web Store.** [Subscribe to the newsletter](#newsletter) to be notified when it goes live.

In the meantime, you can install it from source:

```bash
git clone https://github.com/paulmelero/flipthecoinapp.git
cd flipthecoinapp
pnpm install
pnpm --filter @flipthecoin/extension build:chrome
```

Then in Chrome go to `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select `apps/extension/dist/chrome/`.

### Firefox

```bash
pnpm --filter @flipthecoin/extension build:firefox
```

Then in Firefox go to `about:debugging#/runtime/this-firefox` → **Load Temporary Add-on…** → pick `apps/extension/dist/firefox/manifest.json`.

## Privacy

The extension does not collect, store, or transmit any data. It has no permissions and makes no network requests — the 3D scene, the physics, the textures and the fonts are all bundled with the extension. Your flips stay yours.

## Fair warning

The coin flip is random and is for entertainment only. Please don't use it to make decisions you'd regret, and see our [Privacy Policy](/privacy-policy) and [Terms of Service](/terms) for the rest of the small print.
