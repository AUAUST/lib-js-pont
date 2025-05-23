import type { ExchangeMode } from "@core/src/enums/ExchangeType.js";
import type { Method } from "@core/src/enums/Method.js";

/**
 * A request object contains all the information needed to process a request.
 */
export type RequestOptions = {
  mode: ExchangeMode;
  url: string;
  method: Method;
  data?: unknown;
  headers?: Record<string, string>;
};
