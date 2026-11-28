import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    include: ['scripts/render-emails.test.ts', 'scripts/email-gallery.test.ts', 'tests/content/**/*.test.ts', 'tests/email/**/*.test.ts', 'tests/leads/**/*.test.ts', 'tests/products/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@data': path.resolve(__dirname, './src/data'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
});
