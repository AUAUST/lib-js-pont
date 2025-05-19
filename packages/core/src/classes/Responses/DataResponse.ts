import {
  ValidResponse,
  type ValidResponseInit,
} from "@core/src/classes/Responses/ValidResponse.js";
import { ExchangeMode } from "@core/src/enums/ExchangeType.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";

export interface DataResponseInit<T> extends ValidResponseInit {
  type?: ResponseType.PARTIAL;
  data: T;
}

export class DataResponse<T = unknown> extends ValidResponse {
  public readonly mode = ExchangeMode.DATA;
  public readonly type = undefined;
  protected readonly data: T;

  public constructor(init: DataResponseInit<T>) {
    super(init);

    this.data = init.data;
  }

  public getData(): T {
    return this.data;
  }
}
