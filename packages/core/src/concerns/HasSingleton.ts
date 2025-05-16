// @ts-nocheck – These are too generic to be properly typed, thus we provide the signatures on a "trust me bro" basis.
import type { Constructor } from "@auaust/primitive-kit";
import { Base } from "@core/src/concerns/index.js";

const cache = new WeakMap<Constructor, Constructor>();

export function HasSingleton<B extends Constructor<object>>(
  base: B = Base
): B & { getInstance<T extends Constructor>(this: T): InstanceType<T> } {
  if (cache.has(base)) {
    return cache.get(base)!;
  }

  const extension = class extends base {
    static getInstance() {
      return (this.instance ??= new this());
    }
  };

  cache.set(base, extension);

  return extension;
}
