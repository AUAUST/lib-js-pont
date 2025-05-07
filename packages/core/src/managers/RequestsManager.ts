import { s } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import { Request, type RequestInit } from "src/classes/Request.js";
import type { RequestDataInit } from "src/classes/RequestData.js";
import type { Response } from "src/classes/Responses/Response.js";
import { Method } from "src/enums/Method.js";
import { ResponseType } from "src/enums/ResponseType.js";

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
    this.baseUrl = s(baseUrl).trim().ensureEnd("/").toString() || undefined;

    return this;
  }

  public async execute(request: Request): Promise<Response> {
    const rawResponse = await this.pont.use(
      "transporter",
      request.getOptions()
    );

    const response = this.pont.use("responseHandler", rawResponse);

    if (response.type === ResponseType.UNHANDLED) {
      throw this.pont.use("unhandledResponseHandler", response);
    }

    return response;
  }

  public async data(
    url: string,
    options: Omit<VisitOptions, "method"> = {}
  ): Promise<Response> {
    const request = this.createRequest(url, options);
    const response = await this.execute(request);

    if (response.type !== ResponseType.DATA) {
      throw new Error(
        `Expected a data response, but got ${response.type} instead.`
      );
    }

    return response;
  }

  public async visit(url: string, options: VisitOptions = {}): Promise<void> {
    const request = this.createRequest(url, options);
    const response = await this.execute(request);

    if (response.type === ResponseType.DATA) {
      throw new Error(
        `Expected a visit response, but got ${response.type} instead.`
      );
    }

    this.pont.getStateManager().updateState(response);
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
