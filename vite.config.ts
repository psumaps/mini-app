/// <reference types="vitest" />

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    setupFiles: './tests/setup.ts',
    globals: true,
    environment: 'happy-dom',
    root: 'tests/',
  },
});
