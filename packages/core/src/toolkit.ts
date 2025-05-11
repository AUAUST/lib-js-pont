// The toolkit entry point exposes various utilities that
// do not belong to the core of the library but are useful
// for building adapters or re-use some internal logic.

export {
  getBaseUrl,
  getElement,
  getInitialState,
  type RootElement,
} from "@core/src/utils/bootstrap.js";
export { parseHeaders } from "@core/src/utils/headers.js";
export {
  hasBody,
  isIdempotentMethod,
  isMethod,
  isSafeMethod,
  Method,
  toMethod,
  type IdempotentMethod,
  type MethodString,
} from "@core/src/utils/methods.js";
export {
  normalizeParams,
  paramsEntries,
  shouldAppend,
  type NormalizedUrlParams,
} from "@core/src/utils/params.js";
