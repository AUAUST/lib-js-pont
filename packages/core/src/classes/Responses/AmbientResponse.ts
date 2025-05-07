import { ResponseType } from "src/enums/ResponseType.js";
import { type BaseResponseInit, Response } from "./Response.js";

export interface AmbientResponseInit extends BaseResponseInit {
  type: ResponseType.AMBIENT;
}

export class AmbientResponse extends Response<ResponseType.AMBIENT> {
  public constructor({}: Omit<AmbientResponseInit, "type">) {
    super({ type: ResponseType.AMBIENT });
  }
}
