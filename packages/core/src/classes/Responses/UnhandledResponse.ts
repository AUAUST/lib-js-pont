import type { RawResponse } from "@core/src/classes/Responses/RawResponse.js";
import { Creatable } from "@core/src/concerns/Creatable.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";

/**
 * The UnhandledResponse class only exists to
 * indicate that the response handler was unable to
 * process the response. This is typically due to
 * the response not being a Pont response.
 */
export class UnhandledResponse extends Creatable() {
  public readonly type = ResponseType.UNHANDLED;

  public constructor(
    public readonly response: RawResponse,
    public reason?: string
  ) {
    super();
  }

  public withReason(reason: string): this {
    this.reason = reason;

    return this;
  }
}
