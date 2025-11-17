import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/',
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core vendor libraries
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('@radix-ui')) {
              return 'vendor-ui';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            return 'vendor-other';
          }
          // Separate moto3 pages
          if (id.includes('src/pages/moto3/')) {
            return 'moto3-pages';
          }
          // UI components
          if (id.includes('src/components/ui/')) {
            return 'ui-components';
          }
        },
      },
    },
  },
  server: {
    hmr: {
      overlay: false,
    },
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
}));
