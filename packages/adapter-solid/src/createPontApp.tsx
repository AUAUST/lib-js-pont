import {
  getElement,
  getInitialState,
  getTitleTransformer,
  type ComponentName,
  type PontAppStateInitializer,
  type RootElement,
} from "@auaust/pont";
import type { Component } from "solid-js";

export type SetupOptions = {
  /**
   * The global app component to render at the root.
   * Allows to wrap the app with global providers.
   */
  App: Component;

  /**
   * The root element to render the application into.
   */
  element: HTMLElement;

  /**
   * The props to pass to the App component.
   */
  props: Record<string, unknown>;
};

export type PontAppOptions = {
  /**
   * The root element to render the application into.
   * If it is a string, it will be used as the ID selector.
   *
   * @default "app"
   */
  root?: RootElement;

  /**
   * A function that must return a Component by name.
   */
  resolveComponent: (name: ComponentName) => Promise<Component> | Component;

  /**
   * A callback that can format the title received from the server.
   *
   * @default (title) => title
   */
  transformTitle?: (title: string) => string;

  /**
   * The initial state of the application. Usually, it should not be used.
   * It is useful if the server doesn't set the initial state as
   * the `data-props` attribute of the root element.
   */
  initialState?: PontAppStateInitializer;

  /**
   * The function that will be called with the initial state of the application.
   * It is responsible for rendering the application.
   */
  setup: (options: SetupOptions) => void;
};

export async function createPontApp({
  root = "app",
  resolveComponent,
  transformTitle,
  initialState,
  setup,
}: PontAppOptions) {
  const element = getElement(root);
  const state = getInitialState(initialState, element);

  transformTitle = getTitleTransformer(transformTitle);

  const App = await resolveComponent(state.component);

  setup({
    App,
    element,
    props: state.props,
  });
}
