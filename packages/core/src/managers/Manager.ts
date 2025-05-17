import type { Pont } from "@core/src/classes/Pont.js";
import { Creatable } from "@core/src/concerns/Creatable.js";
import type { WithPont } from "@core/src/contracts/WithPont.js";

export abstract class Manager extends Creatable() implements WithPont {
  public constructor(public readonly pont: Pont) {
    super();
  }

  public abstract init(init?: unknown): this;
}
