import {
  RequestData,
  type RequestDataInit,
} from "@core/src/classes/RequestData.js";
import {
  RequestHeaders,
  type RequestHeadersInit,
} from "@core/src/classes/RequestHeaders.js";
import { Url } from "@core/src/classes/Url.js";
import type { UrlParamsInit } from "@core/src/classes/UrlParams.js";
import { Creatable } from "@core/src/concerns/Creatable.js";
import type { WithPont } from "@core/src/contracts/WithPont.js";
import { ExchangeMode } from "@core/src/enums/ExchangeType.js";
import type { RequestOptions } from "@core/src/types/requests.js";
import { forwardCalls } from "@core/src/utils/forwardCalls.js";
import {
  Method,
  toMethod,
  type MethodString,
} from "@core/src/utils/methods.js";

export type RequestInit = {
  mode: ExchangeMode;
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
export class Request extends Creatable() implements WithPont {
  protected readonly mode: ExchangeMode;
  protected readonly url: Url;
  protected readonly method: Method;
  protected readonly headers: RequestHeaders;
  protected readonly data: RequestData;

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
    { data, headers, method, params, mode, url }: RequestInit
  ) {
    super();

    this.mode = mode ?? ExchangeMode.NAVIGATION;
    this.method = toMethod(method, Method.GET);
    this.url = this.pont.createUrl(url, params);
    this.data = RequestData.create(this, data);
    this.headers = RequestHeaders.create(this, headers);

    forwardCalls(this.data, <Request>this, ["getContentType", "getData"]);
    forwardCalls(this.url, <Request>this, ["getParams", "getUrl"]);
    forwardCalls(this.headers, <Request>this, ["getHeaders", "setHeader"]);
  }

  public get pont() {
    return this.context.pont;
  }

  public getOptions(): RequestOptions {
    return {
      mode: this.getMode(),
      url: this.getUrl(),
      method: this.getMethod(),
      data: this.getData(),
      headers: this.getHeaders(),
    };
  }

  public getMode(): ExchangeMode {
    return this.mode;
  }

  public getMethod(): Method {
    return this.method;
  }
}
