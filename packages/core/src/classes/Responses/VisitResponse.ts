import type { PropsGroups } from "src/types/app.js";
import type { ComponentName } from "src/types/utils.js";
import { Response } from "./Response.js";

export interface VisitResponseInit {
  type: "visit";
  /** The component name to render. */
  component: ComponentName;
  /** The new URL that the browser should display. */
  url: string;
  /** The page props to pass to the component. */
  propsGroups: Partial<PropsGroups>;
}

export class VisitResponse extends Response<"visit"> {
  public constructor({}: Omit<VisitResponseInit, "type">) {
    super({ type: "visit" });
  }
}
