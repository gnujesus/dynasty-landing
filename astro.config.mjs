// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

function optimizeDependenciesPlugin() {
  return {
    name: 'optimize-dependencies',
    configEnvironment(environment) {
      if (environment !== 'client') {
        return {
          optimizeDeps: {
            include: [
              'react',
              'react/jsx-runtime',
              'react/jsx-dev-runtime',
              'react-dom',
              'react-dom/server',
              'react-dom/server.edge',
            ],
          },
        };
      }
    },
  };
}

// https://astro.build/config
export default defineConfig({
  output: 'server',
  session: false,
  adapter: cloudflare({
    imageService: 'compile',
    prerenderEnvironment: 'node',
  }),
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), optimizeDependenciesPlugin()],
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
  },
});
