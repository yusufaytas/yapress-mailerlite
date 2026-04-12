import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/**/*.ts", "src/**/*.tsx", "!src/**/*.test.tsx", "!src/**/*.d.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  bundle: false,
  splitting: false,
  outDir: "dist",
});
