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

type ResolverInput<N extends string = string, C = Component> = {
  resolver: ComponentResolver<N, C> | undefined;
  name: string | null;
};

export async function resolveComponents<
  T extends Record<string, ResolverInput>
>(
  components: T
): Promise<{
  [K in keyof T]: T[K] extends ResolverInput<any, infer C> ? C : never;
}>;
export async function resolveComponents(
  components: Record<string, ResolverInput>
): Promise<Record<string, Component | undefined>> {
  const result = await Promise.all(
    Object.entries(components).map(async ([key, { resolver, name }]) => {
      return [key, await resolveComponent(resolver, name)] as const;
    })
  );

  return Object.fromEntries(result);
}
