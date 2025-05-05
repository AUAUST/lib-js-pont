import { type BaseResponseInit, Response } from "./Response.js";

export interface AmbientResponseInit extends BaseResponseInit {
  type: "ambient";
}

export class AmbientResponse extends Response<"ambient"> {
  public constructor({}: Omit<AmbientResponseInit, "type">) {
    super({ type: "ambient" });
  }
}
