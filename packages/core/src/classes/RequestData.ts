import type { RequestDataInit } from "src/types/requests.js";
import { supportsData } from "src/utils/methods.js";
import { Request } from "./Request.js";

export class RequestData {
  protected readonly data: RequestDataInit;

  public constructor(protected request: Request, init?: RequestDataInit) {
    this.data = init ?? {};
  }

  public getContentType(): string {
    return "application/json";
  }

  public getData(): unknown {
    if (!supportsData(this.request.getMethod())) {
      return undefined;
    }

    return this.data;
  }
}
