import { Pont } from "@auaust/pont";
import { RawResponse } from "src/classes/Responses/RawResponse.js";
import type { Transporter } from "src/services/Transporter.js";
import { expect, test, vitest } from "vitest";

test("Pont sends requests using the transporter", () => {
  const transporter = {
    handle: vitest.fn(async (options) => {
      return new RawResponse({});
    }),
  } satisfies Transporter;

  const pont = new Pont().init({
    services: {
      transporter,
    },
  });

  pont.visit("https://example.com", {
    method: "get",
  });

  expect(transporter.handle).toHaveBeenCalledExactlyOnceWith({
    url: "https://example.com/",
    method: "get",
    data: undefined,
    headers: {},
  });

  pont.post(
    "https://example.com",
    { john: "doe" },
    { headers: { "X-Test": "Test" } }
  );

  expect(transporter.handle).toHaveBeenLastCalledWith({
    url: "https://example.com/",
    method: "post",
    data: { john: "doe" },
    headers: { "x-test": "Test" }, // headers are normalized to lowercase
  });
});
