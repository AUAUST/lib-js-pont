import { Pont } from "@auaust/pont";
import type { ServiceObject } from "@auaust/pont/services";
import { ResponseParcel } from "@core/src/services/Transporter.js";
import type { RequestOptions } from "@core/src/types/requests.js";
import { expect, test, vitest } from "vitest";

test("Pont sends requests using the transporter", async () => {
  const transporter = {
    handle: vitest.fn(
      async (pont, options: RequestOptions): Promise<ResponseParcel> => {
        if (options.headers?.["x-pont-type"] === "data") {
          return {
            status: 200,
            url: options.url,
            headers: {
              "x-pont": "true",
              "x-pont-type": "data",
            },
            data: {
              comment: `${(<any>options.data)?.name} is a great name!`,
            },
          };
        }

        return {
          status: 200,
          url: options.url,
          headers: {
            "x-pont": "true",
            "x-pont-type": "navigation",
            "content-type": "application/json",
          },
          data: {
            type: "visit",
            page: "home",
          },
        };
      }
    ),
  } satisfies ServiceObject<"transporter">;

  const pont = Pont.create().init({
    baseUrl: "https://example.com",
    services: {
      transporter,
    },
  });

  await pont.visit("https://example.com", {
    method: "get",
  });

  expect(transporter.handle).toHaveBeenCalledExactlyOnceWith(pont, {
    type: "navigation",
    url: "https://example.com/",
    method: "get",
    data: undefined,
    headers: expect.objectContaining({
      "x-pont-type": "navigation",
    }),
  });

  await pont.post(
    "https://example.com",
    { john: "doe" },
    { headers: { "X-Test": "Test" } }
  );

  expect(transporter.handle).toHaveBeenLastCalledWith(pont, {
    type: "navigation",
    url: "https://example.com/",
    method: "post",
    data: { john: "doe" },
    headers: expect.objectContaining({
      "x-test": "Test",
      "x-pont-type": "navigation",
    }),
  });

  const data = await pont.data("https://example.com", {
    method: "post",
    data: { name: "John Cena" },
  });

  expect(transporter.handle).toHaveBeenLastCalledWith(pont, {
    type: "data",
    url: "https://example.com/",
    method: "post",
    data: { name: "John Cena" },
    headers: expect.objectContaining({
      "x-pont-type": "data",
    }),
  });

  expect(data).toEqual({ comment: "John Cena is a great name!" });
});
