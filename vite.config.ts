import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: process.env.CEBT_BASE_PATH || '/',
  plugins: [react(), {
    name: 'cebt-fixed-development-port',
    configResolved(config) {
      if (config.server.port !== 9081 || config.preview.port !== 9081 || !config.server.strictPort || !config.preview.strictPort) {
        throw new Error('CEBT requires port 9081 with strictPort enabled. Remove conflicting port overrides.');
      }
    },
  }],
  server: { port: 9081, strictPort: true, host: '0.0.0.0' },
  preview: { port: 9081, strictPort: true, host: '0.0.0.0' },
});
