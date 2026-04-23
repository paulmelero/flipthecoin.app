# Flip The Coin — Browser Extension

A tiny browser extension that puts a fair, random 3D coin flip one click away in your toolbar. Click the icon, hit **Flip the coin**, let fate decide. The animation and physics are shared with the [flipthecoin.app](https://flipthecoin.app) web app via the `@flipthecoin/coin-engine` package, so the coin feels exactly the same everywhere.

## Install

### From the Chrome Web Store

_Coming soon — once the first release is approved._

### From source (Chrome)

```bash
pnpm install
pnpm --filter @flipthecoin/extension build:chrome
```

Then in Chrome:

1. Visit `chrome://extensions`.
2. Toggle **Developer mode** on (top right).
3. Click **Load unpacked** and pick `apps/extension/dist/chrome/`.
4. Pin the extension to your toolbar and click the coin icon.

### From source (Firefox)

```bash
pnpm --filter @flipthecoin/extension build:firefox
```

Then in Firefox:

1. Visit `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on…** and pick `apps/extension/dist/firefox/manifest.json`.

## Packaging for the Chrome Web Store

```bash
pnpm --filter @flipthecoin/extension build:chrome
cd apps/extension/dist/chrome
zip -r ../flipthecoin-chrome.zip .
```

Upload `apps/extension/dist/flipthecoin-chrome.zip` on the [Chrome Web Store developer dashboard](https://chrome.google.com/webstore/devconsole).

## Development

```bash
pnpm --filter @flipthecoin/extension dev
```

Runs the popup as a regular Vite page on `http://localhost:5173` (no reloads inside a real browser-extension host — just fast UI iteration).
