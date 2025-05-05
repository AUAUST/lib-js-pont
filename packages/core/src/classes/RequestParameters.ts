import { mergeParams } from "src/utils/params.js";
import type { Request } from "./Request.js";
/**
 * A value that can be used to initialize the request parameters.
 */
export type RequestParametersInit =
  | Record<string, string>
  | URLSearchParams
  | string[][]
  | string;

export class RequestParameters {
  protected params: URLSearchParams;

  public constructor(
    protected request: Request,
    /**
     * Multiple sources can be passed to the constructor.
     * They will be merged, with the later ones taking precedence over the earlier ones.
     */
    ...inits: (RequestParametersInit | undefined)[]
  ) {
    this.params = mergeParams(new URLSearchParams(), ...inits);
  }

  public getParams(): URLSearchParams {
    return this.params;
  }

  public setParam(key: string, value: string): this {
    this.params.append(key, value);
    return this;
  }

  public toString(): string {
    return this.params.toString();
  }
}
