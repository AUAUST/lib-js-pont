import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig(({ mode }) => {
  // If `--mode build` is used, we want to run tests using the built
  // version of the package. This is done by including or excluding
  // `@auaust/pont` and `@auaust/pont-adapter-solid` paths in the
  // `alias` section of the config. If these aliases are included, the
  // tests will use the source code of the packages. If they are excluded,
  // the packages will be resolved from the workspace and look for the `dist` folder.
  const shouldTestDist = mode === "build";

  const alias: Record<string, string> = {
    "@auaust/pont-adapter-solid": path.resolve(__dirname, "src"),
  };

  if (!shouldTestDist) {
    alias["@auaust/pont/toolkit"] = path.resolve(
      __dirname,
      "../core/src/toolkit"
    );
    alias["@auaust/pont"] = path.resolve(__dirname, "../core/src");
  }

  return {
    test: {
      coverage: { provider: "v8" },
    },
    resolve: {
      alias,
    },
  };
});
