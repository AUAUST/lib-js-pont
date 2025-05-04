import axios from "axios";
import type { Pont } from "src/classes/Pont.js";
import type { RequestOptions } from "src/types/requests.js";

/**
 * The transporter interface provides the methods required to send requests.
 */
export interface Transporter {
  /**
   * Sends a request to the server.
   */
  send(options: RequestOptions): Promise<Response>;
}

export function createDefaultTransporter(pont: Pont): Transporter {
  const instance = axios.create({
    baseURL: pont.getBaseUrl(),
  });

  return {
    send: instance.request.bind(instance),
  };
}
