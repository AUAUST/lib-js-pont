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
  protected readonly component: ComponentName;

  public constructor(init: Omit<VisitResponseInit, "type">) {
    super({ ...init, type: ResponseType.VISIT });

    this.component = init.component;
  }

  public getComponent(): ComponentName {
    return this.component;
  }

  public getPageProps(): PropsGroups["page"] | undefined {
    return this.propsGroups.page;
  }
}
