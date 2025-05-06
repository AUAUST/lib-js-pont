import { S } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import { Request, type RequestInit } from "src/classes/Request.js";
import type { RequestDataInit } from "src/classes/RequestData.js";
import type { Response } from "src/classes/Responses/Response.js";

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
    this.baseUrl = S.trim(baseUrl) || undefined;

    return this;
  }

  public async execute(request: Request): Promise<Response> {
    const rawResponse = await this.pont.use(
      "transporter",
      request.getOptions()
    );

    const response = this.pont.use("responseHandler", rawResponse);

    // if (response.type === "unhandled") {
    //   return this.pont.use("unhandledResponseHandler", response.response);
    // }

    return response;
  }

  public async visit(
    url: string,
    options: VisitOptions = {}
  ): Promise<Response> {
    const request = this.createRequest(url, options);
    const response = await this.execute(request);
    return response;
  }

  public async get(
    url: string,
    options: Omit<VisitOptions, "method"> = {}
  ): Promise<Response> {
    return this.visit(url, { ...options, method: "get" });
  }

  public async post(
    url: string,
    data: RequestDataInit = {},
    options: Omit<VisitOptions, "method" | "data"> = {}
  ): Promise<Response> {
    return this.visit(url, { ...options, data, method: "post" });
  }

  public async put(
    url: string,
    data: RequestDataInit = {},
    options: Omit<VisitOptions, "method" | "data"> = {}
  ): Promise<Response> {
    return this.visit(url, { ...options, data, method: "put" });
  }

  public async delete(
    url: string,
    options: Omit<VisitOptions, "method"> = {}
  ): Promise<Response> {
    return this.visit(url, { ...options, method: "delete" });
  }

  public async patch(
    url: string,
    data: RequestDataInit = {},
    options: Omit<VisitOptions, "method" | "data"> = {}
  ): Promise<Response> {
    return this.visit(url, { ...options, data, method: "patch" });
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
