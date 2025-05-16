import type { Constructor } from "@auaust/primitive-kit";
import { Base } from "@core/src/concerns/index.js";

// @ts-expect-error
export function Creatable<B extends Constructor<object>>(base: B = Base) {
  return class extends base {
    static create<T extends Constructor>(
      this: T,
      ...args: ConstructorParameters<T>
    ): InstanceType<T> {
      // @ts-expect-error
      return new this(...args);
    }
  };
}
