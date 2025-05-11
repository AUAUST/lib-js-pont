import { Pont } from "@auaust/pont";
import type { ServiceObject } from "@auaust/pont/services";
import { RawResponse } from "@core/src/classes/Responses/RawResponse.js";
import type { RequestOptions } from "@core/src/types/requests.js";
import { expect, test, vitest } from "vitest";

test("Pont sends requests using the transporter", async () => {
  const transporter = {
    handle: vitest.fn(async (pont, options: RequestOptions) => {
      if (options.headers?.["x-pont-type"] === "data") {
        return RawResponse.ok()
          .withStatus(200)
          .withUrl(options.url)
          .withHeaders({
            "x-pont": "true",
          })
          .withData({
            type: "data",
            data: { comment: `${(<any>options.data)?.name} is a great name!` },
          });
      }

      return RawResponse.ok()
        .withHeaders({
          "x-pont": "true",
        })
        .withUrl(options.url);
    }),
  } satisfies ServiceObject<"transporter">;

  const pont = new Pont().init({
    baseUrl: "https://example.com",
    services: {
      transporter,
    },
  });

  await pont.visit("https://example.com", {
    method: "get",
  });

  expect(transporter.handle).toHaveBeenCalledExactlyOnceWith(pont, {
    url: "https://example.com/",
    method: "get",
    data: undefined,
    headers: expect.objectContaining({
      "x-pont-type": "visit",
    }),
  });

  await pont.post(
    "https://example.com",
    { john: "doe" },
    { headers: { "X-Test": "Test" } }
  );

  expect(transporter.handle).toHaveBeenLastCalledWith(pont, {
    url: "https://example.com/",
    method: "post",
    data: { john: "doe" },
    headers: expect.objectContaining({
      "x-test": "Test",
      "x-pont-type": "visit",
    }),
  });

  const data = await pont.data("https://example.com", {
    method: "post",
    data: { name: "John Cena" },
  });

  expect(transporter.handle).toHaveBeenLastCalledWith(pont, {
    url: "https://example.com/",
    method: "post",
    data: { name: "John Cena" },
    headers: expect.objectContaining({
      "x-pont-type": "data",
    }),
  });

  expect(data).toEqual({ comment: "John Cena is a great name!" });
});
