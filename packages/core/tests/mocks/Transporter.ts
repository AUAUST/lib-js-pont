import { s, S } from "@auaust/primitive-kit";
import type { ResponseParcel } from "@core/src/services/Transporter.js";
import type { RequestOptions } from "@core/src/types/requests.js";
import { vitest } from "vitest";

type MockTransporter = typeof transporter;

export const transporter = {
  handle: vitest.fn(async function (
    this: MockTransporter,
    pont,
    options: RequestOptions
  ): Promise<ResponseParcel> {
    const { url, path, method, data } = this.parseOptions(options);

    switch (`${method} ${path}`) {
      case "GET /":
        return this.defaults({
          url: url.toString(),
          data: {
            type: "visit",
            page: "home",
          },
        });

      case "GET /not-found":
        return this.defaults({
          status: 404,
          url: url.toString(),
        });

      case "GET /non-pont":
        return {
          status: 200,
          url: url.toString(),
          headers: {},
        };

      case "POST /return-json-as-is":
        return this.defaults({
          url: url.toString(),
          data: {
            type: "visit",
            page: "home",
            ...data,
          },
        });

      case "GET /network-error":
      case "POST /network-error":
        throw new Error("Network Error: Failed to fetch");
    }

    return this.defaults({
      status: 404,
      url: url.toString(),
    });
  }),

  defaults(
    result: Partial<ResponseParcel> & Pick<ResponseParcel, "url">
  ): ResponseParcel {
    return {
      status: 200,
      ...result,
      headers: {
        "x-pont-mode": "navigation",
        "content-type": "application/json",
        ...result.headers,
        "x-pont": "true",
      },
    };
  },

  parseOptions(options: RequestOptions) {
    const url = new URL(options.url);
    const headers = new Headers(options.headers);

    return {
      type: S.lower(options.mode),
      method: S.upper(options.method),
      url,
      path: <string>(
        s(url.pathname).trimEnd("/").ensureStart("/").lower().toString()
      ),
      headers,
      data:
        headers.get("content-type") === "application/json" && S.is(options.data)
          ? JSON.parse(options.data)
          : options.data,
    };
  },
};
