import {
  Response,
  type BaseResponseInit,
} from "@core/src/classes/Responses/Response.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";

export interface UnhandledResponseInit extends BaseResponseInit {
  type?: ResponseType.UNHANDLED;
  reason?: string;
  error?: Error;
}

export class UnhandledResponse extends Response {
  public readonly type = ResponseType.UNHANDLED;
  public readonly reason?: string;
  public readonly error?: Error;

  public constructor(init: UnhandledResponseInit) {
    super(init);

    this.reason = init.reason;
    this.error = init.error;
  }

  public getReason(): string | undefined {
    return this.reason ?? this.error?.message;
  }
}
