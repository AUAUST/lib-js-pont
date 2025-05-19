import { N, S } from "@auaust/primitive-kit";

export function enumValidator<T extends string | number>(
  enumObject: Record<string, T>
) {
  return (value: unknown): value is T => {
    return (
      (S.is(value) || N.is(value)) &&
      Object.values(enumObject).includes(value as T)
    );
  };
}
