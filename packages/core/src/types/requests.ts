import type { Method } from "@core/src/enums/Method.js";
import type { ExchangeType } from "../enums/ExchangeType.js";

/**
 * A request object contains all the information needed to process a request.
 */
export type RequestOptions = {
  type: ExchangeType;
  url: string;
  method: Method;
  data?: unknown;
  headers?: Record<string, string>;
};
