import { S } from "@auaust/primitive-kit";
import { Method } from "src/enums/Method.js";

export { Method };

export type MethodString = `${Method}`;

/**
 * Methods that are safe to use without side effects.
 */
export type SafeMethod = Method.GET;

/**
 * Methods that can be safely retried without side effects.
 */
export type IdempotentMethod = Method.GET | Method.PUT | Method.DELETE;

export function toMethod(
  method: string | undefined | null,
  fallback: Method
): Method {
  return isMethod((method = S.lower(method))) ? method : fallback;
}

export function isMethod(method: string | undefined | null): method is Method {
  switch (S.lower(method)) {
    case Method.GET:
    case Method.POST:
    case Method.PUT:
    case Method.DELETE:
    case Method.PATCH:
      return true;
    default:
      return false;
  }
}

export function isSafeMethod(
  method: string | undefined | null
): method is SafeMethod {
  switch (S.lower(method)) {
    case Method.GET:
      return true;
    default:
      return false;
  }
}

export function isIdempotentMethod(
  method: string | undefined | null
): method is IdempotentMethod {
  switch (S.lower(method)) {
    case Method.GET:
    case Method.PUT:
    case Method.DELETE:
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
    case Method.GET:
      return false;
    default:
      return true;
  }
}
