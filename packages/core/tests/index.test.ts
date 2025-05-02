import { expect, test } from "vitest";

import core from "@auaust/pont-core";

test("test", () => {
  expect(core).toBeDefined();
  expect(core).toBe("@auaust/pont-core");
});
