import type { RequestsManager } from "src/managers/RequestsManager.js";
import type {
  RequestDataInit,
  RequestHeadersInit,
  RequestOptions,
  RequestParametersInit,
} from "src/types/requests.js";
import type { Method, Url } from "src/types/utils.js";
import { forwardCalls } from "src/utils/forwardsCalls.js";
import { toMethod } from "src/utils/methods.js";
import { EventsEmitter } from "./EventsEmitter.js";
import { RequestData } from "./RequestData.js";
import { RequestHeaders } from "./RequestHeaders.js";
import { RequestParameters } from "./RequestParameters.js";

export type RequestInit = {
  url: Url;
  method?: Method;
  data?: RequestDataInit;
  params?: RequestParametersInit;
  headers?: RequestHeadersInit;
};

export type RequestEvents = {
  /** The request is being sent. */
  start: () => void;
  /** The request was successful. */
  success: () => void;
  /** The request failed. */
  error: (error: Error) => void;
  /** The request is finished, regardless of success or failure. */
  finish: () => void;
  /** The request is being canceled. */
  cancel: () => void;
};

export interface Request
  extends Pick<RequestData, "getContentType" | "getData"> {}
export interface Request extends Pick<RequestParameters, "getParams"> {}
export interface Request extends Pick<RequestHeaders, "getHeaders"> {}

/**
 * A request object contains all the information needed to process a request.
 * It includes the URL, the method, the body, the headers.
 */
export class Request extends EventsEmitter<Request, RequestEvents> {
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
    super(["start", "success", "error", "finish", "cancel"]);

    this.url = url;
    this.method = toMethod(method, "get");
    this.data = new RequestData(this, data);
    this.params = new RequestParameters(this, params);
    this.headers = new RequestHeaders(this, headers);

    forwardCalls(this.data, this, ["getContentType", "getData"]);
    forwardCalls(this.params, this, ["getParams"]);
    forwardCalls(this.headers, this, ["getHeaders"]);
  }

  public get pont() {
    return this.requestsManager.pont;
  }

  public onStart = this.eventSetter("start");
  public onSuccess = this.eventSetter("success");
  public onError = this.eventSetter("error");
  public onFinish = this.eventSetter("finish");
  public onCancel = this.eventSetter("cancel");

  public getOptions(): RequestOptions {
    return {
      url: this.getUrl(),
      method: this.getMethod(),
      data: this.getData(),
      params: this.getParams(),
      headers: this.getHeaders(),
    };
  }

  public getUrl(): Url {
    return this.requestsManager.getUrl(this.url);
  }

  public getMethod(): Method {
    return this.method;
  }
}
