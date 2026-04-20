import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [angular()],
  server: {
    host: true, 
    port: 4200,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      'pillowless-unvibrantly-pearlene.ngrok-free.dev'
    ]
  }
});