import { A, O } from "@auaust/primitive-kit";
import {
  Response,
  type BaseResponseInit,
} from "@core/src/classes/Responses/Response.js";
import type { PropsGroups } from "@core/src/types/app.js";
import type { Effects } from "@core/src/types/effects.js";

export interface ValidResponseInit extends BaseResponseInit {
  propsGroups?: Partial<Pick<PropsGroups, "global">>;
  effects?: Effects;
}

export abstract class ValidResponse extends Response {
  protected readonly propsGroups: Pick<PropsGroups, "global">;
  protected readonly effects: Readonly<Effects>;

  public constructor(init: ValidResponseInit) {
    super(init);

    this.propsGroups = { global: O.from(init.propsGroups?.global) };
    this.effects = O.freeze(A.wrap(init.effects));
  }

  public getGlobalProps() {
    return this.propsGroups.global;
  }

  public getEffects() {
    return this.effects;
  }
}
