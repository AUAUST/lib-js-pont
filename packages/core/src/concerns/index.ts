import type { Constructor } from "@auaust/primitive-kit";

export class Concern {}

export function concern<
  BaseInstance extends object,
  BaseClass extends Constructor<BaseInstance>,
  AugmentedClass extends Constructor<any>
>(
  factory: (base: BaseClass) => AugmentedClass
): (base?: BaseClass) => AugmentedClass {
  const cache = new WeakMap<Constructor, Constructor>();

  return (base?: BaseClass): AugmentedClass => {
    base ??= Concern as BaseClass;

    if (cache.has(base)) {
      return cache.get(base) as AugmentedClass;
    }

    const subclass = factory(base);

    cache.set(base, subclass);

    return subclass;
  };
}
