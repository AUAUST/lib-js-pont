import { Pont } from "@auaust/pont";
import type { ServiceObject } from "@auaust/pont/services";
import { EmptyResponse } from "@core/src/classes/Responses/EmptyResponse.js";
import { transporter } from "@core/tests/mocks/Transporter.js";
import { expect, test, vitest } from "vitest";

test("Pont handles response using the response handler", async () => {
  const handle: ServiceObject<"responseHandler">["handle"] = (
    pont,
    request,
    response
  ) => {
    return EmptyResponse.create(response);
  };

  const responseHandler = {
    handle: vitest.fn(handle),
  } satisfies ServiceObject<"responseHandler">;

  const pont = Pont.create().init({
    baseUrl: "https://example.com",
    services: {
      transporter,
      responseHandler,
    },
  });

  await pont.visit("/");

  expect(responseHandler.handle).toHaveBeenCalledOnce();
  expect(responseHandler.handle.mock.lastCall![2]).toEqual(
    expect.objectContaining({
      status: 200,
      url: expect.stringContaining("/"),
      headers: expect.objectContaining({
        "x-pont": "true",
      }),
    })
  );

  await pont.post("/invalid");

  expect(responseHandler.handle).toHaveBeenCalledTimes(2);
  expect(responseHandler.handle.mock.lastCall![2]).toEqual(
    expect.objectContaining({
      status: 404,
      url: expect.stringContaining("/invalid"),
      headers: expect.objectContaining({
        "x-pont": "true",
      }),
    })
  );
});
