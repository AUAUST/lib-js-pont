import { F, N, O, P, S } from "@auaust/primitive-kit";

/**
 * The RawResponse class is a standardized way of
 * representing HTTP responses. It encapsulates the
 * response data, status code, headers, and other
 * metadata, providing a consistent interface
 * to simplify the consumption of responses
 * across different services.
 */
export class RawResponse {
  /**
   * The HTTP status code of the response.
   */
  protected status?: number;

  /**
   * The HTTP status text of the response.
   */
  protected statusText?: string;

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

  public constructor({
    status,
    statusText,
    url,
    headers,
    data,
  }: {
    status?: number;
    statusText?: string;
    url?: string;
    headers?: Headers | Record<string, string>;
    data?: string | object;
  } = {}) {
    if (P.isSet(status)) {
      this.withStatus(status);
    }

    if (P.isSet(statusText)) {
      this.withStatusText(statusText);
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

  public withStatus(status: number, statusText?: string): this {
    this.status = N(status);

    if (S.is(statusText)) {
      this.withStatusText(statusText);
    }

    return this;
  }

  public withStatusText(statusText: string): this {
    this.statusText = S(statusText);

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

  public getStatusText(): string | undefined {
    return this.statusText;
  }

  public getUrl(): string | undefined {
    return this.url;
  }

  public getHeaders(): Headers | undefined {
    return this.headers;
  }

  public getHeader(name: string): string | null {
    return this.headers?.get(name) ?? null;
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
