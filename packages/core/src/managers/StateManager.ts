import { O, S } from "@auaust/primitive-kit";
import {
  Response,
  ValidResponseInstance,
} from "@core/src/classes/Responses/Response.js";
import type { Effects } from "@core/src/index.js";
import { Manager } from "@core/src/managers/Manager.js";
import type {
  GlobalProps,
  LayoutProps,
  PageProps,
  PropsGroups,
  StateInit,
} from "@core/src/types/app.js";
import type { ErrorBag } from "@core/src/types/errors.js";
import type { LayoutName, PageName } from "@core/src/types/utils.js";

export type StateManagerInit = {
  initialState?: StateInit;
};

export type StateUpdateOptions = {
  preserveScroll?: boolean;
  preserveState?: boolean;
  replace?: boolean;
};

/**
 * The state manager holds the state of the app, including the URL, component name, props, and other data.
 */
export class StateManager extends Manager {
  protected page!: PageName;
  protected layout!: LayoutName;
  protected url!: string;
  protected propsGroups!: PropsGroups;
  protected title!: string;

  public init({ initialState }: StateManagerInit = {}): this {
    this.url = initialState?.url!;
    this.page = initialState?.page!;
    this.layout = initialState?.layout!;
    this.propsGroups = O.from(initialState?.propsGroups!);
    this.title = initialState?.title!;

    return this;
  }

  public getUrl(): string {
    return this.url;
  }

  public getTitle(): string {
    return this.title;
  }

  public getPage(): PageName {
    return this.page;
  }

  public getLayout(): LayoutName {
    return this.layout;
  }

  public getPageProps(): PageProps {
    return this.propsGroups.page;
  }

  public getLayoutProps(): LayoutProps {
    return this.propsGroups.layout;
  }

  public getGlobalProps(): GlobalProps {
    return this.propsGroups.global;
  }

  public handleSideEffects(response: ValidResponseInstance): void {
    if (response.isData()) {
      return this.handleEffects(response.getEffects());
    }

    this.applyTitle(response.getTitle());
    this.handleErrors(response.getErrors());
    this.handleEffects(response.getEffects());
  }

  public applyTitle(title: string | undefined): void {
    if (!S.is(title)) {
      return;
    }

    this.title = this.transformTitle(title);
  }

  public handleErrors(errors: ErrorBag | undefined): void {}

  public handleEffects(effects: Effects | undefined): void {
    if (!effects || !effects.length) {
      return;
    }

    console.log("Effects", effects);
  }

  public updateState(response: Response, options: StateUpdateOptions = {}) {
    // switch (response.type) {
    //   case ResponseType.VISIT:
    //     this.handleVisit(response);
    //     break;
    //   case ResponseType.DATA:
    //     this.handleData(response);
    //     break;
    //   case ResponseType.UNHANDLED:
    //     this.handleUnhandled(response);
    //     break;
    // }
    // this.handleTitle(response.getTitle());
    // this.handleErrors(response.getErrors());
    // this.handleEffects(response.getEffects());
  }

  public reconcileProps(
    baseProps: Record<string, unknown>,
    partialProps: Record<string, unknown> | undefined
  ): Record<string, unknown> {
    if (!partialProps) {
      return baseProps;
    }

    return this.pont.use("propsReconciler", baseProps, partialProps);
  }

  public transformTitle(title: string): string {
    return this.pont.use("titleTransformer", title);
  }
}
