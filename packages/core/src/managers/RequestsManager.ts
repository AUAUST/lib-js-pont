import { S } from "@auaust/primitive-kit";
import { Request } from "src/classes/Request.js";
import {
  RequestDataInit,
  RequestHeadersInit,
  RequestParametersInit,
} from "src/types/requests.js";
import type { Method, Url } from "src/types/utils.js";

export type RequestManagerInit = {
  /**
   * The base URL for the requests.
   */
  baseUrl?: Url;
};

/**
 * The requests manager is responsible for managing the requests made by the app.
 * It handles the form submissions, navigations, try-catches, and other requests.
 */
export class RequestsManager {
  protected baseUrl!: Url;

  public init({ baseUrl }: RequestManagerInit) {
    this.baseUrl = S(baseUrl);
  }

  public getBaseUrl(): Url {
    return this.baseUrl;
  }

  /**
   * Instanciates a new request.
   */
  public createRequest(
    url: Url,
    options: {
      method?: Method;
      headers?: RequestHeadersInit;
      params?: RequestParametersInit;
      data?: RequestDataInit;
    } = {}
  ): Request {
    return new Request({
      url: S(url),
      method: options.method,
      data: options.data,
      params: options.params,
      headers: options.headers,
    });
  }
}
