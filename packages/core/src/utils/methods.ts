import { S } from "@auaust/primitive-kit";

/**
 * A valid HTTP method for standard user-defined requests.
 */
export type Method = "get" | "post" | "put" | "delete" | "patch";

/**
 * Methods that are safe to use without side effects.
 */
export type SafeMethod = "get" | "head" | "options";

/**
 * Methods that can be safely retried without side effects.
 */
export type IdempotentMethod = "get" | "head" | "options" | "put" | "delete";

/**
 * All HTTP methods, including ones that are unnecessary for standard user-defined requests.
 */
export type AnyMethod =
  | "get"
  | "head"
  | "options"
  | "put"
  | "delete"
  | "post"
  | "patch";

export function toMethod(
  method: string | undefined | null,
  fallback: Method
): Method {
  return isMethod((method = S.lower(method))) ? method : S.lower(fallback);
}

export function isMethod(method: string | undefined | null): method is Method {
  switch (S.lower(method)) {
    case "get":
    case "post":
    case "put":
    case "delete":
    case "patch":
      return true;
    default:
      return false;
  }
}

export function isAnyMethod(
  method: string | undefined | null
): method is AnyMethod {
  switch (S.lower(method)) {
    case "get":
    case "post":
    case "put":
    case "delete":
    case "patch":
    case "head":
    case "options":
      return true;
    default:
      return false;
  }
}

export function isSafeMethod(
  method: string | undefined | null
): method is SafeMethod {
  switch (S.lower(method)) {
    case "get":
    case "head":
    case "options":
      return true;
    default:
      return false;
  }
}

export function isIdempotentMethod(
  method: string | undefined | null
): method is IdempotentMethod {
  switch (S.lower(method)) {
    case "get":
    case "head":
    case "options":
    case "put":
    case "delete":
      return true;
    default:
      return false;
  }
}

/**
 * Whether requests sent with the given method include a body.
 */
export function hasBody(method: string | undefined | null): boolean {
  switch (S.lower(method)) {
    case "get":
    case "head":
    case "options":
      return false;
    default:
      return true;
  }
}
