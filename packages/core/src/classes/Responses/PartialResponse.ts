import {
  type BaseResponseInit,
  Response,
} from "@core/src/classes/Responses/Response.js";
import { ResponseType } from "@core/src/enums/ResponseType.js";
import type { PageProps, PropsGroups } from "@core/src/types/app.js";
import type { PageName } from "@core/src/types/utils.js";

export interface PartialResponseInit extends BaseResponseInit {
  type: ResponseType.PARTIAL;
  intendedPage: PageName;
  propsGroups: Partial<PropsGroups>;
}

export class PartialResponse extends Response<ResponseType.PARTIAL> {
  protected readonly intendedPage: PageName;

  public constructor(init: Omit<PartialResponseInit, "type">) {
    super({ ...init, type: ResponseType.PARTIAL });

    this.intendedPage = init.intendedPage;
  }

  public getIntendedPage(): PageName {
    return this.intendedPage;
  }

  public getPageProps(): PageProps | undefined {
    return this.propsGroups.page;
  }
}
