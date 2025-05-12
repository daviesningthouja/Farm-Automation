import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import fs from 'fs';

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      cert: fs.readFileSync('localhost+2.pem'),
      key: fs.readFileSync('localhost+2-key.pem'),
    },
    // proxy: {
    //   '/api': {
    //     target: 'https://793c-49-47-141-180.ngrok-free.app',
    //     changeOrigin: true,
    //     secure: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
  },
});
// https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })