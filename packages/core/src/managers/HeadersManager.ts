import { O, P, S } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import type { RequestHeadersInit } from "src/classes/RequestHeaders.js";
import { parseHeaders } from "src/utils/index.js";

export type HeadersManagerInit = {
  defaultHeaders?: RequestHeadersInit;
};

/**
 * The HeadersManager class is responsible for managing the headers of a request.
 * If holds default headers, is responsible for CSRF tokens and other headers.
 */
export class HeadersManager {
  protected coreHeaders: Record<string, string> = {};
  protected defaultHeaders: Record<string, string> = {};

  public constructor(public readonly pont: Pont) {}

  public init(init?: HeadersManagerInit): this {
    this.defaultHeaders = parseHeaders(init?.defaultHeaders);

    return this;
  }

  /**
   * Returns the headers for the request, merging the default headers with the provided headers.
   */
  public getHeaders(headers?: RequestHeadersInit): Record<string, string> {
    return {
      ...this.getDefaultHeaders(),
      ...parseHeaders(headers),
      ...this.getCoreHeaders(),
    };
  }

  public getCoreHeaders(): Record<string, string> {
    return this.coreHeaders;
  }

  /**
   * Merges the default headers with the provided headers.
   */
  public setDefaultHeaders(headers: RequestHeadersInit): this {
    for (const [name, value] of O.entries(parseHeaders(headers))) {
      this.setDefaultHeader(name, value);
    }

    return this;
  }

  public setDefaultHeader(name: string, value: string | undefined): this {
    name = S.lower(name);

    if (P.isNullish(value)) {
      this.removeDefaultHeader(name);
    } else {
      this.defaultHeaders[name] = value;
    }

    return this;
  }

  public removeDefaultHeader(name: string): void {
    delete this.defaultHeaders[S.lower(name)];
  }

  public getDefaultHeaders(): Record<string, string> {
    const headers = { ...this.defaultHeaders };

    let token: string | undefined;

    if ((token = this.getXsrfToken())) {
      headers["x-xsrf-token"] = token;
    } else if ((token = this.getCsrfToken())) {
      headers["x-csrf-token"] = token;
    }

    return headers;
  }

  /**
   * Retrieves the encrypted CSRF token from the `XSRF-TOKEN` cookie.
   */
  public getXsrfToken(): string | undefined {
    if (typeof document === "undefined") {
      return;
    }

    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");

      if (S.lower(name) === "xsrf-token") {
        return decodeURIComponent(value || "");
      }
    }

    return;
  }

  /**
   * Retrieves the CSRF token from the `meta[name="csrf-token"]` tag.
   */
  public getCsrfToken(): string | undefined {
    if (typeof document === "undefined") {
      return;
    }

    const meta = document.querySelector('meta[name="csrf-token"]');

    if (meta) {
      return meta.getAttribute("content") || undefined;
    }

    return;
  }
}
