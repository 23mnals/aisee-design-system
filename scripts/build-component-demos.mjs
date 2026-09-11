import { build } from 'vite';
import { fileURLToPath } from 'node:url';

// Bundle the actual React component for the existing static preview server and Pages.
// Keep generated files beside the HTML so a checkout opens without a separate dev server.
for (const [component, bundle] of [['Badge', 'badge-demo'], ['Steps', 'steps-demo'], ['EmptyState', 'empty-state-demo'], ['ToggleSelectionGroup', 'toggle-selection-demo']]) {
await build({
  configFile: false,
  publicDir: false,
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    emptyOutDir: false,
    outDir: fileURLToPath(new URL(`../components/${component}/`, import.meta.url)),
    lib: {
      entry: fileURLToPath(new URL(`../components/${component}/${component}.demo.tsx`, import.meta.url)),
      name: `Aisee${component}Demo`,
      formats: ['iife'],
      fileName: () => `${bundle}.js`,
      cssFileName: bundle,
    },
  },
});

}
