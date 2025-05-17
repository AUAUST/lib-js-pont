import { type Stringifiable } from "@auaust/primitive-kit";
import { Creatable } from "@core/src/concerns/Creatable.js";
import type { WithPont } from "@core/src/contracts/WithPont.js";
import {
  type NormalizedUrlParams,
  normalizeParams,
} from "@core/src/utils/params.js";

/**
 * A value that can be used to initialize the request parameters.
 */
export type UrlParamsInit =
  | Record<string, Stringifiable | string[]>
  | URLSearchParams
  | string[][]
  | string;

export class UrlParams extends Creatable() implements WithPont {
  protected readonly params: NormalizedUrlParams;

  public constructor(
    public readonly context: WithPont,
    /**
     * Multiple sources can be passed to the constructor.
     * They will be merged, with the later ones taking precedence over the earlier ones.
     */
    ...inits: (UrlParamsInit | undefined)[]
  ) {
    super();
    this.params = normalizeParams(...inits);
  }

  public get pont() {
    return this.context.pont;
  }

  public getParams() {
    return this.pont.use("paramsSerializer", this.params).toString();
  }

  public setParam(key: string, value: string): this {
    this.params.push([key, value]);
    return this;
  }
}
