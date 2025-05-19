import { A, O } from "@auaust/primitive-kit";
import {
  Response,
  type BaseResponseInit,
} from "@core/src/classes/Responses/Response.js";
import type { Effects } from "@core/src/types/effects.js";

export interface ValidResponseInit extends BaseResponseInit {
  effects?: Effects;
}

export abstract class ValidResponse extends Response {
  protected readonly effects: Readonly<Effects>;

  public constructor(init: ValidResponseInit) {
    super(init);

    this.effects = O.freeze(A.wrap(init.effects));
  }

  public getEffects() {
    return this.effects;
  }
}
