import { O } from "@auaust/primitive-kit";
import {
  ValidResponse,
  type ValidResponseInit,
} from "@core/src/classes/Responses/ValidResponse.js";
import { ExchangeType } from "@core/src/enums/ExchangeType.js";
import type { PropsGroups } from "@core/src/types/app.js";
import type { ErrorBag } from "@core/src/types/errors.js";

export interface NavigationResponseInit extends ValidResponseInit {
  propsGroups?: Partial<Pick<PropsGroups, "global">>;
  errors?: ErrorBag;
}

export abstract class NavigationResponse extends ValidResponse {
  public readonly exchangeType = ExchangeType.NAVIGATION;
  protected readonly propsGroups: Pick<PropsGroups, "global">;
  protected readonly errors?: ErrorBag;

  public constructor(init: NavigationResponseInit) {
    super(init);

    this.propsGroups = { global: O.from(init.propsGroups?.global) };
    this.errors = O.is(init.errors) ? init.errors : undefined;
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
}
