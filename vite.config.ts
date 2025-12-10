import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import swc from "@vitejs/plugin-react-swc";
import path from "path";
//import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [swc(), tailwindcss() /* , visualizer({ open: true }) */],
  resolve: {
    alias: [{ find: "@", replacement: path.resolve("./src") }],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // React
          if (
            id.includes("node_modules/react/") ||
            id.includes("node_modules/react-dom/")
          ) {
            return "react";
          }
          // Put big libraries in a separate chunk
          /* if (
            id.includes("node_modules/@radix-ui/") ||
            id.includes("node_modules/@floating-ui/") ||
            id.includes("node_modules/@reduxjs/toolkit/")
          ) {
            return "vendor";
          } */
        },
        /* [
            "i18next",
            "i18next-browser-languagedetector",
            //"@radix-ui",
            //"@floating-ui",
            "@reduxjs/toolkit",
          ], */
      },
    },
  },
  /* server: {
    open: true,
    port: 5177,
  }, */
});
