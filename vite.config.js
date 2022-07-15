import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      web3: 'web3/dist/web3.min.js',
    },
  },
  plugins: [vue()],
});
