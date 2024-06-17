import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
      react: path.resolve('./node_modules/react'),
      '@tanstack/react-query': path.resolve(
        './node_modules/@tanstack/react-query',
      ),
    },
  },
  envDir: '../',
});
