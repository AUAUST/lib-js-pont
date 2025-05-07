import { ResponseType } from "src/enums/ResponseType.js";
import type { PropsGroups } from "src/types/app.js";
import type { ComponentName } from "src/types/utils.js";
import { type BaseResponseInit, Response } from "./Response.js";

export interface FragmentResponseInit extends BaseResponseInit {
  type: ResponseType.FRAGMENT;
  /** The component name this response is intended for. */
  intendedComponent: ComponentName;
  /** The partial page props to update the frontend state. */
  propsGroups: Partial<PropsGroups>;
}

export class FragmentResponse extends Response<ResponseType.FRAGMENT> {
  public constructor({}: Omit<FragmentResponseInit, "type">) {
    super({ type: ResponseType.FRAGMENT });
  }
}
