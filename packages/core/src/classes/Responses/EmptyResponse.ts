import {
  type BaseResponseInit,
  Response,
} from "@core/src/classes/Responses/Response.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";

export interface EmptyResponseInit extends BaseResponseInit {
  type: ResponseType.EMPTY;
}

export class EmptyResponse extends Response<ResponseType.EMPTY> {
  public constructor(init: Omit<EmptyResponseInit, "type">) {
    super({ ...init, type: ResponseType.EMPTY });
  }
}
