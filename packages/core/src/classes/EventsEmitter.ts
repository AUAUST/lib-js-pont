import { F, S } from "@auaust/primitive-kit";

type EventCallback<Args extends any[] = any[]> = (...args: Args) => void;

/**
 * A map of event names to their listeners.
 */
type EventsMap = {
  [eventName: string]: EventCallback;
};

/**
 * Provides event emitting capabilities to a class.
 * It is designed to handle a single listener for each event.
 */
export class EventsEmitter<
  /**
   * The type of the events emitter.
   */
  This extends EventsEmitter<This, Events, EventName>,
  /**
   * A mapping of the available events to their callback types.
   */
  Events extends EventsMap = EventsMap,
  /**
   * An event name.
   */
  EventName extends keyof Events & string = keyof Events & string
> {
  /**
   * The events map.
   */
  private events: {
    [K in keyof Events]: Events[K] | null;
  };

  /**
   * Initializes the events map, defining the existing events.
   */
  public constructor(eventNames: EventName[]) {
    this.events = {} as Events;

    for (const eventName of eventNames) {
      this.events[S.lower(eventName)] ??= null;
    }
  }

  /**
   * Adds a listener to the specified event.
   */
  public on<E extends EventName>(
    this: This,
    event: E,
    listener: Events[E]
  ): void {
    this.events[this.getEventName(event)] = listener;
  }

  /**
   * Removes a listener from the specified event.
   */
  public off<E extends EventName>(
    this: This,
    event: E,
    listener?: Events[E]
  ): void {
    event = this.getEventName(event);

    if (!this.hasListener(event)) {
      return;
    }

    // If no listener is provided, remove whichever listener is set.
    if (listener === undefined) {
      this.events[event] = null;
      return;
    }

    // If a listener is provided, only remove it if it matches the current one.
    if (this.events[event] === listener) {
      this.events[event] = null;
      return;
    }
  }

  /**
   * Emits the specified event with the provided arguments.
   */
  protected emit<E extends EventName>(
    this: This,
    event: E,
    ...args: Parameters<Events[E]>
  ): void {
    const listener = this.getListener(event);

    if (F.is(listener)) {
      listener.call(this, ...args);
    }
  }

  /**
   * Get the event name, ensuring it exists at the same time.
   */
  protected getEventName<E extends EventName>(this: This, eventName: E): E {
    const lowerEventName = S.lower(eventName);

    if (!this.hasEvent(lowerEventName)) {
      throw new Error(`Event "${eventName}" does not exist.`);
    }

    return lowerEventName as E;
  }

  /**
   * Returns a setter for the event name.
   * This is useful for defining `onMyEvent` methods.
   *
   * @example ```ts
   * public onMyEvent = this.eventSetter("myEvent");
   * ```
   */
  protected eventSetter<E extends EventName>(
    this: This,
    eventName: E
  ): (listener: Events[E]) => void {
    return (listener: Events[E]) => this.on(eventName, listener);
  }

  /**
   * Whether the event exists.
   */
  protected hasEvent(this: This, event: string): event is EventName {
    return S.lower(event) in this.events;
  }

  /**
   * Whether the event has a listener.
   */
  protected hasListener<E extends EventName>(this: This, event: E): boolean {
    return this.getListener(event) !== null;
  }

  /**
   * Get the listeners array for the specified event.
   */
  protected getListener<E extends EventName>(
    this: This,
    event: E
  ): Events[E] | null {
    return this.events[this.getEventName(event)];
  }
}
