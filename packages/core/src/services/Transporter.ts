import type { Pont } from "@core/src/classes/Pont.js";
import { Service } from "@core/src/classes/Service.js";
import type { RequestOptions } from "@core/src/types/requests.js";
import axios, { type AxiosInstance, type AxiosResponse } from "axios";

/**
 * Sends a request to the server.
 */
export type TransporterSignature = (
  options: RequestOptions
) => Promise<ResponseParcel>;

export type ResponseParcel = {
  readonly status: number;
  readonly url: URL | string;
  readonly headers: HeadersInit;
  readonly data?: unknown;
};

export class TransporterService extends Service<"transporter"> {
  protected axios: AxiosInstance;

  public constructor(pont: Pont) {
    super(pont);

    this.axios = axios.create({
      baseURL: pont.getBaseUrl(),
    });
  }

  public async handle(options: RequestOptions): Promise<ResponseParcel> {
    return this.axios.request(options).then((response) => ({
      status: this.getStatus(response),
      url: this.getUrl(response),
      headers: this.getHeaders(response),
      data: this.getData(response),
    }));
  }

  protected getStatus(response: AxiosResponse): number {
    return response.status;
  }

  protected getUrl(response: AxiosResponse): URL | string {
    return response.config.url ?? response.request.responseURL ?? "";
  }

  protected getHeaders(response: AxiosResponse): Headers {
    const parsedHeaders = new Headers();

    for (const [key, value] of Object.entries(response.headers)) {
      if (value !== undefined) {
        parsedHeaders.append(key, value);
      }
    }

    return parsedHeaders;
  }

  protected getData(response: AxiosResponse): unknown {
    return response.data;
  }
}
