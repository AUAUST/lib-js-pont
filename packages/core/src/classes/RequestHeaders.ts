import type { RequestHeadersInit } from "src/types/requests.js";
import { Request } from "./Request.js";

export class RequestHeaders {
  public constructor(protected request: Request, init?: RequestHeadersInit) {}

  public getHeaders(): Record<string, string> {
    return {};
  }
}
