import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/plugins/mailerlite-newsletter/plugin.tsx",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: true,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
