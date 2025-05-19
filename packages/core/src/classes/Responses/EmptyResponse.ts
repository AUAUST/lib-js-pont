import {
  NavigationResponse,
  type NavigationResponseInit,
} from "@core/src/classes/Responses/NavigationResponse.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";

export interface EmptyResponseInit extends NavigationResponseInit {
  type?: ResponseType.EMPTY;
  propsGroups?: never;
}

export class EmptyResponse extends NavigationResponse {
  public readonly type = ResponseType.EMPTY;

  public constructor(init: EmptyResponseInit) {
    super(init);
  }
}
