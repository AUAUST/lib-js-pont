import { F, N, O, P, S } from "@auaust/primitive-kit";
import { Creatable } from "@core/src/concerns/Creatable.js";

export interface RawResponseInit {
  status?: number;
  url?: string;
  headers?: Headers | Record<string, string>;
  data?: string | object;
}

/**
 * The RawResponse class is a standardized way of
 * representing HTTP responses. It encapsulates the
 * response data, status code, headers, and other
 * metadata, providing a consistent interface
 * to simplify the consumption of responses
 * across different services.
 */
export class RawResponse extends Creatable() {
  public static ok(init: Omit<RawResponseInit, "status"> = {}) {
    return new RawResponse(init).withStatus(200);
  }

  public static notFound(init: Omit<RawResponseInit, "status"> = {}) {
    return new RawResponse(init).withStatus(404);
  }

  public static serverError(init: Omit<RawResponseInit, "status"> = {}) {
    return new RawResponse(init).withStatus(500);
  }

  /**
   * The HTTP status code of the response.
   */
  protected status?: number;

  /**
   * The URL of the response.
   */
  protected url?: string;

  /**
   * The headers of the response.
   */
  protected headers?: Headers;

  /**
   * The pre-processed data of the response.
   * This should be either a JSON string or an object.
   */
  protected data?: string | object;

  public constructor({ status, url, headers, data }: RawResponseInit = {}) {
    super();

    if (P.isSet(status)) {
      this.withStatus(status);
    }

    if (P.isSet(url)) {
      this.withUrl(url);
    }

    if (P.isSet(headers)) {
      this.withHeaders(headers);
    }

    if (P.isSet(data)) {
      this.withData(data);
    }
  }

  public withStatus(status: number): this {
    this.status = N(status);

    return this;
  }

  public withUrl(url: string | undefined): this {
    this.url = url;

    return this;
  }

  public withHeaders(headers: Headers | Record<string, string>): this {
    if (headers instanceof Headers) {
      this.headers = headers;
    } else {
      this.headers = new Headers(headers);
    }

    return this;
  }

  public withData(data: string | object): this {
    this.data = data;

    return this;
  }

  public getStatus(): number {
    return this.status!;
  }

  public getUrl(): string | undefined {
    return this.url;
  }

  public getHeaders(): Headers | undefined {
    return this.headers;
  }

  public getHeader(name: string): string | undefined {
    return this.headers?.get(name) ?? undefined;
  }

  public hasHeader(name: string): boolean {
    return this.headers?.has(name) ?? false;
  }

  public getData(): string | object | undefined {
    return this.data;
  }

  public getJson(): object | undefined {
    const data = this.getData();

    if (!data) {
      return;
    }

    if (S.is(data)) {
      return F.try(JSON.parse, undefined, data);
    }

    if (O.is(data)) {
      return data;
    }

    return;
  }

  public isOk(): boolean {
    return N.isBetween(this.status, 200, 299);
  }

  public isNotFound(): boolean {
    return this.status === 404;
  }

  public isClientError(): boolean {
    return N.isBetween(this.status, 400, 499);
  }

  public isServerError(): boolean {
    return N.isBetween(this.status, 500, 599);
  }

  /**
   * Make the object read-only once the fields are set.
   */
  public freeze(): this {
    return Object.freeze(this);
  }

  /**
   * Whether the response is frozen.
   */
  public isFrozen(): boolean {
    return Object.isFrozen(this);
  }
}
