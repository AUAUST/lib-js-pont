import type { Method } from "./utils.js";

/**
 * A request object contains all the information needed to process a request.
 */
export type RequestOptions = {
  url: string;
  method: Method;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
};
