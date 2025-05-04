import type { Stream } from "stream";
import type { Method, Url } from "./utils.js";

/**
 * A request object contains all the information needed to process a request.
 */
export type RequestOptions = {
  url: Url;
  method: Method;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;

  /**
   * The request timeout in milliseconds. If the request takes longer than this time,
   * it will be aborted. If not set or set to 0, the request will not timeout.
   */
  timeout?: number;
};

/**
 * A value that can be used to initialize the request data.
 */
export type RequestDataInit =
  | { [key: string]: unknown }
  | ArrayBuffer
  | ArrayBufferView
  | FormData
  | Blob
  | URLSearchParams
  | Stream
  | Buffer
  | string
  | number
  | boolean
  | null;

/**
 * A value that can be used to initialize the request parameters.
 */
export type RequestParametersInit =
  | Record<string, string>
  | URLSearchParams
  | string[][]
  | string;

/**
 * A value that can be used to initialize the request headers.
 */
export type RequestHeadersInit = HeadersInit;
