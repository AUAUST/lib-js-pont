import type { PropsGroups } from "src/types/app.js";
import type { ComponentName } from "src/types/utils.js";
import { type BaseResponseInit, Response } from "./Response.js";

export interface FragmentResponseInit extends BaseResponseInit {
  type: "fragment";
  /** The component name this response is intended for. */
  intendedComponent: ComponentName;
  /** The partial page props to update the frontend state. */
  propsGroups: Partial<PropsGroups>;
}

export class FragmentResponse extends Response<"fragment"> {
  public constructor({}: Omit<FragmentResponseInit, "type">) {
    super({ type: "fragment" });
  }
}
