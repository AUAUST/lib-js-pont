import type { Pont } from "src/classes/Pont.js";
import {
  Response,
  StateChangingResponseType,
} from "src/classes/Responses/Response.js";
import { ResponseType } from "src/enums/ResponseType.js";
import type {
  GlobalProps,
  PageProps,
  PropsGroups,
  StateInit,
} from "src/types/app.js";

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
export class StateManager {
  protected component!: string;
  protected url!: string;
  protected propsGroups!: PropsGroups;
  protected title!: string;

  public constructor(public readonly pont: Pont) {}

  public init({ initialState }: StateManagerInit = {}): this {
    this.url = initialState?.url!;
    this.component = initialState?.component!;
    this.propsGroups = initialState?.propsGroups!;
    this.title = initialState?.title!;

    return this;
  }

  public getComponent(): string {
    return this.component;
  }

  public getUrl(): string {
    return this.url;
  }

  public getPageProps(): PageProps {
    return this.propsGroups.page;
  }

  public getGlobalProps(): GlobalProps {
    return this.propsGroups.global;
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

  /**
   * From the response, returns the new state of the app.
   */
  protected getNewStateFromResponse(
    response: StateChangingResponseType
  ):
    | { url: string; component: string; pageProps: PageProps | undefined }
    | undefined {
    if (response.type === ResponseType.VISIT) {
      return {
        url: response.getUrl(),
        component: response.getComponent(),
        pageProps: response.getPageProps(),
      };
    }

    if (response.type === ResponseType.FRAGMENT) {
      if (response.getIntendedComponent() !== this.component) {
        throw new Error(
          "The intended component does not match the current component. The fragment response cannot be applied."
        );
      }

      return {
        url: response.getUrl(),
        component: this.component,
        pageProps: this.reconcileProps(
          this.getPageProps(),
          response.getPageProps()
        ),
      };
    }
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
}
