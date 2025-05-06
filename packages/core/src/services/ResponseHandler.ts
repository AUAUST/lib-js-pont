import { O } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import { AmbientResponse } from "src/classes/Responses/AmbientResponse.js";
import type { RawResponse } from "src/classes/Responses/RawResponse.js";
import { Response } from "src/classes/Responses/Response.js";
import { UnhandledResponse } from "src/classes/Responses/UnhandledResponse.js";
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
  handle(pont: Pont, response: RawResponse): Response | UnhandledResponse;
}

export function createDefaultResponseHandler() {
  return {
    handle(pont: Pont, response: RawResponse) {
      const data = this.data(response);

      if (!data) {
        return Response.unhandled(response);
      }

      return new AmbientResponse({});
    },

    /**
     * Handle the general response from the server,
     * ensuring it has the correct headers and a body.
     * It either returns the parsed JSON data,
     * or null if the response is not valid.
     */
    data(response: RawResponse) {
      // If the header "x-pont" is not set, this means the response
      // is not a Pont response. Returning an UnhandledResponse
      // ensures the response is forwarded to the unhandled response service.
      if (!response.hasHeader("x-pont")) {
        return null;
      }

      const json = response.getJson();

      // If the response has no JSON data, it is not valid.
      // The JSON data is required to include the response type, props and such.
      if (!O.is(json)) {
        return null;
      }

      // If the response type is not set, it is not valid.
      // It is required for the server to specify the response type
      // otherwise the client cannot know how to handle it.
      if (!Response.isValidType(json.type)) {
        return null;
      }

      return json;
    },
  };
}
