import { type Stringifiable } from "@auaust/primitive-kit";
import { type NormalizedUrlParams, normalizeParams } from "src/utils/params.js";
import type { Url } from "./Url.js";

/**
 * A value that can be used to initialize the request parameters.
 */
export type UrlParamsInit =
  | Record<string, Stringifiable | string[]>
  | URLSearchParams
  | string[][]
  | string;

export class UrlParams {
  protected readonly params: NormalizedUrlParams;

  public constructor(
    public readonly url: Url,
    /**
     * Multiple sources can be passed to the constructor.
     * They will be merged, with the later ones taking precedence over the earlier ones.
     */
    ...inits: (UrlParamsInit | undefined)[]
  ) {
    this.params = normalizeParams(...inits);
  }

  public get pont() {
    return this.url.pont;
  }

  public getParams(): string {
    return this.pont.getParamsSerializer().serialize(this.params).toString();
  }

  public setParam(key: string, value: string): this {
    this.params.push([key, value]);
    return this;
  }
}
