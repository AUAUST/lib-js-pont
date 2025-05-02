import { expect, test } from "vitest";

import adapter from "@auaust/pont-adapter-solid";
import core from "@auaust/pont-core";

test("test", () => {
  expect(core).toBeDefined();
  expect(core).toBe("@auaust/pont-core");

  expect(adapter).toBeDefined();
  expect(adapter).toBe("@auaust/pont-adapter-solid");
});
