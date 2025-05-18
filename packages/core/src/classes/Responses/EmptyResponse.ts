import { ResponseType } from "@core/src/enums/ResponseType.js";
import { ValidResponse, ValidResponseInit } from "./ValidResponse.js";

export interface EmptyResponseInit extends ValidResponseInit {
  type?: ResponseType.EMPTY;
  propsGroups?: never;
}

export class EmptyResponse extends ValidResponse {
  public readonly type = ResponseType.EMPTY;

  public constructor(init: EmptyResponseInit) {
    super(init);
  }
}
