import { F } from "@auaust/primitive-kit";
import type { Component } from "solid-js";
import type { ComponentResolver } from "src/createPontApp.jsx";

export async function resolveComponent<N extends string>(
  resolver: ComponentResolver<N> | undefined,
  name: N | null
): Promise<Component | undefined> {
  if (!resolver || !name) {
    return undefined;
  }

  const result = await resolver(name);

  if (!result) {
    return undefined;
  }

  if (F.is(result)) {
    return result;
  }

  if ("default" in result) {
    return result.default;
  }

  return undefined;
}
