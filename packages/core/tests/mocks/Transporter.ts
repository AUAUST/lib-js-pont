import type { Transporter } from "@auaust/pont";
import { s, S } from "@auaust/primitive-kit";
import { RawResponse } from "src/classes/Responses/RawResponse.js";
import { RequestOptions } from "src/types/requests.js";
import { vitest } from "vitest";

function parseOptions(options: RequestOptions) {
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
}

export const transporter = {
  handle: vitest.fn(async function (options) {
    const { url, path, method } = parseOptions(options);

    switch (`${method} ${path}`) {
      case "GET /":
        return RawResponse.ok().withData({
          message: "Hello, world!",
        });
    }

    return RawResponse.notFound();
  }),
} satisfies Transporter;
