import type { RequestDataInit } from "src/types/requests.js";
import { Request } from "./Request.js";

export class RequestData {
  public constructor(protected request: Request, init?: RequestDataInit) {}

  public getData(): unknown {
    return {};
  }
}
