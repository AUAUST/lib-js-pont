import { O } from "@auaust/primitive-kit";
import { Response } from "@core/src/classes/Responses/Response.js";
import { Manager } from "@core/src/managers/Manager.js";
import type {
  GlobalProps,
  LayoutProps,
  PageProps,
  PropsGroups,
  StateInit,
} from "@core/src/types/app.js";
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

  public applySideEffects(response: Response): void {
    const title = response.getTitle();

    if (title) {
      this.applyTitle(title);
    }

    const errors = response.getErrors();

    if (errors) {
      this.applyErrors(errors);
    }

    const effects = response.getEffects();

    if (effects) {
      this.applyEffects(effects);
    }
  }

  public applyTitle(title: string): void {}

  public applyErrors(errors: unknown): void {}

  public applyEffects(effects: unknown): void {}

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
