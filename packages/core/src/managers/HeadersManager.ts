import { O } from "@auaust/primitive-kit";
import type { RequestHeadersInit } from "src/types/requests.js";

export type HeadersManagerInit = {
  defaultHeaders: RequestHeadersInit;
};

/**
 * The HeadersManager class is responsible for managing the headers of a request.
 * If holds default headers, is responsible for CSRF tokens and other headers.
 */
export class HeadersManager {
  protected coreHeaders: Record<string, string> = {};
  protected defaultHeaders: Record<string, string> = {};

  public init(init?: HeadersManagerInit) {
    this.defaultHeaders = this.parseHeaders(init?.defaultHeaders);
  }

  public parseHeaders(headers?: RequestHeadersInit): Record<string, string> {
    if (!headers) {
      return {};
    }

    return O.fromEntries(new Headers(headers).entries());
  }

  /**
   * Returns the headers for the request, merging the default headers with the provided headers.
   */
  public getHeaders(headers?: RequestHeadersInit): Record<string, string> {
    return {
      ...this.getDefaultHeaders(),
      ...this.parseHeaders(headers),
      ...this.getCoreHeaders(),
    };
  }

  public getCoreHeaders(): Record<string, string> {
    return this.coreHeaders;
  }

  /**
   * Merges the default headers with the provided headers.
   */
  public setDefaultHeaders(headers: RequestHeadersInit): void {
    for (const [name, value] of O.entries(this.parseHeaders(headers))) {
      this.setDefaultHeader(name, value);
    }
  }

  public setDefaultHeader(name: string, value: string | null): void {
    if (value === null) {
      this.removeDefaultHeader(name);
    } else {
      this.defaultHeaders[name] = value;
    }
  }

  public removeDefaultHeader(name: string): void {
    delete this.defaultHeaders[name];
  }

  public getDefaultHeaders(): Record<string, string> {
    const headers = { ...this.defaultHeaders };

    let token: string | null;

    if ((token = this.getXsrfToken())) {
      headers["X-XSRF-TOKEN"] = token;
    } else if ((token = this.getCsrfToken())) {
      headers["X-CSRF-TOKEN"] = token;
    }

    return headers;
  }

  /**
   * Retrieves the encrypted CSRF token from the cookie, commonly set by Laravel.
   */
  public getXsrfToken(): string | null {
    if (typeof document === "undefined") {
      return null;
    }

    const cookies = document.cookie.split("; ");

    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");

      if (name === "XSRF-TOKEN") {
        return decodeURIComponent(value || "");
      }
    }

    return null;
  }

  /**
   * Retrieves the CSRF token from the meta tag, commonly set by Laravel.
   */
  public getCsrfToken(): string | null {
    if (typeof document === "undefined") {
      return null;
    }

    const meta = document.querySelector('meta[name="csrf-token"]');

    if (meta) {
      return meta.getAttribute("content") || null;
    }

    return null;
  }
}
