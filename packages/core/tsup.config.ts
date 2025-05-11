import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    toolkit: "src/toolkit.ts",
    services: "src/services/index.ts",
  },
  format: ["esm", "cjs"],
  outDir: "dist",
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: false,
});
