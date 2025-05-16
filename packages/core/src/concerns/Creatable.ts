// @ts-nocheck – These are too generic to be properly typed, thus we provide the signatures on a "trust me bro" basis.
import type { Constructor } from "@auaust/primitive-kit";
import { Concern } from "@core/src/concerns/index.js";

const cache = new WeakMap<Constructor, Constructor>();

export function Creatable<B extends Constructor<object>>(
  base: B = Concern
): B & {
  create<T extends Constructor>(
    this: T,
    ...args: ConstructorParameters<T>
  ): InstanceType<T>;
} {
  if (cache.has(base)) {
    return cache.get(base)!;
  }

  const extension = class extends base {
    static create(...args: any[]) {
      return new this(...args);
    }
  };

  cache.set(base, extension);

  return extension;
}
