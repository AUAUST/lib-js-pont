import { A, B, N, O, P, S } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import {
  shouldAppend,
  type NormalizedRequestParameters,
} from "src/utils/params.js";

/**
 * The params serializer interface provides the methods required to serialize request parameters.
 */
export interface ParamsSerializer {
  /**
   * Serializes the request parameters into a format suitable for sending in a request.
   * The resulting string **MUST NOT** include the leading `?` character.
   */
  serialize(options: NormalizedRequestParameters): URLSearchParams | string;
}

export function createDefaultParamsSerializer(pont: Pont): ParamsSerializer {
  function getValue(
    value: unknown
  ): (undefined | string)[] | string | undefined;
  function getValue(value: unknown, preserveArrays: false): string | undefined;
  function getValue(
    value: unknown,
    preserveArrays: boolean = true
  ): (undefined | string)[] | string | undefined {
    // null, undefined and NaN should be ignored
    if (P.isNullish(value)) {
      return undefined;
    }

    // Strings and numbers are returned as is
    if (S.is(value) || N.is(value)) {
      return S(value);
    }

    // Boolean values are converted to `"true"` or `"false"`
    if (B.is(value)) {
      return B.toString(value);
    }

    // Objects are converted to JSON strings.
    // If arrays are not preserved, they are also converted to JSON strings.
    if (O.is(value, !preserveArrays)) {
      return JSON.stringify(value);
    }

    // Arrays are preserved, but entries are converted.
    if (A.is(value)) {
      return value.map((v) => getValue(v, false));
    }

    // Any other value is stringified.
    return S(value);
  }

  return {
    serialize: (options) => {
      const params = new URLSearchParams();

      for (const [key, value] of options) {
        const serializedValue = getValue(value);

        if (S.is(serializedValue)) {
          // If the key is bracketed, we want to append the value
          // rather than override any existing value.
          if (shouldAppend(key)) {
            params.append(key, serializedValue);
          } else {
            params.set(key, serializedValue);
          }

          continue;
        }

        if (A.is(serializedValue)) {
          const bracketedKey = S.ensureEnd(key, "[]");

          for (const v of serializedValue) {
            if (v === undefined) {
              continue;
            }

            // For arrays, we include all the values under the same key, but bracketed.
            params.append(bracketedKey, v);
          }
        }
      }

      return params;
    },
  };
}
