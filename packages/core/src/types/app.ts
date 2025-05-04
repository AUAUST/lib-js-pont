import type { Effects } from "./effects.js";
import type { Errors } from "./errors.js";
import type { ComponentName, Url } from "./utils.js";

/**
 * The state of the app. It contains all the information needed to
 * render the app, including the URL, the component to render, the title,
 * the props and metadata.
 */
export interface PontAppState {
  /**
   * The current URL of the app.
   */
  url: Url;

  /**
   * The name of the current component.
   */
  component: ComponentName;

  /**
   * The current title of the app, after being transformed by the title transformer.
   */
  title: string;

  /**
   * The props groups.
   */
  props: PropsGroups;

  /**
   * The errors that occurred during form validation, if any.
   * Most of the time, this is empty during the initial load.
   */
  errors: Errors;

  /**
   * Effects to be executed on the client side.
   */
  effects: Effects;
}

/**
 * The initial state of the app as received from the server.
 */
export interface PontAppStateInit {
  url: Url;
  component: ComponentName;
  title: string;
  props: PropsGroups;
  errors: Errors;
  effects: Effects;
}

export type PropsGroups = {
  /**
   * The page props. They are passed to the component
   * and represent the current page state.
   */
  page: PageProps;

  /**
   * The global props. They are global to the app and
   * shared across requests. They are useful for storing
   * data that is not specific to a single page.
   */
  global: GlobalProps;
};

export interface PageProps {}

export interface GlobalProps {}
