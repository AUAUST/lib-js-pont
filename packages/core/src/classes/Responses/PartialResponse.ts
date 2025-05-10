import { ResponseType } from "src/enums/ResponseType.js";
import type { PageProps, PropsGroups } from "src/types/app.js";
import type { ComponentName } from "src/types/utils.js";
import { type BaseResponseInit, Response } from "./Response.js";

export interface PartialResponseInit extends BaseResponseInit {
  type: ResponseType.PARTIAL;
  intendedComponent: ComponentName;
  propsGroups: Partial<PropsGroups>;
}

export class PartialResponse extends Response<ResponseType.PARTIAL> {
  protected readonly intendedComponent: ComponentName;

  public constructor(init: Omit<PartialResponseInit, "type">) {
    super({ ...init, type: ResponseType.PARTIAL });

    this.intendedComponent = init.intendedComponent;
  }

  public getIntendedComponent(): ComponentName {
    return this.intendedComponent;
  }

  public getPageProps(): PageProps | undefined {
    return this.propsGroups.page;
  }
}
