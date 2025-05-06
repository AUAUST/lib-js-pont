import type { RawResponse } from "./RawResponse.js";

/**
 * The UnhandledResponse class only exists to
 * indicate that the response handler was unable to
 * process the response. This is typically due to
 * the response not being a Pont response.
 */
export class UnhandledResponse {
  public readonly type = "unhandled";

  public constructor(public readonly response: RawResponse) {}
}
