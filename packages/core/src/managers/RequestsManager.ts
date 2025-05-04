import { S } from "@auaust/primitive-kit";
import axios from "axios";
import { Request } from "src/classes/Request.js";
import {
  RequestDataInit,
  RequestHeadersInit,
  RequestParametersInit,
} from "src/types/requests.js";
import type { Transporter } from "src/types/transporter.js";
import type { Method, Url } from "src/types/utils.js";
import { HeadersManager } from "./HeadersManager.js";

export type RequestManagerInit = {
  /**
   * The base URL for the requests.
   */
  baseUrl?: Url;

  /**
   * The axios instance used to make requests.
   */
  transporter?: Transporter;

  headersManager?: HeadersManager;
};

/**
 * The requests manager is responsible for managing the requests made by the app.
 * It handles the form submissions, navigations, try-catches, and other requests.
 */
export class RequestsManager {
  protected readonly baseUrl: Url;
  protected readonly transporter: Transporter;
  protected readonly headersManager: HeadersManager;

  public constructor({ transporter, baseUrl }: RequestManagerInit) {
    this.baseUrl = S(baseUrl);
    this.transporter =
      transporter ??
      axios.create({
        baseURL: this.baseUrl,
      });
    this.headersManager = new HeadersManager(this);
  }

  public getBaseUrl(): Url {
    return this.baseUrl;
  }

  public getTransporter(): Transporter {
    return this.transporter;
  }

  public getHeadersManager(): HeadersManager {
    return this.headersManager;
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
      requestsManager: this,
      url: S(url),
      method: S(options.method) || "GET",
      data: options.data,
      params: options.params,
      headers: options.headers,
    });
  }
}
