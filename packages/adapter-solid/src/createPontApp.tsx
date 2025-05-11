import {
  Pont,
  type ComponentName,
  type LayoutName,
  type PontAppState,
  type RootElement,
} from "@auaust/pont";
import { getBaseUrl, getElement, getInitialState } from "@auaust/pont/toolkit";
import type { Component } from "solid-js";
import { App } from "./App.jsx";

export type PontAppOptions = {
  /**
   * The root element to render the application into.
   * If it is a string, it will be used as the ID selector.
   *
   * @default "app"
   */
  root?: RootElement;

  /**
   * The base URL of the application. It is used to resolve relative URLs.
   * By default, it will take the window location's origin.
   */
  baseUrl?: string;

  resolveComponent: (name: ComponentName) => Promise<Component> | Component;
  resolveLayout: (name: LayoutName) => Promise<Component> | Component;

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
  initialState?: PontAppState;

  /**
   * The function that will be called with the initial state of the application.
   * It is responsible for rendering the application.
   */
  setup: (options: SetupOptions) => void;

  /**
   * If a different Pont instance than the singleton should be used, pass it here.
   */
  pont?: Pont;
};

export type SetupOptions = {
  /**
   * The Pont instance in use.
   */
  pont: Pont;
  element: HTMLElement | null;
  App: Component;
};

export async function createPontApp({
  root,
  baseUrl: customBaseUrl,
  resolveComponent,
  resolveLayout,
  transformTitle,
  initialState: customInitialState,
  setup,
  pont: customPont,
}: PontAppOptions) {
  const pont = customPont || Pont.getInstance();

  if (pont.isInitialized()) {
    throw new Error("Pont is already initialized");
  }

  const element = getElement(root);
  const initialState = customInitialState || getInitialState(element);
  const baseUrl = getBaseUrl(customBaseUrl);

  pont.init({
    baseUrl,
    initialState,
  });

  setup({
    pont,
    element,
    App,
  });
}
