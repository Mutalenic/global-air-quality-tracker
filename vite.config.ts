import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    envDir: '.',
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      open: true,
      proxy: {
        // Proxy REST Countries API to avoid CORS issues in development.
        // The browser calls /api/restcountries/* and Vite forwards to
        // https://api.restcountries.com/countries/v5/* with the auth header.
        '/api/restcountries': {
          target: 'https://api.restcountries.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/restcountries/, '/countries/v5'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const apiKey = env.VITE_RESTCOUNTRIES_API_KEY;
              if (apiKey) {
                proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
              }
            });
          },
        },
      },
    },
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
  };
});
