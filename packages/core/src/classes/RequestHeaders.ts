import { S } from "@auaust/primitive-kit";
import type { WithPont } from "@core/src/classes/Pont.js";
import type { Request } from "@core/src/classes/Request.js";
import { Creatable } from "@core/src/concerns/Creatable.js";
import { parseHeaders } from "@core/src/utils/headers.js";
/**
 * A value that can be used to initialize the request headers.
 */
export type RequestHeadersInit = HeadersInit;

export class RequestHeaders extends Creatable() implements WithPont {
  protected readonly headers: Record<string, string> = {};

  public constructor(protected request: Request, init?: RequestHeadersInit) {
    super();
    this.headers = parseHeaders(init);
  }

  public get pont() {
    return this.request.pont;
  }

  public getHeaders(): Record<string, string> {
    return this.pont.getHeadersManager().getHeaders({
      ...this.getDefaultHeaders(),
      ...this.headers,
      ...this.getCoreHeaders(),
    });
  }

  public getDefaultHeaders(): Record<string, string> {
    return {
      "content-type": this.request.getContentType(),
    };
  }

  public getCoreHeaders(): Record<string, string> {
    return {
      "x-pont-type": this.request.getType(),
    };
  }

  public setHeader(key: string, value: string): this {
    this.headers[S.lower(key)] = value;

    return this;
  }
}
