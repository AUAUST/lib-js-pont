import { Pont } from "@auaust/pont";
import { A } from "@auaust/primitive-kit";
import { AmbientResponse } from "src/classes/Responses/AmbientResponse.js";
import { RawResponse } from "src/classes/Responses/RawResponse.js";
import type { ResponseHandler } from "src/services/ResponseHandler.js";
import { transporter } from "tests/mocks/Transporter.js";
import { expect, test, vitest } from "vitest";

test("Pont handles response using the response handler", async () => {
  const responseHandler = {
    handle: vitest.fn((response) => {
      return new AmbientResponse(response);
    }),
  } satisfies ResponseHandler;

  const pont = new Pont().init({
    baseUrl: "https://example.com",
    services: {
      transporter,
      responseHandler,
    },
  });

  await pont.visit("/");

  expect(responseHandler.handle).toHaveBeenCalledOnce();
  expect(A.first(responseHandler.handle.mock.lastCall)).toBeInstanceOf(
    RawResponse
  );

  await pont.post("/invalid");

  expect(responseHandler.handle).toHaveBeenCalledTimes(2);
  expect(A.first(responseHandler.handle.mock.lastCall)).toBeInstanceOf(
    RawResponse
  );
});
