import axios from "axios";
import type { Pont } from "src/classes/Pont.js";
import { RawResponse } from "src/classes/Responses/RawResponse.js";
import type { RequestOptions } from "src/types/requests.js";
import type { Service } from "./index.js";

/**
 * This contract defines the structure of the transporter service.
 */
export interface Transporter extends Service {
  /**
   * Sends a request to the server.
   */
  handle(this: Pont, options: RequestOptions): Promise<RawResponse>;
}

export function createDefaultTransporter(pont: Pont): Transporter {
  const instance = axios.create({
    baseURL: pont.getBaseUrl(),
  });

  return {
    async handle(options: RequestOptions) {
      return await instance.request(options).then((response) => {
        return new RawResponse()
          .withStatus(response.status)
          .withUrl(response.config.url)
          .withStatusText(response.statusText)
          .withHeaders(<any>response.headers)
          .withData(response.data)
          .freeze();
      });
    },
  };

  return {
    handle: instance.request.bind(instance),
  };
}
