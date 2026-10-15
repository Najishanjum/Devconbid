import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { handleApiRequest } from './server/api';

function apiServerPlugin(): Plugin {
  return {
    name: 'api-server-plugin',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        handleApiRequest(req, res, next);
      });
    },
    configurePreviewServer(server) {
      server.middlewares.use((req, res, next) => {
        handleApiRequest(req, res, next);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), apiServerPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
