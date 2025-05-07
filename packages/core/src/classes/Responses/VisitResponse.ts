import { ResponseType } from "src/enums/ResponseType.js";
import type { PropsGroups } from "src/types/app.js";
import type { ComponentName } from "src/types/utils.js";
import { Response } from "./Response.js";

export interface VisitResponseInit {
  type: ResponseType.VISIT;
  /** The component name to render. */
  component: ComponentName;
  /** The new URL that the browser should display. */
  url: string;
  /** The page props to pass to the component. */
  propsGroups: Partial<PropsGroups>;
}

export class VisitResponse extends Response<ResponseType.VISIT> {
  public constructor({}: Omit<VisitResponseInit, "type">) {
    super({ type: ResponseType.VISIT });
  }
}
