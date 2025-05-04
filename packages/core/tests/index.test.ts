import { pont, Pont } from "@auaust/pont-core";
import { expect, test } from "vitest";

test("Pont exists as a singleton", () => {
  expect(pont).toBeDefined();
  expect(pont).toBeInstanceOf(Pont);
  expect(Pont.getInstance()).toBe(pont);
});
