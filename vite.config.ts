import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
/**
 * @type {import('vite').UserConfig}
 */
export default defineConfig({
  plugins: [react(), splitVendorChunkPlugin()],
  build: {
    rollupOptions: {
      output: {
        minifyInternalExports: true,
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('node_modules')) return id.toString().split('node_modules/')[2].split('/')[0].toString();
            return 'vendor'; // all other package goes here
          }
        },
      },
    },
  },
});
