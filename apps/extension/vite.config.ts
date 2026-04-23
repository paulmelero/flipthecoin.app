import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const browser = process.env.BROWSER || 'chrome';
const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    vue(),
    {
      name: 'copy-manifest',
      generateBundle() {
        const manifestPath = resolve(
          rootDir,
          `src/manifests/manifest.${browser}.json`,
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
        main: resolve(rootDir, 'index.html'),
      },
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
});
