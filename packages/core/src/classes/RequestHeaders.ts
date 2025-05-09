import { S } from "@auaust/primitive-kit";
import { parseHeaders } from "src/utils/index.js";
import type { WithPont } from "./Pont.js";
/**
 * A value that can be used to initialize the request headers.
 */
export type RequestHeadersInit = HeadersInit;

export class RequestHeaders implements WithPont {
  protected readonly headers: Record<string, string> = {};

  public constructor(
    protected readonly context: WithPont,
    init?: RequestHeadersInit
  ) {
    this.headers = parseHeaders(init);
  }

  public get pont() {
    return this.context.pont;
  }

  /**
   * Returns the headers for the request, including the default headers from the header manager.
   */
  public getHeaders(): Record<string, string> {
    return this.pont.getHeadersManager().getHeaders(this.headers);
  }

  public setHeader(key: string, value: string): this {
    this.headers[S.lower(key)] = value;

    return this;
  }
}
