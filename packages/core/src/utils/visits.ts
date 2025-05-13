import type { EventWithTarget } from "../types/events.js";

export function shouldHijackClick(
  event: EventWithTarget<MouseEvent, HTMLElement>
): boolean {
  if (
    event.defaultPrevented ||
    !event.target ||
    (<HTMLElement>event.target).isContentEditable
  ) {
    return false;
  }

  if (event.currentTarget.tagName === "A") {
    // Clicks with modifiers on <a> elements should be ignored.
    if (event.altKey || event.metaKey || event.shiftKey || event.ctrlKey) {
      return false;
    }

    // Non-left clicks on <a> elements should be ignored.
    if (event.button !== 0) {
      return false;
    }

    const target = (<HTMLAnchorElement>event.currentTarget).target;

    if (target && target !== "_self") {
      // If the <a> element has a target attribute that changes the window location, ignore the click.
      return false;
    }
  }

  return true;
}
