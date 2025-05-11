import { Pont, type ServiceObject } from "@auaust/pont";
import { EmptyResponse } from "src/classes/Responses/EmptyResponse.js";
import { RawResponse } from "src/classes/Responses/RawResponse.js";
import { transporter } from "tests/mocks/Transporter.js";
import { expect, test, vitest } from "vitest";

test("Pont handles response using the response handler", async () => {
  const responseHandler = {
    handle: vitest.fn((pont, response) => {
      return new EmptyResponse(response);
    }),
  } satisfies ServiceObject<"responseHandler">;

  const pont = new Pont().init({
    baseUrl: "https://example.com",
    services: {
      transporter,
      responseHandler,
    },
  });

  await pont.visit("/");

  expect(responseHandler.handle).toHaveBeenCalledOnce();
  expect(responseHandler.handle.mock.lastCall![1]).toBeInstanceOf(RawResponse);

  await pont.post("/invalid");

  expect(responseHandler.handle).toHaveBeenCalledTimes(2);
  expect(responseHandler.handle.mock.lastCall![1]).toBeInstanceOf(RawResponse);
});
