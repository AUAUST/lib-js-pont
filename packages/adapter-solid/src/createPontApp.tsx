import {
  Pont,
  type LayoutName,
  type PageName,
  type RootElement,
  type StateInit,
} from "@auaust/pont";
import type { ServicesInit } from "@auaust/pont/services";
import { getElement, getInitialState } from "@auaust/pont/toolkit";
import { F } from "@auaust/primitive-kit";
import type { Component, JSX } from "solid-js";
import { App, type PontAppProps } from "./App.jsx";
import { resolveComponents } from "./utils/resolveComponent.js";

export type ComponentModule<C = Component> = {
  default: C;
};

export type ComponentResolver<N extends string, C = Component> = (
  name: N
) => Promise<C> | C | Promise<ComponentModule<C>> | ComponentModule<C>;

export type PontAppOptions = {
  /**
   * The root element to render the application into.
   * If it is a string, it will be used as the ID selector.
   *
   * @default "app"
   */
  element?: RootElement;

  /**
   * The base URL of the application. It is used to resolve relative URLs.
   * By default, it will take the window location's origin.
   */
  baseUrl?: string;

  resolvePage: ComponentResolver<PageName>;
  resolveLayout?: ComponentResolver<LayoutName>;

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
  initialState?: StateInit;

  /**
   * The function that will be called with the initial state of the application.
   * It is responsible for rendering the application.
   */
  setup: (options: SetupOptions) => void;

  /**
   *
   */
  pont?: Pont;

  /**
   * Services allow to extend or modify the behavior of the application.
   * For example, you can use it to add a custom request interceptor,
   */
  services?: ServicesInit;
};

export type SetupOptions = {
  element: HTMLElement | undefined;
  App: (props: PontAppProps) => JSX.Element;
  props: PontAppProps;
};

export async function createPontApp({
  element,
  baseUrl,
  resolvePage,
  resolveLayout,
  transformTitle,
  initialState,
  setup,
  pont,
  services = {},
}: PontAppOptions) {
  pont ??= Pont.getInstance();
  element = getElement(element);

  if (!pont.isInitialized()) {
    initialState ??= getInitialState(element);

    if (F.is(transformTitle)) {
      services.titleTransformer ??= () => transformTitle;
    }

    pont.init({
      baseUrl,
      initialState,
      services,
    });
  }

  resolveComponents({
    initialPage: {
      resolver: resolvePage,
      name: pont.getPage(),
    },
    initialLayout: {
      resolver: resolveLayout,
      name: pont.getLayout(),
      lenient: true,
    },
  }).then(({ initialPage, initialLayout }) => {
    setup({
      element,
      App,
      props: {
        pont,
        resolvePage,
        resolveLayout,
        initialPage,
        initialLayout,
      },
    });
  });
}
