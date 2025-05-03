import { F } from "@auaust/primitive-kit";

export function getTitleTransformer(
  transformer?: (title: string) => string
): (title: string) => string {
  return F.is(transformer) ? transformer : F.identity;
}
