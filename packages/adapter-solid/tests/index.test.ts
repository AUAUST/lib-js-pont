import { expect, test } from "vitest";

import { createPontApp } from "@auaust/pont-adapter-solid";

test("test", () => {
  expect(createPontApp).toBeTypeOf("function");
});
