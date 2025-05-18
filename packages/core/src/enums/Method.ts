import { enumValidator } from "@core/src/enums/index.js";

/**
 * Known HTTP methods.
 */
export enum Method {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
  PATCH = "patch",
}

export const isMethod = enumValidator(Method);
