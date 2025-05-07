import { ResponseType } from "src/enums/ResponseType.js";
import type { PageProps, PropsGroups } from "src/types/app.js";
import type { ComponentName } from "src/types/utils.js";
import { type BaseResponseInit, Response } from "./Response.js";

export interface FragmentResponseInit extends BaseResponseInit {
  type: ResponseType.FRAGMENT;
  intendedComponent: ComponentName;
  propsGroups: Partial<PropsGroups>;
}

export class FragmentResponse extends Response<ResponseType.FRAGMENT> {
  protected readonly intendedComponent: ComponentName;

  public constructor(init: Omit<FragmentResponseInit, "type">) {
    super({ ...init, type: ResponseType.FRAGMENT });

    this.intendedComponent = init.intendedComponent;
  }

  public getIntendedComponent(): ComponentName {
    return this.intendedComponent;
  }

  public getPageProps(): PageProps | undefined {
    return this.propsGroups.page;
  }
}
