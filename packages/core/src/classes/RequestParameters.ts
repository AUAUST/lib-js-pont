import { Request } from "./Request.js";
/**
 * A value that can be used to initialize the request parameters.
 */
export type RequestParametersInit =
  | Record<string, string>
  | URLSearchParams
  | string[][]
  | string;

export class RequestParameters {
  public constructor(
    protected request: Request,
    init?: RequestParametersInit
  ) {}

  public getParams(): Record<string, string | number | boolean> {
    return {};
  }
}
