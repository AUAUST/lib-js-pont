import axios from "axios";
import { Pont } from "src/classes/Pont.js";
import type { RequestOptions } from "src/types/requests.js";

/**
 * The transporter interface provides the methods required to send requests.
 */
export interface Transporter {
  /**
   * Sends a request to the server.
   */
  request(options: RequestOptions): Promise<Response>;
}

export function createDefaultTransporter(pont: Pont): Transporter {
  return axios.create({
    baseURL: pont.getBaseUrl(),
  });
}
