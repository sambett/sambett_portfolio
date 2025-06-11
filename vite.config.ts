import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      // Only proxy API calls, not admin pages
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log(`❌ API Proxy Error: ${err.code} - Backend might not be ready`);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`🚀 API: ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            if (proxyRes.statusCode === 200) {
              console.log(`✅ API Success: ${req.url}`);
            }
          });
        }
      },
      // Only proxy admin API calls, not admin pages
      '^/admin/(login|logout|status)$': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          animation: ['framer-motion'],
        }
      }
    }
  }
})
