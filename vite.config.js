import { defineConfig } from 'vite'

export default defineConfig({
  base: '/portafolio/',
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  build: {
    minify: true,
  },
})