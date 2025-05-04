import type { RequestOptions } from "./requests.js";

/**
 * The transporter interface provides the methods required to send requests.
 */
export interface Transporter {
  /**
   * Sends a request to the server.
   */
  request(options: RequestOptions): Promise<Response>;
}
