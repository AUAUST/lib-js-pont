import { type BaseResponseInit, Response } from "./Response.js";

export interface EmptyResponseInit extends BaseResponseInit {
  type: "empty";
}

export class EmptyResponse extends Response<"empty"> {
  public constructor({}: Omit<EmptyResponseInit, "type">) {
    super({ type: "empty" });
  }
}
