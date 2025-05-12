import { S } from "@auaust/primitive-kit";
import type { PontAppState } from "@core/src/types/app.js";

/**
 * An HTML element or a string representing the ID of an HTML element.
 */
export type RootElement = HTMLElement | string;

/**
 * Retrieves the root element for rendering the application.
 */
export function getElement(root: RootElement = "app"): HTMLElement | undefined {
  if (root instanceof HTMLElement) {
    return root;
  }

  if (typeof document === "undefined") {
    return undefined;
  }

  if (S.is(root)) {
    const element =
      document.getElementById(root) ??
      document.querySelector(root) ??
      undefined;

    if (element instanceof HTMLElement) {
      return element;
    }
  }
}

/**
 * Retrieves the initial state of the application from the root element.
 */
export function getInitialState(
  element: HTMLElement | undefined
): Partial<PontAppState> {
  if (!element) {
    return {};
  }

  const dataProps = element.dataset.pontState || element.dataset.pont;

  if (!dataProps) {
    return {};
  }

  try {
    return JSON.parse(dataProps);
  } catch (error) {
    console.error("Failed to parse initial state:", error);
    return {};
  }
}
