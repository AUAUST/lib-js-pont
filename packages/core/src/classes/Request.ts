import type { RequestsManager } from "src/managers/RequestsManager.js";
import type {
  RequestDataInit,
  RequestHeadersInit,
  RequestOptions,
  RequestParametersInit,
} from "src/types/requests.js";
import type { Method, Url } from "src/types/utils.js";
import { EventsEmitter } from "./EventsEmitter.js";
import { RequestData } from "./RequestData.js";
import { RequestHeaders } from "./RequestHeaders.js";
import { RequestParameters } from "./RequestParameters.js";

export type RequestInit = {
  manager: RequestsManager;
  url: Url;
  method: Method;
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

/**
 * A request object contains all the information needed to process a request.
 * It includes the URL, the method, the body, the headers.
 */
export class Request extends EventsEmitter<Request, RequestEvents> {
  protected readonly manager: RequestsManager;
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

  public constructor({
    manager,
    url,
    method,
    data,
    params,
    headers,
  }: RequestInit) {
    super(["start", "success", "error", "finish", "cancel"]);

    this.manager = manager;
    this.url = url;
    this.method = method;
    this.data = new RequestData(this, data);
    this.params = new RequestParameters(this, params);
    this.headers = new RequestHeaders(this, headers);
  }

  public onStart = this.eventSetter("start");
  public onSuccess = this.eventSetter("success");
  public onError = this.eventSetter("error");
  public onFinish = this.eventSetter("finish");
  public onCancel = this.eventSetter("cancel");

  /**
   * Sends the request to the server.
   */
  public async send() {
    const response = await this.getManager()
      .getTransporter()
      .request(this.getOptions());
  }

  /**
   * Returns the request manager.
   */
  public getManager(): RequestsManager {
    return this.manager;
  }

  /**
   * Returns the options of the request.
   */
  public getOptions(): RequestOptions {
    return {
      url: this.getUrl(),
      method: this.getMethod(),
      data: this.getData(),
      params: this.getParams(),
      headers: this.getHeaders(),
    };
  }

  /**
   * The URL of the request.
   */
  public getUrl(): Url {
    return "";
  }

  /**
   * The method of the request.
   */
  public getMethod(): Method {
    return "GET";
  }

  /**
   * The body of the request.
   */
  public getData(): unknown {
    return this.data.getData();
  }

  /**
   * The query parameters of the request.
   */
  public getParams(): Record<string, unknown> {
    return this.params.getParams();
  }

  /**
   * The headers of the request.
   */
  public getHeaders(): Record<string, string> {
    return this.headers.getHeaders();
  }
}
