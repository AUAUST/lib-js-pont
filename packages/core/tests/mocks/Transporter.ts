import { s, S } from "@auaust/primitive-kit";
import { RawResponse } from "@core/src/classes/Responses/RawResponse.js";
import { RequestOptions } from "@core/src/types/requests.js";
import { vitest } from "vitest";

type MockTransporter = typeof transporter;

export const transporter = {
  handle: vitest.fn(async function (this: MockTransporter, pont, options) {
    const { url, path, method } = this.parseOptions(options);

    switch (`${method} ${path}`) {
      case "GET /":
        return this.ok().withData({
          message: "Hello, world!",
        });
    }

    return RawResponse.notFound();
  }),

  parseOptions(options: RequestOptions) {
    const url = new URL(options.url);
    const path: string = s(url.pathname)
      .trimEnd("/")
      .ensureStart("/")
      .lower()
      .toString();
    const method = S.upper(options.method);
    const headers = new Headers(options.headers);

    return {
      method,
      url,
      path,
      headers,
    };
  },

  response() {
    return new RawResponse().withHeaders({
      "x-pont": "true",
    });
  },

  ok() {
    return this.response().withStatus(200);
  },

  notFound() {
    return this.response().withStatus(404);
  },
};
