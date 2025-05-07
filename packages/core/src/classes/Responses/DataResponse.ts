import { ResponseType } from "src/enums/ResponseType.js";
import { type BaseResponseInit, Response } from "./Response.js";

export interface DataResponseInit<T = unknown> extends BaseResponseInit {
  type: ResponseType.DATA;
  /** The raw data to be sent to the client. */
  data: T;
}

export class DataResponse extends Response<ResponseType.DATA> {
  public constructor(init: Omit<DataResponseInit, "type">) {
    super({ ...init, type: ResponseType.DATA });
  }
}
