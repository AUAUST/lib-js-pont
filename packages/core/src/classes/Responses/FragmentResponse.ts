import type { ComponentName } from "src/types/utils.js";
import { type BaseResponseInit, Response } from "./Response.js";

export interface FragmentResponseInit extends BaseResponseInit {
  type: "fragment";
  /** The component name this response is intended for. */
  intendedComponent: ComponentName;
  /** The partial page props to update the frontend state. */
  props: Record<string, unknown>;
}

export class FragmentResponse extends Response<"fragment"> {
  public constructor({}: Omit<FragmentResponseInit, "type">) {
    super({ type: "fragment" });
  }
}
