export type EventWithTarget<
  E extends Event = Event,
  T extends HTMLElement = HTMLElement
> = Omit<E, "target" | "currentTarget"> & {
  // While we can't assert that the target is of type `T`,
  // in the context of this function we can however
  // say that it is at least an `HTMLElement`
  // (vs. the default `EventTarget` which is annoyingly broad)
  target: HTMLElement;
  currentTarget: T;
};
