import { A, O, P, S } from "@auaust/primitive-kit";
import type { UrlParamsInit } from "@core/src/classes/UrlParams.js";

/**
 * The result of basic pre-processing of URL parameters.
 * The values might still be arrays or other complex types,
 * and it's up to the params serializer to handle them.
 *
 * Specifically, based on the user input, a single set might
 * include duplicate keys, duplicate bracketed keys,
 * non-bracketed keys holding arrays, etc.
 *
 * It's up to the params serializer service to handle these cases.
 */
export type NormalizedUrlParams = [string, unknown][];

export function normalizeParams(
  ...params: (UrlParamsInit | undefined)[]
): NormalizedUrlParams {
  const normalized: NormalizedUrlParams = [];

  for (const init of params) {
    if (init === undefined) {
      continue;
    }

    normalized.push(...paramsEntries(init));
  }

  return normalized;
}

export function paramsEntries(params: UrlParamsInit): NormalizedUrlParams {
  if (P.isNullish(params)) {
    return [];
  }

  if (S.is(params)) {
    params = new URLSearchParams(params);
  }

  if (params instanceof URLSearchParams) {
    return A(params.entries());
  }

  if (A.is(params)) {
    return params.map(([key, value]) => [key, value]);
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
