import type { ObjectType } from "@auaust/primitive-kit";
import type { Pont } from "@core/src/classes/Pont.js";
import { Request, type RequestInit } from "@core/src/classes/Request.js";
import type { RequestDataInit } from "@core/src/classes/RequestData.js";
import { DataResponse } from "@core/src/classes/Responses/DataResponse.js";
import type { Response } from "@core/src/classes/Responses/Response.js";
import { Method } from "@core/src/enums/Method.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";
import { getBaseUrl } from "../utils/getBaseUrl.js";

export type RequestManagerInit = {
  /**
   * The base URL for the requests.
   */
  baseUrl?: string;
};

export type VisitOptions = Omit<RequestInit, "url">;

/**
 * The requests manager is responsible for managing the requests made by the app.
 * It handles the form submissions, navigations, try-catches, and other requests.
 */
export class RequestsManager {
  protected baseUrl: string | undefined;

  public constructor(public readonly pont: Pont) {}

  public init({ baseUrl }: RequestManagerInit): this {
    this.baseUrl = getBaseUrl(baseUrl);

    return this;
  }

  public async execute<R extends Response = Response>(
    request: Request
  ): Promise<R> {
    const options = request.getOptions();
    const rawResponse = await this.pont.use("transporter", options);
    const response = this.pont.use("responseHandler", rawResponse);

    if (response.type === ResponseType.UNHANDLED) {
      throw new Error(
        `A response could not be handled. Please check the response type: ${response.type}. Reason: ${response.reason}`
      );
    }

    return <R>response;
  }

  public async data<T = ObjectType>(
    url: string,
    options: VisitOptions = {}
  ): Promise<T> {
    const request = this.createRequest(url, options);

    request.setHeader("x-pont-type", "data");

    const response = await this.execute<DataResponse>(request);

    if (response.type !== ResponseType.DATA) {
      throw new Error(
        `Expected a data response, but got ${response.type} instead.`
      );
    }

    this.pont.getStateManager().applySideEffects(response);

    return <T>response.getData();
  }

  public async visit(url: string, options: VisitOptions = {}): Promise<void> {
    const request = this.createRequest(url, options);

    request.setHeader("x-pont-type", "navigation");

    // this.pont.emit("start");

    let response: Response;
    let error: unknown;

    try {
      response = await this.execute(request);

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

  /**
   * Instanciates a new request.
   */
  public createRequest(
    url: string,
    options: Omit<RequestInit, "url">
  ): Request {
    return new Request(this, { ...options, url });
  }
}
