import type { RequestHeadersInit } from "src/types/requests.js";

export function parseHeaders(
  headers?: RequestHeadersInit
): Record<string, string> {
  if (!headers) {
    return {};
  }

  return Object.fromEntries(new Headers(headers).entries());
}
