import type { Method } from "src/enums/Method.js";

/**
 * A request object contains all the information needed to process a request.
 */
export type RequestOptions = {
  url: string;
  method: Method;
  data?: unknown;
  headers?: Record<string, string>;
};
