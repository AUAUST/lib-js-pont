import { ResponseType } from "src/enums/ResponseType.js";
import { type BaseResponseInit, Response } from "./Response.js";

export interface EmptyResponseInit extends BaseResponseInit {
  type: ResponseType.EMPTY;
}

export class EmptyResponse extends Response<ResponseType.EMPTY> {
  public constructor(init: Omit<EmptyResponseInit, "type">) {
    super({ ...init, type: ResponseType.EMPTY });
  }
}
