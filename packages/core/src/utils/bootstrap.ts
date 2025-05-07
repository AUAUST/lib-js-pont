import { O, S } from "@auaust/primitive-kit";
import type { PontAppState, PontAppStateInit } from "src/types/app.js";
import { mustRunOnClient } from "./environment.js";

/**
 * An HTML element or a string representing the ID of an HTML element.
 */
export type RootElement = HTMLElement | string;

/**
 * Retrieves the root element for rendering the application.
 *
 * @param root - The root element or its ID.
 * @returns The HTML element corresponding to the provided root.
 */
export function getElement(root: RootElement): HTMLElement {
  mustRunOnClient();

  if (S.is(root)) {
    const element = document.getElementById(root);

    if (!element) {
      throw new Error(`Element with ID "${root}" not found.`);
    }

    return element;
  }

  if (root instanceof HTMLElement) {
    return root;
  }

  throw new Error(
    "Invalid root element. It must be an HTMLElement or a string."
  );
}

/**
 * Retrieves the initial state of the application from the root element.
 */
export function getInitialState(
  initialState: PontAppStateInit,
  element: HTMLElement
): PontAppState {
  mustRunOnClient();

  if (O.is(initialState)) {
    return <any>initialState;
  }

  const dataProps = element.dataset.propsGroups || element.dataset.props;

  if (!dataProps) {
    return <PontAppState>{};
  }

  try {
    return JSON.parse(dataProps);
  } catch (error) {
    console.error("Failed to parse initial state:", error);
    return <PontAppState>{};
  }
}
