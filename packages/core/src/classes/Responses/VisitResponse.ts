import { ResponseType } from "src/enums/ResponseType.js";
import type { PropsGroups } from "src/types/app.js";
import type { LayoutName, PageName } from "src/types/utils.js";
import { Response } from "./Response.js";

export interface VisitResponseInit {
  type: ResponseType.VISIT;
  page: PageName;
  layout: LayoutName | undefined;
  url: string;
  propsGroups: Partial<PropsGroups>;
}

export class VisitResponse extends Response<ResponseType.VISIT> {
  protected readonly page: PageName;
  protected readonly layout?: LayoutName;

  public constructor(init: Omit<VisitResponseInit, "type">) {
    super({ ...init, type: ResponseType.VISIT });

    this.page = init.page;
    this.layout = init.layout;
  }

  public getPage(): PageName {
    return this.page;
  }

  public getLayout(): LayoutName | undefined {
    return this.layout;
  }

  public getPageProps(): PropsGroups["page"] | undefined {
    return this.propsGroups.page;
  }

  public getLayoutProps(): PropsGroups["layout"] | undefined {
    return this.propsGroups.layout;
  }
}
