// The toolkit entry point exposes various utilities that
// do not belong to the core of the library but are useful
// for building adapters or re-use some internal logic.

export {
  getElement,
  getInitialState,
  type RootElement,
} from "./utils/bootstrap.js";
export { parseHeaders } from "./utils/headers.js";
export {
  hasBody,
  isIdempotentMethod,
  isMethod,
  isSafeMethod,
  Method,
  toMethod,
  type IdempotentMethod,
  type MethodString,
} from "./utils/methods.js";
export {
  normalizeParams,
  paramsEntries,
  shouldAppend,
  type NormalizedUrlParams,
} from "./utils/params.js";
