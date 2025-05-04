import { S } from "@auaust/primitive-kit";
import type { Method } from "src/types/utils.js";

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

export function toMethod(
  method: string | undefined | null,
  fallback: Method
): Method {
  return isMethod((method = S.lower(method))) ? method : S.lower(fallback);
}
