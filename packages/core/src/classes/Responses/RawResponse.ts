import { F, N, O, P, S } from "@auaust/primitive-kit";

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
export class RawResponse {
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

  public getStatus(): number | undefined {
    return this.status;
  }

  public getUrl(): string {
    if (this.url === undefined) {
      throw new Error("URL is not set");
    }

    return this.url;
  }

  public getHeaders(): Headers | undefined {
    return this.headers;
  }

  public getHeader(name: string): string | null {
    return this.headers?.get(name) ?? null;
  }

  public hasHeader(name: string): boolean {
    return this.headers?.has(name) ?? false;
  }

  public getData(): string | object | undefined {
    return this.data;
  }

  public getJson(): object | null {
    const data = this.getData();

    if (!data) {
      return null;
    }

    if (S.is(data)) {
      return F.try(JSON.parse, null, data);
    }

    if (O.is(data)) {
      return data;
    }

    return null;
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
