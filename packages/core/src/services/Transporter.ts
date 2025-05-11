import axios, { type AxiosInstance } from "axios";
import type { Pont } from "src/classes/Pont.js";
import { RawResponse } from "src/classes/Responses/RawResponse.js";
import { Service } from "src/classes/Service.js";
import type { RequestOptions } from "src/types/requests.js";

/**
 * Sends a request to the server.
 */
export type TransporterSignature = (
  options: RequestOptions
) => Promise<RawResponse>;

export class TransporterService extends Service<"transporter"> {
  protected axios: AxiosInstance;

  public constructor(pont: Pont) {
    super(pont);

    this.axios = axios.create({
      baseURL: pont.getBaseUrl(),
    });
  }

  public async handle(options: RequestOptions) {
    return await this.axios.request(options).then((response) => {
      return new RawResponse()
        .withStatus(response.status)
        .withUrl(response.config.url)
        .withHeaders(<any>response.headers)
        .withData(response.data)
        .freeze();
    });
  }
}
