import type {
  GlobalProps,
  PageProps,
  PontAppStateInit,
  PropsGroups,
} from "src/types/app.js";

export type StateManagerConfig = {
  transformTitle?: (title: string) => string;
};

/**
 * The state manager holds the state of the app, including the URL, component name, props, and other data.
 */
export class StateManager {
  protected component!: string;
  protected url!: string;
  protected props!: PropsGroups;
  protected title!: string;

  public init({ url, component, props, title }: PontAppStateInit) {
    this.url = url;
    this.component = component;
    this.props = props;
    this.title = title;
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
