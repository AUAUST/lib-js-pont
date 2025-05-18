import { O } from "@auaust/primitive-kit";
import {
  ValidResponse,
  type ValidResponseInit,
} from "@core/src/classes/Responses/ValidResponse.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";
import type { PageProps, PropsGroups } from "@core/src/types/app.js";
import type { PageName } from "@core/src/types/utils.js";

export interface PartialResponseInit extends ValidResponseInit {
  type?: ResponseType.PARTIAL;
  intendedPage: PageName;
  propsGroups: Partial<PropsGroups>;
}

export class PartialResponse extends ValidResponse {
  public readonly type: ResponseType.PARTIAL;
  protected readonly intendedPage: PageName;
  protected declare readonly propsGroups: PropsGroups;

  public constructor(init: PartialResponseInit) {
    super(init);

    this.type = ResponseType.PARTIAL;
    this.intendedPage = init.intendedPage;
    this.propsGroups.layout = O.from(init.propsGroups?.layout);
    this.propsGroups.page = O.from(init.propsGroups?.page);
  }

  public getType() {
    return this.type;
  }

  public getIntendedPage(): PageName {
    return this.intendedPage;
  }

  public getPageProps(): PageProps | undefined {
    return this.propsGroups.page;
  }
}
