import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100, // Vérification plus rapide des fichiers
    },
    strictPort: true,
    hmr: {
      clientPort: 5173, // Corrige les problèmes de WebSocket sous Docker
    },
  },
});
