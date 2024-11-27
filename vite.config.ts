import { defineConfig } from "vite";
import { resolve } from "path";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "EditorJSQuote",
      fileName: (format) => `editorjs-quote.${format}.js`,
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["@editorjs/editorjs", "@codexteam/icons", "@editorjs/dom"],
      output: {
        globals: {
          "@editorjs/editorjs": "EditorJS",
          "@codexteam/icons": "CodexIcons",
          "@editorjs/dom": "EditorJSDOM",
        },
      },
    },
  },

  plugins: [cssInjectedByJsPlugin(), dts()],
});
