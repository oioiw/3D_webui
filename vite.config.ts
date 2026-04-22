import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  define: {
    CESIUM_BASE_URL: JSON.stringify("/cesium"),
  },
});