import type { Pont } from "src/classes/Pont.js";
import type {
  GlobalProps,
  PageProps,
  PontAppStateInit,
  PropsGroups,
} from "src/types/app.js";

export type StateManagerInit = {
  initialState?: PontAppStateInit;
};

/**
 * The state manager holds the state of the app, including the URL, component name, props, and other data.
 */
export class StateManager {
  protected component!: string;
  protected url!: string;
  protected props!: PropsGroups;
  protected title!: string;

  public constructor(public readonly pont: Pont) {}

  public init({ initialState }: StateManagerInit = {}): this {
    this.url = initialState?.url!;
    this.component = initialState?.component!;
    this.props = initialState?.props!;
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
    return this.props.page;
  }

  public getGlobalProps(): GlobalProps {
    return this.props.global;
  }
}
