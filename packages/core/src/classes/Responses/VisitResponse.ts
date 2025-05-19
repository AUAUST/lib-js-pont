import { O } from "@auaust/primitive-kit";
import {
  NavigationResponse,
  type NavigationResponseInit,
} from "@core/src/classes/Responses/NavigationResponse.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";
import type { PropsGroups } from "@core/src/types/app.js";
import type { LayoutName, PageName } from "@core/src/types/utils.js";

export interface VisitResponseInit extends NavigationResponseInit {
  type?: ResponseType.VISIT;
  page: PageName;
  layout: LayoutName | undefined;
  propsGroups: Partial<PropsGroups>;
}

export class VisitResponse extends NavigationResponse {
  public readonly type = ResponseType.VISIT;
  protected readonly page: PageName;
  protected readonly layout?: LayoutName;
  protected declare readonly propsGroups: PropsGroups;

  public constructor(init: VisitResponseInit) {
    super(init);

    this.page = init.page;
    this.layout = init.layout;
    this.propsGroups.layout = O.from(init.propsGroups?.layout);
    this.propsGroups.page = O.from(init.propsGroups?.page);
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
