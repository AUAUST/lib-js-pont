import { S } from "@auaust/primitive-kit";

export type SafeMethod = "get" | "head" | "options";

export type IdempotentMethod = "get" | "head" | "options" | "put" | "delete";

export type Method =
  | "get"
  | "head"
  | "options"
  | "put"
  | "delete"
  | "post"
  | "patch";

export type RequestMethod = "get" | "post" | "put" | "delete" | "patch";

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

export function supportsData(method: string | undefined | null): boolean {
  switch (S.lower(method)) {
    case "get":
    case "head":
    case "options":
      return false;
    default:
      return true;
  }
}
