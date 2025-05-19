import { O, S } from "@auaust/primitive-kit";
import {
  ValidResponse,
  type ValidResponseInit,
} from "@core/src/classes/Responses/ValidResponse.js";
import { ExchangeMode } from "@core/src/enums/ExchangeType.js";
import type { PropsGroups } from "@core/src/types/app.js";
import type { ErrorBag } from "@core/src/types/errors.js";

export interface NavigationResponseInit extends ValidResponseInit {
  propsGroups?: Partial<Pick<PropsGroups, "global">>;
  errors?: ErrorBag;
  title?: string;
}

export abstract class NavigationResponse extends ValidResponse {
  public readonly mode = ExchangeMode.NAVIGATION;
  protected readonly propsGroups: Pick<PropsGroups, "global">;
  protected readonly errors?: ErrorBag;
  protected readonly title?: string;

  public constructor(init: NavigationResponseInit) {
    super(init);

    this.propsGroups = { global: O.from(init.propsGroups?.global) };
    this.errors = O.is(init.errors) ? init.errors : undefined;
    this.title = S.is(init.title) ? init.title : undefined;
  }

  public getGlobalProps() {
    return this.propsGroups.global;
  }

  public hasErrors(): boolean {
    return this.errors !== undefined && Object.keys(this.errors).length > 0;
  }

  public getErrors(): ErrorBag | undefined {
    return this.errors;
  }

  public getTitle(): string | undefined {
    return this.title;
  }
}
