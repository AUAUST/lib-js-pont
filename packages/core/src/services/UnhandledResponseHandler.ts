import type { Pont } from "src/classes/Pont.js";
import { UnhandledResponse } from "src/classes/Responses/UnhandledResponse.js";
import type { ServiceObject } from "./index.js";

export interface UnhandledResponseHandler extends ServiceObject {
  /**
   * Handles a raw response from the server which the response handler
   * was unable to process. This is typically due to the response
   * not being a Pont response or data being malformed.
   */
  handle(pont: Pont, response: UnhandledResponse): void;
}

export function createDefaultUnhandledResponseHandler() {
  return {
    handle(pont: Pont, response: UnhandledResponse) {
      console.error(
        `Pont received an unhandled response. This is typically due to the response not being a Pont response or data being malformed.`,
        response
      );

      throw new Error(
        `Pont received an unhandled response. This is typically due to the response not being a Pont response or data being malformed.`
      );
    },
  };
}
