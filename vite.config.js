import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from 'tailwindcss';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths(), tailwindcss()],
  optimizeDeps: {
    include: ['react', 'react-dom'], // Specify dependencies to include in bundle optimization
  },
  server: {
    host: "127.0.0.1",
    port: 3001,
  },
  build: {
    rollupOptions: {
      external: [ 'react', 'react-dom'],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
});
