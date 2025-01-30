import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// import { defineConfig } from 'vite';
// import { resolve } from 'path';

// export default defineConfig({
//   resolve: {
//     alias: {
//       buffer: resolve('node_modules', 'buffer') // menambahkan polyfill buffer
//     }
//   },
//   define: {
//     global: 'window' // jika perlu menggunakan global object di browser
//   }
// });

// import { defineConfig } from "vite";
// import path from "path"; // Pastikan mengimport path

// export default defineConfig({
//   resolve: {
//     alias: {
//       // Menggunakan module 'buffer' dari node_modules
//       buffer: path.resolve("node_modules", "buffer"),
//     },
//   },
//   define: {
//     global: "window", // Jika menggunakan global object di browser
//   },
// });


// import { defineConfig } from 'vite';
// import path from 'path';

// export default defineConfig({
//   resolve: {
//     alias: {
//       buffer: path.resolve('node_modules', 'buffer'),
//       // Polyfill untuk process
//       process: 'process/browser'
//     }
//   },
//   define: {
//     global: 'window', // jika diperlukan
//     // Polyfill process object
//     process: JSON.stringify(process)
//   },
//   optimizeDeps: {
//     include: ['process'] // Memastikan 'process' dimasukkan dalam dependensi yang dioptimalkan
//   }
// });
