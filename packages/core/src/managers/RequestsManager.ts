import { S } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import { Request, type RequestInit } from "src/classes/Request.js";
import type { RequestDataInit } from "src/classes/RequestData.js";
import type { Url } from "src/types/utils.js";

export type RequestManagerInit = {
  /**
   * The base URL for the requests.
   */
  baseUrl?: Url;
};

export type VisitOptions = Omit<RequestInit, "url">;

/**
 * The requests manager is responsible for managing the requests made by the app.
 * It handles the form submissions, navigations, try-catches, and other requests.
 */
export class RequestsManager {
  protected baseUrl: Url | undefined;

  public constructor(public readonly pont: Pont) {}

  public init({ baseUrl }: RequestManagerInit) {
    this.baseUrl = S.trim(baseUrl) || undefined;
  }

  public async send(request: Request): Promise<Response> {
    const transporter = this.pont.getTransporter();
    const response = await transporter.send(request.getOptions());
    return response;
  }

  public async visit(url: Url, options: VisitOptions): Promise<Response> {
    const request = this.createRequest(url, options);
    const response = await this.send(request);
    return response;
  }

  public async get(
    url: Url,
    options: Omit<VisitOptions, "method">
  ): Promise<Response> {
    return this.visit(url, { ...options, method: "get" });
  }

  public async post(
    url: Url,
    data: RequestDataInit,
    options: Omit<VisitOptions, "method" | "data">
  ): Promise<Response> {
    return this.visit(url, { ...options, data, method: "post" });
  }

  public async put(
    url: Url,
    data: RequestDataInit,
    options: Omit<VisitOptions, "method" | "data">
  ): Promise<Response> {
    return this.visit(url, { ...options, data, method: "put" });
  }

  public async delete(
    url: Url,
    options: Omit<VisitOptions, "method">
  ): Promise<Response> {
    return this.visit(url, { ...options, method: "delete" });
  }

  public async patch(
    url: Url,
    data: RequestDataInit,
    options: Omit<VisitOptions, "method">
  ): Promise<Response> {
    return this.visit(url, { ...options, data, method: "patch" });
  }

  public getBaseUrl(): Url | undefined {
    return this.baseUrl;
  }

  public getUrl(url: Url): URL {
    return new URL(url, this.getBaseUrl());
  }

  /**
   * Instanciates a new request.
   */
  public createRequest(url: Url, options: Omit<RequestInit, "url">): Request {
    return new Request(this, {
      url: url,
      method: options.method,
      data: options.data,
      params: options.params,
      headers: options.headers,
    });
  }
}
