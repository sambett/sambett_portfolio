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
    host: true, // Allow external connections
    proxy: {
      // Proxy all /api requests to backend
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('❌ Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🚀 Proxying:', req.method, req.url, '→', options.target);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Proxy response:', proxyRes.statusCode, req.url);
          });
        }
      },
      // Proxy all /admin requests to backend
      '/admin': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('❌ Admin proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('🔐 Admin proxying:', req.method, req.url, '→', options.target);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('✅ Admin proxy response:', proxyRes.statusCode, req.url);
          });
        }
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