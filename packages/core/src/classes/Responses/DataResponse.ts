import { type BaseResponseInit, Response } from "./Response.js";

export interface DataResponseInit<T = unknown> extends BaseResponseInit {
  type: "data";
  /** The raw data to be sent to the client. */
  data: T;
}

export class DataResponse extends Response<"data"> {
  public constructor({}: Omit<DataResponseInit, "type">) {
    super({ type: "data" });
  }
}
