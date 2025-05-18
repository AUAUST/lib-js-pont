export function enumValidator<T extends string>(enumObject: Record<string, T>) {
  return (value: string): value is T => {
    return Object.values(enumObject).includes(value as T);
  };
}
