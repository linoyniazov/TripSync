import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/user": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/auth": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/post": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/postInteraction": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/file": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
      "/public": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
