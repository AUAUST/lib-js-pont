import { F, S, type ObjectType } from "@auaust/primitive-kit";
import {
  Response,
  type BaseResponseInit,
} from "@core/src/classes/Responses/Response.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";

export interface DataResponseInit<T = unknown> extends BaseResponseInit {
  type: ResponseType.DATA;
  /** The raw data to be sent to the client. */
  data: T;
}

export class DataResponse extends Response<ResponseType.DATA> {
  protected readonly data: unknown;

  public constructor(init: Omit<DataResponseInit, "type">) {
    super({ ...init, type: ResponseType.DATA });

    this.data = init.data;
  }

  public getData(): ObjectType {
    if (S.is(this.data)) {
      return F.try(JSON.parse, this.data, this.data);
    }

    // @ts-expect-error
    return this.data;
  }
}
