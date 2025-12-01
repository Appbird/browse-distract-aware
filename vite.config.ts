// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // ライブラリモードで1ファイル出力
    lib: {
      entry: "src/content/main.ts",
      name: "ContentScript",
      formats: ["iife"],
      fileName: () => "content.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      // content script 用なので外部依存は基本なし想定
      external: [],
    },
  },
});
