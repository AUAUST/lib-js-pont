import type { RawResponse } from "@core/src/classes/Responses/RawResponse.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";

/**
 * The UnhandledResponse class only exists to
 * indicate that the response handler was unable to
 * process the response. This is typically due to
 * the response not being a Pont response.
 */
export class UnhandledResponse {
  public readonly type = ResponseType.UNHANDLED;

  public constructor(
    public readonly response: RawResponse,
    protected reason?: string
  ) {}

  public withReason(reason: string): this {
    this.reason = reason;

    return this;
  }
}
