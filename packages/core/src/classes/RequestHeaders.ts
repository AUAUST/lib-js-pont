import type { RequestHeadersInit } from "src/types/requests.js";
import type { Request } from "./Request.js";

export class RequestHeaders {
  protected readonly headers: Record<string, string> = {};

  public constructor(protected request: Request, init?: RequestHeadersInit) {}

  /**
   * Returns the headers for the request, including the default headers from the header manager.
   */
  public getHeaders(): Record<string, string> {
    return this.request.pont.getHeadersManager().getHeaders(this.headers);
  }
}
