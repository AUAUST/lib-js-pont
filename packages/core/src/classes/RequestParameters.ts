import type { RequestParametersInit } from "src/types/requests.js";
import { Request } from "./Request.js";

export class RequestParameters {
  public constructor(
    protected request: Request,
    init?: RequestParametersInit
  ) {}

  public getParams(): Record<string, string | number | boolean> {
    return {};
  }
}
