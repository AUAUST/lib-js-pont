import { A, B, N, O, P, S } from "@auaust/primitive-kit";
import type { Pont } from "src/classes/Pont.js";
import { Service } from "src/classes/Service.js";
import { shouldAppend, type NormalizedUrlParams } from "src/utils/params.js";
import type { ServiceObject } from "./index.js";

export interface ParamsSerializer extends ServiceObject {
  /**
   * Serializes the request parameters into a format suitable for sending in a request.
   * The resulting string **MUST NOT** include the leading `?` character.
   */
  handle(pont: Pont, options: NormalizedUrlParams): URLSearchParams | string;
}

export class ParamsSerializerService extends Service<"paramsSerializer"> {
  public override handle(options: NormalizedUrlParams) {
    const params = new URLSearchParams();

    for (const [key, value] of options) {
      const serializedValue = this.valueKeepArrays(value);

      if (S.is(serializedValue)) {
        // If the key is bracketed, we want to append the value
        // rather than override any existing value.
        if (this.shouldAppend(key)) {
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
  }

  protected valueKeepArrays(
    value: unknown
  ): (string | undefined)[] | string | undefined {
    if (A.is(value)) {
      return value.map((v) => this.value(v));
    }

    return this.value(value);
  }

  protected value(value: unknown): string | undefined {
    // null, undefined and NaN should be ignored
    if (P.isNullish(value)) {
      return undefined;
    }

    // Strings and numbers are returned as is, stringified,
    // except for empty strings, which are ignored.
    if (S.is(value) || N.is(value)) {
      return S(value) || undefined;
    }

    // Booleans are returned as `"true"` or `"false"`.
    if (B.is(value)) {
      return B.toString(value);
    }

    // Objects are converted to JSON strings.
    // Arrays are also converted to JSON strings.
    if (O.is(value, true)) {
      return JSON.stringify(value);
    }

    // Any other value is stringified.
    return S(value);
  }

  protected shouldAppend(key: string): boolean {
    return shouldAppend(key);
  }
}
