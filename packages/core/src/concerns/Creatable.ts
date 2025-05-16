import type { Constructor } from "@auaust/primitive-kit";
import { concern } from "@core/src/concerns/index.js";

export const Creatable = concern(
  <B extends Constructor<any>>(base: B) =>
    class extends base {
      static create<T extends Constructor<any>>(
        this: T,
        ...args: ConstructorParameters<T>
      ): InstanceType<T> {
        return new this(...args);
      }
    }
);
