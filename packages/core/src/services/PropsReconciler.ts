import { A, O } from "@auaust/primitive-kit";
import { Service } from "src/classes/Service.js";

/**
 * Merges two sets of props. The first set is the default props,
 * and the second set is a partial set of props to merge with the default props.
 */
export type PropsReconcilerSignature = (
  baseProps: Record<string, unknown>,
  partialProps: Record<string, unknown>
) => Record<string, unknown>;

export class PropsReconcilerService extends Service<"propsReconciler"> {
  public override handle(
    base: Record<string, unknown>,
    partial: Record<string, unknown>
  ) {
    return this.mergeObjects(base, partial);
  }

  mergeObjects(
    base: Record<string, unknown>,
    partial: Record<string, unknown>
  ): Record<string, unknown> {
    const mergedProps = { ...base };

    iteration: for (const [key, value] of O.entries(partial)) {
      if (!(key in mergedProps)) {
        mergedProps[key] = value;
        continue;
      }

      // 99% of the time, the partial will be the result of
      // parsing a JSON string. This means `undefined` values
      // should theoretically never be present. We still
      // use the explicit presence of `undefined` to delete
      // properties from the merged object.
      if (value === undefined) {
        delete mergedProps[key];
        continue;
      }

      if (value === null) {
        mergedProps[key] = null;
        continue;
      }

      switch (typeof value) {
        case "string":
        case "number":
        case "boolean":
        case "undefined":
          mergedProps[key] = value;
          continue iteration;
      }

      if (A.is(value)) {
        mergedProps[key] = this.mergeArrays(mergedProps[key], value);

        continue;
      }
    }

    return mergedProps;
  }

  mergeArrays(base: unknown, partial: unknown[]): unknown {
    return partial;
  }
}
