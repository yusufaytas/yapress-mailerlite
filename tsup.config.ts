import { defineConfig } from "tsup";

export default defineConfig({
  entry: [
    "src/index.ts",
    "src/plugins/mailerlite-newsletter/newsletter-form-client.tsx",
    "src/plugins/mailerlite-newsletter/plugin.tsx",
  ],
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: true,
});
