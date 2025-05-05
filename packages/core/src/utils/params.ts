import { A, O, S } from "@auaust/primitive-kit";
import type { RequestParametersInit } from "src/classes/RequestParameters.js";

export function getParamsEntries(params: RequestParametersInit): string[][] {
  if (params instanceof URLSearchParams) {
    return A(params.entries());
  }

  if (A.is(params)) {
    return params;
  }

  if (S.is(params)) {
    return A(new URLSearchParams(params).entries());
  }

  if (O.is(params)) {
    return O.entries(params);
  }

  return [];
}

/**
 * Check if the key should be appended to the URLSearchParams.
 * If checks for the presence of square brackets at the end of the key,
 * which is a common convention for indicating that the key should be treated as an array.
 */
export function shouldAppend(key: string): boolean {
  return /\[\w*\]$/.test(key);
}

/**
 * Merges multiple request parameters into the first one.
 */
export function mergeParams(
  params: URLSearchParams,
  ...inits: (RequestParametersInit | undefined)[]
): URLSearchParams {
  for (const init of inits) {
    if (init === undefined) {
      continue;
    }

    const entries = getParamsEntries(init);

    for (const [key, value] of entries) {
      if (shouldAppend(key)) {
        params.append(key, value);
      } else {
        params.set(key, value);
      }
    }
  }

  return params;
}
