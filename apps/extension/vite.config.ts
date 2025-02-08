import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';
import fs from 'fs';

const browser = process.env.BROWSER || 'chrome';

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-manifest',
      generateBundle() {
        const manifestPath = resolve(
          new URL(import.meta.url).pathname,
          `src/manifests/manifest.${browser}.json`
        );
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
        this.emitFile({
          type: 'asset',
          fileName: 'manifest.json',
          source: JSON.stringify(manifest, null, 2),
        });
      },
    },
  ],
  build: {
    outDir: `dist/${browser}`,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(new URL(import.meta.url).pathname, 'index.html'),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
