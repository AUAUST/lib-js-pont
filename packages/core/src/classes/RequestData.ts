import type { RequestDataInit } from "src/types/requests.js";
import { Request } from "./Request.js";

export class RequestData {
  protected readonly data: RequestDataInit;

  public constructor(protected request: Request, init?: RequestDataInit) {
    this.data = init ?? {};
  }

  public getData(): unknown {
    return this.data;
  }
}
