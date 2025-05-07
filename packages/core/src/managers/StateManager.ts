import type { Pont } from "src/classes/Pont.js";
import type {
  GlobalProps,
  PageProps,
  PropsGroups,
  StateInit,
} from "src/types/app.js";

export type StateManagerInit = {
  initialState?: StateInit;
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
}
