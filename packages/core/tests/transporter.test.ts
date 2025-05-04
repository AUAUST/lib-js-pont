import { Pont } from "@auaust/pont-core";
import { Transporter } from "src/services/TransporterService.js";
import { expect, test, vitest } from "vitest";

test("Pont sends requests using the transporter", () => {
  const transporter: Transporter = {
    send: vitest.fn(async (options) => {
      return new Response();
    }),
  };

  const pont = new Pont().init({
    services: {
      transporter,
    },
  });

  pont.visit("https://example.com", {
    method: "get",
  });

  expect(transporter.send).toHaveBeenCalledExactlyOnceWith({
    url: "https://example.com",
    method: "get",
    data: {},
    headers: {},
    params: {},
  });
});
