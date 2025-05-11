import { s, S } from "@auaust/primitive-kit";
import type { PontAppState } from "@core/src/types/app.js";

/**
 * An HTML element or a string representing the ID of an HTML element.
 */
export type RootElement = HTMLElement | string;

/**
 * Retrieves the root element for rendering the application.
 */
export function getElement(root: RootElement = "app"): HTMLElement | null {
  if (root instanceof HTMLElement) {
    return root;
  }

  if (typeof document === "undefined") {
    return null;
  }

  if (S.is(root)) {
    return document.getElementById(root);
  }

  return null;
}

/**
 * Retrieves the initial state of the application from the root element.
 */
export function getInitialState(
  element: HTMLElement | null
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

/**
 * Retrieves the base URL for the application.
 */
export function getBaseUrl(url: string | undefined): string {
  if (S.isStrict(url)) {
    // If the URL does not start with a protocol, prepend the current protocol.
    // This allows users to specify a simple domain name without a protocol,
    // like "example.com", and it will be treated as "http://example.com".
    if (s(url).before("://").includes("http").not().toBoolean()) {
      url = s(url)
        .after("://")
        .or(url)
        .prepend(window.location.protocol, "//")
        .toString();
    }
  }

  return new URL(url || "", window.location.origin).origin;
}
