import { expect, test } from "vitest";

import adapter from "@auaust/pont-adapter-solid";

test("test", () => {
  expect(adapter).toBeDefined();
  expect(adapter).toBe("@auaust/pont-adapter-solid");
});
