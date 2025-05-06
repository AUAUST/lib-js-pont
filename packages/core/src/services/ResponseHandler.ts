import type { Pont } from "src/classes/Pont.js";
import { AmbientResponse } from "src/classes/Responses/AmbientResponse.js";
import type { RawResponse } from "src/classes/Responses/RawResponse.js";
import { Response } from "src/classes/Responses/Response.js";
import type { Service } from "./index.js";

/**
 * This contract defines the structure of the response handler service.
 */
export interface ResponseHandler extends Service {
  /**
   * Handles a raw response from the server and converts it into a usable format.
   * It is responsible for composing the fragment responses, extracting the
   * various data parts, and returning a standardized response object.
   */
  handle(this: Pont, response: RawResponse): Response;
}

export function createDefaultResponseHandler(pont: Pont): ResponseHandler {
  return {
    handle: (options) => {
      return new AmbientResponse({});
    },
  };
}
