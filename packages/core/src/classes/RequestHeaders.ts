import { parseHeaders } from "src/utils/headers.js";
import type { Request } from "./Request.js";
/**
 * A value that can be used to initialize the request headers.
 */
export type RequestHeadersInit = HeadersInit;

export class RequestHeaders {
  protected readonly headers: RequestHeadersInit = {};

  public constructor(protected request: Request, init?: RequestHeadersInit) {
    this.headers = parseHeaders(init);
  }

  public get pont() {
    return this.request.pont;
  }

  /**
   * Returns the headers for the request, including the default headers from the header manager.
   */
  public getHeaders(): Record<string, string> {
    return this.pont.getHeadersManager().getHeaders(this.headers);
  }
}
