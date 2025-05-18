import type { Constructor } from "@auaust/primitive-kit";
import { concern } from "@core/src/concerns/index.js";

export const HasSingleton = concern(
  <B extends Constructor<object>>(base: B) =>
    class HasSingleton extends base {
      static getInstance<T extends Constructor<any>>(this: T): InstanceType<T> {
        // @ts-expect-error
        return (this.instance ??= new this());
      }
    }
);
