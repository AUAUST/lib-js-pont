import type { Constructor } from "@auaust/primitive-kit";
import { concern } from "@core/src/concerns/index.js";

export const HasSingleton = concern(
  <B extends Constructor<any>>(base: B) =>
    class extends base {
      private static instance: InstanceType<B> | undefined;

      static getInstance(): InstanceType<B> {
        return (this.instance ??= new this());
      }
    }
);
