import { F, O } from "@auaust/primitive-kit";

export function forwardCalls<
  S extends Record<string, any>,
  T extends Record<string, any>,
  M extends (keyof S)[]
>(source: S, target: T, methods: M): void {
  for (const name of methods) {
    if (O.in(name, target)) {
      throw new TypeError(`Method ${String(name)} already exists on target`);
    }

    const method = source[name];

    if (!F.is(method)) {
      throw new TypeError(`Property ${String(name)} is not a function`);
    }

    Object.defineProperty(target, name, {
      value: method.bind(source),
      enumerable: true,
      writable: false,
      configurable: false,
    });
  }
}
