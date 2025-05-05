import { type Stringifiable } from "@auaust/primitive-kit";
import {
  type NormalizedRequestParameters,
  normalizeParams,
} from "src/utils/params.js";
import type { Request } from "./Request.js";

/**
 * A value that can be used to initialize the request parameters.
 */
export type RequestParametersInit =
  | Record<string, Stringifiable | string[]>
  | URLSearchParams
  | string[][]
  | string;

export class RequestParameters {
  protected params: NormalizedRequestParameters;

  public constructor(
    protected request: Request,
    /**
     * Multiple sources can be passed to the constructor.
     * They will be merged, with the later ones taking precedence over the earlier ones.
     */
    ...inits: (RequestParametersInit | undefined)[]
  ) {
    this.params = normalizeParams(...inits);
  }

  public get pont() {
    return this.request.pont;
  }

  public getParams(): string {
    return this.pont.getParamsSerializer().serialize(this.params).toString();
  }

  public setParam(key: string, value: string): this {
    this.params.push([key, value]);
    return this;
  }
}
