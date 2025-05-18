import { S, type ObjectType } from "@auaust/primitive-kit";
import { Request, type RequestInit } from "@core/src/classes/Request.js";
import type { RequestDataInit } from "@core/src/classes/RequestData.js";
import { DataResponse } from "@core/src/classes/Responses/DataResponse.js";
import type { Response } from "@core/src/classes/Responses/Response.js";
import { Method } from "@core/src/enums/Method.js";
import { RequestType } from "@core/src/enums/RequestType.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";
import { Manager } from "@core/src/managers/Manager.js";
import { getBaseUrl } from "@core/src/utils/getBaseUrl.js";
import { RawResponse } from "../classes/Responses/RawResponse.js";
import { ExecuteStatus } from "../enums/ExecuteStatus.js";

export type RequestManagerInit = {
  /**
   * The base URL for the requests.
   */
  baseUrl?: string;
};

export type VisitOptions = Omit<RequestInit, "url" | "type">;

export type ExecuteResult<R extends Response = Response> =
  | {
      status: ExecuteStatus.CANCELED;
    }
  | {
      status: ExecuteStatus.FAILED;
      error?: Error;
    }
  | {
      status: ExecuteStatus.SUCCESS;
      response: R;
    };

/**
 * The requests manager is responsible for managing the requests made by the app.
 * It handles the form submissions, navigations, try-catches, and other requests.
 */
export class RequestsManager extends Manager {
  protected baseUrl: string | undefined;

  public init({ baseUrl }: RequestManagerInit): this {
    this.baseUrl = getBaseUrl(baseUrl);

    if (!S.isStrict(this.baseUrl)) {
      throw new Error(
        `The base URL is not a valid URL and could not be determined automatically.`
      );
    }

    return this;
  }

  public async execute<R extends Response = Response>(
    request: Request
  ): Promise<ExecuteResult<R>> {
    const { canceled } = this.pont.emit("before", { request });

    if (canceled) {
      this.pont.emit("prevented", { request });

      return { status: ExecuteStatus.CANCELED };
    }

    try {
      this.pont.emit("start", { request });

      const options = request.getOptions();

      let rawResponse: RawResponse | undefined;

      try {
        rawResponse = await this.pont.use("transporter", options);
      } catch (error) {
        this.pont.emit("exception", {
          request,
          error: error instanceof Error ? error : new Error(String(error)),
        });

        return { status: ExecuteStatus.FAILED };
      }

      this.pont.emit("received", { request, rawResponse });

      const response = this.pont.use("responseHandler", rawResponse);

      if (response.type === ResponseType.UNHANDLED) {
        // TODO: Handle the unhandled responses. If the event is canceled, it should do nothing. Otherwise, show a modal through a service.
        const { canceled } = this.pont.emit("unhandled", { request, response });

        throw new Error(
          `A response could not be handled. Reason: ${response.reason}`
        );
      }

      this.pont.emit("success", { request, response });

      return {
        status: ExecuteStatus.SUCCESS,
        response: <R>response,
      };
    } finally {
      this.pont.emit("finish", { request });
    }
  }

  public async data<T = ObjectType>(
    url: string,
    options: VisitOptions = {}
  ): Promise<T | undefined> {
    const request = this.createDataRequest(url, options);

    const result = await this.execute<DataResponse>(request);
    const { status } = result;

    if (status === ExecuteStatus.CANCELED) {
      throw new Error("The request was canceled.");
    }

    if (status === ExecuteStatus.FAILED) {
      throw result.error;
    }

    const { response } = result;

    if (response.type !== ResponseType.DATA) {
      throw new Error(
        `Expected a data response, but got ${response.type} instead.`
      );
    }

    this.pont.getStateManager().applySideEffects(response);

    return <T>response.getData();
  }

  public async visit(url: string, options: VisitOptions = {}): Promise<void> {
    const request = this.createNavigationRequest(url, options);

    let response: Response | undefined;
    let error: unknown;

    try {
      const result = await this.execute(request);
      const { status } = result;

      if (status === ExecuteStatus.CANCELED) {
        return;
      }

      if (status === ExecuteStatus.FAILED) {
        console.error("Request failed", result.error);

        return;
      }

      response = result.response;

      if (response.type === ResponseType.DATA) {
        // this.pont.emit("invalid");

        throw new Error(
          `Expected a visit response, but got ${response.type} instead.`
        );
      }

      this.pont.getStateManager().applySideEffects(response);
      this.pont.getStateManager().updateState(response);
      // this.pont.emit("success");
    } catch (error) {
      // this.pont.emit("error");

      throw error;
    } finally {
      // this.pont.emit("finish");
    }
  }

  public async get(
    url: string,
    options: Omit<VisitOptions, "method"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, method: Method.GET });
  }

  public async post(
    url: string,
    data: RequestDataInit = {},
    options: Omit<VisitOptions, "method" | "data"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, data, method: Method.POST });
  }

  public async put(
    url: string,
    data: RequestDataInit = {},
    options: Omit<VisitOptions, "method" | "data"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, data, method: Method.PUT });
  }

  public async delete(
    url: string,
    options: Omit<VisitOptions, "method"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, method: Method.DELETE });
  }

  public async patch(
    url: string,
    data: RequestDataInit = {},
    options: Omit<VisitOptions, "method" | "data"> = {}
  ): Promise<void> {
    return this.visit(url, { ...options, data, method: Method.PATCH });
  }

  public getBaseUrl(): string | undefined {
    return this.baseUrl;
  }

  public createRequest(
    type: RequestType,
    url: string,
    options: Omit<RequestInit, "url" | "type">
  ): Request {
    return Request.create(this, { ...options, url, type });
  }

  public createDataRequest(
    url: string,
    options: Omit<RequestInit, "url" | "type">
  ): Request {
    return this.createRequest(RequestType.DATA, url, options);
  }

  public createNavigationRequest(
    url: string,
    options: Omit<RequestInit, "url" | "type">
  ): Request {
    return this.createRequest(RequestType.NAVIGATION, url, options);
  }
}
