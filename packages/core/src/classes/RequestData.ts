import type { Request } from "@core/src/classes/Request.js";
import { Creatable } from "@core/src/concerns/Creatable.js";
import type { WithPont } from "@core/src/contracts/WithPont.js";
import { hasBody } from "@core/src/utils/methods.js";
import type Stream from "stream";

/**
 * A value that can be used to initialize the request data.
 */
export type RequestDataInit =
  | { [key: string]: unknown }
  | ArrayBuffer
  | ArrayBufferView
  | FormData
  | Blob
  | URLSearchParams
  | Stream
  | Buffer
  | string
  | number
  | boolean
  | undefined
  | null;

export class RequestData extends Creatable() implements WithPont {
  protected readonly data: RequestDataInit;

  public constructor(protected request: Request, init?: RequestDataInit) {
    super();
    this.data = init ?? {};
  }

  public get pont() {
    return this.request.pont;
  }

  public getContentType(): string {
    return "application/json";
  }

  public getData(): unknown {
    if (!hasBody(this.request.getMethod())) {
      return undefined;
    }

    return this.data;
  }
}
