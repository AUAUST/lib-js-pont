export type EventWithTarget<
  E extends Event = Event,
  C extends Element = HTMLElement
> = Omit<E, "currentTarget"> & {
  currentTarget: C;
};
