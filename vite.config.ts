import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'docs' ? './' : '/',
  build: mode === 'docs'
    ? { outDir: 'site' }
    : {
        emptyOutDir: false,
        lib: {
          entry: resolve(import.meta.dirname, 'src/index.ts'),
          name: 'AiseeDesignSystem',
          formats: ['es', 'cjs'],
          fileName: (format) => `aisee-design-system.${format === 'es' ? 'js' : 'cjs'}`
        },
        rollupOptions: {
          external: ['react', 'react-dom', 'react/jsx-runtime'],
          output: { globals: { react: 'React', 'react-dom': 'ReactDOM' } }
        }
      }
}));
