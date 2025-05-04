import { S } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import { Request, RequestInit } from "src/classes/Request.js";
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
  protected baseUrl!: Url;

  public constructor(public readonly pont: Pont) {}

  public init({ baseUrl }: RequestManagerInit) {
    this.baseUrl = S(baseUrl);
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
    options: Omit<VisitOptions, "method">
  ): Promise<Response> {
    return this.visit(url, { ...options, method: "post" });
  }

  public async put(
    url: Url,
    options: Omit<VisitOptions, "method">
  ): Promise<Response> {
    return this.visit(url, { ...options, method: "put" });
  }

  public async delete(
    url: Url,
    options: Omit<VisitOptions, "method">
  ): Promise<Response> {
    return this.visit(url, { ...options, method: "delete" });
  }

  public async patch(
    url: Url,
    options: Omit<VisitOptions, "method">
  ): Promise<Response> {
    return this.visit(url, { ...options, method: "patch" });
  }

  public getBaseUrl(): Url {
    return this.baseUrl;
  }

  /**
   * Instanciates a new request.
   */
  public createRequest(url: Url, options: Omit<RequestInit, "url">): Request {
    return new Request(this, {
      url: S(url),
      method: options.method,
      data: options.data,
      params: options.params,
      headers: options.headers,
    });
  }
}
