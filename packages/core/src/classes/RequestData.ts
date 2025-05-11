import { hasBody } from "src/utils/methods.js";
import type Stream from "stream";
import type { Request } from "./Request.js";

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
  | undefined
  | null;

export class RequestData {
  protected readonly data: RequestDataInit;

  public constructor(protected request: Request, init?: RequestDataInit) {
    this.data = init ?? {};
  }

  public getContentType(): string {
    return "application/json";
  }

  public getData(): unknown {
    if (!hasBody(this.request.getMethod())) {
      return undefined;
    }

    return this.data;
  }
}
