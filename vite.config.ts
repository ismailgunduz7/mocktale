import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    // Font files stay real files under /assets, however small. The exporter fetches them by URL
    // to embed them in the image, and the page never has to load anything from a data: URL.
    assetsInlineLimit: 0
  },
  server: {
    port: 5173
  }
});
