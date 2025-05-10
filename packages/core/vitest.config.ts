import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: { provider: "v8" },
  },
  resolve: {
    alias: {
      "@auaust/pont/toolkit": path.resolve(__dirname, "src/toolkit"),
      "@auaust/pont": path.resolve(__dirname, "src"),
    },
  },
});
