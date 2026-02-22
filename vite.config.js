import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/GC_Knowledge_Guides/',
  build: {
    outDir: 'dist',
  },
});
