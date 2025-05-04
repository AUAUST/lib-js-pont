import type { RequestHeadersInit } from "src/classes/RequestHeaders.js";

export function parseHeaders(
  headers?: RequestHeadersInit
): Record<string, string> {
  if (!headers) {
    return {};
  }

  return Object.fromEntries(new Headers(headers).entries());
}
