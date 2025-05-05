import type { RequestsManager } from "src/managers/RequestsManager.js";
import type { RequestOptions } from "src/types/requests.js";
import type { Method, Url } from "src/types/utils.js";
import { forwardCalls } from "src/utils/forwardsCalls.js";
import { toMethod } from "src/utils/methods.js";
import { RequestData, type RequestDataInit } from "./RequestData.js";
import { RequestHeaders, type RequestHeadersInit } from "./RequestHeaders.js";
import {
  RequestParameters,
  type RequestParametersInit,
} from "./RequestParameters.js";

export type RequestInit = {
  url: Url;
  method?: Method;
  data?: RequestDataInit;
  params?: RequestParametersInit;
  headers?: RequestHeadersInit;
};

export interface Request
  extends Pick<RequestData, "getContentType" | "getData"> {}
export interface Request extends Pick<RequestParameters, "getParams"> {}
export interface Request extends Pick<RequestHeaders, "getHeaders"> {}

/**
 * A request object contains all the information needed to process a request.
 * It includes the URL, the method, the body, the headers.
 */
export class Request {
  protected readonly url: Url;
  protected readonly method: Method;
  protected readonly data: RequestData;
  protected readonly params: RequestParameters;
  protected readonly headers: RequestHeaders;

  /**
   * Whether the request is currently being processed.
   */
  protected processing: boolean = false;

  /**
   * The response received from the server.
   * Only available after the request is finished.
   */
  protected response: unknown | null = null;

  public constructor(
    public readonly requestsManager: RequestsManager,
    { url, method, data, params, headers }: RequestInit
  ) {
    const parsed = this.requestsManager.getUrl(url);

    // Omit the search params from the URL, which are passed to the RequestParameters below
    this.url = `${parsed.origin}${parsed.pathname}${parsed.hash}`;
    this.method = toMethod(method, "get");
    this.data = new RequestData(this, data);
    this.params = new RequestParameters(this, params, parsed.searchParams);
    this.headers = new RequestHeaders(this, headers);

    forwardCalls(this.data, this, ["getContentType", "getData"]);
    forwardCalls(this.params, this, ["getParams"]);
    forwardCalls(this.headers, this, ["getHeaders"]);
  }

  public get pont() {
    return this.requestsManager.pont;
  }

  public getOptions(): RequestOptions {
    return {
      url: this.getUrl(),
      method: this.getMethod(),
      data: this.getData(),
      headers: this.getHeaders(),
    };
  }

  public getUrl(): Url {
    const url = new URL(this.url);

    url.search = this.params.getParams();

    return url.toString();
  }

  public getMethod(): Method {
    return this.method;
  }
}
