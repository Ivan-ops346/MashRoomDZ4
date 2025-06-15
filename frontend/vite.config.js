import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      proxy: {
        '/camunda': {
          target: env.VITE_CAMUNDA_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/camunda/, ''),
        },
      },
    },
  };
})