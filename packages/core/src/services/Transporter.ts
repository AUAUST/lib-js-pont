import axios from "axios";
import type { Pont } from "src/classes/Pont.js";
import type { Response } from "src/classes/Responses/Response.js";
import type { RequestOptions } from "src/types/requests.js";
import type { Service } from "./index.js";

/**
 * This contract defines the structure of the transporter service.
 */
export interface Transporter extends Service {
  /**
   * Sends a request to the server.
   */
  handle(this: Pont, options: RequestOptions): Promise<Response>;
}

export function createDefaultTransporter(pont: Pont): Transporter {
  const instance = axios.create({
    baseURL: pont.getBaseUrl(),
  });

  return {
    handle: instance.request.bind(instance),
  };
}
