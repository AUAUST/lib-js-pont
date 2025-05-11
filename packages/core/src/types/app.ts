import type { Effects } from "@core/src/types/effects.js";
import type { Errors } from "@core/src/types/errors.js";
import type { LayoutName, PageName } from "@core/src/types/utils.js";

/**
 * The state of the app. It contains all the information needed to
 * render the app, including the URL, the component to render, the title,
 * the props and metadata.
 */
export interface PontAppState {
  /**
   * The current URL of the app.
   */
  url: string;

  /**
   * The name of the current page.
   */
  page: PageName;

  /**
   * The name of the current layout.
   */
  layout: LayoutName;

  /**
   * The current title of the app, after being transformed by the title transformer.
   */
  title: string;

  /**
   * The props groups.
   */
  propsGroups: PropsGroups;

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
export type StateInit = Partial<PontAppState>;

export type PropsGroups = {
  /**
   * The page props. They are passed to the page component.
   */
  page: PageProps;

  /**
   * The layout props. They are passed to the layout component.
   */
  layout: LayoutProps;

  /**
   * The global props. They are global to the app and
   * shared across requests. They are useful for storing
   * data that is not specific to a single page.
   */
  global: GlobalProps;
};

export interface PageProps {
  [key: string]: unknown;
}

export interface LayoutProps {
  [key: string]: unknown;
}

export interface GlobalProps {
  [key: string]: unknown;
}
