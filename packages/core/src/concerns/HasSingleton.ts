import type { Constructor } from "@auaust/primitive-kit";
import { Base } from "@core/src/concerns/index.js";

// @ts-expect-error
export function HasSingleton<B extends Constructor<object>>(base: B = Base) {
  return class extends base {
    static getInstance<T extends Constructor>(this: T): InstanceType<T> {
      // @ts-expect-error
      return (this.instance ??= new this());
    }
  };
}
