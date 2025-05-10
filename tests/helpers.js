const { S } = require("@auaust/primitive-kit");
const { existsSync } = require("fs");
const { resolve } = require("path");

function resolveAdapter(name) {
  name = S.lower(name).trim();

  const directory = resolve(__dirname, `../packages/adapter-${name}`);

  if (!name || !existsSync(directory)) {
    throw new Error(
      `Please specify a valid package name in the PACKAGE environment variable.`
    );
  }

  return {
    name,
    directory,
    get testAppDirectory() {
      const testAppDirectory = resolve(directory, "test-app");

      if (!existsSync(testAppDirectory)) {
        throw new Error(
          `Test app directory does not exist for package ${name}.`
        );
      }

      return testAppDirectory;
    },
    get testAppDistDirectory() {
      const testAppDistDirectory = resolve(this.testAppDirectory, "dist");

      if (!existsSync(testAppDistDirectory)) {
        throw new Error(
          `The adapter ${name} must be built before running the tests.`
        );
      }

      return testAppDistDirectory;
    },
    port: 13717,
  };
}

module.exports = {
  resolveAdapter,
};
