import { defineConfig } from "tsup";
import {
  type PresetOptions,
  generatePackageExports,
  generateTsupOptions,
  parsePresetOptions,
  writePackageJson,
} from "tsup-preset-solid";

const presetOptions: PresetOptions = {
  entries: [
    {
      entry: "src/index.tsx", // entries with '.tsx' extension will have `solid` export condition generated
      dev_entry: true,
    },
    // {
    //   name: "server",
    //   entry: "src/server.ts",
    //   server_entry: true,
    // },
  ],
  cjs: true,
};

const CI =
  process.env["CI"] === "true" ||
  process.env["GITHUB_ACTIONS"] === "true" ||
  process.env["CI"] === '"1"' ||
  process.env["GITHUB_ACTIONS"] === '"1"';

export default defineConfig((config) => {
  const watching = !!config.watch;

  const parsedOptions = parsePresetOptions(presetOptions, watching);

  if (!watching && !CI) {
    const packageFields = generatePackageExports(parsedOptions);

    console.log(
      `package.json: \n\n${JSON.stringify(packageFields, null, 2)}\n\n`
    );

    // will update ./package.json with the correct export fields
    writePackageJson(packageFields);
  }

  return generateTsupOptions(parsedOptions);
});
