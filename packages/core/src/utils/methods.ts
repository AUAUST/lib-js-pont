import { S } from "@auaust/primitive-kit";
import { Method } from "@core/src/enums/Method.js";

export { Method };

export type MethodString = `${Method}`;

export type SafeMethod = Method.GET;

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

/**
 * Safe methods are HTTP methods that do not modify the state of the server.
 */
export function isSafeMethod(
  method: string | undefined | null
): method is SafeMethod {
  return S.lower(method) === Method.GET;
  // switch (S.lower(method)) {
  //   case Method.GET:
  //     return true;
  //   default:
  //     return false;
  // }
}

/**
 * Idempotent methods are HTTP methods that can be called once
 * or several times without different outcomes.
 */
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
  return S.lower(method) !== Method.GET;
  // switch (S.lower(method)) {
  //   case Method.GET:
  //     return false;
  //   default:
  //     return true;
  // }
}
