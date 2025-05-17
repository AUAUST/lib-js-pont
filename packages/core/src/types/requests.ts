import type { Method } from "@core/src/enums/Method.js";
import type { RequestType } from "../enums/RequestType.js";

/**
 * A request object contains all the information needed to process a request.
 */
export type RequestOptions = {
  type: RequestType;
  url: string;
  method: Method;
  data?: unknown;
  headers?: Record<string, string>;
};
