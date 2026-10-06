import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {infinityFreeProxyPlugin} from './vite-proxy';

const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig(() => {
  return {
    base: isGitHubPagesBuild ? '/bookloop-socialmediamarketing/' : '/',
    plugins: [react(), tailwindcss(), infinityFreeProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Keep every-page assets small: logo is 256px, images live in public/
      assetsInlineLimit: 4096,
      chunkSizeWarningLimit: 600,
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            // sweetalert2 is dynamically imported (alerts.ts) and only needed
            // after a user action — let Vite split it into its own async chunk
            // instead of forcing it into the initial vendor bundle.
            if (id.includes('sweetalert2')) {
              return undefined;
            }

            if (id.includes('@mui/icons-material')) {
              return 'mui-icons';
            }

            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui';
            }

            // three.js (~900kB) is only used by the lazy BookGachaScene —
            // keep it isolated so it never lands in the initial bundle.
            if (id.includes('three') || id.includes('@react-three')) {
              return 'three';
            }

            // motion (~200kB) is used across many components; isolate it so
            // it is cached separately and never bloats the router chunk.
            if (id.includes('motion') || id.includes('framer-motion')) {
              return 'motion';
            }

            if (id.includes('react-router')) {
              return 'router';
            }

            return 'vendor';
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
      proxy: {
        '/api': {
          target: 'http://127.0.0.1:8000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
