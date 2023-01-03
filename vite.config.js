import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    AutoImport({
    resolvers: [ElementPlusResolver()],
  }),
  Components({
    resolvers: [ElementPlusResolver()],
  }),
],
  base: './',
  server: {
    host: '0.0.0.0',
    proxy: {
      "/stage": {
        target: "http://127.0.0.1:6806/stage",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/stage/, '')
      },
      "/stage/js": {
        target: "http://127.0.0.1:6806/stage/js",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/stage/, '')
      },
      "/widgets": {
        target: "http://127.0.0.1:6806/widgets",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/widgets/, '')
      },

      "/api": {
        target: "http://127.0.0.1:6806/api",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      },
      "/assets": {
        target: "http://127.0.0.1:6806/assets",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/assets/, '')
      },
      "/appearance": {
        target: "http://127.0.0.1:6806/appearance",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/appearance/, '')
      },
      "/snippets": {
        target: "http://127.0.0.1:6806/snippets",
        changeOrigin: true,
        rewrite: path => path.replace(/^\/snippets/, '')
      },
      "/ws": {
        target: "ws://127.0.0.1:6806/ws",
        changeOrigin: true,
        ws: true,
        rewrite: path => path.replace(/^\/ws/, '')
      },


    },
    cors: {
      allowedHeaders: ['Content-Type', 'Authorization']
    },

  },
  resolve: { alias: [] }
})
