import type { RequestOptions } from "src/types/requests.js";
import { forwardCalls } from "src/utils/forwardCalls.js";
import { Method, toMethod, type MethodString } from "src/utils/methods.js";
import type { WithPont } from "./Pont.js";
import { RequestData, type RequestDataInit } from "./RequestData.js";
import { RequestHeaders, type RequestHeadersInit } from "./RequestHeaders.js";
import { Url } from "./Url.js";
import type { UrlParamsInit } from "./UrlParams.js";

export type RequestInit = {
  url: string;
  method?: Method | MethodString;
  data?: RequestDataInit;
  params?: UrlParamsInit;
  headers?: RequestHeadersInit;
};

export interface Request
  extends Pick<RequestData, "getContentType" | "getData"> {}
export interface Request extends Pick<Url, "getParams" | "getUrl"> {}
export interface Request
  extends Pick<RequestHeaders, "getHeaders" | "setHeader"> {}

/**
 * A request object contains all the information needed to process a request.
 * It includes the URL, the method, the body, the headers.
 */
export class Request implements WithPont {
  protected readonly url: Url;
  protected readonly method: Method;
  protected readonly data: RequestData;
  protected readonly headers: RequestHeaders;

  /**
   * Whether the request is currently being processed.
   */
  protected processing: boolean = false;

  /**
   * The response received from the server.
   * Only available after the request is finished.
   */
  protected response: unknown;

  public constructor(
    public readonly context: WithPont,
    { url, method, data, params, headers }: RequestInit
  ) {
    // Omit the search params from the URL, which are passed to the RequestParameters below
    this.method = toMethod(method, Method.GET);
    this.url = this.pont.createUrl(url, params);
    this.data = new RequestData(this, data);
    this.headers = new RequestHeaders(this, headers);

    forwardCalls(this.data, this, ["getContentType", "getData"]);
    forwardCalls(this.url, this, ["getParams", "getUrl"]);
    forwardCalls(this.headers, this, ["getHeaders", "setHeader"]);
  }

  public get pont() {
    return this.context.pont;
  }

  public getOptions(): RequestOptions {
    return {
      url: this.getUrl(),
      method: this.getMethod(),
      data: this.getData(),
      headers: this.getHeaders(),
    };
  }

  public getMethod(): Method {
    return this.method;
  }
}
