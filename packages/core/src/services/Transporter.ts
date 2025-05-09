import axios from "axios";
import type { Pont } from "src/classes/Pont.js";
import { RawResponse } from "src/classes/Responses/RawResponse.js";
import type { RequestOptions } from "src/types/requests.js";
import type { ServiceObject } from "./index.js";

export interface Transporter extends ServiceObject {
  /**
   * Sends a request to the server.
   */
  handle(pont: Pont, options: RequestOptions): Promise<RawResponse>;
}

export function createDefaultTransporter(pont: Pont): Transporter {
  const instance = axios.create({
    baseURL: pont.getBaseUrl(),
  });

  return {
    async handle(pont, options: RequestOptions) {
      return await instance.request(options).then((response) => {
        return new RawResponse()
          .withStatus(response.status)
          .withUrl(response.config.url)
          .withHeaders(<any>response.headers)
          .withData(response.data)
          .freeze();
      });
    },
  };
}
